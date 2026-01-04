// ==UserScript==
// @name         Vigilant Merchant
// @namespace    Heasleys.vm
// @version      0.6.1
// @description  Highlight items under watch value, show item price without hover, insta-buy items on item market, category hider
// @author       Heasleys4hemp [1468764]
// @match        https://www.torn.com/imarket.php*
// @grant        GM_addStyle
// @grant        GM.xmlHttpRequest
// @downloadURL https://update.greasyfork.org/scripts/413062/Vigilant%20Merchant.user.js
// @updateURL https://update.greasyfork.org/scripts/413062/Vigilant%20Merchant.meta.js
// ==/UserScript==
var personal_item_list = JSON.parse(localStorage.getItem('wb_personal_item_list')) || {"367": {"name": "Feathery Hotel Coupon", "price_watch": "14000000", type: "Booster"}, "366":{"name": "Erotic DVD", "price_watch": "3000000", type: "Booster"}, "701": {"name": "Eggnog", "price_watch": "1000000", type: "Other"}};
var APIKEY = localStorage.getItem('wb_apikey') || '';
var insta_buy = localStorage.getItem('wb_insta_buy') || 'false';
var speedy_gonzales = localStorage.getItem('wb_speedy_gonzales') || 'false';
var categories_array = [];
var cats = "";
var torn_items_api;

GM_addStyle(`
.wb_container {
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
padding-left: 10px;
}
span.wb_error {
color: #bf532e;
text-shadow: none;
font-weight: 800;
}
span.wb_success {
color: #478807;
text-shadow: none;
font-weight: 800;
}
.wb_content {
background-color: #F2F2F2;
border: 1px solid rgba(0, 0, 0, .5);
border-radius: 0px 0px 5px 5px;
border-top: none;
}
.wb_row {
display: flex;
flex-wrap: wrap;
margin: 0.75em;
justify-content: space-around;
}
.wb_col {
margin: 10px;
max-width: 300px;
flex-grow: 1;
flex-shrink: 1;
}
.wb_col.outer {
flex-basis: 0;
}
.wb_col.center {
width: 300px;
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
.checkboxes span {
vertical-align: middle;
}
.wb_hide {
cursor: pointer;
}
span.wb_icon {
align-items: center;
justify-content: center;
width: 16px;
}
span.wb_icon.right {
float: right;
}
span.wb_icon.left {
float: left;
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
width: 90%;
height: 23px;
border-radius: 5px;
border: 1px solid rgba(0, 0, 0, .5);
padding: 0 4px 0 10px;
}
.wb_input_group {
margin-top: 5px;
}
.wb_input.wb_input_group {
border-radius: 5px 0px 0px 5px !important;
width: 70%;
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
.wb_scroll_box {
    box-sizing: border-box;
    max-height: 194px;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: #f2f2f2;
    border-radius: 0px 0px 5px 5px;
}
}
.wb_list {
    list-style: none;
}
.wb_list li {
    height: 37px;
    padding-top: 0;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #ccc;
}
.wb_list_x {
    padding-left: 10px;
    width: 20px;
    min-width: 20px;
    height: 37px;
    line-height: 36px;
    border-right: 1px solid #ccc;
}
.wb_list_image {
    line-height: 50px;
    border-right: 1px solid #ccc;
}
.wb_list_item {
    min-width: 0;
    flex: 1 1 0;
    border-left: 1px solid #fff;
    padding-top: 5px;
    padding-left: 5px;
    padding-right: 5px;
}



.wb_scroll_box::-webkit-scrollbar {
  width: 10px;
}

.wb_scroll_box::-webkit-scrollbar-track {
  background: #ddd;
  border-radius: 0px 0px 3px 0px;
}

.wb_scroll_box::-webkit-scrollbar-thumb {
    background-color: #f2f2f2;
    border-color: #ddd;
    border-style: solid;
    border-width: 2px;
    border-radius: 8px;
}

::-webkit-scrollbar-thumb:hover {
  background: #fff;
}

.wb_item_box {
flex-direction: column;
padding: 5px;
}

.wb_item {
padding: 5px;
display: flex;
}

.wb_item_desc {
padding-left: 10px;
}

.wb_checkbox_box {
 float: right;
}

.wb_checkbox_box > input {
    position: relative;
    top: 6px;
    cursor: pointer;
}

.wb_checkbox_box > label {
    display: inline-block;
    vertical-align: top;
    margin-top: 7px;
    margin-left: 5px;
    margin-right: 15px;
}


/* Remove Torn Styles */

.d .m-items-list>li {
background: none;
}

.d .m-items-list>li>.title {
background-color: #ffffff00;
}

`);





var observer = new MutationObserver(function(mutations) {
    if (document.contains(document.querySelector('div#item-market-main-wrap'))) {

        if (!document.contains(document.querySelector('div#wb_main_wrap'))) {
            createWBHeader();
            loadItemSearch();
        }
        if (!document.contains(document.querySelector('input#wb_insta_buy'))) {
            createCheckBoxes();
        }

        if (document.contains(document.querySelector('input#wb_insta_buy')) && document.contains(document.querySelector('div#wb_main_wrap'))) {
            observer.disconnect();
        }
    }
});

observer.observe(document, {attributes: false, childList: true, characterData: false, subtree:true});


$( document ).ajaxComplete(function( event, request, settings ) {
    if (settings.url.search("imarket.php") != "-1") {

        try {
            var torn_market_items = JSON.parse(request.responseText);
            console.log(torn_market_items);

            $.when( $.each(torn_market_items, function(i,e) {
                $.each(personal_item_list, function(index, element) {
                    if (e.itemID == index) {
                        if (Number(e.price) <= Number(element.price_watch)) {
                            $('ul.m-items-list > li[data-item="'+e.itemID+'"]').css("background-color", "#bdffa4").removeClass("first t-first m-first");
                        }
                    }
                })
            }));

        }
        catch (e) {

        }


        //move price into item image for easy view of price without having to hover
        $("ul.m-items-list > li").each(function(){
            var li = $(this);
            var minprice = li.find("span.minprice").text();
            li.find(".item-amount.qty").text(minprice);
        });

        //insta buy items from item market (skip confirmation) if enabled
        if (insta_buy == "true") {
            $('li.buy > a.buy-link.t-blue').each(function(){
                let id = $(this).data("id");
                let price = $(this).data("price");
                $(this).parent().html("<a class='yes-buy t-blue h bold' href='#' data-action='buyItemConfirm' data-id='" + id + "' data-item='0' data-price='" + price + "'><span class='buy-icon'></span></a>");
            });
        }


        if (speedy_gonzales == "true" && categories_array.length > 0) { //initial load of category hider
            $("ul.market-tabs > li").not(cats).each(function(){
                $(this).prop("hidden", true);
            });
        }

    }
});

function refreshItemList() {
    $.each(personal_item_list, function(n,e) {
        let type = torn_items_api.items[n].type;
        let name = torn_items_api.items[n].name;
        if (type) {
            personal_item_list[n]["type"] = type;
        }
        if (name) {
            personal_item_list[n]["name"] = name;
        }
    });

    localStorage.setItem("wb_personal_item_list", JSON.stringify(personal_item_list));
}

function loadItemList() {
    console.log(personal_item_list);
    cats = "";
    var temp_categories = [];
    $("#watch_list").empty();

    $('#list_qty').text("("+Object.keys(personal_item_list).length+")");

    $.each(personal_item_list, function(n,e) {
        $("#watch_list").append(`<li>
    <div class="wb_list_x"><a class="remove-link" data-id="`+n+`"> <i class="delete-subscribed-icon"></i> </a></div>
    <div class="wb_list_image"><img src="https://www.torn.com/images/items/`+n+`/small.png"></div>
    <div class="wb_list_item"><div><span>`+e.name+`</span></div><span><b>$`+new Intl.NumberFormat('en').format(e.price_watch)+`</b></span></div>
</li>`);

        temp_categories.push(e.type);
    });

    categories_array = Array.from(new Set(temp_categories)); //get unique categories

    categories_array.forEach(function(category, index) { //get jquery hide text variable (cats)
        if (index == (categories_array.length - 1)) {
            cats += "[data-type='"+category+"']";
        } else {
            cats += "[data-type='"+category+"'], ";
        }
    });

    $('div.wb_list_x > a.remove-link').click(function() {
        let id = $(this).data("id");
        delete personal_item_list[id];
        localStorage.setItem("wb_personal_item_list", JSON.stringify(personal_item_list));
        loadItemList();
    });
}

function loadItemSearch() {

    var request_url = 'https://api.torn.com/torn/?selections=items&key='+APIKEY;

    $.ajax({
        url: request_url,
        type: "GET",
        processData: false,
        dataType: 'json',
        success: function(data) {
            if (data.error) {
                console.log(" - API error code " + data.error.code + " - " + data.error.error);
                $(".wb_error").text(" - API error code " + data.error.code + " - " + data.error.error);
                $(".wb_error").prop('hidden', false);
            } else {
                torn_items_api = data;
                $(".wb_error").prop('hidden', true);

                let list = '';

                $.each(data.items, function(n,e) {
                    list += '<option value="'+n+'" data-name="'+e.name+'" data-type="'+e.type+'" data-marketvalue="'+e.market_value+'">'+e.name+'</option>';
                });

                $("#torn_items").empty();
                $("#torn_items").append(list);
                $(".wb_success").fadeToggle(100).delay(3000).fadeToggle(1000);
            }

        }
    });

}

function createCheckBoxes() {
    $('div#top-page-links-list').append(`<div class="wb_checkbox_box"><input id="wb_insta_buy" type="checkbox"><label for="wb_insta_buy">Insta Buy</label></div><div class="wb_checkbox_box"><input id="wb_speedy_gonzales" type="checkbox"><label for="wb_speedy_gonzales">Speedy Gonzales</label></div>`);

    if (insta_buy == "true") {
        $('#wb_insta_buy').prop( "checked", true );
    }

    if (speedy_gonzales == "true") {
        $('#wb_speedy_gonzales').prop( "checked", true );
    }

    $('#wb_insta_buy').change(function() {
        if(this.checked) {
            insta_buy = "true";
            localStorage.setItem('wb_insta_buy', "true");
        } else {
            insta_buy = "false";
            localStorage.setItem('wb_insta_buy', "false");
        }
    });

    $('#wb_speedy_gonzales').change(function() {
        if(this.checked) {
            speedy_gonzales = "true";
            localStorage.setItem('wb_speedy_gonzales', "true");
            $("ul.market-tabs > li").not(cats).each(function(){
                $(this).prop("hidden", true);
            });
        } else {
            speedy_gonzales = "false";
            localStorage.setItem('wb_speedy_gonzales', "false");
            $("ul.market-tabs > li").each(function(){
                $(this).prop("hidden", false);
            });
        }
    });
}

function createWBHeader() {

    $('div#item-market-main-wrap').after(`
<hr class="delimiter-999 m-top10 m-bottom10">
<div class="wb_container" id="wb_main_wrap">
<div class="wb_head"><span class="wb_title">Market List</span><span class="wb_error" hidden></span><span class="wb_success" hidden> - Items loaded</span><span class="wb_toggle wb_icon right" id="wb_svg_right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 32"><path d="M4 6l-4 4 6 6-6 6 4 4 10-10L4 6z"></path></svg></span><span class="wb_toggle wb_icon right" id="wb_svg_down" hidden><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32"><path d="M16 10l-6 6-6-6-4 4 10 10 10-10-4-4z"></path></svg></span></div>
<div class="wb_content" hidden>
<div class="wb_row">

<div class="wb_col outer">
<p>Item Search</p>
<input class="wb_input" list="torn_items" id="torn_items_input">
<datalist id="torn_items">
</datalist>
<div class="wb_item_box" hidden>
</div>
</div>

<div class="wb_col center">
<p>Watch List</p>


<div class="wb_container">
<div class="wb_head">
<span class="wb_title">Item List <span class="qty" id="list_qty">(`+Object.keys(personal_item_list).length+`)</span><span class="wb_icon left" id="wb_refresh"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M9 13.5c-2.49 0-4.5-2.01-4.5-4.5S6.51 4.5 9 4.5c1.24 0 2.36.52 3.17 1.33L10 8h5V3l-1.76 1.76C12.15 3.68 10.66 3 9 3 5.69 3 3.01 5.69 3.01 9S5.69 15 9 15c2.97 0 5.43-2.16 5.9-5h-1.52c-.46 2-2.24 3.5-4.38 3.5z"/></svg></span><span class="wb_toggle wb_icon right" id="wb_svg_right"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 32"><path d="M4 6l-4 4 6 6-6 6 4 4 10-10L4 6z"></path></svg></span><span class="wb_toggle wb_icon right" id="wb_svg_down" hidden><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 32"><path d="M16 10l-6 6-6-6-4 4 10 10 10-10-4-4z"></path></svg></span>
</div>
<div class="wb_content" hidden>
<div class="wb_scroll_box">

<ul class="wb_list" id="watch_list">




</ul>
</div>
</div>
</div>


</div>

<div class="wb_col outer">
<p class="wb_hide" data-target="#api_input">API Key ▼</p>
<div id="api_input" hidden>
<input class="wb_input wb_input_group" type="text" id="wb_apikey_input" required minlength="16" maxlength="16">
<button class="wb_input_button wb_input_group" type="button" id="wb_save_apikey">Save</button>
</div>

</div>
</div>
</div>
</div>
<hr class="delimiter-999 m-top10">
`);

    if (personal_item_list != '') {
        loadItemList();
    }

    $("#wb_refresh").click(function(e) {
       e.stopPropagation();
       refreshItemList();
       loadItemList();
    });


    $(".wb_hide").click(function() {
        let target = $(this).data('target');
        $(target).slideToggle("slow");
    });

    $(".wb_head").click(function() {
        $(this).toggleClass("expanded");
        $(this).next(".wb_content").slideToggle("slow");

        if (!$(this).find("#wb_svg_right").is(':visible')) {
            $(this).find("#wb_svg_right").attr("hidden",false);
            $(this).find("#wb_svg_down").attr("hidden",true);
        } else {
            $(this).find("#wb_svg_right").attr("hidden",true);
            $(this).find("#wb_svg_down").attr("hidden",false);
        }
    });

    $('#torn_items_input').change(function(){
        var opt = $('#torn_items').find('option[value="'+$(this).val()+'"]');
        let id = $(this).val();
        let name = opt.data("name");
        let type = opt.data("type");
        let market_value = opt.data("marketvalue");
        if (id != "" && opt.length != "0") {
            $('.wb_item_box').attr("hidden", false);

            $('.wb_item_box').html(`
<div class="wb_item">
<img src="https://www.torn.com/images/items/`+id+`/large.png" width="100" height="50" class="torn-item item-plate item-converted">
<span class="wb_item_desc">`+name+`</br>Market Value: <b>$`+new Intl.NumberFormat('en').format(market_value)+`</b></span>
</div>
<div>
<label for="wb_add_item_input">Highlight Price:</label>
<input class="wb_input wb_input_group" type="number" id="wb_add_item_input" required data-id="`+id+`" data-name="`+name+`" data-type="`+type+`">
<button class="wb_input_button wb_input_group" type="button" id="wb_add_item_button">Add</button>
</div>
`);

            $('#wb_add_item_button').click(function() {
                let id = $('#wb_add_item_input').data("id");
                let name = $('#wb_add_item_input').data("name");
                let value = Number($('#wb_add_item_input').val());
                let type = $('#wb_add_item_input').data("type");

                if(typeof value == 'number' && id && name && type){

                    personal_item_list[id] = {
                        "name": name,
                        "price_watch": value,
                        "type": type
                    }

                    localStorage.setItem("wb_personal_item_list", JSON.stringify(personal_item_list));


                    loadItemList();

                } else {

                    //error

                }

            });

        } else {
            $('.wb_item_box').attr("hidden", true);
            $('.wb_item_box').empty();
        }
    });

    $('#wb_save_apikey').click(function() {
        $(".wb_error").prop('hidden', true);
        APIKEY = $('#wb_apikey_input').val();
        localStorage.setItem('wb_apikey', APIKEY);
        loadItemSearch();
    });


    $('input').focus(function() {
        $(this).select();
    });

    $('input').click(function() {
        $(this).select();
    });

    $('#wb_apikey_input').val(APIKEY);
}