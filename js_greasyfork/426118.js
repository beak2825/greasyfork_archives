// ==UserScript==
// @name        YT1s Converter Button
// @namespace   https://YT1s.com/
// @version     1.0
// @date        2019-07-23
// @author      A Koi, nascent
// @description yt1s Downloader: Download Video and Audio for free
// @homepage    https://yt1s.com/
// @icon        https://yt1s.com/favicon.ico
// @icon64      https://yt1s.com/favicon.ico
// @include     http://*youtube.com*
// @include     https://*youtube.com*
// @run-at      document-end
// @grant       none
// @connect     youtube.com
// @connect     m.youtube.com
// @connect     www.youtube.com
// @connect     youtube-nocookie.com
// @connect     youtu.be
// @connect     yt1s.com
// @downloadURL https://update.greasyfork.org/scripts/426118/YT1s%20Converter%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/426118/YT1s%20Converter%20Button.meta.js
// ==/UserScript==
//1c611e dark green
//2f9632 light green

var AKoiMain = {
    oXHttpReq: null,
    vid: null,
    oldUrl: null,
    DocOnLoad: function (o) {
        try {
            if (null != o && null != o.body && null != o.location && ((AKoiMain.vid = AKoiMain.getVid(o)), AKoiMain.vid)) {
                o.querySelector("#info-contents #info").setAttribute("style", "flex-wrap: wrap;");
                var t = o.querySelector("#menu-container"),
                    e = o.querySelector("#yt1sconverter"),
                    n = AKoiMain.GetCommandButton();
                null == e && (null != t ? t.parentNode.insertBefore(n, t) : (t = o.querySelector("#eow-title")).parentNode.insertBefore(n, t)), (AKoiMain.oldUrl = o.location.href), AKoiMain.checkChangeVid();
            }
            return !0;
        } catch (o) {
            console.log("Error in function YT1s.DocOnLoad. ", o);
        }
    },
    checkChangeVid: function () {
        setTimeout(function () {
            AKoiMain.oldUrl == window.location.href ? AKoiMain.checkChangeVid() : AKoiMain.WaitLoadDom(window.document);
        }, 1e3);
    },
    WaitLoadDom: function (o) {
        (AKoiMain.vid = AKoiMain.getVid(o)),
            AKoiMain.vid
                ? null != o.querySelector("#info #menu-container")
                    ? AKoiMain.DocOnLoad(o)
                    : setTimeout(function () {
                          AKoiMain.WaitLoadDom(o);
                      }, 1e3)
                : AKoiMain.checkChangeVid();
    },
    goToY2mate: function (o) {
        try {
            var t = "https://yt1s.com/en?q=https://www.youtube.com/watch?v=" + AKoiMain.vid + "/?utm_source=chrome_addon";
            window.open(t, "_self");
        } catch (o) {
            console.log("Error In Function YT1s.OnButtonClick. ", o);
        }
    },
    GetCommandButton: function () {
        try {
            var o = document.createElement("button");
            return (
                (o.id = "yt1sconverter"),
                (o.className = "yt-uix-tooltip"),
                o.setAttribute("type", "button"),
                o.setAttribute("title", "Download with yt1s.com"),
                (o.innerHTML = "Download"),
                o.addEventListener(
                    "click",
                    function (o) {
                        AKoiMain.goToY2mate(o);
                    },
                    !0
                ),
                o.setAttribute(
                    "style",
                    "min-height:25px; position:relative; top:1px; cursor: pointer; font: 13px Arial; background: #2f9632; color: #fff; text-transform: uppercase; display: block; padding: 10px 16px; margin: 20px 5px 10px 5px; border: 1px solid #2f9632; border-radius: 2px; font-weight:bold"
                ),
                o.setAttribute("onmouseover", "this.style.backgroundColor='#1c611e'"),
                o.setAttribute("onmouseout", "this.style.backgroundColor='#2f9632'"),
                o
            );
        } catch (o) {
            console.log("Error in function YT1s.GetCommandButton. ", o);
        }
    },
    getVid: function (o) {
        var t = o.location.toString().match(/^.*((m\.)?youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|\&vi?=)([^#\&\?]*).*/);
        return !(!t || !t[3]) && t[3];
    },
};
AKoiMain.WaitLoadDom(window.document);
