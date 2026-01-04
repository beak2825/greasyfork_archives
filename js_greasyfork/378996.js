// ==UserScript==
// @name         豆瓣外链免确认
// @version      0.1
// @description  RT
// @author       BasedOnErimus
// @match        *www.douban.com/link2/?url=*
// @grant        none

// @namespace https://greasyfork.org/users/252933
// @downloadURL https://update.greasyfork.org/scripts/378996/%E8%B1%86%E7%93%A3%E5%A4%96%E9%93%BE%E5%85%8D%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/378996/%E8%B1%86%E7%93%A3%E5%A4%96%E9%93%BE%E5%85%8D%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var pAll = document.getElementsByTagName("p");
    for(var i=0;i<pAll.length;i++){
        if(pAll[i].innerHTML.indexOf("http")!=-1){
            window.location=pAll[i].innerHTML;
        }
    }
})();