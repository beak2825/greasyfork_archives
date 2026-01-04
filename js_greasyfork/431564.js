// ==UserScript==
// @name         Open links in new tab
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Press alt + n to change any links in the current page to open in a new tab when clicked. Press alt + n again to open them in the current tab
// @author       You
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431564/Open%20links%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/431564/Open%20links%20in%20new%20tab.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getLinks(){
        return document.querySelectorAll("[href]")
    }
    function popupInNewTab() {
        let text = document.createElement("span")
        document.body.appendChild(text)
        text.innerHTML="<span style=\"display: block;position: fixed;bottom: 10px;left: 10px;background-color: white;\">Links will open in a new tab</span>"
        setTimeout(function(){ text.remove(); }, 3000)
    }
    function popupInThisTab() {
        let text = document.createElement("span")
        document.body.appendChild(text)
        text.innerHTML="<span style=\"display: block;position: fixed;bottom: 10px;left: 10px;background-color: white;\">Links will open in this tab</span>"
        setTimeout(function(){ text.remove(); }, 3000)
    }
    function setTargetToBlank() {
        let links = getLinks()
        for (let i = 0; i < links.length; i++) {
            links[i].target="_blank"
        }
    }
    function setTargetToDefault() {
        let links = getLinks()
        for (let i = 0; i < links.length; i++) {
            links[i].target=""
        }
    }
    function linksInNewTab(){
        setTargetToBlank()
        popupInNewTab()
        isInNewTab=1
    }
    function linksNotInNewTab(){
        setTargetToDefault()
        popupInThisTab()
        isInNewTab=0
    }
    function onMutate() {
        setTimeout(function(){
            if (isInNewTab == 1) {
            setTargetToBlank()
        } else {
            setTargetToDefault()
        }
                             }, 3000)
    }
    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.altKey == true && evt.keyCode == 78) {
            if (isInNewTab == 0) {
                linksInNewTab();
            } else {
                linksNotInNewTab()
            }
        }
    }
    var isInNewTab = 0
    const options = {
        subtree: true,
        childList: true
    };
    new MutationObserver(onMutate).observe(document.body,options);
    document.addEventListener('keydown', onKeydown, true);
})();