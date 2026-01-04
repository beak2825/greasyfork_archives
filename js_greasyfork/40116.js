// ==UserScript==
// @name         4chan filename randomiser
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Overrides the 4chan quick reply submit function to randomise the filename before submitting the form
// @author       You
// @match        https://boards.4chan.org/*/thread/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40116/4chan%20filename%20randomiser.user.js
// @updateURL https://update.greasyfork.org/scripts/40116/4chan%20filename%20randomiser.meta.js
// ==/UserScript==

QR.submit = function(e) {
    var t;
    var oldFile, newFile, fileName, blob;
    QR.hidePostError(),
    QR.presubmitChecks(e) && (QR.auto = !1,
    QR.xhr = new XMLHttpRequest,
    QR.xhr.open("POST", document.forms.qrPost.action, !0),
    QR.xhr.withCredentials = !0,
    QR.xhr.upload.onprogress = function(e) {
        e.loaded >= e.total ? QR.btn.value = "100%" : QR.btn.value = (0 | e.loaded / e.total * 100) + "%"
    }
    ,
    QR.xhr.onerror = function() {
        QR.xhr = null,
        QR.showPostError("Connection error.")
    }
    ,
    QR.xhr.onload = function() {
        var e, t, a, i, n, o, r;
        if (QR.xhr = null,
        QR.btn.value = "Post",
        200 == this.status) {
            if (e = this.responseText.match(/"errmsg"[^>]*>(.*?)<\/span/))
                return window.passEnabled && /4chan Pass/.test(e) ? QR.onPassError() : QR.resetCaptcha(),
                void QR.showPostError(e[1]);
            (i = this.responseText.match(/<!-- thread:([0-9]+),no:([0-9]+) -->/)) && (n = i[1],
            o = i[2],
            a = (t = $.id("qrFile")) && t.value,
            QR.setPostTime(),
            Config.persistentQR ? ($.byName("com")[1].value = "",
            (t = $.byName("spoiler")[2]) && (t.checked = !1),
            QR.resetCaptcha(),
            (a || QR.painterData) && QR.resetFile(),
            QR.startCooldown()) : QR.close(),
            Main.tid ? (Config.threadWatcher && ThreadWatcher.setLastRead(o, n),
            QR.lastReplyId = +o,
            Parser.trackedReplies[">>" + o] = 1,
            Parser.saveTrackedReplies(n, Parser.trackedReplies)) : ((r = Parser.getTrackedReplies(Main.board, n) || {})[">>" + o] = 1,
            Parser.saveTrackedReplies(n, r)),
            Parser.touchTrackedReplies(n),
            UA.dispatchEvent("4chanQRPostSuccess", {
                threadId: n,
                postId: o
            })),
            ThreadUpdater.enabled && setTimeout(ThreadUpdater.forceUpdate, 500)
        } else
            QR.showPostError("Error: " + this.status + " " + this.statusText)
    }
    ,
    t = new FormData(document.forms.qrPost),
	oldFile = t.get('upfile'),
    (oldFile.size > 0) && (
        blob = oldFile.slice(0, oldFile.size, oldFile.type),
        fileName = `${Date.now() - Math.floor(Math.random() * 365 * 24*60*60*1000)}` + "." + oldFile.name.split('.').pop(),
        newFile = new File([blob], fileName, {type: oldFile.type}),
        t.set("upfile", newFile)),
    QR.painterData && QR.appendPainter(t),
    clearInterval(QR.pulse),
    QR.btn.value = "Sending",
    QR.xhr.send(t))
}