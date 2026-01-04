// ==UserScript==
// @name         AnHao匿名简易助手
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  gogogo!
// @author       暗号（修改自喝水）
// @match        *://*.nimingxx.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow
// @license      MIT
// @namespace https://nimingxx.com
// @downloadURL https://update.greasyfork.org/scripts/446251/AnHao%E5%8C%BF%E5%90%8D%E7%AE%80%E6%98%93%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446251/AnHao%E5%8C%BF%E5%90%8D%E7%AE%80%E6%98%93%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function byId(id){
        return document.getElementById(id);
    }
    function byClass(id){
        return document.getElementsByClassName(id);
    }
    function byAll(id){
        return document.querySelectorAll(id);
    }
    let css = `
        /* 定义全局变量 */
        :root {
          --base_color: rgba(0, 0, 0, 0.25);
          --act_color: #18a058;
        }
        /* 隐藏input输入框 */
        #AutoChiPm {
            position: absolute;
            left: -9999px;
        }

        /* 设置自定义颜色 */
        .switch {
          position: relative;
          display: inline-block;
          width: 68px;
          margin: 5px;
          color: rgb(255, 255, 255);
          height: 20px;
          line-height: 20px;
          background-color: var(--base_color);
          border-radius: 20px;
          transition: all 0.3s 0s;
          text-align: right;
          padding:0 10px 0 0;
          vertical-align: middle;
        }

        #AutoChiPmNumber {
            width: 40px;
            border-radius: 18px;
            text-align: center;
            vertical-align: middle;
            height: 20px;
            line-height: 20px;
            margin-left: 5px;
            border: 1px #00000057;
            border-style: solid;
            box-shadow: var(--n-button-box-shadow);
        }
        /* 开关圆球 */
        .switch::after {
          content: "";
          position: absolute;
          top: 1px;
          left: 1px;
          width: 18px;
          height: 18px;

          border-radius: 18px;
          background-color: white;
          transition: all 0.3s 0s;
          box-shadow: var(--n-button-box-shadow);
        }

        input[type="checkbox"]:checked + .switch::after {
          transform: translateX(57px);
        }

        input[type="checkbox"]:checked + .switch {
          background-color: var(--act_color);
        }


    `
    function changeHTML(){
    const aaa = byId("AutoChiPm");
    const bbb = byClass("switch");
    if(aaa.checked==true){
            bbb[0].innerText='破魔开';
            bbb[0].style.cssText="text-align:left !important;padding:0 0 0 10px !important";
        }else{
            bbb[0].innerText='破魔关';
            bbb[0].style.cssText="text-align:right !important;padding:0 10px 0 0 !important";
        }
    unsafeWindow.ixxAutoChi();
    }

    // 后台运行
    function backgroundRun(){
        console.log("启用后台运行功能...");
        // 后台运行js设置，防止节能影响定时任务
        const chromeVersion = /Chrome\/([0-9.]+)/.exec(window?.navigator?.userAgent)?.[1]?.split('.')[0];
        if (chromeVersion && parseInt(chromeVersion, 10) >= 88) {
            const videoDom = document.createElement('video');
            const hiddenCanvas = document.createElement('canvas');

            videoDom.setAttribute('style', 'display:none');
            videoDom.setAttribute('muted', '');
            videoDom.muted = true;
            videoDom.setAttribute('autoplay', '');
            videoDom.autoplay = true;
            videoDom.setAttribute('playsinline', '');
            hiddenCanvas.setAttribute('style', 'display:none');
            hiddenCanvas.setAttribute('width', '1');
            hiddenCanvas.setAttribute('height', '1');
            hiddenCanvas.getContext('2d')?.fillRect(0, 0, 1, 1);
            videoDom.srcObject = hiddenCanvas?.captureStream();
        }
    }

    //储物戒切换类别
    unsafeWindow.ixxChangeGoodsType = function ChangeGoodsType(type){
            var currentType = byClass("n-radio n-radio--checked")[0];
            if(currentType.innerText.indexOf(type)<0){
                //非当前类别，需要切换类别
                var types = byClass("el-row goods-menu")[0];
                var labels = types.getElementsByTagName("label");
                for(var i=0;i<labels.length;i++){
                    if(labels[i].innerText.indexOf(type)>-1){
                        labels[i].getElementsByTagName("input")[0].click();
                        break;
                    }
                }
            }
        }

    //自动吃破魔丹
    unsafeWindow.ixxAutoChi = function AutoChi(){
        unsafeWindow.localStorage.setItem("AutoChiPm",byId("AutoChiPm").checked); //记住开关
        //console.log("检查心魔中！！！");
        var kg = byId("AutoChiPm");
        var kl = byClass("switch");
        var xm = document.getElementById("AutoChiPmNumber").value;
        var dom = document.getElementsByClassName("vt")[25].innerText;
        console.log("检查是否开启自动吃破魔丹！！！")
        if(kg.checked==true){
            kl[0].innerText='破魔开';
            kl[0].style.cssText="text-align:left !important;padding:0 0 0 10px !important";
            console.log("自动破魔已开启！");
            if(parseInt(dom)>parseInt(xm)){
                unsafeWindow.ixxChangeGoodsType("灵草丹药类");
                console.log("当前心魔："+dom);
                unsafeWindow.ixxAutoChiPm('破魔丹', document.querySelectorAll("div.g-info > span"));
                unsafeWindow.ixxAutoChiPm('使用', document.querySelectorAll("div.goods-info span"))
            }
        }else{
            kl[0].innerText='破魔关';
            kl[0].style.cssText="text-align:right !important;padding:0 10px 0 0 !important";
            console.log("自动破魔已关闭！")}
        setTimeout(AutoChi, 6000);
    }
      //自动吃药
      unsafeWindow.ixxAutoChiPm = function useHandle(name, goodsDom){     
            var timeout = 1000;
            goodsDom.forEach((item)=>{
                    if (item.textContent === name) {
                      item.click();
                         console.log("破魔丹真好吃ლ(´ڡ`ლ)")
                    } })
        }

    // 保存挂机数据
    unsafeWindow.ixxGuaJi = function ixxGuaJi(){

    }

    // 初始化方法
    function init(){
        // 页面初始化
        var href = window.location.href;
        if( byClass("login-input").length<=0){
            backgroundRun();

            // 扩展功能
            var html = "<div id='ixxdiv' style='color:#000;text-align:left;position: absolute;z-index:999;'>";
            //连点
            html+="<input id='AutoChiPmNumber' value='200' style='width:40px;'/>"
            html+="<input id='AutoChiPm' type='checkbox'  onclick='window.ixxAutoChi()'/><label for='AutoChiPm' class='switch'></label>";
            //html+="<input id='ixxbat' value='2020' style='width:40px'/>";
            //html+="<button onclick='window.ixxAgainBat()' id='ixxbatstart'>开始</button>";
            //html+="<button id='ixxbatstop' onclick='window.ixxStopAgainBat()' disabled>停止</button>";
            html+="</div>"
            var h = byClass("stripes bullets-top")[0].innerHTML;
            byClass("stripes bullets-top")[0].innerHTML = h+html;
            // 初始化挂机保存数据
            byId("AutoChiPm").checked = unsafeWindow.localStorage.getItem("AutoChiPm") =="true";
            changeHTML();
            if (typeof GM_addStyle !== "undefined") {
                    GM_addStyle(css);
                } else {
                    let styleNode = document.createElement("style");
                    styleNode.appendChild(document.createTextNode(css));
                    (document.querySelector("head") || document.documentElement).appendChild(styleNode);
                }

        } else {
            //setTimeout(autoLogin,3000);
            setTimeout(init,6000);
        }
    }
    setTimeout(init,3000);

    // Your code here...
})();