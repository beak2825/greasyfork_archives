// ==UserScript==
// @name         IPE禅模式
// @namespace    https://thdog.moe/
// @version      0.4
// @description  为IPE添加F11全屏功能
// @author       shirokurakana
// @match        *://thwiki.cc/*
// @icon         https://static.thbwiki.cc/favicon.ico
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533249/IPE%E7%A6%85%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/533249/IPE%E7%A6%85%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let isIPEFullScreen = false;

    // 配置参数
    const config = { childList: true, subtree: true };

    // 创建观察者
    const observer = new MutationObserver((mutations, obs) => {
        let preview = document.querySelector('.InPageEditPreview')
        if (preview) {
            preview.classList.add("mw-body-content");
            preview.style.color='var(--mw-color-base)';
            preview.style.backgroundColor='var(--mw-background-color-content)';
        }
        let wraps = document.getElementsByClassName('ssi-modalWrapper');
        if (document.querySelector('.ssi-modalWrapper')) {
            for (let i = 0; i < wraps.length; i++) {
                let wrap = wraps[i];
                if (wrap.firstChild === null) continue;
                let children = wrap.firstChild.children
                for (let j = 0; j < children.length; j++){
                    children[j].style.color = 'var(--mw-color-base)';
                    children[j].style.background='var(--mw-background-color-content)';
                }
            }
        }
        if (document.querySelector('.monaco-container')) {
            if (wraps.length > 1) {
                for (let i = 0; i < wraps.length; i++) {
                    let wrap = wraps[i];
                    let delWrap = false;
                    if (wrap.firstChild === null) {
                        delWrap=true;
                    }
                    else if (wrap.firstChild.id.search('ssi-notify') != -1) {
                        delWrap=true;
                    }
                    if (delWrap) {
                        let parent = wrap.parentElement;
                        parent.removeChild(wrap);
                        i--;
                    }
                }
            }
            if (isIPEFullScreen) {
                 isIPEFullScreen = true;
                setTimeout(() => {
                    setFullScreen();
                }, 200);
            }
        }
    });

    // 开始观察
    observer.observe(document.documentElement, config);

    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        // 检测按下的键是否是F11
        if (event.key === 'F11' || event.keyCode === 122) { // 双重兼容判断
            // 阻止浏览器默认全屏行为（可选）
            event.preventDefault();

            if (document.querySelector('.monaco-container') === null) {
                document.querySelector('#edit-btn').click();
                isIPEFullScreen = true;
                setTimeout(() => {
                    setFullScreen();
                }, 500);
            }
            else {
                if (isIPEFullScreen) {
                    unsetFullScreen();
                    isIPEFullScreen = false;
                } else {
                    setFullScreen();
                    isIPEFullScreen = true;
                }
            }
        }
    });

    function setFullScreen() {
        document.querySelector('.monaco-container').style.height = '640px';
        document.querySelector('#ssi-modalWrapper').style.width = '100%';
        document.querySelector('#ssi-modalWrapper').style.maxWidth = 'unset';
        document.querySelector('#ssi-modalWrapper').style.margin = '0 auto';
    }

    function unsetFullScreen() {
        document.querySelector('.monaco-container').style.height = '386px';
        document.querySelector('#ssi-modalWrapper').style.width = '85%';
        document.querySelector('#ssi-modalWrapper').style.maxWidth = '900px';
        document.querySelector('#ssi-modalWrapper').style.margin = '30px auto 20px';
    }
})();