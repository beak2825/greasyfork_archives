// ==UserScript==
// @name         古诗文网增强
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  一个增强古诗文网功能的插件
// @author       haozexu
// @match        https://*.gushiwen.cn/*
// @icon         https://gitee.com/haozexu/hzx-scripts/raw/master/LogoHzx2023.png
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.4/dist/jquery.min.js
// @license      GPL v3.0
// @downloadURL https://update.greasyfork.org/scripts/466763/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/466763/%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function showErwema(){
        console.log("")
    }
    if(window.showErweima!=undefined){
        window.showErweima=showErwema;
        console.log("[HzxScript]Login popup blocked");
       
        var element = document.getElementsByClassName("son1")[0];
        element.appendChild(lnk);
    }
    document.querySelector("a[href='/user/collect.aspx'][rel='nofollow']").href="/user/login.aspx";
    setCookie("gsw2017user","hzxscript")
    checkSvip=function () {
        setCookie("userPlay",'hzxscript|0|0|1|0|0|0|0|0|0|0|0')
    }
    showlayuiPay=function(){}
    console.log("[HzxScript]Payment removed")
    $("div.abcd").remove();
    $("div.juzioncont").remove();
    //var text="<div style=\"background-color:#F0EFE2;margin-top:20px;padding-top:20px;padding-bottom:20px;text-align:center\"><h1 style=\"font-size:x-large\">HzxScript已关闭广告</h1><br><p>HzxScript:古诗文网优化工具 - <a href=\"https://greasyfork.org/zh-CN/scripts/466763-%E5%8F%A4%E8%AF%97%E6%96%87%E7%BD%91%E5%A2%9E%E5%BC%BA\">haozexu</a></p></div>"
    //$("div.main3 div.right").append(text);

    var btn = document.createElement("button");
    var node = document.createTextNode("回到顶部");
    btn.appendChild(node);
    btn.onclick=function(){scrollTo(0,0);};
    btn.style="position:fixed;right:10px;bottom:10px;background-color:gray;height:50px;width:50px";
    $("div.main3").append(btn);

    console.log("[HzxScript]Ads blocked");
    console.log("[HzxScript]Sollback button added");

    var nodelist=document.getElementsByTagName('a');
    //console.log("[HzxScript]"+nodelist);
    function ZiliaoShowCallback(nodethis){
          if(nodethis.href.includes("javascript:ziliaoShow")||nodethis.href.includes("javascript:fanyiShow")||nodethis.href.includes("javascript:shangxiShow")){
                eval(nodethis.href);//自动展开所有
          }
    }
    function ZiliaoCloseCallback(nodethis){
          if(nodethis.href.includes("javascript:ziliaoClose")||nodethis.href.includes("javascript:fanyiClose")||nodethis.href.includes("javascript:shangxiClose")){
                eval(nodethis.href);//自动展开所有
          }
    }
    var btn_show = document.createElement("button");
    var node_text = document.createTextNode("全部展开");
    btn_show.appendChild(node_text);
    btn_show.style="position:fixed;right:10px;bottom:80px;background-color:gray;height:50px;width:50px;display:block;";
    var btn_show2 = document.createElement("button");
    var node_text2 = document.createTextNode("全部折叠");
    btn_show2.appendChild(node_text2);
    btn_show2.style="position:fixed;right:10px;bottom:80px;background-color:gray;height:50px;width:50px;display:none;";
    var button_state=true;
    btn_show.onclick=function(){
        if(button_state){
              button_state=false;
              btn_show.style['display']='none';
              btn_show2.style['display']='block';
              for(var i=0;i<nodelist.length;i++){
                  //console.log('HzxScript:'+nodelist[i].href);
                  ZiliaoShowCallback(nodelist[i]);
              }
        }else{
              button_state=true;
              btn_show.style['display']='block';
              btn_show2.style['display']='none';
              for(var j=0;j<nodelist.length;j++){
                  //console.log('HzxScript:'+nodelist[j].href);
                  ZiliaoCloseCallback(nodelist[j]);
              }
        }
    };
    btn_show2.onclick=btn_show.onclick;
    $("div.main3").append(btn_show2);
    $("div.main3").append(btn_show);
})();