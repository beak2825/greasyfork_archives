// ==UserScript==
// @name         Jinxin Novel Downloader
// @namespace    https://gitee.com/jinxin11112/tampermonkey
// @version      0.1.4
// @description  小说下载器
// @author       jinxin
// @match        https://zhaoze.pro/*
// @match        https://bbs.fallenark.com/*
// @match        https://www.sis001.com/*
// @match        https://kemono.su/*
// @require      https://update.greasyfork.org/scripts/460642/1330385/Jinxin%20Util%20Button.js
// @require      https://update.greasyfork.org/scripts/460643/1326074/Jinxin%20Util%20Download.js
// @require      https://update.greasyfork.org/scripts/487102/1330370/Jinxin%20Novel%20ZhaoZe.js
// @require      https://update.greasyfork.org/scripts/487103/1330371/Jinxin%20Novel%20Fallen%20Ark.js
// @require      https://update.greasyfork.org/scripts/487798/1330396/Jinxin%20Novel%20Sis001.js
// @require      https://update.greasyfork.org/scripts/500826/1626342/Jinxin%20Novel%20Kemono.js
// @icon         https://picdm.sunbangyan.cn/2024/02/11/afc94fe5ca129f37d1ce5d19370e77bb.jpeg
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487799/Jinxin%20Novel%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/487799/Jinxin%20Novel%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getMessage() {
        let href = window.location.href;
        let downloader;
        if (href.startsWith("https://zhaoze.pro/")) {
            downloader = new ZhaoZe();
        } else if (href.startsWith("https://bbs.fallenark.com/")) {
            downloader = new FallenArk();
        } else if (href.startsWith("https://www.sis001.com/")) {
            downloader = new Sis001();
        } else if (href.startsWith("https://kemono.su/")) {
            downloader = new Kemono();
        }
        if (downloader) {
            let contentList = downloader.getContent();
            let title = downloader.getTitle();
            downloadFile(contentList, title);
        } else {
            alert('当前地址下没有可以匹配的下载器');
        }
    }

    window.onload = () => addDownloadButton(getMessage)

})();
