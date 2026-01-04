// ==UserScript==
// @name        Bulk Upvoter for Reddit
// @namespace   Violentmonkey Scripts
// @description Upvote a whole page of posts or comments with the click of a button! Includes support for whitelists and blacklists, hotkeys, and saving settings to file. Now works on old, new, and vanilla Reddit!
// @match       https://www.reddit.com/*
// @include     https://www.reddit.com/*
// @include     https://old.reddit.com/*
// @include     https://new.reddit.com/*
// @grant       none
// @version     1.5.3
// @author      Jupiter Liar
// @license     CC BY
// @author      -
// @description 4/8/2024, 10:23 pm
// @downloadURL https://update.greasyfork.org/scripts/485025/Bulk%20Upvoter%20for%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/485025/Bulk%20Upvoter%20for%20Reddit.meta.js
// ==/UserScript==


var seconds;
var minsec;
var config = loadConfigFromLocalStorage();
var debounceTimer;
var listMode;
var debugMode = false;
var showSettingsPrompt;
var currentHotkey;
var oldRedditTextSize = '13.5px';


// Function to load the saved config from local storage
function loadConfigFromLocalStorage() {
	var savedConfig = localStorage.getItem('BulkUpvoterConfig');
	config = savedConfig ? JSON.parse(savedConfig) : {};

	if (Object.keys(config).length === 0) {
		// console.log('Config is blank.');
		saveDefaultsToLocalStorage();
		config = loadConfigFromLocalStorage();
	}

	// console.log('Loaded config:', config);

	// Load the seconds value if specified
	if (config.hasOwnProperty('seconds')) {
		seconds = parseFloat(config.seconds);
		// console.log('seconds: ' + seconds);
	} else {
		// console.log('seconds not found.');
		seconds = 0.5;
		// console.log('seconds: ' + seconds);
	}

	// Load the minsec value if specified
	if (config.hasOwnProperty('min-sec')) {
		minsec = parseFloat(config['min-sec']);
		// console.log('minsec: ' + minsec);
	} else {
		// console.log('minsec not found.');
		minsec = 0.25;
		// console.log('minsec: ' + minsec);
	}

	// Load listMode based on radio values
	if (config.hasOwnProperty('radio0') && config.radio0 === true) {
		listMode = 'everywhere';
	} else if (config.hasOwnProperty('radio1') && config.radio1 === true) {
		listMode = 'whitelist';
	} else if (config.hasOwnProperty('radio2') && config.radio2 === true) {
		listMode = 'blacklist';
	} else if (config.hasOwnProperty('radio3') && config.radio3 === true) {
		listMode = 'off';
	} else {
		// Set a default value for listMode if none of the radios are true
		listMode = 'everywhere';
	}

	if (config.hasOwnProperty('hide-settings-checkbox') && config['hide-settings-checkbox'] === true) {
		showSettingsPrompt = false;
	} else {
		showSettingsPrompt = true;
	}

	// console.log('listMode: ' + listMode);

	return config;
}


function saveDefaultsToLocalStorage() {
	// console.log('Saving default settings to local storage');
	var defaultConfig = {
		radio0: true,
		radio1: false,
		radio2: false,
		radio3: false,
		redWhitelistTextBox: "",
		uWhitelistTextBox: "",
		redBlacklistTextBox: "",
		uBlacklistTextBox: "",
		seconds: "0.5",
		'min-sec': "0.25",
		'hide-settings-checkbox': false,
		'hotkey-checkbox': true,
		oneModifier: true,
		twoModifier: false,
		firstModifierDropdown: "ALT",
		secondModifierDropdown: "",
		hotkeyBaseKey: "U"
	};

	// Save the default config to local storage
	localStorage.setItem('BulkUpvoterConfig', JSON.stringify(defaultConfig));
	// console.log('Default settings saved to local storage:', localStorage.getItem('BulkUpvoterConfig'));
}



// Function to construct the hotkey based on saved settings
function constructHotkey() {
	// console.log('Constructing hotkey...');

	// Check if hotkey-checkbox is false
	if (!config['hotkey-checkbox']) {
		// console.log('Hotkey checkbox is false. No action needed.');
		return;
	}

	// // Default hotkey settings
	// var defaultHotkey = {
	//   'hotkey-checkbox': true,
	//   'oneModifier': true,
	//   'twoModifier': false,
	//   'firstModifierDropdown': 'ALT',
	//   'secondModifierDropdown': '',
	//   'hotkeyBaseKey': 'U'
	// };

	// Check if hotkey settings are not in the config (first-time setup)
	if (!config.hasOwnProperty('hotkey-checkbox')) {
		config = Object.assign({}, defaultHotkey);
		// saveInputsToLocalStorage();
		// console.log('Hotkey defaults saved:', config);
	}

	// Check if hotkeyBaseKey is blank
	if (config.hotkeyBaseKey === '') {
		// console.log('Hotkey base key is blank. No action needed.');
		return;
	}

	// Check if both ModifierDropdown items are blank
	if (config.oneModifier && config.firstModifierDropdown === '' || config.twoModifier &&
		config.firstModifierDropdown === '' && config.secondModifierDropdown === '') {
		// console.log('All ModifierDropdown items are blank. No action needed.');
		return;
	}

	// Check if oneModifier is true and firstModifierDropdown is blank
	if (config.oneModifier && config.firstModifierDropdown === '') {
		// console.log('One modifier is true, but firstModifierDropdown is blank. No action needed.');
		return;
	}

	// Construct the hotkey
	var hotkey = '';
	if (config.oneModifier || (config.twoModifier && config.secondModifierDropdown == '')) {
		// console.log('hotkey builder first case.');
		hotkey += getModifierKey(config.firstModifierDropdown) + '+';
	}

	if (config.twoModifier && config.firstModifierDropdown == '' && config.secondModifierDropdown !== '') {
		// console.log('hotkey builder second case.');
		hotkey += getModifierKey(config.secondModifierDropdown) + '+';
	}

	if (config.twoModifier && config.firstModifierDropdown !== '' && config.secondModifierDropdown !== '') {
		// console.log('hotkey builder third case.');
		hotkey += getModifierKey(config.firstModifierDropdown) + '+' +
			getModifierKey(config.secondModifierDropdown) + '+';
	}

	hotkey += config.hotkeyBaseKey;

	// console.log('Constructed hotkey:', hotkey);
	currentHotkey = hotkey;
	return hotkey;
}

// Helper function to get the actual modifier key based on the dropdown value
function getModifierKey(modifier) {
	switch (modifier) {
		case 'CTRL':
			return 'Control';
		case 'ALT':
			return 'Alt';
		case 'SHIFT':
			return 'Shift';
		default:
			return '';
	}
}

// Helper function to check if the hotkey is pressed
function isHotkeyPressed(event, hotkey) {
	var pressedKeys = hotkey.split('+').map(key => key.trim().toUpperCase());
	return pressedKeys.every(key => {
		if (key === 'CONTROL') {
			return event.ctrlKey || event.metaKey;
		} else if (key === 'ALT') {
			return event.altKey;
		} else if (key === 'SHIFT') {
			return event.shiftKey;
		} else {
			return event.key.toUpperCase() === key;
		}
	});
}

var hotkey = constructHotkey();

// Named function for the keydown event listener
function hotkeyEventListener(event) {
	// Construct the hotkey

	// Check if the pressed key matches the hotkey
	if (isHotkeyPressed(event, hotkey)) {
		// Hotkey is pressed, add your logic here
		// console.log('Activated Hotkey:', hotkey);
		showOrHideUpvoter();
		// Add your logic to perform actions when the hotkey is activated
	}
}

// Function to activate the hotkey
function activateHotkey() {
	// console.log('Attempting to activate hotkey...');

	document.removeEventListener('keydown', hotkeyEventListener);

	hotkey = constructHotkey();

	// Check if hotkeyBaseKey is blank or both ModifierDropdown items are blank
	if (hotkey === '') {
		// console.log('Hotkey is null. No action needed.');
		return;
	}

	// Add an event listener for keydown events
	document.addEventListener('keydown', hotkeyEventListener);
}

// Call the function to activate the hotkey
activateHotkey();







function addAutoUpvoter() {
	// Create a div element
	var newUpvoterDiv = document.createElement('div');

	// Set top margin and padding for the div
	newUpvoterDiv.style.display = 'block';
	newUpvoterDiv.style.marginTop = '52px';
	newUpvoterDiv.style.padding = '8px';
	newUpvoterDiv.id = 'upvoter-div';
	newUpvoterDiv.style.position = 'fixed';
	newUpvoterDiv.style.top = '0';
	newUpvoterDiv.style.right = '0';
	newUpvoterDiv.style.zIndex = '99';

	// Create a "Do it" button element
	var upvoteAllButton = document.createElement('button');
	upvoteAllButton.id = 'upvote-all-button';
	upvoteAllButton.textContent = 'Upvote All';
	upvoteAllButton.style.background = '#ccc';
	upvoteAllButton.style.display = 'inline-block';
	upvoteAllButton.style.borderRadius = '4px';
	upvoteAllButton.style.padding = '6px';
	upvoteAllButton.style.fontSize = '12pt';
	upvoteAllButton.style.lineHeight = '12pt';
	upvoteAllButton.style.marginBottom = '4px';
	upvoteAllButton.style.border = '1px solid black';
	upvoteAllButton.style.alignItems = 'center';

	// Create a "Stop" button element
	var stopButton = document.createElement('button');
	stopButton.id = 'stop-upvoting-button';
	stopButton.textContent = 'Stop';
	stopButton.style.background = '#ccc';
	stopButton.style.display = 'inline-block';
	stopButton.style.borderRadius = '4px';
	stopButton.style.padding = '6px';
	stopButton.style.fontSize = '12pt';
	stopButton.style.lineHeight = '12pt';
	stopButton.style.marginLeft = '4px'; // Add margin to separate the buttons
	stopButton.style.border = '1px solid black';
	stopButton.style.alignItems = 'center';

	// Create a line break element
	var lineBreak = document.createElement('br');

	// Create a div for the rate controls
	var rateDiv = document.createElement('div');
	rateDiv.style.display = 'flex';
	rateDiv.style.alignItems = 'center';
	rateDiv.id = 'rate-div';


	// Create a one-line numerical text field
	var secondsTextField = document.createElement('input');
	secondsTextField.id = 'seconds-text-field';
	secondsTextField.type = 'number';
	secondsTextField.style.border = '1px solid black';
	secondsTextField.style.padding = '0 0.25em';
	secondsTextField.step = '0.05';
	// secondsTextField.style.width = '9.4em';
	secondsTextField.style.width = '4.5em';
	secondsTextField.min = '0';
	secondsTextField.style.fontSize = '14px';
	secondsTextField.style.display = 'inline-flex';
	secondsTextField.style.height = '1.5em';
	secondsTextField.style.boxSizing = 'content-box';
	secondsTextField.style.marginBottom = '0';
	secondsTextField.style.borderRadius = '0';

	var secPerVote = document.createElement('span');
	secPerVote.style.background = 'white';
	secPerVote.textContent = 'sec/vote'
	secPerVote.style.width = '4em';
	secPerVote.style.marginLeft = '.25em';
	if (window.location.href.includes('old.reddit.com')) {
		secPerVote.style.padding = '0 .5em 0 .25em';
	} else {
		secPerVote.style.padding = '0 .25em';
	}
	secPerVote.style.fontSize = '14px';
	secPerVote.style.border = '1px solid black';
	secPerVote.style.display = 'inline-flex';
	secPerVote.style.alignItems = 'center';
	secPerVote.style.height = '1.5em';

	// Create a line break element
	// var lineBreak3 = document.createElement('br');

	// Create a new div with the specified properties
	var upvotesRemainingDiv = document.createElement('div');
	upvotesRemainingDiv.id = 'upvotesRemainingDiv';
	upvotesRemainingDiv.style.background = 'white';
	upvotesRemainingDiv.style.border = '1px solid black';
	upvotesRemainingDiv.style.marginTop = '4px';
	upvotesRemainingDiv.style.display = 'none';
	upvotesRemainingDiv.style.padding = '0.25em';
	upvotesRemainingDiv.style.fontSize = '14px';


	// Create a span within the div with the specified properties
	var upvotesRemainingSpan = document.createElement('span');
	upvotesRemainingSpan.id = 'upvotesRemaining';

	var lineBreak2 = document.createElement('br');

	var seeSettingsPagePrompt = document.createElement('div');
	seeSettingsPagePrompt.style.color = 'black';
	seeSettingsPagePrompt.style.filter = 'drop-shadow(0px 0px 1px white) drop-shadow(0px 0px 0px white) drop-shadow(0px 0px 0px white) drop-shadow(0px 0px 0px white) drop-shadow(0px 0px 0px white) drop-shadow(0px 0px 0px white) drop-shadow(0px 0px 0px white)';
	seeSettingsPagePrompt.style.fontSize = '12px';
	seeSettingsPagePrompt.style.width = '11.5rem';
	seeSettingsPagePrompt.style.marginTop = '4px';

	var currentSubdomain = window.location.hostname.split('.')[0];

	if (currentSubdomain === 'new') {
		// If the subdomain is "new"
		seeSettingsPagePrompt.textContent = 'Go to new.reddit.com/settings and click Bulk Upvoter tab to change options. The hotkey to show or hide the upvoter is ' + currentHotkey + '.';
	} else if (currentSubdomain === 'old') {
		// If the subdomain is "old"
		seeSettingsPagePrompt.textContent = 'Go to old.reddit.com/prefs and click Bulk Upvoter tab to change options. The hotkey to show or hide the upvoter is ' + currentHotkey + '.';
	} else {
		// For any other subdomain
		seeSettingsPagePrompt.textContent = 'Go to reddit.com/settings and click Bulk Upvoter tab to change options. The hotkey to show or hide the upvoter is ' + currentHotkey + '.';
	}

	// Append the "Do it" button, "Stop" button, line break, and text field to the div
	newUpvoterDiv.appendChild(upvoteAllButton);
	newUpvoterDiv.appendChild(stopButton);
	newUpvoterDiv.appendChild(lineBreak);
	rateDiv.appendChild(secondsTextField);
	rateDiv.appendChild(secPerVote);
	newUpvoterDiv.appendChild(rateDiv);
	// newUpvoterDiv.appendChild(lineBreak3);
	newUpvoterDiv.appendChild(upvotesRemainingDiv);
	upvotesRemainingDiv.appendChild(upvotesRemainingSpan);
	if (showSettingsPrompt) {
		newUpvoterDiv.appendChild(lineBreak2);
		newUpvoterDiv.appendChild(seeSettingsPagePrompt);
	}

	// Append the div to the body
	document.body.appendChild(newUpvoterDiv);



	// Set the value of the text field to the stored seconds
	secondsTextField.value = seconds;

	// Debounce function to update the seconds variable

	secondsTextField.addEventListener('input', function () {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(function () {
			if (secondsTextField.value >= minsec) {
				seconds = secondsTextField.value;
				// console.log('seconds: ' + seconds);
			} else {
				seconds = minsec;
				secondsTextField.value = config.seconds;
			}
			updateConfigSeconds();
			updateInterval();
		}, 1000);
	});


	// New function to update config seconds and save to local storage
	function updateConfigSeconds() {
		// console.log('config: ' + JSON.stringify(config));
		config.seconds = seconds;
		// console.log('config.seconds: ' + config.seconds);
		localStorage.setItem('BulkUpvoterConfig', JSON.stringify(config));
		// console.log('config: ' + JSON.stringify(config));
		config = loadConfigFromLocalStorage(); // Update the config variable
		// console.log('config: ' + JSON.stringify(config));
		secondsTextField.value = config.seconds;
		// console.log('seconds: ' + seconds);

		// Update the value of an input element with id 'seconds' if it exists
		var secondsInput = document.querySelector('#bulk-upvoter-option-tab-menu #seconds');
		if (secondsInput) {
			secondsInput.value = config.seconds;
		}
	}


	// Variables
	var stopClicking = true;
	var clickInterval;

	// Function to simulate clicks on elements with specific attributes
	function simulateClicks() {
		var overlayContainer = document.getElementById('overlayScrollContainer');
		const mainContent = document.querySelector('#main-content');
		var allShadowRoots;

		if (mainContent) {
			// Get all shadow roots within #main-content
			allShadowRoots = mainContent.querySelectorAll('*:not(style)');

			// console.log('allShadowRoots.length: ' + allShadowRoots.length);
		}

		var buttonsToClick;

		if (overlayContainer) {
			// If overlay container exists, build array from elements within it
			buttonsToClick = Array.from(overlayContainer.querySelectorAll('button[aria-label="upvote"][aria-pressed="false"]'));
			// console.log('Overlay container case.');
			// buttonsToClick = [
			//   ...Array.from(overlayContainer.querySelectorAll('button[aria-label="upvote"][aria-pressed="false"]')),
			//   ...Array.from(overlayContainer.querySelectorAll('button[class*="upvote"][aria-pressed="false"]'))
			// ];
		} else if (window.location.href.match(/https?:\/\/new\.reddit\.com\/(r|user)\/(?!.*\/comment).*$/)) {
			// console.log('New Reddit subreddit page.');
			buttonsToClick = [];

			// Get all post containers
			const postContainers = document.querySelectorAll('[data-testid="post-container"]');
			// console.log('Number of post containers:', postContainers.length);

			postContainers.forEach((postContainer, index) => {
				// console.log(`Processing post container ${index + 1}:`);

				// Get all upvote buttons in the post container
				const upvoteButtons = postContainer.querySelectorAll('button[aria-label="upvote"][aria-pressed="false"]');
				// console.log('Number of upvote buttons:', upvoteButtons.length);

				// Process upvote buttons
				if (upvoteButtons.length > 1) {
					// console.log('More than one upvote button. Adding the second one to the array.');
					buttonsToClick.push(upvoteButtons[1]);
				} else if (upvoteButtons.length === 1) {
					// console.log('Exactly one upvote button. Adding it to the array.');
					buttonsToClick.push(upvoteButtons[0]);
				} else {
					// console.log('No upvote buttons found in this post container.');
				}
			});

			// console.log('Final buttons to click array:', buttonsToClick);
		} else {
			// console.log('Third case.');
			// Otherwise, build array the normal way
			buttonsToClick = Array.from(document.querySelectorAll('button[aria-label="upvote"][aria-pressed="false"]'));
			// console.log('Normal case.');

			// console.log('The point before the experiment.');

			// buttonsToClick = Array.from(document.querySelectorAll('button[aria-label="upvote"][aria-pressed="false"]')).filter(button => {
			// 	var currentElement = button;
			// 	while (currentElement) {
			// 		const styles = window.getComputedStyle(currentElement);
			// 		if (styles.display === 'none' || styles.visibility === 'hidden') {
			// 			return false; // Exclude the button
			// 		}
			// 		currentElement = currentElement.parentElement;
			// 	}
			// 	return true; // Include the button
			// }).concat(Array.from(document.querySelectorAll('div[role="button"].arrow.up')));

			if (mainContent) {
				// Iterate through each shadow host
				allShadowRoots.forEach(shadowHost => {
					// Access the shadow root directly
					const shadowRoot = shadowHost.shadowRoot;

					// Check if shadowRoot is available and find buttons
					if (shadowRoot) {
						const buttonsInShadowRoot = Array.from(shadowRoot.querySelectorAll('button[upvote][aria-pressed="false"]'));
						buttonsToClick = buttonsToClick.concat(buttonsInShadowRoot);
					}
				});
			}

		}

		// console.log('buttonsToClick.length: ', buttonsToClick.length);

		clearInterval(clickInterval); // Stop the interval if it's running
		clearTimeout(debounceTimer); // Clear the debounce timer

		function clickNextButton() {

			if (buttonsToClick.length > 0 && !stopClicking) {
				var currentButton = buttonsToClick.shift(); // Remove the first button from the array

				// Check if aria-pressed is still "false"
				if (currentButton.getAttribute('aria-pressed') === 'false' || currentButton.tagName.toLowerCase() === 'div') {
					currentButton.click();
					// Update remaining upvotes info
					// Determine the text content based on the URL condition
					var isCommentsPage = window.location.href.includes("/comments");
					upvotesRemainingSpan.textContent = isCommentsPage ? buttonsToClick.length + ' remaining' : (buttonsToClick.length - 1) / 2 + ' remaining';
					upvotesRemainingSpan.textContent = buttonsToClick.length + ' remaining';
					upvotesRemainingDiv.style.display = 'block';
				} else {
					// If the button is already pressed, immediately go to the next without waiting for the interval
					clickNextButton();
				}
			} else {
				clearInterval(clickInterval); // Stop the interval when all buttons are clicked or stopClicking is true
				// After a delay, hide the remaining upvotes info
				stopClicking = 'true';
				setTimeout(function () {
					upvotesRemainingDiv.style.display = 'none';
				}, 2500);
			}
		}

		// Initial click
		clickNextButton();

		// Set interval for subsequent clicks
		clickInterval = setInterval(clickNextButton, seconds * 1000);
	}

	// Event listener for the "Do it" button
	upvoteAllButton.addEventListener('click', function () {
		stopClicking = false; // Reset stopClicking to false
		simulateClicks(); // Call the simulateClicks function
	});

	// Event listener for the "Stop" button
	stopButton.addEventListener('click', function () {
		stopClicking = true;
		clearInterval(clickInterval); // Stop the interval if it's running
		clearTimeout(debounceTimer); // Clear the debounce timer
		setTimeout(function () {
			upvotesRemainingDiv.style.display = 'none';
		}, 2500);
	});

	// Update the interval when the seconds variable changes
	function updateInterval() {
		// console.log('Updating interval.');
		clearInterval(clickInterval); // Clear the existing interval
		simulateClicks(); // Restart the clicking process with the updated seconds variable
	}

	upvoterDiv = document.getElementById('upvoter-div');
}




var upvoterDiv = document.getElementById('upvoter-div');



// Adding the Option Tab

// Function to check if the current URL matches the desired pattern
function isSettingsPage() {
	var settingsPagePattern = /^https?:\/\/(?:www\.|old\.|new\.)?reddit\.com\/(?:settings|prefs).*$/i;
	return settingsPagePattern.test(window.location.href);
}

function isOldReddit() {
	var settingsPagePattern = /^https?:\/\/?old.reddit\.com\/prefs.*$/i;
	return settingsPagePattern.test(window.location.href);
}

// var bulkUpvoterOptionTabElement;

var commonClasses;

function handleRemoval() {
	addBulkUpvoterToTablist();
}

// Function to add the new option to the tablist if it doesn't already exist
function addBulkUpvoterToTablist() {
	// Check if the element with the specified ID already exists
	var existingOption = document.getElementById('bulk-upvoter-option-tab');

	// If it doesn't exist, create and add the new option
	if (!existingOption) {
		// Create a new anchor element
		var bulkUpvoterOptionTab;
		bulkUpvoterOptionTab = document.createElement('a');
		bulkUpvoterOptionTab.setAttribute('aria-selected', 'false');
		bulkUpvoterOptionTab.setAttribute('role', 'tab');
		bulkUpvoterOptionTab.id = 'bulk-upvoter-option-tab';
		bulkUpvoterOptionTab.style.color = 'blue';
		bulkUpvoterOptionTab.textContent = 'Bulk Upvoter';

		// Find the tablist element
		var tablist;
		if (isOldReddit()) {
			tablist = document.querySelector('ul.tabmenu');
		} else {
			tablist = document.querySelector('[role="tablist"]');
		}

		// Find all the A elements in the tablist
		var tabs;
		if (isOldReddit()) {
			tabs = tablist.querySelectorAll('li');
		} else {
			tabs = tablist.querySelectorAll('a');
		}

		// Get the classes of the first tab (assuming there is at least one tab)
		commonClasses = tabs.length > 0 ? Array.from(tabs[0].classList) : [];

		// Loop through the tabs to find common classes
		for (var i = 1; i < tabs.length; i++) {
			var tabClasses = Array.from(tabs[i].classList);
			commonClasses = commonClasses.filter(value => tabClasses.includes(value));
		}

		// Create list element for Old Reddit
		var bulkUpvoterOptionTabLi = document.createElement('li');
		bulkUpvoterOptionTabLi.id = 'bulk-upvoter-option-tab-li';

		// Add the common classes to the new option
		if (isOldReddit()) {
			bulkUpvoterOptionTabLi.className = commonClasses.join(' ');
		} else {
			bulkUpvoterOptionTab.className = commonClasses.join(' ');
		}

		// Add the new option after everything else in the tablist
		if (isOldReddit()) {
			tablist.appendChild(bulkUpvoterOptionTabLi);
			bulkUpvoterOptionTabLi.appendChild(bulkUpvoterOptionTab);
			bulkUpvoterOptionTab.style.cursor = 'pointer';
		} else {
			tablist.appendChild(bulkUpvoterOptionTab);
		}

		// Add click event listener to the new option
		bulkUpvoterOptionTab.addEventListener('click', function () {
			handleBulkUpvoterClick(tablist);
		});


		// Create a MutationObserver instance
		var observer = new MutationObserver(function (mutations) {
			mutations.forEach(function (mutation) {
				// Check if the new option is removed
				if (mutation.removedNodes && mutation.removedNodes.length > 0) {
					for (var i = 0; i < mutation.removedNodes.length; i++) {
						if (mutation.removedNodes[i].id === 'bulk-upvoter-option-tab') {
							// Handle the removal by adding it back
							handleRemoval();
							break;
						}
					}
				}
			});
		});

		// Configure and start the observer
		var observerConfig = {
			childList: true,
			subtree: true
		};
		observer.observe(tablist, observerConfig);


	}
}





// Check if the current page is the settings page
if (isSettingsPage()) {
	if (isOldReddit()) {
		// console.log('This appears to be the Old Reddit settings page.');
	} else {
		// console.log('This is not the Old Reddit settings page.');
	}
	addBulkUpvoterToTablist();
	// Wait for the entire window to be fully loaded
	window.onload = function () {
		// Add the new option to the tablist during onload, just in case
		addBulkUpvoterToTablist();
	};
}

var currentClass;

// Function to handle the click on the new option
function handleBulkUpvoterClick(tablist) {
	// Find the new option
	var bulkUpvoterOptionTab = document.getElementById('bulk-upvoter-option-tab');
	var bulkUpvoterOptionTabLi = document.getElementById('bulk-upvoter-option-tab-li');

	if (isOldReddit()) {

		// Assuming you have a reference to the ul.tabmenu element
		const tabmenu = document.querySelector('ul.tabmenu');

		if (tabmenu) {
			// Get all li elements inside ul.tabmenu
			const tabmenuItems = tabmenu.querySelectorAll('li');

			// Iterate through each li element
			tabmenuItems.forEach(item => {
				// Remove the class "selected" if it exists
				item.classList.remove('selected');
			});
		}

		bulkUpvoterOptionTabLi.className = 'selected';
	}

	showBulkUpvoterMenu(tablist);

	// Check if the new option already has the class
	if (bulkUpvoterOptionTab.classList.contains('stored-class')) {
		return; // Exit if the class is already added
	}

	// Find all A elements in the tablist (excluding the new option)
	var tabs = document.querySelectorAll('[role="tablist"] a:not(#bulk-upvoter-option-tab)');

	// Loop through the tabs to find the unique class for bottom border
	for (var i = 0; i < tabs.length; i++) {
		var currentTab = tabs[i];

		// Check if the tab has a bottom border
		var computedStyle = window.getComputedStyle(currentTab);
		if (computedStyle.getPropertyValue('border-bottom-width') !== '0px') {
			// Loop through the classes to find the unique class for bottom border
			for (var j = 0; j < currentTab.classList.length; j++) {
				currentClass = currentTab.classList[j];

				// Check if the class is not in the common classes
				if (!commonClasses.includes(currentClass)) {
					// Remove the unique class from the current tab
					currentTab.classList.remove(currentClass);

					// Add the unique class to the new option
					bulkUpvoterOptionTab.classList.add(currentClass);

					// Log the stored class
					// console.log('Stored class: ' + currentClass);

					// Exit the loop
					return;
				}
			}
		}
	}

}




// Function to handle the click on other A elements in the tablist
function handleTabClick(event) {
	// Find the new option
	var bulkUpvoterOptionTab = document.getElementById('bulk-upvoter-option-tab');

	// Check if the new option has the class
	if (bulkUpvoterOptionTab.classList.contains(currentClass)) {
		// Remove the class from the new option
		bulkUpvoterOptionTab.classList.remove(currentClass);

		// Log the removed class
		// console.log('Removed class from new option: ' + currentClass);
	}

	// Get the clicked A element
	var clickedTab = event.target;

	// Check if the clicked A element is the new option
	if (clickedTab === bulkUpvoterOptionTab) {
		return;
	}

	// Add the class to the clicked A element
	clickedTab.classList.add(currentClass);

	// Log the added class
	// console.log('Added class to clicked A element: ' + currentClass);

	hideBulkUpvoterMenu();
}

// Attach click event listener to all A elements in the tablist
var tabs = document.querySelectorAll('[role="tablist"] a:not(#bulk-upvoter-option-tab)');
tabs.forEach(function (tab) {
	tab.addEventListener('click', handleTabClick);
});



// Show/hide the new menu.


// Function to create or reveal the new option menu
function showBulkUpvoterMenu(tablist) {
	// Check if the menu already exists
	var menu = document.getElementById('bulk-upvoter-option-tab-menu');
	// var tablist = document.querySelector('[role="tablist"]');

	// If it doesn't exist, create and style the menu
	if (!menu) {
		menu = document.createElement('div');
		menu.id = 'bulk-upvoter-option-tab-menu';
		menu.style.backgroundColor = '#ddd';
		menu.style.border = '1px solid black';
		menu.style.minHeight = '40px';
		menu.style.display = 'block'; // Initial display option
		menu.style.position = 'absolute'; // Set position to absolute
		menu.style.boxSizing = 'border-box';
		menu.style.padding = '8px';
		menu.style.fontSize = '16px';
		menu.style.fontWeight = '500';
		menu.style.filter = 'drop-shadow(2px 6px 8px black)';
		menu.style.left = '50vw';
		menu.style.translate = '-50% 0';

		// Append the menu to the body
		document.body.appendChild(menu);

		// Set up a ResizeObserver to watch for changes in the tablist's dimensions
		var resizeObserver = new ResizeObserver(function () {
			// Adjust the menu's position and width dynamically
			positionMenu(tablist, menu);
		});

		// Start observing the tablist
		resizeObserver.observe(tablist);

		// Populate the menu with config and set up input listeners
		populateMenu(menu);
		setupInputListeners(menu);

		// Populate the menu with the loaded config
		populateMenuWithConfig(menu);


	} else {
		// If it exists, set its display property to block
		menu.style.display = 'block';
	}

	// Adjust the menu's position and width dynamically
	positionMenu(tablist, menu);
}

// Function to dynamically position the menu below the tablist
function positionMenu(tablist, menu) {
	// Get the tablist's bounding box
	var tablistRect = tablist.getBoundingClientRect();

	// Get the tablist's computed style to include margins
	var tablistStyle = window.getComputedStyle(tablist);

	// Convert left and right margins to numbers
	var paddingLeft = parseFloat(tablistStyle.paddingLeft);
	var marginLeft = parseFloat(tablistStyle.marginLeft);
	// console.log('paddingLeft: ' + paddingLeft);
	var paddingRight = parseFloat(tablistStyle.paddingRight);
	var marginRight = parseFloat(tablistStyle.marginRight);
	// console.log('paddingRight: ' + paddingRight);

	// Set the menu's width to match the tablist's width
	menu.style.width = tablistRect.width - paddingLeft - paddingRight + 'px';

	// // Set the menu's left position to center it horizontally under the tablist
	// menu.style.left = tablistRect.left + paddingLeft + 'px';

	// // Set the menu's top position to be directly below the tablist
	// menu.style.top = tablistRect.bottom + 10 + 'px';

	// Get the tablist's top position
	var tablistTop = window.scrollY + tablistRect.top;

	// Set the menu's top position to be the bottom of the tablist
	menu.style.top = tablistTop + tablistRect.height + 10 + 'px';


}


// Function to hide the new option menu
function hideBulkUpvoterMenu() {
	// Check if the menu exists
	var menu = document.getElementById('bulk-upvoter-option-tab-menu');

	// If it exists, set its display property to none
	if (menu) {
		menu.style.display = 'none';
	}
}


// What goes in the menu:

// Function to populate the menu with options
function populateMenu(menu) {
	// Create a div for radio buttons
	var radioButtonsContainer = document.createElement('div');
	radioButtonsContainer.style.display = 'flex';

	// Create radio button divs for "Everywhere", "Whitelist", "Blacklist", "Off"
	var radioLabels = ['Everywhere', 'Whitelist', 'Blacklist', 'Off'];
	for (var i = 0; i < radioLabels.length; i++) {
		var radioDiv = createOptionDiv('radio' + i, radioLabels[i]);
		radioButtonsContainer.appendChild(radioDiv);
	}

	menu.appendChild(radioButtonsContainer);

	// Create a div for "Whitelists" label and text boxes
	var whitelistsLabelDiv = createLabelDiv('whitelistsLabel', 'Whitelists');
	menu.appendChild(whitelistsLabelDiv);

	// Create a flex container for "Red" and "U" text boxes
	var redUWhitelistContainer = document.createElement('div');
	redUWhitelistContainer.style.display = 'grid';
	redUWhitelistContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
	redUWhitelistContainer.style.gap = '8px';

	// Create divs for "Red" and "U" with text boxes
	var redWhitelistDiv = createTextBoxDiv('redWhitelist', 'Subreddits');
	redUWhitelistContainer.appendChild(redWhitelistDiv);

	var uWhitelistDiv = createTextBoxDiv('uWhitelist', 'Users');
	redUWhitelistContainer.appendChild(uWhitelistDiv);

	menu.appendChild(redUWhitelistContainer);

	// Create a div for "Blacklists" label and text boxes
	var blacklistsLabelDiv = createLabelDiv('blacklistsLabel', 'Blacklists');
	menu.appendChild(blacklistsLabelDiv);

	// Create a flex container for "Red" and "U" text boxes
	var redUBlacklistContainer = document.createElement('div');
	redUBlacklistContainer.style.display = 'grid';
	redUBlacklistContainer.style.gridTemplateColumns = 'repeat(2, 1fr)';
	redUBlacklistContainer.style.gap = '8px';
	// Create divs for "Red" and "U" with text boxes
	var redBlacklistDiv = createTextBoxDiv('redBlacklist', 'Subreddits');
	redUBlacklistContainer.appendChild(redBlacklistDiv);

	var uBlacklistDiv = createTextBoxDiv('uBlacklist', 'Users');
	redUBlacklistContainer.appendChild(uBlacklistDiv);

	menu.appendChild(redUBlacklistContainer);

	var wildcardInfoDiv = document.createElement('div');
	wildcardInfoDiv.style.paddingTop = '8px';

	var wildcardInfo = document.createElement('span');
	wildcardInfo.textContent = 'Enter the names of subreddits or users, one per line. Use * as a wildcard.';
	wildcardInfo.style.fontSize = '14px';

	menu.appendChild(wildcardInfoDiv);
	wildcardInfoDiv.appendChild(wildcardInfo);








	// Function to create a horizontal black line
	function createHorizontalLine() {
		var line = document.createElement('div');
		line.style.borderTop = '1px solid black';
		line.style.margin = '8px 0';
		return line;
	}



	// Function to create the "One click every" section
	function createClickIntervalSection() {
		var section = document.createElement('div');
		section.style.display = 'flex';
		section.style.fontWeight = '100';

		// Text: "One click every"
		var text1 = document.createElement('span');
		text1.textContent = 'One click every ';
		text1.style.paddingTop = '0.1em';

		// Text input for seconds, id: "seconds"
		var secondsInput = document.createElement('input');
		secondsInput.type = 'text';
		secondsInput.id = 'seconds';
		secondsInput.style.margin = '0px .5em';
		secondsInput.style.width = '4em';
		secondsInput.style.padding = '0 0.25em';
		secondsInput.type = 'number';
		secondsInput.style.border = '1px solid black';
		secondsInput.step = '0.05';
		secondsInput.min = '0';

		// Text: "seconds, with a minimum allowed value of"
		var text2 = document.createElement('span');
		text2.textContent = ' seconds, with a minimum allowed value of ';
		text2.style.paddingTop = '0.1em';

		// Text input for min-sec, id: "min-sec"
		var minSecInput = document.createElement('input');
		minSecInput.type = 'text';
		minSecInput.id = 'min-sec';
		minSecInput.style.margin = '0px .5em';
		minSecInput.style.width = '4em';
		minSecInput.style.padding = '0 0.25em';
		minSecInput.type = 'number';
		minSecInput.style.border = '1px solid black';
		minSecInput.step = '0.05';
		minSecInput.min = '0';

		// Text: "seconds."
		var text3 = document.createElement('span');
		text3.textContent = ' seconds.';
		text3.style.paddingTop = '0.1em';

		// Appending elements to the section
		section.appendChild(text1);
		section.appendChild(secondsInput);
		section.appendChild(text2);
		section.appendChild(minSecInput);
		section.appendChild(text3);

		minSecInput.addEventListener('input', function () {
			// Update minsec variable when minSecInput value changes
			minsec = parseFloat(minSecInput.value);
			// console.log('minsec: ' + minsec);
			debounceTimer = setTimeout(function () {
				if (secondsInput.value >= minsec) {
					seconds = secondsInput.value;
				} else {
					seconds = minsec;
					secondsInput.value = seconds;
				}
				config.seconds = seconds;
				var secondsTextField = document.getElementById('seconds-text-field');
				saveInputsToLocalStorage(menu);
				loadConfigFromLocalStorage();
				// updateInterval();
			}, 950);

		});

		secondsInput.addEventListener('input', function () {
			// console.log('minsec: ' + minsec);
			clearTimeout(debounceTimer);
			debounceTimer = setTimeout(function () {
				if (secondsInput.value >= minsec) {
					config.seconds = secondsInput.value;
					seconds = config.seconds;
					// console.log('seconds has been set to: ' + seconds);
				} else {
					config.seconds = minsec;
					seconds = config.seconds;
					secondsInput.value = config.seconds;
					// console.log('seconds went too low and has been set to: ' + seconds);
				}
				seconds = config.seconds;
				saveInputsToLocalStorage(menu);
				loadConfigFromLocalStorage();
				// updateInterval();
			}, 950);
		});

		if (isOldReddit()) {
			text1.style.fontSize = oldRedditTextSize;
			secondsInput.style.fontSize = oldRedditTextSize;
			text2.style.fontSize = oldRedditTextSize;
			minSecInput.style.fontSize = oldRedditTextSize;
			text3.style.fontSize = oldRedditTextSize;
		}


		return section;
	}


	// Append the horizontal black line and "One click every" section to the menu
	menu.appendChild(createHorizontalLine());
	menu.appendChild(createClickIntervalSection());

	var showHideSettingsPromptDiv = document.createElement('div');
	showHideSettingsPromptDiv.style.display = 'flex';
	showHideSettingsPromptDiv.style.paddingTop = '8px';
	showHideSettingsPromptDiv.style.alignItems = 'center';

	var showHideSettingsPromptText = document.createElement('span');
	showHideSettingsPromptText.textContent = 'Hide \"Go to settings\" prompt on upvoter:'
	showHideSettingsPromptText.style.paddingRight = '0.5em';
	showHideSettingsPromptText.style.fontWeight = '100';

	var hideSettingsPromptCheckbox = document.createElement('input');
	hideSettingsPromptCheckbox.id = 'hide-settings-checkbox';
	hideSettingsPromptCheckbox.type = 'checkbox';
	hideSettingsPromptCheckbox.style.translate = '0 1px';
	hideSettingsPromptCheckbox.style.height = '15px';
	hideSettingsPromptCheckbox.style.width = '15px';

	showHideSettingsPromptDiv.appendChild(showHideSettingsPromptText);
	showHideSettingsPromptDiv.appendChild(hideSettingsPromptCheckbox);
	menu.appendChild(showHideSettingsPromptDiv);



	// Hotkey section

	// Create the container div
	var hotkeyContainer = document.createElement('div');
	hotkeyContainer.style.display = 'flex';
	hotkeyContainer.style.paddingTop = '8px';
	hotkeyContainer.style.alignItems = 'center';
	hotkeyContainer.id = 'hotkey-settings';

	// Create the span
	var hotkeyLabel = document.createElement('span');
	hotkeyLabel.textContent = 'Hotkey to display the upvoter:';
	hotkeyLabel.style.paddingRight = '0.5em';
	hotkeyLabel.style.fontWeight = '100';
	hotkeyContainer.appendChild(hotkeyLabel);

	var hotkeyCheckbox = document.createElement('input');
	hotkeyCheckbox.type = 'checkbox';
	hotkeyCheckbox.id = 'hotkey-checkbox';
	hotkeyCheckbox.style.width = '15px';
	hotkeyCheckbox.style.height = '15px';
	hotkeyCheckbox.style.translate = '0 1px';
	hotkeyCheckbox.style.marginRight = '1.5em';
	hotkeyContainer.appendChild(hotkeyCheckbox);

	// Attach listener to the checkbox
	hotkeyCheckbox.addEventListener('change', toggleHotkeySettings);


	// Create radio buttons
	var oneModifierRadio = createRadioButton('modifierRadio', 'oneModifier', 'One Modifier Key', true);
	var twoModifierRadio = createRadioButton('modifierRadio', 'twoModifier', 'Two Modifier Keys', false);
	hotkeyContainer.appendChild(oneModifierRadio);
	hotkeyContainer.appendChild(twoModifierRadio);

	// Create dropdown boxes
	var firstDropdown = createDropdown('firstModifierDropdown', ['', 'CTRL', 'ALT', 'SHIFT']);
	var secondDropdown = createDropdown('secondModifierDropdown', ['', 'CTRL', 'ALT', 'SHIFT']);
	hotkeyContainer.appendChild(firstDropdown);
	hotkeyContainer.appendChild(secondDropdown);

	// Create the textbox
	var hotkeyTextbox = document.createElement('input');
	hotkeyTextbox.type = 'text';
	hotkeyTextbox.id = 'hotkeyBaseKey';
	hotkeyTextbox.maxLength = 1;
	hotkeyTextbox.style.padding = '0 0.5em';
	hotkeyTextbox.style.textAlign = 'center';
	hotkeyTextbox.style.width = '1.5em';
	hotkeyTextbox.style.border = '1px solid black';
	hotkeyContainer.appendChild(hotkeyTextbox);

	hotkeyTextbox.addEventListener('input', function () {
		this.value = this.value.toUpperCase();
	});

	// Append the container to the body
	menu.appendChild(hotkeyContainer);

	// Add event listeners
	oneModifierRadio.addEventListener('change', toggleDropdownVisibility);
	twoModifierRadio.addEventListener('change', toggleDropdownVisibility);
	firstDropdown.addEventListener('change', disableEnableOptions);

	// Helper function to create radio buttons
	function createRadioButton(name, radioID, label, checked) {
		// console.log('Radio buttons being created');

		var radioLabelDiv = document.createElement('div');
		radioLabelDiv.style.display = 'flex';
		radioLabelDiv.style.fontSize = '14px';

		var radioLabel = document.createElement('label');
		radioLabel.setAttribute('for', radioID); // Use the radioId here
		radioLabel.textContent = label;
		radioLabel.style.marginRight = '1em';

		var radio = document.createElement('input');
		radio.type = 'radio';
		radio.name = name;
		radio.id = radioID; // Set the id directly on the radio button
		radio.checked = checked;
		radio.style.marginRight = '0.25em';

		radioLabelDiv.appendChild(radio);
		radioLabelDiv.appendChild(radioLabel);

		return radioLabelDiv;
	}


	// Helper function to create dropdown boxes
	function createDropdown(id, options) {
		var dropdown = document.createElement('select');
		dropdown.id = id;
		dropdown.style.fontSize = '15px';
		dropdown.style.marginRight = '0.5em';
		dropdown.style.padding = '2px';

		options.forEach(function (option) {
			var optionElement = document.createElement('option');
			optionElement.value = option;
			optionElement.textContent = option;
			dropdown.appendChild(optionElement);
		});

		return dropdown;
	}

	// Event listener to toggle visibility of the second dropdown
	function toggleDropdownVisibility() {
		// console.log('twoModifierRadio: ' + config.twoModifier);
		secondDropdown.style.display = config.twoModifier ? 'none' : 'inline-block';
	}

	// Event listener to disable/enable options in the second dropdown
	function disableEnableOptions() {
		var selectedOption = firstDropdown.value;

		for (var i = 0; i < secondDropdown.options.length; i++) {
			var option = secondDropdown.options[i];

			// Check if the first dropdown's selected option is null
			if (selectedOption !== '') {
				option.disabled = option.value === selectedOption;

				// If the currently selected option in the second dropdown becomes disabled, reset to null
				if (option.value === secondDropdown.value && option.disabled) {
					secondDropdown.value = '';
				}
			} else {
				// If the first dropdown's selected option is null, don't disable the null option in the second dropdown
				option.disabled = false;
			}
		}

		// Filter out disabled options from the second dropdown
		updateDropdownVisibility();
	}

	// Helper function to filter out disabled options from the second dropdown
	function updateDropdownVisibility() {
		Array.from(secondDropdown.options).forEach(option => {
			option.hidden = option.disabled;
		});
	}





	menu.appendChild(createHorizontalLine());

	var navigationInfoDiv = document.createElement('div');
	// navigationInfoDiv.style.paddingTop = '8px';

	var navigationInfo = document.createElement('span');
	navigationInfo.textContent = 'The lists work according to page URL\'s. Due to how Reddit navigation works, the upvoter may remain in place after you have navigated away from listed addresses. If you want to make it go away, use the hotkey or simply refresh the page.';
	navigationInfo.style.fontSize = '12.5px';
	navigationInfo.style.fontWeight = '100';

	menu.appendChild(navigationInfoDiv);
	navigationInfoDiv.appendChild(navigationInfo);

	var buttonInfoDiv = document.createElement('div');
	buttonInfoDiv.style.paddingTop = '4px';

	var buttonInfo = document.createElement('span');
	buttonInfo.textContent = 'The upvote button targets all posts currently loaded on the webpage. To target posts that are loaded afterward when scrolling down, click the button again.';
	buttonInfo.style.fontSize = '12.5px';
	buttonInfo.style.fontWeight = '100';

	menu.appendChild(buttonInfoDiv);
	buttonInfoDiv.appendChild(buttonInfo);

	// Example buttons to trigger the functions
	var saveToFileButton = document.createElement('button');
	saveToFileButton.textContent = 'Export Config to File';
	saveToFileButton.addEventListener('click', saveConfigToFile);
	// saveToFileButton.style.marginTop = '8px';
	saveToFileButton.style.background = 'white';
	saveToFileButton.style.border = '1px solid white';
	saveToFileButton.style.padding = '6px 9px';
	saveToFileButton.style.borderRadius = '6px';
	saveToFileButton.style.border = '1px solid black';
	saveToFileButton.style.marginRight = '0.5em';

	var loadFromFileButton = document.createElement('button');
	loadFromFileButton.textContent = 'Load Config from File';
	loadFromFileButton.addEventListener('click', loadConfigFromFile);
	// loadFromFileButton.style.marginTop = '8px';
	loadFromFileButton.style.background = 'white';
	loadFromFileButton.style.border = '1px solid white';
	loadFromFileButton.style.padding = '6px 9px';
	loadFromFileButton.style.borderRadius = '6px';
	loadFromFileButton.style.border = '1px solid black';

	var saveLoadDiv = document.createElement('div');
	saveLoadDiv.style.display = 'flex';
	saveLoadDiv.style.justifyContent = 'center';


	// Append the buttons to the menu or wherever you want them
	menu.appendChild(createHorizontalLine());
	saveLoadDiv.appendChild(saveToFileButton);
	saveLoadDiv.appendChild(loadFromFileButton);
	menu.appendChild(saveLoadDiv);

	if (isOldReddit()) {
		showHideSettingsPromptText.style.fontSize = oldRedditTextSize;
		hideSettingsPromptCheckbox.style.fontSize = oldRedditTextSize;
		hotkeyLabel.style.fontSize = oldRedditTextSize;
		hotkeyCheckbox.style.fontSize = oldRedditTextSize;
		oneModifierRadio.style.fontSize = oldRedditTextSize;
		twoModifierRadio.style.fontSize = oldRedditTextSize;
		firstDropdown.style.fontSize = oldRedditTextSize;
		secondDropdown.style.fontSize = oldRedditTextSize;
		hotkeyTextbox.style.fontSize = oldRedditTextSize;
		hotkeyTextbox.style.padding = '0.15em 0.5em';
		saveToFileButton.style.fontSize = oldRedditTextSize;
		loadFromFileButton.style.fontSize = oldRedditTextSize;
	}


	// Function to load config from a text file
	function loadConfigFromFile() {
		var input = document.createElement('input');
		input.type = 'file';
		input.accept = '.txt';
		const secondsTextField = document.getElementById('seconds-text-field');

		input.addEventListener('change', function (event) {
			var file = event.target.files[0];

			if (file) {
				var reader = new FileReader();
				reader.onload = function (e) {
					try {
						var loadedConfig = JSON.parse(e.target.result);
						// console.log('loadedConfig: ' + loadedConfig);
						config = loadedConfig;
						// config = '';
						// config = Object.assign({}, config, loadedConfig);
						console.log('Config loaded from file:', config);
						localStorage.setItem('BulkUpvoterConfig', JSON.stringify(config));
						loadConfigFromLocalStorage();
						populateMenuWithConfig(menu);
						if (secondsTextField) {
							secondsTextField.value = seconds;
						}
					} catch (error) {
						console.error('Error parsing file:', error);
					}
				};

				reader.readAsText(file);
			}
		});

		input.click();
	}



	// Erase Button

	var eraseDiv = document.createElement('div');
	eraseDiv.style.display = 'none';
	eraseDiv.style.textAlign = 'center';
	if (debugMode) {
		eraseDiv.style.display = 'block';
	}

	var eraseSpan = document.createElement('span');
	eraseSpan.textContent = 'You have revealed the hidden erase button.'
	eraseSpan.style.display = 'block';

	var eraseSettingsButton = document.createElement('button');
	eraseSettingsButton.textContent = 'Erase All Settings';
	eraseSettingsButton.addEventListener('click', eraseSettingsFromLocalStorage);
	eraseSettingsButton.style.marginTop = '8px';
	eraseSettingsButton.style.background = 'white';
	eraseSettingsButton.style.border = '1px solid white';
	eraseSettingsButton.style.padding = '6px 9px';
	eraseSettingsButton.style.borderRadius = '6px';
	eraseSettingsButton.style.border = '1px solid black';

	eraseDiv.appendChild(createHorizontalLine());
	eraseDiv.appendChild(eraseSpan);
	eraseDiv.appendChild(eraseSettingsButton);
	menu.appendChild(eraseDiv);

}

// Function to toggle hotkey settings
function toggleHotkeySettings() {
	// Get the hotkey settings div
	var hotkeySettingsDiv = document.getElementById('hotkey-settings');

	// Check if the checkbox is checked
	var hotkeyCheckbox = document.getElementById('hotkey-checkbox');
	var isEnabled = hotkeyCheckbox.checked;

	// Get all input elements within the hotkey settings div, excluding the checkbox
	var inputs = hotkeySettingsDiv.querySelectorAll('input:not(#hotkey-checkbox), select');

	// Iterate over each input element and enable/disable based on the checkbox state
	inputs.forEach(function (input) {
		input.disabled = !isEnabled;
	});
}

// Function to create an option div with radio and label
function createOptionDiv(id, labelText) {
	// Create the div
	var optionDiv = document.createElement('div');
	optionDiv.style.marginRight = '32px';

	// Create a flex container for radio button and label
	var radioFlexContainer = document.createElement('div');
	radioFlexContainer.style.display = 'flex';

	// Create the radio button
	var radio = document.createElement('input');
	radio.type = 'radio';
	radio.id = id;
	radio.style.marginRight = '8px';
	radio.name = 'options'; // Make sure they are in the same group
	radioFlexContainer.appendChild(radio);

	// Create the label
	var label = document.createElement('label');
	label.textContent = labelText;
	label.setAttribute('for', id);
	label.style.fontWeight = '600';
	label.style.fontSize = '19px';
	radioFlexContainer.appendChild(label);

	optionDiv.appendChild(radioFlexContainer);

	return optionDiv;
}

// Function to create a label div with text boxes
function createLabelDiv(id, labelText) {
	var labelDiv = document.createElement('div');
	labelDiv.id = id;
	labelDiv.style.margin = '16px 0 12px';
	labelDiv.style.fontSize = '18px';

	// Create the label
	var label = document.createElement('label');
	label.textContent = labelText;
	labelDiv.appendChild(label);

	return labelDiv;
}

// Function to create a text box div
function createTextBoxDiv(id, textLabel) {
	var textBoxDiv = document.createElement('div');
	textBoxDiv.id = id;
	textBoxDiv.style.display = 'flex';
	textBoxDiv.style.flexDirection = 'column';

	// Create the label
	var label = document.createElement('label');
	label.textContent = textLabel;
	label.style.marginBottom = '4px';
	textBoxDiv.appendChild(label);

	// Create the text box
	var textBox = document.createElement('textarea');
	textBox.id = id + 'TextBox'; // Unique ID for the text box
	// textBox.cols = 20; // Set the number of columns as needed
	textBox.rows = 8; // Set the number of rows as needed
	textBox.style.resize = 'none';
	textBox.style.padding = '4px';
	textBox.style.border = '1px solid black';
	if (isOldReddit()) {
		textBox.style.fontSize = oldRedditTextSize;
		textBox.style.lineHeight = oldRedditTextSize * 1.5;
	}

	textBoxDiv.appendChild(textBox);

	return textBoxDiv;
}



// Function to set up input change listeners
function setupInputListeners(menu) {
	// Get all input elements within the menu
	var inputs = menu.querySelectorAll('input, textarea, select');

	// Iterate over each input element and set up change listeners
	inputs.forEach(function (input) {
		// Set up a debounced change listener for each input
		var debouncedSave = debounce(function () {
			saveInputsToLocalStorage(menu);
		}, 1000);

		// Add event listener based on input type
		if (input.type === 'radio' || input.type === 'checkbox') {
			input.addEventListener('change', debouncedSave);
		} else {
			input.addEventListener('input', debouncedSave);
		}
	});
}

function toggleAndAddAutoUpvoter() {
	// console.log('Attempting to toggle upvoter.');
	upvoterDiv = document.getElementById('upvoter-div');
	if (upvoterDiv) {
		// console.log('upvoterDiv found');
		// Get current display property
		var currentDisplay = upvoterDiv.style.display;

		// Remove newUpvoterDiv
		upvoterDiv.remove();

		// Run the function to add auto upvoter
		addAutoUpvoter();

		// Set display property back to its original value
		upvoterDiv.style.display = currentDisplay;
	}
}


// Function to save all input values to local storage
function saveInputsToLocalStorage(menu) {
	// console.log('Saving inputs to local storage');
	// Get all input elements within the menu, if it exists
	var inputs = menu ? menu.querySelectorAll('input, textarea, select') : [];
	config = loadConfigFromLocalStorage();

	// Iterate over each input element and update its value in the config
	inputs.forEach(function (input) {
		if (input.type === 'radio' || input.type === 'checkbox') {
			config[input.id] = input.checked;
		} else {
			config[input.id] = input.value;
		}
	});

	// Save the updated config to local storage
	localStorage.setItem('BulkUpvoterConfig', JSON.stringify(config));
	console.log('Saved to local storage:' + JSON.stringify(config));
	config = loadConfigFromLocalStorage();
	activateHotkey();
	toggleAndAddAutoUpvoter();
}

// Function to erase all saved settings from local storage
function eraseSettingsFromLocalStorage() {
	// console.log('Erasing settings from local storage');
	localStorage.removeItem('BulkUpvoterConfig');
}




// Function to save config to a text file
function saveConfigToFile() {
	var configText = JSON.stringify(config, null, 2);
	var blob = new Blob([configText], {
		type: 'text/plain'
	});
	var a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = 'BulkUpvoterConfig.txt';
	a.click();
}



// Debounce function to limit the frequency of function execution
function debounce(func, delay) {
	let timeout;
	return function () {
		const context = this;
		const args = arguments;
		clearTimeout(timeout);
		timeout = setTimeout(function () {
			func.apply(context, args);
		}, delay);
	};
}


// Function to populate the menu with the loaded config
function populateMenuWithConfig(menu) {
	// Get all input elements within the menu
	var inputs = menu.querySelectorAll('input, textarea, select');

	// Iterate over each input element and set its value from the loaded config
	inputs.forEach(function (input) {
		if (input.id === 'secondsTextField') {
			// Special handling for 'secondsTextField'
			var inputValue = config.seconds;
			if (inputValue !== undefined) {
				input.value = inputValue;
			}
		} else if (input.type === 'radio' || input.type === 'checkbox') {
			// Check if the radio exists in the config
			if (config[input.id] !== undefined && config[input.id] === true) {
				input.checked = true;
			}
		} else {
			var inputValue = config[input.id];
			if (inputValue !== undefined) {
				input.value = inputValue;
			}
		}
	});

	if (config.oneModifier) {
		const secondModifierDropdown = document.getElementById('secondModifierDropdown');
		secondModifierDropdown.style.display = 'none';
	}

	toggleHotkeySettings();
}




// Function to check if the current URL matches the criteria
function displayUpvoterBasedOnUrl(currentURL) {
	// console.log('Trying to do the thing.');
	// Check if the current URL matches the whitelist criteria
	if (
		(listMode === 'whitelist' &&
			(matchesRedWhitelist(currentURL) || matchesUWhitelist(currentURL))) ||
		// Check if the current URL matches the blacklist criteria
		(listMode === 'blacklist' &&
			matchesBlacklist(currentURL) &&
			!matchesRedBlacklist(currentURL) &&
			!matchesUBlacklist(currentURL)) ||
		listMode === 'everywhere'
	) {
		// Perform the action if the conditions are met
		displayUpvoter();
	}
}

// Function to check if the current URL matches the red whitelist
function matchesRedWhitelist(currentURL) {
	return matchItemsFromList(currentURL, config.redWhitelistTextBox, 'r');
}

// Function to check if the current URL matches the U whitelist
function matchesUWhitelist(currentURL) {
	return (
		matchItemsFromList(currentURL, config.uWhitelistTextBox, 'u') ||
		matchItemsFromList(currentURL, config.uWhitelistTextBox, 'user')
	);
}

// Function to check if the current URL matches the blacklist
function matchesBlacklist(currentURL) {
	return (
		/^https?:\/\/(?:www\.|old\.|new\.)?reddit\.com\/r\/.*$/i.test(currentURL) ||
		/^https?:\/\/(?:www\.|old\.|new\.)?reddit\.com\/u\/.*$/i.test(currentURL) ||
		/^https?:\/\/(?:www\.|old\.|new\.)?reddit\.com\/user\/.*$/i.test(currentURL)
	);
}

// Function to check if the current URL matches the red blacklist
function matchesRedBlacklist(currentURL) {
	return matchItemsFromList(currentURL, config.redBlacklistTextBox, 'r');
}

// Function to check if the current URL matches the U whitelist
function matchesUBlacklist(currentURL) {
	return (
		matchItemsFromList(currentURL, config.uBlacklistTextBox, 'u') ||
		matchItemsFromList(currentURL, config.uBlacklistTextBox, 'user')
	);
}

// Function to match items from the list
function matchItemsFromList(currentURL, list, prefix) {
	return list.split('\n').some(item => {
		if (item === '*') {
			// Asterisk acts as a wildcard for the specified list type
			const regex = new RegExp(
				`^https?:\/\/(?:www\.|old\.|new\.)?reddit\.com\/${prefix}\/.*$`,
				'i'
			);
			return currentURL.match(regex);
		}
		const regex = new RegExp(
			`^https?:\/\/(?:www\.|old\.|new\.)?reddit\.com\/${prefix}\/${item}(?:\/.*|$)$`,
			'i'
		);
		return currentURL.match(regex);
	});
}

// Function to perform the action
function displayUpvoter() {
	// Your action code here
	upvoterDiv = document.getElementById('upvoter-div');
	if (!upvoterDiv) {
		// console.log('Doing the thing!');
		addAutoUpvoter();
	}
}

function showOrHideUpvoter() {
	var upvoterDiv = document.getElementById('upvoter-div');

	if (!upvoterDiv) {
		// If upvoterDiv doesn't exist, add it
		addAutoUpvoter();
	} else {
		// Toggle the display property
		if (upvoterDiv.style.display === 'block') {
			// If currently visible, hide it
			// console.log('Hiding upvoter.');
			upvoterDiv.style.display = 'none';
		} else {
			// If currently hidden, show it
			// console.log('Showing upvoter.');
			upvoterDiv.style.display = 'block';
		}
	}
}


// Get the current URL
var currentURL = window.location.href;

displayUpvoterBasedOnUrl(currentURL);


// Function to handle URL changes
function handleUrlChange() {
	currentURL = window.location.href;
	// console.log('URL changed: ', currentURL);

	// Call your function or do something with the new URL
	displayUpvoterBasedOnUrl(currentURL);
}

// Event listener for popstate
window.addEventListener('popstate', handleUrlChange);

// Event listener for pushstate
window.addEventListener('pushstate', handleUrlChange);

// Event listener for replacestate
window.addEventListener('replacestate', handleUrlChange);

// // Watch for URL changes using MutationObserver on the body tag
const observer = new MutationObserver(() => {
	if (currentURL != window.location.href) {
		handleUrlChange();
	}
});

observer.observe(document.body, {
	childList: true,
	subtree: true
});