// ==UserScript==
// @name twitter-msec
// @namespace https://twitter.com/senanense
// @version 2.0
// @description Twitter Web App で投稿時刻を詳細表示
// @author @_phocom (original author "alwaysms")
// @match https://x.com/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517611/twitter-msec.user.js
// @updateURL https://update.greasyfork.org/scripts/517611/twitter-msec.meta.js
// ==/UserScript==

(function () {
'use strict'

function update() {
let elms = document.querySelectorAll("a");
elms.forEach(function (elm) {
let time = elm.querySelector("time");
if (time) {
let id = elm.href.split("/")[5];
time.innerHTML = formatDate(getDateFromSnowflake(id));
}
});
}

function getDateFromSnowflake(id) {
if (id < 10000000000) return;
var unixTime = Math.floor(Number(id) / 4194304) + 1288834974657;
return new Date(unixTime);
}

function formatDate(date) {
let now = new Date();
let isCurrentYear = date.getFullYear() === now.getFullYear();
let isWithin11Months = (now - date) < 11 * 30 * 24 * 60 * 60 * 1000;
let yearPart = (!isCurrentYear && !isWithin11Months) ? `${date.getFullYear()}年` : "";
return `${yearPart}${date.getMonth() + 1}月` +
`${date.getDate()}日 ` +
`${date.getHours().toString().padStart(2, '0')}:` +
`${date.getMinutes().toString().padStart(2, '0')}:` +
`${date.getSeconds().toString().padStart(2, '0')}.` +
`${date.getMilliseconds().toString().padStart(3, '0')}`;
}

setInterval(update, 500);
})();