// ==UserScript==
// @name         Like all
// @namespace    Like all
// @version      1.4
// @description  Likear mi y perfiles
// @author       @lavolavo
// @match       *://*.taringa.net/*
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376494/Like%20all.user.js
// @updateURL https://update.greasyfork.org/scripts/376494/Like%20all.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(function()
 {
    var up='';

    if ($(".my-shout-attach-options")[0])
    {
        up='<li class="gm-t"><a id="stalk" data-type="image" class="btn g hastipsy" title="Positivo a todo"><div class="btn-text">Positivo all</div></a></li>';
        $('.my-shout-attach-options').append(up);
	}
    else if ($(".perfil-info")[0])
    {
        up='<a id="stalk" class="btn g"><div class="btn-text">Stalk</div></a>';
        $('.perfil-info').append(up);
	}

    $('#stalk').click(function(e) {
        $('div[title^="Me gusta"]').trigger('click');
    });
 }
);