// ==UserScript==
// @name         숲 채팅 이모티콘
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  최신, ogq 이모티콘 고정 및 개인설정 채팅 너비 및 기본 모드 일시 간격 조절
// @author       aowelwld2
// @include      https://play.sooplive.co.kr/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512724/%EC%88%B2%20%EC%B1%84%ED%8C%85%20%EC%9D%B4%EB%AA%A8%ED%8B%B0%EC%BD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/512724/%EC%88%B2%20%EC%B1%84%ED%8C%85%20%EC%9D%B4%EB%AA%A8%ED%8B%B0%EC%BD%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
    const chattingArea = document.querySelector("#chatting_area");
    const actionBox = chattingArea.querySelector("#actionbox");

    const personSettingEl = chattingArea.querySelector(
      ".chat_layer.sub.person .contents > ul"
    );
    const rangeLI = document.createElement("li");
    const rangeLabel = document.createElement("label");

    rangeLabel.classList.add("customLabel");
    rangeLabel.innerHTML = `<span>채팅너비(${chattingArea.offsetWidth}px)</span>`;
    rangeLI.append(rangeLabel);

    const rangeInput = document.createElement("input");
    rangeInput.type = "range";
    rangeInput.min = 300;
    rangeInput.max = 400;
    rangeInput.value = localStorage.getItem("customChattingAreaWidth")
      ? localStorage.getItem("customChattingAreaWidth")
      : chattingArea.offsetWidth;
    rangeLabel.append(rangeInput);
    rangeInput.addEventListener("input", () => {
      changeChatAreaWidth(rangeInput.value);
      localStorage.setItem("customChattingAreaWidth", rangeInput.value);
    });
    personSettingEl.append(rangeLI);

    const chatStyleEl = document.createElement("style");
    document.head.append(chatStyleEl);
    function changeChatAreaWidth(width) {
      rangeLabel.querySelector("span").textContent = `채팅너비 (${width}px)`;
      chatStyleEl.textContent = `
        #webplayer.chat_open {
            --chatting_W: ${width}px;
        }
    `;
    }
    const narrowDiv = document.createElement("div");
    narrowDiv.classList.add("checkbox_wrap");
    const narrowLI = document.createElement("li");
    const narrowLabel = document.createElement("label");
    const narrowInput = document.createElement("input");
    narrowInput.type = "checkbox";
    narrowInput.id = "narrowChatArea";
    narrowInput.checked =
      localStorage.getItem("customChattingAreaNarrow") === "1" ? true : false;
    narrowLabel.htmlFor = "narrowChatArea";
    narrowLabel.textContent = "전체간격줄이기";

    narrowDiv.append(narrowInput, narrowLabel);
    narrowLI.append(narrowDiv);
    personSettingEl.append(narrowLI);
    narrowInput.addEventListener("change", () => {
      narrowChatArea(narrowInput.checked);
      localStorage.setItem(
        "customChattingAreaNarrow",
        narrowInput.checked ? 1 : 0
      );
    });

    function narrowChatArea(on = true) {
      on
        ? document.querySelector("#webplayer_contents").classList.add("narrow")
        : document
            .querySelector("#webplayer_contents")
            .classList.remove("narrow");
      localStorage.setItem("customChattingAreaNarrow", on ? 1 : 0);
    }

    const emoticonBox = document.querySelector("#emoticonBox");
    const recentEmoticonBtn = emoticonBox.querySelector(
      ".tab_area .item_list ul > li[data-type='RECENT'] .ic_clock"
    );
    const subTabArea = emoticonBox.querySelector(".subTab_area");
    const defaultSubTab = subTabArea.querySelector("li[data-type='DEFAULT']");
    const OGQSubTab = subTabArea.querySelector("li[data-type='OGQ']");

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

    function renderEmoticon(type = "default") {
      type === "default" ? defaultEmoticonClick() : OGQEmoticonClick();
      if (isLoading) return;
      isLoading = true;
      setTimeout(() => {
        isLoading = false;

        const diffType = type === "default" ? "OGQ" : "default";
        const isExist = chattingItemWrap.querySelector(".customEmojiBox")
          ? true
          : false;
        const isOn = customEmojiBox.classList.contains(type) ? true : false;
        const isDiffOn = customEmojiBox.classList.contains(diffType)
          ? true
          : false;
        if (isOn) {
          customEmojiBox.classList.remove(type);
          customEmojiBox.innerHTML = "";
          customEmojiBox.style.display = "none";
          chatArea.style.bottom = "0";
          return;
        }

        const emoticonBox = document.querySelector("#emoticonBox");
        const emoticonItemBox = emoticonBox.querySelector(".emoticon_item");
        const itemList = [];
        emoticonItemBox.querySelectorAll("span > a")?.forEach((item, index) => {
          if (index < 21) {
            const itemClone = item.cloneNode(true);
            itemClone.addEventListener("click", item.click.bind(item));
            itemList.push(itemClone);
          }
        });
        if (isDiffOn) {
          customEmojiBox.classList.remove(diffType);
          customEmojiBox.innerHTML = "";
        }
        customEmojiBox.append(...itemList);

        if (!isExist) {
          chattingItemWrap.append(customEmojiBox);
        }
        customEmojiBox.style.display = "flex";
        customEmojiBox.classList.add(type);
        chatArea.style.position = "relative";
        chatArea.style.bottom = customEmojiBox.offsetHeight + 8 + "px";
      }, 200);
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

    actionBox
      .querySelector(".item_box")
      .append(recentEmoticonCustomBtnLI, OGQEmoticonCustomBtnLI);

    document.head.append(chatStyleEl);

    // 커스텀 스타일 추가

    const defaultStyleEl = document.createElement("style");
    const defaultStyle = `.customLabel {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  min-height: 36px;
  margin: 0 auto;
  padding: 13px 16px;
  box-sizing: border-box;
  font-size: 14px;
  color: #525661;
  transition: all 0.2s cubic-bezier(0.56, 0.12, 0.12, 0.98);
}
[dark="true"] .chat_layer .contents label.customLabel,
body.thema_dark .chat_layer .contents label.customLabel {
  color: #d5d7dc;
}
.chatbox #emoticonContainer {
  bottom: 10px;
  transform: translateX(0);
}
.chatbox #emoticonContainer.on {
  bottom: 10px;
  max-width: 360px;
  min-width: 320px;
  right: unset;
  left: 0;
  transform: translateX(-105%);
}
.screen_mode #webplayer #webplayer_contents .wrapping.side {
  z-index: 111;
  position: relative;
  overflow: visible;
}
.screen_mode #webplayer #webplayer_contents .wrapping.side .box.chatting_box {
  overflow: visible;
}
.chatbox .actionbox .chat_item_list .item_box li a.customEmojiBtn {
  line-height: 32px;
  font-size: 15px;
  font-weight: bold;
  color: #555;
}
.chatbox .actionbox .chat_item_list .item_box li a.customEmojiBtn:hover {
  color: darkorange;
  background-color: transparent;
}
.chatting-item-wrap .customEmojiBox {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 4px;
  padding: 8px 8px;
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
body:not(.screen_mode) #webplayer #webplayer_contents.narrow {
  gap: 8px;
  padding-left: 8px;
  padding-right: 8px;
}
 `;
    defaultStyleEl.textContent = defaultStyle;

    document.head.append(defaultStyleEl);
    document.querySelector("#btn_emo").click();
    setTimeout(() => {
      document.querySelector("#btn_emo").click();
    }, 500);
    localStorage.getItem("customChattingAreaNarrow") === "1"
      ? narrowChatArea(true)
      : narrowChatArea(false);
    localStorage.getItem("customChattingAreaWidth")
      ? changeChatAreaWidth(localStorage.getItem("customChattingAreaWidth"))
      : changeChatAreaWidth(chattingArea.offsetWidth);
  }
  const checkLivePlay = setInterval(() => {
    const isPlay = livePlayer.mainMedia;
    if (isPlay) {
      clearInterval(checkLivePlay);
      setTimeout(() => {
        init();
        $("#write_area").off("cut copy paste");
      }, 500);
    }
  }, 500);
})();