// ==UserScript==
// @name        Wanikani hanzi-writer addition
// @namespace   https://declanfodor.com
// @description Replaces kanji in wanikani with hanzi writer. Licenses for kanji data are found at https://github.com/chanind/hanzi-writer-data-jp/
// @match       https://www.wanikani.com/*
// @version     0.0.4
// @author      Declan Fodor
// @resource    kanjiJSON https://raw.githubusercontent.com/chanind/hanzi-writer-data-jp/master/data/all.json
// @require     https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.js
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @license     MIT
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @grant       GM_getValue
// @grant       GM_setvalue
// @downloadURL https://update.greasyfork.org/scripts/503271/Wanikani%20hanzi-writer%20addition.user.js
// @updateURL https://update.greasyfork.org/scripts/503271/Wanikani%20hanzi-writer%20addition.meta.js
// ==/UserScript==

(function () {
'use strict';

const WK_PAGE = Object.freeze({
  REVIEW: Symbol("review_page"),
  LESSON: Symbol("lesson_page"),
  DASHBOARD: Symbol("dashboard_page"),
  LOADING: Symbol("other_page") // Or a page we haven't implemented behavior for yet
});
class PageStatus {
  constructor(previousStatus) {
    this.page = this.whichPage(unsafeWindow.location.href);
    this.switched = previousStatus ? previousStatus.page !== this.page : true;
  }
  whichPage(url) {
    switch (url) {
      case "https://www.wanikani.com/":
        return WK_PAGE.DASHBOARD;
      case "https://www.wanikani.com/subjects/review":
        return WK_PAGE.REVIEW;
      default:
        return WK_PAGE.LOADING;
    }
  }
}

class PageObserver {
  constructor(wk_page, onPage, offPage) {
    this.status = new PageStatus(null);
    this.observer = new MutationObserver(() => {
      if (this.status.switched && this.status.page === wk_page) {
        onPage();
      } else if (this.status.switched) {
        offPage();
      }
      this.status = new PageStatus(this.status);
    });
    this.observer.observe(document, {
      childList: true,
      subtree: true
    });
  }
}

let kanji_json = JSON.parse(GM_getResourceText("kanjiJSON"));
class ReviewPage {
  constructor() {
    this.kanji_elem = null;
    this.kanji = null;
    this.writer = null;
    this.container_div = null;
  }
  /**
   * Called whenever the kanji has switched. It creates the hanzi writer instance
   */
  drawHanziWriter() {
    if (!this.writer) {
      let character_header = document.querySelector(".quiz .character-header");
      this.container_div = document.createElement("div");
      this.container_div.id = "wkhwa-container-div";
      this.writer = HanziWriter.create(this.container_div, this.kanji, {
        showOutline: wkof.settings.wkhwa.showOutline,
        showCharacter: wkof.settings.wkhwa.showCharacter,
        width: wkof.settings.wkhwa.width,
        height: wkof.settings.wkhwa.height,
        padding: wkof.settings.wkhwa.padding,
        strokeAnimationSpeed: wkof.settings.wkhwa.strokeAnimationSpeed,
        strokeHighlightSpeed: wkof.settings.wkhwa.strokeHighlightSpeed,
        strokeFadeDuration: wkof.settings.wkhwa.strokeFadeDuration,
        delayBetweenStrokes: wkof.settings.wkhwa.delayBetweenStrokes,
        delayBetweenLoops: wkof.settings.wkhwa.delayBetweenLoops,
        strokeColor: wkof.settings.wkhwa.strokeColor,
        highlightColor: wkof.settings.wkhwa.highlightColor,
        outlineColor: wkof.settings.wkhwa.outlineColor,
        drawingColor: wkof.settings.wkhwa.drawingColor,
        drawingWidth: wkof.settings.wkhwa.drawingWidth,
        showHintAfterMisses: wkof.settings.wkhwa.showHintAfterMisses,
        quizStartStrokeNum: wkof.settings.wkhwa.quizStartStrokeNum,
        highlightOnComplete: wkof.settings.wkhwa.highlightOnComplete,
        charDataLoader: (char, on_load) => {
          on_load(kanji_json[char]);
        }
      });
      character_header.append(this.container_div);
    } else {
      this.writer.setCharacter(this.kanji);
    }
    if (wkof.settings.wkhwa.quiz) {
      this.writer.quiz();
    } else if (wkof.settings.wkhwa.animate) {
      if (wkof.settings.wkhwa.loop_animation) {
        this.writer.loopCharacterAnimation();
      } else {
        this.writer.animateCharacter();
      }
    }
  }
  onReviewPage() {
    this.observer = new MutationObserver(() => {
      if (this.refreshKanjiState()) {
        this.drawHanziWriter();
      }
    });
    this.kanji_elem = document.querySelector(".quiz .character-header .character-header__characters");
    if (this.refreshKanjiState()) {
      this.drawHanziWriter();
    }
    this.observer.observe(this.kanji_elem, {
      childList: true,
      subtree: true
    });
  }
  showHanziWriter() {
    this.kanji_elem.hidden = true;
    if (this.container_div) {
      this.container_div.hidden = false;
    }
  }
  hideHanziWriter() {
    this.kanji_elem.hidden = false;
    if (this.container_div) {
      this.container_div.hidden = true;
    }
  }
  /**
   * Returns true if the kanji shown has switched. Returns false otherwise
   * This function also manages hiding and showing kanji 
   * in the event that the characters shown are either a radical or vocabulary
   */
  refreshKanjiState() {
    // CHANGEME shouldn't this return an enum and have the logic outside this function?
    if (document.querySelector(".quiz-input__question-category").innerText.toLowerCase() === "kanji" && kanji_json[this.kanji_elem.innerText]) {
      if (this.kanji_elem.innerText !== this.kanji) {
        // We have switched to a new kanji, mayhap away from vocabulary, so we need to set these to be shown
        this.kanji = this.kanji_elem.innerText;
        this.showHanziWriter();
        return true;
      } else {
        return false;
      }
    }
    // The character content has switched to vocabulary or a radical
    this.kanji = null;
    this.hideHanziWriter();
    return false;
  }
  /**
   * Cleans up various objects if we switch away from them.
   */
  offReviewPage() {
    this.kanji = null;
    this.writer = null;
    this.container_div = null;
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

// Loads styles
GM_addStyle(`#wkhwa-container-div {
    position: relative;
    top: -32px;
    display: flex;
    align-items: center;
    justify-content: center;
}`);
let default_settings = {
  showOutline: true,
  showCharacter: true,
  width: 200,
  height: 200,
  padding: 20,
  strokeAnimationSpeed: 1,
  strokeHighlightSpeed: 2,
  strokeFadeDuration: 400,
  delayBetweenStrokes: 1000,
  delayBetweenLoops: 2000,
  strokeColor: "#555555",
  highlightColor: "#8899FF",
  outlineColor: "#FFFFFF",
  drawingColor: "#333333",
  drawingWidth: 20,
  showHintAfterMisses: 3,
  quizStartStrokeNum: 0,
  highlightOnComplete: false,
  quiz: true,
  animate: false,
  loop_animation: false
};
let config = {
  script_id: "wkhwa",
  title: "Hanzi writer addition",
  content: {
    hanzi_writer: {
      type: "group",
      label: "Options:",
      content: {
        showOutline: {
          type: 'checkbox',
          label: 'showOutline',
          default: default_settings.showOutline
        },
        showCharacter: {
          type: 'colorbox',
          label: 'showCharacter',
          default: default_settings.showCharacter
        },
        width: {
          type: "number",
          label: "width",
          default: default_settings.width
        },
        height: {
          type: "number",
          label: "height",
          default: default_settings.height
        },
        padding: {
          type: "number",
          label: "padding",
          default: default_settings.padding
        },
        strokeAnimationSpeed: {
          type: "number",
          label: "strokeAnimationSpeed",
          default: default_settings.strokeAnimationSpeed
        },
        strokeHighlightSpeed: {
          type: "number",
          label: "strokeHighlightSpeed",
          default: default_settings.strokeHighlightSpeed
        },
        strokeFadeDuration: {
          type: "number",
          label: "strokeFadeDuration",
          default: default_settings.strokeFadeDuration
        },
        delayBetweenStrokes: {
          type: "number",
          label: "delayBetweenStrokes",
          default: default_settings.delayBetweenStrokes
        },
        delayBetweenLoops: {
          type: "number",
          label: "delayBetweenLoops",
          default: default_settings.delayBetweenLoops
        },
        StrokeColor: {
          type: 'color',
          label: 'strokeColor',
          default: '#555555'
        },
        highlightColor: {
          type: 'color',
          label: 'highlightColor',
          default: '#8899FF'
        },
        outlineColor: {
          type: 'color',
          label: 'outlineColor',
          default: '#FFFFFF'
        },
        drawingColor: {
          type: 'color',
          label: 'drawingColor',
          default: '#333333'
        },
        drawingWidth: {
          type: "number",
          label: "drawingWidth",
          default: default_settings.drawingWidth
        },
        showHintAfterMisses: {
          type: "number",
          label: "showHintAfterMisses",
          default: default_settings.showHintAfterMisses
        },
        quizStartStrokeNum: {
          type: "number",
          label: "quizStartStrokeNum",
          default: default_settings.quizStartStrokeNum
        },
        highlightOnComplete: {
          type: 'checkbox',
          label: 'highlightOnComplete',
          default: default_settings.highlightOnComplete
        },
        quiz: {
          type: 'checkbox',
          label: 'quiz',
          default: default_settings.quiz
        },
        animate: {
          type: 'checkbox',
          label: 'animate',
          default: default_settings.animate
        },
        loop_animation: {
          type: 'checkbox',
          label: 'loopAnimation',
          default: default_settings.loop_animation
        }
      }
    }
  }
};
wkof.include('Menu, Settings');
wkof.ready('Menu, Settings').then(main);
function main() {
  wkof.Settings.load('wkhwa', default_settings);
  wkof.Menu.insert_script_link({
    name: 'wkhwa',
    submenu: 'wkhwa',
    title: 'Hanzi writer settings',
    on_click: new wkof.Settings(config).open
  });
  let review_page = new ReviewPage();
  new PageObserver(WK_PAGE.REVIEW, review_page.onReviewPage.bind(review_page), review_page.offReviewPage.bind(review_page));
}

})();
