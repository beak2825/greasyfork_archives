// ==UserScript==
// @name         播放器拖拽
// @namespace    https://github.com/funianwuxin
// @version      0.0.2
// @description  左键按住对视频进行拖拽，放在你觉得合适的地方
// @author       funianwuxin
// @match        http://*/*
// @match        https://*/*
// @gran  t        MIT
// @require      http://libs.baidu.com/jquery/1.9.1/jquery.min.js
// @run- at       document-end

// @downloadURL https://update.greasyfork.org/scripts/23516/%E6%92%AD%E6%94%BE%E5%99%A8%E6%8B%96%E6%8B%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/23516/%E6%92%AD%E6%94%BE%E5%99%A8%E6%8B%96%E6%8B%BD.meta.js
// ==/UserScript==
$.fn.extend({ drag: drag });

function drag() {
    $(this).on("mousedown", function (e) {
        var offset = $(this).offset();
        var diffX = e.pageX - offset.left;
        var diffY = e.pageY - offset.top;
        $(this).css({ 'cursor': 'move', 'z-index': '1000' });

        $(this).on("mousemove", function (e) {
            $(this).offset({ left: e.pageX - diffX, top: e.pageY - diffY });
        });
    });

    $(this).on('mouseup', function (e) {
        $(this).off('mousemove');
    });

}

var site = {
    'acfun': { re: /acfun/ },
    'bilibili': { re: /bilibili/ }
};


if (site.acfun.re.test(location.href)) {

    $('#player').drag();

} else if (site.bilibili.re.test(location.href)) {
    $('#bofqi').drag();
}