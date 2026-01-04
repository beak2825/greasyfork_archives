// ==UserScript==
// @name         classroom自動ユーザー選択
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Google Classroomにブラウザからアクセスしたときに表示されるユーザー選択画面を自動化します
// @author       @yudai1204
// @match        https://classroom.google.com
// @match        https://classroom.google.com/u/0/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445014/classroom%E8%87%AA%E5%8B%95%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E9%81%B8%E6%8A%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/445014/classroom%E8%87%AA%E5%8B%95%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BC%E9%81%B8%E6%8A%9E.meta.js
// ==/UserScript==

(function() {
    const user = 2; //ここの値を、実際に転移したい先のURLの数字に設定してください　 https://classroom.google.com/u/ここの数字/h
    'use strict';
    window.location = `https://classroom.google.com/u/${user}/h`;
    setInterval(function(){
        const btn = document.querySelector(".uArJ5e UQuaGc.Y5sE8d");
        if(btn){
            window.location = `https://classroom.google.com/u/${user}/h`;
        }
    },100);
})();