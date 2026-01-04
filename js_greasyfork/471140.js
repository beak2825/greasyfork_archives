// ==UserScript==
// @name         Steam Reviews Filter
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  移除Steam商店页面的无意义评评测和点赞按钮
// @author       ChrisTitan
// @license      GNU GPLv3
// @match        https://store.steampowered.com/app/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @require      https://libs.baidu.com/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471140/Steam%20Reviews%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/471140/Steam%20Reviews%20Filter.meta.js
// ==/UserScript==

waitForKeyElements (".user_reviews_sub_header", filterComments);

function filterComments (jNode) {
    'use strict';
    // 设置需要屏蔽的评论关键词，注意引号和逗号都是英文字符
    const junks = ["猫猫", "摸一下", "点数", "牛子", "口了", "a cat", "⣿"];
    const junk_pattern = new RegExp(junks.join("|"), "i");
    // 设置是否移除点赞按钮，以防误点遭到连坐，true开启，false关闭
    const remove_like = true;

    // 开始获取评论页面元素
    let left = document.querySelectorAll("#Reviews_summary > div > div:nth-child(1)")[0];
    let left_comments = left.getElementsByClassName("review_box");
    let right = document.querySelectorAll("#Reviews_summary > div > div.rightcol.recent_reviews")[0];
    let right_comments = right.getElementsByClassName("review_box");

    let i = left_comments.length;
    while (i--) {
        if (remove_like && (left_comments[i].getElementsByClassName("control_block").length > 0)) {
            left_comments[i].getElementsByClassName("control_block")[0].remove();
        }

        if (left_comments[i].innerText.search(junk_pattern) > 0) {
            left_comments[i].remove();
        }
    }
    if ((10 - left_comments.length) > 0) {
        let left_header = left.getElementsByClassName("user_reviews_sub_header")[0].innerHTML;
        left.getElementsByClassName("user_reviews_sub_header")[0].innerHTML = left_header.replace(/&nbsp;/, "-" + (10 - left_comments.length) + "条已过滤");
    }

    let j = right_comments.length;
    let count = 0;
    while (j--) {
        if (remove_like && (right_comments[j].getElementsByClassName("control_block").length > 0)) {
            right_comments[j].getElementsByClassName("control_block")[0].remove();
        }

        if (right_comments[j].innerText.search(junk_pattern) > 0) {
            right_comments[j].remove();
            count++;
        }
    }
    if (count) {
        let right_header = right.getElementsByClassName("user_reviews_sub_header")[0].innerHTML;
        right.getElementsByClassName("user_reviews_sub_header")[0].innerHTML = right_header.replace(/$/, "-" + count + "条已过滤");
    }
}