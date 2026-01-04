// ==UserScript==
// @name         kimi css
// @description  Force code wrapping and unset chat message display
// @match        https://www.kimi.com/*
// @version 0.0.1.20250719072802
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/542619/kimi%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/542619/kimi%20css.meta.js
// ==/UserScript==

(function() {
  const style = document.createElement('style');
    style.textContent = `
*{
min-width: revert !important;
padding: revert !important;
}

.chat-editor-action {
display: revert !important;
}

.segment-avatar {
display: none !important;
}

.segment-assistant-actions, .segment-assistant-actions * {
gap: revert !important;
padding: revert !important;
}

.segment-assistant-actions-content {
/*display: revert !important;*/
}

.recommend-prompt-list {
display: none !important;
}

div:has(> svg.to-bottom-icon) {
    display: none !important;
}
        `;
  document.head.appendChild(style);
})();
