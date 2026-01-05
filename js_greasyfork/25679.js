// ==UserScript==
// @name       Link Shrink Skipper
// @namespace  https://greasyfork.org/en/users/2329-killerbadger
// @version    0.1
// @description  Skips the linkshrink redirect page including adblock killer
// @match      http://linkshrink.net/*
// @exclude    http://linkshrink.net/*.php
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/25679/Link%20Shrink%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/25679/Link%20Shrink%20Skipper.meta.js
// ==/UserScript==
//alert("I ran");
	var b = document.documentElement.outerHTML;
    var loc_id = "<a class=\"bt\" href=\"";
//alert("Old:" + b.indexOf("<a class=\"bt\" href=\"") + "\nNew:" + b.indexOf(loc_id));
if(b.indexOf(loc_id)>0) {
        var newLoc = b.substring(b.indexOf(loc_id)+loc_id.length,b.indexOf("\">Continue"));
//    alert(newLoc);
        window.location.assign(newLoc);
}