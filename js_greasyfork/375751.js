

// ==UserScript==
// @name     heise dark
// @description Dieses Skript ist der einfache Versuch die heise.de Seite dark erscheinen zu lassen
// @version  1.12
// @license GNU GPLv3
// @grant    none
// @match https://*.heise.de/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @namespace https://greasyfork.org/users/233939
// @downloadURL https://update.greasyfork.org/scripts/375751/heise%20dark.user.js
// @updateURL https://update.greasyfork.org/scripts/375751/heise%20dark.meta.js
// ==/UserScript==
var bgcolor = '#333';
var txtcolor = '#ddd';
var txtcoloractive = '#fff'
var lnkcolor = '#e6e6dd';
 
$('body').css({'background-color' : bgcolor, 'color' : txtcolor});
$('header').css({'background-color' : bgcolor, 'color' : txtcolor});
$('span').css({'background-color' : bgcolor, 'color' : txtcolor});
$('a').css({'background-color' : bgcolor, 'color' : '#e6e6ff'});
$('h1').css({'background-color' : bgcolor, 'color' : txtcolor});
$('h2').css({'background-color' : bgcolor, 'color' : txtcolor});
$('h3').css({'background-color' : bgcolor, 'color' : txtcolor});
$('h4').css({'background-color' : bgcolor, 'color' : txtcolor});
$('p').css({'background-color' : bgcolor, 'color' : txtcolor});
$('li').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.container').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.content').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.topbar').css({'background-color' : bgcolor, 'color' : txtcolor, 'border-bottom': '0px'});
$('.asset__title').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.asset').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.kasten').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.kasten--ixtract').css({'background-color' : bgcolor, 'color' : txtcolor, 'border' : '0px'});
$('.kasten__header').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.kasten__content').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.stage-container').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.stage').css({'border-bottom' : '0px'});
$('.video-stage-grid').css({'border-bottom' : '0px'});
$('.newsroll-message').css({'border-bottom' : '0px'});
$('.main-footer').css({'border-top' : '0px'});
$('.stage-container').css({'border-top' : '0px'});
$('#container_content').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.ho-stage-container').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.topnavigation').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.topnavigation__content').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.header-main').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.header-main__label').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.nav-keywords__label').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.toolbar').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.nav').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.nav--toolbar').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.nav__list').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.nav__link').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.nav__text').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.breadcrumb').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.active').css({'background-color' : bgcolor, 'color' : txtcoloractive});
$('.mitte').css({'background-color' : bgcolor, 'color' : txtcolor});
$('#mitte').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.akwa-article').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.a-layout').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.a-article-teaser__kicker').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.a-article-teaser__title-text').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.a-article-teaser__synopsis').css({'background-color' : bgcolor, 'color' : txtcolor + '!important'});
$('a-article-teaser__link').css({'background-color' : bgcolor, 'color' : txtcolor + '!important'});
$('a-article-teaser__title').css({'background-color' : bgcolor, 'color' : txtcolor + '!important'});
$('.topnavigation-login__icon').css({'fill' : txtcolor});
 
setTimeout(function() {
    var login_links = document.querySelectorAll('.a-login__link:link');
    for (var i = 0; i < login_links.length; i++) {
      login_links[i].style.color = txtcolor;
    }
}, 2000);
 
 
$('.a-theme').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.a-article-meta__item').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.article-layout__content').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.article-content').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.article-branding').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.keyword-alphabet__list').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.ob-dynamic-rec-container').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.ob-dynamic-rec-link').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.ob-unit').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.ob-rec-text').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.ob-rec-source').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.ho-bg').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.keyword-alphabet__link').css({'border' : '0px'});
$('.nav-keywords__link').css({'border' : '0px'});
$('.header-main__nav').css({'border' : '0px'});
$('.AR_1.ob-strip-layout').css({'background-color' : bgcolor, 'color' : txtcolor});
$('#outbrain_widget_0').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.AR_1.ob-widget').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.ob-rec-image-container').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.ob-rec-label').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.ob-dynamic-rec-container').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.ob-recIdx-0').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.ob-p').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.teaser_adliste').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.akwa-ad-container').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.akwa-ad-container__microsite-list').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.hoteaser').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.shadow-modules').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.footer').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.leading-tight').css({'background-color' : bgcolor, 'color' : txtcolor});
$('.xp__asset__description').css({'background-color' : bgcolor, 'color' : txtcolor});
$('aside').css({'background-color' : '#3b3b40', 'color' : txtcolor});
$('.facette-off-canvas').css({'background-color' : '#3b3b40', 'color' : txtcolor});


