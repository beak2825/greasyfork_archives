// ==UserScript==
// @name         MturkExportParser
// @namespace    salembeats
// @version      4.4
// @description  Grab metadata from mTurk exports on forums and other social media channels. Added HIT descriptions to the MTS export strategy. Latest: Can generate web+panda:// links natively. New survey indicator keywords.
// @author       Cuyler Stuwe (salembeats)
// @include      *
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/38404/MturkExportParser.user.js
// @updateURL https://update.greasyfork.org/scripts/38404/MturkExportParser.meta.js
// ==/UserScript==

function MturkExportParser(elementOrHTML) {

	const EXPORT_TYPES = {
		TURKER_VIEW_REVIEW: "TURKER_VIEW_REVIEW",
		MTS:                "MTS",
		TURKER_VIEW_JS:     "TURKER_VIEW_JS"
	};

	const SURVEY_HINT_TERMS_LOWERCASE = [
		"study",
		"survey",
		"opinion",
		"qualtrics",
		"minutes",
        "game",
        "android",
        "iphone",
        "perceptions",
        "part 4",
        "part four",
        "part 3",
        "part three",
        "part 2",
        "part two",
        "part 1",
        "part one",
        "decision task",
        "respondents",
        "wave 1",
        "wave one",
        "wave 2",
        "wave two",
        "wave 3",
        "wave three",
        "eligible participant",
        "certain respondents will qualify"
	];

	var _sourceElement;

	var _exportType;

	var _parsingStrategy;

	var _results = {
		gid: undefined,
		rid: undefined,
		hitTitle: undefined,
		hitValue: undefined,
		hitDescription: undefined,
		requesterName: undefined,
		tvHourlyWage: undefined,
		tvPaySentiment: undefined,
		tvFair: undefined,
		tvCompletionTime: undefined,
		tvApproveTime: undefined,
		tvCommunication: undefined,
		toPay: undefined,
		toFair: undefined,
		toComm: undefined,
		toFast: undefined,
		tvPros: undefined,
		tvCons: undefined
	};

	function isSurveyHint(string) {
		let stringLowercase = string.toLowerCase();
		return includesAny(stringLowercase, SURVEY_HINT_TERMS_LOWERCASE);
	}

	function includesAny(string, words) {

		function stringIncludesWord(word) {
			return string.includes(word);
		}

		function stringInArray(array) {
			return array.some( stringIncludesWord );
		}

		if(typeof words === "object") {
			if(Array.isArray(words)) {
				return stringInArray(words);
			}
			else {
				let keys = Object.keys(words);
				let objectWords = [];
				for(let key of keys) {
					if(typeof key === "string") { // A key should always be a string, but what the hell - I've been surprised before.
						objectWords.push(key);
					}
					if(typeof words[key] === "string") {
						objectWords.push(words[key]);
					}
					return stringInArray(objectWords);
				}
			}
		}
		else if(typeof words === "string") {
			return stringIncludesWord(words);
		}
		else {
			return undefined;
		}
	}

	function _turkerViewReviewParsingStrategy(element, html, text) {
		_exportType = EXPORT_TYPES.TURKER_VIEW_REVIEW;

		let moneySpan = Array.from(element.querySelectorAll("span")).find( greenSpan => {
			return greenSpan.innerText.includes("$");
		});

		let projectLink   = element.querySelector("a[href*='projects/']");
		let requesterLink = element.querySelector("a[href*='requesters/']");

		let titleElement = element.querySelector("i:not([class])");
		let titleText    = titleElement.innerText.trim().replace(/\s+-\s+\$[0-9]+\.[0-9]+/, "");

		let returnVal = {
			gid: (((projectLink || {href: ""}).href.match(/projects\/([^/?&]+)/)) || [undefined, undefined])[1],
			rid: (((requesterLink || {href: ""}).href.match(/requesters\/([^/?&]+)/)) || [undefined, undefined])[1],
			hitTitle: titleText,
			requesterName: (requesterLink || {innerText: undefined}).innerText,
			hitValue: Number( (moneySpan || {innerText: ""}).innerText.trim().replace("$", "") ) || undefined
		};

		if(isSurveyHint(titleText)) { returnVal.batchOrSurvey = "survey"; }

		return returnVal;
	}

	function _mtsExportParsingStrategy(element, html, text) {
		_exportType = EXPORT_TYPES.MTS;

		let projectLink   = element.querySelector("a[href*='projects/']");
		let requesterLink = element.querySelector("a[href*='requesters/']");

		let descriptionText = (text.match(/Description:\s+(.+)\n/) || [undefined, undefined])[1];
		let titleText = (projectLink || {innerText: undefined}).innerText;

		let returnVal = {
			gid: (((projectLink || {href: ""}).href.match(/projects\/([^/?&]+)/)) || [undefined, undefined])[1],
			rid: (((requesterLink || {href: ""}).href.match(/requesters\/([^/?&]+)/)) || [undefined, undefined])[1],
			hitTitle: titleText,
			requesterName: (requesterLink || {innerText: undefined}).innerText,
			hitValue: Number ( ( text.match(/Reward:(?:\s+)\$([0-9]{1,}\.[0-9]{2,})/) || [undefined, undefined] )[1] ) || undefined,
			hitDescription: descriptionText
		};

		if(isSurveyHint(returnVal.hitTitle) || isSurveyHint(descriptionText)) { returnVal.batchOrSurvey = "survey"; }

		return returnVal;
	}

	function _turkerViewJSParsingStrategy(element, html, text) {
		_exportType = EXPORT_TYPES.TURKER_VIEW_JS;

		let projectLink   = element.querySelector("a[href*='projects/']");
		let requesterLink = element.querySelector("a[href*='requesters/']");

		let returnVal = {
			gid: (((projectLink || {href: ""}).href.match(/projects\/([^/?&]+)/)) || [undefined, undefined])[1],
			rid: (((requesterLink || {href: ""}).href.match(/requesters\/([^/?&]+)/)) || [undefined, undefined])[1],
			hitTitle: (projectLink || {innerText: undefined}).innerText,
			requesterName: (requesterLink || {innerText: undefined}).innerText,
			hitValue: Number ( ( text.match(/Reward:(?:\s+)\$([0-9]{1,}\.[0-9]{2,})/) || [undefined, undefined] )[1] ) || undefined
		};

		if(isSurveyHint(returnVal.hitTitle)) { returnVal.batchOrSurvey = "survey"; }

		return returnVal;
	}

	function _determineParsingStrategy(element, html, text) {
		let textLowercase = text.toLowerCase();
		if(textLowercase.includes("full profile check out turkerview")) { _parsingStrategy = _turkerViewReviewParsingStrategy; }
		else if(textLowercase.includes("hit exported from mturk suite")) { _parsingStrategy = _mtsExportParsingStrategy; }
		else if(textLowercase.includes("tv:") || textLowercase.includes("to:") || textLowercase.includes("to2:")) {
			_parsingStrategy = _mtsExportParsingStrategy;
		}
		else if(Boolean(element.querySelector("i.fa.fa-caret-up"))) {_parsingStrategy = _turkerViewJSParsingStrategy;}
		else if(textLowercase.includes("(contact)")) {_parsingStrategy = _mtsExportParsingStrategy;}
		else if(textLowercase.includes("to ratings")) {_parsingStrategy = _mtsExportParsingStrategy;}
		else {_parsingStrategy = null;}
	}

	function parse(htmlOrElement) {

		if(!htmlOrElement) {
			throw {
				name: "TypeError",
				message: "There is nothing for MturkExportParser to parse!"
			};
		}

		let html;
		let element;
		let text;

		if(typeof htmlOrElement === "string") {
			let template = document.createElement("template");
			template.innerHTML = html;
			element = template.content.firstChild;
			html    = htmlOrElement;
		}
		else {
			html = htmlOrElement.innerHTML;
			element = htmlOrElement;
			_sourceElement = element;
		}

		text = element.innerText;

		if(!_parsingStrategy) { _determineParsingStrategy(element, html, text); }
		if(_parsingStrategy) { _results = _parsingStrategy(element, html, text); }
	}

	function getGID() {
		return _results.gid;
	}

	function getHitTitle() {
		return _results.hitTitle;
	}

	function getTitle() {
		return getHitTitle();
	}

	function getRequesterName() {
		return _results.requesterName;
	}

	function getRequesterID() {
		return _results.rid;
	}

	function getRequesterId() {
		return getRequesterID();
	}

	function getRID() {
		return getRequesterID();
	}

	function getRid() {
		return getRequesterID();
	}

	function containsExport() {
		return Boolean(_exportType);
	}

	function containsValidExport() {
		// TODO: Differentiate between exports existing and the export being valid.
		return containsExport();
	}

	function getExportType() {
		return _exportType;
	}

	function getAllResults() {
		return Object.assign({}, _results);
	}

	function getSourceElement() {
		return _sourceElement;
	}

    function webPandaURL(blacklistMap = {}) {

        blacklistMap.gid = true;

        let results = getAllResults();

        let webPandaString = `web+panda://${results.gid}?`;

        let keys = Object.keys(results);

        let allowedKeys = [];

        for(let key of keys) {
            if(blacklistMap[key] !== undefined &&
               blacklistMap[key] !== null) {
                if(blacklistMap[key] === true) {
                    continue;
                }
                else if(blacklistMap[key] === false) {
                }
            }
            else {
                allowedKeys.push(key);
            }
        }

        for(let allowedKey of allowedKeys) {
            let value = results[allowedKey];

            webPandaString += `${allowedKey}=${encodeURIComponent(value)}&`;
        }

        return webPandaString.substr(0, webPandaString.length-1);
    }

	if(elementOrHTML) {
		parse(elementOrHTML);
	}

	return {
		EXPORT_TYPES,
		parse,
		getGID,
		getHitTitle,
		getTitle,
		getRequesterName,
		getRequesterID,
		getRequesterId,
		getRID,
		getRid,
		containsExport,
		containsValidExport,
		getExportType,
		getAllResults,
		getSourceElement,
        webPandaURL
	};
}

// unsafeWindow.MturkExportParserTest = MturkExportParser;