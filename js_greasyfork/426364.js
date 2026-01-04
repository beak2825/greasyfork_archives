// ==UserScript==
// @name         DarkKundelik
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Простая тёмная тема для kundelik.kz
// @author       crasher16
// @match        https://kundelik.kz/*
// @match        https://schools.kundelik.kz/*
// @icon         https://www.google.com/s2/favicons?domain=kundelik.kz
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426364/DarkKundelik.user.js
// @updateURL https://update.greasyfork.org/scripts/426364/DarkKundelik.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //ZAGOLOVOK
    console.log(`%c DarkKundelik 1.0 %c ${"Activated"} %c `,
      'background:#35495e ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff',
      `background: #3BA776; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff`,
      'background:transparent')

/*      var consoleStyles = {
 				 'avtor1': 'padding: 0 .5rem; background: #bc42f5; font: 2.5em/1 Arial; color: white;',
				 'h1': 'font: 2.5em/1 Arial; color: crimson;',
				 'h2': 'font: 2em/1 Arial; color: orangered;',
				 'h3': 'font: 1.5em/1 Arial; color: olivedrab;',
				 'bold': 'font: bold 1.3em/1 Arial; color: midnightblue;',
				 'warn': 'padding: 0 .5rem; background: crimson; font: 1.6em/1 Arial; color: white;'
				};

				function log ( msg, style ) {
				  if ( !style || !consoleStyles[ style ] ) {
					style = 'bold';
				  }
				  console.log ( '%c' + msg, consoleStyles[ style ] );
				}

				log ( 'DarkKundelik Perfectly Works!', 'avtor1' ); */

    //CSS METOD
    function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
    //TEST - Begushyaya stroka - Tolko patsanam
/*     var logo = document.createElement("div");
    logo.innerHTML = '<div style="margin: 0 auto 0 auto; ' +
    'border-bottom: 1px solid #000000; margin-bottom: 5px; ' +
    'font-size: small; background-color: #000000; ' +
    'color: #ffffff;"><marquee behavior="scroll" style="margin: 2px 0 1px 0;" "direction="left"><p style="color:red;">Вперёд к светлому будущему! Раньше было лучше! Вперёд к светлому будущему! Раньше было лучше! </p></marquee></div>';

    document.body.insertBefore(logo, document.body.firstChild); */

    //IZMENENIYA
    addGlobalStyle('.page-wrapper { margin: 0 auto;width: 968px;position: relative;padding: 1px 0;background-color:#333336 !important; }'); //#a378a6
    addGlobalStyle('body { background-color:#222226 !important; }');
    addGlobalStyle('._31Whp { color:#fff !important; }'); //    border-radius: 20px
    addGlobalStyle('.page-header  { height: 180px;font-family: "Open Sans",Helvetica,Arial,sans-serif;font-size: 14px;margin: 0 auto;width: 968px;position: relative;background-color: #444446;border-radius: 20px 20px 0 0;z-index: 15 !important; }');
    addGlobalStyle('.header-menu { box-sizing: border-box;position: relative;height: 45px;width: 940px;border-radius: 5px 5px 0 0;margin: 0 14px 20px;padding-left: 0;background-color: #a378a6 !important; }');
    addGlobalStyle('.header-menu__link { display: block;height: 100%;padding: 0 20px;color: #fff;background-color: #a378a6;text-decoration: none;font-size: 14px;text-transform: uppercase;position: relative;letter-spacing: 1px;font-family: Open Sans Semibold,Helvetica,Arial,sans-serif !important; }');
    addGlobalStyle('.header-menu__item_active .header-menu__link { background-color: #966c99 !important; }');
    addGlobalStyle('.header-menu__link:hover { color:white !important; }');
    addGlobalStyle('.header-localization-select__info { display: inline-block;position: relative;z-index: 90;margin: 1px;padding: 7px 10px 7px 7px;background-color: #777777;-webkit-user-select: none;user-select: none;-moz-user-select: none;-ms-user-select: none; border-radius: 12px !important; }');
    addGlobalStyle('.header-localization-select__info_row-content { display: inline-block;margin: -1px -1px -1px -1px;text-align: left;color: #ffffff;font-weight: 600;height: 21px !important; }');
    addGlobalStyle('.header-links__link { text-decoration: none;color: #777777;font-family: "Open Sans";font-size: 12px;font-weight: 400;line-height: 17px;cursor: pointer;display: inline-block;line-height: 14px;padding-top: 2px;border-bottom: none !important; }');
    addGlobalStyle('.user-profile-box__initials { display: block;color: #a378a6;font-size: 13px;white-space: nowrap;overflow: hidden;text-overflow: ellipsis;max-width: 160px !important; }');
    // doesn't work - addGlobalStyle('._2MkRL { position: relative;padding: 59px 64px 0;line-height: 1.4;border: thin solid #333336;border-radius: 5px;background: #444446 url(/client/efc36b0….png) no-repeat 50% 16px;-webkit-box-sizing: border-box;box-sizing: border-box !important; }');



})();