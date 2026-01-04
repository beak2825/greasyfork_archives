// ==UserScript==
// @name         Panacea - Query counter, issue checker & fixer
// @version      0.9.9.7
// @description  Counts queries, flags issues in them and adds a Magic! button to fix some of the issues
// @require http://code.jquery.com/jquery-latest.js
// @author       TB
// @grant GM_setClipboard
// @run-at       document-idle
// @include      https://translate.google.com/toolkit/workbench*
// @exclude      https://translate.google.com/toolkit/content*
// @namespace https://greasyfork.org/users/166154
// @downloadURL https://update.greasyfork.org/scripts/37765/Panacea%20-%20Query%20counter%2C%20issue%20checker%20%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/37765/Panacea%20-%20Query%20counter%2C%20issue%20checker%20%20fixer.meta.js
// ==/UserScript==
//Avoid conflicts
this.$ = this.jQuery = jQuery.noConflict(true);
var intentFactory = false;



function capitalizeFirstLetter(string) {
    var stringArray = string.split(/\n/);
    var finalSegment = "";

    for (var x = 0; x < stringArray.length; x++) {
        var originalString = stringArray[x];

        var returnString = originalString;
        var leftString = "";

        for (var i = 0; i < originalString.length; i++) {
            if(originalString[i].match(/\d/) && originalString[i-1] != "{") { // starts with a number and it's not in the placeholder (=> no capitalization needed)
                finalSegment += returnString;
                if(x != stringArray.length-1) finalSegment += "\n";
                break;
            }

            if (originalString[i].match(/([^\u0000-\u007F¿]|[a-zA-Z])/)) {
                returnString = leftString + originalString[i].toLocaleUpperCase() + originalString.slice(i + 1);
                finalSegment += returnString;
                if(x != stringArray.length-1) finalSegment += "\n";

                break;
            }
            else {
                leftString += originalString[i];
            }
        }
    }

    return finalSegment;
}

function Magic() {
    var editor = $($('.gtc-translation > iframe[src*="toolkit"]').contents()[0]).find('#transEditor');
    var sourceHTML = $($('.gtc-source > iframe[src*="toolkit"]').contents()[0]).find('.goog-gtc-unit-highlight')[0].innerHTML;
    var queries = [];
    var language = $('.gtc-sl-tl').text().trim().replace("English » ","");

    var lines = editor[0].getElementsByTagName('div');
    if (!lines.length) {
        lines = editor[0].textContent.split("\n");
    }
    if(!lines.length) return false
    var segmentContent = "";
    for (var x = 0; x < lines.length; x++) {
        var line = lines[x].innerText || lines[x];
        if(queries.includes(line)) continue;
        segmentContent += line;
        queries.push(line);
        if (x + 1 < lines.length) segmentContent += "\n";
    }
    console.log('Using GDP Magic! on the following segment:');
    console.log(segmentContent);
    // leading space
    segmentContent = segmentContent.replace(/^\s/gm, "");

    // trailing space
    segmentContent = segmentContent.replace(/[  \u200d\u200c](?=\n|$|\{\/\d\}[$\n])/g, "");

    // double space
    segmentContent = segmentContent.replace(/[^\S\n]{2,}/g, " ");

    // final newlinews
    segmentContent = segmentContent.replace(/\n+$/m, "");

    // fix space-opening placeholder-space
    segmentContent = segmentContent.replace(/(\s\{\d\})\s/g, "$1");

    // fix space-closing placeholder-space
    segmentContent = segmentContent.replace(/\s(\{\/\d\}\s)/g, "$1");

    // asterisk fix
    segmentContent = segmentContent.replace(/(.+)\*$/gm, "*$1");

    // remove le French punctuation with spaces
    // segmentContent = segmentContent.replace(/\s[;!:?]/g, "");

    // remove le guillemets with optional spaces
    segmentContent = segmentContent.replace(/«[\u202F\u00A0 ]?|[\u202F\u00A0 ]?»/g, "");

    // remove punctuation
    //segmentContent = segmentContent.replace(/[؟"。？¡!¿?‹›…⋯᠁\.！]/g, "");

    // non-breakable spaces
    segmentContent = segmentContent.replace(/\u00a0/g, " ");

    // Spaces after asterisk
    segmentContent = segmentContent.replace(/\*\s+/g, "*");

    

    // Space before closing placeholder
    segmentContent = segmentContent.replace(/([  ]+)({\/\d})/g, "$2$1");

    //Remove space before punctuation
    segmentContent = segmentContent.replace(/[^\S\n]+([۔！\.？；。\|।؟])/gm, "$1");
    if(!language.match("Fren")) { // Non-French fixes
        segmentContent = segmentContent.replace(/[^\S\n]+([!\?:;])/gm, "$1");
    }

    // Compounding fix
    // segmentContent = segmentContent.replace(/(['-][^{]+)({\/\d})|({\/\d})([^\s-']+)/g, "$2$1$4$3"); // OLD behaviour, no French workaround
    // segmentContent = segmentContent.replace(/((?<!\bl)['-][^{]+)({\/\d})|({\/\d})([^\s-']+)/g, "$2$1$4$3");

    // Move punctuation out of annotation
    segmentContent = segmentContent.replace(/([\.。‒–—―\-:;<,\\\/\(\*،٫٬؞؛（、，；：！\.？；。\|।!\?:;؟])({\/\d})/g, "$2$1");

    // Convert to lowercase
    // segmentContent = segmentContent.toLowerCase();

    // Capitalize first letter
    segmentContent = capitalizeFirstLetter(segmentContent);

    // Remove space between asterisk and placeholder
    segmentContent = segmentContent.replace(/^\* {/gm, "*{");

    // Remove space after asterisk+placeholder
    segmentContent = segmentContent.replace(/^(\*{\d+})\s/gm, "$1");

    // Replace curly apostrophe with straight one
    segmentContent = segmentContent.replace(/’/g, "'");

    // Remove placeholder if none in source
    if(!sourceHTML.match(/annotation-style-/)) {
        segmentContent = segmentContent.replace(/{\/?\d}/g,"");
    }

    //Remove Unicode control characters
    segmentContent = segmentContent.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, "");

    $(editor).text(segmentContent);

    return true;
}


function CompoundFix() {
    var language = $('.gtc-sl-tl').text().trim().replace("English » ","");
    var editor = $($('.gtc-translation > iframe[src*="toolkit"]').contents()[0]).find('#transEditor');
    var sourceHTML = $($('.gtc-source > iframe[src*="toolkit"]').contents()[0]).find('.goog-gtc-unit-highlight')[0].innerHTML;
    var queries = [];

        var lines = editor[0].getElementsByTagName('div');
    if (!lines.length) {
        lines = editor[0].textContent.split("\n");
    }
    if(!lines.length) return false
    var segmentContent = "";
    for (var x = 0; x < lines.length; x++) {
        var line = lines[x].innerText || lines[x];
        if(queries.includes(line)) continue;
        segmentContent += line;
        queries.push(line);
        if (x + 1 < lines.length) segmentContent += "\n";
    }
    console.log('Using Compounding fix on the following segment:');
    console.log(segmentContent);

    // Compounding fix
    // segmentContent = segmentContent.replace(/([  ]+)({\/\d})|(['-][^{]+)({\/\d})|({\/\d})([^\s-']+)/g, "$2$1$4$3$6$5"); // OLD behaviour, no French workaround
    segmentContent = segmentContent.replace(/([  ]+)({\/\d})|((?<!\bl)['-][^{]+)({\/\d})|({\/\d})([^\s-']+)/g, "$2$1$4$3$6$5");

    // Add full stop to queries with no punctuation (SUPER DANGEROUS)
    if(!language.match(/Thai|Chinese|Japanese|Korean|Bengali|Bangla|Hindi|Urdu|Arabic/)) {
        segmentContent = segmentContent.replace(/([^!\?！\.？；。؟])$/gm, "$1.");
    }

    $(editor).text(segmentContent);

    return true;
}

function findAncestor(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}



// ---------------- INIT
var TritonObject = {};
var jobname = $('.gtc-docname').text();
if(!jobname.match(/NLU|KnowledgeEngine/i)) {return false;}
var docid = window.location.href.match(/did=([a-zA-Z0-9]+)/)[1];
console.log(jobname);
TritonObject.job = jobname;
TritonObject.code = docid;
TritonObject.authToken = 'Q7k8Eurakp38HjuH6AyM';
TritonObject.content = [];

var attempts = 0;
var is_loaded = false;
var checkExist = setInterval(function () {
    source = $('.gtc-source > iframe[src*="toolkit"]').contents()[0];
    target = $('.gtc-translation > iframe[src*="toolkit"]').contents()[0];
    var frame_loaded;
    $('.gtc-translation > iframe[src*="toolkit"]').ready(function () { frame_loaded = true; });

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
    if (frame_loaded && sourcesegments.length == segments.length) is_loaded = true;
    else if (attempts > 20) {
        console.log("Unsuccessful after 100 attemps. Aborting.");
        clearInterval(checkExist);
        return false;
    }

    if (is_loaded) {
        clearInterval(checkExist);
        getPygmalionInfo();
    }
    else {
        console.log("retrying: " + attempts);
    }
}, 500); // check every 500ms


function getPygmalionInfo() {
    if (document.location.href.match(/src=true/i)) { // skip one of the iframe to avoid duplication - source one is easier to pick
        return;
    }

    var language = $('.gtc-sl-tl').text().trim().replace("English » ","");

    var source = $('.gtc-source > iframe[src*="toolkit"]').contents()[0];
    var target = $('.gtc-translation > iframe[src*="toolkit"]').contents()[0];
    if($(source).find('.group-id').length) {
        console.log("Intent factory detected!");
        intentFactory = true;
    }


    var sourcesegments = source.getElementsByClassName("goog-gtc-unit");
    var segments = target.getElementsByClassName("goog-gtc-unit");

    console.log("-Count of target queries: " + segments.length);
    console.log("-Count of source queries: " + sourcesegments.length);

    var out = "";
    var headers = "";
    var errors = "";
    var nopicks = [];
    var toppicks = [];
    var errornames = [];
    var placeholdernospaces = [];
    var spacebeforeplaceholders = [];
    var spacebeforepunctuation = [];
    var punctuationbeforeplaceholders =[];
    var apostropheinside = [];
    var noasterisks = [];
    var nopunctuation = [];
    var invalidendpunct = [];
    var untranslated = [];
    var inconsistentPunctuation = [];
    var effort = target.URL.match(/rid=(\d+)/)[1] * 20 / 60 / 60; // A save is performed every 20 seconds when there was a change in the document
    console.log("Estimated effort in hours: " + effort);
    var totalqueries = 0;
    var totalsourcequeries = 0;
    var totalwords = 0;
    var totalsourcewords = 0;
    var totalchars = 0;
    var totalsourcechars = 0;
    var allcontent = "";

    $('.gtc-quickbar').prepend('<div role="button" class="goog-inline-block jfk-button jfk-button-standard" tabindex="0" aria-pressed="false" aria-disabled="false" aria-hidden="false" id="magic">Compounding fix</div>');

    $('#magic').click(function () {
        CompoundFix();
    });

    $('.gtc-quickbar').prepend('<div role="button" class="goog-inline-block jfk-button jfk-button-standard" tabindex="0" aria-pressed="false" aria-disabled="false" aria-hidden="false" id="gdpmagic">Magic!</div>');

    $('#gdpmagic').click(function () {
        console.log("Magic clicked!");
        Magic();
    });

    // Go through all segments
    for (var i = 0; i < segments.length; i++) {
        var prevErrors = errors;
        var newErrors ="";
        var globalErrorsHighlight = "";
        var text = segments[i].getElementsByClassName("goog-gtc-translatable")[0].textContent;
        allcontent += text;
        var sourcetext = sourcesegments[i].getElementsByClassName("goog-gtc-translatable")[0].textContent;
        var innerHTML = segments[i].getElementsByClassName("goog-gtc-translatable")[0].innerHTML;
        var sourceinnerHTML = sourcesegments[i].getElementsByClassName("goog-gtc-translatable")[0].innerHTML;
        var count = (text.replace(/\n\n/g, "\n").replace(/\n$/g, "").match(/\n/g) || []).length + 1;
        var sourcecount = (sourcetext.replace(/\n\n/g, "\n").match(/\n/g) || []).length + 1;
        if(intentFactory) {
            //var segmentname =  $(segments[i]).parent().attr('id');
            //var segmentname = findAncestor(segments[i], "message").getElementsByClassName("group-id")[0].textContent + " - " + $(segments[i]).parent().attr('id');
            var segmentname = findAncestor(segments[i], "message").getElementsByClassName("group-id")[0].textContent;
        }
        else {
            try {
                var segmentname = findAncestor(segments[i], "message").getElementsByClassName("message-id")[0].textContent;
            }
            catch(e) {
                var segmentname = segments[i].getAttribute("id");
            }
        }
        var classes = segments[i].getElementsByClassName("goog-gtc-translatable")[0].classList;
        var placeholdererror = Object.values(classes).includes('goog-gtc-ph-missing');
        var words = text.trim().split(/\s+/).length;
        var sourcewords = sourcetext.trim().split(/\s+/).length;
        totalwords += words;
        totalsourcewords += sourcewords;
        totalqueries += count;
        totalsourcequeries += sourcecount;
        totalchars += text.length;
        totalsourcechars += sourcetext.length;

        headers += "\t" + segmentname;
        out += "\t" + count;

        var innerWithoutHidden = innerHTML.replace(/<[^<]+goog-gtc-inchars-(space|nbsp)[^>]+>[^<]+<\/span>/g, " ").replace(/<[^<]+goog-gtc-inchars-newline[^>]+>[^<]+<\/span>/g, "\n").replace(/<[^<]+goog-gtc-inchars[^>]+>[^<]<\/span>/g, "").replace(/<span class="spelling-issue">([^<]*)<\/span>/g, "$1");
        var sourceInnerWithoutHidden = sourceinnerHTML.replace(/<[^<]+goog-gtc-inchars-(space|nbsp)[^>]+>[^<]+<\/span>/g, " ").replace(/<[^<]+goog-gtc-inchars-newline[^>]+>[^<]+<\/span>/g, "\n").replace(/<[^<]+goog-gtc-inchars[^>]+>[^<]<\/span>/g, "").replace(/<span class="spelling-issue">([^<]*)<\/span>/g, "$1");
        var hiddencharspans = (innerHTML.match(/<span class="goog-gtc-inchars-highlight[^"]+">(\s|&nbsp;)<\/span>/g) || []).length;
        var emptyplaceholders = (innerHTML.match(/<span class="annotation-style-\d" gtc-suppressed-attr="annotation-index=&quot;\d&quot;"><\/span>/g) || []).length;
        var closing = (innerWithoutHidden.match(/<\/span>/g) || []).length;
        var wrongsyntax = (innerHTML.match(/<\/span>\s?(\d\/)?}|{\s?<span class="/g) || []).length;
        var opening = (innerWithoutHidden.match(/<span class="annotation-style-\d"/g) || []).length;

        var queries = text.split("\n");
        var sourcequeries = sourcetext.split("\n");

         
        //  arr.filter(function(entry) { return entry.trim() != ''; })


        var untranlist = [];
        for (var k = 0; k < queries.length; k++) {

            if (queries[k].match(/\*\s/)) {
               newErrors += i + 1 + " [" + segmentname + "] Space after asterisk * on line  " + (k + 1) + "\n";
            }

            if (sourcetext.match(escapeRegExp(queries[k])) && queries[k].length > 3) {
                untranlist.push((k + 1));
            }
        }

        if (untranlist.length) {
           newErrors += i + 1 + " [" + segmentname + "] Untranslated queries on line(s) " + untranlist.toString() + "\n";
        }

        // ---------------- Duplicate queries
        while (queries.length) {
            var query = queries.pop();
            query = query.toString().replace(/\*\s*/g, "");
            for (var x = 0; x < queries.length; x++) {
                if (queries[x].replace(/\*\s*/, "") == query && query.length > 0) {
                   newErrors += i + 1 + " [" + segmentname + "] Duplicate query: " + query + "\n";
                }

            }
        }

        // ---------------- Detect annotation-only queries
        var noannots = innerWithoutHidden.split("\n");
        for (var f=0; f<noannots.length; f++) {
            if(!noannots[f]) continue;
            var noannot = noannots[f].replace(/<span class="annotation-style-\d" [^>]+>([^<]+)<\/span>/g,"");
            if(!noannot) {
               newErrors += i + 1 + " [" + segmentname + "] Annotation-only query on line " + (f+ 1) + "/" + noannots.length + "\n";
            }
        }


        // ---------------- Untranslated annotations
        var annotationRegex = /<span class="annotation-style-\d" [^>]+>([^<]+)<\/span>/g;
        var annotationExceptions = ["netflix","mcdonald's","mcdonalds","spotify","chromecast","youtube","pandora"];
        var annotationExceptionPattern = /[^\d%]/;

        if(sourceInnerWithoutHidden.match(annotationRegex) && innerWithoutHidden.match(annotationRegex)) {
            var sourceAnnotations = [];
            var smatch;
            while ((smatch = annotationRegex.exec(sourceInnerWithoutHidden)) !== null) {
                var string = smatch[1].trim().toLowerCase();
                if(!sourceAnnotations.includes(string) && string.length) {
                    sourceAnnotations.push(string);
                }
            }

            var targetAnnotations = [];
            var tmatch;
            while ((tmatch = annotationRegex.exec(innerWithoutHidden)) !== null) {
                var tstring = tmatch[1].trim().toLowerCase();
                if(!targetAnnotations.includes(tstring) && tstring.length) {
                    targetAnnotations.push(tstring);
                }
            }

            var translatedAnnotations = [];

            targetAnnotations.forEach(function(elem) {
                if(sourceAnnotations.includes(elem) && !annotationExceptions.includes(elem) && elem.match(annotationExceptionPattern)) {
                    translatedAnnotations.push(elem);
                }
            });


            if(translatedAnnotations.length) {
               newErrors += i + 1 + " [" + segmentname + "] The following annotations are not translated: " + translatedAnnotations.toString() +" \n";
            }
        }

        // ---------------- Placeholder checks
        var rawsourcequery;
        try {//First lines can be empty, so go to the second one by default
            rawsourcequery = sourceinnerHTML.split("\n")[1];
        }
        catch (e) { // Fallback for single-entry source queries (unlikely but still possible)
            rawsourcequery = sourceinnerHTML.split("\n")[0];
        }

        var reg = /annotation-style-(\d)/gi;
        var result;
        var placeholdernumbers = [];
        while ((result = reg.exec(rawsourcequery)) !== null) {
            placeholdernumbers.push(result[1]);
            var placeholder_pattern = new RegExp("annotation-style-" + result[1]);
            if (!innerHTML.match(placeholder_pattern)) {
               newErrors += i + 1 + " [" + segmentname + "] Placeholder {" + (result[1]) + "} used in source but not in target \n";
            }
        }
        var rawqueries = innerHTML.split("\n");
        for (var z = 0; z < rawqueries.length; z++) {
            var rawquery = rawqueries[z];
            for (var y = 0; y < 5; y++) {
                if ((rawquery.match(new RegExp("annotation-style-" + y, "gi")) || []).length > 1) {
                   newErrors += i + 1 + " [" + segmentname + "] Duplicate placeholder no. " + y + " on line " + (z + 1) + "/" + rawqueries.length + "\n";
                }
            }
        }


        // ---------------- Simpler checks annotations
        var moreThanSeven = [];
        var fewerThanFour = [];

        if(rawqueries.length > 7) {
            moreThanSeven.push(segmentname);
           //errors += i + 1 + " [" + segmentname + "] More than 7 queries present\n";
        }

        if(rawqueries.length < 4) {
            fewerThanFour.push(segmentname);
            //errors += i + 1 + " [" + segmentname + "] Less than 4 queries present. Fewer.\n";
        }

        if (sourcetext == text) {
            untranslated.push(segmentname);
        }

        if (!language.match(/Thai|Chinese|Japanese|Korean/) && innerWithoutHidden.match(/[^\n\s\.’'\[\](){}⟨⟩:,،、‒–—―…!.‹›«»‐\-?‘’“”'";/⁄·\&*@\•^†‡°”¡¿※#№÷×ºª%‰+−=‱¶′″‴§~_|‖¦©℗®℠™¤₳฿₵¢₡₢$₫₯֏₠€ƒ₣₲₴₭₺₾ℳ₥₦₧₱₰£៛₽₹₨₪৳₸₮₩¥]<span class="annotation-style-\d"|gtc-suppressed-attr="annotation-index=&quot;\d&quot;"[^>]*>[^<]+<\/span>[^\n\s\.’'\[\](){}⟨⟩:,،、，‒–—―…!.‹›«»‐\-?‘’“”'";/⁄·\&*@\•^†‡°”¡¿※#№÷×ºª%‰+−=‱¶′″‴§~_|‖¦©℗®℠™¤₳฿₵¢₡₢$₫₯֏₠€ƒ₣₲₴₭₺₾ℳ₥₦₧₱₰£៛₽₹₨₪৳₸₮₩¥]/)) {
            placeholdernospaces.push(i + 1);
        }

        if(innerWithoutHidden.match(/\s<\/span>/g)) {
            //spacebeforeplaceholders.push(i+1)
            errors += i + 1 + " [" + segmentname + "] Spaces before or after placeholders\n";
        }

        if(!text.match(/[！\.？；。\|।!\?:;؟]/g) && !language.match(/Thai|Chinese|Japanese|Korean/)) {
             nopunctuation.push(i+1);
            globalErrorsHighlight += "No valid end-of-sentence punctuation used\n";
        }

        if(text.match(/[~`°¤§\-‒–—―:;<,\|৷\\\/\(\*،٫٬؞؛（、，；：]$/gm)) {
             invalidendpunct.push(i+1);
            globalErrorsHighlight += "Invalid punctuation used: " + text.match(/[~`°¤§\-‒–—―:;<,\|৷\\\/\(\*،٫٬؞؛（、，；：]$/gm) +"\n";
        }

        if(!text.match(/\*/)) {
             noasterisks.push(i+1);
             globalErrorsHighlight += "No asterisks in segment\n";
        }

        if(text.match(/[^\S\n]+[！\.？；。\|।؟]$/gm) || (!language.match("Fren") && text.match(/[^\S\n]+([!\?:;])$/gm))) {
            spacebeforepunctuation.push(i+1);
            globalErrorsHighlight += "Space before punctuation\n";
        }

        //if(innerWithoutHidden.match(/[!\?:;！\.？；。\|।؟][^\<\n\>]*<\/span>/gm)) {
        if(innerWithoutHidden.match(/[!\?:;！\.？；。\|।؟]<\/span>/gm)) {
            punctuationbeforeplaceholders.push(i+1);
            globalErrorsHighlight += "Punctuation before placeholders\n";
        }

        if (innerWithoutHidden.match(/>[^<]*['-][^<]*<\/span>/)) {
            apostropheinside.push(i+1);
          // newErrors += i + 1 + " [" + segmentname + "] Apostrophe or hyphen inside placeholders\n";
        }

        if (!text.replace(/\s/g, "").length) {
           newErrors += i + 1 + " [" + segmentname + "] !! EMPTY INTENT\n";
        }

        if (text.match(/’/g)) {
           newErrors += i + 1 + " [" + segmentname + "] Curly French apostrophe detected\n";
        }


        if (text.match(/\u00a0/g)) {
           newErrors += i + 1 + " [" + segmentname + "] Non-breakable space\n";
        }

        if (text.match(/^\s/gm)) {
           newErrors += i + 1 + " [" + segmentname + "] Space at the beginning of a line\n";
        }

        if (text.match(/[  ](\n|$)/)) {
           newErrors += i + 1 + " [" + segmentname + "] Trailing space\n";
        }

        if (text.match(/\n\s*\n/)) {
           newErrors += i + 1 + " [" + segmentname + "] Empty line\n";
        }

        if (text.match(/\t/)) {
           newErrors += i + 1 + " [" + segmentname + "] TAB character present\n";
        }

        if (text.match(/[^\S\n]{2,}/)) {
           newErrors += i + 1 + " [" + segmentname + "] Double space present\n";
        }

        if (text.match(/\n\s?$/)) {
           newErrors += i + 1 + " [" + segmentname + "] Newline at the end of segment\n";
        }

        if (text.match(/\{\d\}?|\{\/\d\}?|\{?\d\}|\{?\/\d\}/)) {
           newErrors += i + 1 + " [" + segmentname + "] Unrecognized placeholders\n";
        }

         if (text.match(/[^\*\n]+\*/)) {
           newErrors += i + 1 + " [" + segmentname + "] Asterisk not at the beginning of a query\n";
        }

        if (opening != closing) {
           newErrors += i + 1 + " [" + segmentname + "] Different number of opening and closing placeholders: " + opening + " vs " + closing + "\n";
        }

        if (wrongsyntax > 0) {
           newErrors += i + 1 + " [" + segmentname + "] Wrong placeholder syntax\n";
        }

        /*if(text.match(/^\n/)) {
       newErrors += i+1 + " [" + segmentname + "] Newline at the beginning of segment\n";
    }*/

        if ((opening % count > 0) || (closing % count > 0)) {
           newErrors += i + 1 + " [" + segmentname + "] Extra or missing placeholders\n";
        }

        if (emptyplaceholders > 0) {
           newErrors += i + 1 + " [" + segmentname + "] Empty pair placeholder\n";
        }


        if ((text.match(/\*/g) || []).length > 3 && count > 2) {
            toppicks.push(i + 1);
            errornames.push(segmentname);
        }

        if ((text.match(/\*/g) || []).length < 2) {
            nopicks.push(i + 1);
            errornames.push(segmentname);
            globalErrorsHighlight += "Fewer than 2 top queries selected";
        }

        var matchResult = text.match(/([\x00-\x09\x0B\x0C\x0E-\x1F\x7F])(\S+)|(\S+)([\x00-\x09\x0B\x0C\x0E-\x1F\x7F])/);
        if(matchResult) {
            var position;
            if (matchResult[2]) position = "before";
            else position = "after";

            var invisChar = "http://www.fileformat.info/info/unicode/char/" + (matchResult[1] || matchResult[4]).codePointAt(0).toString().padStart(4, '0');
            var matchedWord = matchResult[2] || matchResult[3];
           newErrors += i + 1 + " [" + segmentname + "] Invisible character (" + invisChar + ") " + position + " " + matchedWord +"\n";
        }

        // var capit = text.match(/[A-Z]\w*/g);
        /*
        if (capit) {
 newErrors += i+1 + " [" + segmentname + "] Capitalized words detected: "+ capit.toString() +"\n";
 }
 */

        /*var punct = text.match(/[^!\?！\.？；。؟\s]+$/gm);
        if (punct && !language.match("Thai")) {
           newErrors += i + 1 + " [" + segmentname + "] No punctuation at the end detected after words: " + punct.toString() + "\n";
        }*/

        var actualPunct = (text.match(/[!\?！\.？；\|।。؟]$/gm) || []).length;
        if (actualPunct != text.split("\n").length && !language.match("Thai") && actualPunct > 0) {
           // inconsistentPunctuation.push(i+1);
        }

        var google = text.match(/google/ig);
        if (google) {
           newErrors += i + 1 + " [" + segmentname + "] Word 'google' used in the segment\n";
        }

        if(capitalizeFirstLetter(text) != text) {
           newErrors += i + 1 + " [" + segmentname + "] One or more of the queries are not capitalized\n";
        }


        if(newErrors || globalErrorsHighlight) {
            segments[i].parentElement.style['background-color'] = "antiquewhite";
            segments[i].parentElement.setAttribute("title",newErrors.replace(/\d+\s+\[[^\]]+\]\s?/g,"") + "\n" + globalErrorsHighlight);
        }
        errors += newErrors;

        var newErrorsArray = eliminateDuplicates(newErrors.split("\n")).filter(Boolean);
        var intentFlags = [];
        for (var r=0; r<newErrorsArray.length; r++){
            intentFlags.push({"name": newErrorsArray[r], "queriesAffected": [1]});
        }
        TritonObject.content.push({ "segmentID": segmentname, "source": sourcequeries.filter(Boolean), "target": text.split("\n").filter(Boolean), "intentFlags": intentFlags });

    }

    if(!intentFactory) {

        if (moreThanSeven.length) {
            errors += "The following segments (total " + moreThanSeven.length + ") have more than 7 queries: " + moreThanSeven.toString() + "\n";
        }

        if (fewerThanFour.length) {
            errors += "The following segments (total " + fewerThanFour.length + ") have fewer than 4 queries: " + fewerThanFour.toString() + "\n";
        }
    }

    if (nopicks.length) {
        errors += "The following segments (total " + nopicks.length + ") have fewer than 2 top queries selected: " + nopicks.toString() + "\n";
    }

    if (toppicks.length) {
        errors += "The following segments (total " + toppicks.length + ") have more than 3 top queries selected: " + toppicks.toString() + "\n";
    }

    if (placeholdernospaces.length) {
        errors += "The following segments (total " + placeholdernospaces.length + ") are missing spaces before or after placeholders: " + placeholdernospaces.toString() + "\n";
    }

    if (spacebeforeplaceholders.length) {
        errors += "The following segments (total " + spacebeforeplaceholders.length + ") have space(s) before closing placeholders: " + spacebeforeplaceholders.toString() + "\n";
    }

    if (spacebeforepunctuation.length) {
        errors += "The following segments (total " + spacebeforepunctuation.length + ") have space(s) before punctuation: " + spacebeforepunctuation.toString() + "\n";
    }

    if (nopunctuation.length) {
        errors += "The following segments (total " + nopunctuation.length + ") have no valid punctuation at all: " + nopunctuation.toString() + "\n";
    }

    if (invalidendpunct.length) {
        errors += "The following segments (total " + invalidendpunct.length + ") has invalid punctuation: " + invalidendpunct.toString() + "\n";
    }


    if (punctuationbeforeplaceholders.length) {
        errors += "The following segments (total " + punctuationbeforeplaceholders.length + ") have punctuation before closing placeholder: " + punctuationbeforeplaceholders.toString() + "\n";
    }

    if (noasterisks.length) {
        errors += "The following segments (total " + noasterisks.length + ") have no asterisks: " + noasterisks.toString() + "\n";
    }


    if (untranslated.length) {
        errors += "The following segments (total " + untranslated.length + ") are not translated: " + untranslated.toString() + "\n";
    }

    if (inconsistentPunctuation.length) {
        errors += "The following segments (total " + inconsistentPunctuation.length + ") have inconsistent punctuation: " + inconsistentPunctuation.toString() + "\n";
    }

    if(apostropheinside.length) {
         errors += "The following segments (total " + inconsistentPunctuation.length + ") have apostrophe or hyphen inside placeholders: " + apostropheinside.toString() + "\n";
    }

    var iferrors = "";
    var ifheaders = "";
    // ------ Intent factory general checks
    var ifout = "";

    if(intentFactory) {

        ifheaders = "\tIntents";
        var wrongIntentCounts = [];
        var intents = target.getElementsByClassName("group-id");
        iferrors = "\t" + intents.length;
        for (var j=0; j<intents.length; j++) {
         var intentName = intents[j].innerText;

            var messages =  findAncestor(intents[j], "message").getElementsByClassName("goog-gtc-unit");


            if (messages.length > 1) {
                var countOne = (messages[0].textContent.split("\n")).length;
                var countTwo = (messages[1].textContent.split("\n")).length;
                ifout += "\t" + (countOne+countTwo);
                if(countOne > 6 || countOne < 4 || countTwo > 6 || countTwo < 4 ) {
                    wrongIntentCounts.push(intentName);
                    //errors += "Intent no. " + (j+1) + " (" + intentName + ") does not have 4-6 queries in one of the segments\n";
                }
            }
            else {
                var intentCount = (messages[0].textContent.split("\n")).length;
                ifout += "\t" + intentCount;
                if(intentCount > 11 || intentCount < 9) {
                    wrongIntentCounts.push(intentName);
                    //errors += "Intent no. " + (j+1) + " (" + intentName + ") does not have 4-6 queries in one of the segments\n";
                }
            }

        }
        if(wrongIntentCounts.length) {
         errors += "The following segments (total " + wrongIntentCounts.length + ") do not have correct number of queries: " + wrongIntentCounts.toString() + "\n";
        }



    }
    // ----------------- Console output

    /*
    var queryCount = "";
    if(intentFactory) {
        queryCount = ifout;
    }
    else {
        queryCount = out;
    }*/

    var scriptPercentage = getLanguageScriptPercentage(language,allcontent);
    if(scriptPercentage < 50) {

        errors += "Only " + scriptPercentage.toFixed(2) +"% of the document uses detected script!";
    }
    var countElement = document.createElement("span");
    countElement.classList.add("goog-inline-block");
    countElement.style["margin-left"] = "5px";

    var errorCount = errors.trim().split("\n").length;
    if(errors.trim()) {
        countElement.innerText = "Panacea errors: " + errorCount;
        countElement.style["background-color"] = "#dd0808";
        countElement.style["color"] = "white";
    }
    else {
        countElement.innerText = "No errors ✓";
        countElement.style["background-color"] = "lightgreen";
    }
     document.querySelector("#statusbar").appendChild(countElement);


    console.log("SOURCE WORD COUNT: " + totalsourcewords);
    console.log("TARGET WORD COUNT: " + totalwords);
    console.log("SOURCE CHARACTERS: " + totalsourcechars);
    console.log("TARGET CHARACTERS: " + totalchars);
    console.log("HEADERS:");
    console.log("Request" + "\t" + "Source words" + "\t" + "Target words" + "\t" + "Source queries" + "\t" + "Target queries" + "\t" + "Source chars" + "\t" + "Target chars" + "\t" + "RAW effort estimate" + ifheaders + "\t" + "Errors found" + headers);
    console.log("TARGET QUERY COUNTS:");
    console.log(totalqueries + out);
    console.log("ERRORS:");
    console.log(errors);
    GM_setClipboard(jobname + "\t" + totalsourcewords + "\t" + totalwords + "\t" + totalsourcequeries + "\t" + totalqueries + "\t" + totalsourcechars + "\t" + totalchars + "\t" + effort + iferrors + "\t" + '"' + errors + '"' + out);
    console.log("INCORRECT NUMBER OF ASTERISKS:\n" + errornames.toString());

    var globalFlagsArray = getMatches(errors,/(The following segments[^\n]+)/ig);
    var globalFlags = [];
    for (var t=0; t<globalFlagsArray.length; t++){
        globalFlags.push({"name": globalFlagsArray[t], "intentsAffected": [1]});
    }
    TritonObject["globalFlags"] = globalFlags;
    submitContentToSymLite();
    segments = null;
    sourcesegments = null;
}


function submitContentToSymLite() {
        var json = {
        "document": TritonObject,
        "authToken": "Q7k8Eurakp38HjuH6AyM"
    }
    var url = 'https://symlite.moravia.com/API/Content/ProcessTriton';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open("POST", url, true);
    console.log(json);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(JSON.stringify(json));

    // Style the status label
    var stat = document.createElement("span");
    stat.id = "symlite-status";
    stat.style["line-height"] = "20px";
    stat.style["margin-left"] = "24px";
    stat.style["font-weight"] = "500";
    stat.style["padding"] = "5px";
    stat.style["border-radius"] = "5px";
    stat.style["font-size"] = "1rem";
    stat.style["font-variant"] = "all-small-caps";

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var respText = xhr.status + " - " + xhr.statusText;
            var now = new Date().toLocaleString();

            stat.title = "Submitted " + TritonObject.content.length + " intents to SymLite\n";

            if (xhr.status == 200) {
                console.log("Data successfully saved to SymLite: " + respText);
                stat.innerText = "Data saved to SymLite";
                stat.style["color"] = "#00897b";
                stat.title += "Received response " + respText + " on " + now + "\n";
            }
            else {
                var resp = xhr.response;
                console.log("Problem with sending data to SymLite, returned error " + respText);
                stat.innerText = "Problem saving info to SymLite";
                stat.style["color"] = "red";
                stat.title += "Received response " + respText + " on " + now + "\n";
                stat.title += "Error detail: " + resp.detail;

            }
        }
    }

    document.querySelector("#doctitlebar").appendChild(stat);
    return
}

function getLanguageScriptPercentage(language,text) {
    text = text.replace(/\{[^\}]*\}/g,"");
        var unicodeRanges = {
        "Arabic" : /[\u0600-\u06FF]/g,
        "Bengali" : /[\u0980-\u09FF]/g,
        "Bangla" : /[\u0980-\u09FF]/g,
        "Gujarati" : /[\u0A80-\u0AFF]/g,
        "Hindi" : /[\u0900-\u097F]/g,
        "Japanese" : /[\u3000-\u30FF\u4E00-\u9FFF]/g,
        "Kannada" : /[\u0C80-\u0CFF]/g,
        "Korean" : /[\uAC00-\uD7AF]/g,
        "Malayalam" : /[\u0D00-\u0D7F]/g,
        "Marathi" : /[\u0900-\u097F]/g,
        "Russian" : /[\u0400-\u052F]/g,
        "Tamil" : /[\u0B80-\u0BFF]/g,
        "Telugu" : /[\u0C00-\u0C7F]/g,
        "Thai" :  /[\u0E00-\u0E7F]/g,
        "Urdu" : /[\u0600-\u06FF]/g,
        "Chinese" : /[\u3000-\u303F\u4E00-\u9FFF]/g,
        "Cantonese" : /[\u3000-\u303F\u4E00-\u9FFF]/g,
        "Latin" : /[\u0020-\u024F]/g,
        "Persian" :  /[\u0600-\u06FF]/g,
    }

    var langRegexp = null;

    var keys = Object.keys(unicodeRanges);
    for(var u=0; u<keys.length; u++) {
        if(language.match(keys[u])) {
            console.log( "Detected language: " + keys[u]);
            langRegexp = unicodeRanges[keys[u]];
        }
    }

    if(!langRegexp) {
        console.log("Language not detected. Assuming it uses Latin Alphabet.")
        langRegexp = unicodeRanges["Latin"];
    }

    var contentStripped = text.replace(/\s/g,"")
    var langChars = (contentStripped.match(langRegexp) || []).length;
    var scriptPercentage = ((langChars/contentStripped.length)*100);
    return scriptPercentage;
}

function eliminateDuplicates(arr) {
    var i,
        len = arr.length,
        out = [],
        obj = {};

    for (i = 0; i < len; i++) {
        obj[arr[i]] = 0;
    }
    for (i in obj) {
        out.push(i);
    }
    return out;
}

function getMatches(string, regex, index, normalize) {
    regex.global = true;
    index || (index = 1); // default to the first capturing group
    var matches = [];
    var match;
    while (match = regex.exec(string)) {
        if (normalize) {
            matches.push(match[index].trim().toLowerCase());
        }
        else {
            matches.push(match[index]);
        }
    }
    return matches;
}
