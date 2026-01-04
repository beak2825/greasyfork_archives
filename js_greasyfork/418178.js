// ==UserScript==
// @name         中国大学MOOC 字幕提取
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  提取视频字幕文件，显示于视频下方，便于搜索内容
// @author       r4phael
// @match        *://www.icourse163.org/learn/*
// @match        *://www.icourse163.org/spoc/learn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418178/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%20%E5%AD%97%E5%B9%95%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/418178/%E4%B8%AD%E5%9B%BD%E5%A4%A7%E5%AD%A6MOOC%20%E5%AD%97%E5%B9%95%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function (open) {
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener("readystatechange", function () {
            if (this.responseURL.indexOf('CourseBean.getLessonUnitLearnVo.dwr') >= 0) {
                var data = this.responseText;
                var srtUrl = data.match("s0\.url=\"(.*)\";");
                var httpRequest = new XMLHttpRequest();
                httpRequest.open('GET', srtUrl[1], true);
                httpRequest.send();
                httpRequest.onreadystatechange = function () {
                    if (httpRequest.readyState == 4 && httpRequest.status == 200) {
                        var srt = httpRequest.responseText;
                        var lines = srt.split("\n");
                        var s = "";
                        var srtList = []
                        console.log(lines);
                        for (var i = 0; i<lines.length; i+=4) {
                            if (lines[i+2] == undefined) continue;
                            if ((lines[i+2].substr(-2, 1) == '.' || lines[i+2].substr(-2, 1) == '!' || lines[i+2].substr(-2, 1) == '?') && (lines[i+6] == undefined || lines[i+6].substr(0, 1) != ' ')) {
                                srtList.push(s + lines[i+2]);
                                s = "";
                            }
                            else s += lines[i+2];
                        }
                        if (s != "") srtList.push(s);

                        var div, newElement, new_div;
                        div = document.getElementById('courseLearn-inner-box').children[0];
                        new_div = document.getElementById('srt_div');
                        if (new_div) {
                            new_div.innerHTML = "";
                        } else {
                            new_div = document.createElement('div')
                            new_div.setAttribute("id", "srt_div");
                        }
                        if (div) {
                            for (i = 0; i<srtList.length; i++) {
                                newElement = document.createElement('p');
                                newElement.innerHTML = srtList[i];
                                new_div.appendChild(newElement);
                            }
                            div.parentNode.insertBefore(new_div, div.nextSibling);
                        }
                    }
                };
            }

        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);