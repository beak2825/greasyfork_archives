// ==UserScript==
// @name         채팅창 열혈입장, 도네 제거
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  채팅 알림 및 도네이션 제어
// @author       Your name
// @match        https://play.sooplive.co.kr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sooplive.co.kr
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/533336/%EC%B1%84%ED%8C%85%EC%B0%BD%20%EC%97%B4%ED%98%88%EC%9E%85%EC%9E%A5%2C%20%EB%8F%84%EB%84%A4%20%EC%A0%9C%EA%B1%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/533336/%EC%B1%84%ED%8C%85%EC%B0%BD%20%EC%97%B4%ED%98%88%EC%9E%85%EC%9E%A5%2C%20%EB%8F%84%EB%84%A4%20%EC%A0%9C%EA%B1%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Constants
    const ID_NOTICE_VIP_ENTER = 'display-notice-vip-enter';
    const ID_NOTICE_VIP = 'display-notice-vip';
    const ID_NOTICE_FAN = 'display-notice-fan';
    const ID_NOTICE_SUPPORTER = 'display-notice-supporter';

    const ID_DONATION_BALLOON = 'display-donation-balloon';
    const ID_DONATION_AD_BALLOON = 'display-donation-ad-balloon';
    const ID_DONATION_STICKER = 'display-donation-sticker';
    const ID_DONATION_SUBSCRIPTION = 'display-donation-subscription';

    const CHAT_LAYER_SET_DISPLAY_NOTICE_MESSAGES = [
        ID_NOTICE_VIP_ENTER,
        ID_NOTICE_VIP,
        ID_NOTICE_FAN,
        ID_NOTICE_SUPPORTER
    ];

    const CHAT_LAYER_SET_DISPLAY_DONATION_MESSAGES = [
        ID_DONATION_BALLOON,
        ID_DONATION_AD_BALLOON,
        ID_DONATION_STICKER,
        ID_DONATION_SUBSCRIPTION
    ];

    // Settings Map
    const settingsMap = {};

    // Settings Load
    function loadSettings() {
        CHAT_LAYER_SET_DISPLAY_NOTICE_MESSAGES.forEach(message => {
            settingsMap[message] = GM_getValue(message, true);
        });

        CHAT_LAYER_SET_DISPLAY_DONATION_MESSAGES.forEach(message => {
            settingsMap[message] = GM_getValue(message, true);
        });
    }

    // Settings Toggle
    function toggleSetting(settingId) {
        const currentValue = GM_getValue(settingId, true);
        const newValue = !currentValue;
        GM_setValue(settingId, newValue);
        settingsMap[settingId] = newValue;
        return newValue;
    }

    function getMessage(message) {
        const messageMap = {
            'display-notice-vip-enter': 'VIP 입장',
            'display-notice-vip': 'VIP 승급',
            'display-notice-fan': '팬클럽',
            'display-notice-supporter': '서포터',
            'display-donation-balloon': '별풍선',
            'display-donation-ad-balloon': '애드벌룬',
            'display-donation-sticker': '스티커',
            'display-donation-subscription': '구독'
        };
        return messageMap[message] || message;
    }

    // Menu Registration
    function registerMenuCommands() {
        GM_registerMenuCommand('=== 알림 설정 ===', () => {});
        CHAT_LAYER_SET_DISPLAY_NOTICE_MESSAGES.forEach(message => {
            GM_registerMenuCommand(
                `📢 ${getMessage(message)}: ${settingsMap[message] ? '켜짐' : '꺼짐'}`,
                () => {
                    const newValue = toggleSetting(message);
                    alert(`${getMessage(message)}이(가) ${newValue ? '켜졌습니다' : '꺼졌습니다'}`);
                }
            );
        });

        GM_registerMenuCommand('=== 도네이션 설정 ===', () => {});
        CHAT_LAYER_SET_DISPLAY_DONATION_MESSAGES.forEach(message => {
            GM_registerMenuCommand(
                `💰 ${getMessage(message)}: ${settingsMap[message] ? '켜짐' : '꺼짐'}`,
                () => {
                    const newValue = toggleSetting(message);
                    alert(`${getMessage(message)}이(가) ${newValue ? '켜졌습니다' : '꺼졌습니다'}`);
                }
            );
        });
    }

    // Notice Message Handler
    function handleNoticeMessage(observeTarget, removeTarget) {
        const message = observeTarget.querySelector('p');
        if (!message) {
            return;
        }

        const messageText = message.textContent;

        // VIP 입장
        const isEnterVip = messageText?.includes('대화방에 참여했습니다.');
        if (isEnterVip && !settingsMap[ID_NOTICE_VIP_ENTER]) {
            removeTarget.remove();
            return;
        }

        if (!observeTarget.classList.contains('donation-state')) {
            return;
        }

        // VIP 승급
        const isJoinVip = messageText?.includes('열혈팬이 되셨습니다.');
        if (isJoinVip && !settingsMap[ID_NOTICE_VIP]) {
            removeTarget.remove();
            return;
        }

        // 팬클럽
        const isJoinFan = messageText?.includes('팬클럽이');
        if (isJoinFan && !settingsMap[ID_NOTICE_FAN]) {
            removeTarget.remove();
            return;
        }

        // 서포터
        const isJoinSupporter = messageText?.includes('서포터가');
        if (isJoinSupporter && !settingsMap[ID_NOTICE_SUPPORTER]) {
            removeTarget.remove();
            return;
        }
    }

    // Donation Message Handler
    function handleDonationMessage(observeTarget, removeTarget) {
        // 별풍선
        const isBalloon = observeTarget.classList.length === 1;
        const isChallangeBalloon = observeTarget.classList.contains('basic');
        if ((isBalloon || isChallangeBalloon) && !settingsMap[ID_DONATION_BALLOON]) {
            removeTarget.remove();
            return;
        }

        // 구독
        const isSubscription = observeTarget.classList.contains('subscribe');
        if (isSubscription && !settingsMap[ID_DONATION_SUBSCRIPTION]) {
            removeTarget.remove();
            return;
        }

        // 애드벌룬
        const isAdballon = observeTarget.classList.contains('adballoon');
        if (isAdballon && !settingsMap[ID_DONATION_AD_BALLOON]) {
            removeTarget.remove();
            return;
        }

        // 스티커
        const isSticker = observeTarget.classList.contains('sticker');
        if (isSticker && !settingsMap[ID_DONATION_STICKER]) {
            removeTarget.remove();
            return;
        }
    }

    // Settings Change Listener
    function listenToSettingsChanges() {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.onChanged.addListener((changes, areaName) => {
                if (areaName !== 'local') {
                    return;
                }

                CHAT_LAYER_SET_DISPLAY_NOTICE_MESSAGES.forEach((message) => {
                    if (changes[message]) {
                        settingsMap[message] = changes[message].newValue;
                    }
                });

                CHAT_LAYER_SET_DISPLAY_DONATION_MESSAGES.forEach((message) => {
                    if (changes[message]) {
                        settingsMap[message] = changes[message].newValue;
                    }
                });
            });
        }
    }

    // Observer Setup
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    handleNoticeMessage(node, node);
                    handleDonationMessage(node, node);
                }
            });
        });
    });

    // Initialization
    function initialize() {
        loadSettings();
        registerMenuCommands();
        listenToSettingsChanges();

        // 채팅 컨테이너 찾기 및 옵저버 설정
        const chatContainer = document.querySelector('.chat-list__list-container');
        if (chatContainer) {
            observer.observe(chatContainer, { childList: true, subtree: true });
        } else {
            setTimeout(initialize, 1000); // 컨테이너가 없으면 1초 후 재시도
        }
    }

    initialize();
})();