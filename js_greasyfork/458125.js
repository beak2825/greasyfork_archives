// ==UserScript==
// @name         FABGoogle
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  Simplify google and add more customization
// @author       FAB
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match        https://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/458125/FABGoogle.user.js
// @updateURL https://update.greasyfork.org/scripts/458125/FABGoogle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Settings

    var HIDE_SEARCH_BUTTONS = true
    var HIDE_SEARCH_ICON = false
    var HIDE_LOGO = false

    var SEARCH_CENTERED = false //IN BETA

    var CUSTOM_LOGO = true
    var LOGO = 'https://media.discordapp.net/attachments/347254691966615552/1038066021300453436/maxwell.gif?width=545&height=366'

    var CUSTOM_SMALL_LOGO = true
    var SMALL_LOGO = 'https://media.discordapp.net/attachments/347254691966615552/1038066021300453436/maxwell.gif?width=545&height=366'

    var ENABLE_QUICKS = true
    var ENABLE_HOTKEYS = true

    //Clear view
    $(".o3j99.c93Gbe").css('display', 'none')
    $(".RNmpXc").css('display', 'none')
    $(".gNO89b").css('display', 'none')
    $(".gb_be.gb_o.gb_pg.gb_gg").css('display', 'none')
    $("#SIvCob").css('display', 'none')
    $(".oBa0Fe.aciXEb").css('display', 'none')
    $("#fbar").css('display', 'none')
    $("#fbarcnt").css('height', '10px')
    $(".NhRr3b.aBOYt").css('display', 'none')
    $(".std.Aysk6e.card-section").css('display', 'none')
    $(".lJ9FBc").css('height', '0px')
    $(".hisnlb.M6Nvye").css('display', 'none')
    $("#result-stats").css('display', 'none')
    $(".WE0UJf").css('height', '10px')
    $(".szppmdbYutt__middle-slot-promo").css("display", "none")
    $(".gb_2d.gb_4a.gb_Qd").css("display", "none")
    $(".gb_ee.gb_r.gb_qg.gb_hg").css('display', 'none')

    //Hotkeys
    if (ENABLE_HOTKEYS = true) {
        document.addEventListener("keydown", function(event) {
            if (event.key == 'g') {
                if (event.ctrlKey) {
                    location.href = "https://www.gmail.com"
                }
            }

            if (event.key == 'y') {
                if (event.ctrlKey) {
                    location.href = "https://www.youtube.com"
                }
            }

            if (event.key == 'G') {
                if (event.ctrlKey) {
                    location.href = "https://www.gmail.com"
                }
            }

            if (event.key == 'Y') {
                if (event.ctrlKey) {
                    location.href = "https://www.youtube.com"
                }
            }

            if (event.key == 'п') {
                if (event.ctrlKey) {
                    location.href = "https://www.gmail.com"
                }
            }

            if (event.key == 'н') {
                if (event.ctrlKey) {
                    location.href = "https://www.youtube.com"
                }
            }

            if (event.key == 'П') {
                if (event.ctrlKey) {
                    location.href = "https://www.gmail.com"
                }
            }

            if (event.key == 'Н') {
                if (event.ctrlKey) {
                    location.href = "https://www.youtube.com"
                }
            }

             if (event.key == 'b') {
                if (event.ctrlKey) {
                    const searchbar = document.getElementsByClassName('gLFyf')[0];
                    location.href = "https://" + searchbar.value.replace("https://", "")
                }
            }

            if (event.key == 'B') {
                if (event.ctrlKey) {
                    const searchbar = document.getElementsByClassName('gLFyf')[0];
                    location.href = "https://" + searchbar.value.replace("https://", "")
                }
            }

            if (event.key == 'и') {
                if (event.ctrlKey) {
                    const searchbar = document.getElementsByClassName('gLFyf')[0];
                    location.href = "https://" + searchbar.value.replace("https://", "")
                }
            }

            if (event.key == 'И') {
                if (event.ctrlKey) {
                    const searchbar = document.getElementsByClassName('gLFyf')[0];
                    location.href = "https://" + searchbar.value.replace("https://", "")
                }
            }

    })};

    //Quick words
    const searchbar = document.getElementsByClassName('gLFyf')[0];

    if (ENABLE_QUICKS = true) {
        searchbar.oninput = (event) => {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0');
            var yyyy = today.getFullYear();

            today = dd + '.' + mm + '.' + yyyy;

            function getRandomInt(min, max) {
                min = Math.ceil(min);
                max = Math.floor(max);
                return Math.floor(Math.random() * (10 - min) + min);
            }

            const inputValue = event.currentTarget.value;
            event.currentTarget.value = event.currentTarget.value.replace("f dt ", today+" ").replace("f y ", yyyy+" ").replace("f m ", mm+" ").replace("f d ", dd+" ").replace("f yt ", "YouTube ").replace("f tt ", "TikTok ").replace("f tg ", "Telegram").replace("f re ", "Reddit ").replace("f twi ", "Twitter ").replace("f h ", "http://").replace("f hs ", "https://").replace(":inf:", "∞ ").replace(":pi:", "π ").replace(":/:", "÷ ").replace(":*:", "× ").replace("f pi ", "3.14159265359 ").replace("f e ", "2.71828 ").replace("f wi ", "Wikipedia").replace("f rnd ", getRandomInt(0, 9)+" ").replace("f recur ", event.currentTarget.value)
    }};


    if (HIDE_SEARCH_BUTTONS == true) {
        $(".Umvnrc").css('display', 'none')
        $(".XDyW0e").css('display', 'none')
        $(".nDcEnd").css('display', 'none')
        $(".Tg7LZd").css('display', 'none')
        $(".dRYYxd").css('display', 'none')
    }

    if (HIDE_SEARCH_ICON == true) {
        $(".CcAdNb").css('display', 'none')
    }

    if (SEARCH_CENTERED == true) {
        $(".gLFyf").css('text-align', 'center')
    }

    if (CUSTOM_LOGO == true) {
        $(".lnXdpd").replaceWith('<img class="lnXdpd" alt="Google" height="92" src="'+LOGO+'" width="272" data-atf="1" data-frt="0">')
    }

    if (CUSTOM_SMALL_LOGO == true) {
        $(".jfN4p").replaceWith('<img class="jfN4p" src="'+SMALL_LOGO+'" style="background:none" alt="Google" height="30" width="92" data-atf="1" data-frt="0">')
    }

    if (HIDE_LOGO == true) {
        $(".lnXdpd").css('display', 'none')
    }
})();