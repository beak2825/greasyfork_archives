// ==UserScript==
// @name         Atcoder Easy Jump
// @namespace    http://tampermonkey.net/
// @version      2024-04-07
// @description  Atcoderから外部のリンクへ素早くジャンプしたい方へ
// @author       KAM1KAZE
// @match        https://atcoder.jp/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491701/Atcoder%20Easy%20Jump.user.js
// @updateURL https://update.greasyfork.org/scripts/491701/Atcoder%20Easy%20Jump.meta.js
// ==/UserScript==

(function() {
    const matches = document.querySelectorAll("a");
    matches.forEach((item) => {
        const st = item.href;
        if(st.includes("jump?url=")){
            item.href = decodeURIComponent(st.substring(st.indexOf("jump?url=")+9, st.lenght));
        }
    });
})();