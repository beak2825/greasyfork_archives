// ==UserScript==
// @name         IP-Phone-Forum
// @version      0.7
// @description  Einige kleine Anpassungen
// @author       rabe85
// @include      *ip-phone-forum.de/*
// @exclude      *ip-phone-forum.de/conversations/*
// @grant        none
// @namespace    https://greasyfork.org/users/156194
// @downloadURL https://update.greasyfork.org/scripts/34258/IP-Phone-Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/34258/IP-Phone-Forum.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function ipfforum() {

        var url_path = window.location.pathname;
        var url_array = url_path.split("/");
        var url_array_lenght = url_array.length - 1;
        var url_switch = url_array[url_array_lenght];

        // Style herausfinden
        var style = document.getElementsByClassName('OverlayTrigger Tooltip')[0].innerHTML;

        if(style == 'Xenith') {

            // Sidebar ausblenden (außer bei PNs / Unterhaltungen)
            $('.uix_mainSidebar').remove();

            // Seite breiter darstellen
            var page_width_xenith0 = document.getElementsByClassName('mainContainer');
            for(var pwx = 0, page_width_xenit; !!(page_width_xenit=page_width_xenith0[pwx]); pwx++) {
                page_width_xenit.setAttribute('style','float:none; width:auto;');
            }

            // Abstand zwischen BreadBox und Content erzwingen
            var breadbox_content0 = document.getElementsByClassName('breadBoxTop');
            for(var bc = 0, breadbox_content; !!(breadbox_content=breadbox_content0[bc]); bc++) {
                breadbox_content.setAttribute('style','margin-top:25px; margin-right:0px; margin-bottom:25px; margin-left:0px;');
            }

            if(url_array[1] == 'forums' && !url_array[2]) {
                // BreadBox anzeigen
                var breadbox_show0 = document.getElementsByClassName('uix_contentFix');
                for(var bs = 0, breadbox_show; !!(breadbox_show=breadbox_show0[bs]); bs++) {
                    breadbox_show.insertAdjacentHTML('beforebegin', '<div class="breadBoxTop" style="margin-top:25px; margin-right:0px; margin-bottom:25px; margin-left:0px;"><div class="topCtrl homeTopButton"><a href="find-new/posts?recent=1" class="callToAction" rel="nofollow"><span>Aktuelle Themen</span></a></div><div class="topCtrl homeTopButton findNewPostsButton"><a href="find-new/posts" class="callToAction" rel="nofollow"><span>Neue Beitr&auml;ge</span></a></div><nav><fieldset class="breadcrumb" style=""><a href="misc/quick-navigation-menu" class="OverlayTrigger jumpMenuTrigger" data-cacheoverlay="true" title="N&uuml;tzliche Links anzeigen"><i class="uix_icon uix_icon-sitemap"></i><!--Gehe zu...--></a><div class="boardTitle"><strong>IP-Phone-Forum</strong></div><span class="crumbs"><span class="crust homeCrumb" itemscope="itemscope" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="https://www.ip-phone-forum.de/forums/" class="crumb" rel="up" itemprop="url"><span itemprop="title"><i class="uix_icon uix_icon-home" title="Startseite"></i><span class="uix_breadcrumb__home__title">Startseite</span></span></a><span class="arrow"><i class="uix_icon uix_icon-breadcrumbSeparator"></i></span></span><span class="crust selectedTabCrumb" itemscope="itemscope" itemtype="http://data-vocabulary.org/Breadcrumb"><a href="https://www.ip-phone-forum.de/forums/" class="crumb" rel="up" itemprop="url"><span itemprop="title">Foren</span></a><span class="arrow"><i class="uix_icon uix_icon-breadcrumbSeparator"></i></span></span></span></fieldset></nav></div>');
                }
            } else {
                // BreadBox erweitern
                var breadbox_expand0 = document.getElementsByClassName('breadBoxTop');
                for(var be = 0, breadbox_expand; !!(breadbox_expand=breadbox_expand0[be]); be++) {
                    breadbox_expand.insertAdjacentHTML('afterbegin', '<div class="topCtrl homeTopButton"><a href="find-new/posts?recent=1" class="callToAction" rel="nofollow"><span>Aktuelle Themen</span></a></div><div class="topCtrl homeTopButton findNewPostsButton"><a href="find-new/posts" class="callToAction" rel="nofollow"><span>Neue Beitr&auml;ge</span></a></div>');
                }
            }

            // Unterforen in der Übersicht schmaler darstellen
            var subforum_small0 = document.getElementsByClassName('nodeTitle');
            for(var ss = 0, subforum_small; !!(subforum_small=subforum_small0[ss]); ss++) {
                subforum_small.setAttribute('style','padding:1px; display:inline;');
            }

            if(url_array[1] == 'threads') {

                // Navigationspfeile bei Beitragsnummer hinzufügen
                var nav_angle0 = document.getElementsByClassName('item muted postNumber hashPermalink OverlayTrigger');
                for(var na = 0, nav_angle; !!(nav_angle=nav_angle0[na]); na++) {
                    var nav_threadcount = document.getElementsByClassName('sectionMain message     ').length - 2;
                    var nav_golast_link = '<a href="javascript: void(0)" onclick="audentio.pagination.scrollToPost(' + nav_threadcount + ')" style="float:right;" title="Zum letzten Beitrag"><i class="fa fa-angle-double-down pointer fa-fw pagebottom"></i></a>';
                    var nav_goafter_link = '<a href="javascript: void(0)" onclick="audentio.pagination.nextPost()" style="float:right;" title="Zum nächsten Beitrag"><i class="fa fa-angle-down pointer fa-fw pagedown"></i></a>';
                    var nav_gobefore_link = '<a href="javascript: void(0)" onclick="audentio.pagination.prevPost()" style="float:right;" title="Zum vorherigen Beitrag"><i class="fa fa-angle-up pointer fa-fw pageup"></i></a>';
                    var nav_gofirst_link = '<a href="javascript: void(0)" onclick="audentio.pagination.scrollToPost(0)" style="float:right;" title="Zum ersten Beitrag"><i class="fa fa-angle-double-up pointer fa-fw pagetop"></i></a>';
                    nav_angle.outerHTML = nav_golast_link + nav_goafter_link + nav_angle.outerHTML + nav_gobefore_link + nav_gofirst_link;
                }

                // Abstand zwischen Rahmen und Avatar hinzufügen - Thema
                var thread_avatar0 = document.getElementsByClassName('avatarHolder');
                for(var ta = 0, thread_avatar; !!(thread_avatar=thread_avatar0[ta]); ta++) {
                    thread_avatar.setAttribute('style','margin:5px; border:0px;');
                }

                // Abstand zwischen Rahmen und Avatar hinzufügen - Quick Reply
                var quickreply_avatar = document.getElementsByClassName('quickReply message sectionMain')[0];
                quickreply_avatar.getElementsByClassName('messageUserInfo')[0].setAttribute('style','margin:5px; border:0px;');
                quickreply_avatar.getElementsByClassName('avatarHolder')[0].setAttribute('style','');

                // Abstand bei Signatur löschen
                var signatur_abstand0 = document.getElementsByClassName('signature');
                for(var sa = 0, signatur_abstand; !!(signatur_abstand=signatur_abstand0[sa]); sa++) {
                    signatur_abstand.setAttribute('style','margin-bottom:0px; padding-top:0px; padding-bottom:0px;');
                }

            }

        } else { // Default Style

            // Sidebar ausblenden (außer bei PNs / Unterhaltungen)
            $('.sidebar').remove();

            // Seite breiter darstellen
            var page_width_default0 = document.getElementsByClassName('mainContent');
            for(var pwd = 0, page_width_default; !!(page_width_default=page_width_default0[pwd]); pwd++) {
                page_width_default.setAttribute('style','margin-right:0px;');
            }

        }


        function changequote() {

            // Zitate immer vollständig anzeigen
            var quote_style = document.createElement("STYLE");
            var quote_text = document.createTextNode(".bbCodeQuote .quoteContainer .quoteExpand.quoteCut {display: none;} html .bbCodeQuote .quoteContainer .quote {max-height: none;}");
            quote_style.appendChild(quote_text);
            document.head.appendChild(quote_style);

            // Zitate, Code breiter darstellen
            var quote_width0 = document.getElementsByClassName('bbCodeBlock');
            for(var qw = 0, quote_width; !!(quote_width=quote_width0[qw]); qw++) {
                quote_width.setAttribute('style','margin-top:1em; margin-right:0px; margin-bottom:20px; margin-left:0px;');
            }

            // Abstand bei Zitaten schmaler darstellen - Titelzeile
            var quote_header0 = document.getElementsByClassName('type');
            for(var qh = 0, quote_header; !!(quote_header=quote_header0[qh]); qh++) {
                quote_header.setAttribute('style','padding-top:1px; padding-right:5px; padding-bottom:1px; padding-left:5px;');
            }

        }

        // Zitatänderungen immer aktualisieren
        window.addEventListener('load', changequote, false);
        window.addEventListener('mouseover', changequote, false);
        window.addEventListener('scroll', changequote, false);

    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        ipfforum();
    } else {
        document.addEventListener("DOMContentLoaded", ipfforum, false);
    }

})();