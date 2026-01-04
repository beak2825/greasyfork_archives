// ==UserScript==
// @name         北洋园PT趣味盒图片打包下载
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  tjupt趣味盒图片打包下载
// @author       yaorelax
// @match        https://tjupt.org/fun.php?action=view*
// @match        https://tju.pt/fun.php?action=view*
// @icon         https://tjupt.org/assets/favicon/favicon.png
// @require      https://cdn.staticfile.org/jszip/3.1.5/jszip.min.js
// @license      GPL-3.0 License
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/463157/%E5%8C%97%E6%B4%8B%E5%9B%ADPT%E8%B6%A3%E5%91%B3%E7%9B%92%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/463157/%E5%8C%97%E6%B4%8B%E5%9B%ADPT%E8%B6%A3%E5%91%B3%E7%9B%92%E5%9B%BE%E7%89%87%E6%89%93%E5%8C%85%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function downloadImages() {
        const parrent = document.querySelector('#outer > table > tbody > tr > td > table:nth-child(2)');
        const image_objs = parrent.querySelectorAll('img');
        const image_infos = Array.from(image_objs).map((image_obj, index) => {
            let origin_name = image_obj.alt;
            let format_name = `${index + 1}.jpg`;
            if (typeof(image_obj.dataset.src) != 'undefined')
            {
                return {name: format_name, url: image_obj.dataset.src};
            }
            else
            {
                return {name: format_name, url: image_obj.src};
            }
        });

        const zip = new JSZip();
        const promises = image_infos.map((image_info, index) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: image_info.url,
                    responseType: 'blob',
                    onload: function(response) {
                        if (response.status === 200) {
                            zip.file(image_info.name, response.response);
                            resolve(index);
                        } else {
                            reject(index);
                        }
                    },
                    onerror: function() {
                        reject(index);
                    }
                });
            });
        });

        const progress = document.createElement('progress');
        progress.max = image_infos.length;
        progress.value = 0;
        progress.style.position = 'fixed';
        progress.style.top = '40px';
        progress.style.left = '20px';
        progress.style.zIndex = '9999';
        document.body.appendChild(progress);

        Promise.all(promises.map(p => p.catch(() => undefined))).then((results) => {
            results.forEach(index => {
                if (typeof index !== "undefined") {
                    progress.value += 1;
                }
            });

            zip.generateAsync({type:"blob"})
                .then(blob => {
                const downloadLink = document.createElement('a');
                downloadLink.href = URL.createObjectURL(blob);
                downloadLink.download = `趣味盒第${document.URL.substring(document.URL.lastIndexOf('=') + 1)}期.zip`;
                downloadLink.click();
                progress.remove();
            });
        });

    }

    const downloadButton = document.createElement('button');
    downloadButton.textContent = '打包下载趣味盒所有图片';
    downloadButton.style.position = 'fixed';
    downloadButton.style.top = '20px';
    downloadButton.style.left = '20px';
    downloadButton.style.zIndex = '9999';
    downloadButton.addEventListener('click', downloadImages);
    document.body.appendChild(downloadButton);
})();
