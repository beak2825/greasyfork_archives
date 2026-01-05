// ==UserScript==
// @name         Learn.jquery.com Modifications
// @version      0.1
// @description  Change font to Verdana & full width content
// @author       Shakil Shahadat
// @match        http://learn.jquery.com/*
// @grant        none
// @namespace https://greasyfork.org/users/6404
// @downloadURL https://update.greasyfork.org/scripts/12165/Learnjquerycom%20Modifications.user.js
// @updateURL https://update.greasyfork.org/scripts/12165/Learnjquerycom%20Modifications.meta.js
// ==/UserScript==

document.querySelector( 'body' ).style.font = '15px/22.5px Verdana, "Helvetica Neue", HelveticaNeue, Helvetica, Arial, sans-serif';
document.querySelector( '#content' ).style.width = '100%';