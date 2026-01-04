// ==UserScript==
// @name         ugreen nas
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  对绿联网页版增强. 也可用于IP直连模式,需要自己配置@match
// @author       BarryChen
// @match        https://cloud.ugnas.com/*
// @grant        none
// @homepageURL  https://github.com/cp19890714/userscript
// @downloadURL https://update.greasyfork.org/scripts/475230/ugreen%20nas.user.js
// @updateURL https://update.greasyfork.org/scripts/475230/ugreen%20nas.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //通过样式修改图片列表中图片的默认尺寸
    (function imageSizeIncrease() {
        document.querySelector('style').innerHTML += `
        .horizontal-item[data-v-39b53426] {
            width: auto !important;
            margin: 0px 0px !important;
            overflow: auto !important;
            border: 0px !important;
        }
        .horizontal-item .name-wrapper[data-v-39b53426] {
            margin-top: 0px !important;
        }
        .horizontal-item .icon-wrapper[data-v-39b53426] {
            margin-top: 0px !important;
        }
        
        .horizontal-item .icon-wrapper img.thumbs[lazy=loaded][data-v-39b53426] {
            /*     max-height: 100% !important; */
            max-width: 100% !important;
            max-height: unset !important;
            border: 1px solid var(--mainPanelColor) !important;
        }
        
        .virtual-item[data-v-760eafcf] {
            flex: auto !important;
        }
        
        .horizontal-item .icon-wrapper.thumbs[data-v-39b53426] {
            height: auto !important;
        }
        
        .horizontal-item .name-wrapper[data-v-39b53426] {
            height: 20px !important;
        }
        .size {
            display: block !important;
        }
        `
    })();

    // 是否按下了 command/alt 键
    let commandDown = false;

    // 按下 command/alt 键触发
    document.addEventListener('keydown', e => {
        if (e.key === 'Meta' || e.key === 'Alt') {
            commandDown = true;
            console.log('command down');
        }
    });

    // 松开 command 键触发
    document.addEventListener('keyup', e => {
        if (e.key === 'Meta' || e.key === 'Alt') {
            commandDown = false;
            console.log('command up');
        }
    });

    const previewImage = (e) => {
        e.target.classList.add('hadPreview');
        const img = e.target;
        let preview = null;
        let pos = null;
        let thisDoc = null;
        if (commandDown) {
            //基于整个浏览器窗口,固定位置展示大图
            thisDoc = getOwnerDocument(document);
            pos = calcFixedPreviewPos(e);
        } else {
            //基于文件管理器iframe,跟随鼠标,展示大图
            pos = calcFlexiblePreviewPos(e);
            thisDoc = document;
        }
        preview = thisDoc.createElement('img');
        preview.src = img.getAttribute('data-src').replace('SMALL', 'LARGE');
        preview.className = 'preview';
        preview.style.position = 'absolute';
        preview.style.left = pos.x + 'px';
        preview.style.top = pos.y + 'px';
        preview.style.height = pos.preHeight + 'px';
        preview.style.width = pos.preWidth + 'px';
        preview.style.zIndex = 9000;
        preview.style.boxShadow = '0px 0px 20px 0px black';
        thisDoc.body.appendChild(preview);
    };

    const removePreview = () => {
        //尝试移除iframe中的预览图
        let preview = document.querySelector('.preview');
        if (preview) {
            document.querySelector('body').removeChild(preview);
        }
        //尝试移除浏览器窗口中的预览图
        const ownerDocument = getOwnerDocument(document);
        preview = ownerDocument.querySelector('.preview');
        if (preview) {
            ownerDocument.querySelector('body').removeChild(preview);
        }
    };

    /**
     * 计算iframe中跟随鼠标位置的预览大图的坐标和大小
     * @param {Event} e 
     * @returns 
     */
    function calcFlexiblePreviewPos(e) {
        const img = e.target;
        // 预览图默认显示在鼠标右下方
        let x = e.pageX;
        let y = e.pageY;
        // 窗口大小
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;

        // 计算预览图大小
        let preWidth = 0;
        let preHeight = 0;
        const maxHeight = Math.min(400, winHeight);
        const maxWidth = Math.min(400, winWidth);
        const imageHeight = img.offsetHeight;
        const imageWidth = img.offsetWidth;
        if (imageHeight >= imageWidth) {
            preHeight = maxHeight;
            preWidth = preHeight * imageWidth / imageHeight;
        } else {
            preWidth = maxWidth;
            preHeight = preWidth * imageHeight / imageWidth;
        }

        x = x + 100;
        y = y + 100;
        // 如果默认位置超出右侧边界,则调整为图片左下方
        if (x + preWidth > winWidth) {
            x = e.pageX - preWidth - imageWidth - 10;
        }
        if (x < 0) {
            x = 0;
        }

        // 如果默认位置超出下方边界,则调整为图片上方
        if (y + preHeight > winHeight) {
            y = e.pageY - preHeight - 100;
        }
        if (y < 0) {
            y = 0;
        }

        return { x, y, preWidth, preHeight };
    }

    /**
     * 计算基于整个浏览器窗口的位置固定的 预览大图的位置和大小
     * @param {Event} e 
     */
    function calcFixedPreviewPos(e) {
        const img = e.target;
        let x = 10;
        let y = 10;

        // 窗口大小
        const parentWindow = document.defaultView.parent
        const winWidth = parentWindow.innerWidth;
        const winHeight = parentWindow.innerHeight;
        // 计算预览图大小
        let preWidth = 0;
        let preHeight = 0;
        const maxHeight = winHeight - 20;
        const maxWidth = winWidth * 0.48;
        const imageHeight = img.offsetHeight;
        const imageWidth = img.offsetWidth;
        if (imageHeight > imageWidth) {
            preHeight = maxHeight;
            preWidth = preHeight * imageWidth / imageHeight;
            if (preWidth >= maxWidth) {
                preWidth = maxWidth;
                preHeight = preWidth * imageHeight / imageWidth;
            }
        } else {
            preWidth = maxWidth;
            preHeight = preWidth * imageHeight / imageWidth;
        }

        //获取iframe的位置
        const iframe = getOwnerDocument(document).querySelector('iframe');
        const iframeRect = iframe.getBoundingClientRect();
        const iframeX = iframeRect.x;
        const iframeY = iframeRect.y;
        //鼠标在整个浏览器窗口中的位置
        const mouseInWindowX = e.pageX + iframeX;
        const mouseInWindowY = e.pageY + iframeY;

        //如果图片4个点的坐标覆盖了鼠标位置,则调整预览图x坐标位置.
        if (mouseInWindowX < x + preWidth && mouseInWindowX > x) {
            x = winWidth - preWidth;
        }
        return { x, y, preWidth, preHeight }
    }

    /**
     * 获取iframe的父document
     * @param {*} iframeDocument 
     * @returns 
     */
    const getOwnerDocument = (iframeDocument) => {
        return iframeDocument.defaultView.parent.document;
    }

    window.onload = function () {
        console.log('页面加载完成')
        if(document.URL.indexOf('#/file-manage')<0){
            return;
        }
        const observer = new MutationObserver(mutations => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType != 1) return
                    const imgs = node.querySelectorAll("img.thumbs")
                    if (!imgs || imgs.length === 0) return
                    //为图片添加预览事件
                    imgs.forEach(i => { i.addEventListener('mouseover', previewImage); i.addEventListener('mouseout', removePreview); })
                })
            }
        })
        observer.observe(document.body, { childList: true, subtree: true })
    }

})();