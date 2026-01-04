// ==UserScript==
// @name              网易云音乐直接下载
// @namespace         https://www.ocrosoft.com/
// @description       在单曲页面显示歌词、翻译、封面、MV、歌曲下载链接并以高音质试听。同时支持歌单、专辑等页面直接下载单曲、封面、歌词(压缩包)。如遇到错误，请阅读附加信息后进行反馈。
// @match             *://music.163.com/*
// @grant             GM.xmlHttpRequest
// @grant             GM_xmlhttpRequest
// @version           4.1.8
// @author            ocrosoft
// @connect           126.net
// @connect           163.com
// @connect           172.*
// @license           GPLV2
// @require           https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/3.1.9/core.min.js
// @require           https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/3.1.9/crypto-js.min.js
// @require           https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/3.1.9/aes.min.js
// @require           https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/3.1.9/enc-utf8.min.js
// @require           https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/crypto-js/3.1.9/enc-base64.min.js
// @require           https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jszip/3.1.5/jszip.min.js
// @require           https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/FileSaver.js/1.3.8/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/33046/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/33046/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E7%9B%B4%E6%8E%A5%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
var GM__xmlHttpRequest;
if("undefined" != typeof(GM_xmlhttpRequest)){
    GM__xmlHttpRequest = GM_xmlhttpRequest;
} else {
    GM__xmlHttpRequest = GM.xmlHttpRequest;
}

let COOKIE = {
    set: function(name, value, will_expire_ms) {
        let expire = new Date();
        if (will_expire_ms) {
            expire.setTime(expire.getTime() + will_expire_ms);
        } else {
            expire.setTime(expire.getTime() + 180 * 24 * 60 * 60 * 1000);
        }
        document.cookie = name + "=" + JSON.stringify(value) + ";expires=" + expire.toGMTString() + ';path=\/';
    },
    get: function(name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg)) {
            return unescape(arr[2]);
        }
        return null;
    },
};

/*
 * 请求播放地址时的比特率，具体含义如下
 * 999000: 请求无损flac格式
 * 320000: 320K
 * 192000: 192K
 * 128000: 128K
 * 没有对应格式时下发低一级格式
 */
let BITRATE = {
    FLAC: 999000,
    B320: 320000,
    B192: 192000,
    B128: 128000,
};
let g_bitrate = BITRATE.B320;
function setBitrate(bitrate) {
    g_bitrate = bitrate;
    COOKIE.set('bitrate', g_bitrate);
}
if (COOKIE.get('bitrate')) {
    g_bitrate = parseInt(COOKIE.get('bitrate'));
    COOKIE.set('bitrate', g_bitrate);
}

let NAMERULE = {
    TITLE_ARTIST: 0,
    ARTIST_TITLE: 1,
};
let g_nameRule = NAMERULE.ARTIST_TITLE;
function setNameRule(rule) {
    g_nameRule = rule;
    COOKIE.set('namerule', g_nameRule);
}
if (COOKIE.get('namerule')) {
    g_nameRule = parseInt(COOKIE.get('namerule'));
    COOKIE.set('namerule', g_nameRule);
}

// 参考 https://github.com/darknessomi/musicbox/blob/master/NEMbox/api.py
function _WEAPI() {
    function _REQUEST() {
        let _base_url = 'https://music.163.com';
        let _send_request = function(url, method, headers, data) {
            return new Promise(function(resolve, reject) {
                GM__xmlHttpRequest({
                    method: method,
                    url: url,
                    headers: headers,
                    data: data,
                    onreadystatechange: function(res) {
                        if (res.readyState == 4) {
                            if (res.status == 200) {
                                resolve(res.response);
                                return;
                            }
                            reject(res.status);
                        }
                    }
                });
            });
        };
        let _headers = {
            'Accept':'*/*',
            'Accept-Encoding':'gzip,deflate,sdch',
            'Accept-Language':'zh-CN,zh;q=0.8,gl;q=0.6,zh-TW;q=0.4',
            'Connection':'keep-alive',
            'Content-Type':'application/x-www-form-urlencoded',
            'Host':'music.163.com',
            'Origin':'http://music.163.com',
            'Referer':'http://music.163.com/',
            'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36',
            //'Cookie': document.cookie + ';os=osx'
            'Cookie': 'os=osx'
        };

        this.sendRequest = function(path, data) {
            return _send_request(_base_url + path, 'POST', _headers, data);
        };
        this.sendRequestWrapped = function(path, data, response_process) {
            let sendRequest = this.sendRequest;
            return new Promise(function(resolve) {
                sendRequest(path, data)
                    .then(function(response) {
                    let data = JSON.parse(response);
                    if (response_process) {
                        data = response_process(data);
                    }
                    resolve(data);
                })
                    .catch(function(status) {
                    resolve([]);
                });
            });
        };
        this.sendRequestWithMethod = function(path, method, data) {
            return _send_request(_base_url + path, method, _headers, data);
        }
    }
    function _ENCRYPT() {
        let _MODULUS = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7' +
            'b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280' +
            '104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932' +
            '575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b' +
            '3ece0462db0a22b8e7';
        let _NONCE = '0CoJUm6Qyw8W8jud';
        let _PUBKEY = '010001';
        let _create_key = function() {
            return (Math.random().toString(16).substring(2) + Math.random().toString(16).substring(2)).substring(0,16);
        };
        let _rsaEncrypt = function(text, pubKey, modulus) {
            setMaxDigits(256);
            var keys = new RSAKeyPair(pubKey, '', modulus);
            var encText = encryptedString(keys, text);
            return encText;
        }
        let _aesEncrypt = function (text, secKey){
            secKey = CryptoJS.enc.Utf8.parse(secKey);
            text = CryptoJS.enc.Utf8.parse(text);
            var encrypted = CryptoJS.AES.encrypt(text, secKey, {
                iv: CryptoJS.enc.Utf8.parse('0102030405060708'),
                mode: CryptoJS.mode.CBC
            });
            encrypted = encrypted.toString();
            return encrypted;
        }

        this.encryptedId = function(id) {
            throw('not impl!');
        };
        this.encryptedRequest = function(map) {
            let text = JSON.stringify(map);
            let secret = _create_key();
            let params = _aesEncrypt(_aesEncrypt(text, _NONCE), secret);
            let encseckey = _rsaEncrypt(secret, _PUBKEY, _MODULUS);
            return 'params=' + encodeURIComponent(params) + '&encSecKey=' + encodeURIComponent(encseckey);
        };
    };

    let REQUEST = new _REQUEST();
    let ENCREYPT = new _ENCRYPT();

    let QENC = function(map) {
        return ENCREYPT.encryptedRequest(map);
    }
    let QREQ = function(path, data, response_process) {
        return REQUEST.sendRequestWrapped(path, data, response_process);
    }

    this.songsDetail = function(ids) {
        let path = '/weapi/v3/song/detail';
        let c = [];
        for (let i = 0; i < ids.length; ++i) {
            c.push({'id': ids[i]});
        }
        let map = {
            'ids': ids,
            'c': JSON.stringify(c)
        }
        let data = QENC(map);
        return QREQ(path, data, function(data) {
            try {
                return data.songs;
            } catch (e) {
                return [];
            }
        });
    }
    this.songsUrl = function(ids) {
        let path = '/weapi/song/enhance/player/url';
        let data = QENC({'ids': ids, 'br': g_bitrate});
        return QREQ(path, data, function(data) {
            try {
                return data.data;
            } catch (e) {
                return [];
            }
        });
    };
    this.songLyric = function(music_id) {
        let path = '/weapi/song/lyric';
        let data = QENC({'os': 'osx', 'id': music_id, 'lv': '-1', 'kv': '-1', 'tv': '-1'});
        return QREQ(path, data);
    }
    this.mvUrl = function(mv_id) {
        return new Promise(function(resolve, reject) {
            let path = '/api/mv/detail?id=' + mv_id + '&type=mp4';
            REQUEST.sendRequestWithMethod(path, 'GET', null).then(function(data) {
                try {
                    data = JSON.parse(data).data;
                    resolve(data);
                } catch (e) {
                    resolve(null);
                }
            }).catch (function (status) {
                resolve(null);
            });
        });
    };
    this.playlistDetail = function(playlist_id) {
        let path = '/weapi/v3/playlist/detail';
        let data = QENC({'id': playlist_id, 'total': 'true', 'limit': 1000, 'n': 1000, 'offest': 0});
        return QREQ(path, data, function(data) {
            try {
                return data.playlist;
            } catch (e) {
                return null;
            }
        });
    };
    this.album = function(album_id) {
        let path = '/weapi/v1/album/' + album_id;
        return QREQ(path, QENC({}), function(data) {
            try {
                return {
                    'album': data.album,
                    'songs': data.songs
                };
            } catch (e) {
                return null;
            }
        });
    };

    this.login = function(username, password) {
        throw('not impl!');
        return new Promise(function(resolve, reject) {
            let path = '';
            let data = '';
            if (username.match(/^[0-9]+$/)) {
                path = '/weapi/login/cellphone';
                data = encrypted_request({'phone': username, 'password': password, 'rememberLogin': 'true'});
            } else {
                path = '/weapi/login';
                let client_token = '1_jVUMqWEPke0/1/Vu56xCmJpo5vP1grjn_SOVVDzOc78w8OKLVZ2JH7IfkjSXqgfmh';
                data = encrypted_request({'phone': username, 'password': password, 'rememberLogin': 'true', 'clientToken': client_token});
            }
            WEAPI._send_request(path, data)
                .then(function(response) {
                resolve(true);
            })
                .catch(function(status) {
                resolve(false);
            });
        });
    };

    this.test = function() {
        function funcLog(data) {
            console.log(data);
        }
        this.songsUrl([1333340512, 1308363066]).then(funcLog);
        this.playlistDetail(4945521505).then(funcLog);
        this.playlistDetail(2659719519).then(funcLog);
        this.songLyric(1333340512).then(funcLog);
        this.songsDetail([1341532699]).then(funcLog);
        this.mvUrl(10847631).then(funcLog);
        this.album(75292754).then(funcLog);
    }
}
let WEAPI = new _WEAPI();
//WEAPI.test();

(function (root) {
    'use strict';
    /*
     * @opentdoor 的跨域下载接口
     */
    function Downloader() {
        // request
        function FileRequest(url, progress, callback) {
            var req = GM__xmlHttpRequest({
                method: 'GET',
                url: url,
                onprogress: function (res) {
                    if (progress) progress(res);
                },
                overrideMimeType: 'text/plain;charset=x-user-defined',
                onreadystatechange: function (res) {
                    if (res.readyState == 4) {
                        if (res.status == 200) {
                            var str = res.response;
                            var ta1 = [
                            ];
                            for (var i = 0; i < str.length; i++) {
                                ta1[i] = str.charCodeAt(i) & 255;
                            }
                            var ua8 = new Uint8Array(ta1);
                            var blob = new Blob([ua8]);
                            callback(blob, res.status);
                        } else {
                            callback(null, res.status);
                        }
                    }
                }
            });
        } //save file

        function SaveFile(blob, filename) {
            if (root.navigator.msSaveBlob) {
                root.navigator.msSaveBlob(blob, filename);
            } else {
                var anchor = root.document.createElement('a');
                var url = root.URL.createObjectURL(blob);
                anchor.download = filename;
                anchor.href = url;
                var evt = root.document.createEvent('MouseEvents');
                evt.initEvent('click', true, true);
                anchor.dispatchEvent(evt);
                root.URL.revokeObjectURL(url);
            }
        } //interface

        function FileDownload(url, filename, downloading, success, error) {
            FileRequest(url, downloading, function (blob, status) {
                if (status == 200) {
                    SaveFile(blob, filename);
                    if (typeof success == 'function') success();
                } else {
                    if (typeof error == 'function') error(status);
                }
            });
        }
        this.FileDownload = FileDownload;
        this.FileRequest = FileRequest;
        var anthorEvents = {
            onprogress: function (res) {
                if (this.anchor.getAttribute('data-res-action') == 'downloadDirect') {
                    if (res.lengthComputable) {
                        this.anchor.querySelector('i').innerText = '下载:' + (res.loaded * 100 / res.total).toFixed(2) + '%';
                    } else {
                        this.anchor.querySelector('i').innerText = '下载:' + anthorEvents.calcLength(res.loaded);
                    }
                } else {
                    if (res.lengthComputable) {
                        this.anchor.innerText = '下载:' + (res.loaded * 100 / res.total).toFixed(2) + '%';
                    } else {
                        this.anchor.innerText = '下载:' + anthorEvents.calcLength(res.loaded);
                    }
                }
            },
            calcLength: function (b) {
                b = Number(b) / 1024;
                if (b < 1024) {
                    return b.toFixed(1) + 'KB';
                }
                b = b / 1024;
                if (b < 1024) {
                    return b.toFixed(2) + 'MB';
                }
                b = b / 1024;
                return b.toFixed(3) + 'GB';
            },
            onsuccess: function () {
                this.anchor.innerHTML = this.Html;
                this.doing = false;
                if (this.anchor.id == 'tmp') {
                    this.anchor.previousElementSibling.remove();
                    this.anchor.remove();
                }
            },
            onerror: function () {
                this.anchor.innerHTML = '下载失败';
                this.handler = setTimeout(function (t) {
                    t.anchor.innerHTML = t.Html;
                    t.doing = false;
                }, 2000, this);
            },
            onAnthorClick: function (e) {
                e = e || event;
                var a = this.anchor;
                var ex = /([\w\s]+)(\.\w)(\?.*)?$/i.exec(a.href || '');
                var name = a.download || a.title;
                if (ex) {
                    if (!name && ex.length > 1) name = ex[1];
                    if (name && name.indexOf('.') == - 1 && ex.length > 2) name += ex[2];
                }
                if (!name || !a.href) return;
                e.preventDefault();
                if (this.doing) return;
                this.doing = true;
                FileDownload(a.href, name, anthorEvents.onprogress.bind(this), anthorEvents.onsuccess.bind(this), anthorEvents.onerror.bind(this));
            }
        };
        //interface
        function BindAnthor(a) {
            var env = {
                Html: a.innerHTML,
                anchor: a
            };
            a.addEventListener('click', anthorEvents.onAnthorClick.bind(env), true);
        }
        this.BindAnthor = BindAnthor;
    }
    var downloader = new Downloader();

    var innerFrame = document.querySelector('iframe');
    var tit, // 标题
        cov, // 封面
        dl, // 下载按钮
        fileName, // 文件名
        mvId = '', // mvID
        allDownloadButton, // 歌单/专辑页的下载按钮
        downloadPics; // 歌单/专辑页的歌曲封面下载按钮

    // api这个东西的调用方先不改，有空再说。内部实现替换成WEAPI。
    var api = {
        detail: function(songIds, callback) {
            WEAPI.songsUrl(songIds).then(function(data) {
                if (data) {
                    let br = data[0].br;
                    let url = data[0].url;
                    innerFrame.contentWindow.document.querySelector('#wyyyydda').setAttribute('data-br', br);
                    innerFrame.contentWindow.document.querySelector('#wyyyydda').src = url;
                }
            });
        },
        media: function (songId, callback, index) {
            WEAPI.songLyric(songId).then(function(data) {
                if (data) {
                    callback(data, index);
                }
            });
        },
        mv: function (mvId, callback) {
            WEAPI.mvUrl(mvId).then(function(data) {
                var brs = [240, 480, 720, 1080];
                for (var i = brs.length - 1; i >= 0; --i) {
                    if (data.brs[brs[i]]) {
                        callback(data.brs[brs[i]], brs[i]);
                        break;
                    }
                }
            });
        },
    };
    var pages = [
        {
            url: 'http://music.163.com/#/song?id=',
            handler: function () {
                var innerFrameDoc = innerFrame.contentWindow.document;
                var albumNode = innerFrameDoc.querySelectorAll('p.des.s-fc4') [1];
                tit = innerFrameDoc.querySelector('.tit');
                cov = innerFrameDoc.querySelector('.u-cover > img');
                dl = innerFrameDoc.querySelector('.u-btni-dl');
                let sfc = tit.parentNode.nextElementSibling.querySelectorAll('.s-fc7');
                let author = '';
                for (let i = 0; i < sfc.length; ++i) {
                    if (author != '') {
                        author += ',';
                    }
                    author += sfc[i].innerText;
                }
                if (g_nameRule == NAMERULE.ARTIST_TITLE) {
                    fileName = author + ' - ' + tit.querySelector('.f-ff2').innerText + '.';
                } else {
                    fileName = tit.querySelector('.f-ff2').innerText + ' - ' + author + '.';
                }
                var parentNode = albumNode.parentNode;
                var songId = location.href.match(/id=([0-9]+)/) [1];
                var mvHref = innerFrameDoc.querySelector('a[title="播放mv"]');
                if(mvHref) {
                    mvId = mvHref.href.split('=')[1];
                }
                var downloadLine = this.createDownloadLine(songId);
                parentNode.insertBefore(downloadLine, albumNode.nextElementSibling);
            },
            createDownloadLine: function (songId) {
                var disableStyle = function (link) {
                    link.text += '(无)';
                    link.style.color = 'gray';
                    link.style.textDecoration = 'none';
                    link.style.cursor = 'auto';
                };
                var mp3Link = this.createMP3Link();
                var lyricLink = this.createLink('歌词');
                var tlyricLink = this.createLink('翻译');
                var coverLink = this.createLink('封面');
                var mp3Help = this.createLink('如何下载歌曲?');
                var showPlayer = this.createLink('歌曲试听');
                let switchDownloadBitrate = this.createLink(g_bitrate > 320000 ? '切换到MP3下载模式' : '切换到无损下载模式(需黑胶VIP)');
                let switchNameRule = this.createLink(g_nameRule == NAMERULE.ARTIST_TITLE ? '命名风格：艺术家-歌曲名' : '命名风格：歌曲名-艺术家');
                mp3Help.addEventListener('click', function () {
                    alert('点击下方的下载按钮之后等待即可。');
                });
                showPlayer.addEventListener('click', function () {
                    var player = innerFrame.contentWindow.document.querySelector('#wyyyydda');
                    player.setAttribute('controls', 'true');
                    player.play();
                });
                showPlayer.id = 'wyyyysp';
                switchDownloadBitrate.addEventListener('click', function() {
                    if (g_bitrate > 320000) {
                        setBitrate(BITRATE.B320);
                    } else {
                        setBitrate(BITRATE.FLAC);
                        alert('请注意，无损下载文件为.flac格式，部分歌曲没有无损格式，且非黑胶VIP无法下载无损。');
                    }
                    location.reload();
                });
                switchNameRule.addEventListener('click', (ev) => {
                    if (g_nameRule == NAMERULE.ARTIST_TITLE) {
                        g_nameRule = NAMERULE.TITLE_ARTIST;
                        ev.srcElement.text = '命名风格：歌曲名-艺术家';
                    } else {
                        g_nameRule = NAMERULE.ARTIST_TITLE;
                        ev.srcElement.text = '命名风格：艺术家-歌曲名';
                    }
                    setNameRule(g_nameRule);
                    location.reload();
                });

                lyricLink.setAttribute('download', fileName + 'lrc');
                tlyricLink.setAttribute('download', fileName + 'lrc');
                coverLink.setAttribute('download', fileName + 'jpg');
                coverLink.href = cov.getAttribute('data-src');
                downloader.BindAnthor(coverLink);
                downloader.BindAnthor(dl);
                dl.href = 'javascript:;';
                dl.setAttribute('data-res-action', 'downloadDirect');
                dl.querySelector('i').innerText = '下载(稍候)';
                api.detail([songId]);
                api.media(songId, function (result) {
                    if (result.lrc && result.lrc.lyric) {
                        lyricLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(result.lrc.lyric);
                    } else {
                        disableStyle(lyricLink);
                    }
                    if (result.tlyric && result.tlyric.lyric) {
                        tlyricLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(result.tlyric.lyric);
                    } else {
                        disableStyle(tlyricLink);
                    }
                });
                var container = this.createLineContainer('下载');
                container.appendChild(lyricLink); // 原文lrc
                container.appendChild(tlyricLink); // 翻译lrc
                container.appendChild(coverLink); // 封面
                if (mvId != '') { // MV下载，没有不显示
                    var el = this.createLink('MV');
                    el.setAttribute('download', fileName + 'mp4');
                    api.mv(mvId, function(result, br) {
                        el.innerHTML += '(' + br + 'P)';
                        el.href = result;
                    });
                    downloader.BindAnthor(el);
                    container.appendChild(el);
                }
                container.appendChild(mp3Help); // 帮助
                container.appendChild(showPlayer); // 试听
                container.appendChild(document.createElement('br'));
                container.appendChild(switchDownloadBitrate);
                container.appendChild(document.createElement('br'));
                container.appendChild(mp3Link); // audio标签
                container.appendChild(switchNameRule);
                return container;
            },
            createLink: function (label) {
                var link = document.createElement('a');
                link.innerHTML = label;
                link.className = 's-fc7';
                link.style.marginRight = '10px';
                link.href = 'javascript:;';
                return link;
            },
            createMP3Link: function () {
                var link = document.createElement('audio');
                link.setAttribute('id', 'wyyyydda');
                link.style.marginTop = '10px';
                link.addEventListener('canplay', function () {
                    dl.href = this.src;
                    if (this.src.indexOf('.flac') != -1) {
                        dl.setAttribute('download', fileName + 'flac');
                    } else {
                        dl.setAttribute('download', fileName + 'mp3');
                    }
                    let br_digit = parseInt(parseInt(innerFrame.contentWindow.document.querySelector('#wyyyydda').getAttribute('data-br')) / 1000);
                    var br = '(' + br_digit + 'K)';
                    if (br_digit > 320) {
                        br = '(无损)';
                    }
                    dl.querySelector('i').innerText = '下载' + br;
                });
                link.addEventListener('error', function () {
                    //alert('无法加载此歌曲。可能此歌曲需要付费或版权受限。');
                    dl.querySelector('i').innerText = '无法下载';
                });
                return link;
            },
            createLineContainer: function (label) {
                var container = document.createElement('p');
                container.className = 'desc s-fc4';
                container.innerHTML = label + '：';
                container.style.margin = '10px 0';
                return container;
            },
        },
        {
            url: [
                'http://music.163.com/#/playlist?id=', // 歌单
                'http://music.163.com/#/artist?id=', // 歌手
                'http://music.163.com/#/discover/toplist', // 榜单
                'http://music.163.com/#/album?id=', // 专辑
                'http://music.163.com/#/discover/recommend/taste' // 每日推荐
            ],
            handler: function () {
                var innerFrameDoc = innerFrame.contentWindow.document;
                allDownloadButton = innerFrameDoc.querySelector('.u-btni-dl');

                var cover = innerFrameDoc.querySelector('.cover>img'); // 封面图片<img>
                var mask = innerFrameDoc.querySelector('.cover>span'); // 封面图片后一个元素，用来加<a></a>
                if (cover && (location.href.indexOf('#/playlist') != -1 || location.href.indexOf('#/album') != -1)) {
                    var title = innerFrameDoc.querySelector('.tit>h2').innerText; // 专辑名称/歌单名称
                    var url = cover.src.split('?')[0]; // 封面的链接
                    mask.outerHTML = '<a download="' + title + '.jpg" href=" ' + url + '">' + mask.outerHTML + '</a>';
                    mask = innerFrameDoc.querySelector('.cover>a');
                    downloader.BindAnthor(mask);

                    let _this = this;
                    allDownloadButton.addEventListener('click', function(e) {
                        if (e.shiftKey) {
                            _this.downloadMusicZip();
                        } else {
                            _this.downloadLyricsZip();
                        }
                    });
                    allDownloadButton.setAttribute('data-res-action', 'downloadLyrics');
                    allDownloadButton.childNodes[0].innerText = '歌词下载';

                    if (location.href.indexOf('#/playlist') != -1) {
                        downloadPics = allDownloadButton.cloneNode(true);
                        downloadPics.addEventListener('click', this.downloadAlbumImageZip);
                        downloadPics.setAttribute('data-res-action', 'downloadLyrics');
                        downloadPics.childNodes[0].innerText = '歌单中歌曲封面下载';
                        downloadPics.title = '点击左侧图片下载歌单封面';
                        allDownloadButton.parentNode.insertBefore(downloadPics, allDownloadButton.nextSibling);
                    }
                }

                var audio = document.createElement('audio');
                audio.setAttribute('id', 'wyyyydda');
                audio.addEventListener('canplay', function () {
                    var a = document.createElement('a');
                    a.setAttribute('href', this.src);
                    if (this.src.indexOf('.flac') != -1) {
                        a.setAttribute('download', this.getAttribute('data-fileName') + '.flac');
                    } else {
                        a.setAttribute('download', this.getAttribute('data-fileName') + '.mp3');
                    }
                    a.setAttribute('id', 'tmp');
                    downloader.BindAnthor(a);
                    var _cele = innerFrameDoc.querySelector('[downloading]');
                    _cele.parentNode.appendChild(document.createElement('br'));
                    _cele.parentNode.appendChild(a);
                    _cele.removeAttribute('downloading');
                    a.click();
                });
                audio.addEventListener('error', function () {
                    alert('无法加载此歌曲。可能此歌曲需要付费或版权受限。');
                });
                innerFrameDoc.querySelector('body').appendChild(audio);

                // 网页版只能加载10首歌曲，处理一下让它显示全部（但是小于1000）
                let rep = this.replaceAction;
                this.showAllPlaylistItems(innerFrameDoc).then(function() {
                    let downloadButtons = innerFrameDoc.querySelectorAll('span.icn-dl');
                    rep(innerFrameDoc, downloadButtons);

                    // 使下载按钮不换行
                    if (location.href.indexOf('/#/artist?id=') != -1) {
                        let table = innerFrameDoc.querySelector('.m-table-1');
                        if (table) {
                            table.className = table.className.replace(/ ?m-table-1/, '');
                        }
                    }
                });
            },
            showAllPlaylistItems: function(doc, song, index) {
                function dtToString(dt) {
                    let h = parseInt(dt / 1000 / 60 / 60);
                    let m = parseInt(dt / 1000 / 60 - h * 60);
                    let s = parseInt(dt / 1000 - h * 60 * 60 - m * 60);

                    let str = '';
                    if (h > 10) str += h + ':';
                    else if (h > 0) str += '0' + h + ':';
                    if (m > 10) str += m + ':';
                    else str += '0' + m + ':';
                    if (s > 10) str += s;
                    else str += '0' + s;

                    return str;
                }
                function fillTemplate(template, song, index) {
                    let tp = template;
                    template = template.cloneNode(true);

                    template.innerHTML = template.innerHTML.replace(/ ?data-res-data="\d+"/, '');
                    let match = template.innerHTML.match(/data-res-id="(\d+)"/);
                    if (match == null) {
                        return;
                    }
                    let id = match[1];
                    template.innerHTML = template.innerHTML.replace(new RegExp(id, 'g'), song.id);
                    template.querySelector('.num').innerText = index + 1;
                    template.className = (index % 2 == 0) ? 'even' : '';
                    let b = template.querySelector('.txt>a>b');
                    b.title = b.innerText = song.name;
                    template.querySelector('.u-dur').innerText = dtToString(song.dt);

                    let texts = template.querySelectorAll('.text');
                    let ar_name = (song.ar && song.ar.length > 0) ? song.ar[0].name : '';
                    let ar_id = (song.ar && song.ar.length > 0) ? song.ar[0].id : '0';
                    texts[0].querySelector('span').title = ar_name;
                    texts[0].querySelector('.text>span').title = ar_name;
                    texts[0].querySelector('.text>span>a').innerText = ar_name;
                    let a1 = texts[0].querySelector('.text>span>a');
                    a1.href = a1.href.replace(/\?id=\d+/, '?id=' + ar_id);
                    template.querySelector('[data-res-action="share"]').setAttribute('data-res-name', song.name);
                    template.querySelector('[data-res-action="share"]').setAttribute('data-res-author', ar_name);

                    let a2 = texts[1].querySelector('a');
                    a2.href = a2.href.replace(/\?id=\d+/, '?id=' + song.al.id);
                    a2.title = song.al.name;
                    a2.innerText = song.al.name;

                    return template;
                }

                return new Promise(function(resolve) {
                    resolve();
                    return;
                    /*let match = location.href.match(/#\/playlist\?id=(\d+)/);
                    let playlist_id = '';
                    if (match) {
                        playlist_id = match[1];
                    }
                    let text = doc.querySelector('#playlist-track-count').innerText;
                    let num = parseInt(text);
                    if (num > 10 && playlist_id != '') {
                        WEAPI.playlistDetail(playlist_id).then(function(data) {
                            let tracks = data.tracks;
                            let template = doc.querySelector('.m-table>tbody>tr');
                            let tbody = doc.querySelector('.m-table>tbody');
                            for (let i = 10; i < 25; ++i) {
                                let tp = fillTemplate(template, tracks[i], i);
                                tbody.append(tp);
                            }
                            doc.querySelector('.m-playlist-see-more>.text').innerText = '查看更多内容，请耐心等待脚本更新(龟速)';
                            resolve();
                        });
                    } else {
                        resolve();
                    }*/
                });
            },
            replaceAction: function (innerFrameDoc, downloadButtons) {
                innerFrame.contentWindow.document.querySelectorAll('.js-dis').forEach(function(ele){
                    ele.className = ele.className.replace('js-dis','');
                    ele.querySelectorAll('b[title]').forEach(function(b){
                        b.style.color='#aeaeae';
                    });
                });
                for (var i = 0; i < downloadButtons.length; i++) {
                    if (downloadButtons[i].getAttribute('data-res-action') == 'download') {
                        downloadButtons[i].setAttribute('data-res-action', 'downloadDirect');
                        downloadButtons[i].addEventListener('click', function () {
                            var id = this.getAttribute('data-res-id');
                            let name = '';
                            if (g_nameRule == NAMERULE.ARTIST_TITLE) {
                                name = this.previousElementSibling.getAttribute('data-res-author') + ' - ' + this.previousElementSibling.getAttribute('data-res-name');
                            } else {
                                name = this.previousElementSibling.getAttribute('data-res-name') + ' - ' + this.previousElementSibling.getAttribute('data-res-author');
                            }
                            innerFrame.contentWindow.document.querySelector('#wyyyydda').setAttribute('data-fileName', name);
                            innerFrame.contentWindow.document.querySelector('#wyyyydda').setAttribute('data-res-id', id);
                            this.setAttribute('downloading','true');
                            api.detail([id], null);
                        });
                    }
                }
            },
            downloadLyricsZip: function(){
                function artistListToString(ar) {
                    let str = '';
                    if (ar == null) {
                        return str;
                    }
                    for (let i = 0; i < ar.length; ++i) {
                        if (str != '') {
                            str += ' & ';
                        }
                        str += ar[i].name;
                    }
                    str = str.trim();
                    return str;
                }
                if (location.href.indexOf('#/playlist') != -1 || location.href.indexOf('#/album') != -1) {
                    let playListId = location.href.split('id=')[1];
                    let isPlayList = location.href.indexOf('#/playlist') != -1;
                    function onComplete(result) {
                        let initialText = allDownloadButton.childNodes[0].innerText;
                        let failedText = '歌词下载失败...';
                        try {
                            if (!result) {
                                return;
                            }
                            var zip = new JSZip();
                            var tracks = isPlayList ? result.tracks : result.songs;
                            let zipFileName = '';
                            if (isPlayList) {
                                zipFileName = result.creator.nickname + ' - ' + result.name;
                            } else {
                                zipFileName = artistListToString(result.album.artists);
                                if (zipFileName != '') {
                                    zipFileName += ' - ';
                                }
                                zipFileName += result.album.name;
                            }
                            zipFileName += ' - 歌词';
                            zipFileName = zipFileName.replace(/[\/:*?"<>|]*/g, '').trim();
                            if (isPlayList) {
                                if (result.description) {
                                    zip.file("歌单简介.txt", result.description.replace(/\n/g, '\r\n'));
                                }
                            } else {
                                if (result.album.description) {
                                    zip.file("专辑简介.txt", result.album.description.replace(/\n/g, '\r\n'));
                                }
                            }
                            zip.file("说明.txt", "lyrics：.lrc格式的滚动歌词\r\nnlyrics：.txt格式的歌词\r\ntlyrics：.lrc格式的翻译后的滚动歌词\r\n\r\n记事本打开可能不换行，请尝试notepad++等软件\r\n\r\n由\"网易云音乐直接下载\"脚本下载。\r\n脚本链接：https://greasyfork.org/zh-CN/scripts/33046"); // 不要删除好不好(✺ω✺)
                            if (isPlayList) {
                                zip.file("歌单链接.url", "[{000214A0-0000-0000-C000-000000000046}]\nProp3=19,2\n[InternetShortcut]\nIDList=\nURL=http://music.163.com/#/playlist?id=" + playListId);
                            } else {
                                zip.file("专辑链接.url", "[{000214A0-0000-0000-C000-000000000046}]\nProp3=19,2\n[InternetShortcut]\nIDList=\nURL=http://music.163.com/#/album?id=" + playListId);
                            }

                            function downloadLyricAsync(index) {
                                let fileName = '';
                                if (g_nameRule == NAMERULE.ARTIST_TITLE) {
                                    fileName = artistListToString(tracks[index].ar);
                                    if (fileName != '') {
                                        fileName += ' - ';
                                    }
                                    fileName += tracks[index].name;
                                } else {
                                    fileName = tracks[index].name;
                                    let artists = artistListToString(tracks[index].ar);
                                    if (artists != '') {
                                        fileName += ' - ';
                                        fileName += artists;
                                    }
                                }

                                // 删除文件中不允许的字符
                                fileName = fileName.replace(/[\/:*?"<>|]*/g, '').trim();

                                allDownloadButton.childNodes[0].innerText = '正在下载：' + index + '/' + tracks.length;
                                function onComplete(data) {
                                    if (data.lrc && data.lrc.lyric) {
                                        // 这句保留两位小数
                                        zip.file('lyrics\\' + fileName + ".lrc", data.lrc.lyric.replace(/\[(\d\d.\d\d.\d\d)\d\]/g, '[$1]'));
                                        // 这句保留原来的格式（原来几位就几位）
                                        //zip.file('lyrics\\' + fileName + ".lrc", result.lrc.lyric);
                                        zip.file('nlyrics\\' + fileName + ".txt", data.lrc.lyric.replace(/\[.*]/g, '')); // :: /\[\d\d:\d\d.\d{2,3}]/g
                                    }
                                    if (data.tlyric && data.tlyric.lyric) {
                                        zip.file('tlyrics\\' + fileName + ".lrc", data.tlyric.lyric.replace(/\[(\d\d.\d\d.\d\d)\d\]/g, '[$1]'));
                                    }
                                    allDownloadButton.childNodes[0].innerText = index + '/' + tracks.length;
                                    if (index == tracks.length - 1) {
                                        zip.generateAsync({type:"blob"})
                                            .then(function(content) {
                                            saveAs(content, zipFileName + ".zip");
                                            allDownloadButton.childNodes[0].innerText = initialText;
                                        });
                                    } else {
                                        downloadLyricAsync(index + 1);
                                    }
                                }

                                api.media(tracks[index].id, onComplete);
                            }

                            downloadLyricAsync(0);
                        } catch(e) {
                            alert(failedText);
                            allDownloadButton.childNodes[0].innerText = initialText;
                        }
                    }
                    if (isPlayList) {
                        WEAPI.playlistDetail(playListId).then(onComplete);
                    } else {
                        WEAPI.album(playListId).then(onComplete);
                    }
                }
            },
            downloadAlbumImageZip: function() {
                function artistListToString(ar) {
                    let str = '';
                    if (ar == null) {
                        return str;
                    }
                    for (let i = 0; i < ar.length; ++i) {
                        if (str != '') {
                            str += ' & ';
                        }
                        str += ar[i].name;
                    }
                    str = str.trim();
                    return str;
                }
                try {
                    if (location.href.indexOf('#/playlist') != -1) {
                        var playListId = location.href.split('id=')[1];
                        let initialText = downloadPics.childNodes[0].innerText;
                        WEAPI.playlistDetail(playListId).then(function (result) {
                            try{
                                if (result == null) {
                                    throw("封面下载失败...");
                                }
                                var zip = new JSZip();
                                if (result.description)
                                    zip.file("歌单介绍.txt", result.description.replace(/\n/g, '\r\n'));
                                zip.file("说明.txt", "由\"网易云音乐直接下载\"脚本下载。\r\n脚本链接：https://greasyfork.org/zh-CN/scripts/33046");
                                zip.file("歌单链接.url", "[{000214A0-0000-0000-C000-000000000046}]\nProp3=19,2\n[InternetShortcut]\nIDList=\nURL=http://music.163.com/#/playlist?id=" + playListId);
                                var tracks = result.tracks;
                                var zipFileName = result.creator.nickname + ' - ' + result.name + ' - 封面';
                                zipFileName = zipFileName.replace(/[\/:*?"<>|]*/g, '').trim();

                                function downloadAlbumImageAsync(index) {
                                    let fileName = '';
                                    if (g_nameRule == NAMERULE.ARTIST_TITLE) {
                                        fileName = artistListToString(result.tracks[index].ar);
                                        if (fileName != '') {
                                            fileName += ' - ';
                                        }
                                        fileName += result.tracks[index].name;
                                    } else {
                                        fileName = result.tracks[index].name;
                                        let artists = artistListToString(result.tracks[index].ar);
                                        if (artists != '') {
                                            fileName += ' - ';
                                            fileName += artists;
                                        }
                                    }
                                    // 删除文件中不允许的字符
                                    fileName = fileName.replace(/[\/:*?"<>|]*/g, '').trim();
                                    let url = tracks[index].al.picUrl;
                                    function onComplete(blob, status) {
                                        downloadPics.childNodes[0].innerText = '正在下载：' + index + '/' + tracks.length;
                                        if (status == 200) {
                                            zip.file('pics\\' + fileName + url.match('\.[a-zA-Z]+$')[0], blob);
                                        }
                                        if (index == tracks.length - 1) {
                                            zip.generateAsync({type:"blob"})
                                                .then(function(content) {
                                                saveAs(content, zipFileName + ".zip");
                                                downloadPics.childNodes[0].innerText = initialText;
                                            });
                                        } else {
                                            downloadAlbumImageAsync(index + 1);
                                        }
                                    }

                                    if (tracks[index].al && url && url != '') {
                                        downloader.FileRequest(url, null, onComplete);
                                    } else {
                                        onComplete(null, 404);
                                    }
                                }

                                downloader.FileRequest(result.coverImgUrl, null, function(blob, status) {
                                    if (status == 200) {
                                        zip.file(result.name + ' - ' + result.creator.nickname + result.coverImgUrl.match('\.[a-zA-Z]+$')[0], blob);
                                    }
                                    downloadAlbumImageAsync(0);
                                    downloadPics.childNodes[0].innerText = '正在下载：0/' + tracks.length;
                                });
                            } catch (e) {
                                alert('封面下载失败...');
                                downloadPics.childNodes[0].innerText = initialText;
                            }
                        });
                    }
                }
                catch(e) {
                    alert('封面下载失败...');
                    downloadPics.childNodes[0].innerText = initialText;
                }
            },
            downloadMusicZip: function() {
                function artistListToString(ar) {
                    let str = '';
                    if (ar == null) {
                        return str;
                    }
                    for (let i = 0; i < ar.length; ++i) {
                        if (str != '') {
                            str += ' & ';
                        }
                        str += ar[i].name;
                    }
                    str = str.trim();
                    return str;
                }
                try {
                    if (location.href.indexOf('#/album') != -1) {
                        var albumId = location.href.split('id=')[1];
                        let initialText = allDownloadButton.childNodes[0].innerText;
                        WEAPI.album(albumId).then(function (result) {
                            try{
                                if (result == null) {
                                    throw("歌曲下载失败...");
                                }
                                var zip = new JSZip();
                                if (result.album.description) {
                                    zip.file("专辑介绍.txt", result.album.description.replace(/\n/g, '\r\n'));
                                }
                                zip.file("说明.txt", "由\"网易云音乐直接下载\"脚本下载。\r\n脚本链接：https://greasyfork.org/zh-CN/scripts/33046");
                                zip.file("专辑链接.url", "[{000214A0-0000-0000-C000-000000000046}]\nProp3=19,2\n[InternetShortcut]\nIDList=\nURL=http://music.163.com/#/album?id=" + albumId);
                                var songs = result.songs;
                                var zipFileName = result.album.artist.name + ' - ' + result.album.name;
                                zipFileName = zipFileName.replace(/[\/:*?"<>|]*/g, '').trim();

                                function downloadSongAsync(index) {
                                    let fileName = '';
                                    if (g_nameRule == NAMERULE.ARTIST_TITLE) {
                                        fileName = artistListToString(songs[index].ar);
                                        if (fileName != '') {
                                            fileName += ' - ';
                                        }
                                        fileName += songs[index].name;
                                    } else {
                                        fileName = songs[index].name;
                                        let artists = artistListToString(songs[index].ar);
                                        if (artists != '') {
                                            fileName += ' - ';
                                            fileName += artists;
                                        }
                                    }
                                    // 删除文件中不允许的字符
                                    fileName = fileName.replace(/[\/:*?"<>|]*/g, '').trim() + songs[index].songExt;
                                    let url = songs[index].songUrl;
                                    function onComplete(blob, status) {
                                        allDownloadButton.childNodes[0].innerText = '正在下载：' + index + '/' + songs.length;
                                        if (status == 200) {
                                            zip.file('songs\\' + fileName, blob);
                                        }
                                        if (index == songs.length - 1) {
                                            zip.generateAsync({type:"blob"})
                                                .then(function(content) {
                                                saveAs(content, zipFileName + ".zip");
                                                allDownloadButton.childNodes[0].innerText = initialText;
                                            });
                                        } else {
                                            downloadSongAsync(index + 1);
                                        }
                                    }

                                    if (url && url != '') {
                                        allDownloadButton.childNodes[0].innerText = '正在下载：0/' + songs.length;
                                        downloader.FileRequest(url, null, onComplete);
                                    } else {
                                        onComplete(null, 404);
                                    }
                                }

                                let array = [];
                                for (let i = 0; i < songs.length; ++i) {
                                    array.push(songs[i].id);
                                }
                                WEAPI.songsUrl(array).then(function(urls) {
                                    for (let i = 0; i < urls.length; ++i) {
                                        for (let j = 0; j < songs.length; ++j) {
                                            if (songs[j].id == urls[i].id) {
                                                songs[j].songUrl = urls[i].url;
                                                songs[j].songExt = '.' + urls[i].type;
                                                break;
                                            }
                                        }
                                    }
                                    downloadSongAsync(0);
                                });
                            } catch (e) {
                                alert('歌曲下载失败...');
                                allDownloadButton.childNodes[0].innerText = initialText;
                            }
                        });
                    }
                }
                catch(e) {
                    alert('歌曲下载失败...');
                    allDownloadButton.childNodes[0].innerText = initialText;
                }
            }
        },
    ];
    function matchPagesURL(href, urls) {
        var ret = false;
        var t = location.href.split('://') [1];
        if (Array.isArray(urls)) {
            urls.forEach(function (ele) {
                if (t.indexOf(ele.split('://') [1]) === 0) {
                    ret = true;
                    return;
                }
            });
        } else {
            if (t.indexOf(urls.split('://') [1]) === 0) {
                ret = true;
            }
        }
        return ret;
    }
    if (innerFrame) {
        innerFrame.addEventListener('load', function () {
            var i,
                page;
            for (i = 0; i < pages.length; i += 1) {
                page = pages[i];
                if (matchPagesURL(location.href, page.url)) {
                    page.handler();
                }
            }
        });
    }
}) (window);