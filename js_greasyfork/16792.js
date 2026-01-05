// ==UserScript==
// @name         마우스 운용 제한 해제
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      *
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/16792/%EB%A7%88%EC%9A%B0%EC%8A%A4%20%EC%9A%B4%EC%9A%A9%20%EC%A0%9C%ED%95%9C%20%ED%95%B4%EC%A0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/16792/%EB%A7%88%EC%9A%B0%EC%8A%A4%20%EC%9A%B4%EC%9A%A9%20%EC%A0%9C%ED%95%9C%20%ED%95%B4%EC%A0%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';
    cancelLimit = function(){
        document.body.oncontextmenu = '';
        document.body.ondragstart = '';
        document.body.onselectstart = '';
        
        document.oncontextmenu = '';
        document.ondragstart = '';
        document.onselectstart = '';
        document.body.style.MozUserSelect = '';
	};
	
    document.addEventListener('DOMNodeInserted', cancelLimit);
	document.addEventListener('DOMContentLoaded', cancelLimit);
})();