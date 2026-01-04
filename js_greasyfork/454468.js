// ==UserScript==
// @name         趣词助手
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  趣词助手 - 发音、重点词提示
// @author       wxl
// @match        *://*.quword.com/ciyuan/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454468/%E8%B6%A3%E8%AF%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/454468/%E8%B6%A3%E8%AF%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

var h2 = document.getElementsByTagName("h2");

var new_element = document.createElement('link');
new_element.setAttribute('rel', 'stylesheet');
new_element.setAttribute('href', '/lib/bootstrap/css/bootstrap.min.css');
document.body.appendChild(new_element);


(function() {
    'use strict';
    for (var i = 0; i < h2.length; i++) {
        var word = h2[i].childNodes[0].innerText;
        // voice
        var audio = document.createElement('audio');
        audio.controls = true;
        audio.src = `http://dict.youdao.com/dictvoice?type=0&audio=${word}`;
        h2[i].appendChild(audio);

        var xhr = new XMLHttpRequest();
        getWordData(i, xhr, word);
    }

    var p = document.getElementsByTagName("p");
    for (i = 0; i < p.length; i++) {
        if (p[i].childNodes && p[i].childNodes[0] && p[i].childNodes[0].tagName == "A") {
            word = p[i].childNodes[0].innerText;
            audio = document.createElement('audio');
            audio.controls = true;
            audio.src = `http://dict.youdao.com/dictvoice?type=0&audio=${word}`;
            p[i].appendChild(audio);
        }
    }

    console.log("趣词助手加载完成");
})();


function getWordData(i, xhr, word) {
    xhr.open("get", "/w/" + word);
    xhr.send();
    xhr.onload = function () {
        var search = xhr.responseText;
        var regTOEFL = />TOEFL</gi;
        var regITELS = />IELTS</gi;
        var regGRE = />GRE</gi;
        var isTOEFL = 0, isITELS = 0, isGRE = 0
        if ((search.match(regTOEFL) || []).length > 0) {
            isTOEFL = 1;
        }
        if ((search.match(regITELS) || []).length > 0) {
            isITELS = 1;
        }
        if ((search.match(regGRE) || []).length > 0) {
            isGRE = 1;
        }
        if (isTOEFL + isITELS + isGRE == 0) {
            var parent = h2[i].parentNode;
            console.log(parent.childNodes.length);
            for (var j = 0; j < parent.childNodes.length; j++) {
                if (parent.childNodes[j].tagName == "H2" && parent.childNodes[j].childNodes[0].innerText == word) {
                    parent.childNodes[j].style.display = "none";
                    for (var k = j + 1; k < parent.childNodes.length && parent.childNodes[k].tagName != "H2"; k++) {
                        parent.childNodes[k].style.display = "none";
                    }
                    break;
                }
            }
        } else {
            if (isTOEFL == 1) {
                var span = document.createElement("span");
                span.setAttribute("class", "label label-success");
                span.innerText = "TOEFL"
                h2[i].appendChild(span);
            }
            if (isITELS == 1) {
                span = document.createElement("span");
                span.setAttribute("class", "label label-info");
                span.innerText = "ITELS"
                h2[i].appendChild(span);
            }
            if (isGRE == 1) {
                span = document.createElement("span");
                span.setAttribute("class", "label label-warning");
                span.innerText = "GRE"
                h2[i].appendChild(span);
            }
        }
    }
}