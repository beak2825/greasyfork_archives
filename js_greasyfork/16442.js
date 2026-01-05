// ==UserScript==
// @name        WaniKani Review Countdown
// @description Adds a time limit to review questions.
// @version     1.2
// @license     MIT; http://opensource.org/licenses/MIT
// @match       https://www.wanikani.com/subjects/review
// @run-at      document-end
// @grant       none
// @namespace ajpazder
// @downloadURL https://update.greasyfork.org/scripts/16442/WaniKani%20Review%20Countdown.user.js
// @updateURL https://update.greasyfork.org/scripts/16442/WaniKani%20Review%20Countdown.meta.js
// ==/UserScript==

var countdown;
var settingsKey = 'wkfc_settings';
var settings = {
    timeLimitSeconds: 10,
    ignoredItemTypes: [], // May be "radical", "kanji", or "vocabulary"
    hideDecimal: false
};

loadCustomSettings();

addStyleRules();
addSettingsButton();
addSettingsForm();

onReviewItemChange(initializeCountdownTimer);


function loadCustomSettings() {
    var storedSettings = localStorage.getItem(settingsKey);
    if (!storedSettings) { return; }

    extend(settings, JSON.parse(storedSettings));
}

function extend(a, b) {
    for (var key in b) {
        if (b.hasOwnProperty(key)) {
            a[key] = b[key];
        }
    }
    return a;
}

function saveSettings() {
    localStorage.setItem(settingsKey, JSON.stringify(settings));
}

function addStyleRules() {
    var body = document.querySelector('body');
    body.innerHTML +=
        '<style type="text/css">' +
          '#countdown-settings-button { display: inline-block; background: #e1e1e1; padding: 8.5px; margin-right: 10px; border-top-left-radius: 4px; border-top-right-radius: 4px; }' +
          '#countdown-settings-button:hover { cursor: pointer; background: #d5d5d5; }' +
          '#countdown-settings { position: fixed; bottom: 55px; right: 108px; width: 200px; padding: 15px; border-radius: 5px; background: #fff; box-shadow: 2px 2px 2px rgba(0,0,0,.25); z-index: 100; }' +
          '@media(max-width: 768px) { #countdown-settings { right: 5px; } }' +
          '#countdown-settings::after { content: ""; width: 0; position: absolute; right: 20px; bottom: -25px; border-width: 25px 0 0px 20px; border-style: solid; border-color: #fff transparent; }' +
          '#countdown-settings input[type="number"] { width: 50px; border-radius: 4px; border: 1px solid #ccc; padding: 2px; }' +
          '#countdown-settings label.checkbox { display: block; margin-left: 15px; }' +
          '#countdown-settings label.checkbox input[type="checkbox"] { position: relative; top: 1px; }' +
        '</style>';
}

function addSettingsButton() {
    var hotkeys = document.querySelector('.quiz-footer__content');
    var settingsButtonHtml =
        '<div id="countdown-settings-button">⏱︎</div>';
    hotkeys.insertAdjacentHTML('beforebegin', settingsButtonHtml);

    setTimeout(function () {
        var settingsButton = document.getElementById('countdown-settings-button');
        settingsButton.onclick = function () {
            var settingsForm = document.getElementById('countdown-settings');
            if (!isHidden(settingsForm)) {
                hide(settingsForm);
            }
            else {
                show(settingsForm);
                var timeInput = settingsForm.querySelector('input[type="number"]');
                // We focus the input mainly so the settings form's keydown
                // handler will fire and close the form if escape is pressed.
                timeInput.focus();
                // We set the value here so that the cursor is at the end of
                // it when the input is focused.
                timeInput.value = settings.timeLimitSeconds;
            }
        };
    }, 50);
}

function show(element) {
    element.style.display = 'block';
}

function hide(element) {
    element.style.display = 'none';
}

function isHidden(element) {
    return element.style && element.style.display === 'none';
}

function addSettingsForm() {
    var settingsFormHtml =
        '<div id="countdown-settings" style="display: none;">' +
          '<h4 style="margin: 0;margin-bottom: 10px;">Countdown Settings</h4>' +
          '<div>' +
            '<label>Time: </label>' +
            '<input type="number" min="1" style="width: 50px;" /> seconds' +
          '</div>' +
          '<div>' +
            '<label>Display:</label>' +
            '<label class="checkbox"><input type="checkbox" class="hide-decimal"> Round to whole seconds</label>' +
          '</div>' +
          '<div>' +
            '<label>Ignore:</label>' +
            '<label class="checkbox"><input type="checkbox" class="ignore-item-type" value="radical"> Radicals</label>' +
            '<label class="checkbox"><input type="checkbox" class="ignore-item-type" value="kanji"> Kanji</label>' +
            '<label class="checkbox"><input type="checkbox" class="ignore-item-type" value="vocabulary"> Vocab</label>' +
          '</div>' +
        '</div>';
    var footer = document.querySelector('footer');
    footer.insertAdjacentHTML('beforebegin', settingsFormHtml);

    setTimeout(function () {
        var ignoreItemCheckboxes = document.querySelectorAll('#countdown-settings input[type="checkbox"].ignore-item-type');
        var ignoreItemCheckboxChangedEventHandler = function (event) {
            var checkboxValue = event.target.value;
            if (event.target.checked) {
                settings.ignoredItemTypes.push(checkboxValue);
            }
            else {
                var index = settings.ignoredItemTypes.indexOf(checkboxValue);
                settings.ignoredItemTypes.splice(index, 1);
            }
            saveSettings();
        };

        ignoreItemCheckboxes.forEach(function (checkbox) {
            checkbox.checked = settings.ignoredItemTypes.indexOf(checkbox.value) > -1;
            checkbox.onchange = ignoreItemCheckboxChangedEventHandler;
        });

        var hideDecimalCheckbox = document.querySelector('#countdown-settings input[type="checkbox"].hide-decimal');
        hideDecimalCheckbox.checked = settings.hideDecimal;
        hideDecimalCheckbox.onchange = function (event) {
            settings.hideDecimal = event.target.checked;
            saveSettings();
        };

        var timeLimitChangedEventHandler = function (event) {
            var inputValue = event.target.value;
            var minValue = parseInt(event.target.min);
            var saveValue = inputValue;
            if (saveValue < minValue) {
                saveValue = minValue;
                event.target.value = saveValue;
            }
            settings.timeLimitSeconds = saveValue;
            saveSettings();
        };

        var timeLimitInput = document.querySelector('#countdown-settings input[type="number"]');
        timeLimitInput.onchange = timeLimitChangedEventHandler;
        timeLimitInput.onkeyup = timeLimitChangedEventHandler;

        var settingsForm = document.getElementById('countdown-settings');
        settingsForm.keydown = function (event) {
            if (event.keyCode == 27) {
                hide(settingsForm);
            }
        };
    }, 50);
}

function initializeCountdownTimer() {
    if (isIgnoredItemType()) {
        // With the reorder script running, it's possible for
        // a countdown to be started on a not ignored item,
        // but continued on an ignored item when the reorder
        // script sorts items.  This aims to prevent that.
        clearInterval(countdown);
        var countdownContainer = document.querySelector('.countdown-container');
        if (countdownContainer) {
            countdownContainer.remove();
        }
    }
    else {
        startCountdown(settings.timeLimitSeconds);
    }
}

function onReviewItemChange(callback) {
	var observer = new MutationObserver(callback);
    var questionTypeContainer = document.querySelector('.quiz-input__question-type-container');
    observer.observe(questionTypeContainer, { attributes: true });
}

function isIgnoredItemType() {
    var currentItemType = document.querySelector('.quiz-input__question-category').innerText.toLowerCase();
    return settings.ignoredItemTypes.indexOf(currentItemType) !== -1;
}

function startCountdown(seconds) {
	// This function could potentially be called multiple times on
    // the same item so, just to be safe, we'll clear any existing
    // counter interval before we start a new one.
	clearInterval(countdown);

    var timeRemaining = seconds * 1000;
	var updateInterval = 100; // ms
	countdown = setInterval(function () {
		if (answerAlreadySubmitted()) {
			clearInterval(countdown);
			return;
		}

        var remainingSeconds = timeRemaining / 1000;
		var displayTime = settings.hideDecimal ? Math.ceil(remainingSeconds) : remainingSeconds.toFixed(1);
		updateCountdownDisplay(displayTime);

		if (timeRemaining <= 0) {
			clearInterval(countdown);
            if (answerFieldIsEmpty()) {
                enterWrongAnswer();
            }
            submitAnswer();
			return;
		}

		timeRemaining -= updateInterval;

	}, updateInterval);
}

function answerAlreadySubmitted() {
	return document.getElementById('user-response').getAttribute('enabled') === 'false';
}

function answerFieldIsEmpty() {
    return document.getElementById('user-response').value === '';
}

function enterWrongAnswer() {
	if (isReadingQuestion()) {
		setResponseTo('さっぱりわすれた');
	}
	else {
		setResponseTo('I… I don\'t know.');
	}
}

function isReadingQuestion() {
	return document.querySelector('.quiz-input__question-type-container').getAttribute('data-question-type') === 'reading';
}

function setResponseTo(value) {
	document.querySelector('.quiz-input__input').value = value;
}

function submitAnswer() {
	document.querySelector('.quiz-input__submit-button').click();
}

function updateCountdownDisplay(time) {
	// If this is only called once per question change, the counter doesn't show
	// for some reason.  There's probably some other JS running that overwrites it.
	if (!document.getElementById('countdown')) {
        var questionTypeLabel = document.querySelector('.quiz-input__question-type-container');
		questionTypeLabel.innerHTML += ' <span class="countdown-container">(<span id="countdown"></span>s)</span>';
	}

    var countdownTimerText = document.getElementById('countdown');
	countdownTimerText.innerText = time;
}