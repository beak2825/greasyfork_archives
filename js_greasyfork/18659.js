// ==UserScript==
// @name         ao3 hide crossovers
// @namespace    https://greasyfork.org/en/users/36620
// @version      0.3.1
// @description  hides works with too many fandom tags
// @author       scriptfairy
// @include      http://archiveofourown.org/*works*
// @include      https://archiveofourown.org/*works*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18659/ao3%20hide%20crossovers.user.js
// @updateURL https://update.greasyfork.org/scripts/18659/ao3%20hide%20crossovers.meta.js
// ==/UserScript==

/* CONFIG */

var max = 2;
// this is the maximum number of fandoms a work can have before being hidden

/* END CONFIG */

(function($) {
    $('<style>').text(
        '.hide .hideleft {width:85%;float:left;} .hide .hideright {float:right;padding-top:5px;}'
    ).appendTo($('head'));
    var works = $('ol.index li.blurb');
    for (i=0;i<works.length;i++){
        var fandoms = $('.header .fandoms a', works[i]);
        if (fandoms.length > max) {
            var button = document.createElement('div');
            button.setAttribute('class','hide');
            button.innerHTML = '<div class="hideleft">This work is tagged' + $('.header .fandoms', works[i])[0].innerHTML + 'and may be a crossover, fusion, or multi-fandom collection.</div><div class="hideright"><button type="button" class="show">Click to Show</button></div>';
            works[i].appendChild(button);
            $(works[i]).children(':not(".hide")').css('display','none');
        }
    }

    $(document).ready(function(){
        $('.hide button').click(function() {
            var work = $(this).parents('li')[0];
            if ($(this).hasClass("show")) {
                $(work).children(':not(".hide")').show();
                $(work).find('.hideleft').css('visibility', 'hidden');
                $(this).text("Click to Hide");
                $(this).removeClass("show").addClass("shown");
            }
            else {
                $(work).children(':not(".hide")').hide();
                $(work).find('.hideleft').css('visibility', 'visible');
                $(this).text("Click to Show");
                $(this).removeClass("shown").addClass("show");
            }
        });
    });
})(window.jQuery);