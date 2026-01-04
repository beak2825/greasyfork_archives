// ==UserScript==
// @name        GreasyFork: Check To Search
// @namespace   Violentmonkey Scripts
// @match       https://greasyfork.org/*
// @grant       none
// @version     0.1.0
// @license     MIT
// @description 1/8/2024, 6:31:18 PM
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/488020/GreasyFork%3A%20Check%20To%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/488020/GreasyFork%3A%20Check%20To%20Search.meta.js
// ==/UserScript==


function fixURL(url) {
    url = url.replace(/(\/\w+\/\d+)\-[%\d\w-]+([?#]|$)/, '$1$2').replace(`${location.origin}/`, '/');
    if (!url) return '';
    if (url.includes('|')) return '';
    return url
  }


  const _genericTextChars = {
    1: '\x20\xA0\u2000-\u200A\u202F\u205F\u3000',
    2: '\u200B-\u200D\u2060\uFEFF',
    4: '\u180E\u2800\u3164',
    8: '\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\u2800',
    16: '\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F\u2800\t\r\n' // plus tab (\x09), newline (\x0A), \r
  }
  const _genericTextREs = {
    1: new RegExp(`[${_genericTextChars[1]}]`, 'g'),
    2: new RegExp(`[${_genericTextChars[2]}]`, 'g'),
    4: new RegExp(`[${_genericTextChars[4]}]`, 'g'),
    8: new RegExp(`[${_genericTextChars[8]}]`, 'g'),
    16: new RegExp(`[${_genericTextChars[16]}]`, 'g')
  }
  function genericText(text, flag) {

    // https://unicode-explorer.com/articles/space-characters
    // https://medium.com/@ray102467/js-regex-3fbfe4d3115

    if (!text || typeof text !== 'string') return text;

    // regular space to space
    if (flag & 1) text = text.replace(_genericTextREs[1], (flag & (1 << 8)) ? '' : ' '); // 1 | 256

    // zero-width space to empty
    if (flag & 2) text = text.replace(_genericTextREs[2], '');

    // space chars to space
    if (flag & 4) text = text.replace(_genericTextREs[4], (flag & (1 << 8)) ? '' : ' '); // 4 | 1024

    // improper chars to empty
    if (flag & 8) text = text.replace(_genericTextREs[8], '');

    // improper+ chars to empty
    if (flag & 16) text = text.replace(_genericTextREs[16], '');

    return text;

  }

  const cssTextFn = () => `

  .r41-custom-search-input {
  font-size: 16px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease;
  }

  .r41-custom-search-input:focus {
  border-color: #007bff; /* Blue border on focus */
  outline: none;
  }

  .r41-loading-spinner {
  display: none;
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: r41-spin 2s linear infinite;
  margin-left: 4px;
  }

  @keyframes r41-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
  }

  .r41-custom-search-input-header{

  display: flex;
  flex-direction: row;
  align-items: center;

  }

  .r41-custom-search-input{
  opacity: 0;
  position:absolute;
  z-index:-1;
  }
  .r41-custom-search-input:focus{
  opacity: 1;
  position:relative;
  z-index:initial;
  }
  .r41-custom-search-input:focus + .r41-loading-spinner {

  margin-left: -34px;
  }



  `;

  let onloadPromise = Promise.resolve();

  function addElements() {


    if (!document.querySelector('#gf_390_lz')) {

      // Load LZ-String library
      const script = document.createElement('script');
      script.id = 'gf_390_lz';
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js';
      document.head.appendChild(script);

      onloadPromise = new Promise(resolve => {
        script.onload = resolve;
      });

    }


    if (!document.querySelector('#gf_391_style')) {

      const style = document.createElement('style');
      style.id = 'gf_391_style';
      style.textContent = cssTextFn();
      document.head.appendChild(style);
    }


    return onloadPromise;

  }


  const onReadyPromise = new Promise((resolve) => {

    document.addEventListener('DOMContentLoaded', resolve)


  });

  const delayedReady = onReadyPromise.then(() => {

    if (!location.href.includes('/users/')) return false;
    new Promise(resolve => setTimeout(resolve, 200))
  });




  const hookToFn = (w) => {


    let currentPageListHtml = '';
    const {sectionId, storagePrefix, listId,elementIdPrefix} = w;

    delayedReady.then(async (xt) => {

      if (xt === false) return;

      const h3 = document.querySelector(`#${sectionId}>header>h3`);
      if (h3) {

        const onloadPromise = addElements();

        let onload2 = onloadPromise.then((xt) => {
          if(xt === false) return;
          checkCache();
          cacheCurrentPageList();
        });

        h3.addEventListener('click', function () {
          clicked = true;
          onload2.then(() => {
            if ((getSelection() + "") === "" && h3.isConnected === true) {
              if (showInput(h3) === false) replaceWithInput(h3);
            }
          });
        });
      }


    });


    function checkCache() {

      let urls = sessionStorage.getItem(`${storagePrefix}urls`) || "";
      if (urls.includes(`|${fixURL(location.href)}|`)) return;
      for (const url of urls.split('|')) {
        if (!url) continue;
        sessionStorage.removeItem(`${storagePrefix}${url}`);
      }
      sessionStorage.removeItem(`${storagePrefix}urls`);

    }

    function cacheCurrentPageList() {

      const listElement = document.querySelector(`ol#${listId}`);
      if (listElement) {
        currentPageListHtml = listElement.outerHTML;
        saveCache(location.href, currentPageListHtml);
      }
    }

    let globalChangeCounter = 0;


    function showInput(h3Element) {

      const input = document.getElementById(`${elementIdPrefix}custom-search-input`)
      if (!input) return false;
      // input.value = h3Element.textContent;
      // input.id = `${elementIdPrefix}custom-search-input`;
      // input.classList.add('r41-custom-search-input')
      // h3Element.parentNode.classList.add(`${elementIdPrefix}custom-search-input-header`, 'r41-custom-search-input-header');
      // h3Element.parentNode.insertBefore(input, h3Element.nextSibling)
      // h3Element.parentNode.replaceChild(input, h3Element);
      input.select();
      // input.addEventListener('input', () => handleInputChange(input));

      // Add loading spinner (hidden by default)
      // const spinner = document.createElement('div');
      // spinner.id = 'loading-spinner';
      // input.parentNode.insertBefore(spinner, input.nextSibling);
    }

    function replaceWithInput(h3Element) {
      const input = document.createElement('input');
      // input.value = h3Element.textContent;
      input.id = `${elementIdPrefix}custom-search-input`;
      input.classList.add('r41-custom-search-input')
      h3Element.parentNode.classList.add(`${elementIdPrefix}custom-search-input-header`, 'r41-custom-search-input-header');
      h3Element.parentNode.insertBefore(input, h3Element.nextSibling)
      // h3Element.parentNode.replaceChild(input, h3Element);
      input.select();
      input.addEventListener('input', () => handleInputChange(input));

      // Add loading spinner (hidden by default)
      const spinner = document.createElement('div');
      spinner.classList.add('r41-loading-spinner')
      spinner.id = `${elementIdPrefix}loading-spinner`;
      input.parentNode.insertBefore(spinner, input.nextSibling);
    }
    let lastState = false;
    function setLoadingState(isLoading) {
      if (lastState === isLoading) return;
      const spinner = document.getElementById(`${elementIdPrefix}loading-spinner`);
      if (spinner) {
        spinner.style.display = isLoading ? 'inline-block' : 'none';
      }
      lastState = isLoading;
    }

  let busyCache = 0;

    async function handleInputChange(input) {
      const currentChangeCount = ++globalChangeCounter;
      if (busyCache === 0) {
        setLoadingState(true);
        await fetchAndCacheScripts();
        await new Promise(resolve => setTimeout(resolve, 140));
      } else if (busyCache === 1) {
        setLoadingState(true);
        await new Promise(resolve => setTimeout(resolve, 600));
      } else if (busyCache === 2) {
        setLoadingState(true);
        await new Promise(resolve => setTimeout(resolve, 140));
      }
      if (currentChangeCount === globalChangeCounter) {
        setLoadingState(true);
        const filteredResults = await fetchAndFilterScripts(input.value);
        updateCurrentList(filteredResults);
        setLoadingState(false);
      }
    }

    function saveCache(url, text) {
      url = fixURL(url);
      if (!url) return;
      text = LZString.compress(text || "");
      text = text || ""
      sessionStorage.setItem(`${storagePrefix}${url}`, text);
      sessionStorage.setItem(`${storagePrefix}urls`, (sessionStorage.getItem(`${storagePrefix}urls`) || "") + "|" + url + "|");

    }
    function restoreCache(url) {
      url = fixURL(url);
      if (!url) return;
      let text = LZString.decompress(sessionStorage.getItem(`${storagePrefix}${url}`) || "") || "";
      return text;

    }

    async function fetchAndCacheScripts() {
      if (busyCache > 0) return;
      busyCache = 1;
      const pages = Array.from(document.querySelectorAll(`#${sectionId} .pagination > a[href]`))
        .map(link => link.getAttribute('href'));


      let mMap = new Map();
      for (const url of pages) {
        mMap.set(fixURL(url), url)

      }


      for (const [fixedURL, pageURL] of mMap) {
        const page = pageURL;
        let url = fixedURL;
        if (url && !sessionStorage.getItem(`${storagePrefix}${url}`)) {
          const response = await fetch(page);
          const text = await response.text();
          console.log(123, Date.now(), page)
          saveCache(page, text);
        }
      }
      busyCache = 2;
    }



    async function fetchAndFilterScripts(inputValue) {
      inputValue = inputValue || '';
      inputValue = genericText(inputValue, 1 | 2 | 8);
      let pages = Array.from(document.querySelectorAll(`#${sectionId} .pagination > a[href]`))
        .map(link => link.getAttribute('href'));

      let mMap = new Map();
      for (const url of pages) {
        mMap.set(fixURL(url), url)

      }

      const allScripts = [];

      // Get current page's list from sessionStorage
      const currentPageHtml = restoreCache(location.href);
      const currentDoc = new DOMParser().parseFromString(currentPageHtml, 'text/html');
      filterScripts(currentDoc, inputValue || true, allScripts);
      for (const [fixedURL, pageURL] of mMap) {

        let page = pageURL;
        let pageHtml = restoreCache(page);
        if (!pageHtml) {
          const response = await fetch(page);
          const text = await response.text();
          console.log(456, Date.now(), page)
          saveCache(page, text);
          pageHtml = text;
        }

        const doc = new DOMParser().parseFromString(pageHtml, 'text/html');
        filterScripts(doc, inputValue || false, allScripts);

      }

      return allScripts;
    }

    function filterScripts(doc, inputValue, allScripts) {
      if (inputValue === false) return;
      const scripts = doc.querySelectorAll(`ol#${listId} li[data-script-id]`);
      scripts.forEach(li => {
        const html = getContentHTML(li, inputValue);
        if (html) allScripts.push(html);
      });
    }

    function getContentHTML(li, inputValue) {
      const name = genericText(li.querySelector('a.script-link[href]').textContent, 1 | 2 | 8);
      const description = genericText(li.querySelector('.script-description').textContent, 1 | 2 | 8);
      let text = name + `\n` + description;
      if (inputValue === true || text.toLowerCase().includes(inputValue.toLowerCase())) {
        return li.outerHTML;
      }
    }

    function updateCurrentList(filteredResults) {
      const list = document.querySelector(`ol#${listId}`);
      if (list) {
        list.innerHTML = filteredResults.join('');
      }
    }


  };

  hookToFn({
    listId: 'user-script-list',
    sectionId: 'user-script-list-section',
    storagePrefix: 'gF_7H8TV_',
    elementIdPrefix: 'gimoa-'
  });

  hookToFn({
    listId: 'user-unlisted-script-list',
    sectionId: 'user-unlisted-script-list-section',
    storagePrefix: 'gF_84IUu_',
    elementIdPrefix: 'jexsq-'
  });

  hookToFn({
    listId: 'user-library-script-list',
    sectionId: 'user-library-list-section',
    storagePrefix: 'gF_39rrO_',
    elementIdPrefix: 'm01xt-'
  });
