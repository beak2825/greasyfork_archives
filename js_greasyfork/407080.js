// ==UserScript==
// @name         Bitbucket code highlight
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add syntax highlight on bitbucket pull requests
// @author       Johnatan Dias
// @match        https://bitbucket.org/**/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407080/Bitbucket%20code%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/407080/Bitbucket%20code%20highlight.meta.js
// ==/UserScript==

/*global hljs: true */

(function () {
  'use strict';

  const ENABLE_DEBUG = false;

  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/styles/default.min.css';
  document.body.appendChild(style);

  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.1.1/highlight.min.js';
  document.body.appendChild(script);

  const DEBUG = {
    LOG: message => ENABLE_DEBUG && console.log('=>', message),
  };

  const highlightCode = () => {
    const notHighlightedCode = document.querySelectorAll(
      '.code-diff:not([data-highlighted="true"])'
    );

    if (!notHighlightedCode.length) return;
    DEBUG.LOG({ notHighlightedCode });

    const articleFilesElements = document.querySelectorAll(
      '[data-qa="pr-diff-file-styles"]'
    );

    if (!articleFilesElements.length) return;
    DEBUG.LOG({ articleFilesElements });

    addEventListenerOnShowMoreButton();

    const handleExtensionName = extension => {
      const extensions = { json: 'js' };
      return extensions[extension] || extension;
    }

    Array.from(articleFilesElements).forEach(file => {
      const fileTitle = file.querySelector('[data-qa="bk-filepath"]')
        .firstChild
        .lastElementChild
        .innerText;

      const language = handleExtensionName(fileTitle.split('.').pop());
      DEBUG.LOG({ fileTitle, language });

      const linesCode = file.querySelectorAll(
        '.code-diff:not([data-highlighted="true"])'
      );

      DEBUG.LOG({ linesCode });

      Array.from(linesCode).forEach(codeElement => {
        const parentElement = codeElement.parentElement;
        parentElement.classList.add(language);
        parentElement.style.display = 'flex';
        parentElement.style.alignItems = 'center';

        hljs.highlightBlock(codeElement);
        codeElement.style.backgroundColor = 'transparent';
        codeElement.style.padding = '0';
        codeElement.dataset.highlighted = true;
      });
    });
  }

  const addEventListenerOnShowMoreButton = () => {
    const buttons = document.querySelectorAll(
      '[data-qa="pr-diff-show-more-lines"]:not([data-event-added="true"])'
    );

    DEBUG.LOG({ buttons });

    for (let button of buttons) {
      button.addEventListener('click', highlightCode, false);
      button.dataset.eventAdded = true;
    }
  };

  window.addEventListener('scroll', highlightCode, false);
})();
