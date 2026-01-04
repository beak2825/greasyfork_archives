// ==UserScript==
// @name        GreasyFork: Check Install Button Availability
// @namespace   Violentmonkey Scripts
// @match       https://greasyfork.org/*
// @grant       none
// @version     0.1.2
// @author      CY Fung
// @description 12/20/2023, 5:19:09 PM
// @run-at document-start
// @inject-into page
// @unwrap
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/482728/GreasyFork%3A%20Check%20Install%20Button%20Availability.user.js
// @updateURL https://update.greasyfork.org/scripts/482728/GreasyFork%3A%20Check%20Install%20Button%20Availability.meta.js
// ==/UserScript==

(() => {
  let doneURL = null;
  function onReady() {
    if (doneURL === location.pathname) return;
    doneURL = location.pathname;

    for (const button of document.querySelectorAll('a.install-link[href]')) {

      const href = button.href;

      if (/\.js[^-.\w\d\s:\/\\]*$/.test(href)) {
        const m = /^(https\:\/\/(greasyfork|sleazyfork)\.org\/[_-\w\/]*scripts\/(\d+)[-\w%]*)(\/|$)/.exec(location.href)


        if (m && m[3] && href.includes('.user.js')) {

          button.style.opacity = 0.72;
          const href = `https://${location.hostname}/scripts/${m[3]}-fetching/code/${crypto.randomUUID()}.user.js?version_=${Date.now()}`
          // console.log(href)
          fetch(href, {
            method: "GET",
            cache: 'reload',
            redirect: "follow"
          }).then((res) => {
            if (res.status === 200 && res.ok) {
              button.style.opacity = 1;
            } else {
              button.style.opacity = 0.45;
            }
            console.debug('code url reloaded', href);
          }).catch((e) => {
            button.style.opacity = 0.45;
            console.debug(e);
          });
        }


      }



    }
  }

  if (document.readyState !== 'loading') {
    onReady();
  } else {
    document.addEventListener('DOMContentLoaded', onReady, false);
  }
})();
