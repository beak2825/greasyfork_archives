// ==UserScript==
// @name         Action Scraper
// @namespace    https://www.gatesofsurvival.com
// @version      0.2
// @description  try to take over the world!
// @author       Opal
// @match        https://www.gatesofsurvival.com/game/online.php
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/31091/Action%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/31091/Action%20Scraper.meta.js
// ==/UserScript==

$("Document").ready(function(){
class Player {
	constructor(clan, name, action, active) {
	this.guild = clan;
  this.name = name;
  this.action = action;
  this.active = active;
  }
}
class Clan {
	constructor(name) {
	this.name = name;
  this.memberList=[];
  }
  addMember(member){
  this.memberList.push(member);
  }
  findSkillingTotals(){
      var Skills = {
          Agility: 0,
          Alchemy: 0,
          Arcane: 0,
          Archery: 0,
          Cooking: 0,
          Crafting: 0,
          Divination: 0,
          Exploration: 0,
          Fighting: 0,
          Forging: 0,
          Forestry: 0,
          Firemaking: 0,
          Fishing: 0,
          Gathering: 0,
          Jewelcrafting: 0,
          Looting: 0,
          Luck: 0,
          Mining: 0,
          Prayer: 0,
          Runebinding: 0,
          Slayer: 0,
          Smelting: 0,
          Spellcraft: 0,
          Woodcarving: 0
      };
      var currentAction;
      for (var i = 0; i < this.memberList.length;i++){
          currentAction = this.memberList[i].action;
          if(currentAction in Skills){
              Skills[currentAction]++;
          }
          else{
              Skills[currentAction] = 1;
          }
      }
      this.Skills = Skills;
      return Skills;
  }
}
clanList = [];
var noClan = new Clan("none");
var everyone = new Clan("Total");
clanList.push(everyone,noClan);//Total must always be index 0 in this list!
var skillsChecker = /(Agility)|(Alchemy)|(Arcane)|(Archery)|(Cooking)|(Crafting)|(Divination)|(Exploration)|(Fighting)|(Forging)|(Forestry)|(Firemaking)|(Fishing)|(Gathering)|(Jewelcrafting)|(Looting)|(Luck)|(Mining)|(Prayer)|(Runebinding)|(Slayer)|(Smelting)|(Spellcraft)|(Woodcarving)/;
var clan;
var name;
var action;
var active;
var mytext;
var playerEntries = $("td");
var textNodes;
var clanRegex = /\[.+\]/;
var nameRegex = /\w+(?=$)/;
var assigned = 0;
var clancounter = 0;
var secondcounterforsomereason = 0;
$.each(playerEntries, function(index, value){
    clan = "unknown clan";
    name = "unknown name";
    action = "undetermined";
    active = "unknown";
    textNodes = $(value).contents();
    $.each(textNodes, function(index, value){
        assigned = 0;
        clancounter = 0;
        if (value.nodeName === "FORM" ){
            mytext = value.innerText;
            if (mytext.includes("Clan")){
                if(clanRegex.exec(mytext) !== null){
                    clan = clanRegex.exec(mytext)[0];}
            }
            else{
                clan = "none";
            }
            if(nameRegex.exec(mytext) !== null){
                name = nameRegex.exec(mytext)[0];}
        }
        if (value.nodeType === 3 && value.textContent !="\n" && value.textContent !=" \n"){
            var nodetext = value.textContent;
            if(nodetext.includes("Training") || nodetext.includes("Fighting")|| nodetext.includes("Traveling")|| nodetext.includes("Viewing")|| nodetext.includes("Resting")){
                var matchedSkill = skillsChecker.exec(nodetext);
                if (matchedSkill !== null){
                action = matchedSkill[0];}
            }
            if (nodetext.includes("Active") ){
                active = nodetext.replace(/\n|\(|\)|(Last Active:)/gi,"");
            }
        }
        nextPlayer = new Player(clan, name, action, active);

    });
    while(!assigned){

        if (clanList[clancounter].name == nextPlayer.guild){
            clanList[clancounter].addMember(nextPlayer);
            assigned = 1;
        }
        else if(clancounter >= clanList.length-1){
            addClan = new Clan(nextPlayer.guild);
            addClan.addMember(nextPlayer);
            clanList.push(addClan);
            assigned = 1;
        }
        clancounter++;
    }
    clanList[0].addMember(nextPlayer); //everyone gets added to Total

});
    function getMemberAsTableRow(member){

        var entry = "<td>" + member.name + "</td><td>" + member.action + "</td><td>" + member.active + "</td>";
        return "<tr>" + entry + "</tr>";
    }
    var activityByIndividual = "<table>";
    for (var i = 1; i < clanList.length; i++){ //this will exclude the public "Total" clan.
        activityByIndividual += "<tr><td colspan = \"3\" align = \"center\"><b>"+  clanList[i].name + "</b></td></tr>";
        for (var j = 0; j< clanList[i].memberList.length; j++){
            activityByIndividual += getMemberAsTableRow(clanList[i].memberList[j]);
        }
    }
    var clanskill;
    //this is really dirty but hey it's quick and easy way to get a row of skill names... i just put it in a bad place i guess.
    clanskill = clanList[0].findSkillingTotals();
    var skillSummary = "<table><tr><td>Clan</td>";
    for (var s in clanskill){
        skillSummary += "<td>"+s+"</td>";
    }
    skillSummary+="</tr>";
    //and now back to your regularly scheduled programming
    for(var c= clanList.length-1; c>=0; c--){ //goes backwards so Total clan is last.
        console.log(c);
        clanskill = clanList[c].findSkillingTotals();
        skillSummary += "<tr><td>"+clanList[c].name+"</td>";
        for(var skill in clanskill){
            skillSummary += "<td>"+clanskill[skill]+"</td>";
        }
        skillSummary+="</tr>";
    }
    skillSummary+="</table>";
    $("body").html(activityByIndividual + "</table><br>"+skillSummary);
    console.log(clanList[0].findSkillingTotals());
});
