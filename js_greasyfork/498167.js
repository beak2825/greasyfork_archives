// ==UserScript==
// @name         Kivou - War helpers
// @namespace    kivou
// @version      0.2.1
// @grant        GM_addStyle
// @description  Add some functionalities to help during wars
// @author       Kivou [2000607]
// @grant        GM.xmlHttpRequest
// @match        https://www.torn.com/loader.php?sid=attack*
// @match        https://www.torn.com/preferences.php*
// @match        https://www.torn.com/item.php*
// @require      https://update.greasyfork.org/scripts/477604/1287854/kiv-lib.js
// @require      https://update.greasyfork.org/scripts/479408/1277647/kib-key.js
// @icon         https://yata.yt/media/yata-small.png
// @run-at       document-end
// @license      WTFPL
// @downloadURL https://update.greasyfork.org/scripts/498167/Kivou%20-%20War%20helpers.user.js
// @updateURL https://update.greasyfork.org/scripts/498167/Kivou%20-%20War%20helpers.meta.js
// ==/UserScript==

// Copyright © 2024 Kivou [2000607] <n25c4ejn@duck.com>
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See http://www.wtfpl.net/ for more details.

// ------------- //
// SETUP API KEY //
// ------------- //
storeKey("kiv-war-helper", "War Helper")

// ----------- //
// ATTACK PAGE //
// ----------- //
// display execute
// display battle stats (need API key)

// you can setup this value manually or go hover the tooltip ingame to update it automatically
let EXECUTE = 15;

const updatePlaceholder = (placeholderData) => {
  const placeholder = document.querySelector("span#kiv-placeholder")
  
  // add old data
  placeholder.innerHTML.split(" - ").forEach(kv => {
    const splt = kv.split(": ");
    const key = splt[0];
    const value = splt[1];
    const newData = placeholderData.hasOwnProperty(key);
    if(key && !newData) {
      placeholderData[splt[0]] = splt[1];
    }
  });

  placeholder.innerHTML = Object.entries(placeholderData)
				.sort()
				.map(([key, value]) => `${key}: ${value}`)
				.join(' - ');  
}

const setLife = (life, previous_life) => {

  const bonus = document.querySelector("i.bonus-attachment-execute");
  const placeholderData = {};
  if (bonus) {
    // const execute = Number(bonus.title.split(" ")[7].replace("%", ""));
    const execute = Number(EXECUTE);
    life = Number(life.replace("%", ""));
    previous_life = Number(previous_life.replace("%", ""));    
    placeholderData["Life"] = `${life}%`;
    // if ((previous_life > execute && life <= execute)) {
    if (life <= execute) {
      placeholderData["Execute"] = `<b style="color: #f55;">${execute}%</b>`;
      placeholderData["Life"] = `<b style="color: #f55;">${life}%</b>`;
      document.querySelector("div#defender div[class^=modal___]").style.backgroundColor = "#F332";
    } else {
      placeholderData["Execute"] = `${execute}%`;
      document.querySelector("div#defender div[class^=modal___]").style.backgroundColor = "";
    }
  } else {
    placeholderData["Life"] = `${life}%`;
  }

  updatePlaceholder(placeholderData);
};

waitFor(document, "div#defender").then(defender => {
  // placeholder for additional text
  document.querySelector("h4[class^=title]").insertAdjacentHTML("afterEnd", '<span id="kiv-placeholder"></span>')
  
  // get progress bar
  const progress = defender.querySelector("div[class^=progress]");
  
  // initial life
  const life = progress.style.width;
  setLife(life, "100%");
  
  // life changes
  const lifeObserver = new MutationObserver(mutations => {
    mutations.filter(m => m.attributeName == "style").forEach(m => {
      const previous_life = m.oldValue.split(" ")[1].replace(";", "");
      const life = m.target.style.width;
      setLife(life, previous_life);
    });
  });
  lifeObserver.observe(progress, {
    childList: false,
    subtree: false,
    attributes: true,
    attributeOldValue: true
  });

  // get execute %
  const tooltipObserver = new MutationObserver(mutations => {
    mutations.filter(m => m.target.id.match(/^floating-ui-/)).forEach(m => {
      const tooltip = m.target.querySelector('div[class^="tooltipContainer"]');
      const description = tooltip.innerHTML;
      if(description.includes("<b>Execute</b>")) {
	EXECUTE = description.match(/(\d+)%/)[1];
	const life = progress.style.width;
	setLife(life, "100%");
	tooltipObserver.disconnect();
      }
    });
  });
  tooltipObserver.observe(document, {
    childList: false,
    subtree: true,
    attributes: true,
    attributeOldValue: false
  });

  const key = localStorage.getItem('kiv-war-helper-key');
  
  if (!key) { return; }
  
  const profile_url = new URLSearchParams(window.location.search);
  const target_id = profile_url.get("user2ID");  
  gmGet(`https://yata.yt/api/v1/bs/${target_id}/?key=${key}`, `bs-${target_id}`).then(bs => {
    updatePlaceholder({"Stats": floatFormat(bs[target_id]["total"], 3)})
  }).catch(error => {
    // console.warn(`[kiv-war-helper] ${error.message}`);
    updatePlaceholder({"bs": error.message})
    if (error.message == "Incorrect key") {
      localStorage.removeItem('key');
    }
  });
  
});


// --------- //
// ITEM PAGE //
// --------- //
// sort needles first

waitFor(document, "ul#temporary-items").then(items => {

  const itemObserver = new MutationObserver(mutations => {
    mutations.filter(m => m.addedNodes.length > 1).forEach(m => {
      const needles = Array.from(m.addedNodes).filter(e => ["463", "464", "465", "814"].includes(e.dataset.item));
      needles.forEach(item => {

	// const d = {
	// 	  "463": "+500% strength",
	// 	  "464": "+500% speed",
	// 	  "465": "+300% defense +25% life",
	// 	  "814": "+500% dexterity",
	// 	}
	const d = {
	  "463": "strength",
	  "464": "speed",
	  "465": "defense / life",
	  "814": "dexterity",
	}
	const item_id = item.dataset.item
	item.querySelector(".bonuses").innerHTML = `${d[item_id]}`;
      });

      const parentElement = m.addedNodes[0].parentNode;
      needles.forEach(node => {
	parentElement.insertBefore(node, parentElement.firstChild);
      });
    });
  });
  itemObserver.observe(items, {
    childList: true,
    subtree: false,
    attributes: false,
  });

});
