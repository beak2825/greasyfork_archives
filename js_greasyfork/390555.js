// ==UserScript==
// @name         jd only
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  只显示京东自营商品
// @author       heroin
// @match        https://list.jd.com/list.html*
// @match        https://search.jd.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390555/jd%20only.user.js
// @updateURL https://update.greasyfork.org/scripts/390555/jd%20only.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var list = document.getElementsByClassName("gl-warp clearfix")[0].children;
    var i = 0;
    for(i; i<list.length;i++){
        var item = list[i];
        var jd = item.children[0];
        var j = jd.children.length - 1;
        for (j;j>-1;j--){
            var subItem = jd.children[j];
            console.log( i +" ===========");
            if(subItem.className.indexOf("p-icons") > -1){
                if(subItem.children.length > 0){
                    var title = subItem.children[0].innerText;
                    console.log(title);

                    if('自营' != title){
                        item.style='display:none';
                    }
                }else{
                    item.style='display:none';
                    console.log("no p-icons");
                }
                break;
            }
        }

    }

})();