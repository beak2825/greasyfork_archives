// ==UserScript==
// @name        Outlook Calendar - Auto full-open schedule popup
// @namespace   Violentmonkey Scripts
// @match       *://outlook.office.com/calendar/*
// @match       *://outlook.office365.com/calendar/*
// @icon        https://res-h3.public.cdn.office.net/assets/mail/pwa/v1/pngs/apple-touch-icon.png
// @grant       none
// @noframes
// @version     1.0.7
// @author      y-saeki
// @supportURL  https://github.com/y-saeki/UserScript
// @description Cancel the unusable mini-popup that appears when you click on a schedule and force it to be displayed in full-size modal.
// @downloadURL https://update.greasyfork.org/scripts/465343/Outlook%20Calendar%20-%20Auto%20full-open%20schedule%20popup.user.js
// @updateURL https://update.greasyfork.org/scripts/465343/Outlook%20Calendar%20-%20Auto%20full-open%20schedule%20popup.meta.js
// ==/UserScript==


// 初期設定
const config = {
  targetMutate        : '#fluent-default-layer-host',
  targetFullOpenTitle : {
    ja                : 'イベントを表示します',
    en                : 'View event'
  },
  modalHeight         : '900px'
};


// 指定された要素を探す処理
function findFullOpenButtonByLabel(title) {

  const targets = document.getElementsByTagName('button');

  for (let i = 0; i < targets.length; i++) {
    if (targets[i].getAttribute("title") === title) {
      return targets[i];
    }
  }

  return null;

}

// 指定された要素を探してクリックする処理
function clickFullOpenButton() {

  const currentLang = document.documentElement.lang;
  const targetFullOpenButton = findFullOpenButtonByLabel(config.targetFullOpenTitle[currentLang] || config.targetFullOpenTitle['en']);

  if (targetFullOpenButton) {
    targetFullOpenButton.click();
  }

}

// 対象セレクタが存在するか確認し、存在するまで待機する関数
function waitForElement(selector) {
  return new Promise((resolve) => {
    const checkForElement = () => {
      const element = document.querySelector(selector);
      element ? resolve(element) : setTimeout(checkForElement, 100);
    };
    checkForElement();
  });
}


(() => {
  const html = `
    <style>
      /*   tweak modal size   */
      div.ms-Modal-scrollableContent,
      div.ms-Modal-scrollableContent > div,
      div[data-app-section="ReadingPane"] {
        height: ${config.modalHeight};
      }
      /*   fix member pane scrollbar bug  */
      .XamP2 {
        padding-bottom: 10px;
      }
    </style>
  `;
  const element = document.body;
  element.insertAdjacentHTML('beforeend', html);
})();

(async function() {

  // 対象セレクタが出現するまで待機
  const targetElement = await waitForElement(config.targetMutate);

  // DOM変更を監視するMutationObserverの設定
  const observerConfig = { childList: true, subtree: true };
  const observer = new MutationObserver(function(mutations) {
    // 変更が検出されたときに実行する処理
    clickFullOpenButton();
  });

  // 対象セレクタの要素の変更を監視する
  observer.observe(targetElement, observerConfig);

})();