// ==UserScript==
// @name         SOOP - 유튜브 영상풍선 조회수, 좋아요, 싫어요(추정치) 표시
// @namespace    https://www.afreecatv.com/
// @version      2.0.0
// @description  영상 정보를 가져오기 위해 Return YouTube Dislike(https://returnyoutubedislike.com/) API를 사용합니다.
// @author       Jebibot
// @match        *://file.ext-sooplive.co.kr/*/4d4664eb15c038334d891ccbfc262cde/*/bj_screen.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.sooplive.co.kr
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497614/SOOP%20-%20%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EC%98%81%EC%83%81%ED%92%8D%EC%84%A0%20%EC%A1%B0%ED%9A%8C%EC%88%98%2C%20%EC%A2%8B%EC%95%84%EC%9A%94%2C%20%EC%8B%AB%EC%96%B4%EC%9A%94%28%EC%B6%94%EC%A0%95%EC%B9%98%29%20%ED%91%9C%EC%8B%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/497614/SOOP%20-%20%EC%9C%A0%ED%8A%9C%EB%B8%8C%20%EC%98%81%EC%83%81%ED%92%8D%EC%84%A0%20%EC%A1%B0%ED%9A%8C%EC%88%98%2C%20%EC%A2%8B%EC%95%84%EC%9A%94%2C%20%EC%8B%AB%EC%96%B4%EC%9A%94%28%EC%B6%94%EC%A0%95%EC%B9%98%29%20%ED%91%9C%EC%8B%9C.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const numberFormat = Intl.NumberFormat(undefined, { notation: "compact" });
  const votesCache = new Map();

  const addInfo = async (n) => {
    try {
      const span = n.querySelector(".info span");
      if (span == null || span.querySelector("i")) {
        return;
      }
      const info = JSON.parse(n.dataset.json);
      if (info.platformType === "youtube") {
        let votes = votesCache.get(info.videoUniqueKey);
        if (votes == null) {
          const req = await fetch(
            `https://returnyoutubedislikeapi.com/votes?videoId=${info.videoUniqueKey}`
          );
          if (!req.ok) {
            throw new Error(`${req.status} ${req.statusText}`);
          }
          votes = await req.json();
          votesCache.set(info.videoUniqueKey, votes);
        }

        const i = document.createElement("i");
        i.textContent = ` 👀${numberFormat.format(
          votes.viewCount
        )} 👍${numberFormat.format(votes.likes)} 👎${numberFormat.format(
          votes.dislikes
        )}`;
        span.appendChild(i);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const vodList = document.getElementById("ul_vod_list");
  const vodListObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const n of mutation.addedNodes) {
        if (n.tagName === "LI") {
          addInfo(n);
        }
      }
    }
  });
  vodListObserver.observe(vodList, { childList: true });

  for (const n of vodList.children) {
    addInfo(n);
  }
})();
