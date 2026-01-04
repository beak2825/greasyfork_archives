// ==UserScript==
// @name          Fokse's d2jsp PM Box Cleaner
// @author        Fokse
// @description   Empty your full box with 1 click
// @namespace     d2jspboxcleaner
// @include https://forums.d2jsp.org/pm.php*
// @require https://code.jquery.com/jquery-latest.js
// @version 1.02

// @downloadURL https://update.greasyfork.org/scripts/373973/Fokse%27s%20d2jsp%20PM%20Box%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/373973/Fokse%27s%20d2jsp%20PM%20Box%20Cleaner.meta.js
// ==/UserScript==
(function() {
    'use strict';


    function createBox() {
        $('BODY').append('<fieldset style="padding:5px;position:absolute;z-index:100;background-color:#D4E0FF;" id="jspBox"><legend style="background-color:#D4E0FF;border:1px solid #B0B0B0;"><span></span><img style="vertical-align:inherit;margin-left:2px;cursor:pointer;" src="images/x.gif" /></legend><div class="main"></div></fieldset>');
        $('#jspBox LEGEND IMG').click(function() {
            $('#jspBox').hide();
        });
        $('#jspBox').hide();
    }

    function cleanPmBox() {
        $.get(`https://forums.d2jsp.org/pm.php?f=0`, function(data) {
            var html = $($.parseHTML(data)),
                pms = new Array();

            $('input[name="m[]"]', html).each(function() {
                pms.push($(this).attr('value'));
            });
            if (pms.length > 0) {
                $.post('https://forums.d2jsp.org/pm.php', {
                    c: 4,
                    f: 0,
                    m: pms,
                    msgOptions: 4
                }).done(function(data) {
                    $('#jspBox DIV.main').html(`<center><img src="https://poker.bettor-status.net/extensions/aload.gif"><br>Please wait. Cleaning PM Box...</center>`);
                    cleanPmBox();

                });


            } else {
                $.get($('.ta', html).attr('href'), function(data) {
                    $('#jspBox DIV.main').html(`<center>Your pm box has been cleared! refreshing in 2 seconds</center>`);
                    setTimeout(location.reload.bind(location), 2000);
                });

            }

        });
    };

    $('body > form > div.pg > a:nth-child(4)').after('<a id="pmCleaner" href="#">Cleaner</a>');

    $('#pmCleaner').click(function() {
        if (confirm("You really sure you want to definitly remove those messages?")) {

            var offset = jQuery(this).offset()
                
            $('#jspBox').css({
                top: offset.top,
                left: offset.left
            }).show();
            $('#jspBox LEGEND SPAN').html("Cleaning Box...");
            $('#jspBox DIV.main').html('<center><img src="https://poker.bettor-status.net/extensions/aload.gif"></center>');


            cleanPmBox();
        }


    });


    createBox();
})();