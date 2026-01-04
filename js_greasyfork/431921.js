// ==UserScript==
// @name     NFL.com BorisChenTiers
// @description This script adds a row to the team and player page in NFL.com Football Fantasy website with the boris chen tier
// @version  1.5
// @grant         GM.xmlHttpRequest
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @require https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @require https://greasyfork.org/scripts/431916-borischentiers/code/BorisChenTiers.js?version=968797
// @include https://*fantasy.nfl.com/league/*/team/*
// @exclude https://*fantasy.nfl.com/league/*/team/*/gamecenter*
// @include https://*fantasy.nfl.com/league/*/players
// @namespace https://greasyfork.org/users/812226
// @downloadURL https://update.greasyfork.org/scripts/431921/NFLcom%20BorisChenTiers.user.js
// @updateURL https://update.greasyfork.org/scripts/431921/NFLcom%20BorisChenTiers.meta.js
// ==/UserScript==

(async () => {  
  const tierMap = await generateTiers(scoring.Standard);
  
  console.log(tierMap);

  waitForKeyElements (
    ".tableType-player", 
    (jNode) => {
      appendDataToTable(jNode, tierMap, true);
    }
  );  
})();

const appendDataToTable = (jNode, data, addHeader) => {  
  const rows = jNode.children().find('tr');
    
  
  rows.each((index, obj) => {
    if (index == 0) {
      
    } else if (index == 1) {
      if (addHeader) {
				$($($(obj).children()).eq(1)).after(createNFLStyledHeaderWithSelect('BorisChen Tier'));
      
        $('#Tier-ScoringSelect').on('change', async function() {
          const tierMap = await generateTiers(scoring[this.value]);

          appendDataToTable($(".tableType-player"), tierMap, false);
        });
      }
    } else {
      let tier = '-';
      const name = getName(obj);
      
      if (data[name] !== null && data[name] !== undefined) {
        tier = data[name] + 1;
      } else {
        console.log("could not match this player: " + name);
      }
      
      if ($(obj).find("#BorisChenTier").length > 0) {
        $(obj).find("#BorisChenTier").text(tier);
      } else {
        $($($(obj).children()).eq(1)).after(createTierCol(tier));
      }
    }
  });
};

const createNFLStyledHeaderWithSelect = (title) => {
 return `<th class="BorisChenTierHeader">
          ${title}
          <select name="Tier-ScoringSelect" id="Tier-ScoringSelect">
            <option value="Standard">Std</option>
            <option value="PPR">PPR</option>
            <option value="Half">Half</option>
          </select>
				</th>`
};

const createNFLStyledHeader = (title) => {
 return `<th class="BorisChenTierHeader">
					${title}
				</th>`
};

const createTierCol = (tier) => {
	return `<td id="BorisChenTier"
							class="playerOpponent">
						<span>${tier}</span>
					</td>`; 
};

const getName = (jQueryNode) => {  
  const name = $($(jQueryNode).find('.playerNameFull')).text();
    
  return santizeString(name);
};
