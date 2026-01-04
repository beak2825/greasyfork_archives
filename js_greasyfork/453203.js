// ==UserScript==
// @name         东营实验中学成绩平台 学生端成绩查询助手
// @version      0.1
// @namespace    https://codezhangborui.github.io
// @description  跳过系统的限制，强制查询其他学生的成绩
// @author       CodeZhangBorui
// @match        http://172.140.170.136/base/newuistu_ctr/examscorepagedao?studentnum=*&examid=*
// @match        http://218.56.181.49/base/newuistu_ctr/examscorepagedao?studentnum=*&examid=*
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453203/%E4%B8%9C%E8%90%A5%E5%AE%9E%E9%AA%8C%E4%B8%AD%E5%AD%A6%E6%88%90%E7%BB%A9%E5%B9%B3%E5%8F%B0%20%E5%AD%A6%E7%94%9F%E7%AB%AF%E6%88%90%E7%BB%A9%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/453203/%E4%B8%9C%E8%90%A5%E5%AE%9E%E9%AA%8C%E4%B8%AD%E5%AD%A6%E6%88%90%E7%BB%A9%E5%B9%B3%E5%8F%B0%20%E5%AD%A6%E7%94%9F%E7%AB%AF%E6%88%90%E7%BB%A9%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //注意：请在合理范围内正确使用该脚本，如错误使用造成不良后果本作者不负任何责任！
    console.log("注意：请在合理范围内正确使用该脚本，如错误使用造成不良后果本作者不负任何责任！");
    GM_registerMenuCommand("查询其他", () => {
        var examid = prompt('请输入考试ID（exam_id）');
        var stuid = prompt('请输入学生考号（stu_id）');
        window.location = `/base/newuistu_ctr/examscorepagedao?studentnum=${stuid}&examid=${examid}`
    });
})();