// ==UserScript==
// @name         YouTube subtitle checker
// @namespace    https://www.voicetube.com/
// @version      0.53
// @description  Make VT better!!
// @author       Richard Zenn
// @match        https://www.youtube.com/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @grant			GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/37563/YouTube%20subtitle%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/37563/YouTube%20subtitle%20checker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var youtube_ids = [];
    var ids = []; // Deal with playlist problem
    var current_url = window.location.href.split('#')[0];
    window.addEventListener("yt-navigate-start", function(){
        location.reload();
    });
    setInterval(function(){
        //if(current_url != window.location.href.split('#')[0]) location.reload();
        if(location.pathname == '/' || window.location.href.indexOf('/watch?v=') !== -1 || window.location.href.indexOf('/feed/trending') !== -1 || window.location.href.indexOf('/playlist') !== -1) {
            $('.ytd-thumbnail[href]').each(function(i) {
                var youtube_id = $(this).attr('href').replace(/\/watch\?v=/, '').replace(/&.*/, '');
                if(youtube_ids.indexOf(youtube_id) === -1 && ids.indexOf(i) === -1) {
                    youtube_ids.push(youtube_id);
                    ids.push(i);
                    var obj;
                    var sub_btn_item = $(this);
                    if($('#playlist').has($(this)).length) {
                        obj = $(this).parent().parent().parent().parent();
                    } else {
                        obj = $(this).parent().parent();
                    }

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
        } else if(window.location.href.indexOf('/channel/') !== -1 || window.location.href.indexOf('/results?search_query=') !== -1) {
            var youtube_id;
            $("ytd-badge-supported-renderer:contains('字幕'), ytd-badge-supported-renderer:contains('CC'), ytd-badge-supported-renderer:contains('Subtitles')").each(function(i) {
                youtube_id = $(this).parent().find('#meta #video-title').attr('href').replace('/watch?v=', '');

                if(youtube_ids.indexOf(youtube_id) === -1 && ids.indexOf(i) === -1) {
                    youtube_ids.push(youtube_id);
                    ids.push(i);

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
        }

    }, 500);
    function insertStyle(str, id, sdoc) {
        var styleNode = null;
        var ldoc = sdoc;
        if (!ldoc) ldoc = doc;

        if (id !== null) {
            styleNode = ldoc.getElementById(id);
        }

        if (styleNode === null) {
            styleNode = newNode("style", id, null, ldoc.head);
            styleNode.setAttribute("type", "text/css");
        }

        if (styleNode.textContent != str)
            styleNode.textContent = str;
    }
})();