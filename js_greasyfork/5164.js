// ==UserScript==
// @name		[Japanese] WaniKanify Vocabularizer
// @namespace		wanikanify_kaiko
// @description		Replaces vocabulary on English Websites with Japanese vocabulary learned from WaniKani
// @include		*
// @exclude	/^https?://.*wanikani\.com/?/
// @exclude	/^http?://.*wanikani\.com/?/
// @version     1.0.0
// @grant		 GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant		GM_deleteValue
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/5164/%5BJapanese%5D%20WaniKanify%20Vocabularizer.user.js
// @updateURL https://update.greasyfork.org/scripts/5164/%5BJapanese%5D%20WaniKanify%20Vocabularizer.meta.js
// ==/UserScript==

/* ---------------------------------------------------------------------------------------------------------------------------------------------
******************************************** TO NEW USERS: *****************************************************
------------------------------------------------------------------------------------------------------------------------------------------------
BACK UP THIS SCRIPT AFTER YOU EDIT IT!
- This script may be replaced by GreaseMonkey at any time, especially if the script Author updates this script and it redownloads the latest version.
- If this script is replaced, then all you need to do is re-edit the new script and copy+paste over your edited user lists from your backup.

HOW TO EDIT THE SCRIPT
- There is a tutorial at the GreasyFork page: https://greasyfork.org/scripts/5164-wanikanify-vocabularizer

@ "var ignoredWaniKaniMeanings":
- Words added here will be ignored from WaniKani. Make sure to type the meanings exactly as they are on WaniKany, one entry at a time.

@ "var userWords"
- Words added here will override ignoredWaniKaniMeanings if the same meaning exists in both.
- Words added here will not be automatically conjugated (not even plurals), and any translation errors are your own doing. 
- Will override WaniKani meanings. Example the entry "mountains" will override "mountain" from WaniKani conjugating to "mountains", but won't stop other conjugations (eg: ed, ing).

SYNTAX MATTERS!
- Follow the structures of the current example lists. If the script breaks after you edit these lists, then check your syntax!

REMOVING THE RIGHT-CLICK 'CONTEXT MENU'
@ "var contextMenu" is enabled if "true", or disabled if "false".
The menu is always accessible from GreaseMonkey's add-on menu.

Note: I've tried to make this as user accessible as possible. Sorry for any issues, however I am working within limitations of GreaseMonkey.
------------------------------------------------------------------------------------------------------------------------------------------------
******************************************** TO NEW USERS: *****************************************************
----------------------------------------------------------------------------------------------------------------------------------------------*/

var ignoredWaniKaniMeanings = [
    "the answer",
	"pm",
	"hide",
	"hello",
]

var userWords = [
	{character: "山々", kana: "やまやま", meaning: "mountains"},
	{character: "京", kana: "きょう", meaning: "capital"},
	{character: "カイ", kana: "カイ", meaning: "kai"},
]


// true to enable right-click context menu, false to disable it | Always accessible from GreaseMonkey's add-on menu
var contextMenu = true; 

//----------------------------------------------------------
//INITIALIZE MENU CREATION/INTERACTION - Only firefox compatible
//----------------------------------------------------------
var scriptName = "WaniKanify: ";
// If we're downloading new vocabulary; stop from redownloading while already downloading
var downloading = false;
// Run the script after updating our vocabulary
var runAfter = false;
// Get our API key
var apiKey = GM_getValue("apiKey");

if (contextMenu) {
    var wanikani_menu = document.body.appendChild(document.createElement("menu"));
    wanikani_menu.outerHTML = '<menu id="wanikanify-menu" type="context">\
		<menu label="WaniKanify">\
			<menuitem label="Run WaniKanify" id="wanikanify-run" icon="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsSAAALEgHS3X78AAACmUlEQVQ4y4WSW0iUURSFv3P+X2e8NWjNmFqjRBcrgiwCIaGIKCjoocIQJKy3Igqieil76EbQDYISjEAz0u5FhPQQGmUTRaVSmGkDM2EXB2/j6Nz+mdPDP+UlqQ3nZZ291tl7nSW4pZiiPIBzEuYF8scDUsSRk5p6ATUFmQSmEj0AOH52ThBQgJ3/lx1Q987M4Ydj4R8BU1VATnUxBVWF/DVbonKaDjFYt4RARkqvkKD/Vp19ZQVlFV8Z2uonHIyR6reiYlBlCwGQX7OGjVtc6MU659KyEacCdiliSAQeBGyp6GA4OIjU42RMF6i4OdEuv5VNbyxs2PzSBESMyrll2DSNYHe5R5Yc1J17R22EgwZfPoYBMCIJlzWwJqWycJmd57VxbL37OL/0IAcuPma6oRF/1eUUZYvtKnN/AKXiXC4+TNiiYUnWoT8AKRbT3VCEUMSgsbmLFw1NFJFKaV4mWK3IIaeFTpdhPhmNkjwcNMkAoQi3H7aS1rabtded+GpbOJ6ba5KBuu4fiO8th9TVuy3sLV9NhjCtP1HTTId/kBsb2s3PtcJIdRGaUDzp9bPeMY36ngF2VHrQz2665N25fZXz/umnACTpGiVpyfgeugkPLEfFYtzqGUBzzoCYgWc4SN4uF32p2RDFK97tWUdhtk01tHnRpDB3/txDYDRIli2dJAEhI07Xtz6OVQUgOiEWQi/MtnGz3evTpLA70q343ruRUpCTZePOiJ36StdY+0SyDxJ5k0I4+gdH8LW6cfcNE1NxHr3+wqKg+1+RdgDIm+1eAB50CXFpQYVvljCIGor582byQdlpvrYSlBp/fGaiEjtQOzR2CRw5WsDoSMTTuO2Cc9anZ7wtPUl/ShYI4UXIfBAgJQgBQvILiA4DtrlIXJsAAAAASUVORK5CYII="></menuitem>\
			<menuitem label="Refresh vocabulary" id="wanikanify-refresh"></menuitem>\
			<menuitem label="Toggle auto-run" id="wanikanify-autorun"></menuitem>\
			<menuitem label="Set API key" id="wanikanify-apikey"></menuitem>\
		</menu>\
	</menu>';

    document.body.setAttribute("contextmenu", "wanikanify-menu");
    document.querySelector("#wanikanify-run").addEventListener("click", function () { run(); }, false);
    document.querySelector("#wanikanify-refresh").addEventListener("click", function () { tryRefreshVocab(); }, false);
    document.querySelector("#wanikanify-autorun").addEventListener("click", function () { checkAutoRun(); }, false);
    document.querySelector("#wanikanify-apikey").addEventListener("click", function () { promptApiKey(); }, false);
}

GM_registerMenuCommand(scriptName + "Run", run);
GM_registerMenuCommand(scriptName + "Refresh vocabulary", tryRefreshVocab);
GM_registerMenuCommand(scriptName + "Toggle auto-run", checkAutoRun);
GM_registerMenuCommand(scriptName + "Set API key", promptApiKey);

function tryRefreshVocab() {
    if (apiKey != undefined) downloadVocab();
    else if (apiKey == undefined) promptApiKey();
}

function checkAutoRun() {
    var autoRun = GM_getValue("autoRun");
    if (apiKey == undefined) {
        promptApiKey();
    } else if (autoRun != true) {
        autoRun = true;
        GM_setValue("autoRun", autoRun);
        run();
    } else {
        autoRun = false;
        GM_setValue("autoRun", autoRun);
    }
}

// AutoRun if we can
window.addEventListener ("load", function () {
	if (apiKey != undefined && GM_getValue("autoRun") == true) {
		run();
	}
}, false);

function promptApiKey() {
    while (true) {
        apiKey = GM_getValue("apiKey");
        apiKey = window.prompt("Please enter your API key", apiKey ? apiKey : "");
        if (apiKey !== null && !/^[a-fA-F0-9]{32}$/.test(apiKey)) alert("That was not a valid API key, please try again");
        else break;
    }

    if (apiKey != undefined && apiKey != GM_getValue("apiKey")) GM_setValue("apiKey", apiKey);
}

//----------------------------------------------------------
//END MENU CREATION/INTERACTION
//----------------------------------------------------------
function run() {
	if (apiKey != undefined){
		// If we haven't ever downloaded our vocabulary, then lets do so before we run
		if (GM_getValue("wanikaniVocabLookup") != undefined && !downloading) {
			replaceVocab();
		} else if (!downloading) {
			runAfter = true;
			downloadVocab();
		} else if (downloading) {
			runAfter = true;
		}
	}
	else {
		promptApiKey();
	}
}

//Massive credit to http://stackoverflow.com/a/9229821
function uniqueArray(a, key) {
    var seen = {};
    return a.filter(function (item) {
        var k = key(item);
        return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    })
}

function downloadVocab() {
    downloading = true;

    GM_xmlhttpRequest({
        method: "GET",
        url: "http://www.wanikani.com/api/v1.2/user/" + apiKey + "/vocabulary/",
        onerror: function (response) {
            alert(scriptName + "Error while downloading new vocab. Please try again later.");
            downloading = false;
        },
        onload: function (response) {
            var json;

            try {
                json = JSON.parse(response.responseText);
            } catch (e) {
                alert(scriptName + "Unable to process new vocab. Please try again later.", e);
            }

            if (json) {
                // Loop through all received words
                var vocabList = json.requested_information.general;
                var wanikaniVocab = [];

                for (var i = 0; i < vocabList.length; i++) {
                    var vocab = vocabList[i];
                    if (!vocab.user_specific) continue; // Skip words not yet learned

                    // Split multiple meanings from WaniKani
                    var meanings = vocab.meaning.split(", ");

                    // Remove words we don't want from WaniKani, and force our user words to override WaniKani words
                    for (var m = 0; m < meanings.length; m++) {
						for (var x = 0; x < ignoredWaniKaniMeanings.length; x++) {
                            if (meanings[m] === ignoredWaniKaniMeanings[x]) {
                                meanings.splice(m, 1);
                            }
                        }
						
						for (var y = 0; y < userWords.length; y++) {
                            if (meanings[m] === userWords[y].meaning) {
                                meanings.splice(m, 1);
                            }
                        }
                    }

                    // Conjugate verbs
                    var conjugations = [];
                    for (var m = 0; m < meanings.length; m++) {
                        var word = meanings[m];
                        // If a verb...
                        if (/^to /.test(word)) {
                            // Remove leading 'to'
                            meanings[m] = word.substr(3);
							word = meanings[m];
							
                            // Remove 'e' suffix for conjugations
                            if (word.slice(-1) == "e") {
								word = word.slice(0, -1);
							}

                            if (!/ /.test(word)) {
								conjugations.push(word + "ed", word + "es", word + "en", word + "es", word + "s", word + "ing");
							}
                        }

                        // Not a verb, try plural
                        else if (word.length >= 3 && word.slice(-1) != "s") {
							conjugations.push(word + "s");
						}
                    }

					//Remove Wanikani words we don't want...
					for (var c = 0; c < conjugations.length; c++){
                        for (var y = 0; y < userWords.length; y++) {
                            if (conjugations[c] === userWords[y].meaning) {
                                conjugations.splice(c, 1);
                            }
                        }
						
						for (var e = 0; e < ignoredWaniKaniMeanings.length; e++) {
                            if (conjugations[c] === ignoredWaniKaniMeanings[e]) {
                                conjugations.splice(c, 1);
                            }
                        }
                    }
					
                    meanings.push.apply(meanings, conjugations);

                    // Finalize our vocabulary
					for (var m = 0; m < meanings.length; m++) {
                        //Hopefully eval() here is safe...
                        var wanikaniVocabStr = '{"character":vocab.character, "kana":vocab.kana, "meaning":meanings[m] }';
                        var wanikaniVocabStrObj = eval("(" + wanikaniVocabStr + ")");
                        wanikaniVocab.push(wanikaniVocabStrObj);
                    }
                    // Add our custom non-conjugated words
					wanikaniVocab.push.apply(wanikaniVocab, userWords);
                }

                // Eliminate duplicate results
                var wanikaniVocabUnique = uniqueArray(wanikaniVocab, JSON.stringify);

                // Remap our array of objects to an object; drastically faster access than a for-loop at run-time for text replacement
                var wanikaniVocabLookup = {};
                for (var i = 0; i < wanikaniVocabUnique.length; i++) {
                    wanikaniVocabLookup[wanikaniVocabUnique[i].meaning] = wanikaniVocabUnique[i];
                }
				
                // Update our local SQLite database storage with the new vocabulary
                var vocabJSON = JSON.stringify(wanikaniVocabLookup);

                GM_deleteValue("wanikaniVocabLookup");
                GM_setValue("wanikaniVocabLookup", vocabJSON);

                if (!runAfter) alert(scriptName + "Successfully updated vocab!");
                else alert(scriptName + "Successfully updated vocab! Now running...");

                // Release download lock
                downloading = false;

                // if we had to redownload vocab before running, continue to run
                if (runAfter) replaceVocab(wanikaniVocabLookup);
            }
        }
    });
}

function replaceVocab(wanikaniVocabLookup) {
    // No vocab array given, try to parse locally with JSON
    if (!wanikaniVocabLookup || wanikaniVocabLookup == undefined) {
        try {
            wanikaniVocabLookup = JSON.parse(GM_getValue("wanikaniVocabLookup"));
            if (!wanikaniVocabLookup || (wanikaniVocabLookup && jQuery.isEmptyObject(wanikaniVocabLookup))) throw 1;
        } catch (e) {
            alert(scriptName + "Error while parsing the vocab list; deleting it now. Please refresh vocabulary.");
            GM_deleteValue("wanikaniVocabLookup");
            return;
        }
    }

    var replaceCallback = function (str) {
        // Performance of this may be questionable (in the future)... please don't lynch me programmer gods ;-;
        if (wanikaniVocabLookup.hasOwnProperty(str.toLowerCase())) {;
            var translation = wanikaniVocabLookup[str.toLowerCase()];
            return '<span style="font-family:arial" class="wanikanified" title="' + str + " [" + translation.kana + "] " + '" data-en="' + str + '" data-jp="' + translation.character +
                '" onClick="var t = this.getAttribute(\'data-en\'); this.setAttribute(\'data-en\', this.innerHTML); this.innerHTML = t;">' + translation.character + '</span>';
        }
        return str;
    };

    var nodes = $("body *:not(noscript):not(script):not(style)");

    // Very naive attempt at replacing vocab consisting of multiple words first
    nodes.replaceText(/\b(\S+?\s+\S+?\s+\S+?\s+\S+?)\b/g, replaceCallback);
    nodes.replaceText(/\b(\S+?\s+\S+?\s+\S+?)\b/g, replaceCallback);
    nodes.replaceText(/\b(\S+?\s+\S+?)\b/g, replaceCallback);
    nodes.replaceText(/\b(\S+?)\b/g, replaceCallback);
}

//Credit to: http://benalman.com/projects/jquery-replacetext-plugin/
(function ($) {
    $.fn.replaceText = function (b, a, c) {
        return this.each(function () {
            var f = this.firstChild,
                g, e, d = [];
            if (f) {
                do {
                    if (f.nodeType === 3) {
                        g = f.nodeValue;
                        e = g.replace(b, a);
                        if (e !== g) {
                            if (!c && /</.test(e)) {
                                $(f).before(e);
                                d.push(f)
                            } else {
                                f.nodeValue = e
                            }
                        }
                    }
                } while (f = f.nextSibling)
            }
            d.length && $(d).remove()
        })
    }
})(jQuery);