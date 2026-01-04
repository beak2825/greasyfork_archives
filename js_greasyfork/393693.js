// ==UserScript==
// @name         quickModalClosing
// @namespace    https://github.com/yegorgunko/shikme-tools
// @version      0.3
// @description  Close modal dialog by clicking outside of its content
// @author       Yegor Gunko
// @match        https://shikme.ru/
// @icon         https://shikme.ru/default_images/icon.png?v=1528136794
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393693/quickModalClosing.user.js
// @updateURL https://update.greasyfork.org/scripts/393693/quickModalClosing.meta.js
// ==/UserScript==
const quickModalClosing=()=>{document.addEventListener("click",t=>{t.target.classList.contains("modal_back")&&(t.target.style.display="none")})};document.addEventListener("DOMContentLoaded",void document.addEventListener("click",t=>{t.target.classList.contains("modal_back")&&(t.target.style.display="none")}),!1);