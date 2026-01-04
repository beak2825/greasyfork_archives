// ==UserScript==
// @name         Crunchyroll Sub/Dub Filter
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Filter Crunchyroll Simulcast Calendar by Subs or Dubs
// @author       My1
// @match        https://www.crunchyroll.com/simulcastcalendar
// @match        https://www.crunchyroll.com/simulcastcalendar?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crunchyroll.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470962/Crunchyroll%20SubDub%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/470962/Crunchyroll%20SubDub%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
var episodelist=document.getElementsByClassName("release");

Array.from(episodelist).forEach((item) => {
    if(item.innerHTML.indexOf('Dub)') != -1) {
        item.classList.add("dubbedepisode");
    }
    else {
        item.classList.add("subbedepisode");
    }
});

    var subdubhtml=`
    <input type="radio" name="subselector" id="subonlyselect" hidden checked>
    <input type="radio" name="subselector" id="dubonlyselect" hidden>
    <input type="radio" name="subselector" id="subdubselect" hidden>
    <div id="selectorlabels">
    <label for="subonlyselect">Only Subs</label> |
    <label for="dubonlyselect">Only Dubs</label> |
    <label for="subdubselect">Everything</label>
    </div>
    <style>
    #subonlyselect:checked ~ #selectorlabels > label[for="subonlyselect"] {
        font-weight:600;
    }
    #subonlyselect:checked ~ .days .dubbedepisode {
        display:none;
    }
    #subdubselect:checked ~ #selectorlabels > label[for="subdubselect"] {
        font-weight:600;
    }
    #dubonlyselect:checked ~ .days .subbedepisode {
        display:none;
    }
    #dubonlyselect:checked ~ #selectorlabels > label[for="dubonlyselect"] {
        font-weight:600;
    }
    #selectorlabels {
        width: calc(100% - 6rem);
        margin: 0 3rem;
        font-size:2em;
        position:absolute;
        text-align:center;
        width:100%;
    }
    </style>
    `;


    document.getElementsByClassName("pagination-last")[0].insertAdjacentHTML("afterend",subdubhtml);

})();