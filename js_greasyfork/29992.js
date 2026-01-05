// ==UserScript==
// @name         Arukas SSH & SSconfig
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gnerate shadowsocks QRcode in arukas docker
// @author       ztnuaa
// @match        https://app.arukas.io/apps/*
// @grant        GM_xmlhttpRequest
// @homepage     https://github.com/TimoLin/ssgo_arukas
// @downloadURL https://update.greasyfork.org/scripts/29992/Arukas%20SSH%20%20SSconfig.user.js
// @updateURL https://update.greasyfork.org/scripts/29992/Arukas%20SSH%20%20SSconfig.meta.js
// ==/UserScript==

//Refrence
//【1】ss配置文件格式，URI与base64加密，官方在线生成二维码工具
//http://shadowsocks.org/en/config/quick-guide.html
//【2】linux终端生成二维码，需要先运行 pip install qrcode
//https://github.com/shadowsocks/shadowsocks/wiki/Generate-QR-Code-for-Android-or-iOS-Clients
//【3】调用Google Chart API生成二维码图片，参考了下面的二维码在线生成网站的createCode函数，可在该网页elements中找到
//http://qr.lingbaoboy.com/

function init(){

    //以下三个参数请根据自己情况修改
      //--------[1]加密方式-------
    var method="aes-256-cfb";
    //var method=“rc4-md5”；
    //var method="m2crypto"；
    //var method="salsa20";
    //var method="chacha20";
      //---[2]shadowsocks密码----
    var password="021120215";
      //---[3]本地端口默认是1080---
    var local_port="1080";
           
    //获取port一栏中的两行ip加端口，22用于ssh登录，8989用于shadowsocks sever
    var ip22=document.getElementsByClassName('list-unstyled c-list-compact')[0].getElementsByTagName('li')[0].getElementsByTagName('a')[0].href;
    var ip89=document.getElementsByClassName('list-unstyled c-list-compact')[0].getElementsByTagName('li')[1].getElementsByTagName('a')[0].href;
    
    var str0=ip22.replace(/http\:\/\//,"ssh root@");
    var str1=str0.replace(/\//,"");  
    //ssh为ssh登录命令
    var ssh=str1.replace(/\:/," -p ");
    
    var str2=ip89.replace(/http\:\/\//,"{\"server\":\"");
    var str3=str2.replace(/io\:/,"io\", \"server_port\":");
        str3=str3.replace(/\//,""); 
    var app_name=document.getElementsByClassName("c-info__data")[1].innerHTML;
    var str4=", \"local port\":"+local_port+", \"password\":\""+password+"\", \"timeout\":600, \"method\":\""+method+"\"， \"remarks\" :\""+app_name+ "\"}";
    //shadowsocks为shadowsocks配置文件（json文件）
    var shadowsocks=str3+str4;
      
        ip89=ip89.replace(/http\:\/\//,"");
    var hostname=ip89.replace(/http\:\/\//,"");
        hostname=hostname.replace(/\//,"");
    //ss字符串格式为  加密方式:密码@ip地址:远程端口
    var config_str=method+":"+password+"@"+hostname; //+"#"+btoa(app_name);

    //btoa()为base64加密函数，js内置.
    //加密后的ss字符串: ss://base64加密处理
    var config_base64="ss:\/\/"+btoa(config_str);

    //用linux的同学可以通过这个命令在终端生成二维码，详见Refrence【2】
    var command_line_config="echo -n \"ss:\/\/\"\`echo -n "+config_str+" | base64` | qr";

    //添加一行元素，标题为“命令”，内容有三行，第一行为ssh登录命令，第二行为通过Linux终端生成二维码的命令，第三行为shadowsocks配置文件的内容
    var content=document.createElement("div");
    var title1="命令";
    content.className="c-info__row";
    content.innerHTML="<div class=\"c-info__title\">"+title1+"</div><div class=\"c-info__data\"><div id=\"ember723\" class=\"u-mgt13 u-mgb13 ember-view\"><ul class=\"list list-unstyled\"> <li>"+ssh+"</li> <li>"+command_line_config+ "</li> <li>"+shadowsocks+"<li></ul></div></div> </div>";
    document.getElementsByClassName("c-info u-mgt34 u-mgb34")[0].appendChild(content);
    
    //添加一行元素，显示shadowsocks配置文件的二维码图片
      //图片大小
    var imagesize=500;
    var QR_code=document.createElement("img");
      //调用google chart api，生成二维码，详见Refrence【3】
    QR_code.src="https://chart.googleapis.com/chart?cht=qr&chs="+imagesize+"x"+imagesize+"&choe=UTF-8&chld=M|1&chl="+config_base64+"";
    var content_qr=document.createElement("div");
    var title2="二维码菌";
    content_qr.className="c-info__row";
    content_qr.innerHTML="<div class=\"c-info__title\">"+title2+"</div>";
    content_qr.appendChild(QR_code);
    document.getElementsByClassName("c-info u-mgt34 u-mgb34")[0].appendChild(content_qr);
     
}

//加载完页面后显示按钮，由于某些我也不知道为什么的原因，window.onload命令（即加载完页面命令）在arukas这个网页的判定很奇怪，会在显示网页内容之前执行window.onload命令。所以我只能把这个按钮放在左上角，就是已经加载的网页元素开头
window.onload=button();

//添加按钮，用来触发调用函数
function button(){
$("#ember-bootstrap-modal-container").append('<a id="I_am_a_button"> 点我生成二维码</a>');
    $("#I_am_a_button").click(function(){
        init();
    });
}
