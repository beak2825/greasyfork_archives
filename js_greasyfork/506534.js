// ==UserScript==
// @name            Replace WSJ CN Article Links with WSJ US
// @namespace       replace-wsj-cn-links
// @version         1.0
// @description     Replace <a> tag links on https://cn.wsj.com/ from cn.wsj.com to www.wsj.com for articles
// @author          YourName
// @match           https://cn.wsj.com/*
// @match           https://www.wsj.com/*
// @grant           none
// @run-at          document-end
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/506534/Replace%20WSJ%20CN%20Article%20Links%20with%20WSJ%20US.user.js
// @updateURL https://update.greasyfork.org/scripts/506534/Replace%20WSJ%20CN%20Article%20Links%20with%20WSJ%20US.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取所有 <a> 标签，筛选出 href 以 'https://cn.wsj.com/articles/' 开头的链接
    const links = document.querySelectorAll('a[href^="https://cn.wsj.com/articles/"]');

    links.forEach(link => {
        // 替换 href 中的 'cn.wsj.com' 为 'www.wsj.com'
        link.href = link.href.replace('https://cn.wsj.com/articles/', 'https://www.wsj.com/articles/');
    });

    console.log('All <a> tag article links have been updated.');
})();