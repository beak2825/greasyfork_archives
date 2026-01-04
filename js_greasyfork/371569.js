// ==UserScript==
// @name         绅士仓库自动换成直板
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  直板打手冲还是方便啊
// @author       兰屿绿蠵龟
// @match        https://www.wnacg.org/photos-index-*
// @match        https://wnacg.org/photos-index-*
// @match        https://www.wnacg.com/photos-index-*
// @match        https://wnacg.com/photos-index-*
// @match        https://www.wnacg.fun/photos-index-*
// @match        https://wnacg.fun/photos-index-*
// @match        https://www.wnacg.wtf/photos-index-*
// @match        https://wnacg.wtf/photos-index-*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371569/%E7%BB%85%E5%A3%AB%E4%BB%93%E5%BA%93%E8%87%AA%E5%8A%A8%E6%8D%A2%E6%88%90%E7%9B%B4%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/371569/%E7%BB%85%E5%A3%AB%E4%BB%93%E5%BA%93%E8%87%AA%E5%8A%A8%E6%8D%A2%E6%88%90%E7%9B%B4%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    var test = window.location.href
	    var a = /aid-.+\.html/;
    var a1= test.match(a);
window.location.replace("photos-slide-"+a1);
})();