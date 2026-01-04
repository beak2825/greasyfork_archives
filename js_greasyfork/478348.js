// ==UserScript==
// @name         WME Iron Swords Signature
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a signature to every comment you post
// @author       Israel
// @match        https://*.waze.com/*editor*
// @match        https://waze.com/*editor*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=waze.com
// @license      None. Feel free to do whatever you want.
// @downloadURL https://update.greasyfork.org/scripts/478348/WME%20Iron%20Swords%20Signature.user.js
// @updateURL https://update.greasyfork.org/scripts/478348/WME%20Iron%20Swords%20Signature.meta.js
// ==/UserScript==

const BLANK_LINES = 2;
const SIGNATURE = '🇮🇱 ביחד ננצח 🇮🇱';


async function init() {
  const BLANK_LINES_CONTENT = new Array(BLANK_LINES).fill('\n').join('');
  const FULL_SIG = BLANK_LINES_CONTENT + SIGNATURE;
  
  function mockImplementation(object, fnName, handler) {
    const originalFunction = object[fnName];
    object[fnName] = function(...args) {
      return handler(args, originalFunction);
    }
  }

  function mockFetchRequest(url, handler) {
    mockImplementation(unsafeWindow, 'fetch', ([resource, ...restArgs], originalFetch) => {
      if (resource instanceof Request) {
        const rurl = new URL(resource.url);
        if (rurl.pathname === url) {
          const newArgs = handler(resource, ...restArgs);
          return originalFetch.apply(unsafeWindow, newArgs);
        }
      }
      return originalFetch.call(unsafeWindow, resource, ...restArgs);
    });
  }

  mockImplementation(unsafeWindow, 'Request', ([url, opts, ...rest], originalRequest) => {
    try {
      const rurl = new URL(url);
      if (rurl.pathname === unsafeWindow.W.Config.paths.updateRequestComments) {
        const origText = opts.body.get('text');
        if (!origText.endsWith(SIGNATURE)) opts.body.set('text', origText + FULL_SIG);
      }
    }
    finally {
      return new originalRequest(url, opts, ...rest);
    }
  });

  // mockFetchRequest(unsafeWindow.W.Config.paths.updateRequestComments, (request, ...otherArgs) => {
  //   console.log(args);
  // })
};

if (unsafeWindow.W?.userscripts?.state.isInitialized) {
  init();
} else {
  document.addEventListener("wme-initialized", init, {
    once: true,
  });
}
