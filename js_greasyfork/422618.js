// ==UserScript==
// @name         点击必应logo直接下载背景图
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  Make life better!
// @author       petitepluie
// @match        https://cn.bing.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422618/%E7%82%B9%E5%87%BB%E5%BF%85%E5%BA%94logo%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E8%83%8C%E6%99%AF%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/422618/%E7%82%B9%E5%87%BB%E5%BF%85%E5%BA%94logo%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD%E8%83%8C%E6%99%AF%E5%9B%BE.meta.js
// ==/UserScript==

(function downloadBingBg() {
    'use strict';
    var root = 'https://cn.bing.com/';
    var obgDiv = document.getElementById('bgDiv');
    var nowbgDivBg = obgDiv.style.backgroundImage;

    /* 将必应logo作位下载按钮 */
    var downloadBtn = document.getElementsByClassName('squares')[0];
    downloadBtn.style.cursor = 'pointer';

    downloadBtn.onclick = function () {
        nowbgDivBg = obgDiv.style.backgroundImage;
        var halfUrl = '';
        if (nowbgDivBg) {
            halfUrl = nowbgDivBg.split('("')[1].split('")')[0];
        } else {
            halfUrl = document.getElementById('bgLink').getAttribute('href');
        }
        download(root + halfUrl);
    };

    function download(url) {
        var anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = getFileName();
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    /* 图片索引 */
    var count = 0;

    var timestamp = new Date().getTime();
    var adayms = 24 * 60 * 60 * 1000;
    var pictsName = [];
    for (var i = 0; i < 8; i++) {
        var thisDate = new Date(timestamp - adayms * i);
        pictsName.push(thisDate.getFullYear() + '_' + (thisDate.getMonth() + 1) + '_' + thisDate.getDate() + ' of bingBackground');
    }

    function getFileName() {
        return pictsName[-count];
    }

    /* 记录图片索引为-7~0，随背景图切换而改变 */
    var sh_igl = document.getElementById('sh_igl');
    var sh_igr = document.getElementById('sh_igr');
    var newbgDivBg = '';
    var timer = null;
    sh_igl.onclick = function () {
        if (timer) {
            return;
        }
        timer = setTimeout(function () {
            newbgDivBg = obgDiv.style.backgroundImage;
            if (count > -7 && newbgDivBg != nowbgDivBg) {
                count--;
                nowbgDivBg = obgDiv.style.backgroundImage;
            }
            clearTimeout(timer);
            timer = null;
        }, 800);

    };
    sh_igr.onclick = function () {
        if (timer) {
            return;
        }
        timer = setTimeout(function () {
            newbgDivBg = obgDiv.style.backgroundImage;
            if (count < 0 && newbgDivBg != nowbgDivBg) {
                count++;
                nowbgDivBg = obgDiv.style.backgroundImage;
            }
            clearTimeout(timer);
            timer = null;
        }, 800);

    };

})();