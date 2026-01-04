// ==UserScript==
// @name         微信读书优化整合
// @version      0.1
// @namespace    greasy-su
// @description  修改字体，更改背景颜色，增减页面宽度，上划隐藏头部侧栏，代码复制与图片下载
// @contributor  SimonDW;Li_MIxdown;hubzy;xvusrmqj;LossJ;JackieZheng;das2m;harmonyLife
// @author       greasy-su
// @match        https://weread.qq.com/web/reader/*
// @icon         https://weread.qq.com/favicon.ico
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/444831/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E4%BC%98%E5%8C%96%E6%95%B4%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/444831/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E4%BC%98%E5%8C%96%E6%95%B4%E5%90%88.meta.js
// ==/UserScript==

// 参考：https://greasyfork.org/zh-CN/scripts/421994-%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E7%BD%91%E9%A1%B5%E7%89%88%E5%8A%9F%E8%83%BD%E7%BB%BC%E5%90%88
// 移除 jquery 依赖与一些个人不需要的功能

'use strict';
// 自动隐藏标题栏
const autoHideTopbar = false;
// 字体
const font = "微软雅黑";
// 字体大小
const fontSize = "15px";
// 字体粗细
const fontWeight = "400"
// 代码字体
const codeFont = "consolas";
// 网页背景
const bodyBg = "#e0d9c6";
// 标题栏背景
const topBarBg = "#d0c9b6";
// 正文背景
const contentBg = "#faf0e4";
// 字体颜色
const fontColor = "#233";


const maxWaitTime = 3000;

const $ = s=>document.querySelector(s);
const $$ = s=>document.querySelectorAll(s);

const style = `
    *{
        font-family: "${font}" !important;
        font-size: ${fontSize} !important;
        font-weight: ${fontWeight} !important;
    }
    pre{
        font-family: "${codeFont}", "${font}" !important;
    }
    .readerCatalog,
    .readerNotePanel{
        right: 0 !important;
        left: unset !important;
    }
    .readerTopBar{
        height: unset !important;
    }
    .readerTopBar,
    .bookInfo_title,
    .readerTopBar_title_link,
    .readerTopBar_title_chapter{
        font-family: SourceHanSerifCN-Bold !important;
    }
    .readerTopBar_title_link{
        font-weight:bold !important;
    }
    body.wr_whiteTheme{
        background-color: ${bodyBg} !important;
    }
    .wr_whiteTheme .readerTopBar{
        background-color: ${topBarBg} !important;
    }
    .wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerImage_opacity,
    .wr_whiteTheme .renderTargetContainer .renderTargetContent .wr_readerBackground_opacity,
    .wr_whiteTheme .readerContent .app_content {
        background-color:  ${contentBg}!important;
    }
    .wr_whiteTheme .app_content{
        box-shadow: 0 0 3px 1px #8888;
    }
    .readerChapterContent{
        color:  ${fontColor}!important;
    }
    .readerControls{
        margin-left: calc(25%) !important;
        margin-bottom: -28px !important;
    }
    .readerControls{
        opacity: 0;
        transition-delay: 1s;
    }
    .readerControls:hover{
        opacity: 1;
        transition-delay: 0s;
    }
    button.readerControls_item,
    div.readerControls_fontSize{
        box-shadow: 0 0 5px 1px #8888!important;
    }
`;

GM_addStyle(style);

window.onload = function(){
    function getElmAync(selector){
        return new Promise(resolve=>{
            let t = maxWaitTime;
            const gap = 100;
            const itv = setInterval(()=>{
                t -= gap;
                let elm = $$(selector);
                if(elm.length > 0){
                    clearInterval(itv);
                    resolve(elm);
                }
                if(t <= 0){
                    clearInterval(itv);
                    resolve(null);
                }
            }, gap);
        });
    }

    // add btn to pre
    async function addCopyBtn(){
        let preCollection = await getElmAync('pre');
        let hasBtn = $('.copy-btn') ? true : false;
        let btnHtml = `<button class="copy-code" style="position: absolute;right: 0;top: 0;color:white;cursor:pointer;z-index:99999;">📋</button>`;

        if(preCollection !== null && !hasBtn){
            for(let pre of preCollection){
                pre.innerHTML += btnHtml;
            }
        }
    }
  
    addCopyBtn();
    const observer = new MutationObserver(addCopyBtn);
    const appContent = $('.app_content');
    observer.observe(appContent, {childList: true});

    document.body.addEventListener('click', ev=>{
        console.log(ev.target);
        if(ev.target.classList.contains('copy-code')){
            let code = ev.target.parentElement.textContent.replace('📋', '');
            GM_setClipboard(code);
            alert('code copied.');
        }
    });

// change page width
    function getCurrentMaxWidth(element) {
        let currentValue = window.getComputedStyle(element).maxWidth;
        currentValue = currentValue.substring(0, currentValue.indexOf('px'));
        currentValue = parseInt(currentValue);
        return currentValue;
    }

    function setWidth(width) {
        const item1 = $(".readerContent .app_content");
        const item2 = $('.readerTopBar');
        item1.style['max-width'] = width + 'px';
        item2.style['max-width'] = width + 'px';
        const myEvent = new Event('resize');
        window.dispatchEvent(myEvent);
        // fix: btn disappear after resizing
        setTimeout(addCopyBtn, 3000);
    }
  
    function addWidth(increment){
        const width = getCurrentMaxWidth($('.readerContent .app_content')) + increment;
        setWidth(width);
        GM_setValue('width', width);
    }
    
    let btnHTML = `
        <button class="readerControls_item widthIncrease" style="color:#6a6c6c;cursor:pointer;">宽</button>
        <button class="readerControls_item widthDecrease" style="color:#6a6c6c;cursor:pointer;">窄</button>
    `;
    let btnContainer = document.createElement('div');
    btnContainer.innerHTML = btnHTML;
    $('.readerControls').append(btnContainer.children[0], btnContainer.children[1]);
    $('.widthIncrease').addEventListener('click', () => addWidth(100));
    $('.widthDecrease').addEventListener('click', () => addWidth(-100));
  
    let width = GM_getValue('width', -1);
    if(width !== -1){
        setWidth(width);
    }


// auto hide topbar
    if(autoHideTopbar){
        let prevPos = 0;
        let topBar = $('.readerTopBar');
        let timer = -1;
        window.addEventListener('scroll', ev=>{
            if(timer !== -1) return;
            timer = setTimeout(()=>{
                let pos = document.documentElement.scrollTop || document.body.scrollTop;
                topBar.style.opacity = pos > prevPos ? '0' : '1';
                prevPos = pos;
                timer = -1;
            }, 300);
        });
    }

}