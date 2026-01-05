// ==UserScript==
// @name        baidu-music-download
// @namespace   thunderhit@163.com
// @description 快速免费下载百度音乐
// @author      thunderhit
// @include     http://music.baidu.com/song/*
// @grant       GM_xmlhttpRequest
// @grant       GM_addStyle
// @version     1.10
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/3953/baidu-music-download.user.js
// @updateURL https://update.greasyfork.org/scripts/3953/baidu-music-download.meta.js
// ==/UserScript==000

var show_collection_num = true; //显示当前的收藏数

var max_collection_num = 200; //当超过这个数字脚本会自动从收藏中删除音乐

var baiduid = (function() {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf("BAIDUID" + "=");
        if (c_start != -1) {
            c_start = c_start + "BAIDUID".length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end)).replace(":FG=1", "");
        }
    }
    return "";
})();
var songid = (function() {
    return location.href.match(/\/song\/(.*)/)[1];
})();
var ajax_get = function(cb, url) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        headers: {
            Referer: location.href
        },
        onload: function(response) {
            cb(JSON.parse(response.responseText));
        },
        onerror: function(e) {
            console.log(e);
        }
    });
};
var ajax_post = function(cb, url) {
    GM_xmlhttpRequest({
        method: 'POST',
        url: url,
        data: 'ids=' + songid + '&type=song&pay_type=0&',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        },
        onload: function(response) {
            console.log(JSON.parse(response));
        },
        onerror: function(e) {
            console.log(e);
        }
    });
};

var music = {
    collect: function(cb) {
        ajax_get(cb, 'http://tingapi.ting.baidu.com/v1/restserver/ting?' + 'method=baidu.ting.favorite.addSongFavorite&format=json&from=bmpc&version=1.0.0&version_d=9.1.16&&baiduid=' + baiduid + '&songId=' + songid + '&time=' + (Math.round(new Date().getTime() / 1000)));
    },
    iscollect: function(callback) {
        ajax_get(function(data) {
            callback(data.data.isCollect);
        }, 'http://music.baidu.com/data/user/isCollect?type=song&ids=' + songid + '&r=' + Math.round(Math.random() * 100000) + (new Date().getTime()));
    },
    delcollection: function(id) {
        ajax_get(function(data) {
        }, 'http://music.baidu.com/data/user/deleteCollection?type=song&ids=' + id + '&r=' + Math.round(Math.random() * 100000) + (new Date().getTime()));
    },
    songdetail: function(cb) {
        ajax_get(cb, 'http://yinyueyun.baidu.com/data/cloud/download?songIds=' + songid);
    },
    getratedetail: function(rate_type, cb) {
        this.songdetail(function(json) {
            if (rate_type == 1024 && json.data.data.flac) {
                cb(json.data.data.flac.rate, json.data.data.flac.format, true);
            } else if (json.data.data[rate_type]) {
                cb(json.data.data[rate_type].rate, json.data.data[rate_type].rate, true);
            } else {
                cb(null, null, false);
            }
        });
    },
    getsonglist: function(cb) {
        ajax_get(cb, 'http://tingapi.ting.baidu.com/v1/restserver/ting?method=baidu.ting.favorite.getCollectSong&format=json&from=bmpc&version=1.0.0&version_d=9.1.16&bdiduid=' + baiduid + '&pn=0&rn=50');
    },
    download: function(type, target) {
        this.getratedetail(type, function(rate, format, isexist) {
            target.removeEventListener("click", event_handle, false);
            if (isexist) {
                var finalurl = 'http://yinyueyun.baidu.com/data/cloud/downloadsongfile?songIds=' + songid + '&rate=' + rate + '&format=' + format;
                location.assign(finalurl);
                target.href = finalurl;
            } else {
                target.click = null;
                target.text = '无资源';
            }
        });
    },
};

var main = function(rate_type, target) {

    music.iscollect(function(iscollect_flag) {
        if (iscollect_flag) {
            music.download(rate_type, target);
        } else {
            music.collect(function(data) {
                music.download(rate_type, target);
            });
        }
    });
    music.getsonglist(function(data) {
        if (max_collection_num && data.total > max_collection_num) {
            for (var i = 0; i < data.total; i++) {
                if (data.result[i].song_id == songid) {
                    continue;
                } else {
                    music.delcollection(data.result[i].song_id);
                }
            }
        }
    });

};

var event_handle = function(event) {
    main(event.target.getAttribute('rate'), event.target);
};
GM_addStyle('#music-download-ul>li{display:inline}.music-download-a{margin-top: 6px;margin-right: 6px;-moz-box-shadow:inset 0 39px 0 -24px #e67a73;-webkit-box-shadow:inset 0 39px 0 -24px #e67a73;box-shadow:inset 0 39px 0 -24px #e67a73;background-color:#e4685d;-moz-border-radius:4px;-webkit-border-radius:4px;border-radius:4px;border:1px solid #fff;display:inline-block;cursor:pointer;color:#fff;font-size:14px;padding:2px 15px;text-decoration:none;text-shadow:0 1px 0 #b23e35}.music-download-a:hover{background-color:#eb675e}.music-download-a:active{position:relative;top:1px}');
var list = (function() {
    var ul = document.createElement('ul');
    ul.id = 'music-download-ul';
    var a = document.createElement('a');
    a.className = 'music-download-a';
    a.href = 'javascript:void(0);';
    var rates = [128, 192, 320, 1024]; //1024 = 无损
    for (var i = 0; i < rates.length; i++) {
        var clone_a = a.cloneNode();
        clone_a.setAttribute('rate', rates[i]);
        clone_a.innerHTML = rates[i] + "kbps";
        clone_a.addEventListener('click', event_handle, false);
        var li = document.createElement('li');
        li.appendChild(clone_a);
        ul.appendChild(li);
    }
    if (show_collection_num) {
        var span = document.createElement('span');
        span.setAttribute('id', 'music-download-cn');
        span.setAttribute('style', 'color: rgb(194, 194, 194);');
        var li = document.createElement('li');
        li.appendChild(span);
        ul.appendChild(li);
    }
    return ul;
})();
var s = document.getElementsByClassName('song-opera')[0];
s.parentElement.insertBefore(list, s.nextElementSibling);
music.getsonglist(function(data) {
    var cn = document.getElementById('music-download-cn') || null;
    if (cn) {
        cn.innerHTML = '当前收藏数:' + data.total;
    }
});