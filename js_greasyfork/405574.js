// ==UserScript==WeiBO
// @name         漂亮weibo
// @namespace    http://www.thdong.top/
// @version      1.0
// @description  移除weibo烦人的界面元素
// @author       huidt
// @icon         https://ythdong.gitee.io/blog_image/%E7%8E%A9%E8%B6%A3/huidt.jpg
// @match        *://*.weibo.com/*
// @grant        none
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/405574/%E6%BC%82%E4%BA%AEweibo.user.js
// @updateURL https://update.greasyfork.org/scripts/405574/%E6%BC%82%E4%BA%AEweibo.meta.js
// ==/UserScript==


// 注：使用中遇到问题可在 http://www.thdong.top/index.php/start-page.html 找到我的邮箱，注明来意以及遇到的问题。
// 操作：在微博个人以及热门微博页面按 esc 键可以调出弹框输入关键字，多个关键字请用空格隔开，回车保存在 Chrome 的 localStorage 中，如果你误操作或者想修改关键词，请打开 Chrome 控制台，按Ctrl + Shift + p 调出命令行 输入Show Application 回车，打开local Storage 即可自由修改。
(function () {
    'use strict';
    window.setTimeout(weiBoRemove, 500);

    function weiBoRemove() {
        if (document.querySelector("#v6_pl_rightmod_rank")) {
            document.querySelector("#v6_pl_rightmod_rank").remove();
        }
        if (document.querySelector("#v6_pl_rightmod_recominfo")) {
            document.querySelector("#v6_pl_rightmod_recominfo").remove();
        }
        if (document.querySelector("#v6_pl_rightmod_attfeed")) {
            document.querySelector("#v6_pl_rightmod_attfeed").remove();

        }
        if (document.querySelector("#v6_trustPagelet_recom_member")) {
            document.querySelector("#v6_trustPagelet_recom_member").remove();

        }
        if (document.querySelector("#v6_pl_rightmod_noticeboard")) {
            document.querySelector("#v6_pl_rightmod_noticeboard").remove();

        }
        if (document.querySelector("#v6_pl_ad_yaoyaofans")) {
            document.querySelector("#v6_pl_ad_yaoyaofans").remove();

        }
        if (document.querySelector("#plc_bot > div.WB_footer.S_bg2 > div.footer_link.clearfix")) {
            document.querySelector("#plc_bot > div.WB_footer.S_bg2 > div.footer_link.clearfix").remove();
        }
        if (document.querySelector("#v6_pl_ad_yaoyaofans > div")) {
            document.querySelector("#v6_pl_ad_yaoyaofans > div").remove();
        }
        if (document.querySelector("div [feedtype='ad']")) {
            document.querySelector("div [feedtype='ad']").remove();
        }
    }

    let InterVal = self.setInterval(weiBoVoteRemove, 1500);

    function weiBoVoteRemove() {
        // 下面三个功能重复，都是移除投票微博，一起用无所谓双保险
        if (document.querySelector("div [class='WB_card_vote S_bg1']")) {
            document.querySelector("div [class='WB_card_vote S_bg1']").parentNode.parentNode.parentNode
                .parentNode.parentNode.remove();
        } else if (document.querySelector("div [class='vote_tit']"))
            document.querySelector("div [class='vote_tit']").parentNode.parentNode.parentNode.parentNode
                .parentNode.parentNode.remove();

    }
})();

Object.prototype.push = function (key, value) {
    this[key] = value;
}

// 关键字存储

let keyWord = JSON.parse(localStorage.getItem("keyWord"));
window.localStorage.setItem("keyWord", JSON.stringify(keyWord));
document.addEventListener("keydown", function (e) {
    if (e.keyCode == 27) {
        let word = prompt("请输入屏蔽词(空格隔开)：").split(" ");
        let words = [];
        for (let i = 0; i < word.length; i++) {
            words[i] = "#" + word[i] + "#";
            let str = words[i];
            keyWord[str] = "Huidt";
        }
    }
    window.localStorage.setItem("keyWord", JSON.stringify(keyWord));
    keyWord = JSON.parse(localStorage.getItem("keyWord"));

    // 选中话题元素
    let topic = document.getElementsByClassName("a_topic");
    for (let i = 0; i < topic.length; i++) {
        if (JSON.parse(localStorage.getItem("keyWord"))[topic[i].innerHTML]) {
            topic[i].parentNode.parentNode.parentNode.parentNode.remove();
        }
    }
}, false);


let keyWordInterVal = self.setInterval(function () { // 选中话题元素
    let topic = document.getElementsByClassName("a_topic");
    for (let i = 0; i < topic.length; i++) {
        if (JSON.parse(localStorage.getItem("keyWord"))[topic[i].innerHTML]) {
            topic[i].parentNode.parentNode.parentNode.parentNode.remove();
        }
    }
}, 3000);