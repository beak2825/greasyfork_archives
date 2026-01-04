// ==UserScript==
// @name         Show Profiler in forum
// @version      1.1
// @description  Tool to go to the profiler of a user from that user's comments in the forum
// @author       A Meaty Alt
// @include      /fairview\.deadfrontier\.com\/onlinezombiemmo\/index\.php\?topic=/
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/32856/Show%20Profiler%20in%20forum.user.js
// @updateURL https://update.greasyfork.org/scripts/32856/Show%20Profiler%20in%20forum.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var commonLink = "http://www.dfprofiler.com/profile/view/";
    function appendProfilerLink(container){
        var userId = container.innerHTML.match(/u=(.*?)"/)[1];
        var link = document.createElement("a");
        link.href = commonLink + userId;
        var img = document.createElement("img");
        img.src = "http://www.dfprofiler.com/images/favicon-96x96.png"; //git gud hotrods c:
        img.style.width = '32px';
        img.style.height = 'auto';
        link.appendChild(img);
        container.appendChild(link);
    }
    var dst = $("div[class='smalltext']"); //just even numbers
    for(var i=0; i<dst.length; i+=2){
        if(!dst[i].querySelector("img"))
            continue;
        appendProfilerLink(dst[i]);
    }
})();