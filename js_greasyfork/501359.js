// ==UserScript==
// @name         挂B
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  小洪个人测试用，请勿乱用
// @author       小洪
// @match        http*://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-end
// @license MIT
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/501359/%E6%8C%82B.user.js
// @updateURL https://update.greasyfork.org/scripts/501359/%E6%8C%82B.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function seekToLast10Seconds() {
        const video = document.querySelector('video');
        if (video) {
            const duration = video.duration;
            const seekTime = Math.max(duration - 1, 0);
            if (video.currentTime < seekTime) {
                video.currentTime = seekTime;
            }
        }
    }

    
    function shouldRefreshPage() {
        const divs = Array.from(document.querySelectorAll('div'));
        return divs.some(div => div.textContent.includes('目录'));
    }


    function refreshPageAfterDelay() {
        setTimeout(() => {
            if (shouldRefreshPage()) {
                
                location.reload(); // 刷新网页
            } 
        }, 4000);
    }

  
    function verifyAndSeek() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://sk.hxj521.cn/a.php',
            onload: function(response) {
                try {
                    console.log('接口响应:', response.responseText); 
                    const data = JSON.parse(response.responseText);
                    if (data === true) {
                        console.log('开始奔放');
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                seekToLast10Seconds();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
                        refreshPageAfterDelay();
                    } else {
                        console.log('非');
                    }
                } catch (e) {
                    console.error('解析响应失败:', e);
                }
            },
            onerror: function(error) {
                console.error('接口请求失败:', error);
            },
            ontimeout: function() {
                console.error('接口请求超时');
            }
        });
    }


    window.addEventListener('load', function() {
        setTimeout(() => {
            verifyAndSeek();
        }, 1000); //
    });


})();
