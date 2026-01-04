// ==UserScript==
// @name         Laserdisken
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Forbedret layout på laserdisken.dk og lasernet.dk
// @author       Martin Larsen
// @match        https://www.laserdisken.dk/*
// @match        https://laserdisken.dk/*
// @grant        GM_addStyle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/469726/Laserdisken.user.js
// @updateURL https://update.greasyfork.org/scripts/469726/Laserdisken.meta.js
// ==/UserScript==

/* globals $ */

(function() {

  if (document.location.href.match(/laserdisken/)) {
    $("form[name=searchform]").attr("action", "search_ml.dna")
    let url = $("a.sidebarld").attr("href").replace("kurv.dna","kurv_ml.dna").replace("/html/kurv_ml.dna", "/html/betaling/kurv_ml.dna");
    $("table.searchresults tr td:nth-child(1) img").each((i,e) => {
       let href = e.parentNode.parentNode.children[2].children[0].href.split("=")[1];
       $(e).wrap(`<a target='_blank' href='http://www.lasernet.dk/html/vare/vare.dna?DO=vis&vareid=${href}'>`)
    })
    $("a.sidebarld").attr("href", url);
    GM_addStyle(`
      body {
      width: 769px;
      position: relative;
      margin: auto;
    }`)
  } else {
    GM_addStyle(`
      BODY {
      background - image: none;
      background - color: #d6d6d6;
      margin: auto;
      max - width: 1024px;
    }
    body[TOPMARGIN = "4"] {
      background - color: #bbb;
      border - bottom: 3px solid gray;
    }
    table[width = "58"] td {
      background - color: #bbb;
      padding - right: 5px
    }
    table[width = "220"], table[width = "240"] {
      background - color: #bbb;
      padding: 10px;
      margin - right: 5px;
    }`)
  }
})();

/*
#d6d6d6
div#menucontainer {
    position: absolute;
}


Centrer laserdisken:

body {

width: 769px;
position: relative;
margin: auto;

}
*/