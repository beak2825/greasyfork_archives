// ==UserScript==
// @name         docker-portainer-ext
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description docker-portainer-ext扩展
// @author       You
// @match        http://zzz.fondme.cn:9000/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fondme.cn
// @require https://code.jquery.com/jquery-2.1.4.min.js
// @grant        GM_*
// @license      Apache License 2.0
// @downloadURL https://update.greasyfork.org/scripts/447647/docker-portainer-ext.user.js
// @updateURL https://update.greasyfork.org/scripts/447647/docker-portainer-ext.meta.js
// ==/UserScript==
(function () {
    'use strict';
    $(function () {

        let $arr = $("a");
        console.info($arr)


        for (let i = 0; i < $arr.length; i++) {
            let $a = $($arr[i]);
            let href = $a.attr("href");

            if (!href || href.indexOf("0.0.0.0") === -1) {
                continue
            }

            try {
                let url = new URL(href);
                if (url.hostname === '0.0.0.0') {
                    url.hostname = location.hostname;
                }
                $a.attr("href", url.href)
            } catch (e) {
                console.error(e)
            }

        }
    });
})();