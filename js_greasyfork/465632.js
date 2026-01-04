// ==UserScript==
// @name         Faucet Rotator - bitcoincuba.net
// @namespace    High Paying Faucet, NO SHORTLINK 
// @version      1.3
// @description  Earn Free Coins Instantly
// @author       BleemV
// @match        https://bitcoincuba.net/*
// @connect      bitcoincuba.net
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitcoincuba.net
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @antifeature  referral-link
// @downloadURL https://update.greasyfork.org/scripts/465632/Faucet%20Rotator%20-%20bitcoincubanet.user.js
// @updateURL https://update.greasyfork.org/scripts/465632/Faucet%20Rotator%20-%20bitcoincubanet.meta.js
// ==/UserScript==

unsafeWindow.open = function() { };

(function() {
	'use strict';

	var trx = "ENTER_YOUR_FAUCETPAY_TRON_DEPOSIT_ADDRESS"
	var doge = "ENTER_YOUR_FAUCETPAY_DOGE_DEPOSIT_ADDRESS"
	var usdt = "ENTER_YOUR_FAUCETPAY_TETHER_DEPOSIT_ADDRESS"
//	var ltc = "ENTER_YOUR_FAUCETPAY_LITECOIN_DEPOSIT_ADDRESS"

	var websiteData = [
		{ url: "https://bitcoincuba.net/freetrx/?r=TM1Aht45p5EhStpzaifYUbKGv5Z8SoV16E", coin: "freetrx", address: trx },
		{ url: "https://bitcoincuba.net/freedoge/?r=DTWuDSaTHEo7RTBtBTH942sH7SHRbvDxe9", coin: "freedoge", address: doge },
		{ url: "https://bitcoincuba.net/freeusdt/?r=TM1Aht45p5EhStpzaifYUbKGv5Z8SoV16E", coin: "freeusdt", address: usdt },
		//		{ url: "https://bitcoincuba.net/freeltc/?r=M8DD8ct56BvkjpLcoR3B6c8oQG5jssU5kc", coin: "freeltc", address: ltc},
	];

	var websiteMap = [

		{
			website: ["bitcoincuba.net"],
			inputTextSelector: "#claim-address",
			inputTextSelectorButton: ["#sign"],
			defaultButtonSelectors: "button.btn.btn-primary.my-2.claim-button",
			captchaButtonSubmitSelector: "#login",
			allMessageSelectors: [".alert.alert-success", ".alert.alert-warning", ".alert.alert-success", ".alert.alert-danger", "#cf-error-details"],
			successMessageSelectors: [".alert.alert-success"],
			messagesToCheckBeforeMovingToNextUrl: ["IP Limit reached", "The send limit set", "sufficient", "insufficient", "you have reached", "tomorrow", "wrong order", "locked", "was sent to your", "You have to wait", "Login not valid", "You have already claimed", "claimed successfully", "Claim not Valid", "rate limited"],
			ablinks: true
		},
	];


	var ablinksSolved = false;

	function triggerEvent(el, type) {
		try {
			var e = document.createEvent('HTMLEvents');
			e.initEvent(type, false, true);
			el.dispatchEvent(e);
		} catch (exception) {
			console.log(exception);
		}
	}

	String.prototype.includesOneOf = function(arrayOfStrings) {


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

	async function getNextUrl() {

		if (count >= websiteData.length) {
			count = 0;
		}

		websiteDataValues.nextUrl = websiteData[count].url;
		websiteDataValues.regex = websiteData[count].regex;


		pingTest(websiteDataValues.nextUrl);
	}
	//////////////////
	var isNextUrlReachable = true;

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

	var delayBeforeMovingToNextUrl = 60000;
	if (websiteDataValues.timeoutbeforeMovingToNextUrl) {
		delayBeforeMovingToNextUrl = websiteDataValues.timeoutbeforeMovingToNextUrl;
	}


	setTimeout(function() {
		movingToNextUrl = false;
		goToNextUrl();
	}, delayBeforeMovingToNextUrl);


	if (window.location.href.includes("to=FaucetPay") || (websiteDataValues.address) && (websiteDataValues.address.length < 5 || websiteDataValues.address.includes("YOUR_"))) {
		goToNextUrl();
	}


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
					}, 2000);
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
					setTimeout ( function() {
						if (messageSelectorsPresent()) {
							goToNextUrl();
						}
					}, 2000);
				}
			}
		}, 2000);
	}, 2000);

})();
