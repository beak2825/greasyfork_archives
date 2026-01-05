// ==UserScript==
// @name         BOD Style
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Jose Enrique Ayala Villegas
// @author       You
// @match        https://bod.bodmillenium.com/E2F-BIN/E2VCNR01.PGM
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23086/BOD%20Style.user.js
// @updateURL https://update.greasyfork.org/scripts/23086/BOD%20Style.meta.js
// ==/UserScript==

(function() {
    document.onselectstart = function(){ return false;};
    document.onmousedown = function(e){
        if(e.target.className == 'boxtecla'){
            e.target.firstChild.style.color = "yellow";
            e.target.style.backgroundColor = "green";
        } else if(e.target.className == 'boxtecla_txt'){
            e.target.parentNode.style.backgroundColor = "green";
            e.target.style.color = "yellow";
        }
    };
    document.onmouseup = function(e){
        if(e.target.className == 'boxtecla'){
            e.target.firstChild.style.color = "";
            e.target.style.backgroundColor = "";
        } else if(e.target.className == 'boxtecla_txt'){
            e.target.parentNode.style.backgroundColor = "";
            e.target.style.color = "";
        }
    };
    document.onmouseout = document.onmouseup;
})();