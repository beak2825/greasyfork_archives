// ==UserScript==
// @name         ZhiHuLink
// @namespace    https://github.com/Cacivy/utils/blob/master/GreasyFork/ZhiHuLink.js
// @version      0.8
// @description  直接访问知乎外链
// @author       Cacivy
// @match        https://*.zhihu.com/*
// @include      https://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/21318/ZhiHuLink.user.js
// @updateURL https://update.greasyfork.org/scripts/21318/ZhiHuLink.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var loading = false;
    redirect();
    setInterval(function() {
        redirect();
    }, 3000);

    function redirect() {
        if (!loading) {
            loading = true;
            var links = document.querySelectorAll("a[href*='//link.zhihu.com']");
            var href;
            var length = links.length;
            for (var i = 0; i < length; i++) {
                href = links[i].getAttribute('href');
                if (href) {
                    links[i].setAttribute('href', unescape(href.split('target=')[1]));
                }
            }
            loading = false;
        }
    }
})();