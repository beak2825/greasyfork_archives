// ==UserScript==
// @name         PV Forum
// @namespace    https://greasyfork.org/users/156194
// @version      1.0
// @description  Anpassungen für das PV Forum
// @author       rabe85
// @match        https://www.photovoltaikforum.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=photovoltaikforum.com
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/531506/PV%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/531506/PV%20Forum.meta.js
// ==/UserScript==

// Todo:
// - Doppelter Klick nach Herabscrollen mit offenem Usermenü nötig, um es wieder zu öffnen

(function() {
    'use strict';

    function pv_forum() {

        // Funktion - Header nur beim Hochscrollen oben am Rand anzeigen
        var sticky_header_scroll_position_old = 0;
        function sticky_header_scroll() {
            var sticky_header_scroll_position = document.documentElement.scrollTop;
            if(sticky_header_scroll_position < sticky_header_scroll_position_old) {
                document.getElementsByClassName('pageHeaderPanel')[0].setAttribute('style','position: fixed;top: 0px;width: 100%;z-index: 23585;');
            } else {
                document.getElementsByClassName('pageHeaderPanel')[0].setAttribute('style','position: absolute;');
                var usermenu_close0 = document.getElementsByClassName('userMenu');
                for(var umc = 0, usermenu_close; !!(usermenu_close=usermenu_close0[umc]); umc++) {
                    usermenu_close.setAttribute('hidden','');
                }
            }
            sticky_header_scroll_position_old = sticky_header_scroll_position;
        }

        //Funktion - Usermenü bei normalem Header beim Herunterscrollen schließen
        function header_scroll_normal() {
            var header_scroll_position_normal = document.documentElement.scrollTop;
            if(header_scroll_position_normal > sticky_header_scroll_position_old) {
                var usermenu_close_normal0 = document.getElementsByClassName('userMenu');
                for(var umcn = 0, usermenu_close_normal; !!(usermenu_close_normal=usermenu_close_normal0[umcn]); umcn++) {
                    usermenu_close_normal.setAttribute('hidden','');
                }
            }
        }

        // Headerfunktion auswählen
        var header_auswahl = GM_getValue('header_auswahl', 'normal');
        var header_auswahl_text = 'Kopfzeile: Normal';
        var header_auswahl_status = 'fixed';

        switch(header_auswahl) {
            case 'fixed': // Header immer fest oben am Rand anzeigen
                document.getElementsByClassName('pageHeaderPanel')[0].setAttribute('style','position: fixed;top: 0px;width: 100%;z-index: 23585;');
                header_auswahl_text = 'Kopfzeile: Fixiert';
                header_auswahl_status = 'scroll';
                break;
            case 'scroll': // Header nur beim Hochscrollen oben am Rand anzeigen
                document.addEventListener("scroll", sticky_header_scroll, false);
                header_auswahl_text = 'Kopfzeile: Hochscrollen';
                header_auswahl_status = 'normal';
                break;
            default: // Header normal anzeigen
                document.getElementsByClassName('pageHeaderPanel')[0].setAttribute('style','position: absolute;');
                document.addEventListener("scroll", header_scroll_normal, false);
        }
        var usermenu = document.getElementsByClassName('userMenu userMenuControlPanel')[0];
        if (usermenu) {
            usermenu.getElementsByClassName('userMenuContent')[1].insertAdjacentHTML('afterend', '<div class="userMenuItem userMenuItemNarrow userMenuItemSingleLine"><div class="userMenuItemImage"><fa-icon size="16" name="minus" solid="" aria-hidden="true" translate="no"></fa-icon></div><div class="userMenuItemContent"><a id="header_auswahl_menu" data-status="' + header_auswahl_status + '" title="Klicken zum Wechseln zwischen Normal, Fixiert und Hochscrollen" style="cursor: pointer;color: inherit;">' + header_auswahl_text + '</a></div></div>');
        }
        function header_auswahl_speichern() {
            if(header_auswahl != document.getElementById('header_auswahl_menu').dataset.status) { GM_setValue('header_auswahl', document.getElementById('header_auswahl_menu').dataset.status); }
            //window.scrollTo(0, 0);
            location.reload();
        }
        document.getElementById('header_auswahl_menu').addEventListener("click", header_auswahl_speichern, false);

        // Werbung ausblenden
        var ad_thread0 = document.querySelectorAll('.wcfAdLocation, .wcfAdLocationHeaderContent, .wbbAdLocationIn1stPost, #ad_position_box, div[id^="google_ads_iframe"], iframe[name^="goog_topics_frame"], img[src^="https://ad-delivery.net/"], img[src^="https://ad.doubleclick.net/"], img[id^="adg-"], iframe[id^="adg-"], div[id^="adunit"], .symplr-ad-holder');
        for(var adt = 0, ad_thread; !!(ad_thread=ad_thread0[adt]); adt++) {
            ad_thread.remove();
        }

        var url_path = window.location.pathname;
        var url_array = url_path.split("/");

        // Rechte Seitenleiste auf den Übersichten ausblenden, Schlagworte unten anzeigen
        if(url_array[1] == 'board' || url_array[1] == 'active-topic-list' || url_array[1] == 'own-posts-as-threads' || url_array[1] == 'unread-thread-list' || url_array[1] == 'watched-thread-list' || url_array[1] == 'unanswered-thread-list') {
            var main = document.getElementsByClassName('main')[0];
            if(main) {
                var layoutboundary = main.getElementsByClassName('layoutBoundary')[0];
                if(layoutboundary) {
                    var schlagworte = layoutboundary.getElementsByClassName('sidebar boxesSidebarRight')[0].querySelector('section[data-box-identifier="com.woltlab.wbb.BoardTagCloud"]');
                    layoutboundary.getElementsByClassName('sidebar boxesSidebarRight')[0].remove();
                    layoutboundary.getElementsByClassName('content content--sidebar-right')[0].setAttribute('class','content');
                }
                if(schlagworte) {
                    main.insertAdjacentHTML('afterend', '<div style="border: 1px solid var(--wcfContentContainerBorder);background-color: var(--wcfContentContainerBackground);border-radius: 10px;padding: 20px;margin: 20px;margin-top: 0px;">' + schlagworte.innerHTML + '</div>');
                }
            }
        }

    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        pv_forum();
    } else {
        document.addEventListener("DOMContentLoaded", pv_forum, false);
    }

})();