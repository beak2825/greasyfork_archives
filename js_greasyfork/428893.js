// ==UserScript==
// @name         google autoclick first result (feeling lucky copycat)
// @namespace    https://greasyfork.org/en/users/662873-birculomon
// @version      1.1
// @description  just do a search and add ... to it and the script will click the first result, good way to have feeling lucky when searching via a browser searchbar
// @author       birculomon
// @include        /^https://www.google.*/search?.*q=.*/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428893/google%20autoclick%20first%20result%20%28feeling%20lucky%20copycat%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428893/google%20autoclick%20first%20result%20%28feeling%20lucky%20copycat%29.meta.js
// ==/UserScript==

function TM_getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}


(function() {
    'use strict';
    if (window.performance && window.performance.navigation.type === window.performance.navigation.TYPE_BACK_FORWARD) {
    return;
    }

    var query = TM_getUrlVars().q.replace(/\+/g," ");
    if (query.includes("...")){
        try {
        location.href = document.getElementById("search").getElementsByTagName("a")[0].href
        } catch (e) {
            try {
                location.href = document.querySelectorAll("#rso a[class]")[0].href
            } catch (e) {

            }
        }


    }



})();