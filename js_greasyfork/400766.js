// ==UserScript==
// @name         屏蔽知乎私信提醒
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       You
// @match        http://*.zhihu.com/*
// @match        https://*.zhihu.com/*
// @grant        none
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/400766/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E7%A7%81%E4%BF%A1%E6%8F%90%E9%86%92.user.js
// @updateURL https://update.greasyfork.org/scripts/400766/%E5%B1%8F%E8%94%BD%E7%9F%A5%E4%B9%8E%E7%A7%81%E4%BF%A1%E6%8F%90%E9%86%92.meta.js
// ==/UserScript==

(function () {
  var titleRegexp = /^\(.*?\)/;
  var documentTitle = document.querySelector('head > title');
  var messageDom = document.querySelector('.AppHeader');

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      console.log('documentTitle changed:', mutation.target.textContent);
      try {
        setTimeout(function () {
          if (titleRegexp.test(mutation.target.textContent)) {
            document.title = document.title.replace(titleRegexp, '');
            var badgeDom = messageDom.querySelector('.AppHeader-messages div');
            badgeDom.style.display = 'none';
          }
        }, 50);
      } catch (error) {
        console.log('[debug]: error', error);
      }
    });
  });
  observer.observe(documentTitle, {
    subtree: true,
    characterData: true,
    childList: true,
  });

  var observer2 = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      console.log('messageDom changed:', mutation.target);
      try {
        var isMessageReceived =
          mutation.target.classList &&
          [...mutation.target.classList].indexOf('AppHeader-messages') >= 0;
        if (isMessageReceived) {
          setTimeout(() => {
            var badgeDom = messageDom.querySelector('.AppHeader-messages div');
            badgeDom.style.display = 'none';
            document.title = document.title.replace(titleRegexp, '');
          }, 50);
        }
      } catch (error) {
        console.log('[debug]: error', error);
      }
    });
  });
  observer2.observe(messageDom, {
    subtree: true,
    characterData: true,
    childList: true,
  });
})();
