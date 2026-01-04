// ==UserScript==
// @name         fanfiction.net review deleter
// @description  adds delete buttons to your fanfiction.net reviews (need to be logged in)
// @author       Me
// @match        https://www.fanfiction.net/r/*
// @grant        none
// @version 0.0.1.20200302160610
// @namespace https://greasyfork.org/users/453019
// @downloadURL https://update.greasyfork.org/scripts/397219/fanfictionnet%20review%20deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/397219/fanfictionnet%20review%20deleter.meta.js
// ==/UserScript==

(function() {
Array.from(document.getElementsByTagName("span")).filter(a=>a.style.float===("right")).map(a=>{
    let reviewid = a.children[0].href.match(/rwid=(\d+)/)[1]	

	let button = document.createElement("img")
    button.href = "https://google.com"
    button.src = "https://ff74.b-cdn.net/static/ficons/delete.png"
	
    let buttonwrap = document.createElement("a")
    buttonwrap.href = "https://www.fanfiction.net/reviews/delete.php?action=delete&reviewid=" + reviewid

    a.appendChild(buttonwrap).appendChild(button)
})
})();