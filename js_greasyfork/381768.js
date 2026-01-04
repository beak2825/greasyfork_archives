// ==UserScript==
// @name         gamersky block
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  cxk , 小米 红米，原神
// @author       7nc
// @match        https://www.gamersky.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381768/gamersky%20block.user.js
// @updateURL https://update.greasyfork.org/scripts/381768/gamersky%20block.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var aList = document.getElementsByTagName("a");
    var i = 0;
    for(i; i<aList.length;i++){
        var title = aList[i].title;
        if(title!=''){
            if(title.match(/蔡徐坤|小米|红米|华为|荣耀|原神/) != null){
                //console.log(aList[i].title);
                aList[i].remove();
            }
        }
    }

    // Your code here...
})();