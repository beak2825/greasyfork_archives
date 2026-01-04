// ==UserScript==
// @name        sourceforge.net 台灣下載加速
// @description 在 sourceforge.net 直接顯示下載連結並替換鏡像
// @namespace   jfcherng
// @match       https://sourceforge.net/projects/*/files/*
// @version     0.0.3
// @grant       none
// @author      jfcherng
// @license     MIT
// @icon        https://www.google.com/s2/favicons?domain=sourceforge.net
// @supportURL  https://github.com/jfcherng/my-user-js
// @downloadURL https://update.greasyfork.org/scripts/485338/sourceforgenet%20%E5%8F%B0%E7%81%A3%E4%B8%8B%E8%BC%89%E5%8A%A0%E9%80%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/485338/sourceforgenet%20%E5%8F%B0%E7%81%A3%E4%B8%8B%E8%BC%89%E5%8A%A0%E9%80%9F.meta.js
// ==/UserScript==

const mirror_host = 'phoenixnap.dl.sourceforge.net';

// ---------------------------------------------------------------------------

const dl_doms = document.querySelectorAll('a[href$="/download"]');

for (let i = 0; i < dl_doms.length; ++i) {
    let url = dl_doms[i].getAttribute('href');

    url = url.replace(
        /:\/\/sourceforge\.net\/projects\/([^\/]+)\/files\/(.+)\/download/,
        `://${mirror_host}/project/$1/$2`
    );

    dl_doms[i].setAttribute('href', url);
}
