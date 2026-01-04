// ==UserScript==
// @name         치지직 편의성 패치
// @namespace    https://yoonu.io/
// @version      0.4.2
// @description  치지직에서 아직 지원하지 않는 기능을 임시로 지원합니다.
// @author       Yoonu
// @match        https://chzzk.naver.com/*
// @icon         https://ssl.pstatic.net/static/nng/glive/icon/favicon.png
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/482634/%EC%B9%98%EC%A7%80%EC%A7%81%20%ED%8E%B8%EC%9D%98%EC%84%B1%20%ED%8C%A8%EC%B9%98.user.js
// @updateURL https://update.greasyfork.org/scripts/482634/%EC%B9%98%EC%A7%80%EC%A7%81%20%ED%8E%B8%EC%9D%98%EC%84%B1%20%ED%8C%A8%EC%B9%98.meta.js
// ==/UserScript==

// 기능 설정 - 사용하고 싫으면 true / 사용하기 싫으면 false
const COLORIZE_CHAT = true;             // 채팅 닉네임 색상화
const REMOVE_CHEEZE_MESSAGE = true;     // 치즈 메시지 제거하기
const VIEW_NAV_INFO = false;            // 사이드바 정보 보기
const DISABLE_SCROLL_ANIMATION = true;  // 창이 비활성화된 상태에서 채팅이 쌓이면 보이는 스크롤 애니메이션 비활성화
const DISABLE_CLICK_EVENT = true;       // 클릭으로 영상 멈추기 비활성화

// 닉네임 색상 목록
const COLOR_LIST = [
    "rgb(255, 0, 0)",
    "rgb(0, 0, 255)",
    "rgb(0, 128, 0)",
    "rgb(178, 34, 34)",
    "rgb(255, 127, 80)",
    "rgb(154, 205, 50)",
    "rgb(255, 69, 0)",
    "rgb(46, 139, 87)",
    "rgb(218, 165, 32)",
    "rgb(210, 105, 30)",
    "rgb(95, 158, 160)",
    "rgb(30, 144, 255)",
    "rgb(255, 105, 180)",
    "rgb(138, 43, 226)",
    "rgb(0, 255, 127)"
];

const VIEWER_FONT_SIZE = "13px";
const CATEGORY_FONT_SIZE = "9px";

const addStyle = () => {
    // 채팅창 애니메이션
    style = "";
    if(DISABLE_SCROLL_ANIMATION) {
        style += `
            div[class^='live_chatting_list_item'] {
                overflow-anchor: none;
            }
        `;
    }
    GM_addStyle(style);
}

function toggleFullscreen() {
    let elem = document.getElementById("live_player_layout");
    document.fullscreenElement ? document.exitFullscreen() : elem.requestFullscreen();
}

const getRandomNumber = (max, seed) => {
    if(seed.length === 0)
        return 0;

    let val = 0;
    for (let i = 0; i < seed.length; i++)
        val += seed.charCodeAt(i);

    return val % max;
}

const fetchApi = async (url) => {
    const options = {
        "credentials": "include"
    };

    const response = await fetch(url, options);
    return await response.json();
}

// 채팅 옵저버
const setChatObserver = (chatNode) => {
    const callback = (mutationList, observer) => {
        for (let mutation of mutationList) {
            if (mutation.type !== "childList")
                continue;

            for(let addedNode of mutation.addedNodes) {
                // 치즈 메시지 제거
                if(REMOVE_CHEEZE_MESSAGE && addedNode.className?.includes("live_chatting_list_donation")) {
                    addedNode.classList.add("blind");
                    continue;
                }

                // 닉네임 색상 입히기
                const nameTextNode = addedNode.querySelector("span[class^='name_text']");
                if (nameTextNode) {
                    const nickname = nameTextNode.innerText;
                    const num = getRandomNumber(COLOR_LIST
                    .length, nickname);
                    nameTextNode.style.color = COLOR_LIST
                [num];
                }
            }
        }
    }

    const observer = new MutationObserver(callback);
    observer.observe(chatNode, { attributes: false, childList: true, subtree: true });
}

// 사이드바 라이브 현황 읽어오기
const fetchLiveStatus = async (listNode, fixOrder) => {
    /*
    const followListUrl = "https://api.chzzk.naver.com/service/v1/channels/followings/live";
    const recommendListUrl = "https://api.chzzk.naver.com/service/v1/home/recommendation-channels";

    const data = await fetchApi(followListUrl);
    const followingList = data.content.followingList;
    */

    if(!navigation.className.includes("navigator_is_expanded"))
        return;

    const links = listNode.querySelectorAll("a[href^='/live/']");

    for(let link of links) {
        const streamerCode = link.pathname.split("/")[2];
        const apiUrl = `https://api.chzzk.naver.com/polling/v1/channels/${streamerCode}/live-status`;
        const data = await fetchApi(apiUrl);
        const viewerCountClass = "navigator_viewer_count";
        const categoryClass = "navigator_category";

        let viewerCount = link.querySelector("." + viewerCountClass);
        if(!viewerCount) {
            viewerCount = document.createElement("div");
            viewerCount.style.fontSize = VIEWER_FONT_SIZE;
            viewerCount.className = viewerCountClass;
            link.appendChild(viewerCount);
        }

        const strongWrapper = link.querySelector("strong[class^='navigator_name']");
        let category = strongWrapper.querySelector("." + categoryClass);
        if(!category) {
            category = document.createElement("div");
            category.appendChild(strongWrapper.childNodes[0].cloneNode(true))
            category.style.fontSize = CATEGORY_FONT_SIZE;
            category.className = categoryClass;
            strongWrapper.appendChild(category);
        }

        viewerCount.innerHTML = data.content.concurrentUserCount;

        category.classList.toggle("blind", data.content.liveCategoryValue.trim() === "");
        category.querySelector("span[class^='name_text'").innerHTML = data.content.liveCategoryValue;

        // 네비게이션바 전체를 접었다가 펼치면 순서가 바뀌는걸 수정
        if(fixOrder)
            link.appendChild(viewerCount);
    };
}

// 주기적으로 API 읽기
const fetchInterval = (listNode) => {
    fetchLiveStatus(listNode);
    fetchTimer = setTimeout(fetchInterval, 60 * 1000, listNode);
}

let layoutBody, navigation, fetchTimer;

(function() {
    'use strict';

    const layoutCallback = () => {
        const chatWindow = layoutBody.querySelector("section > aside");
        if(chatWindow)
            setChatObserver(chatWindow)
    }

    const navigationCallback = (mutationList, observer) => {
        for(let mutation of mutationList) {
            if(mutation.type === "childList"){
                mutation.addedNodes.forEach(addedNode => fetchInterval(addedNode));
            } else if(mutation.type === "attributes") {
                mutation.target.childNodes.forEach(childNode => fetchLiveStatus(childNode, true));
            } else {
                console.log(mutation);
            }
        }

        // if(navigation.childNodes.length >= 2)
        //     navigationObserver.disconnect();
    }

    // 메인섹션(방송, 채팅)
    if(COLORIZE_CHAT) {
        layoutBody = document.getElementById("layout-body");
        const layoutBodyObserver = new MutationObserver(layoutCallback);
        layoutBodyObserver.observe(layoutBody, { attributes: false, childList: true, subtree: false });
    }

    // 네비게이션(사이드바)
    if(VIEW_NAV_INFO) {
        navigation = document.getElementById("navigation");
        const navigationObserver = new MutationObserver(navigationCallback);
        navigationObserver.observe(navigation, { attributes: true, childList: true, subtree: false });
    }

    Element.prototype._addEventListener = Element.prototype.addEventListener;
    Element.prototype.addEventListener = function (type, event, options) {
        if (type === "click" && this.className === "pzp-pc__video" && DISABLE_CLICK_EVENT)
            this._addEventListener("dblclick", toggleFullscreen);
        else
            this._addEventListener(type, event, options);
    };
})();

