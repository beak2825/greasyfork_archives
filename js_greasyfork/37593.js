// ==UserScript==
// @name         YouTube subtitle checker (search & channel pages)
// @namespace    https://www.voicetube.com/
// @version      0.33
// @description  Make VT better!!
// @author       Richard Zenn
// @match        https://www.youtube.com/channel/*
// @match        https://www.youtube.com/results?search_query=*
// @run-at       document-idle
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant		 GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/37593/YouTube%20subtitle%20checker%20%28search%20%20channel%20pages%29.user.js
// @updateURL https://update.greasyfork.org/scripts/37593/YouTube%20subtitle%20checker%20%28search%20%20channel%20pages%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var youtube_ids = [];

    setInterval(function(){
        console.log(youtube_ids.length);
        var youtube_id;
        $("ytd-badge-supported-renderer:contains('字幕'), ytd-badge-supported-renderer:contains('CC'), ytd-badge-supported-renderer:contains('Subtitles')").each(function() {
            youtube_id = $(this).parent().find('#meta #video-title').attr('href').replace('/watch?v=', '');

            if(youtube_ids.indexOf(youtube_id) === -1){
                youtube_ids.push(youtube_id);
                var sub_btn_item = $(this);
                var obj = $(this).parent().parent();
                obj.css('background-color', '#e2e2e2');

                var ret = GM_xmlhttpRequest({
                    method: "GET",
                    headers: {"Accept": "application/json"},
                    responseType: "json",
                    url: "https://tw.voicetube.com/admin/check_video_importable?q=" + youtube_id,
                    context: {"youtube_id": youtube_id, "obj": obj, "sub_btn_item": sub_btn_item},
                    onload: function(res) {
                        var item = res.response;
                        var context = res.context;
                        if(item.duplicated) {
                            context.obj.css('background-color', 'rgb(146, 222, 146)');
                            context.obj.css('position', 'relative');
                            context.obj.append('<button style="cursor: pointer; position: absolute;top: 0;right: 0;font-size: 16px;" onclick="window.open(\'https://tw.voicetube.com/videos/'+ item.duplicated_vt_id +'\')">VT</button>');
                        } else if(!item.embeddable) {
                            context.obj.css('background-color', 'red');
                        } else if(item.caption_en) {
                            if(item.caption_zh_tw) {
                                context.sub_btn_item.append('<span style="margin-left: 5px" class="badge-style-type-simple ytd-badge-supported-renderer badge">中文</span>');
                            }
                            if(item.ja) {
                                context.sub_btn_item.append('<span style="margin-left: 5px" class="badge-style-type-simple ytd-badge-supported-renderer badge">日文</span>');
                            }
                            if(item.vi) {
                                context.sub_btn_item.append('<span style="margin-left: 5px" class="badge-style-type-simple ytd-badge-supported-renderer badge">越南</span>');
                            }
                            if(!item.mobile_available) {
                                context.obj.css('background-color', 'rgb(236, 197, 236)');
                            } else {
                                context.obj.css('background-color', '#ffff7c');
                            }
                            context.obj.css('position', 'relative');
                            context.obj.append('<button style="cursor: pointer; position: absolute;right: 0;top: 0;font-size: 16px;" onclick="window.open(\'https://tw.voicetube.com/admin/add_video/'+ item.id +'\')">Add</button>');
                        }
                    }
                });
            }
        });
    }, 1000);
})();