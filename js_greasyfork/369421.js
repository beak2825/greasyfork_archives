// ==UserScript==
// @name         屏蔽热门内容
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       me
// @match        *://www.zhihu.com*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369421/%E5%B1%8F%E8%94%BD%E7%83%AD%E9%97%A8%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/369421/%E5%B1%8F%E8%94%BD%E7%83%AD%E9%97%A8%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

function purify (nodes) {
  for (let node of nodes) {
    if (node.textContent.indexOf('热门内容, ') === 0) {
       node.querySelector('.TopstoryItem-rightButton').click();
       //node.parentNode.removeChild(node); // 做人留一线，先注释掉
        //node.hidden = true;
    }
  }
}


(function() {
    const mo = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            if (mutation.type === 'childList') {
                purify(mutation.addedNodes)
            }
        }
    })

    purify(document.querySelectorAll('.TopstoryItem'))
    mo.observe(document.querySelector('.TopstoryMain > div'), { childList: true })

    // Your code here...
})();