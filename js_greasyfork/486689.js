// ==UserScript==
// @name         研修破解
// @namespace    研修破解
// @version      1.2
// @description  关闭教师研修提示暂停 适用于teacheredu.cn登录入口的教师研修 默认学习累计70分钟就结束学习。
// @author       modify Micrafast
// @match        http://study.teacheredu.cn/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/486689/%E7%A0%94%E4%BF%AE%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/486689/%E7%A0%94%E4%BF%AE%E7%A0%B4%E8%A7%A3.meta.js
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
   //此句弹窗直接确定，不显示。
   window.confirm = function () {return true};

    pjscript.appendChild(scriptText);
    tishiBar.appendChild(pjscript);
    var childText = document.createTextNode("破解成功");
    tishiBar.appendChild(childText);
//此句判断大于70分钟，就结束学习。
    setInterval(function(){if(document.getElementById('leiji').value>4200){$('a:contains(结束学习)')[0].click();}},1000);

})();