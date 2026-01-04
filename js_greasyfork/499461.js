// ==UserScript==
// @name         Manaba Answer Viewer
// @namespace    https://github.com/Gai-H/manaba-answer-viewer
// @version      1.1
// @author       Gai
// @description  小テストの回答と正解を横並びで表示します。
// @license      MIT
// @source       https://github.com/Gai-H/manaba-answer-viewer
// @include      /^https:\/\/manaba\.tsukuba\.ac\.jp\/(local|ct)\/course_\d+_query_\d+\/?.*$/
// @exclude      /^https:\/\/manaba\.tsukuba\.ac\.jp\/(local|ct)\/course_\d+_query_\d+\/?.*answer=1.*$/
// @downloadURL https://update.greasyfork.org/scripts/499461/Manaba%20Answer%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/499461/Manaba%20Answer%20Viewer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CUSTOM_CSS = `
  :nth-child(1 of .pagebody) {
    padding-bottom: 0 !important;
    
    .contentbody-s {
      padding-bottom: 0 !important;
    }
  }

  :nth-child(2 of .pagebody) {
    padding-top: 0 !important;

    .contentbody-s {
      min-height: 0 !important;
      padding-top: 0 !important;
    }
  }

  .answer-viewer {
    width: 98dvw;
    margin-left: calc(50% - 49vw);
    margin-right: calc(50% - 49vw);
    display: flex;
    justify-content: center;
    
    > * {
      width: 662px !important;
      margin: 0 !important;
    }

    > iframe {
      border: none;
    }

    > table > tbody > tr.title {
      display: none;
    }
  }
`;
  const CUSTOM_CSS_IFRAME = `
  html {
    overflow-x: hidden;
  }

  #container {
    margin: 0 !important;
    width: fit-content !important;
    min-width: 0 !important;  
  }

  .pagebody {
    padding: 0 !important;
    width: fit-content !important;
  }

  .contentbody-s {
    padding: 0 !important;
    margin: 0 !important;

    > h1 {
      display: none;
    }

    > table {
      margin-top: 0 !important; 

      > tbody > tr.title {
        display: none;
      }
    }
  }

  .queryv4 > div:last-of-type {
    display: none;
  }
`;
  const correctAnswerAnchor = document.querySelector(".queryanswerspan > a");
  if (correctAnswerAnchor !== void 0) {
    correctAnswerAnchor.onclick = (e) => {
      e.preventDefault();
      if (window.innerWidth < 1360) {
        handleClickWithSmallScreen();
      } else {
        handleClickWithLargeScreen();
      }
    };
  }
  const handleClickWithSmallScreen = () => {
    window.open(correctAnswerAnchor.href, "_blank");
  };
  const handleClickWithLargeScreen = () => {
    const myAnswerTable = document.querySelector("table.querysubmitted");
    const myAnswerTableClone = myAnswerTable.cloneNode(true);
    const footerElements = (() => {
      const elems = [];
      let nextSibling = myAnswerTable.nextElementSibling;
      while (nextSibling !== null) {
        elems.push(nextSibling);
        nextSibling = nextSibling.nextElementSibling;
      }
      return elems;
    })();
    const footerElementsClone = footerElements.map((elem) => elem.cloneNode(true));
    myAnswerTable.remove();
    footerElements.forEach((elem) => elem.remove());
    const firstPageBodyDiv = document.querySelector(".pagebody");
    const secondPageBodyDiv = document.createElement("div");
    secondPageBodyDiv.classList.add("pagebody");
    const secondPageBodyDivContentBodyDiv = document.createElement("div");
    secondPageBodyDivContentBodyDiv.classList.add("contentbody-s");
    footerElementsClone.forEach((elem) => secondPageBodyDivContentBodyDiv.appendChild(elem));
    secondPageBodyDiv.appendChild(secondPageBodyDivContentBodyDiv);
    firstPageBodyDiv.insertAdjacentElement("afterend", secondPageBodyDiv);
    const answerViewerDiv = document.createElement("div");
    answerViewerDiv.classList.add("answer-viewer");
    const correctAnswerIframe = document.createElement("iframe");
    correctAnswerIframe.src = correctAnswerAnchor.href;
    correctAnswerIframe.onload = () => {
      var _a;
      const customIframeStyle = document.createElement("style");
      customIframeStyle.innerHTML = CUSTOM_CSS_IFRAME;
      (_a = correctAnswerIframe.contentDocument) == null ? void 0 : _a.head.appendChild(customIframeStyle);
    };
    answerViewerDiv.appendChild(myAnswerTableClone);
    answerViewerDiv.appendChild(correctAnswerIframe);
    firstPageBodyDiv.insertAdjacentElement("afterend", answerViewerDiv);
    const customStyle = document.createElement("style");
    customStyle.innerHTML = CUSTOM_CSS;
    document.head.appendChild(customStyle);
  };

})();