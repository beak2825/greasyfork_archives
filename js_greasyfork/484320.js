// ==UserScript==
// @name         ChatGPT for website FAQ testing
// @namespace    https://greasyfork.org/users/1245400
// @version      2024-01-22
// @description  chatgpt button for website to generate testing!
// @author       Terry Cai
// @match        *://docs.w3cub.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @license      GPL License
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484320/ChatGPT%20for%20website%20FAQ%20testing.user.js
// @updateURL https://update.greasyfork.org/scripts/484320/ChatGPT%20for%20website%20FAQ%20testing.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tracker_id = btoa(location.origin)
    function chatag(){_chatData.push(arguments);}
    var url = "https://unpkg.com/ai-prompt-testing/lib/chatgpt.umd.js?id=" + tracker_id;
    (function() {
        var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
        ga.src = url;
        var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
    })();
    window._chatData = window._chatData || [];
    chatag('js', new Date());
    chatag('config', tracker_id);
})();