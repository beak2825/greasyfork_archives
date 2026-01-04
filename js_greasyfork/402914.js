// ==UserScript==
// @name         搜索引擎
// @namespace    https://baidu.com/
// @version      0.4
// @description  百度一下，谷歌一下，必应一下，搜狗一下
// @author       Microsoft
// @match        *://*.baidu.com/*
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402914/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/402914/%E6%90%9C%E7%B4%A2%E5%BC%95%E6%93%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    // 替换百度logo
    var lg = document.getElementById("lg");
    if(lg!=null)
    {
        // 移除百度logo
        try
        {
            lg.removeChild(lg.childNodes[2]);
            lg.removeChild(lg.childNodes[1]);
            lg.removeChild(lg.childNodes[0]);
        }
        catch(err)
        {
            console.log(err);
        }
        // 新增自定义logo
        var logo=document.createElement("img");
        // 在线获取自己喜欢的logo
        logo.src="https://studentambassadors.microsoft.com/Assets/MsLogo.png";
        // 设置logo的宽高
        logo.setAttribute("width", "284");
        logo.setAttribute("height", "61");
        logo.setAttribute("id", "s_lg_img_new");
        // 调整logo位置
        logo.style.left = 265 + "px"
        lg.appendChild(logo);
    }

    // 移除搜索结果logo
    var result_logo = document.getElementById("result_logo");
    if(result_logo!=null)
    {
        // 移除百度搜索结果logo
        try
        {
            result_logo.removeChild(result_logo.childNodes[1]);
            result_logo.removeChild(result_logo.childNodes[0]);
        }
        catch(err)
        {
            console.log(err);
        }
        // 添加自定义logo
        var logo2=document.createElement("img");
        // 在线获取自己喜欢的logo
        logo2.src="https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE1Mu3b?ver=5c31";
        // 设置logo的宽高
        logo2.setAttribute("width", "20");
        logo2.setAttribute("height", "20");
        logo2.setAttribute("id", "new_result_logo");
        // 调整logo位置
        //logo2.style.left = 350 + "px"
        result_logo.appendChild(logo2);


    }


    // 删除百度一下原按钮
    var su = document.getElementById("su");
    if(su!=null)
    {
        su.parentNode.removeChild(su);
    }

    // 增加新按钮
    var form=document.getElementById("form");
    if(form!=null)
    {
        form.setAttribute("style", "width:654px;");
        // 谷歌
        var button1 = document.createElement("input"); //创建一个input对象（提示框按钮）
        button1.setAttribute("type", "button");
        button1.setAttribute("value", "Google一下");
        button1.setAttribute("style", "width:132px;height: 36px;margin:6px 6px 0 0;cursor: pointer;color: #fff;font-size: 15px;letter-spacing: 1px;background: #4e6ef2;border-bottom: 1px solid #2d78f4;outline: medium;-webkit-appearance: none;-webkit-border-radius: 0;");
        button1.setAttribute("id", "btn1");
        form.appendChild(button1);

        // 必应
        var button2 = document.createElement("input"); //创建一个input对象（提示框按钮）
        button2.setAttribute("type", "button");
        button2.setAttribute("value", "必应一下");
        button2.setAttribute("style", "width:132px;height: 36px;margin:6px 6px 0 0;cursor: pointer;color: #fff;font-size: 15px;letter-spacing: 1px;background: #4e6ef2;border-bottom: 1px solid #2d78f4;outline: medium;-webkit-appearance: none;-webkit-border-radius: 0;");
        button2.setAttribute("id", "btn2");
        form.appendChild(button2);

        // 搜狗
        var button3 = document.createElement("input"); //创建一个input对象（提示框按钮）
        button3.setAttribute("type", "button");
        button3.setAttribute("value", "搜狗一下");
        button3.setAttribute("style", "width:132px;height: 36px;margin:6px 6px 0 0;cursor: pointer;color: #fff;font-size: 15px;letter-spacing: 1px;background: #4e6ef2;border-bottom: 1px solid #2d78f4;outline: medium;-webkit-appearance: none;-webkit-border-radius: 0;");
        button3.setAttribute("id", "btn3");
        form.appendChild(button3);

        // 百度一下
        var button0 = document.createElement("input"); //创建一个input对象（提示框按钮）
        button0.setAttribute("type", "button");
        button0.setAttribute("value", "百度一下");
        button0.setAttribute("style", "width:132px;height: 36px;margin:6px 0px 0 0;cursor: pointer;color: #fff;font-size: 15px;letter-spacing: 1px;background: #4e6ef2;border-bottom: 1px solid #2d78f4;outline: medium;-webkit-appearance: none;-webkit-border-radius: 0;");
        button0.setAttribute("id", "btn0");
        form.appendChild(button0);
    }

    // 根据id获取热搜div
    var div = document.getElementById("s-hotsearch-wrapper");
    if(div!=null)
    {
        // 删除热搜榜
        div.parentNode.removeChild(div)
    }


    // 百度搜索
    $("#btn0").click(function(){
        window.location.href="https://www.baidu.com/s?wd=" + $('#kw') .val();
    });
    // 谷歌搜索
    $("#btn1").click(function(){
        window.open("https://www.google.com.hk/search?q=" + $('#kw') .val());
    });
    // 必应搜索
    $("#btn2").click(function(){
        window.open("https://cn.bing.com/search?q=" + $('#kw') .val());
    });

    // 搜狗搜索
    $("#btn3").click(function(){
        window.open("https://www.sogou.com/web?query=" + $('#kw') .val());
    });


})();