// ==UserScript==
// @name        喜马拉雅-音乐下载
// @namespace   Violentmonkey Scripts
// @match       *://www.ximalaya.com/*/*/
// @grant       none
// @version     0.1
// @author      eaudouce
// @description 喜马拉雅列表页音乐下载
// @require     https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/392485/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85-%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/392485/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85-%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    function init() {
        $('.text>a:first-child').each(function(){
            var a = $(this),
                id = a.attr('href').split('/')[3],
                url = 'https://www.ximalaya.com/revision/play/v1/audio?ptype=1&id='+id;
            console.log(id);
            $.get(url, function(data) {
                var file = data.data.src, file_ext = file.substr(file.lastIndexOf('.'));
                // a.after('<a style="margin-left:10px;" href="'+file+'" download="'+a.attr('title')+file_ext+'" target="_blank"><span class="title _c2">下载</span></a>');
                a.after('<a style="margin-left:10px;" href="'+file+'" download="'+a.attr('title')+'" target="_blank"><span class="title _c2">下载</span></a>');
            });
        });
    }
    setTimeout(init, 1000);
})();