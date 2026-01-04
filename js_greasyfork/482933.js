// ==UserScript==
// @name         Orbánfilter
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  orbanfilter
// @author       otamata
// @match        https://24.hu/*
// @match        https://444.hu/*
// @match        https://444hsz.com/*
// @match        https://hvg.hu/*
// @grant        none
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/482933/Orb%C3%A1nfilter.user.js
// @updateURL https://update.greasyfork.org/scripts/482933/Orb%C3%A1nfilter.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const regex = /(orbán|szijjártó|rogán|migráns|fidesz|brüsszel|novák|mészáros)/;
    setInterval(function(){
        //444hsz.com
        $('h1.site span').each(function(){
            if ($(this).text().toLowerCase().match(regex)){
                $(this).closest('app-article-card').hide()
            }
        });
        $('.title').each(function(){
            if ($(this).text().toLowerCase().match(regex)){
                $(this).closest('.mat-row').hide()
            }
        });
        //24.hu
        $('article a').each(function(){
            if ($(this).text().toLowerCase().match(regex)){
                $(this).closest('article').hide()
            }
        });
        //444.hu
        $('article h1 a').each(function(){
            if ($(this).text().toLowerCase().match(regex)){
                $(this).closest('article').hide()
            }
        });
        $('.item h1 a').each(function(){
            if ($(this).text().toLowerCase().match(regex)){
                $(this).closest('.item').hide()
            }
        });
        $('li h3 a').each(function(){
            if ($(this).text().toLowerCase().match(regex)){
                $(this).closest('li').hide()
            }
        });
        //hvg.hu
        $('article a').each(function(){
            if ($(this).text().toLowerCase().match(regex)){
                $(this).closest('article').hide()
            }
        });
    },2000);
})();
