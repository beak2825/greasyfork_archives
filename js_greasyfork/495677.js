// ==UserScript==
// @name         丫丫助手—小雅课件下载
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  丫丫助手是适用于小雅平台的QoL脚本
// @author       gxcuuu
// @match        https://*.ai-augmented.com/*
// @grant        none
// @icon https://whut.ai-augmented.com/api/jw-starcmooc/oss/seeSignUrl?url=http://cloud-course-publication.oss-cn-shanghai.aliyuncs.com/prodFile/0befd221be6d4cb1a87200ae772a1c09.ico
// @license GPLv3
// @downloadURL https://update.greasyfork.org/scripts/495677/%E4%B8%AB%E4%B8%AB%E5%8A%A9%E6%89%8B%E2%80%94%E5%B0%8F%E9%9B%85%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/495677/%E4%B8%AB%E4%B8%AB%E5%8A%A9%E6%89%8B%E2%80%94%E5%B0%8F%E9%9B%85%E8%AF%BE%E4%BB%B6%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function () {
        originalPushState.apply(this, arguments);
        modifyDOM();
    };

    history.replaceState = function () {
        originalReplaceState.apply(this, arguments);
        modifyDOM();
    };

    function modifyDOM() {
        // Create a MutationObserver instance to monitor DOM changes
        const observer = new MutationObserver((mutationsList, observer) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    const banner = document.querySelector('.common_node_content_banner');
                    if (banner) {
                        const title = banner.querySelector('.title');
                        if (title.textContent.endsWith('...') && title.hasAttribute('title')) {
                            var fileName = title.getAttribute('title')
                        } else {
                            fileName = document.title.split('|')[0].trim();
                        }
                        console.log(fileName);
                        const fileType = fileName.split('.').pop();
                        if (title && (fileName.endsWith('.pdf') || fileName.endsWith('.pptx') || fileName.endsWith('.docx') || fileName.endsWith('.xlsx') || fileName.endsWith('.ppt') || fileName.endsWith('.doc') || fileName.endsWith('.xls'))) {
                            const content = document.querySelector('.common_node_content_content');
                            if (content) {
                                const iframe = content.querySelector('iframe');
                                if (iframe) {
                                    const url = iframe.src;
                                    const furl = url.split('furl=')[1];
                                    if (furl) {
                                        banner.style.justifyContent = "space-between";
                                        banner.innerHTML = `
    <h5 class="title flex_panel hor">${title.textContent}</h5>
    <div class="flex_panel dl-btn" style="align-items:center;padding: 6px;padding-right: 10px;">
        <svg width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><use xlink:href="#icon-download1"></use></svg>
        <a id="downloadLink" download="${fileName}" target="_blank">丫丫助手——下载${fileType}文件</a>
    </div>
`;
                                        const downloadLink = document.getElementById('downloadLink');
                                        downloadLink.addEventListener('click', function (event) {
                                            event.preventDefault();
                                            download(furl, `${fileName}`);
                                        });
                                        observer.disconnect();
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Start observing the document with the configured parameters
        observer.observe(document.body, { childList: true, subtree: true });
    }

    modifyDOM();
})();

/**
 * 获取 blob
 * @param  {String} url 目标文件地址
 * @return {Promise}
 */
function getBlob(url) {
    return new Promise(resolve => {
        const xhr = new XMLHttpRequest()
        // 避免 200 from disk cache
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(xhr.response)
            }
        }
        xhr.send()
    })
}

/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */
function saveAs(blob, filename) {
    if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename)
    } else {
        const anchor = document.createElement('a')
        const body = document.querySelector('body')
        anchor.href = window.URL.createObjectURL(blob)
        anchor.download = filename

        anchor.style.display = 'none'
        body.appendChild(anchor)

        anchor.click()
        body.removeChild(anchor)

        window.URL.revokeObjectURL(anchor.href)
    }
}

/**
 * 下载
 * @param  {String} url 目标文件地址
 * @param  {String} newFilename 想要保存的文件名称
 */
async function download(url, newFilename) {
    const blob = await getBlob(url)
    saveAs(blob, newFilename)
}
