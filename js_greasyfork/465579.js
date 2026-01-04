// ==UserScript==
// @name         topicSearch
// @namespace    sqrtwo
// @version      0.6
// @license      MIT
// @description  unofficial bgm topic search service
// @author       徒手开根号二
// @match        https://bgm.tv/group/*
// @match        https://bangumi.tv/group/*
// @match        https://chii.in/group/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465579/topicSearch.user.js
// @updateURL https://update.greasyfork.org/scripts/465579/topicSearch.meta.js
// ==/UserScript==

const ANCHOR_1 = '#columnB';
const ANCHOR_2 = '#columnInSubjectB';
const ANCHOR_3 = 'div.columns';
const API_URL = 'aHR0cHM6Ly9lYXN0YXNpYS5henVyZS5kYXRhLm1vbmdvZGItYXBpLmNvbS9hcHAvcHJldnBvc3QtanB6cW0vZW5kcG9pbnQvc2VhcmNoP2tleXdvcmRzPQ==';
const PAYLOAD = 'eyJhcGkta2V5IjogIjBTWDRmUTVldWhSbFRNWHRNM3dwbXY5ODBsUzlJd08wNkI2U0RyejBLVTdaOTdHNFVsUld4dmV4c0dOVE1mOFcifQ==';

function buildPrompt(style, lyrics) {
    return '<h2 style="margin-bottom: -4px; padding-top: 7px;  height:auto; line-height:1.5;' + style + '">' + lyrics + '</h2>';
}
const PLACEHOLDER = buildPrompt('', '&nbsp;Loading ...');
const ERRORINFO = buildPrompt('text-align:right;', '<i>服务器正在ICU抢救中<br>试试 <a class="l" target="_blank" href="https://cse.google.com/cse?cx=008561732579436191137:pumvqkbpt6w#gsc.tab=0&gsc.q=">Google Programmable Search</a></i>');
const ZERORECORD = buildPrompt("text-align:right;", "<i>你将遇到的不幸，<br>是你所蹉跎时间的报应</i>");
const TRYGOOGLE = buildPrompt("text-align:right;", '<i>没有查询到相关主题<br>试试 <a class="l" target="_blank" href="https://cse.google.com/cse?cx=008561732579436191137:pumvqkbpt6w#gsc.tab=0&gsc.q=">Google Programmable Search</a></i>')

function buildResult(topics) {
    if (topics.length == 0) return TRYGOOGLE;
    let ret =`
    <div style="margin:20px 1px 0px 1px;  z-index:20;">
    <table border="0" cellpadding="0" cellspacing="0">
    <tbody">`;
    for (let i in topics) {
        ret += '<div style="margin-top: 5px; line-height:1.2;"><a href="/group/topic/' +
            topics[i].id + '" target="_blank">' +
            topics[i].title + '</a><br><small class="time">' +
            topics[i].lastpost + '</small></div>';
    }
    ret += '</tbody></table></div>';
    return ret;
}

function addInputs(){
    const new_panel =
`
<div class="SidePanel png_bg clearit" style="">
    <h2>小组话题搜索</h2>
    <div style="margin-top:5px; display: flex;">
    <input id="mySearchInput" value="" class="searchInputL" type="text"
        style="min-width:60px;  padding:0px 7px; height:26px;" ></th>
    <input id="mySearchBtn" class="searchBtnL" title="Search" value="搜索" type="button"
        style="margin-left: 8px; height:30px; padding:0px 9px; cursor:pointer;">
    </div>
    <hr class="board" style="margin-top: 10px; margin-bottom:-11px; width:99%;">
    <div id="searchResultDiv" style="margin-top:10px; width:100%; " hidden>` +
      PLACEHOLDER +
'</div></div>';

    $(ANCHOR_1).append(new_panel);
    if ($(ANCHOR_1).length == 0) {
        $(ANCHOR_2).append(new_panel);
        if ($(ANCHOR_2).length == 0) {
            const new_column = '<div id="columnB" class="column">' + new_panel
            + '</div>';
            $(ANCHOR_3).append(new_column);
        }
    }
}

function bindBtns() {
    const btn = $('#mySearchBtn');
    const keywords = $('#mySearchInput');
    const resultDiv = $('#searchResultDiv');
    btn.on('click', function(){
        const query = keywords.attr('value');
        if (query == '') return;
        resultDiv.html(PLACEHOLDER);
        if (resultDiv.is(':hidden')) {
            resultDiv.slideDown();}
        triggerQuery(query, resultDiv);
    });
}

function triggerQuery(keywords, parent) {
    const url = atob(API_URL) + keywords;
    //console.log(keywords);
    $.ajax({
        timeout: 8000,
        crossDomain: true,
        CORS: true,
        dataType: 'json',
        contentType: 'application/json',
        type: 'POST',
        url: url,
        data : atob(PAYLOAD),
        success: function(resp) {
            //console.log(resp);
            parent.html(buildResult(resp));
        },
        error: function(resp) {
            console.warn("[bgm_topicSearch] api fails");
            parent.html(ERRORINFO);
        }
    });
}

addInputs();
bindBtns();