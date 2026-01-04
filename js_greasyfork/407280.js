// ==UserScript==
// @name         Stock Market Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Get Stock info
// @author       Jox [1714547]
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      nukefamily.org
// @downloadURL https://update.greasyfork.org/scripts/407280/Stock%20Market%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/407280/Stock%20Market%20Shortcuts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var stocks = ['BAG','CNC','ELBT','EVL','EWM','FHG','GRN','HRG','IIL','IOU','ISTC','LSC','MCS','MSG','PRN','SLAG','SYM','SYS','TCB','TCC','TCHS','TCM','TCP','TCSE','TCT','TGP','TMI','TSBC','WSSB','WLT','YAZ'];
    var focus = [];
    var alerts = [0,15,30,45];
    var prices = { //Set min and max price for shares, if price is lower them minimim it will be green if it higher them naximum it will be red
        'BAG': {
            min: 0,
            max: 99999
        },
        'CNC': {
            min: 0,
            max: 99999
        },
        'ELBT': {
            min: 0,
            max: 99999
        },
        'EVL': {
            min: 0,
            max: 99999
        },
        'EWM': {
            min: 0,
            max: 99999
        },
        'FHG': {
            min: 0,
            max: 99999
        },
        'GRN': {
            min: 0,
            max: 99999
        },
        'HRG': {
            min: 0,
            max: 99999
        },
        'IIL': {
            min: 0,
            max: 99999
        },
        'IOU': {
            min: 0,
            max: 99999
        },
        'ISTC': {
            min: 0,
            max: 99999
        },
        'LSC': {
            min: 0,
            max: 99999
        },
        'MCS': {
            min: 0,
            max: 99999
        },
        'MSG': {
            min: 0,
            max: 99999
        },
        'PRN': {
            min: 0,
            max: 99999
        },
        'SLAG': {
            min: 0,
            max: 99999
        },
        'SYM': {
            min: 0,
            max: 99999
        },
        'SYS': {
            min: 0,
            max: 99999
        },
        'TCB': {
            min: 0,
            max: 99999
        },
        'TCC': {
            min: 0,
            max: 99999
        },
        'TCHS': {
            min: 0,
            max: 99999
        },
        'TCM': {
            min: 0,
            max: 99999
        },
        'TCP': {
            min: 0,
            max: 99999
        },
        'TCSE': {
            min: 0,
            max: 99999
        },
        'TCT': {
            min: 0,
            max: 99999
        },
        'TGP': {
            min: 0,
            max: 99999
        },
        'TMI': {
            min: 0,
            max: 99999
        },
        'TSBC': {
            min: 0,
            max: 99999
        },
        'WSSB': {
            min: 0,
            max: 99999
        },
        'WLT': {
            min: 0,
            max: 99999
        },
        'YAZ': {
            min: 0,
            max: 99999
        }
    };
    var lastSelected = null;

    GM_addStyle (`

.jox-stock-link-focus{
    color: green !important;
    display: inline !important;
    margin: 5px 10px !important;
    text-decoration: none;
}

.jox-stock-link{
    color: blue !important;
    display: inline !important;
    margin: 5px 10px !important;
    text-decoration: none;
}

.jox-stock-link-prev, .jox-stock-link-next{
    color: black !important;
    display: inline !important;
    margin: 5px 20px !important;
    text-decoration: none;
}

.jox-prev-next-container{
    width: 100%;
    text-align: center;
    margin: 15px;
    font-size: large;

}

.jox-stock-link:hover, .jox-stock-link-focus:hover{
    color: black !important;
}

.jox-stock-link:focus, .jox-stock-link-focus:focus{
    color: red !important;
}

.jox-info-green{
    color: green !important;
}

.jox-info-orange{
    color: orange !important;
}

.jox-info-red{
    color: red !important;
}

.jox-info-blue{
    color: blue !important;
}

#jox-stock-message span{
    padding: 3px !important;
    display: block;
    font-weight: 700;
    font-size: larger;
}

#jox-stock-message{
    margin: 10px !important;
    width: 400px;
    display: inline-block;
}

#jox-stock-change-wrap{
    margin: 10px !important;
    width: 300px;
    display: inline-block;
}

#jox-stock-links{
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}


#jox-stock-change li .time, #jox-stock-change li .amount, #jox-stock-change li .change{
    float: left;
    padding-right: 10px;
    font-size: larger;
    margin: 3px;
}

#jox-stock-change li .time, #jox-stock-change li .change{
    font-weight: bold;
}

.alert {width: 100%; margin: 0 auto; white-space: nowrap; overflow: hidden; box-sizing: border-box; color: black; text-shadow: none; font-size: large; text-align: center;}

.alert span a{display: inline-block; padding-left: 0%; text-indent: 0; animation: ring 4s .7s ease-in-out infinite; color: red !important;}

.alert span a:hover {animation-play-state: paused}

@keyframes ring {
0% { transform: rotate(0); }
1% { transform: rotate(15deg); }
3% { transform: rotate(-14deg); }
5% { transform: rotate(17deg);  color:red;}
7% { transform: rotate(-16deg); }
9% { transform: rotate(15deg); }
11% { transform: rotate(-14deg); }
13% { transform: rotate(13deg); }
15% { transform: rotate(-12deg);}
17% { transform: rotate(11deg); }
19% { transform: rotate(-10deg); }
21% { transform: rotate(9deg); }
23% { transform: rotate(-8deg); }
25% { transform: rotate(7deg); }
27% { transform: rotate(-6deg); }
29% { transform: rotate(5deg); }
31% { transform: rotate(-4deg); }
33% { transform: rotate(3deg); }
35% { transform: rotate(-2deg); }
37% { transform: rotate(1deg); color:#0092d8;}

39% { transform: rotate(0); }
100% { transform: rotate(0); }
}

.worth_0 .logo-stock{
    border-left: 5px solid black !important;
    width: 75px !important;
}

.worth_20 .logo-stock{
    border-left: 5px solid red !important;
    width: 75px !important;
}

.worth_50 .logo-stock{
    border-left: 5px solid yellow !important;
    width: 75px !important;
}

.worth_100 .logo-stock{
    border-left: 5px solid green !important;
    width: 75px !important;
}

.worth_100plus .logo-stock{
    border-left: 5px solid blue !important;
    width: 75px !important;
}



.pulseR {border-radius: 50%; box-shadow: 0 0 0 rgba(227,90,52, 0.4); animation: pulseR 2s infinite;}  @keyframes pulseR { 0% { box-shadow: 0 0 0 0 rgba(227,90,52, 0.8); } 90% { box-shadow: 0 0 0 100px rgba(227,90,52, 0); } 100% { box-shadow: 0 0 0 0 rgba(227,90,52, 0); } }
     `);



    if(window.location.href.startsWith('https://www.torn.com/stockexchange.php')){
        let savedPrices = localStorage.stockPriceList
        if(savedPrices){
            prices = JSON.parse(savedPrices);
        }
        initLinks();
        getFocusShares();
    }

    checkForAlert();

    function checkForAlert(){
        if(alerts.includes(new Date().getMinutes())){
            insertAlert();
        }
        else{
            setTimeout(checkForAlert, 1000);
        }
    }

    function insertAlert(){
        if(!document.querySelector('.alert')){
            //Add only if not already there
            let reference = document.getElementsByClassName('header');
            let div = document.createElement('div');

            let p = document.createElement('p');
            p.classList.add('alert');

            let span = document.createElement('span');
            span.innerHTML = `<a href="https://www.torn.com/stockexchange.php">Check Stocks</a>`;
            span.id = "alert-text";
            span.classList.add('pulseR');

            p.appendChild(span);
            div.appendChild(p);

            reference[0].appendChild(div);
        }
    }

    function getFocusShares(){
        GM_xmlhttpRequest ( {
            method:     'GET',
            url:        'https://www.nukefamily.org/dev/stockdb.php',
            onload:     function (responseDetails) {
                let json = JSON.parse(responseDetails.responseText);
                focus = json.focus;
                let forecasts = json.forecasts;
                initLinks();
                forecasts.forEach(element => {
                    let container = document.querySelector(`li[data-stock="${element.stock.toLowerCase()}"]`);
                    if(container){
                        if(element.forecast.toLowerCase().includes('good')){
                            container.style.backgroundColor = 'rgba(0,100,200,0.3)';
                        }
                        if(element.forecast.toLowerCase().includes('very good')){
                            container.style.backgroundColor = 'rgba(0,100,0,0.3)';
                        }
                        if(element.forecast.toLowerCase().includes('poor')){
                            container.style.backgroundColor = 'rgba(255,0,0,0.3)';
                        }
                        if(element.forecast.toLowerCase().includes('average')){
                            container.style.backgroundColor = null;
                        }


                        //mark based on value
                        let worth = element.for_sale * element.price;

                        if(worth == 0){
                            container.classList.remove('worth_0', 'worth_20', 'worth_50', 'worth_100', 'worth_100plus');
                            container.classList.add('worth_0');
                        }
                        else if(worth <= 20000000000){
                            container.classList.remove('worth_0', 'worth_20', 'worth_50', 'worth_100', 'worth_100plus');
                            container.classList.add('worth_20');
                        }
                        else if(worth <= 50000000000){
                            container.classList.remove('worth_0', 'worth_20', 'worth_50', 'worth_100', 'worth_100plus');
                            container.classList.add('worth_50');
                        }
                        else if(worth <= 100000000000){
                            container.classList.remove('worth_0', 'worth_20', 'worth_50', 'worth_100', 'worth_100plus');
                            container.classList.add('worth_100');
                        }
                        else {
                            container.classList.remove('worth_0', 'worth_20', 'worth_50', 'worth_100', 'worth_100plus');
                            //container.classList.add('worth_100plus');
                        }

                    }
                })
            }
        });
    }

    function initLinks(){
        addLinkContainer();
        stocks.forEach(element => addStockLink(element.toLowerCase()));
        addMessageContainer();
    }

    function addMessageContainer(){
        if(document.getElementById('jox-stock-message')){
            document.getElementById('jox-stock-message').innerHTML = '';
        }
        else {
            let div = document.createElement('div');
            div.id = 'jox-stock-message';
            let divWrap = document.createElement('div');
            divWrap.id = 'jox-stock-change-wrap';
            divWrap.classList.add('stock-main-wrap');
            let divContainer = document.createElement('div');
            divContainer.classList.add('stock-cont');
            let ulChanges = document.createElement('ul');
            ulChanges.classList.add('item-wrap');
            ulChanges.id = 'jox-stock-change';
            divContainer.appendChild(ulChanges);
            divWrap.appendChild(divContainer);
            let stack_wrap = document.querySelector('.stock-main-wrap')
            stack_wrap.parentNode.insertBefore(div, stack_wrap);
            stack_wrap.parentNode.insertBefore(divWrap, stack_wrap);
        }
    }

     function addLinkContainer(){

         let div = document.getElementById('jox-stock-links');

         if(div){
             div.innerHTML = '';
         }
         else {
             div = document.createElement('div');
             div.id = 'jox-stock-links';
             let stack_wrap = document.querySelector('.stock-main-wrap')
             stack_wrap.parentNode.insertBefore(div, stack_wrap);
         }

         let divPrevNextCont = document.createElement('div');
         divPrevNextCont.classList.add('jox-prev-next-container');

         let linkNext = document.createElement('a');
         linkNext.href = '#';
         linkNext.innerHTML = 'Next';
         linkNext.classList.add('jox-stock-link-next');
         linkNext.addEventListener('click', e => {
             e.preventDefault();
             next();
         });

         let linkPrev = document.createElement('a');
         linkPrev.href = '#';
         linkPrev.innerHTML = 'Prev';
         linkPrev.classList.add('jox-stock-link-prev');
         linkPrev.addEventListener('click', e => {
             e.preventDefault();
             prev();
         });

         divPrevNextCont.appendChild(linkPrev);
         divPrevNextCont.appendChild(linkNext);
         div.appendChild(divPrevNextCont);
    }

    function addStockLink(stock){
        let link = document.createElement('a');
        link.href = '#';
        link.dataset.acronym = stock.toLowerCase()
        link.innerHTML = stock.toUpperCase();
        if(focus.includes(stock.toUpperCase())){
            link.classList.add('jox-stock-link-focus');
        }
        else {
            link.classList.add('jox-stock-link');
        }
        link.addEventListener('click', e => {
            e.preventDefault();
            e.target.focus();

            let stockLink = null;

            if(document.querySelectorAll('.stock-list .item .acc-header').length > 0){
                //market
                stockLink = document.querySelector(`li[data-stock="${stock}"] .acc-header`);
            }
            else{
                //portfolio
                stockLink = document.querySelector(`li[data-stock="${stock}"] .logo a`);
            }

            if(stockLink){
                if(stockLink.wasClicked){
                    stockLink.wasClicked = false;
                }
                stockLink.click();
            }
            else{
                document.getElementById('jox-stock-message').innerHTML = `Can't find stock ${stock.toUpperCase()}`;
            }

            lastSelected = stock.toUpperCase();

        });
        document.querySelector('#jox-stock-links').appendChild(link);
    }

    function next(){
        let currentIndex = 0;
        let nextIndex = 0;

        if(lastSelected){
            currentIndex = stocks.indexOf(lastSelected);
            nextIndex = currentIndex == stocks.length - 1 ? 0 : currentIndex + 1;
        }

        let link = document.querySelector(`#jox-stock-links a[data-acronym="${stocks[nextIndex].toLowerCase()}"]`);
        if(link){
            link.click();
        }
    }

    function prev(){
        let currentIndex = 0;
        let nextIndex = 0;

        if(lastSelected){
            currentIndex = stocks.indexOf(lastSelected);
            nextIndex = currentIndex == 0 ? stocks.length - 1 : currentIndex - 1;
        }

        let link = document.querySelector(`#jox-stock-links a[data-acronym="${stocks[nextIndex].toLowerCase()}"]`);
        if(link){
            link.click();
        }
    }

    $(document).ajaxComplete(function(e,xhr,settings){
        let stockRegex = /^.*stockexchange\.php\?ajax=true.*$/;
        let sentData = (settings.data != undefined ? settings.data.split("&") : "");
        let profile = document.querySelector('ul.settings-menu li.link a').href.match(/\d+/g)[0];
        if (stockRegex.test(settings.url)) {
            let response = xhr.responseText;
            //console.log('RESPONSE', response);
            let div = document.createElement('div');
            div.innerHTML = response;
            let items = div.querySelector('.info-stock-wrap ul.properties');
            //console.log("INFO", items);
            if(items.children.length == 8){
                items.children[0].removeChild(items.children[0].children[0]);
                items.children[2].removeChild(items.children[2].children[0]);
                items.children[3].removeChild(items.children[3].children[0]);
                items.children[4].removeChild(items.children[4].children[0]);
                items.children[6].removeChild(items.children[6].children[0]);
                items.children[7].removeChild(items.children[7].children[0]);
                let worth = '$' + numberWithCommas(Math.floor(Number(items.children[7].innerText.split(',').join('').trim()) * Number(items.children[4].innerText.replace('$','').split(',').join('').trim())));

                var postData = {
                    stock: items.children[0].innerText.trim(),
                    total: Number(items.children[6].innerText.split(',').join('').trim()),
                    forsale: Number(items.children[7].innerText.split(',').join('').trim()),
                    price: items.children[4].innerText.trim(),
                    forecast: items.children[2].innerText.trim(),
                    demand: items.children[3].innerText.trim(),
                    worth: worth,
                    timestamp: Math.floor(Date.now() / 1000),
                    profile: profile
                }

                //console.log(JSON.stringify(postData));

                GM_xmlhttpRequest ( {
                    method:     'POST',
                    url:        'https://www.nukefamily.org/dev/stockdb.php',
                    data:       JSON.stringify(postData),
                    onload:     function (responseDetails) {
                        // DO ALL RESPONSE PROCESSING HERE...
                        //console.log(responseDetails, responseDetails.responseText);
                        //alert(responseDetails.responseText);
                    }
                });

                let acronym = items.children[0].innerText.trim();
                let currentPrice = parseFloat(items.children[4].innerText.trim().replace(',','').replace('$',''));
                let priceColor = (prices[acronym] ? (prices[acronym].min > currentPrice ? "jox-info-green" : (prices[acronym].max < currentPrice ? "jox-info-red" : "")) : "");
                let currentForecast = items.children[2].innerText.trim().toLowerCase();
                let forecastColor = (currentForecast.includes('good') ? "jox-info-green" : (currentForecast.includes('poor') ? "jox-info-red" : ""));
                let currentDemand = items.children[3].innerText.trim().toLowerCase();
                let denamdColor = (currentDemand.includes('high') ? "jox-info-green" : (currentDemand.includes('low') ? "jox-info-red" : ""));

                document.getElementById('jox-stock-message').innerHTML = `
<span>${acronym}</span>
<span class="${priceColor}">${items.children[4].innerText.trim()}</span>
<span>Forecast: <i class="${forecastColor}">${items.children[2].innerText.trim()}</i> / Demand: <i class="${denamdColor}">${items.children[3].innerText.trim()}</i></span>
<span>Total shares: <i class="jox-info-blue">${items.children[6].innerText.trim()}</i></span>
<span>Shares for sale: <i class="jox-info-blue">${items.children[7].innerText.trim()}</i></span>
<span>Worth: <i class="jox-info-blue">${worth}</i></span>`;


                let divChange = document.getElementById('jox-stock-change');
                divChange.innerHTML = '';
                let lastChanges = document.querySelector(`li[data-stock="${acronym.toLowerCase()}"]`).querySelector('.stock-changes ul.item-wrap:first-child').querySelectorAll('li:nth-child(-n+5)');
                lastChanges.forEach(e => {
                    divChange.append(e.cloneNode(true));
                })


                let container = document.querySelector(`li[data-stock="${acronym.toLowerCase()}"]`);

                if(currentForecast.includes('good')){
                    container.style.backgroundColor = 'rgba(0,100,200,0.3)';
                }
                if(currentForecast.includes('very good')){
                    container.style.backgroundColor = 'rgba(0,100,0,0.3)';
                }
                if(currentForecast.includes('poor')){
                    container.style.backgroundColor = 'rgba(255,0,0,0.3)';
                }

                worth = worth.replace('$','').replaceAll(',','');
                worth = Number(worth);

                if(worth == 0){
                    container.classList.remove('worth_0', 'worth_20', 'worth_50', 'worth_100', 'worth_100plus');
                    container.classList.add('worth_0');
                }
                else if(worth <= 20000000000){
                    container.classList.remove('worth_0', 'worth_20', 'worth_50', 'worth_100', 'worth_100plus');
                    container.classList.add('worth_20');
                }
                else if(worth <= 50000000000){
                    container.classList.remove('worth_0', 'worth_20', 'worth_50', 'worth_100', 'worth_100plus');
                    container.classList.add('worth_50');
                }
                else if(worth <= 100000000000){
                    container.classList.remove('worth_0', 'worth_20', 'worth_50', 'worth_100', 'worth_100plus');
                    container.classList.add('worth_100');
                }
                else {
                    container.classList.remove('worth_0', 'worth_20', 'worth_50', 'worth_100', 'worth_100plus');
                    //container.classList.add('worth_100plus');
                }
            }
        }
    });

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function insertBefore(newNode, existingNode) {
        existingNode.parentNode.insertBefore(newNode, existingNode);
    }
})();