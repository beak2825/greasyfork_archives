// ==UserScript==
// @name        Brainly sem restrições
// @match       https://brainly.com.br/*
// @grant       none
// @version     1.2
// @author      -
// @description Utilize o Brainly sem precisar pagar ou assistir videos de anúncios.
// @run-at document-start
// @grant GM.addStyle
// @namespace https://greasyfork.org/users/791628
// @downloadURL https://update.greasyfork.org/scripts/443659/Brainly%20sem%20restri%C3%A7%C3%B5es.user.js
// @updateURL https://update.greasyfork.org/scripts/443659/Brainly%20sem%20restri%C3%A7%C3%B5es.meta.js
// ==/UserScript==

GM.addStyle(`
.js-react-bottom-banner, 
.js-react-brainly-plus-box-aside, 
.sg-overlay, 
.brn-cookie-policy-wrapper, 
.section--3Yobl,
.js-react-registration-toplayer,
.brn-blocker-box{
  display: none !important;
}
 
.brn-qpage-layout--aligned, .brn-qpage-layout {
  grid-template-columns: 700px;
}
`);
 
localStorage.setItem("flexible-funnel-last-access-data", 0);
localStorage.setItem("flexible-funnel-cycle-start", 0);

window.addEventListener("load", () => {
  document.querySelector("body").classList.value = ""
  setTimeout(() => {
    document.querySelector("body").classList.value = ""
  }, 5000)
})