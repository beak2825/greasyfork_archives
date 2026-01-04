// ==UserScript==
// @name        leetcode-links
// @description Add link buttons for leetcode.com
// @namespace   github.com/gino20
// @require     https://unpkg.com/react@17/umd/react.development.js
// @require     https://unpkg.com/react-dom@17/umd/react-dom.development.js
// @resource    tailwind https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css
// @match       https://leetcode.com/*
// @version     0.1.0
// @homepage    https://github.com/gino20/leetcode-links#readme
// @author      gino20
// @license     ISC
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/436155/leetcode-links.user.js
// @updateURL https://update.greasyfork.org/scripts/436155/leetcode-links.meta.js
// ==/UserScript==
(function () {
  'use strict';

  var identifier;
  (function (identifier) {
      identifier[identifier["LeetcodeTitle"] = 0] = "LeetcodeTitle";
  })(identifier || (identifier = {}));
  const elements = new Map([
      [
          identifier.LeetcodeTitle,
          () => {
              var _a;
              return (_a = document
                  .querySelector('#discuss-container')) === null || _a === void 0 ? void 0 : _a.querySelector("[class*='header']");
          },
      ],
  ]);
  const tailwind = window.GM_getResourceText('tailwind');
  window.GM_addStyle(tailwind);
  new MutationObserver(callback).observe(document, {
      childList: true,
      subtree: true,
  });
  function callback(mutations, observer) {
      var _a;
      if ((_a = elements.get(identifier.LeetcodeTitle)) === null || _a === void 0 ? void 0 : _a()) {
          main();
          observer.disconnect();
      }
  }
  function main() {
      addLinkButton();
  }
  function addLinkButton() {
      var _a;
      const el = (_a = elements.get(identifier.LeetcodeTitle)) === null || _a === void 0 ? void 0 : _a();
      const linkButton = document.createElement('a');
      linkButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
  </svg> leetcode-cn`;
      linkButton.className =
          'bg-yellow-600 hover:bg-yellow-500 text-white hover:text-white w-32 rounded-md flex whitespace-nowrap items-center justify-center';
      const url = new URL(window.location.href);
      url.hostname = 'leetcode-cn.com';
      linkButton.href = url.href;
      linkButton.target = '_blank';
      el === null || el === void 0 ? void 0 : el.append(linkButton);
  }

})();
//# sourceMappingURL=user.js.map
