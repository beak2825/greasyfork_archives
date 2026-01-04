// ==UserScript==
// @name         Faucet Rotator - Claim Free Coins
// @namespace    Faucet Rotator - Claim Free Coins
// @version      1.7
// @description  Earn free crypto using this script instantly
// @author       BleemV
// @match        https://beefaucet.org/*
// @connect      beefaucet.org
// @icon         https://www.google.com/s2/favicons?sz=64&domain=beefaucet.org
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @antifeature  referral-link
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544286/Faucet%20Rotator%20-%20Claim%20Free%20Coins.user.js
// @updateURL https://update.greasyfork.org/scripts/544286/Faucet%20Rotator%20-%20Claim%20Free%20Coins.meta.js
// ==/UserScript==
 
//Block All Pop ups
unsafeWindow.open = function() { };
 
(function() {
	'use strict';
 
	//===============================================================================================
	//User configuration
 
	var faucetpayEmail = "sstels215@gmail.com";
	var btc = "sstels215@gmail.com";
	var doge = "sstels215@gmail.com";
	var ltc = "sstels215@gmail.com";
	var trx = "sstels215@gmail.com";
	var bnb = "sstels215@gmail.com";
	var sol = "sstels215@gmail.com";
	var usdt = "sstels215@gmail.com";
	var matic = "sstels215@gmail.com";
	var eth = "sstels215@gmail.com";
	var bch = "sstels215@gmail.com";
	var dash = "sstels215@gmail.com";
	var zec = "sstels215@gmail.com";
	var dgb = "sstels215@gmail.com";
	var fey = "sstels215@gmail.com";
 
	//You can now save the file and start using
	//===============================================================================================
 
	//List of the faucet websites along with address
	//coin parameter is used as regex from the url
	//If url has */bitcoin/* then use "bitcoin" as coin, if it is */ETH/*, use "ETH" as coin
	//If there is no regex for coin, use only address
	// Comment the faucets which you do not wish to use or which don't have sufficient funds
	// Always add bitcoin before bitcoincash if you using same domains
 
	var websiteData = [
		{ url: "https://beefaucet.org/bitcoin-faucet/?r=sstels215@gmail.com", coin: "bitcoin-faucet", address: faucetpayEmail },
		{ url: "https://beefaucet.org/dogecoin-faucet/?r=sstels215@gmail.com", coin: "dogecoin-faucet", address: faucetpayEmail },
		{ url: "https://beefaucet.org/litecoin-faucet/?r=sstels215@gmail.com", coin: "litecoin-faucet", address: faucetpayEmail },
		{ url: "https://beefaucet.org/tron-faucet/?r=sstels215@gmail.com", coin: "tron-faucet", address: faucetpayEmail },
		{ url: "https://beefaucet.org/bnb-faucet/?r=sstels215@gmail.com", coin: "bnb-faucet", address: faucetpayEmail },
		{ url: "https://beefaucet.org/solana-faucet/?r=sstels215@gmail.com", coin: "solana-faucet", address: faucetpayEmail },
		{ url: "https://beefaucet.org/tether-faucet/?r=sstels215@gmail.com", coin: "tether-faucet", address: faucetpayEmail },
		{ url: "https://beefaucet.org/polygon-faucet/?r=sstels215@gmail.com", coin: "polygon-faucet", address: faucetpayEmail },
		{ url: "https://beefaucet.org/ethereum-faucet/?r=sstels215@gmail.com", coin: "ethereum-faucet", address: faucetpayEmail },
		{ url: "https://beefaucet.org/bch-faucet/?r=sstels215@gmail.com", coin: "bch-faucet", address: faucetpayEmail },
		{ url: "https://beefaucet.org/dash-faucet/?r=sstels215@gmail.com", coin: "dash-faucet", address: faucetpayEmail },
		{ url: "https://beefaucet.org/zcash-faucet/?r=sstels215@gmail.com", coin: "zcash-faucet", address: faucetpayEmail },
		{ url: "https://beefaucet.org/digibyte-faucet/?r=sstels215@gmail.com", coin: "digibyte-faucet", address: faucetpayEmail },
		{ url: "https://beefaucet.org/feyorra-faucet/?r=sstels215@gmail.com", coin: "feyorra-faucet", address: faucetpayEmail },
	];
 
	//Add data for any new website with single pages
	//Message selectors are for success or failure to move on to the next website
	//AutoWithdraw is disabled by default(for bagi and keran)
	//Add only domain name in website as mentioned below. Follow the same pattern.
	//Use arrays wherever it is required
	//ToDo:Instead of reading messages, either visibility or length of the messages can be checked
 
	var websiteMap = [{
		website: ["beefaucet.org"],
		inputTextSelector: ["#address"],
		inputTextSelectorButton: "body > div.container.flex-grow.my-4 > div.row.my-2 > div.col-12.col-md-8.col-lg-8.order-md-2.mb-4.text-center > form > div:nth-child(4) > button",
		defaultButtonSelectors: ["a.btn"],
		captchaButtonSubmitSelector: ["#login"],
		allMessageSelectors: [".alert.alert-warning", ".alert.alert-success", ".alert.alert-danger", "#cf-error-details"],
		successMessageSelectors: [".alert.alert-success"],
		messagesToCheckBeforeMovingToNextUrl: ["invalid", "sufficient", "you have reached", "tomorrow", "wrong order", "locked", "was sent to your", "You have to wait", "Login not valid", "You have already claimed", "claimed successfully", "Claim not Valid", "rate limited"],
		ablinks: true
	},
	];
 
	var ablinksSolved = false;
 
	//HtmlEvents dispatcher
	function triggerEvent(el, type) {
		try {
			var e = document.createEvent('HTMLEvents');
			e.initEvent(type, false, true);
			el.dispatchEvent(e);
		} catch (exception) {
			console.log(exception);
		}
	}
 
	//Check if a string is present in Array
	String.prototype.includesOneOf = function(arrayOfStrings) {
 
		//If this is not an Array, compare it as a String
		if (!Array.isArray(arrayOfStrings)) {
			return this.toLowerCase().includes(arrayOfStrings.toLowerCase());
		}
 
		for (var i = 0; i < arrayOfStrings.length; i++) {
			if (this.toLowerCase().includes(arrayOfStrings[i].toLowerCase())) {
				return true;
			}
		}
		return false;
	}
 
	var websiteDataValues = {};
 
	//Get selector details from the websiteMap
	for (let value of Object.values(websiteMap)) {
		if (window.location.href.includesOneOf(value.website)) {
			websiteDataValues.inputTextSelector = value.inputTextSelector;
			websiteDataValues.inputTextSelectorButton = value.inputTextSelectorButton;
			websiteDataValues.defaultButtonSelectors = value.defaultButtonSelectors;
			websiteDataValues.claimButtonSelectors = value.claimButtonSelectors;
			websiteDataValues.captchaButtonSubmitSelector = value.captchaButtonSubmitSelector;
			websiteDataValues.allMessageSelectors = value.allMessageSelectors;
			websiteDataValues.messagesToCheckBeforeMovingToNextUrl = value.messagesToCheckBeforeMovingToNextUrl;
			websiteDataValues.withdrawPageUrl = value.withdrawPageUrl;
			websiteDataValues.withdrawEnabled = value.withdrawEnabled;
			websiteDataValues.balanceSelector = value.balanceSelector;
			websiteDataValues.withdrawMinAmount = value.withdrawMinAmount;
			websiteDataValues.successMessageSelectors = value.successMessageSelectors;
			websiteDataValues.additionalFunctions = value.additionalFunctions;
			websiteDataValues.timeoutbeforeMovingToNextUrl = value.timeoutbeforeMovingToNextUrl;
			websiteDataValues.formSubmit = value.formSubmit;
			websiteDataValues.ablinks = value.ablinks;
			break;
		}
	}
 
	//Identify which coin to input, based on the url input
	//If the URL does not contain the coin, then use the default from the domain name
	var count = 0;
	var addressAssigned = false;
	for (let value of Object.values(websiteData)) {
		count = count + 1;
		if (value.url.includes(window.location.hostname) && (window.location.href.includes("/" + value.coin + "/") ||
			window.location.href.includes("/" + value.coin + "-") ||
			window.location.href.endsWith("/" + value.coin))) {
			websiteDataValues.address = value.address;
			addressAssigned = true;
			break;
		}
	}
 
	//If URL does not have coin, check the default from the domain name
	if (!addressAssigned) {
		count = 0;
		for (let value of Object.values(websiteData)) {
			count = count + 1;
 
			if (value.url.includes(window.location.hostname)) {
				if (value.regex) {
					if (GM_getValue("UrlRegex")) {
						if (GM_getValue("UrlRegex") == value.regex) {
							websiteDataValues.address = value.address;
							break;
						}
					} else {
						GM_setValue("UrlRegex", value.regex);
						websiteDataValues.address = value.address;
						break;
					}
 
				} else {
					websiteDataValues.address = value.address;
					break;
				}
			}
		}
	}
 
 
 
	//Get the next Url from the website data map
	async function getNextUrl() {
 
		//Go to the beginning if the end of the array is reached
		if (count >= websiteData.length) {
			count = 0;
		}
 
		websiteDataValues.nextUrl = websiteData[count].url;
		websiteDataValues.regex = websiteData[count].regex;
 
		//Ping Test to check if a website is up before proceeding to next url
		pingTest(websiteDataValues.nextUrl);
	}
 
	var isNextUrlReachable = false;
	//Get the next Url from the website
	function pingTest(websiteUrl) {
		console.log(websiteUrl);
		GM_xmlhttpRequest({
			method: "GET",
			url: websiteUrl,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			timeout: 2000,
			onload: function(response) {
				//Website is reachable
				if (response && response.status == 200) {
					isNextUrlReachable = true;
				} else {
					count = count + 1;
					getNextUrl();
				}
			},
			onerror: function(e) {
				count = count + 1;
				getNextUrl();
			},
			ontimeout: function() {
				count = count + 1;
				getNextUrl();
			},
		});
 
	}
 
 
	async function delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
 
 
	var movingToNextUrl = false;
	async function goToNextUrl() {
		if (!movingToNextUrl) {
			movingToNextUrl = true;
			getNextUrl();
			while (!isNextUrlReachable) {
				await delay(2000);
			}
 
			if (websiteDataValues.regex) {
				GM_setValue("UrlRegex", websiteDataValues.regex);
			}
			window.location.href = websiteDataValues.nextUrl;
			movingToNextUrl = true;
		}
	}
 
	async function goToWithdrawPage() {
		if (!movingToNextUrl) {
			movingToNextUrl = true;
			window.location.href = websiteDataValues.withdrawPageUrl;
		}
 
	}
 
 
	//Default Setting: After 180 seconds go to next Url
	var delayBeforeMovingToNextUrl = 100000;
	if (websiteDataValues.timeoutbeforeMovingToNextUrl) {
		delayBeforeMovingToNextUrl = websiteDataValues.timeoutbeforeMovingToNextUrl;
	}
 
	setTimeout(function() {
		movingToNextUrl = false;
		goToNextUrl();
	}, delayBeforeMovingToNextUrl);
 
 
	//Move to next URL if address is not mentioned above
	if (window.location.href.includes("to=FaucetPay") || (websiteDataValues.address) && (websiteDataValues.address.length < 5 || websiteDataValues.address.includes("YOUR_"))) {
		goToNextUrl();
	}
 
	//Returns true if message selectors are present
	function messageSelectorsPresent() {
		if (websiteDataValues.allMessageSelectors) {
			for (var j = 0; j < websiteDataValues.allMessageSelectors.length; j++) {
				for (var k = 0; k < document.querySelectorAll(websiteDataValues.allMessageSelectors[j]).length; k++) {
					if (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k] &&
						(document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].innerText.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl) ||
							(document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value &&
								document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl)))) {
						return true;
					}
				}
			}
		}
		return false;
	}
 
	//Returns true if any message is present in message selector
	function checkMessageSelectorsLength() {
		if (websiteDataValues.allMessageSelectors) {
			for (var j = 0; j < websiteDataValues.allMessageSelectors.length; j++) {
				for (var k = 0; k < document.querySelectorAll(websiteDataValues.allMessageSelectors[j]).length; k++) {
					if (document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k] &&
						(document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].innerText.length > 0) ||
						(document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value &&
							document.querySelectorAll(websiteDataValues.allMessageSelectors[j])[k].value.length > 0)) {
						return true;
					}
				}
			}
		}
		return false;
	}
 
	//Returns true if message selectors are present
	function successMessageSelectorsPresent() {
		if (websiteDataValues.successMessageSelectors) {
			for (var j = 0; j < websiteDataValues.successMessageSelectors.length; j++) {
				for (var k = 0; k < document.querySelectorAll(websiteDataValues.successMessageSelectors[j]).length; k++) {
					if (document.querySelectorAll(websiteDataValues.successMessageSelectors[j])[k] && document.querySelectorAll(websiteDataValues.successMessageSelectors[j])[k].innerText.includesOneOf(websiteDataValues.messagesToCheckBeforeMovingToNextUrl)) {
						return true;
					}
				}
			}
		}
		return false;
	}
 
 
	function ablinksCaptcha() {
 
		setInterval(function() {
 
			if (document.querySelector("#switch") && document.querySelector("#switch").innerText.toLowerCase().includes("hcaptcha")) {
				document.querySelector("#switch").click();
			} else if (document.querySelector("#switch") && document.querySelector("#switch").innerText.toLowerCase().includes("recaptcha")) {
				document.querySelector("#switch").click();
			}
			var count = 0;
 
			var abModels = [".modal-content [href='/']", ".modal-body [href='/']", ".antibotlinks [href='/']"];
			var abModelsImg = [".modal-content [href='/'] img", ".modal-body [href='/'] img", ".antibotlinks [href='/'] img"];
			for (let j = 0; j < abModelsImg.length; j++) {
				if (document.querySelector(abModelsImg[j]) &&
					document.querySelector(abModelsImg[j]).value == "####") {
					goToNextUrl();
					break;
				}
			}
 
			for (let i = 0; i < 4; i++) {
				for (let j = 0; j < abModels.length; j++) {
					if (document.querySelectorAll(abModelsImg[j]).length == 4 &&
						document.querySelectorAll(abModels[j])[i] &&
						document.querySelectorAll(abModels[j])[i].style &&
						document.querySelectorAll(abModels[j])[i].style.display == 'none') {
						count++;
						break;
					}
				}
			}
			if (count == 4) {
				ablinksSolved = true;
			}
		}, 2000);
 
	}
 
 
	setTimeout(function() {
 
		ablinksCaptcha();
 
 
		if (window.name == "nextWindowUrl") {
			window.name = "";
			goToNextUrl();
			return;
		} else {
			window.name = window.location.href;
		}
 
 
		if (websiteDataValues.additionalFunctions) {
			websiteDataValues.additionalFunctions();
		}
 
		if (websiteDataValues.withdrawEnabled) {
			if (websiteDataValues.balanceSelector && document.querySelector(websiteDataValues.balanceSelector)) {
				var currentBalance = document.querySelector(websiteDataValues.balanceSelector).innerText;
				if (currentBalance > websiteDataValues.withdrawMinAmount && !window.location.href.includes(websiteDataValues.withdrawPageUrl)) {
					goToWithdrawPage();
				}
 
			} else {
				if (successMessageSelectorsPresent()) {
					goToWithdrawPage();
				}
			}
		}
 
 
		if (!movingToNextUrl && messageSelectorsPresent()) {
			goToNextUrl();
		}
 
 
 
		if (!movingToNextUrl && document.querySelector(websiteDataValues.inputTextSelector)) {
			document.querySelector(websiteDataValues.inputTextSelector).value = websiteDataValues.address;
			triggerEvent(document.querySelector(websiteDataValues.inputTextSelector), 'keypress');
			triggerEvent(document.querySelector(websiteDataValues.inputTextSelector), 'change');
			setTimeout(function() {
				if (websiteDataValues.inputTextSelectorButton && document.querySelector(websiteDataValues.inputTextSelectorButton)) {
					document.querySelector(websiteDataValues.inputTextSelectorButton).click();
				}
 
			}, 2000);
		}
 
 
		if (!movingToNextUrl && websiteDataValues.defaultButtonSelectors) {
			for (let i = 0; i < websiteDataValues.defaultButtonSelectors.length; i++) {
				if (document.querySelector(websiteDataValues.defaultButtonSelectors[i])) {
					triggerEvent(document.querySelector(websiteDataValues.defaultButtonSelectors[i]), 'mousedown');
					triggerEvent(document.querySelector(websiteDataValues.defaultButtonSelectors[i]), 'mouseup');
					document.querySelector(websiteDataValues.defaultButtonSelectors[i]).click();
					break;
				}
			}
		}
 
		setTimeout(function() {
			if (!movingToNextUrl && websiteDataValues.claimButtonSelectors) {
				for (let i = 0; i < websiteDataValues.claimButtonSelectors.length; i++) {
					if (document.querySelector(websiteDataValues.claimButtonSelectors[i])) {
						triggerEvent(document.querySelector(websiteDataValues.claimButtonSelectors[i]), 'mousedown');
						triggerEvent(document.querySelector(websiteDataValues.claimButtonSelectors[i]), 'mouseup');
						document.querySelector(websiteDataValues.claimButtonSelectors[i]).click();
						break;
					}
				}
			}
		}, 2000);
 
 
 
 
		var clicked = false;
		var captchaInterval = setInterval(function() {
 
			if (websiteDataValues.ablinks && !ablinksSolved) {
				return;
			}
 
			try {
				if (!clicked && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0 &&
					websiteDataValues.captchaButtonSubmitSelector && document.querySelector(websiteDataValues.captchaButtonSubmitSelector) &&
					document.querySelector(websiteDataValues.captchaButtonSubmitSelector).style.display != 'none' &&
					!document.querySelector(websiteDataValues.captchaButtonSubmitSelector).disabled) {
					if (websiteDataValues.formSubmit) {
						document.querySelector(websiteDataValues.captchaButtonSubmitSelector).submit();
					} else {
						document.querySelector(websiteDataValues.captchaButtonSubmitSelector).click();
					}
					clicked = true;
 
					clearInterval(captchaInterval);
					setTimeout(function() {
						if (messageSelectorsPresent()) {
							goToNextUrl();
						}
					}, 20000);
				}
			} catch (e) {
 
			}
 
			for (var hc = 0; hc < document.querySelectorAll("iframe").length; hc++) {
				if (!clicked && document.querySelectorAll("iframe")[hc] &&
					document.querySelectorAll("iframe")[hc].hasAttribute("data-hcaptcha-response") &&
					document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response").length > 0 &&
					websiteDataValues.captchaButtonSubmitSelector && document.querySelector(websiteDataValues.captchaButtonSubmitSelector) &&
					document.querySelector(websiteDataValues.captchaButtonSubmitSelector).style.display != 'none' &&
					!document.querySelector(websiteDataValues.captchaButtonSubmitSelector).disabled) {
					if (websiteDataValues.formSubmit) {
						document.querySelector(websiteDataValues.captchaButtonSubmitSelector).submit();
					} else {
						document.querySelector(websiteDataValues.captchaButtonSubmitSelector).click();
					}
					clicked = true;
					clearInterval(captchaInterval);
					setTimeout(function() {
						if (messageSelectorsPresent()) {
							goToNextUrl();
						}
					}, 2000);
				}
			}
		}, 2000);
	}, 2000);
 
})();