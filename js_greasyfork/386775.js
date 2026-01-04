// ==UserScript==
// @name         沪江助手
// @namespace    沪江助手
// @version      0.3
// @description  修复播放器暂停返回按钮，修复链接跳转，登录信息丢失等问题
// @author       NJY
// @match        https://ting.hujiang.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386775/%E6%B2%AA%E6%B1%9F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/386775/%E6%B2%AA%E6%B1%9F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

/////////////////////////////////////////////////
let default_start_time = 4.5; //设定听写播放器默认开始时间
/////////////////////////////////////////////////
function main() {
    if (window.location.href.indexOf("mylisten") > 0) {
        let a_nodes = document.querySelectorAll(".pages>a");
        for (let i = 0; i < a_nodes.length; i++) {
            if (i === a_nodes.length - 1) {
                let temp = a_nodes[i].onclick.toString().replace(/(\n|\r|(\r\n)|(\u0085)|(\u2028)|(\u2029))/g, "").match(/function onclick\(event\) {(.*)}/)[1].replace("http", "https");
                a_nodes[i].setAttribute("onclick", temp);
            } else {
                a_nodes[i].href = a_nodes[i].href.replace("http", "https");
            }
        }
        return
    }
    let voaPlayerObj = window.voaPlayerObj;
    voaPlayerObj.currentTime = default_start_time;
    voaPlayerObj.savedCurrentTime = default_start_time;
    voaPlayerObj.hjPlay2 = function () {
        if (voaPlayerObj.paused) {
            voaPlayerObj.savedCurrentTime = voaPlayerObj.currentTime;
            voaPlayerObj.play();
        } else {
            voaPlayerObj.pause();
        }
    };
    voaPlayerObj.hjRepeat = function () {
        voaPlayerObj.currentTime = voaPlayerObj.savedCurrentTime;
        voaPlayerObj.play();
    };
    let ob = new MutationObserver(function () {
        let temp_nodes = document.querySelectorAll(".recommand-article-data>li>div");
        for (let i = 0; i < temp_nodes.length; i++) {
            if (!(/\/$/.test(temp_nodes[i].children[0].href))) {
                temp_nodes[i].children[0].href += "/";
            }
        }
    });
    ob.observe(document.querySelector(".recommand-article-data"), {childList: true, subtree: true});
}

main();