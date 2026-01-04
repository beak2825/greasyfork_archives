// ==UserScript==
// @name         Trumpy2017!
// @namespace    https://github.com/trumpy2017/trumpy17/
// @version      0.4.20181210
// @description  Displays an icon next to users who frequently submit to or comment in /r/the_donald
// @author       https://github.com/trumpy2017
// @include     http://www.reddit.com/*
// @include     https://www.reddit.com/*
// @grant        none
// @require     //code.jquery.com/jquery-2.2.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/33031/Trumpy2017%21.user.js
// @updateURL https://update.greasyfork.org/scripts/33031/Trumpy2017%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.time("trumpy execution time");
var list = [];
var total = [];
    var trumpycount = 0
    var elmFoo = document.getElementsByClassName('author');
    var isThere = -1;
    for (var i = 0; i < elmFoo.length; i++){
        isThere = jQuery.inArray( elmFoo[i].innerHTML, list );
        if (isThere >= 0){
            trumpycount++;
            var commentcount = total[isThere];
            elmFoo[i].innerHTML = "TRUMPY!<img src=\"https://raw.githubusercontent.com/trumpyextension/trumpy/master/trump.gif\" title=\"" + commentcount + " comments\">" + elmFoo[i].innerHTML;
            isThere = -1;
        }
    }
    console.timeEnd("trumpy execution time");
    console.log("trumpy count: " + trumpycount);
})();

