// ==UserScript==
// @name         通用图片下载
// @namespace    http://your.namespace/
// @version      0.4
// @description  在页面左下角添加按钮，点击可自动下载所有静态图片
// @author       猛蛮丸
// @run-at       document-start
// @match        *
// @match        *://*/*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/501400/%E9%80%9A%E7%94%A8%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/501400/%E9%80%9A%E7%94%A8%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function downloadImages(prefix) {
        const images = document.querySelectorAll('img');
        let count = 1;

        images.forEach(image => {
            const imgUrl = image.src;
            const fileName = prefix + count + '.jpg';
            
            GM_download({
                url: imgUrl,
                name: fileName,
                onload: function() {
                    console.log('Image downloaded successfully:', imgUrl);
                },
                onerror: function(error) {
                    console.error('Error downloading image:', error);
                }
            });

            count++;
        });
    }

    function createDownloadButton() {
        const button = document.createElement('button');
        button.textContent='🤪';
        button.style.position='fixed';
        button.style.bottom = '10px';
        button.style.left = '10px';
        button.style.fontSize = '30px';
        button.style.zIndex = '99999';

        button.addEventListener('click', function() {
            const imageName = prompt('请输入图片名：');
            if (imageName) {
                downloadImages(imageName);
            }
        });

        document.body.appendChild(button);
    }

    // 页面加载后创建下载按钮
    window.addEventListener('load', createDownloadButton);
})();
