// ==UserScript==
// @name         google search link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @require     https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.5.1/jquery.min.js
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_notification
// @grant GM_registerMenuCommand
// @grant GM_getValue
// @grant GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/459744/google%20search%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/459744/google%20search%20link.meta.js
// ==/UserScript==

(function() {
    'use strict';
console.log(233)
    GM_registerMenuCommand("获取link", function () {
        var urlList = [];
        $('#search  .g  .yuRUbf a').each(function(item){
            var href = $(this).attr("href");
            console.log("test:"+href);

            if(!/cache|trans/.test(href)&&/^https/.test(href)){
                console.log("fetch:"+href);
                GM_xmlhttpRequest({
                    url: "http://joyk:9203/Event/AddMsg?event_id=3&keywords=" + href+"&uuid="+href,
                    headers: {
                    },
                    timeout: 5000,
                    method: "GET",
                    onload: function (resp) {
                        console.log(resp);
                    },
                    onerror:function(err){
                        console.log(err);
                    }
                });
            }
        });
    });
    // Your code here...
})();