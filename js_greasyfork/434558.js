// ==UserScript==
// @name         CoinGecko Dynamic MarketCap
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Coingecko Dynamic MarketCap with input
// @author       Phlex
// @match        https://www.coingecko.com/en/coins/*
// @icon         https://www.google.com/s2/favicons?domain=coingecko.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434558/CoinGecko%20Dynamic%20MarketCap.user.js
// @updateURL https://update.greasyfork.org/scripts/434558/CoinGecko%20Dynamic%20MarketCap.meta.js
// ==/UserScript==

(function() {
    'use strict';


    setInterval(function () {
        if (!document.querySelector('.dSupply')){
            addGeckoForm()
        }

        if (document.querySelector('.dSupply') && document.querySelector('.dSupply').value){
            appendCap()

        }else if(document.querySelector('.dSupply') && !document.querySelector('.dSupply').value){
            document.getElementsByClassName("supplyOutput")[0].innerText = "0"
        }

    },1000)





    var cSupplyGecko = parseInt(document.getElementsByClassName("lg:tw-pl-4")[0].firstElementChild.lastElementChild.innerText.replaceAll(',',''))

    function addGeckoForm(){

        let form = document.getElementsByClassName("lg:tw-pl-4")[0]

        let div = document.createElement("div");
        div.className = "tw-flex-grow tw-w-full tw-h-10 tw-py-2.5 tw-border-b tw-border-gray-200 dark:tw-border-opacity-10 tw-pl-0"

        let firstSpan =  document.createElement("span");
        firstSpan.className = "tw-text-gray-500 dark:tw-text-gray-400"
        firstSpan.innerText = "Dynamic Market Cap"


        let secondSpan =  document.createElement("span");
        secondSpan.className = "tw-text-gray-900 dark:tw-text-white tw-float-right tw-font-medium supplyOutput"
        secondSpan.innerText = "0"

        div.appendChild(firstSpan)
        div.appendChild(secondSpan)



        let input = document.createElement("input");
        input.className = "dSupply form-control px-2 search-input";
        input.placeholder = "Price input"
        input.style.cssText = "border: 1px solid black"


        form.appendChild(div)
        form.appendChild(input);

    }

    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function getCurrentInput(){
        return parseFloat(document.getElementsByClassName("dSupply")[0].value)
    }

    function calcGecko(){
        return getCurrentInput()*cSupplyGecko
    }

    function appendCap(){
        document.getElementsByClassName("supplyOutput")[0].innerText = numberWithCommas(parseInt(calcGecko()))
    }

})();