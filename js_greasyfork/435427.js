// ==UserScript==
// @name         简易下载助手自动点击
// @namespace    https://greasyfork.org/zh-CN/scripts/435427
// @homepageURL    https://greasyfork.org/zh-CN/scripts/435427
// @version      0.4
// @description  简易下载助手的自动点击
// @author       dazzulay
// @match        *://pan.baidu.com/disk/*
// @icon         https://pan.baidu.com/ppres/static/images/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435427/%E7%AE%80%E6%98%93%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/435427/%E7%AE%80%E6%98%93%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let isOldHomePage = function () {
        let url = location.href;
        if (url.indexOf(".baidu.com/disk/home") > 0) {
            return true;
        } else {
            return false;
        }
    };

    let isNewHomePage = function () {
        let url = location.href;
        if (url.indexOf(".baidu.com/disk/main") > 0) {
            return true;
        } else {
            return false;
        }
    };

    let isSharePage = function () {
        let path = location.pathname.replace('/disk/', '');
        if (/^\/(s|share)\//.test(path)) {
            return true;
        } else {
            return false;
        }
    }

    let getPageType = function () {
        if (isOldHomePage()) return 'old';
        if (isNewHomePage()) return 'new';
        if (isSharePage()) return 'share';
        return '';
    }


    let btnEasyHelper = 'btnEasyHelper';
    let dialogBtnGetUrl = 'dialogBtnGetUrl';
    let dialogBtnAria = 'dialogBtnAria';
    let closeBtn = '.swal-button--confirm';
    let items = '#layoutMain dd > span';
    let itemsNew = '.mouse-choose-item';

    sleep(500).then(() => {
        start();
    })

    function start() {//迭代调用

        let pageType = getPageType();
        if (pageType === '') {
            console.log('非正常页面，1秒后将重新查找！');
            sleep(500).then(() => {
                start();
            })
            return;
        }

        let btnDownload = {
            id: 'btnEasyHelperAutoDown',
            text: '简易下载助手自动下载',
            title: '使用百度网盘简易下载助手进行下载',
            html: function (pageType) {
                if (pageType === 'old' || pageType == 'share') {
                    return `
                    <span class="g-button-right">
                        <em class="icon icon-download" style="color:#ffffff" title="${this.text}"></em>
                        <span class="text" style="width: auto;">${this.text}</span>
                    </span>
                `
                }
                if (pageType === 'new') {
                    return `
                    <button class="u-button nd-file-list-toolbar-action-item is-need-left-sep u-button--danger u-button--default u-button--small is-has-icon">
                        <i class="iconfont icon-download"></i>
                        <span>${this.text}</span>
                    </button>
                `;
                }
            },
            style: function (pageType) {
                if (pageType === 'old' || pageType == 'share') {
                    return '';
                }
                if (pageType === 'new') {
                    return '';
                }
            },
            class: function (pageType) {
                if (pageType === 'old' || pageType == 'share') {
                    return 'g-button g-button-red-large';
                }
                if (pageType === 'new') {
                    return '';
                }
            }
        };
        // 创建按钮 START
        let btn = document.createElement('a');
        btn.id = btnDownload.id;
        btn.title = btnDownload.title;
        btn.innerHTML = btnDownload.html(pageType);
        btn.style.cssText = btnDownload.style(pageType);
        btn.className = btnDownload.class(pageType);
        btn.addEventListener('click', async function (e) {
            await initButtonEvent(pageType);
            e.preventDefault();
        });
        // 创建按钮 END

        // 添加按钮 START
        let parent = null;
        if (pageType === 'old') {
            let btnUpload = document.querySelector('[node-type=upload]'); // 管理页面：【上传】
            parent = btnUpload.parentNode;
            parent.insertBefore(btn, parent.childNodes[0]);
        } else if (pageType === 'new') {
            let btnUpload = document.querySelector("[class='nd-file-list-toolbar nd-file-list-toolbar__actions inline-block-v-middle']"); // 管理页面：【新建文件夹】

            btnUpload = document.querySelector("[class='nd-file-list-toolbar nd-file-list-toolbar__actions inline-block-v-middle']"); // 管理页面：【新建文件夹】
            if (btnUpload) {
                btn.style.cssText = 'margin-right: 5px;';
                // alert('inline-block-v-middle');
                btnUpload.insertBefore(btn, btnUpload.childNodes[0]);
            } else {
                btnUpload = document.querySelector("[class='wp-s-agile-tool-bar__header  is-default-skin is-header-tool']"); // 20220612管理页面：整个工具条
                // console.log(btnUpload);
                if (!btnUpload) {
                    btnUpload = document.querySelector("[class='wp-s-agile-tool-bar__header  is-header-tool']"); // 20220629管理页面：整个工具条
                }
                let parentDiv = document.createElement('div');
                parentDiv.className = 'wp-s-agile-tool-bar__h-action is-need-left-sep is-list';
                parentDiv.style.cssText = 'margin-right: 10px;';
                parentDiv.insertBefore(btn, parentDiv.childNodes[0]);
                btnUpload.insertBefore(parentDiv, btnUpload.childNodes[0]);
            }
        } else if (pageType === 'share') {
            let btnQrCode = document.querySelector('[node-type=qrCode]'); // 分享页面：【保存到手机】
            parent = btnQrCode.parentNode;
            parent.insertBefore(btn, btnQrCode);
        }
        // 添加按钮 END

    }

    async function initButtonEvent(pageType){
        if (pageType === 'old') {
            initButtonEventOld()
        }else if (pageType === 'new') {
            initButtonEventNew()
        }
    }
    async function initButtonEventOld(){
        let spans = document.querySelectorAll(items);
        let selectedSpans = [];
        if(spans.length > 0){
            for (let i = 0; i < spans.length; ++i) {
                let span = spans[i];
                let icon = span.querySelector('.icon');
                if(!isHidden(icon)){
                    span.click();
                    selectedSpans.push(span);
                }
            }
        }

        if(selectedSpans.length > 0){
            for (let i = 0; i < selectedSpans.length; ++i) {
                let span = selectedSpans[i];
                await downloadOld(span);
            }
        }
    }
    async function downloadOld(span){
        return new Promise(async resolve => {
            let icon = span.querySelector('.icon');
            if(isHidden(icon)){
                span.click();
            }
            clickById(btnEasyHelper);
            let timer = setInterval(async ()=>{
                let cb = document.getElementById(dialogBtnGetUrl);
                if(cb){
                    clickById(dialogBtnGetUrl);
                    let cb2 = document.getElementById(dialogBtnAria);
                    if(cb2 && !isHidden(cb2)){
                        clearInterval(timer);
                        sleep(500).then(() => {
                            clickById(dialogBtnAria);
                            $(closeBtn).click();
                            if(!isHidden(icon)){
                                span.click();
                            }
                            resolve();
                        })
                    }
                }
            },500);
        });
    };
    async function initButtonEventNew(){
        let selectedSpans = document.querySelectorAll('.mouse-choose-item.selected');
        console.log(selectedSpans.length);
        if(selectedSpans.length > 0){
            for (let i = 0; i < selectedSpans.length; ++i) {
                let span = selectedSpans[i];
            }
            for (let i = 0; i < selectedSpans.length; ++i) {
                let span = selectedSpans[i];
                if(selectedSpans.length > 1){
                    span.click();
                }
                await downloadNew(span);
            }
        }
    }
    async function downloadNew(span){
        return new Promise(async resolve => {
            sleep(500).then(() => {
                clickById(btnEasyHelper);
            })
            let timer = setInterval(async ()=>{
                let cb = document.getElementById(dialogBtnGetUrl);
                if(cb){
                    clickById(dialogBtnGetUrl);
                    let cb2 = document.getElementById(dialogBtnAria);
                    if(cb2 && !isHidden(cb2)){
                        clearInterval(timer);
                        sleep(500).then(() => {
                            clickById(dialogBtnAria);
                            $(closeBtn).click();
                            span.click();
                            resolve();
                        })
                    }
                }
            },500);
        });
    };


    // 延迟执行，否则找不到对应的按钮
    function sleep(time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    };


    function clickById(id) {
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        const cb = document.getElementById(id);
        cb.dispatchEvent(event);
    }
    function isHidden(el) {
        return (el.offsetParent === null)
    }
})();