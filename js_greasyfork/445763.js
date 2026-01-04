// ==UserScript==
// @name         VK Get VK Users Profiles
// @namespace    http://tampermonkey.net/
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.0/jquery.min.js
// @version      0.1
// @description  Описание скрипта
// @author       You
// @match        https://igra.love/*
// @icon         https://sun9-63.userapi.com/c837422/u147863751/eca85e2x.gif
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445763/VK%20Get%20VK%20Users%20Profiles.user.js
// @updateURL https://update.greasyfork.org/scripts/445763/VK%20Get%20VK%20Users%20Profiles.meta.js
// ==/UserScript==

console.log('11');


setTimeout(function() {


    $('div.popup-mouse-overlay').hover(
        function(e) {

            e.preventDefault();
            console.log(this);
            console.log('enter');
            var addGiftBtn = $(this).find('.add-gift-btn');
            //addGiftBtn.css('display', 'none');
            //$(this).find('.complain-age-btn').css('display', 'none');
            console.log(addGiftBtn);
            var uid = $(this).parent().parent().attr('uid');
            console.log(uid);
            $('<span class="popup-menu-item open-vk-profile" style="z-index: 9999999999"><a href="https://vk.com/id' + uid + '" class="link-open-vk-profile" target="_blank">Открыть профиль ВК</a></span>').insertAfter(addGiftBtn);


            $('a.link-open-vk-profile').on('click',

        function(e) {
                var myLink = $(this).attr('href');
                console.log('lll');
            e.preventDefault();
                setTimeout(function(){
                    console.log('ddd');
                    console.log($(this));
                    var win = window.open(myLink, '_blank');
        if (win) {
            //Browser has allowed it to be opened

                //win.focus();


        } else {
            //Browser has blocked it
            alert('Please allow popups for this website');
        }

                    //$('#dialog-area').children().remove();
                    $('#dialog-area').addClass('hidden');
                //$('#dialog-area').css('opacity', '0');
            console.log('sdfsdfs');

        }, 0);
        });
        }
                                           ,
        function() {
            console.log('away');
            var openVkProfileSpan = $(this).find('.open-vk-profile');
            openVkProfileSpan.remove();
        }
    );


}, 10000);

setInterval(function(){
 $('div.popup').css('height', 'auto');
}, 5)
