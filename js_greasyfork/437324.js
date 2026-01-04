// ==UserScript==
// @name        FCTool
// @version     0.1.4
// @author      xiefucai
// @description 这是一款可以功能强大、使用简单的工具\n可将网页文章内容转为markdown文档\n可提取网页中的svg图片\n阅读的时候可以高亮显示选中的文本(需要在设置中打开，每个网站的设置都是独立的)\n可以根据规则隐藏广告内容(需要在设置中打开，每个网站的设置都是独立的)\n可以高亮下载链接，进入电影天堂等下载站的时候，如果页面中有下载地址，会高亮出来，点击下载地址方便下载到迅雷云盘或者玩客云。。
// @homepage    http://xiefucai.gitee.io
// @license MIT
// @match       *://*/*
// @namespace   http://tampermonkey.net/
// @homepageURL http://xiefucai.gitee.io
// @grant       GM_registerMenuCommand
// @grant       GM_getResourceText
// @grant       GM_addStyle
// @grant       GM_xmlhttpRequest
// @resource    injectScript   https://cdn.jsdelivr.net/gh/xiefucai/Chrome@master/userscripts/send2reader/index1.js?20240603
// @resource    injectScript_test   https://localhost:3000/static/js/index.bundle.js?24
// @downloadURL https://update.greasyfork.org/scripts/437324/FCTool.user.js
// @updateURL https://update.greasyfork.org/scripts/437324/FCTool.meta.js
// ==/UserScript==

'use strict';
const getFullPath = src => {
    const a = document.createElement('a')
    a.href = src
    return a.href
}
const getImgSrc = img => {
    const src =
        img.getAttribute('data-actualsrc') ||
        img.getAttribute('data-original-src') ||
        img.getAttribute('data-src') ||
        img.src ||
        ''
    return getFullPath(src)
}

const corsRequest = (options, callback) => {
	if (typeof GM_xmlhttpRequest === 'function') {
        console.log('GM_xmlhttpRequest request');
        GM_xmlhttpRequest({
            ...options,
            /*
            onreadystatechange: function(event) {
                console.log(
                    `Ready state: ${event.readyState}, status ${event.status}`
                );
            },
            onprogress: function(event) {
                if (event.lengthComputable) {
                    console.log(
                        `Downloading: ${event.loaded}/${event.total}`
                    );
                }
            },
            */
            onload: function(res) {
                console.log('GM_xmlhttpRequest onload finish', res);
                callback(null, res.response || res);
            },
            onerror: function(res) {
                console.log("Can't load file.", res);
                callback(res)
            }
        });
    } else if (
        typeof (window.GM && window.GM.xmlHttpRequest) === 'function'
    ) {
        console.log('GM.xmlHttpRequest request');
        GM.xmlHttpRequest({
            ...options,
            onload: function(response) {
                var responseXML = null;
                // Inject responseXML into existing Object (only appropriate for XML content).
                console.log(response);
                if (!response.responseXML) {
                    responseXML = new DOMParser().parseFromString(
                        response.responseText,
                        'text/xml'
                    );
                }

                console.log(
                    [
                        response.status,
                        response.statusText,
                        response.readyState,
                        response.responseHeaders,
                        response.responseText,
                        response.finalUrl,
                        responseXML
                    ].join('\n')
                );
            }
        });
    } else {
        console.log('corsRequest request');
        /* document.dispatchEvent(
            new CustomEvent('corsRequest', {
                detail: {
                    options,
                    callback: (err, data) => {
                        console.log(err, data);
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(data);
                    }
                }
            })
        ); */
    }
};

if (window === top.window) {
    let scriptContent = GM_getResourceText('injectScript')
    let script = document.createElement('script')
    script.id = 'xiefucai-inject-script';
    var blob = new Blob([scriptContent], {
        type: 'text/javascript'
    });
    var url = URL.createObjectURL(blob);
    script.onerror = function () {
        console.log("load script ", url, "failed");
        new Function(scriptContent)();
    }
    script.src = url;
    script.charset="utf-8";
    document.body.corsAble = true;
    document.addEventListener('corsRequest', function (e) {
        corsRequest(e.detail.options, e.detail.callback);
    }, false)

    document.body.appendChild(script);
} else if (location.hostname === 'www.iciba.com') {
    const styleElem = document.createElement('link');
    styleElem.href = '//cdn.jsdelivr.net/gh/xiefucai/Chrome@master/userscripts/send2reader/iciba.css';
    // styleElem.href = 'http://localhost:3000/iciba.css';
    styleElem.rel = "stylesheet";
    styleElem.type = "text/css";
    document.head.appendChild(styleElem);
}