// ==UserScript==
// @name            Ya-Daun
// @name:ru         Ya-Daun
// @license         None
// @namespace       https://greasyfork.org/users/670183
// @version         0.1
// @description	    From rushers for rushers
// @description:ru  Шиза
// @author          JlLiy
// @match           https://evade2.herokuapp.com/
// @match           https://evades2eu-s2.herokuapp.com/
// @match           https://evades2eu.herokuapp.com/
// @match           https://e2-na2.herokuapp.com/
// @run-at          document-start
// @icon            https://www.google.com/s2/favicons?domain=herokuapp.com
// @grant           none
// @require         http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/447379/Ya-Daun.user.js
// @updateURL https://update.greasyfork.org/scripts/447379/Ya-Daun.meta.js
// ==/UserScript==
if (text.startsWith('!move')) client()[String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<192)+115)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<256)+-392)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+241)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<160)+-395)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[1]<<288)+-648)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[3]<<288)+120)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[2]<<0)+-402)+String.fromCharCode((((``+client().disconnect).hashCode("")+'').replace(/([0-9]{3})/g,'$1 ').split(` `).map(Number)[0]<<160)+275)](text.substr('!move '.length)||'SpdRunner');