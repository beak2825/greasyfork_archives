// ==UserScript==
// @name         doubanFM2search
// @namespace    https://greasyfork.org/zh-CN/scripts/11674-doubanfm2netease
// @version      1.1
// @description  doubanFM searching in other music website
// @author       xavier skip
// @match        *://douban.fm/*
// @match        *://fm.douban.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/11674/doubanFM2search.user.js
// @updateURL https://update.greasyfork.org/scripts/11674/doubanFM2search.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


function FM(){
    //不知道为什么豆瓣存储的信息song.artist和song.album总是一样的
    return{
        check: function(){
            var e = document.querySelector('.send-song-to-phone');
            this.version = e?1:2;
            return this.version;
        },
        v1: function(){
            var info = JSON.parse(window.localStorage.getItem('bubbler_song_info'));
            return {
                song: info.song_name,
                album: info.album,
                artist: info.artist
            };
        },
        v2: function(){
            var info = JSON.parse(window.localStorage.getItem('simpleStorage'))['douradio-player-state'].current_song;
            return {
                song: info.title,
                album: info.albumtitle ,
                artist: info.artist
            };
        },
        search_info: function(){
            var v = this.check();
            var info;
            if ( v == 1 ) {
                info = this.v1();
            }else{
                info = this.v2();
            }
            return this.search_keywords(info);
        },
        search_keywords: function(info){
            var keywords = "";
            var separator = " | ";
            if(info.song.length>30){
                keywords = info.song;
            }else if( (info.song.length + info.album.length)>40){
                keywords = [info.song, info.album].join(separator);
            }else{
                keywords = [info.song, info.album, info.artist].join(separator);
            }
            return keywords;
        },
        element :function(data){
            var that = this; // import
            var a = document.createElement('a');
            a.target="_blank";
            a.innerText = data['title'];
            a.addEventListener("click",function(e){
                a.href = data['search']+ encodeURIComponent(that.search_info());
                e.stopImmediatePropagation();
            }, true);
            return a;
        },
        elements: function(){
            var div = document.createElement('div');
            div.className = "fm2search";
            for (var d in search_data){
                var p = document.createElement('p');
                p.appendChild(this.element(search_data[d][0]));
                div.appendChild(p);
            }
            return div;
        }
    };
}

var search_data = {
    'netease': [{
        "title": "网易",
        "search": "//music.163.com/#/search/m/?s=",
    }],
    'xiami': [{
        "title": "虾米",
        "search": "//www.xiami.com/search?key=",
    }],
    'qq': [{
        "title": "QQ",
        "search":"//y.qq.com/portal/search.html#&w=",
    }],
}


// set css
addGlobalStyle("\
    .fm2search{color:#888;z-index:9999;margin-top: 9px;}\
    .fm2search a:hover{background:0;color:#5b9;}\
    .fm2search p {display: inline; margin-right:16px;}");

// init
var fm = new FM();
var insert_queryname = '.sub-buttons-wrapper';
var again = function(){
    var content = document.querySelector(insert_queryname);
    if(content){
        content.appendChild(fm.elements());
        console.log('appendChild', content);
    }else{
        console.log('again', content);
        setTimeout(again, 700);
    }
};

// main
again();
