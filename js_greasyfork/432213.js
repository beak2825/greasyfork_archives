// ==UserScript==
// @name        Y2mate.is Youtube Download Button
// @namespace   https://y2mate.is/
// @version     1.5
// @date        2019-07-23
// @author      A Koi
// @description Y2mate Downloader: Download Video and Audio for free
// @homepage    https://y2mate.is/
// @icon        https://y2mate.is/favicon.ico
// @icon64      https://y2mate.is/favicon.ico
// @include     http://*youtube.com*
// @include     https://*youtube.com*
// @run-at      document-end
// @grant       none
// @connect     youtube.com
// @connect     m.youtube.com
// @connect     www.youtube.com
// @connect     youtube-nocookie.com
// @connect     youtu.be
// @connect     y2mate.is
// @downloadURL https://update.greasyfork.org/scripts/432213/Y2mateis%20Youtube%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/432213/Y2mateis%20Youtube%20Download%20Button.meta.js
// ==/UserScript==
var AKoiMain = {
    oXHttpReq: null,
    vid: null,
    oldUrl: null,
    DocOnLoad: function (o) {
        try {
            if (null != o && null != o.body && null != o.location && ((AKoiMain.vid = AKoiMain.getVid(o)), AKoiMain.vid)) {
                o.querySelector("#info-contents #info").setAttribute("style", "flex-wrap: wrap;");
                var t = o.querySelector("#menu-container"),
                    e = o.querySelector("#y2mateconverter"),
                    n = AKoiMain.GetCommandButton();
                null == e && (null != t ? t.parentNode.insertBefore(n, t) : (t = o.querySelector("#eow-title")).parentNode.insertBefore(n, t)), (AKoiMain.oldUrl = o.location.href), AKoiMain.checkChangeVid();
            }
            return !0;
        } catch (o) {
            console.log("Error In Function Y2mate.DocOnLoad. ", o);
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
            var t = "https://y2mate.is/?url=" + AKoiMain.oldUrl;
            window.open(t, "_self");
        } catch (o) {
            console.log("Error In Function Y2mate.OnButtonClick. ", o);
        }
    },
    GetCommandButton: function () {
        try {
            var o = document.createElement("button");
            return (
                (o.id = "y2mateconverter"),
                (o.className = "yt-uix-tooltip"),
                o.setAttribute("type", "button"),
                o.setAttribute("title", "Download with y2mate.is"),
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
                    "min-height:25px; position:relative; top:1px; cursor: pointer; font: 13px Arial; background: #ff003e; color: #fff; text-transform: uppercase; display: block; padding: 10px 16px; margin: 20px 5px 10px 5px; border: 1px solid #ff0068; border-radius: 2px; font-weight:bold"
                ),
                o.setAttribute("onmouseover", "this.style.backgroundColor='#c10841'"),
                o.setAttribute("onmouseout", "this.style.backgroundColor='#ff003e'"),
                o
            );
        } catch (o) {
            console.log("Error In Function Y2mate.GetCommandButton. ", o);
        }
    },
    getVid: function (o) {
        var t = o.location.toString().match(/^.*((m\.)?youtu\.be\/|vi?\/|u\/\w\/|embed\/|\?vi?=|\&vi?=)([^#\&\?]*).*/);
        return !(!t || !t[3]) && t[3];
    },
};
AKoiMain.WaitLoadDom(window.document);
