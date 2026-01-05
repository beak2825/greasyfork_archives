// ==UserScript==
// @name         interface change
// @namespace    namespace
// @version      1.01
// @description  smaller chopcoin interface
// @match        http://chopcoin.io/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13772/interface%20change.user.js
// @updateURL https://update.greasyfork.org/scripts/13772/interface%20change.meta.js
// ==/UserScript==


/*
 SCREENSHOT:  http://i.imgur.com/cbAf2Qql.png
*/



document.getElementsByTagName('head')[0].innerHTML += ' \
<style> \
#content, \
div#menu { \
    width: 400px \
} \
div#wrapper { \
    width: 450px; \
    margin-left: 0; \
    background: rgba(220, 220, 220, .5) \
} \
img { \
    width: 70%; \
    margin: 0!important \
} \
#langswitch, \
#languagelabel { \
    text-align: left!important \
} \
div#menu { \
    margin: 0 \
} \
.col-xs-12 { \
    float: none \
} \
#copyright { \
    text-align: left \
} \
.activeserverinfo, \
h1, \
h4, \
iframe, \
thead { \
    display: none!important \
} \
tr { \
    background: none!important \
} \
#chatroom { \
    width: 445px!important \
} \
#wrapper:hover { \
    z-index: 10002 \
} \
</style>'
