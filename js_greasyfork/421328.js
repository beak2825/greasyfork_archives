// ==UserScript==
// @name         AniWatch JP Title
// @namespace    https://greasyfork.org/scripts/421328
// @version      1.0.8
// @description  Change AniWatch document.title to JP title
// @author       eterNEETy
// @match        https://aniwatch.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421328/AniWatch%20JP%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/421328/AniWatch%20JP%20Title.meta.js
// ==/UserScript==

var jp_titles = {
    3: '進撃の巨人',
    41: 'ようこそ実力至上主義の教室へ',
    501: '進撃の巨人 2',
    536: 'PSYCHO-PASS サイコパス2',
    799: 'メイドインアビス',
    848: '賭ケグルイ',
    906: 'メイドインアビス 深き魂の黎明',
    943: 'メイドインアビス 旅立ちの夜明け',
    944: 'メイドインアビス 放浪する黄昏',
    1092: '転生したらスライムだった件 第2期',
    1099: '約束のネバーランド2',
    1293: '進撃の巨人 The Final Season',
    1800: '虚構推理',
    1807: '無職転生 ～異世界行ったら本気だす～',
    1868: 'ゆるキャン△ SEASON 2',
    2179: 'ログ・ホライズン　円卓崩壊',
    2240: 'ヱヴァンゲリヲン新劇場版:破',
    2579: 'Re:ゼロから始める異世界生活 2nd Season Part 2',
    2738: 'いわかける！ -Sport Climbing Girls-',
    2839: 'ホリミヤ',
    3109: 'ウマ娘 プリティーダービー Season 2',
    3113: 'のんのんびより のんすとっぷ',
}
var q_title = '[ng-bind="search.anime.title"]';

function checkExist(query,qid=0,hidden_ok=false) {
    let el_exist = false;
    if (document.querySelectorAll(query).length > qid){
        if (hidden_ok) {
            el_exist = true;
        } else if (document.querySelectorAll(query)[qid].getBoundingClientRect().width > 0 && document.querySelectorAll(query)[qid].getBoundingClientRect().height > 0) {
            el_exist = true;
        }
    }
    return el_exist;
}
function checkEl(query,qid=0,callback=false,hidden_ok=false) {
    let old_top = -1;
    let old_left = -1;
    let loop_checkEl = setInterval(function() {
        console.log("checkEl: "+query+"["+qid+"]");
        if (checkExist(query,qid,hidden_ok)) {
            if (hidden_ok) {
                clearInterval(loop_checkEl);
                if (typeof callback == "function") {
                    callback();
                }
            } else if (old_top==document.querySelectorAll(query)[qid].getBoundingClientRect().top && old_left==document.querySelectorAll(query)[qid].getBoundingClientRect().left) {
                clearInterval(loop_checkEl);
                if (typeof callback == "function") {
                    callback();
                }
            } else {
                old_top = document.querySelectorAll(query)[qid].getBoundingClientRect().top;
                old_left = document.querySelectorAll(query)[qid].getBoundingClientRect().left;
            }
        }
    }, 200);
}
function changeTitle(){
    if (document.location.pathname.indexOf('/anime/')>=0) {
        console.log("changeTitle");
        var url_path = document.location.pathname.replace('/anime/','');
        console.log("url_path:", url_path);
        var anime_id;
        if (url_path.indexOf('/')>=0) {
            anime_id = url_path.substring(0,url_path.indexOf('/'));
        } else {
            anime_id = url_path;
        }
        console.log("anime_id:", anime_id);
        var title = document.querySelector(q_title).innerText;
        var jp_title = jp_titles[anime_id];
        console.log("title:", title);
        console.log("jp_title:", jp_title);
        if (jp_title != undefined) {
            document.title = document.title.replace(title, jp_title);
        }
    }
}
function listenNetwork() {
    console.log("listenNetwork");
    if (document.location.pathname.indexOf('/anime/')>=0) {
        checkEl(q_title,0,changeTitle,true);
    }
    let origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
        this.addEventListener('load', function() {
            if(this.responseURL.indexOf("aniwatch.me")>=0){
                let rep;
                if (document.location.pathname.indexOf('/anime/')>=0) {
                    checkEl(q_title,0,changeTitle,true);
                }
                // console.log(this);
            }
        });
        origOpen.apply(this, arguments);
    };
}


(function() {
    'use strict';
    checkEl(q_title,0,listenNetwork,true);
})();