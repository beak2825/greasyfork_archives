// ==UserScript==
// @name         Translate DMM Date
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       aoiZhime
// @include        *.dmm.co.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371700/Translate%20DMM%20Date.user.js
// @updateURL https://update.greasyfork.org/scripts/371700/Translate%20DMM%20Date.meta.js
// ==/UserScript==

(function() {
    'use strict';
	var i ;
    var reDate = document.getElementsByClassName("rate");
	for(i = 0; i<=reDate.length; i++){
        reDate[i].innerHTML = reDate[i].innerHTML.replace("発売日",'วันวางจำหน่าย');
        reDate[i].innerHTML = reDate[i].innerHTML.replace("配信日",'วันที่จัดส่ง');
	}
})();