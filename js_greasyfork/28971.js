// ==UserScript==
// @name        Animeflv.net - Fix
// @namespace   Animeflv.net, Remove ads,social,and any shit i dont like :D
// @description remove ads social, etc, just pure player style. yaelmania script
// @run-at      document-end
// @require     https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @include     http*://animeflv.net/*
// @version     1.7
// @dateLast    2017.06.18
// @grant       unsafeWindow
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/28971/Animeflvnet%20-%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/28971/Animeflvnet%20-%20Fix.meta.js
// ==/UserScript==


var $av = jQuery.noConflict();


function GoNext() {
  //Quita la publicidad molesta así como también redes sociales, comentarios y todo aquello que a mi parecer no van con la estética y funcionabilidad de la página.
  //Recomiendo usar: NoScript + BlockSite + ABP
  //Todos son complementos para Firefox no es necesario pero con esto tu eliminaras y blockearas las molesta publicidad y todo lo que se te ocurra.
  var verifica1 = top.window.location.href;
  var verifica2 = window.location.href;
  var Cheker1 = verifica1.replace(/.+\/ver\.+/gi,'ver');
  var Cheker2 = verifica2.replace(/.+\/ver\.+/gi,'ver');
  var Cheker3 = verifica1.replace(/.+\/anime\/.+/gi,'anime');
  if(Cheker1 == Cheker2 && Cheker3 !== 'anime'){
    $av('.fb-comments,#taboola-right-rail-thumbnails').each(function() {
      $av( this ).parent().remove();
    });
    $av('.Button.Sm.fa-download').each(function() {
      var linker = $av(this).attr('href').replace(/.+s\=/g,'');
      $av(this).attr('href',unescape(linker));
    });
    $av('.Sect.Comments,[id*="ScriptRoot"]').each(function() {
      $av( this ).parent().parent().remove();
    });
    // The next Time out just tigger me favorite streaming sites if don't like just delete the next line "setTimeout(selecx, 500);"
    setTimeout(selecx, 500);
  }
  $av('iframe[src*="animeflv.net/aflv.php"],iframe[src*="animeflv.net/bloque"],.Dvr300,ul.ListPostOpts,.Sect.Comments,#footer, .ads-always-down, .publi_head, .ads_der, #b-close-ads, #ads-dw, [style*="2147483647"],#videoLoading, .jw-overlays.jw-reset, .jw-captions.jw-captions-enabled.jw-reset,.ultimos_epis .not [rel="nofollow"]').each(function() {
      $av( this ).remove();
  });
  $av('body').each(function() {
      $av( this ).append(unescape('%3Cstyle id%3D%22especialme%22 type%3D%22text%2Fcss%22%3E %23footer%2C .ads-always-down%2C .publi_head%2C .ads_der%2C %23b-close-ads%2C %23ads-dw%2C %5Bstyle%2A%3D%222147483647%22%5D%2C%23videoLoading%2C .jw-overlays.jw-reset%2C .jw-captions.jw-captions-enabled.jw-reset%2C.ultimos_epis .not %5Brel%3D%22nofollow%22%5D%7Bposition%3Aabsolute%21important%3Btop%3A-999px%21important%3B left%3A-999px%21important%3B max-width%3A 0.01em%21important%3B max-height%3A 0.01em%21important%3B width%3A0.01em%21important%3B height%3A0.01em%21important%3B color%3Atransparent%21important%3B font-size%3A0.01em%21important%3B font-size-adjust%3A0.01%21important%3B background%3Anone%21important%3B background-color%3Atransparent%21important%3B background-image%3Anone%21important%3B background-repeat%3Ano-repeat%21important%3Bz-index%3A -2147483647%21important%3B%7Danime_episodios%7Bheight%3A 376px%21important%3Bwidth%3A 760px%21important%3Boverflow-x%3A hidden%21important%3B%7Da%3Avisited %7Bborder%3A 4px solid %23A21768%21important%3B%7D.not a%2C a figure img%7Bborder%3A 3px solid %23fff%21important%3Bposition%3A absolute%21important%3Bwidth%3A 212px%21important%3Bborder-radius%3A 3px%21important%3B%7D.not a%3Avisited%2Ca%3Avisited figure img%7Bborder%3A 3px solid %23A21768%21important%3Bheight%3A 106px%21important%3Bposition%3A absolute%21important%3Bwidth%3A 212px%21important%3B%7D.fa-play-circle.Next figure img%7Bborder%3A 0px solid transparent%21important%3B%7D.adbl%2C%23adbl%2C.ShrCnB.fa-share-alt%7Bvisibility%3A hidden%21important%3Bdisplay%3A none%21important%3B%7D%23contenedor%7Bdisplay%3A block%21important%3B%7D.ListEpisodes %3E li %3E a%3Avisited %7Bcolor%3A red%21important%3B%7D.ListEpisodios a%3Avisited%7Bcolor%3A red%21important%3B%7D.ListCaps %3E li %3E a%3Avisited %7Bcolor%3A red%21important%3B%7D.ListCaps a%3Avisited%7Bcolor%3A red%21important%3B%7D %3C%2Fstyle%3E'));
   });
}
function selecx (){
  var Hyperion = $av('ul[role="tablist"] li[title="Hyperion"]').attr('data-id');
  var Okru = $av('ul[role="tablist"] li[title="Okru"]').attr('data-id');
  var MP4Upload = $av('ul[role="tablist"] li[title="MP4Upload"]').attr('data-id');
  if(typeof Hyperion != 'undefined'){
    $av('ul[role="tablist"] li[title="Hyperion"]').trigger('click');
    return false;
  }
  if(typeof MP4Upload != 'undefined'){
    $av('ul[role="tablist"] li[title="MP4Upload"]').trigger('click');
    return false;
  }
  if(typeof Okru != 'undefined'){
    $av('ul[role="tablist"] li[title="Okru"]').trigger('click');
    return false;
  }
 
}
setTimeout(GoNext, 1000);