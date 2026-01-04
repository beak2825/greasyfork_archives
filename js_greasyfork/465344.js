// ==UserScript==
// @name        Outlook Calendar - Auto uncheck "Email organizer"
// @namespace   Violentmonkey Scripts
// @match       *://outlook.office.com/calendar/*
// @match       *://outlook.office365.com/calendar/*
// @icon        https://res-h3.public.cdn.office.net/assets/mail/pwa/v1/pngs/apple-touch-icon.png
// @grant       none
// @noframes    
// @version     1.1.3
// @author      y-saeki
// @supportURL  https://github.com/y-saeki/UserScript
// @description Automatically turn off the annoying "Email organizer" checkbox that appears every time you try to respond to an invitation.
// @downloadURL https://update.greasyfork.org/scripts/465344/Outlook%20Calendar%20-%20Auto%20uncheck%20%22Email%20organizer%22.user.js
// @updateURL https://update.greasyfork.org/scripts/465344/Outlook%20Calendar%20-%20Auto%20uncheck%20%22Email%20organizer%22.meta.js
// ==/UserScript==


// 初期設定
const config = {
  targetMutate        : '#fluent-default-layer-host',
  targetCheckboxLabel : {
    ja: '開催者にメールを送信する',
    en: 'Email organizer'
  }
};

// 指定されたラベルを持つチェックボックスを検索する関数
function findCheckboxByLabel(labelText) {

  const labels = document.getElementsByTagName('label');

  for (let i = 0; i < labels.length; i++) {
    if (labels[i].getAttribute('for')) {
      // ポップアップ用（labelがforを持っている場合） : forに一致するinputを返す
      const spanElement = labels[i].querySelector('span');
      if (spanElement && spanElement.innerText === labelText) {
        const checkboxId = labels[i].getAttribute('for');
        return document.getElementById(checkboxId);
      }
    }　else {
      // モーダルウィンドウ用（labelがforを持っていない場合） : 同じ親を持つ子孫からbuttonを返す
      const parent = labels[i].parentElement;
      const buttonElement = parent.querySelector('button');
      if (buttonElement) {
        return buttonElement;
      }
    }
  }

  return null;

}

// チェックボックスの状態を取得する処理
function isCheckboxChecked(targetCheckbox) {

  // targetCheckboxがinputかbuttonか判別
  // 🚨 HTMLの場合、 Element.tagName は必ず大文字で値を返す
  switch (targetCheckbox.tagName) {
    case 'INPUT':
      return targetCheckbox.checked;
    case 'BUTTON':
      return targetCheckbox.getAttribute('aria-checked');
    default:
      return null;
  }

}

// チェックボックスを検索してチェックを外す処理
async function uncheckTargetCheckbox() {

  const currentLang = document.documentElement.lang;
  const targetCheckbox = findCheckboxByLabel(config.targetCheckboxLabel[currentLang] || config.targetCheckboxLabel['en']);

    if (targetCheckbox && isCheckboxChecked(targetCheckbox) && !(targetCheckbox.getAttribute('data-auto-clicked'))) {
      await new Promise(resolve => setTimeout(resolve, 50));
      targetCheckbox.click();
      targetCheckbox.setAttribute('data-auto-clicked', 'true');
    }

}

// 対象セレクタが存在するか確認し、発見するまで待機する関数
function waitForElement(selector) {

  return new Promise((resolve) => {
    const checkForElement = () => {
      const element = document.querySelector(selector);
      element ? resolve(element) : setTimeout(checkForElement, 100);
    };
    checkForElement();
  });

}

(async function() {

  // 監視対象要素が出現するまで待機
  const targetElement = await waitForElement(config.targetMutate);

  // DOM変更を監視するMutationObserverの設定
  const observerConfig = { childList: true, subtree: true };
  const observer = new MutationObserver(async function(mutations) {
    // 変更が検出されたときにチェックボックスを検索してチェックを外す
    observer.disconnect();
    await uncheckTargetCheckbox();
    observer.observe(targetElement, observerConfig);
  });

  // 対象セレクタの要素の変更を監視する
  observer.observe(targetElement, observerConfig);

})();