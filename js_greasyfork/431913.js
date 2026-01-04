// ==UserScript==
// @name     Yahoo Team BorisChen
// @description This script adds a row to the team page in Yahoo Football Fantasy with the boris chen tier
// @version  1.7
// @grant         GM.xmlHttpRequest
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @require https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @require https://greasyfork.org/scripts/431916-borischentiers/code/BorisChenTiers.js?version=968460
// @include https://football.fantasysports.yahoo.com/f1/*/*/team*
// @include /^https?:\/\/football\.fantasysports\.yahoo\.com\/f1\/.*\/[0-9][0-9]?/
// @include https://football.fantasysports.yahoo.com/f1/*/players*
// @namespace https://greasyfork.org/users/812226
// @downloadURL https://update.greasyfork.org/scripts/431913/Yahoo%20Team%20BorisChen.user.js
// @updateURL https://update.greasyfork.org/scripts/431913/Yahoo%20Team%20BorisChen.meta.js
// ==/UserScript==

(async () => {  
  const tierMap = await generateTiers(scoring.Standard, teamNames.yahoo);
   
  updateRows(tierMap);
})();

const updateRows = (tierMap) => {
  waitForKeyElements (
    "#statTable0", 
    (jNode) => {
      addHeader(jNode);
      appendDataToTable(jNode, tierMap, false);
    }
  );  
  waitForKeyElements (
    "#statTable1",
    (jNode) => {
      appendDataToTable(jNode, tierMap, true);
    }
  );
  waitForKeyElements (
    "#statTable2",
    (jNode) => {
      appendDataToTable(jNode, tierMap, true);
    }
  );
  waitForKeyElements (
    "#players-table",
    (jNode) => {
      addHeader(jNode);
      appendDataToTable(jNode, tierMap, false);
    }
  );
}

const addHeader = (jNode) => {
  const rows = jNode.children().find('tr');
    
  let rowToInsert = 1;
  
  if ($(rows.get(0)).children().get(1).className.includes('Js-hidden')) {
    rowToInsert = 2;
  }
  
  $($($(rows.get(1)).children()).eq(rowToInsert)).after(createYahooStyledHeaderWithSelect('BorisChen Tier'));
  $('#Tier-ScoringSelect').on('change', async function() {
    const tierMap = await generateTiers(scoring[this.value], teamNames.yahoo);
    
    appendDataToTable($("#statTable0"), tierMap, false);
    appendDataToTable($("#players-table"), tierMap, false);
  });
}

const appendDataToTable = (jNode, data, addHeader) => {  
  const rows = jNode.children().find('tr');
      
  let rowToInsert = 1;
      
  rows.each((index, obj) => {
    if (index == 0) {
      
    } else if (index == 1) {
      if ($(obj).children().get(1).className.includes('Js-hidden')) {
      	rowToInsert = 2; 
      }
      
      if (addHeader) {
      	$($($(obj).children()).eq(rowToInsert)).after(createYahooStyledHeader('BorisChen Tier'));        
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
        $($($(obj).children()).eq(rowToInsert)).after(createTierCol(tier));
      }
    }
  });
};

const createYahooStyledHeaderWithSelect = (title) => {
 return `<th class="ys-stat Hy(m)" title="${title}">
					<div class="ys-stat Whs-nw T-0 Pos-a P-4">
						${title}
						<br/>
						<select name="Tier-ScoringSelect" id="Tier-ScoringSelect">
              <option value="Standard">Std</option>
              <option value="PPR">PPR</option>
              <option value="Half">Half</option>
            </select>
					</div>
				</th>`
};

const createYahooStyledHeader = (title) => {
 return `<th class="ys-stat Hy(m)" title="${title}">
					<div class="ys-stat Whs-nw T-0 Pos-a P-4">
						${title}
					</div>
				</th>`
};

const createTierCol = (tier) => {
	return `<td id="BorisChenTier"
							class="Alt Ta-c Bdrstart">
						${tier}
					</td>`; 
};

const getName = (jQueryNode) => {  
  const nameCol = $($(jQueryNode).find('.player'));
	const nameRow = $(nameCol.find('.ysf-player-name'));
  const name = $(nameRow.children().get(0)).text();
    
  return santizeString(name);
};
