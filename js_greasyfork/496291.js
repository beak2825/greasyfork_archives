// ==UserScript==
// @name         Emoji Tweet Buttons
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  ボタン一つで絵文字ツイートができます。
// @author       TwoSquirrels
// @license      MIT
// @match        https://twitter.com/*
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/496291/Emoji%20Tweet%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/496291/Emoji%20Tweet%20Buttons.meta.js
// ==/UserScript==

// カラーパレット
const Palette = {
  RED: "#FF5555",
  BG_GREEN: "#AAFFAA55",
};

// 指定したミリ秒待つ Promise 関数
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 絵文字設定
const emojis = GM_getValue("emojis", [
  'background-image: url("https://abs.twimg.com/responsive-web/client-web-legacy/twemoji_sprite_high_res.8b274d9a.png"); background-position: 0% 100%; background-size: 5000% 7200%;',
  'background-image: url("https://abs.twimg.com/responsive-web/client-web-legacy/twemoji_sprite_high_res.8b274d9a.png"); background-position: 95.9184% 18.3099%; background-size: 5000% 7200%;',
  'background-image: url("https://abs.twimg.com/responsive-web/client-web-legacy/twemoji_sprite_high_res.8b274d9a.png"); background-position: 24.4898% 53.5211%; background-size: 5000% 7200%;',
  'background-image: url("https://abs.twimg.com/responsive-web/client-web-legacy/twemoji_sprite_high_res.8b274d9a.png"); background-position: 75.5102% 52.1127%; background-size: 5000% 7200%;',
  'background-image: url("https://abs.twimg.com/responsive-web/client-web-legacy/twemoji_sprite_high_res.8b274d9a.png"); background-position: 2.04082% 66.1972%; background-size: 5000% 7200%;',
  "",
  "",
  "",
]);
let emojiVersion = 0;

// 絵文字を入力/ツイートする async 関数
let runningTweetEmoji = false;
async function tweetEmoji(tweetButton, emoji) {
  try {
    if (runningTweetEmoji) throw new Error("tweetEmoji can't run in parallel");
    runningTweetEmoji = true;
    let emojiButton;
    let timeout = false;
    wait(5000).then(() => {
      timeout = true;
    });
    let emojiTabIndex = 0;
    while (true) {
      if (timeout) throw new Error(`Couldn't find the emoji: ${JSON.stringify(emoji)}`);
      const emojiPicker = document.querySelector("#emoji_picker_categories_dom_id > div");
      if (!emojiPicker) {
        document.querySelector(`[data-testid="ScrollSnap-List"] button[aria-haspopup="menu"]`).click();
        await wait(50);
        continue;
      }
      emojiButton = emojiPicker.querySelector(`[style=${JSON.stringify(emoji)}]`);
      emojiButton ??= emojiPicker.querySelector(`[style=${JSON.stringify(emoji.replace(/\/client-web-legacy\//g, "/client-web/"))}]`);
      emojiButton ??= emojiPicker.querySelector(`[style=${JSON.stringify(emoji.replace(/\/client-web\//g, "/client-web-legacy/"))}]`);
      if (emojiButton) break;
      // 順に絵文字タブを読み込む
      const emojiTabs = emojiPicker.parentNode.parentNode.childNodes[1].childNodes[0].childNodes;
      emojiTabs[++emojiTabIndex % emojiTabs.length].childNodes[0].click();
      await wait(50);
    }
    emojiButton.click();
    if (GM_getValue("autoTweet", true)) {
      await wait(50);
      tweetButton.click();
    }
    runningTweetEmoji = false;
  } catch (error) {
    runningTweetEmoji = false;
    throw error;
  }
}

// 絵文字ボタンを追加
setInterval(() => {
  // 二種類のツイートボタンの前に追加
  for (const tweetButtonId of ["tweetButton", "tweetButtonInline"]) {
    const emojiButtons = document.createElement("div");
    emojiButtons.id = "emoji_tweet-" + tweetButtonId;
    {
      let button;
      if ((button = document.getElementById(emojiButtons.id))) {
        button.style.opacity = runningTweetEmoji ? 0.5 : 1.0;
        if (Number(button.dataset.emojiVersion) < emojiVersion) button.remove();
        else continue;
      }
      emojiButtons.dataset.emojiVersion = emojiVersion;
    }
    const tweetButton = document.querySelector(`[data-testid=${JSON.stringify(tweetButtonId)}]`);
    if (!tweetButton || tweetButton.parentNode.parentNode.dataset.testid !== "toolBar") continue;

    // それぞれの絵文字ボタンを作る
    for (const emoji of emojis) {
      if (!emoji) continue;
      const button = document.createElement("button");
      const emojiElm = document.createElement("div");
      emojiElm.style = emoji;
      emojiElm.style.height = "20px";
      emojiElm.style.width = "20px";
      button.append(emojiElm);
      button.onclick = () => tweetEmoji(tweetButton, emoji).then();
      button.style.padding = "1px 4px";
      emojiButtons.append(button);
    }

    tweetButton.before(emojiButtons);
  }
}, 50);

// 絵文字設定
let selectingIndex = null;
const updateEmojiDeleter = () => {
  const disabled = !emojis[selectingIndex];
  const emojiDeleter = document.getElementById("emoji_tweet-delete");
  if (!emojiDeleter) return;
  emojiDeleter.disabled = disabled;
  emojiDeleter.style.opacity = disabled ? 0.5 : 1.0;
  emojiDeleter.style.color = disabled ? null : Palette.RED;
  emojiDeleter.style.backgroundColor = disabled ? null : Palette.BG_GREEN;
};
const updateSelectingEmoji = (style) => {
  if (selectingIndex == null) return;
  emojis[selectingIndex] = style;
  GM_setValue("emojis", emojis);
  ++emojiVersion;
  selectingIndex = null;
  updateEmojiDeleter();
};

// 絵文字設定画面を追加
setInterval(() => {
  const emojiSettings = document.createElement("div");
  emojiSettings.id = "emoji_tweet-selector";
  {
    let selector;
    if ((selector = document.getElementById(emojiSettings.id))) {
      if (Number(selector.dataset.emojiVersion) < emojiVersion) selector.remove();
      else return;
    }
    emojiSettings.dataset.emojiVersion = emojiVersion;
  }
  if (document.getElementById(emojiSettings.id)) return;
  const emojiPicker = document.querySelector("#emoji_picker_categories_dom_id > div");
  if (!emojiPicker || emojiPicker.childNodes.length <= 1) return;

  // 設定画面タイトル
  const emojiSettingsTitle = document.createElement("h3");
  emojiSettingsTitle.innerText = "Emoji Tweet Buttons Settings";

  // 絵文字設定ボタン
  const emojiSelector = document.createElement("div");
  emojis.forEach((emoji, index) => {
    const button = document.createElement("button");
    const emojiElm = document.createElement("div");
    emojiElm.style = emoji;
    emojiElm.style.height = "20px";
    emojiElm.style.width = "20px";
    button.append(emojiElm);
    button.onclick = () => {
      if (selectingIndex != null) emojiSelector.childNodes[selectingIndex].style.backgroundColor = null;
      if (selectingIndex === index) selectingIndex = null;
      else emojiSelector.childNodes[(selectingIndex = index)].style.backgroundColor = Palette.BG_GREEN;
      updateEmojiDeleter();
    };
    button.style.padding = "1px 4px";
    if (index == selectingIndex) button.style.backgroundColor = Palette.BG_GREEN;
    emojiSelector.append(button);
  });

  // 絵文字削除ボタン
  const emojiDeleter = document.createElement("button");
  emojiDeleter.id = "emoji_tweet-delete";
  emojiDeleter.innerText = "Delete emoji";
  emojiDeleter.onclick = () => {
    updateSelectingEmoji("");
  };
  emojiDeleter.style.float = "right";
  emojiDeleter.style.margin = "1em 0";

  // 自動投稿設定
  const autoTweetSetting = document.createElement("div");
  autoTweetSetting.style.margin = "1em 0 1em";
  const autoTweetSettingLabel = document.createElement("label");
  autoTweetSettingLabel.innerText = "Auto Tweet: ";
  const autoTweetSettingBox = document.createElement("input");
  autoTweetSettingBox.type = "checkbox";
  autoTweetSettingBox.checked = GM_getValue("autoTweet", true);
  autoTweetSettingBox.onchange = ({ target }) => GM_setValue("autoTweet", target.checked);
  autoTweetSettingBox.style.verticalAlign = "-4px";
  autoTweetSettingBox.style.height = "20px";
  autoTweetSettingBox.style.width = "20px";
  autoTweetSettingBox.style.margin = "0 4px 0";
  autoTweetSetting.append(autoTweetSettingLabel, autoTweetSettingBox);

  emojiSettings.append(emojiSettingsTitle, emojiSelector, emojiDeleter, autoTweetSetting);
  emojiSettings.style.margin = "1em";
  emojiPicker.childNodes[1].after(emojiSettings);
  updateEmojiDeleter();
}, 50);

// 絵文字設定モード
setInterval(() => {
  const emojiPicker = document.querySelector("#emoji_picker_categories_dom_id > div");
  if (!emojiPicker) return;

  for (const emojiButton of emojiPicker.querySelectorAll(`[role="option"]`)) {
    if (selectingIndex == null) {
      emojiButton.onclick = null;
      emojiButton.style.backgroundColor = null;
    } else {
      emojiButton.onclick = (event) => {
        event.stopPropagation();
        updateSelectingEmoji(emojiButton.childNodes[0].style.cssText);
      };
      emojiButton.style.backgroundColor = Palette.BG_GREEN;
    }
  }
}, 50);
