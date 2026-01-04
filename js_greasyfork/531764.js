// ==UserScript==
// @name        hinatazaka46-exceptionhandler
// @namespace   https://greasyfork.org/ja/users/1328592-naoqv
// @description handle exception
// @description:ja 例外処理
// @version     0.4
// @match       https://www.hinatazaka46.com/s/official/*
// @icon        https://cdn.hinatazaka46.com/files/14/hinata/img/favicons/favicon-32x32.png
// @grant       none
// @license     MIT
// ==/UserScript==

const handleException = (proc, scriptName) => {
  try {
    const divElem = document.querySelector('html body div');
    if (divElem == null || divElem.innerText == null || divElem.innerText.includes('メンテナンス中')) {
      return;
    }
    proc();
  } catch (e) {

    console.error(e);

    const cookies = document.cookie;

    const lang = CookieUtils.getCookie("wovn_selected_lang");

    switch(lang) {
      case "ja":
        alert(`userscriptの処理中にエラーが発生しました。\n「${scriptName}」のuserscriptを無効にしてください。`);
        break;
      case "en":
      case "zh-Hans":
      case "zh-Hant":
      case "ko":
      default:
        alert(`An error occurred while processining userscript.\nPlease disable the userscript:\n[${scriptName}].`);
    }
  }
};
