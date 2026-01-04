// ==UserScript==
// @name        show final score, log score over questions
// @namespace   Violentmonkey Scripts
// @match       https://hedgehogsvsfoxes.com/take-a-test/*
// @grant       none
// @version     1.1
// @author      anakojm
// @description 7/9/2025, 8:37:11 PM
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/542140/show%20final%20score%2C%20log%20score%20over%20questions.user.js
// @updateURL https://update.greasyfork.org/scripts/542140/show%20final%20score%2C%20log%20score%20over%20questions.meta.js
// ==/UserScript==


for (var i = 0; i < 20; i++) { // fuck it we patch anything that looks right
 document.querySelectorAll('script:not([src], [class], [id])')[i].innerHTML = document.querySelectorAll('script:not([src], [class], [id])')[i].innerHTML.replaceAll("console.log(a),", "") // for some reason the first 3 answers are logged
 document.querySelectorAll('script:not([src], [class], [id])')[i].innerHTML = document.querySelectorAll('script:not([src], [class], [id])')[i].innerHTML.replaceAll("o.fn.fullpage.moveSlideRight()", "console.log(a), o.fn.fullpage.moveSlideRight()")
 document.querySelectorAll('script:not([src], [class], [id])')[i].innerHTML = document.querySelectorAll('script:not([src], [class], [id])')[i].innerHTML.replaceAll('o(".arrowDown").click())', 'document.querySelector("div[class*=\\\"final_active\\\"]:has(div h2)").innerHTML = document.querySelector("div[class*=\\\"final_active\\\"]:has(div h2)").innerHTML.replace("</div>\\n\\t\\t\\t\\t", "\\n\\t\\t\\t\\t\\t<h3>score: " + a + "</h3>\\n\\t\\t\\t\\t\\t<p>scores range from -47 (very hedgehog) to 47 (very fox)</p>\\n\\t\\t\\t\\t</div>"), o(".arrowDown").click())')
}