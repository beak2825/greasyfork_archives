// ==UserScript==
// @name        沒有下一集就調淡下一集連結的顏色 - anime1.me
// @namespace   Violentmonkey Scripts
// @match       https://anime1.me/*
// @grant       none
// @version     1.2
// @author      bigiCrab
// @description 2021/10/31 上午4:38:14
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/434691/%E6%B2%92%E6%9C%89%E4%B8%8B%E4%B8%80%E9%9B%86%E5%B0%B1%E8%AA%BF%E6%B7%A1%E4%B8%8B%E4%B8%80%E9%9B%86%E9%80%A3%E7%B5%90%E7%9A%84%E9%A1%8F%E8%89%B2%20-%20anime1me.user.js
// @updateURL https://update.greasyfork.org/scripts/434691/%E6%B2%92%E6%9C%89%E4%B8%8B%E4%B8%80%E9%9B%86%E5%B0%B1%E8%AA%BF%E6%B7%A1%E4%B8%8B%E4%B8%80%E9%9B%86%E9%80%A3%E7%B5%90%E7%9A%84%E9%A1%8F%E8%89%B2%20-%20anime1me.meta.js
// ==/UserScript==

const thisPid = window.location.pathname.slice(1);
const nextLink = document.querySelector("[id^=post-] > div.entry-content > p > a:nth-child(3)");

let nextUrl = new URL(nextLink.href);
let nextPid = nextUrl.searchParams.get('p');

if(nextPid == ''){
  nextLink.style.color='#888';
}