// ==UserScript==
// @name        clean_distri-company-lu
// @namespace   Violentmonkey Scripts
// @match       *://*distri-company.lu/*
// @grant       none
// @version     1.1
// @author      kedema
// @description Remove duplicate results in search and redirect to www
// @license     GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/496341/clean_distri-company-lu.user.js
// @updateURL https://update.greasyfork.org/scripts/496341/clean_distri-company-lu.meta.js
// ==/UserScript==

// Get the actual url in js
const proto = location.protocol;
const host  = location.hostname;
const page  = location.pathname;
const args  = location.search; 
const url   = proto + '//' + host;
const fullUrl   = proto + '//www.' + host + page + args;

if (!host.startsWith("www.")) {
    console.log("Redirecting to www");
    window.location = fullUrl;
}

const duplicateResults = [];

$("a.uk-card.uk-card-default.uk-card-small.uk-card-hover.uk-card-body.uk-margin-remove-first-child.uk-link-toggle.uk-display-block").not('[href^="'+url+'"]').closest(".el-item").parent().each(function(){
    duplicateResults.push($(this));
});

$.each(duplicateResults, function(){
    $(this).toggle(false);
});

console.log("Duplicates found: ");
console.log(duplicateResults);

//Ajouter un bouton pour toggle les resultats
const button = $('<br> <button>Toggle duplicates ('+ duplicateResults.length +')</button>');
button.click(() => {
    $.each(duplicateResults, function(){
        $(this).toggle();
    });
});
$('div.uk-panel.uk-text-lead.uk-margin.uk-text-center').append(button);