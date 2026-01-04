// ==UserScript==
// @name Autohide Discord Channels and Members bar
// @version 1.0.0
// @author JustTheo
// @namespace http://tampermonkey.net/
// @run-at document-start
// @include https://discord.com/*
// @description autohide when cursor isn't hovering near them
// @downloadURL https://update.greasyfork.org/scripts/423695/Autohide%20Discord%20Channels%20and%20Members%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/423695/Autohide%20Discord%20Channels%20and%20Members%20bar.meta.js
// ==/UserScript==

(function() {
let css = `
/*---------------------------------------- SLIDE IN AND OUT ANIMATION ----------------------------------------*/
/* CHANNELS/DMS */
div.sidebar-2K8pFh {
    opacity: 0;
    width: 40px;
    -webkit-transition: opacity 0.3s ease-in-out, width 0.5s;
    -moz-transition: opacity 0.3s ease-in-out;
    -ms-transition: opacity 0.3s ease-in-out;
    -o-transition: opacity 0.3s ease-in-out;
}
div.sidebar-2K8pFh:hover {
    opacity: 1;
    width: 250px;
}
/* MEMBER LIST */
[class|=membersWrap] {
    opacity: 0;
    width: 10px;
    min-width: 40px;
    -webkit-transition: opacity 0.3s ease-in-out, width 0.5s;
    -moz-transition: opacity 0.3s ease-in-out;
    -ms-transition: opacity 0.3s ease-in-out;
    -o-transition: opacity 0.3s ease-in-out;
}
[class|=membersWrap]:hover {
    opacity: 1;
    width: 240px;
}
.members-1998pB {
    opacity: 0;
    width: 40px;
    -webkit-transition: opacity 0.3s ease-in-out, width 0.5s;
    -moz-transition: opacity 0.3s ease-in-out;
    -ms-transition: opacity 0.3s ease-in-out;
    -o-transition: opacity 0.3s ease-in-out;
}
.members-1998pB:hover {
    opacity: 1;
    width: 240px;
}

.
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
