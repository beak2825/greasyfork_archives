// ==UserScript==
// @name        网易云下载 
// @description  歌单里好多歌用以前的脚本都404了，于是简单修改了下。 
// @version   20180616
// @author         糖果君
// @include     http*://music.163.com/*
// @grant       unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @require  https://greasyfork.org/scripts/26727-网易云音乐歌曲封面下载/code/网易云音乐歌曲封面下载.user.js
// @require https://greasyfork.org/scripts/34555-greasemonkey-4-polyfills/code/Greasemonkey%204%20Polyfills.js

// @namespace 
// @downloadURL https://update.greasyfork.org/scripts/23222/%E7%BD%91%E6%98%93%E4%BA%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/23222/%E7%BD%91%E6%98%93%E4%BA%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
//参考 https://greasyfork.org/zh-CN/scripts/10548-网易云音乐下载
//以及更早的 https://greasyfork.org/zh-CN/scripts/1099-netease-music-download
var window=unsafeWindow||window.wrappedJSObject;
var api = {
    //参考 https://greasyfork.org/zh-CN/scripts/10582-网易云音乐高音质支持
    getTrackURL: function(dfsId) {
        var byte1 = '3go8&$8*3*3h0k(2)2';
        var byte2 = dfsId + '';
        var byte3 = [];
        for (var i = 0; i < byte2.length; i++) {
            byte3[i] = byte2.charCodeAt(i) ^ byte1.charCodeAt(i % byte1.length);
        }
        byte3 = byte3.map(function(i) {
            return String.fromCharCode(i);
        }).join('');
        var results = window.CryptoJS.MD5(byte3).toString(window.CryptoJS.enc.Base64).replace(/\//g, '_').replace(/\+/g, '-');
        var url = 'http://p2.music.126.net/' + results + '/' + byte2;
        return url;
    },
    autoSign: function (type, cookie) {
        if (document.cookie.indexOf(cookie) == - 1) {
            api.sign(type, function (result) {
                if (result.code == - 2 || result.code == 200) {
                    var cookieime = new Date();
                    cookieime.setTime(24 * 60 * 60 * 1000 + new Date(new Date() .toDateString()) .getTime() - 1);
                    document.cookie = cookie+ ';expires=' + cookieime.toGMTString();
                }
            });
        };
    },
    encrypt_request: function(callback, url, data) {
        // 这个好像不重要。var token = window.document.cookie.split('__csrf') [1].split(';') [0].substring(1); 
        var token = '';
        data.csrf_token = token;
        var req = new XMLHttpRequest();
        req.open('POST', window.location.origin+url+ token, true);
        req.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        req.setRequestHeader('X-Real-IP', '27.38.4.87');
        //解决海外问题。
        req.onload = function() {
            callback(JSON.parse(this.responseText));
        };
        //参考  https://github.com/darknessomi/musicbox/wiki/网易云音乐新版WebAPI分析。
        var pubKey = '010001';
        var modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
        var nonce = '0CoJUm6Qyw8W8jud';
        var result = window.asrsea(JSON.stringify(data), pubKey, modulus, nonce);
        req.send('params=' + encodeURIComponent(result.encText) + '&encSecKey=' + encodeURIComponent(result.encSecKey));
    },
    detail: function(songId, callback) {
        var url = '/weapi/v3/song/detail';
        var data = {
            c:
            JSON.stringify([{
                id: songId
            }
                           ])
        };
        this.encrypt_request(callback, url, data);
    },
    album: function (albumId, callback) {
        var url = '/api/album/' + albumId;
        var data = {
        };
        this.encrypt_request(callback, url, data);
    },
    lrc: function(songId, callback) {
        var url = '/weapi/song/lyric';
        var data = {
            id: songId,
            lv: -1,
            tv: -1
        };
        this.encrypt_request(callback, url, data);
    },
    newsong: function(songId, callback) {
        var url = '/weapi/song/enhance/player/url';
        var data = {
            ids: [songId],
            br: 999000,
        };
        this.encrypt_request(callback, url, data);
    },
    mv: function(mvId, callback) {
        var url = '/weapi/mv/detail/';
        var data = {
            id: mvId,
        };
        this.encrypt_request(callback, url, data);
    },
    search: function(songinfo, callback) {
        var url = '/weapi/search/pc';
        var data = {
            s: songinfo,
            limit: 1,
            type: 1,
            offset: 0,
        };
        this.encrypt_request(callback, url, data);
    },
    sign: function (type, callback) {
        var url = '/weapi/point/dailyTask';
        var data = {
            type: type
        };
        this.encrypt_request(callback, url, data);
    },
    xiamisearch: function (key, callback) {
        GM.xmlHttpRequest({
            method: 'GET',
            url: 'http://music-api-jwzcyzizya.now.sh/api/search/song/xiami?&limit=1&page=1&key=' + key,
            onload: function (response) {
                callback(JSON.parse(response.responseText));
            }
        });
    },
};
var innerFrame = document.querySelector('iframe');
var pages = [
    {
        url: 'music.163.com/#/song?id=',
        handler: function() {
            var songId = location.href.match(/id=([0-9]+)/)[1];
            var downloadLine = this.createDownloadLine(songId);
            var innerFrameDoc = innerFrame.contentWindow.document;
            var albumNode = innerFrameDoc.querySelectorAll('p.des.s-fc4')[1];
            var parentNode = albumNode.parentNode;
            parentNode.insertBefore(downloadLine, albumNode.nextElementSibling);
        },
        createDownloadLine: function(songId) {
            var disableStyle = function(link) {
                link.text += '(无)';
                link.style.color = 'gray';
                link.style.textDecoration = 'none';
                link.style.cursor = 'auto';
            };
            var setUrlAndSize = function (mp3Link, Music, albumId,songinfo) {
                if (Music) {
                    var href = Music.url;
                    if (href) {
                        mp3Link.href = href;
                        mp3Link.text += (Music.size / 1024 / 1024) .toFixed(1) + 'M';
                        return ;
                    } 
                    else {/*其实旧接口还是能用，带.mp3等后缀名会直接403 去掉后缀名就可以
                    api.album(albumId, function (result) {
                            if (result.album && result.album.songs)
                            {
                                var songs = result.album.songs;
                                for (var i = 0; i < songs.length; i++)
                                {
                                    if (songs[i].id == songId) {
                                        var song = songs[i];
                                        var music = song.hMusic || song.mMusic || song.lMusic || song.bMusic;
                                        var mp3url;
                                        var dfsId = music.dfsId_str || music.dfsId;
                                        if (music && dfsId != 0) {
                                            mp3url = api.getTrackURL(dfsId);
                                            mp3Link.text += (music.size / 1024 / 1024) .toFixed(1) + 'M(旧)';
                                        } else if (!song.mp3Url.endsWith('==/0')) {
                                            mp3url = song.mp3Url;
                                        }
                                    if (mp3url) {
                                            mp3Link.href = mp3url;
                                        }
                                    else {*/
                                    api.xiamisearch(songinfo, function (result) {
                                    if (result.songList) {
                                        console.log(result);
                                        mp3Link.href = result.songList[0].file;
                                        mp3Link.text += '(虾米)';
                                    } else {
                                        disableStyle(mp3Link);
                                    }
                                });/*
                            }
                                    }
                                }
                            } 

                        });
                    */}
                }
            };
            var setLyric = function(LycLink, result) {
                var LrC = '';
                var lrc = result.lrc;
                var tlrc = result.tlyric;
                var num = 0;
                if (lrc && lrc.lyric) {
                    LrC += lrc.lyric + '\n';
                    num+=1;}
                if (tlrc && tlrc.lyric) {
                    LrC += tlrc.lyric;
                    num+=2;}


                if (num != 0) {
                    var html = '';
                    switch (num) {
                        case 1:html="(原)";break;
                        case 2:html="(译)";break;
                        case 3:html="(合)";break;
                    }
                    LycLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(LrC);
                    LycLink.innerHTML += html;
                } else {
                    disableStyle(LycLink);
                }
            };

            var newMp3Link = this.createLink('歌曲');
            var lyricLink = this.createLink('歌词');
            var mvLink = this.createLink('mv');
            var picLink = this.createLink('封面');

            api.detail(songId, function (result) {
                var song = result.songs[0];
                if (song.mv) {
                    api.mv(song.mv, function (result) {
                        var mv = result.data.brs;
                        mvLink.href = mv[720] || mv[480] || mv[240];
                    });
                } 
                else {
                    disableStyle(mvLink);
                };

                if (song.al.pic_str || song.al.pic) {
                    var img = innerFrame.contentWindow.document.querySelector(".j-img");
                    picLink.href = img.dataset["src"] = api.getTrackURL(song.al.pic_str || song.al.pic);
                    img.src = img.dataset["src"] + "?param=130y130";
                } else {
                    disableStyle(picLink);
                }; 
                var alia = song.alia[0] ? '(' + song.alia + ')' : '';
                var ars = '-';
                for (var i = 0; i < song.ar.length; i++) {
                    ars += (song.ar) [i].name + '/';
                }
                var songinfo = song.name + alia + ars;
                var alid = song.al.id;
                api.newsong(songId, function (result) {
                    var song = result.data[0];
                    setUrlAndSize(newMp3Link, song, alid,songinfo);
                });
            });
            api.lrc(songId, function (result) {
                setLyric(lyricLink, result);
            });
            var container = this.createLineContainer('下载');
            container.appendChild(newMp3Link);
            container.appendChild(lyricLink);
            container.appendChild(mvLink);
            container.appendChild(picLink);

            return container;
        },
        createLink: function(label) {
            var link = document.createElement('a');
            link.innerHTML = label;
            link.className = 's-fc7';
            link.style.marginRight = '10px';
            link.href = 'javascript:void(0);';
            link.target = '_blank';
            return link;
        },
        createLineContainer: function(label) {
            var container = document.createElement('p');
            container.className = 'desc s-fc4';
            container.innerHTML = label + '：';
            container.style.margin = '10px 0';
            return container;
        },
    },
];
if (innerFrame) {
    innerFrame.addEventListener('load', function () {
        var i, page;
        for (i = 0; i < pages.length; i += 1) {
            page = pages[i];
            if (location.href.indexOf(page.url) != -1) {
                page.handler();
            }
        }
    });
}
document.cookie = 'os=ios';
api.autoSign(0,'appsign=true');
api.autoSign(1,'websign=true');
