// ==UserScript==
// @name        SSC - tagi
// @description Tagi na SSC
// @include     http://www.skyscrapercity.com/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @version     1.0
// @grant       none
// @namespace https://greasyfork.org/users/11062
// @downloadURL https://update.greasyfork.org/scripts/10915/SSC%20-%20tagi.user.js
// @updateURL https://update.greasyfork.org/scripts/10915/SSC%20-%20tagi.meta.js
// ==/UserScript==

/**
 * Konfiguracja
 */
var tags = {'gdańsk': 'Gdańsk', 'sopot': 'Sopot', 'gdynia': 'Gdynia', 'stadion': 'Stadion'};

/**
 * Skrypt
 */
var objectsCount = Math.ceil(Object.keys(tags).length / 8);

if (objectsCount > 0) {
   for (var i = 0; i < objectsCount; i++) {
      var moveTo = $('.page').first().children('div').children('br:nth-of-type(2)');
      var width = moveTo.prev().css('width');
      width = parseInt(width)/12;
      moveTo.before('<div id="tags-bar-' + i + '" class="tborder" style="padding:1px; border-top-width:0px"><table cellspacing="0" cellpadding="0" border="0" width="100%" align="center"><tbody><tr align="center"></tr></tbody></table></div>')
      parent = $('#tags-bar-' + i).children().children().children();

      var j = 0;
      $.each(tags, function(index, value) {
         var tag = encodeURIComponent(htmlEncode(index));
         parent.append('<td class="vbmenu_control" style="width: ' + width + 'px"><a href="tags.php?tag=' + tag + '">' + value + '</a></td>');
         delete tags[index];
         
         j = j + 1;
         if (j == 8) {
            return false;
         }
      });
      
      for (j; j < 8; j++) {
         parent.append('<td class="vbmenu_control" style="width: ' + width + 'px"><a href="">&nbsp;</a></td>');
      }
   };
}

function htmlEncode(value) {
   value = value.replace(/ą/g,"&#261;");
   value = value.replace(/ć/g,"&#263;");
   value = value.replace(/ę/g,"&#281;");
   value = value.replace(/ł/g,"&#322;");
   value = value.replace(/ń/g,"&#324;");
   value = value.replace(/ó/g,"&#243;");
   value = value.replace(/ś/g,"&#347;");
   value = value.replace(/ź/g,"&#378;");
   value = value.replace(/ż/g,"&#380;");
   
   value = value.replace(/Ą/g,"&#260;");
   value = value.replace(/Ć/g,"&#262;");
   value = value.replace(/Ę/g,"&#280;");
   value = value.replace(/Ł/g,"&#321;");
   value = value.replace(/Ń/g,"&#323;");
   value = value.replace(/Ó/g,"&#242;");
   value = value.replace(/Ś/g,"&#346;");
   value = value.replace(/Ź/g,"&#377;");
   value = value.replace(/Ż/g,"&#379;");
   
   return value;
}