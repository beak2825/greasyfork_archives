// ==UserScript==
// @name         问卷星改分
// @version      0.1
// @description  更改问卷星答题的最后得分
// @author       喝杯82年代Java压压惊
// @match        *://ks.wjx.top/wjx/join/completemobile2.aspx*
// @require      http://code.jquery.com/jquery-1.11.1.min.js
// @grant        none
// @namespace https://greasyfork.org/users/207098
// @downloadURL https://update.greasyfork.org/scripts/396696/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%94%B9%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/396696/%E9%97%AE%E5%8D%B7%E6%98%9F%E6%94%B9%E5%88%86.meta.js
// ==/UserScript==

var name = "N/A";
var correctAnwser = 0;
var totalQuestion = 0;
var score = 0;
var maxScore = 0;

(function() {
    'use strict';
    $(document).ready(function() {
        // Load information from current page.
        var score_form_dom = $("div.score-form__list.clearfix");
        if(score_form_dom.length != 1 && score_form_dom.children().length != 3)
        {
            alert("问卷星改分脚本提示：无效页面");
            return;
        }
        name = $(score_form_dom.children()[0]).find("strong").text();
        score = $(score_form_dom.children()[1]).find("strong").text();
        maxScore = $(score_form_dom.children()[1]).find("em").text().replace("/", "");
        correctAnwser = $(score_form_dom.children()[2]).find("strong").text();
        totalQuestion = $(score_form_dom.children()[2]).find("em").text().replace("/", "");
        var topDiv = $("div#divTopHeight");
        topDiv.append("<button id=\"wjxcc_automaxScore\">一键满分</button>");
        $("button#wjxcc_automaxScore").click(function() {
            if(wjxChangeScore(totalQuestion, totalQuestion, maxScore, maxScore))
            {
                alert("问卷星改分脚本提示：已改成满分");
            }
            else
            {
                alert("问卷星改分脚本提示：改分失败");
            }
        });
    });
}) ();

function wjxChangeScore(pCorrectAnwser, pTotalQuestion, pScore, pMaxScore) {
    var score_form_dom = $("div.score-form__list.clearfix");
    if(score_form_dom.length != 1 && score_form_dom.children().length != 3)
    {
        return false;
    }
    $(score_form_dom.children()[1]).find("strong").text(pScore);
    $(score_form_dom.children()[1]).find("em").text("/" + pMaxScore);
    $(score_form_dom.children()[2]).find("strong").text(pCorrectAnwser);
    $(score_form_dom.children()[2]).find("em").text("/" + pTotalQuestion);
    return true;
}
