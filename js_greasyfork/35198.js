// ==UserScript==
// @name        Readable Wikipedia
// @description Makes wikipedia easier to read (smaller line length, cleaner). See https://github.com/nixterrimus/readable-wikipedia.
// @namespace   https://github.com/nixterrimus/readable-wikipedia
// @include     http*://*.wikipedia.org/**
// @version     1.0
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/35198/Readable%20Wikipedia.user.js
// @updateURL https://update.greasyfork.org/scripts/35198/Readable%20Wikipedia.meta.js
// ==/UserScript==

// @resource    readableWikipediaCss https://raw.github.com/nixterrimus/readable-wikipedia/master/readable.css

function GM_addStyle_from_string(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}

//var cssSrc = GM_getResourceText ("readableWikipediaCss");

var cssSrc = `
/* Base Wikipedia Enhancement */

a, a:visited {
  text-decoration: none !important;
  color: black !important;
}

.reference {
  display: none !important;
}

.internal {
  display: none !important;
}

#mw-panel {
  display: none !important;
}

#mw-head {
  margin: 0 auto !important;
  background-color: white !important;
  border-bottom: 1px solid #AAA !important;
  padding-bottom: 13px !important;
}

#mw-head-base {
  background-image: none !important;
}

div#content {
  width: 800px !important;
  margin: 0 auto !important;
  background: none !important;
  padding: 4.25em 1.5em 1.5em 1.5em !important;
  border: none !important;
}

.infobox th {
  background-color: rgb(95, 95, 95) !important;
  color: white !important;
  font-weight: normal !imporant;
}

.infobox th a {
  color: white !important;
  font-weight: normal !imporant;
}

#siteNotice {
  display: none !important;
}

h2 {
  margin-top: 2em !important;
}

#mw-page-base {
  height: auto !important;
}

#siteSub {
  display: none !important;
}

.metadata {
  display: none !important;
}

.catlinks {
  display: none !important;
}

.Template-Fact {
  display: none !important;
}

div#content a.external {
  background: none !important;
}

.topicon {
  display: none !important;
  right: 9999px !important;
}

.icone_de_titre {
  display: none !important;
}

#coordinates {
  display: none !important;
}

#p-personal {
  display: none !important;
}

#left-navigation {
  display: none !important;
}

#right-navigation {
  margin-top: 0px !important;
}

#p-views {
  display: none !important;
}

#mw-body {
  margin-left: 0px !important;
}

#protected-icon {
  display: none !important;
}

.dablink {
  display: none !important;
}

#mw-articlefeedback {
  display: none !important;
}

.editsection {
  display: none !important;
}

#footer {
  text-align: center !important;
  background: none !important;
  margin: 0 0 !important;
  background-color: white !important;
  border-top: 1px solid #AAA !important;
}

#footer-places {
  display: none !important;
}

#footer img {
  display: none !important;
}

.tleft {
  margin: 1.5em 1.4em 1.3em 0 !important;
}

/* I'm really not sure about this change,
 * Eventually I'd like the TOC accessible
 * via a side menu, for now this is experimental
 * and might change
*/

#toc {
  display: none !important;
}

/* Reading Enhacements */

* {
  line-height: 1.7em !important;
}

p {
  font-size: 1.2em !important;
  margin-top: 1.4em !important;
}

/* File Enhancements */


#filetoc {
  display: none !important;
}

#file img {
  width: 100% !important;
  height: auto !important;
}

.fullMedia, .sharedUploadNotice, #mw-imagepage-section-linkstoimage, #filelinks, #mw-imagepage-section-filehistory, #filehistory, #mw-imagepage-section-globalusage, #globalusage, #mw-imagepage-content, #template-picture-of-the-day, #metadata, .mw-imagepage-section-metadata, .mw-filepage-resolutioninfo {
  display: none !important;
}

/* Scripted in styles */
#logo {
  margin: .5em auto auto 1em;
}

.visible-link {
  color: #2B77BD !important;
}

#enhancement_credit {
  font-size: 12px !important;
}

.mw-editsection {
  display: none !important;
}

.mobile {
  display: none !important;
}

/* Responsive breakpoints */

@media screen and (max-width: 850px) {
  div#content {
    width: 600px !important;
  }
  .thumb, .tright, .left {
    display: block !important;
    float: none !important;
  }
  #mw-articlefeedbackv5 {
    display: none !important;
 }
}

@media screen and (max-width: 650px) {
  div#content {
    width: 320px !important;
  }
  #firstHeading {
    width: 100% !important;
  }

  .desktop {
    display: none !important;
  }

  .mobile {
    display: block !important;
  }

  .infobox {
    display: block !important;
    float: none !important;
    margin: 1em auto !important;
   }
}

/* MY CODE */

   body{-webkit-hyphens:auto;-moz-hyphens:auto;-ms-hyphens:auto;-o-hyphens:auto;hyphens:auto; text-align:justify}
   a, a:visited {color: rgb(43, 119, 189) !important}
   #mw-head {display: none}
   div#content {width: 600px !important; padding-top: 1em !important}

`;

GM_addStyle_from_string(cssSrc);
document.getElementById("References").parentNode.nextSibling.nextSibling.style.display = "none" 