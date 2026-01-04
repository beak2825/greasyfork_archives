// ==UserScript==
// @name         YouTube subtitle checker (index, video & trendding pages)
// @namespace    https://www.voicetube.com/
// @version      0.1
// @description  Make VT better!!
// @author       Richard Zenn
// @match        https://www.youtube.com
// @match        https://www.youtube.com/watch?v=*
// @match        https://www.youtube.com/feed/trending*
// @run-at       document-idle
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant			GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/37594/YouTube%20subtitle%20checker%20%28index%2C%20video%20%20trendding%20pages%29.user.js
// @updateURL https://update.greasyfork.org/scripts/37594/YouTube%20subtitle%20checker%20%28index%2C%20video%20%20trendding%20pages%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var youtube_ids = [];

    setInterval(function(){
        $('.ytd-thumbnail[href]').each(function() {
            var youtube_id = $(this).attr('href').replace('/watch?v=', '');
            if(youtube_ids.indexOf(youtube_id) === -1) {
                youtube_ids.push(youtube_id);
                console.log(1);
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
                            context.obj.append('<button style="cursor: pointer; position: absolute;bottom: 0;right: 0;font-size: 16px;" onclick="window.open(\'https://tw.voicetube.com/videos/'+ item.duplicated_vt_id +'\')">VT</button>');
                        } else if(!item.embeddable) {
                            context.obj.css('background-color', 'red');
                        } else if(item.caption_en) {
                            if(item.caption_zh_tw) {
                                context.obj.append('<span style="font-size: 28px;">中文</span>');
                            }
                            if(item.ja) {
                                context.obj.append('<span style="font-size: 28px;">日文</span>');
                            }
                            if(item.vi) {
                                context.obj.append('<span style="font-size: 28px;">越南</span>');
                            }
                            if(!item.mobile_available) {
                                context.obj.css('background-color', 'rgb(236, 197, 236)');
                            } else {
                                context.obj.css('background-color', '#ffff7c');
                            }
                            context.obj.css('position', 'relative');
                            context.obj.append('<button style="cursor: pointer; position: absolute;right: 0;bottom: 0;font-size: 16px;" onclick="window.open(\'https://tw.voicetube.com/admin/add_video/'+ context.youtube_id +'\')">Add</button>');
                        } else {
                            context.obj.css('background-color', 'transparent');
                        }
                    }
                });
            }
        });
    }, 1000);
})();