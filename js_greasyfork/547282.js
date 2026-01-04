// ==UserScript==
// @name         Jable_Helper
// @namespace    https://greasyfork.org/zh-CN/scripts/425514-jable-helper
// @version      1.8
// @description  快速显示jable的m3u8下载链接, 现已支持cableav
// @author       XiaO_WanG
// @match        https://jable.tv/videos/*/*
// @match        https://fs1.app/videos/*/*
// @match        https://cableav.tv/*/
// @match        https://cableav.tv/?p=*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @grant        none
// @license      MPL
// @downloadURL https://update.greasyfork.org/scripts/547282/Jable_Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/547282/Jable_Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var label_3wneu = document.createElement("a");
    label_3wneu.className="addtion";
    label_3wneu.id="tobod";
    label_3wneu.href="javascript:void(0);";


    if (document.domain != "cableav.tv"){
        //var url = hlsUrl + "#" + document.title.split(" ")[0];
        var url = hlsUrl + "#" + document.title.split(" ")[0];
        label_3wneu.innerHTML=hlsUrl;
        document.getElementsByClassName("text-center")[0].appendChild(label_3wneu);
    }else {
        var url = document.head.querySelector("[property~='og:video:url'][content]").content;
        label_3wneu.innerHTML="###点击此处复制m3u8下载链接###<br>##请务必先在网页播放视频后再下载##";
        document.getElementsByClassName("video-toolbar dark-background video-toolbar-control")[0].appendChild(label_3wneu);
    }

    jQuery(function ($) {
        $("#tobod").click(function () {
            const el = document.createElement('textarea');
            el.value = url;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            document.body.appendChild(el);
            const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
            el.select();
            document.execCommand('copy');
            document.body.removeChild(el);
            if (selected) {
                document.getSelection().removeAllRanges();
                document.getSelection().addRange(selected);
            }
        });
    });

})();



