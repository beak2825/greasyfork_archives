// ==UserScript==
// @name         Clipboard image upload patch in Bahamut forum
// @name:zh-TW   巴哈姆特論壇區剪貼簿圖片上傳補丁
// @namespace    https://jtdjdu6868.com/
// @version      1.2
// @description        Automatically upload image to Bahamut when you paste images in forum editor.
// @description:zh-TW  在編輯討論區文章時貼上支援的圖片格式，自動上傳至巴哈圖庫
// @author       jtdjdu6868
// @match        https://forum.gamer.com.tw/post1.php*
// @match        https://forum.gamer.com.tw/C.php*
// @match        https://forum.gamer.com.tw/Co.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamer.com.tw
// @grant        none
// @run-at       document-idle
// @license      BY
// @downloadURL https://update.greasyfork.org/scripts/486799/Clipboard%20image%20upload%20patch%20in%20Bahamut%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/486799/Clipboard%20image%20upload%20patch%20in%20Bahamut%20forum.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function pasteHandler(e)
    {
        const editor = this;
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for(let i = 0; i < items.length; ++i)
        {
            if("image/gif,image/jpeg,image/png,image/webp".split(",").includes(items[i].type))
            {
                e.preventDefault();
                console.log("paste image");
                toastr.info("上傳中...");

                const blob = items[i].getAsFile();
                const bsn = +new URL(window.location.href).searchParams.get("bsn");

                // get upload token (piccToken)
                fetch(`https://api.gamer.com.tw/forum/v1/image_token.php?bsn=${bsn}`, {
                    credentials: "include",
                }).then((res) => res.json()).then((res) => {
                    if(res.code !== void 0 && res.message || res.error)
                    {
                        throw res.message || res.error.message;
                    }
                    const piccToken = res.token || res.data.token;
                    return piccToken;
                }).then((piccToken) => {
                    // pack payload
                    const payload = new FormData();
                    payload.append("token", piccToken);
                    payload.append("dzfile", blob);

                    return payload;
                }).then((payload) => {

                    // upload payoad with piccToken
                    // use xhr because server returns a readablestream, xhr is more simpler
                    return new Promise((resolve, reject) => {
                        const xhr = new XMLHttpRequest();
                        xhr.open("POST", "https://picc.gamer.com.tw/ajax/truth_image_upload.php", true);
                        xhr.withCredentials = true;
                        xhr.onload = (e) => {
                            // return image token
                            resolve(e.target.responseText);
                        };

                        const headers = {
                            "Accept": "application/json",
                            "Cache-Control": "no-cache",
                            "X-Requested-With": "XMLHttpRequest"
                        };
                        Object.keys(headers).forEach((key) => xhr.setRequestHeader(key, headers[key]));

                        xhr.send(payload);
                    });
                }).then((res) => JSON.parse(res)).then((res) => {
                    if(res.token === void 0)
                    {
                        throw res;
                    }

                    // get image url by token
                    return fetch(`https://api.gamer.com.tw/forum/v1/image_upload.php?token=${res.token}&bsn=${bsn}`, {
                        credentials: "include",
                    });
                }).then((res) => res.json()).then((res) => {
                    // receive url
                    if(res.code !== void 0 && res.message || res.error)
                    {
                        throw res.message || res.error.message;
                    }
                    let urlList = res.data ? res.data.list : res;

                    // extract first url
                    return urlList[0];
                }).then((url) => {
                    toastr.clear();
                    toastr.success("上傳成功");

                    // insert
                    if(editor.isContentEditable)
                    {
                        // event from RTF or source code
                        if(!bahaRte.isPlainText)
                        {
                            // RTF
                            bahaRte.doc.execCommand("insertImage", false, url);
                            Forum.Editor.detectThumbnail();
                        }
                    }
                    else if(editor.id === "source")
                    {
                        // source code in post1.php editor
                        if(bahaRte.isPlainText)
                        {
                            document.execCommand("insertText", false, `[img=${url}]`);
                            Forum.Editor.detectThumbnail();
                        }
                    }
                    else if(editor.tagName === "TEXTAREA" || editor.tagName === "INPUT" && editor.type === "text")
                    {
                        // event from comment or some unknown input text

                        // insertText supports native undo, but baha offcial insert uses set content
                        // document.execCommand("insertText", false, url);
                        const selStart = editor.selectionStart,
                              selEnd = editor.selectionEnd;
                        const before = editor.value.substring(0, selStart),
                              after = editor.value.substring(selEnd);
                        editor.value = before + url + after;
                        editor.focus();
                        editor.selectionStart = selStart;
                        editor.selectionEnd = selStart + url.length;
                    }
                    else
                    {
                        console.log("editor unknown");
                    }
                }).catch((err) => {
                    toastr.clear();
                    toastr.error(err);
                });
            }
            else if(items[i].type.indexOf('image') === 0)
            {
                // unsupported image type
                toastr.warning("目前巴哈圖庫只支援png, jpg, gif, webp");
                e.preventDefault();
            }
        }
    };

    // bind event after bahaRte loaded
    jQuery(window).on('load', () => {
        bahaRte.doc.body.addEventListener("paste", pasteHandler);
        document.getElementById("source")?.addEventListener?.("paste", pasteHandler);
        document.querySelectorAll(".reply-input textarea").forEach((canEdit) => canEdit.addEventListener("paste", pasteHandler));
    });
})();