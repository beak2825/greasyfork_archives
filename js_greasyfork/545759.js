// ==UserScript==
// @name                Oráculo Tweaks
// @namespace           zen
// @description         Improve oráculo for me
// @version             1.0.1
// @run-at              document-start
// @match               https://oraculo.ifoodxt.com.br/*
// @require             https://update.greasyfork.org/scripts/526417/1643812/USToolkit.js
// @grant               unsafeWindow
// @grant               GM_addStyle
// @license             GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/545759/Or%C3%A1culo%20Tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/545759/Or%C3%A1culo%20Tweaks.meta.js
// ==/UserScript==

const onElements = new UST.OnElements({ deep: true });

onElements.per("#justification", (element) => {
    if (element.value !== "") return;

    const justification = document.querySelector(".Description-sc-1dp8qcg-0 p");
    if (!justification?.innerText) return;

    const justificationText = justification.innerText.split(".")[0];
    element.value = `${justificationText}.`;
    element.focus();
});

document.addEventListener("click", (event) => {
    const confirmButton = event.target.closest('[type="submit"]');
    if (!confirmButton) return;

    const justification = document.querySelector("#justification");
    if (!justification?.value) return;

    navigator.clipboard.writeText(justification.value);
});

onElements.start();
