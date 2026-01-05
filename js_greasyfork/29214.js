// ==UserScript==
// @name         Swagbucks - nCrave Bot
// @namespace    https://gist.github.com/Kadauchi
// @version      1.0.0
// @description  blank
// @author       Kadauchi
// @icon         http://i.imgur.com/oGRQwPN.png
// @inclue       http://www.swagbucks.com/ncrave
// @include      http://ab.entertainmentcrave.com/*
// @include      http://cdn1.dailymulligan.com/*
// @include      http://cdn1.bet.com/*
// @include      http://player.ngage-media.com/*
// @include      http://video.younghollywood.com/*
// @include      *telemundo.com*
// @include      *metaworldnews.com*
// @include      *vids.entertainmentcrave.com/*
// @grant        GM_log
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/29214/Swagbucks%20-%20nCrave%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/29214/Swagbucks%20-%20nCrave%20Bot.meta.js
// ==/UserScript==

const autoCrave = false;

const nCraves = {
  "57b54de67591fd081a8b4568": {name: `Weddings Auto-Tour`,      sb: 4, ads: 20, time: 45},
  "584b43457591fd9a3e8b4568": {name: `News Articles Auto-Tour`, sb: 4, ads: 40, time: 25},
  "54f8ac9b7591fd5b698b4568": {name: `Entertainment Auto-Tour`, sb: 3, ads: 30, time: 45},
  "57743bd07591fd07198b4568": {name: `Articles Auto-Tour`,      sb: 1, ads: 8, time: 40, info: `Mem Issues`},
  "55a83d077591fd89738b4568": {name: `News Article Auto-Tour`,  sb: 3, ads: 15, time: 40},
  "533b4e3e7591fd50478b4578": {name: `Workouts Auto-Tour`,      sb: 2, ads: 10, time: 22},
  "582d19007591fdbc2e8b4568": {name: `NBCU Auto-Tour`,          sb: 2, ads: 7, time: 40, info: `No Focus`},
};

const rand = () => Math.round(Math.random() * (10000 - 2000)) + 2000;

function nCravePortal () {
  function receiveMessage (e) {
	if (e.data.search('nCrave_done') !== -1) {
	  setTimeout( () => {
		nCraveChoose();
	  }, rand());
	}
  }

  function nCraveChoose () {
	if (!autoCrave) return;
	const best = document.querySelector(`div[style*="582d19007591fdbc2e8b4568"]`);
	if (best) best.click();
  }

  window.addEventListener('message', receiveMessage, false);

  const observer = new MutationObserver(function (mutations) {
	mutations.forEach(function (mutation) {
	  for (let i = 0; i < mutation.addedNodes.length; i++) {
		let need = true;
		const elem = mutation.addedNodes[i];

		for (let key in nCraves) {
		  if (elem.querySelector(`div[style*="${key}"]`)) {
			const nCrave = nCraves[key];
			elem.querySelector(`.placementCardSubLayerText`).textContent = `${(3600 / (nCrave.ads * nCrave.time) * nCrave.sb).toFixed(1)}/hr - ${nCrave.ads * nCrave.time}s - ${nCrave.ads} ads`;
			need = false;
		  }
		}

		if (need) {
		  const key = elem.querySelector(`div[style*="http://ab.entertainmentcrave.com/lp/placementGraphic"]`).getAttribute(`style`).match(/key=(\w*)/)[1];
		  elem.querySelector(`.placementCardSubLayerText`).textContent = `${key}`;
		}
	  }
	});
  });

  observer.observe(document.getElementsByClassName(`advertisement-content`)[0].children[0], {childList: true});

  setTimeout( () => {
	nCraveChoose();
  }, rand());
}

function observe () {
  if (!document.getElementById(`activityCompleted`)) return;

  const activityCompleted = new MutationObserver(function (mutation) {
	if (mutation[0].target.style.display === `block`) {
	  //window.opener.postMessage(`nCrave_done`, `*`);
	  window.close();
	}
  });

  activityCompleted.observe(document.getElementById(`activityCompleted`), {attributes: true});

  const nextPage = new MutationObserver(function (mutation) {
	if (mutation[0].target.matches(`.active`)) {
	  const id = (Math.floor(Math.random() * 2) === 0) ? `link_up` : `link_down`;
	  const rand = Math.round(Math.random() * (10000 - 2000)) + 2000;
	  setTimeout(function() { document.getElementById(id).click(); }, rand);
	}
  });

  nextPage.observe(document.getElementById(`nextPage`), {attributes: true});
}

const nGage = {
  main () {
	window.addEventListener(`message`, nGage.message, false);

	const startEarning = document.getElementById(`startEarning`);

	const startEarningMutation = new MutationObserver( mutation => {
	  if (startEarning.offsetParent === null) {
		setTimeout( () => {
		  window.opener.postMessage(`nCrave_done`, `*`);
		  window.close();
		}, rand());
	  }
	  else if (startEarning.matches(`.success`)) {
		setTimeout( () => {
		  if (startEarning.offsetParent !== null && startEarning.matches(`.success`)) {
			startEarning.click();
		  }
		}, rand());
	  }
	});

	startEarningMutation.observe(startEarning, {attributes: true});

	setTimeout( () => {
	  startEarning.click();

	  setTimeout ( () => {
		window.focus();
		document.querySelector(`span.switch`).click();
	  }, rand());
	}, rand());
  },

  popup () {
	window.addEventListener(`message`, nGage.message, false);
	window.opener.postMessage(`nGagePing`, `*`);
  },

  error () {
	setTimeout( () => {
	  window.opener.postMessage(`nCrave_done`, `*`);
	  window.close();
	}, rand());
  },

  message (event) {
	if (event.data.search(`nGagePing`) !== -1) {
	  event.source.postMessage(`nGagePong`, event.origin);
	}
	if (event.data.search(`nGagePong`) !== -1) {
	  window.resizeTo(window.screen.availWidth / 2, window.screen.availHeight / 2);
	  window.moveBy(0, window.screen.availHeight / 2);
	}
  }
};

if ($('div.title:contains(Ncrave)').length) { nCravePortal(); }
//if (document.URL.match(/(ncrave|entertainmentcrave.com|dailymulligan.com|younghollywood.com)/)) { nCrave(); }
if (document.URL.match(/player.ngage-media.com/)) { nCraveActivity(); }
if (document.URL.match(`http://ab.entertainmentcrave.com/promo/`)) {
  observe();
  nGage.main();
}

if (document.URL.match(`telemundo|metaworldnews|vids\.entertainmentcrave/`)) {
  nGage.popup();
}

if (document.URL.match(`http://ab.entertainmentcrave.com/encrave_error.html`)) {
  nGage.error();
}

for (let elem of document.querySelectorAll(`video`)) elem.muted = true;
for (let elem of document.querySelectorAll(`audio`)) elem.muted = true;