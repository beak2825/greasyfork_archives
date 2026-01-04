// ==UserScript==
// @name         MD Autodelete orphans
// @namespace    http://tampermonkey.net/
// @version      0.01
// @description  Autodeletes orphan attachments
// @author       dukhiatma
// @match        https://www.masaladesi.com/*
// @match        https://masaladesi.com/*
// @match        https://www.masaladesi.com/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant   GM_getValue
// @grant   GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/370583/MD%20Autodelete%20orphans.user.js
// @updateURL https://update.greasyfork.org/scripts/370583/MD%20Autodelete%20orphans.meta.js
// ==/UserScript==
this.$ = window.jQuery.noConflict(true);

function getCurrentPageType()
{
    var currpath = window.location.pathname;
    if(currpath==="/upload.php")
        return 1;
    else if(currpath==="/attachmod.php")
        return 2;
}
$(document).ready(function(){
    var currType = getCurrentPageType();
    if(currType===1)
    {
        if(!GM_getValue('deleteorphans', false))
        {
            var btn = document.createElement('input');
            $(btn).attr({type:"button",class:"button",value:"KILL ALL ORPHANS"});
            $('table')[2].prepend(btn);
            $(btn).click(function(){
                GM_setValue('deleteorphans',true);
                location.reload();
            });
        }
        else
        {
            if($('a[href*="do=delete"]').length)
                $('a[href*="do=delete"]')[0].click();
            else
            {
                GM_setValue('deleteorphans',false);
            }
        }
    }
    else if(currType==2)
    {
        if(GM_getValue('deleteorphans', false))
        {
            $('#rb_yes').prop('checked','true');
            $("input[value='Delete Attachment']").click();
        }
    }
});