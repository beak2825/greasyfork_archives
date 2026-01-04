// ==UserScript==
// @name         내서재 복구
// @description  내서재 누르면 선작뜨게
// @version      1.0.0
// @namespace    https://greasyfork.org/users/815641
// @match        https://novelpia.com/*
// @downloadURL https://update.greasyfork.org/scripts/450451/%EB%82%B4%EC%84%9C%EC%9E%AC%20%EB%B3%B5%EA%B5%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/450451/%EB%82%B4%EC%84%9C%EC%9E%AC%20%EB%B3%B5%EA%B5%AC.meta.js
// ==/UserScript==

$("a[href$='/mybook']").attr("href", "/mybook/like")