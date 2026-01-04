// ==UserScript==
// @name                dict.cc-verbix
// @namespace	        https://github.com/todeit02/dict.cc_verbix_userscript
// @description	        Injects verb conjugation tables from Verbix on dict.cc
// @grant				GM.xmlHttpRequest
// @grant				GM_xmlhttpRequest
// @include				/^https:\/\/(?:(?:([a-z]){2}-?([a-z]){2})|(www))\.dict\.cc\/\?s=.*/
// @connect				api.verbix.com
// @connect 			raw.githubusercontent.com
// @require 			https://code.jquery.com/jquery-3.3.1.js
// @version 0.0.1.20190210183046
// @downloadURL https://update.greasyfork.org/scripts/377616/dictcc-verbix.user.js
// @updateURL https://update.greasyfork.org/scripts/377616/dictcc-verbix.meta.js
// ==/UserScript==

// choose correct function for Greasemonkey/Tampermonkey
if(typeof GM_xmlhttpRequest !== "function") GM_xmlhttpRequest = GM.xmlHttpRequest;

const tenseNamesUrl = "https://raw.githubusercontent.com/todeit02/dict.cc_verbix_userscript/master/tense_names.json";
const verbixApiUrl = "https://api.verbix.com/conjugator/html";
const verbixTableTemplateUrl = "http://tools.verbix.com/webverbix/personal/template.htm";

const dictWordButtonTableClass = "td7cml";
const dictWordTextTableDataClass = "td7nl";
const dictItemTableLineIdSuffix = "tr";
			
	
const verbixLanguageCodes = 
{
	"de": "deu",
	"en": "eng",
	"da": "dan",
	"es": "spa",
	"fi": "fin",
	"fr": "fra",
	"hu": "hun",
	"is": "isl",
	"it": "ita",
	"la": "lat",
	"nl": "nld",
	"no": "nob",
	"pt": "por",
	"ro": "ron",
	"sv": "swe"
};


const usingTemplateMoodTenses = 
[
	["Indicativo", "Presente"],
	["Indicativo", "Perfecto"],
	["Indicativo", "Imperfecto"],
	["Subjuntivo", "Presente"],
	["Imperativo", ""]
];


let languagePair = [];
let templateHeadingsTranslations = {};
let hoveredWordLink;
let openTooltips = [];

let cursorOnWordLink = false;
let cursorOnTooltip = false;


$(function(){
	languagePair = getLanguagePair();
	loadTemplateHeadingsTranslations();
	linkWordsToVerbix();
});


function linkWordsToVerbix()
{
	let dictItemTableLines = $("div[id='maincontent']").find("tr" + "[id^='" + dictItemTableLineIdSuffix + "']");
	let dictWordLinks = dictItemTableLines.find("a").filter(function(){ return $(this).text().length > 0; });
	
	dictWordLinks.hover(
		(event) =>
		{
			cursorOnWordLink = true;
			hoveredWordLink = $(event.target).closest("a");
			createTooltipIfNoneOpen();
		},
		() =>
		{
			cursorOnWordLink = false;
			removeTooltipIfNotHovered();
		});
}


function createTooltipIfNoneOpen()
{
	if(openTooltips.length > 0) return;
	
	let wordText = $(hoveredWordLink).text();
	let isLeftColumn = $(hoveredWordLink).parent().prev().attr("class") === dictWordButtonTableClass;
	
	let dictLanguage = isLeftColumn ? languagePair[0] :  languagePair[1];
	
	loadVerbixConjugationLists(dictLanguage, wordText);
}


function showTooltip(tenseTablesHtml)
{		
	let $tooltip = $("<br /><div></div>").appendTo(hoveredWordLink);
	openTooltips.push($tooltip);

	$tooltip.hover(() => 
	{
		cursorOnTooltip = true;
	},
	() =>
	{
		cursorOnTooltip = false;
		removeTooltipIfNotHovered();
	});
	
	tenseTablesHtml.forEach(function(tenseTable, index){
		if(index > 0) $tooltip.append("<br />");

		$tooltip.append(tenseTable);
	});
	
	$tooltip.parent().css("position", "relative");
	$tooltip.css({
		"display": "initial",
		"opacity": "0",
		"text-align": "center",
		"padding": "0.5em",
		"border-radius": "6px",
		"position": "absolute",
		"z-index": "1",
		"background-color": "#fff",
		"border": "1px solid black",
		"box-shadow": "0 0 0.5em",
		"height": "25em",
		"overflow": "scroll",
		"left": "99%"
	});
	$tooltip.find("span").css("color", "black");
	$tooltip.animate({"opacity": "1"}, 500);
}


function removeTooltipIfNotHovered()
{
	if(cursorOnWordLink || cursorOnTooltip) return;

	openTooltips.forEach(function($tooltip){
		$tooltip.parent().css("position", "");
		$tooltip.remove();
	});
	openTooltips = [];
}


function loadVerbixConjugationLists(dictLanguage, verb)
{
	if(verbixLanguageCodes[dictLanguage] == null) return;

	let getQuery = "language=" + verbixLanguageCodes[dictLanguage] + "&tableurl=" + verbixTableTemplateUrl + "&verb=" + verb;
	let verbixUrl = verbixApiUrl + '?' + getQuery;
	
	GM_xmlhttpRequest({
		method: "GET",
		url: verbixUrl,
		onload: response => {
			let verbixContent = new DOMParser().parseFromString(response.responseText, "text/html");
			let conjugationTables = [];

			usingTemplateMoodTenses.forEach(function(moodTensePair)
			{
				const mood = moodTensePair[0];
				const translatedMood = translateTemplateWord(dictLanguage, "mood", mood);
				const tense = moodTensePair[1];
				let moodTables = $(".verbtense", verbixContent).filter(isTableOfMood(mood));

				if(moodTensePair[1] != null && moodTensePair[1].length > 0)
				{
					const translatedTense = translateTemplateWord(dictLanguage, "tense", tense);
					const $tenseTable = moodTables.filter(isTableOfTense(tense));
					const $heading = $("<b>" + translatedTense + " (" + translatedMood + ")</b>");

					conjugationTables.push($heading)
					conjugationTables.push($tenseTable);
				}
				else
				{
					const $heading = $("<b>" + translatedMood + "</b>");

					conjugationTables.push($heading)
					conjugationTables.push(moodTables);
				}
			});
			showTooltip(conjugationTables);
		}
	});
}


function getLanguagePair()
{
	let url = window.location.href;
	let subdomainRegex = /^https:\/\/(?:(?:([a-z]{2})-?([a-z]{2}))|(www))\.dict\.cc\/\?s=.*/;
	let subdomain = subdomainRegex.exec(url);
	
	if(subdomain[3]) return ["en", "de"];
	if((subdomain[1] === "de" && subdomain[2] === "en") || (subdomain[2] === "de" && subdomain[1] === "en"))
	{
		return ["en", "de"];
	}
	
	const isGermanWithoutEnglish = (subdomain[1] === "de" || subdomain[2] === "de");
	const isEnglishWithoutGerman = (subdomain[1] === "en" || subdomain[2] === "en");	
	let languages = [];
	
	if(isGermanWithoutEnglish)
	{
		if(subdomain[1] === "de") languages.push(subdomain[2]);
		else languages.push(subdomain[1]);
		
		languages.push("de");
	}
	if(isEnglishWithoutGerman)
	{
		if(subdomain[1] === "en") languages.push(subdomain[2]);
		else languages.push(subdomain[1]);
		
		languages.push("en");
	}
	return languages;
}


function loadTemplateHeadingsTranslations()
{
	$.getJSON(tenseNamesUrl, data =>
	{
		templateHeadingsTranslations = data;
	});
}


function translateTemplateWord(dictLanguage, verbAspect, word)
{
	verbAspect += 's';
	const fallbackTranslations = templateHeadingsTranslations["es"];
	const usingTranslations = templateHeadingsTranslations[dictLanguage] || fallbackTranslations;
	const usingAspect = usingTranslations[verbAspect] || fallbackTranslations[verbAspect];
	
	return usingAspect[word];
}


function isTableOfMood(templateMoodName)
{
	return function()
	{
		const $moodTableDataInMain = $(this).parents("td").eq(1);
		const $moodTableRowInMain = $moodTableDataInMain.parent();
		const $mainTable = $moodTableRowInMain.parents("table").first();
		const moodColIndexInMain = $moodTableDataInMain.index();
		const moodRowIndexInMain = $moodTableRowInMain.index();
		const heading = $("tr", $mainTable).eq(moodRowIndexInMain - 1).children().eq(moodColIndexInMain).text();

		return (heading === templateMoodName);
	}
}
	

function isTableOfTense(templateTenseName)
{
	return function()
	{
		let parentText = $(this).parent().text();		
		while(parentText.charAt(0) === '\r' || parentText.charAt(0) === '\n')
		{
			parentText = parentText.substr(1);
		}		
		return parentText.substring(0, templateTenseName.length) === templateTenseName;
	};
}