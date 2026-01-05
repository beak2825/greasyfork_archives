// ==UserScript==
// @name         FT chinese auto jump to full page
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  auto expand ft chinse page to full page
// @author       You
// @match        http://tampermonkey.net/index.php?ext=dhdg
// @grant        none
// @include      *.ftchinese.com*
// @downloadURL https://update.greasyfork.org/scripts/23885/FT%20chinese%20auto%20jump%20to%20full%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/23885/FT%20chinese%20auto%20jump%20to%20full%20page.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var loc = window.location.href;
    if (loc.indexOf("#s=d",0) != -1) {

        var jump_loc = loc.replace(/#s=d/,'?full=y');
        console.log("jump url is", jump_loc);
        window.location.href = jump_loc;
    }else if  (loc.indexOf("#s=w",0) != -1) {
        var jump_loc = loc.replace(/#s=w/,'?full=y');
        console.log("jump url is", jump_loc);
        window.location.href = jump_loc;
    }else if  (loc.indexOf("#s=n",0) != -1) {
        var jump_loc = loc.replace(/#s=n/,'?full=y');
        console.log("jump url is", jump_loc);
        window.location.href = jump_loc;
    }else if  (loc.indexOf("#s=p",0) != -1) {
        var jump_loc = loc.replace(/#s=p/,'?full=y');
        console.log("jump url is", jump_loc);
        window.location.href = jump_loc;
    }else if ((loc.indexOf("?",0)== -1) &&  (loc.indexOf("#",0)==-1)){
 
var jump_loc=loc+'?full=y';
console.log("jump url is ", jump_loc);
window.location.href=jump_loc;
}




    // Your code here...
})();