// ==UserScript==
// @name         LG to MD
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  双击即可复制洛谷md题面
// @author       tojunfeng & lzx
// @match        https://www.luogu.com.cn/problem/*
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441849/LG%20to%20MD.user.js
// @updateURL https://update.greasyfork.org/scripts/441849/LG%20to%20MD.meta.js
// ==/UserScript==

function getJSON(url){
    let Pdata;
    $.ajax({
        url:url,
        type:"GET", //请求类型
        dataType:'json', //返回 JSON 数据
        async : false,    //是否支持异步刷新，默认是true（异步）
        data:{  //需要提交的数据
            _contentOnly:23333
        },
        success:function(data){ //请求成功后的回调函数
            //console.log(data["currentData"]["problem"])
            Pdata = data["currentData"]["problem"];
        },
        error:function () { //请求失败后的回调函数
            //alert("服务器内部异常")
            console.log("服务器内部异常");
        }
    });
    return Pdata;
}

function Core(){
    let url = window.location.href;
    console.log(url);
    let Pdata = getJSON(url);
    let Problem = "# " + Pdata["title"] + "\n";
    if(Pdata["background"]!="")
        Problem += "## 题目背景\n\n" + Pdata["background"] + "\n";
    if(Pdata["description"]!="")
        Problem += "## 题目描述\n\n" + Pdata["description"] + "\n";
    if(Pdata["inputFormat"]!="")
        Problem += "## 输入格式\n\n" + Pdata["inputFormat"] + "\n";
    if(Pdata["outputFormat"]!="")
        Problem += "## 输出格式\n\n" + Pdata["outputFormat"] + "\n";
    //Problem += "## 输入输出样例\n\n";
    $.each(Pdata["samples"],(i,val)=>{
        let ret = "\n";
        if(val[0].length >= 1 && val[0].substr(-1)=="\n"){
            ret = "";
            console.log("in");
        }
        Problem += "```input"+String(i+1)+"\n" + val[0] +ret+"```\n";
        ret = "\n";
        if(val[1].length >= 1 && val[1].substr(-1)=="\n")
            ret = "";
        Problem += "```output"+String(i+1)+"\n" + val[1] +ret+"```\n";
    })
    if(Pdata["hint"]!="")
        Problem += "## 说明/提示\n\n" + Pdata["hint"] + "\n";
    //console.log(Problem);
    console.log("复制成功")
    navigator.clipboard.writeText(Problem); //复制到剪切板
    //copy(Problem);
    //alert("dbclick");
}

function creatDiv(){
    let div = document.createElement('div');
    let css = "z-index: 12001;background-color: #c9bcbcbd;color: white; position: fixed; left: 45%; right: 45%; top: 12%;";
    css += "height:1em; width:6em; text-align: center; padding-top: 0.25em; padding-bottom: 0.25em; border-radius: 15px;"
    css += "display:none"
    div.setAttribute("style",css);
    div.innerHTML = "复制成功";
    $("body").before(div);
    return div;
}


(function() {
    'use strict';
    let icon = creatDiv();
    $("body").dblclick(function(){
        Core();
        $(icon).fadeIn(200);
        $(icon).fadeOut(1200);
    });
})();

