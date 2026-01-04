// ==UserScript==
// @name         23年黑色粉笔自用
// @namespace    23年黑色粉笔自用
// @version      1.2
// @description  关闭教师研修提示暂停 适用于teacheredu.cn登录入口的教师研修或视频页面为(cas.)study.teacheredu.cn/proj/studentwork/的研修
// @author       tomizu
// @match        http://study.teacheredu.cn/proj/studentwork/*
// @match        http://cas.study.teacheredu.cn/proj/studentwork/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470644/23%E5%B9%B4%E9%BB%91%E8%89%B2%E7%B2%89%E7%AC%94%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/470644/23%E5%B9%B4%E9%BB%91%E8%89%B2%E7%B2%89%E7%AC%94%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var tishiBar = document.getElementById("benci").parentNode;
    var pjscript = document.createElement("script");
    var scriptText = document.createTextNode(
    'function openTishi(minute,second){\n'+
    '    if(minute==randomTime)\n'+
    '    {\n'+
    '        if(second == "0")\n'+
    '        {\n'+
    '            var tishiTime=document.form2.thzt.value;\n'+
    '            updateStudyTime(0);\n'+
    '            setRandomTipTime();\n'+
    '        }\n'+
    '    }\n'+
    '}\n'+

    'function openTishi(second){\n'+
    '    if(second==randomTime)\n'+
    '    {\n'+
    '        var tishiTime=document.form2.thzt.value;\n'+
    '        updateStudyTime(0);\n'+
    '        setRandomTipTime();\n'+
    '    }\n'+
    '}\n');
    pjscript.appendChild(scriptText);
    tishiBar.appendChild(pjscript);
    var childText = document.createTextNode("破解成功");
    tishiBar.appendChild(childText);
})();