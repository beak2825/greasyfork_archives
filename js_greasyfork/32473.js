// ==UserScript==
// @name         ニコ生の予定をGoogleカレンダーに追加するリンクを追加
// @namespace    http://deflis.net/
// @version      0.1
// @description  ニコ生の予定をGoogleカレンダーに追加するリンクを追加する
// @author       deflis
// @match        http://live.nicovideo.jp/gate/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32473/%E3%83%8B%E3%82%B3%E7%94%9F%E3%81%AE%E4%BA%88%E5%AE%9A%E3%82%92Google%E3%82%AB%E3%83%AC%E3%83%B3%E3%83%80%E3%83%BC%E3%81%AB%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%BF%BD%E5%8A%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/32473/%E3%83%8B%E3%82%B3%E7%94%9F%E3%81%AE%E4%BA%88%E5%AE%9A%E3%82%92Google%E3%82%AB%E3%83%AC%E3%83%B3%E3%83%80%E3%83%BC%E3%81%AB%E8%BF%BD%E5%8A%A0%E3%81%99%E3%82%8B%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E8%BF%BD%E5%8A%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function zerofill(num){
        return ('0'+num).slice(-2);
    }
    function getTime(date){
        return date.getUTCFullYear() +
            zerofill(date.getUTCMonth()+1) +
            zerofill(date.getUTCDate()) +
            'T' +
            zerofill(date.getUTCHours()) +
            zerofill(date.getUTCMinutes()) +
            zerofill(date.getUTCSeconds()) +
            'Z';
    }

    const startDate = new Date(document.querySelector("div.kaijo meta").getAttribute("content"));
    const title = document.querySelector(".program-title").textContent;
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 3 + 30);

    const url = 'http://www.google.com/calendar/event?' +
          'action='   + 'TEMPLATE' +
          '&text='    + encodeURIComponent(title) +
          '&details=' + encodeURIComponent('ニコニコ生放送\n' + location.href) +
          '&location='+ encodeURIComponent(location.href) +
          '&dates='   + getTime(startDate) + '/' + getTime(endDate);

    const tr = document.createElement("tr");
    const td = document.createElement("td");
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.textContent = "Googleカレンダーに追加";
    td.appendChild(a);
    tr.appendChild(td);

    document.querySelector("#bn_gbox table").appendChild(tr);
    console.log(url);
})();