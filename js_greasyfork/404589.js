// ==UserScript==
// @name         屏蔽91wii小白问题
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!
// @author       You
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @match        https://www.91wii.com/forum-125*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404589/%E5%B1%8F%E8%94%BD91wii%E5%B0%8F%E7%99%BD%E9%97%AE%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/404589/%E5%B1%8F%E8%94%BD91wii%E5%B0%8F%E7%99%BD%E9%97%AE%E9%A2%98.meta.js
// ==/UserScript==

(function() {
        'use strict';
    jQuery.noConflict();
(function($){
      //匹配的关键字
var patt1 = new RegExp("^求|(怎么|？|小白|新手|呢|为什么|吗|如何|问题|新人)");
    //干掉所有的求助
    $("a[href='https://www.91wii.com/forum.php?mod=forumdisplay&fid=125&filter=typeid&typeid=139']").closest("tbody[id]").remove();
//先找到需要匹配的字
$("tbody[id] a.s.xst[href][onclick]").each(function () {
    if (patt1.test($(this).text())) {
        //console.log("恭喜发现 " + $(this).text());
        console.log("恭喜 " + $(this).text() + " 关键字 -------------------------------" + patt1.exec($(this).text()));
        //找到父类，隐藏
        $(this).closest("tbody[id]").hide();
    }
})
console.log("恭喜forum加载jquery成功");
    // Your code here...
 })(jQuery);
})();