// ==UserScript==
// @name         Sankaku.app Ultimate
// @description  Removes all the ads and increases the browsing experience
// @namespace    Violentmonkey Scripts
// @author       Dyoxide
// @version      0.1.0
// @match        https://sankaku.app/*
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469877/Sankakuapp%20Ultimate.user.js
// @updateURL https://update.greasyfork.org/scripts/469877/Sankakuapp%20Ultimate.meta.js
// ==/UserScript==

const appDiv = document.querySelector("div#app");
let path = "";
let srch = "";

function contLoading(target, chCount) {
  return new Promise(resolve => {
    if(target?.childElementCount >= chCount) return resolve();

    new MutationObserver((rec, o) => {
      if(target.childElementCount < chCount) return;
      o.disconnect();
      resolve();
    }).observe(target, {childList: true});
  });
}

let scrollPos = 0;
let scrollTick = false;
function jumpingScroll(e) {
  const scrollEl = e.target;
  if(!scrollTick) {
    scrollTick = true;
    window.requestAnimationFrame(() => {
      if(scrollEl.scrollTop < scrollPos) scrollEl.scrollTo({ top: 0, behavior: 'smooth' });
      else if(scrollEl.scrollTop > scrollPos) scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' });

      scrollPos = scrollEl.scrollTop;
      scrollTick = false;
    });
  }
}

new MutationObserver(async function (rec, o) {
  if(window.location.pathname === path && window.location.search === srch) return;

  path = window.location.pathname;
  srch = window.location.search;

  if(path === "/") {
    await contLoading(appDiv, 2);
    appDiv.children[1].style.overflow = "hidden";

    let target = appDiv.children[1].firstElementChild;
    await contLoading(target, 3);
    target.children[1].style.display = "none";

    target = target.lastElementChild;
    await contLoading(target, 3);
    target.firstElementChild.style.display = "none";
  }

  let jumpTarget;
  if( path.includes("post/show") ) {
    jumpTarget = appDiv;
    await contLoading(jumpTarget, 2);

    jumpTarget = appDiv.children[1].children[0];
    await contLoading(jumpTarget, 1);

    jumpTarget = jumpTarget.firstElementChild;
    await contLoading(jumpTarget, 3);

    jumpTarget = jumpTarget.children[2];
    jumpTarget.addEventListener("scroll", jumpingScroll);

  } else jumpTarget?.removeEventListener("scroll", jumpingScroll);

}).observe(document.body, {childList: true, subtree: true, attributes: true});
