// ==UserScript==
// @name         melonbooks图源获取
// @namespace    summer-script
// @version      0.6
// @description  melonbooks阅读器图源自动下载
// @author       summer
// @match        https://www.melonbooks.co.jp/viewer/*
// @match        https://www.melonbooks.co.jp/fromagee/viewer/*
// @icon         https://www.melonbooks.co.jp/favicon.ico
// @license      GPL-3.0
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @connect      cloudfront.net
// @downloadURL https://update.greasyfork.org/scripts/451517/melonbooks%E5%9B%BE%E6%BA%90%E8%8E%B7%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/451517/melonbooks%E5%9B%BE%E6%BA%90%E8%8E%B7%E5%8F%96.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 界面按钮
    var ui = {
        btn: null,
        appendStartBtn: function () {
            var btn = document.createElement('button');
            btn.innerText = '下载图源';
            btn.style.position = 'fixed';
            btn.style.top = '20px';
            btn.style.right = '20px';
            btn.style.zIndex = '10001';
            btn.style.padding = '8px';
            btn.style.background = '#fff';
            btn.style.border = '1px solid #aaa';
            btn.style.borderRadius = '4px';
            btn.style.minWidth = '112px';
            btn.style.color = '#000';
            document.body.appendChild(btn);
            this.btn = btn;
        },
        btnClick: function (callback) {
            var btn = this.btn;
            btn.onclick = function () {
                callback(btn);
            };
        },
        updateBtnText: function (text) {
            this.btn.innerText = text;
        }
    };

    // 加载图像, 获取书籍相关参数
    var loader = {
        checkValidity: function () {
            if (!unsafeWindow.GUARDIAN_SERVER) {
                return false;
            }
            if (!unsafeWindow.book_data) {
                return false;
            }
            if (!unsafeWindow.pages_data) {
                return false;
            }
            if (!unsafeWindow.pages_data.keys) {
                return false;
            }

            return true;
        },
        checkVersion: function () {
            var verSupport = [0, 3, 4, 5];
            var bookData = pageUtil.getBookData();
            var verCurrent = bookData.version;
            if (!verCurrent) {
                verCurrent = 0;
            }
            return verSupport.includes(verCurrent);
        },
        getPageKey: function (page) {
            return unsafeWindow.pages_data.keys[page - 1];
        },
        getMaxPage: function () {
            return pageUtil.getBookData().page_count;
        },
        getBookName: function () {
            var bookName = pageUtil.getBookData().title;
            if (!bookName) {
                bookName = document.title;
            }

            return bookName;
        },
        loadPage: function (page, callback) {
            var img = new Image();
            var imgKey = this.getPageKey(page);
            if (callback) {
                img.onload = function () {
                    callback(img, imgKey);
                };
            }
            imgUrlUtil.getImageUrl(page).then(function (imgSrc) {
                // console.log(imgSrc);
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: imgSrc,
                    responseType: 'blob',
                    onload: function (resp) {
                        fileDecryptor.decrypt(resp.response, imgKey).then(function (fileBlob) {
                            img.src = URL.createObjectURL(fileBlob);
                        });
                    }
                });
            });
        }
    };

    // 绘制并下载正确的图像
    var render = {
        canvas: null,
        ctx: null,
        drawImage: function (img, coorArr) {
            var canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            var ctx = canvas.getContext('2d');
            this.drawOrigin(ctx, img, coorArr);
            URL.revokeObjectURL(img.src);
            this.canvas = canvas;
            this.ctx = ctx;
        },
        downloadImage: function (filename) {
            if (!this.canvas) {
                return;
            }
            var fullname = filename + '.png';
            this.canvas.toBlob(function (blob) {
                if (!blob) {
                    console.log("blob null");
                    return;
                }
                var blobURL = URL.createObjectURL(blob);
                GM_download({
                    name: fullname,
                    url: blobURL,
                    onload: function () {
                        URL.revokeObjectURL(blobURL);
                    },
                });
            });
        },
        drawOrigin: function (ctx, img, coorArr) {
            var blockEachLine = Math.floor(img.naturalWidth / 96);
            ctx.drawImage(img, 0, 0);
            for (var i = 0; i < coorArr.length; i++) {
                var dstX = Math.floor(coorArr[i] % blockEachLine) * 96;
                var dstY = Math.floor(coorArr[i] / blockEachLine) * 128;
                var srcX = Math.floor(i % blockEachLine) * 96;
                var srcY = Math.floor(i / blockEachLine) * 128;
                ctx.drawImage(img, srcX, srcY, 96, 128, dstX, dstY, 96, 128);
            }
        }
    };

    // 原网页复制过来的洗牌方法
    // 每页对应一个key, key作为随机种子还原真实顺序
    var randomizer = {
        PARAM_A: 1103515245,
        PARAM_B: 12345,
        RAND_MAX: 32767,

        init: function (e) {
            this.next = this._str_to_int(e);
        },
        rand: function (t) {
            var n;
            return null != t ? (n = t + 1,
                Math.floor(this._next_int() / (Math.floor(this.RAND_MAX / n) + 1))) : this._next_int();
        },
        shuffle: function (e) {
            var t, n, i, r, o, s;
            o = [].concat(e);
            r = o.length;
            for (t = i = 0; 0 <= r ? i < r : i > r; t = 0 <= r ? ++i : --i)
                n = this.rand(o.length - 1),
                s = o[n],
                o[n] = o[t],
                o[t] = s;
            return o;
        },
        _next_int: function () {
            this.next = (this.next * this.PARAM_A + this.PARAM_B) % (this.RAND_MAX + 1);
            return this.next;
        },
        _str_to_int: function (e) {
            var t, n, i, r, o, s;
            if (s = 0,
                null != e)
                for (t = e.split(""); t.length > 0;)
                    n = t.shift(),
                    i = t.shift(),
                    r = n.charCodeAt(0),
                    o = 0,
                    i && (o = i.charCodeAt(0)),
                    s += r << 8 | o;
            return s;
        },
        getImgCoorArr: function (img) {
            var o = Math.floor(img.naturalWidth / 96);
            var s = Math.floor(img.naturalHeight / 128);
            var r = [];

            for (var l = 0; l < o * s; ++l) {
                r.push(l);
            }

            return this.shuffle(r);
        }
    };

    var imgUrlUtil = {
        getImageUrl: async function (page) {
            var bookData = pageUtil.getBookData();
            var imgExt = this.getFileExt();
            var urlPath = await this.getImageUrlPath(page);
            var url = unsafeWindow.GUARDIAN_SERVER + '/';
            url += bookData.s3_key;
            url += urlPath + '.' + imgExt;

            return url;
        },
        getFileExt: function () {
            var bookData = pageUtil.getBookData();
            var imgExt = 'jpg';
            if (bookData.image_extension) {
                imgExt = bookData.image_extension;
            }

            return imgExt;
        },
        getImageUrlPath: async function (page) {
            var bookData = pageUtil.getBookData();
            var path = page;
            if (bookData.page_salt) {
                path = await this.fileHashName(bookData.page_salt, page);
            }
            return path;
        },
        fileHashName: async function (e, n) {
            // e => salt
            // n => page index
            const t = new TextEncoder;
            n = t.encode(n),
            e = t.encode(e),
            e = await crypto.subtle.importKey("raw", e, {
                name: "HMAC",
                hash: {
                    name: "SHA-256"
                }
            }, !1, ["sign"]),
            e = await crypto.subtle.sign("HMAC", e, n);
            {
                n = e;
                let t = "";
                var i = new Uint8Array(n)
                  , o = i.byteLength;
                for (let e = 0; e < o; e++)
                    t += String.fromCharCode(i[e]);
                return btoa(t).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
            }
        }
    };

    var pageUtil = {
        bookData: null,
        getScript: function () {
            var script = null;
            document.body.querySelectorAll("script").forEach(function (dom) {
                if (!script && dom.innerHTML.includes('GUARDIAN_SERVER')) {
                    script = dom.innerHTML;
                }
            });

            return script;
        },
        getBookData: function () {
            if (this.bookData) {
                return this.bookData;
            }
            var script = this.getScript();
            var reg = /book_data\s*=\s*(\{.+?\});/;
            var match = reg.exec(script);
            if (!match) {
                return unsafeWindow.book_data;
            }
            var bookData = JSON.parse(match[1]);
            if (
                bookData.s3_key &&
                bookData.s3_key[bookData.s3_key.length - 1] !== "/"
            ) {
                bookData.s3_key += "/";
            }
            this.bookData = bookData;

            return this.bookData;
        }
    };

    var fileDecryptor = {
        aesKey: null,
        decrypt: async function (fileBlob, pageKey) {
            var bookData = pageUtil.getBookData();
            if (this.isEncrypted()) {
                var aesKeyEncrypt = bookData.crypto.data.web;
                fileBlob = await this.aesDecrypt(fileBlob, aesKeyEncrypt, pageKey);
            }
            return fileBlob;
        },
        aesDecrypt: async function (fileBlob, aesKeyEncrypt, pageKey) {
            var pageKeyArr = (new TextEncoder()).encode(pageKey);
            var aesKey = await this.decryptAesKey(aesKeyEncrypt);
            var aesKeyHash = await this.hmacSha256(aesKey, pageKeyArr);
            var aesKeyC = await window.crypto.subtle.importKey("raw", aesKeyHash, {
                name: "AES-CTR",
                length: 256
            }, false, ["decrypt"]);
            var counter = await fileBlob.slice(16, 32).arrayBuffer();
            var fileDataBlob = await fileBlob.slice(32).arrayBuffer();
            var fileDataDecrypt = await window.crypto.subtle.decrypt({
                name: "AES-CTR",
                counter: counter,
                length: 128
            }, aesKeyC, fileDataBlob);
            return new Blob([fileDataDecrypt], {
                type: this.getFileMimeType()
            });
        },
        decryptAesKey: async function (cipherText64) {
            if (this.aesKey) {
                return this.aesKey;
            }
            var rsaKey = 'MIIJQgIBADANBgkqhkiG9w0BAQEFAASCCSwwggkoAgEAAoICA'
                       + 'QCy66NYR5lCYGB/bztf+l6V+lZWABTY0sHpWkAway66OKeBm8'
                       + '+yubPSMDtyvu0xCM+WsZz8a35EEOsm1BvQquIWm26pUtQofNX'
                       + 'cwOQg9yIhZDiii51dzrVKjBMOQwu6ANpwJT/7y241fEfYpzwg'
                       + 'HycYPvVjp52PIFsBP68SjABuht+jnfVUhYWb8XhmnznJc8tG/'
                       + 'PArhj0UHOX8TiA/4KkAZ2icnAkO5nSBqTSxBzgJfvdZuKtOdH'
                       + '5LWXmrhkfKljmk0SbzjWloZXr1c2UmUxA0Tl/PkVrfCu5MbN1'
                       + 'u+TWLyJysVj7YtcytnOONg3BYI/icW0pfk/u+kH7Olkp5UaQI'
                       + 'duWQuy7DY/Wa2j54PE/AwWmpigDcT2lEOBj6HJv7tWhh0NLTe'
                       + 'vOt/VFoAtfmdVRkDiKtQXGvLQ2WSGfydOrBzEghAO2iPJA2C+'
                       + 'u8LkEsee2A4OOVoSvW+YujpkjflEM1NY0OI0SbtvQEjUCoqKN'
                       + 'a6n6ynyx0i1+n3fWMYk86wGFUEBaCgNsY8tZaCMPrKZdvBFgG'
                       + 'gFLZSRBwBWTs9UUtaO/jTskqgQboAJoT7EucuyEePrYc5t+66'
                       + 'NUEajFLqsyMlVedG8nT/wxtAsfDShNDeFXfJ8uaRulMRZCK6E'
                       + 'GVuYY2lts6aQ7AQ5Y6bdb36uN4YjR3qzfHnk1oI8iSCzqjGwI'
                       + 'DAQABAoICAB6qA/S9UKbvnZo5lhN89Xj+zo0utmPyuwkjTpz9'
                       + 'waRo0UyFR7N54DfFzGp+Dmi4+dr51c3tHlbMD4E4GQxKPTVir'
                       + 'jSW3YWS35RV+sMrl83hP1OcWfwZ0ThViW6ITxoxyz4tJCojU2'
                       + 'AXTLj08HkQ3cJqB+RsdbRx9ybfo0GqfOh0dR+1krZJq/xuBh'
                       + 'SQdXbxQYWJFCBhgVZRHZmASkaoWk6XanZsx6CmHpGaTk2Izz'
                       + 'HRcNMPs0xe6sY/L3sWKHewB3EX53UWZ1pdChXHES7gTYapaA'
                       + 'JLByfy16SBg/HhBCxQ1YkzvtGlVs7qdJVsUXTJtXIWs0huNF'
                       + 'cUrKb7Wwgv1czTWrdekxx/0oOi91pH37nhfcOgYxYFZSoGtv'
                       + 'QpylhVBhcgKy7xvhHq4zDl6vOjvuDaeSiLEtha4wIwavjBTi'
                       + 'rSUosGUtplvuILZt+EiP9ynEyoZa+1C6LrJ2X9bO+K8cpxYh'
                       + 'WWGHtwm7scICovNwvO3lciOE60LW/wgL9ZnGuCuq06QuCh2S'
                       + 'kIZpTIlJuxVsgAP9vZjgLgUAh+fFZ/sTV6K/34baTsGKavPC'
                       + 'Qo4GWADxqLlGROdFXPbApDsiSbUfQZlkjquh1Cjzuzm0cno/'
                       + '5WY15kTX4Vj+u2/UMSwx8Bc4in8nwa750csFt7+uihrbxhcD'
                       + 'ZwO1AeW9vQt7aSgl0BAoIBAQD5dv4JXmpUXvjTkx+h26YdHZ'
                       + 'I9mFKd9s+rX4KvaQQrCkcqgChmFleiM81LlM+Wn5vm39pI7W'
                       + '/JZ08blA6F5eFRvYQvBu1kHU+ubZLRqna4DzcXaPWo3T8B+9'
                       + '7J1knH7axief0YoksD6eoTMqvqq4CVsWok7KG0Hs/7/Q8oID'
                       + 'lt4IiMYZtZmuEgPeEGSVpsDmWRp9VshljiQigOvAnu3TNrSf'
                       + 'OpFzPFIUzJ3Mpo0kiFJsljfSJolozBb7zHQGUcjBlyDVkQOZ'
                       + 'kcxhLOm+Nvh3imDGdKhRjm22szGjg6+g0LOfH3qxKcaJ1dl7'
                       + 'fBsvXY8AsEUCQCCSiVOjl2hB293tjVAoIBAQC3m4xIjKGQVx'
                       + 'ng24us0uD+7SjYSh++r15mC//MDENoH9U4I6VRGoTUb2MT+8'
                       + 'KpCr1dXnhvgUCI86e8NWnacIsiWc6T9Iwrv02yn3Zphdgi99'
                       + 'T8HXLe4tVxIISRn4JKevkSPfBmNfj4h0iccQjKVsf2fDBlec'
                       + 'kTJcOCC9H1uLwNzb3ot+/MOWfsfwKCoR+Ob6lhATzloBfHYK'
                       + '29qSNMP2FMYklBgp3lhl0KL1osk/yt2aJJvhYkvoHxYcbpxP'
                       + 'NghKgd8q/3EpnGRmRZktTY1VHg1cIVKgGrljzP4yFyD7Lg7f'
                       + 'PEftUT249KVjXPXkAkZ2/wNAKxh5fi4ELP1LLK94QvAoIBAE'
                       + 'DlhLa5Oh4SytZ3ip4XvwIKBFZDvxJa97FUWnH5dt0fgl37Ew'
                       + 'djvo5yvXBxGQPNJ8iK6YVZR2B0oK7C+Hg60j/qdm2pdq45td'
                       + 'XhqXUjzFiblLBhXK7+R3rjpBSLy4vYN6UyqPX0mmE9Q+iUoQ'
                       + 'aecQgALGXIrVRnQ6IBNiUxJN+BruQeLETGNtSlZFm3UW+U2z'
                       + 'VmHO5rkMnjffo/TrI2Fz9M8LdHUu9wd0J4TquwMK965J8eGY'
                       + 'ptx9Y2lDydcvBXPfNep5HB+iPzH0diZGtKKcfAqEpJj63W3O'
                       + '9hXclx7VzDSUAt39ySloWXh3U7chtqbuNDWeqxqT4Q9IvxWK'
                       + '9hPrUCggEBAKYoyYp6YlgKyyuX485yRRXPMFCUvCfH8ujs4Q'
                       + 'Aa9QGNFVupvpkoI59QclyKUT7Drl2J+foHAY0u29RSjkoV4Y'
                       + 'Qju/Rfsl6A0OLetr2GV/RFTmUejW8x3rFzGSXkMXgP08nzbd'
                       + 'RB8d+QJmEVVjwuzuW8u9uJnDOM0GKnKcpy9RSU5dFubD/oj6'
                       + 'kRxAbNo442dRWJlj/EYuCXGIR0RbJiBT6oD92ORDCMKTTnZ3'
                       + 'bCMkBunRSZRtbX5Sa6MtYp24q0YqQ/lYlGNw2ddIEvhRn56x'
                       + 'BKwkp+6mYLH1uPFBxyIpK2JQ3lLhW7c/B1Fltk0y1ewomht/'
                       + 'JLYGP8Sdplhaxy1RcCggEADPWAt8alVeV1aUYYD2xMfjwO3V'
                       + 'D6fDp5s//tXtJtnfXOiE9eQ70XYks4MlrOgR5vKqmPWREdVu'
                       + '+2wIT9VNUzBixPZecSVuk4JhH11saTxql+4Q6pb7rii4tocS'
                       + 'pzQg5p+bqXgiCjICLZsYXb0A4f5LswWB+APVQOTyN3k7NEfP'
                       + 'MXZq2VDuNWuP9+df097625iAAY9B05X06emTySzKPr7oA4Fd'
                       + 'ui6GbzdZmuKoXDgBCo4mDtJ5zMqqa22pmMTHb1kTNpIGlILM'
                       + 'Pg3/7Q42gvtqsXFWeJQmbRoiMakrTURt1y+n+br4vjUSubFc'
                       + 'Qi5Wa3DymTfNsvcXVG+/n3OOEIoQ==';
            var pk = await window.crypto.subtle.importKey(
                "pkcs8",
                this.base64ToUint8(rsaKey),
                { name: "RSA-OAEP", hash: { name: "SHA-256" } },
                false,
                ["decrypt"]
            );
            this.aesKey = await window.crypto.subtle.decrypt(
                { name: "RSA-OAEP" },
                pk,
                this.base64ToUint8(cipherText64)
            );

            return this.aesKey;
        },
        base64ToUint8: function (n) {
            const t = window.atob(n);
            var r = t.length;
            const e = new Uint8Array(r);
            for (let n = 0; n < r; n++) {
                e[n] = t.charCodeAt(n);
            }
            return e.buffer;
        },
        hmacSha256: async function (key, data) {
            var keyC = await crypto.subtle.importKey("raw", key, {
                name: "HMAC",
                hash: { name: "SHA-256" }
            }, false, ["sign"]);
            return crypto.subtle.sign("HMAC", keyC, data);
        },
        getFileMimeType: function () {
            var mimeType = 'image/jpeg';
            var bookData = pageUtil.getBookData();
            if (bookData.image_mime_type) {
                mimeType = bookData.image_mime_type
            }
            return mimeType;
        },
        isEncrypted: function () {
            var bookData = pageUtil.getBookData();
            return bookData.crypto && bookData.crypto.type === 1;
        }
    };

    var downloader = {
        downloadImg: function (img, imgKey, fileName) {
            if (fileDecryptor.isEncrypted()) {
                var blobURL = img.src;
                var fullname = fileName + '.' + this.getFileExtByMimeType();
                // v5版本文件加密但是不打乱
                GM_download({
                    name: fullname,
                    url: blobURL,
                    onload: function () {
                        URL.revokeObjectURL(blobURL);
                    },
                });
            } else {
                randomizer.init(imgKey);
                var imgCoor = randomizer.getImgCoorArr(img);
                render.drawImage(img, imgCoor);
                render.downloadImage(fileName);
            }
        },
        getFileExtByMimeType: function () {
            var bookData = pageUtil.getBookData();
            var ext = 'png';
            var map = {
                'image/png': 'png',
                'image/jpeg': 'jpg',
                'image/gif': 'gif',
            };
            var mimeType = bookData.image_mime_type;
            if (mimeType && map[mimeType]) {
                ext = map[mimeType]
            }
            return ext;
        }
    };

    ui.appendStartBtn();

    if (!loader.checkVersion()) {
        ui.updateBtnText('暂不支持此作品, 点击尝试运行');
    }
    ui.btnClick(function (btn) {
        btn.disabled = true;
        if (!loader.checkValidity()) {
            alert('脚本已失效');
            return;
        }
        taskRun();
    });

    // 顺序处理
    function taskRun(pageNow) {
        if (!pageNow) {
            pageNow = 1;
        }
        var pageMax = loader.getMaxPage();
        var fileNo = pageNow.toString().padStart(pageMax.toString().length, '0');
        var fileName = loader.getBookName() + '_' + fileNo;

        if (pageNow > pageMax) {
            ui.updateBtnText('下载完毕');
            return;
        }
        ui.updateBtnText('下载中: ' + pageNow + '/' + pageMax);
        loader.loadPage(pageNow, function (img, imgKey) {
            downloader.downloadImg(img, imgKey, fileName);
            pageNow++;
            // 防止请求过快延迟1秒
            setTimeout(function () {
                taskRun(pageNow);
            }, 1000);
        });
    }
})();