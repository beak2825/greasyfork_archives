// ==UserScript==
// @name          mods.de Forum - Navigation
// @description   Verbessert die Navigation innerhalb des Forums
// @author        TheRealHawk
// @license       MIT
// @namespace     https://greasyfork.org/en/users/18936-therealhawk
// @match         https://forum.mods.de/
// @match         https://forum.mods.de/index.php
// @match         https://forum.mods.de/thread.php*
// @match         https://forum.mods.de/newthread.php*
// @match         https://forum.mods.de/newreply.php*
// @match         https://forum.mods.de/editreply.php*
// @match         https://forum.mods.de/bb/
// @match         https://forum.mods.de/bb/index.php
// @match         https://forum.mods.de/bb/thread.php*
// @match         https://forum.mods.de/bb/newthread.php*
// @match         https://forum.mods.de/bb/newreply.php*
// @match         https://forum.mods.de/bb/editreply.php*
// @icon          https://i.imgur.com/wwA18B8.png
// @version       1.9
// @require       https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @require       https://greasyfork.org/scripts/8984-jquery-hotkeys-plugin/code/jQuery%20Hotkeys%20Plugin.js
// @downloadURL https://update.greasyfork.org/scripts/13701/modsde%20Forum%20-%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/13701/modsde%20Forum%20-%20Navigation.meta.js
// ==/UserScript==

// Workaround to get rid of "is not defined" warnings
/* globals $, jQuery */

if ($(location).attr('pathname') == '/bb/thread.php' || $(location).attr('pathname') == '/thread.php'){
    $(document).bind('keydown', 'ctrl+left', function(){
        var href = $('a:contains("« erste"):first').attr('href');
        if (href){
            window.location.assign(href);
        }
    });

    $(document).bind('keydown', 'left', function(){
        var href = $('a:contains("« vorherige"):first').attr('href');
        if (href){
            window.location.assign(href);
        }
    });

    $(document).bind('keydown', 'right', function(){
        var href = $('a:contains("nächste »"):first').attr('href');
        if (href){
            window.location.assign(href);
        }
    });

    $(document).bind('keydown', 'ctrl+right', function(){
        var href = $('a:contains("letzte »"):first').attr('href');
        if (href){
            window.location.assign(href);
        }
    });

    $(document).bind('keydown', 'ctrl+up', function(){
        window.scrollTo(0, 0);
    });

    $(document).bind('keydown', 'ctrl+down', function(){
        window.scrollTo(0, document.body.scrollHeight);
    });

    if ($('a:contains("lesezeichen"):last').parent().text().match(/.*\+lesezeichen.*/)){
        $(document).bind('keydown', 'l', function(){
            eval('unsafeWindow.' + $('a:contains("lesezeichen"):last').attr('href').match(/setBookmark\(.*\)/));
        });
    }

    $(document).bind('keydown', 'i', function(){
        window.location.assign('http://forum.mods.de/');
    });

    $(document).bind('keydown', 'p', function(){
        window.location.assign($('a[href^="newreply.php"]').attr('href'));
    });
}

if ($('#bookmarklist').length){
    $(document).bind('keydown', 'l', function(){
        openLinks();
    });
}

$(document).bind('keydown', 'r', function(){
    window.location.reload();
});

$(document).bind('keydown', 'y', function(){
    window.location.reload();
});

$('textarea[name="message"]').bind('keydown', 'ctrl+return', function(){
    $('input[value="Eintragen"]').click();
});

var content = $('meta[http-equiv="refresh"]').attr('content');
if (content){
    var href = content.substring(content.indexOf('url=') + 4);
    window.location.assign(href);
}
