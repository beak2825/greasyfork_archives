// ==UserScript==
// @name       serpclick.ru
// @description Обновление всех запросов на serpclick.ru
// @include    *serpclick.ru*
// @author     Sanek508
// @grant none
// @version 0.0.1.20151129093237
// @namespace https://greasyfork.org/users/21389
// @downloadURL https://update.greasyfork.org/scripts/14290/serpclickru.user.js
// @updateURL https://update.greasyfork.org/scripts/14290/serpclickru.meta.js
// ==/UserScript==

window.autoreload = function(event) {
    var poss = $('div[id^="pos-"]');
    $.each(poss, function(key, div)
    {
        var params = $(div).attr("id").split("-");
		var engine = params[1];
        var clientword_id = params[2];
		var region_id = params[3];
		var word_id = params[4];
		var hand = 0;
		
		$("#pos-" + engine + "-" + clientword_id + "-" + region_id + "-" + word_id).attr('pos', 'send');
		$.ajax({
        "url": "/project/ajax",
        "type": "POST",
        "data": {"key": "updatePos", "data": {"clientword_id": clientword_id, "region_id": region_id, "engine": engine}},
        "dataType": "HTML",
        "beforeSend": function(xhr) {
            $("#pos-" + engine + "-" + clientword_id + "-" + region_id + "-" + word_id).html('<img src="/images/loading16.gif" style="margin-right:18px;margin-bottom:-4px;">');
            $("#posupd-" + engine + "-" + clientword_id + "-" + region_id).hide();
        },
        "success": function(data, msg, xhr) {
            var ps = $("#posupd-" + engine + "-" + clientword_id + "-" + region_id).parent().children()[0];
            $(ps).html(data);
            updatedPos = 1;
            $("#pos-" + engine + "-" + clientword_id + "-" + region_id + "-" + word_id).attr('pos', data);
            //console.log("#pos-"+engine+"-"+clientword_id+"-"+region_id+"-"+word_id);
            var autoMode = $('#sw-auto').val();
            if (autoMode == 0) { hand = 1; }
			else {
				hand = $("#pos-" + engine + "-" + clientword_id + "-" + region_id + "-" + word_id).attr('noautomate');
			}
            if (parseInt(data) > 0 && parseInt(data) <= 50 && hand == 1) {
                $("#trans-" + engine + "-input-" + clientword_id + "-" + region_id).show();
				$("#trans-" + engine + "-span-" + clientword_id + "-" + region_id).hide();
            }
            else {
                $("#trans-" + engine + "-input-" + clientword_id + "-" + region_id).addClass('hide');
                $("#trans-" + engine + "-span-" + clientword_id + "-" + region_id).removeClass('hide');
                var pos_y = parseInt($("#pos-yandex-" + clientword_id + "-" + region_id + "-" + word_id).text());
                var pos_g = parseInt($("#pos-google-" + clientword_id + "-" + region_id + "-" + word_id).text());
				var pos_m = parseInt($("#pos-mail-" + clientword_id + "-" + region_id + "-" + word_id).text());
                var pos_y = parseInt($("#pos-yahoo-" + clientword_id + "-" + region_id + "-" + word_id).text());
				var pos_b = parseInt($("#pos-bing-" + clientword_id + "-" + region_id + "-" + word_id).text());
            }
		},
		    //"error":function(xhr,stat,errMsg){alert("Возникла ошибка 1: "+stat+"\n\n"+errMsg+"\n\n"+xhr.responseText);},
			"complete": function(xhr, msg) {
				$("#posupd-" + engine + "-" + clientword_id + "-" + region_id).show();
			}
		});
    });
}
 

 $('td[class="tdfz1"]').html($('td[class="tdfz1"]').html()+'<a title="Обновить все запросы" style="float:right;margin-top:-2px;margin-right:120px" class="reload inline_block" href="#"  onclick="autoreload();"></a>');

