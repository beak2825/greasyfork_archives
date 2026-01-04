// ==UserScript==
// @name     ESPN BorisChenTiers
// @description This script adds a row to the team and player page in ESPN Football Fantasy website with the boris chen tier
// @version  1.1
// @grant         GM.xmlHttpRequest
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @require https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js?version=209282
// @require https://greasyfork.org/scripts/431916-borischentiers/code/BorisChenTiers.js?version=968460
// @include https://fantasy.espn.com/football/team?leagueId=*&teamId=*
// @include https://fantasy.espn.com/football/players/add?leagueId=*
// @namespace https://greasyfork.org/users/812226
// @downloadURL https://update.greasyfork.org/scripts/432079/ESPN%20BorisChenTiers.user.js
// @updateURL https://update.greasyfork.org/scripts/432079/ESPN%20BorisChenTiers.meta.js
// ==/UserScript==

(async () => {  
  const tierMap = await generateTiers(scoring.Standard,teamNames.espn);
  
  console.log(tierMap);

  waitForKeyElements (
    ".players-table", 
    (jNode) => {
      appendDataToTable(jNode, tierMap, true);
      addSelect();
    }
  ); 
})();

const addSelect = () => {
  if (document.URL.includes('players')) {
    $($(".playersTableControls").children().get(1)).children().append(createSelect());
  } else {
    $(".playersTableControls").children().append(createSelect());
  }
  
  $('#Tier-ScoringSelect').on('change', async function() {
    const tierMap = await generateTiers(scoring[this.value], teamNames.espn);

    appendDataToTable($(".players-table"), tierMap, false);
  });
}

const appendDataToTable = (jNode, data, addHeader) => {  
  const rows = jNode.children().find('tr');
    
  const insertAt = document.URL.includes('players') ? 0 : 1;
    
  
  rows.each((index, obj) => {
    if (index == 0) {
      $($(obj).children().get(1)).attr('colspan', 3);
    } else if (index == 1) {
      if (addHeader) {
				$($($(obj).children()).eq(insertAt)).after(createESPNStyledHeader('BorisChen <br/> Tier'));
      
      }
    } else {
      let tier = '-';
      const name = getName(obj);
      
      if (name !== undefined) {
        if (data[name] !== null && data[name] !== undefined) {
          tier = data[name] + 1;
        } else {
          console.log("could not match this player: " + name);
        }

        if ($(obj).find("#BorisChenTier").length > 0) {
          $(obj).find("#BorisChenTier").text(tier);
        } else {
          $($($(obj).children()).eq(insertAt)).after(createTierCol(tier));
        }
      }
    }
  });
};

const createSelect = () => {
  return `<div class="jsx-809230509 stats_split_select" style="padding-left: 20px">
    <div class="Dropdown__Wrapper di nowrap">
      <div class="Dropdown__Label n8 di mr3">
        BorisChen Tiers Scoring
       </div>
  		<div class="dropdown">
      	<svg aria-hidden="true" class="dropdown__arrow icon__svg" viewBox="0 0 24 24">
        	<use xlink:href="#icon__caret__down">
        	</use>
  			</svg>
  			<select id="Tier-ScoringSelect" class="dropdown__select" style="text-overflow: ellipsis; overflow: hidden; width: 100%;" name="1631051433931::e050000::aaa5ae95:8084:6f31:d2e9:171201276870">
          <option value="Standard">Std</option>
  				<option value="PPR">PPR</option>
  				<option value="Half">Half</option>
      	</select>
  		</div>
  	</div>
  </div>`
}

const createESPNStyledHeader = (title) => {
 return `<th class="BorisChenTierHeader Table__TH" style="text-align: center !important">
          ${title}
				</th>`
};


const createTierCol = (tier) => {
	return `<td class="Table__TD">
						<div class="table--cell total tar" style="text-align: center !important" id="BorisChenTier">
							${tier}
						</div>
					</td>`; 
};

const getName = (jQueryNode) => { 
  let name = $($(jQueryNode).find('.player__column')).attr('title');
    
  if (name === undefined) return name;
  
  if (name.includes("D/ST")) {
		name = name.replace(" D/ST", '');
  }
    
  return santizeString(name);
};
