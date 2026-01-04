// ==UserScript==
// @name         Allow Arconaitv adblock
// @namespace    http://joeyism.com
// @version      1.0.0
// @description  Remove Arconai anti-adblock popup
// @author       joeyism
// @include      http*://*.arconaitv.*/*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/33077/Allow%20Arconaitv%20adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/33077/Allow%20Arconaitv%20adblock.meta.js
// ==/UserScript==

var canRunAds = false;
(function() {
    'use strict';
    console.log("function");
    function remove(elem){
        elem.parentNode.removeChild(elem);
    }
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    document.onreadystatechange = function(e)
    {
        app.check_adblocker = function(){};
        if (document.readyState === 'complete')
        {
            remove(document.getElementById("videoadv"));
            remove(document.getElementsByClassName("wrapper")[0]);
            remove(document.getElementsByClassName("wrapper")[1]);
            remove(getElementByXpath("/html/body/div[2]/div/div/div[2]"));
            getElementByXpath("/html/body/div[2]/div/div/div").style.width="100%";
            console.log("done arconai anti-adblock");
        }
    };
})();
