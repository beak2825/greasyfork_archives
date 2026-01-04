// ==UserScript==
// @name         Pygmalion content extractor
// @version      0.2
// @description  Extracts contents of segmetns
// @require http://code.jquery.com/jquery-latest.js
// @author       TB
// @grant GM_setClipboard
// @run-at       document-idle
// @include      https://translate.google.com/toolkit/workbench*
// @exclude      https://translate.google.com/toolkit/content*
// @namespace https://greasyfork.org/users/166154
// @downloadURL https://update.greasyfork.org/scripts/37773/Pygmalion%20content%20extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/37773/Pygmalion%20content%20extractor.meta.js
// ==/UserScript==
//Avoid conflicts
this.$ = this.jQuery = jQuery.noConflict(true);


function findAncestor (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

function escapeRegExp(string){
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

var attempts = 0;
var is_loaded = false;
var checkExist = setInterval(function() {
    var source = $('.gtc-source > iframe[src*="toolkit"]').contents()[0];
    var target = $('.gtc-translation > iframe[src*="toolkit"]').contents()[0];

    var source_loaded = $(source).find('div.root-group')[0];
    var target_loaded = $(target).find('div.root-group')[0];

    var sourcesegments = "";
    var segments = "";
    try {
        sourcesegments = source.getElementsByClassName("goog-gtc-unit");
        segments = target.getElementsByClassName("goog-gtc-unit");
    }
    catch (e) {
        console.log("Could not load segments, retrying");
    }

    attempts++;
    if(source_loaded && target_loaded && sourcesegments.length == segments.length) is_loaded = true;
    else if (attempts > 100) {
        console.log("Unsuccessful after 100 attemps. Aborting.");
        return false;
    }


    if (is_loaded) {
        getPygmalionInfo();
        clearInterval(checkExist);
    }
    else {
        console.log("retrying: " + attempts);
    }
}, 100); // check every 100ms


function getPygmalionInfo() {
    if(document.location.href.match(/src=true/i)) { // skip one of the iframe to avoid duplication - source one is easier to pick
        return;
    }
    //$('div.root-group').load(function() {


        source = $('.gtc-source > iframe[src*="toolkit"]').contents()[0];
        target = $('.gtc-translation > iframe[src*="toolkit"]').contents()[0];

    var sourcesegments = source.getElementsByClassName("goog-gtc-unit");
    var segments = target.getElementsByClassName("goog-gtc-unit");

    console.log("-Count of target queries: " + segments.length);
    console.log("-Count of source queries: " + sourcesegments.length);

    var out = "";
    var headers= "";
    var total = 0;
    var errors = "";
    var extraqueries = [];
    var missingqueries = [];
    var errornames = [];
    var placeholdernospaces = [];
    var untranslated = [];
    var effort = target.URL.match(/rid=(\d+)/)[1] * 20 / 60 / 60; // A save is performed every 20 seconds when there was a change in the document
    console.log("Estimated effort in hours: " + effort);
    var totalwords = 0;

    // Go through all segments
    for(var i = 0; i < segments.length; i++){
        var text = segments[i].getElementsByClassName("goog-gtc-translatable")[0].textContent;
        var sourcetext = sourcesegments[i].getElementsByClassName("goog-gtc-translatable")[0].textContent;
        var innerHTML = segments[i].getElementsByClassName("goog-gtc-translatable")[0].innerHTML;
        var sourceinnerHTML = sourcesegments[i].getElementsByClassName("goog-gtc-translatable")[0].innerHTML;
        var count = (text.replace(/\n\n/g,"\n").match(/\n/g) || []).length +1;
        var segmentname = findAncestor(segments[i],"message").getElementsByClassName("message-id")[0].textContent;

        var sourcesegmenttext = sourceinnerHTML.replace(/<span class="goog-gtc-inchars-highlight goog-gtc-inchars-newline goog-gtc-highlight">\s?<\/span>/g,"\n");
        var onepatt = /<span class="annotation-style-1"/;
        var zeropatt = /<span class="annotation-style-0"/;

        var segmenttext = innerHTML.replace(/<span class="goog-gtc-inchars-highlight goog-gtc-inchars-newline goog-gtc-highlight">\s?<\/span>/g,"\n");
        segmenttext = segmenttext.replace(/<span class="goog-gtc-inchars-highlight[^"]+">( |&nbsp;)<\/span>/g," ");
        segmenttext = segmenttext.replace(/<span class="annotation-style-(\d)" gtc-suppressed-attr="annotation-index=&quot;\d&quot;">([^<]+)<\/span>/g, "{$1}$2{/$1}");

        if(sourcesegmenttext.match(onepatt) && !sourcesegmenttext.match(zeropatt)) {
            segmenttext = segmenttext.replace(/{(\/)?(\d)}/g,function($0, $1, $2) {
                var slash = $1 || "";
                return ("{" + slash + (parseInt($2)-1) + "}");
            });
        }

        out += '"' + segmenttext + '"\n';



    }

   GM_setClipboard(out);


    segments = null;
    sourcesegments = null;


}