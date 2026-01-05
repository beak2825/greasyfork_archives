// ==UserScript==
// @name        KAT - Edit Cover
// @namespace   Dr.YeTii
// @description ertghhtrew
// @include     http*://kat.cr/*/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/15733/KAT%20-%20Edit%20Cover.user.js
// @updateURL https://update.greasyfork.org/scripts/15733/KAT%20-%20Edit%20Cover.meta.js
// ==/UserScript==

$(function() {
  var btn = $('.kaButton[href^="/moderator/updateimdbinfo/"]');
  if ($('#change_cover').length==0 && $('.torrentMediaInfo').length==1 && btn.length == 1) {
    var metaType = btn.attr('href').split('/')[3];
    var metaID = btn.attr('href').split('/')[4];
    btn.parent().after('<li><a href="/moderator/changecover/'+metaType+'/'+metaID+'/" id="change_cover" class="kaButton smallButton normalText"><i class="ka ka-camera"></i> Edit cover</a></li>');
    cur = $(".movieCover img");
    $("#change_cover").unbind().imageSelector({
        select: function(images) {
            var oldPic = cur.attr('src');
            $.fancybox.showActivity();
            $.ajax({
        		type: "POST",
        		url: $(this).attr('href'),
        		data: { image_id: images[0].id },
        		dataType: "json",
        		beforeSend: function(response) {
                    cur.attr('src', '//kastatic.com/images/indicator.gif');
        		},
        		success: function(response) {
        		    $.fancybox.hideActivity();
                    if (response.method == 'error') {
                        cur.attr('src', oldPic);
                        alert('error: ' + response.html);
                    } else {
                        cur.attr('src', response.html);
                    }
        		},
        		error: function(response) {
                    $.fancybox.hideActivity();
                    alert('ajax error: ' + response.responseText);
        		}
        	});
        }
    });
  }
});