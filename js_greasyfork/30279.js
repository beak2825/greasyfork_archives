// ==UserScript==
// @name         MD Attachment Thumbnails
// @namespace    http://tampermonkey.net/
// @version      0.04
// @description  Introduces various improvements to MD
// @author       dukhiatma
// @match        http://www.masaladesi.com/*
// @match        http://masaladesi.com/*
// @match        https://www.masaladesi.com/*
// @match        https://masaladesi.com/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant   none
// @downloadURL https://update.greasyfork.org/scripts/30279/MD%20Attachment%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/30279/MD%20Attachment%20Thumbnails.meta.js
// ==/UserScript==
this.$ = window.jQuery.noConflict(true);

$(document).ready(function(){
    var currentPage = getCurrentPageType();
    if(currentPage===1)
    {
        thumbnailer();
    }
});

function getCurrentPageType()
{
    var currpath = window.location.pathname;
    if(currpath==="/manageattachments.php")
        return 1;
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

