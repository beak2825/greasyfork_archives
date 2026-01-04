// ==UserScript==
// @name         智慧职教mooc自动刷课 （自用）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  智慧职教mooc自动刷课 自用 应该有bug 只支持搭配时间掌控着2倍速刷课
// @author       ssy_1
// @match        *://*.icve.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icve.com.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444637/%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99mooc%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%20%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/444637/%E6%99%BA%E6%85%A7%E8%81%8C%E6%95%99mooc%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%20%EF%BC%88%E8%87%AA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

var l;
var cList = document.getElementsByClassName("np-section-level np-section-level-3 signStudy cellClick");
window.onload = aaa;
// aaa();
function aaa(i = 0) {
    if (typeof(i) != "number"){
        i = 0
    }
    l = setInterval(function () {
        cList = document.getElementsByClassName("np-section-level np-section-level-3 signStudy cellClick");
        console.log("匹配到" + cList.length + "个项目");
        if (cList.length > 0) {
            // console.log(i + "aaa")
            f(i);
            return;
        }
    }, 1000);
}

function skip(n) {
    for (let i = n; i < cList.length; i++) {
        const ele = cList[i];
        var dn = ele.getAttribute("data-categoryname");
        var cm = ele.children[0].getAttribute("class");
        if (cm.indexOf("active") == -1) {
            if (dn == "pt" || dn == "视频") {
                console.log("当前为第" + i + "个项目");
                ele.children[1].setAttribute("target","");
                ele.children[1].click();
                // console.log(i + "skip")
                setTimeout(() => {
                    aaa(i + 1);
                }, 4000);
                return;
            }
        }
    }
}

function f(i) {
    clearInterval(l);
    var a = document.getElementsByClassName("np-section-level np-section-level-3 signStudy active cellClick")[0];
    if (a.getAttribute("data-categoryname") == "视频") {
        var elevideo = document.getElementsByTagName("video")[0];
        var t1 = elevideo.duration;
        var t2 = elevideo.currentTime;
        console.log('等待视频播放时间为' + (t1-t2));
        var jsq = document.getElementsByClassName("_th-item _item-xx2");
        if (jsq.length > 0) {
            document.getElementsByClassName("_th-item _item-reset")[0].click();
            jsq[0].click();
            console.log("自动2倍速播放")
        }
        // console.log(i + "f")
        setTimeout(() => {
            skip(i);
        }, (t1 - t2) * 1000 + 500);
    } else if (a.getAttribute("data-categoryname") == "pt") {
        // console.log(i + "fp")
        setTimeout(() => {
            skip(i);
        }, 1000);
    }
}

(function () {
    'use strict';
    // Your code here...
})();