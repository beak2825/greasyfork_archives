// ==UserScript==
// @name         Get Show Names
// @namespace    http://djpanaflex.com
// @version      0.1
// @description  Grabs show IDs and names
// @author       DJ Panaflex
// @match        https://www.songkick.com/artists/*/calendar
// @grant        none
// @require      http://code.jquery.com/jquery-1.12.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/371505/Get%20Show%20Names.user.js
// @updateURL https://update.greasyfork.org/scripts/371505/Get%20Show%20Names.meta.js
// ==/UserScript==
/*
var checkExist = setInterval(function() {
   if ($('.powered-by').length) {
      console.log("Exists!");
      clearInterval(checkExist);
   }
}, 100);
*/
$( document ).ready(function() {
    $('.microformat script').each(function(){
        var data = $(this).text()
        var json = JSON.parse(data);
        var addr = json[0].url;
        var isConcert = addr.indexOf('concerts/') >= 0;
        if (isConcert){
            var delimiter = "concerts/";
        } else {
            delimiter = "/id/";
        }
        var seg = addr.split(delimiter)[1];
        var id = seg.split('-')[0];
        console.log(id);
        //$(this).parent().parent().css('border','1px solid red');
        $(this).parent().parent().before('<iframe src="http://djpanaflex.com/sk/write.php?id='+id+'" style="height: 28px;overflow: hidden;" scrolling="no"></iframe>');
        //$( "<p>Test</p>" ).insertAfter( ".inner" );
    });
});