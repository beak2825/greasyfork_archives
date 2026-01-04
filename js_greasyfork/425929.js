// ==UserScript==
// @name         economist unlimited
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  economist unlimited reading
// @author       Peter Liu
// @include      /^https?:\/\/www\.economist.com\/(\w|\d|-|\/)+/
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/425929/economist%20unlimited.user.js
// @updateURL https://update.greasyfork.org/scripts/425929/economist%20unlimited.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let current_url = window.location.href;
    getContent();
    function getContent() {
        GM_xmlhttpRequest({
            method: "GET",
            url: current_url,
            headers: {'referer':'https://www.economist.com/', 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9'},
            onload: function (r) {
                if (r.readyState == 4) {
                    var data = r.responseText
                    var substr = data.match(/\<main((.|\n)*)main\>/g);
                    if (substr != null && substr.length > 0) {
                        $("main").replaceWith(substr[0]);
                    }
                }
            },
            onerror: function (e) {
                console.error(e);
            }
        });
    }
})();