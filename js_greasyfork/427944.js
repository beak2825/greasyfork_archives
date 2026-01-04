// ==UserScript==
// @name         Myself 觀看紀錄小工具
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  幫你紀錄上次看到第幾話
// @author       xu3u04u48
// @match        *://myself-bbs.com/thread-*.html
// @match        *://myself-bbs.com/forum.php?mod=viewthread&tid=*
// @icon         https://www.google.com/s2/favicons?domain=myself-bbs.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427944/Myself%20%E8%A7%80%E7%9C%8B%E7%B4%80%E9%8C%84%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/427944/Myself%20%E8%A7%80%E7%9C%8B%E7%B4%80%E9%8C%84%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url_pathname_regex = /-(\d*)-|tid=(\d*)/gm;
    const url_pathname = location.href
    let page_val = ""
    let m;
    while ((m = url_pathname_regex.exec(url_pathname)) !== null) {
        m.forEach((match, groupIndex) => {
            if(match !== undefined)
                page_val = match
        });
    }


    var view_history = []

    jQuery(".bm_h > h2").text("劇集列表 上次看到 第" + get_episode() + "話")
    jQuery(".bm_h > h2").click(function(e){
        if(get_episode() >= 1 ){
            jq('.main_list').scrollTop((get_episode() - 1)*31);
        }
    })

    jQuery(".main_list a").click(function(e){
        const episode_regex = /第 (\d*) 話/gm;
        const episode = episode_regex.exec(this.text)[1]
        add_view_history(episode)
        jQuery(".bm_h > h2").text("劇集列表 上次看到 第" + Number(episode) + "話")
    })

    function add_view_history(episode){
        var discover = false
        var get_view_history = JSON.parse(localStorage.getItem("view_history"))
        if(get_view_history != null && get_view_history.length != 0){
             for (var a = 0; a <= get_view_history.length - 1; a++) {
                 if(get_view_history[a].index == page_val){
                     get_view_history[a].episode = episode
                     discover = true
                 }
             }
            if(!discover)get_view_history.push({index:page_val, episode:episode})
            localStorage.setItem("view_history", JSON.stringify(get_view_history))
        }else{
            view_history.push({index:page_val, episode:episode})
            localStorage.setItem("view_history", JSON.stringify(view_history))
        }
    }

    function get_episode(){
        var get_episode = ""
        var get_view_history = JSON.parse(localStorage.getItem("view_history"))
        if(get_view_history != null && get_view_history.length != 0){
            for (var a = 0; a <= get_view_history.length - 1; a++) {
                 if(get_view_history[a].index == page_val){
                     get_episode = Number(get_view_history[a].episode)
                     return get_episode
                 }
             }

        }
        return 0
    }
})();