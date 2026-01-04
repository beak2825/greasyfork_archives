// ==UserScript==
// @name         GPT Enhance
// @namespace    http://terminal.pub/
// @version      2024-04-21
// @description  Inject JQuery, default set temporary chat, prevent privacy leak
// @author       You
// @match        https://www.chatgpt.com/*
// @match        https://chatgpt.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @require https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494231/GPT%20Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/494231/GPT%20Enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(()=> {
        var currentPageUrl = window.location.href;

        var current_url = new URL(currentPageUrl);

        var current_params = current_url.searchParams;
        if (!current_params.has('temporary-chat')){
            // Step 1: Get the current URL
            var currentUrl = window.location.href;
            // Step 2: Create a URL object
            var url = new URL(currentUrl);
            // Step 3: Get URL search parameters
            var params = url.searchParams;
            // Step 4: Add a new parameter
            params.set('temporary-chat', 'true');
            // Step 5: Generate the new URL
            var newUrl = url.href;
            console.log(newUrl); // Outputs the new URL with the added parameter
            window.location.href = newUrl
        }

        // fix
        $(`div > svg.text-white`).removeClass('text-white').addClass('text-black');
        $(`form > div > div.flex.w-full.items-center > div`).css('background-color','white');
        $('#prompt-textarea').css('color','black');
    },1000);

})();
