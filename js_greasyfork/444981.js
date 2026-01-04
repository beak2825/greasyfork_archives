// ==UserScript==
// @name                Farmatodo Enhancer
// @namespace           https://github.com/squall831/Farmatodo-Enhancer
// @version             0.1.3
// @description:en      Adds prices in USD to Farmatodo and a dark theme.
// @description:es      Añade precios en dólares para Farmatodo y un tema oscuro.
// @icon                https://www.farmatodo.com.ve/assets/icons/favicon-96x96.png
// @match               https://www.farmatodo.com.ve/*
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_xmlhttpRequest
// @grant               GM_addStyle
// @run-at              document-idle
// @require             https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @author              squall831
// @license             GPL
// @description Adds prices in USD to Farmatodo and a dark theme.
// @downloadURL https://update.greasyfork.org/scripts/444981/Farmatodo%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/444981/Farmatodo%20Enhancer.meta.js
// ==/UserScript==

var dolarBCV = GM_getValue('dolarBCV', false);
// Currency conversion last update
var dolarBCV_LU = GM_getValue('dolarBCV_LU', false);
// Older than half a day
var older = new Date().getTime() - (0.5 * 24 * 60 * 60 * 1000);

if(!dolarBCV || !dolarBCV_LU || older > dolarBCV_LU){
    console.log('%c[Farmatodo Enhancer] Actualizando tasa de cambio ', 'background: #222; color: #ffffff;');
    GM_xmlhttpRequest({
        method: "GET",
        //url: "https://s3.amazonaws.com/dolartoday/data.json",
        url: "http://www.bcv.org.ve/estadisticas/tipo-cambio-de-referencia-smc",
        synchronous: true,
        onload: function(response) {
            //var USDinit = response.responseText.search("sicad2")+9
            //var USDend = response.responseText.search("sicad2")+13
            //var USD = response.responseText.substring(USDinit, USDend);
            var USDinit = response.responseText.search("USD")+120
            var USDend = response.responseText.search("USD")+126
            var USD = response.responseText.substring(USDinit, USDend);
            USD = USD.replace(/,/g, '.');
            USD = Number(USD);
            if(!isNaN(USD)){
                console.log('%c[Farmatodo Enhancer] Tasa actualizada a: '+USD, 'background: #222; color: #ffffff;');
                GM_setValue('dolarBCV', USD);
                GM_setValue('dolarBCV_LU', new Date().getTime());
            }
        }
    });
}

console.log('%c[Farmatodo Enhancer] Utilizando la tasa actual: '+dolarBCV, 'background: #222; color: #ffffff;');

function updatePrices(recurrent){

    $('.text-price').each(function(){
            var price = $(this).text();
            if (price != undefined && $( this ).find('span').length == 0) {
                var priceInit = price.search("Bs.")+3;
                var base_price = price.slice(priceInit);
                    base_price = base_price.replace(" ", "");
                var price_usd = (parseFloat((base_price) / dolarBCV).toFixed(2));

                var USDtag = document.createElement("span");
                    USDtag.classList.add("text-USDprice");
                    USDtag.innerHTML = "  $" + price_usd;
                $(this).append( USDtag );
            }
        });

    $('.p-blue').each(function(){
            var price = $(this).text();
            if (price != undefined && $( this ).find('p').length == 0) {
                var priceInit = price.search("Bs.")+3;
                var base_price = price.slice(priceInit);
                    base_price = base_price.replace(" ", "");
                var price_usd = (parseFloat((base_price) / dolarBCV).toFixed(2));
                var USDtag = document.createElement("p");
                    USDtag.classList.add("text-USDprice");
                    USDtag.innerHTML = "$" + price_usd;
                $(this).append( USDtag );
            }
        })

        if (window.location.href=='https://www.farmatodo.com.ve/carrito') {
            if (document.getElementsByClassName('lds-roller lds-roller-ftd-blue')[0] == undefined) {
                if (document.querySelector("#app-component-router-outlet > div > div > app-cart > div > article > section > aside > app-billing-summary > section > app-overlay").innerHTML == '\x3C!---->') {
                    document.getElementsByClassName("summary-item sub-total")[0].getElementsByClassName("value")[0].classList.add("text-price");
                    document.getElementsByClassName("summary-item delivery")[0].getElementsByClassName("value")[0].classList.add("text-price");
                    document.getElementsByClassName("summary-item total")[0].getElementsByClassName("value")[0].classList.add("text-price");
                };
            };
        };
    };


//Function addRule to test CSS rules.

// var addRule = (function (style) {
//     var sheet = document.head.appendChild(style).sheet;
//     return function (selector, css) {
//         var propText = typeof css === "string" ? css : Object.keys(css).map(function (p) {
//             return p + ":" + (p === "content" ? "'" + css[p] + "'" : css[p]);
//         }).join(";");
//         sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
//     };
// })(document.createElement("style"));

// Adding CSS rule for USD price.

// addRule(".text-USDprice", {
//     color: "#209d3d",
// });

$('head').append('<link rel="stylesheet" id="baseCSS" type="text/css" href="https://cdn.jsdelivr.net/gh/squall831/Farmatodo-Enhancer/BaseCSS.css">');

function altAddNightMode(recurrent){

    if (document.getElementsByClassName("row copy")[0].childElementCount == 3) {
        var nightMode = document.createElement("div");
                nightMode.classList.add("wrapper-toggle");
        var toggleInd = document.createElement("span");
                toggleInd.classList.add("toggle-indicator");
                toggleInd.innerHTML = "Modo Claro / Oscuro:";
        var toggleDIV = document.createElement("div");
                toggleDIV.classList.add("toggle");
        var input = document.createElement("input");
                input.classList.add("toggle-input");
		input.type = "checkbox";
        var toggleBG = document.createElement("div");
		toggleBG.classList.add("toggle-bg");
        var toggleSW = document.createElement("div");
		toggleSW.classList.add("toggle-switch");
        var toggleSwFig = document.createElement("div");
		toggleSwFig.classList.add("toggle-switch-figure");
        var toggleSwFigAlt = document.createElement("div");
		toggleSwFigAlt.classList.add("toggle-switch-figureAlt");

        nightMode.appendChild(toggleInd);
        nightMode.appendChild(toggleDIV);
        toggleDIV.appendChild(input);
	    toggleDIV.appendChild(toggleBG);
	    toggleDIV.appendChild(toggleSW);
        toggleSW.appendChild(toggleSwFig);
        toggleSW.appendChild(toggleSwFigAlt);

        document.getElementsByClassName("col-3 cont-redes-f")[0].insertAdjacentElement("afterend", nightMode);
        const toggle = document.querySelector('.toggle-input');
        const initialState = localStorage.getItem('toggleState') == 'true';
        toggle.checked = initialState;
        toggle.addEventListener('change', function() {
        localStorage.setItem('toggleState', toggle.checked)});
    };
        darkMode(true);
};

function darkMode(recurrent) {
  const toggle = document.querySelector('.toggle-input');
  if (toggle.checked == true) {

      /////Proceeding with the main page Night Mode./////
      if (document.getElementById("nightCSS") == null) {
          $('head').append('<link rel="stylesheet" id="nightCSS" type="text/css" href="https://cdn.jsdelivr.net/gh/squall831/Farmatodo-Enhancer/NightCSS.css">');
      };
      } else {
          if (document.getElementById("nightCSS") != null) {
              $('#nightCSS').remove();
          };
      };
      if (window.location.href.slice(0,38)=='https://www.farmatodo.com.ve/producto/') {
          if (document.getElementsByClassName('lds-roller lds-roller-ftd-blue')[0] == undefined) {
              if (document.getElementById("nightCSS2") != null) {
              $('head').append('<link rel="stylesheet" id="nightCSS2" type="text/css" href="https://cdn.jsdelivr.net/gh/squall831/Farmatodo-Enhancer/NightCSS.css">');
          };
          };
      };
};

$( document ).ready(function() {

   setInterval(function(){updatePrices(true);},1000);

   setInterval(function(){altAddNightMode(true);},1000);

});
