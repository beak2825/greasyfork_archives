// ==UserScript==
// @name         一键下载 flash 游戏
// @description  ✨一键下载 4399, 7k7k ,17yy flash 游戏, 并提供 flash 播放器✨
// @namespace    https://fcmsb250.github.io/
// @version      0.3.3
// @author       dsy4567 https://greasyfork.org/zh-CN/users/822325 | https://github.com/dsy4567
// @license      MIT
// @run-at       document-start

// @match        *://*.4399.com/*
// @match        *://*.7k7k.com/*
// @match        *://*.17yy.com/*

// @connect      *.4399.com
// @connect      *.7k7k.com

// @grant        GM_addValueChangeListener
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        unsafeWindow
// @require      https://code.jquery.com/jquery-3.6.0.min.js

// @homepageURL  https://fcmsb250.github.io/
// @supportURL   https://github.com/dsy4567/Fucking-Anti-Indulgence/

// @downloadURL https://update.greasyfork.org/scripts/445006/%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%20flash%20%E6%B8%B8%E6%88%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/445006/%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD%20flash%20%E6%B8%B8%E6%88%8F.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2022 dsy4567(https://greasyfork.org/zh-CN/users/822325 ; https://github.com/dsy4567/ ; dsy4567@outlook.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

try {
    Object.defineProperty(unsafeWindow, "showBlockFlashIE", {
        value: () => { },
        writable: false,
    });
} catch (e) { }
try {
    Object.defineProperty(unsafeWindow, "showBlockFlash", {
        value: () => { },
        writable: false,
    });
    GM_setValue("url", String(Math.random()));
} catch (e) { }

// ==download.js==

//download.js v4.2, by dandavis; 2008-2016. [CCBY2] see http://danml.com/download.html for tests/usage
// v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
// v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
// v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support. 3.1 improved safari handling.
// v4 adds AMD/UMD, commonJS, and plain browser support
// v4.1 adds url download capability via solo URL argument (same domain/CORS only)
// v4.2 adds semantic variable names, long (over 2MB) dataURL support, and hidden by default temp anchors
// https://github.com/rndme/download

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === "object") {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.download = factory();
    }
})(this, function () {
    return function download(data, strFileName, strMimeType) {
        var self = window, // this script is only for browsers anyway...
            defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
            mimeType = strMimeType || defaultMime,
            payload = data,
            url = !strFileName && !strMimeType && payload,
            anchor = document.createElement("a"),
            toString = function (a) {
                return String(a);
            },
            myBlob = self.Blob || self.MozBlob || self.WebKitBlob || toString,
            fileName = strFileName || "download",
            blob,
            reader;
        myBlob = myBlob.call ? myBlob.bind(self) : Blob;

        if (String(this) === "true") {
            //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
            payload = [payload, mimeType];
            mimeType = payload[0];
            payload = payload[1];
        }

        if (url && url.length < 2048) {
            // if no filename and no mime, assume a url was passed as the only argument
            fileName = url.split("/").pop().split("?")[0];
            anchor.href = url; // assign href prop to temp anchor
            if (anchor.href.indexOf(url) !== -1) {
                // if the browser determines that it's a potentially valid url path:
                var ajax = new XMLHttpRequest();
                ajax.open("GET", url, true);
                ajax.responseType = "blob";
                ajax.onload = function (e) {
                    download(e.target.response, fileName, defaultMime);
                };
                setTimeout(function () {
                    ajax.send();
                }, 0); // allows setting custom ajax headers using the return:
                return ajax;
            } // end if valid url?
        } // end if url?

        //go ahead and download dataURLs right away
        if (/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)) {
            if (payload.length > 1024 * 1024 * 1.999 && myBlob !== toString) {
                payload = dataUrlToBlob(payload);
                mimeType = payload.type || defaultMime;
            } else {
                return navigator.msSaveBlob // IE10 can't do a[download], only Blobs:
                    ? navigator.msSaveBlob(dataUrlToBlob(payload), fileName)
                    : saver(payload); // everyone else can save dataURLs un-processed
            }
        } //end if dataURL passed?

        blob =
            payload instanceof myBlob
                ? payload
                : new myBlob([payload], { type: mimeType });

        function dataUrlToBlob(strUrl) {
            var parts = strUrl.split(/[:;,]/),
                type = parts[1],
                decoder = parts[2] == "base64" ? atob : decodeURIComponent,
                binData = decoder(parts.pop()),
                mx = binData.length,
                i = 0,
                uiArr = new Uint8Array(mx);

            for (i; i < mx; ++i) uiArr[i] = binData.charCodeAt(i);

            return new myBlob([uiArr], { type: type });
        }

        function saver(url, winMode) {
            if ("download" in anchor) {
                //html5 A[download]
                anchor.href = url;
                anchor.setAttribute("download", fileName);
                anchor.className = "download-js-link";
                anchor.innerHTML = "downloading...";
                anchor.style.display = "none";
                document.body.appendChild(anchor);
                setTimeout(function () {
                    anchor.click();
                    document.body.removeChild(anchor);
                    if (winMode === true) {
                        setTimeout(function () {
                            self.URL.revokeObjectURL(anchor.href);
                        }, 250);
                    }
                }, 66);
                return true;
            }

            // handle non-a[download] safari as best we can:
            if (
                /(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(
                    navigator.userAgent
                )
            ) {
                url = url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
                if (!window.open(url)) {
                    // popup blocked, offer direct download:
                    if (
                        confirm(
                            "Displaying New Document\n\nUse Save As... to download, then click back to return to this page."
                        )
                    ) {
                        location.href = url;
                    }
                }
                return true;
            }

            //do iframe dataURL download (old ch+FF):
            var f = document.createElement("iframe");
            document.body.appendChild(f);

            if (!winMode) {
                // force a mime that will download:
                url = "data:" + url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
            }
            f.src = url;
            setTimeout(function () {
                document.body.removeChild(f);
            }, 333);
        } //end saver

        if (navigator.msSaveBlob) {
            // IE10+ : (has Blob, but not a[download] or URL)
            return navigator.msSaveBlob(blob, fileName);
        }

        if (self.URL) {
            // simple fast and modern way using Blob and URL:
            saver(self.URL.createObjectURL(blob), true);
        } else {
            // handle non-Blob()+non-URL browsers:
            if (typeof blob === "string" || blob.constructor === toString) {
                try {
                    return saver("data:" + mimeType + ";base64," + self.btoa(blob));
                } catch (y) {
                    return saver("data:" + mimeType + "," + encodeURIComponent(blob));
                }
            }

            // Blob but not URL support:
            reader = new FileReader();
            reader.onload = function (e) {
                saver(this.result);
            };
            reader.readAsDataURL(blob);
        }
        return true;
    }; /* end download() */
});

// ==/download.js==

var 正在下载 = 0;

function 准备下载() {
    if (正在下载) throw alert("还有游戏正在下载, 请稍后再试");
    正在下载 = 1;
    setTimeout(() => {
        if (正在下载) {
            alert("下载失败: 游戏未能在规定的时间内开始下载, 或遇到了其他问题");
        }
        正在下载 = 0;
    }, 5000);
}
/**
 * @param {String} 开始
 * @param {String} 结束
 * @param {String} 值
 * @param {String} 类型 "1": url, "2": 字母+数字, "3": 数字
 * @param {String} 前面追加
 * @returns {String}
 */
function 获取中间(开始, 结束, 值, 类型, 前面追加) {
    if (开始 && !值.indexOf(开始) != -1) {
        值 = 值.substring(值.indexOf(开始) + 开始.length);
    }
    if (结束) {
        值 = decodeURI(值.substring(0, 值.indexOf(结束)));
    }
    if (前面追加) {
        值 = 前面追加 + 值;
    }
    switch (类型) {
        case "1":
            if (
                !(
                    值.substring(0, 2) == "//" ||
                    值.substring(0, 7) == "http://" ||
                    值.substring(0, 8) == "https://"
                )
            ) {
                throw new Error("不正确的字符串");
            }
            break;
        case "2":
            if (!/^[0-9a-zA-Z]*$/g.test(值)) {
                throw new Error("不正确的字符串");
            }
            break;
        case "3":
            if (isNaN(Number(值))) {
                throw new Error("不正确的字符串");
            }
            break;

        default:
            break;
    }
    return 值;
}

// ==/Fucking-Anti-Indulgence.user.js==

(() => {
    if (self == top) {
        GM_registerMenuCommand("注意: 请勿下载 h5 游戏");
        GM_registerMenuCommand("注意: 请勿在下载时同时打开其它游戏");
        GM_registerMenuCommand("注意: 建议在游戏加载完成后下载游戏");
        // GM_registerMenuCommand("注意: 若等待时间过长则说明下载失败");
        GM_registerMenuCommand("----------");
        GM_registerMenuCommand("打开flash播放器", () => {
            GM_openInTab("https://fcmsb250.github.io/flash.html");
        });

        GM_registerMenuCommand("下载4399 flash 游戏", () => {
            准备下载();

            let url = "";
            try {
                url = document.querySelector("#flashgame > param[name='movie']").value;
                if (url.includes("?")) {
                    url = 获取中间("gameswf=", ".swf", url) + ".swf";
                }
            } catch (e) {
                console.error(e);
                try {
                    url = document.querySelector("#swf1 > param[name='movie']").value;

                    if (url.includes("?")) {
                        url = 获取中间("gameswf=", ".swf", url) + ".swf";
                    }
                } catch (e) {
                    console.error(e);
                }
            }
            if (unsafeWindow._strGamePath?.includes(".swf")) {
                正在下载 = 0;
                location.href = unsafeWindow.webServer + unsafeWindow._strGamePath;
            }
            if (url) {
                if (
                    !(
                        url.substring(0, 2) == "//" ||
                        url.substring(0, 7) == "http://" ||
                        url.substring(0, 8) == "https://"
                    )
                ) {
                    url =
                        location.href.substring(0, location.href.lastIndexOf("/") + 1) +
                        url;
                }
                GM_setValue("url", url);
            } else {
                console.log("失败");
                GM_setValue("down4399", Math.random());
            }
        });

        GM_registerMenuCommand("下载7k7k flash 游戏", () => {
            准备下载();

            try {
                let url = document.querySelector("#gameobj").src;
                if (url == location.href || !url) {
                    throw "";
                }
                location.href = url;
            } catch (e) {
                console.error(e);
                try {
                    var game_path = "";
                    var game_id = unsafeWindow.gameInfo.gameId;
                    //同步请求
                    $.ajaxSettings.async = false;
                    $.get(
                        "//www.7k7k.com/open_api/request?action=Flash.Game&game=" + game_id,
                        function (data) {
                            try {
                                game_path = JSON.parse(data).result.url;
                                正在下载 = 0;
                                location.href = game_path;
                            } catch (e) {
                                alert("失败");
                            }
                        }
                    );
                    $.ajaxSettings.async = true;
                } catch (e) {
                    console.error(e);
                    console.log("失败");
                }
            }
        });

        GM_registerMenuCommand("下载17yy flash 游戏", () => {
            准备下载();

            $.ajax({
                url: "//www.17yy.com/e/payapi/vip_ajax.php",
                data: {
                    action: "getStatus",
                    id: 获取中间("/f/play/", ".html", location.href, "3"),
                },
                type: "POST",
                dataType: "json",
                success: function (resp) {
                    if (resp?.data?.game_path) {
                        正在下载 = 0;
                        location.href =
                            "http://" +
                            unsafeWindow.server +
                            "/" +
                            unsafeWindow.classes +
                            "/" +
                            unsafeWindow.date +
                            "/" +
                            resp.data.game_path;
                    }
                },
            });
        });

        GM_addValueChangeListener("url", (name, old_value, new_value, remote) => {
            if (!正在下载 || !isNaN(Number(new_value))) return;
            正在下载 = 0;
            GM_setValue("url", String(Math.random()));
            location.href = new_value;
        });

        if (location.hostname === "flash.7k7k.com" && unsafeWindow._src_) {
            download(unsafeWindow._src_);
        }
        if (
            location.pathname.includes(".swf") &&
            !document.documentElement.innerHTML.includes(
                "was not found on this server."
            )
        ) {
            download(location.href);
            return;
        }
    } else {
        if (
            location.href.includes("4399") &&
            location.href.includes("upload_swf")
        ) {
            GM_addValueChangeListener(
                "down4399",
                (name, old_value, new_value, remote) => {
                    let url = "";
                    try {
                        url = document.querySelector(
                            "#flashgame > param[name='movie']"
                        ).value;
                        if (url.includes("?")) {
                            url = 获取中间("gameswf=", ".swf", url) + ".swf";
                        }
                    } catch (e) {
                        console.error(e);
                        try {
                            url = document.querySelector("#swf1 > param[name='movie']").value;

                            if (url.includes("?")) {
                                url = 获取中间("gameswf=", ".swf", url) + ".swf";
                            }
                        } catch (e) {
                            console.error(e);
                        }
                    }
                    if (url) {
                        if (
                            !(
                                url.substring(0, 2) == "//" ||
                                url.substring(0, 7) == "http://" ||
                                url.substring(0, 8) == "https://"
                            )
                        ) {
                            url =
                                location.href.substring(0, location.href.lastIndexOf("/") + 1) +
                                url;
                        }
                        GM_setValue("url", url);
                    } else {
                        console.log("失败");
                    }
                }
            );
        }
    }
})();
