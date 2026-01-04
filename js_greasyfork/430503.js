// ==UserScript==
// @name         自动健康上报
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  盐工自动健康上报脚本
// @author       Alphant
// @match        https://health.xiamin.tech/user/profile/
// @match        https://health.xiamin.tech/system/registry/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430503/%E8%87%AA%E5%8A%A8%E5%81%A5%E5%BA%B7%E4%B8%8A%E6%8A%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/430503/%E8%87%AA%E5%8A%A8%E5%81%A5%E5%BA%B7%E4%B8%8A%E6%8A%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //设置按钮
    var button = document.createElement("button"); //创建一个按钮
    button.textContent = "点击启动自动健康上报"; //按钮内容
    button.style.width = "150px"; //按钮宽度
    button.style.height = "38px"; //按钮高度
    button.style.align = "center"; //文本居中
    button.style.color = "white"; //按钮文字颜色
    button.style.background = "#c8e6c6"; //按钮底色
    button.style.border = "1px solid #c8e6c6"; //边框属性
    button.style.borderRadius = "4px"; //按钮四个角弧度
    button.style.marginLeft="5px"; //左边距
    button.addEventListener("click", clickBotton); //监听按钮点击事件
    button.setAttribute("id","btn_start");

    var btn_stop = document.createElement("button");
    btn_stop.textContent = "停止"; //按钮内容
    btn_stop.style.width = "60px"; //按钮宽度
    btn_stop.style.height = "38px"; //按钮高度
    btn_stop.style.align = "center"; //文本居中
    btn_stop.style.color = "white"; //按钮文字颜色
    btn_stop.style.background = "#cc0033"; //按钮底色
    btn_stop.style.border = "1px solid #cc0033"; //边框属性
    btn_stop.style.borderRadius = "4px"; //按钮四个角弧度
    btn_stop.style.marginLeft="5px"; //左边距
    btn_stop.addEventListener("click", Stop); //监听按钮点击事件

    var FLAG; //设置标记 0：未上报，1：已上报
    var TIME=1000*60; //时间间隔一小时3600ms
    var URL="https://health.xiamin.tech/";
    var USER_PROFILE=URL+"user/profile/";
    var SYSTEM_REGISTRY=URL+"system/registry/";
    var COUNT=0;
    var START;
    var cookies=document.cookie;

    function WhenLoad(){
        var url=window.location.href;
        console.log("url:"+url);
        if(url===USER_PROFILE){ //user页
            //读取cookie中的FLAG
            FLAG=getCookie("FLAG");
            if(FLAG==null){
                FLAG="0";
                document.cookie="FLAG="+FLAG;
            }
            starts();
            clickBotton();
        }
        else if(url===SYSTEM_REGISTRY){ //上报页
            console.log("已条转");
            var yes=document.getElementsByClassName("van-button")[3]; //2为否，3为是
            //console.log(yes);
            yes.click();
        }
        else return;
    }
    window.onload=WhenLoad();

    //getCookie方法
    function getCookie(cookie_name) {
        var allcookies = document.cookie;
        var cookie_pos = allcookies.indexOf(cookie_name);

        if (cookie_pos !== -1) {
            cookie_pos = cookie_pos + cookie_name.length + 1;
            var cookie_end = allcookies.indexOf(";", cookie_pos);
            if (cookie_end === -1) {
                cookie_end = allcookies.length;
            }
            var value = unescape(allcookies.substring(cookie_pos, cookie_end));
        }
        return value;
    }

    //设置按钮点击事件
    function clickBotton(){
        console.log("开始啦");
        console.log(document.cookie);
        START=setInterval(starts,TIME);
        //document.getElementById("btn_start").setAttribute("disabled", true);
    }

    function starts(){
        var date=new Date();
        var hour=date.getHours();
        if(hour>=0&&hour<=9){
            if(FLAG=="0"){
                FLAG="1";
                document.cookie="FLAG="+FLAG; //将新的FLAG写入cookie
                Report();
            }
            else{
                console.log("已上报 flag:"+FLAG);
            }
        }
        else{
            FLAG="0";
            document.cookie="FLAG="+FLAG; //将新的FLAG写入cookie
            console.log("不在上报时间 "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+" flag:"+FLAG);
            if(date.getHours()==0){
                location.reload();
            }
        }


    }

    //上报
    function Report(){
        //var health=document.getElementById("regist_button");
        //health.click();
        //console.log("点击了:"+health);
        window.location.href='/system/registry/';
        return;
    }

    //停止脚本
    function Stop(){
        clearInterval(START);
        //COUNT=0;
        console.log("停止啦");
        //document.getElementById("btn_start").setAttribute("disabled", false);
    }

    //将按钮绑定到页面
    var page=document.getElementsByClassName("card-action")[0];
    if(page!=null){
        page.appendChild(button);
        page.appendChild(btn_stop);
    }

})();









