// ==UserScript==
// @name         aftv UI
// @namespace    https://www.afreecatv.com/
// @version      20240530
// @description  아프리카TV의 사이드바 UI를 변경합니다.
// @description:ko  아프리카TV의 사이드바 UI를 변경합니다.
// @author       김머시기
// @match        https://www.afreecatv.com/
// @match        https://www.afreecatv.com/?hash=*
// @match        https://www.afreecatv.com/?NaPm=*
// @match        https://play.afreecatv.com/*/*
// @match        https://vod.afreecatv.com/player/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=afreecatv.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496266/aftv%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/496266/aftv%20UI.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const currentUrl = window.location.href;
    const isDarkMode = document.body.classList.contains('thema_dark');
    const hiddenBJList = [];

    let display_follow = GM_getValue("display_follow", 6);
    let display_myplus = GM_getValue("display_myplus", 6);
    let display_myplusvod = GM_getValue("display_myplusvod", 4);
    let display_top = GM_getValue("display_top", 6);
    let myplus_position = GM_getValue("myplus_position", 1);
    let myplus_order = GM_getValue("myplus_order", 1);
    let blockedUsers = GM_getValue('blockedUsers', []);
    let blockedCategories = GM_getValue('blockedCategories', []);
    let open_newtab = GM_getValue("open_newtab", 0);
    let playerSmode = GM_getValue("playerSmode", 0);
    let preplayerSmode = playerSmode;
    let sidebarMinimized = GM_getValue("sidebarMinimized", 0);
    let smodeSidebar = GM_getValue("smodeSidebar", 1);
    let menuIds = {};
    let categoryMenuIds = {};
    let savedCategory = GM_getValue("szBroadCategory",0);
    let delayCheckEnabled = true;
    let sharpModeCheckEnabled = true;
    let autoChangeQuality = GM_getValue("autoChangeQuality", 0);
    let autoChangeMute = GM_getValue("autoChangeMute", 0);
    let removeDupSwitch = GM_getValue("removeDupSwitch", 1);
    let showUptime = GM_getValue("showUptime", 1);
    let showRemainingBuffer = GM_getValue("showRemainingBuffer", 1);
    let pinSwitch_push = GM_getValue("pinSwitch_push", 0);
    let pinSwitch_pin = GM_getValue("pinSwitch_pin", 0);
    let bottomChatSwitch = GM_getValue("bottomChatSwitch", 1);
    let makePauseButton = GM_getValue("makePauseButton", 1);
    let makeSharpModeShortcut = GM_getValue("makeSharpModeShortcut", 1);
    let makeLowLatencyShortcut = GM_getValue("makeLowLatencyShortcut", 1);
    let sendLoadBroadSwitchNew = GM_getValue("sendLoadBroadSwitchNew", 1);
    let selectBestQualitySwitch = GM_getValue("selectBestQualitySwitch", 1);
    let newVIPBadgeSwitch = GM_getValue("newVIPBadgeSwitch", 0);
    let hideSupporterBadgeSwitch = GM_getValue("hideSupporterBadgeSwitch",0);
    let hideFanBadgeSwitch = GM_getValue("hideFanBadgeSwitch",0);
    let hideSubBadgeSwitch = GM_getValue("hideSubBadgeSwitch",0);
    let hideVIPBadgeSwitch = GM_getValue("hideVIPBadgeSwitch",0);
    let hideMngrBadgeSwitch = GM_getValue("hideMngrBadgeSwitch",0);
    let hideStreamerBadgeSwitch = GM_getValue("hideStreamerBadgeSwitch",0);
    let registeredWords = GM_getValue("registeredWords");
    let registeredEmojis = GM_getValue("registeredEmojis");
    let nicknameWidth = GM_getValue("nicknameWidth",126);
    let blockWordsSwitch = GM_getValue("blockWordsSwitch",0);
    let webplayer_scroll_left = 240;
    if(sidebarMinimized){
        webplayer_scroll_left = 52;
    }


    function getHiddenbjListAndCallback(callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://live.afreecatv.com/api/hiddenbj/hiddenbjController.php",
            onload: function(response) {
                try {
                    if (response.status === 200) {
                        const responseData = JSON.parse(response.responseText);
                        if (responseData.RESULT === 1) {
                            if (callback) {
                                callback(responseData.DATA);
                            }
                        } else {
                            console.error("Error: Response data not available or invalid");
                            if (callback) {
                                callback([]);
                            }
                        }
                    } else {
                        console.error("Error: Request failed with status:", response.status);
                        if (callback) {
                            callback([]);
                        }
                    }
                } catch (error) {
                    console.error("Error: Failed to parse response data or other unexpected error occurred:", error);
                    if (callback) {
                        callback([]);
                    }
                }
            },
            onerror: function(error) {
                console.error("Error: An error occurred while loading data:", error);
                if (callback) {
                    callback([]);
                }
            }
        });
    }

    // 데이터를 로드하고 처리하는 함수
    function loadData() {
        // 현재 시간 기록
        var currentTime = new Date().getTime();

        // 이전 실행 시간 불러오기
        var lastExecutionTime = GM_getValue("lastExecutionTime", 0);

        // 마지막 실행 시간으로부터 1시간 이상 경과했는지 확인
        if (currentTime - lastExecutionTime >= 3600000) { // 1시간은 3600000 밀리초
            GM_xmlhttpRequest({
                method: "GET",
                url: "https://live.afreecatv.com/script/locale/ko_KR/broad_category.js",
                headers: {
                    "Content-Type": "text/plain; charset=utf-8"
                },
                onload: function(response) {
                    if (response.status === 200) {
                        // 성공적으로 데이터를 받았을 때 처리할 코드 작성
                        var szBroadCategory = response.responseText;
                        console.log(szBroadCategory);
                        // 이후 처리할 작업 추가
                        szBroadCategory = JSON.parse(szBroadCategory.split('var szBroadCategory = ')[1].slice(0, -1));
                        if (szBroadCategory.CHANNEL.RESULT === "1") {
                            // 데이터 저장
                            GM_setValue("szBroadCategory", szBroadCategory);
                            // 현재 시간을 마지막 실행 시간으로 업데이트
                            GM_setValue("lastExecutionTime", currentTime);
                        }
                    } else {
                        console.error("Failed to load data:", response.statusText);
                    }
                },
                onerror: function(error) {
                    console.error("Error occurred while loading data:", error);
                }
            });
        } else {
            console.log("1 hour not elapsed since last execution. Skipping data load.");
        }
    }

    // 페이지가 로드되면 데이터를 로드하고 처리
    window.addEventListener('load', function() {
        //console.log(GM_getValue("lastExecutionTime"));
        loadData();
    });

    const CommonStyles = `
.starting-line .chatting-list-item .message-container .username {
    width: ${nicknameWidth}px !important;
}
.duration-overlay {
    position: absolute;
    top: 245px;
    right: 4px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 5px;
    font-size: 15px;
    border-radius: 3px;
    z-index:9999
}

#studioPlayKorPlayer,
#studioPlayKor,
#studioPlay,
.btn-broadcast {
    display: none;
}

.modal {
  display: none;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0,0,0,0.4);
  color: black;
}

.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  border-radius: 10px;
  width: 80%;
  max-width: 500px;
}

.myModalClose {
  color: #aaa;
  float: right;
  font-size: 36px;
  font-weight: bold;
  margin-top: -12px;
}

.myModalClose:hover,
.myModalClose:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

.option {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.option label {
  margin-right: 10px;
  font-size: 16px;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
  min-width: 60px;
}

.slider.round:before {
  border-radius: 50%;
}

#range {
  width: 100%;
}

#rangeValue {
  display: inline-block;
  margin-left: 10px;
}

.divider {
    width: 100%; /* 가로 폭 설정 */
    height: 1px; /* 세로 높이 설정 */
    background-color: #000; /* 배경색 설정 */
    margin: 20px 0; /* 위아래 여백 설정 */
}

#openModalBtn {
    box-sizing: border-box;
    font-size: 12px;
    line-height: 1.2 !important;
    font-family: "NG";
    list-style: none;
    position: relative;
    margin-left: 12px;
    width: 40px;
    height: 40px;
}

#topInnerHeader #openModalBtn {
    margin-right: 12px;
}
#openModalBtn > button {
    background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22'%3e%3cpath d='M11 2.5c1.07 0 1.938.867 1.938 1.938l-.001.245.12.036c.318.104.628.232.927.382l.112.06.174-.173a1.937 1.937 0 0 1 2.594-.126l.128.117a1.923 1.923 0 0 1 .015 2.748l-.17.171.062.117c.151.299.279.608.382.927l.036.12h.245c1.02 0 1.855.787 1.932 1.787L19.5 11c0 1.07-.867 1.938-1.938 1.938l-.246-.001-.035.12a6.578 6.578 0 0 1-.382.926l-.062.116.155.157c.333.322.537.752.578 1.21l.008.172c0 .521-.212 1.02-.576 1.372a1.938 1.938 0 0 1-2.733 0l-.173-.174-.112.06a6.58 6.58 0 0 1-.927.383l-.12.035v.247a1.936 1.936 0 0 1-1.786 1.931l-.151.006a1.938 1.938 0 0 1-1.938-1.937v-.245l-.119-.035a6.58 6.58 0 0 1-.927-.382l-.114-.062-.168.171a1.94 1.94 0 0 1-2.62.119l-.123-.113a1.94 1.94 0 0 1-.003-2.746l.172-.171-.06-.112a6.578 6.578 0 0 1-.381-.927l-.036-.119h-.245a1.938 1.938 0 0 1-1.932-1.786l-.006-.151c0-1.07.867-1.938 1.938-1.938h.245l.036-.119a6.33 6.33 0 0 1 .382-.926l.059-.113-.175-.174a1.94 1.94 0 0 1-.108-2.619l.114-.123a1.94 1.94 0 0 1 2.745.008l.166.168.114-.06c.3-.152.609-.28.927-.383l.119-.036v-.25c0-1.019.787-1.854 1.787-1.931zm0 1a.937.937 0 0 0-.938.938v.937a.322.322 0 0 0 .02.098 5.578 5.578 0 0 0-2.345.966.347.347 0 0 0-.056-.075l-.656-.663a.94.94 0 1 0-1.331 1.326l.665.663c.023.02.048.036.075.05a5.576 5.576 0 0 0-.965 2.343l-.094-.019h-.938a.937.937 0 1 0 0 1.875h.938l.094-.018c.137.845.468 1.647.965 2.343a.375.375 0 0 0-.075.05l-.665.663a.94.94 0 1 0 1.331 1.325l.656-.662a.347.347 0 0 0 .056-.075 5.58 5.58 0 0 0 2.344.966.322.322 0 0 0-.018.094v.936a.937.937 0 1 0 1.874 0v-.938l-.018-.094a5.58 5.58 0 0 0 2.343-.966l.047.075.666.663a.937.937 0 0 0 1.322 0 .922.922 0 0 0 0-1.326l-.656-.663-.075-.05a5.578 5.578 0 0 0 .965-2.343.57.57 0 0 0 .094.018h.938a.937.937 0 1 0 0-1.874h-.938a.57.57 0 0 0-.094.016 5.576 5.576 0 0 0-.965-2.343l.075-.05.656-.663a.922.922 0 0 0 0-1.325.938.938 0 0 0-1.322 0l-.666.662-.046.075a5.578 5.578 0 0 0-2.344-.966l.018-.094v-.938A.937.937 0 0 0 11 3.5zm0 4.188a3.313 3.313 0 1 1 0 6.625 3.313 3.313 0 0 1 0-6.626zm0 1a2.313 2.313 0 1 0 0 4.625 2.313 2.313 0 0 0 0-4.626z' fill='%23707173'/%3e%3c/svg%3e") 50% 50% no-repeat !important;
    background-size: 18px 22px; !important;
}
#sidebar.max {
    width: 240px;
}
#sidebar.min {
    width: 52px;
}
#sidebar.min .users-section a.user span {
    display: none;
}
#sidebar.min .users-section button {
    font-size:11px;
    padding: 1px;
}
#sidebar.max .button-fold-sidebar {
    background-size: 7px 11px;
    background-repeat: no-repeat;
    width: 26px;
    height: 26px;
    background-position: center;
    position: absolute;
    top: 13px;
    left: 200px;
}
#sidebar.max .button-unfold-sidebar {
    display:none;
}
#sidebar.min .button-fold-sidebar {
    display:none;
}
#sidebar.min .button-unfold-sidebar {
    background-size: 7px 11px;
    background-repeat: no-repeat;
    width: 26px;
    height: 26px;
    background-position: center;
    position: relative;
    top: 8px;
    left: 12px;
    padding-bottom:10px;
}
#sidebar.min .top-section span.max{
    display:none;
}
#sidebar.max .top-section span.min{
    display:none;
}
.users-section.myplus > .user.show-more,
.users-section.follow > .user.show-more,
.users-section.top > .user.show-more,
.users-section.myplusvod > .user.show-more {
    display: none;
}
#toggleButton, #toggleButton2, #toggleButton3, #toggleButton4 {
    padding:12px;
    width: 100%;
    text-align: center;
}
#sidebar {
    grid-area: sidebar;
    padding-bottom: 360px;
    height: 100vh;
    overflow-y: auto;
    position: fixed;
    scrollbar-width: none; /* 파이어폭스 */
}
#sidebar::-webkit-scrollbar {
    display: none;  /* Chrome, Safari, Edge */
}
#sidebar .top-section {
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin: 12px 0px 6px 0px;
}
#sidebar .top-section > span {
    text-transform: uppercase;
    font-weight: 550;
    font-size: 14px;
    margin-top: 6px;
    margin-bottom: 2px;
}
.users-section .user {
    display: grid;
    grid-template-areas: "profile-picture username watchers" "profile-picture description blank";
    grid-template-columns: 40px auto auto;
    padding: 6px 10px;
}
.users-section .user:hover {
    cursor: pointer;
}
.users-section .user .profile-picture {
    grid-area: profile-picture;
    width: 32px;
    height: 32px;
    border-radius: 50%;
}
.users-section .user .username {
    grid-area: username;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.6px;
    margin-left:1px;
}
.users-section .user .description {
    grid-area: description;
    font-size: 13px;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-left:1px;
}
.users-section .user .watchers {
    grid-area: watchers;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-weight: 400;
    font-size: 14px;
    margin-right: 2px;
}
.users-section .user .watchers .dot {
    font-size: 7px;
    margin-right: 5px;
}
.tooltip-container {
    z-index: 999;
    width: 480px;
    height: auto;
    position: fixed;
    display: flex;
    border-radius: 10px;
    box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.5);
}

.tooltip-container img {
    position: relative;
    z-index: 999;
    width: auto;
    height: auto;
    max-width:480px;
    max-height:270px
    flex: 0;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
}
.tooltiptext {
    flex: 0;
    position: relative;
    z-index: 999;
    width: 480px;
    max-width: 100%; /* 넘치는 경우 최대 너비 */
    height: auto;
    text-align: center;
    align-items: center; /* 세로 가운데 정렬 */
    justify-content: center; /* 가로 가운데 정렬 */
    box-sizing: border-box; /* 패딩을 포함한 전체 너비 유지 */
    padding: 8px 20px 14px 20px;
    font-size: 15px;
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
}
.profile-grayscale {
    filter: grayscale(100%) contrast(85%);
    opacity: .8;
}
    `;

    const mainPageCommonStyles = `
@media screen and (max-width: 1024px) {
    .cBox-list ul li {
        width:calc(50% - ((20px * 2) / 2))
    }
}
@media screen and (min-width: 1025px) and (max-width: 1280px) {
    .cBox-list ul li {
        width:calc(33% - ((20px * 3) / 3));
    }
}
@media screen and (max-width: 1136px) {
    .left_navbar a:first-child {
        display: none;
    }
}
.left_navbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: absolute;
    flex-direction: row-reverse;
    top: 0px;
    left: 160px;
}
.left_nav_button {
    position: relative;
    width: 70px;
    height: 70px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    z-index: 3001;
    transition: all .2s;
    font-size: 15px;
    font-weight: 600;
}
.game_post_area {
    width: 94%;
    left: 30px;
}
#list-container {
    overflow-x: hidden;
}
#listMain #wrap {
    min-width: 960px;
}
#listMain #wrap #serviceHeader {
    min-width: 960px;
}
#listMain #wrap #list-container #list-section {
    padding: 12px 22px 0 38px;
}
button.block-icon-svg-white {
  width: 40px;
  height: 50px;
}
button.block-icon-svg-white span {
    background-size: 100% 100%;
    width: 20px;
    height: 20px;
}
html {
    overflow: hidden;
}
#listMain #wrap #serviceHeader #afLogo {
    left: 30px;
    height: 72px;
}

.btn_flexible {
    display: none;
}

#innerLnb {
    display: none;
}

#list-container {
    height: 100vh;
    overflow-y: auto;
}

#serviceHeader .a_d_banner {
    display: none !important;
}
    `;

    const mainPageDarkmodeStyles = `
#sidebar.max .button-fold-sidebar {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none slice' viewBox='0 0 7 11'%3e%3cpath fill='%23f9f9f9' d='M5.87 11.01L.01 5.51 5.87.01l1.08 1.01-4.74 4.45L7 9.96 5.87 11z'/%3e%3c/svg%3e");
}
#sidebar.min .button-unfold-sidebar {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none slice' viewBox='0 0 7 11'%3e%3cpath fill='%23f9f9f9' d='M1.13 11.01l5.86-5.5L1.13.01.05 1.02l4.74 4.45L0 9.96 1.13 11z'/%3e%3c/svg%3e");
}
.game_post_area .scroll_area ul li{
    background-color: #0E0E10;
}
#list-container {
    background-color: #0E0E10;
}
button.block-icon-svg-white span {
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 64 64" style="fill:%23B2B2B2;"%3E%3Cpath d="M32 6C17.641 6 6 17.641 6 32C6 46.359 17.641 58 32 58C46.359 58 58 46.359 58 32C58 17.641 46.359 6 32 6zM32 10C37.331151 10 42.225311 11.905908 46.037109 15.072266L14.505859 45.318359C11.682276 41.618415 10 37.00303 10 32C10 19.869 19.869 10 32 10zM48.927734 17.962891C52.094092 21.774689 54 26.668849 54 32C54 44.131 44.131 54 32 54C26.99697 54 22.381585 52.317724 18.681641 49.494141L48.927734 17.962891z"%3E%3C/path%3E%3C/svg%3E');
}
button.block-icon-svg-white:hover span {
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 64 64" style="fill:%235285FF;"%3E%3Cpath d="M32 6C17.641 6 6 17.641 6 32C6 46.359 17.641 58 32 58C46.359 58 58 46.359 58 32C58 17.641 46.359 6 32 6zM32 10C37.331151 10 42.225311 11.905908 46.037109 15.072266L14.505859 45.318359C11.682276 41.618415 10 37.00303 10 32C10 19.869 19.869 10 32 10zM48.927734 17.962891C52.094092 21.774689 54 26.668849 54 32C54 44.131 44.131 54 32 54C26.99697 54 22.381585 52.317724 18.681641 49.494141L48.927734 17.962891z"%3E%3C/path%3E%3C/svg%3E');
}
#toggleButton, #toggleButton2, #toggleButton3, #toggleButton4 {
    color: #A1A1A1;
}
.left_nav_button {
    color: #e5e5e5;
}
.left_nav_button.active {
    color: #019BFE;
}
#sidebar {
    color: #fff;
    background-color: #1F1F23;
}
#sidebar .top-section > span {
    color: #DEDEE3;
}
#sidebar .top-section > span > a {
    color: #DEDEE3;
}
.users-section .user:hover {
    background-color: #26262c;
}
.users-section .user .username {
    color: #DEDEE3;
}
.users-section .user .description {
    color: #a1a1a1;
}
.users-section .user .watchers {
    color: #c0c0c0;
}
.tooltip-container {
    background-color: #26262C;
}
.tooltiptext {
    color: #fff;
    background-color: #26262C;
}
    `;

    const mainPageWhitemodeStyles = `
#sidebar.max .button-fold-sidebar {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none slice' viewBox='0 0 7 11'%3e%3cpath fill='%23888' d='M5.87 11.01L.01 5.51 5.87.01l1.08 1.01-4.74 4.45L7 9.96 5.87 11z'/%3e%3c/svg%3e");
}
#sidebar.min .button-unfold-sidebar {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none slice' viewBox='0 0 7 11'%3e%3cpath fill='%23888' d='M1.13 11.01l5.86-5.5L1.13.01.05 1.02l4.74 4.45L0 9.96 1.13 11z'/%3e%3c/svg%3e");
}
.game_post_area .scroll_area ul li{
    background-color: #F7F7F8;
}
#list-container {
    background-color:#F7F7F8;
}
button.block-icon-svg span {
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 64 64" style="fill:%237C7D7D;"%3E%3Cpath d="M32 6C17.641 6 6 17.641 6 32C6 46.359 17.641 58 32 58C46.359 58 58 46.359 58 32C58 17.641 46.359 6 32 6zM32 10C37.331151 10 42.225311 11.905908 46.037109 15.072266L14.505859 45.318359C11.682276 41.618415 10 37.00303 10 32C10 19.869 19.869 10 32 10zM48.927734 17.962891C52.094092 21.774689 54 26.668849 54 32C54 44.131 44.131 54 32 54C26.99697 54 22.381585 52.317724 18.681641 49.494141L48.927734 17.962891z"%3E%3C/path%3E%3C/svg%3E');
}
button.block-icon-svg:hover span {
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 64 64" style="fill:%235285FF;"%3E%3Cpath d="M32 6C17.641 6 6 17.641 6 32C6 46.359 17.641 58 32 58C46.359 58 58 46.359 58 32C58 17.641 46.359 6 32 6zM32 10C37.331151 10 42.225311 11.905908 46.037109 15.072266L14.505859 45.318359C11.682276 41.618415 10 37.00303 10 32C10 19.869 19.869 10 32 10zM48.927734 17.962891C52.094092 21.774689 54 26.668849 54 32C54 44.131 44.131 54 32 54C26.99697 54 22.381585 52.317724 18.681641 49.494141L48.927734 17.962891z"%3E%3C/path%3E%3C/svg%3E');
}
#toggleButton, #toggleButton2, #toggleButton3, #toggleButton4 {
    color: #53535F;
}
.left_nav_button {
    color: #1F1F23;
}
.left_nav_button.active {
    color: #0545B1;
}
#sidebar {
    color: black;
    background-color: #EFEFF1;
}
#sidebar .top-section>span {
    color: #0E0E10;
}
#sidebar .top-section>span>a {
    color: #0E0E10;
}
.users-section .user:hover {
    background-color: #E6E6EA;
}
.users-section .user .username {
    color: #1F1F23;
}
.users-section .user .description {
    color: #53535F;
}
.users-section .user .watchers {
    color: black;
}
.tooltip-container {
    background-color: #E6E6EA;
}
.tooltiptext {
    color: black;
    background-color: #E6E6EA;
}
    `;

const playerCommonStyles = `
.remainingBuffer {
    overflow: visible;
    display: inline-block;
    position: relative;
    z-index: 1;
    margin-left: 15px;
    vertical-align: middle;
}
.remainingBuffer p{
    font-size: 12px;
    vertical-align: middle;
    text-align: center;
}
.elapsed-time {
    overflow: visible;
    display: inline-block;
    position: relative;
    z-index: 1;
    margin-left: 15px;
    vertical-align: middle;
}
.elapsed-time p{
    font-size: 13px;
    vertical-align: middle;
    text-align: center;
}
@media (max-width: 1320px) {
    .layout_v2#webplayer.chat_open #webplayer_contents,
    .layout_v2#webplayer.chat_open.list_open #webplayer_contents,
    .layout_v2#webplayer.chat_open.list_bookmark_open #webplayer_contents {
        min-width: 600px;
    }
}
@media screen and (max-width: 1170px) {
    .left_navbar a:first-child {
        display: none;
    }
}
@media screen and (max-width: 1100px) {
    .left_navbar a:nth-child(2) {
        display: none;
    }
}
@media screen and (max-width: 1030px) {
    .left_navbar a:nth-child(3) {
        display: none;
    }
}
@media screen and (max-width: 960px) {
    .left_navbar a:nth-child(4) {
        display: none;
    }
}
#afreecatv_player {
    width: 100%;
}
#webplayer_scroll{
    left: ${webplayer_scroll_left}px;
}
.smode #webplayer_scroll {
    top: 0;
    left:0;
}
#sidebar > :last-child {
    padding-bottom: 360px; /* 마지막 자식에만 padding 추가 */
}
#webplayer_top .logo {
    top: 18px;
    left: 18px;
}
.left_navbar {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    position: absolute;
    flex-direction: row-reverse;
    top: 0px;
    left: 140px;
}
.left_nav_button {
    position: relative;
    width: 70px;
    height: 56px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    cursor: pointer;
    z-index: 3001;
    transition: all .2s;
    font-size: 15px;
    font-weight: 600;
}

#sidebar {
    top: 56px;
}
.bottomChat .chat_move_wrap {
    display: none;
}
.bottomChat .area_header h2 span {
    margin-left: 10px;
}
`;

const darkModePlayerStyles = `
.remainingBuffer p{
    color: #888888;
}
#sidebar.max .button-fold-sidebar {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none slice' viewBox='0 0 7 11'%3e%3cpath fill='%23f9f9f9' d='M5.87 11.01L.01 5.51 5.87.01l1.08 1.01-4.74 4.45L7 9.96 5.87 11z'/%3e%3c/svg%3e");
}
#sidebar.min .button-unfold-sidebar {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none slice' viewBox='0 0 7 11'%3e%3cpath fill='%23f9f9f9' d='M1.13 11.01l5.86-5.5L1.13.01.05 1.02l4.74 4.45L0 9.96 1.13 11z'/%3e%3c/svg%3e");
}
#sidebar {
    color: white;
    background-color: #1F1F23;
}

#sidebar .top-section > span {
    color:#DEDEE3;
}

#sidebar .top-section > span > a {
    color:#DEDEE3;
}
.users-section .user:hover {
    background-color: #26262c;
}

.users-section .user .username {
    color:#DEDEE3;
}

.users-section .user .description {
    color: #a1a1a1;
}

.users-section .user .watchers {
    color: #c0c0c0;
}

.left_nav_button {
    color: #e5e5e5;
}

.tooltip-container {
    background-color: #26262C;
}
.tooltiptext {
    color: #fff;
    background-color: #26262C;
}
#toggleButton, #toggleButton2, #toggleButton3, #toggleButton4 {
    color:#A1A1A1;
}
    `;

    const whiteModePlayerStyles = `
#afSearcharea .search_window .searchInputWrap {
    border: 1px solid #E5E5E5 !important;
}
#webplayer_top {
    border-bottom: 1px solid #E5E5E5 !important;
}
.remainingBuffer p{
    color: #888888;
}
#sidebar.max .button-fold-sidebar {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none slice' viewBox='0 0 7 11'%3e%3cpath fill='%23888' d='M5.87 11.01L.01 5.51 5.87.01l1.08 1.01-4.74 4.45L7 9.96 5.87 11z'/%3e%3c/svg%3e");
}
#sidebar.min .button-unfold-sidebar {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none slice' viewBox='0 0 7 11'%3e%3cpath fill='%23888' d='M1.13 11.01l5.86-5.5L1.13.01.05 1.02l4.74 4.45L0 9.96 1.13 11z'/%3e%3c/svg%3e");
}
#sidebar {
    color: white;
    background-color: #EFEFF1;
}
#sidebar .top-section > span {
    color:#0E0E10;
}
#sidebar .top-section > span > a {
    color:#0E0E10;
}
.users-section .user:hover {
    background-color: #E6E6EA;
}
.users-section .user .username {
    color:#1F1F23;
}
.users-section .user .description {
    color: #53535F;
}
.users-section .user .watchers {
    color: black;
}
.tooltip-container {
    background-color: #E6E6EA;
}
.tooltiptext {
    color: black;
    background-color: #E6E6EA;
}
.left_nav_button {
    color: #1F1F23;
}

#toggleButton, #toggleButton2, #toggleButton3, #toggleButton4 {
    color: #53535F;
}
    `;

    //======================================공용 함수======================================//

    function refreshPageOnDarkModeToggle() {
        var modecheck1 = document.getElementById("modecheck");
        var modecheck2 = document.getElementById("modecheck2");

        if (modecheck1 !== null) {
            modecheck1.addEventListener("change", function () {
                location.reload();
            });
        }

        if (modecheck2 !== null) {
            modecheck2.addEventListener("change", function () {
                location.reload();
            });
        }
    }

    function addNumberSeparator(number) {
        // toLocaleString 메서드를 사용하여 숫자에 구분자 추가
        number = Number(number);
        return number.toLocaleString();
    }

    function getCategoryName(targetCateNo) {
        function searchCategory(categories, targetCateNo) {
            // 카테고리 배열을 순회합니다.
            for (let category of categories) {
                // 현재 카테고리의 cate_no가 목표 cate_no와 일치하는지 확인합니다.
                if (category.cate_no === targetCateNo) {
                    // 일치하는 경우 cate_name을 반환합니다.
                    return category.cate_name;
                } else {
                    // 현재 카테고리에 child가 있는지 확인합니다.
                    if (category.child && category.child.length > 0) {
                        // 재귀적으로 child 카테고리를 검색합니다.
                        let result = searchCategory(category.child, targetCateNo);
                        // 재귀 호출 결과가 null이 아니라면 해당 cate_name을 반환합니다.
                        if (result !== null) {
                            return result;
                        }
                    }
                }
            }
            // cate_no에 해당하는 카테고리가 없는 경우 null을 반환합니다.
            return null;
        }

        // 함수 호출 시 CHANNEL.BROAD_CATEGORY에서 시작합니다.
        return searchCategory(savedCategory.CHANNEL.BROAD_CATEGORY, targetCateNo);
    }

    // 차단 목록을 저장합니다.
    function saveBlockedUsers() {
        GM_setValue('blockedUsers', blockedUsers);
    }

    // 사용자를 차단 목록에 추가합니다.
    function blockUser(userName, userId) {
        // 이미 차단된 사용자인지 확인
        if (!isUserBlocked(userId)) {
            blockedUsers.push({ userName, userId });
            saveBlockedUsers();
            alert(`사용자 ${userName}(${userId})를 차단했습니다.`);
            registerUnblockMenu({ userName, userId });
        } else {
            alert(`사용자 ${userName}(${userId})는 이미 차단되어 있습니다.`);
        }
    }

    // 함수: 사용자 차단 해제
    function unblockUser(userId) {
        // 차단된 사용자 목록에서 해당 사용자 찾기
        let unblockedUser = blockedUsers.find(user => user.userId === userId);

        // 사용자를 찾았을 때만 차단 해제 및 메뉴 삭제 수행
        if (unblockedUser) {
            // 차단된 사용자 목록에서 해당 사용자 제거
            blockedUsers = blockedUsers.filter(user => user.userId !== userId);

            // 변경된 목록을 저장
            GM_setValue('blockedUsers', blockedUsers);

            alert(`사용자 ${userId}의 차단이 해제되었습니다.`);

            unregisterUnblockMenu(unblockedUser.userName);
        }
    }

    // 사용자가 이미 차단되어 있는지 확인합니다.
    function isUserBlocked(userId) {
        return blockedUsers.some(user => user.userId === userId);
    }

    // 함수: 동적으로 메뉴 등록
    function registerUnblockMenu(user) {
        // GM_registerMenuCommand로 메뉴를 등록하고 메뉴 ID를 기록
        let menuId = GM_registerMenuCommand(`💔 차단 해제 - ${user.userName}`, function() {
            unblockUser(user.userId);
        });

        // 메뉴 ID를 기록
        menuIds[user.userName] = menuId;
    }

    // 함수: 동적으로 메뉴 삭제
    function unregisterUnblockMenu(userName) {
        // userName을 기반으로 저장된 메뉴 ID를 가져와서 삭제
        let menuId = menuIds[userName];
        if (menuId) {
            GM_unregisterMenuCommand(menuId);
            delete menuIds[userName]; // 삭제된 메뉴 ID를 객체에서도 제거
        }
    }

    // 카테고리 목록을 저장합니다.
    function saveBlockedCategories() {
        GM_setValue('blockedCategories', blockedCategories);
    }

    // 카테고리를 차단 목록에 추가합니다.
    function blockCategory(categoryName, categoryId) {
        // 이미 차단된 카테고리인지 확인
        if (!isCategoryBlocked(categoryId)) {
            blockedCategories.push({ categoryName, categoryId });
            saveBlockedCategories();
            alert(`카테고리 ${categoryName}(${categoryId})를 차단했습니다.`);
            registerCategoryUnblockMenu({ categoryName, categoryId });
        } else {
            alert(`카테고리 ${categoryName}(${categoryId})는 이미 차단되어 있습니다.`);
        }
    }

    // 함수: 카테고리 차단 해제
    function unblockCategory(categoryId) {
        // 차단된 카테고리 목록에서 해당 카테고리 찾기
        let unblockedCategory = blockedCategories.find(category => category.categoryId === categoryId);

        // 카테고리를 찾았을 때만 차단 해제 및 메뉴 삭제 수행
        if (unblockedCategory) {
            // 차단된 카테고리 목록에서 해당 카테고리 제거
            blockedCategories = blockedCategories.filter(category => category.categoryId !== categoryId);

            // 변경된 목록을 저장
            GM_setValue('blockedCategories', blockedCategories);

            alert(`카테고리 ${categoryId}의 차단이 해제되었습니다.`);

            unregisterCategoryUnblockMenu(unblockedCategory.categoryName);
        }
    }

    // 카테고리가 이미 차단되어 있는지 확인합니다.
    function isCategoryBlocked(categoryId) {
        return blockedCategories.some(category => category.categoryId === categoryId);
    }

    // 함수: 동적으로 카테고리 메뉴 등록
    function registerCategoryUnblockMenu(category) {
        // GM_registerMenuCommand로 카테고리 메뉴를 등록하고 메뉴 ID를 기록
        let menuId = GM_registerMenuCommand(`💔 카테고리 차단 해제 - ${category.categoryName}`, function() {
            unblockCategory(category.categoryId);
        });

        // 메뉴 ID를 기록
        categoryMenuIds[category.categoryName] = menuId;
    }

    // 함수: 동적으로 카테고리 메뉴 삭제
    function unregisterCategoryUnblockMenu(categoryName) {
        // categoryName을 기반으로 저장된 메뉴 ID를 가져와서 삭제
        let menuId = categoryMenuIds[categoryName];
        if (menuId) {
            GM_unregisterMenuCommand(menuId);
            delete categoryMenuIds[categoryName]; // 삭제된 메뉴 ID를 객체에서도 제거
        }
    }

    function waitForElement(elementSelector, callBack, attempts = 0, maxAttempts = 100) {
        const element = document.body.querySelector(elementSelector);

        if (element) {
            callBack(elementSelector, element);
        } else {
            if (attempts < maxAttempts) {
                setTimeout(function () {
                    waitForElement(elementSelector, callBack, attempts + 1, maxAttempts);
                }, 200);
            } else {
                console.error('Reached maximum attempts. Element not found.');
            }
        }
    }

    function desc_order(selector) {
        // Get the container element
        const container = document.body.querySelector(selector);

        // Get all user elements
        const userElements = document.body.querySelectorAll(`${selector} > .user`);

        // Create arrays for each category
        let category1 = [];
        let category2 = [];
        let category3 = [];
        let category4 = [];
        let category5 = [];

        // Categorize users
        userElements.forEach(user => {
            const isPin = user.getAttribute('is_pin') === 'Y';
            const hasBroadThumbnail = user.hasAttribute('broad_thumbnail');
            const isMobilePush = user.getAttribute('is_mobile_push') === 'Y';

            if (isPin && hasBroadThumbnail) {
                category1.push(user);
            } else if (isPin && !hasBroadThumbnail) {
                category2.push(user);
            } else if (!isPin && isMobilePush) {
                category3.push(user);
            } else if (!isPin && !isMobilePush) {
                category4.push(user);
            } else {
                category5.push(user);
            }
        });

        // Sort each category by watchers
        category1.sort(compareWatchers);
        category2.sort(compareWatchers);
        category3.sort(compareWatchers);
        category4.sort(compareWatchers);
        category5.sort(compareWatchers);

        // Clear container and append sorted elements
        container.innerHTML = '';
        [...category1, ...category2, ...category3, ...category4, ...category5].forEach(user => {
            container.appendChild(user);
        });
    }

    function compareWatchers(a, b) {
        const watchersA = parseInt(a.getAttribute('data-watchers') || '0');
        const watchersB = parseInt(b.getAttribute('data-watchers') || '0');
        return watchersB - watchersA; // Sort by watchers
    }

    function makeTopNavbarAndSidebar(page){
        // .left_navbar를 찾거나 생성
        var leftNavbar = document.body.querySelector('.left_navbar');
        if (!leftNavbar) {
            leftNavbar = document.createElement('div');
            leftNavbar.className = 'left_navbar';

            // 페이지의 적절한 위치에 추가
            var targetElement = document.body; // 원하는 위치에 따라 수정
            targetElement.insertBefore(leftNavbar, targetElement.firstChild);
        }

        var buttonData = [
            { href: 'https://www.afreecatv.com/?hash=all', text: '전체' },
            { href: 'https://www.afreecatv.com/?hash=game', text: '게임' },
            { href: 'https://www.afreecatv.com/?hash=bora', text: '보.라' },
            { href: 'https://www.afreecatv.com/?hash=sports', text: '스포츠' }
        ];

        buttonData.reverse().forEach(function (data) {
            var newButton = document.createElement('a');
            newButton.href = data.href;
            newButton.innerHTML = `<button type="button" class="left_nav_button">${data.text}</button>`;
            leftNavbar.appendChild(newButton);
        });

        var tooltipContainer = document.createElement('div');
        tooltipContainer.classList.add('tooltip-container');

        const sidebarClass = sidebarMinimized ? "min" : "max";

        if(page==="main"){
            const newHtml = `
            <div id="sidebar" class="max">
            </div>
            `;

            const serviceLnbElement = document.getElementById('serviceLnb');
            if (serviceLnbElement) {
                serviceLnbElement.insertAdjacentHTML('beforeend', newHtml);
            }
            var listsection = document.body.querySelector('#list-section');
            listsection.appendChild(tooltipContainer);
        }
        if(page==="player"){
            const sidebarHtml = `
            <div id="sidebar" class="${sidebarClass}">
            </div>
            `;

            const webplayerElement = document.getElementById('webplayer');
            if (webplayerElement) {
                webplayerElement.insertAdjacentHTML('beforeend', sidebarHtml);
            }
            webplayerElement.appendChild(tooltipContainer);
        }
    }

    function updateElementWithContent(targetElement, newContent) {
        // DocumentFragment 생성
        function createFragment(content) {
            var fragment = document.createDocumentFragment();
            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;

            while (tempDiv.firstChild) {
                fragment.appendChild(tempDiv.firstChild);
            }

            return fragment;
        }

        // 기존 내용을 지우고 DocumentFragment를 적용
        function applyFragment(fragment) {
            targetElement.innerHTML = ''; // 기존 내용을 모두 지움
            targetElement.appendChild(fragment); // 새로운 내용 추가
        }

        // 호출 시점에 전달된 newContent를 사용하여 DocumentFragment 생성 후 적용
        applyFragment(createFragment(newContent));
    }

    // 사용자 요소를 생성하는 함수
    function createUserElement(channel, is_mobile_push, is_pin) {
        const userId = channel.user_id;
        const broadNo = channel.broad_no;
        const totalViewCnt = channel.total_view_cnt;
        const broadTitle = channel.broad_title;
        const userNick = channel.user_nick;
        const broadStart = channel.broad_start;
        const playerLink = "https://play.afreecatv.com/"+userId+"/"+broadNo;
        const broad_thumbnail = `https://liveimg.afreecatv.com/m/${broadNo}`;

        const userElement = document.createElement('a');
        userElement.classList.add('user');
        if(!open_newtab){
            userElement.setAttribute('href',`${playerLink}`);
            if (sendLoadBroadSwitchNew && location.href.startsWith("https://play.afreecatv.com/")) {
                userElement.setAttribute('onclick', `
                    if(event.ctrlKey){
                        return;
                    }
                    event.preventDefault();
                    event.stopPropagation();
                    if (document.body.querySelector('div.loading') && getComputedStyle(document.body.querySelector('div.loading')).display === 'none') {
                        liveView.playerController.sendLoadBroad('${userId}', ${broadNo});
                    } else {
                        location.href = '${playerLink}';
                    }
                `);
            }
        } else {
            userElement.setAttribute('href',`${playerLink}`);
            userElement.setAttribute('target','_blank');
        }
        userElement.setAttribute('data-watchers',`${totalViewCnt}`);
        userElement.setAttribute('broad_thumbnail',`${broad_thumbnail}`);
        userElement.setAttribute('tooltip',`${broadTitle}`);
        userElement.setAttribute('user_id',`${userId}`);
        userElement.setAttribute('broad_start',`${broadStart}`);
        if (is_mobile_push) {
            userElement.setAttribute('is_mobile_push', is_mobile_push);
            if (is_pin) {
                userElement.setAttribute('is_pin', 'Y');
            } else {
                userElement.setAttribute('is_pin', 'N');
            }
        }
        const profilePicture = document.createElement('img');
        const pp_webp="https://stimg.afreecatv.com/LOGO/"+userId.slice(0, 2)+"/"+userId+"/m/"+userId+".webp";
        const pp_jpg="https://profile.img.afreecatv.com/LOGO/"+userId.slice(0, 2)+"/"+userId+"/m/"+userId+".jpg";
        profilePicture.src = pp_webp;
        profilePicture.setAttribute('onerror', `this.onerror=null; this.src='${pp_jpg}'`);
        profilePicture.setAttribute('alt', `${userId}'`);
        if (open_newtab === 1) {
            profilePicture.setAttribute('onclick', `event.preventDefault(); event.stopPropagation(); document.getElementById('sidebar').offsetWidth === 52 ? window.open('${playerLink}', '_blank') : window.open('https://bj.afreecatv.com/${userId}', '_blank');`);
        } else {
            // 프로필 클릭, 빠른 이동 & 플레이어 페이지
            if(sendLoadBroadSwitchNew && location.href.startsWith("https://play.afreecatv.com/")){
                profilePicture.setAttribute('onclick', `
                  event.preventDefault();
                  event.stopPropagation();
                  if (document.getElementById('sidebar').offsetWidth === 52) {
                      if(event.ctrlKey) {
                          window.open('${playerLink}', '_blank');
                          return;
                      };
                      if (document.body.querySelector('div.loading') && getComputedStyle(document.body.querySelector('div.loading')).display === 'none') {
                          liveView.playerController.sendLoadBroad('${userId}', ${broadNo});
                      } else {
                          location.href = '${playerLink}';
                      }
                  } else {
                      window.open('https://bj.afreecatv.com/${userId}', '_blank');
                  }
                `);
            } else { // 프로필 클릭, 보통 이동, 메인 페이지
                profilePicture.setAttribute('onclick', `
                    event.preventDefault();
                    event.stopPropagation();
                    if (document.getElementById('sidebar').offsetWidth === 52) {
                        if(event.ctrlKey) {
                            window.open('${playerLink}', '_blank');
                        } else {
                            location.href = '${playerLink}';
                        }
                    } else {
                        window.open('https://bj.afreecatv.com/${userId}', '_blank');
                    }
                `);
            }
        }
        // 프로필 휠클릭일 때
        profilePicture.setAttribute('onmousedown', `
            if (event.button === 1) {
                if (document.getElementById('sidebar').offsetWidth !== 52) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.open('https://bj.afreecatv.com/${userId}', '_blank');
                }
            }
        `);
        profilePicture.classList.add('profile-picture');
        const username = document.createElement('span');
        username.classList.add('username');
        if(is_pin){
            username.textContent = `🖈${userNick}`;
            username.setAttribute('title','고정됨(상단 고정 켜짐)');
        } else if (is_mobile_push==="Y") {
            username.textContent = `🖈${userNick}`;
            username.setAttribute('title','고정됨(알림 받기 켜짐)');
        } else {
            username.textContent = userNick;
        }
        const cat_no = channel.broad_cate_no;

        const description = document.createElement('span');
        description.classList.add('description');
        description.textContent = getCategoryName(cat_no);

        userElement.setAttribute('broad_cate_no',`${cat_no}`);

        const watchers = document.createElement('span');
        watchers.classList.add('watchers');
        watchers.innerHTML = `<span class="dot" role="img" aria-label="Amount of people watching">🔴</span>${addNumberSeparator(totalViewCnt)}`;

        userElement.appendChild(profilePicture);
        userElement.appendChild(username);
        userElement.appendChild(description);
        userElement.appendChild(watchers);

        return userElement;
    }

    function createUserElement_vod(channel) {
        const userId = channel.user_id;
        const broadNo = channel.title_no;
        const totalViewCnt = channel.view_cnt;
        const broadTitle = channel.title;
        const userNick = channel.user_nick;
        const vod_duration = channel.vod_duration;
        const playerLink = "https://vod.afreecatv.com/player/"+broadNo;
        const broad_thumbnail = `${channel.thumbnail}`;

        const userElement = document.createElement('a');
        userElement.classList.add('user');
        if(!open_newtab){
            userElement.setAttribute('href',`${playerLink}`);
        } else {
            userElement.setAttribute('href',`${playerLink}`);
            userElement.setAttribute('target','_blank');
        }
        userElement.setAttribute('data-watchers',`${totalViewCnt}`);
        userElement.setAttribute('broad_thumbnail',`${broad_thumbnail}`);
        userElement.setAttribute('tooltip',`${broadTitle}`);
        userElement.setAttribute('user_id',`${userId}`);
        userElement.setAttribute('vod_duration',`${vod_duration}`);

        const profilePicture = document.createElement('img');
        const pp_webp="https://stimg.afreecatv.com/LOGO/"+userId.slice(0, 2)+"/"+userId+"/m/"+userId+".webp";
        const pp_jpg="https://profile.img.afreecatv.com/LOGO/"+userId.slice(0, 2)+"/"+userId+"/m/"+userId+".jpg";
        profilePicture.src = pp_webp;
        profilePicture.setAttribute('onerror', `this.onerror=null; this.src='${pp_jpg}'`);
        profilePicture.setAttribute('alt', `${userId}'`);
        if (open_newtab === 1) {
            profilePicture.setAttribute('onclick', `event.preventDefault(); event.stopPropagation(); document.getElementById('sidebar').offsetWidth === 52 ? window.open('${playerLink}', '_blank') : window.open('https://bj.afreecatv.com/${userId}', '_blank');`);
        } else {
            profilePicture.setAttribute('onclick', `event.preventDefault(); event.stopPropagation(); document.getElementById('sidebar').offsetWidth === 52 ? location.href = '${playerLink}' : window.open('https://bj.afreecatv.com/${userId}', '_blank');`);
        }
        // 프로필 휠클릭일 때
        profilePicture.setAttribute('onmousedown', `
            if (event.button === 1) {
                if (document.getElementById('sidebar').offsetWidth !== 52) {
                    event.preventDefault();
                    event.stopPropagation();
                    window.open('https://bj.afreecatv.com/${userId}', '_blank');
                }
            }
        `);
        profilePicture.classList.add('profile-picture');
        profilePicture.classList.add('profile-grayscale');
        const username = document.createElement('span');
        username.classList.add('username');
        username.textContent = userNick;

        const reg_date = channel.reg_date;

        const description = document.createElement('span');
        description.classList.add('description');
        description.textContent = vod_duration;

        const watchers = document.createElement('span');
        watchers.classList.add('watchers');
        watchers.innerHTML = timeSince(reg_date);

        userElement.appendChild(profilePicture);
        userElement.appendChild(username);
        userElement.appendChild(description);
        userElement.appendChild(watchers);

        return userElement;
    }

    function createUserElement_offline(channel) {
        const userId = channel.user_id;
        const totalViewCnt = channel.total_view_cnt;
        const userNick = channel.user_nick;
        const playerLink = "https://bj.afreecatv.com/"+userId;
        const is_mobile_push = channel.is_mobile_push;
        const is_pin = channel.is_pin;

        const userElement = document.createElement('a');
        userElement.classList.add('user');
        if(!open_newtab){
            userElement.setAttribute('href',`${playerLink}`);
        } else {
            userElement.setAttribute('href',`${playerLink}`);
            userElement.setAttribute('target','_blank');
        }
        userElement.setAttribute('data-tooltip-listener', 'false');
        userElement.setAttribute('data-watchers',`${totalViewCnt}`);
        userElement.setAttribute('user_id',`${userId}`);
        if (is_mobile_push) {
            userElement.setAttribute('is_mobile_push', is_mobile_push);
            if (is_pin) {
                userElement.setAttribute('is_pin', 'Y');
            } else {
                userElement.setAttribute('is_pin', 'N');
            }
        }
        const profilePicture = document.createElement('img');
        const pp_webp="https://stimg.afreecatv.com/LOGO/"+userId.slice(0, 2)+"/"+userId+"/m/"+userId+".webp";
        const pp_jpg="https://profile.img.afreecatv.com/LOGO/"+userId.slice(0, 2)+"/"+userId+"/m/"+userId+".jpg";
        profilePicture.src = pp_webp;
        profilePicture.setAttribute('onerror', `this.onerror=null; this.src='${pp_jpg}'`);
        profilePicture.setAttribute('alt', `${userId}'`);
        if (open_newtab === 1) {
            profilePicture.setAttribute('onclick', `event.preventDefault(); event.stopPropagation(); document.getElementById('sidebar').offsetWidth === 52 ? window.open('${playerLink}', '_blank') : window.open('https://bj.afreecatv.com/${userId}', '_blank');`);
        } else {
            profilePicture.setAttribute('onclick', `event.preventDefault(); event.stopPropagation(); document.getElementById('sidebar').offsetWidth === 52 ? location.href = '${playerLink}' : window.open('https://bj.afreecatv.com/${userId}', '_blank');`);
        }
        profilePicture.classList.add('profile-picture');
        profilePicture.classList.add('profile-grayscale');

        const username = document.createElement('span');
        username.classList.add('username');
        username.textContent = `🖈${userNick}`;
        username.setAttribute('title','고정됨(상단 고정 켜짐)');

        const description = document.createElement('span');
        description.classList.add('description');
        description.textContent = '';

        const watchers = document.createElement('span');
        watchers.classList.add('watchers');
        watchers.innerHTML = `<span class="dot profile-grayscale" role="img" aria-label="Amount of people watching">🔴</span>오프라인`;

        userElement.appendChild(profilePicture);
        userElement.appendChild(username);
        userElement.appendChild(description);
        userElement.appendChild(watchers);

        return userElement;
    }

    function timeSince(timestamp) {
        const currentTime = new Date();
        const pastTime = new Date(timestamp.replace(/-/g, '/'));

        const seconds = Math.floor((currentTime - pastTime) / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 365) {
            const years = Math.floor(days / 365);
            return years + "년 전";
        } else if (days > 30) {
            const months = Math.floor(days / 30);
            return months + "개월 전";
        } else if (days > 0) {
            return days + "일 전";
        } else if (hours > 0) {
            return hours + "시간 전";
        } else if (minutes > 0) {
            return minutes + "분 전";
        } else {
            return seconds + "초 전";
        }
    }

    function isUserInFollowSection(userid) {
        const followUsers = document.body.querySelectorAll('.users-section.follow .user');

        // 유저가 포함되어 있는지 확인
        for (const user of followUsers) {
            if (user.getAttribute('user_id') === userid) {
                return true; // 유저가 포함되어 있으면 true를 리턴
            }
        }

        return false; // 유저가 포함되어 있지 않으면 false를 리턴
    }

    function insertFoldButton() {
        const foldButton = `
        <div class="button-fold-sidebar" role="button"></div>
        <div class="button-unfold-sidebar" role="button"></div>
        `;

        const newHtml = `${foldButton}`;

        const webplayer_scroll = document.getElementById('webplayer_scroll') || document.getElementById('list-container');
        const serviceLnbElement = document.getElementById('sidebar');
        if (serviceLnbElement) {
            serviceLnbElement.insertAdjacentHTML('beforeend', newHtml);
            // 버튼 요소 가져오기
            const buttons = serviceLnbElement.querySelectorAll('.button-fold-sidebar, .button-unfold-sidebar');
            buttons.forEach(function(button) {
                // 버튼에 클릭 이벤트 리스너 추가
                button.addEventListener('click', function () {
                    // sidebar 상태 변경
                    sidebarMinimized = !sidebarMinimized;

                    // max 클래스가 있으면 제거하고 min 클래스 추가
                    if (serviceLnbElement.classList.contains('max')) {
                        serviceLnbElement.classList.remove('max');
                        serviceLnbElement.classList.add('min');
                        webplayer_scroll.style.left = '52px';
                    }
                    // min 클래스가 있으면 제거하고 min 클래스 추가
                    else if (serviceLnbElement.classList.contains('min')) {
                        serviceLnbElement.classList.remove('min');
                        serviceLnbElement.classList.add('max');
                        webplayer_scroll.style.left = '240px';
                    }

                    // sidebarMinimized 값을 저장
                    GM_setValue("sidebarMinimized", sidebarMinimized ? 1 : 0);
                });
            });
        }
    }

    function insertTopChannels(update){
        let topIcon = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEzklEQVR4nO1ZaYgcVRB+URMVb7zibTDGA1FBFA90QSHGY3emq/qhO9Nd1TuR+aegiAhCFgSViIoiHmCI+kOMP4zHD0Ex8UciqOCJENR4H4nX6iYao5JVKjOdru6Znp5s98xOYD940DOvXr2q96req6pnzCxmMZiwli4A4K+lybfZkwBAlwHwJCL/Jw2A/0DkK8yeAERaDMDbQuGjRn9KnxlkIAaXNgTdJfT3jRYpAcCXmEGE44ydA8ATkdnQJmvHzgQITkXkb5U5TVrL55lBAkDtJET+Ua30N9Z6C8N++dZKINJma/0TzSDAWnsgAH+o7P0XAD69lc5bCEA/qR163/O8A8xMYnx8fC9EXq1t3HH4wjR6xOBi7eAA9LzwMDMFAF6mVn7Kdfn67DFBRZ9OALzMzAQcJzgfgP5Rq39Pt2MRablS4l9r/YtMPzEyUjsIkTcqIdZaa/fudrzQAtAbavxG8SXTLwDwSmXHv0/nRHGc6vH62EWkFaYfQPSvjdtwUJkuL9flaoLX1aaXYOb9EOlztfrP5uWJyKuUQ3+2ZMmN+5peAYDvUJNNWDt2ZF6ejuMdJWao+N5ueoFSiQ+N2yzfVBRvRLpZ7eqv1tYPMUUDgMbVKn1Rr9fnFsXbWjsPkb7q2d0gdqljHQBemi1U7TSxaUTaUC77i7LoXZduiMdKdl5hCiCSF48yOzMfGhraB5HeUQq/l7VjtrELm8Mx3dzqu6PAa0qBO7PoxRGTCQ0A39bFuLsU/SuFCC8OBcB/h4zLZTqliwtqaxsFtlpLx3UaWy77i5QZbZcbP7cCjkOuWv2PsugB+Dkl+CfNFv5e1cX4jyP6AHIrEA+86N5OtI4TXK6U3SFBmqSQEqmG/wtNxnz3TSdATAUAvR5NTm4H0jkJx10Z8eCntEMLbfp8/nWK9tXcCuioU47GdLoAdBnFcarHhH3yrZN9AC6n8SmX/TN0aJFbAbkZIwf2D09XgD5QW7+8tZ/vV/3vpvEZHR09QqenuRWQhCNkKOd7WiFLrdq2djGStTw/nk62L6/U6/W5OtnJrUCzqtY0ofYxSiKifKIDr12+gEjPtKOpVCqHKV6ThfqA43hnJfslk5IzO1IyveYjCb86pf5qV5VApLOVkp8WoAC9rFYkaO33S/rcz+YX3QsAwXBrf1BT871YhAK3KgFXJ/sB+HHVf3cWPwB+QNE/2jofvxQp4N+SW4Hm9d68iGh7MhxApPWRifE1WfwQ6Sq1wut0X6kUnKDClild3cuFRAUhtmo6jtdnfxokllI2/mXabsqcpig0nW8qDBH0EagduJskp5FXRwGbib0p0A61UMW+J0gCr5j/IFFnU4Hfwv+Hh5cencVH7gNlQhOR6dAmpdgLpmiMjNSOBeDv9DVfKvHJAPRm+J/rBjaLj451EGm9td6CeJFMKts83/QC1vK5OtYH4J/FEdXvtzoVa6Uilwj41gkPJfwWuQdMLwHgX9mYKJ6wqPZgSrQ5B4AeSh9HW/r2BCUvL4lEJSnMGhFGMqpGHZUWS/20A/0GiUL7Inwi1XxEp5u726Ax9uFqtXpwX4WPK+ItAOCn9XGa3Xa+WD4ph4AZFEjlrlF+oRXiqPKcJCvcaDu/3wagx+S2ttbuP9PyzmIWpoH/AeaUFWmyMuZqAAAAAElFTkSuQmCC" style="width:22px">`;
        if(isDarkMode){
            topIcon = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAExUlEQVR4nO1ZaYgcVRB+HlkVjyheibckxgNRQZSomB8RFC8MElGiP0T9LSgiASELgkpERRGPxeBqghhfV3XPrpN+1bsx8yMRVOKJENR4H9FVo+sRjbKulDPtfN07Mz1s98xOYD94sDtd7+v63lGv6rUxs5hFb8L35Xxm97k2/dvsSSCKlhDJOLNMVpv7zfPCS8yeAM+LLmWWXXXnq41Iftdnppfhee5idbTutPtaG4ogii4yvQhmOZtIdsKo77A2PINo5BQi+RJEjAdBdK7pJRCVTyRy38HIf2GtLIyf699JEe5ba0dPML0AaysHMcu74NwPRHLaVDtZyCxjYPf22rXRgWYm0d/fvzeR+LjGmcPFzew9Ty7EDU4krBxmpkAkq2BE/2EOb2ijz4pUdFplZgLM4XnM7i+I9Q+031dWg/C/fd9dYLqJUql0MJFsB+c3WWv3abe/2jJLBWZhu+4l0y0QuWfB+Z+nE1GYw+NSYXeN6QZ8X65KreEV0+VilhuTXOEVppMYHKzsz+w+hvX7Yl5OZrceZvOjMAz3M50CkdwDI7/T2vDIvJzM0VG6DIF3pekEgqByaHLNutuL4maO7gDeH60dnWuKBpH0w0s+GRjYOqcobmttH7N81rGzQddlMtcJb812yp2qa5rZbfP9DYuy7JndbclcyfYVJsDzwpuSWWZr8kqlsi+RvAF93sqaMWttnzpe75N9qrcNIjcC03tvtr2snFrQuLvb6Hcf2IeFOK8bill2x8S+Hy7IOqCY3a9pAfqbtS8f26qv729YBAP1p574uQUwR8uB9L1se3kJ7D/QBiLWt9H//fpguWsLEFBPvJjlwda20VKwndAkTUvIaqYa/x4tbc3hHppOgthKwEZ4+fJmdpOTk3vhxtV8CZx6Dje02jbjIZLrQUCUWwBmnRoam9npdOM1CrObDwLmJ4t9WdacZ+R0TC1yC9CTsb4mRw9vZkfk3oFRXj2VRx4GAW824xkeHj4Cy9PcArTgiAk1vje2iZaA87sa5UjWlucly8nG1ysDA1vnYLGTW0B1OcRLqHGOghklkTzTggv2gnuhkU25XD4MuMZzC0hWXtGZ6edaSWnMjm1a3flowQ8C/mh0K+F54Vlg82FuAcxuGKb05vRz33fXYNzP4sNzgSi6eqoAuQX4SgUIkLuA0G/g0NOw/u/PFuAegRF+sgHfEAzYnbkF6PEeH0S6VNLpALPbAg5dmc0XXQ4DshmfBYEcH6ct+k683csFvEFIjxrm8Rj7mwsIF4CAT1vMZqUQ56tOhoshHZjAEIgbuJ0ip1pX1xM2kwzFE/Gzwr8naAEPL/5Gs87a7z/Fvw8NbTw6i6d2HvxfV5v60tkBMxmYolEqjRzDLF/hMR8E7iRm9ypkj9dl8aRynS3WRidjqK7ebJfnmU4gCKJzMNcnku91I4JDr7W6rNUbuWTCJ5uVA/7/Rc8B00kQucv0RbDZ0u3RRtlmLVt9rFk/+s/5Ln2Cqn55wUJlSvn4ijqjFZW26nczt6m5aLdNs9CuOF8XMTqXSJ7AcnMabTeze3zduvCQrjqfFKKb0D2P4TSr1WqDQQ0CplegN3e165c1tY06VpsdbWNE7nUieUpPa2vtATPt7yxmYar4F3KMj24yKDCnAAAAAElFTkSuQmCC" style="width:22px">`;
        }
        if(!update){
            const newHtml = ``;

            const serviceLnbElement = document.getElementById('sidebar');
            if (serviceLnbElement) {
                serviceLnbElement.insertAdjacentHTML('beforeend', newHtml);
            }
        }

        const openList = document.body.querySelectorAll('.users-section.top .user:not(.show-more)').length;

        getHiddenbjListAndCallback(function(data) {
            // 응답으로 받은 데이터를 전역 변수 hiddenBJList에 할당
            hiddenBJList.length = 0; // 기존 데이터 비우기
            hiddenBJList.push(...data); // 새로운 데이터 할당

            GM_xmlhttpRequest({
                method: 'GET',
                url: 'https://live.afreecatv.com/api/main_broad_list_api.php?selectType=action&orderType=view_cnt&pageNo=1&lang=ko_KR',
                headers: {
                    'Content-Type': 'application/json',
                },
                onload: function(response) {
                    try {
                        // 응답을 JSON으로 파싱
                        const jsonResponse = JSON.parse(response.responseText);

                        // 응답에서 필요한 정보 추출
                        const channels = jsonResponse.broad;

                        // users-section에 동적으로 user 요소 추가
                        const usersSection = document.body.querySelector('.users-section.top');

                        let temp_html = '';

                        channels.forEach(function(channel, index) {
                            if (hiddenBJList.includes(channel.user_id)) {
                                return;
                            }
                            if(isCategoryBlocked(channel.broad_cate_no)){
                                return;
                            }
                            if(isUserBlocked(channel.user_id)){
                                return;
                            }
                            const userElement = createUserElement(channel, 0, 0);
                            if(update){
                                temp_html += userElement.outerHTML;
                            } else {
                                usersSection.appendChild(userElement);
                            }
                        });
                        if(update){
                            updateElementWithContent(usersSection, temp_html);
                        }
                        usersSection.classList.add('loaded');
                        if(update){
                            showMore('.users-section.top', 'toggleButton3', openList, display_top);
                        } else {
                            showMore('.users-section.top', 'toggleButton3', display_top, display_top);
                        }
                        makethumbnailtooltip();
                    } catch (error) {
                        console.error('Error parsing JSON:', error);
                    }
                },
                onerror: function(error) {
                    console.error('Error:', error);
                }
            });
        });

    }

    function insertFavoriteChannels(response,update){
        const openList = document.body.querySelectorAll('.users-section.follow .user:not(.show-more)').length;
        let followIcon = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAADyUlEQVR4nO1YTWhdVRA+/TH+Ba3gorgQFBS0ulEsqItXFCWLmuZ8k0GSvDtzo/C0YFu0+IfIU7rQnSKCIIo7XYmRIiL+oCsRBbFimwr+ddOVWKy2aovK5OYl552Q9+59P7kp3A8O5OWe+c7MnJk5c45zFSpUqFBhLTA9PX3Z5KTMAjoHyDygfwByGtAfAX3Te/HMvKkbj80hSgHIW5nsAodxzRPJO4Cmu3bploEpzswXAvIkICeI9L/OQ44wJ7euxkWU3mZzcvD8BugTqnpBX8qPj993BaBfdl+wbZwxg51zG1o8zWZzI6BP2bciXIB+YTr0rDyRHIsIvyHSvcyz19fr9YvNQ/Y3oPuJ5OfIiy+1uAB5Ofr2E5E8PDGRXGccxkUk2wDZB8ihaO6xwkZkYRN6Xv6anJQHzJOdZEzpyIvPEMmz0f9e7BQazWZzI5E+aGuGO1EonCwEQuWZk1p+WX109ZBIHsnLQ6Q7IiMey11twoQ1z+dddHlxeW2l8vJqUR5AdoeJnas6WakMY75T2KyGnTsbFxHpt4HyhyzEivIw86b2nEi0q5DV4sBze12PmJhIrl2s7UeA9JpeeQDZFzji7a4CRHq0JWAVxpUMItkWGDDfVQDQk8sG8KgrGcw8GoT0ya4Cdqy3BGZmZi5xJYO5cWlBAyxulzL/blcyvNexICcPdxWwclcoaYYMQOcCfV7pKkCkdwYW/8ss211JYNabTYdAnx155DYs9jytMPq4l7OgXzSzluKTwPtf5xb2Pr0jauL2uzUGVrQkBfORSN4IrP9nLUPJ+/QmQP8O1n+9MEnW4urhsAVm1q1uyGDWrVm7vaT8d9aa9EiW3gjoqSCUvhrm4cbMo7ZGsN4p7+s39EUKKAF6NtiJ92q12mY3YNRqtc3GHSh/1u7OAyG3ljpK6oNjY3vOHwi5c67RaJxnZ064hve6xw0SRHogMmKOmUf65WXmkfCwWhwH3DAQG0Ek7/fzcsDMI0T6bsT5ghsmsntu20580MtlxUIQ0INrqnwLRPp0tOUfFil1NheQj0pRvgUieTzaiU/ztN82h0g/i5R/zpWBxUv3UrNlNXxqauryTg8GRPJ5ZPjzrkwA8lC7EXaBX3liZyfs8kXfZPygS2WvIJJ6+GyYPdrOXt36zpxcSSTfh4cUoPe79QQgudeavkDJX+xlgrl+FZH8EHj+DKCJW4/wXsbbX9PkuI3g92kgvcetZ1D2JPh7/DJHJH96n97lzgV4n94CyK+B508Aers7l8AL99mFxD1qF5Sy9alQoUIFNxT8D3rbJQHjF4hlAAAAAElFTkSuQmCC" style="width:20px">`;
        if(isDarkMode){
            followIcon = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD1ElEQVR4nO2YXYhVVRTHd6NZ1tAH9CA9CAYJZb4oCdVDUhS9GFQPvSgWPViQiklmRJzCh3orIgijGFAo2Gf9z5mud85aZ6Y69SSSEBrlFGTli0+hqGkf0sSac+/Mvnvy3nvu5wjnBxcunLP+e6191tp77W1MSUlJSckgqFartwLyLJGMAzIN8AWALwF8EpBPgOQJa+2SVjr6ThTxk0T8aW47q3GhphkT8TNxnN3SM8ettcuJ+FWAzwIy0/zHJ6KI77uSVhjK/fpOKx0iPkMke8fGsuu7cn58fPJ2gL9p7XjD4P9owDMzM9fUdYIgGCGS1/RZQa0j6kPHzhPxKU/0GMA7rE3uPnAgvVFnSP8TyW5AfvUGf6+uRSTvNz6TX4B0VxRN3qUaqhWGvIaIdxLJcU/nVOEgNG3cmSeSPwHepjPZzEad9lLqDYDf9Cbh3WapEQTBSBTx8/mY81+iUDrlOT/vfBQlDxawfblJSrzUrk4Y8kYviD0FVhu3YHmbKQggH/2P8x8W1SGSF9zCbmt10qXSzflmaXMlKpXKDUT8nfMVj2uKFdWx1i5xayIM061tBMCxM/s7TIdE0cTq2tp+gmjyzk51iHinMxFow0B+rBvoCmOGTBjyGicjplsaAHx+PoBs1AwZa7NRJyPOtzSobeuzBgcPJjeZIWPt1M0FA9C8nSuaRwfiZRMAecxZiX4wrdDlrlDR9BnKm8e6Px+0NAjD5GEn4n+jSDaYIRHH6Xr1YT4jeGNLI23C8p5nLogvOtkLuiUIghGAv3T8+LZtYyB9yGu+dpsBQ15LUrgeARlzqv/vQaYSwOsA+csZ/+PCItriatW7LbC11RWmz1hbXZG323Oz/722Jh2JxfHEWkAuOnl4tJ+bm7XZqI7hOH8RSO/pSpRIngLksiM6kWXZUtNjsixbqtrOOJf17NwTcW2pvdb4UJIk1/VE3Bizf//Ra3XP8Vrw7aaXALLPW5nGrbXLutW11i5zN6vab5/pBwuDYO7m5sDmzn/mab5j+kl+zm0496adHFY0BYn40ECdrwPw694nnyqy1Om7gHw+FOfrAPKKVxNftdN+6zsAf+19xbfMMNBDt9ts6RpeqVRua3ZhQCSHvZl/2wwTInmxMQg9wC/csfMd1j3oz9psN4uBMEw2N14b8kmiqTvqz62dWgnwT+4mRZQ8ZxYTRPK0Nn1OEL/pzYS16SqAf/buTreYxQjAj7u3aYCcrv3qQV0iSjeZxUyYXwmeW3gzJ38A8oi5GgCSewH+3Zn5s0TpA+ZqIo7T9Vq4+UUZrxu2PyUlJSWmL/wH5eEJ5sFzGH4AAAAASUVORK5CYII=" style="width:20px">`;
        }

        if(!update){
            const newHtml = `
            <div class="top-section follow">
                <span class="max">${followIcon}</span>
                <span class="min">${followIcon}</span>
            </div>
            <div class="users-section follow">
            </div>
            `;

            const serviceLnbElement = document.getElementById('sidebar');
            if (serviceLnbElement) {
                serviceLnbElement.insertAdjacentHTML('beforeend', newHtml);
            }
        }

        try {

            const jsonData = response;
            // users-section에 동적으로 user 요소 추가
            const usersSection = document.body.querySelector('.users-section.follow');

            let temp_html = '';
            jsonData.data.forEach(function(item, index) {
                const channel = item.broad_info[0];
                const is_live = item.is_live;
                const is_mobile_push = pinSwitch_push === 1 ? item.is_mobile_push : "N";
                const is_pin = pinSwitch_pin === 1 ? item.is_pin : false;

                if (is_live){
                    const userElement = createUserElement(channel,is_mobile_push,is_pin);
                    if(update){
                        temp_html += userElement.outerHTML;
                    } else {
                        usersSection.appendChild(userElement);
                    }
                } else {
                    // 비 방송중이면서 고정된 채널
                    if (is_pin){
                        const userElement = createUserElement_offline(item);
                        if(update){
                            temp_html += userElement.outerHTML;
                        } else {
                            usersSection.appendChild(userElement);
                        }
                    }
                }
            });
            if(update){
                updateElementWithContent(usersSection, temp_html);
            }
            document.body.querySelector('.users-section.follow').classList.add('loaded');
            makethumbnailtooltip();
            desc_order('.users-section.follow');
            if(update){
                showMore('.users-section.follow', 'toggleButton2', openList, display_follow);
            } else {
                showMore('.users-section.follow', 'toggleButton2', display_follow, display_follow);
            }
        } catch (error) {
            console.error('Error parsing JSON:', error);
        }
    }

    function insertMyplusChannels(update){
        let myplusIcon = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABmElEQVR4nO2Wu0oDQRSGNyhYCN6DF8RKwUewENKmyWXO2VMkuznHGLQLFr6BKL6AlWChpa2lYCsYFAUREREtRUXURrBQVk+ICpEsJruI+WFgZ3aG/5t/Z2fGspr6yyKa7UTkXUS5BeBVx3E6AjNPpaQLkfcQ5bVSeCMQ82w22w0gJc8UQC6Mkbg+PzTcnKjQg8j7OutzotwIkTuq9euGmqfTuV4AOdC4z4xxhi3LigDwmiaw3jDzTCbTh8iHH0Z8mkxOD3ntxkhRzZ8ApsYaYk6UjwLIkcZ8QiQD5XcAsqXtM3UzxC8ru1IA5DiRKPSX+8VisVZEfqzWX9O6A5AlImr5NQBRPvq5nzEy8ZP5N5AF3wBWlbofEeUmNb2bUACMcQb1r7kPCYCTOn4nFABEXtQElkMCkG1dA+kwACLet/fGljeuQAEAZFxnf+VrINYJwLaZdQ/YDAUAgFc0gfmQAOT9zuBtRoEDxOPFNkR+RpQX13XbgwaIeKejxl/yZe6p1gOmlmLbnLf8CutizpcAPOfbvKmm/p3eAMYsiMeMK5ANAAAAAElFTkSuQmCC" style="width:24px">`;
        if(isDarkMode){
            myplusIcon = `<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAABkUlEQVR4nO2Wu0oDQRSGExQsBO/BC2Kl4CNY+ABW4hMIFpZi4RuI4gtYCRYm3eE/m4th5uiKKQWDoiAiIqKlqIjaCBYjQyaYFIYsJruI+eHAzuwM/zdnDjMTi7X0l0XkdwNyBOgnQG+lUqorNPN0utADyDGzmIpIhmKez+d7mXWxZKpvmWXGfgPy2nRzIukD5MQZ3hD5Y0QyXmrrh6aae57fzyynbuXXzGrUGBNn1tsOYKdp5rlcbgDQZ26vrzKZ/RHbzyxLDugd2J9oijmRSjDLuVvlJVF+qPwP0Lu23/NksWGGXF3ZlXGRzR4MlscVCoV2QN5qjLeZeQZknYjafg1ApBLV49RUbfPvAGQ1MEDsh3YQeZ6adgCPkQAw62FXOy9RAcy6WjiMCmDNAWxEBCC+q4G50AGMMXG793Zu+eAKFQCQSZf++0ATuUEAzDLv0k+RAACy6QBWIgFg92awh1HoAEqpDkA+AP2ZTO51hgpgjInb29EVYDGQuVW9F0ydsRALKm6M8R2glwObt9TSv9MXwO1y9weCI98AAAAASUVORK5CYII=" style="width:24px">`;

        }
        if(!update){
            const newHtml = `
            <div class="top-section myplus">
                <span class="max">${myplusIcon}</span>
                <span class="min">${myplusIcon}</span>
            </div>
            <div class="users-section myplus">
            </div>
        `;

            const serviceLnbElement = document.getElementById('sidebar');
            if (serviceLnbElement) {
                serviceLnbElement.insertAdjacentHTML('beforeend', newHtml);
            }
        }

        const openList = document.body.querySelectorAll('.users-section.myplus .user:not(.show-more)').length;
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://live.afreecatv.com/api/myplus/preferbjLiveVodController.php?nInitCnt=6&szRelationType=C',
            headers: {
                'Content-Type': 'application/json',
            },
            onload: function(response) {
                try {
                    const jsonResponse = JSON.parse(response.responseText);

                    const channels = jsonResponse.DATA.live_list;
                    const usersSection = document.body.querySelector('.users-section.myplus');

                    let temp_html = '';

                    channels.forEach(function(channel, index) {
                        if (isCategoryBlocked(channel.broad_cate_no)){
                            return;
                        }
                        if(isUserBlocked(channel.user_id)){
                            return;
                        }
                        if(update && removeDupSwitch){
                            if(isUserInFollowSection(channel.user_id)){
                                return;
                            }
                        }
                        const userElement = createUserElement(channel, 0, 0);
                        if(update){
                            temp_html += userElement.outerHTML;
                        } else {
                            usersSection.appendChild(userElement);
                        }
                    });
                    if(update){
                        updateElementWithContent(usersSection, temp_html);
                    }
                    usersSection.classList.add('loaded');
                    makethumbnailtooltip();
                    if(!myplus_order){
                        desc_order('.users-section.myplus');
                    }
                    if(removeDupSwitch){
                        waitForElement('.users-section.follow.loaded', function (elementSelector, element) {
                            removeDuplicates();
                        });
                    }
                    if(update){
                        showMore('.users-section.myplus', 'toggleButton', openList, display_myplus);
                    } else {
                        showMore('.users-section.myplus', 'toggleButton', display_myplus, display_myplus);
                    }
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            },
            onerror: function(error) {
                console.error('Error:', error);
            }
        });
    }

    function makethumbnailtooltip() {
        try {
            const elements = document.getElementsByClassName('user');
            const tooltipcontainer = document.getElementsByClassName('tooltip-container')[0];

            // 각 요소에 대해 반복하면서 이벤트 리스너 추가
            for (const element of elements) {
                const is_offline = element.getAttribute('data-tooltip-listener') === 'false';
                if(is_offline) continue;
                const hasEventListener = element.getAttribute('data-tooltip-listener') === 'true';
                const username = element.querySelector('span.username');
                const description = element.querySelector('span.description');
                const watchers = element.querySelector('span.watchers');
                if (!hasEventListener) {
                    element.addEventListener('mouseenter', function () {
                        const rect = this.getBoundingClientRect();
                        const elementX = rect.left + document.getElementById('sidebar').offsetWidth; // 요소의 X 좌표
                        const elementY = rect.top; // 요소의 Y 좌표

                        // 썸네일 이미지 URL 및 재생 시간 가져오기
                        let imgSrc = this.getAttribute('broad_thumbnail');
                        const broad_title = this.getAttribute('tooltip');
                        const broad_start = this.getAttribute('broad_start');
                        const vod_duration = this.getAttribute('vod_duration');

                        // 각 툴팁에 대해 위치 설정
                        tooltipcontainer.style.left = `${elementX}px`;
                        tooltipcontainer.style.top = `${elementY}px`;

                        // 툴팁 내용 설정 (이미지, 텍스트 및 재생 시간)
                        let randomTimeCode = new Date().getTime();
                        if(broad_start) imgSrc += `?${randomTimeCode}`;
                        let tooltipContent = `<img src="${imgSrc}">`;
                        if(broad_start){
                            const videoDuration = getElapsedTime(broad_start, "HH:MM");
                            tooltipContent += `<div class="duration-overlay">${videoDuration}</div>`;
                        } else if(vod_duration) {
                            tooltipContent += `<div class="duration-overlay">${vod_duration}</div>`;
                        }

                        // 만약 sidebar의 폭이 52px일 때 추가 정보 표시
                        if(document.getElementById('sidebar').offsetWidth === 52){
                            tooltipContent += `<div class="tooltiptext">${username.textContent} · ${description.textContent} · ${watchers.textContent}</br>${broad_title}</div>`;
                        } else {
                            tooltipContent += `<div class="tooltiptext">${broad_title}</div>`;
                        }

                        // 툴팁 내용 추가
                        tooltipcontainer.innerHTML = tooltipContent;

                        // 툴팁 표시
                        tooltipcontainer.style.display = 'block';
                    });

                    element.addEventListener('mouseleave', function () {
                        tooltipcontainer.style.display = 'none';
                    });

                    // 이벤트 리스너가 적용되었음을 표시
                    element.setAttribute('data-tooltip-listener', 'true');
                }
            }
        } catch (error) {
            console.error('makethumbnailtooltip 함수에서 오류가 발생했습니다:', error);
            // 여기에 적절한 오류 처리 코드를 추가하세요
        }
    }

    function showMore(containerSelector, buttonId, n, fixed_n) {
        const userContainer = document.body.querySelector(containerSelector);
        const users = userContainer.querySelectorAll('.user');
        const displayperClick = 10;

        //n보다 목록이 적으면 함수를 끝낸다
        if (users.length < fixed_n + 1) {
            return false;
        }

        // n개를 넘는 모든 요소를 숨긴다
        users.forEach((user, index) => {
            if (index >= n) {
                user.classList.add('show-more');
            }
        });

        const toggleButton = document.createElement('button');
        if(users.length > n){
            toggleButton.textContent = `더 보기 (${users.length - n})`;
        } else {
            toggleButton.textContent = `접기`;
        }


        toggleButton.id = buttonId;

        userContainer.appendChild(toggleButton);
        const toggleButtonElement = document.getElementById(buttonId);

        toggleButtonElement.addEventListener('click', function () {
            const users = userContainer.querySelectorAll('.user'); // 전체
            const hiddenUsers = userContainer.querySelectorAll('.user.show-more'); // 숨겨진 요소
            let hiddenUsers_length = hiddenUsers.length;
            // 조건: 클릭시 숨겨진 요소가 0 이상 = 더 보기 눌렀을 때
            if (hiddenUsers_length > 0) {
                hiddenUsers.forEach((hiddenuser, index) => {
                    // 클릭당 보여질만큼 목록을 보여주고 숨긴 요소 숫자에서 개수를 뺀다
                    if (index < displayperClick) {
                        hiddenuser.classList.remove('show-more');
                        hiddenUsers_length = hiddenUsers_length - 1;
                    }
                });
                // 결과: 더 보기 누른 후 남은 요소에 따라서 텍스트 변경
                if(hiddenUsers_length > 0){
                    toggleButtonElement.textContent = `더 보기 (${hiddenUsers_length})`;
                } else {
                    toggleButtonElement.textContent = `접기`;
                }
            } else { // 조건: 클릭시 숨겨진 요소가 0 = 초기화해야 함 = 접기 눌렀을 때
                users.forEach((user, index) => {
                    if (index >= fixed_n) {
                        user.classList.add('show-more');
                        //hiddenUsers_length = hiddenUsers_length + 1;
                    }
                });
                toggleButtonElement.textContent = `더 보기 (${users.length - fixed_n})`;
            }

        });

    }

    function removeDuplicates(){
        if(document.body.querySelectorAll('.users-section.follow > .user').length ===0){
            return false;
        }
        // .users-section.follow > .user 모든 요소 반복
        document.body.querySelectorAll('.users-section.follow > .user').forEach(followUser => {
            const followUserId = followUser.getAttribute('user_id');

            // .users-section.myplus > .user 모든 요소 반복
            document.body.querySelectorAll('.users-section.myplus > .user').forEach(myplusUser => {
                const myplusUserId = myplusUser.getAttribute('user_id');

                // user_id 일치 여부 확인
                if (followUserId === myplusUserId) {
                    // 일치할 경우 .user 요소 제거
                    myplusUser.remove();
                }
            });
        });
    }

    function generateBroadcastElements(update){
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://myapi.afreecatv.com/api/favorite',
            headers: {
                'Content-Type': 'application/json',
            },
            onload: function(response) {
                response = response.responseText;
                response = JSON.parse(response);

                // if 문으로 code 값 확인
                if (response.code === -10000) {
                    //console.log('로그인 상태가 아닙니다.');
                    insertTopChannels(update);
                    waitForElement('.users-section.top.loaded', function (elementSelector, element) {
                        document.body.querySelector('.users-section.top.loaded').classList.add('nologinuser');
                    });
                    return false;
                }
                insertFavoriteChannels(response,update);
                if(myplus_position){
                    insertMyplusChannels(update);
                    insertTopChannels(update);
                } else {
                    insertTopChannels(update);
                    insertMyplusChannels(update);
                }
            },
            onerror: function(error) {
                console.error('Error:', error);
            }
        });
    }

    function addModalSettings(){
        var openModalBtn = document.createElement("div");
        openModalBtn.setAttribute("id", "openModalBtn");
        var link = document.createElement("button");
        link.setAttribute("class", "btn-settings-ui");
        openModalBtn.appendChild(link);

        var serviceUtilDiv = document.body.querySelector("div.serviceUtil");
        serviceUtilDiv.prepend(openModalBtn);

        // 모달 컨텐츠를 담고 있는 HTML 문자열
        var modalContentHTML = `
<div id="myModal" class="modal">
    <div class="modal-content">
        <span class="myModalClose">&times;</span>
        <h2 style="font-size: 24px;">설정</h2>

        <div class="divider"></div>
        <h3 style="margin-bottom: 15px; font-size: 16px;">사이드바 옵션</h3>

        <div class="option">
            <label for="favoriteChannelsDisplay">즐겨찾기 채널 표시 수</label>
            <input type="range" id="favoriteChannelsDisplay" min="0" max="20">
            <span id="favoriteChannelsDisplayValue">${display_follow}</span>
        </div>

        <div class="option">
            <label for="myPlusChannelsDisplay">MY+ 채널 표시 수</label>
            <input type="range" id="myPlusChannelsDisplay" min="0" max="20">
            <span id="myPlusChannelsDisplayValue">${display_myplus}</span>
        </div>

        <div class="option">
            <label for="myPlusVODDisplay">MY+ VOD 표시 수</label>
            <input type="range" id="myPlusVODDisplay" min="0" max="20">
            <span id="myPlusVODDisplayValue">${display_myplusvod}</span>
        </div>

        <div class="option">
            <label for="popularChannelsDisplay">인기 채널 표시 수</label>
            <input type="range" id="popularChannelsDisplay" min="0" max="20">
            <span id="popularChannelsDisplayValue">${display_top}</span>
        </div>
        <div class="option">
            <label class="switch">
                <input type="checkbox" id="fixFixedChannel">
                <span class="slider round"></span>
            </label>
            <label for="fixFixedChannel" title="[즐겨찾기] 하단에서 [즐겨찾기 전체]에서 설정">'목록 상단 고정' 설정된 채널을 상단 고정<sup>1)</sup></label>
        </div>

        <div class="option">
            <label class="switch">
                <input type="checkbox" id="fixNotificationChannel">
                <span class="slider round"></span>
            </label>
            <label for="fixNotificationChannel">알림 설정된 채널을 상단 고정</label>
        </div>

        <div class="option">
            <label class="switch">
                <input type="checkbox" id="popularChannelsFirst">
                <span class="slider round"></span>
            </label>
            <label for="popularChannelsFirst">인기채널보다 MY+를 위에 표시</label>
        </div>

        <div class="option">
            <label class="switch">
                <input type="checkbox" id="mpSortByViewers">
                <span class="slider round"></span>
            </label>
            <label for="mpSortByViewers">MY+ 정렬을 추천순으로 변경</label>
        </div>

        <div class="option">
            <label class="switch">
                <input type="checkbox" id="removeDuplicates">
                <span class="slider round"></span>
            </label>
            <label for="removeDuplicates">MY+에서 즐찾 중복 제거</label>
        </div>

        <div class="option">
            <label class="switch">
                <input type="checkbox" id="openInNewTab">
                <span class="slider round"></span>
            </label>
            <label for="openInNewTab">방송목록 클릭 시 새 탭으로 열기</label>
        </div>

        <div class="option">
            <label class="switch">
                <input type="checkbox" id="sendLoadBroadCheck">
                <span class="slider round"></span>
            </label>
            <label for="sendLoadBroadCheck">새로고침 없는 방송 전환 사용</label>
        </div>

        <div class="divider"></div>
        <h3 style="margin-bottom: 15px; font-size: 16px;">LIVE 플레이어 옵션</h3>
        <div class="option">
            <label class="switch">
                <input type="checkbox" id="showPauseButton">
                <span class="slider round"></span>
            </label>
            <label for="showPauseButton">일시정지 버튼 표시</label>
        </div>

        <div class="option">
            <label class="switch">
                <input type="checkbox" id="showBroadcastTime">
                <span class="slider round"></span>
            </label>
            <label for="showBroadcastTime">방송 경과 시간 표시</label>
        </div>

        <div class="option">
            <label class="switch">
                <input type="checkbox" id="showBufferTime">
                <span class="slider round"></span>
            </label>
            <label for="showBufferTime">남은 버퍼 시간 표시</label>
        </div>

        <div class="option">
            <label class="switch">
                <input type="checkbox" id="switchSharpmodeShortcut">
                <span class="slider round"></span>
            </label>
            <label for="switchSharpmodeShortcut">'선명한 모드' 단축키(e) 사용</label>
        </div>

        <div class="option">
            <label class="switch">
                <input type="checkbox" id="switchLLShortcut">
                <span class="slider round"></span>
            </label>
            <label for="switchLLShortcut">'시차 단축' 단축키(d) 사용</label>
        </div>

        <div class="option">
            <label class="switch">
                <input type="checkbox" id="mutedInactiveTabs">
                <span class="slider round"></span>
            </label>
            <label for="mutedInactiveTabs">비활성화된 탭 음소거</label>
        </div>

        <div class="option">
            <label class="switch">
                <input type="checkbox" id="lowerQualityInactiveTabs">
                <span class="slider round"></span>
            </label>
            <label for="lowerQualityInactiveTabs">비활성화된 탭 화질 낮추기</label>
        </div>

        <div class="option">
            <label class="switch">
                <input type="checkbox" id="mouseOverSideBar">
                <span class="slider round"></span>
            </label>
            <label for="mouseOverSideBar">스크린모드일 때 좌측 마우스 오버시 사이드바 사용</label>
        </div>

        <div class="option">
            <label class="switch">
                <input type="checkbox" id="chatPosition">
                <span class="slider round"></span>
            </label>
            <label for="chatPosition">스크린모드일 때 세로로 긴 화면에서 채팅창을 아래에 위치</label>
        </div>

        <div class="divider"></div>
        <h3 style="margin-bottom: 15px; font-size: 16px;">VOD 플레이어 옵션</h3>
        <div class="option">
            <label class="switch">
                <input type="checkbox" id="selectBestQuality">
                <span class="slider round"></span>
            </label>
            <label for="selectBestQuality">최고화질 자동 선택</label>
        </div>

        <div class="divider"></div>
        <h3 style="margin-bottom: 15px; font-size: 16px;">채팅창 옵션</h3>

        <div class="option">
            <label for="nicknameWidthDisplay">닉네임 가로 크기</label>
            <input type="range" id="nicknameWidthDisplay" min="86" max="166">
            <span id="nicknameWidthDisplayValue">${nicknameWidth}</span>
        </div>

        <div class="option">
            <label class="switch">
                <input type="checkbox" id="selectHideSupporterBadge">
                <span class="slider round"></span>
            </label>
            <label for="selectHideSupporterBadge">서포터 배지 숨기기</label>
        </div>
        <div class="option">
            <label class="switch">
                <input type="checkbox" id="selectHideFanBadge">
                <span class="slider round"></span>
            </label>
            <label for="selectHideFanBadge">팬 배지 숨기기</label>
        </div>
        <div class="option">
            <label class="switch">
                <input type="checkbox" id="selectHideSubBadge">
                <span class="slider round"></span>
            </label>
            <label for="selectHideSubBadge">구독 배지 숨기기</label>
        </div>
        <div class="option">
            <label class="switch">
                <input type="checkbox" id="selectHideVIPBadge">
                <span class="slider round"></span>
            </label>
            <label for="selectHideVIPBadge">열혈 배지 숨기기</label>
        </div>
        <div class="option">
            <label class="switch">
                <input type="checkbox" id="selectHideMngrBadge">
                <span class="slider round"></span>
            </label>
            <label for="selectHideMngrBadge">매니저 배지 숨기기</label>
        </div>
        <div class="option">
            <label class="switch">
                <input type="checkbox" id="selectHideStreamerBadge">
                <span class="slider round"></span>
            </label>
            <label for="selectHideStreamerBadge">스트리머 배지 숨기기</label>
        </div>
        <div class="option">
            <label class="switch">
                <input type="checkbox" id="selectNewVIPBadge">
                <span class="slider round"></span>
            </label>
            <label for="selectNewVIPBadge">열혈 배지 변경</label>
        </div>
        <div class="option">
            <label class="switch">
                <input type="checkbox" id="selectBlockWords">
                <span class="slider round"></span>
            </label>
            <label for="selectBlockWords">단어 차단<sup>2)</sup></label>
            <textarea id="blockWordsInput" placeholder="콤마(,)로 구분하여 단어 입력" style="width: 340px; height: 34px; border: 1px solid #ccc;">${registeredWords}</textarea>
        </div>
        <div class="divider"></div>
        <h3 style="margin-bottom: 15px; font-size: 16px;">차단 관리</h3>
        <span style="margin-bottom: 15px; font-size: 12px; display: block;">채널 차단: 방송 목록(사이드바 아님)에서 닉네임을 클릭하면 가능합니다.</span>
        <span style="margin-bottom: 15px; font-size: 12px; display: block;">채널 차단 해제: 기존 방식대로 Tampermonkey 아이콘을 눌러서 가능합니다.</span>

        <div class="divider"></div>
        <h3 style="margin-bottom: 15px; font-size: 16px;">부가 설명</h3>
        <span style="margin-bottom: 15px; font-size: 12px; display: block;">1) '목록 상단 고정'은 [즐겨찾기] 페이지 하단 [즐겨찾기 전체]에서 특정 채널을 고정하면 사이드바에서도 상단 고정이 되며, 오프라인일 때도 유지됩니다.</span>
        <span style="margin-bottom: 15px; font-size: 12px; display: block;">2) 해당 단어를 포함하는 메시지 숨김. 완전 일치할 때만 숨김은 단어 앞에 e:를 붙이기. <br>예시) ㄱㅇㅇ,ㅔㅔ,e:손,e:흥,e:민,e:극,e:나,e:락'</span>
        <span style="margin-bottom: 15px; font-size: 12px; display: block;">버그 신고는 <a href="https://greasyfork.org/ko/scripts/484713" target="_blank">https://greasyfork.org/ko/scripts/484713</a>에서 가능합니다.</span>
    </div>
</div>
`;

        // 모달 컨텐츠를 body에 삽입
        document.body.insertAdjacentHTML("beforeend", modalContentHTML);

        // 모달 열기 버튼에 이벤트 리스너 추가
        openModalBtn.addEventListener("click", function() {
            // 모달을 표시
            document.getElementById("myModal").style.display = "block";
            updateSettingsData();
        });

        // 모달 닫기 버튼에 이벤트 리스너 추가
        var closeModalBtn = document.body.querySelector(".myModalClose");
        closeModalBtn.addEventListener("click", function() {
            // 모달을 숨김
            var modal = document.getElementById("myModal");
            if (modal) {
                modal.style.display = "none";
            }
        });
    }

    function updateSettingsData(){

        function setCheckboxAndSaveValue(elementId, storageVariable, storageKey) {
            const checkbox = document.getElementById(elementId);
            checkbox.checked = (storageVariable === 1);

            checkbox.addEventListener("change", function() {
                GM_setValue(storageKey, this.checked ? 1 : 0);
                storageVariable = storageVariable ? 0 : 1;
                if(elementId === "selectNewVIPBadge") changeVIPBadge(storageVariable);
            });
        }

        // 함수를 사용하여 각 체크박스를 설정하고 값을 저장합니다.
        setCheckboxAndSaveValue("fixFixedChannel", pinSwitch_pin, "pinSwitch_pin");
        setCheckboxAndSaveValue("fixNotificationChannel", pinSwitch_push, "pinSwitch_push");
        setCheckboxAndSaveValue("showBroadcastTime", showUptime, "showUptime");
        setCheckboxAndSaveValue("showBufferTime", showRemainingBuffer, "showRemainingBuffer");
        setCheckboxAndSaveValue("mutedInactiveTabs", autoChangeMute, "autoChangeMute");
        setCheckboxAndSaveValue("lowerQualityInactiveTabs", autoChangeQuality, "autoChangeQuality");
        setCheckboxAndSaveValue("popularChannelsFirst", myplus_position, "myplus_position");
        setCheckboxAndSaveValue("mpSortByViewers", myplus_order, "myplus_order");
        setCheckboxAndSaveValue("removeDuplicates", removeDupSwitch, "removeDupSwitch");
        setCheckboxAndSaveValue("openInNewTab", open_newtab, "open_newtab");
        setCheckboxAndSaveValue("mouseOverSideBar", smodeSidebar, "smodeSidebar");
        setCheckboxAndSaveValue("chatPosition", bottomChatSwitch, "bottomChatSwitch");
        setCheckboxAndSaveValue("showPauseButton", makePauseButton, "makePauseButton");
        setCheckboxAndSaveValue("switchSharpmodeShortcut", makeSharpModeShortcut, "makeSharpModeShortcut");
        setCheckboxAndSaveValue("switchLLShortcut", makeLowLatencyShortcut, "makeLowLatencyShortcut");
        setCheckboxAndSaveValue("sendLoadBroadCheck", sendLoadBroadSwitchNew, "sendLoadBroadSwitchNew");
        setCheckboxAndSaveValue("selectBestQuality", selectBestQualitySwitch, "selectBestQualitySwitch");

        setCheckboxAndSaveValue("selectHideSupporterBadge", hideSupporterBadgeSwitch, "hideSupporterBadgeSwitch");
        setCheckboxAndSaveValue("selectHideFanBadge", hideFanBadgeSwitch, "hideFanBadgeSwitch");
        setCheckboxAndSaveValue("selectHideSubBadge", hideSubBadgeSwitch, "hideSubBadgeSwitch");
        setCheckboxAndSaveValue("selectHideVIPBadge", hideVIPBadgeSwitch, "hideVIPBadgeSwitch");
        setCheckboxAndSaveValue("selectHideMngrBadge", hideMngrBadgeSwitch, "hideMngrBadgeSwitch");
        setCheckboxAndSaveValue("selectHideStreamerBadge", hideStreamerBadgeSwitch, "hideStreamerBadgeSwitch");
        setCheckboxAndSaveValue("selectNewVIPBadge", newVIPBadgeSwitch, "newVIPBadgeSwitch");
        setCheckboxAndSaveValue("selectBlockWords", blockWordsSwitch, "blockWordsSwitch");

        function handleRangeInput(inputId, displayId, currentValue, storageKey) {
            var input = document.getElementById(inputId);
            input.value = currentValue;

            input.addEventListener("input", function() {
                var newValue = parseInt(this.value);
                if (newValue !== currentValue) {
                    GM_setValue(storageKey, newValue);
                    currentValue = newValue;
                    document.getElementById(displayId).textContent = newValue;
                    if(inputId === "nicknameWidthDisplay") setWidthNickname(newValue);
                }
            });
        }

        handleRangeInput("favoriteChannelsDisplay", "favoriteChannelsDisplayValue", display_follow, "display_follow");
        handleRangeInput("myPlusChannelsDisplay", "myPlusChannelsDisplayValue", display_myplus, "display_myplus");
        handleRangeInput("myPlusVODDisplay", "myPlusVODDisplayValue", display_myplusvod, "display_myplusvod");
        handleRangeInput("popularChannelsDisplay", "popularChannelsDisplayValue", display_top, "display_top");
        handleRangeInput("nicknameWidthDisplay", "nicknameWidthDisplayValue", nicknameWidth, "nicknameWidth");

        // 입력 상자 가져오기
        var inputBox = document.getElementById('blockWordsInput');

        // 입력 상자의 내용이 변경될 때마다 설정 저장
        inputBox.addEventListener('input', function() {
            var inputValue = inputBox.value.trim();
            if (inputValue !== '') {
                registeredWords = inputValue;
                GM_setValue("registeredWords", inputValue);
            }
        });
    }

    function runCommonFunctions(){
        generateBroadcastElements(0);

        setInterval(function() {
            generateBroadcastElements(1);
        }, 60*1000);

        refreshPageOnDarkModeToggle();

        GM_addStyle(CommonStyles);
        addModalSettings();

        blockedUsers.forEach(function(user) {
            registerUnblockMenu(user);
        });
        blockedCategories.forEach(function(category) {
            registerCategoryUnblockMenu(category);
        });
    }

    //=================================공용 함수 끝=================================//

    //=================================메인 페이지 함수=================================//

    function blockButtonOnMutation(){
        var target1 = document.body.querySelector('#broadlist_area > ul');
        var target2 = document.body.querySelector('#btnRefresh');

        var observer1 = new MutationObserver(function(mutations) {
            //console.log('changed');
            target2.classList.add('loaded');
            waitForElement('.users-section.top.loaded.nologinuser', function (elementSelector, element) {
                appendBlockbutton();
            });
            waitForElement('.users-section.myplus.loaded', function (elementSelector, element) {
                waitForElement('.users-section.top.loaded', function (elementSelector, element) {
                    appendBlockbutton();
                });
            });
        });

        observer1.observe(target1, {
            attributes: true,
            childList: true
        });

    }

    function appendBlockbutton(){
        var nicknames = document.body.querySelectorAll('.cBox-info > .details > a.nick');
        nicknames.forEach(function(nickname) {
            if (!nickname.classList.contains("checked")) {
                nickname.classList.add("checked");
                var user_id = nickname.getAttribute('user_id');
                if (isUserBlocked(user_id)) {
                    //nickname.parentNode.parentNode.parentNode.style.display = 'none';
                    nickname.parentNode.parentNode.parentNode.remove();
                    return;
                }
                if(!open_newtab){
                    const title_href = nickname.parentNode.parentNode.querySelector("h3 > a");
                    const thumbnail_href = nickname.parentNode.parentNode.parentNode.querySelector("a");
                    title_href.removeAttribute('target');
                    thumbnail_href.removeAttribute('target');
                }
                var user_name = nickname.querySelector('span').textContent;
                nickname.addEventListener('click', function() {
                    setTimeout(() => {
                        var buttonElement = document.createElement('button');
                        buttonElement.type = 'button';
                        if(isDarkMode){
                            buttonElement.className = 'block-icon-svg-white';
                        } else {
                            buttonElement.className = 'block-icon-svg';
                        }
                        buttonElement.setAttribute('tip', '채널 차단');

                        var spanElement = document.createElement('span');
                        spanElement.textContent = '채널 차단';
                        buttonElement.appendChild(spanElement);
                        buttonElement.onclick = function() {
                            //nickname.parentNode.parentNode.parentNode.style.display = 'none';
                            nickname.parentNode.parentNode.parentNode.remove();
                            blockUser(user_name,user_id);
                        };

                        // contextMenu 내에 버튼 요소 추가
                        var contextMenu = document.body.querySelector('#contextMenu');
                        if (contextMenu) {
                            contextMenu.appendChild(buttonElement);
                        } else {
                            console.error('#contextMenu를 찾을 수 없습니다.');
                        }
                        var cate_no = nickname.parentNode.parentNode.querySelector('div.tag_wrap.checked').getAttribute('cate_no') || null;
                        if(cate_no){
                            var buttonElement2 = document.createElement('button');
                            buttonElement2.type = 'button';
                            if(isDarkMode){
                                buttonElement2.className = 'block-icon-svg-white';
                            } else {
                                buttonElement2.className = 'block-icon-svg';
                            }
                            buttonElement2.setAttribute('tip', '카테고리 차단');

                            var spanElement2 = document.createElement('span');
                            spanElement2.textContent = '카테고리 차단';
                            buttonElement2.appendChild(spanElement2);
                            buttonElement2.onclick = function() {
                                //nickname.parentNode.parentNode.parentNode.remove();
                                blockCategory(getCategoryName(cate_no),cate_no);
                            };

                            // contextMenu 내에 버튼 요소 추가
                            if (contextMenu) {
                                contextMenu.appendChild(buttonElement2);
                            } else {
                                console.error('#contextMenu를 찾을 수 없습니다.');
                            }
                        }
                    }, 100);
                });
                appendCategory(nickname);
            }
        });
    }

    function appendCategory(nickname){

        var broadlist_area = nickname.parentNode.parentNode.parentNode.parentNode.parentNode.getAttribute('id');
        var tagContainer = nickname.parentNode.parentNode.querySelector('.tag_wrap');
        var user_id_list = nickname.getAttribute('user_id');
        if(aBroadList){
            const channels = aBroadList.broad;
            for (const channel of channels) {
                const cate_no = channel.broad_cate_no;
                const cate_name = getCategoryName(channel.broad_cate_no);
                const user_id_js = channel.user_id;
                if (user_id_list === user_id_js){
                    if (isCategoryBlocked(cate_no)) {
                        nickname.parentNode.parentNode.parentNode.remove();
                    }
                    if(!tagContainer.classList.contains("checked")){
                        tagContainer.classList.add("checked");
                        tagContainer.setAttribute("cate_no",`${cate_no}`)
                        var newATag = document.createElement('a');
                        newATag.textContent = cate_name;
                        newATag.setAttribute("href",`javascript:`)
                        newATag.addEventListener('click', function() {
                            var cate_no_org = `${cate_no}`;
                            var tag_wrap_checked = document.body.querySelectorAll('.cBox-info > .tag_wrap.checked');

                            if(!newATag.classList.contains("clicked")){
                                newATag.classList.add("clicked");
                                tag_wrap_checked.forEach(function(element) {
                                    var cate_no_dst = element.getAttribute('cate_no');
                                    if (cate_no_org === cate_no_dst) {
                                        element.querySelector('a').classList.add("clicked");
                                        element.querySelector('a').textContent=cate_name+" ⨉";
                                        return;
                                    }
                                    element.parentNode.parentNode.style.display = 'none';
                                });
                            } else {
                                newATag.classList.remove("clicked");
                                tag_wrap_checked.forEach(function(element) {
                                    var cate_no_dst = element.getAttribute('cate_no');
                                    if (cate_no_org === cate_no_dst) {
                                        element.querySelector('a').classList.remove("clicked");
                                        element.querySelector('a').textContent=cate_name;
                                        return;
                                    }
                                    element.parentNode.parentNode.style.display = 'block';
                                });
                            }
                        });
                        tagContainer.insertBefore(newATag, tagContainer.firstChild);
                        return;
                    }
                }
            }
        }
        if(broadlist_area === "prefer_broadlist_area"){
            waitForElement('div.users-section.myplus.loaded', function (elementSelector, element) {
                var users = element.querySelectorAll('.user');
                var cate_no;
                let checker = 0;
                users.forEach(function(user) {
                    var user_id_myplus = user.getAttribute('user_id');
                    if (user_id_list === user_id_myplus){
                        //nickname.parentNode.parentNode.parentNode.remove();
                        //console.log(user_id_myplus);
                        cate_no = user.getAttribute('broad_cate_no');
                        checker = 1;
                        return;
                    }
                });
                if(!checker){
                    nickname.parentNode.parentNode.parentNode.remove();
                } else {
                    if(!tagContainer.classList.contains("checked")){
                        tagContainer.classList.add("checked");
                        tagContainer.setAttribute("cate_no",`${cate_no}`)
                        var newATag = document.createElement('a');
                        newATag.textContent = getCategoryName(cate_no);
                        newATag.setAttribute("href",`javascript:`)
                        newATag.addEventListener('click', function() {
                            var cate_no_org = `${cate_no}`;
                            var tag_wrap_checked = document.body.querySelectorAll('.cBox-info > .tag_wrap.checked');

                            if(!newATag.classList.contains("clicked")){
                                newATag.classList.add("clicked");
                                tag_wrap_checked.forEach(function(element) {
                                    var cate_no_dst = element.getAttribute('cate_no');
                                    if (cate_no_org === cate_no_dst) {
                                        element.querySelector('a').classList.add("clicked");
                                        element.querySelector('a').textContent=getCategoryName(cate_no)+" ⨉";
                                        return;
                                    }
                                    element.parentNode.parentNode.style.display = 'none';
                                });
                            } else {
                                newATag.classList.remove("clicked");
                                tag_wrap_checked.forEach(function(element) {
                                    var cate_no_dst = element.getAttribute('cate_no');
                                    if (cate_no_org === cate_no_dst) {
                                        element.querySelector('a').classList.remove("clicked");
                                        element.querySelector('a').textContent=getCategoryName(cate_no);
                                        return;
                                    }
                                    element.parentNode.parentNode.style.display = 'block';
                                });
                            }
                        });
                        tagContainer.insertBefore(newATag, tagContainer.firstChild);
                        return;
                    }
                }
            });
        }
    }

    function setCategoryOnAjaxResponse(){
        var intervalTime = 1000;

        // setInterval을 사용하여 주기적으로 실행
        var intervalId = setInterval(function() {
            // $.ajax가 정의되었는지 확인
            if ($.ajax) {
                // clearInterval을 사용하여 간격 검사 중지
                clearInterval(intervalId);

                // 여기에 $.ajax가 설정된 후에 실행할 스크립트를 작성
                //console.log('$.ajax is defined:', $.ajax);

                // 원본 jQuery.ajax 함수 저장
                var originalAjax = $.ajax;

                // 새로운 jQuery.ajax 함수 정의
                $.ajax = function(settings) {
                    var url = settings.url;
                    var data = settings.data;

                    // 원본 jQuery.ajax 함수 호출
                    return originalAjax.apply(this, [settings]).done(function(responseData, textStatus, jqXHR) {

                        if(url==="https://live.afreecatv.com/api/main_broad_list_api.php"){
                            // tag_wrap_checked가 비어있지 않고, 그 안에 클래스가 'clicked'인 a 태그가 하나라도 있다면 클릭
                            var isClicked = 0;
                            var tag_wrap_checked = document.body.querySelectorAll('.cBox-info > .tag_wrap.checked');
                            if (tag_wrap_checked.length > 0) {
                                for (var i = 0; i < tag_wrap_checked.length; i++) {
                                    var aTags = tag_wrap_checked[i].querySelectorAll('a.clicked');
                                    if (aTags.length > 0) {
                                        // 여러 a 태그 중 첫 번째 것을 클릭
                                        aTags[0].click();
                                        isClicked = 1;
                                        break; // 이미 클릭한 경우 더 이상 확인할 필요가 없으므로 반복문 종료
                                    }
                                }
                            }
                            var nicknames = document.body.querySelectorAll('.cBox-info > .details > a');
                            nicknames.forEach(function(nickname) {
                                var tagContainer = nickname.parentNode.parentNode.querySelector('.tag_wrap');
                                var user_id_org = nickname.getAttribute('user_id');

                                const elements = responseData.broad;
                                for (const element of elements) {
                                    const user_id_dst = element.user_id;
                                    if (user_id_org === user_id_dst) {
                                        const cate_no = element.broad_cate_no;
                                        const cate_name = getCategoryName(cate_no);

                                        if (isCategoryBlocked(cate_no)){
                                            nickname.parentNode.parentNode.parentNode.remove();
                                            return;
                                        }
                                        if (!tagContainer.classList.contains("checked")) {
                                            tagContainer.classList.add("checked");
                                            tagContainer.setAttribute("cate_no", `${cate_no}`);

                                            var newATag = document.createElement('a');
                                            newATag.textContent = cate_name;
                                            newATag.setAttribute("href", `javascript:`);
                                            newATag.addEventListener('click', function() {
                                                var cate_no_org = `${cate_no}`;
                                                var tag_wrap_checked = document.body.querySelectorAll('.cBox-info > .tag_wrap.checked');

                                                if (!newATag.classList.contains("clicked")) {
                                                    newATag.classList.add("clicked");
                                                    tag_wrap_checked.forEach(function(element) {
                                                        var cate_no_dst = element.getAttribute('cate_no');
                                                        if (cate_no_org === cate_no_dst) {
                                                            element.querySelector('a').classList.add("clicked");
                                                            element.querySelector('a').textContent = `${cate_name} ⨉`;
                                                            return;
                                                        }

                                                        element.parentNode.parentNode.style.display = 'none';
                                                    });
                                                } else {
                                                    newATag.classList.remove("clicked");
                                                    tag_wrap_checked.forEach(function(element) {
                                                        var cate_no_dst = element.getAttribute('cate_no');
                                                        if (cate_no_org === cate_no_dst) {
                                                            element.querySelector('a').classList.remove("clicked");
                                                            element.querySelector('a').textContent = cate_name;
                                                            return;
                                                        }

                                                        element.parentNode.parentNode.style.display = 'block';
                                                    });
                                                }
                                            });

                                            tagContainer.insertBefore(newATag, tagContainer.firstChild);
                                        }
                                        break; // user_id 일치하는 첫 번째 요소만 처리하고 반복문 종료
                                    }
                                }
                            });

                            if(isClicked){
                                aTags[0].click();
                            }
                        }
                    }).fail(function(jqXHR, textStatus, errorThrown) {
                        // 실패한 응답 로깅
                        console.log('JQuery AJAX Error:', textStatus, errorThrown);
                    });
                };
            }
        }, intervalTime);
    }

    //=================================메인 페이지 함수 끝=================================//


    //=================================플레이어 페이지 함수=================================//

    function detectSmode() {
        var target = document.querySelector('body');
        var webplayerScroll1 = document.getElementById('webplayer_scroll');
        var firstRun = 1;
        var observer = new MutationObserver(function(mutations) {
            var sidebar = document.getElementById('sidebar');
            var bodyClasses = target.classList;
            if (bodyClasses.contains('smode')){
                document.body.querySelector('#sidebar').style.display = 'none';
                document.body.querySelector('.left_navbar').style.display = 'none';
                webplayerScroll1.style.left = '0';
                sidebar.style.top = '0px';
                GM_setValue("playerSmode", 1);
            } else {
                document.body.querySelector('#sidebar').style.display = '';
                document.body.querySelector('.left_navbar').style.display = '';
                if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                    webplayerScroll1.style.left = '0';
                } else {
                    webplayerScroll1.style.left = `${document.getElementById('sidebar').offsetWidth}px`;
                }
                sidebar.style.top = '56px';

                if(firstRun && smodeSidebar) autoScreenMode(preplayerSmode);

                GM_setValue("playerSmode", 0);
                firstRun = 0;
            }
        });

        observer.observe(target, {
            attributeFilter: ['class']
        });
    }

    function detectFullscreenmode(){
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);

        function handleFullscreenChange() {
            var sidebar = document.getElementById('sidebar');
            var webplayerTop = document.getElementById('webplayer_top');
            var leftNavbar = document.body.querySelector('.left_navbar');
            var webplayerScroll = document.getElementById('webplayer_scroll');

            if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                // 전체화면 모드일 때
                hideElement(sidebar);
                hideElement(webplayerTop);
                hideElement(leftNavbar);
                webplayerScroll.style.left = '0px';
            } else {
                // 전체화면 모드가 아닐 때
                showElement(sidebar);
                showElement(webplayerTop);
                showElement(leftNavbar);
                webplayerScroll.style.left = `${document.getElementById('sidebar').offsetWidth}px`;
            }
        }

        function hideElement(element) {
            element.style.visibility = 'hidden';
        }

        function showElement(element) {
            element.style.visibility = 'visible';
        }
    }

    function showSidebarOnMouseOver() {
        var sidebar = document.getElementById('sidebar');
        var videoLayer = document.getElementById('videoLayer');
        var webplayerScroll = document.getElementById('webplayer_scroll');
        var body = document.body;

        document.body.addEventListener('mousemove', function (event) {
            var mouseX = event.clientX;
            var mouseY = event.clientY;

            if ((mouseX < 52 && mouseY < videoLayer.clientHeight - 150) || (mouseX < sidebar.clientWidth && mouseY < sidebar.clientHeight)) {
                handleSidebarMouseOver();
            } else {
                handleSidebarMouseOut();
            }
        });

        document.addEventListener('mouseleave', function(event) {
            handleSidebarMouseOut();
        });

        function handleSidebarMouseOver() {
            if (body.classList.contains('smode') && sidebar.style.display === 'none') {
                sidebar.style.display = '';
                sidebar.style.top = '0px';
                if (webplayerScroll.style.left === '0px') {
                    webplayerScroll.style.left = sidebar.offsetWidth + 'px';
                }
            }
        }

        function handleSidebarMouseOut() {
            if (body.classList.contains('smode') && sidebar.style.display !== 'none') {
                sidebar.style.top = '56px';
                sidebar.style.display = 'none';
                webplayerScroll.style.left = '0px';
            }
        }
    }

    function autoScreenMode(playerSmode){
        if(playerSmode){
            //console.log(playerSmode);
            waitForElement('button.btn_smode', function (elementSelector, element) {
                element.click();
                //console.log(element);
            });
        }
    }

    function toggleSharpModeShortcut(){
        document.body.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', function() {
                sharpModeCheckEnabled = false; // 포커스를 받으면 sharpModeCheckEnabled false로 설정하여 함수 실행을 막습니다.
            });

            input.addEventListener('blur', function() {
                sharpModeCheckEnabled = true; // 포커스를 잃으면 sharpModeCheckEnabled true로 설정하여 함수 실행을 허용합니다.
            });
        });

        const writeArea = document.getElementById('write_area');

        writeArea.addEventListener('input', function() {
            // write_area에 입력될 때마다 sharpModeCheckEnabled false로 설정하여 함수 실행을 막습니다.
            sharpModeCheckEnabled = false;
        });

        document.addEventListener('keydown', function(event) {
            const isEPressed = event.keyCode === 69;

            // 모든 입력 상자와 write_area에 포커스가 없는 상태에서 E 키가 눌렸을 때만 togglesharpModeCheck 함수 실행
            if (isEPressed && document.activeElement.nodeName !== 'INPUT' && document.activeElement.id !== 'write_area') {
                togglesharpModeCheck();
            }
        });

        function togglesharpModeCheck() {
            const sharpModeCheckElement = document.getElementById('clear_screen');
            sharpModeCheckElement.click();
            showPlayerBar();
        }

        function showPlayerBar(){
            const player = document.getElementById('afreecatv_player');
            player.classList.remove('mouseover');
            player.classList.add('mouseover');
            const qualityBoxButton = document.body.querySelector('#afreecatv_player > div.player_ctrlBox > div.right_ctrl > div.quality_box > button.btn_quality_mode');
            const qualityBoxOn = document.body.querySelector('.quality_box.on');
            if (qualityBoxButton) {
                if (!qualityBoxOn) {
                    qualityBoxButton.click();
                }
                setTimeout(function(){
                    if (qualityBoxOn) {
                        qualityBoxButton.click();
                    }
                    setTimeout(function(){
                        player.classList.remove('mouseover');
                    },250);
                },750);
            } else {
                console.error('Setting button not found or not visible.');
            }
        }

        const labelElement = document.body.querySelector('#afreecatv_player > div.player_ctrlBox > div.right_ctrl > div.quality_box > ul > li.clear_screen > label');

        if (labelElement) {
            let labelText = labelElement.innerHTML;
            labelText = labelText.replace('선명한 모드', '선명한 모드(e)');
            labelElement.innerHTML = labelText;
        } else {
            console.error('Label element not found.');
        }
    }

    function toggleLowLatencyShortcut(){
        document.body.querySelectorAll('input').forEach(input => {
            input.addEventListener('focus', function() {
                delayCheckEnabled = false; // 포커스를 받으면 delayCheckEnabled를 false로 설정하여 함수 실행을 막습니다.
            });

            input.addEventListener('blur', function() {
                delayCheckEnabled = true; // 포커스를 잃으면 delayCheckEnabled를 true로 설정하여 함수 실행을 허용합니다.
            });
        });

        const writeArea = document.getElementById('write_area');

        writeArea.addEventListener('input', function() {
            // write_area에 입력될 때마다 delayCheckEnabled를 false로 설정하여 함수 실행을 막습니다.
            delayCheckEnabled = false;
        });

        document.addEventListener('keydown', function(event) {
            const isDPressed = event.keyCode === 68;

            // 모든 입력 상자와 write_area에 포커스가 없는 상태에서 D 키가 눌렸을 때만 toggleDelayCheck 함수 실행
            if (isDPressed && document.activeElement.nodeName !== 'INPUT' && document.activeElement.id !== 'write_area') {
                toggleDelayCheck();
            }
        });

        function toggleDelayCheck() {
            const delayCheckElement = document.getElementById('delay_check');
            delayCheckElement.click();
            showPlayerBar();
        }

        function showPlayerBar(){
            const player = document.getElementById('afreecatv_player');
            player.classList.remove('mouseover');
            player.classList.add('mouseover');
            const settingButton = document.body.querySelector('#afreecatv_player > div.player_ctrlBox > div.right_ctrl > div.setting_box > button.btn_setting');
            const settingBoxOn = document.body.querySelector('.setting_box.on');

            if (settingButton) {
                if (!settingBoxOn) {
                    settingButton.click();
                }
                setTimeout(function(){
                    if (settingBoxOn) {
                        settingButton.click();
                    }
                    setTimeout(function(){
                        player.classList.remove('mouseover');
                    },250);
                },750);
            } else {
                console.error('Setting button not found or not visible.');
            }
        }

        const labelElement = document.body.querySelector('#afreecatv_player > div.player_ctrlBox > div.right_ctrl > div.setting_box > div > ul > li.checkbox_wrap > label');

        if (labelElement) {
            let labelText = labelElement.innerHTML;
            labelText = labelText.replace('시차 단축', '시차 단축(d)');
            labelElement.innerHTML = labelText;
        } else {
            console.error('Label element not found.');
        }
    }

    function checkPlayerPageHeaderAd() {
        waitForElement('#header_ad', function (elementSelector, element) {
            element.remove();
        })
    }

    function extractDateTime(text) {
        const dateTimeStr = text.split(' ')[0] + 'T' + text.split(' ')[1] + 'Z';
        return new Date(dateTimeStr);
    }

    function getElapsedTime(broadcastStartTimeText, type){
        const broadcastStartTime = extractDateTime(broadcastStartTimeText);
        broadcastStartTime.setHours(broadcastStartTime.getHours() - 9);
        const currentTime = new Date();
        const timeDiff = currentTime - broadcastStartTime;

        const secondsElapsed = Math.floor(timeDiff / 1000);
        const hoursElapsed = Math.floor(secondsElapsed / 3600);
        const minutesElapsed = Math.floor((secondsElapsed % 3600) / 60);
        const remainingSeconds = secondsElapsed % 60;
        let formattedTime = '';

        if (type === "HH:MM:SS") {
            formattedTime = `${String(hoursElapsed).padStart(2, '0')}:${String(minutesElapsed).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
        } else if (type === "HH:MM") {
            if (hoursElapsed > 0) {
                formattedTime = `${String(hoursElapsed)}시간 `;
            }
            formattedTime += `${String(minutesElapsed)}분`;
        }
        return formattedTime;
    }

    function broadcastTimeElapsed() {
        const elapsedTimeElement = document.createElement('div');
        elapsedTimeElement.classList.add('elapsed-time');

        const textInformationDiv = document.body.querySelector('div.text_information');
        textInformationDiv.insertBefore(elapsedTimeElement, textInformationDiv.children[2].nextSibling);

        function updateElapsedTime() {
            const broadcastStartTimeText = document.body.querySelector('#player_area > div.broadcast_information > div.text_information > ul > li:nth-child(1) > span').textContent.trim();
            elapsedTimeElement.innerHTML = `<p>${getElapsedTime(broadcastStartTimeText, "HH:MM:SS")}</p>`;
        }

        setInterval(updateElapsedTime, 1000);
    }

    function insertRemainingBuffer(element){
        const video = element;

        function getRemainingBufferTime(){
            const buffered = video.buffered;
            if (buffered.length > 0) {
                let remainingBufferTime = buffered.end(buffered.length - 1) - video.currentTime;
                remainingBufferTime = remainingBufferTime.toFixed(1);
                remainingBufferTime = parseFloat(remainingBufferTime);
                remainingBufferTime = remainingBufferTime % 1 === 0 ? remainingBufferTime.toFixed(1) : remainingBufferTime;
                return remainingBufferTime;
            }
        }

        // video의 onprogress 이벤트 핸들러
        video.onprogress = function() {
            // 남은 버퍼 시간 가져오기
            let remainingBufferTime = getRemainingBufferTime();

            // 요소 찾기
            const existingRemainingBuffer = document.body.querySelector('.remainingBuffer');

            // 형제 요소로 삽입할 HTML 생성
            const remainingBufferHTML = `<div class="remainingBuffer" title="남은 버퍼 시간"><p>${remainingBufferTime}s</p></div>`;

            // existingRemainingBuffer가 존재하는 경우
            if (existingRemainingBuffer) {
                // 내용물만 업데이트
                existingRemainingBuffer.innerHTML = `<p>${remainingBufferTime}s</p>`;
            } else {
                // 요소 찾기
                const elapsedTimeDiv = document.body.querySelector('#player_area > div.broadcast_information > div.text_information > div.elapsed-time');
                const viewerCntDiv = document.body.querySelector('#player_area > div.broadcast_information > div.text_information > div.broadcast_viewer_cnt');

                // elapsedTimeDiv가 존재하는 경우
                if (elapsedTimeDiv) {
                    // 형제 요소로 삽입
                    elapsedTimeDiv.insertAdjacentHTML('afterend', remainingBufferHTML);
                } else if (viewerCntDiv) { // viewerCntDiv가 존재하는 경우
                    // 형제 요소로 삽입
                    viewerCntDiv.insertAdjacentHTML('afterend', remainingBufferHTML);
                }
            }
        };
    }

    // 타이머 식별자를 함수 외부에서 선언합니다.
    var timerId_m;

    function handleMuteByVisibility() {
        const button = document.body.querySelector("#btn_sound");

        if (document.hidden) {
            // 탭이 비활성화됨
            timerId_m = setTimeout(function(){
                if (!button.classList.contains("mute")) {
                    button.click();
                    console.log("탭이 비활성화됨, 음소거");
                }
            },1000);
        } else {
            // 탭이 활성화됨
            if (typeof timerId_m !== 'undefined') {
                clearTimeout(timerId_m);
            }
            if (button.classList.contains("mute")) {
                button.click();
                console.log("탭이 활성화됨, 음소거 해제");
            }
        }
    }

    // 타이머 식별자를 함수 외부에서 선언합니다.
    var timerId_q;

    function handleChangeQualityByVisibility() {
        const qualityButtons = document.body.querySelectorAll("#afreecatv_player > div.player_ctrlBox > div.right_ctrl > div.quality_box > ul > li:not([style='display: none;']) > button");

        if (document.hidden) {
            // 탭이 비활성화됨
            // setTimeout 함수를 호출하고 타이머 식별자를 변수에 저장합니다.
            timerId_q = setTimeout(function(){
                const lastButtonIndex = qualityButtons.length - 1;
                const lastButton = qualityButtons[lastButtonIndex];
                lastButton.click();
                console.log(`탭이 비활성화됨, ${lastButton.textContent}`);
            }, 1000);
        } else {
            // 탭이 활성화됨
            if (typeof timerId_q !== 'undefined') {
                clearTimeout(timerId_q);
            }
            qualityButtons[1].click();
            console.log(`탭이 활성화됨, ${qualityButtons[1].textContent}`);
        }
    }

    function isVideoInPiPMode() {
        // 현재 비디오 요소 가져오기
        var videoElement = document.body.querySelector('video');

        // 비디오 요소가 존재하고, PiP 모드인지 확인
        if (videoElement !== null && document.pictureInPictureElement === videoElement) {
            return true;
        } else {
            return false;
        }
    }

    function registerVisibilityChangeHandler() {
        document.addEventListener('visibilitychange', () => {
            if(!isVideoInPiPMode()){
                if(autoChangeMute) handleMuteByVisibility();
                if(autoChangeQuality) handleChangeQualityByVisibility();
            }
        }, true);
    }

    function useBottomChat(){
        // 미디어 쿼리를 추가할 때 사용할 스타일 시트입니다.
        var customStyleSheet = document.createElement('style');
        customStyleSheet.setAttribute('id', 'custom-style-sheet');

        // 미디어 쿼리에 대한 CSS를 설정합니다.
        var customCSS = `
        .smode #player_area.bottomChat{
            left: 0px !important;
            right: 0px !important;
            width: 100vw;
            height: calc((100vw / 16 * 9) + 64px) !important;
        }
        .smode #chatting_area.bottomChat {
            top: calc((100vw / 16 * 9) + 70px) !important;
            left: 0px !important;
            width: 100vw !important;
            height: auto;
            display: block !important;
        }
        .smode #webplayer[chat-move=true].chat_open #webplayer_contents #chatting_area.bottomChat{
            top: calc((100vw / 16 * 9) + 70px) !important;
            left: 0px !important;
            width: 100vw !important;
            height: auto;
            display: block !important;
        }
        `;

        // 스타일 시트에 CSS를 추가합니다.
        customStyleSheet.innerHTML = customCSS;

        // 스타일 시트를 문서 헤드에 추가합니다.
        document.head.appendChild(customStyleSheet);

        // 해상도에 따라 bottomChat 클래스를 추가하거나 제거하는 함수
        function toggleBottomChat() {
            var screenHeight = window.innerHeight;
            var screenWidth = window.innerWidth;

            // screenHeight가 1024 이상이고 screenWidth가 1320 이상일 때 bottomChat 클래스를 추가합니다.
            // 그렇지 않으면 bottomChat 클래스를 제거합니다.
            var playerArea = document.getElementById('player_area');
            var chattingArea = document.getElementById('chatting_area');

            if (screenHeight >= 1080 && screenWidth <= 1320) {
                playerArea.classList.add('bottomChat');
                chattingArea.classList.add('bottomChat');
            } else {
                playerArea.classList.remove('bottomChat');
                chattingArea.classList.remove('bottomChat');
            }
        }

        // 윈도우 리사이즈 이벤트를 감지하여 toggleBottomChat 함수를 호출합니다.
        window.addEventListener('resize', toggleBottomChat);

        // 페이지 로드 시 한 번 실행하여 초기 설정을 수행합니다.
        toggleBottomChat();
    }

    function appendPauseButton() {
        try {
            const closeStreamButton = document.body.querySelector("#closeStream");
            if (closeStreamButton) {
                closeStreamButton.parentNode.removeChild(closeStreamButton);
            }

            const button = document.body.querySelector("button#time_shift_play");
            if (button) {
                const displayStyle = window.getComputedStyle(button).getPropertyValue("display");
                if (displayStyle === "none") {
                    const ctrlDiv = document.body.querySelector('div.ctrl');
                    const newCloseStreamButton = document.createElement("button");
                    newCloseStreamButton.setAttribute("type", "button");
                    newCloseStreamButton.setAttribute("id", "closeStream");
                    newCloseStreamButton.setAttribute("class", "pause on");

                    const tooltipDiv = document.createElement("div");
                    tooltipDiv.setAttribute("class", "tooltip");
                    const spanElement = document.createElement("span");
                    spanElement.textContent = "일시정지";
                    const emElement = document.createElement("em");

                    tooltipDiv.appendChild(spanElement);
                    tooltipDiv.appendChild(emElement);

                    newCloseStreamButton.appendChild(tooltipDiv);

                    ctrlDiv.insertBefore(newCloseStreamButton, ctrlDiv.firstChild);
                    newCloseStreamButton.addEventListener("click", function(e) {
                        e.preventDefault();
                        try {
                            if (newCloseStreamButton.classList.contains("on")) {
                                // livePlayer 변수가 정의되어 있어야 합니다.
                                livePlayer.closeStreamConnector();
                                newCloseStreamButton.classList.remove("on", "pause");
                                newCloseStreamButton.classList.add("off", "play");
                                spanElement.textContent = "재생";
                            } else {
                                // livePlayer 변수가 정의되어 있어야 합니다.
                                livePlayer._startBroad();
                                newCloseStreamButton.classList.remove("off", "play");
                                newCloseStreamButton.classList.add("on", "pause");
                                spanElement.textContent = "일시정지";
                            }
                        } catch (error) {
                            console.log(error);
                        }
                    });
                } else {
                    console.log("button#time_shift_play의 style은 display: none;이 아닙니다.");
                }
            } else {
                console.log("button#time_shift_play를 찾을 수 없습니다.");
            }
        } catch (error) {
            console.error(error);
        }
    }

    function detectPlayerChangeAndAppendPauseButton(){
        // 대상 요소를 선택합니다.
        const targetNode = document.body.querySelector('#player_area > div.broadcast_information > div.text_information > div.nickname');

        // 변화를 감지할 MutationObserver를 생성합니다.
        const observer = new MutationObserver(function(mutationsList, observer) {
            appendPauseButton();
            empty_viewbj();
        });

        // MutationObserver를 설정하고 변화를 감지할 대상과 감시할 옵션을 지정합니다.
        observer.observe(targetNode, { attributes: true, childList: true, subtree: true });
    }

    function empty_viewbj(){
        const viewBJ = document.getElementById('view_bj');

        if (viewBJ) {
            viewBJ.innerHTML = '';
        }
    }

    function changeVIPBadge(s){
        if(s){
            GM_addStyle(`
                [class^=grade-badge-].grade-badge-vip {
                    background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none'%3e%3crect width='14' height='14' fill='%23D65B8F' rx='2'/%3e%3cpath fill='%23fff' d='M4.49 3.43h5.02v1.32H6.06V6.4h2.99v1.22H6.06v2.95H4.49V3.43Z'/%3e%3c/svg%3e") 50% 50% no-repeat !important;
                    background-size: 100% 100% !important;
                }
            `);
        } else {
            GM_addStyle(`
                [class^=grade-badge-].grade-badge-vip {
                    background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' fill='none'%3e%3crect width='14' height='14' fill='%23D65B8F' rx='2'/%3e%3cpath fill='%23fff' d='M3 4.823c0 1.282 1.06 2.09 2.395 2.09 1.397 0 2.405-.84 2.405-2.09 0-1.27-1.008-2.174-2.405-2.174C4.008 2.649 3 3.573 3 4.823Zm1.197 0c0-.64.536-1.155 1.198-1.155.745 0 1.197.514 1.197 1.155 0 .567-.462 1.071-1.197 1.071-.714 0-1.198-.451-1.198-1.07ZM11 7.173V2.075H9.8v1.1H8.333l.022 1.135H9.8v1.021H8.355l-.022 1.064H9.8v.778H11Zm0 4.752v-1.02H5.875v-.67H11V7.623H4.525v1.01h5.202v.67H4.58v2.622H11Z'/%3e%3c/svg%3e") 50% 50% no-repeat !important;
                    background-size: 100% 100% !important;
                }
            `);
        }
    }

    function setWidthNickname(wpx){
        GM_addStyle(`
            .starting-line .chatting-list-item .message-container .username {
                width: ${wpx}px !important;
            }
        `)
    }

    function hideBadges() {

        hideSupporterBadgeSwitch = GM_getValue("hideSupporterBadgeSwitch");
        hideFanBadgeSwitch = GM_getValue("hideFanBadgeSwitch");
        hideSubBadgeSwitch = GM_getValue("hideSubBadgeSwitch");
        hideVIPBadgeSwitch = GM_getValue("hideVIPBadgeSwitch");
        hideMngrBadgeSwitch = GM_getValue("hideMngrBadgeSwitch");
        hideStreamerBadgeSwitch = GM_getValue("hideStreamerBadgeSwitch");

        if(hideSupporterBadgeSwitch + hideFanBadgeSwitch + hideSubBadgeSwitch + hideVIPBadgeSwitch + hideMngrBadgeSwitch + hideStreamerBadgeSwitch + hideSubBadgeSwitch === 0){
            return;
        }

        var elements = document.querySelectorAll('[class^="grade-badge-"]:not(.done)');

        elements.forEach(function(element) {
            const className = element.className.split("grade-badge-")[1].split(" ")[0];
            switch(true) {
                case className==="fan" && !!hideFanBadgeSwitch:
                    element.parentNode.removeChild(element);
                    break;
                case className==="vip" && !!hideVIPBadgeSwitch:
                    element.parentNode.removeChild(element)
                    break;
                case className==="manager" && !!hideMngrBadgeSwitch:
                    element.parentNode.removeChild(element);
                    break;
                case className==="streamer" && !!hideStreamerBadgeSwitch:
                    element.parentNode.removeChild(element);
                    break;
                case className==="support" && !!hideSupporterBadgeSwitch:
                    element.parentNode.removeChild(element);
                    break;
                default:
                    element.classList.add('done');
                    break;
            }
        });

        if(hideSubBadgeSwitch){
            let thumbSpan = '';

            if (currentUrl.startsWith("https://play.afreecatv.com/")) {
                thumbSpan = document.querySelectorAll('#chat_area div.username > button > span.thumb');
            } else if (currentUrl.startsWith("https://vod.afreecatv.com/")) {
                thumbSpan = document.querySelectorAll('#chatMemo div.username > button > span.thumb');
            }
            thumbSpan.forEach(function(element) {
                element.parentNode.removeChild(element);
            });
        }

    }

    function observeChat(elem){
        // 페이지 변경 시 이미지 감지 및 숨기기
        var observer = new MutationObserver(function(mutations) {
            for (const mutation of mutations) {
                if(blockWordsSwitch) deleteMessages();
                hideBadges();
                break;
            }
        });

        //var targetNode = document.body.querySelector(elem_selector);
        var config = {
            childList: true,
            subtree: true
        };
        observer.observe(elem, config);
    }

    async function deleteMessages() {
        const messages = document.body.querySelectorAll('div.message-text > p.msg:not(.done)');

        const rw = registeredWords ? registeredWords.split(',') : [];

        for (const message of messages) {
            const messageText = message.textContent.trim();
            const emoticons = message.querySelectorAll('img.emoticon');

            const shouldRemove = rw.some(word => {
                const wordToCheck = word.trim().startsWith("e:") ? word.trim().slice(2) : word.trim();
                return (word.trim().startsWith("e:") && messageText === wordToCheck) ||
                    (!word.trim().startsWith("e:") && messageText.includes(wordToCheck));
            });

            if (shouldRemove) {
                message.closest('.chatting-list-item').remove();
            } else {
                message.classList.add('done');
            }
        }
    }

    //=================================플레이어 페이지 함수 끝=================================//


    //============================ 메인 페이지 실행 ============================//
    if (currentUrl.startsWith("https://www.afreecatv.com")) {

        GM_addStyle(mainPageCommonStyles);
        if(isDarkMode){
            GM_addStyle(mainPageDarkmodeStyles);
        } else {
            GM_addStyle(mainPageWhitemodeStyles);
        }

        makeTopNavbarAndSidebar("main");

        waitForElement('.left_nav_button', function (elementSelector, element) {
            // Get the current page URL
            const currentPage = window.location.href;

            // Get all navigation links
            const navLinks = document.body.querySelectorAll('.left_nav_button');

            // Loop through each link and check if it matches the current page
            navLinks.forEach(link => {
                var parentLink = link.parentElement;
                if (parentLink.href === currentPage) {
                    link.classList.add('active'); // Add the 'active' class if it matches
                }
            });
        });

        blockButtonOnMutation();
        setCategoryOnAjaxResponse();

        document.getElementById('serviceLnb').classList.remove('mini');

        if (currentUrl === "https://www.afreecatv.com/?hash=bora" || currentUrl === "https://www.afreecatv.com/?hash=game" || currentUrl === "https://www.afreecatv.com/?hash=sports") {
            waitForElement('button.refresh.loaded', function (elementSelector, element) {
                setTimeout(function () {
                    var refreshButton = document.getElementById('btnRefresh');
                    refreshButton.click();
                }, 1000);
            });
        }

        runCommonFunctions();
    }


    //============================ 플레이어 페이지 실행 ============================//

    if (currentUrl.startsWith("https://play.afreecatv.com")) {
        //embed 페이지에서는 실행하지 않음
        var pattern = /^https:\/\/play.afreecatv.com\/.*\/.*\/embed(\?.*)?$/;
        if (pattern.test(currentUrl) || currentUrl.includes("vtype=chat")) {
            return;
        }

        GM_addStyle(playerCommonStyles);
        if(isDarkMode){
            GM_addStyle(darkModePlayerStyles);
        } else {
            GM_addStyle(whiteModePlayerStyles);
        }

        detectSmode();
        detectFullscreenmode();
        if(makePauseButton) detectPlayerChangeAndAppendPauseButton();
        if(bottomChatSwitch) useBottomChat();
        makeTopNavbarAndSidebar("player");
        insertFoldButton();
        if(makeSharpModeShortcut) toggleSharpModeShortcut();
        if(makeLowLatencyShortcut) toggleLowLatencyShortcut();
        if(smodeSidebar) showSidebarOnMouseOver();
        checkPlayerPageHeaderAd();
        if(showUptime){
            broadcastTimeElapsed();
        }
        if(showRemainingBuffer){
            waitForElement('#livePlayer', function (elementSelector, element) {
                insertRemainingBuffer(element);
            });
        }
        registerVisibilityChangeHandler();

        // #webplayer_top > h1 > a 요소 가져오기
        var linkElement = document.body.querySelector("#webplayer_top > h1 > a");

        // 만약 요소가 존재하고 target 속성이 있다면 제거
        if (linkElement && linkElement.hasAttribute("target")) {
            linkElement.removeAttribute("target");
        }

        runCommonFunctions();
        if(newVIPBadgeSwitch) changeVIPBadge(1);

        waitForElement('#chat_area', function (elementSelector, element) {
            observeChat(element);
        });
    }

    //============================ VOD 페이지 실행 ============================//

    if (currentUrl.startsWith("https://vod.afreecatv.com/player/")) {
        // vodCore 변수가 선언될 때까지 대기하는 함수
        function waitForVodCore() {
            // vodCore 변수가 선언될 때까지 주기적으로 확인
            const checkVodCore = setInterval(function() {
                if (vodCore && vodCore.playerController && vodCore.playerController._currentMediaInfo && vodCore.playerController._currentMediaInfo.name) { // vodCore 및 playerController가 정의되어 있는지 확인
                    clearInterval(checkVodCore); // setInterval 정지
                    checkMediaInfo(vodCore.playerController._currentMediaInfo.name); // vodCore 변수가 정의되면 미디어 정보 확인 함수 호출
                }
            }, 500); // 500ms 주기로 확인
        }

        // 미디어 정보 확인 함수
        function checkMediaInfo(mediaName) {
            if (mediaName !== 'original') { // 'original'인지 확인
                waitForElement('.setting_box > button', function (elementSelector, element) {
                    element.click();
                    waitForElement('div.player_ctrlBox > div.right_ctrl > div > div > ul > li:nth-child(2) > button', function (elementSelector, element) {
                        if(element.parentNode.textContent.includes("화질변경")){
                            element.click();
                            waitForElement('.setting_list.quality_on > .quality > ul > li:nth-child(2) > button', function (elementSelector, element) {
                                if (!element.classList.contains('on')) {
                                    element.click();
                                }
                            });
                        }
                    });
                });
            } else {
                console.log("미디어 이름이 'original'입니다.");
            }
        }

        if(selectBestQualitySwitch){
            waitForVodCore();
        }

        GM_addStyle(CommonStyles);
        if(newVIPBadgeSwitch) changeVIPBadge(1);

        waitForElement('#webplayer_contents', function (elementSelector, element) {
            observeChat(element);
        });
        waitForElement('div.serviceUtil', function (elementSelector, element) {
            addModalSettings();
        });

    }

})();