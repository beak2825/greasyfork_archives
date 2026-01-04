// ==UserScript==
// @name         Rainclass GOD
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  View Danmu Source & View PPT & Preview full PPT
// @author       Ajax
// @match        https://*.yuketang.cn/lesson/fullscreen/v3/*
// @match        https://*.yuketang.cn/presentation*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yuketang.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460911/Rainclass%20GOD.user.js
// @updateURL https://update.greasyfork.org/scripts/460911/Rainclass%20GOD.meta.js
// ==/UserScript==

'use strict';

// Some global funcs
// var socket;
// var request;
// var API;

if (location.pathname.match("/lesson/fullscreen/v3") != null)
{
    window.strangeDisabled = true;
    (function() {
        var func = function () {
            if (socket == null || socket.onmessage == null || socket.readyState != socket.OPEN) {
                setTimeout(func, 1);
                return;
            }

            console.log("Script attached");
            socket.onMessageOriginal = socket.onmessage;

            socket.onmessage = function(event) {
                if (event && event.data) {
                    var msg = JSON.parse(event.data);

                    // Get students list
                    if (msg.op === "hello") {
                        request.get(API.lesson.get_lesson_base).then(function(response) {
                            if (response && response.code === 0) {
                                DecodeCourseStudentData(response.data.classroomId);
                            }
                        });
                    }

                    // Add preview for presentations
                    if ((msg.op === "hello" || msg.op === "showpresentation") && msg.presentation !== null) {
                        var params = {'presentation_id': msg.presentation};

                        request.get(API.lesson.get_presentation, params).then(function(response) {
                            if (response && response.code === 0) {
                                var list = [];
                                for (var i in response.data.slides) {
                                    list.push(response.data.slides[i].cover);
                                }

                                var url = new URL(location);
                                url.pathname = "/presentation";
                                url.search = "";
                                url.searchParams.append("data", JSON.stringify({
                                    "title": response.data.title,
                                    "slides": list
                                }));

                                var link = document.createElement("a");
                                link.href = url.href;
                                link.innerHTML = response.data.title;
                                link.target = "_blank";

                                document.querySelector(".timeline__wrap").appendChild(link);
                            }
                        });
                    }

                    // Fixed by yuketang, but not entirely
                    // Show danmaku source
                    if (msg.op === "newdanmu") {
                        var uid = parseInt(msg.userid);
                        if (localStorage["studentInfo" + uid]) {
                            var data = JSON.parse(localStorage["studentInfo" + uid]);
                            msg.danmu = `[${data.name}:${uid}] ${msg.danmu}`;
                            event = {"data": JSON.stringify(msg)};
                        }
                        else {
                            msg.danmu = `[${uid}] ${msg.danmu}`;
                            event = {"data": JSON.stringify(msg)};
                        }
                    }

                    // Make presentations appear by default
                    if (msg.op === "slidenav") {
                        msg.slide.total = 0;
                        msg.slide.step = -1;
                        event = {"data": JSON.stringify(msg)};
                    }
                }

                socket.onMessageOriginal(event);
            };

            socket.onCloseOriginal = socket.onclose;

            socket.onclose = function() {
                setTimeout(func, 100);
                socket.onCloseOriginal();
            };
        };

        window.onload = func;
    })();
}

// PPT preview (custom added, replaces 404 or 401 page.)
if (location.pathname.match("/presentation") != null) {
    console.log("Script attached");

    var url = new URL(location);
    var data = JSON.parse(url.searchParams.get("data"));

    document.write(`
        <html>
            <head>
                 <title>${data.title}</title>
                 <style type="text/css">
                 div {
                     border: 2px solid lightgray;
                     margin: 10px;
                 }

                 span {
                     margin: 5px;
                 }

                 img {
                     width: 100%;
                 }
                 </style>
            </head>
            <body>
            </body>
        </html>
    `);

    for (var i=0; i<data.slides.length; ++i) {
        var div = document.createElement("div");

        var txtdiv = document.createElement("span");
        txtdiv.textContent = i+1;
        div.appendChild(txtdiv);

        var img = document.createElement("img");
        img.src = data.slides[i];
        img.alt = i;
        div.appendChild(img);

        document.body.appendChild(div);
    }
}

function DecodeCourseStudentData(courseId) {
    if (localStorage["studentInfoRetrieved" + courseId]) {
        return;
    }

    localStorage["studentInfoRetrieved" + courseId] = "true";

    request.get(`/api/open/classroom/member/page-students?classroom_id=${courseId}&role=4&page_size=1&page=1&format=json`).then(function(response) {
        if (response && response.data && response.data.student_count) {
            var count = parseInt(Math.ceil(response.data.student_count / 100));
            for (var i=0; i<count; ++i) {
                request.get(`/api/open/classroom/member/page-students?classroom_id=${courseId}&role=5&page_size=100&page=${i+1}&format=json`).then(function(response) {
                    if (response && response.data) {
                        for (var i=0; i<response.data.results.length; ++i) {
                            localStorage["studentInfo" + response.data.results[i].user_id] = JSON.stringify(response.data.results[i]);
                        }
                    }

                    /*
        else if (response) {
            // Extract <pre> data
            var preData = response.match("<div class=\"response-info\">[\\s\\S]*<pre[^>]+>([\\s\\S]*?)</pre>")[1];

            // Extract html-formatted json
            var jsonHtmlData = preData.match("{[\\s\\S]*}")[0];

            // Decode to plain json
            var converter = document.createElement("div");
            converter.innerHTML = jsonHtmlData;
            var jsonData = converter.textContent;

            // Parse json
            data = JSON.parse(jsonData);

            localStorage.studentInfo = data;
        }
        */
                });
            }
        }
    });
}
