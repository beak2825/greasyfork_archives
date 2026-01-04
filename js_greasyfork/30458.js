// ==UserScript==
// @name        Youku HTML5
// @version     0.2
// @match       http*://v.youku.com/v_show/*
// @description Watch video at Youku with HTML5
// @Grant       https://steamcn.com/t278849-1-1
// @namespace https://greasyfork.org/users/14488
// @downloadURL https://update.greasyfork.org/scripts/30458/Youku%20HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/30458/Youku%20HTML5.meta.js
// ==/UserScript==
 
(function() {
    window.sessionStorage.setItem("P_l_h5", true);
    url = location.href;
    var times = url.split("?");
    if(times[times.length-1] != 1){
        url += "?1";
        self.location.replace(url);
    }
})();