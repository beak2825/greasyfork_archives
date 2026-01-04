// ==UserScript==
// @name         解除对分易在线练习选中复制限制
// @namespace    https://github.com/Aric-Sun/
// @version      0.1
// @description  解除学生用户在使用对分易的在线练习模式时不能选中复制的限制，方便搜题。
// @author       AricSun
// @match        https://www.duifene.com/_Paper/PC/StudentPapers.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403853/%E8%A7%A3%E9%99%A4%E5%AF%B9%E5%88%86%E6%98%93%E5%9C%A8%E7%BA%BF%E7%BB%83%E4%B9%A0%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/403853/%E8%A7%A3%E9%99%A4%E5%AF%B9%E5%88%86%E6%98%93%E5%9C%A8%E7%BA%BF%E7%BB%83%E4%B9%A0%E9%80%89%E4%B8%AD%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var copyLimit = function (){
        var eles = document.getElementsByTagName ('*');
        for (var i = 0; i < eles.length; i++) {
            eles [i].style.userSelect = 'text';
        } // 代码参考 https://blog.csdn.net/weixin_42312511/article/details/100638916
    };
    setInterval (copyLimit,500);
    // 因为在在线练习中，题目之间的跳转可以通过答题卡选择，上下题按钮切换。
    // 而且切换后代码就会失效了，必须重新运行一遍才可以继续生效，一题只能生效一次。
    // 所以图省事，就没有挨个去跟踪动作，简单粗暴地通过定时器执行代码，
    // 为了达到切换后很快就可以选中复制，我暂时将间隔时间设为 500ms，
    // 如果你的电脑资源占用过多的话，可以将数值调大一些，相应的从切换题目到可以选中复制的时间也会延长，注意一下就行了。

    // Your code here...
})();