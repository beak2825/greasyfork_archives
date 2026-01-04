// ==UserScript==
// @name     Clean Youtube Homepage
// @name:it  Pagina iniziale di Youtube pulita
// @version  1.1.1
// @grant    none
// @namespace    StephenP
// @description  Removes the wall of stupid videos that Youtube vomits on your face when you first open its home page: with this script, the homepage will look like the one of a search engine, with the searchbar on the top and the categories on the left.
// @description:it  Rimuove la muraglia di video idioti che Youtube ti vomita in faccia appena apri la home page: con questo script, la pagina principale avrà l'aspetto di quella di un motore di ricerca, con la barra di ricerca in alto e le categorie a sinistra.
// @author       StephenP
// @match    https://www.youtube.com/
// @match    https://m.youtube.com/
// @license     AGPL-3.0-or-later
// @contributionURL https://buymeacoffee.com/stephenp_greasyfork
// @downloadURL https://update.greasyfork.org/scripts/463534/Clean%20Youtube%20Homepage.user.js
// @updateURL https://update.greasyfork.org/scripts/463534/Clean%20Youtube%20Homepage.meta.js
// ==/UserScript==
var st=document.createElement("STYLE");
st.textContent="[page-subtype=home],[tab-identifier=FEwhat_to_watch]{display: none}";
document.getElementsByTagName("HEAD")[0].appendChild(st);