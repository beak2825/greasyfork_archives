// ==UserScript==
// @name        yomichan lookup history
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @version     11.0
// @license MIT
// @author      grumpythomas
// @description 15/02/2023, 20:13:58
// @require https://cdn.jsdelivr.net/npm/get-selection-more@1.1.0/dist/get-selection-more.umd.js
// @downloadURL https://update.greasyfork.org/scripts/460151/yomichan%20lookup%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/460151/yomichan%20lookup%20history.meta.js
// ==/UserScript==
const dbKey = 'yomichan-lookup-history';
const maxTextSize = 24;
const maxSentenceSize = 58;
function isTrusted() {
  const host = window.location.host;
  if (host === 'therealgrumpythomas.github.io') {
    return true;
  }

  if (host.startsWith('localhost:')) {
    return true;
  }

  return false;
}

function run() {
  if (isTrusted()) {
    unsafeWindow.getLookups = function () {
      return getData();
    }

    unsafeWindow.importLookups = function (data) {
      setData(data);
    }
  }

  window.addEventListener('message', function (e) {
    if (!isTrusted()) {
      return;
    }

    if (e.data === 'resetYomichanHistory') {
      GM_deleteValue(dbKey);
    }

    if (e.data === 'optimizeYomichanHistory') {
      data = getData();
      data.lookups = data.lookups.reduce((acc, lookup) => {
        if (lookup.text.length > maxTextSize) {
          return acc;
        }

        acc.push(lookup);
        return acc;
      }, []);
      setData(data);
    }

    if (e.data.indexOf('normalizeYomichanHistory') > -1) {
      const match = e.data.match(/--(.*)--\+\+(.*)\+\+/);
      if (match.length === 3) {
        const before = match[1];
        const after = match[2];
        data = getData();
        data.lookups = data.lookups.reduce((acc, lookup) => {
          if (lookup.text === before) {
            lookup.text = after;
            lookup.updated = Date.now();
          }

          acc.push(lookup);
          return acc;
        }, []);
        setData(data);
      }
    }

    if (e.data.indexOf('deleteYomichanHistoryItem') > -1) {
      let [_e, ...textToDelete] = e.data.split(':');
      textToDelete = textToDelete.join(':').trim();
      data = getData();
      data.lookups = data.lookups.reduce((acc, lookup) => {
        if (lookup.text !== textToDelete) {
          acc.push(lookup);
        }
        return acc;
      }, []);
      setData(data);
    }
  });

  document.addEventListener('selectionchange', debounce(() => {
    if (!window.getSelection) {
      return;
    }

    const selectedText = window.getSelection()?.toString()?.trim();
    if (!selectedText?.length || !containsJapanese(selectedText)) {
      return;
    }

    if (window.location.href.toLowerCase().indexOf('grumpythomas') > -1) {
      return;
    }

    let sentence = getSelectionMore.getSentenceFromSelection(window.getSelection());
    if (sentence && sentence.length >= maxSentenceSize) {
      sentence = undefined;
    }

    if (sentence) {
      sentence = sentence.replaceAll(selectedText, '<em>' + selectedText + '</em>');
    }
    insertRow(selectedText, document.title, sentence);
  }, 600));
}

function initData() {
  return {
    created: Date.now(),
    lookups: [],
    sources: []
  };
}

function getData() {
  let rawData;
  try {
    rawData = GM_getValue(dbKey);
  } catch {
    return;
  }

  if (!rawData) {
    return;
  }

  rawData.sources = rawData.sources || [];
  return JSON.parse(rawData);
}

function insertRow(lookup, source, sentence) {
  const data = getData() || initData();
  if (lookup.length > maxTextSize) {
    return;
  }

  const dbLookup = {
    text: lookup,
    created: Date.now(),
    updated: undefined
  };
  let dbSourceId = data.sources.findIndex(s => s.label === source);
  if (dbSourceId === -1) {
    dbSourceId = data.sources.push({ label: source })
  }

  dbLookup.sourceId = dbSourceId;
  dbLookup.sentence = sentence;
  data.lookups.push(dbLookup);
  setData(data);
  return data;
}

function setData(data) {
  GM_setValue(dbKey, JSON.stringify(data));
}

function debounce(func, timeout) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

function containsJapanese(text) {
  if (!text) {
    return false;
  }

  return text.match(/[\u0100-\uffff]+/) !== null;
}

function mergeImport(oldData, newData) {

}

// testing
if (module && module.exports) {
  module.exports = {
    containsJapanese: containsJapanese
  };
} else {
  // in browser
  (function () {
    run();
  })();
}