// ==UserScript==
// @name         Soop(숲) 채팅 확장 스크립트
// @namespace    https://greasyfork.org/scripts/512780
// @icon         https://res.sooplive.co.kr/afreeca.ico
// @version      1.3.1
// @description  채팅창 편의기능 추가
// @match        https://play.sooplive.co.kr/*
// @match        https://vod.sooplive.co.kr/*
// @license      MIT
// @author       ekzmchoco
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512780/Soop%28%EC%88%B2%29%20%EC%B1%84%ED%8C%85%20%ED%99%95%EC%9E%A5%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/512780/Soop%28%EC%88%B2%29%20%EC%B1%84%ED%8C%85%20%ED%99%95%EC%9E%A5%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.meta.js
// ==/UserScript==
// Referenced Code: https://greasyfork.org/scripts/512724

(function() {
    'use strict';

    const DEFAULT_SETTINGS = {
        chatWidthAdjustment: true,
        customEmoticonBox: true,
        allowPasteInChat: true,
        emoticonButtonReposition: true,
        emoticonButtonColor: false,
        emoticonWindowPositionChange: true,
        autoSendAfterEmoticons: false,
        chatCopyFeature: true
    };

    const userSettings = JSON.parse(localStorage.getItem('soopChatSettings')) || DEFAULT_SETTINGS;

    function saveSettings() {
        localStorage.setItem('soopChatSettings', JSON.stringify(userSettings));
    }

    function initSettingsUI() {
        const chattingArea = document.querySelector("#chatting_area");
        if (!chattingArea) return;

        const personSettingEl = chattingArea.querySelector(".chat_layer.sub.person .contents > ul");
        if (!personSettingEl) return;

        if (document.getElementById('script-settings')) return;

        const settingsLI = document.createElement("li");
        settingsLI.id = 'script-settings';

        const settingsOptions = [
            { key: 'chatWidthAdjustment', label: '채팅 너비 조절 기능' },
            { key: 'customEmoticonBox', label: '커스텀 이모티콘 박스*' },
            { key: 'allowPasteInChat', label: '채팅 붙여넣기 허용*' },
            { key: 'chatCopyFeature', label: '채팅 복사 허용*' },
            { key: 'emoticonButtonReposition', label: '이모티콘 버튼 위치 변경*' },
            { key: 'emoticonButtonColor', label: '이모티콘 버튼 색상 (밝게/어둡게)*' },
            { key: 'emoticonWindowPositionChange', label: '이모티콘 창 위치 변경*' },
            { key: 'autoSendAfterEmoticons', label: '이모티콘 입력 후 자동 전송' }
        ];

        settingsOptions.forEach(option => {
            const div = document.createElement("div");
            div.classList.add("checkbox_wrap");

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = option.key;
            checkbox.checked = userSettings[option.key];

            const label = document.createElement("label");
            label.htmlFor = option.key;
            label.textContent = option.label;

            checkbox.addEventListener("change", () => {
                userSettings[option.key] = checkbox.checked;
                saveSettings();
                applySettings(option.key);

                if (option.label.includes('*')) {
                    alert('이 설정은 페이지를 새로고침해야 적용됩니다.');
                }
            });

            div.appendChild(checkbox);
            div.appendChild(label);
            settingsLI.appendChild(div);
        });

        personSettingEl.appendChild(settingsLI);
    }

    function applySettings(optionKey) {
        switch(optionKey) {
            case 'chatWidthAdjustment':
                if (userSettings.chatWidthAdjustment) {
                    initChatWidthAdjustment();
                } else {
                    removeChatWidthAdjustment();
                }
                break;
            case 'customEmoticonBox':
                if (userSettings.customEmoticonBox) {
                    initCustomEmoticonBox();
                } else {
                    removeCustomEmoticonBox();
                }
                break;
            case 'allowPasteInChat':
                if (userSettings.allowPasteInChat) {
                    enablePasteInChat();
                } else {
                    alert('이 설정은 페이지를 새로고침해야 적용됩니다.');
                }
                break;
            case 'emoticonButtonColor':
                if (userSettings.emoticonButtonReposition) {
                    alert('이 설정은 페이지를 새로고침해야 적용됩니다.');
                }
                break;
            case 'chatCopyFeature':
                if (userSettings.chatCopyFeature) {
                    initChatCopyFeature();
                } else {
                    alert('이 설정은 페이지를 새로고침해야 적용됩니다.');
                }
                break;
            case 'autoSendAfterEmoticons':
            case 'emoticonButtonReposition':
            case 'emoticonWindowPositionChange':
                break;
            default:
                break;
        }
    }

    function init() {
        initSettingsUI();

        if (userSettings.allowPasteInChat) {
            enablePasteInChat();
        }

        if (userSettings.chatWidthAdjustment) {
            initChatWidthAdjustment();
        }

        if (userSettings.customEmoticonBox) {
            initCustomEmoticonBox();
        }

        if (userSettings.emoticonButtonReposition || userSettings.emoticonWindowPositionChange) {
            initEmoticonRelatedFeatures();
        }

        if (userSettings.chatCopyFeature) {
            initChatCopyFeature();
        }
    }

    function initChatWidthAdjustment() {
        const chattingArea = document.querySelector("#chatting_area");
        if (!chattingArea) return;

        const chatTitleDiv = chattingArea.querySelector(".chat_title");
        if (!chatTitleDiv) return;

        if (document.getElementById('chatWidthSlider')) return;

        let ul = chatTitleDiv.querySelector("ul");
        if (!ul) {
            ul = document.createElement("ul");
            chatTitleDiv.appendChild(ul);
        }

        let insertBeforeElement = ul.querySelector("#setbox_viewer") || ul.querySelector("#setbox_set");
        if (!insertBeforeElement) {
            insertBeforeElement = ul.querySelector("li.set");
        }
        if (!insertBeforeElement) {
            insertBeforeElement = ul.firstChild;
        }

        const sliderLi = document.createElement("li");
        sliderLi.style.padding = "0 10px";
        sliderLi.style.display = "flex";
        sliderLi.style.alignItems = "center";

        const rangeInput = document.createElement("input");
        rangeInput.type = "range";
        rangeInput.min = 300;
        rangeInput.max = 450;
        rangeInput.step = 5;
        rangeInput.value = localStorage.getItem("customChattingAreaWidth")
          ? localStorage.getItem("customChattingAreaWidth")
          : 380;
        rangeInput.style.width = "80px";
        rangeInput.style.marginRight = "1px";
        rangeInput.id = 'chatWidthSlider';

        const rangeLabel = document.createElement("span");
        rangeLabel.style.color = "#fff";
        rangeLabel.style.fontSize = "12px";

        rangeInput.addEventListener("input", () => {
            changeChatAreaWidth(rangeInput.value);
            localStorage.setItem("customChattingAreaWidth", rangeInput.value);
        });

        sliderLi.appendChild(rangeInput);
        sliderLi.appendChild(rangeLabel);

        if (insertBeforeElement && insertBeforeElement.nextSibling) {
            ul.insertBefore(sliderLi, insertBeforeElement.nextSibling);
        } else {
            ul.appendChild(sliderLi);
        }

        const chatStyleEl = document.createElement("style");
        chatStyleEl.id = 'custom-chat-width-style';
        document.head.append(chatStyleEl);

        function changeChatAreaWidth(width) {
            chatStyleEl.textContent = `
                #webplayer.chat_open {
                    --chatting_W: ${width}px;
                }
                #webplayer.chat_open .chatting_area {
                    width: var(--chatting_W);
                }

                .vod #chatting_area {
                    --chatting_W: ${width}px;
                    width: var(--chatting_W);
                    position: fixed;
                    right: 0;
                    left: auto;
                }
            `;
        }

        const storedWidth = localStorage.getItem("customChattingAreaWidth") || 380;
        changeChatAreaWidth(storedWidth);
        rangeInput.value = storedWidth;
    }

    function removeChatWidthAdjustment() {
        const chatWidthSlider = document.getElementById('chatWidthSlider');
        if (chatWidthSlider) {
            chatWidthSlider.parentElement.remove();
        }
        const chatStyleEl = document.getElementById('custom-chat-width-style');
        if (chatStyleEl) {
            chatStyleEl.remove();
        }

        const chattingArea = document.querySelector("#chatting_area");
        if (chattingArea) {
            chattingArea.style.width = '';
            chattingArea.style.position = '';
            chattingArea.style.right = '';
            chattingArea.style.left = '';
        }
    }

    function initCustomEmoticonBox() {
        const chattingArea = document.querySelector("#chatting_area");
        const actionBox = chattingArea.querySelector("#actionbox");
        if (!actionBox) return;

        if (document.querySelector(".customEmojiBtn")) return;

        const emoticonBox = document.querySelector("#emoticonBox");
        if (!emoticonBox) return;

        const recentEmoticonBtn = emoticonBox.querySelector(
            ".tab_area .item_list ul > li[data-type='RECENT'] .ic_clock"
        );
        const subTabArea = emoticonBox.querySelector(".subTab_area");
        const defaultSubTab = subTabArea.querySelector("li[data-type='DEFAULT']");
        const OGQSubTab = subTabArea.querySelector("li[data-type='OGQ']");

        if (!recentEmoticonBtn || !defaultSubTab || !OGQSubTab) return;

        function defaultEmoticonClick() {
            recentEmoticonBtn.click();
            setTimeout(() => {
                defaultSubTab.click();
            }, 100);
        }
        function OGQEmoticonClick() {
            recentEmoticonBtn.click();
            setTimeout(() => {
                OGQSubTab.click();
            }, 100);
        }

        const chattingItemWrap = chattingArea.querySelector(".chatting-item-wrap");
        const chatArea = chattingItemWrap.querySelector("#chat_area");
        const customEmojiBox = document.createElement("div");
        customEmojiBox.classList.add("customEmojiBox");
        let isLoading = false;

        const sliderContainer = document.createElement('div');
        sliderContainer.classList.add('slider-container');
        sliderContainer.style.display = 'none';

        const sliderWrapper = document.createElement('div');
        sliderWrapper.classList.add('slider-wrapper');

        const sliderTrack = document.createElement('div');
        sliderTrack.classList.add('slider-track');

        const sliderRange = document.createElement('div');
        sliderRange.classList.add('slider-range');

        const minSlider = document.createElement('input');
        minSlider.type = 'range';
        minSlider.min = '1';
        minSlider.max = '10';
        minSlider.value = parseInt(localStorage.getItem('minSliderValue')) || 3;
        minSlider.classList.add('slider');
        minSlider.id = 'slider-min';

        const maxSlider = document.createElement('input');
        maxSlider.type = 'range';
        maxSlider.min = '1';
        maxSlider.max = '10';
        maxSlider.value = parseInt(localStorage.getItem('maxSliderValue')) || 5;
        maxSlider.classList.add('slider');
        maxSlider.id = 'slider-max';

        const rangeDisplay = document.createElement('div');
        rangeDisplay.classList.add('range-display');
        rangeDisplay.textContent = `${minSlider.value}-${maxSlider.value}`;

        sliderWrapper.appendChild(sliderTrack);
        sliderWrapper.appendChild(sliderRange);
        sliderWrapper.appendChild(minSlider);
        sliderWrapper.appendChild(maxSlider);

        sliderContainer.appendChild(sliderWrapper);
        sliderContainer.appendChild(rangeDisplay);

        function updateRange() {
            const min = parseInt(minSlider.value);
            const max = parseInt(maxSlider.value);

            if (min > max) {
                if (this === minSlider) {
                    maxSlider.value = min;
                } else {
                    minSlider.value = max;
                }
            }

            const minVal = parseInt(minSlider.value);
            const maxVal = parseInt(maxSlider.value);

            const leftPercent = ((minVal - 1) / 9) * 100;
            const rightPercent = ((maxVal - 1) / 9) * 100;
            sliderRange.style.left = leftPercent + '%';
            sliderRange.style.right = (100 - rightPercent) + '%';

            rangeDisplay.textContent = `${minVal}-${maxVal}`;

            localStorage.setItem('minSliderValue', minVal);
            localStorage.setItem('maxSliderValue', maxVal);
        }

        minSlider.addEventListener('input', updateRange);
        maxSlider.addEventListener('input', updateRange);

        updateRange();

        function renderEmoticon(type = "default") {
            if (isLoading) return;
            isLoading = true;

            type === "default" ? defaultEmoticonClick() : OGQEmoticonClick();

            setTimeout(() => {
                proceedWithRender(type);
                isLoading = false;
            }, 500);
        }

        function proceedWithRender(type) {
            const diffType = type === "default" ? "OGQ" : "default";
            const isOn = customEmojiBox.classList.contains(type);
            const isDiffOn = customEmojiBox.classList.contains(diffType);

            if (isOn) {
                customEmojiBox.classList.remove(type);
                customEmojiBox.innerHTML = "";
                customEmojiBox.style.display = "none";
                chatArea.style.bottom = "0";
                sliderContainer.style.display = "none";
                return;
            }

            if (isDiffOn) {
                customEmojiBox.classList.remove(diffType);
                customEmojiBox.innerHTML = "";
            }

            const emoticonItemBox = emoticonBox.querySelector(".emoticon_item");
            if (!emoticonItemBox) {
                console.error("이모티콘 아이템을 찾을 수 없습니다.");
                return;
            }

            const itemList = [];
            emoticonItemBox.querySelectorAll("span > a")?.forEach((item, index) => {
                if (index < 21) {
                    const itemClone = item.cloneNode(true);

                    itemClone.addEventListener("click", () => {
                        const minCount = parseInt(minSlider.value);
                        const maxCount = parseInt(maxSlider.value);
                        const repeatCount = Math.floor(Math.random() * (maxCount - minCount + 1)) + minCount;

                        for (let i = 0; i < repeatCount; i++) {
                            item.click();
                        }
                        if (userSettings.autoSendAfterEmoticons) {
                            setTimeout(() => {
                                const sendBtn = document.querySelector("#btn_send");
                                if (sendBtn) sendBtn.click();
                            }, 100);
                        }
                    });

                    itemList.push(itemClone);
                }
            });

            customEmojiBox.innerHTML = '';
            customEmojiBox.append(...itemList);

            if (!chattingItemWrap.contains(customEmojiBox)) {
                chattingItemWrap.append(customEmojiBox);
            }
            customEmojiBox.style.display = "flex";
            customEmojiBox.classList.add(type);
            chatArea.style.position = "relative";
            chatArea.style.bottom = `${customEmojiBox.offsetHeight + sliderContainer.offsetHeight + 8}px`;

            if (!chattingItemWrap.contains(sliderContainer)) {
                chattingItemWrap.append(sliderContainer);
            }
            sliderContainer.style.display = 'flex';
        }

        const recentEmoticonCustomBtnLI = document.createElement("li");
        const recentEmoticonCustomBtn = document.createElement("a");
        recentEmoticonCustomBtn.href = "javascript:;";
        recentEmoticonCustomBtn.classList.add("customEmojiBtn");
        recentEmoticonCustomBtn.textContent = "최근";
        recentEmoticonCustomBtnLI.append(recentEmoticonCustomBtn);

        const OGQEmoticonCustomBtnLI = document.createElement("li");
        const OGQEmoticonCustomBtn = document.createElement("a");
        OGQEmoticonCustomBtn.href = "javascript:;";
        OGQEmoticonCustomBtn.classList.add("customEmojiBtn");
        OGQEmoticonCustomBtn.textContent = "OGQ";
        OGQEmoticonCustomBtnLI.append(OGQEmoticonCustomBtn);

        recentEmoticonCustomBtnLI.addEventListener("click", () => {
            renderEmoticon("default");
        });
        OGQEmoticonCustomBtnLI.addEventListener("click", () => {
            renderEmoticon("OGQ");
        });

        const itemBox = actionBox.querySelector(".item_box");
        if (itemBox) {
            itemBox.append(recentEmoticonCustomBtnLI, OGQEmoticonCustomBtnLI);
        }

        const iconColor = userSettings.emoticonButtonColor ? '#333' : '#D5D7DC';
        const rangeTextColor = userSettings.emoticonButtonColor ? '#000' : '#fff';

        const defaultStyleEl = document.createElement("style");
        const defaultStyle = `
        .chatbox .actionbox .chat_item_list .item_box li a.customEmojiBtn {
          line-height: 32px;
          font-size: 15px;
          font-weight: bold;
          color: ${iconColor};
          background-color: transparent;
        }
        .chatbox .actionbox .chat_item_list .item_box li a.customEmojiBtn:hover {
          color: ${iconColor};
          background-color: transparent;
        }
        .chatting-item-wrap .customEmojiBox {
          position: absolute;
          margin-bottom: 20px;
          bottom: 0;
          left: 0;
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          gap: 8px 4px;
          padding: 8px 8px 0 8px;
          background-color: #fefefe;
        }
        [dark="true"] .chatting-item-wrap .customEmojiBox {
          background-color: #222;
          border-top: 1px solid #444;
        }
        .chatting-item-wrap .customEmojiBox a {
          width: 36px;
          height: 36px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }
        .chatting-item-wrap .customEmojiBox a:hover {
          background-color: rgba(117, 123, 138, 0.2);
        }
        .slider-container {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 20px;
          margin: 0;
          background-color: #fefefe;
          display: flex;
          align-items: center;
          padding: 0 8px 8px 8px;
          flex-wrap: nowrap;
        }
        [dark="true"] .slider-container {
          background-color: #222;
        }
        .slider-wrapper {
            position: relative;
          width: 90%;
          height: 20px;
        }
        .range-display {
          width: 10%;
          text-align: center;
          font-size: 12px;
          color: ${rangeTextColor};
          margin-left: 8px;
        }
        .slider-track {
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 3px;
          background: #ddd;
          border-radius: 10px;
          transform: translateY(-50%);
        }
        .slider {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100%;
          -webkit-appearance: none;
          appearance: none;
          background: none;
          pointer-events: none;
          transform: translateY(-50%);
        }
        .slider-range {
          position: absolute;
          top: 50%;
          height: 3px;
          background: #4444ff;
          border-radius: 10px;
          pointer-events: none;
          transform: translateY(-50%);
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #4444ff;
          cursor: pointer;
          pointer-events: all;
          box-shadow: 0 0 5px rgba(0,0,0,0.2);
          position: relative;
          z-index: 1;
        }
        .slider::-moz-range-thumb {
          width: 15px;
          height: 15px;
          border-radius: 50%;
          background: #ffffff;
          border: 2px solid #4444ff;
          cursor: pointer;
          pointer-events: all;
          box-shadow: 0 0 5px rgba(0,0,0,0.2);
          position: relative;
          z-index: 1;
        }
        `;
        defaultStyleEl.textContent = defaultStyle;
        document.head.append(defaultStyleEl);
    }

    function removeCustomEmoticonBox() {
        const customEmojiBtns = document.querySelectorAll('.customEmojiBtn');
        customEmojiBtns.forEach(btn => btn.parentElement.remove());
        const customEmojiBox = document.querySelector('.customEmojiBox');
        if (customEmojiBox) customEmojiBox.remove();

        const sliderContainer = document.querySelector('.slider-container');
        if (sliderContainer) sliderContainer.remove();

        const styleEl = document.querySelector('#custom-chat-width-style');
        if (styleEl) {
            styleEl.remove();
        }

        const styleCustomEl = document.querySelector('style');
        if (styleCustomEl && styleCustomEl.textContent.includes('.customEmojiBox')) {
            styleCustomEl.remove();
        }
    }

    function enablePasteInChat() {
        const writeArea = document.querySelector("#write_area");
        if (!writeArea) return;

        writeArea.removeAttribute("readonly");
        writeArea.removeAttribute("disabled");

        writeArea.addEventListener("paste", function(e) {
            e.preventDefault();
            const clipboardData = (e.originalEvent || e).clipboardData || window.clipboardData;
            const pastedData = clipboardData.getData('text');
            document.execCommand('insertText', false, pastedData);
        });
    }

    function initEmoticonRelatedFeatures() {
        const observer = new MutationObserver((mutations, obs) => {
            const ul = document.querySelector('ul.item_box');
            if (!ul) return;

            const btnStarLi = document.getElementById('btn_star');
            const btnAdballoonLi = document.getElementById('btn_adballoon');
            const sooptoreLi = ul.querySelector('li.sooptore');
            const btnEmo = document.getElementById('btn_emo');

            if (!btnStarLi || !btnAdballoonLi || !sooptoreLi || !btnEmo) return;

            btnStarLi.classList.remove('off');
            btnAdballoonLi.classList.remove('off');
            sooptoreLi.classList.remove('off');
            btnEmo.classList.remove('off');

            if (userSettings.emoticonButtonReposition) {
                const chatWriteDiv = document.getElementById('chat_write');
                if (chatWriteDiv && chatWriteDiv.contains(btnEmo)) {
                    chatWriteDiv.removeChild(btnEmo);
                }

                let btnEmoLi = document.createElement('li');
                btnEmoLi.id = 'btn_emo_li';
                btnEmoLi.className = 'emoticon';

                btnEmoLi.appendChild(btnEmo);

                if (ul.firstChild !== btnEmoLi) {
                    ul.insertBefore(btnEmoLi, ul.firstChild);
                }

                ul.appendChild(btnStarLi);
                ul.appendChild(btnAdballoonLi);
                ul.appendChild(sooptoreLi);

                btnStarLi.classList.add('right-align');

                const iconColor = userSettings.emoticonButtonColor ? '#333' : '#D5D7DC';

                const svgIcon = encodeURIComponent(
                    `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' fill='none'>
                        <g opacity='1'>
                            <path fill='${iconColor}' d='M19.56 18.396a.498.498 0 1 1 .86.506c-.598 1.015-1.973 2.735-4.421 2.735-2.445 0-3.82-1.717-4.418-2.73a.497.497 0 0 1 .176-.684.5.5 0 0 1 .684.176c.498.845 1.617 2.24 3.558 2.24 1.943 0 3.063-1.397 3.56-2.243Z'/>
                            <path stroke='${iconColor}' stroke-width='.4' d='M11.581 18.906c.598 1.014 1.973 2.732 4.418 2.732 2.448 0 3.823-1.72 4.42-2.736a.498.498 0 1 0-.86-.506c-.497.846-1.617 2.243-3.56 2.243-1.94 0-3.06-1.395-3.559-2.24a.5.5 0 0 0-.683-.176.497.497 0 0 0-.176.683Zm0 0 .078-.045'/>
                            <path fill='${iconColor}' stroke='${iconColor}' stroke-width='.45' d='M19.527 15.805a1.227 1.227 0 1 1 0-2.455 1.227 1.227 0 0 1 0 2.455ZM12.477 15.805a1.228 1.228 0 1 1 .001-2.456 1.228 1.228 0 0 1 0 2.456Z'/>
                            <path stroke='${iconColor}' stroke-width='1.4' d='M16 25.8a9.3 9.3 0 1 1 0-18.6 9.3 9.3 0 0 1 0 18.6Z'/>
                        </g>
                    </svg>`
                );

                const dataURL = `data:image/svg+xml,${svgIcon}`;

                btnEmo.style.backgroundImage = `url("${dataURL}")`;
                btnEmo.style.backgroundRepeat = 'no-repeat';
                btnEmo.style.backgroundPosition = 'center';
                btnEmo.style.backgroundSize = 'contain';
                btnEmo.style.width = '32px';
                btnEmo.style.height = '32px';
                btnEmo.style.border = 'none';
                btnEmo.style.cursor = 'pointer';
                btnEmo.style.padding = '0';
                btnEmo.style.margin = '0';
                btnEmo.style.backgroundColor = 'transparent';
                btnEmo.textContent = '';
            }

            if (userSettings.emoticonWindowPositionChange) {
                const emoticonContainer = document.getElementById('emoticonContainer');
                if (emoticonContainer) {
                    const styleEl = document.createElement('style');
                    styleEl.id = 'custom-emoticon-position-style';
                    styleEl.textContent = `
                    .chatbox #emoticonContainer {
                        bottom: 10px;
                        transform: translateX(0);
                        transition: none !important;
                    }
                    .chatbox #emoticonContainer.on {
                        bottom: 10px;
                        max-width: 360px;
                        min-width: 320px;
                        right: unset;
                        left: 0;
                        transform: translateX(-105%);
                        transition: none !important;
                    }
                    `;
                    document.head.appendChild(styleEl);
                }
            }

            if (!document.getElementById('sooplive-custom-style')) {
                const style = document.createElement('style');
                style.id = 'sooplive-custom-style';
                style.innerHTML = `
                    ul.item_box {
                        display: flex;
                        align-items: center;
                    }
                    ul.item_box li {
                        margin: 0 3px;
                    }
                    ul.item_box li.right-align {
                        margin-left: auto;
                    }
                `;
                document.head.appendChild(style);
            }

            obs.disconnect();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function initChatCopyFeature() {
        let tempEmojiMap = {};
        let lastMapUpdate = 0;
        const MAP_UPDATE_INTERVAL = 5000;

        function getCurrentStreamerId() {
            const urlMatch = window.location.pathname.match(/^\/([^\/]+)/);
            if (urlMatch) {
                return urlMatch[1];
            }
            
            const streamerElement = document.querySelector('.streamer_info .name') ||
                                   document.querySelector('[data-streamer-id]') ||
                                   document.querySelector('.channel-info .name');
            
            if (streamerElement) {
                return streamerElement.textContent?.trim() || 
                       streamerElement.getAttribute('data-streamer-id');
            }
            
            const lastPath = window.location.pathname.split('/').pop();
            return lastPath || 'default';
        }

        function collectCurrentEmojiMappings() {
            const emojiMap = {};
            
            const allEmojiSelectors = [
                '#emoticonContainer img[src*="signature_emoticon"]',
                '#emoticonContainer img[src*="emoticon"]',
                '#common_emoticon img',
                '#default img',
                '#subscription_emoticon img',
                '#subscription img',
                '.emoticon_item img',
                '.box_divider img'
            ];
            
            allEmojiSelectors.forEach(selector => {
                const images = document.querySelectorAll(selector);
                
                images.forEach(img => {
                    const src = img.src;
                    const alt = img.alt;
                    
                    if (src && alt) {
                        const hashMatch = src.match(/\/([a-f0-9]{16,})\.(webp|png|gif|jpg|jpeg)$/i);
                        if (hashMatch) {
                            const hash = hashMatch[1];
                            emojiMap[hash] = alt;
                        } else {
                            const fileMatch = src.match(/\/([^\/]+)\.(png|gif|jpg|jpeg|webp)$/i);
                            if (fileMatch) {
                                const fileName = fileMatch[1];
                                emojiMap[fileName] = alt;
                            }
                        }
                    }
                });
            });
            
            return emojiMap;
        }

        function updateTempEmojiMap() {
            const now = Date.now();
            if (now - lastMapUpdate > MAP_UPDATE_INTERVAL) {
                tempEmojiMap = collectCurrentEmojiMappings();
                lastMapUpdate = now;
                
                if (Object.keys(tempEmojiMap).length < 10) {
                    setTimeout(() => {
                        openEmoticonAndCollect();
                    }, 1000);
                }
            }
            return tempEmojiMap;
        }

        function openEmoticonAndCollect() {
            const writeArea = document.getElementById('write_area');
            if (writeArea) {
                writeArea.click();
                writeArea.focus();
                
                setTimeout(() => {
                    const emoticonButtons = [
                        '.emoticon_output button',
                        'button[class*="emoticon"]',
                        '#chat_write button',
                        '.btn_emoticon',
                        'button[title*="이모티콘"]',
                        'button[title*="이모지"]'
                    ];
                    
                    let emoticonButton = null;
                    for (const selector of emoticonButtons) {
                        emoticonButton = document.querySelector(selector);
                        if (emoticonButton) {
                            break;
                        }
                    }
                    
                    if (emoticonButton) {
                        emoticonButton.click();
                        
                        setTimeout(() => {
                            collectSubscriptionEmojis();
                        }, 1500);
                    }
                }, 500);
            }
        }

        function collectSubscriptionEmojis() {
            const emoticonContainer = document.getElementById('emoticonContainer');
            if (!emoticonContainer || emoticonContainer.style.display === 'none') {
                return;
            }
            
            const subscriptionTab = document.querySelector('li[data-type="SUBSCRIPTION"] button') ||
                                   document.querySelector('.ic_subscribe') ||
                                   document.querySelector('button[class*="subscribe"]');
            
            if (subscriptionTab) {
                subscriptionTab.click();
                
                setTimeout(() => {
                    const subscriptionEmojis = collectCurrentEmojiMappings();
                    
                    tempEmojiMap = { ...tempEmojiMap, ...subscriptionEmojis };
                    lastMapUpdate = Date.now();
                    
                    closeEmoticonContainer();
                }, 2000);
            } else {
                closeEmoticonContainer();
            }
        }

        function closeEmoticonContainer() {
            const closeButtons = [
                '#emoticonContainer .btn_close',
                '#emoticonBox .btn_close',
                '.emoticon_container .btn_close',
                'button[class*="close"]'
            ];
            
            let closeButton = null;
            for (const selector of closeButtons) {
                closeButton = document.querySelector(selector);
                if (closeButton) {
                    break;
                }
            }
            
            if (closeButton) {
                closeButton.click();
            } else {
                const emoticonContainer = document.getElementById('emoticonContainer');
                if (emoticonContainer) {
                    emoticonContainer.style.display = 'none';
                }
            }
        }

        function convertEmojisToText(element) {
            if (!element) return;
            
            const currentEmojiMap = updateTempEmojiMap();
            
            const emojiImages = element.querySelectorAll('img[alt], img[data-emoji], img[title], .emoticon, .emoji, img[src*="emoticon"]');
            emojiImages.forEach(img => {
                let emojiText = '';
                
                if (img.title && img.title.trim()) {
                    const titleText = img.title.trim();
                    if (titleText.startsWith('/') && titleText.endsWith('/')) {
                        emojiText = titleText;
                    } else {
                        emojiText = titleText;
                    }
                }
                else if (img.alt && img.alt.trim()) {
                    emojiText = img.alt.trim();
                }
                else if (img.dataset && img.dataset.emoji) {
                    emojiText = img.dataset.emoji;
                }
                else if (img.src) {
                    const srcMatch = img.src.match(/\/([^\/]+)\.(png|gif|jpg|jpeg|webp)$/i);
                    if (srcMatch) {
                        const fileName = srcMatch[1];
                        emojiText = currentEmojiMap[fileName] || fileName;
                    }
                }
                
                if (emojiText) {
                    if (!emojiText.startsWith('/') || !emojiText.endsWith('/')) {
                        emojiText = '/' + emojiText + '/';
                    }
                    const textNode = document.createTextNode(emojiText);
                    img.parentNode.replaceChild(textNode, img);
                }
            });
            
            const emojiSpans = element.querySelectorAll('span[data-emoji], div[data-emoji], .emoticon-text, .emoji-text');
            emojiSpans.forEach(span => {
                if (span.dataset && span.dataset.emoji) {
                    let emojiText = span.dataset.emoji;
                    if (!emojiText.startsWith('/') || !emojiText.endsWith('/')) {
                        emojiText = '/' + emojiText + '/';
                    }
                    span.textContent = emojiText;
                }
            });
        }

        function fallbackCopy(text) {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
        }

        function processEmojiText(textToCopy, currentEmojiMap) {
            Object.keys(currentEmojiMap).forEach(hash => {
                const emojiName = currentEmojiMap[hash];
                const pattern = new RegExp(`/${hash}/\\d+/`, 'g');
                textToCopy = textToCopy.replace(pattern, `/${emojiName}/`);
            });
            
            Object.keys(currentEmojiMap).forEach(hash => {
                const emojiName = currentEmojiMap[hash];
                const pattern = new RegExp(`:${hash}(:\\d+)?:`, 'g');
                textToCopy = textToCopy.replace(pattern, `/${emojiName}/`);
            });
            
            textToCopy = textToCopy.replace(/\/([a-f0-9]{16,})\//g, function(match, hash) {
                const emojiName = currentEmojiMap[hash] || hash;
                return `/${emojiName}/`;
            });
            
            textToCopy = textToCopy.replace(/:([a-f0-9]{16,}):/g, function(match, hash) {
                const emojiName = currentEmojiMap[hash] || hash;
                return `/${emojiName}/`;
            });
            
            textToCopy = textToCopy.replace(/\/([^\/]+)\/\d+\/([^\/]+)\//g, '/$1//$2/');
            textToCopy = textToCopy.replace(/\/([^\/]+)\/\d+/g, '/$1/');
            
            return textToCopy;
        }

        function interceptCopy() {
            document.addEventListener('copy', function(e) {
                const selection = window.getSelection();
                if (!selection.rangeCount) return;
                
                const range = selection.getRangeAt(0);
                const chatArea = document.getElementById('chat_area');
                const writeArea = document.getElementById('write_area');
                
                if ((chatArea && chatArea.contains(range.commonAncestorContainer)) || 
                    (writeArea && writeArea.contains(range.commonAncestorContainer))) {
                    e.preventDefault();
                    
                    const contents = range.cloneContents();
                    const tempDiv = document.createElement('div');
                    tempDiv.appendChild(contents);
                    
                    convertEmojisToText(tempDiv);
                    
                    let textToCopy = tempDiv.textContent || tempDiv.innerText || '';
                    const currentEmojiMap = updateTempEmojiMap();
                    textToCopy = processEmojiText(textToCopy, currentEmojiMap);
                    
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(textToCopy).then(() => {
                        }).catch(() => {
                            fallbackCopy(textToCopy);
                        });
                    } else {
                        fallbackCopy(textToCopy);
                    }
                }
            }, true);

            document.addEventListener('cut', function(e) {
                const selection = window.getSelection();
                if (!selection.rangeCount) return;
                
                const range = selection.getRangeAt(0);
                const chatArea = document.getElementById('chat_area');
                const writeArea = document.getElementById('write_area');
                
                if ((chatArea && chatArea.contains(range.commonAncestorContainer)) || 
                    (writeArea && writeArea.contains(range.commonAncestorContainer))) {
                    e.preventDefault();
                    
                    const contents = range.cloneContents();
                    const tempDiv = document.createElement('div');
                    tempDiv.appendChild(contents);
                    
                    convertEmojisToText(tempDiv);
                    
                    let textToCopy = tempDiv.textContent || tempDiv.innerText || '';
                    const currentEmojiMap = updateTempEmojiMap();
                    textToCopy = processEmojiText(textToCopy, currentEmojiMap);
                    
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(textToCopy).then(() => {
                            range.deleteContents();
                        }).catch(() => {
                            fallbackCopy(textToCopy);
                            range.deleteContents();
                        });
                    } else {
                        fallbackCopy(textToCopy);
                        range.deleteContents();
                    }
                }
            }, true);
        }

        function makeChatCopyable() {
            const chatArea = document.getElementById('chat_area');
            const writeArea = document.getElementById('write_area');
            if (!chatArea && !writeArea) return;
            
            const style = document.createElement('style');
            style.textContent = `
                #chat_area,
                #chat_area *,
                #write_area,
                #write_area *,
                .chatting-list-item,
                .chatting-list-item *,
                .message-container,
                .message-container *,
                .username,
                .username *,
                .message-text,
                .message-text *,
                .msg,
                .msg *,
                .author,
                .author * {
                    user-select: text !important;
                    -webkit-user-select: text !important;
                    -moz-user-select: text !important;
                    -ms-user-select: text !important;
                    -webkit-touch-callout: default !important;
                    -webkit-tap-highlight-color: rgba(0,0,0,0) !important;
                }
                
                #chat_area *,
                #write_area * {
                    pointer-events: auto !important;
                }
            `;
            document.head.appendChild(style);
            
            function removeEventListeners(element) {
                const events = ['selectstart', 'dragstart', 'contextmenu', 'copy', 'cut'];
                events.forEach(eventType => {
                    element.addEventListener(eventType, function(e) {
                        e.stopPropagation();
                    }, true);
                });
            }
            
            if (chatArea) {
                removeEventListeners(chatArea);
                const chatElements = chatArea.querySelectorAll('*');
                chatElements.forEach(removeEventListeners);
            }
            
            if (writeArea) {
                removeEventListeners(writeArea);
                const writeElements = writeArea.querySelectorAll('*');
                writeElements.forEach(removeEventListeners);
            }
            
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) {
                                removeEventListeners(node);
                                const childElements = node.querySelectorAll('*');
                                childElements.forEach(removeEventListeners);
                            }
                        });
                    }
                });
            });
            
            if (chatArea) {
                observer.observe(chatArea, {
                    childList: true,
                    subtree: true
                });
            }
            
            if (writeArea) {
                observer.observe(writeArea, {
                    childList: true,
                    subtree: true
                });
            }
            
            document.addEventListener('selectstart', function(e) {
                if (e.target.closest('#chat_area') || e.target.closest('#write_area')) {
                    e.stopPropagation();
                }
            }, true);
            
            document.addEventListener('dragstart', function(e) {
                if (e.target.closest('#chat_area') || e.target.closest('#write_area')) {
                    e.stopPropagation();
                }
            }, true);
        }

        const checkChatArea = setInterval(() => {
            if (document.getElementById('chat_area') || document.getElementById('write_area')) {
                clearInterval(checkChatArea);
                makeChatCopyable();
                interceptCopy();
                updateTempEmojiMap();
            }
        }, 500);
        
        setTimeout(() => {
            clearInterval(checkChatArea);
        }, 10000);

        window.getCurrentEmojiMappings = function() {
            return collectCurrentEmojiMappings();
        };
        window.getCurrentStreamerId = getCurrentStreamerId;
        window.clearTempEmojiMap = function() {
            tempEmojiMap = {};
            lastMapUpdate = 0;
        };
        window.openEmoticonAndCollect = openEmoticonAndCollect;
    }

    function startScript() {
        if (document.querySelector("#chatting_area")) {
            init();
        } else {
            setTimeout(startScript, 500);
        }
    }

    startScript();

})();
