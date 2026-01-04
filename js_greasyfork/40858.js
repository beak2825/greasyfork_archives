// ==UserScript==
// @name         QQ音乐下载
// @namespace    http://www.infosec-wiki.com/
// @version      0.1
// @description  点击下载按钮即可下载QQ音乐
// @author       http://www.infosec-wiki.com/
// @match        https://y.qq.com/portal/player.html
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      https://greasyfork.org/scripts/21234-gm-download-polyfill-not-working/code/GM_download%20Polyfill%20!Not%20Working!.js?version=135573
// @downloadURL https://update.greasyfork.org/scripts/40858/QQ%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/40858/QQ%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $("a.mod_btn.js_all_down").click(function (event) {
        event.stopPropagation();
        var url =  $("#h5audio_media").attr("src");
        $(this).attr("href",url);
        $(this).removeClass("btn_big_down");
        $(this).removeClass("js_btn_down");
        console.log(url);

        var file_name = $("div.songlist__item--playing span.songlist__songname_txt").text() + ".m4a";
        console.log(file_name);

        GM_download(url, file_name);
    });
})();