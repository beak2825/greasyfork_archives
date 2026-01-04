// ==UserScript==
// @name         Bunpro: Streak Indicator
// @namespace    http://tampermonkey.net/
// @version      0.2.6
// @description  Displays the streak for the current item.
// @author       Kumirei
// @include      http://bunpro.jp*
// @include      https://bunpro.jp*
// @require      https://greasyfork.org/scripts/370623-bunpro-helpful-events/code/Bunpro:%20Helpful%20Events.js?version=974369
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369931/Bunpro%3A%20Streak%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/369931/Bunpro%3A%20Streak%20Indicator.meta.js
// ==/UserScript==

;(function () {
    var grammarID
    //update upon each new item
    $('HTML')[0].addEventListener('new-review-item', function () {
        var location = window.location.href
        if (location.includes('.jp/study') || location.includes('.jp/cram')) {
            //Add the indicator if it does not already exist
            if (!$('.streak-bar').length) {
                var bg = ''
                var cls = $('body')[0].className
                if (cls.includes('modern-dark')) bg = '#424242'
                else if (cls.includes('modern')) bg = '#f5f5f6'
                else if (cls.includes('light')) bg = '#e6e6e6'
                else bg = 'rgba(25,34,49,0.8)'
                $('head').append(
                    '<style id="streak-bar-style">.streak-bar .streak {background-size: cover; height: 100%;} .srs-tracker__holder, .hanko-ghost {display: none !important;}</style>',
                )
                var HTML =
                    '<div class="streak-bar" style="background: ' +
                    bg +
                    '; height: 40px; width: 100%; margin-bottom: 0; padding-bottom: 5px; padding-top: 5px;">' +
                    '<div class="col-xs-12 col-md-8 no-padding" style="width: 100%; height: 100%;">' +
                    '<div class="" style="width:100%;max-width:450px;margin:0 auto; height: 100%;">' +
                    '<div class="col-xs-1 streak hanko--grey hanko1"></div>' +
                    '<div class="col-xs-1 streak hanko--grey hanko2"></div>' +
                    '<div class="col-xs-1 streak hanko--grey hanko3"></div>' +
                    '<div class="col-xs-1 streak hanko--grey hanko4"></div>' +
                    '<div class="col-xs-1 streak hanko--grey hanko5"></div>' +
                    '<div class="col-xs-1 streak hanko--grey hanko6"></div>' +
                    '<div class="col-xs-1 streak hanko--grey hanko7"></div>' +
                    '<div class="col-xs-1 streak hanko--grey hanko8"></div>' +
                    '<div class="col-xs-1 streak hanko--grey hanko9"></div>' +
                    '<div class="col-xs-1 streak hanko--grey hanko10"></div>' +
                    '<div class="col-xs-1 streak hanko--grey hanko11"></div>' +
                    '<div class="col-xs-1 streak hanko--grey hanko12"></div>' +
                    '<div class="clearfix"></div>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
                $('.study-input-bar').after(HTML)
            }

            //Find the grammar point's ID
            grammarID = $('.level_lesson_info a')[0].href.split('/grammar_points/')[1]

            //ghost reviews only have 4 SRS levels, so we remove 8 hanko if it's a ghost review
            var ghost = $('.ghost-reviews').css('display') == 'block' ? true : false

            //get the streak from top right corner
            var streak = Number($('.srs-tracker')[0].innerText.split(' ')[1])

            //edit hanko bar
            for (var i = 1; i < 13; i++) {
                var elem = $('.hanko' + i)
                if (
                    (i < streak + 1 && !elem.hasClass('hanko--' + i)) ||
                    (i >= streak + 1 && elem.hasClass('hanko--' + i))
                ) {
                    elem.toggleClass('hanko--grey')
                    elem.toggleClass('hanko--' + i)
                }
                //if it's a ghost review only show 4 streak hanko
                if (i > 4) {
                    if ((ghost && !elem.hasClass('hanko-ghost')) || (!ghost && elem.hasClass('hanko-ghost'))) {
                        elem.toggleClass('hanko-ghost')
                    }
                }
            }
        }
    })
})()
