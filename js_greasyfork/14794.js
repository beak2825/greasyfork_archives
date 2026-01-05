// ==UserScript==
// @name         Shuffle pocket list.
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        https://getpocket.com/a/queue/list/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/14794/Shuffle%20pocket%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/14794/Shuffle%20pocket%20list.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

(function($){
    $.fn.shuffle = function() {
        var allElems = this.get(),
            getRandom = function(max) {
                return Math.floor(Math.random() * max);
            },
            shuffled = $.map(allElems, function(){
                var random = getRandom(allElems.length),
                    randEl = $(allElems[random]).clone(true)[0];
                allElems.splice(random, 1);
                return randEl;
           });
        this.each(function(i){
            $(this).replaceWith($(shuffled[i]));
        });
        return $(shuffled);
    };
})(jQuery);

$("body").ready(function() {
  var style = "background: url(/a/i/icons_core@1x.png) -475px -281px no-repeat; width: 18px; height: 18px;";
  $(".queue_secondarynav ul").prepend('<li class="pagenav_listview pagenav_shuffle"><a style="' + style + '" class="hint-item" data-intro="Shuffle list" data-position="bottom" title="Shuffle list (randomize)">Shuffle</a></li>');
  $(".pagenav_shuffle").click(function(e) {
      $('#queue li.item').shuffle();
  });
});