// ==UserScript==
// @name              Facebook 不要自動重新整理
// @description       抵抗臉書首頁（動態消息）自動重整的行為
// @version           1.2.0
// @license           MIT
// @author            bootleq
// @namespace         bootleq.com
// @homepageURL       https://github.com/bootleq/user-scripts
//
// @match             https://www.facebook.com/*
// @run-at            document-idle
// @grant             none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/498495/Facebook%20%E4%B8%8D%E8%A6%81%E8%87%AA%E5%8B%95%E9%87%8D%E6%96%B0%E6%95%B4%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/498495/Facebook%20%E4%B8%8D%E8%A6%81%E8%87%AA%E5%8B%95%E9%87%8D%E6%96%B0%E6%95%B4%E7%90%86.meta.js
// ==/UserScript==

const seconds = 1000;
const minutes = 60 * seconds;
const hours = 60 * minutes;

const gFeedStaleTimeout = 48 * hours; // 動態消息過期（隨後會自動重刷）的時間

const gLoadInterval = 10;         // 等待 FB 啟動（以符合預期條件）期間，重試間隔（毫秒）
const gLoadTimeout = 8 * seconds; // 等待 FB 啟動（以符合預期條件）的最大時間，超過就放棄執行功能
const gMessagePrefix = 'FB-R';    // 使用 console.log 時的固定訊息開頭，R for Refresh

const targetFBConstants = [
  'CometFeedStalenessConstantsEntryPointVariables',
  'CometFeedStalenessConstants',
]

// Although `@grant none` seems enough to access FB window directly,
// on Firefox we can't inject script to "page" due to CSP.
// That's why still need to try wrappedJSObject.
// https://github.com/violentmonkey/violentmonkey/issues/1001
const pageWin = ('wrappedJSObject' in window) ? window.wrappedJSObject : window;
let isHomeVisited = false;

const log = (...args) => {
  console.log(`[${gMessagePrefix}]`, ...args);
};

const waitFor = (condition, interval, timeout) => {
  return new Promise((resolve, reject) => {
    let startTime = Date.now();

    const id = setInterval(() => {
      log('Wait for FB init...');

      if (condition()) {
        clearInterval(id);
        resolve();
      }

      const elapsedTime = Date.now() - startTime;

      if (elapsedTime >= timeout) {
        clearInterval(id);
        reject();
      }
    }, interval);
  });
};

const hijackFunction = (fn, callback) => {
  const oldFn = exportFunction(fn, pageWin);

  function newFn (...args) {
    const result = oldFn.apply(this, args);
    callback();
    return result;
  }

  return exportFunction(newFn, pageWin);
};

// Detect the global function really named 'require'
const getRequireFunction = () => (typeof pageWin.require === 'function');

const delayFeedStale = () => {
  try {
    let varName = '';
    let m;

    for (let idx = 0; idx < targetFBConstants.length; idx++) {
      const name = targetFBConstants[idx];
      const required = pageWin.require(name);
      if (typeof required === 'object') {
        varName = name;
        m = required;
        break;
      }
    }

    if (
      typeof m !== 'object' ||
      typeof m.FEED_STALE_TIMEOUT !== 'number' ||
      typeof m.FEED_VISIBILITY_TIMEOUT !== 'number' ||
      typeof m.BADGE_STALE_TIMEOUT !== 'number'
    ) {
      throw new Error('Unexpected shape of FB constant');
    }

    const oldValue = JSON.stringify(m);
    m.FEED_STALE_TIMEOUT = gFeedStaleTimeout;
    m.FEED_VISIBILITY_TIMEOUT = gFeedStaleTimeout;
    // m.FEED_MAX_QUERY_AGE_IN_SEC = gFeedStaleTimeout;
    m.BADGE_STALE_TIMEOUT = gFeedStaleTimeout;
    log(`${varName} updated:\n  ${oldValue} =>\n  ${JSON.stringify(m)}.`);
  } catch (error) {
    showFailureMsg();
    log('delayFeedStale failed:', error);
  }
};

const onNavigate = () => {
  if (isHomeVisited) {
    return;
  }

  if (window.location.pathname === '/') {
    isHomeVisited = true;

    waitFor(getRequireFunction, gLoadInterval, gLoadTimeout).then(delayFeedStale);

    if ('navigation' in pageWin) {
      navigation.removeEventListener("navigatesuccess", onNavigate);
    } else {
      // Won't fix.
      // history `pushState` and `replaceState` hijack are not reversed
    }
  }
};

const watchNavigation = () => {
  if ('navigation' in pageWin) {
    navigation.addEventListener("navigatesuccess", onNavigate);
    return;
  }

  // Firefox only, see https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Sharing_objects_with_page_scripts#sharing_content_script_objects_with_page_scripts
  if (typeof exportFunction === 'function') {
    pageWin.history.pushState = hijackFunction(pageWin.history.pushState, onNavigate);
    pageWin.history.replaceState = hijackFunction(pageWin.history.replaceState, onNavigate);
  } else {
    log('Lack support of navigation watching event, aborted.')
  }
};

const showFailureMsg = () => {
  const $div = document.createElement('div');
  const style = {
    position: 'fixed', bottom: '1%', left: 0, padding: '0 12px 10px', margin: '6px',
    backgroundColor: 'rgba(245,222,179, .95)', cursor: 'pointer',
    borderRadius: '8px', boxShadow: '-3px -3px 6px gold, 3px 3px 6px red'
  };
  $div.innerHTML = `
    <p style='white-space: preserve-breaks; margin: 0'>
      UserScript「Facebook 不要自動重新整理」
      執行失敗，可能已經失效了。
    </p>
    <p>點擊以關閉訊息。</p>
  `;
  Object.assign($div.style, style);
  document.body.appendChild($div);
  $div.addEventListener('click', () => $div.remove());
};


onNavigate();

if (!isHomeVisited) {
  // Though auto-refresh only occur on News Feed,
  // watch navigation for case that enter "/" from other paths like "/help".
  watchNavigation();
}