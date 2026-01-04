// ==UserScript==
// @name         New Bing Auto Commit
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Retrieve the Query parameters from the URL and automatically query New Bing, facilitating integration with launchers such as Raycast, Alfred, and Utools.
// @author       enrio
// @match        https://www.bing.com/search?q=Bing+AI&showconv=1&FORM=hpcodx&query=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463649/New%20Bing%20Auto%20Commit.user.js
// @updateURL https://update.greasyfork.org/scripts/463649/New%20Bing%20Auto%20Commit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = window.location.href;
    const params = new URLSearchParams(window.location.search);
    const paramValue = params.get('query');
    console.log(paramValue)
    const textarea = document.getElementById('searchbox');
    setTimeout(function(){
        const actions = document.getElementsByClassName('cib-serp-main')[0].shadowRoot.getElementById("cib-action-bar-main");
        const textarea = actions.shadowRoot.getElementById("searchbox");
        actions.shadowRoot.children[0].getElementsByClassName("text-input")[0].setAttribute("data-input",paramValue);
        textarea.value = paramValue
        const event = new Event('input', { bubbles: true});
        textarea.dispatchEvent(event);
        setTimeout(function(){
            const event = new KeyboardEvent('keydown', {'key': 'Enter'});
            textarea.dispatchEvent(event);
        },100)
    }, 800);
})();