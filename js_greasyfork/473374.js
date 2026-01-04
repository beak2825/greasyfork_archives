// ==UserScript==
// @name         なろう・カクヨム閲覧設定
// @namespace    http://tampermonkey.net/
// @version      2.00
// @description  なろうとカクヨムの書式を整形して読みやすくします。
// @author       You
// @match        https://kakuyomu.jp/works/*/episodes/*
// @match        https://ncode.syosetu.com/*
// @icon         none
// @grant        none
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/473374/%E3%81%AA%E3%82%8D%E3%81%86%E3%83%BB%E3%82%AB%E3%82%AF%E3%83%A8%E3%83%A0%E9%96%B2%E8%A6%A7%E8%A8%AD%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/473374/%E3%81%AA%E3%82%8D%E3%81%86%E3%83%BB%E3%82%AB%E3%82%AF%E3%83%A8%E3%83%A0%E9%96%B2%E8%A6%A7%E8%A8%AD%E5%AE%9A.meta.js
// ==/UserScript==

const OPTION_1 = true; // 空行を圧縮する
const OPTION_2 = true; // 地の文・会話文間に空行を挿入
const OPTION_3 = true; // 行頭空白を挿入、または削除する
const OPTION_4 = true; // 三点リーダを修正する
const OPTION_5 = true; // 前書き・後書きを折りたたむ（なろう）

(function() {
    'use strict';
    let targets = document.querySelectorAll("div.widget-episodeBody p, div#novel_honbun p, div#honbun p");
    for(let i = 0; i < targets.length; i++){
        if(OPTION_1 && targets[i].innerHTML.match(/(<br.*>|^[ 　]+$)/)){
            // 空行削除
            targets[i].remove();
            continue;
        }
        // 校正
        // セリフ内改行を削除
        if(targets[i].innerHTML.match(/^[「\(（『【《]/) && !targets[i].innerHTML.match(/[」\)）』》】]/)){
            let nex_elm = targets[i].nextElementSibling;
            if(nex_elm != null) {
                nex_elm.innerHTML = targets[i].innerHTML + nex_elm.innerHTML.replace(/^[ 　]/, '');
                targets[i].remove();
                continue;
            }
        }
        // 各種書式整形
        targets[i].innerHTML = targets[i].innerHTML
            .replace(/\(/g, '（')// 半角括弧を全角に置換
            .replace(/\)/g, '）')// 半角括弧を全角に置換
            .replace(/^[ 　]+|[ 　]+$/, '')// 行頭/行末空白を削除
            .replace(/([\?\!？！⁉︎♪])(?![」）』 　\?\!？！⁉︎♪]|$)/g, '$1　')// 感嘆符と疑問符の組版処理
            .replace(/([\?？])+/g, '$1')// 連続した符号の削除
            .replace(/([\!！])+/g, '$1')// 連続した符号の削除
            .replace(/([\!！][\?？]|[\?？][\!！])+/g, '$1')// 連続した符号の削除
            .replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) { return String.fromCharCode(s.charCodeAt(0) - 0xFEE0); })// 全角数字を半角に変換
            .replace( /(\d)(?=(\d\d\d)+(?!\d))/g, '$1,' )// 4桁以上の数字にカンマ付け
        ;
        // 字下げ（行頭空白）を挿入
        if(OPTION_3){
            targets[i].innerHTML = targets[i].innerHTML
                .replace(/^(?![ 　「\(（『【《◆◇●○■□▽▼△▲★☆・×＊-－‐―ー])/, '　')// 字下げ
        }
        // 三点リーダもどきを修正する
        if(OPTION_4){
            targets[i].innerHTML = targets[i].innerHTML
                .replace(/…+/g, '……')// 長すぎる三点リーダを圧縮
                .replace(/(?<!<rt>[・。.]*?)[・。.]{2,}(?![・。.]*?<\/rt>)/g, '……');// 三点リーダもどきを修正（傍点は除外）
        }
    }

    targets = document.querySelectorAll("div.widget-episodeBody p, div#novel_honbun p, div#honbun p");
    for(let i = 0; i < targets.length; i++){
        let pre_elm = targets[i].previousElementSibling;
        if(pre_elm == null) continue;

        // 会話文、地の文、記号のみの行（セパレータ行）それぞれの間に空行を挿入
        const regexp = /^[「（『【《].*[」）』》】]$/;
        if(OPTION_2 &&( targets[i].innerHTML.match(regexp) && !pre_elm.innerHTML.match(regexp) ||
           !targets[i].innerHTML.match(regexp) && pre_elm.innerHTML.match(regexp) ||
           targets[i].innerHTML.match(/^[◆◇●○■□▽▼△▲★☆・×＊-－‐―ー]+/) ||
           pre_elm.innerHTML.match(/^[◆◇●○■□▽▼△▲★☆・×＊-－‐―ー]+/)
          )){
            let new_blank = document.createElement("p");
            new_blank.innerHTML = "<br>";
            targets[i].before(new_blank);
        }
    }

    // 前書き後書き 折りたたみ
    if(OPTION_5){
        targets = document.querySelectorAll("div#novel_p, div#novel_a");
        for(let i = 0; i < targets.length; i++){
            let text = targets[i].innerHTML;
            const clickText = ()=>{
                targets[i].innerHTML = text;
                targets[i].removeEventListener('click', clickText);
            };
            targets[i].addEventListener('click', clickText);
            targets[i].innerHTML = (targets[i].id == "novel_p"? "▼　前書きを表示する":"▼　後書きを表示する");
        }
    }


})();