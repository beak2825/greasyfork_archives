// ==UserScript==
// @name         4. 위메프페이 결제자동클릭
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match       https://wpay-yellow-api.wemakeprice.com/*
// @match       https://wpay-api.wemakeprice.com/wpay/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388284/4%20%EC%9C%84%EB%A9%94%ED%94%84%ED%8E%98%EC%9D%B4%20%EA%B2%B0%EC%A0%9C%EC%9E%90%EB%8F%99%ED%81%B4%EB%A6%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/388284/4%20%EC%9C%84%EB%A9%94%ED%94%84%ED%8E%98%EC%9D%B4%20%EA%B2%B0%EC%A0%9C%EC%9E%90%EB%8F%99%ED%81%B4%EB%A6%AD.meta.js
// ==/UserScript==

(function() {
        var box_btn = document.getElementsByClassName('box_btn');
         var a = box_btn[0].getElementsByTagName('a');
        a[0].click();
})();