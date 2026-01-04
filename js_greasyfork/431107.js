// ==UserScript==
// @name            Remove Text Fragment
// @name:ja         Text Fragmentの削除
// @namespace       https://greasyfork.org/users/783910
// @version         0.5.1
// @description     Remove Text Fragment from Google search result URLs
// @description:ja  Google検索結果のURLからText Fragmentを削除する
// @author          ysnr777
// @match           https://www.google.com/search?*
// @grant           none
// @license         WTFPL
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/431107/Remove%20Text%20Fragment.user.js
// @updateURL https://update.greasyfork.org/scripts/431107/Remove%20Text%20Fragment.meta.js
// ==/UserScript==

'use strict';

const targetQuery = "a[href*=':~:']";
const regex = /#:~:[^"]*/;
const observeId = 'center_col';

const removeFragment = target => {
  for (const el of target.querySelectorAll(targetQuery)) {
    el.href = el.href.replace(regex, '');
  }
};

removeFragment(document);

const observer = new MutationObserver((mutations, observer) => {
  for (const record of mutations) {
    for (const node of record.addedNodes) {
      removeFragment(node);
    }
  }
});
observer.observe(
  document.getElementById(observeId),
  {
    childList: true,
    subtree: true
  }
);
window.addEventListener('beforeunload', () => {
  observer.disconnect();
});
