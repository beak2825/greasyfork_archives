// ==UserScript==
// @name         Fix Torn UI
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Make torn responsive below 100% zoom
// @author       MeRocks[949262]
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410191/Fix%20Torn%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/410191/Fix%20Torn%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log("tg");

  //  var divcontainer = document.getElementsByClassName("content-wrapper");
   // divcontainer[0].style.marginLeft = "14px";
   // divcontainer[0].style.width = "790px";
    var mainContainer = document.getElementById("mainContainer");
    mainContainer.style.width = "990px";
    var divcontainer = document.getElementsByClassName("content-wrapper");
    divcontainer[0].style.width = "794px";

    if (document.location.href.match(/\/stockexchange\.php\?step\=portfolio$/)) {
        console.log("stonks");
        let infocontainer = document.querySelectorAll('li.info');
        for(let i=0; i<infocontainer.length;i++)
        {
            infocontainer[i].style.width = "520px";
        }
    }

    if(document.location.href.match(/\/bazaar\.php\#\/add$/)) {
        console.log("bazaar add");
                                    }

    if(document.location.href.match(/\/imarket\.php$/)) {
        console.log("item market");
       let itemcontainer = document.getElementsByClassName("tab-cont-wrap")

       for(let i=0; i<itemcontainer.length;i++)
        {
console.log("for lopp",i);
            itemcontainer[i].style.width = "630px!important";
        }
       let itemnamecontainer = document.querySelectorAll('li.item-name');
        for(let i=0; i<itemnamecontainer.length;i++)
        {
            itemnamecontainer[i].style.width = "417px";
        }
                                    }

})();