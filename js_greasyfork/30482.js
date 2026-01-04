// ==UserScript==
// @id             heawercher@gmail.com
// @name           My163MusicHelper|网易音乐C+|网易|网易音乐|music.163.com
// @namespace      Chang_way_enjoying
// @description    ①美化网易音乐的排布,去除首页某些特别难看的广告或其他用户不友好的页面元素。;②点击播放器的歌曲封面就可以直接下载歌曲，没有侵入页面元素（不想影响美感,当听到自己喜欢的歌的时候不需要进入任何界面直接点击歌曲封面就直接可以下载。;③ 在线播放使用更高音质;
// @description    网易音乐C+|My163MusicHelper|网易|网易音乐
// @author         Chang
// @connect        imdb.com
// @grant          none
// @require        http://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @include        http://music.163.com/
// @include        https://music.163.com/
// @match          http://music.163.com/*
// @match          https://music.163.com/*
// @version        09212017002
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/30482/My163MusicHelper%7C%E7%BD%91%E6%98%93%E9%9F%B3%E4%B9%90C%2B%7C%E7%BD%91%E6%98%93%7C%E7%BD%91%E6%98%93%E9%9F%B3%E4%B9%90%7Cmusic163com.user.js
// @updateURL https://update.greasyfork.org/scripts/30482/My163MusicHelper%7C%E7%BD%91%E6%98%93%E9%9F%B3%E4%B9%90C%2B%7C%E7%BD%91%E6%98%93%7C%E7%BD%91%E6%98%93%E9%9F%B3%E4%B9%90%7Cmusic163com.meta.js
// ==/UserScript==
var myScriptStyle = document.createElement("style");
myScriptStyle.innerHTML = "@charset utf-8; .download,a[class='btnl click-flag f-alpha'],a[class='btnr click-flag f-alpha'],#g_backtop,div.g-ft,ul.m-nav.j-tflag>li.lst,#j-music-ad,div.m-multi{display:none}a.btnr.click-flag.f-alpha[hidefocus=true]{right:184px}";
document.getElementsByTagName("head")[0].appendChild(myScriptStyle);

var myScriptInject = document.createElement("script");
    myScriptInject.type = "text/javascript";
    myScriptInject.innerHTML = 'window.encrypt_data = function (data) { var pubKey = \'010001\'; var modulus = \'00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7\'; var nonce = \'0CoJUm6Qyw8W8jud\'; return window.asrsea(JSON.stringify(data), pubKey, modulus, nonce); };';
    document.getElementsByTagName("head")[0].appendChild(myScriptInject);
var myScriptInject = document.createElement("script");
    myScriptInject.type = "text/javascript";
    myScriptInject.innerHTML = 'var hookXhrResponse, parseXhrResponse, xhr_open; parseXhrResponse = function(xhr) { var appfix, data, filename, i, len, privilege, ref, request, results; request = { url: xhr._url, data: xhr._data }; if (request.url.startsWith(\'/weapi/song/enhance/player/url\')) { data = JSON.parse(xhr.responseText); if (data.code === 200) { $("#g_player > div.head > a.mask").attr(\'href\', data.data[0].url).attr(\'target\', \'_blank\').attr(\'data-url\', data.data[0].url); filename = $("#g_player > div.play > div.words > a.name").text() + \' - \' + $("#g_player > div.play > div.words > span.by").text(); appfix = data.data[0].url.split(\'.\'); appfix = appfix[appfix.length - 1]; filename = filename + \'.\' + appfix; $("#g_player > div.head > a.mask").attr(\'download\', filename).attr(\'title\', filename); } } else if (request.url.startsWith(\'http://music.163.com/weapi/v3/playlist/detail\')) { data = JSON.parse(xhr.responseText); ref = data.privileges; results = []; for (i = 0, len = ref.length; i < len; i++) { privilege = ref[i]; results.push(null); } return results; } }; hookXhrResponse = function(xhr) { var data, i, len, privilege, ref, request; request = { url: xhr.xhr._url, data: xhr.xhr._data }; if (request.url.startsWith(\'http://music.163.com/weapi/v3/playlist/detail\')) { data = JSON.parse(xhr.responseText); data.playlist.highQuality = true; ref = data.privileges; for (i = 0, len = ref.length; i < len; i++) { privilege = ref[i]; if (privilege.maxbr) { privilege.fl = privilege.dl = privilege.maxbr; } privilege.payed = 1; } xhr.responseText = xhr.xhr.responseText = JSON.stringify(data); } }; xhr_open = function(arg, xhr) { var tag_a; if (arg[1].startsWith(\'/weapi/song/enhance/player/url\')) { tag_a = $("#g_player a[href^=\'/song?id\']"); if (tag_a.length) { music_id(tag_a.attr(\'href\').split(\'/song?id=\')[1]); return arg[1] = \'/weapi/song/enhance/player/url_fuckup\'; } } };';
    document.getElementsByTagName("head")[0].appendChild(myScriptInject);
var myScriptInject = document.createElement("script");
    myScriptInject.type = "text/javascript";
    myScriptInject.innerHTML = 'window.myScriptData = {}; !function (ob) { ob.hookAjax = function (funs) { window._ahrealxhr = window._ahrealxhr || XMLHttpRequest; XMLHttpRequest = function () { this.xhr = new window._ahrealxhr; for (var attr in this.xhr) { var type = ""; try { type = typeof this.xhr[attr] } catch (e) { } if (type === "function") { this[attr] = hookfun(attr); } else { Object.defineProperty(this, attr, { get: getFactory(attr), set: setFactory(attr) }) } } }; function getFactory(attr) { return function () { return this.hasOwnProperty(attr + "_") ? this[attr + "_"] : this.xhr[attr]; } } function setFactory(attr) { return function (f) { var xhr = this.xhr; var that = this; if (attr.indexOf("on") != 0) { this[attr + "_"] = f; return; } if (funs[attr]) { xhr[attr] = function () { funs[attr](that) || f.apply(xhr, arguments); } } else { xhr[attr] = f; } } } function hookfun(fun) { return function () { var args = [].slice.call(arguments); if (funs[fun] && funs[fun].call(this, args, this.xhr)) { return; } return this.xhr[fun].apply(this.xhr, args); } } return window._ahrealxhr; }; ob.unHookAjax = function () { if (window._ahrealxhr) XMLHttpRequest = window._ahrealxhr; window._ahrealxhr = undefined; } }(window); function ajaxEventTrigger(event) { var ajaxEvent = new CustomEvent(event, {detail: this}); window.dispatchEvent(ajaxEvent); } hookAjax({ onreadystatechange: function (xhr) { if (xhr.xhr.readyState === xhr.DONE && xhr.xhr.status === 200) { if (xhr.xhr._url.startsWith(\'http://music.163.com/weapi/v3/playlist/detail\')) { data = JSON.parse(xhr.xhr.responseText); data.playlist.highQuality = true; ref = data.privileges; for (i = 0, len = ref.length; i < len; i++) { privilege = ref[i]; if (privilege.maxbr) { privilege.fl = privilege.dl = privilege.maxbr; } privilege.payed = 1; } xhr.responseText = xhr.xhr.responseText = JSON.stringify(data); } parseXhrResponse(xhr.xhr); } }, onload: function (xhr) { }, open: function (arg, xhr) { xhr._url = arg[1]; xhr.addEventListener(\'loadend\', function (a) { parseXhrResponse(a.target); }) }, send: function (arg, xhr) { if (arg) xhr._data = arg[0]; if (xhr._url.startsWith(\'/weapi/song/enhance/player/url\')) { tag_a = $("#g_player a[href^=\'/song?id\']"); if (tag_a.length) { music_id = tag_a.attr(\'href\').split(\'/song?id=\')[1]; csrf_token = xhr._url.split(\'?csrf_token=\')[1]; _hook_data = encrypt_data({ "ids": [music_id], "br": 999000 }); arg[0] = \'params=\' + encodeURIComponent(_hook_data.encText) + \'&encSecKey=\' + encodeURIComponent(_hook_data.encSecKey); } } } });';
    document.getElementsByTagName("head")[0].appendChild(myScriptInject);
if (!document.getElementById("euHChn") && document.title.indexOf('网易云音乐') !== -1) {
    var euHChn = document.createElement("a");
    euHChn.id = "euHChn";
    document.getElementsByTagName("html")[0].appendChild(euHChn);

    if (location.href.startsWith('http://music.163.com') || location.href.startsWith('https://music.163.com')) {

        $(document).ready(function() {
            var getDoc, getJSON, postDoc;
            getDoc = function(url, meta, callback) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'User-agent': window.navigator.userAgent,
                        'Content-type': null
                    },
                    onload: function(responseDetail) {
                        var doc;
                        doc = '';
                        if (responseDetail.status == 200) {
                            doc = (new DOMParser).parseFromString(responseDetail.responseText, 'text/html');
                            if (doc == undefined) {
                                doc = document.implementation.createHTMLDocument('');
                                doc.querySelector('html').innerHTML = responseText;
                            }
                        }
                        callback(doc, responseDetail, meta);
                    }
                });
            };
            postDoc = function(url, data, meta, callback) {
                GM_xmlhttpRequest({
                    anonymous: true,
                    method: 'POST',
                    url: url,
                    headers: {
                        'User-agent': window.navigator.userAgent,
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    data: data,
                    onload: function(responseDetail) {
                        callback(responseDetail.responseText, responseDetail, meta);
                    }
                });
            };
            getJSON = function(url, callback) {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    headers: {
                        'Accept': 'application/json'
                    },
                    onload: function(response) {
                        if (response.status >= 200 && response.status < 400) {
                            callback(JSON.parse(response.responseText), url);
                        } else {}
                    }
                });
            };

            var checkin;
            checkin = $('a[data-action=checkin] > i');
            if (checkin) {
                checkin.click();
            }

        });
    }

}