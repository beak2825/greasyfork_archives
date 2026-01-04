// ==UserScript==
// @name         Reports Notifier
// @namespace    http://tampermonkey.net/
// @version      0.52
// @description  Adds alert for new reported posts
// @author       Casinaar
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @include      https://www.xossip.com/*
// @include      https://xossip.com/*
// @include      https://www.desiproject.com/*
// @include      https://desiproject.com/*
// @include      https://216.158.70.98/*
// @include      https://www.xossip.rocks/*
// @include      https://xossip.rocks/*
// @include      https://www.exbii.com/*
// @include      https://exbii.com/*
// @downloadURL https://update.greasyfork.org/scripts/30320/Reports%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/30320/Reports%20Notifier.meta.js
// ==/UserScript==
this.$ = window.jQuery.noConflict(true);

var reportlabel;
$(document).ready(function(){
    var divlabel = document.createElement('li');
    $(divlabel).text(' | ');
    reportlabel = $(document.createElement('a')).attr('href','forumdisplay.php?f=36');
    var reportli = document.createElement('li');
    $('.members > ul').append(divlabel).append(reportli);
    $(reportli).append(reportlabel);
    $(reportlabel).css('text-decoration','underline').text('New Reports (0)');
    reportsParser();
    setInterval(reportsParser,60000);
});

function reportsParser()
{
    $.get('forumdisplay.php?f=36',function(tmp){
        var data = $.parseHTML(tmp);
        var temp = $(data).find('a[id^="thread_title"][style="font-weight:bold"]:contains(Reported):not(:has(>span))');
        var temp1 = $(data).find('.members').html();
        if(temp1.indexOf('Unread 0,') == -1 && !GM_getValue('RN_Alert',false) && !temp1.indexOf('Register') )
        {
            GM_setValue('RN_Alert',true);
            if(confirm("You have a new PM. Open Private Messages?"))
                $('a[href="private.php"]')[0].click();
        }
        if(temp1.indexOf('Unread 0,') != -1 && GM_getValue('RN_Alert',false))
            GM_setValue('RN_Alert',false);
        if(temp.length>0)
            $(reportlabel).css('color','#8c1515').css('font-weight','bold').text('New Reports ('+temp.length+')');
        else
            $(reportlabel).text('New Reports (0)').css('color','white').css('font-weight','normal');
    });
}