// ==UserScript==
// @name         视频全屏显示时间
// @namespace    http://tampermonkey.net/
// @namespace    https://www.medfav.com/webnav/
// @version      0.4.12
// @description  因为大多数视频全屏后就看不到时间了，要看时间还得退出全屏，看到有的播放器全屏播放时可以在右上角显示一个系统当前时间，这种方式很不错，所以决定给视频网站也做一个这样的增强。这个脚本的作用只有一个，就是在视频左上角显示一个系统时间，方便全屏看视频期间随时了解时间。
// @description  0.2.1 增加搜狐视频 0.2.2 增加mkv、mp4结尾的链接匹配，时间标签层级从3改为11 0.2.3增加YouTube支持
// @description  0.2.4 增加avi,mov,rmvb,webm,flv格式视频支持;修复带参数的视频链接播放时不显示时间；修复某些页面时间位置不在画面上的问题；
// @description  0.2.5 本次更新为时间标签添加了自由拖动功能,以解决某些视频网站视频右上角水印对时间显示产生干扰；0.2.6 紧急修复一个时间标签拖动的问题，影响0.2.5版，正在使用0.2.5版的尽快升级；0.2.7 修复拖动导致的一些问题 0.2.8 修复一些体验问题 0.2.9 修复拖动时间标签导致视频暂停的问题：
// @description  0.3.0 修复拖动的一些问题；添加 左上角/顶部中间/右上角 三个固定位置循环切换；添加恢复位置功能；0.3.1 修复标签位置调整的一些问题 0.3.2 小样式修复
// @description  0.3.3 移除拖动功能，拖动导致较多问题 0.3.4 修复一些显示问题 0.3.5 增加更多级别字体大小
// @description  0.3.6 增加设置弹框；增加顶部间距设置；增加字体大小设置；优化计时器字体宽度；0.3.7 修复设置界面样式，修改字体样式,添加www.bdys03.com支持;0.3.8 修正上一版为兼容MacOS字体导致Windows字体丑的问题 0.3.9 增加欧乐影院\AcFun\虎牙\斗鱼(标签位置有问题，请通过偏移处理)\YY(首页有遮盖问题，请调节位置解决)\抖音\快手\企鹅体育\芒果TV；增加了左右偏移设置；扩大了偏移范围
// @description  0.4.0 增加仅全屏显示计时器选项；百度网盘使用canvas播放视频，不支持（除非有办法替换成video标签播放）；0.4.1 设置窗口允许自由拖动；设置窗口标题栏增加关闭按钮；适配秒懂百科; 0.4.2 修复B站首页Banner显示计时器问题 0.4.3 增加颜色和透明度自定义；增加时钟偏移；增加 hxzxer.com 网站支持; 0.4.4 修复时间格式支持 0.4.5 修复时区问题 0.4.6 修复设置窗口位置问题
// @description  0.4.7 增加隐藏时间条功能，修复潜在的问题；0.4.8 增加显示秒功能，修复一些问题；0.4.9 修复哔哩哔哩直播不显示时间标签；0.4.10 修复TrustedHTML问题 0.4.11 修复上一个版本引入TrustedHTML导致的浏览器兼容性问题 0.4.12 增加www.mxdm.xyz网站支持
// @author       medfav
// @match        *://www.tvyb03.com/*
// @match        *://lpl.qq.com/*
// @match        *://v.qq.com/*
// @match        *://live.qq.com/*
// @match        *://*.bilibili.com/*/*
// @match        *://*.bilibili.com/*?*
// @match        *://tv.cctv.com/*
// @match        *://www.mgtv.com/*
// @match        *://*.iqiyi.com/*
// @match        *://*.youku.com/*
// @match        *://*.le.com/*
// @match        *://weibo.com/*
// @match        *://*.sohu.com/*
// @match        *://*.youtube.com/*
// @match        *://*.acfun.cn/*
// @match        *://*.huya.com/*
// @match        *://*.douyu.com/*
// @match        *://*.yy.com/*
// @match        *://*.douyin.com/*
// @match        *://*.kuaishou.com/*
// @match        *://*.ixigua.com/*
// @match        *://*.gfysys1.com/*
// @match        *://*.buyaotou.xyz/*
// @match        *://*.bdys03.com/*
// @match        *://*.olevod.com/*
// @match        *://pan.baidu.com/*
// @match        *://baike.baidu.com/video*
// @match        *://hxzxer.com/*
// @match        *://danmu.yhdmjx.com/m3u8.php*
// @match        *://*/*.mkv*
// @match        *://*/*.mp4*
// @match        *://*/*.avi*
// @match        *://*/*.mov*
// @match        *://*/*.rmvb*
// @match        *://*/*.webm*
// @match        *://*/*.flv*
// @match        *://*/*.m3u8*
// @grant    GM_registerMenuCommand
// @grant    GM_setValue
// @grant    GM_getValue
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @run-at       document-end
// @grant        unsafeWindow
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/452520/%E8%A7%86%E9%A2%91%E5%85%A8%E5%B1%8F%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/452520/%E8%A7%86%E9%A2%91%E5%85%A8%E5%B1%8F%E6%98%BE%E7%A4%BA%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // let timerInterval = 0;
    let fullShow = GM_getValue("fullShow");
    let hideTimeBar = GM_getValue("hideTimeBar");
    let showSecond = GM_getValue("showSecond");
    let pos = GM_getValue("pos");//左(0)、中(1)、右(2)
    let pos_top_space = GM_getValue("pos_top");//标签和顶部的距离
    let pos_transverse_space = GM_getValue("pos_transverse");//标签左右偏移
    let fontSize_min = GM_getValue("min_font");//最小
    let fontSize_small = GM_getValue("small_font");//小
    let fontSize_medium = GM_getValue("medium_font");//中等
    let fontSize_large = GM_getValue("large_font");//大
    let fontSize_max = GM_getValue("max_font");//最大
    let fontStyle = "微软雅黑";//字体样式
    let fontColor = GM_getValue("font_color");//字体颜色
    let bgColor = GM_getValue("bg_color");//背景颜色
    let barOpacity = GM_getValue("bar_opacity");//时间标签整体透明度
    let timeOffset = GM_getValue("time_offset");//时间偏移
//     if(pos == undefined){
//         GM_setValue("pos",2);
//         pos = 2;
//     }
//     if(pos_top_space == undefined){
//         GM_setValue("pos_top",10);
//         pos_top_space = 10;
//     }
    // 初始化值
    fullShow = (fullShow == undefined)?false:fullShow;
    hideTimeBar = (hideTimeBar == undefined)?false:hideTimeBar;
    showSecond = (showSecond == undefined)?true:showSecond;
    pos = (pos == undefined)?2:pos;
    pos_top_space = (pos_top_space == undefined)?10:pos_top_space;
    pos_transverse_space = (pos_transverse_space == undefined)?0:pos_transverse_space;

    fontSize_min = (fontSize_min == undefined)?10:fontSize_min;
    fontSize_small = (fontSize_small == undefined)?10:fontSize_small;
    fontSize_medium = (fontSize_medium == undefined)?20:fontSize_medium;
    fontSize_large = (fontSize_large == undefined)?24:fontSize_large;
    fontSize_max = (fontSize_max == undefined)?28:fontSize_max;

    fontColor = (fontColor == undefined)?"#e1e1e1ff":fontColor;
    bgColor = (bgColor == undefined)?"#0000004d":bgColor;
    barOpacity = (barOpacity == undefined)?1:barOpacity;
    timeOffset = (timeOffset == undefined)?8:timeOffset;

    let menu1 = GM_registerMenuCommand ("设置", openSetting, "");
    // // 计时器位置
    // var pos = 2;
    // // 计时器字体大小
    // var fontSize = 32;
    // // 计时器字体
    // var fontStyle = "微软雅黑";

    function openSetting() {
        var settingBox = document.querySelector("#vt-setting");
        if(settingBox){
            return;
        }
        var settingStyle = document.createElement("style");
        settingStyle.type="text/css";
        settingStyle.id="vt-classs";
        var settingStyleInner = `
        div#vt-setting {
            top: 200px;
            left: calc(100vw - 300px);
            width: 250px;
            border: 1px solid gray;
            position: absolute;
            display: block;
            z-index: 100000;
            margin: 0;
            padding: 0;
            border-radius: 6px;
            font-size: small;
            color: black;
            background-color: white;
        }
        #vts-title {
            background-color:gray;
            display: inline-block;
            width: 100%;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            padding: 3px 0px;
            text-align: center;
            color: white;
            cursor: move;
            hight: 20px;
            line-hight: 20px;
            user-select:none;
        }
        #vts-close-btn {
            right: 0px;top:
            0px;font-size: 17px;
            position: absolute;
            background-color: #d77c84;
            width: 44px;
            height: 26px;
            line-hight: 27px;
            border-top-right-radius: 5px;
            user-select:none;
        }
        #vts-close-btn:hover {
            background-color: #e81123;
            cursor: default;
        }
        #vts-pos input,#vts-general input {
            margin-right: 5px;
        }
        #vts-pos input:is(:nth-child(4),:nth-child(6)) {
            margin-left: 35px;
        }
        .vts-fieldset {
            border: 1px solid #c7c7c7;
            padding: 5px;
            margin: auto 5px;
        }
        .vts-fieldset>legend {
            font-size: small;
            color: gray;
            width: auto;
            padding: 0px 5px;
        }
        #vts-font input,#vts-pos-top,#vts-pos-transverse,#vts-font-style-name,#vts-color input {
            width: 110px;
            font-size: revert;
            outline: revert;
            border: revert;
            appearance: revert;
        }
        .vts-input-number,.vts-input,.vts-select {
            line-height: revert;
            appearance: revert;
            margin-top: 1px;
        }
        .vts-select {
            margin-top: 2px;
        }
        #vts-font select {
            width: 150px;
        }
        #vts-submit {
            margin-top: 10px;
            text-align: center;
        }
        #vts-submit>input {
            margin: 0;
            padding: 0 10px;
            appearance: auto;
            border: revert;
            border-radius: revert;
            background: revert;
            font-size: revert;
        }
        #vts-submit>input:not(:first-child) {
            margin-left: 20px;
        }
        #vts-save.disable {
            cursor: not-allowed;
            pointer-events: none;
            background-color: #c0c0c0;
            border-color: #8a8a8a;
            border-width: 1px;
            border-radius: 3px;
            color: azure;
            padding: 1px 10px;
        }
        #vts-tips {
            font-size: 13px;
            color: green;
            margin: 10px auto 5px 10px;
        }`;
        settingStyle.textContent = settingStyleInner;
        document.querySelector("head").appendChild(settingStyle);
        // CreateStyleElement("vt-classs", settingStyleInner, false)

        settingBox = document.createElement("div");
        settingBox.id = "vt-setting";
        var innerHtml = `<span id="vts-title">设置
        <span id="vts-close-btn">╳</span>
    </span>
    <div id="vts-general">
        <fieldset class="vts-fieldset">
            <legend>通用设置</legend>
            <input type="checkbox" name="show-full-screen" id="vts-general-check0">
            <label for="left">仅全屏时显示</label>
            <input type="checkbox" name="hide-time-bar" id="vts-general-check1">
            <label for="left">隐藏时间条</label><br>
            <input type="checkbox" name="show-second" id="vts-general-check2">
            <label for="left">显示秒</label><br>
            <label title="时钟偏移,范围-12 ~ 14，单位小时">时钟偏移💬：</label><input type="number" name="time-offset" id="vts-time-offset"
                class="vts-input-number" min="-12" max="14" value="8">
        </fieldset>
    </div>
    <div id="vts-pos">
        <fieldset class="vts-fieldset">
            <legend>计时器位置</legend>
            <input type="radio" name="timer-position" id="vts-pos-radio0"><label for="left">左</label>
            <input type="radio" name="timer-position" id="vts-pos-radio1"><label for="left">中</label>
            <input type="radio" name="timer-position" id="vts-pos-radio2"><label for="left">右</label>
            <br><label for="fontSize">顶部距离：</label><input type="number" name="fontSize" id="vts-pos-top"
                class="vts-input-number" min="-1000" max="1000" value="10">
            <br><label for="fontSize">左右偏移：</label><input type="number" name="fontSize" id="vts-pos-transverse"
                class="vts-input-number" min="-2000" max="2000" value="10">
        </fieldset>
    </div>
    <div id="vts-font">
        <fieldset class="vts-fieldset">
            <legend>计时器字体</legend>
            <label title="视频画幅很小时，显示最小字体">最小💬：</label><input type="number" name="fontSize" id="vts-font-size-min"
                class="vts-input-number" min="9" max="99" value="10"><br>
            <label title="视频画幅小时，显示较小字体">较小💬：</label><input type="number" name="fontSize" id="vts-font-size-small"
                class="vts-input-number" min="9" max="99" value="10"><br>
            <label title="视频画幅一般大小时，显示一般大小字体">一般💬：</label><input type="number" name="fontSize"
                id="vts-font-size-medium" class="vts-input-number" min="9" max="99" value="20"><br>
            <label title="视频画幅大时，显示较大字体">较大💬：</label><input type="number" name="fontSize" id="vts-font-size-large"
                class="vts-input-number" min="9" max="99" value="24"><br>
            <label title="视频画幅很大时，显示最大字体">最大💬：</label><input type="number" name="fontSize" id="vts-font-size-max"
                class="vts-input-number" min="9" max="99" value="28"><br />
            <br style="display:none;" />
            <label for="fontStyle">字体：</label>
            <select disabled name="fontStyle" class="vts-select" id="vts-font-style-name">
                <option value="微软雅黑">微软雅黑</option>
                <option value="宋体">宋体</option>
                <option value="黑体">黑体</option>
            </select>
        </fieldset>
    </div>
    <div id="vts-color">
        <fieldset class="vts-fieldset">
            <legend>颜色/透明度</legend>
            <label title="文字颜色: CSS支持的所有颜色格式(命名(如:Red、Green、Blue等),hex,rgb,hsl,lch)">前景色💬：</label><input type="text" name="font-color" id="vts-font-color"
                class="vts-input" size="9" maxlength="30" value="#e1e1e1ff"><br>
            <label title="背景颜色: CSS支持的所有颜色格式(命名(如:Red、Green、Blue等),hex,rgb,hsl,lch)">背景色💬：</label><input type="text" name="bg-color" id="vts-bg-color"
                class="vts-input" size="9" maxlength="30" value="#0000004d"><br>
            <label title="整体透明度(范围0-1,可以为小数)">透明度💬：</label><input type="number" name="opacity" id="vts-opacity"
                class="vts-input-number" step="0.05" min="0" max="1" value="1"><br>
        </fieldset>
    </div>
    <div id="vts-submit">
        <input id="vts-save" type="button" value="保存">
        <input id="vts-close" type="button" value="关闭">
        <input id="vts-reset" type="button" value="重置">
    </div>
    <div id="vts-tips">Tips：点击保存记住设置</div>`;
        const escapeHTMLPolicy = getEscapeHTMLPolicy();
        if (escapeHTMLPolicy != undefined ) {
            var escaped  = getEscapeHTMLPolicy().createHTML(innerHtml);
            settingBox.innerHTML = escaped;
        } else {
            settingBox.innerHTML = innerHtml;
        }
        document.querySelector("body").appendChild(settingBox);
        // 添加事件
        document.querySelector("#vts-general-check0").addEventListener("change",function(){radioChange(this.checked,'check')});
        document.querySelector("#vts-general-check1").addEventListener("change",function(){radioChange(this.checked,'hidetimebar')});
        document.querySelector("#vts-general-check2").addEventListener("change",function(){radioChange(this.checked,'showSecond')});
        document.querySelector("#vts-pos-radio0").addEventListener("change",function(){radioChange(0,'radio')});
        document.querySelector("#vts-pos-radio1").addEventListener("change",function(){radioChange(1,'radio')});
        document.querySelector("#vts-pos-radio2").addEventListener("change",function(){radioChange(2,'radio')});
        document.querySelector("#vts-pos-top").addEventListener("input",function(){radioChange(this.value,'top')});
        document.querySelector("#vts-pos-transverse").addEventListener("input",function(){radioChange(this.value,'transverse')});
        document.querySelector("#vts-font-size-min").addEventListener("input",function(){radioChange(this.value,'fontsize-min')});
        document.querySelector("#vts-font-size-small").addEventListener("input",function(){radioChange(this.value,'fontsize-small')});
        document.querySelector("#vts-font-size-medium").addEventListener("input",function(){radioChange(this.value,'fontsize-medium')});
        document.querySelector("#vts-font-size-large").addEventListener("input",function(){radioChange(this.value,'fontsize-large')});
        document.querySelector("#vts-font-size-max").addEventListener("input",function(){radioChange(this.value,'fontsize-max')});

        document.querySelector("#vts-font-color").addEventListener("input",function(){radioChange(this.value,'font-color')});
        document.querySelector("#vts-bg-color").addEventListener("input",function(){radioChange(this.value,'bg-color')});
        document.querySelector("#vts-opacity").addEventListener("input",function(){radioChange(this.value,'opacity')});

        document.querySelector("#vts-time-offset").addEventListener("input",function(){radioChange(this.value,'timeoffset')});

        document.querySelector("#vts-save").addEventListener("click",vtsSaveSetting);
        document.querySelector("#vts-close").addEventListener("click",vtsClose);
        document.querySelector("#vts-close-btn").addEventListener("click",vtsClose);
        document.querySelector("#vts-reset").addEventListener("click",vtsResetSetting);
        initSetting();
        // 使设置窗口可拖动:
        dragElement(document.getElementById("vt-setting"));
    }

    // 转换为可信元素
    function getEscapeHTMLPolicy() {
        if (window.trustedTypes && trustedTypes.createPolicy) {
            return trustedTypes.createPolicy("myEscapePolicy", {
                createHTML: (string) => string,
            });
        }
        return undefined;
    }

    // 初始化设置界面
    function initSetting() {
        document.querySelector("#vts-general-check0").checked = fullShow;
        document.querySelector("#vts-general-check1").checked = hideTimeBar;
        document.querySelector("#vts-general-check2").checked = showSecond;
        switch (pos) {
            case 0:
                document.querySelector("#vts-pos-radio0").checked = true;
                break;
            case 1:
                document.querySelector("#vts-pos-radio1").checked = true;
                break;
            case 2:
                document.querySelector("#vts-pos-radio2").checked = true;
        }
        document.querySelector("#vts-pos-top").value = pos_top_space;
        document.querySelector("#vts-pos-transverse").value = pos_transverse_space;
        document.querySelector("#vts-font-size-min").value = fontSize_min;
        document.querySelector("#vts-font-size-small").value = fontSize_small;
        document.querySelector("#vts-font-size-medium").value = fontSize_medium;
        document.querySelector("#vts-font-size-large").value = fontSize_large;
        document.querySelector("#vts-font-size-max").value = fontSize_max;
        //document.querySelector("#vts-font-size-number").value = fontSize;
        document.querySelector("#vts-font-color").value = fontColor;
        document.querySelector("#vts-bg-color").value = bgColor;
        document.querySelector("#vts-opacity").value = barOpacity;
        document.querySelector("#vts-time-offset").value = timeOffset;
    }

    var tempPos = 0;
    function radioChange(params,type) {
        if(type=="check") {
            fullShow = params;
        }
        if(type=="hidetimebar") {
            hideTimeBar = params;
        }
        if(type=="showSecond") {
            showSecond = params;
        }
        if(type=="radio") {
            pos = params;
        }
        if (type=="top") {
            if ((params < -1000 || params > 1000)) {
                document.querySelector("#vts-save").classList.add("disable");
            } else {
                pos_top_space = Number(params);
                document.querySelector("#vts-save").classList.remove("disable");
            }
        }
        if (type=="transverse") {
            if ((params < -2000 || params > 2000)) {
                document.querySelector("#vts-save").classList.add("disable");
            } else {
                pos_transverse_space = Number(params);
                document.querySelector("#vts-save").classList.remove("disable");
            }
        }
        if (type=="number") {
            if ((params < 9 || params > 99)) {
                document.querySelector("#vts-save").classList.add("disable");
            } else {
                document.querySelector("#vts-save").classList.remove("disable");
            }
        }
        if (type.indexOf("fontsize")==0) {
            if ((params < 9 || params > 99)) {
                document.querySelector("#vts-save").classList.add("disable");
            } else {
                switch (type) {
                    case "fontsize-min":
                        fontSize_min = params;
                        break;
                    case "fontsize-small":
                        fontSize_small = params;
                        break;
                    case "fontsize-medium":
                        fontSize_medium = params;
                        break;
                    case "fontsize-large":
                        fontSize_large = params;
                        break;
                    case "fontsize-max":
                        fontSize_max = params;
                }
                fontStyle = "微软雅黑";//字体样式
                document.querySelector("#vts-save").classList.remove("disable");
            }
        }
        if (type.indexOf("color")>0) {
            if ( isColor(params) ) {
                switch (type) {
                    case "font-color":
                        fontColor = params;
                        break;
                    case "bg-color":
                        bgColor = params;
                        break;
                }
                document.querySelector("#vts-save").classList.remove("disable");
            } else {
                document.querySelector("#vts-save").classList.add("disable");
            }
        }
        if (type == "opacity") {
            if (params < 0 || params >1 ) {
                document.querySelector("#vts-save").classList.add("disable");
            } else {
                barOpacity = params;
                document.querySelector("#vts-save").classList.remove("disable");
            }
        }
        if (type == "timeoffset") {
            if (params < -12 || params > 14 || params % 1 != 0 ) {
                document.querySelector("#vts-save").classList.add("disable");
            } else {
                timeOffset = params;
                document.querySelector("#vts-save").classList.remove("disable");
            }
        }
    }

    // 保存按钮
    function vtsSaveSetting() {
        //pos = tempPos;
        GM_setValue("fullShow",fullShow);
        GM_setValue("hideTimeBar",hideTimeBar);
        GM_setValue("showSecond",showSecond);
        GM_setValue("pos",pos);
        GM_setValue("pos_top",pos_top_space);
        GM_setValue("pos_transverse",pos_transverse_space);
        GM_setValue("min_font",fontSize_min);
        GM_setValue("small_font",fontSize_small);
        GM_setValue("medium_font",fontSize_medium);
        GM_setValue("large_font",fontSize_large);
        GM_setValue("max_font",fontSize_max);

        GM_setValue("font_color",fontColor);
        GM_setValue("bg_color",bgColor);
        GM_setValue("bar_opacity",barOpacity);

        GM_setValue("time_offset",timeOffset);

        //fontSize = document.querySelector("#vts-font-size-number").value;
        fontStyle = document.querySelector("#vts-font-style-name").value;

        let textTips1 = "Tips：保存成功！";
        let textTips2 = "Tips：再次保存成功！";
        let currentText = document.querySelector("#vts-tips").innerText;
        if(currentText == textTips1) {
            document.querySelector("#vts-tips").innerText = textTips2;
        } else {
            document.querySelector("#vts-tips").innerText = textTips1;
        }
    }
    // 取消按钮
    function vtsClose() {
        var settingBox = document.querySelector("#vt-setting");
        var settingStyle = document.querySelector("#vt-classs");
        if(settingBox){
            settingBox.parentNode.removeChild(settingBox);
        }
        if(settingStyle){
            settingStyle.parentNode.removeChild(settingStyle);
        }
    }
    // 重置按钮
    function vtsResetSetting() {
        fullShow = false;
        hideTimeBar = false;
        showSecond = true;
        pos = 2;
        pos_top_space = 10;
        pos_transverse_space = 0;
        fontSize_min = 10;//最小
        fontSize_small = 10;//小
        fontSize_medium = 20;//中等
        fontSize_large = 24;//大
        fontSize_max = 28;//最大
        //fontSize = 32;
        fontStyle = "微软雅黑";
        fontColor = "#e1e1e1ff";
        bgColor = "#0000004d";
        barOpacity = 1;
        timeOffset = 8;

        initSetting();
        document.querySelector("#vts-tips").innerText = "已重置为默认,点击“保存”记住设置！";
        //vtsClose();
    }
     /**
     * [isFullscreen 判断浏览器是否全屏]
     * @return [全屏则返回当前调用全屏的元素,不全屏返回false]
     */
    function isFullscreen(){
        return document.fullscreenElement    ||
               document.msFullscreenElement  ||
               document.mozFullScreenElement ||
               document.webkitFullscreenElement || false;
    }

    // 创建时间标签,width：视频宽度，用于设置时间数字大小
    function createTag(element){
        let style = "z-index: 101;/*color: #e1e1e1;*/margin:5px;padding: 5px;border-radius: 4px;line-height: 0.8em;/*background-color: #0000004d;opacity: 0.8;*/user-select: none;/*text-shadow: 1px 1px 2px black, -1px -1px 2px black;*/height: min-content;font-family:Arial;font-weight:400;letter-spacing:0px;/*pointer-events: none;*/";
        let videoWidth = element.offsetWidth;
        let videoTop = element.offsetTop;
        let videoLeft = element.offsetLeft;
        let space = 10;
        let fontSize = 10;
        let tagWidth = 50;
        if(videoWidth >= 1700){
            space = 10;
            fontSize = fontSize_max;
            tagWidth = 120;
        } else if(videoWidth >= 1200){
            space = 10;
            fontSize = fontSize_large;
            tagWidth = 104;
        } else if(videoWidth >= 720){
            space = 10;
            fontSize = fontSize_medium;
            tagWidth = 77;
        } else if(videoWidth <= 200){
            space = 5;
            fontSize = fontSize_min;
            tagWidth = 50;
        } else {
            space = 10;
            fontSize = fontSize_small;
            tagWidth = 50;
        }
        style += "font-size: "+fontSize+"px;top: " + (videoTop + pos_top_space) + "px;";
        style += "color: " + fontColor + ";background-color: " + bgColor + ";opacity: " + barOpacity + ";"
        switch(pos) {
            case 0:
                style += "position: absolute;left: " + videoLeft + pos_transverse_space + space + "px;";
                break;
            case 1:
                style += "position: absolute;left: " + videoLeft + pos_transverse_space + ((videoWidth - tagWidth)/2) + "px;";
                break;
            case 2:
                style += "position: absolute;right: " + videoLeft + pos_transverse_space + space + "px;";
                break;
        }
        let timeBar = document.createElement("div");
        timeBar.className = "timer";
        timeBar.style = style;
        timeBar.title = "点击可临时隐藏时间条";
        // CreateStyleElement("timerbar-style", ".timer {" + style + "}", true);
        return timeBar;
    }

    // 改变时间标签样式
    function changeTag(element){
        let fullScreenElement = isFullscreen();
//         let settingElement = document.body.querySelector("#vt-setting");
//         if(fullScreenElement != false && settingElement != undefined) {
//             let fullScrSetting = fullScreenElement.querySelector("#vt-setting");
//             if(fullScrSetting == undefined){
//                 fullScreenElement.querySelector(".timer").parentElement.appendChild(settingElement);
//             } else {
//                 fullScreenElement.remove();
//             }
//         }
        if((fullScreenElement == false && fullShow == true) || hideTimeBar == true){
            element.parentElement.querySelector(".timer").style.display = "none";
            return;
        } else {
            element.parentElement.querySelector(".timer").style.display = "unset";
        }
        let videoTop = element.offsetTop;
        let videoLeft = element.offsetLeft;
        if(element.offsetWidth > 200){
            if(element.offsetWidth >= 1700){
                element.parentElement.querySelector(".timer").style.fontSize = fontSize_max + "px";
            }else if(element.offsetWidth >= 1200){
                element.parentElement.querySelector(".timer").style.fontSize = fontSize_large + "px";
            } else if(element.offsetWidth >= 720){
                element.parentElement.querySelector(".timer").style.fontSize = fontSize_medium + "px";
            } else if(element.offsetWidth <= 200) {
                element.parentElement.querySelector(".timer").style.fontSize = fontSize_min + "px";
            } else {
                element.parentElement.querySelector(".timer").style.fontSize = fontSize_small + "px";
            }
            // element.previousSibling.style.top = videoTop + 10 + "px";
            // element.previousSibling.style.right = videoLeft + 10 + "px";
        } else {
            // element.previousSibling.style.top = videoTop + 5 + "px";
            // element.previousSibling.style.right = videoLeft + 5 + "px";
        }
        // 改变颜色和透明度
        element.parentElement.querySelector(".timer").style.color = fontColor;
        element.parentElement.querySelector(".timer").style.backgroundColor = bgColor;
        element.parentElement.querySelector(".timer").style.opacity = barOpacity;

        changePos(element);
    }

    function changePos(videoTag){
        let videoTop = videoTag.offsetTop;
        let videoLeft = videoTag.offsetLeft;
        let videoWidth = videoTag.offsetWidth;
        let space = 10;
        if(videoWidth <= 200){
            space = 5;
        } else {
            space = 10;
        }
        videoTag.parentElement.querySelector(".timer").style.top = (videoTop + pos_top_space) + "px";
        // videoTag.previousSibling.style.marginTop = space + "px";
        switch(pos) {
            case 0:
                videoTag.parentElement.querySelector(".timer").style.removeProperty("right");
                //videoTag.previousSibling.style.position = 'absolute';
                videoTag.parentElement.querySelector(".timer").style.left = videoLeft + pos_transverse_space + space + "px";
                break;
            case 1:
                videoTag.parentElement.querySelector(".timer").style.removeProperty("right");
                //videoTag.previousSibling.style.position = 'unset';
                videoTag.parentElement.querySelector(".timer").style.left = videoLeft + pos_transverse_space + ((videoWidth - videoTag.parentElement.querySelector(".timer").offsetWidth)/2) + "px";
                break;
            case 2:
                videoTag.parentElement.querySelector(".timer").style.removeProperty("left");
                //videoTag.previousSibling.style.position = 'absolute';
                videoTag.parentElement.querySelector(".timer").style.right = videoLeft + pos_transverse_space + space + "px";
                break;
        }
    }

    // 获取Video标签
    function getVideoTag(){
        setTimeout(()=>{
            let videoTagList = Array.from(document.getElementsByTagName('video'));
            if(videoTagList.length == 0){
                getVideoTag();
            } else {
                insertTimeBar(videoTagList);
                // setTimer();
                getVideoTag();
            }
        },1000)
    }
    getVideoTag();

    // 加入时间标签
    function insertTimeBar(videoTagList){
        videoTagList.forEach((element)=>{
            if (element.parentElement.querySelector(".timer") == null ){
                // 多个时间条不能用同一个对象
                let timeBar = createTag(element);
                // 给时间标签添加事件
                addElementEvent(timeBar);
                element.parentElement.insertBefore(timeBar,element);
            } else {
                changeTag(element);
            }
        })
    }

    // 给元素添加事件
    function addElementEvent(element){
        element.onmouseover = function(even) {
            even.stopPropagation();
        }
        element.onmousemove = function(even) {
            even.stopPropagation();
        }
        element.onmouseenter = function(even) {
            even.stopPropagation();
        }
        //点击时临时隐藏时间条
        element.onclick = function(even) {
            even.stopPropagation();
            hideTimeBar = true;
            element.style.display = "none";
        }
    }

    // 设置计时器
    function setTimer(){
        // clearInterval(timerInterval);
        // timerInterval =
        setInterval(()=>{
            var date = new Date(Date.now() + (new Date().getTimezoneOffset() + (timeOffset * 60)) * 60 * 1000);
            // var hour = date.getHours();
            // var min = date.getMinutes()>9?date.getMinutes():'0' + date.getMinutes();
            // var sec = date.getSeconds()>9?date.getSeconds():'0' + date.getSeconds();
            let timer = document.getElementsByClassName("timer");
            // 当没有时间条时，添加（懒加载会出现这种情况）
            if(timer == undefined){
                let videoTagList = Array.from(document.getElementsByTagName('video'));
                insertTimeBar(videoTagList);
            }
            // 给每一个时间条设置时间
            let timeBarList = Array.from(document.getElementsByClassName("timer"));
            timeBarList.forEach((timeBar)=>{
                timeBar.innerText = showSecond ? formatDateTime(date, "H:mm:ss") : formatDateTime(date, "H:mm");
            })
        },1000)
    }
    // 启动计时器
    setTimer();

    function formatDateTime(date, format) {
        const o = {
            'M+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12, // 小时
            'H+': date.getHours(), // 小时
            'm+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
            'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
            S: date.getMilliseconds(), // 毫秒
            a: date.getHours() < 12 ? '上午' : '下午', // 上午/下午
            A: date.getHours() < 12 ? 'AM' : 'PM', // AM/PM
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (let k in o) {
            if (new RegExp('(' + k + ')').test(format)) {
                format = format.replace(
                    RegExp.$1,
                    RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
                );
            }
        }
        return format;
    }

    // 提示框，调用方法：Toast('提示：好用记得点赞哦！',1000);
    let dialog;
    let timer;
    function Toast(msg,duration){
        if(timer != null && dialog != null){
            clearTimeout(timer);
            document.body.removeChild(dialog);
            dialog = null;
        }
        duration=isNaN(duration)?3000:duration;
        dialog = document.createElement('div');
        dialog.innerText = msg;
        dialog.style.cssText="font-size:.32rem;color:green;background-color:white;border:solid green 2px;padding:10px 15px;margin:0 0 0 -60px;border-radius:4px;position:fixed;top:2%;left:93%;/*width:200px;*/text-align:left;z-index:9999";
        document.body.appendChild(dialog);
        timer = setTimeout(function() {
            document.body.removeChild(dialog);
            dialog = null;
        }, duration);
    }

    // 移动设置窗口
    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        var originalonmousemove = null, originalonmouseup = null;
        if (document.getElementById("vts-title")) {
            // 如果存在，标题是您从中移动 DIV 的位置:
            document.getElementById("vts-title").onmousedown = dragMouseDown;
            // 防止在子元素上拖动
            document.getElementById("vts-title").children.onmousedown = function(){};
        } else {
            // 否则，从 DIV 内的任何位置移动 DIV:
            elmnt.onmousedown = dragMouseDown;
        }
        elmnt.onmouseup = closeDragElement;

        function dragMouseDown(e) {
            e = e || window.event;
            if(e.target.id == "vts-close-btn"){
                return;
            }
            e.preventDefault();
            // 在启动时获取鼠标光标位置:
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 记录原事件
            originalonmousemove = document.onmousemove;
            originalonmouseup = document.onmouseup;
            // 每当光标移动时调用一个函数:
            document.onmousemove = elementDrag;
            document.onmouseup = closeDragElement;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 计算新的光标位置:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 设置元素的新位置:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            // 释放鼠标按钮时停止移动:
            // document.onmousemove = null;
            // document.onmouseup = null;
            // 释放鼠标按钮时停止移动，还原原事件
            document.onmousemove = originalonmousemove;
            document.onmouseup = originalonmouseup;
        }
    }

    function CreateStyleElement(id, cssText, isUpdate){
        var styleElement = document.getElementById(id);
        if (styleElement == undefined) {
            // 创建一个新的 <style> 元素
            styleElement = document.createElement("style");
            styleElement.id = id;

            // 创建包含 CSS 规则的文本
            // var cssText = ".highlight { background-color: yellow; }"
            var cssTextNode = document.createTextNode(cssText);

            // 将文本添加到 <style> 元素中
            styleElement.appendChild(cssTextNode);

            // 将 <style> 元素添加到网页的 <head> 元素中
            document.head.appendChild(styleElement);
        } else {
            if (isUpdate) {
                styleElement.innerText = cssText;
            }
        }
    }

    function isColor(strColor) {
        const s = new Option().style;
        s.color = strColor;
        return s.color !== '';
    }
})();
