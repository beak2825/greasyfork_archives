// ==UserScript==
// @name         Bilibili live My Plus
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  highlight my danma & click
// @author       You
// @match        https://live.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico?v=1
// @require      https://code.jquery.com/jquery-latest.js
// @grant        none
// @license    MIT
// @downloadURL https://update.greasyfork.org/scripts/498741/Bilibili%20live%20My%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/498741/Bilibili%20live%20My%20Plus.meta.js
// ==/UserScript==

function getDate(time) {
    time = (String(time).length > 11) ? time : time * 1000;
    let date = new Date(parseInt(time)),
        y = date.getFullYear(),
        m = String(date.getMonth()).padStart(2, '0'),
        d = String(date.getDate()).padStart(2, '0'),
        h = String(date.getHours()).padStart(2, '0'),
        i = String(date.getMinutes()).padStart(2, '0'),
        s = String(date.getSeconds()).padStart(2, '0');
    console.log(date, time);
    return {
        "date": y + "-" + m + "-" + d + " " + h + ":" + i + ":" + s,
        "time": h + ":" + i + ":" + s
    };
}

(function() {
    let target_node = document.getElementById('chat-items'),
        config = { childList: true, subtree: true },
        callback = function(mutations_list, observer) {
        for(var mutation of mutations_list) {
            if (mutation.type == 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    let the_parent = $(node),
                        uname = $(node).attr('data-uname'),
                        my_name = $(".username-info .text").attr("title");
                    if (node.nodeType == 1) {
                        let new_fans = $(the_parent).children(".danmaku-item-left"),
                            new_fans_name = $(new_fans).children('.fans-medal-item-ctnr');
                        if (new_fans_name.length > 0) {
                            let anchor = $(new_fans_name).attr('data-anchor-id');
                            console.log(new_fans, new_fans_name, anchor);
                            $(new_fans_name).attr('onclick', 'window.open("https://space.bilibili.com/' + anchor + '/")');
                        }

                        let timestamp = (!$(the_parent).attr('data-ts')) ? $(the_parent).attr('data-ts') : $(the_parent).attr('data-timestamp');
                        if (timestamp) {
                            let date = getDate(timestamp), time_span = $(the_parent).children(".danmaku-time");
                            if (time_span.length == 0) {
                                $(the_parent).append('<span class="danmaku-time" style="margin-left:4px; font-size:6px; color:#dfacbf;" title="' + date["date"] + '">' + date["time"] + '</span>');
                            }
                        }


                        if (uname == my_name) {
                            $(the_parent).attr('class', 'chat-item danmaku-item chat-colorful-bubble');
                            $(the_parent).attr('style', 'background-color: rgba(251, 114, 153, 0.1); margin: 7px 0; border:1px solid #fb7299; border-radius: 4px; padding-top: 4px;');
                            $(the_parent).find('.danmaku-item-left .wealth-medal-ctnr .wealth-medal').attr('src', 'https://i0.hdslb.com/bfs/live/6da9d5d7e68722cb7ec018c4f15dcbe15937ce8f.webp');
                        }
                    }
                });
            }
        }
    };
    var observer = new MutationObserver(callback);
    observer.observe(target_node, config);
})();
