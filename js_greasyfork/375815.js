// ==UserScript==
// @author       不清蒸的野鸽
// @name         煎蛋网吐槽
// @version      1.02
// @description  无聊图板块自动展开吐槽以及手贱图，隐藏评论区
// @match         *://*.jandan.net/pic*
// @icon         https://cdn.jandan.net/static/img/favicon.ico
// @namespace https://greasyfork.org/users/234292
// @downloadURL https://update.greasyfork.org/scripts/375815/%E7%85%8E%E8%9B%8B%E7%BD%91%E5%90%90%E6%A7%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/375815/%E7%85%8E%E8%9B%8B%E7%BD%91%E5%90%90%E6%A7%BD.meta.js
// ==/UserScript==


function hideCommentForm(){   
    var text = "tucao-form";
    var formList = document.getElementsByClassName(text);
    for (var i=0;i<formList.length;i++){
        formList[i].style.display = "none";
    };
};

function addCommentButton(){
    var tucaoList = document.getElementsByClassName("jandan-tucao-close");
    var btStyle = {
        "color": "#fff",
        "fontsize": "14px",
        "borderRadius": "4px",
        "padding": "1.1px 10px",
        "textalign": "center",
        "display": "inline-block",
        "backgroundColor": "#00a1d6"
        };   
    for (var i=0;i<tucaoList.length;i++){
        var button = document.createElement("button");
        button.innerHTML = "评论";
        var bts = button.style
        for (var styleName in btStyle){
            bts[styleName] = btStyle[styleName]
        };      
        tucaoList[i].appendChild(button)
        button.addEventListener ("click", function() {
            formList = document.getElementsByClassName("tucao-form");
            for (var i=0;i<formList.length;i++){
                formList[i].style.display = "block";
            };
        });
    };
};

function  autoclick(){
    var text = "tucao-btn";
    var b = document.getElementsByClassName(text);
    var l = b.length;
    if (l>0){
        for (var i=0;i<l;i++){
            b[i].click();                      
        };
    };
};

function autoclickshoujian(){
    var text = "view_bad";
    var b = document.getElementsByClassName(text);
    var l = b.length;
    if (l>0){
        for (var i=0;i<l;i++){
            b[i].click();    
        };
    };
};

(function () {
    'use strict';      
  	setTimeout(function(){autoclick();}, 0); 
  	setTimeout(function(){autoclickshoujian();}, 1); 
    setTimeout(function(){hideCommentForm();},2000);
    setTimeout(function(){addCommentButton();},2001);
})()




