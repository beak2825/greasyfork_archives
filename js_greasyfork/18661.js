// ==UserScript==
// @name            Wikipedia Flag Icons
// @description     Display flag icons to Wikipedia languages list.
// @icon            http://en.wikipedia.org/favicon.ico
// @version         2023.07.21 (3.0)
// @namespace       wikiflagicons
// @author          https://github.com/DavideViolante/
// @grant           none
// @include         http*://*.wikipedia.org/*
// @include         http*://*.wikimedia.org/*
// @include         http*://*.wiktionary.org/*
// @include         http*://*.wikibooks.org/*
// @include         http*://*.wikidata.org/*
// @include         http*://*.wikinews.org/*
// @include         http*://*.wikiquote.org/*
// @include         http*://*.wikisource.org/*
// @include         http*://*.wikiversity.org/*
// @include         http*://*.wikivoyage.org/*
// @downloadURL https://update.greasyfork.org/scripts/18661/Wikipedia%20Flag%20Icons.user.js
// @updateURL https://update.greasyfork.org/scripts/18661/Wikipedia%20Flag%20Icons.meta.js
// ==/UserScript==

// Flag icons by http://www.famfamfam.com/lab/icons/flags/

// Customize the following 2 parameters
const primaryLang = 'en';
const secondaryLang = 'it';

const flagUrl = 'https://github.com/DavideViolante/Wikipedia-Flag-Icons/raw/master/Chrome%20Extension/WikipediaFlagIcons/flags/';

(function () {
  // This extension was created with the help of Chat GPT
  const flagLangCode = {
    en: 'gb', de: 'de', es: 'es', fr: 'fr', it: 'it', nl: 'nl', ja: 'jp', pl: 'pl', ru: 'ru', sv: 'se',
    vi: 'vn', id: 'id', ms: 'my', cs: 'cz', ko: 'kr', hu: 'hu', no: 'no', pt: 'pt', ro: 'ro', sr: 'rs',
    fi: 'fi', tr: 'tr', uk: 'ua', zh: 'cn', bs: 'ba', bg: 'bg', da: 'dk', et: 'ee', el: 'gr', he: 'il',
    ge: 'ge', uz: 'uz', am: 'et', arz: 'eg', az: 'az', be: 'by', bi: 'vu', bn: 'bd', hy: 'am', is: 'is',
    hr: 'hr', lv: 'lv', lt: 'lt', sk: 'sk', sl: 'si', th: 'th', ga: 'ie', ka: 'ge', kk: 'kz', ne: 'np',
    kl: 'gl', km: 'kh', ky: 'kg', lb: 'lu', lo: 'la', mg: 'mg', mk: 'mk', mn: 'mn', mt: 'mt', ps: 'af',
    rw: 'rw', si: 'lk', sm: 'ws', so: 'so', sq: 'al', tg: 'tj', tk: 'tm', ur: 'pk', uz: 'uz',
    hi: 'in', ca: 'catalonia', eo: 'eo', sco: 'scotland', tet: 'tl'
  };

  // Define a function to get the flag URL based on the language code
  function getFlagUrl(langCode) {
    return chrome.runtime.getURL(`${flagUrl}${flagLangCode[langCode]}.png`);
  }

  // Function to add the image element inside the link
  function addFlagImage(link, prop, popupMenu) {
    if (!link.querySelector('img.flag-image')) {
      const img = document.createElement('img');
      img.src = getFlagUrl(prop);
      img.alt = prop;
      img.title = prop;
      img.className = 'flag-image';
      img.style.marginRight = '5px'; // Add 5px space between the image and text (adjust as needed)
      img.style.marginLeft = '5px'; // Add 5px space between the image and text (adjust as needed)
      if (popupMenu) {
        const anchor = link.querySelector('a');
        anchor.insertBefore(img, anchor.firstChild);
      } else {
        link.insertBefore(img, link.firstChild);
      }
    }
  }

  // Function to apply flags to the language links
  function applyFlagsToLanguageLinks(links, popupMenu) {
    links.forEach(link => {
      // Get the language code from the class name (e.g., 'interwiki-en' -> 'en')
      const prop = link.className.match(/interwiki-(\w+)/)[1];
      addFlagImage(link, prop, popupMenu);
      // Add a flag-applied class to the link to mark that the flag has been added
      link.classList.add('flag-applied');
    });
  }

  // Find the initial language links and apply the flags
  const initialLinks = document.querySelectorAll('.interlanguage-link:not(.flag-applied)');
  applyFlagsToLanguageLinks(initialLinks);

  const clickFn = () => {
    // Delay querying the language links to give time for them to be rendered
    setTimeout(() => {
      const additionalLinks = document.querySelectorAll('.uls-language-list .interlanguage-link');
      applyFlagsToLanguageLinks(additionalLinks, true);
    }, 500);
  };

  // MutationObserver to detect the appearance of the button
  const observer = new MutationObserver(mutationsList => {
    const showMoreButton = document.querySelector('.mw-interlanguage-selector.mw-ui-button');
    const showMoreButtonEn = document.querySelector('#p-lang-btn');
    if (showMoreButton) {
      showMoreButton.addEventListener('click', clickFn);
      observer.disconnect();
    }
    if (showMoreButtonEn) {
      showMoreButtonEn.addEventListener('click', clickFn);
      observer.disconnect();
    }
  });

  // Observe mutations in the document to detect the appearance of the button
  observer.observe(document, { childList: true, subtree: true });

})();
