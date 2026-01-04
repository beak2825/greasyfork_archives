// ==UserScript==
// @name           Font substitution: Noto Serif CJK JP using local fonts for Android9+
// @name:ja        フォント置換：Noto Serif CJK JP Android9以降搭載のローカルフォント
// @namespace      https://github.com/yzrsng
// @description    Userscript to use Local JP Serif font on all websites in Android browser for Android 9+.
// @description:ja ウェブページでローカルの日本語明朝体フォントを使うユーザースクリプト。Android 9以降用。
// @version        0.1.20240223.3
// @license        CC0-1.0
// @include        http://*
// @include        https://*
// @match          *://*/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/457134/Font%20substitution%3A%20Noto%20Serif%20CJK%20JP%20using%20local%20fonts%20for%20Android9%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/457134/Font%20substitution%3A%20Noto%20Serif%20CJK%20JP%20using%20local%20fonts%20for%20Android9%2B.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const setSerifFont = () => {
    // skip Misskey, Calckey, FoundKey?
    const applicationNameElm = document.head.querySelector('meta[name="application-name"][content]');
    if (applicationNameElm) {
      const aName = applicationNameElm.content;
      const misskey_forks = [
        "Misskey",
        "Calckey",
        "FoundKey",
        "Firefish",
        "Iceshrimp",
        "Sharkey",
        "CherryPick",
        "Tanukey",
      ];
      for (const fork of misskey_forks) {
        if (aName === fork) return;
      }
    }
    const newFontFamilyName = 'Noto Serif CJK JP';
    // const oldFontFamilyNames = [
    //   "Roboto",
    //   "Google Sans",
    //   "Droid Sans",
    //   "MotoyaLMaru",
    //   "MotoyaLCedar",
    //   "Noto Sans JP",
    //   "Noto Sans CJK JP",
    //   "SEC CJK JP",
    //   "Droid Sans Japanese"
    // ]
    const font = new FontFace(newFontFamilyName, `local(${newFontFamilyName})`);
    font.load().then(() => {document.fonts.add(font)});
    const myHead = document.getElementsByTagName('head')[0];
    const myCss = document.createElement('style');
    myCss.id = 'set_serif_font_style';
    myCss.insertAdjacentHTML('beforeend', `
    @font-face {font-family: ${newFontFamilyName}; src: local(${newFontFamilyName});}
    @font-face {font-family: "Roboto"; src: local(${newFontFamilyName});}
    @font-face {font-family: "Google Sans"; src: local(${newFontFamilyName});}
    @font-face {font-family: "Droid Sans"; src: local(${newFontFamilyName});}
    @font-face {font-family: "MotoyaLMaru"; src: local(${newFontFamilyName});}
    @font-face {font-family: "MotoyaLCedar"; src: local(${newFontFamilyName});}
    @font-face {font-family: "Noto Sans JP"; src: local(${newFontFamilyName});}
    @font-face {font-family: "Noto Sans CJK JP"; src: local(${newFontFamilyName});}
    @font-face {font-family: "SEC CJK JP"; src: local(${newFontFamilyName});}
    @font-face {font-family: "Droid Sans Japanese"; src: local(${newFontFamilyName});}
    *:not(pre):not(span):not(code):not(samp){font-family:'USERFONT-${newFontFamilyName}', Charis SIL Compact, Noto Serif CJK JP, Noto Serif, Droid Serif, serif;}
    `);
    myHead.appendChild(myCss);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setSerifFont);
  } else {
    setSerifFont();
  }
})();
