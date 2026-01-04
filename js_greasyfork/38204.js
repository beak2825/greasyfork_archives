// ==UserScript==
// @name        Flashback PRO
// @namespace   flashback.pro
// @include     *flashback.org*
// @description Det här skriptet tar bort all reklam från flashback. 
// @description 
// @description Det tar bort sidorutan till höger (där sökrutan är) och sträcker ut tråden över hela fönstret.
// @description Sökrutan läggs längst upp innan tråden istället.
// @description 
// @description Skriptet följer även länkar automatiskt så att du inte behöver klicka två gånger (DU LÄMNAR NU FLASHBACK FORUM)
// @description För uppdateringar, se hit: https://greasyfork.org/sv/scripts/38204-flashback-pro
// @version     1.7
// @grant       none
// @require 	http://code.jquery.com/jquery-1.11.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/38204/Flashback%20PRO.user.js
// @updateURL https://update.greasyfork.org/scripts/38204/Flashback%20PRO.meta.js
// ==/UserScript==
console.log("Flashback PRO loaded.");
console.log("Flashback PRO loaded.");
$(document).ready(function () {
    $('#top-logo').children().attr("href","/usercp.php");  //Clicking logo will get you to the control panel
    var searchBar = $('#form-forum-search').parent().html(); //Save searchbar for later prepending
    $('#top-banner-container').remove();
    $('#right-banner-container').remove();
    $('.post-banner-container').remove();
    $('#bottom-banner-container').remove();
    $('.banner_text').remove();
    $('.ad').remove();
    $('#site-right').remove();
    $('#site-left').attr('class', ''); //Make main forum thread wider
    $('#site-left').attr('style', 'width:100%;margin-left:25px;margin-right:25px'); //fix margins for appearance
    $('#site-left').prepend("<center id=\"formcenter\">" + searchBar + "</center>");  //prepend search bar before thread
    $('#form-forum-search').attr('style', 'width: 40%');  //make search bar smaller for appearance

    var tmpstr = $('#gototxtval').val();
    var form = $("<form/>", { action: tmpstr });
    form.append("Hoppa till sida: ");
    form.append( $("<input>", { id: 'gototxtval',type:'text', name:'page', style:'width:50px;margin-right:5px' }    ));

  //  form.append( "<br>");
    form.append( $("<input>", { type:'submit', value:'Hoppa', style:'width:75px' }      ));
    $(".pagination-xs").prepend("<center id=\"gotocenter\"></center>");
    $("#gotocenter").prepend(form);
    //$(".selection").prepend(form);
   // $(".select2-selection").remove();

    if (/.leave./.test(window.location)) { //Automatically bypass the "Are you sure you want to follow this link" When clicking external links in threads
        var arr = document.getElementsByTagName('a');

        for(var i = 0; i < arr.length; i++){
            var href = arr[i].getAttribute('href');
            if (!(/.flashback./.test(href)))
                window.location = href;
        }
    }

});