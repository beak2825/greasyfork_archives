// ==UserScript==
// @name        Always visible languages - wikipedia.org
// @namespace   -
// @match       *://*.wikipedia.org/*
// @grant       none
// @version     0.1.2
// @author      num
// @description Add list of languages back to the table of content
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460415/Always%20visible%20languages%20-%20wikipediaorg.user.js
// @updateURL https://update.greasyfork.org/scripts/460415/Always%20visible%20languages%20-%20wikipediaorg.meta.js
// ==/UserScript==
 
window.addEventListener(
  'load',
  () => {
    mw.loader.enqueue(['mediawiki.base'], () => {
      mw.loader.using(['ext.cx.entrypoints.ulsrelevantlanguages'], () => {
        const destinationContainer = document.querySelector('#vector-toc');
 
        if (!destinationContainer) return;
 
        const frequentLanguages = new Set(mw.uls.getFrequentLanguageList());
 
        const addLanguagesBlock = (languagesRoot) => {
          const languages = languagesRoot.querySelectorAll(
            '.interlanguage-link a'
          );

          // early return if no languages are available
          if (languages.length === 0) return;
 
          const header = document.createElement('div');
          header.className =
            'vector-pinnable-header vector-toc-pinnable-header vector-pinnable-header-pinned';
          const headerLabel = document.createElement('h2');
          headerLabel.className = 'vector-pinnable-header-label';
          headerLabel.innerText = mw.msg('uls-plang-title-languages');
          header.append(headerLabel);
          header.style.cssText = 'margin-top: 24px;';
          destinationContainer.append(header);
 
          const languagesList = document.createElement('ul');
          languagesList.className = 'vector-toc-contents';
          [...languages]
            .filter((langHref) => frequentLanguages.has(langHref.lang))
            .forEach((langHref) => {
              const li = document.createElement('li');
              li.className = 'vector-toc-list-item vector-toc-level-1';
              const anchor = document.createElement('a');
              anchor.className = 'vector-toc-link';
              anchor.href = langHref.getAttribute('href');
              const anchorText = document.createElement('div');
              anchorText.className = 'vector-toc-text';
              anchorText.title = langHref.title;
              anchorText.innerText = langHref.innerText;
              anchor.append(anchorText);
              li.append(anchor);
              languagesList.append(li);
            });
 
          destinationContainer.append(languagesList);
        };
 
        const suggested = document.querySelector('#p-lang-btn');
        addLanguagesBlock(suggested);
      });
    });
  },
  false
);