// ==UserScript==
// @name         flowoss自定义字体
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自定义 epub-view iframe 中的字体
// @author       Axiss
// @match        https://app.flowoss.com/*
// @grant        none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/500618/flowoss%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/500618/flowoss%E8%87%AA%E5%AE%9A%E4%B9%89%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[Flowoss Font] Script started');

    // 添加Google Fonts样式链接
    var link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    console.log('[Flowoss Font] Google Fonts stylesheet link added to main document');

    // 创建一个MutationObserver实例来监听DOM变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(function(node) {
                    if (node.classList && node.classList.contains('epub-view')) {
                        console.log('[Flowoss Font] New epub-view element added');
                        setTimeout(()=>{
                            handleEpubView(node);
                        },1000)

                    }
                });
            }
        });
    });

  // 配置MutationObserver监听的目标节点和配置项
    var config = { childList: true, subtree: true };
    observer.observe(document.body, config);

    console.log('[Flowoss Font] MutationObserver configured to observe document body');

    function handleEpubView(epubView) {
        var iframes = epubView.getElementsByTagName('iframe');

        console.log('[Flowoss Font] epub-view element contains', iframes.length, 'iframe(s)');

        for (let j = 0; j < iframes.length; j++) {
            let iframe = iframes[j];
            console.log('[Flowoss Font] Handling iframe', j);
            handleIframe(iframe);
        }
    }

    function handleIframe(iframe) {
        while (iframe.contentDocument.body == null) {
            console.log('[Flowoss Font] Waiting for iframe content to load');
        }
        console.log('[Flowoss Font]',iframe.contentDocument.body);
        var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        var customStyle = iframeDocument.createElement('style');
        customStyle.innerHTML = `
            body {
                font-family: 'Noto Sans SC', sans-serif !important;
                font-size: 16px; /* 你可以根据需要调整字体大小 */
            }
        `;
        iframeDocument.head.appendChild(customStyle);

        // 添加Google Fonts样式链接到 iframe
        var iframeLink = iframeDocument.createElement('link');
        iframeLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+SC&display=swap';
        iframeLink.rel = 'stylesheet';
        iframeDocument.head.appendChild(iframeLink);

    }
})();