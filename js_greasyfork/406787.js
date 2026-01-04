// ==UserScript==
// @name         BJSkillTrainingRefresh
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  北京市职业技能提升行动管理平台自动刷新
// @author       adobj
// @match        *://www.bjjnts.cn/lessonStudy/*
// @grant        unsafeWindow
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/406787/BJSkillTrainingRefresh.user.js
// @updateURL https://update.greasyfork.org/scripts/406787/BJSkillTrainingRefresh.meta.js
// ==/UserScript==

$('head').append("<script src=\"https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js\"></script>");
$('head').append("<link rel=\"stylesheet\" href=\"https://cdn.jsdelivr.net/npm/font-awesome/css/font-awesome.min.css\"/>");
$('head').append("<script src=\"https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget/autoload.js\"></script>");

(function() {
    'use strict';
    // Your code here...
    unsafeWindow.setInterval(function () {
        var domObject = $('.layui-layer-btn0');
        if(domObject.length>0){
            domObject[0].click();
            GM_log(domObject);
        }
        //GM_log("start ...");
    },1000);
})();