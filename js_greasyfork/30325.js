// ==UserScript==
// @name         Change all pics on website to Rick Astley
// @version      1.1
// @description  Title
// @author       FlyingNeko
// @match        *://*/*
// @grant        none
// @namespace http://bato.to/forums/user/62089-flyingneko/
// @downloadURL https://update.greasyfork.org/scripts/30325/Change%20all%20pics%20on%20website%20to%20Rick%20Astley.user.js
// @updateURL https://update.greasyfork.org/scripts/30325/Change%20all%20pics%20on%20website%20to%20Rick%20Astley.meta.js
// ==/UserScript==

var rickCover = document.createElement("div");
rickCover.setAttribute("style", "background:url('https://media.giphy.com/media/LXONhtCmN32YU/giphy.gif'); opacity: 0.2; z-index:100; height:100%; width:100%; position:fixed; pointer-events:none");
rickCover.setAttribute("id", "bCover");
document.body.insertBefore(rickCover, document.body.firstChild);

rick = setInterval(function (){
    for (var i = 0; i < document.getElementsByTagName('img').length; i++) {
        if (document.getElementsByTagName('img')[i].src !== 'https://media.giphy.com/media/LXONhtCmN32YU/giphy.gif') {
            document.getElementsByTagName('img')[i].src = 'https://media.giphy.com/media/LXONhtCmN32YU/giphy.gif';
        }
    }
}, 1000);