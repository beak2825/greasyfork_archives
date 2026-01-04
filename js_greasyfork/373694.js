// ==UserScript==
// @name         BinB阅读器捕获脚本(v016112)
// @namespace    summer-script
// @version      0.5.1
// @description  用于binb阅读器v016112版本的小说漫画的获取脚本
// @author       summer
// @match        https://r.binb.jp/epm/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/373694/BinB%E9%98%85%E8%AF%BB%E5%99%A8%E6%8D%95%E8%8E%B7%E8%84%9A%E6%9C%AC%28v016112%29.user.js
// @updateURL https://update.greasyfork.org/scripts/373694/BinB%E9%98%85%E8%AF%BB%E5%99%A8%E6%8D%95%E8%8E%B7%E8%84%9A%E6%9C%AC%28v016112%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var api = {
        cid: '',
        token: '',
        key: '',
        contentServer: null,
        tbl: null,
        ttx: null,
        viewMode: 1,
        isdirect: 0,

        init: function(cid, cb) {
            var api = this;
            api.cid = cid;
            api.getTbl(function(tbl) {
                api.tbl = tbl;
                api.getTTX(function(ttx){
                    api.ttx = ttx;
                    cb && cb();
                });
            });
        },

        getImageUrl: function(path) {
            var url = this.contentServer + 'sbcGetImg.php'
            var data = {
                cid: this.cid,
                src: path,
                q: this.key,
                // vm: this.viewMode
            };
            var qs = this.buildQuery(data);
            return url + '?' + qs;
        },

        getTbl: function(cb) {
            if (null !== this.tbl) {
                return this.tbl;
            }
            // var path = 'swsapi/bibGetCntntInfo';
            var path = '/~/bibGetCntntInfo';
            var token = this._getRandKey();
            var api = this;
            var data = {
                cid: this.cid,
                k: token,
                dmytime: (new Date()).getTime()
            };
            this.token = token;
            this.jsonGet(path, data, function(ret) {
                if (!ret || 1 !== parseInt(ret.result)) {
                    cb && cb(false);
                    return;
                }
                var item = ret.items[0];
                api.key = item.p;
                api.contentServer = item.ContentsServer;
                api.viewMode = item.ViewMode;
                api.isdirect = (1 === item.ServerType);
                var tbl = {
                    stbl: api._decodeTbl(api.cid, token, item.stbl),
                    ttbl: api._decodeTbl(api.cid, token, item.ttbl),
                    ctbl: api._decodeTbl(api.cid, token, item.ctbl),
                    ptbl: api._decodeTbl(api.cid, token, item.ptbl),
                };
                cb && cb(tbl);
            });
        },

        getTTX: function(cb) {
            if (null !== this.ttx) {
                return this.ttx;
            }
            var api = this;
            if (null === this.contentServer) {
                this.getTbl(function() {
                    api.getTTX(cb);
                });
                return;
            }
            var path = this.contentServer + 'sbcGetCntnt.php';
            var data = {
                cid: this.cid,
                p: this.key,
                dmytime: (new Date()).getTime()
            };
            this.jsonGet(path, data, function(ret) {
                if (!ret || 1 !== parseInt(ret.result)) {
                    cb && cb(false);
                    return;
                }
                cb(ret.ttx);
            });
        },

        buildQuery: function(obj) {
            var str = [];
            for (var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                }
            }
            return str.join("&");
        },

        jsonGet: function(path, data, cb) {
            if ('function' === typeof(data)) {
                cb = data;
            } else if ('object' === typeof(data)) {
                path += '?' +　this.buildQuery(data);
            } else if ('string') {
                path += data;
            }
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (XMLHttpRequest.DONE === xhr.readyState) {
                    var ret;
                    if (200 === xhr.status) {
                        try {
                            ret = JSON.parse(xhr.responseText);
                        } catch(err) {
                            ret = false;
                        }
                        cb(ret);
                    }
                }
            };
            xhr.open('GET', path);
            xhr.send();
        },

        _getRandKey: function() {
            var cid = this.cid;
            var n = this._getRandomString(16)
                , i = Array(Math.ceil(16 / cid.length) + 1).join(cid)
                , r = i.substr(0, 16)
                , e = i.substr(-16, 16)
                , s = 0
                , u = 0
                , h = 0;
            return n.split("").map(function(t, i) {
                var keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
                return s ^= n.charCodeAt(i),
                u ^= r.charCodeAt(i),
                h ^= e.charCodeAt(i),
                t + keys[s + u + h & 63]
            }).join("")
        },

        _decodeTbl: function(cid, token, data) {
            for (var r = cid + ":" + token, e = 0, s = 0; s < r.length; s++) {
                e += r.charCodeAt(s) << s % 16;
            }
            0 == (e &= 2147483647) && (e = 305419896);
            var u = ""
              , h = e;
            for (s = 0; s < data.length; s++) {
                h = h >>> 1 ^ 1210056708 & -(1 & h);
                var o = (data.charCodeAt(s) - 32 + h) % 94 + 32;
                u += String.fromCharCode(o)
            }
            try {
                return JSON.parse(u)
            } catch (t) {
                return false
            }
        },

        _getRandomString: function(leng, i) {
            var keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
            for (var n = i || keys, r = (n.length, ""), e = 0; e < leng; e++)
                r += n.charAt(Math.floor(Math.random() * n.length));
            return r
        }
    };

    var reader = {
        ptbl: '',
        ctbl: '',
        stbl: '',
        ttbl: '',
        total: 0,
        button: null,
        decoder: null,

        init: function(decoder) {
            this.decoder = decoder;
            return this;
        },

        isSupport: function() {
            var verSupport = ['v016112', '1.6112.5484', '01.6112'];
            var verNow = this.getReaderVer();
            if (!verNow) {
                return false;
            }
            return (-1 !== verSupport.indexOf(verNow.toString()));
        },

        isComicReader: function() {
            if (undefined !== window.CURRENT_VERSION) {
                return false;
            }
            if (undefined !== window.Z6K1XZ) {
                return false;
            }
            return true;
        },

        getFrameUrl: function() {
            if (undefined === window.BINB_READER_URL) {
                return false;
            }
            var base = window.BINB_READER_URL;
            var ver = this.getReaderVer();
            var orgn = location.protocol + '//' + location.hostname + '/';
            cid  = encodeURIComponent(cid);
            ver  = encodeURIComponent(ver);
            orgn = encodeURIComponent(orgn);
            var url = base + '&ver=' + ver + '&cid=' + cid + '&msgorgn=' + orgn;
            return url;
        },

        getCid: function() {
            if (document.getElementById('binb_cid')) {
                return document.getElementById('binb_cid').value;
            } else if (undefined !== this._getUrlParam('cid')) {
                return this._getUrlParam('cid');
            }
            return false;
        },

        getReaderVer: function() {
            return window.CURRENT_VERSION || window.ViewerVersion || '';
        },

        loadImg: function(ttx, cb) {
            var reader = this;
            var queue = ttx;
            if ('string' === typeof(queue)) {
                // TODO decode
                queue = ('comic' === this.mode) ?
                    this.decoder.decodeComicTTX(ttx)
                  : this.decoder.decodeNovelTTX(ttx);
                reader.total = queue.length;
            }
            if (0 === queue.length) {
                return;
            }
            var path = queue.shift();
            var sum = this.total;
            var now = sum - queue.length;

            var img = new Image();
            img.onerror = function() {
                console.log('image['+now+'] load fail, retrying...');
                img.onload = undefined;
                queue.unshift(path);
                setTimeout(function() {
                    reader.loadImg(queue, cb);
                }, 2000);
            };
            img.onload = function() {
                cb(img, path, now, sum);
                reader.loadImg(queue, cb);
            };
            img.src = api.getImageUrl(path);
        },

        draw: function(img, imgPath) {
            var coords = this.decoder.calcCoords(imgPath, img.width, img.height);
            var size = this.decoder.getImgOrgSize(img.width, img.height);
            var cv = document.createElement('canvas');
            cv.width = size.width;
            cv.height = size.height;
            var ctx = cv.getContext('2d');
            for(var i in coords) {
                ctx.drawImage(
                    img,
                    coords[i].xsrc,
                    coords[i].ysrc,
                    coords[i].width,
                    coords[i].height,
                    coords[i].xdest,
                    coords[i].ydest,
                    coords[i].width,
                    coords[i].height
                );
            }
            return cv;
        },

        download: function(canvas, filename) {
            canvas.toBlob(function(blob) {
                var url = URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.download = filename;
                a.href = url;
                a.click();
            });
        },

        _getUrlParam: function(key) {
            var search = location.search.substring(1);
            var obj = search.split("&").reduce(function(prev, curr) {
                var p = curr.split("=");
                if (undefined === p[1]) {
                    p[1] = '';
                }
                prev[decodeURIComponent(p[0])] = decodeURIComponent(p[1]);
                return prev;
            }, {});
            return obj[key];
        }
    };

    var decoder = {
        init: function(tbl) {
            if (!tbl.ptbl || !tbl.ctbl || !tbl.stbl || !tbl.ttbl) {
                return false;
            }
            this.ptbl = tbl.ptbl;
            this.ctbl = tbl.ctbl;
            this.stbl = tbl.stbl;
            this.ttbl = tbl.ttbl;
            return true;
        },

        calcCoords: function(imgPath, width, height) {
            this._decodeTbl(imgPath);
            var t = {width: width, height, height};
            if (null === this.jt)
                return false;
            if (!this._valiImgSize(t)) {
                return [{
                    xsrc: 0,
                    ysrc: 0,
                    width: t.width,
                    height: t.height,
                    xdest: 0,
                    ydest: 0
                }];
            }
            var i = t.width - 2 * this.A * this.Et,
            n = t.height - 2 * this.I * this.Et,
            r = Math.floor((i + this.A - 1) / this.A),
            e = i - (this.A - 1) * r,
            s = Math.floor((n + this.I - 1) / this.I),
            u = n - (this.I - 1) * s,
            h = [];
            for (var o = 0; o < this.A * this.I; ++o) {
                var a = o % this.A
                  , c = Math.floor(o / this.A)
                  , f = this.Et + a * (r + 2 * this.Et) + (this.Tt[c] < a ? e - r : 0)
                  , l = this.Et + c * (s + 2 * this.Et) + (this.Pt[a] < c ? u - s : 0)
                  , v = this.jt[o] % this.A
                  , d = Math.floor(this.jt[o] / this.A)
                  , p = v * r + (this.It[d] < v ? e - r : 0)
                  , g = d * s + (this.St[v] < d ? u - s : 0)
                  , b = this.Tt[c] === a ? e : r
                  , m = this.Pt[a] === c ? u : s;
                0 < i && 0 < n && h.push({
                    xsrc: f,
                    ysrc: l,
                    width: b,
                    height: m,
                    xdest: p,
                    ydest: g
                })
            }
            return h
        },

        decodeComicTTX: function(ttx) {
            var start = ttx.indexOf('t-case') - 1;
            var end = ttx.indexOf('/t-case') + 8;
            var ttxContent = ttx.substring(start, end);
            var imgttx = ttxContent.match(/<t-img.+?>/g);
            var content = [];
            for (var i = 0; i < imgttx.length; i++) {
                var src = /src="(.+?)"/.exec(imgttx[i])[1];
                content.push(src);
            }
            return content;
        },

        decodeNovelTTX: function(ttx) {
            var imgttx = ttx.match(/<t-img.+?>/g);
            var content = [];
            for (var i = 0; i < imgttx.length; i++) {
                var src = /src="(.+?)"/.exec(imgttx[i])[1];
                content.push(src);
            }
            return this._arrUnique(content);
        },

        getImgOrgSize: function(width, height) {
            var t = {width: width, height: height};
            return this._valiImgSize(t) ? {
                width: t.width - 2 * this.A * this.Et,
                height: t.height - 2 * this.I * this.Et
            } : t;
        },

        _decodeTbl: function (imgPath) {
            var i = [0, 0];
            if (imgPath) {
                for (var n = imgPath.lastIndexOf("/") + 1, r = imgPath.length - n, e = 0; e < r; e++)
                    i[e % 2] += imgPath.charCodeAt(e + n);
                i[0] %= 8,
                i[1] %= 8
            }
            var t = this.ctbl[i[1]];
            i = this.ptbl[i[0]];
            n = t.match(/^=([0-9]+)-([0-9]+)([-+])([0-9]+)-([-_0-9A-Za-z]+)$/)
              , r = i.match(/^=([0-9]+)-([0-9]+)([-+])([0-9]+)-([-_0-9A-Za-z]+)$/);
            this.jt = null;
            this.A  = parseInt(n[1], 10);
            this.I  = parseInt(n[2], 10);
            this.Et = parseInt(n[4], 10);
            if (null !== n
             && null !== r
             && n[1] === r[1]
             && n[2] === r[2]
             && n[4] === r[4]
             && "+" === n[3]
             && "-" === r[3]
             && (!(8 < this.A || 8 < this.I || 64 < this.A * this.I))) {
                e = this.A + this.I + this.A * this.I;
                if (n[5].length === e && r[5].length === e) {
                    var s = this._decodeTblKey(n[5])
                      , u = this._decodeTblKey(r[5]);
                    this.It = s.n,
                    this.St = s.t,
                    this.Tt = u.n,
                    this.Pt = u.t,
                    this.jt = [];
                    for (var h = 0; h < this.A * this.I; h++)
                        this.jt.push(s.p[u.p[h]])
                }
            }
        },

        _decodeTblKey: function(t) {
            var key = [
                -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
                -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1,
                52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
                -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14,
                15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, 63,
                -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
                41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1
            ];
            var i, n = [], r = [], e = [];
            for (i = 0; i < this.A; i++)
                n.push(key[t.charCodeAt(i)]);
            for (i = 0; i < this.I; i++)
                r.push(key[t.charCodeAt(this.A + i)]);
            for (i = 0; i < this.A * this.I; i++)
                e.push(key[t.charCodeAt(this.A + this.I + i)]);
            return { t: n, n: r, p: e }
        },

        _valiImgSize: function(t) {
            var i = 2 * this.A * this.Et
              , n = 2 * this.I * this.Et;
            return t.width >= 64 + i && t.height >= 64 + n && t.width * t.height >= (320 + i) * (320 + n)
        },

        _arrUnique: function(arr) {
            var val;
            var map = {};
            var output = [];
            for (var i = 0; i < arr.length; i++) {
                val = arr[i];
                if (undefined === map[val]) {
                    map[val] = true;
                    output.push(val);
                }
            }
            return output;
        }
    };

    var screenshoter = {
        counter: 0,
        hook: null,

        init: function() {
            var func = window.ZXA0CC;
            var sser = this;
            this.counter = 0;
            window.ZXA0CC = function() {
                func();
                var cvid = window.Z9C0HY[window.Z7K02M];
                var cv1 = document.getElementById(cvid);
                sser.counter++;
                sser.hook && sser.hook(cv1, sser.counter);
            };
            return this;
        },

        catch: function(cb) {
            this.hook = cb;
        },

        reset: function() {
            window.Z5H0CK(0, false);
        },

        next: function() {
            window.ZKT0I2();
        },

        ending: function() {
            var clast = window.ZHL0PP.ZI50JA() - 1;
            var last1 = !(window.ZQH0T9 < clast);
            var last2_1 = window.ZQH0T9 == clast;
            var last2_2 = false === window.ZHL0PP.Z060JL();
            var last2 = !(last2_1 && last2_2);
            return last1 && last2;
        }
    };

    var btn = {
        button: [],
        wrap: null,

        init: function() {
            this._createWrap();
            return this;
        },

        add: function(text) {
            var btn = this._createBtn();
            btn.innerText = text;
            this.button.push(btn);
            return new this._instance(btn);
        },

        _instance: function(btn) {
            this.button = btn;
            this.tip = function(text, add) {
                if (add) {
                    text = this.button.innerText + text;
                }
                this.button.innerText = text;
                return this;
            };
            this.disable = function() {
                this.button.disabled = true;
                return this;
            };
            this.enable = function() {
                this.button.disabled = true;
                return this;
            };
            this.hide = function() {
                this.button.style.display = 'none';
                return this;
            };
            this.show = function() {
                this.button.style.display = 'block';
                return this;
            };
            this.onclick = function(cb) {
                var thisBtn = this;
                this.button.addEventListener('click', function() {
                    cb(thisBtn)
                });
                return this;
            };
        },

        _createWrap: function() {
            var wrap = document.createElement('div');
            wrap.style.top = '6px';
            wrap.style.right = '8px';
            wrap.style.zIndex = '302';
            wrap.style.position = 'fixed';
            document.body.appendChild(wrap);
            this.wrap = wrap;
        },

        _createBtn: function() {
            var btn = document.createElement('button');
            btn.style.marginLeft = '8px';
            btn.style.padding = '8px';
            btn.style.background = '#fff';
            btn.style.border = '1px solid #aaa';
            btn.style.borderRadius = '4px';
            btn.style.minWidth = '112px';
            btn.style.color = '#000';
            btn.style.float = 'right'
            this.wrap.appendChild(btn);
            return btn;
        }
    };


    reader.init(decoder);
    btn.init();
    var btn1 = btn.add('正在初始化...');
    var btn2 = btn.add('正在初始化...');
    btn2.hide();
    var cid = reader.getCid();
    if (!cid) {
        btn1.tip('脚本暂不支持当前作品');
        return;
    }
    var jump = reader.getFrameUrl();
    if (jump) {
        btn1.tip('正在跳转...');
        window.location.href = jump;
        return;
    }

    api.init(cid, function() {
        var tbl = api.getTbl();
        var init_d = decoder.init(tbl);
        if (!init_d) {
            btn1.tip('初始化失败');
            return;
        }
        if (!reader.isSupport()) {
            btn.add('(脚本暂不支持当前作品, 无法保证能正常运行)');
        }
        if (reader.isComicReader()) {
            btn1.tip('开始捕获');
        } else {
            btn1.tip('提取插图');
            btn2.tip('自动截图').show();
        }
        btn1.onclick(_getFromTTX);
        btn2.onclick(_getFromCanvas);
    });

    function _getFromTTX(btn) {
        btn.disable();
        btn.tip('正在运行...');
        var ttx = api.getTTX();
        reader.loadImg(ttx, function(img, path, now, sum) {
            var canvas = reader.draw(img, path);
            var prefix = document.title;
            var filename = prefix + '-img-' + now + '.png';
            reader.download(canvas, filename);
            btn.tip('正在运行...('+now+'/'+sum+')');
            if (now >= sum) {
                btn.tip('运行完毕');
            }
        });
    }

    function _getFromCanvas(btn) {
        btn.disable();
        btn.tip('正在运行...');
        screenshoter.init();
        screenshoter.catch(function(canvas, now) {
            btn.tip('正在运行...(第'+now+'页)');
            var prefix = document.title;
            var filename = prefix + '-screenshot-' + now + '.png';
            reader.download(canvas, filename);
            if (screenshoter.ending()) {
                btn.tip('截图完毕');
                return;
            }
            screenshoter.next();
        });
        screenshoter.reset();
    }
})();