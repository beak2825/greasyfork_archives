// ==UserScript==
// @grant             none
// @version           1.1.1
// @author            eye-wave
// @icon              https://raw.githubusercontent.com/eye-wave/greasy-fork/main/packages/fandom-debloat/assets/icon.svg
// @license           GPL-3.0+
// @description:de    Entfernt unnötige Elemente von der Fandom-Website und lässt nur das Wichtige übrig.
// @description:es    Elimina elementos innecesarios del sitio web de fandom, dejando solo lo importante.
// @description:fr    Supprime les éléments inutiles du site web de fandom, ne laissant que l'essentiel.
// @description:jp    ファンダムのウェブサイトから不必要な要素を削除し、重要なもののみを残します。
// @description:pl    Usuwa zbędne elementy ze strony fandomu, pozostawiając tylko to, co ważne.
// @description:ru    Удаляет ненужные элементы с веб-сайта фандома, оставляя только то, что важно.
// @name:de           fandom.com - Bloatware entfernen
// @name:es           fandom.com - Eliminar el software basura
// @name:fr           fandom.com - Supprimer les logiciels superflus
// @name:jp           fandom.com - お膨らみを取り除く
// @name:pl           fandom.com - Uprość UI
// @name:ru           fandom.com - Удаление ненужного программного обеспечения
// @name              fandom.com - Remove bloatware
// @namespace         fandom.com utils
// @match             https://*.fandom.com/*
// @description       Removes unnecessary elements from fandom website, leaving only what's important.
// @downloadURL https://update.greasyfork.org/scripts/493330/fandomcom%20-%20Remove%20bloatware.user.js
// @updateURL https://update.greasyfork.org/scripts/493330/fandomcom%20-%20Remove%20bloatware.meta.js
// ==/UserScript==
// src/window.js
window.ads = void 0;

// ../../utils/src/index.ts
function $(query) {
  return document.querySelectorAll(query);
}
function $s(query) {
  return document.querySelector(query);
}

// src/search.ts
function fixSearch() {
  const search = $s("a[title='Search']");
  if (search) {
    search.removeAttribute("data-tracking");
    search.onclick = function() {
      window.location.pathname = "/wiki/Special:Search";
    };
  }
}

// src/index.ts
var toResize = [".fandom-community-header__background", ".main-container"];
var massRemove = ["iframe", "link[as='script']", "meta", "script", "style:not([type='text/css'])"];
var removeListSingle = [
  ".bottom-ads-container",
  ".fandom-sticky-header",
  ".global-navigation",
  ".global-registration-buttons",
  ".notifications-placeholder",
  ".page__right-rail",
  ".page-side-tools",
  ".right-rail-wrapper",
  ".top-ads-container",
  ".unified-search__layout__right-rail",
  "#age-gate",
  "#featured-video__player-container",
  "#global-explore-navigation",
  "#p-views",
  "#WikiaBar",
  "#mixed-content-footer",
  "div>div[data-tracking-opt-in-overlay]",
  "footer"
];
removeBloatware();
function removeBloatware() {
  removeListSingle.forEach((q) => $s(q)?.remove());
  massRemove.forEach((q) => $(q).forEach((e) => e?.remove()));
  toResize.forEach((q) => $s(q)?.setAttribute("style", "width:100%;margin:0"));
}
removeExcessiveBodyClassNames();
function removeExcessiveBodyClassNames() {
  for (const c of document.body.classList) {
    if (c.includes("skin-fandom"))
      continue;
    document.body.classList.remove(c);
  }
}
function removeExcessiveHtmlAttrs() {
  document.documentElement.removeAttribute("class");
  document.documentElement.removeAttribute("dir");
  document.documentElement.removeAttribute("style");
}
new MutationObserver((mutationsList) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      removeBloatware();
      fixSearch();
    }
    if (mutation.type === "attributes") {
      removeExcessiveBodyClassNames();
      removeExcessiveHtmlAttrs();
    }
  }
}).observe(document.documentElement, {
  childList: true,
  subtree: true,
  attributes: true,
  attributeOldValue: true
});
