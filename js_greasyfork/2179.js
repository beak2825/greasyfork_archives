// ==UserScript==
// @name       KAT - Toggle All Folders
// @namespace  ToggleAll
// @version    1.21
// @description  Adds a button to expand/minimise all folders in a torrent on KAT
// @match       http://kat.cr/*.html
// @match       https://kat.cr/*.html
// @exclude		http://kat.cr/tos.html
// @exclude		https://kat.cr/tos.html
// @downloadURL https://update.greasyfork.org/scripts/2179/KAT%20-%20Toggle%20All%20Folders.user.js
// @updateURL https://update.greasyfork.org/scripts/2179/KAT%20-%20Toggle%20All%20Folders.meta.js
// ==/UserScript==

$(".folderopen:first").attr("class", "folder");
$('button[id$="AllFolders"]').remove();
var temp = $('a[href^="javascript:getFiles"]:first').attr("href");
var subfolder = $('table[id$="_1"]:first').attr("id");
if (temp != undefined)
{
    temp = temp.split(", ");
	morelink = temp[0] + ", " + temp[1];
    var pattern = new RegExp(";$");
	if (pattern.test(morelink)) // if morelink is found in root directory
    {

    	if (subfolder != undefined) // if subfolder is found
        {
          $(".torrent_files").prepend('<button id="Toggle" class="icon16 textButton" style="margin-right:5px; pointer-events: none; cursor: not-allowed;"><span></span>Toggle Folders</button>');
          $('<center id="loading" style="margin-top:10px"><i>Please wait before expanding the folders</i></center>').insertBefore(".data:first");  
        }
	}
	else // if morelink is found in a sub folder
	{
    	morelink = morelink + ");"
        $(".torrent_files").prepend('<button id="Toggle" class="icon16 textButton" style="margin-right:5px; pointer-events: none; cursor: not-allowed;"><span></span>Toggle Folders</button>');
        $('<center id="loading" style="margin-top:10px"><i>Please wait before expanding the folders</i></center>').insertBefore(".data:first");
	}
 	window.open(morelink, "_self");
}
else // if no morelink is found
{
    if (subfolder != undefined) // if subfolder is found
    {
        $(".torrent_files").prepend('<button id="Toggle" class="icon16 textButton" style="margin-right:5px;"><span></span>Toggle Folders</button>');
    }
    // if no subfolder (or morelink) is found
}
	var count = $('table[id^="ul_"][id!="ul_top"]').length;
	var timer = count * 10;
	if (timer < 500 ) { timer = 500; }

setTimeout(function()
	{
		$('.torrent_files').bind("DOMSubtreeModified",function()
		{
			$("#loading").remove();
			$("#Toggle").removeAttr("style");
			$("#Toggle").css("margin-right", "5px");
            $("#ul_top").css("display", "block");
        });
	}, timer);    

$("#Toggle").click( function()
{
	$('span[class^="folder"][class!="foldericon"]').each(function()
	{
		if ($(this).attr("class") == "folder")
		{
			$(this).attr("class", "folderopen"); 
		} 
		else
		{
			$(this).attr("class", "folder");
		}
	});
	
	$('table[id^="ul_"][id!="ul_top"]').after(function(ind)
	{
		if ($(this).css("display") == "none") 
		{
			$(this).css("display", "block");
		}
		else
		{
			$(this).css("display", "none");
		} 
	});
}); 