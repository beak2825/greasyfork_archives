// ==UserScript==
// @name         XJU新版评教自动填写脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  无语了，不想描述但是必须有这个玩意
// @author       RUINABINGYYDS
// @match        https://xju.mycospxk.com/*
// @icon         https://www.google.com/s2/favicons?domain=mycospxk.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435745/XJU%E6%96%B0%E7%89%88%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/435745/XJU%E6%96%B0%E7%89%88%E8%AF%84%E6%95%99%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';
    window.setTimeout(doNaughtyThings,3000);

    // Your code here...
})();



function doNaughtyThings(){
    var div = document.getElementsByClassName("ant-layout-sider-children");
    var html = "<h1 style=\"color:white\">使用说明</h1>";
    div[0].innerHTML = html;
    html = "<p style=\"color:white\">（1）切换到下一个课程的时候需要点击重新填写才能再次自动填写表单</p><p style=\"color:white\">（2）填写意见需要自己打几个字才能提交</p><p style=\"color:white\">（3）默认除了第四个问题是良好以外其他全是优秀</p>";
    div[0].innerHTML += html;
    html = "<input type=\"button\" id=\"thebutton\" value=\"重新填写\">";
    div[0].innerHTML += html;
    var thebutton = document.getElementById('thebutton');
    thebutton.onclick = doNaughtyThings;
    var divs = document.getElementsByClassName('subject___YVzru forbid_copy___2Jw46');
    var i = 0;
    while(divs.length==0){
        divs = document.getElementsByClassName('subject___YVzru forbid_copy___2Jw46');
    }
    for(i = 0;i<divs.length;i++){
        var buttons = divs[i].getElementsByTagName('input');
        var textareas = divs[i].getElementsByTagName('textarea');
        if(buttons.length!=0){
            if(i==3){
                buttons[1].click();
            }else{
                buttons[0].click();
            }
        }
        if(textareas.length!=0){
            textareas[0].focus();
            textareas[0].value="通过一个学期的学习，我收获很多";

        }
    }

}

