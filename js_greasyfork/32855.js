// ==UserScript==
// @name         Show profiler in profile
// @version      1.0
// @description  Tool to go to the profiler of a user from that user's profile
// @author       A Meaty Alt
// @include      /action=profile/
// @grant        none
// @namespace https://greasyfork.org/users/150647
// @downloadURL https://update.greasyfork.org/scripts/32855/Show%20profiler%20in%20profile.user.js
// @updateURL https://update.greasyfork.org/scripts/32855/Show%20profiler%20in%20profile.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var commonLink = "http://www.dfprofiler.com/profile/view/";
    function appendProfilerLink(container){
        var userId = $("#flashMain1").find("param[name='flashvars']").attr("value").match(/userID=(.*?)&/)[1];
        var link = document.createElement("a");
        link.href = commonLink + userId;
        var img = document.createElement("img");
        img.src = "http://www.dfprofiler.com/images/favicon-96x96.png"; //git gud hotrods c:
        img.style.width = '32px'
        img.style.height = 'auto'
        img.style.float = "right";
        link.appendChild(img);
        container.appendChild(link);
    }
    var dst = $(".titlebg")[0].firstElementChild;
    appendProfilerLink(dst);
})();