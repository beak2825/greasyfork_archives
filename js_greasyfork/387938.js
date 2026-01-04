// ==UserScript==
// @name         website name changer
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  Change a website name to whatever you want! (not the url, just the title)
// @author       twarped
// @match        http*://*/*
// @exclude      docs.google.com/*/*
// @exclude      sites.google.com/*/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387938/website%20name%20changer.user.js
// @updateURL https://update.greasyfork.org/scripts/387938/website%20name%20changer.meta.js
// ==/UserScript==
var changerbutton = document.createElement("button")
changerbutton. innerHTML = "Change Website Title"
var button = document.getElementsByTagName("body")[0]
button.appendChild(changerbutton)
changerbutton.addEventListener("click",function(){
var title = prompt("Change Website title to","")
if(title != null){
document.title = title
}

})
