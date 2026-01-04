// ==UserScript==
// @name         ipwebcam resize fix
// @namespace    http://lolno.com
// @version      0.1
// @description  for the pas one. my own use, probably not for you.
// @author       Dobby233Liu
// @match        *://*/browserfs.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384850/ipwebcam%20resize%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/384850/ipwebcam%20resize%20fix.meta.js
// ==/UserScript==

const $exists = function(s){
    return !(document.querySelectorAll(s).length <= 0);
};

const $obj = function(s){
    if(!$exists(s)) throw DOMException("Nonexist element/selector.");
    return (document.querySelectorAll(s).length == 1 ? document.querySelector(s) : document.querySelectorAll(s));
};

(function() {
    'use strict';

    window.onresize = function(e){
        document.body.style.overflow = "hidden";
        if(!$exists("#img1") && !$exists("#img2")) throw Error("!$exists('#img1') && !$exists('#img2'). That shouldn't happening.")
        if($exists("#img1")){
            $obj("#img1").width = window.innerWidth;
            $obj("#img1").height = window.innerHeight;
            $obj("#img1").onclick = null;
        }
        if($exists("#img2")){
            $obj("#img2").width = window.innerWidth;
            $obj("#img2").height = window.innerHeight;
            $obj("#img2").onclick = null;
        }
    };
    window.onresize();
})();