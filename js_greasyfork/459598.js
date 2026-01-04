// ==UserScript==
// @name         OriTamper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击锚点之后自动复制链接
// @author       You
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,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
// @grant        none
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.2.1/jquery.min.js
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/459598/OriTamper.user.js
// @updateURL https://update.greasyfork.org/scripts/459598/OriTamper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('focus', function (event) {
        console.log('has focus' + window.location.href);
        fetch('http://127.0.0.1:5000/chrome_url', {
            method: 'POST',
            body: JSON.stringify({ 'url': window.location.href }),
        });
    });


    window.addEventListener("load", (event) => {
        console.log("load:" + window.location.href);
        fetch('http://127.0.0.1:5000/chrome_url', {
                method: 'POST',
                body: JSON.stringify({ 'url': window.location.href }),
        });

        console.log("Fully Loaded");
        var links = document.querySelectorAll("a");
        for (var i = 0; i < links.length; i++) {
            var url = links[i].href;
            if(url.indexOf('#') > -1)
            {
                links[i].addEventListener("click", function(){
                    console.log('hrefValue: '+ this.href);
                    navigator.clipboard.writeText(this.href);
                });
            }
        }
    });

})();


