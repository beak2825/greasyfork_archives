// ==UserScript==
// @name         oh the places we'll go
// @namespace    http://clover.is-probably.gay/
// @version      2024-04-29
// @description  go random places on wikimedia sites
// @author       Clover Johnson
// @match        https://*.wikipedia.org/*
// @match        https://*.wiktionary.org/*
// @match        https://*.wikibooks.org/*
// @match        https://*.wikiquote.org/*
// @match        https://*.wikisource.org/*
// @match        https://*.wikiversity.org/*
// @match        https://*.wikimedia.org/*
// @match        https://*.wikivoyage.org/*
// @match        https://*.wikidata.org/*
// @match        https://*.wikinews.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wikipedia.org
// @grant        none
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/493727/oh%20the%20places%20we%27ll%20go.user.js
// @updateURL https://update.greasyfork.org/scripts/493727/oh%20the%20places%20we%27ll%20go.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let elem = document.createElement('button');
    elem.style.position = "fixed";
    elem.style.top = 0;
    elem.style.right = 0;
    elem.innerText = "cooldown for 5 seconds. take it in!";
    elem.onclick = ()=>{window.open(`${window.location.origin}/wiki/Special:Random`, "_self")};
    elem.style.zIndex = 1000000;
    elem.id = "crunchatize";
    elem.disabled = true;
    document.body.append(elem);
    setTimeout(()=>{
        elem.innerText = ["crunch-a-tize me captian", "beam me up scotty", "it's wizard time"][Math.floor(Math.random() * 3)];
        elem.disabled = false;
    }, 5000);
})();