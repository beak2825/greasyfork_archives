// ==UserScript==
// @name         Telegra.ph 拖拽传图
// @namespace    Sinofine
// @version      0.2
// @description  Telegraph.ph 拖拽传图，可以一次拖拽传多图
// @author       Sinofine
// @match        https://telegra.ph/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/387966/Telegraph%20%E6%8B%96%E6%8B%BD%E4%BC%A0%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/387966/Telegraph%20%E6%8B%96%E6%8B%BD%E4%BC%A0%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function updatePhoto(t, e) { return "image/jpg" == t.type || "image/jpeg" == t.type ? loadImage(t, function (o) { if ("error" === o.type) e(t); else if (o.toBlob) o.toBlob(function (t) { e(t) }, t.type); else { var l = o.toDataURL(t.type), r = { type: t.type, base64_data: l.split(",")[1] }; e(uploadDataToBlob(r)) } }, { canvas: !0, orientation: !0 }) : void e(t) };
    document.addEventListener('dragover', function (event) {
        event.preventDefault();
    });
    document.addEventListener("drop", (e) => {
        e.preventDefault();
        if(!document.querySelector("[contenteditable]"))return;
        let f = Array.from(e.dataTransfer.files);
            f.sort((a,b)=>a.name>b.name?1:-1)
            f = f[Symbol.iterator]();
        (function it(p) {
            if(p.done===true)return;
            let e = p.value;
            updatePhoto(e, function (e) {
                if (quill.fileSizeLimit && e.size > quill.fileSizeLimit)
                    return quill.fileSizeLimitCallback && quill.fileSizeLimitCallback();
                var o = new FileReader;
                o.onload = function (e) {
                    var o = getFigureValueByUrl(e.target.result);
                    if (o) {
                        var l = quill.getSelection(!0);
                        quill.updateContents((new Delta).retain(l.index)["delete"](l.length).insert({
                            blockFigure: o
                        }), Quill.sources.USER)
                    } else
                        showError("Invalid file format");
                    it(f.next());
                },
                    o.readAsDataURL(e)
            })
        })(f.next())
    })
})();