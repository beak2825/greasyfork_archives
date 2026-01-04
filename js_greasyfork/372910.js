// ==UserScript==
// @name         网易云音乐下载
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  点击下载按钮，网易云直接进行下载，不弹出登录框，推荐进入单首歌播放页再下载。
// @author       ZLOE
// @match        https://music.163.com/*song?id=*
// @match        https://music.163.com/*discover/toplist
// @grant        GM_xmlhttpRequest
// @require https://ajax.googleapis.com/ajax/libs/jquery/1.11.0/jquery.min.js
// 作者博客:https://zhang18.top
// @downloadURL https://update.greasyfork.org/scripts/372910/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/372910/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //获取音乐,单首播放的页面
    function get_music(){
        var id = window.location.href.split('id=')[1]
        var url = 'https://api.imjad.cn/cloudmusic/?type=song&id='+id
        console.log(id)
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(res) {
                if (res.status == 200) {
                    var text = res.responseText;
                    var a = jQuery.parseJSON(text)
                    var music_url = a.data[0].url
                    $('.u-btni-dl').after('<a class="u-btni u-btni-dl" href="'+music_url+'" target="_blank"><i>下载</i></a>')
                    $('.u-btni-dl').eq(0).remove()
                    //var comment = $('.j-flag .cntwrap .f-brk').text()
                    //console.log(comment)

                }
            }
        });
    }
    //难度加倍,多首页面点击下载,有时候不灵，Bug未知
    function get_music_list(){
        $('.btns  .u-btni-dl').attr('href','https://zhang18.top')
        $('.u-btni-dl').attr('data-res-action','ZLOE')
        $('.even ').on('click', '.icn-dl', function get_id() {
            var id = $(this).attr('data-res-id')
            console.log('获取id成功！')
            $(this).attr('data-res-action','ZLOE')
            var url = 'https://api.imjad.cn/cloudmusic/?type=song&id='+id
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(res) {
                    if (res.status == 200) {
                        var text = res.responseText;
                        var a = jQuery.parseJSON(text)
                        var music_url = a.data[0].url
                        //window.open(music_url, '_blank');
                        window.location.href = music_url
                    }
                }
            });

        })

    }
    //判断url
    function Y_Y(){
        var url_Y = window.location.href.split('/')[3]
        $('.m-layer-down').remove()
        if (url_Y=='discover'){
            console.log("多首音乐")
            get_music_list()
        }else{
            console.log("单首音乐")
            get_music()
        }
    }

    //主控制程序
    Y_Y()

    // Your code here...
})();