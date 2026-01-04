// ==UserScript==
// @name         MouseHunt - Floting Islands Priority Calculator ++
// @author       MCS;Aaron;Tran Situ (tsitu)
// @namespace    https://greasyfork.org/zh-CN/users/164491-mirrorcubesquare
// @version      0.0.8
// @description  Floting Islands Priority Calculator
// @grant        GM_addStyle
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @downloadURL https://update.greasyfork.org/scripts/411572/MouseHunt%20-%20Floting%20Islands%20Priority%20Calculator%20%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/411572/MouseHunt%20-%20Floting%20Islands%20Priority%20Calculator%20%2B%2B.meta.js
// ==/UserScript==

const synergy_LAI=1.5;
const synergy_HAI=2.5;
const synergy_lootCache=1.1;

const IslandStatusDefault=
          {
              Arcane:[],
              Forgotten:[],
              Hydro:[],
              Shadow:[],
              Draconic:[],
              Law:[],
              Tactical:[],
              Physical:[]
          };
const IslandIndexDefault=
          {
              Arcane:[0,1,2,3],
              Forgotten:[4,5,6,7],
              Hydro:[8,9,10,11],
              Shadow:[12,13,14,15],
              Draconic:[12,8,4,0],
              Law:[13,9,5,1],
              Physical:[14,10,6,2],
              Tactical:[15,11,7,3]
          };
    const LAI_Index=
          {
              'sky_cheese':[1.6,1.3,1.2,1.1],
              'gem_bonus':[2,1.4,1.3,1.1],
              'empty_sky':[1,1,1,1],
              'ore_bonus':[2,1.4,1.3,1.1],
              'paragon_cache':[7,3,2,1.5],
              'shrine':[100,20,8,4],
              'pirate':[3,3,3,3],
              'loot_cache':[3,2.5,2,1.9]
          };
        const HAI_Index=
          {
              'sky_cheese':[2.2,2,1.5,1.5],
              'gem_bonus':[2.7,2.6,2.5,2.4],
              'empty_sky':[1,1,1,1],
              'ore_bonus':[2.7,2.6,2.5,2.4],
              'paragon_cache':[1.03,1.02,1.01,1],
              'shrine':[1.03,1.02,1.01,1],
              'pirate':[3,3,3,3],
              'loot_cache':[6,5.95,5.9,5.85]
          };
const target_test=['sky_cheese','empty_sky','shrine','gem_bonus'];
function CalculateIndex(target,is_high_altitude)
{
    var result=1;
    var synergy=is_high_altitude?synergy_HAI:synergy_LAI;
    var gem_bonus_count=0;
    var ore_bonus_count=0;
    var shrine_count =0;
	var loot_cache_count=0;
    var pirate_count =0;
    if (target.length<4)return -1;
    var index=is_high_altitude?HAI_Index:LAI_Index;
    for(var i=0;i<4;i++)
    {
        if(target[i]=='gem_bonus')gem_bonus_count++;
        if(target[i]=='ore_bonus')ore_bonus_count++;
        if(target[i]=='loot_cache')loot_cache_count++;
        if(target[i]=='pirate')pirate_count++;
        if(target[i]=='shrine')shrine_count++;
        result=result*index[target[i]][i];
    }
    result=Math.sqrt(result*(Math.max(1,Math.pow(synergy,Math.max(pirate_count+loot_cache_count*synergy_lootCache,gem_bonus_count+loot_cache_count*synergy_lootCache,ore_bonus_count+loot_cache_count*synergy_lootCache)-1))));
    return result*shrine_count;
}
function Render(islandStatus)
{
    console.log(islandStatus)
    for (var powerType in islandStatus)
    {
        if(islandStatus[powerType].length==5)
        {
        var target=document.querySelector("."+powerType.toLowerCase());
        if(target.title.indexOf(" Score")<0)
        {
        target.title=target.title+" Score:"+islandStatus[powerType][4].toPrecision(4);
        }
        else
        {
        target.title=target.title.substring(0,target.title.indexOf(" Score"))+" Score:"+islandStatus[powerType][4].toPrecision(4);
        }
        }
    }
    // Best island code
    var best = [null, 0]
    for (powerType in islandStatus)
    {
        if (islandStatus[powerType][4] >= best[1]){
            best[0] = powerType
            best[1] = islandStatus[powerType][4]
        }
    }
    console.log("best island is: " + best[0])
    var enabled = false
    if ((best[0] == "Forgotten" || best[1] <= 10) && user.enviroment_atts.hunting_site_atts.is_high_altitude && user.enviroment_atts.items.sky_scrambler_stat_item.quantity >= 1 && enabled){
        console.log("rerolling");
        hg.views.FloatingIslandsAdventureBoardView.randomizeAdventureBoard()
        rerun();
        return;
    }
    var go_button = true
    if (go_button && user.quests.QuestFloatingIslands.hunting_site_atts.sky_wardens_caught != 4) {
        console.log("launching")
        launch(best[0])
    }
}

function launch(power_type,callback) {
	var power_dict = {"Arcane": "arcn", "Forgotten": "frgttn", "Hydro": "hdr", "Shadow": "shdw", "Draconic": "drcnc", "Law": "law", "Physical": "phscl", "Tactical": "tctcl"}
        $.post(
            "https://www.mousehuntgame.com/managers/ajax/environment/floating_islands.php",
            {
                sn: 'Hitgrab',
                hg_is_ajax: 1,
				action: 'launch',
				power_type: power_dict[power_type],
                use_saved_trap_setup: 1,
				last_read_journal_entry_id: lastReadJournalEntryId,
				uh: user.unique_hash,
            },
            null,
            "json"
        ).done(callback);
            window.setTimeout(function () {
            location.reload()
        }, 2000);
    }


(function () {
 console.log("FI Calculator Start");


   // var test_calculate=CalculateIndex(target_test,false);
  const originalOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function () {
    this.addEventListener("load", function () {
        var islandStatus_Raw=[];
    var is_high_altitude=user.quests.QuestFloatingIslands.hunting_site_atts.is_high_altitude;
        //console.log(this.responseURL);
        var islandStatus= {
              Arcane:[],
              Forgotten:[],
              Hydro:[],
              Shadow:[],
              Draconic:[],
              Law:[],
              Tactical:[],
              Physical:[]
          };
      if (
        this.responseURL ===
        "https://www.mousehuntgame.com/managers/ajax/environment/floating_islands.php"
      ) {
        let data;
        try {
          data = JSON.parse(this.responseText).adventure_board.grid;
          if (data && data.length == 16) {
           console.log("Retrived Correct Data from floating_islands.php");
           console.log(data);
           for(var i=0;i<data.length;i++)
           {
               var temp=data[i].type;
               if(temp.indexOf("paragon_cache")>-1)temp="paragon_cache";
               if(temp.indexOf("shrine")>-1)temp="shrine";
			   if(temp.indexOf("pirate")>-1)temp="pirate";//Experimental,Waiting for correct type
               islandStatus_Raw.push(temp);
           }
              console.log("Memorize Complete");
              for (var powerType in islandStatus)
              {
                  for (var j=0;j<4;j++)
                  {
                      //IslandIndexDefault
                      islandStatus[powerType].push(islandStatus_Raw[IslandIndexDefault[powerType][j]]);
                  }
                  islandStatus[powerType].push(CalculateIndex(islandStatus[powerType],is_high_altitude));
              }
              console.log(JSON.stringify(islandStatus));
              Render(islandStatus);
        }
		}
		catch (error) {
          console.log(
            "Failed to process server response for floating_islands.php"
          );
          console.error(error.stack);
        }
      }
    });
    originalOpen.apply(this, arguments);
  };})();