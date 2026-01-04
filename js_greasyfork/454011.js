// ==UserScript==
// @name         タブ名の[Typing Tube]を削除して曲名のみ表示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  タブ名最適化
// @author       You
// @match       https://typing-tube.net/movie/show*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/454011/%E3%82%BF%E3%83%96%E5%90%8D%E3%81%AE%5BTyping%20Tube%5D%E3%82%92%E5%89%8A%E9%99%A4%E3%81%97%E3%81%A6%E6%9B%B2%E5%90%8D%E3%81%AE%E3%81%BF%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/454011/%E3%82%BF%E3%83%96%E5%90%8D%E3%81%AE%5BTyping%20Tube%5D%E3%82%92%E5%89%8A%E9%99%A4%E3%81%97%E3%81%A6%E6%9B%B2%E5%90%8D%E3%81%AE%E3%81%BF%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
	document.getElementsByTagName('title')[0].textContent = document.getElementsByTagName('title')[0].textContent.replace("Typing Tube ","")
    // Your code here...
})();