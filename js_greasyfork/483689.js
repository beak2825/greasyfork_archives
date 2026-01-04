// ==UserScript==
// @name delete_click_event
// @author tomo
// @description delete click
// @include *
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @version 0.1 うまく動かず。特に最初のサイズが指定できない。
// @namespace https://greasyfork.org/users/1222402
// @downloadURL https://update.greasyfork.org/scripts/483689/delete_click_event.user.js
// @updateURL https://update.greasyfork.org/scripts/483689/delete_click_event.meta.js
// ==/UserScript==

/*
    document.body.addEventListener('mousedown', function(e){
		console.log("click");
		$("#extension-status5").css("background-color","pink"); 
    },false);
*/
    $(window).on("load", function(){
        console.log($('a'));
        $('A').each(function(index, elem){
            //click mouseover mousedown mouseup onclick onmouseover onmousedown onmouseup
            console.log($(elem));
            //$(elem).off('onmousedown');
            elem.removeAttribute("onmousedown");
       });
       $("#extension-status5").css("background-color","pink"); 
    });
