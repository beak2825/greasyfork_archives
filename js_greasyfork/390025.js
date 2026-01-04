// ==UserScript==
// @name         @N_3. 룰렛 자동으로 돌리기
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://m.kin.naver.com/mobile/roulette/*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/390025/%40N_3%20%EB%A3%B0%EB%A0%9B%20%EC%9E%90%EB%8F%99%EC%9C%BC%EB%A1%9C%20%EB%8F%8C%EB%A6%AC%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/390025/%40N_3%20%EB%A3%B0%EB%A0%9B%20%EC%9E%90%EB%8F%99%EC%9C%BC%EB%A1%9C%20%EB%8F%8C%EB%A6%AC%EA%B8%B0.meta.js
// ==/UserScript==

$('#rouletteStartBtn').trigger('click');
location.reload();