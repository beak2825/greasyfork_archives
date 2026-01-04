// ==UserScript==
// @name         Purge E(x)Hentai Chinese Comments
// @namespace    https://ehentai.example.invalid/
// @version      0.3
// @description  Purge shitty Chinese comments.
// @author       SomeRandomieLone
// @license      MIT
// @match        https://*e-hentai.org/g/*
// @match        https://exhentai.org/g/*
// @icon         https://e-hentai.org/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/471424/Purge%20E%28x%29Hentai%20Chinese%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/471424/Purge%20E%28x%29Hentai%20Chinese%20Comments.meta.js
// ==/UserScript==

( async () => {


// PurgeChineseComments/tweaks.ts
var Tweaks = Object.freeze({
  /**
   * The ratio of Chinese to non-Chinese
   * characters in a sentence for it to be
   * marked as Chinese.
   * The lower, more sensitive the algorithm.
   */
  ChineseThreshold: 0.15,
  /**
   * Whether to hide gallery uploader's
   * comment if it's also in Chinese.
   */
  HideUploaderComment: !1
});

// PurgeChineseComments/tools.ts
function IsLikelyChinese(text) {
  return Array.from(text).filter(
    (c) => "\u4E00" <= c && c <= "\u9FFF"
  ).length / text.length >= Tweaks.ChineseThreshold;
}

// PurgeChineseComments/comment.ts
function SelectComments() {
  let elems = document.querySelectorAll(
    "div#cdiv.gm > div.c1"
  );
  return Array.from(elems).map(
    (e) => new CommentBlock(e)
  );
}
var CommentBlock = class {
  constructor(element) {
    this.element = element;
  }
  /**
   * Get the text content of comment.
   */
  content() {
    return this.element.querySelector(
      'div[id^="comment_"]'
    )?.innerText ?? "";
  }
  /**
   * Check how likely some texts are in Chinese.
   */
  is_chinese() {
    return IsLikelyChinese(
      this.content()
    );
  }
  /**
   * Is this comment block by the
   * gallery uploader?
   */
  is_uploader() {
    return this.element.querySelector("a[name='ulcomment']") != null;
  }
  /**
   * Hide the represented element.
   */
  hide() {
    this.element.style.display = "none";
  }
};

// PurgeChineseComments/main.ts
var purge_counter = 0;
for (let comment of SelectComments())
  comment.is_chinese() && (comment.is_uploader() && !Tweaks.HideUploaderComment || (comment.hide(), purge_counter++));
console.log(
  `Hide ${purge_counter} Chinese comment(s)`
);


} )();

