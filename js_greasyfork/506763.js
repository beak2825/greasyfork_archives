// ==UserScript==
// @name         💯 懒人专用系列 ——— 视频下载修复 自用
// @namespace    lr-toolbox-VideoDownload
// @version      1.0.23
// @description  ⭕支持下载B站(bilibili)，抖音，快手，西瓜视频，Youtube等网站视频。❌拒绝收费。⭕持续更新。
// @author       zanghuaao
// @icon         https://lf1-cdn-tos.bytegoofy.com/goofy/ies/douyin_web/public/favicon.ico
// @match        *://*.douyin.com/*
// @match        *://*.kuaishou.com/*
// @match        *://*.ixigua.com/*
// @match        *://*.bilibili.com/*
// @match        *://*.youtube.com/*
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/4.1.1/crypto-js.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_download
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @connect      iesdouyin.com
// @connect      47.99.158.118
// @connect      api.typechrome.com
// @connect      gitlab.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506763/%F0%9F%92%AF%20%E6%87%92%E4%BA%BA%E4%B8%93%E7%94%A8%E7%B3%BB%E5%88%97%20%E2%80%94%E2%80%94%E2%80%94%20%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E4%BF%AE%E5%A4%8D%20%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/506763/%F0%9F%92%AF%20%E6%87%92%E4%BA%BA%E4%B8%93%E7%94%A8%E7%B3%BB%E5%88%97%20%E2%80%94%E2%80%94%E2%80%94%20%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E4%BF%AE%E5%A4%8D%20%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==


/*
***********************************************************
应Greasyfork.org网站规则要求，
懒人脚本将视频解析、音乐下载、视频下载等功能拆分为多个脚本:
https://greasyfork.org/zh-CN/scripts/467776
https://greasyfork.org/zh-CN/scripts/469604
https://greasyfork.org/zh-CN/scripts/469689
https://greasyfork.org/zh-CN/scripts/468015
https://greasyfork.org/zh-CN/scripts/469521
可自行分别安装。
***********************************************************
*/

(function() {
    'use strict';
     /*--config--*/
    var Config ={

        couponUrl:window.location.href,

        couponHost:window.location.host,

        isMobile:/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent),

        iconVipTop:360,

        iconVipPosition : 'left',

        iconVipWidth : 40,

        couponTimerNum : 100,//100次等于10秒

        couponWaitTime : 100,

        iconWaitTime : 100,

        iconVipOpacity:100,

        selectedLeft:'selected',

        selectedRight:'',

        dyVideoDownload:GM_getValue('dyVideoDownload',22),

        ksVideoDownload:GM_getValue('ksVideoDownload',22),

        xiguaVideoDownload:GM_getValue('xiguaVideoDownload',22),

        biliVideoDownload:GM_getValue('biliVideoDownload',22),

        youtubeVideoDownload:GM_getValue('youtubeVideoDownload',22),
     }
    var {couponUrl,
         couponHost,
         isMobile,
         iconVipTop,
         iconVipPosition,
         iconVipWidth,
         iconVipOpacity,
         couponTimerNum,
         couponWaitTime,
         iconWaitTime,
         selectedLeft,
         selectedRight,
         dyVideoDownload,
         ksVideoDownload,
         xiguaVideoDownload,
         biliVideoDownload,
         youtubeVideoDownload
        } = Config;
    /*--lang--*/
    var lang = {
        videoDownload:'设置',
        dyVideoDownload:'抖音下载',
        ksVideoDownload:'快手下载',
        xiguaVideoDownload:'西瓜下载',
        biliVideoDownload:'B站 (bilibili) 下载',
        youtubeVideoDownload:'youtube下载',
        scriptsinstall:'脚本安装',
        scriptsuse:'使用方法',
        question:'常见问题',
        tggroup:'Telegram'
    };

    var videoDownload = [
        {funcName:'videoDownload',name:'dyVideoDownload',match:/^https?:\/\/www\.douyin\.com\/?.+$/,isWebOpen:dyVideoDownload},
        {funcName:'videoDownload',name:'ksVideoDownload',match:/^https?:\/\/www\.kuaishou\.com\/?.+$/,isWebOpen:ksVideoDownload},
        {funcName:'videoDownload',name:'xiguaVideoDownload',match:/^https?:\/\/www\.ixigua\.com\//,isWebOpen:xiguaVideoDownload},
        {funcName:'videoDownload',name:'biliVideoDownload',match:/^https?:\/\/www\.bilibili\.com\//,isWebOpen:biliVideoDownload},
        {funcName:'videoDownload',name:'youtubeVideoDownload',match:/^https?:\/\/www\.youtube\.com\//,isWebOpen:youtubeVideoDownload}
    ];

    var downloadOption = [{name:'直接下载',id:'toDownload'},{name:'复制链接',id:'toCopy'},{name:'打开文件',id:'toLink'}];

    /*--create style--*/

    var domHead = document.getElementsByTagName('head')[0];

    var domStyle = document.createElement('style');

    domStyle.type = 'text/css';

    domStyle.rel = 'stylesheet';

    class BaseClass{

        constructor(){

            GM_registerMenuCommand("设置", () => this.menuSet());

            this.setStyle();

        }

        setStyle(){
            let menuSetStyle = `
                        .zhmMask{
                            z-index:999999999;
                            background-color:#000;
                            position: fixed;top: 0;right: 0;bottom: 0;left: 0;
                            opacity:0.8;
                        }
                        .wrap-box{
                            z-index:1000000000;
                            position:fixed;;top: 50%;left: 50%;transform: translate(-50%, -200px);
                            width: 300px;
                            color: #555;
                            background-color: #fff;
                            border-radius: 5px;
                            overflow:hidden;
                            font:16px numFont,PingFangSC-Regular,Tahoma,Microsoft Yahei,sans-serif !important;
                            font-weight:400 !important;
                        }
                        .setWrapHead{
                            background-color:#f24443;height:40px;color:#fff;text-align:center;line-height:40px;
                        }
                        .setWrapLi{
                            margin:0px;padding:0px;
                        }
                        .setWrapLi li{
                            background-color: #fff;
                            border-bottom:1px solid #eee;
                            margin:0px !important;
                            padding:12px 20px;
                            display: flex;
                            justify-content: space-between;align-items: center;
                            list-style: none;
                        }

                        .setWrapLiContent{
                            display: flex;justify-content: space-between;align-items: center;
                        }
                        .setWrapSave{
                            position:absolute;top:-2px;right:10px;font-size:24px;cursor:pointer
                        }
                        .iconSetFoot{
                            position:absolute;bottom:0px;padding:10px 20px;width:100%;
                        z-index:1000000009;background:#fef9ef;
                        }
                        .iconSetFootLi{
                            margin:0px;padding:0px;
                            font-size: 12px;
                        }

                        .iconSetFootLi li{
                            display: inline-flex;
                            padding:0px 2px;
                            justify-content: space-between;align-items: center;
                            font-size: 12px;
                        }
                        .iconSetFootLi li a{
                            color:#555;
                        }
                        .iconSetFootLi a:hover {
                            color:#fe6d73;
                        }
                        .iconSetPage{
                            z-index:1000000001;
                            position:absolute;top:0px;left:300px;
                            background:#fff;
                            width:300px;
                            height:100%;
                        }
                        .iconSetUlHead{
                        padding:0px;
                        margin:0px;
                        }
                        .iconSetPageHead{
                            border-bottom:1px solid #ccc;
                            height:40px;
                            line-height:40px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            background-color:#fe6d73;
                            color:#fff;
                            font-size: 15px;
                        }
                        .iconSetPageLi{
                            margin:0px;padding:0px;
                        }
                        .iconSetPageLi li{
                            list-style: none;
                            padding:8px 20px;
                            border-bottom:1px solid #eee;
                        }
                        .zhihuSetPage{
                            z-index:1000000002;position:absolute;top:0px;left:300px;background:#fff;width:300px;height:100%;
                        }
                        .iconSetPageInput{
                            display: flex !important;justify-content: space-between;align-items: center;
                        }
                        .zhihuSetPageLi{
                            margin:0px;padding:0px;
                            height:258px;
                            overflow-y: scroll;
                        }

                        .zhihuSetPageContent{
                            display: flex !important;justify-content: space-between;align-items: center;
                        }

                        .zhm_circular{
                            width: 40px;height: 20px;border-radius: 16px;transition: .3s;cursor: pointer;box-shadow: 0 0 3px #999 inset;
                        }
                        .round-button{
                            width: 20px;height: 20px;;border-radius: 50%;box-shadow: 0 1px 5px rgba(0,0,0,.5);transition: .3s;position: relative;
                        }
                        .zhm_back{
                            border: solid #FFF; border-width: 0 3px 3px 0; display: inline-block; padding: 3px;transform: rotate(135deg);  -webkit-transform: rotate(135deg);margin-left:10px;cursor:pointer;
                        }
                        .to-right{
                            margin-left:20px; display: inline-block; padding: 3px;transform: rotate(-45deg); -webkit-transform: rotate(-45deg);cursor:pointer;

                        }
                        .iconSetSave{
                            font-size:24px;cursor:pointer;margin-right:5px;margin-bottom:4px;color:#FFF;
                        }
                        .zhm_set_page{
                            z-index:1000000003;
                            position:absolute;
                            top:0px;left:300px;
                            background:#fff;
                            width:300px;
                            height:100%;
                        }
                        .zhm_set_page_header{
                            border-bottom:1px solid #ccc;
                            height:40px;
                            line-height:40px;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            background-color:#fe6d73;
                            color:#fff;
                            font-size: 15px;
                        }
                        .zhm_set_page_content{
                            display: flex !important;justify-content: space-between;align-items: center;
                        }
                        .zhm_set_page_list{
                            margin:0px;padding:0px;
                            height: 220px;
                            overflow-y: scroll;
                        }

                        .zhm_set_page_list::-webkit-scrollbar {
                            /*滚动条整体样式*/
                            width : 0px;  /*高宽分别对应横竖滚动条的尺寸*/
                            height: 1px;
                        }
                        .zhm_set_page_list::-webkit-scrollbar-thumb {
                            /*滚动条里面小方块*/
                            border-radius   : 2px;
                            background-color: #fe6d73;
                        }
                        .zhm_set_page_list::-webkit-scrollbar-track {
                            /*滚动条里面轨道*/
                            box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                            background   : #ededed;
                            border-radius: 10px;
                        }
                        .zhm_set_page_list li{
                            /*border-bottom:1px solid #ccc;*/
                            padding:12px 20px;
                            display:block;
                            border-bottom:1px solid #eee;
                        }
                        li:last-child{
                            border-bottom:none;
                        }
                        .zhm_scroll{
                        overflow-y: scroll !important;
                        }
                        .zhm_scroll::-webkit-scrollbar {
                            /*滚动条整体样式*/
                            width : 0px;  /*高宽分别对应横竖滚动条的尺寸*/
                            height: 1px;
                        }
                        .zhm_scroll::-webkit-scrollbar-thumb {
                            /*滚动条里面小方块*/
                            border-radius   : 2px;
                            background-color: #fe6d73;
                        }
                        .zhm_scroll::-webkit-scrollbar-track {
                            /*滚动条里面轨道*/
                            box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
                            background   : #ededed;
                            border-radius: 10px;
                        }
                        /*-form-*/
                        :root {
                            --base-color: #434a56;
                            --white-color-primary: #f7f8f8;
                            --white-color-secondary: #fefefe;
                            --gray-color-primary: #c2c2c2;
                            --gray-color-secondary: #c2c2c2;
                            --gray-color-tertiary: #676f79;
                            --active-color: #227c9d;
                            --valid-color: #c2c2c2;
                            --invalid-color: #f72f47;
                            --invalid-icon: url("data:image/svg+xml;charset=utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%3E%20%3Cpath%20d%3D%22M13.41%2012l4.3-4.29a1%201%200%201%200-1.42-1.42L12%2010.59l-4.29-4.3a1%201%200%200%200-1.42%201.42l4.3%204.29-4.3%204.29a1%201%200%200%200%200%201.42%201%201%200%200%200%201.42%200l4.29-4.3%204.29%204.3a1%201%200%200%200%201.42%200%201%201%200%200%200%200-1.42z%22%20fill%3D%22%23f72f47%22%20%2F%3E%3C%2Fsvg%3E");
                        }
                        .text-input {
                            font-size: 16px;
                            position: relative;
                            right:0px;
                            z-index: 0;
                        }
                        .text-input__body {
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            appearance: none;
                            background-color: transparent;
                            border: 1px solid var(--gray-color-primary);
                            border-radius: 3px;
                            height: 1.7em;
                            line-height: 1.7;
                            overflow: hidden;
                            padding: 2px 1em;
                            text-overflow: ellipsis;
                            transition: background-color 0.3s;
                            width:55%;
                            font-size:14px;
                            box-sizing: initial;
                        }
                        .text-input__body:-ms-input-placeholder {
                            color: var(--gray-color-secondary);
                        }
                        .text-input__body::-moz-placeholder {
                            color: var(--gray-color-secondary);
                        }
                        .text-input__body::placeholder {
                            color: var(--gray-color-secondary);
                        }

                        .text-input__body[data-is-valid] {
                            padding-right: 1em;

                        }
                        .text-input__body[data-is-valid=true] {
                            border-color: var(--valid-color);
                        }
                        .text-input__body[data-is-valid=false] {
                            border-color: var(--invalid-color);
                            box-shadow: inset 0 0 0 1px var(--invalid-color);
                        }
                        .text-input__body:focus {
                            border-color: var(--active-color);
                            box-shadow: inset 0 0 0 1px var(--active-color);
                            outline: none;
                        }
                        .text-input__body:-webkit-autofill {
                            transition-delay: 9999s;
                            -webkit-transition-property: background-color;
                            transition-property: background-color;
                        }
                        .text-input__validator {
                            background-position: right 0.5em center;
                            background-repeat: no-repeat;
                            background-size: 1.5em;
                            display: inline-block;
                            height: 100%;
                            left: 0;
                            position: absolute;
                            top: 0;
                            width: 100%;
                            z-index: -1;
                        }
                        .text-input__body[data-is-valid=false] + .text-input__validator {
                            background-image: var(--invalid-icon);
                        }
                        .select-box {
                            box-sizing: inherit;
                            font-size: 16px;
                            position: relative;
                            transition: background-color 0.5s ease-out;
                            width:90px;
                        }
                        .select-box::after {
                            border-color: var(--gray-color-secondary) transparent transparent transparent;
                            border-style: solid;
                            border-width: 6px 4px 0;
                            bottom: 0;
                            content: "";
                            display: inline-block;
                            height: 0;
                            margin: auto 0;
                            pointer-events: none;
                            position: absolute;
                            right: -72px;
                            top: 0;
                            width: 0;
                            z-index: 1;
                        }
                        .select-box__body {
                            box-sizing: initial;
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            appearance: none;
                            background-color: transparent;
                            border: 1px solid var(--gray-color-primary);
                            border-radius: 3px;
                            cursor: pointer;
                            height: 1.7em;
                            line-height: 1.7;
                            padding-left: 1em;
                            padding-right: calc(1em + 16px);
                            width: 140%;
                            font-size:14px;
                            padding-top:2px;
                            padding-bottom:2px;
                        }
                        .select-box__body[data-is-valid=true] {
                            border-color: var(--valid-color);
                            box-shadow: inset 0 0 0 1px var(--valid-color);
                        }
                        .select-box__body[data-is-valid=false] {
                            border-color: var(--invalid-color);
                            box-shadow: inset 0 0 0 1px var(--invalid-color);
                        }
                        .select-box__body.focus-visible {
                            border-color: var(--active-color);
                            box-shadow: inset 0 0 0 1px var(--active-color);
                            outline: none;
                        }
                        .select-box__body:-webkit-autofill {
                            transition-delay: 9999s;
                            -webkit-transition-property: background-color;
                            transition-property: background-color;
                        }
                        .textarea__body {
                            -webkit-appearance: none;
                            -moz-appearance: none;
                            appearance: none;
                            background-color: transparent;
                            border: 1px solid var(--gray-color-primary);
                            border-radius: 0;
                            box-sizing: initial;
                            font: inherit;
                            left: 0;
                            letter-spacing: inherit;
                            overflow: hidden;
                            padding: 1em;
                            position: absolute;
                            resize: none;
                            top: 0;
                            transition: background-color 0.5s ease-out;
                            width: 100%;
                            }
                        .textarea__body:only-child {
                            position: relative;
                            resize: vertical;
                        }
                        .textarea__body:focus {
                            border-color: var(--active-color);
                            box-shadow: inset 0 0 0 1px var(--active-color);
                            outline: none;
                        }
                        .textarea__body[data-is-valid=true] {
                            border-color: var(--valid-color);
                            box-shadow: inset 0 0 0 1px var(--valid-color);
                        }
                        .textarea__body[data-is-valid=false] {
                            border-color: var(--invalid-color);
                            box-shadow: inset 0 0 0 1px var(--invalid-color);
                        }

                        .textarea ._dummy-box {
                            border: 1px solid;
                            box-sizing: border-box;
                            min-height: 240px;
                            overflow: hidden;
                            overflow-wrap: break-word;
                            padding: 1em;
                            visibility: hidden;
                            white-space: pre-wrap;
                            word-wrap: break-word;
                        }
                        .toLeftMove{
                            nimation:moveToLeft 0.5s infinite;
                            -webkit-animation:moveToLeft 0.5s infinite; /*Safari and Chrome*/
                            animation-iteration-count:1;
                            animation-fill-mode: forwards;
                        }

                        @keyframes moveToLeft{
                            from {left:200px;}
                            to {left:0px;}
                        }

                        @-webkit-keyframes moveToLeft /*Safari and Chrome*/{
                            from {left:200px;}
                            to {left:0px;}
                        }

                        .toRightMove{
                            nimation:moveToRight 2s infinite;
                            -webkit-animation:moveToRight 2s infinite; /*Safari and Chrome*/
                            animation-iteration-count:1;
                            animation-fill-mode: forwards;
                        }
                        @keyframes moveToRight{
                            from {left:0px;}
                            to {left:2000px;}
                        }

                        @-webkit-keyframes moveToRight /*Safari and Chrome*/{
                            from {left:0px;}
                            to {left:200px;}
                        }

                    `;

            domStyle .appendChild(document.createTextNode(menuSetStyle));

            domHead.appendChild(domStyle);
        }

        menuSet(){

            var _this = this;

            var setListJson = [
                {'optionName':lang.dyVideoDownload,'optionID':'dyVideoDownload','default':dyVideoDownload},
                {'optionName':lang.ksVideoDownload,'optionID':'ksVideoDownload','default':ksVideoDownload},
                {'optionName':lang.xiguaVideoDownload,'optionID':'xiguaVideoDownload','default':xiguaVideoDownload},
                {'optionName':lang.biliVideoDownload,'optionID':'biliVideoDownload','default':biliVideoDownload},
            ];

            let setHtml = "<div class='zhmMask'></div>";

            setHtml +="<div class='wrap-box' id='setWrap'>";

            setHtml +="<ul class='iconSetUlHead'><li class='iconSetPageHead'><span></span><span>"+lang.videoDownload+"</span><span class='iconSetSave'>×</span></li></ul>";

            setHtml +="<ul class='setWrapLi'>";

            for(var setN=0;setN<setListJson.length;setN++){

                var listValue = GM_getValue(setListJson[setN].optionID,'22');

                let backColor,arrowColor,switchBackCorlor;

                if(listValue != 22){
                    backColor = '#fff';
                    arrowColor= '#EEE';
                    switchBackCorlor = '#FFF';

                }else{
                    backColor = '#fe6d73';
                    arrowColor = '#CCC';
                    switchBackCorlor = '#FFE5E5';
                }

                if(setListJson[setN].optionID == ''){
                    arrowColor = '#EEE';
                };
                setHtml +="<li><span>"+setListJson[setN].optionName+"</span>";

                setHtml +="<div class='setWrapLiContent'>";

                setHtml +="<div class='zhm_circular' id='"+setListJson[setN].optionID+"' style='background-color: "+switchBackCorlor+";'><div class='round-button' style='background: "+backColor+";left: "+listValue+"px'></div></div>";

                //setHtml +="<span class='to-right' data='"+setListJson[setN].optionID+"' style='border: solid "+arrowColor+"; border-width: 0 3px 3px 0;'></span></div></li>";

                setHtml +="</div></li>";
            }

            setHtml +="</ul>";

            setHtml +="<div style='height:40px;'></div>";

            setHtml +="<div class='iconSetFoot' style=''>";

            setHtml +="<ul class='iconSetFootLi'>";

            setHtml +="<li><a href='https://t.me/+sGo6ZZvy54wzYTll' target='_blank'>"+lang.tggroup+"</a></li>";

            setHtml +='</ul>';

            setHtml +='</div>';

            setHtml += "</div>";

            if(document.querySelector('#setMask')) return;

            this.createElement('div','zhmMenu');

            let zhmMenu = document.getElementById('zhmMenu');

            zhmMenu.innerHTML = setHtml;

            let timerZhmIcon = setInterval(function(){

                if (document.querySelector('#zhmMenu')){

                    clearInterval(timerZhmIcon); // 取消定时器

                    let circular = document.querySelectorAll('.zhm_circular');

                    circular.forEach(function(item){

                        item.addEventListener('click', function(e){

                            let buttonStyle = item.children[0].style;

                            let left = buttonStyle.left;

                            left = parseInt(left);

                            let listLeftValue;

                            if(left==0){

                                buttonStyle.left = '22px';

                                buttonStyle.background = '#fe6d73';

                                item.style.background='#ffE5E5';

                                if(item.nextSibling && item.nextSibling.getAttribute('data')){

                                    item.nextSibling.setAttribute('style','border: solid #ccc;border-width: 0 3px 3px 0;')
                                }

                                listLeftValue = 22;

                            }else{

                                buttonStyle.left = '0px';

                                buttonStyle.background = '#fff';

                                item.style.background='#fff';

                                if(item.nextSibling){

                                    item.nextSibling.setAttribute('style','border: solid #EEE;border-width: 0 3px 3px 0;')

                                }

                                listLeftValue = 0;
                            }

                            let setListID = item.id;


                            GM_setValue(setListID,listLeftValue);

                        })

                    });

                    document.querySelector('.iconSetSave').addEventListener('click',()=>{

                        location.href=location.href;

                    })

                }

            })

        }

        createElement(dom,domId){

            var rootElement = document.body;

            var newElement = document.createElement(dom);

            newElement.id = domId;

            var newElementHtmlContent = document.createTextNode('');

            rootElement.appendChild(newElement);

            newElement.appendChild(newElementHtmlContent);

        }

        request(method,url,data,isCookie=''){

            let request = new XMLHttpRequest();

            return new Promise((resolve,reject)=>{

                request.onreadystatechange=function(){

                    if(request.readyState==4){

                        if(request.status==200){

                            resolve(request.responseText);

                        }else{

                            reject(request.status);
                        }

                    }
                }

                request.open(method,url);
                //request.withCredentials = true;
                if(isCookie){
                    request.withCredentials = true;
                }
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                request.send(data);

            })

        }

        setCookie(cname,cvalue,exdays){

            var d = new Date();

            d.setTime(d.getTime()+(exdays*24*60*60*1000));

            var expires = "expires="+d.toGMTString();

            document.cookie = cname+"="+cvalue+"; "+expires;
        }

        getCookie(cname){
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
            }
            return "";
        }

        getQueryString(e) {
            var t = new RegExp("(^|&)" + e + "=([^&]*)(&|$)");
            var a = window.location.search.substr(1).match(t);
            if (a != null) return a[2];
            return "";
        }

        getUrlParams(url){
            let reg = /([^?&+#]+)=([^?&+#]+)/g;
            let obj={};
            url.replace(reg,(res,$1,$2)=>{obj[$1]=$2});
            return obj;
        }

        static getElement(css,all=''){

            return new Promise((resolve,reject)=>{

                let num = 0;

                let timer = setInterval(function(){

                    num++

                    let dom;

                    if(all == false){

                        dom = document.querySelector(css);

                        if(dom){

                            clearInterval(timer);

                            resolve(dom);

                        }

                    }else{

                        dom = document.querySelectorAll(css);

                        if(dom.length>0){

                            clearInterval(timer);

                            resolve(dom);

                        }
                    }

                    if(num==20){
                        clearInterval(timer);
                        resolve(false);
                    }

                },300)

                })

        }

        static toast(msg,duration){

            duration=isNaN(duration)?3000:duration;

            let toastDom = document.createElement('div');

            toastDom.innerHTML = msg;

            //toastDom.style.cssText="width: 60%;min-width: 150px;opacity: 0.7;height: 30px;color: rgb(255, 255, 255);line-height: 30px;text-align: center;border-radius: 5px;position: fixed;top: 40%;left: 20%;z-index: 999999;background: rgb(0, 0, 0);font-size: 12px;";
            toastDom.style.cssText='padding:2px 15px;min-height: 36px;line-height: 36px;text-align: center;transform: translate(-50%);border-radius: 4px;color: rgb(255, 255, 255);position: fixed;top: 50%;left: 50%;z-index: 9999999;background: rgb(0, 0, 0);font-size: 16px;'

            document.body.appendChild(toastDom);

            setTimeout(function() {

                var d = 0.5;

                toastDom.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';

                toastDom.style.opacity = '0';

                setTimeout(function() { document.body.removeChild(toastDom) }, d * 1000);

            }, duration);

        }

        //create zhmLogoIcon
        zhmLogo(){

            var _this = this;

            let sortDiv = iconVipPosition=='left'?'row':'row-reverse';

            let playVideoStyle = `
               .zhm_play_vidoe_icon{
                  padding-top:2px;
                  cursor:pointer;
                  z-index:999999;
                  position:fixed;${iconVipPosition}:5px;top:${iconVipTop}px;
                  text-align:center;
                  overflow:visible;
                  display:flex;
                  flex-direction:${sortDiv};
                  width:auto;
               }
               .zhm_play_video_wrap{
                  z-index:9999999;
                  overflow: hidden;
                  width:300px;
               }
               .iconLogo{
               opacity:${iconVipOpacity/100};
               }
               .zhm_play_video_line{
                  width:320px;
                  height:auto;
                  overflow-y:scroll;
                  overflow-x:hidden;
               }
               .zhm_play_vide_line_ul{
                  width:300px;
                  display: flex;
                  justify-content: flex-start;
                  flex-flow: row wrap;
                  list-style: none;
                  padding:0px;
                  margin:0px;

               }
               .zhm_play_video_line_ul_li{
                  padding:4px 0px;
                  margin:2px;
                  width:30%;
                  color:#FFF;
                  text-align:center;
                  background-color:#f24443;
                  box-shadow:0px 0px 10px #fff;
                  font-size:14px;
               }
               .zhm_play_video_line_ul_li:hover{
                  color:#260033;
                  background-color:#fcc0c0
               }
               .zhm_line_selected{
                  color:#260033;
                  background-color:#fcc0c0
               }

               .zhm_play_video_jx{
                  width:100%;
                  height:100%;
                  z-index:999999;
                  position: absolute;top:0px;padding:0px;
               }
               `;

            domStyle .appendChild(document.createTextNode(playVideoStyle));

            domHead.appendChild(domStyle);

            let playWrapHtml = "<div href='javascript:void(0)' target='_blank' style='' class='playButton zhm_play_vidoe_icon' id='zhmlogo'>";

            playWrapHtml += "<img class='iconLogo' style='width:"+iconVipWidth+"px;height:"+iconVipWidth*1.5+"px' src='data:image/gif;base64,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'>"

            playWrapHtml += "<div>";

            _this.createElement('div','zhmIcon');

            let zhmPlay = document.getElementById('zhmIcon');

            zhmPlay.innerHTML = playWrapHtml;

        }
        //左键按下拖动
        //type:根据不同类型，处理图标单击事务
        zhmLogoDrag(type,web){

            var _this = this;

            var zhmLogoDrag=document.querySelector("#zhmlogo");

            var zhmLogoIcon = document.querySelector(".iconLogo");

            if(!zhmLogoDrag || !zhmLogoIcon)return;

            zhmLogoDrag.onmousedown = function(event){

                if(event.which==3)return false;//屏蔽右键

                let sedownTop = zhmLogoDrag.offsetTop;

                let zhmLogoIconHeight = zhmLogoIcon.offsetHeight;

                let bottomSpace = 10;

                if(event.target.className != 'iconLogo')return;

                //let shiftX = event.clientX - zhmLogoDrag.getBoundingClientRect().left;
                let shiftx = 5;

                let shiftY = event.clientY-zhmLogoDrag.getBoundingClientRect().top;

                zhmLogoDrag.style.position = 'fixed';

                zhmLogoDrag.style.zIndex = 9999999;

                document.body.append(zhmLogoDrag);

                function onMouseMove(event){

                    //zhmLogoDrag.style.left = pageX - shiftX + 'px';
                    zhmLogoDrag.style.left = '5px';

                    let height = window.innerHeight - zhmLogoIconHeight-bottomSpace;

                    let y = event.pageY-shiftY;

                    y = Math.min(Math.max(0, y), height);

                    zhmLogoDrag.style.top = y+'px';

                }
                //在mousemove事件上移动图标
                document.addEventListener('mousemove',onMouseMove);
                //松开事件
                document.onmouseup = function(e){

                    GM_setValue('iconTop',zhmLogoDrag.offsetTop);

                    document.removeEventListener('mousemove', onMouseMove);

                    zhmLogoDrag.onmouseup = null;

                    let height = zhmLogoDrag.offsetTop+zhmLogoIconHeight+bottomSpace;

                    if(zhmLogoDrag.offsetTop < 0){

                        zhmLogoDrag.style.top ='0px';
                    }

                    if(window.innerHeight < height){

                        zhmLogoDrag.style.top =window.innerHeight-zhmLogoIconHeight-bottomSpace+'px';

                    }

                };

            };

            zhmLogoDrag.ondragstart = function(){
                return false;
            };
        }

        //下载
        static LR_download(url,filename){

            let ua = navigator.userAgent.toLowerCase();

            console.log(ua.match(/version\/([\d.]+).*safari/));

            if(ua.match(/version\/([\d.]+).*safari/)){

                window.open(url);

            }else{
                console.log(url);
                GM_download(url,filename);
            }


        }

    }

    class VideoDownloadClass extends BaseClass{

        constructor(){

            super();
        }

        dyVideoDownload(){

            var _this = this;

           let timer = setInterval(function(){

               //获取所有视频
               let videoDomAll = document.querySelectorAll('video');

               //console.log(videoDomAll);return;

               if(videoDomAll.length==0)return;

               //获取当前视频

               let videoAll=[];

               for(let i =0;i<videoDomAll.length;i++){

                   let autoplay = videoDomAll[i].getAttribute('autoplay');

                   if(autoplay !== null){

                       videoAll.push(videoDomAll[i]);

                   }

               }
               let videoContainer=location.href.indexOf('modal_id') != -1?videoAll[0]:videoAll[videoAll.length-1];

               if(!videoContainer)return;

               //视频地址
               let url = videoContainer && videoContainer.children.length>0 && videoContainer.children[2].src?videoContainer.children[2].src:videoContainer.src;

               //视频ID

               let videoId;

               //let resp = url.match(/^(https:)?\/\/v[0-9]+-weba?\.douyinvod\.com\/([a-zA-Z0-9]+)\/[a-zA-Z0-9]+\/video/);

               let resp = url.match(/^(https:)?\/\/.+\.com\/([a-zA-Z0-9]+)\/[a-zA-Z0-9]+\/video/);

               let res = url.match(/blob:https:\/\/www.douyin.com\/(.*)/);

               if(resp && resp[2]){

                   videoId=resp[2];

               }else if(res && res[1]){

                   videoId=res[1]

               }else{

                   videoId = videoContainer.getAttribute('data-xgplayerid')
               }

               //console.log(videoId);
               //所有视频操作按钮区域

               let playContainer = videoContainer.parentNode.parentNode.querySelector('.xg-right-grid');

               if(!playContainer)return;

               let videoDownloadDom = playContainer.querySelector('#zhmDyDownload'+videoId);

               if(videoDownloadDom){

                   let dom = playContainer.querySelectorAll('.xgplayer-playclarity-setting');

                   for(let n=0;n<dom.length;n++){

                       let btn = dom[n].querySelector('.btn');

                       if(dom[n].id != 'zhmDyDownload'+videoId && btn.innerText=='下载'){

                           dom[n].parentNode.removeChild(dom[n]);
                       }

                   }

                   return;

               }

               if(videoContainer && playContainer){

                   let playClarityDom = playContainer.querySelector('.xgplayer-playclarity-setting');

                   if(!playClarityDom){console.log('未获取智能按钮元素');return;}

                   let palyClarityBtn = playClarityDom.querySelector('.btn');

                   if(!palyClarityBtn){console.log('未获取智能文本元素');return;}

                   let downloadDom = playClarityDom.cloneNode(true);

                   downloadDom.setAttribute('id','zhmDyDownload'+videoId);

                   if(location.href.indexOf('search') != -1 && location.href.indexOf('modal_id') == -1){

                       downloadDom.style='margin-top:0px;padding-top:100px;';

                   }else{

                       downloadDom.style='margin-top:-68px;padding-top:100px;padding-left:20px;padding-right:20px;';
                   }

                   let downloadText = downloadDom.querySelector('.btn');

                   downloadText.innerText='下载';

                   downloadText.style = 'font-size:12px;font-weight:600;';

                   downloadText.setAttribute('id','zhmDouyinDownload'+videoId);

                   let detail = playContainer.querySelector('xg-icon:nth-of-type(1)').children[0];

                   let linkUrl = detail.getAttribute('href')?detail.getAttribute('href'):location.href;

                   if(linkUrl.indexOf('www.douyin.com')==-1){

                       linkUrl='//www.douyin.com'+linkUrl;
                   }

                   downloadText.setAttribute('data-url',linkUrl);

                   downloadText.removeAttribute('target');

                   downloadText.setAttribute('href','javascript:void(0);');

                   let virtualDom = downloadDom.querySelector('.virtual');

                   downloadDom.onmouseover=function(){

                       //downloadDom.className='xgplayer-playclarity-setting';

                      if(location.href.indexOf('search') != -1 && location.href.indexOf('modal_id') == -1){

                          virtualDom.style='display:block !important;margin-bottom:37px;';

                      }else{

                          virtualDom.style='display:block !important';
                      }

                   }

                   downloadDom.onmouseout=function(){

                       //downloadDom.className='xgplayer-playclarity-setting disappear';
                       virtualDom.style='display:none !important';
                   }

                   let downloadHtml = '';

                   downloadOption.forEach(function(item){

                       downloadHtml += `<div class="item ${item.id}" id="${item.id}${videoId}">${item.name}</div>`;

                   })

                   if(downloadDom.querySelector('.virtual')){

                       downloadDom.querySelector('.virtual').innerHTML = downloadHtml;

                   }

                   //playContainer.appendChild(downloadDom);

                   playClarityDom.after(downloadDom);

                   let toLinkDom = playContainer.querySelector('#toLink'+videoId);

                   if(toLinkDom){

                       toLinkDom.addEventListener('click',function(){

                           if(url.match(/^blob/)){

                               BaseClass.toast('加密视频地址，无法直接打开');

                           }else{

                               window.open(url);
                           }

                       })

                   }

                   let toDownloadDom = playContainer.querySelector('#toDownload'+videoId);

                   if(toDownloadDom){

                       toDownloadDom.addEventListener('click',function(){
                           //console.log(url);return;

                           if(url.match(/^blob/)){

                               BaseClass.toast('加密视频地址，无法下载');

                           }else{

                               BaseClass.toast('正在下载请稍侯');

                               let infoDom = playContainer.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.querySelector('.hidden');

                               let descInfo = infoDom?infoDom:document.querySelector('.hidden');

                               let filename;

                               if(descInfo && descInfo.querySelector('img')){

                                   filename = descInfo.querySelector('img').getAttribute('alt').replaceAll('.','')+'.mp4';

                               }else{

                                   filename = new Date().getTime()+'.mp4';
                               }

                               BaseClass.LR_download(url,filename);
                           }
                       })

                   }

                   let toCopyDom = playContainer.querySelector('#toCopy'+videoId);

                   if(toCopyDom){

                       toCopyDom.addEventListener('click',function(){

                           BaseClass.toast('已复制到剪贴板');

                           GM_setClipboard(url);
                       })
                   }

               }

               //clearInterval(timer);

           },100)

        }

        ksVideoDownload(){

            var _this = this;

            window.addEventListener('load',function(){

                async function getControls(){

                    let videoDomArr = await BaseClass.getElement('.player-video',1);

                    if(!videoDomArr){

                        console.log('没有找到DOM');return;

                    }
                    let videoDom = videoDomArr.length>2?videoDomArr[1]:videoDomArr[0];

                    if(videoDom.getAttribute('src').match(/^blob/)){
                        //删除残留下载DOM
                        /*
                        let videoDownloadDom = document.querySelector('#zhmKsDownload');

                        if(videoDownloadDom){
                            videoDownloadDom.parentNode.removeChild(videoDownloadDom);
                        }
                        */
                        console.log('blob视频无法下载');return;
                    }

                    _this.createKsVideoDownload(videoDom);

                    videoDom.addEventListener('playing',function(){ //播放中
                        console.log("播放中");
                    });

                    videoDom.addEventListener('ended',function(){ //结束

                        console.log("播放结束");

                        //getControls();

                        let autoPlay = document.querySelector('.auto-warpper').getAttribute('autoplay');

                        if(autoPlay){
                            getControls();
                            return;

                        }

                    }, false);

                    document.querySelector('#toDownload').addEventListener('click',function(){

                        BaseClass.toast('正在下载请稍侯');

                        let playTimeTotal = document.querySelector('.total').innerText;

                        let second = playTimeTotal.match(/(.+):(.+)/);

                        let secondTotal = second[1]*60+parseInt(second[2]);

                        let dataUrl = document.querySelector('#zhmKsDownload').getAttribute('data-url');

                        let account = document.querySelector('.profile-user-name-title')?document.querySelector('.profile-user-name-title').innerText:document.querySelector('.feed-author').innerText;

                        let title = document.querySelector('.video-info-title')?document.querySelector('.video-info-title').innerText:new Date().getTime();

                        let videoFileName = (account && title)?account+'-'+title+'.mp4':new Date().getTime()+'.mp4';

                        BaseClass.LR_download(dataUrl,videoFileName);

                        /*

                            if(secondTotal<30){

                                let videoFileName = new Date().getTime()+'.mp4';

                                GM_download(dataUrl,videoFileName);

                            }else{

                                window.open(dataUrl);
                            }
                            */
                    })

                    document.querySelector('#toCopy').addEventListener('click',function(){

                        BaseClass.toast('已复制到剪贴板');

                        GM_setClipboard(videoDom.getAttribute('src'));
                    })

                    document.querySelector('#toLink').addEventListener('click',function(){

                        window.open(videoDom.getAttribute('src'));

                    })

                }

                getControls();

                document.addEventListener('click',function(e){

                    getControls();

                })

                window.addEventListener("wheel",getControls);

                window.addEventListener('keydown',function(e){

                    if(e.code=='ArrowDown' || e.code=='ArrowUp'){

                        getControls();
                    }

                })

            })


        }

        createKsVideoDownload(videoDom){

            let match = /^https?:\/\/www\.kuaishou\.com\/(.+)/;

            let resp = location.href.match(match);

            if(!resp || (resp[1].indexOf('short-video') == -1 && resp[1].indexOf('video') ==-1 && resp[1].indexOf('new-reco') == -1)){

                console.log('当前不是视频播放页');return;
            }

            if(resp[1].indexOf('short-video') != -1){

                let playerArea = document.querySelector('.video-container-player');

                let playerAreaWidth = playerArea.style.width.match(/(.+)px/);

                let playerBarProgress = document.querySelector('.player-bar-progress');

                playerBarProgress.style.width = playerAreaWidth[1]-320+'px';

                let timeTotal = document.querySelector('.total');

                timeTotal.style.right='180px';
            }

            let controls = document.querySelector('.right');

            let videoDownloadDom = document.querySelector('#zhmKsDownload');

            if(videoDownloadDom){

                videoDownloadDom.parentNode.removeChild(videoDownloadDom);
            }

            let detailDom = controls.querySelector('div:nth-of-type(1)');

            let xgIcon = detailDom.cloneNode(true);

            let linkUrl = videoDom.getAttribute('src');

            xgIcon.querySelector('.kwai-player-volume-sound').innerHTML="<div style='cursor:pointer;'>下载</div>";

            let slider = xgIcon.querySelector('.pl-slider');

            //slider.style = 'width:49px;padding:10px 5px 20px;';

            let downloadList = '';

            downloadOption.forEach(function(item){

                downloadList += `<div style="margin-top:10px;color:#FFF;cursor:pointer;" id="${item.id}">${item.name}</div>`;

            })

            slider.innerHTML = downloadList;

            xgIcon.setAttribute('data-url',linkUrl);

            xgIcon.setAttribute('id','zhmKsDownload');

            xgIcon.style='height:80px;';

            detailDom.before(xgIcon);

            xgIcon.onmouseover=function(){

                //downloadDom.className='xgplayer-playclarity-setting';

                slider.style= 'margin-top:10px;width:49px;padding:10px 5px 20px;display:block !important';

            }

            xgIcon.onmouseout=function(){

                //downloadDom.className='xgplayer-playclarity-setting disappear';
                slider.style='display:none !important';
            }

            return;
            //重构播放操作按钮

            let zhmKsButton = document.querySelector('#zhmKsButton');

            //console.log(zhmKsButton);

            if(zhmKsButton){

                //zhmKsButton.parentNode.removeChild(zhmKsButton);

                return false;
            }

            let buttonIcon = detailDom.cloneNode(true);
            //console.log(buttonIcon);
            buttonIcon.setAttribute('id','zhmKsButton');

            let buttonIconImg = buttonIcon.querySelector('.unmuted-icon');

            if(buttonIconImg){
                buttonIconImg.style = 'background: url(https://s2-10623.kwimgs.com/udata/pkg/cloudcdn/img/player-setting.ad1f5ce8.svg) no-repeat';
            }
            detailDom.after(buttonIcon);

            let plSlider = buttonIcon.querySelector('.pl-slider');

            plSlider.style='width:auto;padding:10px 10px 25px 10px;';

            plSlider.innerHTML = "";

            let buttonFour = controls.querySelector('div:nth-of-type(4)');

            buttonFour.style.margin='0px';

            let autoPlay = document.querySelector('.play-setting-container');

            if(autoPlay){
                autoPlay.style.margin='0px 40px 0px 0px';
            }
            let buttonFive = controls.querySelector('div:nth-of-type(5)');

            if(buttonFive){

                buttonFive.style.margin='15px 0px';

                buttonFive.onmouseover=function(){

                    setTimeout(function(){

                        let toolTip = document.querySelector('.kwai-player-rotate-tooltip');

                        if(toolTip){

                            toolTip.parentNode.removeChild(toolTip);
                        }


                    },30)

                }

                plSlider.appendChild(buttonFive);
            }
            let buttonSix = controls.querySelector('div:nth-of-type(6)');

            if(buttonSix){

                buttonSix.style.margin='15px 0px';

                let toolTip = document.querySelector('.kwai-player-fullscreen-tooltip');

                buttonSix.onmouseover=function(){

                    setTimeout(function(){

                        let toolTip = document.querySelector('.kwai-player-fullscreen-tooltip');

                        if(toolTip){

                            toolTip.parentNode.removeChild(toolTip);

                        }

                    },30)

                }

                plSlider.appendChild(buttonSix);
            }
            plSlider.appendChild(buttonFour);

        }

        xiguaVideoDownload(){

            var _this = this;

            window.addEventListener('load',function(){

                async function getControls(){

                    let videoDom = await BaseClass.getElement('video');

                    if(!videoDom){

                        console.log('没有找到DOM');return;

                    }

                    _this.createXiguaVideoDownload();

                    GM_xmlhttpRequest({

                        method: "get",

                        url: 'http://47.99.158.118/video-crack/v2/parse?content='+encodeURIComponent(location.href),

                        data: '',

                        headers: {'Accept': 'text/plain, text/html,application/json'},

                        onload: function(res){

                            console.log(res);
                            if(res.status==200){

                                    let resp = JSON.parse(res.responseText)

                                    let videoSrc = '';

                                if(resp.code == 0){

                                    videoSrc = resp.data.url;

                                }
                                console.log(videoSrc);
                                document.querySelector('#toDownload').addEventListener('click',function(){

                                    if(!videoSrc){

                                        BaseClass.toast('该视频无法下载');

                                        return;
                                    }

                                    let videoTitle = document.querySelector('.videoTitle h1').innerText;

                                    let videoAuthor = document.querySelector('.author__userName').title;

                                    BaseClass.toast('正在下载请稍侯');

                                    BaseClass.LR_download(videoSrc,videoTitle+'@'+videoAuthor+'.mp4');
                                })

                                document.querySelector('#toCopy').addEventListener('click',function(){

                                    if(!videoSrc){

                                        BaseClass.toast('该视频不能复制地址');

                                        return;
                                    }

                                    BaseClass.toast('已复制到剪贴板');

                                    GM_setClipboard(videoSrc);
                                })

                                document.querySelector('#toLink').addEventListener('click',function(){

                                    if(!videoSrc){

                                        BaseClass.toast('该视频不能直接打开');

                                        return;
                                    }

                                    window.open(videoSrc);

                                })

                                document.addEventListener('click',function(e){

                                    e.path.forEach(function(item){

                                        if(item.className == 'xgplayer-control-item control_playnext common-control-item'){

                                            setTimeout(function(){

                                                location.reload();

                                                return;

                                            },1000)

                                        };

                                    })

                                    var objLink = {};

                                    e.path.forEach(function(item){

                                        if(item.href){

                                            objLink.href = item.href?item.href:'';

                                            objLink.target = item.target?item.target:'';

                                            return;
                                        }

                                    })

                                    if(objLink.href && objLink.target != '_blank'){

                                        location.href = objLink.href;

                                        return;
                                    }
                                })
                            }

                        },
                        onerror : function(err){
                            console.log('error')
                            console.log(err)
                        }
                    });

                    document.querySelector('video').addEventListener('ended',function(){ //结束

                        console.log("播放结束");
                        /*
                            let autoPlay = document.querySelector('.xg-switch-checked');

                            if(autoPlay){

                                getControls();
                                return;
                            }
    */
                        setTimeout(function(){

                            location.reload();

                        },5500);

                    }, false);

                }

                getControls();
            })
        }

        createXiguaVideoDownload(){

            let rightGrid = document.querySelector('.xg-right-grid');

            let playControl = rightGrid.querySelector('div:nth-of-type(2)');

            let control = playControl.cloneNode(true);

            let entry= control.querySelector('.xgplayer-control-item__entry');

            entry.innerHTML = '<div class="xgpcPlayer_textEntry"><span>下载</span></div>';

            let popover = control.querySelector('.xgplayer-control-item__popover');

            let downloadList = '<ul>';

            downloadOption.forEach(function(item){

                downloadList += `<li tabindex="0" role="menuitemradio" aria-checked="false" id="${item.id}">${item.name}</li>`;

            })

            downloadList += '</ul>';

            popover.innerHTML = downloadList;

            playControl.before(control);

            let divDom = document.createElement('div');

            divDom.style="width: 80px; height: 140px;position:absolute;bottom:40px;left:20px;z-index:-1";

            control.appendChild(divDom);

            control.onmouseover=function(){

                popover.style.display='block';

            }

            control.onmouseout=function(){

                popover.style.display='none';

            }


        }

        biliVideoDownload(){

            var _this = this;

            window.addEventListener('load',function(){

                async function getControls(){

                    if(location.href.indexOf('bangumi') != -1){

                        let rightControl = await BaseClass.getElement('.squirtle-controller-wrap-right');

                        if(!rightControl){

                            console.log('没有找到DOM');return;
                        }

                        _this.createBiliVideoDownload();

                    }else{

                        let n=0;

                        let timer = setInterval(function(){

                            let dom = document.querySelector('.bilibili-player-video-btn-quality');

                            let domOther = document.querySelector('.bpx-player-ctrl-quality');

                            if(dom){

                                clearInterval(timer);

                                _this.createBiliVideoDownload();

                                return;

                            }else if(domOther){

                                clearInterval(timer);

                                _this.createBiliVideoDownloadOther();

                                return;

                            }else{
                                if(n++>30)clearInterval(timer);
                            }

                        },100)

                        return;

                    }

                    //_this.createBiliVideoDownload();

                    let timerZhmIcon = setInterval(function(){

                        let videoDom = [{name:'video',type:'dom'},{name:'bwp_video',type:'dom'},{name:'.bilibili-player-video',type:'class'}];

                        for(let i = 0;i<videoDom.length;i++){

                            let video = videoDom[i].type == 'dom'?document.querySelector(videoDom[i].name):document.querySelector(videoDom[i].name).firstChild;

                            if(video){

                                clearInterval(timerZhmIcon); //取消定时器

                                video.addEventListener('play',function(){

                                    console.log("播放开始");

                                    _this.createBiliVideoDownload();
                                });

                                video.addEventListener('ended',function(){ //结束

                                    if(location.href.indexOf('bangumi') != -1){

                                        let biliDownload = document.querySelector('#biliDownload');

                                        console.log(biliDownload);

                                        biliDownload.parentNode.removeChild(biliDownload);

                                    }
                                })

                                break;

                            }

                        };

                    })

                    }

                getControls();
                //屏蔽登录弹框
                let video = document.querySelector('video');

                if(video){

                    video.addEventListener('pause', function () {
                        console.log("暂停");
                        setTimeout(function(){

                            let closeIcon = document.querySelector('.bili-mini-close-icon');

                            console.log(closeIcon);

                            if(closeIcon){

                                closeIcon.click();

                                video.play();

                            };

                        },50);

                    });

                };

            })

        }

        createBiliVideoDownload(){

            var _this = this;

            async function getControls(){

                let downloadIcon = document.querySelector('#biliDownload');

                if(downloadIcon){
                    console.log('下载按钮已存在');return;
                }

                if(location.href.indexOf('bangumi') != -1){

                    let quality = await BaseClass.getElement('.squirtle-quality-wrap');

                    if(!quality){

                        console.log('没有找到DOM');return;
                    }

                    let control = quality.cloneNode(true);

                    console.log(control.querySelector('.squirtle-video-quality-text'));

                    control.querySelector('.squirtle-video-quality-text').innerText='下载';

                    control.setAttribute('id','biliDownload');

                    quality.before(control);

                }else if(location.href.indexOf('video') != -1){

                    let autoIconDom = await BaseClass.getElement('.bilibili-player-video-btn-quality');

                    if(!autoIconDom){

                        console.log('没有找到DOM');return;

                    }

                    let control = autoIconDom.cloneNode(true);

                    control.style='margin-right:20px;';

                    control.querySelector('.bui-select-result').innerText='下载';

                    control.querySelector('.bui-select-result').setAttribute('id','biliDownload');

                    autoIconDom.before(control);

                }else{

                    console.log('当前页面不是视频或番剧');return;

                }

                document.querySelector('#biliDownload').addEventListener('click',function(){

                    let bvid = '',avid='';

                    if(location.href.indexOf('bangumi') != -1){

                        bvid = document.querySelector('.av-link').innerText;

                    }else if(location.href.indexOf('video') != -1){

                        let params = location.href.match(/https:\/\/www.bilibili.com\/video\/(.+)\?/);

                        if(params[1].indexOf('av') !=-1){

                            avid = params[1].replace('av','');

                        }else{

                            bvid = params[1].substring(params[1].length-1)=='/'?params[1].substring(0,params[1].length-1):params[1];
                        }

                    }else{

                        BaseClass.toast('当前页面无法下载');return;
                    }

                    if(!bvid && !avid){

                        console.log('未获取bvid或avid');return;
                    }

                    let url = "https://api.bilibili.com/x/web-interface/view?bvid="+bvid+"&aid="+avid;

                    let uri = _this.request('get',url).then((result)=>{

                        let resp = JSON.parse(result);

                        if(resp.code < 0){

                            BaseClass.toast('该视频无法下载');

                            console.log('视频信息接口返回数据错误');return;
                        }

                        //选集cid

                        let pageId = _this.getQueryString('p');

                        let cid = '';

                        if(pageId){

                            cid = resp.data.pages[pageId-1].cid;

                        }else{

                            cid = resp.data.cid;
                        }

                        console.log(cid);

                        let link = 'https://api.bilibili.com/x/player/playurl?avid='+resp.data.aid+'&cid='+cid+'&qn=112';

                        let res = _this.request('get',link).then((result)=>{

                            let data = JSON.parse(result);

                            if(data.code < 0){
                                BaseClass.toast('该视频无法下载');
                                console.log('视频地址接口返回数据错误');return;
                            }

                            let downloadUrl = data.data.durl[0].url;

                            //GM_download(downloadUrl);

                            window.open(downloadUrl);

                        })

                        })
                    })

            }

            getControls();

        }

        createBiliVideoDownloadOther(){

            var _this = this;

            async function getControls(){

                let downloadIcon = document.querySelector('#biliDownload');

                if(downloadIcon){
                    console.log('下载按钮已存在');return;
                }

                if(location.href.indexOf('bangumi') != -1){

                    let quality = await BaseClass.getElement('.squirtle-quality-wrap');

                    if(!quality){

                        console.log('没有找到DOM');return;
                    }

                    let control = quality.cloneNode(true);

                    control.querySelector('.squirtle-video-quality-text').innerText='下载';

                    control.setAttribute('id','biliDownload');

                    quality.before(control);

                }else if(location.href.indexOf('video') != -1 || location.href.indexOf('festival') != -1){

                    let autoIconDom = await BaseClass.getElement('.bpx-player-ctrl-quality');

                    if(!autoIconDom){

                        console.log('没有找到DOM');return;

                    }

                    let control = autoIconDom.cloneNode(true);

                    console.log(control);

                    control.style='margin-top:-80px;padding-top:80px;margin-right:20px;';

                    control.querySelector('.bpx-player-ctrl-quality-result').innerText='下载';

                    control.querySelector('.bpx-player-ctrl-quality-menu').setAttribute('id','biliDownload');

                    let menuItems = control.querySelectorAll('.bpx-player-ctrl-quality-menu-item');

                    menuItems.forEach(function(item){

                        let dataValue = item.getAttribute('data-Value');

                        if(dataValue != 16 && dataValue != 80){

                            item.parentNode.removeChild(item);
                        }

                    });

                    autoIconDom.before(control);

                    control.onmouseover=function(){

                       control.className='bpx-player-ctrl-btn bpx-player-ctrl-quality bpx-state-show';

                   }

                   control.onmouseout=function(){

                       control.className='bpx-player-ctrl-btn bpx-player-ctrl-quality';
                   }

                }else{

                    console.log('当前页面不是视频或番剧');return;

                }

                document.querySelector('#biliDownload').addEventListener('click',function(e){

                    let biliDataValue = e.target.getAttribute('data-Value')?e.target.getAttribute('data-Value'):'';

                    if(!biliDataValue)return;

                    let bvid = '',avid='';

                    if(location.href.indexOf('bangumi') != -1){

                        bvid = document.querySelector('.av-link').innerText;

                    }else if(location.href.indexOf('video') != -1){

                        let nowUrl = location.href.split('?');

                        let params = nowUrl[0].match(/https:\/\/www.bilibili.com\/video\/(.+)/);

                        if(params[1].indexOf('av') !=-1){

                            avid = params[1].replace('av','');

                        }else{

                            bvid = params[1].substring(params[1].length-1)=='/'?params[1].substring(0,params[1].length-1):params[1];
                        }

                    }else if(location.href.indexOf('festival') != -1){

                            bvid=_this.getQueryString('bvid');

                    }else{

                        BaseClass.toast('当前页面无法下载');return;
                    }

                    if(!bvid && !avid){

                        console.log('未获取bvid或avid');return;
                    }

                    let url = "https://api.bilibili.com/x/web-interface/view?bvid="+bvid+"&aid="+avid;

                    let uri = _this.request('get',url).then((result)=>{

                        let resp = JSON.parse(result);

                        if(resp.code < 0){

                            BaseClass.toast('该视频无法下载');

                            console.log('视频信息接口返回数据错误');return;
                        }

                        //选集cid

                        let pageId = _this.getQueryString('p');

                        let cid = '';

                        if(pageId){

                            cid = resp.data.pages[pageId-1].cid;

                        }else{

                            cid = resp.data.cid;
                        }

                        let link = 'https://api.bilibili.com/x/player/playurl?avid='+resp.data.aid+'&cid='+cid+'&qn='+biliDataValue;

                        let res = _this.request('get',link,'',true).then((result)=>{

                            let data = JSON.parse(result);

                            if(data.code < 0){
                                BaseClass.toast('该视频无法下载');
                                console.log('视频地址接口返回数据错误');return;
                            }

                            let downloadUrl = data.data.durl[0].url;

                            //GM_download(downloadUrl);

                            window.open(downloadUrl);

                        })

                        })
                    })

            }

            getControls();

        }

        youtubeVideoDownload(){

            var _this = this;

            let timer = setInterval(function(){

                let url = location.href.match(/^https?:\/\/www\.youtube\.com\/(watch\?v=.+|shorts\/.+)|(watch\?app=desktop&v=.+|shorts\/.+)/);

                if(url){

                    let youtubeIcon = document.querySelector('#zhmlogo');

                    if(youtubeIcon){
                        youtubeIcon.style.opacity=1;
                        return;

                    }

                    _this.zhmLogo();

                    let playWrapHtml = "<div class='zhm_play_video_line'>";

                    playWrapHtml +="<ul class='zhm_play_vide_line_ul'>";

                    let playLine = [
                        {name:'下载线路1',url:'https://zh.savefrom.net/176/#url='},
                        {name:'下载线路2',url:'https://mydowndown.com/y2#'},
                        {name:'下载线路3',url:'https://www.ytdownfk.com/search?url='},
                        {name:'下载线路4',url:'https://yout.com/video/?url='}
                    ];

                    playLine.forEach(function(item){

                        playWrapHtml +=`<li class='playLineTd zhm_play_video_line_ul_li' url='${item.url}' >${item.name}</li>`;

                    })

                    playWrapHtml +="</ul></div>";

                    let zhmPlay = document.getElementById('zhmlogo');

                    let playLineDom = document.createElement('div');

                    playLineDom.className = 'playLineDiv zhm_play_video_wrap';

                    playLineDom.style.display = 'none';

                    playLineDom.innerHTML = playWrapHtml;

                    zhmPlay.appendChild(playLineDom);

                    let playLineTd = document.querySelectorAll('.playLineTd');

                    playLineTd.forEach(function(item){

                        item.addEventListener('click',function(){

                            window.open(item.getAttribute('url')+location.href);

                        })

                    })

                    document.querySelector('.playButton').onmouseover=()=>{

                        document.querySelector(".playLineDiv").style.display='block';

                    }

                    document.querySelector('.playButton').onmouseout=()=>{

                        document.querySelector(".playLineDiv").style.display='none';

                    }

                    _this.zhmLogoDrag('youtube','');

                }else{

                    let zhmIcon = document.querySelector('#zhmIcon');

                    if(zhmIcon){

                        zhmIcon.parentNode.removeChild(zhmIcon);
                    }


                    let zhmlogo = document.querySelector('#zhmlogo');

                    if(zhmlogo){

                        //zhmlogo.parentNode.removeChild(zhmlogo);

                        zhmlogo.style.opacity=0;
                    }

                }

            },2000)

        }

    }

    var nowWeb = [];

    try{
        var website = top.location.href;

        for(let i=0;i<videoDownload.length;i++){

            if(website.match(videoDownload[i].match) && videoDownload[i].isWebOpen == 22){
                //CryptoJS.MD5(website).toString();
                //console.log(videoDownload[i])
                nowWeb.push(videoDownload[i]);

                break;
            }

        }

    }catch(err){

        //console.log(err);
    }

    var baseClass = new BaseClass();

    if(nowWeb.length != 1){

        console.log('没有匹配该网站或该模块已关闭');return;

    }else{

        var videoDownloadClass = new VideoDownloadClass();

        videoDownloadClass[nowWeb[0].name]();

    }

})();