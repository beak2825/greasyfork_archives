// ==UserScript==
// @name           Pixiv鼠標預覽
// @namespace Pixiv鼠標預覽
// @version        2.0.12
// @description 滑鼠移入縮圖時顯示預覽視窗，滑動滾輪切換圖片，單圖、多圖、動圖預覽與下載原圖功能
// @author         Eltair
// @match          https://www.pixiv.net/*
// @connect       i.pximg.net
// @grant           GM_xmlhttpRequest
// @grant           GM_addStyle
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/444267/Pixiv%E9%BC%A0%E6%A8%99%E9%A0%90%E8%A6%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/444267/Pixiv%E9%BC%A0%E6%A8%99%E9%A0%90%E8%A6%BD.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ========== 下面是可更改的數值 ========== //
    const BOXSIZE = 0.75; // 預覽框寬度，視窗可視區域短邊的倍數(預設 0.75 倍)，ex：-視窗可視區域寬高是1920x1080，那麼預覽框會是 1080 * 0.75 = 810
    const SPEED = 0.6; // 鼠標移動到縮圖上多久後顯示預覽框(預設 0.6 秒)
    const ADV = 2; // 多張圖片時預先背景載入的張數(預設 2 張)，ex：開啟預覽視窗時預設同時載入 3 張圖片並顯示第 1 張

    // [預覽插畫品質]
    // 0 = 原圖
    // 1 = 大圖(1200x1200)
    // 2 = 小圖(540x540)
    const QUALITY = 1;

    // [預覽動圖品質]
    // 0 = 原圖(1920x1080)
    // 1 = 小圖(600x600)
    const QUALITY_AM = 1;
    // ========== 上面是可更改的數值 ========== //

    /**
     * 修正問題: 排行榜動圖無法顯示彈窗
     * 播放圖標蓋住圖片，導致鼠標移入事件無法觸發，目前先用 css 讓事件穿透
     */
    GM_addStyle("img[src*='i.pximg.net/c/'] + div { pointer-events: none; }");

    // ========== 主要程式碼 ========== //

    let t = null; // 計時器
    let zp = null; // ZipImagePlayer
    let line = document.createElement("div"); // 底線
    line.className = "under showUnder";

    // [需要判斷的元素，用於判斷是否為可預覽的縮圖]
    const targetElement = [
        // 大部分頁面: 首頁、個人頁面、發現頁、創作儀錶板、排行榜、...其它可能的頁面
        "img[src*='i.pximg.net/c/']",
        // 頁面: 個人動態 => /stacc
        "a._work[href*='illust_id=']",
        // 頁面: 創作點子 => /idea
        "a._work[href*='/artworks/']",
        // 少部分頁面可能有所以先保留(創作點子也有用到)
        "div[style*='background-image'][style*='i.pximg.net/c/']",
    ].join(",");

    // [設定CSS]
    const underCSS = `@keyframes showUnder { from { width: 0%; } to { width: 100%; } } .under { background-color: #0096fa; height: 2px; position: absolute; bottom: 0; left: 0; width: 0%; } .showUnder { animation: showUnder ${SPEED}s linear; width: 100%; }`;
    const boxCSS =
        ".imgbox{z-index: 10001; position: absolute; text-align: center; border: 1px solid #cecece; background-color: #f5f5f5; border-radius: 8px; white-space: nowrap;}.imgbox .topbar,.imgbox .toolbar{display: flex; justify-content: space-between; padding: 3px 6px; gap: 8px;}.imgbox .tags{overflow: hidden; text-overflow: ellipsis;}.imgbox img{vertical-align: middle;}.imgbox .toolbar > *{width: 33%; overflow: hidden; text-overflow: ellipsis;}.imgbox .toolbar > :first-child{text-align: left;}.imgbox .toolbar > :last-child{text-align: right;}.imgbox .r18{color: #ff386b; font-weight: bold;}.imgbox .ai{color: #3d7699; font-weight: bold;}.imgbox .dl,.imgbox .fixed-pb,.imgbox .next,.imgbox .prev{font-weight: 700; color: #1f1f1f; cursor: pointer;}.imgbox .next,.imgbox .prev{position: absolute; width: 50%; top: 24px; bottom: 24px;}.imgbox .next{right: 0;}.imgbox .prev{left: 0;}.imgbox .toolbar a,.dl:visited{color: #adadad;}.imgbox .toolbar a,.dl:hover{color: #5c5c5c;}.imgpv{overflow: hidden;}.am{display: flex; align-items: center; justify-content: center;}";
    GM_addStyle(underCSS + boxCSS);

    // [綁定監聽器]
    document.addEventListener("mouseover", in_img);
    document.addEventListener("mouseout", out_img);

    // ========== 主要方法 ========== //
    // [滑鼠移入圖片]
    function in_img(e) {
        if (e.target.matches(targetElement)) {
            if (e.target.nodeName == "A") e.target.appendChild(line);
            else e.target.parentNode.appendChild(line);
            window.clearTimeout(t);
            t = window.setTimeout(function () {
                window.clearTimeout(t);
                new previewbox(e.target);
            }, SPEED * 1000);
        }
    }
    // [滑鼠移出圖片]
    function out_img(e) {
        if (e.target.matches(targetElement)) {
            if (e.target.nodeName == "A") e.target.removeChild(line);
            else e.target.parentNode.removeChild(line);
            window.clearTimeout(t);
        }
    }
    // [預覽框]
    function previewbox(target) {
        this.size = Math.min(document.documentElement.clientWidth, document.documentElement.clientHeight) * BOXSIZE; // 彈出框寬度，單位px
        this.adv = ADV;
        this.target = target;
        this.title = "";
        this.fixed = false;
        this.pid = null;
        this.box = null;
        this.box_html =
            "<div class='topbar'><span class='restrict'></span><p class='tags'>取得標籤中..</p><span class='fixed-pb'>固定</span></div><div class='imgpv' data-cursor='0' style='width: {size}px; height: {size}px;'></div><div style='position: relative;' class='under'></div><div class='prev'></div><div class='next'></div><div class='toolbar'><div><a href='' target='_blank'></a></div><p class='count'>1/1</p><div><span class='dl' data-src=''>下載</span></div></div>";
        this.img_html = "<img src='{imgsrc}' style='max-width: {size}px; max-height: {size}px;'>";
        this._createBox();
        return this;
    }
    // [加入彈出框]
    previewbox.prototype._createBox = function () {
        let pos = this._calcPosition();
        this.pid = this._getId();
        this.box = document.createElement("div");
        this.box.className = "imgbox";
        this.box.innerHTML = this.box_html.replace(/{size}/g, this.size);
        this.box.style.top = `${pos.top}px`;
        this.box.style.left = `${pos.left}px`;
        this.box.style.width = `${this.size + 2}px`;
        this.box.addEventListener(
            "mouseleave",
            function (e) {
                if (!this.fixed) {
                    this._removeBox.bind(e.target)();
                }
            }.bind(this)
        );

        // 固定按鈕
        this.box.querySelector(".fixed-pb").addEventListener(
            "click",
            function (e) {
                this.fixed = !this.fixed;
                e.target.innerText = this.fixed ? "關閉" : "固定";
            }.bind(this)
        );
        document.querySelector("body").appendChild(this.box);
        this._getData(
            function (json) {
                let body = json.body;
                // 設定標題
                this.title = body.title;
                // 動圖或是一般插畫
                if (body.illustType == 2) {
                    this._addAm();
                } else if (body.illustType == 0 || body.illustType == 1) {
                    this._addImgs(this._getImgurls(body.urls, body.pageCount));
                }
                // 設定標籤
                this._addTags(body.tags.tags, body.xRestrict, body.aiType == 2);
            }.bind(this)
        );
    };
    // [刪除彈出框]
    previewbox.prototype._removeBox = function () {
        this != null && this.remove();
        zp && zp.loadAbort();
        zp && window.clearTimeout(zp._loadTimer);
        zp && window.clearTimeout(zp._timer);
        zp = null;
    };
    // [計算彈出框位置]
    previewbox.prototype._calcPosition = function () {
        let windowWidth = document.documentElement.clientWidth,
            windowHeight = document.documentElement.clientHeight,
            bounding = this.target.getBoundingClientRect(),
            scrollTop = document.documentElement.scrollTop,
            scrollLeft = document.documentElement.scrollLeft,
            top = 0,
            left = 0;

        left = scrollLeft + bounding.left - (this.size - bounding.width) / 2;
        top = scrollTop + bounding.top - (this.size - bounding.height) / 2;
        // 如果上邊超出視窗
        if (top < scrollTop) {
            top = scrollTop + 2;
        }
        // 如果下邊超出視窗
        if (top + (this.size + 44) > scrollTop + windowHeight) {
            top = windowHeight - (this.size + 44) + scrollTop - 4;
        }
        // 如果左邊超出視窗
        if (left < scrollLeft) {
            left = scrollLeft + 2;
        }
        // 如果右邊超出視窗
        if (left + this.size > scrollLeft + windowWidth) {
            left = windowWidth - this.size + scrollLeft - 4;
        }
        return { top: top, left: left };
    };
    // [插入圖片方法]
    previewbox.prototype._addImg = function (url) {
        let div = document.createElement("div");
        div.style.width = `${this.size}px`;
        div.style.height = `${this.size}px`;
        div.style.lineHeight = `${this.size}px`;
        div.innerHTML = this.img_html.replace(/{imgsrc}/g, url[1]).replace(/{size}/g, this.size);
        this.box.querySelector(".imgpv").appendChild(div);
    };
    // [插入多圖方法]
    previewbox.prototype._addImgs = function (urls) {
        let cursor = 0; // 當前圖片位置
        let imgpv = this.box.querySelector(".imgpv"); // 圖片視窗
        let count = this.box.querySelector(".count"); // 頁數
        let dl = this.box.querySelector(".dl"); // 下載
        let next = this.box.querySelector(".next"); // 下一張按鈕
        let prev = this.box.querySelector(".prev"); // 上一張按鈕
        let imgLink = this.box.querySelector(".toolbar a"); // 圖片連結
        let under = this.box.querySelector(".under"); // 進度條

        imgLink.innerText = imgLink.title = this.title;
        imgLink.href = urls[0];
        // 圖片數量標籤
        count.innerText = `1/${urls[1].length}`;
        // 圖片下載按鈕
        dl.dataset.src = urls[2][cursor];
        dl.addEventListener(
            "click",
            function (e) {
                const filename = e.target.dataset.src.match(/[0-9]+\_p[0-9]+\..+/g)[0];
                this._downloadImg(e.target.dataset.src, filename);
            }.bind(this)
        );

        // 單張插圖
        if (urls[1].length == 1) {
            this._addImg([urls[0], urls[1][0]]);
            this.box.querySelector(".next").style.display = "none"; // 下一張按鈕
            this.box.querySelector(".prev").style.display = "none"; // 上一張按鈕
            return;
        }

        // 切換圖片
        const changImg = (e) => {
            e.preventDefault();
            // 滾輪往下或往上
            if (e.deltaY > 0 && cursor < urls[1].length - 1) {
                cursor++;
                if (cursor == imgpv.childNodes.length - this.adv && cursor < urls[1].length - this.adv) {
                    this._addImg([urls[0], urls[1][cursor + this.adv]]);
                }
                imgpv.childNodes[cursor - 1].style.display = "none";
                imgpv.childNodes[cursor].style.display = "block";
            } else if (e.deltaY < 0 && cursor > 0) {
                cursor--;
                imgpv.childNodes[cursor + 1].style.display = "none";
                imgpv.childNodes[cursor].style.display = "block";
            }
            under.style.width = `${(cursor / (urls[1].length - 1)) * 100}%`;
            count.innerText = `${cursor + 1}/${urls[1].length}`;
            dl.dataset.src = urls[2][cursor];
        };
        under.style.width = `${(cursor / (urls[1].length - 1)) * 100}%`;

        // 提前載入圖片
        for (let i = 0; i <= this.adv && i < urls[1].length; i++) {
            this._addImg([urls[0], urls[1][i]]);
        }

        // 點擊右區塊下一張圖片
        next.addEventListener("click", function (e) {
            e.deltaY = 100;
            changImg(e);
        });
        // 右區塊滾輪移動監聽器
        next.addEventListener("mousewheel", changImg);

        // 點擊左區塊上一張圖片
        prev.addEventListener("click", function (e) {
            e.deltaY = -100;
            changImg(e);
        });
        // 左區塊滾輪移動監聽器
        prev.addEventListener("mousewheel", changImg);
    };
    // [插入動圖方法]
    previewbox.prototype._addAm = function () {
        let canvas = document.createElement("canvas");
        let resizeBtn = document.createElement("span");
        let isLoading = document.createElement("span");
        let dl = this.box.querySelector(".dl"); // 下載
        let count = this.box.querySelector(".count"); // 頁數
        let under = this.box.querySelector(".under"); // 進度條

        this.box.querySelector(".next").style.display = "none"; // 下一張按鈕
        this.box.querySelector(".prev").style.display = "none"; // 上一張按鈕
        this.box.querySelector(".imgpv").appendChild(canvas);
        this.box.querySelector(".imgpv").appendChild(resizeBtn);
        this.box.querySelector(".imgpv").appendChild(isLoading);

        // 抓取第一張動圖設定畫布寬高，如果動圖下載超過五秒則暫停計時，顯示重製大小按鈕
        const resize = () => {
            let time = 0;
            resizeBtn.style.display = "none";
            const t = window.setInterval(function () {
                time += 100;
                if (zp?._frameImages?.length) {
                    canvas.width = zp._frameImages[0]?.width || canvas.width;
                    canvas.height = zp._frameImages[0]?.height || canvas.width;
                    isLoading.style.display = "none";
                    canvas.style.display = "block";
                    window.clearInterval(t);
                } else if (time >= 5000) {
                    resizeBtn.style.display = "block";
                    canvas.style.display = "block";
                    window.clearInterval(t);
                }
            }, 100);
        };

        canvas.style.display = "none";
        canvas.style.maxWidth = `${this.size}px`;
        canvas.style.maxHeight = `${this.size}px`;
        canvas.parentNode.classList.add("am");
        canvas.addEventListener("click", () => {
            if (zp._paused) {
                zp.play();
            } else {
                zp._paused = true;
            }
        });

        resizeBtn.style.display = "none";
        resizeBtn.style.cursor = "pointer";
        resizeBtn.style.position = "absolute";
        resizeBtn.innerText = "重製動圖大小";
        resizeBtn.addEventListener("click", resize);

        isLoading.innerText = "動圖載入中...";

        fetch(`https://www.pixiv.net/ajax/illust/${this.pid}/ugoira_meta`)
            .then(function (response) {
                if (!response.ok) throw new Error(response.statusText);
                return response.json();
            })
            .then(
                function (json) {
                    let options = {
                        canvas: canvas,
                        source: { 0: json.body.originalSrc, 1: json.body.src }[QUALITY_AM],
                        metadata: json.body,
                        chunkSize: 300000,
                        loop: true,
                    };

                    zp = new ZipImagePlayer(options);
                    resize();

                    document.addEventListener("frame", function (e) {
                        under.style.width = `${(e.detail.frame / e.detail.count) * 100}%`;
                        count.innerText = `${e.detail.frame}/${e.detail.count}`;
                    });

                    // 動畫下載按鈕
                    dl.dataset.src = json.body.originalSrc; // json.body.src(小圖) or json.body.originalSrc(原圖)
                    dl.addEventListener(
                        "click",
                        function (e) {
                            const filename = e.target.dataset.src.match(/[0-9]+_ugoira/g)[0] + ".zip";
                            this._downloadImg(e.target.dataset.src, filename);
                        }.bind(this)
                    );
                }.bind(this)
            )
            .catch(function (err) {
                console.log("抓取動圖資料發生問題:", err);
            });
    };
    // [設定標籤]
    previewbox.prototype._addTags = function (tags, isRestrict, isAI) {
        const restrict_html = this.box.querySelector(".restrict");
        const tags_html = this.box.querySelector(".tags");
        const fixex_html = this.box.querySelector(".fixex");

        // 是否為 AI 生成
        const ai_tag = isAI ? "<span class='ai'>AI</span>" : "";
        // 是否為限制級
        const r18_tag = {
            0: "",
            1: "<span class='r18'>R-18</span>",
            2: "<span class='r18'>R-18G</span>",
        }[isRestrict];

        // 檢查一般標籤中的限制級標籤
        let title = "";
        const normal_tags = tags
            .map((tag) => {
                title += `${tag.tag} `;
                if (tag.tag.match(/R-18G|R-18|R18|R18G/g)) {
                    return `<span class='r18'>${tag.tag}</span>`;
                } else {
                    return tag.tag;
                }
            })
            .join(", ");

        restrict_html.innerHTML = `${r18_tag} ${ai_tag}`;
        tags_html.innerHTML = normal_tags;
        tags_html.title = title;
    };
    // [取得圖片ID]
    previewbox.prototype._getId = function () {
        if (this.target.nodeName == "A") {
            // return /illust_id=([0-9]+)/g.exec(this.target.href)[1];
            return /([0-9]+)/g.exec(this.target.href)[1];
        } else if (this.target.nodeName == "IMG") {
            return /\/img\/.+\/([0-9]+)/g.exec(this.target.src)[1];
        } else if (this.target.nodeName == "DIV") {
            return /\/img\/.+\/([0-9]+)/g.exec(this.target.style.backgroundImage)[1];
        }
    };
    // [取得圖片連結]
    previewbox.prototype._getImgurls = function (urls, count) {
        let urls_preview = [];
        let urls_original = [];
        let quality = { 0: "original", 1: "regular", 2: "small" }[QUALITY];
        for (let i = 0; i < count; i++) {
            urls_preview.push(urls[quality].replace(/p0/, `p${i}`));
            urls_original.push(urls.original.replace(/p0/, `p${i}`));
        }
        return [`https://www.pixiv.net/member_illust.php?mode=medium&illust_id=${this.pid}`, urls_preview, urls_original];
    };
    // [抓取圖片資料]
    // https://www.pixiv.net/ajax/illust/:illustId
    // https://www.pixiv.net/ajax/illust/:illustId/pages
    // https://www.pixiv.net/ajax/tags/illust/:illustId
    // https://www.pixiv.net/ajax/user/:userId
    previewbox.prototype._getData = function (fun) {
        fetch(`https://www.pixiv.net/ajax/illust/${this.pid}`)
            .then(function (response) {
                if (!response.ok) throw new Error(response.statusText);
                return response.json();
            })
            .then(fun)
            .catch(function (err) {
                console.log("抓取圖片資料發生問題:", err);
            });
    };
    // [下載圖片]
    previewbox.prototype._downloadImg = function (url, filename) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: { referer: "https://www.pixiv.net/" },
            responseType: "blob",
            onload: function ({ response }) {
                const blobUrl = window.URL.createObjectURL(response);
                const a = document.createElement("a");
                a.download = filename;
                a.href = blobUrl;
                a.click();
                window.URL.revokeObjectURL(blobUrl);
            },
        });
    };

    // ========== pixiv zipplayer ========== //
    // 原始碼: https://github.com/pixiv/zip_player
    function ZipImagePlayer(options) {
        this._Uint8Array = window.Uint8Array || window.WebKitUint8Array || window.MozUint8Array || window.MSUint8Array;
        this._DataView = window.DataView || window.WebKitDataView || window.MozDataView || window.MSDataView;
        this._ArrayBuffer = window.ArrayBuffer || window.WebKitArrayBuffer || window.MozArrayBuffer || window.MSArrayBuffer;
        this.op = options;
        this._loadingState = 0;
        this._context = options.canvas.getContext("2d");
        this._files = {};
        this._frameCount = this.op.metadata.frames.length;
        this._frame = 0;
        this._loadFrame = 0;
        this._frameImages = [];
        this._paused = false;
        this._loadTimer = null;
        this._startLoad();
        this._loadXhr = null;
    }
    ZipImagePlayer.prototype = {
        _trailerBytes: 30000,
        _load: function (offset, length, callback) {
            var _this = this;
            var xhr = new XMLHttpRequest();
            xhr.addEventListener(
                "load",
                function (ev) {
                    if (!zp) return;
                    if (xhr.status == 200) {
                        offset = 0;
                        length = xhr.response.byteLength;
                        _this._len = length;
                        _this._buf = xhr.response;
                        _this._bytes = new _this._Uint8Array(_this._buf);
                    } else {
                        _this._bytes.set(new _this._Uint8Array(xhr.response), offset);
                    }
                    if (callback) {
                        callback.apply(_this, [offset, length]);
                    }
                },
                false
            );
            xhr.open("GET", this.op.source);
            xhr.responseType = "arraybuffer";
            if (offset != null && length != null) {
                var end = offset + length;
                xhr.setRequestHeader("Range", "bytes=" + offset + "-" + (end - 1));
                if (this._isSafari) {
                    xhr.setRequestHeader("Cache-control", "no-cache");
                    xhr.setRequestHeader("If-None-Match", Math.random().toString());
                }
            }
            this._loadXhr = xhr;
            this._loadXhr.send();
        },
        _startLoad: function () {
            var _this = this;
            var http = new XMLHttpRequest();
            http.open("HEAD", this.op.source);
            http.onreadystatechange = function () {
                if (this.readyState == this.DONE) {
                    _this._pHead = 0;
                    _this._pNextHead = 0;
                    _this._pFetch = 0;
                    var len = parseInt(this.getResponseHeader("Content-Length"));
                    _this._len = len;
                    _this._buf = new _this._ArrayBuffer(len);
                    _this._bytes = new _this._Uint8Array(_this._buf);
                    var off = len - _this._trailerBytes;
                    if (off < 0) {
                        off = 0;
                    }
                    _this._pTail = len;
                    _this._load(off, len - off, function (off, len) {
                        _this._pTail = off;
                        _this._findCentralDirectory();
                    });
                }
            };
            http.send();
        },
        _findCentralDirectory: function () {
            var dv = new this._DataView(this._buf, this._len - 22, 22);
            var cd_count = dv.getUint16(10, true);
            var cd_size = dv.getUint32(12, true);
            var cd_off = dv.getUint32(16, true);
            if (cd_off < this._pTail) {
                this._load(cd_off, this._pTail - cd_off, function () {
                    this._pTail = cd_off;
                    this._readCentralDirectory(cd_off, cd_size, cd_count);
                });
            } else {
                this._readCentralDirectory(cd_off, cd_size, cd_count);
            }
        },
        _readCentralDirectory: function (offset, size, count) {
            var dv = new this._DataView(this._buf, offset, size);
            var p = 0;
            for (var i = 0; i < count; i++) {
                var compMethod = dv.getUint16(p + 10, true);
                var uncompSize = dv.getUint32(p + 24, true);
                var nameLen = dv.getUint16(p + 28, true);
                var extraLen = dv.getUint16(p + 30, true);
                var cmtLen = dv.getUint16(p + 32, true);
                var off = dv.getUint32(p + 42, true);
                p += 46;
                var nameView = new this._Uint8Array(this._buf, offset + p, nameLen);
                var name = "";
                for (var j = 0; j < nameLen; j++) {
                    name += String.fromCharCode(nameView[j]);
                }
                p += nameLen + extraLen + cmtLen;
                this._files[name] = { off: off, len: uncompSize };
            }
            if (this._pHead >= this._pTail) {
                this._pHead = this._len;
                document.dispatchEvent(
                    new CustomEvent("loadProgress", {
                        detail: this._pHead / this._len,
                    })
                );
                this._loadNextFrame();
            } else {
                this._loadNextChunk();
                this._loadNextChunk();
            }
        },
        _loadNextChunk: function () {
            if (this._pFetch >= this._pTail) {
                return;
            }
            var off = this._pFetch;
            var len = this.op.chunkSize;
            if (this._pFetch + len > this._pTail) {
                len = this._pTail - this._pFetch;
            }
            this._pFetch += len;
            this._load(off, len, function () {
                if (off == this._pHead) {
                    if (this._pNextHead) {
                        this._pHead = this._pNextHead;
                        this._pNextHead = 0;
                    } else {
                        this._pHead = off + len;
                    }
                    if (this._pHead >= this._pTail) {
                        this._pHead = this._len;
                    }
                    document.dispatchEvent(
                        new CustomEvent("loadProgress", {
                            detail: this._pHead / this._len,
                        })
                    );
                    if (!this._loadTimer) {
                        this._loadNextFrame();
                    }
                } else {
                    this._pNextHead = off + len;
                }
                this._loadNextChunk();
            });
        },
        _fileDataStart: function (offset) {
            var dv = new DataView(this._buf, offset, 30);
            var nameLen = dv.getUint16(26, true);
            var extraLen = dv.getUint16(28, true);
            return offset + 30 + nameLen + extraLen;
        },
        _isFileAvailable: function (name) {
            var info = this._files[name];
            if (!info) {
                this._error("File " + name + " not found in ZIP");
            }
            if (this._pHead < info.off + 30) {
                return false;
            }
            return this._pHead >= this._fileDataStart(info.off) + info.len;
        },
        _loadNextFrame: function () {
            if (this._dead) {
                return;
            }
            var frame = this._loadFrame;
            if (frame >= this._frameCount) {
                return;
            }
            var meta = this.op.metadata.frames[frame];
            if (!this.op.source) {
                // Unpacked mode (individiual frame URLs)
                this._loadFrame += 1;
                this._loadImage(frame, meta.file, false);
                return;
            }
            if (!this._isFileAvailable(meta.file)) {
                return;
            }
            this._loadFrame += 1;
            var off = this._fileDataStart(this._files[meta.file].off);
            var end = off + this._files[meta.file].len;
            var url;
            var mime_type = this.op.metadata.mime_type || "image/png";
            if (this._URL) {
                var slice;
                if (!this._buf.slice) {
                    slice = new this._ArrayBuffer(this._files[meta.file].len);
                    var view = new this._Uint8Array(slice);
                    view.set(this._bytes.subarray(off, end));
                } else {
                    slice = this._buf.slice(off, end);
                }
                var blob;
                try {
                    blob = new this._Blob([slice], { type: mime_type });
                } catch (err) {
                    var bb = new this._BlobBuilder();
                    bb.append(slice);
                    blob = bb.getBlob();
                }
                url = this._URL.createObjectURL(blob);
                this._loadImage(frame, url, true);
            } else {
                url = "data:" + mime_type + ";base64," + base64ArrayBuffer(this._buf, off, end - off);
                this._loadImage(frame, url, false);
            }
        },
        _loadImage: function (frame, url, isBlob) {
            var _this = this;
            var image = new Image();
            var meta = this.op.metadata.frames[frame];
            image.addEventListener("load", function () {
                if (isBlob) {
                    _this._URL.revokeObjectURL(url);
                }
                if (_this._dead) {
                    return;
                }
                _this._frameImages[frame] = image;
                document.dispatchEvent(new CustomEvent("frameLoaded", [frame]));
                if (_this._loadingState == 0) {
                    _this._displayFrame.apply(_this);
                }
                if (frame >= _this._frameCount - 1) {
                    _this._setLoadingState(2);
                    _this._buf = null;
                    _this._bytes = null;
                } else {
                    if (!_this._maxLoadAhead || frame - _this._frame < _this._maxLoadAhead) {
                        _this._loadNextFrame();
                    } else if (!_this._loadTimer) {
                        _this._loadTimer = setTimeout(function () {
                            _this._loadTimer = null;
                            _this._loadNextFrame();
                        }, 200);
                    }
                }
            });
            image.src = url;
        },
        _setLoadingState: function (state) {
            if (this._loadingState != state) {
                this._loadingState = state;
                document.dispatchEvent(new CustomEvent("loadingStateChanged", [state]));
            }
        },
        _displayFrame: function () {
            if (this._dead) {
                return;
            }
            var _this = this;
            var meta = this.op.metadata.frames[this._frame];
            var image = this._frameImages[this._frame];
            if (!image) {
                this._setLoadingState(0);
                return;
            }
            if (this._loadingState != 2) {
                this._setLoadingState(1);
            }
            if (this.op.autosize) {
                if (this._context.canvas.width != image.width || this._context.canvas.height != image.height) {
                    // make the canvas autosize itself according to the images drawn on it
                    // should set it once, since we don't have variable sized frames
                    this._context.canvas.width = image.width;
                    this._context.canvas.height = image.height;
                }
            }
            this._context.clearRect(0, 0, this.op.canvas.width, this.op.canvas.height);
            this._context.drawImage(image, 0, 0);
            document.dispatchEvent(
                new CustomEvent("frame", {
                    detail: { frame: this._frame, count: this._frameCount },
                })
            );
            if (!this._paused) {
                this._timer = setTimeout(function () {
                    _this._timer = null;
                    _this._nextFrame.apply(_this);
                }, meta.delay);
            }
        },
        _nextFrame: function (frame) {
            if (this._frame >= this._frameCount - 1) {
                if (this.op.loop) {
                    this._frame = 0;
                } else {
                    this.pause();
                    return;
                }
            } else {
                this._frame += 1;
            }
            this._displayFrame();
        },
        play: function () {
            if (this._dead) {
                return;
            }
            if (this._paused) {
                document.dispatchEvent(new CustomEvent("play", [this._frame]));
                this._paused = false;
                this._displayFrame();
            }
        },
        getCurrentFrame: function () {
            return this._frame;
        },
        getLoadedFrames: function () {
            return this._frameImages.length;
        },
        getFrameCount: function () {
            return this._frameCount;
        },
        loadAbort: function () {
            this._loadXhr.abort();
            this._loadXhr = null;
        },
    };
    function base64ArrayBuffer(arrayBuffer, off, byteLength) {
        var base64 = "";
        var encodings = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var bytes = new Uint8Array(arrayBuffer);
        var byteRemainder = byteLength % 3;
        var mainLength = off + byteLength - byteRemainder;
        var a, b, c, d;
        var chunk;
        // Main loop deals with bytes in chunks of 3
        for (var i = off; i < mainLength; i = i + 3) {
            // Combine the three bytes into a single integer
            chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2];
            // Use bitmasks to extract 6-bit segments from the triplet
            a = (chunk & 16515072) >> 18; // 16515072 = (2^6 - 1) << 18
            b = (chunk & 258048) >> 12; // 258048   = (2^6 - 1) << 12
            c = (chunk & 4032) >> 6; // 4032     = (2^6 - 1) << 6
            d = chunk & 63; // 63 = 2^6 - 1
            // Convert the raw binary segments to the appropriate ASCII encoding
            base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d];
        }
        // Deal with the remaining bytes and padding
        if (byteRemainder == 1) {
            chunk = bytes[mainLength];
            a = (chunk & 252) >> 2; // 252 = (2^6 - 1) << 2
            // Set the 4 least significant bits to zero
            b = (chunk & 3) << 4; // 3   = 2^2 - 1
            base64 += encodings[a] + encodings[b] + "==";
        } else if (byteRemainder == 2) {
            chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1];
            a = (chunk & 64512) >> 10; // 64512 = (2^6 - 1) << 10
            b = (chunk & 1008) >> 4; // 1008  = (2^6 - 1) << 4
            // Set the 2 least significant bits to zero
            c = (chunk & 15) << 2; // 15    = 2^4 - 1
            base64 += encodings[a] + encodings[b] + encodings[c] + "=";
        }
        return base64;
    }
})();
