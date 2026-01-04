// ==UserScript==
// @description    Im Mahi, and this script helps people to select and seacrh a product by name without having to download any new Search extension, with single click | Saves lot of time for e-commerce employees.
// @name           Search Selected text on Amazon .com
// @copyright      Mahi Balan M | RCA | VBI
// @version        1.23
// @website        https://phonetool.amazon.com/users/mahibala
// @namespace      *
// @include        *
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js
// @author         Mahi Balan M
// @downloadURL https://update.greasyfork.org/scripts/37617/Search%20Selected%20text%20on%20Amazon%20com.user.js
// @updateURL https://update.greasyfork.org/scripts/37617/Search%20Selected%20text%20on%20Amazon%20com.meta.js
// ==/UserScript==
// ==/UserScript==
$(document).ready(function(){
    $("body").mouseup(function(e){
        // get selected text
        var seltext = getSelectedText();
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
                .attr("href","https://www.amazon.com/s?ie=UTF8&field-keywords="+seltext)
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
                .attr("href","https://www.amazon.com/s?ie=UTF8&field-keywords="+seltext).fadeIn(0.1);
           }
        }
        else
            $(".searchit").fadeOut("very very fast");
    });
    $(".searchit").mouseover(function(){
       alert("asa");
    });
});
function getSelectedText()
{
    // For Firefox
    if(window.getSelection)
        return window.getSelection();
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
