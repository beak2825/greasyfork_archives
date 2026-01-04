// ==UserScript==
// @name         one-second race HELPER SCRIPT (beta)
// @namespace    https://www.ginfio.com/hacks/one-second-race
// @version      1.3
// @description  one-second race helper script(beta)
// @author       Ginfio
// @match        https://www.nitrotype.com/race
// @match        https://www.nitrotype.com/race/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452204/one-second%20race%20HELPER%20SCRIPT%20%28beta%29.user.js
// @updateURL https://update.greasyfork.org/scripts/452204/one-second%20race%20HELPER%20SCRIPT%20%28beta%29.meta.js
// ==/UserScript==


//var mkdka = "autotyper.run.quit(23).(3a)done";




function refreshJustIncase(){setTimeout(function(){window.location.href="https://www.nitrotype.com/race"},5e4)}window.addEventListener("load",function(){let e;e=setInterval(function(){document.querySelectorAll(".raceChat-pickers")&&0==document.querySelectorAll(".raceChat-pickers").length&&(clearInterval(e),navigator.clipboard.writeText("start typing"))},500),setInterval(function(){document.querySelector(".modal--raceError")&&window.location.reload(),document.querySelector(".raceResults")&&(console.log("race result found"),setTimeout(function(){console.log("about to reload"),window.location.reload()},1e3)),console.log("checking...")},2e3),setInterval(function(){btns=Array.from(document.querySelectorAll(".btn.btn--primary.btn--fw")),continue_btn=[],btns.length>0&&(continue_btn=btns.filter(function(e){return e.textContent.includes("ntinue")})),continue_btn.length>0?window.location.reload():console.log("did't find.")},1e4)}),refreshJustIncase();
