// ==UserScript==
// @name         百度经验自动填充
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  百度经验自动填充补齐！
// @author       exxk
// @match        https://jingyan.baidu.com/edit/content*
// @icon         https://www.google.com/s2/favicons?domain=baidu.com
// @grant        none
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/443144/%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/443144/%E7%99%BE%E5%BA%A6%E7%BB%8F%E9%AA%8C%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //修改标题和图标
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'https://blog.iexxk.com/images/favicon-32x32-next.png';
    document.getElementsByTagName('head')[0].appendChild(link);
    document.title = '经验笔记编辑';
    //隐藏不用的元素
    document.getElementById("js_float_high_quality_wrap").style.visibility = "hidden";
    document.getElementById("header").style.display = "none";
    document.querySelector("div.wgt-benefit").style.display = "none";
    document.querySelector("div.video-guide-left").style.visibility = "hidden";
    // 格式化输入内容
    var ed= document.querySelectorAll('.edui-body-container');
    var sb = document.getElementById("catalog");
    sb.onclick = function(){
        var ed= document.querySelectorAll('.edui-body-container');
        for(var inp of ed){
            inp.onblur= function(){
            }
            var lp= inp.lastElementChild;
            if(!lp.textContent.endsWith('。')){
                lp.textContent=lp.textContent+"。";
            }
            if(inp.id != 'editor-brief'){
                var fp= inp.firstElementChild;
                var b=document.createElement("strong");
                b.textContent=fp.textContent;
                fp.textContent="";
                fp.appendChild(b);
            }
            inp.focus();
        }
    }
    // 添加类型选择事件
    var ss = document.getElementById("category").querySelectorAll("select")[2]; //获取第二个下拉选择框
    ss.onchange = function() { //监听下拉框选择事件
        console.log(ss.value);
        if (ss.value == 16) { //电脑
            var pcInput= document.getElementById("js-software-list").querySelectorAll("input");
            pcInput[0].focus();
            pcInput[0].value = "macOS Monterey";
            pcInput[1].focus();
            pcInput[1].value = "12.2.1";
            pcInput[2].focus();
            pcInput[2].value = "MacBook Pro";
            pcInput[3].focus();
            pcInput[3].value = "2017";
        } else if (ss.value == 20) { //手机
            var phoneInput= document.getElementById("js-software-list").querySelectorAll("input");
            phoneInput[0].focus();
            phoneInput[0].value = "iOS";
            phoneInput[1].focus();
            phoneInput[1].value = "15.4.1";
            phoneInput[2].focus();
            phoneInput[2].value = "iPhone";
            phoneInput[3].focus();
            phoneInput[3].value = "13";
        }
        document.getElementById("is-origin").click();//自动勾选原创
        document.querySelector("input[name='title']").focus();
    };
/** 废弃0.1
    var MyDiv = document.getElementById("js-software-list");

    var mac = document.createElement("button"); //createElement生成button对象
    mac.innerHTML = 'MAC';
    mac.onclick = function() { //绑定点击事件
        document.getElementById("js-software-list").querySelectorAll("input")[0].value = "macOS Monterey";
        document.getElementById("js-software-list").querySelectorAll("input")[1].value = "12.2.1";
        document.getElementById("js-software-list").querySelectorAll("input")[2].value = "MacBook Pro";
        document.getElementById("js-software-list").querySelectorAll("input")[3].value = "2017"
        //document.getElementById("js-software-list").querySelectorAll("input")[4].value="Davinci Resolve"
        //document.getElementById("js-software-list").querySelectorAll("input")[5].value="17.2.2"
        document.getElementById("is-origin").checked = true;
        return false;
    };
    MyDiv.appendChild(mac);

    var iphone = document.createElement("button");
    iphone.innerHTML = 'iphone';
    iphone.onclick = function() { //绑定点击事件
        document.getElementById("js-software-list").querySelectorAll("input")[0].value = "iOS";
        document.getElementById("js-software-list").querySelectorAll("input")[1].value = "15.4.1";
        document.getElementById("js-software-list").querySelectorAll("input")[2].value = "iPhone";
        document.getElementById("js-software-list").querySelectorAll("input")[3].value = "13"
        //document.getElementById("js-software-list").querySelectorAll("input")[4].value="Davinci Resolve"
        //document.getElementById("js-software-list").querySelectorAll("input")[5].value="17.2.2"
        document.getElementById("is-origin").checked = true;
        return false;
    };
    MyDiv.appendChild(iphone); //添加到页面
**/
})();