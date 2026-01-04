// ==UserScript==
// @name         抖音工具箱（自动点赞/下载视频）
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  基于网页版抖音的工具箱，功能目前开发中
// @author       Kolento
// @match        *://live.douyin.com/*
// @match        *://www.baidu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/472619/%E6%8A%96%E9%9F%B3%E5%B7%A5%E5%85%B7%E7%AE%B1%EF%BC%88%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/472619/%E6%8A%96%E9%9F%B3%E5%B7%A5%E5%85%B7%E7%AE%B1%EF%BC%88%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%EF%BC%89.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    let page = document.getElementsByTagName('body')[0];
    console.log('page',page)

    // 点赞按钮
    let kolento = document.createElement("div");
    kolento.className="kolento kolento-btn";
    kolento.innerHTML='<div class="kolento-group"><p class="kolento-p1">开始</p><p class="kolento-p1">点赞</p></div>'
    page.append(kolento);

    // 视频下载
    let kolentoDownload = document.createElement("div");
    kolentoDownload.className="kolento-download kolento-btn";
    kolentoDownload.innerHTML='视频<br/>下载'
    page.append(kolentoDownload);

    // 其他功能
    let kolentoOther = document.createElement("div");
    kolentoOther.className="kolento-other kolento-btn";
    kolentoOther.innerHTML='其他<br/>功能'
    page.append(kolentoOther);

    // 使用说明
    let kolentoTips = document.createElement("div");
    kolentoTips.className="kolento-tips kolento-btn";
    kolentoTips.innerHTML='使用<br/>说明'
    page.append(kolentoTips);

    // 弹窗节点
    let kolentoPop = document.createElement("div");
    kolentoPop.className="kolento-pop";
    kolentoPop.innerHTML= `
    <div id="kolento-box">
      <div class="kolento-pop-con">
      <ul>
          <li class="tip-list">1.点击【开始点赞】开启点赞，点赞速度为1秒钟20次，点击数不等于点赞数，点赞数请看抖音直播的数据；</li>
          <li class="tip-list">2.抖音只允许一段时间内点赞3000次，提示“手速太快”说明点满3000次了，请停止点赞稍后再试；</li>
          <li class="tip-list">3.视频下载功能目前正在开发中；</li>
          <li class="tip-list">4.按下 F2 隐藏控制菜单栏，再次按下 F2 显示菜单栏；</li>
          <li class="tip-list">5.如果发现有bug、或其他建议，请在插件页面反馈留言哦。</li>
      </ul>
      </div>
      <div class="bykolento">by kolento <span id="close-kolento">【点击关闭】</span></div>
    </div>
    `
    page.append(kolentoPop);

    // 通用弹窗
    let commonPop = document.createElement("div");
    commonPop.id="kolento-common-pop";
    kolentoPop.className="kol-pop";
    commonPop.innerHTML=` <p id="pop-text" class="kol-pop-inner"></p> `
    page.append(commonPop);


    // 点击数
    let total = document.createElement("div");
    total.className="total";
    total.innerHTML='<p class="text">点击数：</p><p class="kolento-all">0</p>';
    kolento.append(total);

    // 初始化点击数
    var timeBox;
    let totalNum = 0;
    let num = document.getElementsByClassName('kolento-all')[0];
    num.innerHTML=totalNum;

    // 获取目标元素
    let target = document.getElementsByClassName('Zs4Pv2bD');
    let text = document.getElementsByClassName('kolento-p1');

    // 点赞事件
    kolento.onclick=function(){
        if(text[0].innerHTML.indexOf('开始')>-1){
            // 执行点赞脚本
            text[0].innerHTML='停止'

            timeBox = setInterval(()=>{
                totalNum++;
                num.innerHTML=totalNum;
                target[0].click();
            },50)

        }else{
            clearInterval(timeBox);
            text[0].innerHTML='开始'
        }
    }

    // 使用说明-打开
    kolentoTips.onclick=function(){
        kolentoPop.className="kolento-pop kolento-pop-on";
    }
    // 使用说明-关闭
    let close = document.getElementById('close-kolento');
    close.onclick=function(){
        kolentoPop.className="kolento-pop";
    }

    // 视频下载
    kolentoDownload.onclick=function(){
        kolPop('功能开发中~')
    }

    kolentoOther.onclick=function(){
        kolPop('功能开发中~')
    }

    document.onkeydown = function(event){
        let btnGroup = document.getElementsByClassName('kolento-btn');
        if(event.key=='F2'){

            if(btnGroup[0].className=='kolento kolento-btn'){
                btnGroup[0].className='kolento kolento-btn hide'
            }else{
                btnGroup[0].className='kolento kolento-btn'
            }

            if(btnGroup[1].className=='kolento-download kolento-btn'){
                btnGroup[1].className='kolento-download kolento-btn hide'
            }else{
                btnGroup[1].className='kolento-download kolento-btn'
            }

            if(btnGroup[2].className=='kolento-other kolento-btn'){
                btnGroup[2].className='kolento-other kolento-btn hide'
            }else{
                btnGroup[2].className='kolento-other kolento-btn'
            }

            if(btnGroup[3].className=='kolento-tips kolento-btn'){
                btnGroup[3].className='kolento-tips kolento-btn hide'
            }else{
                btnGroup[3].className='kolento-tips kolento-btn'
            }
        }
    }

    function kolPop(msg){
        let pop = document.getElementById('kolento-common-pop');
        let ptext = document.getElementById('pop-text');
        console.log('ptext',ptext)
        ptext.innerHTML=msg;
        pop.className='kol-pop-default kol-pop-on';

        setTimeout(() => {
            pop.className='kol-pop-default';
        }, 2000);
    }

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    

    addGlobalStyle(
        `
        .kolento-btn {
            font-size: 14px;
            position: fixed;
            top: 70px;right: 30px;
            z-index: 500;
            cursor: pointer;
            background: #3eaf7c;
            border-radius: 50%;
            color: #fff;
            width: 46px;height: 46px;
            line-height: 16px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all ease 0.3s;
        }
        .kolento-download {
            top:124px;
        }
        .kolento-other {
            top:178px;
        }
        .kolento-tips {
            top:229px;
        }
        .kolento-btn:hover {
            background-color: #4abf8a;
        }
        .kolento-btn:hover .total {
            opacity:1;
            position: fixed;
            right:84px;
        }
        .total {
            font-size: 14px;
            position: fixed;
            top: 79px;
            right: 70px;
            z-index: 500;
            background: #3eaf7c;
            color: #fff;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all ease 0.3s;
            padding: 5px 8px;
            border-radius: 20px;
            opacity:0;
            width:100px;

        }
        .total p {
            color:#fff;
        }

        .kolento-pop {
            position:fixed;
            top:40%;
            left:50%;
            margin:0 0 0 -250px;
            width:500px;
            border-radius:20px;
            z-index:-1;
            opacity:0;
            transition:all ease 0.3s;
        }
        .kolento-pop-on {
            z-index:500;
            opacity:1;
            top:30%;
        }
        #kolento-box {
            background:rgba(0,0,0,0.5);
            padding:20px;
            color:#fff;
            border-radius:25px;
        }
        .tip-list {
            margin:6px 0;
            font-size:16px;
            text-align:left;
        }
        .bykolento {
            text-align:right;
            margin-top:20px;
        }
        #close-kolento {
            cursor:pointer;
        }
        .kol-pop {
            position:fixed;
            top:45%;
            left:50%;
            opacity:0;
            transition:all ease 0.2s;
            z-index:-1;
            width:500px;
            display:flex;
            justify-content:center;
            align-items:center;
        }
        .kol-pop-default {
            position:fixed;
            top:45%;
            left:0%;
            opacity:0;
            transition:all ease 0.2s;
            z-index:-1;
            width:100%;
            display:flex;
            justify-content:center;
            align-items:center;
        }
        .kol-pop-on {
            top:40%;
            opacity:1;
            z-index:501;
        }
        #pop-text {
            background:rgba(0,0,0,0.5);
            padding:10px 20px;
            color:#fff;
            font-size:16px;
            border-radius:25px;
        }
        .hide {
            right:-100px!important;
        }


        `
    );
 
 
 
 
 
 
 
})();