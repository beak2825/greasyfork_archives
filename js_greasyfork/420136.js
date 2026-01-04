// ==UserScript==
// @name         AtCoder Traffic Light
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  AtCoderの問題のページから直接解説のページに行くことができます。
//               問題横のボタンが赤の場合:読み込み中です待っていてください。
//               問題横のボタンが黄の場合:全体解説のみありました。
//               問題横のボタンが緑の場合:この問題の解説がありました。
// @author       soraie
// @match        https://atcoder.jp/contests/*/tasks/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420136/AtCoder%20Traffic%20Light.user.js
// @updateURL https://update.greasyfork.org/scripts/420136/AtCoder%20Traffic%20Light.meta.js
// ==/UserScript==


/* ユーザー設定項目 */

const color = {
    "green":"#2cf44c",    //緑
    "yellow":"#fff25e",   //黄色
    "red":"#ff5757"       //赤
};

/* 設定項目終わり */



//各解説のサイト
//1.各問題解説:https://atcoder.jp/contests/{contest}/editorial/{number}
//2.全体解説pdf:https://img.atcoder.jp/{contest}/editorial.pdf
//3.スライド:https://www.slideshare.net/{chokudai}/{contest}
//ユーザー解説:他
//全体解説Youtube:https://youtube.com/{any}


if(moment() < endTime)return;//コンテスト中
let btn = $(".btn.btn-default.btn-sm").eq(0);
btn.css("background-color",color.red);
btn.css("pointer-events","none");
(function() {
    'use strict';
    let now = location.href.split("/"),url = `https://1d878d9b.us-south.apigw.appdomain.cloud/proxy?url=https://atcoder.jp/contests/${now[4]}/tasks/${now[6]}/editorial?lang=ja`;
    $.ajax(url).done((data) => {
        let link = data.response.split("コンテスト全体の解説");
        link[0] = link[0].match(/<a.*公式解説.*a>|<a.*ユーザ.*a>/g);link[1] = link[1].match(/<a.*公式解説.*a>|<a.*ユーザ.*a>/g);
        let final = "";//最終的なボタンのリンク
        if(link[0] !== null){
            for(let i = 0;i < link[0].length;i++){
                let ele = link[0][i].match(/href=".*".*target/)[0];
                ele = ele.replace(/href="|".*target/g,"");
                if(ele.match(/\/editorial\//) !== null){
                    final = ele;
                    break;
                }
                final = ele;
            }
            btn.attr("href",final);btn.attr("target","_blank");btn.css("pointer-events","");
            btn.css("background-color",color.green);
        }
        else{
            if(link[1] === null){
                //もう何もできないので潔く負けを認める
                btn.text("解説無し");
            }
            for(let i = 0;i < link[1].length;i++){
                let ele = link[1][i].match(/href=".*".*target/)[0];
                ele = ele.replace(/href="|".*target/g,"");
                if(ele.match(/editorial\.pdf/) !== null){
                    final = ele;
                    break;
                }
                final = ele;
            }
            btn.attr("href",final);btn.attr("target","_blank");btn.css("pointer-events","");
            btn.css("background-color",color.yellow);
        }
    })
})();