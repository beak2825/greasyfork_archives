// ==UserScript==
// @name            CNKI-DOI-Jump
// @match           https://schlr.cnki.net/*
// @require         https://code.jquery.com/jquery-latest.min.js
// @license         MIT
// @grant           GM_addStyle
// @description     DOI-Jump with middle click on any DOI on schlr.cnki.net
// @version 0.0.1.20221102045724
// @namespace https://greasyfork.org/users/978257
// @downloadURL https://update.greasyfork.org/scripts/454116/CNKI-DOI-Jump.user.js
// @updateURL https://update.greasyfork.org/scripts/454116/CNKI-DOI-Jump.meta.js
// ==/UserScript==
//================================================== settings
//variables
const
    regex = '(10\.[0-9]{4,}(?:\.[0-9]+)*/(?:(?![%"&\'<>#? ])\\S)+)',
    doiRegex = new RegExp('(?:' + regex + ')', 'i')

//================================================== find DOI
function findDOI(element){
    if($(element).is("[href*='org/10.']"))
        return $(element).attr("href").split('org/')[1].trim();
    if($(element).text().match(doiRegex)!==null)
        return $(element).text().match(doiRegex)[0].trim();
    return false;
}
$(document).ready(function(){
//================================================== find middle click on doi
    $(document).on('mousedown', function(e){
        switch(e.which)
        {
        case 2:
            //prevent the default function of the clicked element
            e.preventDefault();

            //if clicked element returned valid DOI
            if(findDOI(e.target)){
                window.open('https://dx.doi.org/'+findDOI(e.target));
                }
        break;    
        }
    });
});