// ==UserScript==
// @name         no zhihu redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  no zhihulink redirect
// @author       anonymous
// @grant        none
// @connect-src       www.zhihu.com
// @include           *://www.zhihu.com/*
// @downloadURL https://update.greasyfork.org/scripts/27079/no%20zhihu%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/27079/no%20zhihu%20redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const keyword = 'link.zhihu.com';
    const len = keyword.length;
    let links = document.querySelectorAll('a');
    links.forEach(link => {
      let href = link.href;
      let pos = href.indexOf(keyword) + len;
      let result;
      if (href.indexOf(keyword) > -1) {
        console.log('%coriginal href %s', 'font-size: 1.2rem; color: red;', href);
        result = href.slice(pos);
        result = result.split('target=')[1].replace('%3A', ':');
        console.log('%creplaced href %s', 'font-size: 1.2rem; color: red;', result);
        link.href = result;
      }
    });
})();