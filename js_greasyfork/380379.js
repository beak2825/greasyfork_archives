// ==UserScript==
// @name Brainly - nieskończone darmowe odpowiedzi
// @description:pl Darmowe nieskończone wyświetlanie odpowiedzi w brainly.pl
// @namespace nullby
// @author KubaWojciechowski
// @match https://brainly.pl/*
// @grant unsafeWindow
// @grant GM_addStyle
// @version 0.0.1.20191001203754
// @description Darmowe nieskończone wyświetlanie odpowiedzi w brainly.pl
// @downloadURL https://update.greasyfork.org/scripts/380379/Brainly%20-%20niesko%C5%84czone%20darmowe%20odpowiedzi.user.js
// @updateURL https://update.greasyfork.org/scripts/380379/Brainly%20-%20niesko%C5%84czone%20darmowe%20odpowiedzi.meta.js
// ==/UserScript==

let ldb = {};
for (var i = 0; i < localStorage.length; i++){ // enumerate over localstorage and create a local copy
    ldb[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
}

unsafeWindow.localStorage.getItem = (item)=>{
  return item == 'flexible-funnel-previews' ? '[]' : ldb[item]; // return a value from local copy of localstorage or a hardcoded value
};

// Kill banners and ads 
GM_addStyle(`
  .js-react-bottom-banner {
    display: none !important;
  }
  .brn-ads-box {
    display: none !important;
  }
  .brn-brainly-plus-box {
    display: none !important;
  }
`);