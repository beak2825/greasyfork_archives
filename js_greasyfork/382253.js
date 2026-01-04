// ==UserScript==
// @name         光谷社区
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @include      http://www.guanggoo.com/*
// @include      https://www.guanggoo.com/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// @note    20190426    v0.1
//          回复中显示楼主标识；
// @note    20190426    v0.2
//          评论框粘贴图片自动上传；
// @downloadURL https://update.greasyfork.org/scripts/382253/%E5%85%89%E8%B0%B7%E7%A4%BE%E5%8C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/382253/%E5%85%89%E8%B0%B7%E7%A4%BE%E5%8C%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var username = $(".topic-detail span.username a").text();

    var reply_items = $(".topic-reply .ui-content .reply-item");

    for (var i = 0; reply_items.length >= i; i++) {
        var reply_username = $(reply_items[i]).find(".reply-username span.username").text();
        if (username == reply_username) {
            $(reply_items[i]).find(".reply-username").append($("<font></font>", {
                color: "green", text: "[楼主]"
            }));
        }
    }

    // 粘贴图片
    var editor = $("#inputor")[0];
    if(editor != undefined){
        editor.addEventListener("paste", function(event) {
            var items = (event.clipboardData || window.clipboardData).items;
            var file = null;
            if (items && items.length) {
                for (var i = 0; i < items.length; i++) {
                    if (items[i].type.indexOf("image") !== -1) {
                        file = items[i].getAsFile();
                        break;
                    }
                }
            }
            if (!file) {
                return;
            }
            var data = new FormData();
            data.append('smfile', file);

            $.ajax({
                url : "https://sm.ms/api/upload",
                data : data,
                type : "POST",
                dataType : "json",
                timeout : 12000,
                async : true,
                cache : false,
                contentType : false,
                processData : false,
                success : function(res) {
                    if(res.code === "success"){
                        var val = $(editor).val();
                        var img = "![](" + res.data.url + ")";
                        if(val.trim() == ""){
                            $(editor).val(val + img);
                        }else{
                            $(editor).val(val  + "\n\n" + img);
                        }
                    }
                },
                error : function(res) {
                    console.log(res);
                }
            });
        })
    }
})();