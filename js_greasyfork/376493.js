// ==UserScript==
// @name         Buen día Taringa
// @namespace    Buen día Taringa
// @version      1.5
// @description  Shoutear Buen día Taringa
// @author       @lavolavo
// @match       *://*.taringa.net/mi
// @require     https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/376493/Buen%20d%C3%ADa%20Taringa.user.js
// @updateURL https://update.greasyfork.org/scripts/376493/Buen%20d%C3%ADa%20Taringa.meta.js
// ==/UserScript==


this.$ = this.jQuery = jQuery.noConflict(true);

$(function()
 {
    var up='';

    if ($(".my-shout-attach-options")[0])
    {
        up='<li class="gm-t"><a id="buendia" data-type="image" class="btn g hastipsy" title="Buen día"><div class="btn-text">Buen Día</div></a></li>';
        $('.my-shout-attach-options').append(up);
	}

    $('#buendia').click(function(e) {
        $('#my-shout-body-mi').val('Taringa #On Buen día!');
        $('button[class^="my-shout-add btn a floatR mi"]').trigger('click');
    });
 }
);