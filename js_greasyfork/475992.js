// ==UserScript==
// @name        Show printable FAQ after page load on GameFAQs
// @namespace   solarfl4re
// @supportURL https://github.com/solarfl4re/gamefaqs-printVersion-userscript/issues
// @match       https://gamefaqs.gamespot.com/*/*/faqs/*
// @license  MIT
// @grant       none
// @version     1.0
// @author      solar4lre
// @description Shows the text version of FAQ on GameFAQs after the page loads.
// @downloadURL https://update.greasyfork.org/scripts/475992/Show%20printable%20FAQ%20after%20page%20load%20on%20GameFAQs.user.js
// @updateURL https://update.greasyfork.org/scripts/475992/Show%20printable%20FAQ%20after%20page%20load%20on%20GameFAQs.meta.js
// ==/UserScript==

window.addEventListener("load", (e) => {
  make_printable()
})