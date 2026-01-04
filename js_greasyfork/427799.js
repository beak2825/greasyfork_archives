// ==UserScript==
// @name         西工大自动评教系统
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  用于西工大自动评教
// @author       Winter
// @match        *us.nwpu.edu.cn/eams/teach/quality/stdEvaluate*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427799/%E8%A5%BF%E5%B7%A5%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E7%B3%BB%E7%BB%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/427799/%E8%A5%BF%E5%B7%A5%E5%A4%A7%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E7%B3%BB%E7%BB%9F.meta.js
// ==/UserScript==


var setting={
    //0为否，1为是
    isAuto : 0, //是否自动提交，没有确认，很快啊。若对老师有意见，勿选。
    isAutoTurn : 1, //是否自动跳转，开启后会自动跳到下一个评教页面
    anstext : "无", //建议填写
    ops : 0, //全为非常满意
    resTime : 2000 //页面加载延时，失效时请加大再进行测试。

};

function turnIt(){
    var elem = document.getElementsByClassName("eval");
    if(elem.length>0)
    {
        elem[0].click();
    }
    else
    {
        alert("已完成评教");
    }
}

function subIt(){
    var anstext=setting.anstext;
    var elems = document.getElementsByTagName("input");
    var text = document.getElementsByTagName("textarea");
    var sub = document.getElementById("sub");
    console.log(elems[0]);
    setTimeout(function (){
    for(var i=setting.ops;i<elems.length;i+=5)
    {
        elems[i].click();
    }
    text[0].value=anstext;
    },setting.resTime);
    setTimeout(function (){
        if(setting.isAuto)
        {
            confirm=function(){return 1};
        }
        sub.click();
    },setting.resTime+500);

}

(
    function() {
    'use strict';
    var currentURL = window.location.href;
    if(currentURL.match("innerIndex.action")!=null)
    {
        if(setting.isAutoTurn)
            turnIt();
    }
    else if(currentURL.match("answer.action")!=null)
    {
        subIt();
    }
    else if(currentURL.match(".action")!=null)
    {
        alert("已完成评教,请不要调戏人家。");
    }
    else
    {
        alert("未知错误");
    }
    }

)();