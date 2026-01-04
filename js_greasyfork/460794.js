// ==UserScript==
// @name        Wykop Profile Link
// @description	Robi zwykły link z przycisku profilu w headerze wykopu. Menu pojawia się poprzez samo najechanie na przycisk profilu.
// @version     1.0
// @author      look997
// @include     https://wykop.pl/*
// @homepageURL https://wykop.pl/ludzie/addons/look997/
// @namespace   https://wykop.pl/ludzie/addons/look997/
// @grant       none
// @run-at      document-end
// @icon        https://www.google.com/s2/favicons?domain=wykop.pl
// @icon64      https://www.google.com/s2/favicons?domain=wykop.pl
// @downloadURL https://update.greasyfork.org/scripts/460794/Wykop%20Profile%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/460794/Wykop%20Profile%20Link.meta.js
// ==/UserScript==

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


let oldHref = document.location.href;

const bodyList = document.querySelector("body");
const observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    if (oldHref !== document.location.href) {
      oldHref = document.location.href;
      // console.log("Wykop Script Tester - test 1");
      run();
    }
  });
});
const config = {
  childList: true,
  subtree: true
};
observer.observe(bodyList, config);
run();

async function run () {
  // console.log("Wykop Script Tester - test 1");

  await sleep(100);

  const profileEl = document.querySelector(".account");

  if (!profileEl) { return; }
  const pEl = profileEl;
  pEl.addEventListener("mouseenter", async ()=>{
    // console.log("me a",profileEl.classList.contains("active"));
    if (profileEl.classList.contains("active")===false) {
    // console.log("me b");
      const menuEl = profileEl.querySelector(":scope > .dropdown-body");
      // console.log("menuEl",menuEl);
      menuEl.setAttribute("style", "top: 34px;");
      // menuEl.style.top = "34px";
      profileEl.click();
      // await sleep(100);
      addA();
    // console.log("me c");
    //   profileEl.addEventListener("click", open);
    // // console.log("me d");
    //   profileEl.addEventListener("mouseup", openNew);
    }
  });
  pEl.addEventListener("mouseleave", ()=>{
    if (profileEl.classList.contains("active")===true) {
      // profileEl.removeEventListener("click", open);
      // profileEl.removeEventListener("mouseup", openNew);
      removeA();
      profileEl.click();
      const menuEl = profileEl.querySelector(":scope > .dropdown-body");
      menuEl.removeAttribute("style");
    }
  });
  function addA () {
    profileEl.querySelector(":scope > a").href = profileEl.querySelector(":scope > a > a").href;
  }
  function removeA () {
    profileEl.querySelector(":scope > a").removeAttribute("href");
  }



}