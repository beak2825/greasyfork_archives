// ==UserScript==
// @name		Retrieve Full Page Titles in Google Search
// @description	Fill the page link titles with the full respective page titles, if possible
// @version		2.0.1
// @namespace	Google
// @author		Benjamin Philipp <dev [at - please don't spam] benjamin-philipp.com>
// @include		/https?:\/\/(www\.)?google\.[a-z\.]{2,6}\/(search|webhp)\?((?!tbm=isch).)*$/
// @require 	http://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require		https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require 	https://greasyfork.org/scripts/447081-bp-funcs/code/BP%20Funcs.js
// @run-at		document-body
// @noframes
// @grant		GM_addStyle
// @grant		GM_xmlhttpRequest
// @grant		GM_registerMenuCommand
// @grant		GM_getValue
// @grant		GM_setValue
// @connect		*
// @downloadURL https://update.greasyfork.org/scripts/27406/Retrieve%20Full%20Page%20Titles%20in%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/27406/Retrieve%20Full%20Page%20Titles%20in%20Google%20Search.meta.js
// ==/UserScript==

// 2.0.0
// - Using GM_Config for settings now (https://github.com/sizzlemctwizzle/GM_config) 🖤
//   (Available from the Tampermonkey menu, under the script name)
// - Added setting to disregard new titles if they're shorter than the old ones. Duh, should have done that from the start ^^
//   (ON by default)
// - The new titles, as well as additional info (old titles, errors, warnings) are now always shown in the element title (mouse hover tooltip), where applicable
// - Moved away from extending the whole layout width in favor of just showing the overflowing new titles.
//   This is to prevent clashes with google widgets and panels that may appear on the right.
//   If anything is covered, the longet titles are now always available on mouse hover over the links.
// - Fixed a potential issue where titles containing special chars could inadvertently render HTML instead of just their escaped text 😬
// - Using my function library again, also for nicer logging
// - moved to classes for styling instead of "spaghetti" element styles
// I dunno, probably some other stuff. I'm an artist, not a book keeper 😜
// 1.9.7:
// added newer CSS variable "center-column-width" for unrestricting column width
// 1.9.6:
// Remove width limit for results column and items
// 1.9.5:
// corrected selectors for color changes
// 1.9.4:
// changed background colors from "very light shades" to "transparent clors", for dark mode

var settings = {};
settings.applyToLinkText = true;
settings.rex = "<title([^>]*)>(.*?)<\\/title>";
settings.dontLookupExtensions = "pdf";
settings.ignoreShorter = true;
settings.ignoreTitles = "^Just a moment...\n^Continue$\n^Untitled$\n^Please wait$\n^Redirecting$\n^Watch$\n/^(log|sign )in$\n^Reddit - Dive into anything/i";
settings.verbosity = 1;

var logger = new BPLogger(GM_info.script.name);

if("undefined" != typeof GM_config){
	GM_config.init(
	{
		'id': 'MyConfig',
		'title': GM_info.script.name + ' Settings',
		'fields': {
			'applyToLinkText': {
				'label': '<b>Replace the actual <i>link text</i> with any found title</b><br /> <i>ON:</i> Change innerHTML of links and applying overflow: visible to parents <br /><i>OFF:</i> Only apply to Link Title (for mouseover Tooltip) <br /><i class="small">Default: ON</i> ',
				'type': 'checkbox',
				'default': true
			},
			'rex': {
				'label': '<b>Regex to find the title of a page.</b> If you find a better way, please <a href="https://greasyfork.org/en/scripts/27406-retrieve-full-page-titles-in-google-search/feedback" target="_blank">let me know</a>! <br /><i class="small">Default: "<title([^>]*)>(.*?)<\\/title>"</i>',
				'type': 'text',
				'default': "<title([^>]*)>(.*?)<\\/title>"
			},
			'dontLookupExtensions': {
				'label': '<b>Exclude file extensions from lookup.</b> For example, links to .pdf file will usually trigger a downlaod when following the link with a GET request. <br /><i class="small">Separate with commas. Default: "pdf',
				'type': 'text',
				'default': "pdf"
			},
			'ignoreShorter': {
				'label': '<b>Ignore new titles that are shorter than the old ones.</b> Titles shorter than the originally truncated ones are probably not what we want. <br /><i class="small">Default: ON</i>',
				'type': 'checkbox',
				'default': true
			},
			'ignoreTitles': {
				'label': '<b>Ignore looked up titles when they return one of these.</b> Usually only needed when the above setting is OFF. <br /><i class="small">Can be RegEx by using /slash delimiters/. Default: <br />Just a moment...<br />Continue<br />Please wait<br />Redirecting<br />Watch<br />/^(log|sign )in$/i</i>',
				'type': 'textarea',
				'default': "Just a moment...\nContinue\nPlease wait\nRedirecting\nWatch\n/^(log|sign )in$/i"
			},
			'verbosity': {
				'label': '<b>Console logging verbosity.</b> 0 = no logs; 1 = reports on link counts; 2 = +statuses of link checks; 3 = +Details <br /><i class="small">Default: 1</i>',
				'type': 'int',
				'default': 1
			}
		},
		'css': `
		#MyConfig{
			background: #333;
			color: #ccc;
			line-height: 1.33em;
		}
		#MyConfig input[type="text"],
		#MyConfig input[type="email"],
		#MyConfig input[type="number"],
		#MyConfig input[type="password"],
		#MyConfig input[type="url"],
		#MyConfig input[type="submit"],
		#MyConfig input[type="reset"],
		#MyConfig input[type="button"],
		#MyConfig select,
		#MyConfig option,
		#MyConfig textarea
		{
			box-sizing: border-box;
			background: #1a1a1a;
			padding: 0.8em;
			color: #fff;
			vertical-align: bottom;
		}
		#MyConfig input[type="text"],
		#MyConfig input[type="email"],
		#MyConfig input[type="number"],
		#MyConfig input[type="password"],
		#MyConfig input[type="url"],
		#MyConfig textarea
		{
			width: 100%;
			border: 2px inset rgba(20,108,128,0.5);
			border-radius: 0.1em;
		}
		#MyConfig input:focus,
		#MyConfig textarea:focus
		{
			color: #fff;
			background: #000;
		}
		#MyConfig textarea
		{
			min-height: 6em;
		}
		#MyConfig .field_label{
			font-weight: normal;
			font-size: 15px;
		}
		#MyConfig kbd{
			border: 1px solid rgba(128,128,128,0.5);
			background: rgba(128,128,128,0.2);
			border-radius: 3px;
			padding: 1px 3px;
			font-family: consolas, monospace;
		}
		#MyConfig .code{
			background: rgba(128,128,128,0.1);
			padding: 1px 3px;
			font-family: consolas, monospace;
		}
		#MyConfig .field_label .small{
			font-size: 80%;
		}
		#MyConfig .config_header{
			margin: 1em 0;
		}
		#MyConfig .config_var{
			border: 1px solid rgba(128,128,128,0.5);
			padding: 1em;
			margin: 0.5em 0 0;
			border-radius: 0.5em;
		}
		#MyConfig a{
			color: #fff;
		}
		#MyConfig .reset, #MyConfig .reset a, #MyConfig_buttons_holder {
			color: #aaa;
		}
		#MyConfig button, #MyConfig .button,
		#MyConfig input[type="submit"],
		#MyConfig input[type="reset"],
		#MyConfig input[type="button"],
		#MyConfig .saveclose_buttons{
			background: rgba(40, 130,180,0.7);
			color: #ddd;
			border: 1px solid transparent;
			cursor: pointer;
			padding: 0.5em 1em;
			border-radius: 0.75em;
			transition: all 0.5s;
		}
		#MyConfig button:hover, #MyConfig .button:hover,
		#MyConfig input[type="submit"]:hover,
		#MyConfig input[type="reset"]:hover,
		#MyConfig input[type="button"]:hover{
			background: rgba(0, 70,100,1);
			color: #fff;
			border-color: rgba(40, 210,255,1);
			border-radius: 0;
		}
		`, 
		events: {
			init: main
		}
	});
}
else{
	log("Could not load GM_config! external resource may be temporarily down?\nUsing default settings for now.", 1, "error");
	
	GM_registerMenuCommand(GM_info.script.name + ' Settings', function(){
		alert("Could not load GM_config! external resource may be temporarily down?\nUsing default settings for now.");
		main(false);
		// TODO: nicer message
		// TODO: Manual lookup
	});
}

logger.level = settings.verbosity;

var myVersion = GM_info.script.version;
var settingsSafety = settings;
var linkmatch = "#search #rso .g a h3";
var resultsObserver;
var idle = true;
var idletimer;
var updaterequest = false;
var openRequests = 0;
var successRequests = 0;
var failedRequests = 0;
var msgPrefix = "Full Page Titles in Google Search:\n";

var lastCount = null;

function log(obj, level = 1, type = "default"){
	if(!(obj instanceof Array))
		obj = [obj];
	logger.writeLog(obj, type, level);
}

log("Verbosity level: " + settings.verbosity, 1);

GM_addStyle(`
/* // Legacy, old version. 
#rso div.g{
	width:auto!important;
}
.srp {
    --center-column: auto;
    --center-column-width: auto;
	--center-width: auto;
}
*/
.showverflow{
	overflow: visible!important;
	contain: layout!important;
}
.imgFix{
    position: relative;
    top: 4em;
}
.titlesChecking{
	background-color: rgba(255, 200, 0, 0.1);
}
.titlesFail{
	background-color: rgba(255, 0, 0, 0.1);
}
.titlesOK{
	background-color: rgba(30, 255, 0, 0.1);
}
`);

var rexRex = /\/(.+)\/([dgimsuy]*)/;

for(let i=0; i<settings.ignoreTitles.length; i++){
	let x = settings.ignoreTitles[i];
	let m = rexRex.exec(x);
	if(m && m.length>1){
		try{
			let rex = new RegExp(m[1], m[2]);
			settings.ignoreTitles[i] = rex;
		}
		catch(e){
			log("Not a valid regular expression in settings.ignoreTitles: " + x, 1, "error");
		}
	}
}

function updatePage(){
    var allinks = 0;
    log("Walking through Links...", 2);
	$(linkmatch + ":not([titleDone], .titlesChecking)").each(function(){
        allinks ++;
//        log(this, 3);
//        log("Looking at Link '" + $(this).parent()[0].href + "' (" + this.innerHTML + ")", 3);
		if(this.textContent.substr(this.textContent.length-3)=="..."){
			log("'" + this.textContent + "' Needs checking", 2);
			$(this).addClass("titlesChecking");
			getTitle(this);
		}
	});
	if(lastCount !== openRequests)
		log(openRequests + " of " + allinks + " links need to be checked.", 1);
	lastCount = openRequests;
}

function getTitle(el){
	var a = $(el).closest("a")[0];
    log("Title '" + a.href + "' (" + el.textContent + ") looks shortened.", 3);
	for(var i=0; i<settings.dontLookupExtensions.length; i++)
	{
		if(a.href.endson(settings.dontLookupExtensions[i], true)){
            log("Excluding Link '" + a.href + "' (" + el.textContent + ") because the extension (" + settings.dontLookupExtensions[i] + "), which is excluded", 3);
			el.title = "The extension " + settings.dontLookupExtensions[i] + " is excluded in settings";
			$(el).removeClass("titlesChecking");
			$(el).addClass("titlesFail");
			$(el).attr("titleDone", "true");
			return;
        }
	}
    openRequests++;
	$(el).addClass("titlesChecking");
	GM_xmlhttpRequest({
		url: a.href,
		method: "GET",
		timeout: 15000, //15 seconds timeout
		onload: function(res){
			$(el).attr("titleDone", "true");
			$(el).removeClass("titlesChecking");
            var mrex = new RegExp(settings.rex, "i");
			var tit = mrex.exec(res.response);
			if(tit === undefined || tit === null){
                log("No title found in response for " + a.href, 2, "error");
				el.title = "Failed to get title: No title found in response";
				$(el).addClass("titlesFail");
                report("fail");
				return;
            }
			tit = unEscapeHtml(tit[2]);
			var oldTitle = $(el).text().trim();
			if(settings.ignoreShorter && tit.length < oldTitle.length-3){
				log("Ignoring title '" + tit + "' because it is shorter than the original (" + oldTitle + ")", 3, "warn");
				el.title = "(Ignore:) " + tit;
				$(el).addClass("titlesFail");
				report("success");
				return;
			}
			for(let x of settings.ignoreTitles){
				if((x instanceof RegExp && tit.match(x)) || (typeof x == "string" && x.toLowerCase() == tit.toLowerCase())){
					log(["Ignoring title '" + tit + "' because of the excludion rule", x, "specified in settings"], 3, "warn");
					el.title = "(Ignore:) " + tit;
					$(el).addClass("titlesFail");
					report("success");
					return;
				}
			}
			$(el).addClass("titlesOK");
            if(settings.applyToLinkText){
                $(el).text(tit);
				el.title = tit + "\n\nOriginal Title: " + oldTitle;
                $(a).css("white-space", "nowrap");
                $(a).parentsUntil(".g").last().find("[data-content-feature] img").parents("[data-content-feature]").first().addClass("imgFix");
                $(a).parentsUntil("#main", ":not(.showverflow)").addClass("showverflow");
            }
			else
				el.title = tit;
            report("success");
		},
		onerror: function(res){
			$(el).attr("titleDone", "true");
			$(el).removeClass("titlesChecking");
			$(el).addClass("titlesFail");
			el.title = "Failed to get full title: Error loading page";
			log({error: "Error loading page", link: el}, 2, "error");
            report("fail");
		},
		ontimeout: function(res){
			$(el).attr("titleDone", "true");
			$(el).removeClass("titlesChecking");
			$(el).addClass("titlesFail");
			el.title = "Failed to get full title: Connection timed out";
			log({error: "Connection timed out", link: el}, 2, "error");
            report("fail");
		}
	});
}

function report(status){
    switch(status){
        case "success":
            successRequests ++;
            openRequests --;
            break;
        case "fail":
            failedRequests ++;
            openRequests --;
            break;
    }
    log(successRequests + " requests successful, " + failedRequests + " failed. " + openRequests + " Requests open.", 1);
}

function unEscapeHtml(text){
	var t = document.createElement("TEXTAREA");
	t.innerHTML = text;
	return t.value;
}

String.prototype.endson = function(str, insensitive){
  return new RegExp("("+escapeRegExp(str)+")$", insensitive?"i":"").test(this);
};

function escapeRegExp(str) {
	return str.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}

function updater(t = 1000){
	if(idle)
	{
		idle = false;
		updaterequest = false;
		updatePage();
		idletimer = setTimeout(function(){
			idle = true;
			if(updaterequest)
				updatePage();
		}, t);
	}
	else
	{
        log("Updater called but busy",3);
		updaterequest = true;
	}
}

function main(hasSettings=true){
	if(hasSettings){
		GM_registerMenuCommand(GM_info.script.name + ' Settings', function(){
			GM_config.open();
		});

		settings.applyToLinkText = GM_config.get("applyToLinkText");
		settings.rex = GM_config.get("rex");
		settings.dontLookupExtensions = GM_config.get("dontLookupExtensions").split(",").map(a=>"." + a.trim());
		settings.ignoreShorter = GM_config.get("ignoreShorter");
		settings.ignoreTitles = GM_config.get("ignoreTitles").split(/\r?\n/);
		settings.verbosity = GM_config.get("verbosity");
	}
	log("Start updater interval", 3);
	setInterval(updater, 2000);
}

/* jshint loopfunc: true, -W027 */
/* eslint-disable curly, no-redeclare */
/* eslint no-trailing-spaces: off */
/* globals $, GM_info, GM_setValue, GM_getValue, GM_xmlhttpRequest, GM_addStyle, GM_openInTab, GM_setClipboard, GM_config, escape, uneval, unsafeWindow, BPLogger_default, log, error, warn, getParam, waitFor, BPLogger */