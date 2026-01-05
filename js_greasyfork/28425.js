// ==UserScript==
// @name         Stylesheet Remover
// @namespace    https://greasyfork.org/en/users/36444
// @version      0.3
// @description  Removes all stylesheets on click
// @include      *
// @author       GardenShade
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/28425/Stylesheet%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/28425/Stylesheet%20Remover.meta.js
// ==/UserScript==
document.addEventListener( 'click', function(){ $('link[rel=stylesheet]').remove(); }, false );
