// ==UserScript==
// @name         HiFiNi播放器的下载按钮
// @version      2024-03-29
// @description  播放器上增加了一个下载按钮无需跳转到音频播放页面，点击就下载
// @author       AchieveHF
// @connect      www.hifini.com
// @include      *://*.hifini.com/*
// @icon         https://www.hifini.com/view/img/logo.png
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/1252510
// @downloadURL https://update.greasyfork.org/scripts/485564/HiFiNi%E6%92%AD%E6%94%BE%E5%99%A8%E7%9A%84%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/485564/HiFiNi%E6%92%AD%E6%94%BE%E5%99%A8%E7%9A%84%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
if(typeof ap4 !== 'undefined'){
        let filename = $('.aplayer-title').text()+$(".aplayer-author").text();
        let url = ap4.music.url;
        $('.aplayer-music').append('<span class="downloadSpan" style="margin-left: 5px;cursor: pointer"><i class="icon-download download"></i></span>');
        $('.download').on('click',function () {
            download(url,filename)
        })
}
    /**
     * 获取 blob
     * @param  {String} url 目标文件地址
     * @return {Promise}
     */
    function getBlob(url) {
        return new Promise(resolve => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = () => {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                }
            };
            xhr.addEventListener('error', function () {
                $('.downloadSpan').html('<span style="color:red;font-size:10px">重命名下载失败，请点击右侧按钮下载</span>')
                //在按钮后面添加一个播放器，通过播放器的按钮进行下载
                $('.aplayer-music').append('<video style="height:10px" controls><source src="'+url+'"></video>');

            });
            xhr.send();
        });
    }

    /**
     * 保存
     * @param  {Blob} blob
     * @param  {String} filename 想要保存的文件名称
     */
    function saveAs(blob, filename) {
        if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, filename);
        } else {
            const link = document.createElement('a');
            const body = document.querySelector('body');

            link.href = window.URL.createObjectURL(blob);
            link.download = filename;

            // fix Firefox
            link.style.display = 'none';
            body.appendChild(link);

            link.click();
            body.removeChild(link);

            window.URL.revokeObjectURL(link.href);
        }
    }

    /**
     * 下载
     * @param  {String} url 目标文件地址
     * @param  {String} filename 想要保存的文件名称
     */
    function download(url, filename) {
        getBlob(url).then(blob => {
            saveAs(blob, filename);
        });
    }

    // Your code here...
})();