// ==UserScript==
// @name           Avanza fiddler
// @name:sv        Avanza fix o trix
// @description	   Some Avanza site tweaks to ease the trading day
// @description:sv Lite Avanza site uppdateringar för att underlätta trading dagen
// @author         pegr69
// @include        https://www.avanza.se/*
// @version        0.9.1
// @namespace      https://greasyfork.org/users/593500
// @copyright      2020, Peter Grape
// @license        CDDL-1.0
// @run-at         document-end
// @grant          none

// @downloadURL https://update.greasyfork.org/scripts/405377/Avanza%20fiddler.user.js
// @updateURL https://update.greasyfork.org/scripts/405377/Avanza%20fiddler.meta.js
// ==/UserScript==

window.addEventListener("load", init, false);
window.addEventListener("keydown", keytrap, true);

function keytrap (e) {

   // let prevButton = document.getElementsByClassName('fa fa-angle-left')[0];
   // let nextButton = document.getElementsByClassName('fa fa-angle-right')[0];

    try {
     //  let isFirstPage = prevButton.parentElement.parentElement.className == "disabled";
     //  let isLastPage = nextButton.parentElement.parentElement.className == "disabled";

    if (window.name === "orderWindow") {
        // console.info("Avanza Orderwindow");
        if (e.keyCode == 37) { // Left arrow press
           console.log("Adding shares count...");
        }
        else if (e.keyCode == 39) { // Right arrow press
            console.log("Deleting shares count...");
        }
    }
    }
    catch(error) {
        // No navigation present.
    }

}

// Adds a simple external tweak to the Avanza links.
// Minor fixes for order window

function init()
{
  console.info("Init Avanza Fiddler, version 0.9.1");
  // Tweak all links to external target.
  tweaklinks(document);
  // Fix order window
  fixordervindow(document);
}

// Resize and remove unnecessary crap
function fixordervindow(doc)
{
    if (window.name === "orderWindow") {
        console.info("Avanza Orderwindow");
        window.resizeTo(858,774);
        let azaheader=doc.getElementsByTagName("aza-header")[0];
        let azamenu=doc.getElementsByTagName("aza-menu")[0];
        let azapmenu=doc.getElementsByTagName("aza-personal-menu")[0];
        let azafooter=doc.getElementsByTagName("aza-footer")[0];

        azaheader.style.display="none";
        azamenu.style.display="none";
        azapmenu.style.display="none";
        azafooter.style.display="none";
    }
}

// Add an external target to all valid title links

function tweaklinks(doc)
{
    // Do not touch these link titles
  let ignoreTitles=["Lägg till","Ta Bort"];
  let mapfixedlinks = [
      { href: 'https://www.avanza.se/hall-koll/min-borsskarm.html', name: 'borsskarm' },
      { href: 'https://www.avanza.se/min-ekonomi/oversikt.html', name: 'oversikt' },
      { href: 'https://www.avanza.se/hem/senaste.html', name: 'senaste' },
      { href: 'https://www.avanza.se/min-profil/installningar.html', name: 'installningar' }
  ];
    // find all links, add external attribute if not set.
  for (let a,i=0; a=doc.getElementsByTagName("a")[i]; ++i) {
    if (a.target === "") {
      if (a.title === "") {
          // console.log("AH:" + a.href);

          let ml = mapfixedlinks.find(function(element) {
              return a.href == element.href;
          });

          if ( ml != null ){
              a.target = ml.name;
              }

      }else {
          let ignore = false;
          ignoreTitles.forEach(function(value){
              let t = a.title.search(value);
              if (t != -1) {
                  console.info("Ignoring:" + value + " for title:" + a.title);
                  ignore = true;
              }
           });
          if ( ! ignore ) {
              a.target = a.title;
          }
      }
    }
  }
}
