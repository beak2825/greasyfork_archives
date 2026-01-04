// ==UserScript==
// @name         链接预览助手
// @namespace    https://github.com/CheckCoder
// @version      0.8.0
// @description  功能1：长按链接将打开内置窗口预览。Esc 可以关闭窗口。按住 Shift 或者 Alt 或者 Ctrl 或者 Command 键 或者 鼠标移动，长按时不会打开预览。功能2：鼠标中键 + （Shift 或者 Alt 或者 Ctrl 或者 Command 键），新窗口打开链接。
// @author       check
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/438622/%E9%93%BE%E6%8E%A5%E9%A2%84%E8%A7%88%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/438622/%E9%93%BE%E6%8E%A5%E9%A2%84%E8%A7%88%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // https://www.baidu.com 自动将 http 请求升级为 https
    if (window.location.href.indexOf('https://www.baidu.com') === 0) {
        const meta = document.createElement('meta');
        meta.setAttribute('http-equiv', 'Content-Security-Policy');
        meta.setAttribute('content', 'upgrade-insecure-requests');
        document.head.appendChild(meta);
    }

    // 界面
    const iframeContainer = document.createElement('div');
    iframeContainer.setAttribute('style', 'width: 100vw; height: 100vh; position: fixed; z-index: 99999; top: 0; left:0; display:none; background: rgba(0,0,0,0.5); justify-content: center; align-items:center');
    const iframe = document.createElement('iframe');
    iframe.setAttribute('style', 'width:90vw; height: 80vh; background: white; border: none');

    // 设置id
    const iframeContainerId = '$link-preview-iframeContainer';
    const iframeId = '$link-preview-iframe';
    iframeContainer.setAttribute('id', iframeContainerId);
    iframe.setAttribute('id', iframeId);

    function getIframeContainer() {
        return document.getElementById(iframeContainerId);
    }

    function getIframe() {
        return document.getElementById(iframeId);
    }

    iframeContainer.appendChild(iframe);

    // 显示和隐藏控制
    function show() {
        if (!getIframeContainer()) document.body.appendChild(iframeContainer);
        iframeContainer.style.display = 'flex';
    }

    function hide() {
        iframeContainer.style.display = 'none';
        iframe.src = '';
    }
    iframeContainer.addEventListener('click', hide);

    function getATagByEvent(event) {
        for(let i = 0; i < event.path.length; i++) {
            const nodeName = event.path[i].nodeName;
            if (nodeName && nodeName.toLocaleLowerCase() === 'a') {
                return event.path[i];
            }
        }
    }

    // 长按逻辑
    let pressTimer = null;
    let hasIntoTimeout = false;
    let loogPressThreshold = 350;
    let isPressCancelButton = false;
    document.body.addEventListener('mousedown', function(event) {
        // 按住 Shift 或者 Alt 或者 Ctrl 或者 Command 键，不长按打开预览
        if (event.shiftKey || event.altKey || event.ctrlKey || event.metaKey) return;
        // 非鼠标左键，不长按打开预览
        if (event.button !== 0) return;
        const aTag = getATagByEvent(event);
        if (!aTag) return;

        const href = aTag.getAttribute('href');
        if (!href || href.indexOf('javascript:') === 0) return;

        pressTimer = setTimeout(function() {
            hasIntoTimeout = true;
            iframe.src = href;
            show();
        }, loogPressThreshold);
    });
    function cancelTimer() {
        if (!pressTimer) return;

        clearTimeout(pressTimer);
        pressTimer = null;
    }
    document.body.addEventListener('mouseup', cancelTimer);
    // 鼠标移动取消
    let moveTime = 0;
    document.body.addEventListener('mousemove', function() {
        if (!pressTimer) return;
        if (++moveTime < 2) return;
        cancelTimer();
        moveTime = 0;
    });

    // document.body.addEventListener('click', function(event) {
    //     if (hasIntoTimeout) event.preventDefault();
    //     hasIntoTimeout = false;
    // });

    // esc 关闭
    document.body.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            window.parent.postMessage('$link-preview-hide', '*');
        }
    });
    window.addEventListener('message', function(event){
        if (event.data === '$link-preview-hide') {
            hide();
            window.focus();
        }
    }, {
        capture: true
    });

    // 鼠标中键 + （Shift 或者 Alt 或者 Ctrl 或者 Command 键），新窗口打开链接
    document.body.addEventListener('mousedown', function(event) {
        if (event.button !== 1 || !(event.shiftKey || event.altKey || event.ctrlKey || event.metaKey)) return;

        const aTag = getATagByEvent(event);
        if (!aTag) return;

        const href = aTag.getAttribute('href');
        if (!href || href.indexOf('javascript:') === 0) return;

        window.open(href);
    });
})();