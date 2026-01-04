// ==UserScript==
// @name         东营实验中学成绩平台 教师端成绩单下载器
// @version      0.1
// @namespace    https://codezhangborui.github.io
// @description  跳过系统的限制，强制下载成绩单
// @author       CodeZhangBorui
// @match        http://172.140.170.136/base/newuiteacher/score.jsp?nav=3
// @match        http://218.56.181.49/base/newuiteacher/score.jsp?nav=3
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453204/%E4%B8%9C%E8%90%A5%E5%AE%9E%E9%AA%8C%E4%B8%AD%E5%AD%A6%E6%88%90%E7%BB%A9%E5%B9%B3%E5%8F%B0%20%E6%95%99%E5%B8%88%E7%AB%AF%E6%88%90%E7%BB%A9%E5%8D%95%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/453204/%E4%B8%9C%E8%90%A5%E5%AE%9E%E9%AA%8C%E4%B8%AD%E5%AD%A6%E6%88%90%E7%BB%A9%E5%B9%B3%E5%8F%B0%20%E6%95%99%E5%B8%88%E7%AB%AF%E6%88%90%E7%BB%A9%E5%8D%95%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //注意：请在合理范围内正确使用该脚本，如错误使用造成不良后果本作者不负任何责任！
    console.log("注意：请在合理范围内正确使用该脚本，如错误使用造成不良后果本作者不负任何责任！");
    GM_registerMenuCommand("查询", () => {
        var examid = prompt('请输入考试ID（exam_id）');
        var classid = prompt('请输入班级ID（class_id）');
        if(examid == null || classid == null) {
            return;
        }
        alert("注意：请在合理范围内正确使用该脚本，如错误使用造成不良后果本作者不负任何责任！");
        var exam_id=examid
        var class_id=classid
        var subject_id=$("#newsubjectid").attr("newsubjectid");
        var subjectrank=0;
        if($('.chose-dk').hasClass('on')){
            subjectrank=1;
        }
        var linenum_1=$("#linenum_1").val();
        var linenum_2=$("#linenum_2").val();
        //alert("exam_id="+exam_id+",calss_id="+class_id+",subject_id="+subject_id+",subjectrank="+subjectrank+",linenum_1="+linenum_1+",linenum_2="+linenum_2);
        find_(exam_id,class_id,subject_id,subjectrank,linenum_1,linenum_2,0);
    });
    GM_registerMenuCommand("导出 EXCEL", () => {
        var examid = prompt('请输入考试ID（exam_id）');
        var classid = prompt('请输入班级ID（class_id）');
        if(examid == null || classid == null) {
            return;
        }
        alert("注意：请在合理范围内正确使用该脚本，如错误使用造成不良后果本作者不负任何责任！");
        var exam_id=examid;
        var class_id=classid;
        var subject_id=$("#newsubjectid").attr("newsubjectid");
        var subjectrank=0;
        if($('.chose-dk').hasClass('on')){
            subjectrank=1;
        }
        var linenum_1=$("#linenum_1").val();
        var linenum_2=$("#linenum_2").val();
        $("#p1").val(exam_id);
        $("#p2").val(class_id);
        $("#p3").val(subject_id);
        $("#p4").val(subjectrank);
        $("#p5").val(linenum_1);
        $("#p6").val(linenum_2);
        $("#p7").val(0);

        $("#form1").submit();
    });
})();