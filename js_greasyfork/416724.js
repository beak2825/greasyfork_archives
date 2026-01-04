// ==UserScript==
// @name Colruyt - bredere boodschappenlijst
// @namespace http://tampermonkey.net/
// @version 0.7.0
// @description Maak de boodschappenlijst op de site van de Colruyt breder
// @author Stijn Bousard | boossy
// @match https://www.colruyt.be/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/416724/Colruyt%20-%20bredere%20boodschappenlijst.user.js
// @updateURL https://update.greasyfork.org/scripts/416724/Colruyt%20-%20bredere%20boodschappenlijst.meta.js
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
// addGlobalStyle('.shopping-list { width: 480px; !important; } ');
// below code for media queries - see https://stackoverflow.com/questions/45568947/override-styles-in-media-queries-with-custom-css
// .class.class has higher specificity than .class ... it is bad, but may cause less problems than !important
addGlobalStyle('.shopping-list-bar.shopping-list-bar { width: 480px; } ');
addGlobalStyle('.shopping-list.shopping-list { width: 480px; } ');
// addGlobalStyle('.main.horizontal-nav .main__wrapper { padding-left: 0px; padding-right: 192px; } ');
// addGlobalStyle('.main.horizontal-nav .main__wrapper { width: 1440px; } ');
addGlobalStyle('.main.horizontal-nav .main__wrapper { padding: 0 12px; padding-right: 194px; } ');