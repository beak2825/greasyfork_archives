// ==UserScript==
// @name           AutoGrepolis
// @namespace      Dummbroesel.Grepolis
// @include        *grepolis.com/game/*
// @author         Dummbroesel
// @description    Grepolis automation
// @version        0.4
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/11952/AutoGrepolis.user.js
// @updateURL https://update.greasyfork.org/scripts/11952/AutoGrepolis.meta.js
// ==/UserScript==

document.__c = false;
document.__C = false;
document.__r = false;
document.__R = false;

document.claimInterval;
document.claimAllInterval;
document.raidInterval;
document.raidAllInterval;

//document.startedIslandName;
//document.startedTownId;
document.islandCount = 0;
//for later extension use of claim/raid at all isles&/towns
//document.islandCoords = {};
//document.islandTownList = {};
//document.islandList = [];

//document.claimIslandList = [];
//document.raidIslandList = [];

document.claimAll5MinutesInAllTowns = function() {
  console.log("Start claim in all towns!");
  $('a[name=farm_town_overview]').click();
  setTimeout("document.gatherInAllTowns(false)", 2000);
}

document.raidAll5MinutesInAllTowns = function() {
  console.log("Start raid in all towns!");
  $('a[name=farm_town_overview]').click();
  setTimeout("document.gatherInAllTowns(true)", 2000);
}

document.claimAll5Minutes = function() {
  console.log("Start claim farm!");
  $('a[name=farm_town_overview]').click();
  setTimeout("document.claimClick()" , 2000);
  setTimeout("document.closeFarmClick()" , 4000);
}

document.raidAll5Minutes = function() {
  console.log("Start raid Farms!");
  $('a[name=farm_town_overview]').click();
  setTimeout("document.raidClick()" , 1750);
  setTimeout("document.claimClick()" , 3000);
  setTimeout("document.closeFarmClick()" , 4000);
}

document.gatherInAllTowns = function(isRaid) {
  $('.ui-dialog-titlebar').each(function() {
    if($(this).text().indexOf("Bauerndörfer") >= 0)
    {
      var currentIslandList = [];
      var currentTownList = [];
      var currentIsland = {};
      var currentTown = {};
      
      var islandsAndTowns = $('#fto_town_list');
      islandsAndTowns.find('li').each(function () {
        var tEntry = $(this);
        if(!tEntry.hasClass('fto_town')) {
          if(currentIsland.Name && currentIsland.Name != tEntry.text()) {
            //currentIslandList.push(currentIsland);
            currentIsland = {};
            currentTownList = [];
          }
          currentIsland.Name = tEntry.text();
        } else {
          var coords = {x: tEntry.attr("data-island_x"), y: tEntry.attr("data-island_y")};
          //if(currentIsland.Coords && currentIsland.Coords == coords) {
          //  currentTownList.push(currentTown);
          //  currentTown = {};
          //}
          //else 
          currentIsland.Coords = coords;
          
          if(currentTown.Id && currentIsland.Id != tEntry.attr("data-town_id")) 
            currentTown = {};
          
          currentTown.Id = tEntry.attr("data-town_id");
          currentTown.Name = $(tEntry.find('.gp_town_link')[0]).text();
          currentTown.Clickable = tEntry;
          currentTownList.push(currentTown);
          
          currentIsland.TownList = currentTownList;
          currentIslandList.push(currentIsland);
        }
      });
     
      document.islandList = currentIslandList;
     
      var lCount=0;
      if(isRaid) {
        currentIslandList.forEach(function(lIsland) {
          setTimeout("document.switchAndRaidTown()", 4000*lCount);
          lCount=lCount+1;
        });
      } else {
        currentIslandList.forEach(function(lIsland) {
          setTimeout("document.switchAndClaimTown()", 4000*lCount);
          lCount=lCount+1;
        });
      }
      
      setTimeout("document.closeFarmClick()", 4000 * lCount + 2000);
    }
  })
}

document.switchAndClaimTown = function() {
  console.log(new Date() + document.islandCount.toString());
  document.islandList[document.islandCount].TownList[0].Clickable.click();
  setTimeout("document.claimClick()" , 2000);
  document.islandCount = (document.islandCount+1 == document.islandList.length) ? 0 : document.islandCount+1;
}

document.switchAndRaidTown = function() {
  console.log(new Date() + document.islandCount.toString());
  document.islandList[document.islandCount].TownList[0].Clickable.click();
  setTimeout("document.raidClick()" , 1650);
  setTimeout("document.claimClick()" , 3000);
  document.islandCount = (document.islandCount+1 == document.islandList.length) ? 0 : document.islandCount+1;
}


document.raidClick = function() {
  $('.ui-dialog-titlebar').each(function() {
    if($(this).text().indexOf("Bauerndörfer") >= 0)
      $(this).find('#fto_pillage').click();
  });
}

document.claimClick = function() {
  $('#fto_claim_button').click();
}

document.closeFarmClick = function() {
  $('.ui-dialog-titlebar').each(function() {
    if($(this).text().indexOf("Bauerndörfer") >= 0)
      $(this).find('.ui-dialog-titlebar-close').click();
  });
  console.log("End raid/claim farms!");
}

document.onkeypress = function(event) {
  if($('input[type=text], input.tagsinput-writebox, textarea').is(":focus")) return;
  var keyCode = (event.keyCode == 0)? event.charCode : event.keyCode;
  console.log(keyCode);
  if(keyCode == 99) { //c
    if (document.__c)  {
      clearInterval(document.claimInterval);
      document.__c = false;
      console.log("Claim deactivated!");
    } else {
      document.claimAll5Minutes();
      document.claimInterval = setInterval("document.claimAll5Minutes()",5*60*1010);
      document.__c = true;
      console.log("Claim activated!");
    }
  } else if (keyCode == 114) { // r
    if (document.__r)  {
      clearInterval(document.raidInterval);
      document.__r = false;
      console.log("Raid deactivated!");
    } else {
      document.raidAll5Minutes();
      document.raidInterval = setInterval("document.raidAll5Minutes()",5*60*1010);
      document.__r = true;
      console.log("Raid activated!");
    }
  } else if (keyCode == 67) { //C
    if(document.__F) {
      clearInterval(document.claimAllInterval);
      document.__F = false;
      console.log("Claim all towns deactivated!");
    } else {
      document.claimAll5MinutesInAllTowns();
      document.claimAllInterval = setInterval("document.claimAll5MinutesInAllTowns()",5*60*1010);
      document.__F = true;
      console.log("Claim all towns activated!");
    }
  } else if (keyCode == 82) { //R
    if(document.__R) {
      clearInterval(document.raidAllInterval);
      document.__R = false;
      console.log("Raid all towns deactivated!");
    } else {
      document.raidAll5MinutesInAllTowns();
      document.raidAllInterval = setInterval("document.raidAll5MinutesInAllTowns()",5*60*1010);
      document.__R = true;
      console.log("Raid all towns activated!");
    }
  }
}