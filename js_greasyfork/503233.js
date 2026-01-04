// ==UserScript==
// @name         Techdirt?Fixer
// @namespace    http://wxw.moe/@dia
// @version      0.1.1
// @description  Fix *some* special characters appearing as "?" on older Techdirt articles. As it is a simple script, expect false negatives and false positives.
// @author       Dia
// @match        https://www.techdirt.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at       document-end
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/503233/TechdirtFixer.user.js
// @updateURL https://update.greasyfork.org/scripts/503233/TechdirtFixer.meta.js
// ==/UserScript==

//manually change these parameters to suit your needs
const USCRIPT_DEBUG_MODE = false; //set to true for useful console logs
const DEBUG_HIGHLIGHT_1 = "<span style=\"color:red\">";
const DEBUG_HIGHLIGHT_2 = "</span>";

const NEG_AUX_VERB = /n\?t(?![a-zA-Z0-9])/g;
const NEG_AUX_VERB_FIXED = "n't";

const LONE_DASH = /(?<=\S\s)\?(?=\s\S)/g;
const LONE_DASH_FIXED = "-";

const APHOS_S = /(?<=[a-zA-Z0-9])\?s(?=[^a-zA-Z0-9])/g;
const APHOS_S_FIXED = "'s";
const IM = /(?<=^|\s)I\?m(?=\s)/g;
const IM_FIXED = "I'm";
const RE_LL_D_VE = /(?<=^|\s)([a-zA-Z0-9]+)\?(re|ll|d|ve)(?=\s)/g;
const RE_LL_D_VE_FIXED = "$1'$2";
const QUOTES = /(?<=^|[\s\(])\?([^\s][^\?]*)\?(?=[\s\)]?)/g;
const QUOTES_FIXED = "\"$1\"";
const QUOTES_IN_LINK = /(<a\shref\=[\"\'][^\"\']*[\"\']>)\?([^\s][^\?]*)\?(<\/a>)/g;
const QUOTES_IN_LINK_FIXED = "$1\"$2\"$3";
const S_APHOS = /s\?(?=\s[a-z])/g; //This cannot catch s' that is immediately followed by a comma or a full stop.
const S_APHOS_FIXED = "s'";

(function() {
    'use strict';
    const postBodyElms = document.getElementsByClassName("postbody");

    let newNegAuxVerb = colorDebug(NEG_AUX_VERB_FIXED);
    let newLoneDash = colorDebug(LONE_DASH_FIXED);
    let newAphosS = colorDebug(APHOS_S_FIXED);
    let newIm = colorDebug(IM_FIXED);
    let newReLlDVe = colorDebug(RE_LL_D_VE_FIXED);
    let newQuotes = colorDebug(QUOTES_FIXED);
    let newQuotesInLink = colorDebug(QUOTES_IN_LINK_FIXED);
    let newSAphos = colorDebug(S_APHOS_FIXED);

    if (USCRIPT_DEBUG_MODE) console.log("Techdirt?Fixer runs in debugging mode");

    for (let i=0; i < postBodyElms.length; i++){
        let postBodyContent = postBodyElms[i].innerHTML;
        postBodyContent = postBodyContent.replace(NEG_AUX_VERB,newNegAuxVerb);
        postBodyContent = postBodyContent.replace(LONE_DASH,newLoneDash);
        postBodyContent = postBodyContent.replace(APHOS_S,newAphosS);
        postBodyContent = postBodyContent.replace(IM,newIm);
        postBodyContent = postBodyContent.replace(RE_LL_D_VE,newReLlDVe);
        postBodyContent = postBodyContent.replace(QUOTES,newQuotes);
        postBodyContent = postBodyContent.replace(QUOTES_IN_LINK,newQuotesInLink);
        postBodyContent = postBodyContent.replace(S_APHOS,newSAphos);
        postBodyElms[i].innerHTML = postBodyContent;
    }

    function colorDebug(message){
        if (USCRIPT_DEBUG_MODE){
            return DEBUG_HIGHLIGHT_1 + message + DEBUG_HIGHLIGHT_2;
        }
        else return message;
    }

})();