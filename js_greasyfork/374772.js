// ==UserScript==
// @name         반전매력 나무라이브
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  나무라이브의 '반전'
// @author       StarBiologist
// @match        https://namu.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374772/%EB%B0%98%EC%A0%84%EB%A7%A4%EB%A0%A5%20%EB%82%98%EB%AC%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/374772/%EB%B0%98%EC%A0%84%EB%A7%A4%EB%A0%A5%20%EB%82%98%EB%AC%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var div = document.getElementsByClassName('body')[0];
    div.style.filter = 'invert(100%)';

})();