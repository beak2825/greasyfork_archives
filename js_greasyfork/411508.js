// ==UserScript==
// @name         刷微信读书的时间
// @namespace    https://gitee.com/bigBeng/easycar
// @version      0.1
// @description  刷微信读书的时间，登录pc端随便打开某书的一个章节，自动滚屏阅读
// @author       guo
// @license      AGPL
// @match        https://weread.qq.com/web/reader*
// @require https://cdn.bootcss.com/jquery/2.2.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411508/%E5%88%B7%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%9A%84%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/411508/%E5%88%B7%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%9A%84%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==


(function() {
    'use strict';
    $(function() {

        var flag = true;
        var count = 0,
            step = 30;
        var direction = 'down';
        var history = [],
            mov = 0;
        var body = $("body");
        var handler = setInterval(function() {

            flag = $(document).scrollTop() + $(window).height() == $(document).height();
            console.log("flag--> ", flag, count, direction);
            if (flag || ( direction==='up' && count > 0)) {
                count--;
                scroll(0, history[count]);
                if(count == 0){
                    direction = 'down';
                }else{
                    body.trigger("click");
                    direction = 'up';
                }
            } else {
                if (history[count]) {
                    mov = history[count];
                } else {
                    mov = step * count;
                    history[count] = mov;
                };
                count++;
                scroll(0, mov);
            }
        }, 800);
    });
})();