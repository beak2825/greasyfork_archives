// ==UserScript==
// @name             [SNOLAB] NPM Typescript Flag
// @namespace        https://userscript.snomiao.com/
// @version          0.1.7
// @description      Show "Dt" and "Ts" Icon on npm package search result.
// @author           snomiao@gmail.com
// @match            *://www.npmjs.com/search*
// @match            *://npmjs.com/search*
// @grant            none
// @contributionURL  https://snomiao.com/donate
// @supportURL       https://github.com/snomiao/userscript.js/issues
// @downloadURL https://update.greasyfork.org/scripts/479560/%5BSNOLAB%5D%20NPM%20Typescript%20Flag.user.js
// @updateURL https://update.greasyfork.org/scripts/479560/%5BSNOLAB%5D%20NPM%20Typescript%20Flag.meta.js
// ==/UserScript==

console.log("[SNOLAB] NPM Typescript Flag v0.1.5");
let lastFetch = 0;
let fails = 0;

const observer = new IntersectionObserver((entries) =>
  entries.forEach(async (entry) => {
    if (!entry.isIntersecting) return;
    while (!(await markPackage(entry.target)));
  })
);

async function markPackage(h3) {
  if (h3.ariaChecked) return true;
  // back-off retry
  const interval = 200;
  const wait = interval * 2 ** fails;
  const until = lastFetch + wait;
  while (+new Date() < until)
    await new Promise((r) => setTimeout(r, (until - +new Date()) / 2));
  lastFetch = +new Date();
  //
  const pathname = h3.parentElement.pathname;
  const response = await fetch(pathname, { cache: "force-cache" });
  if (response.status !== 200) {
    fails++;
    return false; // will try again later
  }
  fails /= 2; // find a balanced request rate

  const content = await response.text();
  const hasDt =
    content.match(
      '(?<="flex">)<img.*?This package has TypeScript declarations provided by.*?/>'
    )?.[0] ?? "";
  const hasTs =
    content.match(
      '(?<="true">)<img.*?This package contains built-in TypeScript declarations.*?/>'
    )?.[0] ?? "";
  h3.innerHTML = h3.innerText + " / " + hasDt + hasTs;
  console.log({ pathname, hasDt, hasTs });
  h3.ariaChecked = true;
  return true;
}

function $$(sel, el = document) {
  return [...el.querySelectorAll(sel)];
}

$$("a>h3").forEach(async (h3) => observer.observe(h3));
