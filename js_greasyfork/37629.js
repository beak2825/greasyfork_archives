// ==UserScript==
// @name         Tell Me More!
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  用于在 Bangumi 目录页与排行榜页显示更多信息
// @author       AnoZZ
// @match        *://bgm.tv/anime/browser*
// @match        *://bgm.tv/anime/list*
// @match        *://bgm.tv/index/*
// @match        *://bangumi.tv/anime/browser*
// @match        *://bangumi.tv/anime/list*
// @match        *://bangumi.tv/index/*
// @match        *://chii.in/anime/browser*
// @match        *://chii.in/anime/list*
// @match        *://chii.in/index/*
// @icon         http://bgm.tv/img/favicon.ico
// @run-at       document-end
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-3.2.1.slim.min.js
// @downloadURL https://update.greasyfork.org/scripts/37629/Tell%20Me%20More%21.user.js
// @updateURL https://update.greasyfork.org/scripts/37629/Tell%20Me%20More%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var pathname = window.location.pathname;
    var page = pathname.split('/')[1];
    if(page == "anime"){
        page = pathname.split('/')[2];
    }

    GM_addStyle(`
        .tmm-detail {
            float:left;
            box-shadow: 1px 1px 1px #888888;
            height:12px;
        }
        .tmm-left {
            border-top-left-radius:5px;
            border-bottom-left-radius:5px;
        }
        .tmm-right {
            border-top-right-radius:5px;
            border-bottom-right-radius:5px;
        }
        .tmm-detail .tmm-tooltip {
            background: #fff;
            bottom: -16px;
            display: inline;
            font-size: 8px;
            padding: 5px;
            position: relative;
            opacity: 0;
            box-shadow: 1px 1px 1px #888888;
            z-index: 1;
            white-space: nowrap;
            text-align: center;
            transition: opacity 0.5s;
        }
        .tmm-detail .tmm-tooltip:after {
            border-left: solid transparent 5px;
            border-right: solid transparent 5px;
            border-bottom: solid #fff 5px;
            top: -5px;
            content: " ";
            height: 0;
            left: 50%;
            margin-left: -5px;
            position: absolute;
            width: 0;
            z-index: 1;
        }
        .tmm-detail:hover .tmm-tooltip {
            opacity: 1;
        }
    `);

    var items = $('li.item');
    for(var i=0; i<items.length; i++){
        var item = items[i];
        var url = $(item).children('a')[0].href;
        var id=item.id;
        var urlBreak = url.split('/');
        var subjectId = urlBreak[urlBreak.length-1];
        var valueLocal = JSON.parse(localStorage.getItem("bgm_"+subjectId));
        if (!valueLocal || valueLocal.expires < Date.now()) {
            localStorage.removeItem("bgm_"+subjectId);
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                headers: {
                    'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                    'Accept': 'application/atom+xml,application/xml,text/xml',
                },
                onload: callback(id, page, subjectId)
            });
        }else {
            draw(valueLocal.want, valueLocal.on, valueLocal.ever, valueLocal.leave,
                valueLocal.drop, valueLocal.rank, valueLocal.score, id, page);
        }
    }

    function callback(id, page, subjectId){
        return function(data){
            var stat = $(data.responseText).find('div#subjectPanelCollect span.tip_i a');
            var want = 0, on = 0, ever = 0, leave = 0, drop = 0;
            for (var i = 0; i < stat.length; i++) {
                if (stat[i].innerText.search('想看') > -1) {
                    want = parseInt(stat[i].innerText);
                }else if (stat[i].innerText.search('在看') > -1) {
                    on = parseInt(stat[i].innerText);
                }else if (stat[i].innerText.search('看过') > -1) {
                    ever = parseInt(stat[i].innerText);
                }else if (stat[i].innerText.search('搁置') > -1) {
                    leave = parseInt(stat[i].innerText);
                }else if (stat[i].innerText.search('抛弃') > -1) {
                    drop = parseInt(stat[i].innerText);
                }
            }
            var rank, score;
            var rank_score = $(data.responseText).find('div.global_score');
            rank = rank_score.find('small')[1].innerText;
            score = rank_score.find('span.number')[0].innerText;
            var exp = new Date();
            localStorage.setItem(
                "bgm_"+subjectId,
                JSON.stringify({
                    "want": want,"on": on,"ever": ever,"leave": leave,
                    "drop": drop,"rank": rank,"score": score,
                    expires: exp.getTime() + 7 * 24 * 60 * 60 * 1000
                })
            );
            draw(want, on, ever, leave, drop, rank, score, id, page);
        };
    }

    function draw(want, on, ever, leave, drop, rank, score, id, page){
        var count = (want + on + ever + leave + drop)/100;
        if(page != "browser"){
            $(  '<div style="float:right;padding-right:50px;">'+
                '<span style="color:#666">Rank: ' + rank + '&nbsp;&nbsp;</span>'+
                '<span style="color:#666">Score: ' + score + '</span></div>'
            ).insertAfter($('#'+id).find('div.inner h3 a'));
        }
        $(  '<div style="width:auto;padding-top:3px;max-width:550px">'+
            '<div class="tmm-detail tmm-left" style="width:'+ (want/count).toString()+
            '%;background:#22cefe;">&nbsp;<div class="tmm-tooltip">' + (want).toString()+
            '人想看</div></div><div class="tmm-detail" style="width:'+ (on/count).toString()+
            '%;background:#7bf08a;">&nbsp;<div class="tmm-tooltip">' + (on).toString()+
            '人在看</div></div><div class="tmm-detail" style="width:'+ (ever/count).toString()+
            '%;background:#ffc233;">&nbsp;<div class="tmm-tooltip">' + (ever).toString()+
            '人看过</div></div><div class="tmm-detail" style="width:'+ (leave/count).toString()+
            '%;background:#ff9124;">&nbsp;<div class="tmm-tooltip">'+ (leave).toString()+
            '人搁置</div></div><div class="tmm-detail tmm-right" style="width:'+ (drop/count).toString()+
            '%;background:#ff3d67;">&nbsp;<div class="tmm-tooltip">'+ (drop).toString()+
            '人抛弃</div></div><div style="clear:both;"/></div>'
        ).insertAfter($('#'+id + ' div.inner').children().last());
    }

    $('.tmm-detail').hover(function(){
        var tooltip = $(this).children().first();
        var pos =$(this).offset().left + ($(this).width() - tooltip.width()) / 2;
        tooltip.offset({ left: pos });
    });
})();
