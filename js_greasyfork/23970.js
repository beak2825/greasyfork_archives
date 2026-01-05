// ==UserScript==
// @name         Force Remove Thairath Background Music
// @namespace    http://www.tummedia.com/
// @version      0.1
// @description  this script auto remove background music from thairath site
// @author       BonesBoom
// @match        http://*.thairath.co.th/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23970/Force%20Remove%20Thairath%20Background%20Music.user.js
// @updateURL https://update.greasyfork.org/scripts/23970/Force%20Remove%20Thairath%20Background%20Music.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var myList = document.getElementsByTagName("audio");
    for(var i=0;i<myList.length;i++){
        myList[i].remove();
    }
})();