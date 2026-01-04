// ==UserScript==
// @name        Twitch Prime-Offers Remover
// @namespace   Violentmonkey Scripts
// @match       *://*.twitch.tv/*
// @grant       none
// @version     1.0.5
// @author      Der_Floh
// @description Adds a button to the Twitch Prime-Offers-Section that removes all Offers
// @icon        https://static.twitchcdn.net/assets/coolcat-edacb6fbd813ce2f0272.png
// @homepageURL	https://greasyfork.org/de/scripts/475365-twitch-prime-offers-remover
// @supportURL	https://greasyfork.org/de/scripts/475365-twitch-prime-offers-remover/feedback
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/475365/Twitch%20Prime-Offers%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/475365/Twitch%20Prime-Offers%20Remover.meta.js
// ==/UserScript==

// jshint esversion: 8

// User Options:
const showRemoveAll = true; // Sets wether the "Remove All Prime-Offers" button is shown.
const showClaimAll = false; // Sets wether the "Claim All Prime-Offers" button is shown.
const removePrimeOfferCounter = true; // Sets wether to temove the red counter that show the amount of Prime Offers.

window.addEventListener("load", async () => {
	if (removePrimeOfferCounter === true)
		removePrimeOffersCount();

	if (showRemoveAll === false && showClaimAll === false)
		return;

  const primeButton = await waitForElementToExistQuery(document.body, 'button[data-a-target="prime-offers-icon"]');
  primeButton.click();
	await delay(50);
  primeButton.click();

  const header = await waitForElementToExistId("PrimeOfferPopover-header");

  const primePage = header.parentNode.parentNode.parentNode;
  const offersList = await waitForElementToExistQuery(primePage, 'div[data-target="prime-offer-list"]');
  const offersHeaderCard = await waitForElementToExistQuery(offersList, 'div[class*="prime-offer-header-card"]');

  const lootButton = await waitForElementToExistQuery(offersList, 'a[data-a-target="prime-offers-loot-page-button"]');
  let twitchButtonClass = 'unknown';
  if (lootButton) {
    twitchButtonClass = lootButton.className;
  }

  const removeOffersButtonPre = document.getElementById("removeoffers");
  if (removeOffersButtonPre)
    return;

	if (showRemoveAll) {
		offersHeaderCard.appendChild(document.createElement("br"));
		offersHeaderCard.appendChild(document.createElement("br"));
		const removeOffersButton = createPrimeButton("removeoffers", "Remove All Prime-Offers", twitchButtonClass, () => {
			console.log("Removing All Prime-Offers");
			const removeButtons = offersList.querySelectorAll('button[data-a-target="prime-offer-dismiss-button"]');
			for (let removeButton of removeButtons) {
				removeButton.click();
				const container = removeButton.parentNode.parentNode.parentNode.parentNode;
				container.parentNode.removeChild(container);
			}
		});
		offersHeaderCard.appendChild(removeOffersButton);
	}

	if (showClaimAll) {
		offersHeaderCard.appendChild(document.createElement("br"));
		offersHeaderCard.appendChild(document.createElement("br"));
		const claimOffersButton = createPrimeButton("claimoffers", "Claim All Prime-Offers", twitchButtonClass, () => {
			console.log("Claiming All Prime-Offers");
			const claimButtons = offersList.querySelectorAll('a[data-a-target="prime-claim-button"]');
			for (let claimButton of claimButtons) {
				claimButton.click();
			}
		});
		offersHeaderCard.appendChild(claimOffersButton);
	}
});

async function removePrimeOffersCount() {
	const topNavTemp = await waitForElementToExistQuery(document.body, 'nav[class*="top-nav"]');
	const primeCounterTemp = await waitForElementToExistQuery(topNavTemp, 'div[class*="prime-offers__pill"]');
	primeCounterTemp.parentNode.removeChild(primeCounterTemp);
}

async function waitForElementToExistQuery(baseNode, query) {
  return new Promise(async (resolve) => {
    async function checkElement() {
      const element = baseNode.querySelector(query);
      if (element !== null)
        resolve(element);
      else
        setTimeout(checkElement, 100);
    }
    await checkElement();
  });
}

async function waitForElementToExistId(elementId) {
  return new Promise(async (resolve) => {
    async function checkElement() {
      const element = document.getElementById(elementId);
      if (element !== null)
        resolve(element);
      else
        setTimeout(checkElement, 100);
    }
    await checkElement();
  });
}

function delay(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function createPrimeButton(id, name, buttonClass, action) {
  const primeButton = document.createElement("button");

  primeButton.id = id;
  primeButton.className = buttonClass + " eA-DoIH";
  primeButton.textContent = name;
  primeButton.onclick = action;

  return primeButton;
}