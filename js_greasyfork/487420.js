// ==UserScript==
// @name         Telegra.ph 新版拖拽传图
// @namespace    http://tampermonkey.net/
// @version      0.1[2024.02.16]
// @description  有BUG可以反馈,看到就会更新
// @license MIT
// @author       Swore
// @match        https://telegra.ph/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487420/Telegraph%20%E6%96%B0%E7%89%88%E6%8B%96%E6%8B%BD%E4%BC%A0%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/487420/Telegraph%20%E6%96%B0%E7%89%88%E6%8B%96%E6%8B%BD%E4%BC%A0%E5%9B%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function updatePhoto(t, callback) {
        return "image/jpg" == t.type || "image/jpeg" == t.type ? loadImage(t, function (o) {
            if ("error" === o.type) callback(t);
            else if (o.toBlob) o.toBlob(function (t) { callback(t) }, t.type);
            else {
                var l = o.toDataURL(t.type),
                    r = { type: t.type, base64_data: l.split(",")[1] };
                callback(uploadDataToBlob(r))
            }
        }, { canvas: !0, orientation: !0 }) : void callback(t);
    }
    document.addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    document.addEventListener("drop", (e) => {
        e.preventDefault();
        if (!document.querySelector("[contenteditable]")) return;

        let files = Array.from(e.dataTransfer.files);
        files.sort((a,b) => a.name.localeCompare(b.name));
        let index = 0;
        function processFile() {
            if (index >= files.length) return;

            const file = files[index];
            updatePhoto(file, function (e) {
                if (quill.fileSizeLimit && e.size > quill.fileSizeLimit)
                    return quill.fileSizeLimitCallback && quill.fileSizeLimitCallback();

                var reader = new FileReader();
                reader.onload = function (e) {
                    var result = getFigureValueByUrl(e.target.result);
                    if (result) {
                        var selection = quill.getSelection(true);
                        quill.updateContents(new Delta().retain(selection.index)["delete"](selection.length).insert({
                            blockFigure: result
                        }), Quill.sources.USER);
                    } else {
                        showError("Invalid file format");
                    }
                    index++;
                    processFile();
                };
                reader.readAsDataURL(e);
            });
        }

        processFile();
    });
})();