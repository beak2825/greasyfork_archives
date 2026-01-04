// ==UserScript==
// @name        Adblocker - linkneverdie.net
// @namespace   Violentmonkey Scripts
// @match       https://linkneverdie.net/*
// @grant       none
// @version     2.0
// @author      mrBump
// @description 27/07/2023, 3:23:08 PM
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/471821/Adblocker%20-%20linkneverdienet.user.js
// @updateURL https://update.greasyfork.org/scripts/471821/Adblocker%20-%20linkneverdienet.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function leet()
    {
        console.log("Running");

        let collection = document.getElementsByTagName("script");

        for (var i = 0; i < collection.length; i)
        {
            if (collection[i].innerText.includes("quang-cao"))
            {
                console.log(collection[i]);
                collection[i].remove();
            }
            else
            {
                ++i;
            }
        }
    }

    function removeAdsElements()
    {
        let adsElements = document.getElementsByClassName("quangcao");
        for(let i in adsElements)
        {
            try
            {
              adsElements[i].remove();
            }
            catch (error)
            {
              console.log(error);
            }
        }
    }

    leet();
    removeAdsElements();
})();