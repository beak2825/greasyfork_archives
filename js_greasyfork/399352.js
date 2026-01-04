// ==UserScript==
// @name         대원새고자동화
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://www.daewonshop.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399352/%EB%8C%80%EC%9B%90%EC%83%88%EA%B3%A0%EC%9E%90%EB%8F%99%ED%99%94.user.js
// @updateURL https://update.greasyfork.org/scripts/399352/%EB%8C%80%EC%9B%90%EC%83%88%EA%B3%A0%EC%9E%90%EB%8F%99%ED%99%94.meta.js
// ==/UserScript==

if(document.getElementsByClassName("blackout").length == 1){
    location.reload();
}