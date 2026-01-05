// ==UserScript==
// @name         点击激活url
// @namespace   https://greasyfork.org/zh-CN/users/15432-kirikiri
// @version      1.3
// @description  点击链接激活
// @author       kirikiri
// @include     http*://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26176/%E7%82%B9%E5%87%BB%E6%BF%80%E6%B4%BBurl.user.js
// @updateURL https://update.greasyfork.org/scripts/26176/%E7%82%B9%E5%87%BB%E6%BF%80%E6%B4%BBurl.meta.js
// ==/UserScript==

//(function() {
//'use strict';
document.onclick = function(e) {
    var link = /((https?:\/\/)(\.|\w|-|#|\?|=|\/|\+|@|%|&|:|;|!|\*|(?![\u4e00-\u9fa5\s*\n\r'"]))+)/g;
    if (!e.target.innerHTML.match(/<a/) && e.target.innerText.match(link) && e.path.length > 4) {
        e.target.innerHTML = e.target.innerHTML.replace(link ,'<a target="_blank" href="$1" style="text-decoration:none;">$1</a>');
    }
};
// Your code here...
//})();