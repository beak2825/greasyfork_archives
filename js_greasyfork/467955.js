// ==UserScript==

// @name        blockKeyWordsInURL ｜ 禁止网址存在屏蔽词
// @namespace   leizingyiu.net
// @match       http*://*.bing.com/*
// @grant       none
// @version     2023/6/5 14:23
// @author      leizingyiu
// @license     GNU GPLv3
// @description URL中存在禁止的词，则屏蔽整个页面。在 blockKeyWords 填写 屏蔽词，在 comment 填写屏蔽后显示的留言。

// @downloadURL https://update.greasyfork.org/scripts/467955/blockKeyWordsInURL%20%EF%BD%9C%20%E7%A6%81%E6%AD%A2%E7%BD%91%E5%9D%80%E5%AD%98%E5%9C%A8%E5%B1%8F%E8%94%BD%E8%AF%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/467955/blockKeyWordsInURL%20%EF%BD%9C%20%E7%A6%81%E6%AD%A2%E7%BD%91%E5%9D%80%E5%AD%98%E5%9C%A8%E5%B1%8F%E8%94%BD%E8%AF%8D.meta.js
// ==/UserScript==

const blockKeyWords = '游戏，game'.split(/[,，]/);

const comment = '不许搜这个！';

function blockFn() {
    document.body.innerHTML = '';
    let p = document.createElement('p'); p.innerText = comment; p.style.cssText = `position:absolute; top:50%;left:50%; transform:translate(-50%,-50%);`; document.body.appendChild(p);
    setTimeout(blockFn, 2000);
}

blockKeyWords.map(w => {
    if (Boolean(decodeURIComponent(window.location.href).match(w))) {
        blockFn();
    }
});