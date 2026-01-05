// ==UserScript==
// @name        video ctrls
// @namespace   tag:URI
// @description always show controls
// @include     *
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26740/video%20ctrls.user.js
// @updateURL https://update.greasyfork.org/scripts/26740/video%20ctrls.meta.js
// ==/UserScript==

function func(){
    var d = document.getElementsByTagName("video"); 
    for (var i = 0; i < d.length; i++) {
        console.log(d[i].id);
        d[i].setAttribute("controls", "true");
    }
}

setTimeout(func(), 10);