// ==UserScript==
// @name         c h a n g e  t i t l e
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403767/c%20h%20a%20n%20g%20e%20%20t%20i%20t%20l%20e.user.js
// @updateURL https://update.greasyfork.org/scripts/403767/c%20h%20a%20n%20g%20e%20%20t%20i%20t%20l%20e.meta.js
// ==/UserScript==

function run(){
	document.getElementsByTagName("TITLE")[0].text ="...."

}


run();