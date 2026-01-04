// ==UserScript==
// @name        ncore.hide.films.user.js
// @namespace   mytool
// @include     https://ncore.cc/torrents.php*
// @version     1.1
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://greasyfork.org/scripts/3667-super-gm-setvalue-and-gm-getvalue-js/code/Super_GM_setValue_and_GM_getValuejs.js?version=11165
// @grant   GM_setValue 
// @grant   GM_getValue 
// @description  Hide movies on ncore.cc with greasmonkey
// @downloadURL https://update.greasyfork.org/scripts/30914/ncorehidefilmsuserjs.user.js
// @updateURL https://update.greasyfork.org/scripts/30914/ncorehidefilmsuserjs.meta.js
// ==/UserScript==
function hide_film(film){
  var hideme = $('span').filter(function () {
    return $(this).text().toLowerCase() == film.toLowerCase();
  });
  hideme.parents('.box_torrent').hide();
}
function hide_films(films) {
  $.each(films, function (index, value) {
    hide_film(value);
  });
}
var stored_films = GM_SuperValue.get('HiddenFilms', []);
hide_films(stored_films);

$('.lista_fej').append('<span class=\'clear_list\' style=\'float:right; cursor: pointer; margin-right: 10px; font-size: 14px;\'>Clear Hidden Films History </span>');
$('.clear_list').click(function(){
  GM_SuperValue.set('HiddenFilms', []);
  location.reload();
});
$('.siterank').append('<span class=\'myhide\' style=\'cursor: pointer; margin-left: 10px; font-size: 14px;\'>Hide</span>');
$('.myhide').click(function () {
  var hide_this = this.parentNode.firstChild.nextSibling.innerHTML;
  if (hide_this !== undefined) {
    var found = jQuery.inArray(hide_this, stored_films);
    if (found < 0) {
      stored_films.push(hide_this);
    }
    GM_SuperValue.set('HiddenFilms', stored_films);
    hide_film(hide_this);
  }
});
