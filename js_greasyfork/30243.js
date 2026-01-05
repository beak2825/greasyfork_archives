// ==UserScript==
// @name         Orphan Mass Delete
// @namespace    http://tampermonkey.net/
// @version      0.03
// @description  Delete all orphan images at once
// @author       You
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @match        http://www.masaladesi.com/upload.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30243/Orphan%20Mass%20Delete.user.js
// @updateURL https://update.greasyfork.org/scripts/30243/Orphan%20Mass%20Delete.meta.js
// ==/UserScript==
this.$ = window.jQuery.noConflict(true);

$(document).ready(function(){
    var link = $('<a style="text-decoration:underline;color:black">[Delete All]</a>');
    $(link).hover(function(){$(this).css('color','red');$(this).css('cursor', 'pointer');},function(){$(this).css('color','black');});
    $(link).click(function(){
        if(confirm("Are you sure?"))
            deleteAll();
    });
    $('.tcat:contains("Your orphan image uploads")').append($(link));
});
function deleteAll()
{
	var imagelinks=$("a[href$='delete']");
	var done = 0;
	$(imagelinks).each(function(i)
	{
		var attachid = imagelinks[i].href;
		attachid = attachid.substring(attachid.indexOf('=')+1,attachid.indexOf('&'));
		$.get( "attachmod.php", { attachmentid: attachid, do: "delete" } )
		.done(function() {
			done++;
			if(done==imagelinks.length)
				location.reload();
		});
	});
}