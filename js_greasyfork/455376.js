// ==UserScript==
// @name         Load pictures on ODSW
// @name:zh-CN   加载ODSW网站上的图片
// @namespace    https://www.owendswang.com/
// @version      0.4.0
// @description  Load pictures from weibo.com without limitation on 'owendswang.com'.
// @description:zh-CN  跳过微博图床外链限制，加载“owendswang.com”网站上的微博外链图片。
// @icon         https://avatars.githubusercontent.com/u/9076865?s=40&v=4
// @author       OWENDSWANG
// @license      MIT
// @match        https://www.owendswang.com/
// @match        https://www.owendswang.com/?*
// @match        https://www.owendswang.com/weibo/*
// @match        https://www.owendswang.com/weixin/*
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      sinaimg.cn
// @connect      owendswang.com
// @connect      weibocdn.com
// @downloadURL https://update.greasyfork.org/scripts/455376/Load%20pictures%20on%20ODSW.user.js
// @updateURL https://update.greasyfork.org/scripts/455376/Load%20pictures%20on%20ODSW.meta.js
// ==/UserScript==

(function() {
    'use strict';
/*
    function saveAs(blob, name) {
        const link = document.createElement("a");
        link.style.display = "none";
        link.href = URL.createObjectURL(blob);
        link.download = name;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        const timeout = setTimeout(() => {
            URL.revokeObjectURL(link.href);
            link.parentNode.removeChild(link);
        }, 1000);
    }
*/
    const getImage = (el) => {
        const url = el.getAttribute('data-src');
        if(url.startsWith('http')) {
            GM_xmlhttpRequest({
                method: 'get',
                url,
                responseType: 'blob',
                withCredentials: false,
                headers: {
                    'Referer': 'https://weibo.com/',
                    'Origin': 'https://weibo.com/'
                },
                onload: function ({ status, response }) {
                    let blobUrl = URL.createObjectURL(response);
                    if(status === 200) {
                        if(el.tagName === "IMG") {
                            el.src = blobUrl;
                        } else if (el.tagName === "DIV") {
                            el.style.backgroundImage = 'url(\'' + blobUrl + '\')';
                        } else if (el.tagName === "VIDEO") {
                            el.setAttribute('poster', blobUrl)
                        } else if (el.tagName === "SOURCE" && el.parentElement.tagName === "VIDEO") {
                            el.src = blobUrl;
                            el.parentElement.load();
                        }
                    }
                    /*let decodedSrc = decodeURIComponent(url);
                    let fileName;
                    if (decodedSrc.endsWith('.mov')) {
                        fileName = decodedSrc.split('/')[decodedSrc.split('/').length - 1];
                        fileName = fileName.split('?')[0];
                    } else {
                        fileName = decodedSrc.split('?')[0];
                        fileName = fileName.split('/')[fileName.split('/').length - 1];
                    }
                    saveAs(response, fileName);*/
                },
                onabort: function() { console.log('aborted'); },
                onerror: function() { console.log('error'); },
                onloadstart: function() { console.log('load started'); },
                onprogress: function() { /*console.log('progressing');*/ },
                onreadystatechange: function() { console.log('ready state changed'); },
                ontimeout: function() { console.log('timeout'); },
            })
        }
    }
    document.querySelectorAll('.lozad').forEach((el) => {
        // console.log(el)
        getImage(el)
    });
    const weiboNotice1 = bootstrap.Alert.getOrCreateInstance('#weibo-notice-1')
    weiboNotice1.close()
})();
