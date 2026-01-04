// ==UserScript==
// @name         Warbirds Stock Broker
// @namespace    heasleys.warbirdsstockbroker
// @version      0.1
// @description  Compare last stock tick (from api) with current data on page. Requires API Key
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/stockexchange.php
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/403434/Warbirds%20Stock%20Broker.user.js
// @updateURL https://update.greasyfork.org/scripts/403434/Warbirds%20Stock%20Broker.meta.js
// ==/UserScript==
var APIKEY = localStorage.getItem('wb_apikey') || '';
var stockData = {};

GM_addStyle(`
.d .stock-main-wrap .tabs-wrap .info-stock-wrap .properties .property {
width: 125px;
}
div.wb_container {
margin-top: 10px;
display: flex;
flex-direction: column;
}
div.wb_head {
border-bottom: none;
border-radius: 5px 5px 5px 5px;
box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 3px;
padding: 6px 10px;
background-color: rgb(202, 185, 0);
background-image: linear-gradient(90deg, transparent 50%, rgba(0, 0, 0, 0.07) 0px);
background-size: 4px;
cursor: pointer;
}
div.wb_head.expanded {
border-bottom: none;
border-radius: 5px 5px 0px 0px;
}
span.wb_title {
color: #ffffff;
font-size: 13px;
letter-spacing: 1px;
text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
font-weight: 700;
line-height: 16px;
}
.wb_content {
background-color: #F2F2F2;
border: 1px solid rgba(0, 0, 0, .5);
border-radius: 0px 0px 5px 5px;
border-top: none;
}
.wb_row {
display: flex;
margin: 0.75em;
justify-content: space-between;
}
.wb_col {
margin-left: 20px;
margin-right: 20px;
}
.wb_col > p {
font-weight: bold;
font-size: 16px;
border-bottom: 1px solid #363636;
margin-bottom: 3px;
padding-bottom: 2px;
}
.wb_col input {
vertical-align: middle;
}
.wb_button {
text-shadow: rgba(0, 0, 0, 0.65) 1px 1px 2px;
cursor: pointer;
font-weight: 400;
text-transform: none;
position: relative;
text-align: center;
line-height: 1.2;
color: rgb(255, 255, 255);
margin-left: 0.5em;
-webkit-appearance: none;
font-size: 14px;
background-color: rgba(255, 255, 255, 0.15);
box-shadow: rgba(255, 255, 255, 0.5) 0px 1px 1px 0px inset, rgba(0, 0, 0, 0.25) 0px 1px 1px 1px;
padding: 2px 10px;
border-radius: 4px;
border-width: initial;
border-style: none;
border-color: initial;
border-image: initial;
text-decoration: none;
}
.float-right {
float: right;
}
span.wb_icon {
align-items: center;
justify-content: center;
width: 16px;
float: right;
}
span.wb_icon svg {
display: block;
height: 16px;
fill: white;
cursor: pointer;
margin-left: auto;
margin-right: auto;
}
.wb_input {
width: 118px;
height: 23px;
border-radius: 5px;
border: 1px solid rgba(0, 0, 0, .5);
padding: 0 4px 0 10px;
}
.wb_input.wb_input_group {
border-radius: 5px 0px 0px 5px !important;
width: 84px;
}
.wb_input_button {
height: 25px;
border-radius: 5px;
background-color: #f2f2f2;
border: 1px solid rgba(0, 0, 0, .5);
}
.wb_input_button:hover {
background-color: #fafafa;
}
.wb_input_button:active {
background-color: #d9d9d9;
}
.wb_input_button.wb_input_group {
border-radius: 0px 5px 5px 0px;
vertical-align: middle;
margin-left: -5px;
}
`);

(function() {
    'use strict';

    var observer = new MutationObserver(function(mutations) {

        if (document.contains(document.querySelector('.stock-main-wrap'))) {
            observer.disconnect();
            insertHeader();
            $('#wb_apikey_input').val(APIKEY);
            getAPI();
        }

    });

    observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});

    $( document ).ajaxComplete(function(event, jqXHR, ajaxObj) {

        if (ajaxObj.url && ajaxObj.url.includes('stockexchange.php?ajax=true&key=')) {
            $('div.tabs-wrap > div.info-stock-wrap').each(function() {
                //check if stock info tab has already been modified
                if ($(this).find('#wb_prev_shares').length){return}

                let id = $(this).attr("id");
                let acro = id.replace('info-stock-','').toUpperCase();

                if (!stockData[acro]){return}

                let properties_wrap = $(this).find('ul.column.properties');

                let forecast_tab = properties_wrap.find('li:contains("Forecast:")');
                let demand_tab = properties_wrap.find('li:contains("Demand:")');
                let price_tab = properties_wrap.find('li:contains("Current price:")');
                //let cap_tab = properties_wrap.find('li:contains("Market cap:")');
                let shares_tab = properties_wrap.find('li:contains("Total shares:")');

                let curr_forecast = forecast_tab.text().replace('Forecast:','').replace(/\s/g, '');
                let curr_demand = demand_tab.text().replace('Demand:','').replace(/\s/g, '');
                let curr_price = parseFloat(price_tab.text().replace(/[^.0-9]/g,''));
                //let curr_cap = cap_tab.text().replace('Market cap:','').replace(/\s/g, '');
                let curr_shares = parseInt(shares_tab.text().replace(/\D+/g,''));

                let prev_forecast = stockData[acro].forecast;
                let prev_demand = stockData[acro].demand;
                let prev_price = stockData[acro].current_price;
                //let prev_cap = stockData[acro].market_cap;
                let prev_shares = stockData[acro].total_shares;

                let forecast_color = "#6d6d6d";
                let demand_color = "#6d6d6d";
                let shares_color = "#6d6d6d";

                if (curr_forecast != prev_forecast) {
                    animateElement(forecast_tab);
                    forecast_color = '#d83500';
                }

                if (curr_demand != prev_demand) {
                    animateElement(demand_tab);
                    demand_color = '#d83500';
                }


                let diff_shares = (curr_shares - prev_shares);

                switch (Math.sign(diff_shares)) {
                    case 1:
                        //dump
                        shares_color = '#678c00';
                        diff_shares = '+' + diff_shares;
                        animateElement(shares_tab);
                        break;
                    case -1:
                        //buyback
                        shares_color = '#d83500';
                        break;
                    case 0:
                        //no changes
                        break;
                }



                forecast_tab.append('<span style="color: '+forecast_color+';">('+ prev_forecast +')</span>');
                demand_tab.append('<span style="color: '+demand_color+';">('+ prev_demand +')</span>');
                price_tab.append('<span style="color: #6d6d6d;">($'+ prev_price.toLocaleString('en-US') +')</span>');
                //cap_tab.append('<span style="color: red;">('+ prev_cap +')</span>');
                shares_tab.append('<span id="wb_prev_shares" style="color: '+shares_color+';">('+ diff_shares.toLocaleString('en-US') +')</span>');


            });
        }

    });
})();


function getAPI() {
    if (APIKEY != "" && APIKEY.length == 16) {

        var request_url = 'https://api.torn.com/torn/?selections=timestamp,stocks&key='+APIKEY;

        $.ajax({
            url: request_url,
            type: "GET",
            processData: false,
            dataType: 'json',
            success: function(data) {
                if (data.error) {

                } else {

                    Object.keys(data.stocks).forEach(function(key){
                        let acro = data.stocks[key].acronym;
                        stockData[acro] = {
                            'acronym' : acro,
                            'name' : data.stocks[key].name,
                            'total_shares' : data.stocks[key].total_shares,
                            'available_shares' : data.stocks[key].available_shares,
                            'market_cap' : data.stocks[key].market_cap,
                            'current_price' : data.stocks[key].current_price,
                            'demand' : data.stocks[key].demand,
                            'forecast' : data.stocks[key].forecast
                        };

                    });

                }
            }
        });

    }

}

function insertHeader() {
    document.querySelector('.stock-main-wrap').insertAdjacentHTML('beforebegin', `
<div class="wb_container">
<div class="wb_head">
<span class="wb_title">Warbirds Stock Broker</span>
<span class="wb_icon" id="wb_svg_right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 32"><path d="M4 6l-4 4 6 6-6 6 4 4 10-10L4 6z"></path></svg></span><span class="wb_toggle wb_icon" id="wb_svg_down" hidden><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32"><path d="M16 10l-6 6-6-6-4 4 10 10 10-10-4-4z"></path></svg></span></div>
<div class="wb_content" hidden>
<div class="wb_row">
<div class="wb_col">
<div id="api_input">
<input class="wb_input wb_input_group" type="text" id="wb_apikey_input" required minlength="16" maxlength="16">
<button class="wb_input_button wb_input_group" type="button" id="wb_save_apikey">Save</button>
</div>
</div>
</div>
</div>
</div>
<hr class="delimiter-999 m-top10">
`);

    $(".wb_head").click(function() {
        $(this).toggleClass("expanded");
        $(".wb_content").slideToggle("fast");

        if (!$("#wb_svg_right").is(':visible')) {
            $("#wb_svg_right").attr("hidden",false);
            $("#wb_svg_down").attr("hidden",true);
        } else {
            $("#wb_svg_right").attr("hidden",true);
            $("#wb_svg_down").attr("hidden",false);
        }
    });

    $(".wb_hide").click(function() {
        let target = $(this).data('target');
        $(target).slideToggle("fast");
    });

    $('#wb_save_apikey').click(function() {
        APIKEY = $('#wb_apikey_input').val();
        localStorage.setItem('wb_apikey', APIKEY);
        getAPI();
    });




}