// ==UserScript==
// @name         程序猿DD全文阅读(免强制微信关注)
// @namespace    https://blog.lazy.icu/
// @version      0.1
// @description  程序猿DD(blog.didispace.com)文章总是展示开头,看完需要关注公众号才行,太麻烦了,索性去掉那个提示!
// @author       lazy.icu
// @match        https://blog.didispace.com/*/
// @grant        none
// @license Apache 2.0
// @downloadURL https://update.greasyfork.org/scripts/435398/%E7%A8%8B%E5%BA%8F%E7%8C%BFDD%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%28%E5%85%8D%E5%BC%BA%E5%88%B6%E5%BE%AE%E4%BF%A1%E5%85%B3%E6%B3%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/435398/%E7%A8%8B%E5%BA%8F%E7%8C%BFDD%E5%85%A8%E6%96%87%E9%98%85%E8%AF%BB%28%E5%85%8D%E5%BC%BA%E5%88%B6%E5%BE%AE%E4%BF%A1%E5%85%B3%E6%B3%A8%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector("#read-more-wrap").hidden=true;
    document.querySelector("article").style={overflow: 'unset',height: '100%'};
})();