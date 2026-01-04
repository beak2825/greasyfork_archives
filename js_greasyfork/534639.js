// ==UserScript==
// @name         gcc vpn防掉线
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一点小小的hook
// @author       LinXingJun
// @include      *://*.vpn.gcc.edu.cn:*/*
// @include      *://vpn.gcc.edu.cn/*
// @grant        unsafeWindow
// @connect      *
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534639/gcc%20vpn%E9%98%B2%E6%8E%89%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/534639/gcc%20vpn%E9%98%B2%E6%8E%89%E7%BA%BF.meta.js
// ==/UserScript==
//修改指纹,防鉴别
function createfinger() {
    const toBlob = unsafeWindow.HTMLCanvasElement.prototype.toBlob;
    const toDataURL = unsafeWindow.HTMLCanvasElement.prototype.toDataURL;

    unsafeWindow.HTMLCanvasElement.prototype.htGfd = function () {
        const { width, height } = this;
        const context = this.getContext('2d');
        const shift = {
            'r': Math.floor(Math.random() * 10) - 5,
            'g': Math.floor(Math.random() * 10) - 5,
            'b': Math.floor(Math.random() * 10) - 5
        };
        const matt = context.getImageData(0, 0, width, height);
        for (let i = 0; i < height; i += 3) {
            for (let j = 0; j < width; j += 3) {
                const n = ((i * (width * 4)) + (j * 4));
                matt.data[n + 0] = matt.data[n + 0] + shift.r;
                matt.data[n + 1] = matt.data[n + 1] + shift.g;
                matt.data[n + 2] = matt.data[n + 2] + shift.b;
            }
        }
        context.putImageData(matt, 0, 0);
        this.htGfd = () => {
            top.postMessage('htGfd-called', '*');
        };
        top.postMessage('htGfd-called', '*');
    };

    Object.defineProperty(unsafeWindow.HTMLCanvasElement.prototype, 'toBlob', {
        value: function () {
            if (unsafeWindow.documentElement.dataset.htgfd !== 'false') {
                this.htGfd();
            }
            return toBlob.apply(this, arguments);
        }
    });
    Object.defineProperty(unsafeWindow.HTMLCanvasElement.prototype, 'toDataURL', {
        value: function () {
            if (unsafeWindow.documentElement.dataset.htgfd !== 'false') {
                this.htGfd();
            }
            return toDataURL.apply(this, arguments);
        }
    });
    unsafeWindow.document.documentElement.dataset.htGfd = true;
    if (unsafeWindow.top !== unsafeWindow.self) {
        console.log("修改iframe指纹成功")
    } else {
        console.log("修改自身指纹成功")
    }
}
function iframeonload(iframe, src) {
    console.log("已加载成功" + src);
    setInterval(function () {
        if (iframe.contentDocument) {
            const buttons = Array.from(iframe.contentDocument.querySelectorAll("*"));

            if (buttons.length > 0) {
                const randomButton = buttons[Math.floor(Math.random() * buttons.length)];

                // 创建mouseenter事件
                const event = new Event('mouseenter', {
                    bubbles: true,
                    cancelable: true
                });

                // 触发事件
                randomButton.dispatchEvent(event);
            }
        }
    }, 500);
    setInterval(function () {
        if (iframe.contentDocument) {
            const links = Array.from(iframe.contentDocument.querySelectorAll('a[href]'))
                .map(link => link.href)
                .filter(href => href
                    && !href.startsWith('javascript:')
                    && !href.startsWith('#')
                    && href.endsWith('.html')
                    && (async () => {
                        try {
                            const response = await new Promise((resolve, reject) => {
                                GM_xmlhttpRequest({
                                    method: 'HEAD',
                                    url: href,
                                    onload: function(response) {
                                        resolve(response);
                                    },
                                    onerror: function(error) {
                                        reject(error);
                                    }
                                });
                            });
                            return true;
                        } catch (e) {
                            return false;
                        }
                    })()
                );
            var randomLink;
            if (links.length === 0) {
                randomLink = unsafeWindow.location.href;
            } else {
                const randomIndex = Math.floor(Math.random() * links.length);
                randomLink = links[randomIndex];
            }
            console.log("开始加载" + randomLink);
            iframe.remove();
            createHiddenIframe(randomLink);
        }
    }, 5000)
}
// 创建隐藏的iframe
function createHiddenIframe(src) {
    const iframe = unsafeWindow.document.createElement('iframe');
    iframe.src = src;
    iframe.onload = iframeonload(iframe, src);
    iframe.style.visibility = 'hidden';
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = '100px';
    iframe.style.height = '100px';
    iframe.style.border = 'none';
    iframe.style.opacity = '0';
    iframe.style.zIndex = '-9999';
    iframe.sandbox = 'allow-scripts allow-same-origin';
    // 添加到页面
    unsafeWindow.document.body.appendChild(iframe);
    return iframe;
}

(function () {
    createfinger();
    unsafeWindow.console.clear = function () {
        // Do nothing - console won't be cleared
    };
    unsafeWindow.console.info = function () {
        // Do nothing - console won't be cleared
    };
    unsafeWindow.console.error = function () {
        // Do nothing - console won't be cleared
    };
    if (unsafeWindow.top !== unsafeWindow.self) {
        document.addEventListener('click', function (event) {
            console.log('劫持到click事件:', event.target);
            // 阻止事件继续传播
            event.stopPropagation();
            event.preventDefault();
        }, true);
        return;
    }
    var hiddeniframe;
    unsafeWindow.document.addEventListener('DOMContentLoaded', function () {
        hiddeniframe = createHiddenIframe(unsafeWindow.location.href);
    })
})();