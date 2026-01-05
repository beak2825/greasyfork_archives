// ==UserScript==
// @name         Infraction History and reason autofill
// @namespace    http://tampermonkey.net/
// @version      1.23
// @description  View previous infractions and autofills infraction reason
// @author       Casinaar
// @grant        none
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @require      https://greasyfork.org/scripts/30498-xpcommon/code/XPCommon.js?version=199987
// @include      https://www.xossip.com/infraction.php?do=report&p=*
// @include      https://xossip.com/infraction.php?do=report&p=*
// @include      https://www.desiproject.com/infraction.php?do=report&p=*
// @include      https://desiproject.com/infraction.php?do=report&p=*
// @include      https://216.158.70.98/infraction.php?do=report&p=*
// @include      https://www.xossip.rocks/infraction.php?do=report&p=*
// @include      https://xossip.rocks/infraction.php?do=report&p=*
// @include      https://www.exbii.com/infraction.php?do=report&p=*
// @include      https://exbii.com/infraction.php?do=report&p=*
// @downloadURL https://update.greasyfork.org/scripts/30239/Infraction%20History%20and%20reason%20autofill.user.js
// @updateURL https://update.greasyfork.org/scripts/30239/Infraction%20History%20and%20reason%20autofill.meta.js
// ==/UserScript==

this.$ = window.jQuery.noConflict(true);
$(document).ready(function(){
    var d = document.createElement('div');
    $(d).hide();
    var memname = $('legend').html().replace(/ /g,"+");
    var modname = $('.members a')[0].text;
	var curr = document.location.hostname;
    $(d).load('https://'+curr+'/search.php?do=process&forumchoice[]=36&titleonly=1&query=for+'+memname+' #threadslist', function(){
        $(d).find('a[id*="thread_title_"]:not(:contains('+memname+':))').parent().parent().parent().remove();
        $(d).find('.tcat').html('<b>Infraction History</b>');
        if($(d).find('.tborder > tbody > tr').length == 3)
            $(d).empty();
        $('.tborder')[0].after(d);
        $(d).animate({height:'toggle'});
    });
    $('input[id*="il"]').click(function(i){
        $('#vB_Editor_001_textarea').val(infractionText(modname,$(this).attr('value')));
    });
});

function infractionText(modname,il)
{
    if(il==15)
        $('input[name="banreason"]').val('Spamming');
    else if(il==8)
        $('input[name="banreason"]').val('Posting Underage materials');
    else
        $('input[name="banreason"]').val('');
    return "[div][b]"+infractionlist[il]+"\n\nThanks\n"+modname+"[/b][/div]";
}