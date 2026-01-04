// ==UserScript==
// @name         XMwiki专辑曲目列表生成
// @version      1.7.3
// @description  几个常用音乐平台专辑曲目列表生成 Grab song list information from some websites
// @author       XMAnon
// @icon         https://s1.ax1x.com/2020/07/15/UabtVe.jpg
// @match        *://www.amazon.com/*
// @match        *://www.amazon.de/*
// @match        *://www.amazon.fr/*
// @match        *://www.amazon.it/*
// @match        *://www.amazon.es/*
// @match        *://music.apple.com/*
// @match        *://open.spotify.com/*
// @match        *://www.deezer.com/*
// @match        *://music.163.com/*
// @match        *://www.discogs.com/*
// the script is mostly inspired by Jeffrey.Deng(https://greasyfork.org/users/129338)复制spotify歌曲名脚本
// Grabbing Info from other sites is almost similar.
// 音乐平台抓取歌曲列表，并生成符合XM格式的歌曲列表（页面2）
// Supported:
//           Spotify Album,
//           Amazon Free Streaming and MP3 Site (tested on US/DE/IT/FR/ES, other Countries should also work) may not working properly after amazon website update
//           Apple Music
//           Deezer
//           Discogs
//           极地大鹅 （由于抠抠音乐网页版仅显示十首曲目，已注释并已删去网页关联）
//           天空之城 （测试备用）
// To be done:
//           Multiple CD case, Bandcamp, MusicBrainz
//
// @namespace https://greasyfork.org/users/666548
// @downloadURL https://update.greasyfork.org/scripts/407016/XMwiki%E4%B8%93%E8%BE%91%E6%9B%B2%E7%9B%AE%E5%88%97%E8%A1%A8%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/407016/XMwiki%E4%B8%93%E8%BE%91%E6%9B%B2%E7%9B%AE%E5%88%97%E8%A1%A8%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // IE specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed";// Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy");// Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }
    var song = function(_title, _artist) {
        this.title = _title;
        this.artist = _artist.replace(/ & | feat. |, /gm,';');
    };

    function checkSrc(currentUrl){
        var getSpotify = function(){};
        var getAmazon = function(){};
        var getApple = function(){};
        var getDeezer = function(){};
        var getDiscogs = function(){};
        //        var getQM = function(){};
        var getYM = function(){};
        //var getDiscogs = function(){};
        //var getDeezer = function(){};
        //***************************************** Spotify *********************************************************************
        getSpotify = function() {
            var nodes = document.querySelectorAll("#main div[data-testid='tracklist-row']");//querySelector('#main .tracklist-container .tracklist').childNodes;//querySelectorAll("div > li > div.tracklist-col.name > div > div");
            if (!nodes) {
                console.warn("Songs nodes not found!!");
                return;
            }
            var playList = [];
            var len = nodes.length;
            var charList = '';
            for (var i = 0; i < len; i += 1) {
                var one = new song(nodes[i].children[1].innerText.split('\n')[0], nodes[i].children[1].innerText.split('\n')[1]);
                playList.push(one);
                charList = charList + one.title + '【歌手】' + one.artist + '\n';
            }
            copyToClipboard(charList);
            console.log(charList);
        }
        //***************************************** Amazon *********************************************************************
        getAmazon = function(){//Amazon新的流媒体页面没有曲目艺人信息了所以就只抓取了曲目列表 2020.08
            //var nodes = document.querySelector("#dmusic_tracklist_content > tbody").getElementsByClassName('a-text-left a-align-center darkenOnHover');//tested on 'amazon.de' unlimited stream page, but now without artists name
            var nodes = document.querySelector("#dmusic_tracklist_content > tbody").childNodes;//tested on 'amazon.de' unlimited stream page, but now without artists name
            //var headerNode = document.getElementById('dmusic_tracklist_header_box');
            var len = nodes.length;
            if (!nodes) {
                console.warn("nodes not found");
                return;}
            //         else if (len === 0){
            //             nodes = [headerNode.nextSibling.nextSibling]; //Special Case when it's EP
            //             len = 1;
            //        }
            var playList = [];
            var albumArtist = document.getElementById("ProductInfoArtistLink").innerText;
            var charList = '';
            for (var i = 0; i < len; i += 2) {
                //var rawList = (nodes[i].innerText.split('\t'));
                var title = (nodes[i].querySelector(".TitleLink").innerText);
                //rawList = rawList.filter(function(e){return e.replace(/\t/gm,"")});
                //var one = new song(rawList[1], rawList[2].replace(/ & /gm,';').replace(' feat. ',';').replace(/, /gm,';'));
                //var one = new song(rawList[1]);
                var one = new song(title,'');
                //             switch(0){
                //                 case(one.artist.indexOf('\t')):
                //                     one.artist = albumArtist;
                //                     break;
                //                 case(one.artist.indexOf('de ')):
                //                 case(one.artist.indexOf('di ')):
                //                 case(one.artist.indexOf('by ')):
                //                     one.artist = one.artist.substring(3);
                //                     break;
                //                 case(one.artist.indexOf('von ')):
                //                     one.artist = one.artist.substring(4);
                //                     break;
                //             }
                //console.log(rawList);
                //console.log(one);
                playList.push(one);
                //charList = charList + one.title + '【歌手】'+ one.artist + '\n';
                charList = charList + one.title + '\n';
            }
            copyToClipboard(charList);
            console.log(charList);
        }
        //***************************************** Apple *********************************************************************
        getApple = function() {
            var nodes = document.querySelector('.product-page .header-and-songs-list .songs-list').querySelectorAll(".song");
            if (!nodes) {
                console.warn("Songs nodes not found!!");
                return;
            }
            var albumArtist = document.querySelector(".product-page .product-creator").innerText.replace(/ & | feat. /gm,';');
            var playList = [];
            var len = nodes.length;
            var charList = '';
            var artist = '';
            for (var i = 0; i < len; i += 1) {
                var title = nodes[i].querySelector(".song-name-wrapper .song-name").innerText;
                if (!nodes[i].querySelector(".song-name-wrapper .by-line")){
                    artist = albumArtist;
                }
                else{
                    artist = nodes[i].querySelector(".song-name-wrapper .by-line").innerText}
                var one = new song(title, artist);
                playList.push(one);
                charList = charList + one.title + '【歌手】' + one.artist + '\n';
            }
            copyToClipboard(charList);
            console.log(charList);
        }
        //***************************************** Deezer *********************************************************************
        getDeezer = function() {
            var nodes = document.querySelector('.page-content .container .datagrid-container .datagrid').querySelectorAll(".song");
            if (!nodes) {
                console.warn("Songs nodes not found!!");
                return;
            }
            var albumArtist = document.querySelector('.page-content .container .tnmRk').innerText;//.replace(/ & | feat. /gm,';');
            var playList = [];
            var len = nodes.length;//曲目数量
            var lenLabeled = document.querySelector('.page-content .container .datagrid-container .datagrid').querySelectorAll(".song .datagrid-label-artist").length
            var charList = '';
            var title = '';
            var artist = '';
            for (var i = 0; i < len; i += 1) {
                title = nodes[i].querySelector(".cell-title span[itemprop]").innerText;
                if (!nodes[i].querySelector(".datagrid-label-artist")){//没标艺人，即专辑艺人
                    artist = albumArtist;}
                else{//标了艺人，feat需加上专辑艺人
                    if(len > lenLabeled){
                        var coartist = nodes[i].querySelector(".datagrid-label-artist").innerText;
                        artist = albumArtist + ';' + coartist;
                    }
                    else{
                        artist = nodes[i].querySelector(".datagrid-label-artist").innerText;
                    }
                }
                var one = new song(title, artist);
                playList.push(one);
                charList = charList + one.title + '【歌手】' + one.artist + '\n';
            }
            copyToClipboard(charList);
            console.log(charList);
        }
        //***************************************** QM *********************************************************************垃圾抠抠音乐网页版专辑曲目显示不全 2020.9
        //         getQM = function() {
        //             var nodes = document.querySelector('#song_box').querySelectorAll('li');
        //             if (!nodes) {
        //                 console.warn("Songs nodes not found!!");
        //                 return;
        //             }
        //             var playList = [];
        //             var len = nodes.length;//曲目数量
        //             var charList = '';
        //             var title = '';
        //             var artist = '';
        //             for (var i = 0; i < len; i += 1) {
        //                 title = nodes[i].querySelector('.songlist__songname .songlist__songname_txt a').title;
        //                 var arNodes = nodes[i].querySelector('.songlist__artist').querySelectorAll('.singer_name');
        //                 if (!arNodes) {
        //                     console.warn("Artists nodes not found!!");
        //                     return;
        //                 }
        //                 else{
        //                     artist = arNodes[0].title;
        //                     if(arNodes.length > 1){
        //                         for (var j = 1; j < arNodes.length; j ++){
        //                             artist = artist + ';' + arNodes[j].title;
        //                         }
        //                     }
        //                     var one = new song(title, artist);
        //                     playList.push(one);
        //                     charList = charList + one.title + '【歌手】' + one.artist + '\n';
        //                 }
        //             }
        //             copyToClipboard(charList);
        //             console.log(charList);
        //         }
        //***************************************** YM *********************************************************************云村和抠抠音乐网页版基本一样，不写白不写，万一有人需要 2020.09
        getYM = function() {
            var tryNode = document.querySelector('#song-list-pre-cache tbody');
            var nodes = [];
            if (!tryNode) {//Body node not found
                console.warn("Iframe exist!?");
                nodes = document.querySelector('#g_iframe').contentDocument.querySelector('#song-list-pre-cache tbody').childNodes
                if (!nodes) {
                    console.warn("No songs found!! ");
                    return;
                }
            }
            else{
                nodes = tryNode.childNodes;
                if (!nodes) {
                    console.warn("No songs found!! ");
                    return;
                }
            }
            var playList = [];
            var len = nodes.length;//曲目数量
            var charList = '';
            var title = '';
            var artist = '';
            for (var i = 0; i < len; i += 1) {
                title = nodes[i].querySelector('td .txt a b').title;
                artist = nodes[i].querySelector('td .text span').title.replace(/\//gm,';');
                var one = new song(title, artist);
                playList.push(one);
                charList = charList + one.title + '【歌手】' + one.artist + '\n';
            }
            copyToClipboard(charList);
            console.log(charList);
        }
        //var getBandCamp = function(){}
        //var getMusicBrain = function(){}
        //***************************************** Discogs *********************************************************************
        getDiscogs = function(){//Discogs格式情况有点多，后面慢慢补，目前列出了以下几种情况，带Blockquote的查找"Featuring"关键词添加曲目艺人
            //                 tested album:                                                                                          blockquote   featuring    tracklist_track_artists  tracklist_track_title
            //                 no song artits https://www.discogs.com/Taylor-Swift-Folklore/master/1777815                                x                                                       x
            //                 x detail(complicated) song artists https://www.discogs.com/Clueso-Handgep%C3%A4ck-I/release/12446518       x                                                       x
            //                 x detail(complicated) song artists https://www.discogs.com/Oonagh-Oonagh/release/5542798                   x                                                       x
            //                 EP no song artists https://www.discogs.com/Oonagh-G%C3%A4a/release/5686699                                                                                         x
            //                 Complition no song artists, with feat. https://www.discogs.com/Oonagh-Best-Of/release/15751583             x           x                                           x
            //                 Various Artists 1 https://www.discogs.com/Leikf%C3%A9lag-%C3%8Dslands-Leikf%C3%A9lag-Reykjav%C3%ADkur-Stone-Free/release/2663095          x                        x
            //                 x no song artist https://www.discogs.com/Lord-Finesse-The-Awakening/release/15752829                       x                                                       x
            var nodes = document.querySelector("#tracklist .playlist").querySelectorAll('.tracklist_track.track');//
            var len = nodes.length;
            if (!nodes) {
                console.warn("nodes not found");
                return;}
            var aaNodes = document.querySelector("#profile_title").querySelectorAll('span[title]');
            if (!aaNodes) {
                console.warn("Error! Album artists not found!");//hope wont happen
                return;}
            else{
                var albumArtist = aaNodes[0].title.split(' (')[0].replace('*','');
                for(var j = 1 ; j < aaNodes.length ; j++){
                    albumArtist = albumArtist + ';' + aaNodes[j].title.split(' (')[0].replace('*','');
                }//艺人从title取，Discogs重复艺人会有数字编码，截去括号和同名星号
            }
            console.log('Album Artists:' + albumArtist);//test album artists
            var playList = [];
            var charList = '';
            var title = '';
            var artist = '';
            for (var i = 0; i < len; i += 1)
            {
                title = nodes[i].querySelector('.tracklist_track_title span').innerText;
                var miniArtistNodes = nodes[i].querySelector('.tracklist_track_artists');
                var getBlockQuoteNodes = nodes[i].querySelector('blockquote');//貌似只在没有艺人小列表的情况下出现
                if(!miniArtistNodes){//没找到艺人小列表
                    if(!getBlockQuoteNodes){
                        artist = albumArtist;//没有注释即专辑艺人
                    }
                    else{
                        getBlockQuoteNodes = getBlockQuoteNodes.childNodes;//有注释需专辑艺人+feat艺人
                        artist = albumArtist;
                        for(j = 0; j< getBlockQuoteNodes.length; j++){//遍历blockquote
                            if(getBlockQuoteNodes[j].innerText.indexOf('Featuring') > -1){
                                var featArtist = getBlockQuoteNodes[j].querySelectorAll('a[href]');//不确定将来会不会出现feat的艺人没有子链接的情况，可能会漏
                                if(featArtist){
                                    for(var k = 0; k<featArtist.length ; k++){
                                        artist = artist + ';' + featArtist[k].innerText.split(' (')[0].replace('*','');//截去括号加数字编号和同名星号
                                    }
                                }
                            }
                        }
                    }
                }
                else{
                    miniArtistNodes = miniArtistNodes.querySelectorAll('.tracklist_track_artists a[href]');//有艺人小列表即mini_playlist_track_has_artist
                    artist = miniArtistNodes[0].innerText.split(' (')[0].replace('*','');//截去括号加数字编号和同名星号
                    for(j = 1 ; j < miniArtistNodes.length ; j++){
                        artist = artist + ';' + miniArtistNodes[j].innerText.split(' (')[0].replace('*','');//截去括号加数字编号和同名星号
                    }//艺人从title取，Discogs重复艺人会有数字编码，截去括号
                }
                var one = new song(title, artist);
                playList.push(one);
                charList = charList + one.title + '【歌手】' + one.artist + '\n';
            }
            copyToClipboard(charList);
            console.log(charList);
        }
        //*********************************************************************************************************************
        switch(true){
            case (currentUrl.indexOf('open.spotify.com') > -1):
                getSpotify();
                break;
            case (currentUrl.indexOf('www.amazon') > -1):
                getAmazon();
                break;
            case (currentUrl.indexOf('music.apple.com') > -1):
                getApple();
                break;
            case (currentUrl.indexOf('www.deezer.com') > -1):
                getDeezer();
                break;
                //             case (currentUrl.indexOf('y.qq.com') > -1 && currentUrl.indexOf('album') > -1):
                //                 getQM();
                //                 break;
            case (currentUrl.indexOf('music.163.com') > -1 && currentUrl.indexOf('album') > -1):
                getYM();
                break;
                //case (currentUrl.indexOf('bandcamp') > -1):
            case (currentUrl.indexOf('discogs.com') > -1):
                getDiscogs();
                break;
            default:
                console.warn('Host not matching');
        }
    }
    //**************打印下键盘事件的event对象**********
    //     document.onkeydown = function (oEvent) {
    //     console.log(oEvent);}
    // ************************************************
    document.onkeydown = function(oEvent) {//快捷键Shift + C 触发命令
        oEvent = oEvent || window.oEvent;
        //获取键盘的keyCode值
        var nKeyCode = oEvent.keyCode // || oEvent.which || oEvent.charCode;
        //获取shift 键对应的事件属性
        var bShiftKeyCode = oEvent.shiftKey //|| oEvent.metaKey;
        if(nKeyCode == 67 && bShiftKeyCode) {//快捷键 shift + c :  shift(shiftKey) c(keyCode = 67; which = 67; charCode = 0 ) x(keyCode = 88;which = 88; charCode = 0 )
            //doSomeThing...
            //alert('you punched shift + c');
            var currentUrl = window.location.href;
            checkSrc(currentUrl);//check source and get song list
        }
    }
})();