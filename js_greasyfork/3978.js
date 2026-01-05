// ==UserScript==
// @name            Ade's Test
// @namespace       https://github.com/adelabs
// @description     New buttons for opening full sized pictures in new background tabs. \
//                  Add "href" attributes to "Full size"/"查看大图" anchors so that you can mid-click or right-click them with more options.
// @version         3.1.5
// @license         GPL version 3
// @include         *://weibo.com/*
// @require         http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant           GM_openInTab
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/3978/Ade%27s%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/3978/Ade%27s%20Test.meta.js
// ==/UserScript==

/*
 *  https://gist.github.com/adelabs/7f483736baca2d5c1c90/raw/weibo_big_picture.user.js
 */

setInterval(function(){
    // For each thumbnail (`img.bigcursor`) create an anchor (`<a/>`), which opens a background tab for the full sized picture when clicked.
    $('ul.WB_media_list').each(function(){
        if ($(this).attr('adelabs') == '1') { return; }
        $(this).attr('adelabs', '1');
        var ul = $(this);
        ul.find('img.bigcursor').each(function(i){
            if ($(this).attr('action-type') != 'fl_pics' &&
                $(this).attr('node-type') != 'feed_list_media_bgimg') {
                return;
            }
            var a = $('<a><span>' + (i+1).toString() + '</span></a>');
            a.addClass('W_btn_b');
            ul.before(a).before(' ');
            var src = $(this).attr('src');
            var basename = src.replace(/.*\//, '');
            var href = '//ww3.sinaimg.cn/large/' + basename;
            a.click(function(e){ GM_openInTab(href, true); });
        });
    });

    // Where there is a "Full size" or "查看大图" anchor (`a.show_big`), set its "href" and create an extra anchor (`<a/>`) aside, which opens a backgroud tab for the full size picture when clicked.
    $('a.show_big').each(function(i){
        var action_data = $(this).attr("action-data");
        var pid = action_data.replace(/.*\bpid=(\w+).*/, "$1");
        var href = '//ww3.sinaimg.cn/large/' + pid;
        if ($(this).attr("href") != href) {
            $(this).attr("href", href);
            var a = $(this).next();
            if (a.attr('class') == 'W_btn_b') { a.remove(); }
            a = $('<a class="W_btn_b"><span>open</span></a>');
            $(this).after(a).after(' ');
            a.click(function(e){GM_openInTab(href, true);});
        }
    });
}, 500);
