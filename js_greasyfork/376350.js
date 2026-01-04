// ==UserScript==
// @name         FuckXueKeWang
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  fuck XueKeWang
// @author       mcard
// @match        http://zujuan.xkw.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376350/FuckXueKeWang.user.js
// @updateURL https://update.greasyfork.org/scripts/376350/FuckXueKeWang.meta.js
// ==/UserScript==

(function() {
    'use strict';
    usergroup.GroupID = 10;
    console.log("成功设置用户组为" + usergroup.GroupID);
    console.log("正在调整用户的其它选项");
    usergroup.AllowUploadQuesFile = true;
    usergroup.CanAutoSelQues = true;
    usergroup.CanDownQuesParse = true
    usergroup.CanSearchQues = true
    usergroup.CanViewQuesParse = true
    usergroup.CanVisitPaperGradeList = "1000000";
    usergroup.CancollectQues = true;
    usergroup.MaxAutoPaper = 100;
    usergroup.MaxCreatePaperOneDay = 100;
    usergroup.MaxDownParse = 100;
    usergroup.GroupName = "超级管理员";
    usergroup.GroupNote = "超级管理员";
    usergroup.MaxCreatePaperOneDay_danzhanghao = 100;
    usergroup.MaxDownParse = 100;
    usergroup.MaxFavPaper = 100;
    usergroup.MaxFavQues = 100;
    usergroup.MaxQuesNumInPaper = 10000;
    usergroup.MaxViewParse = 1000;
    usergroup.TrailMaxCreatePaperOneDay = 1000;

    // 无聊玩意
    userinfo.GroupID = 10;
    // Your code here...
})();