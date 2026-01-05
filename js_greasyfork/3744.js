// ==UserScript==
// @name       babbel_for_notebooks.tamper.js
// @version    0.8.9.17
// @description  This script is used for www.babbel.com. I need it for using the function 'repeating manager' on a small notebook monitor. My aim was to eliminate as much unnecessary white space as possible to display more content on the notebook screen height, and to increase the contrast by using black fonts instead of gray fonts. 
// @include      http://www.babbel.com/*
// @include      https://www.babbel.com/*
// @author     Thorsten Albrecht
// @copyright  2014, Thorsten Albrecht
// @namespace https://greasyfork.org/users/4015
// @downloadURL https://update.greasyfork.org/scripts/3744/babbel_for_notebookstamperjs.user.js
// @updateURL https://update.greasyfork.org/scripts/3744/babbel_for_notebookstamperjs.meta.js
// ==/UserScript==

//last changes: 
// - migration to greasyfork

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

//Hauptnavigationsleiste Wiederholmanager und Wiederholungsdialog
addGlobalStyle('.navbar .nav>li>a {padding: 4px 15px; }'); //schmalere Leiste
addGlobalStyle('.learningComponent.center-wrap > header {height: 2.3em;}'); //schmalere Leiste im Wiederholdialog
addGlobalStyle('.navbar-inner {min-height: 0; }'); //keine Mindesthöhe
addGlobalStyle('.navbar+.container {padding-top: 50px; }'); //Abstand zum Hauptteil schmaler
addGlobalStyle('.brand .logo {height: 16px; width: 64px; background-size: contain; -webkit-background-size: contain; -moz-background-size: contain; -o-background-size: contain; }'); //Logo runterskalieren


//Wiederholmanager: Löschen unnötiger Überschriften und Elemente
addGlobalStyle('.babbel_hr_lightgrey {display: none;}'); //keine graue Trennlinie nach der Überschrift
addGlobalStyle('#mywords-head-inner > div > p.description {display: none;}'); //keine Aufforderung zum "Diskutieren"

//Wiederholmanager: Säulengrafik "gelernte Wörter" oben verschlanken
addGlobalStyle('#mywords-head {margin-bottom: 5px; }');
addGlobalStyle('#mywords-head div.wrapper  {margin: 0; padding: 5px 0;}'); //schmaler
addGlobalStyle('.navbar+.container  {padding-top: 40px !important;}'); //Abstand Hauptnavigation zum Container der Säulengrafik kleiner
addGlobalStyle('#mywords-head legend {display: none !important;}'); //keine Beschriftungen über Button und Grafik

addGlobalStyle('#mywords-head-inner > div:first-child {display: none;}'); //Überschriften ausblenden "Dein Wortschatz"/"Wie funktioniert der Wiederholmanager"

//addGlobalStyle('h2.title {margin-bottom: 0; }'); //Überschrift "Dein Wortschatz"
//addGlobalStyle('#mywords-head .babbel_h2 {font-size: 15px; font-weight: bold;}'); //Überschrift "Dein Wortschatz"
//addGlobalStyle('#mywords-head .babbel_h2 {display: none;}'); //Überschrift "Dein Wortschatz" ausblenden
//addGlobalStyle('#mywords-head .babbel_h5 {display: none;}'); //Überschrift "Wie funktioniert der Wiederholmanager" ausblenden


addGlobalStyle('a#start-review {padding: 0 10px 0 10px; margin-left: 0;}'); //Buttonbeschriftung kleiner
//addGlobalStyle('#mywords-head-inner {position: absolute; bottom: -20px;}'); //Säulengrafik der versch. Lernstufen nach unten verschieben


//Wiederholmanager: Vokabelliste
addGlobalStyle('#mywords-content .toolbar {height: 35px; padding-top: 5px;}'); //Filterleiste über der Tabelle
addGlobalStyle('#mywords-content table#words thead tr th  {padding-top: 0; padding-bottom: 0; }'); //Header
addGlobalStyle('#mywords-content table#words tbody tr td  {color: black; font-size: 1.1em; }'); // Fonts: größer und schwarz
addGlobalStyle('#mywords-content table#words .image img  {padding-top: 0px !important; padding-bottom: 0px !important; }'); // Tabellenzeilen schmaler


//-----im Wiederholungsmodus-----

//Hauptmenü + Titel "Schreibe d. Übersetzung"
addGlobalStyle('.page-component {margin-top: -1.0em !important;}');
addGlobalStyle('#mywords-head #learn-levels .inner legend {padding-bottom: 0;}'); //learning levels

addGlobalStyle('.reference-language {color: black; font-size: 1.0em;} '); //deutscher Begriff unter input 
addGlobalStyle('.learning-language .text-box {color: black;} '); //Übersetzungseingabe (vorausgefüllte Übersetzung davor, z.B. Artikel)
addGlobalStyle('input[type="text"] {color: black;}'); //Input box für Übersetzung
