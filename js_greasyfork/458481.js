// ==UserScript==
// @name         峰哥爱学习
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  取消学习中的干扰提醒
// @author       blacksnow
// @match        http://pn202213212.stu.teacher.com.cn/course/intoSelectCourseVideo?studyPlanId=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458481/%E5%B3%B0%E5%93%A5%E7%88%B1%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/458481/%E5%B3%B0%E5%93%A5%E7%88%B1%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    setInterval(function(){
        monitorPageOperate(false);  //不弹出10分钟提醒
        isOpenOvertimepopover = true; //不弹出超时提醒
    },1000);
    layer.open({
        content: '已经取消10分钟提醒的干扰，请认真学习，天天向上。',
        btn: ['知道了，谢谢峰哥。'],
        btnAlign: 'c',
        yes: function (index) {
            layer.msg('不客气', {
                icon: 1
            });
        }
    });
})();