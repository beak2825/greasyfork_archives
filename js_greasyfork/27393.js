// ==UserScript==
// @name Spoiler FC
// @namespace Xesucrist0 & Luckino
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @include http://www.forocoches.com*
// @include https://www.forocoches.com*
// @include http://m.forocoches.com*
// @include https://m.forocoches.com*
// @version 1
// @grant none
// @description Script para mejorar los spoilers de FC
// @downloadURL https://update.greasyfork.org/scripts/27393/Spoiler%20FC.user.js
// @updateURL https://update.greasyfork.org/scripts/27393/Spoiler%20FC.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

$(document).ready(function(){

    $('.spoiler').prev().replaceWith('<button class="boton_spoiler" class="smallfont" style="font-weight:bold; margin-left:8px; margin-bottom:2px;">Mostrar spoiler</button>');

    addGlobalStyle('.spoiler { color: black; font-weight: 400; background-color: inherit; width: auto; height: auto; max-height: 99999px; text-align: left; border-radius: 0px; cursor: inherit; overflow: auto; margin: 5px 2px 2px; padding: 10px; border: 1px double; }');
    
    $('.spoiler').click();
    
    $('.spoiler').css('display', 'none');
    $('.spoiler').text(function(){
        $(this).text($(this).text().replace(/\[img\]/igm, "<img src=\""));
        $(this).text($(this).text().replace(/\[\/img\]/igm, "\">"));
        $(this).text($(this).text().replace(/\[b\]/igm, "<b>"));
        $(this).text($(this).text().replace(/\[\/b\]/igm, "<\/b>"));
        $(this).text($(this).text().replace(/\[u\]/igm, "<u>"));
        $(this).text($(this).text().replace(/\[\/u\]/igm, "<\/u>"));        
        $(this).text($(this).text().replace(/\[i\]/igm, "<i>"));
        $(this).text($(this).text().replace(/\[\/i\]/igm, "<\/i>"));        
        $(this).text($(this).text().replace(/\[url=\"/igm, "<a rel=\"nofollow noopener noreferrer\" href=\""));
        $(this).text($(this).text().replace(/\"\]/igm, "\" target=\"_blank\">"));        
        $(this).text($(this).text().replace(/\[\/url\]/igm, "<\/a>"));        
        $(this).text($(this).text().replace(/\[center\]/igm, "<div align=\"center\">"));
        $(this).text($(this).text().replace(/\[\/center\]/igm, "<\/div>"));        
        $(this).text($(this).text().replace(/\[left\]/igm, "<div align=\"left\">"));
        $(this).text($(this).text().replace(/\[\/left\]/igm, "<\/div>"));        
        $(this).text($(this).text().replace(/\[right\]/igm, "<div align=\"right\">"));
        $(this).text($(this).text().replace(/\[\/right\]/igm, "<\/div>"));
        $(this).text($(this).text().replace(/\[youtube\]/igm, "<div align=\"center\" class=\"video-youtube\"><div class=\"video-container\"><iframe title=\"YouTube video player\" class=\"youtube-player\" type=\"text/html\" width=\"640\" height=\"390\" src=\"//www.youtube.com/embed/"));
        $(this).text($(this).text().replace(/\[\/youtube\]/igm, "\" frameborder=\"0\" allowfullscreen=\"\"></iframe></div></div>"));            
            
        $(this).html($(this).text().replace(/\n/igm, "<br>"));
    });

    $('.boton_spoiler').click(function(){
        if($(this).next().css('display') == "block"){
            $(this).text("Mostrar spoiler");
            $(this).next().css('display', 'none');
        } else{
            $(this).next().css('display', 'block');
            $(this).text("Ocultar spoiler");
        }
    });
});
