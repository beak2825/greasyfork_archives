// ==UserScript==
// @name         阻止天雪加载异常图片
// @namespace    http://tampermonkey.net/
// @version      0.5.0
// @description  阻止加载包含特定关键词的图片
// @author       tdh
// @match        https://*.skyeysnow.com/*
// @match        https://*.skyey2.com/*
// @grant        none
// @sandbox      raw
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/475097/%E9%98%BB%E6%AD%A2%E5%A4%A9%E9%9B%AA%E5%8A%A0%E8%BD%BD%E5%BC%82%E5%B8%B8%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/475097/%E9%98%BB%E6%AD%A2%E5%A4%A9%E9%9B%AA%E5%8A%A0%E8%BD%BD%E5%BC%82%E5%B8%B8%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const allowAvatar = true;
    const doURLCheck = false;
    const blockedKeywords = ['download.php', 'php', 'wzdc.tk','wzdc.cc','?id='];

    function checkRedirect(url) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open("HEAD", url, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 301 || xhr.status === 302) {
                        resolve(true); // 是跳转链接
                    } else {
                        resolve(false); // 不是跳转链接

                    }
                }
            };
            xhr.onerror = () => {
                reject(new Error("请求失败"));
            };
            xhr.send();
        });
    }

    function checkUrl(urlToCheck,callback) {
        checkRedirect(urlToCheck)
            .then((isRedirect) => {
                if (isRedirect) {
                    console.log("链接跳转屏蔽")
                } else {
                    callback()
                }
            })
            .catch((error) => {
                console.error(`发生错误: ${error.message}`);
            });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'IMG') {
                    const img = node;
                    const rawImg = img.src;
                    const rawAlt = img.alt;
                    const loadRawImg = function () {
                        img.src = rawImg;
                        img.alt = rawAlt;
                    };
                    for (const keyword of blockedKeywords) {
                        if(allowAvatar && (img.src.startsWith('https://skyeysnow.com/uc_server/avatar.php') || img.src.startsWith('https://www.skyey2.com/uc_server/avatar.php'))){
                            break;
                        }
                        if (img.src.startsWith("http://bbs.skyeysnow.com/mybar.php")) {
                            break;
                        } // https://skyeysnow.com/forum.php?mod=viewthread&tid=47083
                        if(img.src.startsWith('https://skyeysnow.com/mybar.php?type=puzzle') || img.src.startsWith('https://www.skyey2.com/mybar.php?type=puzzle')){
                            break;
                        }
                        if (img.src.includes(keyword)) {
                            console.log("已屏蔽图片：" + img.src)
                            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
                            img.alt = 'Blocked Image';
                            break;
                        }
                    }
                    if (doURLCheck){
                        if(img.src === rawImg){
                            checkUrl(img.src, loadRawImg)
                            img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///////yH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';
                            img.alt = 'Blocked Image';
                        }
                    }


                }
            });
        });
    });
    observer.observe(document, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
})();


