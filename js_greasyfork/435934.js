// ==UserScript==
// @name         洛谷题面复制为markdown格式
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  在洛谷的题目页面时，双击即可复制洛谷md题面
// @author       tojunfeng
// @match        https://www.luogu.com.cn/problem/P*
// @icon         https://cdn.luogu.com.cn/fe/logo.png
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/435934/%E6%B4%9B%E8%B0%B7%E9%A2%98%E9%9D%A2%E5%A4%8D%E5%88%B6%E4%B8%BAmarkdown%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/435934/%E6%B4%9B%E8%B0%B7%E9%A2%98%E9%9D%A2%E5%A4%8D%E5%88%B6%E4%B8%BAmarkdown%E6%A0%BC%E5%BC%8F.meta.js
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
    let Problem = "## " + Pdata["title"] + "\n";
    if(Pdata["background"]!="")
        Problem += "### 题目背景\n" + Pdata["background"] + "\n";
    Problem += "### 题目描述\n" + Pdata["description"] + "\n";
    Problem += "### 输入格式\n" + Pdata["inputFormat"] + "\n";
    Problem += "### 输出格式\n" + Pdata["outputFormat"] + "\n";
    Problem += "### 输入输出样例\n";
    $.each(Pdata["samples"],(i,val)=>{
        let ret = "\n";
        if(val[0].length >= 1 && val[0].substr(-1)=="\n"){
            ret = "";
            console.log("in");
        }
        Problem += "#### 样例输入"+String(i+1)+"\n```\n" + val[0] +ret+"```\n";
        ret = "\n";
        if(val[1].length >= 1 && val[1].substr(-1)=="\n")
            ret = "";
        Problem += "#### 样例输出"+String(i+1)+"\n```\n" + val[1] +ret+"```\n";
    })
    Problem += "### 说明/提示\n" + Pdata["hint"] + "\n";
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

