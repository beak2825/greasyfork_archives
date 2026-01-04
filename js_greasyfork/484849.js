// ==UserScript==
// @name         archive 네이버 웹툰 (2019) 모바일 뷰
// @description  archive 네이버 웹툰 (2019) 모바일 뷰.
// @version      1.0
// @match        https://archive.is/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1248076
// @downloadURL https://update.greasyfork.org/scripts/484849/archive%20%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%9B%B9%ED%88%B0%20%282019%29%20%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EB%B7%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/484849/archive%20%EB%84%A4%EC%9D%B4%EB%B2%84%20%EC%9B%B9%ED%88%B0%20%282019%29%20%EB%AA%A8%EB%B0%94%EC%9D%BC%20%EB%B7%B0.meta.js
// ==/UserScript==

GM_addStyle(`
[alt="comic content"] {margin: 0 !important; width: 100% !important;}
#CONTENT > div.html1 > div > div > div {height: unset !important;}
`);
