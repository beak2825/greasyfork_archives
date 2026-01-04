// ==UserScript==
// @name Avoid Yandex Turbo
// @name:ru Обход Яндекс Турбо
// @description Redirect directly to target page avoiding Yandex Turbo
// @description:ru Переадресация на целевую страницу в обход Яндекс Турбо
// @namespace https://github.com/Autapomorph/userscripts
// @author Autapomorph
// @version 3.5.0
// @run-at document_start
// @match *://yandex.tld/*
// @match *://*.turbopages.org/*
// @supportURL https://github.com/Autapomorph/userscripts/discussions
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/411827/Avoid%20Yandex%20Turbo.user.js
// @updateURL https://update.greasyfork.org/scripts/411827/Avoid%20Yandex%20Turbo.meta.js
// ==/UserScript==

(function avoidYandexTurbo() {
  const checkIntervalMs = 1000;

  const domainRegex = {
    turbopages: /\.turbopages\.org/,
    yandex: /yandex\..+/,
  };

  function redirectWithTurboScript() {
    const turboScriptSelector = 'script[data-name="post-message"][data-message]';
    const turboScript = document.querySelector(turboScriptSelector);
    if (!turboScript) {
      return;
    }

    const dataMessage = turboScript.getAttribute('data-message');
    if (typeof dataMessage !== 'string') {
      return;
    }

    let redirectTo;
    try {
      const dataMessageJson = JSON.parse(dataMessage);
      if (dataMessageJson && dataMessageJson.originalUrl) {
        redirectTo = dataMessageJson.originalUrl;
      }
    } catch {
      return;
    }

    if (redirectTo) {
      top.location.replace(redirectTo);
    }
  }

  function redirectWithTurboOverlay() {
    const titleHostActive = document.querySelector('.turbo-overlay__title-host_active');
    if (!titleHostActive) return;

    const titleHostActiveText = titleHostActive.textContent;
    const hostLinks = document.querySelectorAll('a[data-sc-host]');
    for (let i = 0; i < hostLinks.length; i += 1) {
      const hostLink = hostLinks[i];
      let dataCounter;
      try {
        dataCounter = JSON.parse(hostLink.getAttribute('data-counter'));
      } catch {
        return;
      }

      if (dataCounter.find(e => e.indexOf(titleHostActiveText) > -1)) {
        let redirectTo;
        if (dataCounter[0] === 'b') {
          redirectTo = dataCounter[1];
        } else if (dataCounter[0] === 'w') {
          redirectTo = dataCounter[3];
        } else return;

        top.location.replace(redirectTo);
      }
    }
  }

  function redirectWithURLPathname(urlPathname) {
    const turboIndex = urlPathname.indexOf('/turbo/');
    const delimeterIndex = urlPathname.search(/\/(s|h)\//);
    const delimeterLength = 2;

    if (delimeterIndex < 0) return;

    const host =
      turboIndex === -1
        ? urlPathname.substring(1, delimeterIndex)
        : urlPathname.substring(turboIndex + '/turbo/'.length, delimeterIndex);
    const pathName = urlPathname.substring(delimeterIndex + delimeterLength);
    top.location.replace(`//${host}${pathName}`);
  }

  function redirectWithURLSearchParam(urlSearchParams) {
    const textQuery = urlSearchParams.get('text');
    if (textQuery) {
      top.location.replace(textQuery);
    }
  }

  function isTurboPage(urlHostname, urlPathname, urlSearchParams) {
    // Turbopages domain
    if (domainRegex.turbopages.test(urlHostname)) {
      return true;
    }

    // Yandex domains
    if (domainRegex.yandex.test(urlHostname) && urlPathname.includes('/turbo')) {
      if (/\.*\/(s|h)\/.*/.test(urlPathname)) {
        return true;
      }

      if (urlSearchParams.has('text')) {
        // Do not redirect Yandex Health Turbo inline
        if (domainRegex.yandex.test(urlSearchParams.get('text'))) {
          return false;
        }

        return true;
      }
    }

    return false;
  }

  function main() {
    const urlHostname = top.location.hostname;
    const urlPathname = top.location.pathname;
    const urlSearchParams = new URLSearchParams(top.location.search);

    if (!isTurboPage(urlHostname, urlPathname, urlSearchParams)) {
      return;
    }

    redirectWithTurboScript();
    redirectWithTurboOverlay();
    redirectWithURLPathname(urlPathname);
    redirectWithURLSearchParam(urlSearchParams);
  }

  if (typeof module === 'object' && module.exports) {
    module.exports = {
      avoidYandexTurbo,
      main,
      isTurboPage,
      redirectWithTurboScript,
      redirectWithTurboOverlay,
      redirectWithURLPathname,
      redirectWithURLSearchParam,
    };

    return;
  }

  let currentURLPathname = top.location.pathname;
  setInterval(() => {
    if (currentURLPathname !== top.location.pathname) {
      currentURLPathname = top.location.pathname;
      main();
    }
  }, checkIntervalMs);

  main();
})();
