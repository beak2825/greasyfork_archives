// ==UserScript==
// @name              Prideless MDN
// @name:zh-CN        Prideless MDN
// @namespace         https://github.com/ZeroAurora
// @match             https://developer.mozilla.org/*
// @version           1.0
// @author            Whoever but not LGBTQIA+
// @description       Remove the pride from MDN
// @description:zh-CN 去除 MDN 的 Pride Month 宣传
// @homepageURL       https://github.com/ZeroAurora/UserJS-Prideless
// @license           WTFPL
// @grant             GM_addStyle
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/497122/Prideless%20MDN.user.js
// @updateURL https://update.greasyfork.org/scripts/497122/Prideless%20MDN.meta.js
// ==/UserScript==

const pridelessCSS = `
.logo .logo-m {
  fill: var(--text-link) !important;
}

.logo .logo-_ {
  fill: var(--text-link) !important;
}

.homepage-hero section p > span::after {
  height: 0 !important;
}
`;

function removePride() {
  const manifestoParent = document.querySelector(
    ".homepage-hero > section:nth-child(1) > p:nth-child(2)"
  );
  const mandala = document.querySelector(".mandala-container");
  if (mandala && mandala.classList.contains("pride")) {
    manifestoParent.innerHTML = `Documenting web technologies, including CSS, HTML, and JavaScript, since 2005.`;
    mandala.classList.remove("animate-colors");
    mandala.classList.remove("pride");
  }
}

GM_addStyle(pridelessCSS);
document.addEventListener("DOMContentLoaded", removePride);
