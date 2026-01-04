// ==UserScript==
// @name         지식인 룰렛오토
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://m.kin.naver.com/mobile/roulette/*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/389961/%EC%A7%80%EC%8B%9D%EC%9D%B8%20%EB%A3%B0%EB%A0%9B%EC%98%A4%ED%86%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/389961/%EC%A7%80%EC%8B%9D%EC%9D%B8%20%EB%A3%B0%EB%A0%9B%EC%98%A4%ED%86%A0.meta.js
// ==/UserScript==

$('#rouletteStartBtn').trigger('click');
location.reload();