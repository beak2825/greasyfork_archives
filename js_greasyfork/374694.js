// ==UserScript==
// @name         bangumi http to https
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  bangumi http 跳转到 https, bgm.tv 跳转到 bangumi.tv
// @author       鈴宮華緋
// @include      /https?:\/\/(bgm\.tv|bangumi\.tv|chii\.in)/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374694/bangumi%20http%20to%20https.user.js
// @updateURL https://update.greasyfork.org/scripts/374694/bangumi%20http%20to%20https.meta.js
// ==/UserScript==

(function() {
    if (window.location.href.match(/(http:\/\/(bgm\.tv|bangumi\.tv|chii\.in))|(https:\/\/(bgm\.tv|chii\.in))/)) {
        let oldurl = window.location.href;
        let url = oldurl.replace(/^http:/,"https:");
        url = url.replace(/(bgm\.|chii\.)/,"bangumi.");
        url = url.replace(/\.in/,".com");
        console.log(url);
        window.location.href = url;
    }
})();