// ==UserScript==
// @name         无限循环刷新相应的页面
// @namespace    https://github.com/wangrongding/ding-script
// @version      0.2
// @description  (需要自己改写match地址,默认匹配规则是所有URL)
// @author       汪荣顶
// @homeurl      https://github.com/wangrongding/ding-script/loopReload.js
// @match        https://*.*
// @icon         http://ww1.sinaimg.cn/large/75314ac9ly1gsoywgjgl3j205k05kaab.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/429711/%E6%97%A0%E9%99%90%E5%BE%AA%E7%8E%AF%E5%88%B7%E6%96%B0%E7%9B%B8%E5%BA%94%E7%9A%84%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/429711/%E6%97%A0%E9%99%90%E5%BE%AA%E7%8E%AF%E5%88%B7%E6%96%B0%E7%9B%B8%E5%BA%94%E7%9A%84%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function () {
    "use stric";
    //script template by 汪荣顶
    //Your code here...
    setInterval(() => {
        window.location.reload();
    }, 500);
})();
