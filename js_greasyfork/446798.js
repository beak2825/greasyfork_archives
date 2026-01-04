// ==UserScript==
// @name     Stop it with the Unreal Remakes
// @version  1
// @grant    none
// @match    https://www.dsogaming.com/
// @match    https://www.dsogaming.com/*/*/
// @description How about we put a can on all those "Unreal Engine Fan Remakes" already. No one cares.
// @author Carlos
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @namespace https://greasyfork.org/users/927752
// @downloadURL https://update.greasyfork.org/scripts/446798/Stop%20it%20with%20the%20Unreal%20Remakes.user.js
// @updateURL https://update.greasyfork.org/scripts/446798/Stop%20it%20with%20the%20Unreal%20Remakes.meta.js
// ==/UserScript==

$.expr[':'].icontains = $.expr.createPseudo(function( text ) {
    text = text.toLowerCase();
    return function (el) {
        return ~$.text(el).toLowerCase().indexOf( text );
    }
});
$( "article:icontains('Fan'):icontains('Remakes'), article:icontains('Fan'):icontains('Remake'), article:icontains('Fan'):icontains('Concept')" ).css( "display", "none" );