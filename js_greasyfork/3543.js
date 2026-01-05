// ==UserScript==
// @name           Funnyjunk admin alert remover
// @description    For when admin goes dumb
// @author         posttwo (Post15951)
// @include        *funnyjunk.com*
// @version        1.2
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @namespace https://greasyfork.org/users/3806
// @downloadURL https://update.greasyfork.org/scripts/3543/Funnyjunk%20admin%20alert%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/3543/Funnyjunk%20admin%20alert%20remover.meta.js
// ==/UserScript==
 

$('#adminAlerts_content').remove();