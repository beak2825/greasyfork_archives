// ==UserScript==
// @name        Zetaboards Theme Replacer
// @description A custom theme for Zetaboards forums.
// @namespace   zb-custom-theme
// @include     http://s15.zetaboards.com/EXE_Nostalgia/*
// @version     2.0.1
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/14456/Zetaboards%20Theme%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/14456/Zetaboards%20Theme%20Replacer.meta.js
// ==/UserScript==

/*
Created as a demonstration. Alter as you like!
*/


function loadjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script')
        fileref.setAttribute("type","text/javascript")
        fileref.setAttribute("src", filename)
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref!="undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}
 
loadjscssfile("http://z4.ifrm.com/30571/170/0/p1089157/exe_wired.css", "css");

// Forum Icons
$('img[alt="Regular Forum (No New Posts)"]').attr('src', 'http://z4.ifrm.com/30571/170/0/f5056297/Norotate.gif');
$('img[alt="Regular Forum"]').attr('src', 'http://z4.ifrm.com/30571/170/0/f5056302/rotate.gif');
$('img[alt="Stats"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/Database.gif');
$('img[alt="Active"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/People.gif');
$('img[alt="Prefs"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/Prefs.gif');
$('img[alt="PM"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/Inbox.gif');
// Topic Buttons
$('img[alt="Make New Topic"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/gifNewTopic.gif');
$('img[alt="Add Reply"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/gifAddReply.gif');
// Actions
$('img[alt="PM Online Member"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/Onpm.gif');
$('img[alt="Profile"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/Profile.gif');
$('img[alt="Edit Post"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/Edit.gif');
$('img[alt="Quote Post"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/Quote.gif');
$('img[alt="Goto Top"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/Gototop.gif');
$('img[alt="PM Offline Member"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/Offpm.gif');
$('img[alt="Report Post"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/Report.gif');
// Topic icons
$('img[alt="Regular"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/Plain-Folder.gif');
$('img[alt="Regular (No new posts)"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/nonew.gif');
$('img[alt="Hot Topic (No new posts)"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/nonewHot.gif');
$('img[alt="Hot Topic"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/Plain-Folder-Hot.gif');
$('img[alt="Locked"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/closedfolder.gif');
$('img[alt="Poll (No new posts)"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/pollnonew.gif');
$('img[alt="Poll"]').attr('src', 'http://i90.photobucket.com/albums/k279/Kellywizkid/EXE%20Wired/Plain-Poll.gif');
// $('img[alt=""]').attr('src', 'URL');
// Theme specific fixes
$('#submenu').css('background-color', 'transparent');
$('#top_menu.drop_menu li').css('background', 'transparent');
$('#dynamo_drop').css('background', 'transparent');
$('#top_menu').css('background', 'transparent');
$('#submenu').css('border', '0px');
$('#submenu').css('background', 'http://web.archive.org/web/20140122192349/http://i90.photobucket.com/albums/k279/Kellywizkid/number2.gif');