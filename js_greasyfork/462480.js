// ==UserScript==
// @name         XJTU-zdpj
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自动评教
// @author       crosspi
// @match        http://ehall.xjtu.edu.cn/jwapp/sys/wspjyyapp/*
// @match        https://ehall.xjtu.edu.cn/jwapp/sys/wspjyyapp/*
// @icon         http://ehall.xjtu.edu.cn/resources/app/5856333445645704/4.0.0_TR1/icon_72.png?_=1603332021000
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/462480/XJTU-zdpj.user.js
// @updateURL https://update.greasyfork.org/scripts/462480/XJTU-zdpj.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //进入评教
    function jrpj(){
        var pj_title=document.querySelector("body > div.bh-paper-pile-dialog.single > div > h2")
        //if(document.querySelector("#pjglTopCard")!=null){alert("运行脚本失败，请在<待我评教>中的<过程性评教>或<期末评教>页面使用！！！");location.reload();}
        var pj=document.getElementsByClassName("card-btn blue");
        if(pj[0]!=null){pj[0].click();pj_title.textContent='正在评教……'}
        if(pj[0]==null){alert("当前页面无评教");location.reload();}
    }
    //自动评教
    function zdpj() {
        //单选非常满意
        //setTimeout(function(){console.log("正在评教")}, 3000 )
        var btnlist = document.querySelectorAll("label:nth-child(1).bh-radio-label");
        for (var i = 0; i < btnlist.length; i++) {
            btnlist[i].click();}
        let inputing=document.getElementsByClassName("bh-txt-input__txtarea");//意见和建议文本框
        inputing[0].value=GM_getValue("set_ad_value","好");//输入建议
        var tj=document.getElementsByClassName("bh-btn bh-btn-success bh-btn-large");
        tj[0].click();//提交评教
        let qd=document.getElementsByClassName("bh-dialog-btn bh-bg-primary bh-color-primary-5");
        qd[0].click();//确定提交
    }
    //zd()连续自动评教
    function zd(){
        jrpj()
        setTimeout(zdpj, 888)
    }
    //-----------------------------------------------------------------------------------------------------------------------------------
    //按钮设置
    //pj_value()更改评教评价默认值
    function pj_value(){
        var ad_value=window.prompt("请输入你的评教评价",GM_getValue("set_ad_value","好"));
        if(ad_value!=null){GM_setValue("set_ad_value",ad_value);alert("成功更改评价默认值！")}
    }
    //set_btn()添加按钮
    function set_btn(){
        var style_css=".style_css {position: relative;float: right;background-color: rgba(0,0,0,.16);color: #fff;height: 28px;padding: 4px 28px 4px 8px;cursor: pointer;margin-left: 4px;}"
        GM_addStyle(style_css)
        var btn1 = document.createElement('div');
        var btn2 = document.createElement('div');
        btn1.innerHTML='<div class="style_css">自动评教</div>';
        btn2.innerHTML='<div class="style_css">更改评价</div>';
        btn1.addEventListener('click',foo);//不加()
        btn2.addEventListener('click',pj_value);//不加()
        function foo(){
            confirm('请在<待我评教>中的<过程性评教>或<期末评教>页面使用，点击确认即可开始');
            //if(pj[0]!=null){pj[0].click();}
            //if(pj[0]==null){alert("当前页面无评教");location.reload();}
            //setInterval(zd,9000);//间隔9000ms连续自动评教
            (function loop() {
                setTimeout(function () {
                    zd()
                    loop();
                }, 7000);//间隔7000ms连续自动评教
})();


        }
        var btnfs=document.querySelector("body > header > header.bh-header.sc-animated > div > div > div.bh-headerBar-menu")
        btnfs.appendChild(btn2);
        btnfs.appendChild(btn1);}
    setTimeout(set_btn,1888)//等待页面加载1888ms
    //window.addEventListener("load", set_btn,false);
})();