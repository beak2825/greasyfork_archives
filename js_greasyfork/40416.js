// ==UserScript==
// @name         FurAffinity unwatch
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Unwatch all the user in the current watch page, will open a new tab for each unwatch
// @author       MissNook
// @match        https://www.furaffinity.net/controls/buddylist/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40416/FurAffinity%20unwatch.user.js
// @updateURL https://update.greasyfork.org/scripts/40416/FurAffinity%20unwatch.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var headerTab = document.getElementsByClassName("section-header")[0];
    createButton(headerTab, unwatch);

    function createButton(context, func){
        var button = document.createElement("input");
        button.type = "button";
        button.value = "Unwatch this whole page";
        button.onclick = func;
        button.className = "alt1";
        button.style = "padding:0 10px;margin-left:20px";
        context.appendChild(button);
    }

    function unwatch(context, func){
       var allATag = document.getElementsByTagName("a");

        for(var i=0;i<allATag.length;i++){
            var hrefVal = allATag[i].getAttribute("href");
            if(hrefVal != null && hrefVal.indexOf("unwatch") != -1){
                window.open(hrefVal, '_blank');
            }
        }
    }
    
})();
