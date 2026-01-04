// ==UserScript==
// @name         草榴NoAD
// @namespace    https://cl.dg53.xyz/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://cl.dg53.xyz/htm_data/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420071/%E8%8D%89%E6%A6%B4NoAD.user.js
// @updateURL https://update.greasyfork.org/scripts/420071/%E8%8D%89%E6%A6%B4NoAD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement( "style" );
    var text = document.createTextNode( "#table.sptable_do_not_remove,.tips{display:none!important;}" );
    style.appendChild( text );
    var head = document.getElementsByTagName( "head" )[0];
    head.appendChild( style );
})();