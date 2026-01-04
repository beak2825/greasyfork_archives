// ==UserScript==
// @name     Sleeper BorisChen Tiers
// @description This script adds a row to the team page in Sleepr Football Fantasy with the boris chen tier
// @version  1
// @grant         GM.xmlHttpRequest
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @require https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @require https://greasyfork.org/scripts/431916-borischentiers/code/BorisChenTiers.js?version=968460
// @include https://sleeper.app/leagues/*
// @namespace https://greasyfork.org/users/812226
// @downloadURL https://update.greasyfork.org/scripts/432085/Sleeper%20BorisChen%20Tiers.user.js
// @updateURL https://update.greasyfork.org/scripts/432085/Sleeper%20BorisChen%20Tiers.meta.js
// ==/UserScript==

(async () => {  
  const tierMap = await generateTiers(scoring.Standard, teamNames.sleeper);
  
  console.log(tierMap);

  waitForKeyElements (
    ".team-roster", 
    (jNode) => {
      addHeader(jNode);
      appendDataToTable(jNode, tierMap);
    }
  );  
})();

const addHeader = (jNode) => {
  const header = jNode.find(".title-row");
  
  const headerRow = header.find(".row");
  
  console.log(headerRow);
  
  headerRow.prepend(createSleeperStyledHeader('BORISCHEN TIER'));
  
  jNode.find(".week-container").prepend(createSelect());
  
  $('#Tier-ScoringSelect').on('change', async function() {
    const tierMap = await generateTiers(scoring[this.value], teamNames.sleeper);
    
    appendDataToTable($(".team-roster"), tierMap);
  });
}

const appendDataToTable = (jNode, data) => {  
  const rows = jNode.find('.team-roster-item');
    
  
  rows.each((index, obj) => {
    let tier = '-';
    const name = getName(obj);

    if (data[name] !== null && data[name] !== undefined) {
      tier = data[name] + 1;
    } else {
      console.log("could not match this player: " + name);
    }
    
    const row = $($(obj).find(".row"));

    if ($(obj).find("#BorisChenTier").length > 0) {
      $(obj).find("#BorisChenTier").text(tier);
    } else {
      row.prepend(createTierCol(tier));
    }
  });
};

const createSleeperStyledHeader = (title) => {
 return `<th class="header-option">
          ${title}
				</th>`
};

const createSelect = () => {
  return `<select class="week-selector-dropdown" name="Tier-ScoringSelect" id="Tier-ScoringSelect" style="border:0px">
            <option value="Standard">Std</option>
            <option value="PPR">PPR</option>
            <option value="Half">Half</option>
          </select>`
}

const createTierCol = (tier) => {
  return `<div class="item-option">
		<div style="flex-direction: row; align-items: flex-end;">
      <div id="BorisChenTier" style="color: rgb(216, 226, 237); font-size: 12px;">
				${tier}
      </div>
		</div>
	</div>`
};

const getName = (jQueryNode) => {  
  const nameWithPosition = $($(jQueryNode).find('.link-button.cell-position')).attr("aria-label");
    
  let nameArray = nameWithPosition.split(' ');
  nameArray.splice(0,3);
  const name = nameArray.join(' ');
      
  return santizeString(name);
};
