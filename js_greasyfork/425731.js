// ==UserScript==
// @name         </> Kurt & Java Otomatik Pet Yükseltici Ve Can Doldurucu
// @namespace    http://tampermonkey.net/
// @version      28.1
// @description  Kurt & Java
// @author       Kurt
// @match        http://zombs.io/
// @grant        Ryan Wolf
// @downloadURL https://update.greasyfork.org/scripts/425731/%3C%3E%20Kurt%20%20Java%20Otomatik%20Pet%20Y%C3%BCkseltici%20Ve%20Can%20Doldurucu.user.js
// @updateURL https://update.greasyfork.org/scripts/425731/%3C%3E%20Kurt%20%20Java%20Otomatik%20Pet%20Y%C3%BCkseltici%20Ve%20Can%20Doldurucu.meta.js
// ==/UserScript==

 !function(){const e=e=>new Promise((t,c)=>{try{setTimeout(t,e)}catch(e){c(e)}});let t=document.createElement("script");t.src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js",document.body.appendChild(t),e(1e3).then(()=>{let t=document.createElement("script");t.src="https://cdn.jsdelivr.net/gh/uzairfarooq/arrive/minified/arrive.min.js",document.body.appendChild(t),e(1e3).then(()=>{$(document).arrive(".hud-shop-actions-revive",function(e){$(this)[0].click()}),$(document).arrive(".hud-shop-actions-evolve",function(e){$(this)[0].click()})})})}();