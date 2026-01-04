// ==UserScript==
// @name         COPILOT: read more
// @namespace    https://github.com/KenKaneki73985
// @version      1.0
// @license      MIT
// @description  Moves the input field a little lower to have more space to read
// @author       Ken Kaneki 
// @match        https://www.bing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506464/COPILOT%3A%20read%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/506464/COPILOT%3A%20read%20more.meta.js
// ==/UserScript==
// user_script = "moz-extension://762e4395-b145-4620-8dd9-31bf09e052de/options.html#nav=81053eed-9980-4dca-b796-9f60fa737bcb+editor"

(() => {
    'use strict';
    window.addEventListener('load', hide_elements);

    function hide_elements() {

        let new_topic_btn = document.querySelector('cib-serp').shadowRoot.querySelector('cib-action-bar').shadowRoot.querySelector('.button-compose').querySelector('.button-compose-content')
        new_topic_btn.style.background = "black"

        let input_btn = document.querySelector('#b_sydConvCont').querySelector('.cib-serp-main').shadowRoot.querySelector('#cib-action-bar-main').shadowRoot.querySelector('.root')
        input_btn.style.bottom = "-55px"

        let scroll_effect = document.querySelector('#b_sydConvCont').querySelector('.cib-serp-main').shadowRoot.querySelector('#cib-conversation-main').shadowRoot.querySelector('.conversation').querySelector('.scroller').querySelector('.scroller-positioner')
        scroll_effect.style.display = "inline"

        let feedback_btn = document.querySelector('#b_sydConvCont').querySelector('.cib-serp-main').shadowRoot.querySelector('cib-serp-feedback')
        feedback_btn.style.display = "none"

        // if (input_btn) {
        //     // input_btn.style.bottom = "-55px"
        //     alert("SUCCESS: found")
        // } else {
        //     alert("ERROR: not found")
        // }
    }

    // Re-hide elements when the DOM changes
    let observer = new MutationObserver(hide_elements);
    observer.observe(document.body, { childList: true, subtree: true });
})();

