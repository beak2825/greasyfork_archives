// ==UserScript==
// @name     	500px Downloadable Images
// @namespace   https://github.com/Enchoseon/enchos-assorted-userscripts/raw/main/500px-downloadable-images.user.js
// @version  	1.0.0
// @description Right-click download images from 500px.com.
// @author   	Enchoseon
// @include  	*500px.com/*
// @grant    	none
// @downloadURL https://update.greasyfork.org/scripts/435202/500px%20Downloadable%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/435202/500px%20Downloadable%20Images.meta.js
// ==/UserScript==

(function() {
    "use strict";
    document.addEventListener("contextmenu", function(event){event.stopPropagation();}, true);
    var s = document.createElement("style");
    s.setAttribute("type", "text/css");
    s.appendChild(document.createTextNode("img{z-index:999999}"));
    document.getElementsByTagName("head")[0].appendChild(s);
})();
