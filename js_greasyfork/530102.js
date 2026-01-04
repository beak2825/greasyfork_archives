// ==UserScript==
// @name         치지직(CHZZK) 다시보기 실제 시각 토글
// @namespace    https://chzzk.naver.com/
// @version      0.2.4
// @description  치지직 다시보기의 표시 시각 클릭 시 실제 라이브 당시 시각으로 토글
// @author       noipung
// @match        https://chzzk.naver.com/*
// @match        https://*.chzzk.naver.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530102/%EC%B9%98%EC%A7%80%EC%A7%81%28CHZZK%29%20%EB%8B%A4%EC%8B%9C%EB%B3%B4%EA%B8%B0%20%EC%8B%A4%EC%A0%9C%20%EC%8B%9C%EA%B0%81%20%ED%86%A0%EA%B8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/530102/%EC%B9%98%EC%A7%80%EC%A7%81%28CHZZK%29%20%EB%8B%A4%EC%8B%9C%EB%B3%B4%EA%B8%B0%20%EC%8B%A4%EC%A0%9C%20%EC%8B%9C%EA%B0%81%20%ED%86%A0%EA%B8%80.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 히든 클래스명 및 스타일 설정
  const HIDDEN_CLASS_NAME = "hidden-by-chzzk-vod-realtime-toggle";

  GM_addStyle(`
.${HIDDEN_CLASS_NAME} {
  display: none !important;
}

.pzp-vod-time:not(.pip_mode *) {
  cursor: pointer;
}

.pzp-seeking-preview--no-sprite .pzp-seeking-preview__time:not(.real-time).${HIDDEN_CLASS_NAME} {
  display: inherit !important;
  visibility: hidden;
}`);

  // 변수 설정
  let lastLink = window.location.href;
  let videoCount = 0;
  let liveOpenMs = null;
  let isLast = false;
  let isLiveVod = false;
  let previewObserver = null;

  const done = { prev: false, next: false };

  const MAX_DURATION = 61200;
  const videoNoMatcher = /(?<=https:\/\/chzzk.naver.com\/video\/)\d+/;
  const getApiLink = (videoNo) =>
    `https://api.chzzk.naver.com/service/v2/videos/${videoNo}`;

  // 기존 요소들, dom은 동적으로 추가될 때마다 함수로 할당
  const elements = {
    vodTimeContainer: { selector: ".pzp-vod-time", dom: null }, // vod 시간 표시 관련 요소들
    vodCurrentTime: { selector: ".pzp-vod-time__current-time", dom: null },
    vodBar: { selector: ".pzp-vod-time__bar", dom: null },
    vodDuration: { selector: ".pzp-vod-time__duration", dom: null },
    previewTimeContainer: {
      selector: ".pzp-seeking-preview__description",
      dom: null,
    }, // vod 프리뷰 시간 표시 관련 요소들
    previewTime: { selector: ".pzp-seeking-preview__time", dom: null },
    player: { selector: ".webplayer-internal-video", dom: null }, // 비디오 플레이어
  };

  // 추가할 실제시각 요소
  const elementsToAdd = {
    vodRealTime: {
      tag: "span",
      classList: ["pzp-ui-text", "pzp-vod-time__current-time", "real-time"],
      dom: null,
      parent: elements.vodTimeContainer,
    },
    previewRealTime: {
      tag: "div",
      classList: ["pzp-seeking-preview__time", "real-time"],
      dom: null,
      parent: elements.previewTimeContainer,
    },
  };

  // (hh:)mm:ss => ms
  const timeStringToMs = (str) =>
    str
      .split(":")
      .reduce(
        (sum, n, i, arr) => sum + n * 60 ** (arr.length - i - 1) * 1000,
        0
      );

  // Date => m월 n일 오전/오후 hh:mm:ss
  const dateToStrings = (date) => [
    date.toLocaleString("ko", {
      month: "short",
      day: "numeric",
    }),
    date.toLocaleString("ko", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    }),
  ];

  let lastTimeString = null;

  // (hh:)mm:ss => m월 n일 오전/오후 hh:mm:ss
  const getRealTimeStrings = (timeString) => {
    const realTimeDate = new Date(
      liveOpenMs + videoCount * MAX_DURATION * 1000 + timeStringToMs(timeString)
    );
    return dateToStrings(realTimeDate);
  };

  // 재생으로 인해 영상 시간이 바뀔 때
  const onTimeUpdate = () => {
    const currentTimeString = elements.vodCurrentTime.dom.textContent;

    if (lastTimeString === currentTimeString) return;

    lastTimeString = currentTimeString;

    elementsToAdd.vodRealTime.dom.textContent =
      getRealTimeStrings(currentTimeString).join(" ");
  };

  let realTimeMode = false;

  // 영상 시각 <=> 실제 시각 전환
  const toggleMode = (bool) => {
    realTimeMode = typeof bool === "boolean" ? bool : !realTimeMode;

    const originalvodTimeDoms = [
      "vodCurrentTime",
      "vodBar",
      "vodDuration",
      "previewTime",
    ].map((key) => elements[key].dom);

    const realTimeDoms = ["vodRealTime", "previewRealTime"].map(
      (key) => elementsToAdd[key].dom
    );

    originalvodTimeDoms.forEach((dom) => {
      dom.classList.toggle(HIDDEN_CLASS_NAME, realTimeMode);
    });

    realTimeDoms.forEach((dom) => {
      dom.classList.toggle(HIDDEN_CLASS_NAME, !realTimeMode);
    });
  };

  // 재생바 이동할 때 나오는 시간이 바뀌면
  const onPreviewChange = () => {
    const handleMutations = ([mutation]) => {
      const { nodeValue } = mutation.target;
      const previewTimeString = elements.previewTime.dom.textContent;
      elementsToAdd.previewRealTime.dom.textContent =
        getRealTimeStrings(previewTimeString).join(" ");
    };

    previewObserver = new MutationObserver(handleMutations);

    previewObserver.observe(elements.previewTime.dom, {
      characterData: true,
      subtree: true,
    });
  };

  const onPlayerCanPlay = () => {
    Object.keys(elements).forEach((key) => {
      const currentDom = document.querySelector(elements[key].selector);
      if (elements[key].dom === currentDom) return;
      elements[key].dom = currentDom;
    });

    Object.keys(elementsToAdd).forEach((key) => {
      const element = elementsToAdd[key];
      element.dom = document.createElement(element.tag);
      element.dom.classList.add(...element.classList);
      element.parent.dom.append(element.dom);
    });

    toggleMode(false);

    elements.vodTimeContainer.dom.addEventListener("pointerdown", toggleMode);
    elements.player.dom.addEventListener("timeupdate", onTimeUpdate);

    onPreviewChange();
  };

  // 모든 dom이 할당 되었을 때 실행
  const onSetDoms = () => {
    const playerDom = elements.player.dom;

    if (playerDom.readyState >= 4) onPlayerCanPlay();
    else playerDom.addEventListener("canplay", onPlayerCanPlay, { once: true });
  };

  // 모든 dom들 null로 초기화
  const resetDoms = () => {
    if (previewObserver) {
      previewObserver.disconnect();
      previewObserver = null;
    }

    elements.vodTimeContainer.dom?.removeEventListener(
      "pointerdown",
      toggleMode
    );
    elements.player.dom?.removeEventListener("timeupdate", onTimeUpdate);

    [elements, elementsToAdd].forEach((obj) =>
      Object.keys(obj).forEach((key) => {
        obj[key].dom = null;
      })
    );
  };

  const resetVariables = () => {
    liveOpenMs = null;
    isLast = false;
    videoCount = 0;
    done.prev = false;
    done.next = false;
  };

  // 요소가 동적으로 추가되면 elements 객체의 각 dom에 할당
  const setDoms = () => {
    const observer = new MutationObserver((mutations) => {
      // 남은 요소 추적
      const remainingKeys = Object.keys(elements).filter(
        (key) => !elements[key].dom
      );

      // 모든 요소를 찾은 경우 관찰 중지
      if (!remainingKeys.length) {
        onSetDoms();
        observer.disconnect();
        return;
      }

      // 각 선택자에 대해 문서 전체 검색
      let allFound = true;
      for (const key of remainingKeys) {
        const { selector } = elements[key];
        const element = document.querySelector(selector);

        if (element) elements[key].dom = element;
        else allFound = false;
      }

      // 모든 요소 발견 시 즉시 종료
      if (allFound) {
        onSetDoms();
        observer.disconnect();
      }
    });

    // 초기 검색 수행
    const initialKeys = Object.keys(elements).filter(
      (key) => !elements[key].dom
    );
    initialKeys.forEach((key) => {
      elements[key].dom = document.querySelector(elements[key].selector);
    });

    // 변경 관찰 시작
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  // 라이브 다시보기 VOD 페이지가 아닌 페이지로 들어갈 때
  const onEnterNotLiveVodPage = () => {
    if (!isLiveVod) return;

    isLiveVod = false;

    toggleMode(false);
    resetDoms();
  };

  // 라이브 다시보기 VOD 페이지로 들어갈 때
  const onEnterLiveVodPage = () => {
    isLiveVod = true;

    resetDoms();
    setDoms();
  };

  const getData = async (apiLink) => {
    try {
      const response = await fetch(apiLink);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      return await response.json();
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  const getApiData = async (apiLink, arrow) => {
    const data = await getData(apiLink);
    const { livePv, duration, liveOpenDate, prevVideo, nextVideo } =
      data.content;

    if (!liveOpenDate) {
      onEnterNotLiveVodPage();
      return;
    }

    if (!liveOpenMs) {
      liveOpenMs = new Date(liveOpenDate).getTime();
      isLast = duration === MAX_DURATION;
    }

    if (arrow !== 1) {
      if (!isLast && prevVideo && livePv === prevVideo.livePv) {
        videoCount++;
        const apiLink = getApiLink(prevVideo.videoNo);
        getApiData(apiLink, -1);
      } else {
        done.prev = true;
        if (done.next) onEnterLiveVodPage();
      }
    }

    if (arrow !== -1) {
      if (nextVideo && livePv === nextVideo.livePv) {
        if (nextVideo.duration === MAX_DURATION) videoCount++;
        const apiLink = getApiLink(nextVideo.videoNo);
        getApiData(apiLink, 1);
      } else {
        done.next = true;
        if (done.prev) onEnterLiveVodPage();
      }
    }
  };

  // 페이지로 들어갈 때
  const onEnterPage = (lastLink) => {
    const [videoNo] = lastLink.match(videoNoMatcher) || [];

    resetVariables();

    if (!videoNo) {
      // VOD 페이지가 아닐 때.
      onEnterNotLiveVodPage();
      return;
    }

    const apiLink = getApiLink(videoNo);

    getApiData(apiLink);
  };

  window.navigation.addEventListener("navigate", (e) => {
    lastLink = e.destination.url;
    onEnterPage(lastLink);
  });

  onEnterPage(lastLink);
})();
