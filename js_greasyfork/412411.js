// ==UserScript==
// @name         知乎自动反对
// @namespace    https://greasyfork.org/zh-CN/users/76579-%E4%BB%99%E5%9C%A3
// @version      0.3
// @description  自动反对你讨厌的人的回答，在用户主页的回答页面上起作用。
// @author       仙圣
// @include       https://www.zhihu.com/people/liulangdehama/answers*
// @grant        none
// @require         https://cdn.bootcss.com/jquery/3.4.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/412411/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E5%8F%8D%E5%AF%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/412411/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E5%8F%8D%E5%AF%B9.meta.js
// ==/UserScript==
(function() {
    /* globals jQuery, $, waitForKeyElements */

    var i = 0;

    function 反对开始() {
        $('[aria-label="反对"]')[i].click();
        //location.reload(true); //因为脚本在执行反对时会自动跳过第2、4、6、8等偶数个回答，为了防止漏掉，每点一个自动刷新……   //当前似乎不会再跳过偶数个回答了，因此行代码注释掉
    }
    setInterval(反对开始, 5000);
    setInterval(function(){$(".Button.PaginationButton.PaginationButton-next.Button--plain").click();},100000);
        //如果全部都点反对了，就100秒后自动点下一页
})();