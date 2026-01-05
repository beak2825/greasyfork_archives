// ==UserScript==
// @name         VKResizer
// @version      0.17
// @description  Auto-resize vk.com wall content
// @author       A-Ivan
// @include      https://vk.com/*
// @grant        none
// @namespace https://greasyfork.org/users/61380
// @require      http://code.jquery.com/jquery-3.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/22501/VKResizer.user.js
// @updateURL https://update.greasyfork.org/scripts/22501/VKResizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var ww;
    var prev = 0;

    function check_rect(){
        if(isNaN(ww))
        {
            ww = parseFloat($("#page_wall_posts").css('width'));
        }
        var check_elem = document.getElementById("narrow_column");
        var coords = 0;
        try {
            var wallType = $("div.page_block").parent("div.wall_module").attr("id");
            if(typeof(wallType) != "undefined")
            {
                coords = check_elem.getBoundingClientRect().bottom;
                var coordst = coords > prev ? coords : prev; //Фикс ошибки, вызванной изменениями в стиле.
                console.log(coordst);
                if(coordst < 10)
                {
                    $("div.post_header").css({'width': ww*1.27204+'px', 'margin-right': '0px'});
                    $("div.media_desc.post_video_desc").css({'width': ww*1.35264+'px'});
                    $("div.page_post_sized_thumbs.clear_fix").css({'zoom': '1', '-moz-transform': 'scale(1)'});
                    $("div.wall_module:last").find("div.wall_post_text").css({'width': ww*1.35264+'px'});
                    var w = wallType == "profile_wall"? -ww/2 : 0;
                    $("#page_wall_posts").css({'width': ww*1.50377+'px', 'margin-left': w + 'px'});
                    $("div.ui_actions_menu_wrap._ui_menu_wrap").css({'margin-right': -ww/4.67 + 'px'});
                    $("div.ui_actions_menu_wrap._ui_menu_wrap.shown").css({'margin-right': -ww/4.67 + 'px'});
                }
                else
                {
                    $("div.post_header").css({'width': ww});
                    $("div.media_desc.post_video_desc").css({'width': ww*0.84886+'px'});
                    $("div.page_post_sized_thumbs.clear_fix").css({'zoom': '0.65999', '-moz-transform': 'scale(0.65999)'});
                    $("div.wall_module:last").find("div.wall_post_text").css({'width': ww*0.80604+'px'});
                    $("#page_wall_posts").css({'width': ww+'px', 'margin-left': '0px'});
                    $("div.ui_actions_menu_wrap._ui_menu_wrap").css({'margin-right': 0 + 'px'});
                    $("div.ui_actions_menu_wrap._ui_menu_wrap.shown").css({'margin-right': 0 + 'px'});
                }
                prev = coords;
            }
            else //Новости
            {
                $("#feed_rows").find("div.post_header").css({'width': ww*1.27204+'px'});
                $("#feed_rows").find("div.media_desc.post_video_desc").css({'width': ww*1.35264+'px'});
                $("#feed_rows").find("div.page_post_sized_thumbs.clear_fix").css({'zoom': '1', '-moz-transform': 'scale(1)'});
                $("#feed_rows").find("div.wall_post_text").css({'width': $("#feed_rows").find("div.wall_post_text").parent().css('width')});
            }
        }
        catch(err){}
    }

    setTimeout(check_rect, 0);
    $(document).scroll(function(){check_rect();});

})();