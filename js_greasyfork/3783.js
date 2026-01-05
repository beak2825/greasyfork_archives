// ==UserScript==
// @id             ru.ozon.better
// @name           Make Ozon.Ru better
// @version        1.0
// @namespace      bloho.ru
// @author         i.polyakov
// @description    Make Ozon.Ru a little bit better.
// @include        http://www.ozon.ru/
// @include        http://ozon.ru/
// @include        https://www.ozon.ru/
// @include        https://ozon.ru/
// @run-at         document-end
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js
// @history        2014-07-31 - v1.0 - i.polyakov - First version. Add links to book covers.
// @downloadURL https://update.greasyfork.org/scripts/3783/Make%20OzonRu%20better.user.js
// @updateURL https://update.greasyfork.org/scripts/3783/Make%20OzonRu%20better.meta.js
// ==/UserScript==

(function () {

$('.tov_img').each(function(i, el) {
  el = $(el)
  var a = el.siblings().filter('.tov_name').find('a').eq(0);
  var href = a.attr('href');
  var new_a = $('<a />').attr('href', href).css({
    'display': 'block',
    'height': '100%',
    'cursor': 'pointer'
  });
  el.append(new_a);
});

})();
