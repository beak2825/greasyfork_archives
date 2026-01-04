// ==UserScript==
// @name         网易云音乐在线下载
// @namespace    易柒黑科技
// @version      1.0.0
// @description  网易云音乐在线下载（除VIP歌曲）
// @author       易柒黑科技
// @match        https://music.163.com/*
// @icon         https://s1.music.126.net/style/favicon.ico?v20180823
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @license 	 MIT
// @downloadURL https://update.greasyfork.org/scripts/461225/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%9C%A8%E7%BA%BF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/461225/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E5%9C%A8%E7%BA%BF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 网易云音乐下载（除VIP歌曲） 代码如下
    if (window.location.href.indexOf('music.163.com') !== -1) {
        // 如果是网易云音乐页面，则执行相应的代码
        window.addEventListener('hashchange', function () {
            this.location.reload();
        });

        window.addEventListener('load', function () {
            // URL Test
            if (this.location.href.split('/#/')[1].startsWith('song')) {
                main();
            }
        });

        function main() {
            let buttonBox = getButtonBox();
            if (!isVIP(buttonBox)) addDownloadButton(buttonBox);
        }

        function getButtonBox() {
            let iframe = document.querySelector('#g_iframe');
            return iframe.contentWindow.document.querySelector('#content-operation');
        }

        function addDownloadButton(fatherNode) {
            // 添加按钮
            let button = document.createElement('a');
            // button.classList.add('u-btni', 'u-btni-dl');
            button.className = 'u-btn'
            fatherNode.append(button);
            button.style.cssText = `
            display: inline-block;
            padding: 10px 15px;
            background: #f3f3f3;
            margin-top: 15px;
            color: #333;
            border: 1px solid #c6c6c6;
            `
            button.innerHTML = '直接下载';
            // 设置链接
            button.href = getDownloadLink();
            button.target = '_blank';
            button.title = 'VIP歌曲无法下载'
        }

        function getDownloadLink() {
            let curLink = window.location.href;
            // 获取音乐ID
            const ID = curLink.split('id=')[1];
            // 返回新链接
            return `http://music.163.com/song/media/outer/url?id=${ID}.mp3`;
        }

        function isVIP(buttonBox) {
            let firstButton = buttonBox.firstElementChild;
            let songType = firstButton.firstElementChild.innerHTML;
            return songType.includes('VIP');
        }
    } else {
        // 如果不是网易云音乐页面，则输出提示信息
        console.log('这不是网易云音乐页面');
    }



})();
