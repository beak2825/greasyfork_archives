// ==UserScript==
// @name        自动刷新
// @namespace    http://ccvxx.cn/
// @version      0.2
// @description  自动刷新所有网页，修改@match，可自定义刷新指定网页
// @author       术の語、涼城
// @match             *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493564/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/493564/%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let autoNext = function(){
    location.reload()
}
    setInterval(autoNext, 2000);//6000毫秒执行一次函数</div>
})();