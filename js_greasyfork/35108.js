// ==UserScript==
// @name         Mutik Fixes
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @match        https://www.kongregate.com/games/5thPlanetGames/dawn-of-the-dragons*
// @match        https://dotd-web1.5thplanetgames.com/kong/?DO_NOT_SHARE_THIS_LINK*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35108/Mutik%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/35108/Mutik%20Fixes.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(location.href.startsWith("https://dotd-web1.5thplanetgames.com/kong/?DO_NOT_SHARE_THIS_LINK")){
        window.addEventListener("message", function(evt){
            if(evt.data == "_reloadgame")
                document.getElementsByTagName("object")[0].outerHTML = document.getElementsByTagName("object")[0].outerHTML;
            else if(evt.data == "_reloadchat")
                document.getElementsByTagName("object")[1].outerHTML = document.getElementsByTagName("object")[1].outerHTML;
        }, false);
    }
    else{
        (function run(){
            var link = document.evaluate(".//a[text() = 'Reload Game']",  document, null, XPathResult.ANY_TYPE, null).iterateNext();
            if(!link)
            {
                setTimeout(run, 100);
                return;
            }
            if(!DRMng.isAuto)
                DRMng.Raids.switchAutoJoin();
            DRMng.Raids.filter = DRMng.Raids.filter + '@' + 'belistor_the_echo_raider_4';
            var clone = link.parentNode.cloneNode(true);
            var cloneLink = clone.childNodes[0];
            cloneLink.innerText = "Fix Autojoin";
            cloneLink.onclick = function(){
                DRMng.Raids.isJoining=false;
            };
            link.parentNode.appendChild(clone);
            link.onclick = function(){
                document.getElementById("gameiframe").contentWindow.postMessage("_reloadgame", "*");
            };
            document.evaluate(".//a[text() = 'Reload Chat']",  document, null, XPathResult.ANY_TYPE, null).iterateNext().onclick = function(){
                document.getElementById("gameiframe").contentWindow.postMessage("_reloadchat", "*");
            };
        })();
    }
})();