// ==UserScript==
// @name         Beast Lair css
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  changes css of the forum, smaller user images, larger post space
// @author       You
// @match        *://forums.nrvnqsr.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427969/Beast%20Lair%20css.user.js
// @updateURL https://update.greasyfork.org/scripts/427969/Beast%20Lair%20css.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}


addGlobalStyle(`
body {
    margin: 3px !important;
}

.postbitlegacy .userinfo .postuseravatar img, .eventbit .userinfo .eventuseravatar img {
    max-width: 100px;
}
.postbitlegacy .userinfo .userinfo_extra {
    width: 100px;
}

.postbitlegacy .userinfo {
    width: 110px;
}

.postbitlegacy .postbody, .eventbit .eventdetails .eventbody {
    margin-left: 135px;
}`);
