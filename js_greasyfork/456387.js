// ==UserScript==
// @name        SQLCoach Fixer
// @namespace   Violentmonkey Scripts
// @match       *://sqlcoach.informatik.hs-kl.de/*
// @grant       none
// @version     1.25
// @author      DJOetzi
// @license GPL-3.0-or-later; https://www.gnu.org/licenses/gpl-3.0.txt
// @description 10.12.2022, 12:58:58
// @downloadURL https://update.greasyfork.org/scripts/456387/SQLCoach%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/456387/SQLCoach%20Fixer.meta.js
// ==/UserScript==

document.querySelector('[value="SQL Überprüfen"]').addEventListener('click', function(){
  let cache = document.getElementById("query").value
  //console.log(cache)
  localStorage.setItem("sqlcoach_iocache", cache)
})

document.body.onload = function(){
  let handle = document.getElementById("query")
  handle.removeAttribute("type")
  handle.setAttribute("style", `@import url('https://fonts.cdnfonts.com/css/cascadia-code'); font-family: 'Cascadia Code', "consolas", sans-serif; border-radius: 5px;`)
  handle.setAttribute("spellcheck", "false")
  handle.outerHTML = handle.outerHTML.replace("input", "textarea")
  //console.log(localStorage.getItem("sqlcoach_iocache"))
  console.log("SQLCoach Fixer successfully loaded initial setup!")
}

window.addEventListener('load', function() {
    document.getElementById("query").innerHTML = localStorage.getItem("sqlcoach_iocache")
}, false);

let syntaxFixer = function(){
  let tmp = document.getElementById("query")
  if(tmp.innerHTML.includes(";"))
    tmp.innerHTML = tmp.innerHTML.replace(";", " ")
}

document.querySelector('[value="SQL Überprüfen"]').onmouseover = syntaxFixer;
document.querySelector('[value="SQL Überprüfen"]').onmousedown = syntaxFixer;