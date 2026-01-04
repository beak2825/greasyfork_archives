// ==UserScript==
// @name        나무위키 광고 삭제
// @namespace   Violentmonkey Scripts
// @icon        https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://namu.wiki
// @match       https://namu.wiki/*
// @grant       none
// @version     1.27
// @author      Xlbatross
// @run-at      document-end
// @description 모르겠다 이제
// @downloadURL https://update.greasyfork.org/scripts/530881/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%EA%B4%91%EA%B3%A0%20%EC%82%AD%EC%A0%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/530881/%EB%82%98%EB%AC%B4%EC%9C%84%ED%82%A4%20%EA%B4%91%EA%B3%A0%20%EC%82%AD%EC%A0%9C.meta.js
// ==/UserScript==

// 변경 전 Power Link
const powerLink2 = document.querySelector('[style="margin 0; color: #d9d7ce1f"]');
powerLink2?.remove();

// 변경을 감지할 노드 선택
const targetNode = document.body;

// 감지 옵션 (감지할 변경)
const config = { childList: true, subtree: true };

// 변경 감지 시 실행할 콜백 함수
const callback = (mutationList, observer) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      const addedNodes = mutation.addedNodes;
      if (addedNodes.length > 0) {
        let parent;

        const queryId = mutation.target.querySelector('[data-google-query-id]');
        parent = queryId;
        while (parent && parent.parentElement.children.length == 1) {
          let oldParent = parent;
          parent = parent.parentElement;
          if (!parent) {
            parent = oldParent;
            break;
          }
        }
        parent?.remove();

        // Power Link
        const powerLink1 = mutation.target.querySelector('[style*="color: rgba(217, 215, 206, 0.12);"]');
        powerLink1?.remove();
      }
    }
  }
};

// 콜백 함수에 연결된 감지기 인스턴스 생성
const observer = new MutationObserver(callback);

// 설정한 변경의 감지 시작
observer.observe(targetNode, config);