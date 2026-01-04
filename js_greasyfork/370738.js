// ==UserScript==
// @name         Triton
// @version      0.5.0.4
// @description  Polyglot port of Panacea - the QA checker and fixer for Assistant NLU projects
// @author       TB
// @match        https://localization.google.com/polyglot/tasks/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/166154
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/370738/Triton.user.js
// @updateURL https://update.greasyfork.org/scripts/370738/Triton.meta.js
// ==/UserScript==

// Show hidden characters
/*
document.styleSheets[0].insertRule("div[contenteditable] { word-break: break-word !important}", 0);
document.querySelector("[data-total]").parentElement.querySelector("div > span:nth-child(3) > div").dispatchEvent(new Event('click', { bubbles: true }));
var existCondition = setInterval(function () {
    if (document.querySelector("[aria-label^='Show hidden characters']")) {
        document.querySelector("[aria-label^='Show hidden characters']").dispatchEvent(new Event('mousedown', { bubbles: true }));
        setTimeout(function () {
            document.querySelector("[aria-label^='Show hidden characters']").dispatchEvent(new Event('mouseup', { bubbles: true }));
            clearInterval(existCondition);
        }, 500);

    }
}, 100);*/

var globalErrors = {
    "Untranslated queries": [],
    "More than 7 queries": [],
    "Fewer than 4 queries": [],
    "Inconsistent punctuation": [],
    "Top picks: Fewer than 2": [],
    "Top picks: More than 3": [],
    "No punctuation in segment": []
}

// Array of arrays holding all simple matching checks.
// Syntax = [ [pattern, message, global, appendMatch, exceptionLanguages], [pattern2, message2, global, appendMatch, exceptionLanguages], ...   ]
var matchChecks = [
    [/’/g, "Curly French apostrophe detected"],
    [/\u00a0/g, "Non-breakable space"],
    [/^\s/gm, "Space at the beginning of a line"],
    [/[  ](\n|$)/, "Trailing space"],
    [/\n\s*\n/, "Empty line"],
    [/\t/, "TAB character present"],
    [/[^\S\n]{2,}/, "Double space present"],
    [/\n\s?$/, "Newline at the end of segment"],
    [/[^\*\n]+\*/, "Asterisk not at the beginning of a query"],
    [/\{\d+\}\s*\{\/\d+\}/, "Empty pair placeholder"],
    [/google/ig, "Word 'google' used in the segment"],
    [/[\-‒–—―:;<,\|৷\\\/\(\*،٫٬؞؛（、，；：]$/gm, "Invalid end-of-line punctuation", null, 1],
    [/{\/\d+}[^\s,!\?:;！\.？；。\-'\|।؟]+/, "Missing space after placeholder", null, 1, /Thai|Chinese|Korean|Japanese|Cantonese/i],
    [/[^\s\*,!\?:;！\.？；。\-'\|।؟]+\{\d+}/, "Missing space before placeholder", null, 1, /Thai|Chinese|Korean|Japanese|Cantonese/i],
    [/[^\s!\?:;]+(\{\d+})?[!\?:;]/, "Missing space before punctuation", null, 1, /^(?!.*French).*|.*(?<!French)$/],
    [/\{\d+\}[^\{\n]*\{\d+\}|\{\/\d+\}[^\{\n]*\{\/\d+\}/, "Embedded (nested) annotations", null, 1],
    [/\n/, "Multiline query"],
    [/\*\s/, "Space after asterisk"],
    [/[^\s]+[-–—]\s/,"Space after hyphen/dash", null, 1],
    [/\s[-–—][^\s]+/, "Space before hyphen/dash", null, 1],
    [/[^\S\n]+[۔！\.？；。\|।؟]/g, "Space(s) before punctuation",null, 1],
    [/[^\S\n]+[!\?:;]/g, "Space(s) before punctuation",null, 1, /French/],
    [/\*.*\*/g,"Multiple asterisks"],

    // GLOBAL FLAGS
    [/([^\s]*)[\.．。۔։።᠃᠉⳾⸼。](?!$)/,"Full stop not at the end of a query",1,1],
    [/[\s]\{\/\d/, "Space before closing placeholder", 1],
    [/[,!\?:;！\.？；。\|।؟]\{\/?\d+}/g, "Punctuation before closing placeholders", 1],
    [/\}[^\{]*['-][^\{]*\{\/\d+\}/, "Apostrophe or hyphen inside placeholders", 1]
];

var errors = "";
var errorOutput = "";
var globalPlaceholderMap = [];
var globalSourcePlaceholderMap = [];

var TritonObject = {};

// Insert Magic button
var magicHTML = '<div id="magic" role="button" class="U26fgb c7fp5b JvtX2e ZjeZ9" tabindex="0" aria-haspopup="true" aria-expanded="false" style="margin-left: 5px;"><content class="I3EnF"><span class="NlWrkb snByac">Magic!</span></content></div>';
document.querySelector('[data-task-display-name]').insertAdjacentHTML('beforeend', magicHTML);
var magicButton = document.querySelector("#magic");
magicButton.style["min-width"]="auto";
magicButton.addEventListener('click', runMagic, false);

var compoundMagicHTML = '<div id="compoundMagic" role="button" class="U26fgb c7fp5b JvtX2e ZjeZ9" tabindex="0" aria-haspopup="true" aria-expanded="false" style="margin-left: 5px;"><content class="I3EnF"><span class="NlWrkb snByac">Comp. fix</span></content></div>';
document.querySelector('[data-task-display-name]').insertAdjacentHTML('beforeend', compoundMagicHTML);
var compoundMagicButton = document.querySelector("#compoundMagic");
compoundMagicButton.style["min-width"]="auto";
compoundMagicButton.addEventListener('click', compoundFix, false);

var copyHTML = '<div id="copy" role="button" class="U26fgb c7fp5b JvtX2e ZjeZ9" tabindex="0" aria-haspopup="true" aria-expanded="false" style="margin-left: 5px;"><content class="I3EnF"><span class="NlWrkb snByac">Copy</span></content></div>';
document.querySelector('[data-task-display-name]').insertAdjacentHTML('beforeend', copyHTML);
var copyButton = document.querySelector("#copy");
copyButton.style["min-width"]="auto";
copyButton.addEventListener('click', copyPasteIntent, false);


var pasteHTML = '<div id="paste" role="button" class="U26fgb c7fp5b JvtX2e ZjeZ9" tabindex="0" aria-haspopup="true" aria-expanded="false" style="margin-left: 5px;"><content class="I3EnF"><span class="NlWrkb snByac">Paste</span></content></div>';
document.querySelector('[data-task-display-name]').insertAdjacentHTML('beforeend', pasteHTML);
var pasteButton = document.querySelector("#paste");
pasteButton.style["min-width"]="auto";
pasteButton.addEventListener('click', PasteIntent, false);


/*
// Detect username
var username = "";
for (const a of document.querySelectorAll("div")) {
  if (a.textContent.match(/^[\d\-a-zA-Z]+@004vendor\.com$/)) {
   username = a.textContent;
  }
}*/


// INIT - load content
var messages = document.querySelectorAll('div[data-tu-seq-no][id]'); // Selecting messages by divs having data-tu-seq-no attribute and an id (data-tu-seq-no is now used for validation flags now, but those lack IDs)
var jobname = document.querySelector('[data-task-display-name]').getAttribute("data-task-display-name");

if(!jobname.match(/NLU/i) && !jobname.match(/knowledge/i)) {
    return false;
}

var language = document.querySelector("[data-tu-seq-no]").parentElement.firstChild.children[1].textContent;
var docid = window.location.href.match(/(tasks\/\d+)/)[1];
TritonObject.job = jobname;
TritonObject.code = docid;
TritonObject.authToken = 'Q7k8Eurakp38HjuH6AyM';
TritonObject.content = [];
console.log("Triton loaded!");
console.log("NUMBER OF INTENTS: " + messages.length);
var allcontent = "";
var totalwords = 0;
var totalsourcewords = 0;
var totalchars = 0;
var totalsourcechars = 0;
var targetQueriesCount = 0;
var sourceQueriesCount = 0;
var perIntentQueryCount = "";
var totalErrorCount = 0;
var panelHTML = "";
var documentScript = getLanguageScriptPercentage(language, allcontent);

// -------------------------------  MESSAGE LEVEL LOOP  -------------------------------
for (var i = 0; i < messages.length; i++) {
    var intentText = "";
    var intentHTML = "";
    var sourceIntentText = "";
    var sourceIntentHTML = "";
    var targetqueries = messages[i].querySelectorAll('[data-edited]'); // POTENTIALLY BREAKABLE - relies on data-edited attribute, seems to be reliable but may change in the future
    var sourcequeries = messages[i].querySelectorAll('[jsname^="src"]'); // is this safe enough? the jsname attribute might change. Used to non-English lang parameter, but that's not safe for into English direction
    var segmentName = getSegmentID(messages[i]);
    segmentName = segmentName.replace(/intent: /g, "");

    targetQueriesCount += targetqueries.length;
    perIntentQueryCount += "\t" + targetqueries.length;
    sourceQueriesCount += sourcequeries.length;

    var APIsource = [];
    var APItarget = [];

    // Get raw HTML and inner text for both source and target query
    for (var q = 0; q < targetqueries.length; q++) {
        intentText += targetqueries[q].textContent;
        if (q != targetqueries.length - 1) { intentText += "\n"; }
        APItarget.push(addPlaceholderSyntax(targetqueries[q].outerHTML));
    }

    for (var x = 0; x < sourcequeries.length; x++) {
        sourceIntentText += sourcequeries[x].textContent;
        if (x != sourcequeries.length - 1) { sourceIntentText += "\n"; }
        APIsource.push(addPlaceholderSyntax(sourcequeries[x].outerHTML, "source"));
    }
    TritonObject.content.push({ "segmentID": segmentName, "source": APIsource, "target": APItarget.filter(Boolean), "intentFlags": [] });

    // Run the flags
    checkSegment(sourceIntentText, intentText, messages[i].innerHTML, i);

    // Add tooltips with errors
    displayErrorTooltips(messages[i], i, segmentName);

    allcontent += intentText + "\n";
    totalwords += intentText.trim().split(/\s+/).length;
    totalsourcewords += sourceIntentText.trim().split(/\s+/).length;
    totalchars += intentText.trim().length;
    totalsourcechars += sourceIntentText.trim().length;
}

// -------------------------------  OUTPUT SECTION -------------------------------

console.log("NUMBER OF SOURCE QUERIES: " + sourceQueriesCount);
console.log("NUMBER OF TARGET QUERIES: " + targetQueriesCount);
console.log("NUMBER OF SOURCE WORDS: " + totalwords);
console.log("NUMBER OF TARGET WORDS: " + totalsourcewords);
console.log("NUMBER OF SOURCE CHARS: " + totalchars);
console.log("NUMBER OF TARGET CHARS: " + totalsourcechars);
console.log(generateIntentLevelFlagsText());
var globalErrorOutput = displayGlobalErrors();
if(globalErrorOutput) {
    console.log("\n-------- GLOBAL ERRORS --------\n" + displayGlobalErrors());
}

var iferrors = "";
var scriptError = "";
if (documentScript[0] < 50) {
    scriptError = "Only " + scriptPercentage[0].toFixed(2) + "% of the document uses detected script! (" + documentScript[1] + ")";
}


// ----------- OUTPUT INTO SIDE PANEL
displayErrorsSidePanel();

// ----------- SAVE OUTPUT TO CLIPBOARD --- OBSOLETE
//GM_setClipboard(jobname + "\t" + totalsourcewords + "\t" + totalwords + "\t" + sourceQueriesCount + "\t" + targetQueriesCount + "\t" + totalsourcechars + "\t" + totalchars + "\t" + 0 + iferrors + "\t" + '"' + errorOutput + '"' + perIntentQueryCount);

// ----------- SUBMIT DATA TO SYMLITE
TritonObject.globalFlags = convertGlobalErrorsToJSON();
var xhr = submitContentToSymLite(TritonObject);

// ---------------------------------------------------------------------------
// -------------------------------  FUNCTIONS  -------------------------------
// ---------------------------------------------------------------------------

function submitContentToSymLite() {
        var json = {
        "document": TritonObject,
        "authToken": "Q7k8Eurakp38HjuH6AyM"
    }
    var url = 'https://symlite.moravia.com/API/Content/ProcessTriton';
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open("POST", url, true);

    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.send(JSON.stringify(json));
    console.log(json);

    // Style the status label
    var stat = document.createElement("span");
    stat.id = "symlite-status";
    stat.style["line-height"] = "20px";
    stat.style["margin-left"] = "24px";
    stat.style["font-weight"] = "500";
    stat.style["padding"] = "5px";
    stat.style["border-radius"] = "5px";
    stat.style["font-size"] = "1.5rem";
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

    document.querySelector("[data-total]").parentElement.appendChild(stat);
    return
}


// -------------------------- OUTPUT/DISPLAY FUNCTIONS --------------------------

function displayErrorTooltips(message, index, segmentName) {
    var segmentFlags = TritonObject.content[index].intentFlags;
    var flags = Object.keys(segmentFlags);
    if (!flags.length) return false;

    var tooltip = "Flags for segment " + segmentName;
    for (var flag in segmentFlags) {
        tooltip += "\n- " + segmentFlags[flag].name + " -- (" + segmentFlags[flag].queriesAffected.join(", ") + ")";
    }

    tooltip = switchPlaceholdersForImages(tooltip, globalSourcePlaceholderMap[i], "useName");
    message.style['background-color'] = "antiquewhite";
    message.setAttribute("title", tooltip);
}

function displayErrorsSidePanel() {
    var flagHeader = document.createElement("div");
    flagHeader.style["padding"] = "0 20px";
    flagHeader.style["line-height"] = "24px";
    flagHeader.style["border-bottom"] = " thin solid rgba(0,0,0,0.12)";
    flagHeader.id = "tritonHeader";
    flagHeader.innerHTML = "<h3 style=\"color: rgba(0,0,0,0.54); font-size: 1.4rem; font-weight: 500 \">TRITON FLAGS</h3>";

    var flagContainer = document.createElement("div");
    flagContainer.style["margin"] = "8px 16px";
    flagContainer.style["overflow-y"] = "auto";
    flagContainer.style["max-height"] = "50vh";
    flagContainer.style["padding-bottom"] = "8px";
    flagContainer.style["line-height"] = "1.3em";
    flagContainer.style["border-bottom"] = " thin solid rgba(0,0,0,0.12)";


    var globalErrorsOutput = displayGlobalErrors("HTML");
    var intentLevelFlagsHTML = generateIntentLevelFlagsHTML();
    if (!intentLevelFlagsHTML && !globalErrorsOutput && !scriptError) {
        flagContainer.innerHTML = "<p style='font-weight: 500'>No errors! Awesome. 😎</div>";
    }
    else {
        flagContainer.innerHTML = intentLevelFlagsHTML + "<hr>" + globalErrorsOutput + "<br>" + scriptError;
    }

    totalErrorCount += getTotalGlobalErrors();

    flagHeader.innerHTML = "<h3 style=\"color: rgba(0,0,0,0.54); font-size: 1.4rem; font-weight: 500 \">TRITON FLAGS (" + totalErrorCount + ")</h3>";

    var panel = document.querySelector("[role='tabpanel']");
    var flagElement = document.createElement("div");
    flagElement.style["font-size"] = "1.3rem";
    flagElement.appendChild(flagHeader);
    flagElement.appendChild(flagContainer);
    panel.parentElement.style["overflow"] = "overlay";
    panel.parentElement.insertBefore(flagElement, panel);


    // Links to intents - anchors
    document.addEventListener('click', function (event) {
        if (event.target.classList.contains('seglink')) {
            var segid = "#tu-" + event.target.getAttribute("name");
            document.querySelector(segid).scrollIntoView();
            document.querySelector(segid).querySelector("[data-edited]").dispatchEvent(new Event('focus'));
        }
        else if (event.target.classList.contains('globalseglink')) {
            var segid = "#tu-" + event.target.getAttribute("name");
            document.querySelector(segid).scrollIntoView();
            document.querySelector(segid).querySelector("[data-edited]").dispatchEvent(new Event('focus'));
        }
    }, false);
}

function generateIntentLevelFlagsHTML() {
    var panelHTML = "";

    var content = TritonObject.content;
    for (var x = 0; x < content.length; x++) {
        var segmentFlags = content[x].intentFlags;
        var flags = Object.keys(segmentFlags);
        if (!flags.length) continue;


        panelHTML += "♆ " + (x + 1) + " <a style=\"cursor: pointer\" class=\"seglink\" name=\"" + (x + 1) + "\">" + content[x].segmentID + "</a>";
        panelHTML += hashArrayToList(segmentFlags, x);
    }
    return panelHTML
}

function generateIntentLevelFlagsText() {
    var text = "";

    var content = TritonObject.content;
    for (var x = 0; x < content.length; x++) {
        var segmentFlags = content[x].intentFlags;
        var flags = Object.keys(segmentFlags);
        if (!flags.length) continue;

        for (var flag in flags) {
            text += "♆ [" + (x + 1) + " " + content[x].segmentID +"] "+ segmentFlags[flag].name + " (" + segmentFlags[flag].queriesAffected.join(",") + ")" +"\n";
        }

    }
    return text
}


function displayGlobalErrors(HTML) {
    var output = "";
    var keys = Object.keys(globalErrors);
    for (var i = 0; i < keys.length; i++) {
        var errors = eliminateDuplicates(globalErrors[keys[i]]);
        if (!errors.length) continue;
        if (HTML) {
            output += keys[i] + " (" + errors.length + " total): ";
            errors.forEach(function (el) {
                output += "<a style=\"cursor: pointer\" class=\"globalseglink\" name='" + el + "'>" + el + "</a> ";
            });
            output += "<br>";
        }
        else {
            output += keys[i] + " (" + errors.length + " total): " + errors.toString().replace(/,/g, ", ") + "\n";
        }

    }

    return output;
}

function getTotalGlobalErrors() {
    var count = 0;
    var keys = Object.keys(globalErrors);
    for (var i = 0; i < keys.length; i++) {
        var errors = eliminateDuplicates(globalErrors[keys[i]]);
        if (!errors.length) continue;
        count += 1;
    }

    return count;
}

function convertGlobalErrorsToJSON() {
    var json = [];
    var keys = Object.keys(globalErrors);
    for (var i = 0; i < keys.length; i++) {
        if (!globalErrors[keys[i]].length) continue;
        var flag = {
            "name": keys[i],
            "intentsAffected": globalErrors[keys[i]]
        }
        json.push(flag);
    }
    return json;
}


// --------------------- CHECKS --------------------------------

function runPatterns(text, checkArray, intentNum, queryNum) {
    for (var x = 0; x < checkArray.length; x++) {
        // checkArray Syntax = [ [pattern, message, global, appendMatch, exceptionLanguages], [pattern2, message2, global, appendMatch, exceptionLanguages], ...   ]
        var [pattern, message, global, append, exceptionRegex] = checkArray[x];

        if (exceptionRegex && language.match(exceptionRegex)) continue; // Skip exception langauges
        if (text.match(pattern)) {

            // ---------- GLOBAL
            if (global) { // does it have the global flag?
                if (!globalErrors.hasOwnProperty(message)) {// create the key if it does not exist yet for this flag
                    globalErrors[message] = [];
                }

                globalErrors[message].push(intentNum + 1);
            }

            // ---------- SEGMENT-LEVEL
            else {
                if (append) {
                    addIntentError(message + ": " + text.match(pattern), queryNum, intentNum);
                }
                else {
                    addIntentError(message, queryNum, intentNum);
                }
            }
        }
    }
    return true
}

function checkSegment(source, text, html, i) {
    var textPlaceholder = addPlaceholderSyntax(html) || text;
    var sourceTextPlaceholder = addPlaceholderSyntax(html, "source") || source;
    var queriesPlaceholders = textPlaceholder.split("\n");
    var queriesArray = addPlaceholderSyntax(html, null, "array");
    var sourceQueriesArray = addPlaceholderSyntax(html, "source", "array");
    var queriesArrayHTML = getSegmentsArrayFromHTML(html);
    var sourceQueriesArrayHTML = getSegmentsArrayFromHTML(html, "source");

    if (queriesArray.length != queriesArrayHTML.length) {
        console.log("Different size of query arrays:");
        console.log(queriesArray);
        console.log(queriesArrayHTML);
    }

    var placeholderMap = extractPlaceholderMapFromSegment(getSegmentsFromHTML(html));
    globalPlaceholderMap.push(placeholderMap);
    var sourcePlaceholderMap = extractPlaceholderMapFromSegment(getSegmentsFromHTML(html, "source"));
    globalSourcePlaceholderMap.push(sourcePlaceholderMap);

    // -----------------  GLOBAL ERRORS  ------------------------
    // Inconsistent punctuation (one or more lines end with punctuation and one or more doesn't)
    var actualPunct = (textPlaceholder.match(/[!\?！\.？；\|।۔。؟]$/gm) || []).length;
    if (actualPunct != queriesPlaceholders.length && !language.match("Thai") && actualPunct > 0) {
        globalErrors["Inconsistent punctuation"].push(i + 1);
    }

    // No punctuation in segment (exception for Thai, no punctuation used)
    if (!text.match(/[！\.۔？；。\|।!\?:;؟]/g) && !language.match(/thai/i)) {
        globalErrors["No punctuation in segment"].push(i + 1);
    }

    // Total query count checks
    if (queriesArray.length > 7) {
        globalErrors["More than 7 queries"].push(i + 1);
    }
    if (queriesArray.length < 4) {
        globalErrors["Fewer than 4 queries"].push(i + 1);
    }

    // Top picks count checks
    var topPicksCount = (text.match(/\*/g) || []).length;
    if (topPicksCount < 2) {
        globalErrors["Top picks: Fewer than 2"].push(i + 1);
    }
    if (topPicksCount > 3 && queriesArray.length > 2) {
        globalErrors["Top picks: More than 3"].push(i + 1);
    }

    // -------------- INTENT LEVEL ERROR --------------------------
    for (var t = 0; t < queriesArray.length; t++) {
        var index = t + 1;
        var query = queriesArray[t];
        var queryHTML = queriesArrayHTML[t].innerHTML;
        var queryPlainText = queriesArrayHTML[t].innerText;

        // One of the lines does not start with a capital letter
        if (capitalizeFirstLetter(query) != query && documentScript[1] == "Latin") {
            addIntentError("One or more of the queries are not capitalized", index, i);
        }

        // The message has nothing (whitespace is stripped)
        if (!query.replace(/\s/g, "").length) {
            addIntentError("EMPTY INTENT", index, i);
        }

        // Unrecognized placeholder
        var unrecognizedMatches = getMatches(queryPlainText, /(\{\/?\d+)\}/g, 1);
        if (unrecognizedMatches.length) {
            addIntentError("Unrecognized placeholder (manual entry): " + unrecognizedMatches.join(" }, ") + " }", index, i);
        }

        // Invisible characters check
        var matchResult = query.match(/([\x00-\x09\x0B\x0C\x0E-\x1F\x7F])(\S+)|(\S+)([\x00-\x09\x0B\x0C\x0E-\x1F\x7F])/);
        if (matchResult) {
            var position;
            if (matchResult[2]) position = "before";
            else position = "after";
            var invisChar = "http://www.fileformat.info/info/unicode/char/" + (matchResult[1] || matchResult[4]).codePointAt(0).toString().padStart(4, '0');
            var matchedWord = matchResult[2] || matchResult[3];
            addIntentError("Invisible character (" + invisChar + ") " + position + " " + matchedWord, index, i);
        }

        //Annotation-only query
        if (!query.replace(/\{\d+\}.*?(?=\{\/\d+\}){\/\d+\}|\s|\*|[.．。۔։።᠃᠉⳾⸼。,、،:︓：﹕׃︔;;؛；﹔"?;՞؟፧？"!՜႟꩷︕！]/g, "").length && query.length) {
            // replace content wrapped in placeholders, punctuation and whitespace. If the result is empty, it's annotation-only. Skip empty annotaitons
            addIntentError("Annotation-only query", index, i);
        }

        // Run the matchChecks array
        runPatterns(query, matchChecks, i, index);

        // Duplicate queries
        var dupqueries = queriesArray.slice(0);
        for (var z = 0; z < dupqueries.length; z++) {
            if (dupqueries[z].replace(/\*\s*/, "") == query.replace(/\*\s*/, "") && z != t && query.length > 0) {
                addIntentError("Duplicate query", z + 1, i);
            }
        }

        // Untranslated queries
        var queryPattern = new RegExp(escapeRegExp(queryPlainText.replace(/\*/g,"").trim()), "gi");
        if (source.match(queryPattern) && queryPlainText.length > 3) {
            addIntentError("Untranslated query", index, i);
        }

        // Placeholder checks
        if (Object.keys(sourcePlaceholderMap).length) {
            //ANNOTATIONS CHECKS
            var annotationExceptions = ["netflix", "mcdonald's", "mcdonalds", "spotify", "chromecast", "youtube", "pandora", "iphone"];
            var annotationExceptionPattern = /[^\d%]/; // skip anything that uses numbers or percentages
            var placeholderPattern = new RegExp(/\{\d+\}(.*?)(?=\{\/\d+\}){\/\d+\}/, "g");
            var targetPlaceholderList = eliminateDuplicates(getMatches(query, placeholderPattern, 1, "normalize"));
            var sourcePlaceholderList = eliminateDuplicates(getMatches(sourceQueriesArray[0], placeholderPattern, 1, "normalize"));

            // Untranslated placeholders
            var untranslatedPlaceholders = [];
            for (var c = 0; c < targetPlaceholderList.length; c++) {
                if (sourcePlaceholderList.includes(targetPlaceholderList[c])) {
                    if (!annotationExceptions.includes(targetPlaceholderList[c]) && targetPlaceholderList[c].match(annotationExceptionPattern)) {
                        untranslatedPlaceholders.push(targetPlaceholderList[c]);
                    }
                }
            }

            if (untranslatedPlaceholders.length) {
                addIntentError("Untranslated annotations: " + untranslatedPlaceholders.join(", "), index, i);
            }

            for (var e = 0; e < Object.keys(sourcePlaceholderMap).length; e++) {
                var pl = sourcePlaceholderMap[e];
                var pattern = new RegExp(escapeRegExp(Object.keys(sourcePlaceholderMap)[e]), "g");

                // Placeholder used in source but not in target
                if (!query.match(pattern)) {
                    addIntentError("Placeholder " + Object.keys(sourcePlaceholderMap)[e] + " used in source but not in target", index, i);
                }

                // Duplicate placeholders
                else {
                    if (query.match(pattern).length > 1) {
                        addIntentError("Duplicate placeholder " + Object.keys(sourcePlaceholderMap)[e], index, i);
                    }

                }
            }

        }
    }
    return errors;
}


// --------------- TRITON-SPECIFIC HELPER FUNCTIONS ----------------------

function getLanguageScriptPercentage(language, text) {
    var unicodeRanges = {
        "Arabic": /[\u0600-\u06FF]/g,
        "Bengali": /[\u0980-\u09FF]/g,
        "Bangla": /[\u0980-\u09FF]/g,
        "Gujarati": /[\u0A80-\u0AFF]/g,
        "Hindi": /[\u0900-\u097F]/g,
        "Japanese": /[\u3000-\u30FF\u4E00-\u9FFF]/g,
        "Kannada": /[\u0C80-\u0CFF]/g,
        "Korean": /[\uAC00-\uD7AF]/g,
        "Malayalam": /[\u0D00-\u0D7F]/g,
        "Marathi": /[\u0900-\u097F]/g,
        "Russian": /[\u0400-\u052F]/g,
        "Tamil": /[\u0B80-\u0BFF]/g,
        "Telugu": /[\u0C00-\u0C7F]/g,
        "Thai": /[\u0E00-\u0E7F]/g,
        "Urdu": /[\u0600-\u06FF]/g,
        "Chinese": /[\u3000-\u303F\u4E00-\u9FFF]/g,
        "Cantonese": /[\u3000-\u303F\u4E00-\u9FFF]/g,
        "Latin": /[\u0020-\u024F]/g,
        "Persian": /[\u0600-\u06FF]/g,
    }

    var langRegexp = null;
    var lang;

    var keys = Object.keys(unicodeRanges);
    for (var u = 0; u < keys.length; u++) {
        if (language.match(keys[u])) {
            console.log("Detected script: " + keys[u]);
            langRegexp = unicodeRanges[keys[u]];
            lang = keys[u];
        }
    }

    if (!langRegexp) {
        console.log("Language not detected. Assuming it uses Latin Alphabet.")
        langRegexp = unicodeRanges.Latin;
        lang = "Latin";
    }

    var contentStripped = text.replace(/\s/g, "")
    var langChars = (contentStripped.match(langRegexp) || []).length;
    var scriptPercentage = ((langChars / contentStripped.length) * 100);
    return [scriptPercentage, lang];
}


function getSegmentsFromHTML(html, source) {
    var DocumentFragmentDom = document.createRange().createContextualFragment(html);

    if (source) {
        return DocumentFragmentDom.querySelector("div[lang=en]").innerHTML;
    }
    else if (DocumentFragmentDom.querySelector("[data-segment-id]").getAttribute("lang")) {
        return DocumentFragmentDom.querySelector("[data-segment-id]").innerHTML;
    }
    else {
        return findAncestor(DocumentFragmentDom.querySelector("[data-segment-id]"), "[lang]").innerHTML;
    }
}

function addPlaceholderSyntax(html, source, array) {
    var DocumentFragmentDom = document.createRange().createContextualFragment(html);
    var placeholders = DocumentFragmentDom.querySelectorAll("[data-index]");
    var out = "";
    var outArray = [];
    var queries;

    for (var i = 0; i < placeholders.length; i++) {
        var placeholderIndex = parseInt(placeholders[i].getAttribute("data-index")) || 0;
        var type = placeholders[i].getAttribute("data-type");
        var parent = placeholders[i].parentElement || DocumentFragmentDom;
        var newPlaceholder;
        if (type == 1) { newPlaceholder = "{" + placeholderIndex + "}"; }
        else { newPlaceholder = "{/" + placeholderIndex + "}"; }

        var placeholderNode = document.createTextNode(newPlaceholder);
        parent.replaceChild(placeholderNode, placeholders[i]);
    }

    if (source) {
        //queries = DocumentFragmentDom.querySelectorAll("li:not([data-segment-id]) > div[jsname]");
        queries = DocumentFragmentDom.querySelectorAll("div[jsname]");
    }
    else {
        queries = DocumentFragmentDom.querySelectorAll("div[data-segment-id]");
    }

    for (var x = 0; x < queries.length; x++) {
        out += queries[x].textContent;
        outArray.push(queries[x].textContent);
        if (x != queries.length - 1) out += "\n";
    }

    if (array) {
        return outArray;
    }
    return out
}

function getSegmentsArrayFromHTML(html, source) {
    var DocumentFragmentDom = document.createRange().createContextualFragment(html);
    var queries;
    if (source) {
        queries = DocumentFragmentDom.querySelectorAll("li:not([data-segment-id]) > div[jsname]");
    }
    else {
        queries = DocumentFragmentDom.querySelectorAll("div[data-segment-id]");
    }

    return Array.prototype.slice.call(queries);
}

function extractPlaceholderMapFromSegment(html) {
    var placeholderMap = {};
    var placeholderImages = html.match(/<img [^>]+>/g);

    if (placeholderImages) {
        for (var x = 0; x < placeholderImages.length; x++) {
            var index = placeholderImages[x].match(/data-index="(\d+)"/)[1];
            var type = placeholderImages[x].match(/data-type="(\d+)"/)[1];
            var name = "";
            if (placeholderImages[x].match(/data-label="([^\"]+)"/)) {
                name = placeholderImages[x].match(/data-label="([^\"]+)"/)[1];
            }
            var newPlaceholder;
            if (type == 1) { // OPENING PLACEHOLDER
                newPlaceholder = "{" + index + "}";
                name = "[" + name + "]";
            }
            else { // CLOSING PLACEHOLDER
                newPlaceholder = "{/" + index + "}";
                name = "[/" + name + "]";
            }
            placeholderMap[newPlaceholder] = { "img": placeholderImages[x], "name": name };
        }
    }
    return placeholderMap
}

function switchPlaceholdersForImages(content, placeholderMap, useName) {
    if (Object.keys(placeholderMap).length) {
        for (var y = 0; y < Object.keys(placeholderMap).length; y++) {
            var placeholder = Object.keys(placeholderMap)[y];
            var pattern = new RegExp(escapeRegExp(placeholder), "g");
            //console.log("Replacing " + pattern + " with placeholder " + placeholderMap[placeholder].name + " - " + placeholderMap[placeholder].img);
            if (useName) {
                content = content.replace(pattern, placeholderMap[placeholder].name);
            }
            else {
                content = content.replace(pattern, placeholderMap[placeholder].img);
            }
        }
    }
    return content
}

function getSegmentID(message) {
    if (message.previousSibling.querySelector("div > [data-id]")) { // Easy variant - the ID is the preceding div
        return message.previousSibling.querySelector("div > [data-id]").getAttribute("data-id");
    }

    var found = false;
    while (message.previousSibling && !found) { // More complicated - multiple messages within one intent group
        message = message.previousSibling;
        if (message.querySelector("[data-id]")) {
            found = true;
            return message.querySelector("[data-id]").getAttribute("data-id");
        }
    }

    //console.log("No intent name"); // Fallback - if everything else fails, let's use first 50 characters of the message
    return truncate(message.querySelector('[data-edited]').textContent, 50);

}

// ----------------------- MAGIC BUTTON -----------------------

function runMagic() {
    var activeQuery = document.querySelector('div[contenteditable="true"]');
    if (!activeQuery) {
        alert("No segment selected! Select a segment before pressing Magic");
        return false;
    }
    var activeMessage = findAncestor(activeQuery, 'div[data-tu-seq-no]');
    console.log("Magic! pressed");

    var queries = activeMessage.querySelectorAll('[data-edited]'); // POTENTIALLY BREAKABLE - relies on data-edited attribute, seems to be reliable but may change in the future
    console.log("Content backup:\n");
    for (var q = 0; q < queries.length; q++) {

        // Strip manually entered placeholders
        var cont = queries[q].outerHTML.replace(/\{\/?\d\}/g, "");

        var segmentContent = addPlaceholderSyntax(cont);
        var segmentHTML = queries[q].outerHTML;
        var segment = queries[q];
        console.log(segmentContent);

        // index the placeholders
        var placeholderMap = extractPlaceholderMapFromSegment(segmentHTML);

        // End of segment newline
        segmentContent = segmentContent.replace(/\n+$/g, "");

        // leading space
        segmentContent = segmentContent.replace(/^\s/gm, "");

        // trailing newline
        segmentContent = segmentContent.replace(/\n$/gm, "");

        // trailing space
        segmentContent = segmentContent.replace(/[  \u200d\u200c](?=\n|$|\{\/\d\}[$\n])/g, "");

        // double space
        segmentContent = segmentContent.replace(/\s{2,}/g, " ");

        // fix space-opening placeholder-space
        segmentContent = segmentContent.replace(/(\s\{\d\})\s/g, "$1");

        // fix space-closing placeholder-space
        segmentContent = segmentContent.replace(/\s(\{\/\d\}\s)/g, "$1");

        //Remove space in space-placeholder-punctuation IMPLEMENT
        segmentContent = segmentContent.replace(/[^\S\n]+(\{\/?\d\}[!\?:;！\.？；。\|।؟\-‒–—―:;<,\|৷\\\/\(\*،٫٬؞؛（、，；：])/g, "$1");

        // asterisk fix - move it to the beginning of the line
        segmentContent = segmentContent.replace(/(.*)\*(.*)$/gm, "*$1$2");

        // remove le French punctuation with spaces
        // segmentContent = segmentContent.replace(/\s([;!:?])/g, "$1");

        // remove le guillemets with optional spaces
        segmentContent = segmentContent.replace(/«[\u202F\u00A0 ]?|[\u202F\u00A0 ]?»/g, "");

        // remove punctuation
        //segmentContent = segmentContent.replace(/[؟"。？¡!¿?‹›…⋯᠁\.！]/g, "");

        // non-breakable spaces
        segmentContent = segmentContent.replace(/\u00a0/g, " ");

        // Spaces after asterisk
        segmentContent = segmentContent.replace(/\*\s+/, "*");

        // Space before punctuation
        if(!language.match(/french/i)) {
            segmentContent = segmentContent.replace(/[^\S\n]+(?=[!\?:;！\.？；。\|।؟])/g, "");
        }

        // Space before closing placeholder
        segmentContent = segmentContent.replace(/([  ]+)({\/\d})/g, "$2$1");

        // Space after opening placeholder
        segmentContent = segmentContent.replace(/({\d})([  ]+)/g, "$2$1");

        // Add full stop to queries with no punctuation (SUPER DANGEROUS)
        //segmentContent = segmentContent.replace(/([^!\?！\.？；。؟])$/gm, "$1.");

        // Remove Unicode control characters
        segmentContent = segmentContent.replace(/[\x00-\x09\x0B\x0C\x0E-\x1F\x7F]/g, "");

        // Captalize segment
        segmentContent = capitalizeFirstLetter(segmentContent);

        // Move punctuation out of annotation
        segmentContent = segmentContent.replace(/([\.。‒–—―\-:;<,\\\/\(\*،٫٬؞؛（、，；：！\.？；。\|।!\?:;؟])({\/\d})/g, "$2$1");

        //document.querySelector("#" + queries[q].id).innerText = segmentContent;

        //console.log(placeholderMap);
        segmentContent = switchPlaceholdersForImages(segmentContent, placeholderMap);
        /*
        if(Object.keys(placeholderMap).length) {
            for(var y=0; y<Object.keys(placeholderMap).length; y++) {
                var pattern = new RegExp(escapeRegExp(Object.keys(placeholderMap)[y]),"g");
                //console.log("Replacing " + pattern + " with " + placeholderMap[Object.keys(placeholderMap)[y]]);
                segmentContent = segmentContent.replace(pattern,placeholderMap[Object.keys(placeholderMap)[y]]);
            }
        }*/

        segment.dispatchEvent(new Event('focus'));
        segment.innerHTML = segmentContent;
        segment.dispatchEvent(new KeyboardEvent('input', { bubbles: true }));
    }
}

function compoundFix() {
    var activeQuery = document.querySelector('div[contenteditable="true"]');
    if (!activeQuery) {
        alert("No segment selected! Select a segment before pressing Magic");
        return false;
    }
    var activeMessage = findAncestor(activeQuery, 'div[data-tu-seq-no]');
    console.log("Compounding fix pressed");

    var queries = activeMessage.querySelectorAll('[data-edited]'); // POTENTIALLY BREAKABLE - relies on data-edited attribute, seems to be reliable but may change in the future
    for (var q = 0; q < queries.length; q++) {

        // Strip manually entered placeholders
        var cont = queries[q].outerHTML.replace(/\{\/?\d\}/g, "");

        var segmentContent = addPlaceholderSyntax(cont);
        var segmentHTML = queries[q].outerHTML;
        var segment = queries[q];

        // index the placeholders
        var placeholderMap = extractPlaceholderMapFromSegment(segmentHTML);

        // double space
        segmentContent = segmentContent.replace(/\s{2,}/g, " ");

        // Add full stop to queries with no punctuation (SUPER DANGEROUS)
        /*if(!language.match(/Thai|Chinese|Japanese|Korean|Bengali|Bangla|Hindi|Urdu|Arabic/)){
        segmentContent = segmentContent.replace(/([^!\?！\.？；。؟])$/gm, "$1.");
        }*/

        segmentContent = segmentContent.replace(/([  ]+)({\/\d})|((?<!\bl)['-][^{]+)({\/\d})|({\/\d})([^\s-']+)/g, "$2$1$4$3$6$5");

        //console.log(placeholderMap);
        segmentContent = switchPlaceholdersForImages(segmentContent, placeholderMap);

        segment.dispatchEvent(new Event('focus'));
        segment.innerHTML = segmentContent;
        segment.dispatchEvent(new KeyboardEvent('input', { bubbles: true }));
    }
}

function addIntentError(message, queryNum, intentNum) {
    TritonObject.content[intentNum].intentFlags = pushToHash(TritonObject.content[intentNum].intentFlags, message, queryNum)
}

function pushToHash(flags, key, value) {

    for (var i = 0; i < flags.length; i++) {
        if (flags[i].name == key) {
            flags[i].queriesAffected.push(value);
            flags[i].queriesAffected = eliminateDuplicates(flags[i].queriesAffected).sort();
            return flags
        }
    }

    flags.push({
        "name": key,
        "queriesAffected": [value]
    });

    return flags;
}

function hashArrayToList(array, intent) {
    var flags = Object.keys(array);
    if (!flags.length) return null;

    var out = "<ul style='margin-top: 0px; padding-left: 1.3em;'>";
    for (var flag in array) {
        var flagtext = switchPlaceholdersForImages(array[flag].name, globalSourcePlaceholderMap[intent])
        totalErrorCount += 1;
        if (flag.match(/Untranslated annotations|google/i)) { // For future use - hiding certain flags with checkbox? not implemented ATM
            out += "<li class=\"hide\">[" + array[flag].queriesAffected.join(", ") + "] " + flagtext + "</li>\n";
        }
        else {
            out += "<li>[" + array[flag].queriesAffected.join(", ") + "] " + flagtext + "</li>\n";
        }
    }
    out += "</ul>";
    return out;
}

// ----------------------- GENERIC HELPER FUNCTIONS  -----------------------


function capitalizeFirstLetter(string) {
    var stringArray = string.split(/\n/);
    var finalSegment = "";

    for (var x = 0; x < stringArray.length; x++) {
        var originalString = stringArray[x];
        var returnString = originalString;
        var leftString = "";

        for (var i = 0; i < originalString.length; i++) {
            if (originalString[i].match(/\d/) && originalString[i - 1] != "{") { // starts with a number and it's not in the placeholder (=> no capitalization needed)
                finalSegment += returnString;
                if (x != stringArray.length - 1) finalSegment += "\n";
                break;
            }

            if (originalString[i].match(/([^\u0000-\u007F¿]|[a-zA-Z])/)) {
                returnString = leftString + originalString[i].toLocaleUpperCase() + originalString.slice(i + 1);
                finalSegment += returnString;
                if (x != stringArray.length - 1) finalSegment += "\n";
                break;
            }
            else {
                leftString += originalString[i];
            }
        }
    }
    return finalSegment;
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

function waitForElementToDisplay(selector, time) {
    if (document.querySelector(selector) != null) {
        document.querySelector("[aria-label='Show hidden characters']").dispatchEvent(new Event('mousedown', { bubbles: true }));
        document.querySelector("[aria-label='Show hidden characters']").dispatchEvent(new Event('mouseup', { bubbles: true }));
        return;
    }
    else {
        setTimeout(function () {
            waitForElementToDisplay(selector, time);
        }, time);
    }
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

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function findAncestor(el, sel) {
    while ((el = el.parentElement) && !((el.matches || el.matchesSelector).call(el, sel)));
    return el;
}

function truncate(str, length, ending) {
    if (length == null) {
        length = 100;
    }
    if (ending == null) {
        ending = '...';
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
};

function copyPasteIntent() {
    var activeQuery = document.querySelector('div[contenteditable="true"]');
    if (!activeQuery) {
        alert("No segment selected! Select a segment before pressing Copy/Paste");
        return false;
    }
    var activeMessage = findAncestor(activeQuery, 'div[data-tu-seq-no]');

    var target = activeMessage.querySelector('div[jsname^="tu"]');
    var activeQueries = addPlaceholderSyntax(target.outerHTML,null,1);
    //GM_setClipboard(JSON.stringify(activeQueries));
    GM_setValue("clippy",JSON.stringify(activeQueries));

}

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

function PasteIntent() {
    try {
        var clip = JSON.parse(GM_getValue("clippy"));
    }
    catch(e) {
        alert("No copied segments from Triton. Perhaps try again? Hm?");
        return false;
    }

    var activeQuery = document.querySelector('div[contenteditable="true"]');
    if (!activeQuery) {
        alert("No segment selected! Select a segment before pressing Paste");
        return false;
    }
    var activeMessage = findAncestor(activeQuery, 'div[data-tu-seq-no]');

    var target = activeMessage.querySelector('div[jsname^="tu"]');
    var source = activeMessage.querySelector('div[id^="src"]');

    var originalQueries = getSegmentsArrayFromHTML(target.outerHTML);
    console.log("Original query contents:");
    for(var y=0; y<originalQueries.length; y++) {
     var text = originalQueries[y].textContent;
        console.log(text);
    }

    function fillQueriesFromClipboard() {
        console.log("Filling in queries from clipboard!");
        queries = activeMessage.querySelectorAll('[data-edited]'); // POTENTIALLY BREAKABLE - relies on data-edited attribute, seems to be reliable but may change in the future

        for (var q = 0; q < clip.length; q++) {
            var segmentContent = clip[q];
            var segmentHTML = queries[q].outerHTML;
            var segment = queries[q];

            // index the placeholders
            var placeholderMap = extractPlaceholderMapFromSegment(getSegmentsArrayFromHTML(source.outerHTML,"source")[0].outerHTML); // take placeholder map from first source query
            segmentContent = switchPlaceholdersForImages(segmentContent, placeholderMap);

            segment.dispatchEvent(new Event('focus'));
            segment.innerHTML = segmentContent;
            segment.dispatchEvent(new KeyboardEvent('input', { bubbles: true }));

        }
        return true;
    }

    var queries = activeMessage.querySelectorAll('[data-edited]'); // POTENTIALLY BREAKABLE - relies on data-edited attribute, seems to be reliable but may change in the future

    // If there's more clipboard queries than target query boxes
    if(queries.length < clip.length) {
        var toAdd = clip.length - queries.length;
        var added = 0;
        var timer;
        timer = setInterval(function(){
            if(added == toAdd) {
                //console.log("All new queries added");
                clearInterval(timer);
                fillQueriesFromClipboard();
            }
            else {

                //activeQuery.parentElement.nextElementSibling.firstElementChild.dispatchEvent(new Event('click', { bubbles: true }));
                target.querySelectorAll("li")[added].querySelector('li> div > div >[role="button"]').dispatchEvent(new Event('click', { bubbles: true }))
                added++
            }
        }, 300);

    }

    // REMOVE QUERY BOXES

    else if(queries.length > clip.length) {
        var toRemove =  queries.length - clip.length;
        var removed = 0;
        var timer2;
        timer2 = setInterval(function(){
            if(removed == toRemove) {
                //console.log("All extra queries removed");
                clearInterval(timer2);
                fillQueriesFromClipboard();
            }
            else {
                //console.log("Removing a query (" + removed + " out of " + toRemove +")");
                var removeButton = target.querySelector("li").querySelector('[aria-label="Delete segment"]');
                removeButton.dispatchEvent(new Event('click', { bubbles: true }));
                removed++
            }
        }, 200);

    }

    // NO ACTION NEEDED
    else {
        fillQueriesFromClipboard();
    }
}