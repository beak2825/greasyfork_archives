// ==UserScript==
// @name        Wanikani Lightning Mode
// @namespace   wklightning
// @description Eliminates second Enter or Click for correct review answers.
// @include     https://www.wanikani.com/review/session*
// @include     https://www.wanikani.com/lesson/session*
// @version     1.0.9
// @author      Robin Findley
// @copyright   2018+, Robin Findley
// @license     MIT; http://opensource.org/licenses/MIT
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/12853/Wanikani%20Lightning%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/12853/Wanikani%20Lightning%20Mode.meta.js
// ==/UserScript==

//==[ History ]======================================================
// 1.0.8 - Fixed issue with proceeding at end of lesson group.
// 1.0.5 - Added support for lessons.
// 1.0.4 - Added option to show item info when slightly off or multi-answer.
// 1.0.3 - Fix to restore SRS status popup.  Thanks to @ccookf contributions!
// 1.0.2 - Enable lightning mode by default for new installs.
// 1.0.1 - Added option to not auto-advance if answer is slightly off.
//         Added option to not auto-advance if item has multiple answers.
// 1.0.0 - Initial release.
//===================================================================

//==[ Settings ]=====================================================
// The following script configuration variables are available.  You
// can enable them by pasting the corresponding line in the javascript
// console (press F12 in most browsers to open the console), or by
// removing the "//" before the corresponding "localStorage" line
// below.  The setting will be saved in storage.
// To remove a setting from storage, enter the following line in the
// javascript console, with corresponding setting name replaced:
//   delete localStorage.wkdpp_setting_name;
//-------------------------------------------------------------------
//
// Halt if answer is slightly off.
//   localStorage.wklightning_halt_slightly_off = 1;
//
// Halt if answer has multiple meanings.
//   localStorage.wklightning_halt_multiple = 1;
//
// Open item info when halting for "slightly off" or "multiple meanings".
//   localStorage.wklightning_info_on_halt = 1;
//===================================================================

wklightning = {};

(function(gobj){

    var lightning = false;
    var observer;
    var ignore;

    function addStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (head) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = css;
            head.appendChild(style);
            return style;
        }
        return null;
    }

    //-------------------------------------------------------------------
    // Process stored configuration settings.
    //-------------------------------------------------------------------
    function process_settings() {
        function value_or_default(value, dflt) {return (value===undefined ? dflt : value);}

        // Halt if answer is slightly off.
        gobj.halt_slightly_off = value_or_default(localStorage.wklightning_halt_slightly_off, 0);

        // Halt if answer has multiple meanings.
        gobj.halt_multiple = value_or_default(localStorage.wklightning_halt_multiple, 0);

        // Halt if answer has multiple meanings.
        gobj.info_on_halt = value_or_default(localStorage.wklightning_info_on_halt, 0);
    }

    //-------------------------------------------------------------------
    // main() - Runs after page is done loading.
    //-------------------------------------------------------------------
    function main() {
        process_settings();
        addStyle(
            '#lightning-mode.active {color:#ff0; opacity:1.0;}'+
            '#answer-form fieldset.WKLM_warn button, #answer-form fieldset.WKLM_warn input[type=text], #answer-form fieldset.WKLM_warn input[type=text]:disabled {background-color:#fa2 !important;}'
        );

        lightning = localStorage.getItem('lightning');
        lightning = (lightning !== 'false');
        $('#summary-button').append('<a id="lightning-mode" href="#"'+(lightning?' class="active"':'')+'><i class="icon-bolt"></i></a>');
        $('#lightning-mode').on('click', function() {
            lightning = !lightning;
            console.log('Lightning mode '+(lightning?'en':'dis')+'abled!');
            localStorage.setItem('lightning', lightning);
            $(this).toggleClass('active', lightning);
            return false;
        });
        ignore = false;
        observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (!lightning || ignore) return;
                switch (mutation.target.className) {
                    case 'correct':
                        var exception = $('#answer-exception');
                        var advance = true;
                        if (exception.length > 0) {
                            var msg = exception.text();
                            // Show the item info.
                            if (msg.match('multiple') !== null && gobj.halt_multiple) {
                                advance = false;
                            } else if (msg.match('answer was a bit off') !== null && gobj.halt_slightly_off) {
                                advance = false;
                            }
                        }
                        // Auto-advance.
                        if (advance) {
                            var srs_notice = $('#question-type .srs').detach();
                            // Simulate an <enter> on the submit button.
                            var event = $.Event('keydown');
                            event.keyCode = 13; event.which = 13; event.key = 'Enter';
                            $('#answer-form button').trigger(event);
                            setTimeout(function(){
                                $('#question-type').append(srs_notice);
                                setTimeout(function(){
                                    $('#question-type .srs').fadeOut(function(){this.remove();});
                                },1500);
                            },100);
                        } else {
                            $("#answer-form fieldset").addClass("WKLM_warn");
                            if (gobj.info_on_halt) {
                                var ae = $('#answer-exception').remove();
                                var ac = $('#additional-content');
                                $('#additional-content #option-item-info').click();
                                ac.append(ae);
                                ac.attr('style','z-index:1000');
                            }
                        }
                        break;
                    case 'warning':
                    case '':
                        break;
                    default:
                        $('#additional-content #option-item-info').click();
                        break;
                }

                // Ignore additional changes for 100ms
                ignore = true;
                setTimeout(function(){ignore = false;}, 100);
            });
        });
        observer.observe(document.querySelector('#answer-form fieldset'), {attributes: true, subtree: true, attributeFilter: ['class']});
    }

    //-------------------------------------------------------------------
    // Run main() upon load.
    //-------------------------------------------------------------------
    if (document.readyState === 'complete')
        main();
    else
        window.addEventListener("load", main, false);

}(wklightning));
