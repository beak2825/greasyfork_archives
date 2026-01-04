// ==UserScript==
// @name         ChatGPT Monitor
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Monitor whether the answer is complete, if not, automatically send a continue command.
// @author       CyberSexy
// @match        https://chat.openai.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459062/ChatGPT%20Monitor.user.js
// @updateURL https://update.greasyfork.org/scripts/459062/ChatGPT%20Monitor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('loadMonitor', function() {
        const element = document.querySelector('.text-2xl');
        console.log("MyScript1: " + element);
        // 这个地方用来判断是否正在返回数据，利用text-2xl的这个类。这个类只在获取数据时候出现。
        if (!element) {
            // Get the last element with class name "markdown"
            var latest = document.getElementsByClassName('markdown')[document.getElementsByClassName('markdown').length - 1];

            // Store the latest element's content in a variable
            var dataZ = latest.innerHTML;
            //console.log("MyScriptFull: " + dataZ);
            // Remove <p> tags from the content
            dataZ = dataZ.replace(/<\/?p>/g, '');
            // Check if the content ends with ".", ";" or "。"or"</pre>"
            // 你根据情况判断是否还要加，例如有的时候是问号。
            var endsWithPunctuation = /[.;！!。]$/.test(dataZ) || dataZ.endsWith("</pre>");

            console.log("MyScript2: " + endsWithPunctuation);

            //Extract the last 20 characters
            var last20 = dataZ.substr(dataZ.length - 20, 20);
            console.log("MyScript3: " + last20);

            if (!endsWithPunctuation) {
                var input=document.querySelector('textarea');
                input.value="继续";
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.form.dispatchEvent(new Event("submit", { bubbles: true }));
            };
        }
    }
                           )

    setInterval(function() {
        window.dispatchEvent(new Event('loadMonitor'));
    }, 5000);

})();