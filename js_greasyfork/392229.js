// ==UserScript==
// @name         Fix Twitch
// @namespace    323851-gjwse90gj98we
// @version      0.9
// @description  Undo the nasty parts of the new twitch layout
// @author       Viper-7, anon
// @match        https://www.twitch.tv/*
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392229/Fix%20Twitch.user.js
// @updateURL https://update.greasyfork.org/scripts/392229/Fix%20Twitch.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

(function() {
  'use strict';
  

    var e = document.getElementsByTagName( 'html' )[0];
    //e.setAttribute( 'class', 'tw-root--theme-dark' );
  
  if (e.classList.contains('tw-root--theme-dark')) {
    addGlobalStyle('html .tw-c-text-alt-2 { color: #898395 !important; }');
    addGlobalStyle('html .tw-semibold { font-weight: 400 !important; }');
    addGlobalStyle('html .tw-c-text-alt { color: #b8b5c0 !important; }');
    addGlobalStyle('html section.chat-room { background-color: rgb(15,14,17) !important; }');
    addGlobalStyle('html div.channel-root__right-column { background-color: #232127 !important; }');
    addGlobalStyle('html .tw-c-text-base { color: #dad8de !important; }');
    addGlobalStyle('html .top-nav__menu { background-color: #4b367c !important; }');
    addGlobalStyle('html .tw-root--theme-dark body { background-color: #0f0e11 !important; }');
    addGlobalStyle('a, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important; }');
    addGlobalStyle('html .tw-font-size-4 { font-size: 1.4rem !important; font-weight: 400 !important; color: #b19dd8 !important; }');
    addGlobalStyle('html .tw-input { background-color: #232127 !important; }');
    addGlobalStyle('body { background-color: #18181b !important; }');
  }
   
    var observer = new MutationObserver(function (event) {
    console.log(event);
      

      
  if (localStorage.getItem("twilight.theme") == "1") {
    console.log('yes');
    addGlobalStyle('html .tw-c-text-alt-2 { color: #898395 !important; }');
    addGlobalStyle('html .tw-semibold { font-weight: 400 !important; }');
    addGlobalStyle('html .tw-c-text-alt { color: #b8b5c0 !important; }');
    addGlobalStyle('html section.chat-room { background-color: rgb(15,14,17) !important; }');
    addGlobalStyle('html div.channel-root__right-column { background-color: #232127 !important; }');
    addGlobalStyle('html .tw-c-text-base { color: #dad8de !important; }');
    addGlobalStyle('html .top-nav__menu { background-color: #4b367c !important; }');
    addGlobalStyle('html .tw-root--theme-dark body { background-color: #0f0e11 !important; }');
    addGlobalStyle('a, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important; }');
    addGlobalStyle('html .tw-font-size-4 { font-size: 1.4rem !important; font-weight: 400 !important; color: #b19dd8 !important; }');
    addGlobalStyle('html .tw-input { background-color: #232127 !important; }');
    addGlobalStyle('body { background-color: #18181b !important; }');
    addGlobalStyle('html .side-nav { background-color: #212126 !important; }');
    addGlobalStyle('html .side-nav .tw-svg__asset, html .side-nav .tw-icon__svg { fill: rgb(137, 131, 149) !important; }');

    //addGlobalStyle('html .side-nav .upsell-center-text__header { color: #19171c !important; }');
    //addGlobalStyle('html .side-nav .side-nav-card__link:hover { background: #2f2f37 !important; }');
    //addGlobalStyle('html .side-nav .side-nav-header { color: #fff !important; }');
    //addGlobalStyle('html .side-nav .tw-link { color: #772ce8 !important; }');
  } else {
    console.log('no');
    addGlobalStyle('html .tw-c-text-alt-2 { color: #898395 !important; }');
    addGlobalStyle('html .tw-semibold { font-weight: 400 !important; }');
    addGlobalStyle('html .tw-c-text-alt { color: #b8b5c0 !important; }');
    addGlobalStyle('html section.chat-room { background-color: #EFEEF1 !important; }');
    addGlobalStyle('html div.channel-root__right-column { background-color: #EFEEF1 !important; }');
    addGlobalStyle('html .tw-c-text-base { color: #dad8de !important; }');
    addGlobalStyle('html .top-nav__menu { background-color: #4b367c !important; }');
    
    addGlobalStyle('html .top-nav__menu .tw-font-size-4 { color: #fff !important; }');
    //.tw-input
    
    addGlobalStyle('html .tw-root--theme-dark body { background-color: #0f0e11 !important; }');
    addGlobalStyle('a, abbr, acronym, address, applet, article, aside, audio, b, big, blockquote, body, canvas, caption, center, cite, code, dd, del, details, dfn, div, dl, dt, em, embed, fieldset, figcaption, figure, footer, form, h1, h2, h3, h4, h5, h6, header, hgroup, html, i, iframe, img, ins, kbd, label, legend, li, mark, menu, nav, object, ol, output, p, pre, q, ruby, s, samp, section, small, span, strike, strong, sub, summary, sup, table, tbody, td, tfoot, th, thead, time, tr, tt, u, ul, var, video { font-family: "Helvetica Neue", Helvetica, Arial, sans-serif !important; }');
    addGlobalStyle('html .tw-font-size-4 { font-size: 1.4rem !important; font-weight: 400 !important; color: #19171c !important; }');
    addGlobalStyle('html .tw-input { background-color: #fff !important; }');
    addGlobalStyle('body { background-color: #FAF9FA !important; }');
    addGlobalStyle('html .side-nav { background-color: #17141F !important; }');
    addGlobalStyle('html .side-nav .tw-svg__asset, html .side-nav .tw-icon__svg, html .top-nav__menu .tw-icon__svg { fill: rgb(137, 131, 149) !important; }');
    addGlobalStyle('html .side-nav .upsell-center-text__header { color: #19171c !important; }');
    addGlobalStyle('html .side-nav .side-nav-card__link:hover { background: #2f2f37 !important; }');
    addGlobalStyle('html .side-nav .side-nav-header { color: #fff !important; }');
    addGlobalStyle('html .side-nav .tw-link { color: rgb(191, 148, 255) !important; }');
    

  }


  
})

observer.observe(e, {
  attributes: true, 
  attributeFilter: ['class'],
  childList: false, 
  characterData: false
})
  

})();

