"use strict";

// ==UserScript==
// @name         简书导出文章
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  简书导出全部文章
// @author       yxy
// @match        https://www.jianshu.com/writer
// @require      https://cdn.bootcss.com/jszip/3.1.5/jszip.min.js
// @require      https://cdn.bootcss.com/FileSaver.js/1.3.8/FileSaver.js
// @downloadURL https://update.greasyfork.org/scripts/371815/%E7%AE%80%E4%B9%A6%E5%AF%BC%E5%87%BA%E6%96%87%E7%AB%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/371815/%E7%AE%80%E4%B9%A6%E5%AF%BC%E5%87%BA%E6%96%87%E7%AB%A0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.onload = function () {
        var loadData = function loadData() {
            var articlesData = {};
            var export_complete_count = 0;
            var setContent = function setContent(p, content_id) {
                return p.then(function (contentJson) {
                    for (var i in articlesData) {
                        for (var j in articlesData[i]) {
                            if (j == "notes") {
                                for (var k in articlesData[i][j]) {
                                    if (k == content_id) {
                                        articlesData[i][j][k]["content"] = contentJson.content;
                                    }
                                }
                            }
                        }
                    }
                });
            };
            return fetch("https://www.jianshu.com/author/notebooks").then(function (notebooksResponse) {
                return notebooksResponse.json();
            }).then(function (notebooksJson) {
                var p1s = [];
                for (var i = 0; i < notebooksJson.length; i++) {
                    articlesData[notebooksJson[i].id] = { "notebook_name": notebooksJson[i].name, "notes": {} };
                    p1s.push(fetch("https://www.jianshu.com/author/notebooks/" + notebooksJson[i].id + "/notes"));
                }
                return Promise.all(p1s);
            }).then(function (p1s) {
                return Promise.all(p1s.map(function (i) {
                    return i.json();
                }));
            }).then(function (p1s) {
                var p2s = [];
                for (var i = 0; i < p1s.length; i++) {
                    var notesJson = p1s[i];
                    for (var j = 0; j < notesJson.length; j++) {
                        articlesData[notesJson[j].notebook_id]["notes"][notesJson[j].id] = { "title": notesJson[j].title, "note_type": notesJson[j].note_type };
                        p2s.push(fetch("https://www.jianshu.com/author/notes/" + notesJson[j].id + "/content"));
                    }
                }

                return Promise.all(p2s);
            }).then(function (p2s) {
                return Promise.all(p2s.map(function (i) {
                    return setContent(i.json(), i.url.match(/notes\/([0-9]+)\/content/)[1]);
                }));
            }).then(function () {
                return articlesData;
            }).catch(function (error) {
                console.log(error);
                alert("导出出错，请稍后再试..");
                return Promise.reject(error);
            });
        };

        //create export button
        var btn = document.createElement('div');
        btn.className = '_3zibT';
        btn.innerHTML = "<a href=\"#\">\u5BFC\u51FA\u5168\u90E8\u6587\u7AE0</a>";
        btn.onclick = function () {
            var zip = new JSZip();
            loadData().then(function (res) {
                for (var i in res) {
                    for (var j in res[i].notes) {
                        var houzhui = res[i].notes[j].note_type == 2 ? ".md" : ".html";
                        zip.folder(res[i].notebook_name).file(res[i].notes[j].title + houzhui, res[i].notes[j].content);
                    }
                }
                return zip.generateAsync({ type: "blob" });
            }).then(function (content) {
                return saveAs(content, "你的文章.zip");
            });
        };
        document.querySelector('._2v5v5').prepend(btn);
    };
})();