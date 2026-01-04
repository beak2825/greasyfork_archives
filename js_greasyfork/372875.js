// ==UserScript==
// @name         喜马拉雅FM下载音频
// @namespace    https://zhang18.top
// @version      0.3.1
// @description  喜马拉雅FM去除原有点击下载跳转,点击下载便可以下载音频。
// @author       You
// @match        https://www.ximalaya.com/*/*/*
// @grant        GM_xmlhttpRequest
// @require https://cdn.bootcss.com/jquery/3.3.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/372875/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85FM%E4%B8%8B%E8%BD%BD%E9%9F%B3%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/372875/%E5%96%9C%E9%A9%AC%E6%8B%89%E9%9B%85FM%E4%B8%8B%E8%BD%BD%E9%9F%B3%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //获取json
    function get_json(){
        var id = window.location.href.split('/')[5]
        var url = 'https://www.ximalaya.com/revision/play/tracks?trackIds='+id
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(res) {
                if (res.status == 200) {
                    var music_data = jQuery.parseJSON(res.response)
                    console.log('解析')
                    get_music(music_data)

                    }
            }
        });
    }
    //处理链接
    function get_music(music_text){
        var music_url = music_text.data.tracksForAudioPlay[0].src
        console.log(music_url)
        $('button.xui-btn.zeBs.margin').eq(0).after('<button class="xui-btn zeBs margin"><i class="xuicon xuicon-web_album_ic_downloa"></i><a href="'+music_url+'" style="color: rgb(248, 100, 66);" target="_blank">下载</></button>')
        $('button.xui-btn.zeBs.margin').eq(0).remove()
         $('button.xui-btn.margin.XH7H').eq(0).after('<button class="xui-btn zeBs margin"><i class="xuicon xuicon-web_album_ic_downloa"></i><a href="'+music_url+'" style="color: rgb(248, 100, 66);" target="_blank">下载</></button>')
        $('button.xui-btn.margin.XH7H').eq(0).remove()
        //播放器位置
        $('.xm-player-oprations .btn').eq(1).after('<a href="'+music_url+'" class="btn" target="_blank"><svg class="icon icon-quanjubofangqi-xiazai " width="18" height="18"><use xlink:href="#icon-quanjubofangqi-xiazai"></use></svg></a>')
        $('.xm-player-oprations .btn').eq(1).remove()
        console.log("OK")
    }

    //主控制程序
    get_json()


    // Your code here...
})();