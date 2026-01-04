// ==UserScript==
// @name         Icourse163_Auto_Full_Score_Review
// @namespace    Icourse163
// @version      0.0.4
// @description  在icourse163(中国大学MOOC)的作业自评互评中对每个题自动选择最大的分数并自动填写评语。投我以木桃，报之以琼瑶。人人为我，我为人人。
// @author       XenoAmess
// @match        https://www.icourse163.org/*
// @run-at       document-end
// @grant        none
// @supportURL   https://github.com/XenoAmess/icourse163_auto_full_score_review.git
// @downloadURL https://update.greasyfork.org/scripts/397047/Icourse163_Auto_Full_Score_Review.user.js
// @updateURL https://update.greasyfork.org/scripts/397047/Icourse163_Auto_Full_Score_Review.meta.js
// ==/UserScript==

var REFRESH_TIME = 100;
var REG = RegExp(/^http(s)?:\/\/www\.icourse163\.org\/.*\/learn\/hw.*/);
/**
 * 自动填写的评语将从COMMENT_STRINGS_LIST中随机抽取。
 * 请确保COMMENT_STRINGS_LIST中没有空项。
 * 请确保COMMENT_STRINGS_LIST中每个项数字连续。
 * 请确保COMMENT_STRINGS_LIST中至少含有一个项。
 */
var COMMENT_STRINGS_LIST = [];
COMMENT_STRINGS_LIST[0] = "好的。";

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

function doIt() {
    if (window.location.href.match(REG) == null) {
        return;
    }
    return doItNonCheck();
}

function parseFloatEx(string) {
    var res = "";
    for (var i = 0; i < string.length; i++) {
        var chr = string.charAt(i);
        if ((chr >= '0' && chr <= '9') || chr === '.') {
            res += chr;
        }
    }
    return parseFloat(res);
}

function doItNonCheck() {
    var i, j, k;

    if (!window.jQuery) {
        var oScript = document.createElement('script');
        oScript.type = "text/javascript";
        oScript.src = "//s1.hdslb.com/bfs/static/jinkela/long/js/jquery/jquery1.7.2.min.js";
        document.head.appendChild(oScript);
    }
    var scorePanelList = $("div.detail>div.s");
    for (i = 0; i < scorePanelList.length; i++) {
        var scorePanel = scorePanelList[i];
        var maxScore = -1;
        var maxIndex = -1;
        for (j = 0; j < scorePanel.children.length; j++) {
            for (k = 0; k < scorePanel.children[j].children.length; k++) {
                if (scorePanel.children[j].children[k].type === "radio") {
                    // console.log(scorePanel.children[j].children[k].value);
                    // console.log(parseFloatEx(scorePanel.children[j].children[k].value));
                    var nowScore = parseFloatEx(scorePanel.children[j].children[k].value);
                    var nowIndex = j;
                    if (maxScore < nowScore) {
                        maxScore = nowScore;
                        maxIndex = nowIndex;
                    }
                }
            }
        }
        console.log("maxIndex:" + maxIndex);
        console.log("maxScore:" + maxScore);
        if (maxIndex !== -1) {
            for (k = 0; k < scorePanel.children[maxIndex].children.length; k++) {
                if (scorePanel.children[maxIndex].children[k].type === "radio") {
                    console.log($(scorePanel.children[maxIndex].children[k]));
                    $(scorePanel.children[maxIndex].children[k]).attr('checked','true');
                }
            }
        }
    }

    var commentTextAreaList = $("textarea.j-textarea.inputtxt");
    for (i = 0; i < commentTextAreaList.length; i++) {
        var commentTextArea = commentTextAreaList[i];
        if (commentTextArea.value === undefined || commentTextArea.value === null || commentTextArea.value === "" || commentTextArea.value.length === 0) {
            commentTextArea.value = COMMENT_STRINGS_LIST[getRandomInt(COMMENT_STRINGS_LIST.length)];
        }
    }
}

(function () {
    'use strict';
    window.onload = window.setInterval(doIt, REFRESH_TIME);
})();