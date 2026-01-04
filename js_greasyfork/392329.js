// ==UserScript==
// @name         CC Generator By Jacqueb
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392329/CC%20Generator%20By%20Jacqueb.user.js
// @updateURL https://update.greasyfork.org/scripts/392329/CC%20Generator%20By%20Jacqueb.meta.js
// ==/UserScript==

setInterval(function() {start()},1000);
function start() {
    if(document.getElementById('ccstuff') == null) {var ccheight = document.getElementById("player-container-outer").clientHeight;
                                                    var ccwidth = document.getElementById("player-container-outer").clientWidth;
                                                    document.getElementById("player-container-outer").innerHTML="<iframe id='ccstuff' src='https://www.nitrxgen.net/youtube_cc/" + document.location.href.split("www.youtube.com/watch?v=")[1].split("&feature")[0] + "/0.txt' width='"+ ccwidth + "' height='" + ccheight + "'>"
                                                   }
}