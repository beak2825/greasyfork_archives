// ==UserScript==
// @name         potato
// @namespace    http://tampermonkey.net/
// @version      0.69
// @description  nice
// @author       Error404
// @match        https://www.google.com/?safe=active&ssui=on
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447152/potato.user.js
// @updateURL https://update.greasyfork.org/scripts/447152/potato.meta.js
// ==/UserScript==

document.getElementsByClassName("lnXdpd")[0].setAttribute("srcset","https://www.macmillandictionary.com/external/slideshow/full/141151_full.jpg")
document.getElementsByClassName("gb_d")[0].remove()
document.getElementsByClassName("gb_d")[0].innerText = "Potato";
document.getElementsByClassName("FPdoLc lJ9FBc")[0].remove()
document.getElementsByClassName("vcVZ7d")[0].remove()
document.getElementsByClassName("MV3Tnb")[0].remove()
document.getElementsByClassName("MV3Tnb")[0].remove()
document.getElementsByClassName("o3j99 c93Gbe")[0].remove()
document.getElementsByTagName("title")[0].innerText = "Potato";
document.body.style.backgroundImage = 'url("https://cdn.mos.cms.futurecdn.net/iC7HBvohbJqExqvbKcV3pP.jpg")'