// ==UserScript==
// @name	Podgląd wszystkich powiadomień
// @namespace	http://userscripts.org/scripts/source/380892.user.js
// @author	bruce
// @description	Otwiera wszystkie nieprzeczytane powiadomienia pod linkami.
// @include	http://*.wykop.pl/powiadomienia*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @version	2.1
// @grant	none
// @run-at	document-end
// @downloadURL https://update.greasyfork.org/scripts/2241/Podgl%C4%85d%20wszystkich%20powiadomie%C5%84.user.js
// @updateURL https://update.greasyfork.org/scripts/2241/Podgl%C4%85d%20wszystkich%20powiadomie%C5%84.meta.js
// ==/UserScript==

function main() {
    var button = `<li id='notification-addon'>
                    <a href="#" class="clickable" title>
                        <span id="button_text">podgląd nieprzeczytanych powiadomień</span>
                        <span id="loading" style="display:none;">
                            <span id="percent">0</span>%
                        </span>
                    </a>
                  </li>`;

    $('.rbl-block > ul:first').prepend(button);

    $("#notification-addon").on('click', '.clickable', function () {
        var test_elements = $('ul.menu-list > li:not(.space):eq(1) > p > a:last-of-type');
        var unread_elements = $('li.type-light-warning > p > a:last-of-type');

        interesting_elements = unread_elements;

        var loaded_elements = 0;
        var all_elements = interesting_elements.length; /* All emelements that will be loaded*/

        if (all_elements) {
            $('#loading').show();
          	$('#button_text').html('Ładowanie..');
            $(this).removeClass('clickable');

            interesting_elements.each(function () {
                var li = $(this).closest('li');
                
                li.removeClass('type-light-warning annotation');

                $('<div class="mikro_ramka"></div>').appendTo(li).load($(this).attr('href') + " #itemsStream", function () {

                    loaded_elements++;
                    var percent = parseInt(loaded_elements / all_elements * 100);

                    if (percent < 100) $('#loading #percent').html(percent);
                    else {
                      $('#button_text').html('Wszystko wczytane');
                      $('#loading').hide();
                    }

                  	// Dopasowanie stylów css
                    $('.mikro_ramka b').css({position: 'relative',
                                             top: -1,
                                             right: 0,
                                             'box-shadow': '1px'});
                  
                    $('.mikro_ramka p').css({padding: 0,
                                             'background-color': 'transparent'});
                  
                  	$('.mikro_ramka li').css('border', '0px');
                  	$('.mikro_ramka a').css({'display': 'inline-block'});
                  	$('.button').css('border', '1px solid #e1e3e4');
                });
            });
        }
    });
}

main();