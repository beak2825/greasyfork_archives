// ==UserScript==
// @name         考试星助手
// @version      0.1
// @description  切屏绕过
// @author       xxx
// @match        https://exam.kaoshixing.com/exam/*
// @grant        none
// @namespace https://greasyfork.org/users/582426
// @downloadURL https://update.greasyfork.org/scripts/405279/%E8%80%83%E8%AF%95%E6%98%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/405279/%E8%80%83%E8%AF%95%E6%98%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

window.blurCount = function(){}//屏蔽切屏检测
window.saveExamFn_ = window.saveExamFn//备份函数
window.saveExamFn = function(isForce){//屏蔽掉对学生不利的交卷方式
    if(isForce===0||isForce===4||isForce===5||isForce===6){// isForce--是否强制交卷，强制交卷方式 //0--否 1--是 2--切屏防作弊 3--x秒不动自动交卷 4--闯关失败 5--答题时间或者考试时间已到 6-批量交卷3秒后交卷 7-人脸监测强制交卷
        window.saveExamFn_(isForce)
    }
}
window.sendCuttingScreenCount = function(times){}
window.faceCheckExaming = 0//关闭人脸比对检测
document.oncontextmenu=new Function("event.returnValue=true");//开启复制粘贴
document.oncopy=new Function("event.returnValue=true");
document.onpaste=new Function("event.returnValue=true");