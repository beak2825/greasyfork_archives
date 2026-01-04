// ==UserScript==
// @description    Im Mahi, and this script helps people to select and seacrh EU-Bin ID Bin Research single click | Saves lot of time for VBI employees.

// @name           FC_Research Tool EU
// @copyright      Mahi Balan M | RCA | VBI
// @version        2.00
// @website        https://phonetool.amazon.com/users/mahibala
// @namespace      *
// @include        *
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @author         Mahi Balan M
// @downloadURL https://update.greasyfork.org/scripts/40091/FC_Research%20Tool%20EU.user.js
// @updateURL https://update.greasyfork.org/scripts/40091/FC_Research%20Tool%20EU.meta.js
// ==/UserScript==
// ==/UserScript==
$(document).ready(function(){
    $("body").mouseup(function(e){
        // get selected text
        var seltext = getSelectedText();
        var fcname = seltext.substring(0,4);
        var binid = seltext.substring(5,17);
        var link1 = "http://fcresearch-eu.aka.amazon.com/";
        var link2= "/results?s";
        if(seltext != "")
        {
           if($(".searchit").attr("class") == null)
           {
                $("<a></a>").appendTo("body")
                .attr("title","Search Product on Amazon.com | MB")
                .attr("class","searchit")
                .css("width","24px")
                .css("height","24px")
                .css("background-image","url(http://lh4.ggpht.com/_9NnLYMRJob8/TQ9GrnFaweI/AAAAAAAAAVc/f4UtNPKEMUU/find.png)")
                .css("display","inline")
                .css("background-position","0px 0px")
                .attr("href", link1 +fcname+ link2 +binid)
                .attr("target","_blank")
                .css("left",e.pageX - 5)
                .css("top",e.pageY - 30)
                .css("display","block")
                .css("position","absolute")
                .hide()
                .fadeIn(0.1);
            }
           else{
                   $(".searchit").animate({"left": e.pageX - 2,"top" : e.pageY - 30}, 0.1)
                .attr("href", link1 +fcname+ link2 +binid).fadeIn(0.1);
           }
        }
        else
            $(".searchit").fadeOut(0.1);
    });
    $(".searchit").mouseover(function(){
       alert("asa");
    });
});
function getSelectedText()
{
    // For Firefox
    if(window.getSelection)
        return window.getSelection().toString(); //Change here

    else if(document.getSelection)
        return document.getSelection();
    else
    {
        // For IE
        var selection = document.selection && document.selection.createRange();
        if(selection.text)
            return selection.text;
        return false;
    }
    return false;
}
