// ==UserScript==
// @name         POE2 Trade search by Korean
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  POE갤에서 퍼온 소스인데 안에도 스크립트 외부소스라 보안은 책임 안짐
// @match        *://www.pathofexile.com/trade2/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521526/POE2%20Trade%20search%20by%20Korean.user.js
// @updateURL https://update.greasyfork.org/scripts/521526/POE2%20Trade%20search%20by%20Korean.meta.js
// ==/UserScript==

// POE 갤에서 있는 소스 그대로 임
// https://gall.dcinside.com/mgallery/board/view/?id=pathofexile&no=847300
(async function translateTradeWebsite() {
  const url =
    "https://raw.githubusercontent.com/9pzz/poegy-translate-script/master/script.js";

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }
    const data = await response.text();
    eval(data);

    console.log("성공! 새로고침을 해주세요");
  } catch (error) {
    console.error("에러 ", error);
  }
})();