// ==UserScript==
// @name         Bilibili Video URLs
// @namespace    http://ayanamist.com/bilibili_video_urls
// @version      0.6
// @description  Show bilibili video urls
// @author       ayanamist
// @match       *://www.bilibili.com/video/av*
// @match       *://bangumi.bilibili.com/anime/*/play*
// @match       *://www.bilibili.com/bangumi/play/ep*
// @match       *://www.bilibili.com/bangumi/play/ss*
// @match       *://www.bilibili.com/watchlater/
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/40141/Bilibili%20Video%20URLs.user.js
// @updateURL https://update.greasyfork.org/scripts/40141/Bilibili%20Video%20URLs.meta.js
// ==/UserScript==

(function() {
    var playUrl = "";
    var playData = null;

    function copyTextToClipboard(text) {
        var textArea = document.createElement("textarea");

        //
        // *** This styling is an extra step which is likely not required. ***
        //
        // Why is it here? To ensure:
        // 1. the element is able to have focus and selection.
        // 2. if element was to flash render it has minimal visual impact.
        // 3. less flakyness with selection and copying which **might** occur if
        //    the textarea element is not visible.
        //
        // The likelihood is the element won't even render, not even a flash,
        // so some of these are just precautions. However in IE the element
        // is visible whilst the popup box asking the user for permission for
        // the web page to copy to the clipboard.
        //

        // Place in top-left corner of screen regardless of scroll position.
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em';

        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = 0;

        // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';

        // Avoid flash of white box if rendered for any reason.
        textArea.style.background = 'transparent';


        textArea.value = text;

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
            document.execCommand('copy');
        } catch (err) {
            console.log('Oops, unable to copy', err);
        }
        document.body.removeChild(textArea);
    }

    function copyUrls() {
        if (playData === null) {
                unsafeWindow.console.log("还未获取到下载链接")
                return;
        }
        var str = playData["durl"].map(e => e['url']).reduce((acc, cur) => acc + cur + "\n", "");
        unsafeWindow.console.log("download urls:\n"+str);
        copyTextToClipboard(str);
        alert(`复制${playData["format"]}成功`);
    }

    function fetchPlayUrl() {
        if (playData === null) {
            if (playUrl === "") {
                alert("还未获取到下载链接")
                return;
            }
            fetch(playUrl, {
                credentials: 'include'
            }).then(res => res.json()).then(function(data) {
                playData = data;
            });
        }
    }

    var loadedPromise = new Promise(function(resolve){
        document.addEventListener("DOMContentLoaded", () => resolve());
    });

    loadedPromise.then(function() {
        var noContainerCnt = 0;
        var timer = setInterval(function(){
            var infoEl = document.querySelector("#bangumi_header .header-info .info-second");
            if (infoEl === null) {
                infoEl = document.querySelector("#viewbox_report .tm-info");
            }
            if (infoEl === null) {
                infoEl = document.querySelector("#viewlater-app .video-info-module .tm-info");
            }
            if (infoEl === null) {
                infoEl = document.querySelector("#viewbox_report .crumbs");
            }
            if (infoEl === null) {
                noContainerCnt++;
                if (noContainerCnt > 3) {
                    alert("无法找到可以插入复制按钮的容器");
                    clearInterval(timer);
                }
                return;
            }
            var e = infoEl.querySelector(".js-copy-urls");
            if (e !== null) {
                return;
            }
            e = document.createElement('a');
            e.className = "js-copy-urls";
            e.style.marginLeft = "24px";
            e.style.color = "#99a2aa";
            e.innerHTML = `复制视频链接`;
            e.href = "javascript:void()";
            infoEl.appendChild(e);
            e.addEventListener("click", (evt) => {
                evt.preventDefault();
                // 复制动作必须直接在click里操作，不能在任何回调里触发，否则会无效
                copyUrls();
            });
        }, 500);
    });

    if (typeof unsafeWindow.__playinfo__ == "undefined") {
        Object.defineProperty(unsafeWindow, "__playinfo__", { set: function (x) { playData = x; }, get: function () { return playData; } });
    } else {
        playData = unsafeWindow.__playinfo__;
    }

    const origXhr = unsafeWindow.XMLHttpRequest;
    unsafeWindow.XMLHttpRequest = function() {
        if (new.target) {
            const obj = new origXhr();
            const origOpen = obj.open;
            obj.open = function() {
                var url = arguments[1];
                if (url.indexOf("/playurl?") >= 0) {
                    playUrl = url;
                    playData = null;
                    setTimeout(fetchPlayUrl, 0);
                }
                return origOpen.apply(obj, arguments);
            };
            return obj;
        } else {
            return origXhr();
        }
    };
})();