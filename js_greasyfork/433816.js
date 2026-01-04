// ==UserScript==
// @name          91huayi2
// @namespace     -
// @description	  自用测试
// @author        nobody
// @homepage      -
// @include       *://*.91huayi.com/course_ware/course_ware_polyv.aspx*
// @version       0.0.4
// @downloadURL https://update.greasyfork.org/scripts/433816/91huayi2.user.js
// @updateURL https://update.greasyfork.org/scripts/433816/91huayi2.meta.js
// ==/UserScript==

(function() {
    'use strict';

// 10分钟后执行代码
    setTimeout(function() {
        document.querySelector("div[id='floatTips']").remove();
        showExam(true);
        delCookie("playState");
        addCourseWarePlayRecord();
        $('.sign-in-menu').empty()
        clearInterval(timerSign);
    }, 600 * 1000);

})();