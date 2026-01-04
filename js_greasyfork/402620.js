// ==UserScript==
// @name         ustc网课下载
// @namespace    https://www.bb.ustc.edu.cn/
// @version      0.4
// @description  展示USTC网课回放的直链地址
// @author       398
// @match        *://www.eeo.cn/*
// @grant        none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/402620/ustc%E7%BD%91%E8%AF%BE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/402620/ustc%E7%BD%91%E8%AF%BE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

function exec(fn) {
    var script = document.createElement('script');
    script.setAttribute("type", "application/javascript");
    script.textContent = '(' + fn + ')();';
    document.body.appendChild(script);
    document.body.removeChild(script);
}

exec(function() {
    var mp4_path = null;
    var path_scr = document.createElement('a');
    setInterval(
        //因为切换分P不会重载网页，这里用循环获取和更新地址
        //原理是在已加载的内容中查找地址，不占用服务器
        () => {
            mp4_path = $("video[src$='.mp4']").attr('src');
            if (mp4_path) {
                path_scr.setAttribute('href', mp4_path);
                if (!document.getElementById('lesson-time').contains(path_scr)) {
                    path_scr.setAttribute('id', 'mp4-path');
                    path_scr.textContent = '下载链接';
                    document.getElementById('lesson-time').appendChild(path_scr);
                };
            };
            //console.log("mp4_path",mp4_path);
        },800)
});