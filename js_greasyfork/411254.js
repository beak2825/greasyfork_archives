// ==UserScript==
// @name        Hash转magnet
// @namespace    https://greasyfork.org/zh-CN/users/9955-lzx
// @version      0.1
// @description   Hash转magnet，便于某些下载工具使用
// @author       lzx
// @match        https://torrentz2.is/*
// @grant        everyone
// @downloadURL https://update.greasyfork.org/scripts/411254/Hash%E8%BD%ACmagnet.user.js
// @updateURL https://update.greasyfork.org/scripts/411254/Hash%E8%BD%ACmagnet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var Temphash=document.getElementsByClassName("trackers")[0].innerHTML;
    document.getElementsByClassName("trackers")[0].innerHTML=Temphash.replace("info_hash: ","magnet:?xt=urn:btih:");
})();