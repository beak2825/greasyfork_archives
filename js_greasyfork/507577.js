// ==UserScript==
// @name         【岐大病院】PCMS環境へリダイレクト
// @namespace    http://tampermonkey.net/
// @version      2024-09-30
// @description  岐大病院HPへのアクセス時、PowerCMS環境のURLへリダイレクトします（URLのホスト名の後ろに"/pcms-test"を付加します）。
// @author       若松一樹
// @match        https://www.hosp.gifu-u.ac.jp/**
// @exclude      https://www.hosp.gifu-u.ac.jp/origin/1naika/**
// @exclude      https://www.hosp.gifu-u.ac.jp/origin/2geka/**
// @exclude      https://www.hosp.gifu-u.ac.jp/origin/bumon/**
// @exclude      https://www.hosp.gifu-u.ac.jp/origin/cct/**
// @exclude      https://www.hosp.gifu-u.ac.jp/origin/icc/**
// @exclude      https://www.hosp.gifu-u.ac.jp/origin/intractable_disease_workshop/**
// @exclude      https://www.hosp.gifu-u.ac.jp/origin/masui/**
// @exclude      https://www.hosp.gifu-u.ac.jp/origin/naishikyou/**
// @exclude      https://www.hosp.gifu-u.ac.jp/origin/nurse/**
// @exclude      https://www.hosp.gifu-u.ac.jp/origin/radiology/**
// @exclude      https://www.hosp.gifu-u.ac.jp/origin/seikei/**
// @exclude      https://www.hosp.gifu-u.ac.jp/cgi-bin/**
// @exclude      https://www.hosp.gifu-u.ac.jp/pcms/cgi-bin/**
// @icon         https://www.hosp.gifu-u.ac.jp/img/favicon-32x32.png
// @grant        GM_openInTab
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/507577/%E3%80%90%E5%B2%90%E5%A4%A7%E7%97%85%E9%99%A2%E3%80%91PCMS%E7%92%B0%E5%A2%83%E3%81%B8%E3%83%AA%E3%83%80%E3%82%A4%E3%83%AC%E3%82%AF%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/507577/%E3%80%90%E5%B2%90%E5%A4%A7%E7%97%85%E9%99%A2%E3%80%91PCMS%E7%92%B0%E5%A2%83%E3%81%B8%E3%83%AA%E3%83%80%E3%82%A4%E3%83%AC%E3%82%AF%E3%83%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // リダイレクト済みの場合なにもしない
    if (location.pathname.includes('pcms-test')) return;

    const newUrl = location.protocol + '//' + location.host + '/pcms-test' + location.pathname;
    console.log(newUrl);

    // 別タブで開く
    // GM_openInTab(const newUrl);
    // 現在のタブで開く
    window.location.href=newUrl;
})();