// ==UserScript==
// @name         Github Releases Download
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  替换github下载链接,高速下载
// @author       mwy
// @match        *://github.com/*/*/releases/
// @icon         https://github.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407382/Github%20Releases%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/407382/Github%20Releases%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var list = document.getElementsByTagName("a");
    var reg = new RegExp("/releases/download/");
    var head = "https://curl.oeo.workers.dev/";
    for(var i=0; i<list.length; i++){
        if(list[i] != null && list[i].href != null && reg.test(list[i].href)){
            list[i].href = head + list[i].href;
            console.log(list[i].href);
        }
    }
})();