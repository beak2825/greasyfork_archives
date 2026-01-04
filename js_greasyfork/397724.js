// ==UserScript==
// @name         NetFunnel 뚫기
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  NetFunnel 뚫어지는진 모르겠지만 암튼 켜두셈
// @author       You
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397724/NetFunnel%20%EB%9A%AB%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/397724/NetFunnel%20%EB%9A%AB%EA%B8%B0.meta.js
// ==/UserScript==
 
if (NetFunnel.TS_BYPASS == false) {
    NetFunnel.TS_BYPASS = true;
    var macro = setInterval(function() {
        if (NetFunnel.TS_BYPASS == false) {
            NetFunnel.TS_BYPASS = true;
        }
    }, 100);
}