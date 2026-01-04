// ==UserScript==
// @name         mTurk Title Bar Timer / Wage - Fork
// @author       parseHex
// @namespace    https://greasyfork.org/users/8394
// @version      42.0.2
// @description  Title bar timer/counter for MTurk
// @include      https://worker.mturk.com/projects/*
// @icon         https://i.imgur.com/Y68Qxdd.png
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/37903/mTurk%20Title%20Bar%20Timer%20%20Wage%20-%20Fork.user.js
// @updateURL https://update.greasyfork.org/scripts/37903/mTurk%20Title%20Bar%20Timer%20%20Wage%20-%20Fork.meta.js
// ==/UserScript==

// Changing this to true will base wages on the total time passed since the tab has opened.
// False means wages are based on the total time that the tab has been in focus.
const ALWAYS_TICK_WAGE_TIMER = true;

// Whether to show the "Big Emoji", and configurable parameters related to its display (i.e., size and transparency).
const SHOW_BIG_EMOJI = true;
const BIG_EMOJI_SIZE = "250px";
const BIG_EMOJI_OPACITY_ZERO_TO_ONE = "0.03";

// No need to change this. One second is alwyas 1000ms. Just here to add meaning to some code.
const ONE_SECOND_IN_MS = 1000;

// The wage amounts. Change these to your liking.
const LOVE_WAGE_LOWER_LIMIT = 12.00;
const HAPPY_WAGE_LOWER_LIMIT = 8.00;
const OK_WAGE_LOWER_LIMIT = 6.00;
const SAD_WAGE_LOWER_LIMIT = 4.00;
const DISGUSTED_WAGE_LOWER_LIMIT = 0.00;

// The emojis. Change these to whatever you want to display for each wage range.
const LOVE_WAGE_EMOJI = "?";
const HAPPY_WAGE_EMOJI = "?";
const OK_WAGE_EMOJI = "?";
const SAD_WAGE_EMOJI = "?";
const DISGUSTED_WAGE_EMOJI = "?";

// Changing this to a bigger number will save you CPU cycles.
// Changing it to a smaller number will give you more timely data.
// Chrome automatically slows down the interval timers that this is based on in background tabs, though, so this is influenced strongly by that.
// TODO: Fix this so we can change to a different update rate without breaking "seconds visible / invisible" (I know how to do it, but haven't bothered writing it yet since it doesn't earn me money to do so.)
// The eventual fix will be to keep two separate stores of "seconds visible/invisible", managed by taking snapshots of the last time visibility status was changed.
const UPDATE_RATE_IN_MILLISECONDS = (ALWAYS_TICK_WAGE_TIMER ? (ONE_SECOND_IN_MS / 3) : ONE_SECOND_IN_MS);

var Utility = (function createUtility() {

	const _scriptStartTime = new Date().getTime();
	const _fallbackHITStartTime = (unsafeWindow.pageTimes === undefined ? _scriptStartTime : unsafeWindow.pageTimes.beginPageLoad);
	const _HITStartTime = (performance.timing === undefined ? _fallbackHitStartTime : performance.timing.navigationStart);
	const _HITLoadTime = _scriptStartTime - _HITStartTime;

	let _HITLoadTimeAccuracy;
	if (performance.timing === undefined) {
		if (unsafeWindow.pageTimes === undefined) {
			_HITLoadTimeAccuracy = "low";
		}
		else {
			_HITLoadTimeAccuracy = "medium";
		}
	}
	else {
		_HITLoadTimeAccuracy = "high";
	}

	let _allContentLoadedTime;
	let _allContentLoadedCallback = () => { };
	document.addEventListener('readystatechange', function (event) {
		if (document.readyState === "complete") {
			_allContentLoadedTime = performance.now();
			_allContentLoadedCallback();
		}
	});

	var _secondsVisible = 0;
	var _pauseOnInvisible = true;

	function getHITStartTime() {
		return _HITStartTime;
	}

	function getHITLoadTime() {
		return _HITLoadTime;
	}

	function getAllContentLoadedTime() {
		return _allContentLoadedTime;
	}

	function setAllContentLoadedCallback(newFn) {
		_allContentLoadedCallback = newFn;
	}

	function getHITLoadTimeAccuracy() {
		return _HITLoadTimeAccuracy;
	}

	function getSecondsSinceStartTime() {
		return (new Date().getTime() - _HITStartTime) / 1000;
	}

	function isWindowTopFrame() {
		return (window === window.top);
	}

	function updateSecondsVisible() {
		if (!document.hidden && document.hasFocus()) { incrementSecondsVisible(); }
	}

	function incrementSecondsVisible() {
		_secondsVisible += (UPDATE_RATE_IN_MILLISECONDS / ONE_SECOND_IN_MS);
	}

	function getSecondsVisible() {
		return _secondsVisible;
	}

	function hourlyWageDollars(secondsPassed, rewardCents) {
		return (rewardCents / secondsPassed) * 36;
	}

	function hmsToSeconds(hours, minutes, seconds) {
		return hoursToSeconds(hours) + minutesToSeconds(minutes) + seconds;
	}

	function minutesToSeconds(minutes) {
		return (minutes * 60);
	}

	function toMMSSString(secondsRemaining) {
		let minutesRemaining = Math.floor(secondsRemaining / 60);
		let remainderSeconds = secondsRemaining - (minutesRemaining * 60);
		const localeOptions = { useGrouping: false, minimumIntegerDigits: 2, maximumFractionDigits: 0 };
		return minutesRemaining.toLocaleString(undefined, localeOptions) + ":" + remainderSeconds.toLocaleString(undefined, localeOptions);
	}

	function daysToSeconds(days) {
		return (days * 86400);
	}

	function hoursToSeconds(hours) {
		return (hours * 3600);
	}

	function secondsRemainingInHHMMSSCountdown(hhmmssString) {
		let values = hhmmssString.split(":");
		return hmsToSeconds(Number(values[0]), Number(values[1]), Number(values[2]));
	}

	function secondsRemainingInMMSSCountdown(mmssString) {
		let values = mmssString.split(":");
		let minutes = Number(values[0]);
		let seconds = Number(values[1]);
		return minutesToSeconds(minutes) + seconds;
	}

	function secondsRemainingInMMSSCountup(mmssString, totalSeconds) {
		let countupValues = mmssString.split(":");
		let countupMinutes = Number(countupValues[0]);
		let countupSeconds = Number(countupValues[1]);
		let totalSecondsCounted = (countupMinutes * 60) + countupSeconds;
		return totalSeconds - totalSecondsCounted;
	}

	function secondsRemainingInHHMMSSCountup(hhmmssString, totalSeconds) {
		let values = hhmmssString.split(":");
		return totalSeconds - hmsToSeconds(Number(values[0]), Number(values[1]), Number(values[2]));
	}

	function secondsGoalForTargetWage(desiredCentsPerHour, jobCents) {
		let desiredCentsPerSecond = desiredCentsPerHour / 3600;
		return jobCents / desiredCentsPerSecond;
	}

	function secondsPassed(totalSeconds, secondsRemaining) {
		return totalSeconds - secondsRemaining;
	}

	function dollarsToCents(dollars) {
		return dollars * 100;
	}

	function askWorkerFrameWhetherSurvey() {
		document.querySelector("iframe").contentWindow.postMessage({ msg: "Are you a survey HIT?" }, "*");
	}

	function disablePauseOnInvisible() {
		_pauseOnInvisible = false;
	}

	function isPausingOnInvisible() {
		return _pauseOnInvisible;
	}

	function highlightWageRange(cssSelectorString) {
		document.querySelector(cssSelectorString).style = "font-weight: bold; text-decoration: underline;";
	}

	function unhighlightWageRange(cssSelectorString) {
		document.querySelector(cssSelectorString).style = "font-weight: normal; text-decoration: none;";
	}

	return {
		getSecondsSinceStartTime,
		getHITStartTime,
		isWindowTopFrame,
		updateSecondsVisible,
		getSecondsVisible,
		hourlyWageDollars,
		minutesToSeconds,
		toMMSSString,
		secondsRemainingInMMSSCountdown,
		secondsRemainingInMMSSCountup,
		secondsPassed,
		dollarsToCents,
		askWorkerFrameWhetherSurvey,
		disablePauseOnInvisible,
		isPausingOnInvisible,
		hmsToSeconds,
		secondsRemainingInHHMMSSCountdown,
		secondsRemainingInHHMMSSCountup,
		daysToSeconds,
		secondsGoalForTargetWage,
		highlightWageRange,
		unhighlightWageRange,
		getHITLoadTime,
		getHITLoadTimeAccuracy,
		getAllContentLoadedTime,
		setAllContentLoadedCallback
	};

})();

function updateActiveHITTabTimer(requesterName, secondsRemaining, rewardInCents) {
	if (secondsRemaining <= 0) {
		document.title = `EXPIRED - ${requesterName}`; return;
	}

	Utility.updateSecondsVisible();

	let newTitle = `${Utility.toMMSSString(secondsRemaining)} `;

	let secondsPassed;
	if (Utility.isPausingOnInvisible() && (!ALWAYS_TICK_WAGE_TIMER)) {
		secondsPassed = Utility.getSecondsVisible();
	}
	else {
		secondsPassed = Utility.getSecondsSinceStartTime();
	}

	document.querySelector("#timeWorkedSpan").innerText = Utility.toMMSSString(secondsPassed);

	let hourlyWageDollars = Utility.hourlyWageDollars(secondsPassed, rewardInCents + (document.querySelector("#bonusWageCents").value !== "" ? Utility.dollarsToCents(document.querySelector("#bonusWageCents").value) : 0));

	if (hourlyWageDollars > LOVE_WAGE_LOWER_LIMIT) {
		newTitle += LOVE_WAGE_EMOJI;
		if (SHOW_BIG_EMOJI) { document.querySelector("#pageEmoji").innerText = LOVE_WAGE_EMOJI; }
		Utility.highlightWageRange("#loveWageSpan");
		Utility.unhighlightWageRange("#happyWageSpan");
		Utility.unhighlightWageRange("#okWageSpan");
		Utility.unhighlightWageRange("#sadWageSpan");
		Utility.unhighlightWageRange("#disgustedWageSpan");
	}
	else if (hourlyWageDollars > HAPPY_WAGE_LOWER_LIMIT) {
		newTitle += HAPPY_WAGE_EMOJI;
		if (SHOW_BIG_EMOJI) { document.querySelector("#pageEmoji").innerText = HAPPY_WAGE_EMOJI; }
		Utility.unhighlightWageRange("#loveWageSpan");
		Utility.highlightWageRange("#happyWageSpan");
		Utility.unhighlightWageRange("#okWageSpan");
		Utility.unhighlightWageRange("#sadWageSpan");
		Utility.unhighlightWageRange("#disgustedWageSpan");
	}
	else if (hourlyWageDollars > OK_WAGE_LOWER_LIMIT) {
		newTitle += OK_WAGE_EMOJI;
		if (SHOW_BIG_EMOJI) { document.querySelector("#pageEmoji").innerText = OK_WAGE_EMOJI; }
		Utility.unhighlightWageRange("#loveWageSpan");
		Utility.unhighlightWageRange("#happyWageSpan");
		Utility.highlightWageRange("#okWageSpan");
		Utility.unhighlightWageRange("#sadWageSpan");
		Utility.unhighlightWageRange("#disgustedWageSpan");
	}
	else if (hourlyWageDollars > SAD_WAGE_LOWER_LIMIT) {
		newTitle += SAD_WAGE_EMOJI;
		if (SHOW_BIG_EMOJI) { document.querySelector("#pageEmoji").innerText = SAD_WAGE_EMOJI; }
		Utility.unhighlightWageRange("#loveWageSpan");
		Utility.unhighlightWageRange("#happyWageSpan");
		Utility.unhighlightWageRange("#okWageSpan");
		Utility.highlightWageRange("#sadWageSpan");
		Utility.unhighlightWageRange("#disgustedWageSpan");
	}
	else if (hourlyWageDollars > DISGUSTED_WAGE_LOWER_LIMIT) {
		newTitle += DISGUSTED_WAGE_EMOJI;
		if (SHOW_BIG_EMOJI) { document.querySelector("#pageEmoji").innerText = DISGUSTED_WAGE_EMOJI; }
		Utility.unhighlightWageRange("#loveWageSpan");
		Utility.unhighlightWageRange("#happyWageSpan");
		Utility.unhighlightWageRange("#okWageSpan");
		Utility.unhighlightWageRange("#sadWageSpan");
		Utility.highlightWageRange("#disgustedWageSpan");
	}

	let pageLoadSpan = document.querySelector("#timeLostToPageLoad");
	if (pageLoadSpan.innerText.trim() === "") {
		pageLoadSpan.innerText = Utility.getHITLoadTime().toFixed(0);
	}

	let fullPageLoadSpan = document.querySelector("#timeLostToFullPageLoad");
	if (fullPageLoadSpan.innerText.trim() === "") {
		if (Utility.getAllContentLoadedTime()) {
			fullPageLoadSpan.innerText = Utility.getAllContentLoadedTime().toFixed(0);
		}
	}

	newTitle = newTitle + ` \$${hourlyWageDollars.toFixed(2)}/hr.`;

	newTitle += ` ${requesterName}`;

	if (!ALWAYS_TICK_WAGE_TIMER && (!(document.visible && document.hasFocus()))) {
		newTitle += `(\$ timer paused)`;
	}

	document.title = newTitle;
}

function swapToExpanderBar() {
	document.querySelector("#titleBarTimerBar").style.left = "-100%";
	document.querySelector("#expanderBar").style.left = "50%";
	GM_setValue("timerBarVisible", false);
}

function swapToTimerBar() {
	document.querySelector("#titleBarTimerBar").style.left = "50%";
	document.querySelector("#expanderBar").style.left = "-100%";
	GM_setValue("timerBarVisible", true);
}

function restoreTimerBarCollapseState() {
	let isTimerBarVisible = GM_getValue("timerBarVisible");

	if (isTimerBarVisible !== undefined) {
		if (!isTimerBarVisible) {
			swapToExpanderBar();
		}
	}
	else {
	}
}

function workerSiteMain() {
	if (Utility.isWindowTopFrame()) {

		const divID = document.querySelector(`span[data-react-class*="require('reactComponents/common/ShowModal')"]`);
		const reactProps = divID.getAttribute("data-react-props");
		const json = JSON.parse(reactProps);
		const requesterName = json.modalOptions.requesterName;

		const notAcceptedSpan = document.querySelector(`span[data-react-props*='"text":"accept"']`);

		if (notAcceptedSpan) {
			document.title = `NOT ACCEPTED - ${requesterName}`;
		}
		else {
			const countdownTimer = document.querySelector("span[data-react-class*='reactComponents/common/CompletionTimer'] span:last-of-type");
			const rewardInDollars = json.modalOptions.monetaryReward.amountInDollars;
			const rewardInCents = Utility.dollarsToCents(rewardInDollars);

			const timeGivenMinutesSplit = (countdownTimer.innerText.trim().match(/(\d+) Min/) || [0, 0])[1];
			const timeGivenSecondsSplit = 0; // TODO: Change this when I figure out what a HIT with <1 min reads out as.
			const maximumTimeGivenInSeconds = Utility.hmsToSeconds(0, timeGivenMinutesSplit, timeGivenSecondsSplit);

			const secondsForLoveWage = Utility.secondsGoalForTargetWage(Utility.dollarsToCents(LOVE_WAGE_LOWER_LIMIT), rewardInCents);
			const secondsForHappyWage = Utility.secondsGoalForTargetWage(Utility.dollarsToCents(HAPPY_WAGE_LOWER_LIMIT), rewardInCents);
			const secondsForOKWage = Utility.secondsGoalForTargetWage(Utility.dollarsToCents(OK_WAGE_LOWER_LIMIT), rewardInCents);
			const secondsForSadWage = Utility.secondsGoalForTargetWage(Utility.dollarsToCents(SAD_WAGE_LOWER_LIMIT), rewardInCents);
			const secondsForDisgustedWage = Utility.secondsGoalForTargetWage(Utility.dollarsToCents(DISGUSTED_WAGE_LOWER_LIMIT), rewardInCents);

			document.body.insertAdjacentHTML('afterend',
				`<div id='titleBarTimerBar' style="position: fixed !important; pointer-events: none !important; background: white !important; opacity: 0.95 !important; width: 100% !important; left: 50% !important; margin-left: -50% !important; top: 0px !important; z-index: ${Number.MAX_SAFE_INTEGER} !important; text-align: center !important;">` +
				`<span id="loveWageSpan">${LOVE_WAGE_EMOJI}: (<= ${Utility.toMMSSString(secondsForLoveWage)})</span> ` +
				`<span id="happyWageSpan">${HAPPY_WAGE_EMOJI}: (${Utility.toMMSSString(secondsForLoveWage)} - ${Utility.toMMSSString(secondsForHappyWage)})</span> ` +
				`<span id="okWageSpan">${OK_WAGE_EMOJI}: (${Utility.toMMSSString(secondsForHappyWage)} - ${Utility.toMMSSString(secondsForOKWage)})</span> ` +
				`<span id="sadWageSpan">${SAD_WAGE_EMOJI}: (${Utility.toMMSSString(secondsForOKWage)} - ${Utility.toMMSSString(secondsForSadWage)})</span> ` +
				`<span id="disgustedWageSpan">${DISGUSTED_WAGE_EMOJI}: (>= ${Utility.toMMSSString(secondsForSadWage)})</span>` +
				`<div style="text-align: center !important; margin-left: auto !important; margin-right: auto !important; font-style: italic !important;">Time Worked: <span id="timeWorkedSpan">00:00</span> <input type="text" id="bonusWageCents" style="pointer-events: auto !important;" placeholder="Bonus $" size="5"> <div>Pageload: <span id="timeLostToPageLoad"></span>ms Complete: <span id="timeLostToFullPageLoad"></span>ms</div></div>` +
				`<button id='hideBarButton' style="pointer-events: auto !important;">Hide</button>` +
				'</div>'
			);

			document.body.insertAdjacentHTML('afterend',
				`<div id='expanderBar' style="position: fixed; pointer-events: none; background: white; opacity: 0.95; width: 100%; left: -100%; margin-left: -50%; top: 0px; z-index: ${Number.MAX_SAFE_INTEGER}; text-align: center;">` +
				`<button id='showBarButton' style="pointer-events: auto;">Show $/hr. Details</button>` +
				'</div>'
			);

			document.querySelector('#hideBarButton').addEventListener('click', function hideBar() {
				swapToExpanderBar();
			});

			document.querySelector('#showBarButton').addEventListener('click', function hideBar() {
				swapToTimerBar();
			});

			restoreTimerBarCollapseState();

			if (SHOW_BIG_EMOJI) {
				document.body.insertAdjacentHTML('afterend',
					`<div id="pageEmoji" draggable="false" style="position: fixed; opacity: ${BIG_EMOJI_OPACITY_ZERO_TO_ONE}; font-size: ${BIG_EMOJI_SIZE}; pointer-events: none; user-drag: none; user-select: none; width: 100%; left: 0px; height: 50%; top: 50%; z-index: ${Number.MAX_SAFE_INTEGER}; text-align: center;">` +
					`` +
					`</div>`);
			}


			setInterval(function workerSiteUpdate() {
				let countdownTimerText = countdownTimer.innerText.match(/\d+:\d+\b/)[0];
				// let secondsRemaining = Utility.secondsRemainingInHHMMSSCountdown(countdownTimerText);
				let secondsRemaining = Utility.secondsRemainingInMMSSCountup(countdownTimerText, maximumTimeGivenInSeconds);
				updateActiveHITTabTimer(requesterName, secondsRemaining, rewardInCents);
			}, UPDATE_RATE_IN_MILLISECONDS);
		} // End of HIT accepted check.

	} // End of isWindowTopFrame().
}

function originalSiteMain() {
	if (Utility.isWindowTopFrame()) {
		const countdownTimer = document.querySelector("#theTime");

		const acceptHITInput = document.querySelector("input[name='/accept']");

		const capsuleTexts = document.querySelectorAll(".capsule_field_text");
		const requesterName = capsuleTexts[0].innerText.trim();
		const rewardInDollars = capsuleTexts[1].innerText.trim().match(/\$([0-9.]+)/)[1];
		const rewardInCents = Utility.dollarsToCents(rewardInDollars);
		const timeGivenDaysSplit = (capsuleTexts[3].innerText.trim().match(/(\d+) days/) || [0, 0])[1];
		const timeGivenHoursSplit = (capsuleTexts[3].innerText.trim().match(/(\d+) hours/) || [0, 0])[1];
		const timeGivenMinutesSplit = (capsuleTexts[3].innerText.trim().match(/(\d+) minutes/) || [0, 0])[1];
		const timeGivenSecondsSplit = (capsuleTexts[3].innerText.trim().match(/(\d+) seconds/) || [0, 0])[1];
		const maximumTimeGivenInSeconds = Utility.daysToSeconds(timeGivenDaysSplit) + Utility.hmsToSeconds(timeGivenHoursSplit, timeGivenMinutesSplit, timeGivenSecondsSplit);

		const secondsForLoveWage = Utility.secondsGoalForTargetWage(Utility.dollarsToCents(LOVE_WAGE_LOWER_LIMIT), rewardInCents);
		const secondsForHappyWage = Utility.secondsGoalForTargetWage(Utility.dollarsToCents(HAPPY_WAGE_LOWER_LIMIT), rewardInCents);
		const secondsForOKWage = Utility.secondsGoalForTargetWage(Utility.dollarsToCents(OK_WAGE_LOWER_LIMIT), rewardInCents);
		const secondsForSadWage = Utility.secondsGoalForTargetWage(Utility.dollarsToCents(SAD_WAGE_LOWER_LIMIT), rewardInCents);
		const secondsForDisgustedWage = Utility.secondsGoalForTargetWage(Utility.dollarsToCents(DISGUSTED_WAGE_LOWER_LIMIT), rewardInCents);

		console.log("You lost", Utility.getHITLoadTime() / 1000, "seconds to HIT loading, with accuracy:", Utility.getHITLoadTimeAccuracy());
		console.log("For a theoretical 1-second submission, this means that loading time cut your wage from", `\$${Utility.hourlyWageDollars(1, rewardInCents).toFixed(2)}/hr.`, "to", `\$${Utility.hourlyWageDollars(1 + (Utility.getHITLoadTime() / 1000), rewardInCents).toFixed(2)}/hr.`);
		console.log("For a theoretical 5-second submission, this means that loading time cut your wage from", `\$${Utility.hourlyWageDollars(5, rewardInCents).toFixed(2)}/hr.`, "to", `\$${Utility.hourlyWageDollars(5 + (Utility.getHITLoadTime() / 1000), rewardInCents).toFixed(2)}/hr.`);

		Utility.setAllContentLoadedCallback(() => {
			console.log("You lost", Utility.getAllContentLoadedTime() / 1000, "seconds to HIT the full page load, with accuracy:", Utility.getHITLoadTimeAccuracy());
			console.log("If you waited for the whole page to load, this means that the most you could earn with an instant submission would be", `\$${Utility.hourlyWageDollars(Utility.getAllContentLoadedTime() / 1000, rewardInCents).toFixed(2)}/hr.`);
		});

		document.body.insertAdjacentHTML('afterend',
			`<div id="titleBarTimerBar" style="position: fixed; pointer-events: none; background: white; opacity: 0.95; width: 100%; left: 50%; margin-left: -50%; top: 0px; z-index: ${Number.MAX_SAFE_INTEGER}; text-align: center;">` +
			`<span id="loveWageSpan">${LOVE_WAGE_EMOJI}: (<= ${Utility.toMMSSString(secondsForLoveWage)})</span> ` +
			`<span id="happyWageSpan">${HAPPY_WAGE_EMOJI}: (${Utility.toMMSSString(secondsForLoveWage)} - ${Utility.toMMSSString(secondsForHappyWage)})</span> ` +
			`<span id="okWageSpan">${OK_WAGE_EMOJI}: (${Utility.toMMSSString(secondsForHappyWage)} - ${Utility.toMMSSString(secondsForOKWage)})</span> ` +
			`<span id="sadWageSpan">${SAD_WAGE_EMOJI}: (${Utility.toMMSSString(secondsForOKWage)} - ${Utility.toMMSSString(secondsForSadWage)})</span> ` +
			`<span id="disgustedWageSpan">${DISGUSTED_WAGE_EMOJI}: (>= ${Utility.toMMSSString(secondsForSadWage)})</span>` +
			`<div style="text-align: center; margin-left: auto; margin-right: auto; font-style: italic;">Time Worked: <span id="timeWorkedSpan">00:00</span> <input type="text" style="pointer-events: auto;" id="bonusWageCents" placeholder="Bonus $" size="5"><div>Pageload: <span id="timeLostToPageLoad"></span>ms Complete: <span id="timeLostToFullPageLoad"></span>ms</div></div>` +
			`<button id='hideBarButton' style="pointer-events: auto;">Hide</button>` +
			'</div>'
		);

		document.body.insertAdjacentHTML('afterend',
			`<div id='expanderBar' style="position: fixed; pointer-events: none; background: white; opacity: 0.95; width: 100%; left: -100%; margin-left: -50%; top: 0px; z-index: ${Number.MAX_SAFE_INTEGER}; text-align: center;">` +
			`<button id='showBarButton' style="pointer-events: auto;">Show $/hr. Details</button>` +
			'</div>'
		);

		document.querySelector('#hideBarButton').addEventListener('click', function hideBar() {
			swapToExpanderBar();
		});

		document.querySelector('#showBarButton').addEventListener('click', function hideBar() {
			swapToTimerBar();
		});

		restoreTimerBarCollapseState();

		if (SHOW_BIG_EMOJI) {
			document.body.insertAdjacentHTML('afterend',
				`<div id="pageEmoji" draggable="false" style="position: fixed !important; opacity: ${BIG_EMOJI_OPACITY_ZERO_TO_ONE} !important; font-size: ${BIG_EMOJI_SIZE} !important; pointer-events: none !important; user-drag: none !important; user-select: none !important; width: 100% !important; left: 0px !important; height: 50% !important; top: 50% !important; z-index: ${Number.MAX_SAFE_INTEGER} !important; text-align: center !important;">` +
				`?` +
				`</div>`);
		}

		if (acceptHITInput) {
			document.title = `NOT ACCEPTED - ${requesterName}`;
		}
		else {
			setInterval(function mainSiteUpdate() {
				let countupTimerText = countdownTimer.innerText.trim();
				let secondsRemaining = Utility.secondsRemainingInHHMMSSCountup(countupTimerText, maximumTimeGivenInSeconds);
				updateActiveHITTabTimer(requesterName, secondsRemaining, rewardInCents);
			}, UPDATE_RATE_IN_MILLISECONDS);
		} // End of HIT accepted check.
	} // End of isWindowTopFrame().
}

function isWorkerSite() {
	return window.location.href.toLowerCase().includes("worker.mturk.com");
}

(function main() {
	window.addEventListener("message", function handleMessage(event) {
		if (event.data.msg === "I'm ready for you to ask me questions.") {
			console.log("PARENT FRAME: Kid said it's ready for questions.");
			Utility.askWorkerFrameWhetherSurvey();
			console.log("PARENT FRAME: I asked whether the kid was a survey.");
		}
		else if (event.data.msg === "I am a survey HIT.") {
			console.log("PARENT FRAME: Kid said he was a survey.");
			Utility.disablePauseOnInvisible();
			console.log("PARENT FRAME: I disabled pausing on invisible, since the kid said he was a survey.");
		}

		if (event.data.msg === "Submit relay.") {
			console.log("PARENT FRAME: I detected a form submit.");
			alert("Detected a form submit.");
		}
	});

	if (isWorkerSite()) {
		workerSiteMain();
	}
	else {
		originalSiteMain();
	}
})();
