// ==UserScript==
// @name         mlog添加控件
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        *st.music.163.com/mlog/mlog.html*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423485/mlog%E6%B7%BB%E5%8A%A0%E6%8E%A7%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/423485/mlog%E6%B7%BB%E5%8A%A0%E6%8E%A7%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function sleep(second) {
                return new Promise((r) => setTimeout(() => r(), second * 1000));
            }
    async function main(){
        await sleep(1);
        document.querySelector('.mlog-mongolian-layer').remove();
        document.querySelector("video").setAttribute('controls', 'controls');
    }
    main();
    // Your code here...
})();