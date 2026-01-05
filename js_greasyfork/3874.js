// ==UserScript==
// @name           USO to USMO
// @name:es        USO a USMO
// @description    Redirect Userscripts.org to Userscripts-MIRROR.org
// @description:es Redireccionar Userscripts.org a Userscripts-MIRROR.org
// @namespace      https://greasyfork.org/users/4051
// @author         KaZaC
// @include        *
// @version        0.42
// @grant          none
// @icon           http://i.imgur.com/8qJTYUy.png
// @license        http://creativecommons.org/licenses/by-nc-sa/3.0/
// @downloadURL https://update.greasyfork.org/scripts/3874/USO%20to%20USMO.user.js
// @updateURL https://update.greasyfork.org/scripts/3874/USO%20to%20USMO.meta.js
// ==/UserScript==

document.body.addEventListener('click', function(e){
    var targ = e.target || e.srcElement;
    if ( targ && targ.href && targ.href.match('https?:\/\/userscripts.org\/') ) {
        targ.href = targ.href.replace('://userscripts.org/', '://userscripts-mirror.org/');
    }
    if ( targ && targ.href && targ.href.match('https?:\/\/userscripts.org:8080') ) {
        targ.href = targ.href.replace('://userscripts.org:8080', '://userscripts-mirror.org');
    }
});