// ==UserScript==
// @name         BetterMD Private
// @namespace    http://tampermonkey.net/
// @version      0.03
// @description  Introduces various improvements to MD
// @author       dukhiatma
// @match        https://www.masaladesi.com/*
// @match        https://masaladesi.com/*
// @match        https://f7.masaladesi.com/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant   GM_getValue
// @grant   GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/31326/BetterMD%20Private.user.js
// @updateURL https://update.greasyfork.org/scripts/31326/BetterMD%20Private.meta.js
// ==/UserScript==
this.$ = window.jQuery.noConflict(true);

$(document).ready(function(){
    var currentPage = getCurrentPageType();
    if(currentPage===1)
    {
        if(GM_getValue('attachallenabled', false))
        {
            if($('input[value="Attach"]').length)
                $('input[value="Attach"]')[0].click();
            else
            {
                initAttachmentPage();
                GM_setValue('attachallenabled',false);
            }
        }
        else if(GM_getValue('detachallenabled', false))
        {
            if($('input[value="Detach"]').length)
                $('input[value="Detach"]')[0].click();
            else
            {
                initAttachmentPage();
                GM_setValue('detachallenabled',false);
            }
        }
        else if(GM_getValue('selectenabled',false))
        {
            var b = JSON.parse(GM_getValue('selected'));
            if(b.length)
            {
                var parcont = $("a:contains('"+b[0]+"')").parent().parent();
                $(parcont).find('input').click();
                b.shift();
                GM_setValue('selected',JSON.stringify(b));
            }
            if(!Array.isArray(b) || !b.length)
            {
                initAttachmentPage();
                GM_setValue('selectenabled',false);
            }
        }
        else
            initAttachmentPage();
    }
    else
    {
        var tmp = $('input[name*="attachment"]');
        tmp.hide();
        $(tmp[0]).show();
        $(tmp[0]).prop('multiple','0');
    }
});
function initAttachmentPage()
{
    detachAll();
    attachAll();
    attachSelected();
    thumbnailer();
    addCheckBoxes();
}
function getCurrentPageType()
{
    var currpath = window.location.pathname;
    if(currpath==="/manageattachments.php")
        return 1;
    else if(currpath=="/upload.php")
        return 2;
}

//Attach all images
function attachAll()
{
    var btn = document.createElement('input');
    $(btn).attr({type:"button",class:"button",value:"Attach All"});
    $('input[value="Close this window"]')[0].after(btn);
    $(btn).click(function(){
        GM_setValue('attachallenabled',true);
        location.reload();
    });
}

//Detach all images
function detachAll()
{
    var btn = document.createElement('input');
    $(btn).attr({type:"button",class:"button",value:"Detach All"});
    $('input[value="Close this window"]')[0].after(btn);
    $(btn).click(function(){
        GM_setValue('detachallenabled',true);
        location.reload();
    });
}

//Thumbnail previews
function thumbnailer()
{
    var thumbs=[];
    var temp_doc;
    var imagesource;
    $.get('upload.php',function(data){
        temp_doc=$.parseHTML(data);
        temp=$(temp_doc).find('.thumbnail');
        $(temp).each(function(i){
            thumbs[i]=temp[i].src;
        });
        $('.fieldset tr').prepend(function(){
        var temp_td=document.createElement('td');
        $(temp_td).attr('class','thumbnail');
        var tmp_img=document.createElement('img');
        $(tmp_img).css({ height:'200px'});
        $(temp_td).append(tmp_img);
        var tmpr = $(this);
        imagesource = (function(){
            var tmp = $(tmpr).find('a').html();
            for(var i =0;i<thumbs.length;i++)
            {
                if(thumbs[i].substring(thumbs[i].lastIndexOf('/')+1)===tmp.substring(tmp.lastIndexOf('/')+1).replace(/ /g,"%20"))
                    return thumbs[i];
            }
        })();
        tmp_img.src=imagesource;
        return temp_td;
        });
    });
}

//Attach checkboxes
function addCheckBoxes()
{
    $('.inlineimg').hide();
    var temp_td = document.createElement('td');
    var checkbox = document.createElement('input');
    $(checkbox).attr('type','checkbox');
    $(temp_td).append(checkbox);
    $(temp_td).attr('class','checkboxholder');
    $('.inlineimg').after(temp_td);
}

//Attach Selected
function attachSelected()
{
    var selected = [];
    $('.inlineimg').parent().attr('class','url_holder');
    var btn = document.createElement('input');
    $(btn).attr({type:"button",class:"button",value:"Attach Selected"});
    $('input[value="Close this window"]')[0].after(btn);
    $(btn).click(function(){
        GM_setValue('selectenabled',true);
        var checked = $('input[type="checkbox"]:checked').parent().parent().find('a');
        $(checked).each(function(i){
            selected[i]=checked[i].innerHTML;
        });
        GM_setValue('selected', JSON.stringify(selected));
        location.reload();
    });
}