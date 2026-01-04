// ==UserScript==
// @name         stepfun css
// @description  a
// @match        *://stepfun.ai/*
// @version 0.0.1.20251112161915
// @namespace https://greasyfork.org/users/1435046
// @downloadURL https://update.greasyfork.org/scripts/544679/stepfun%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/544679/stepfun%20css.meta.js
// ==/UserScript==

(function() {
  const style = document.createElement('style');
style.id = 'stepfunCssStyleId';

  style.textContent = `
body {
    background-color: revert !important;
}

div#root {
    box-shadow: inset 0 0 0 1px red;
}

.bg-gold {
    background-color: revert !important;
}

div[data-message-id="message"] > div > div > div:nth-of-type(2), #contentContainer > div:nth-of-type(3), div:has(> a[title="About StepFun"][href="https://www.stepfun.com/company"]), div:has(> button > div > svg.custom-icon-image-edit-new-outline) + div  {
    display: none !important;
}

div.flex-col-reverse:has(> div > div[data-message-id="message"]) {
    flex-direction: column !important;
}

:nth-child(even of div[data-message-id="message"]) > div > div > div > div:nth-of-type(1) {
    background-color: red;
    color: black;
}

div:has(> div[class*='duration-300 animate-slide-in'] > div[style*='url("/_next/static/media/invitation-card.68366090.png");'] > button > svg > path[d*='M36.3744 13.7469C36.9602 13.1612 36.9602 12.2114 36.3744 11.6256C35.7886']) {
    display: none !important;
}
  `;
  document.head.appendChild(style);
})();