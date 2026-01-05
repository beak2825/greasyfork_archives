// ==UserScript==
// @name        Percentile Ranges
// @namespace   E-Hentai
// @author      Superlatanium
// @version     1.9.8
// @include     https://hentaiverse.org/pages/showequip.php*
// @include     https://hentaiverse.org/equip/*
// @description 111111111
// @downloadURL https://update.greasyfork.org/scripts/28528/Percentile%20Ranges.user.js
// @updateURL https://update.greasyfork.org/scripts/28528/Percentile%20Ranges.meta.js
// ==/UserScript==

//Updated Jun 28 2017

document.body.appendChild(document.createElement('br'));
var div = document.body.appendChild(document.createElement('div'));
div.textContent = 'Checking...';
var item = parseEquip(document.body, {});
div.textContent = item.info + (item.badinfo ? ' ' + item.badinfo : '');

function parseEquip(data, item){
    var ranges = [
        ['ADB', 67.83, 75.92, ['axe', 'slaughter']],
        ['ADB', 54.16, 59.87, ['axe'], ['slaughter']],
        ['ADB', 59.21, 67.72, ['club', 'slaughter']],
        ['ADB', 45.36, 53.04, ['club'], ['slaughter']],
        ['ADB', 42.8, 51.33, ['rapier', 'slaughter']],
        ['ADB', 31.95, 39.38, ['rapier'], ['slaughter']],
        ['Parry', 23.81, 26.94, ['rapier', 'nimble']],
        ['Parry', 16.3, 18.89, ['rapier'], ['nimble']],
        ['ADB', 53.41, 61.58, ['shortsword', 'slaughter']],
        ['ADB', 41.26, 47.92, ['shortsword'], ['slaughter']],
        ['ADB', 39.84, 46.21, ['wakizashi', 'slaughter']],
        ['ADB', 30.49, 35.11, ['wakizashi'], ['slaughter']],
        ['Parry', 27.67, 30.53, ['wakizashi', 'nimble']],
        ['Parry', 19.97, 22.48, ['wakizashi'], ['nimble']],

        ['ADB', 73.29, 82.07, ['estoc', 'slaughter']],
        ['ADB', 58.13, 64.99, ['estoc'], ['slaughter']],
        ['ADB', 86.45, 98.47, ['longsword', 'slaughter']],
        ['ADB', 68.94, 78.66, ['longsword'], ['slaughter']],
        ['ADB', 73.38, 82.07, ['mace', 'slaughter']],
        ['ADB', 58.09, 64.99, ['mace'], ['slaughter']],
        ['ADB', 72.61, 82.07, ['katana', 'slaughter']],
        ['ADB', 57.39, 64.99, ['katana'], ['slaughter']],

        ['MDB', 46.07, 52.2, ['katalox', 'destruction']],
        ['MDB', 28.09, 32.4, ['katalox'], ['destruction']],
        ['MDB', 45.95, 51.71, ['redwood', 'destruction']],
        ['MDB', 27.76, 31.99, ['redwood'], ['destruction']],
        ['MDB', 44.93, 51.71, ['willow', 'destruction']],
        ['MDB', 27.76, 31.99, ['willow'], ['destruction']],
        ['MDB', 27.94, 31.99, ['oak']],

        ['EDB', 33.92, 37.84, ['hallowed katalox', 'heimdall']],
        ['EDB', 19.05, 21.76, ['hallowed katalox'], ['heimdall']],
        ['EDB', 33.92, 37.84, ['demonic katalox', 'fenrir']],
        ['EDB', 19.05, 21.76, ['demonic katalox'], ['fenrir']],
        ['DProf', 14.41, 16.24, ['hallowed katalox', 'heaven-sent']],
        ['DProf', 7.1, 8.29, ['hallowed katalox'], ['heaven-sent']],
        ['FProf', 14.43, 16.24, ['demonic katalox', 'demon-fiend']],
        ['FProf', 7.16, 8.29, ['demonic katalox'], ['demon-fiend']],

        ['EDB', 38.11, 42.68, ['hallowed oak', 'heimdall']],
        ['EDB', 23.01, 26.6, ['hallowed oak'], ['heimdall']],
        ['DProf', 5.58, 6.45, ['hallowed oak']],
        ['EProf', 5.6, 6.45, ['fiery oak']],
        ['EProf', 5.6, 6.45, ['arctic oak']],

        ['EDB', 34.42, 37.4, ['tempestuous redwood', 'freyr']],
        ['EDB', 18.97, 21.78, ['tempestuous redwood'], ['freyr']],
        ['EDB', 34.42, 37.4, ['shocking redwood', 'mjolnir']],
        ['EDB', 18.97, 21.78, ['shocking redwood'], ['mjolnir']],
        ['EDB', 34.42, 37.4, ['arctic redwood', 'niflheim']],
        ['EDB', 18.97, 21.78, ['arctic redwood'], ['niflheim']],
        ['EDB', 34.42, 37.4, ['fiery redwood', 'surtr']],
        ['EDB', 18.97, 21.78, ['fiery redwood'], ['surtr']],
        ['EProf', 14.29, 16.24, ['redwood', 'elementalist']],
        ['EProf', 7.19, 8.29, ['redwood'], ['elementalist']],

        ['EDB', 16.41, 18.56, ['tempestuous willow']],
        ['EDB', 16.41, 18.56, ['shocking willow']],
        ['EDB', 22.92, 26.6, ['demonic willow']],
        ['EDB', 10.28, 11.33, ['fiery willow']],
        ['EDB', 10.28, 11.33, ['arctic willow']],
        ['EDB', 10.28, 11.33, ['hallowed willow']],
        ['EProf', 5.26, 6.15, ['tempestuous willow']],
        ['EProf', 5.26, 6.15, ['shocking willow']],
        ['FProf', 5.26, 6.15, ['demonic willow']],
        ['EProf', 5.26, 6.15, ['fiery willow']],
        ['EProf', 5.26, 6.15, ['arctic willow']],

        ['Int', 6.12, 7.22, ['katalox']],
        ['Wis', 4.13, 4.82, ['katalox']],
        ['Int', 5.46, 6.33, ['redwood']],
        ['Wis', 5.46, 6.33, ['redwood']],
        ['Int', 4.13, 4.83, ['willow']],
        ['Wis', 6.12, 7.23, ['willow']],
        ['Int', 4.14, 4.83, ['oak']],
        ['Wis', 6, 7.23, ['oak']],

        ['BLK', 33.43, 37.52, ['buckler', 'barrier']],
        ['BLK', 27.67, 31.03, ['buckler'], ['barrier']],
        ['BLK', 32.63, 36.02, ['kite']],
        ['BLK', 35.64, 38.52, [' force']],

        ['EDB', 15.12, 16.97, ['phase cap']],
        ['MDB', 3.74, 4.23, ['radiant phase cap'] , ,0.2185],
        ['Int', 6, 7.08, ['phase cap']],
        ['Wis', 6, 7.08, ['phase cap']],
        ['Agi', 5.07, 6.03, ['phase cap']],
        ['Evd', 4.7, 5.28, ['phase cap']],
        ['Pmit', 3.01, 3.38, ['phase cap']],
        ['CS', 2.99, 3.47, ['phase cap', 'charged']],

        ['EDB', 18.02, 20.18, ['phase robe']],
        ['MDB', 4.34, 4.90, ['radiant phase robe'] , ,0.227],
        ['Int', 7.14, 8.43, ['phase robe']],
        ['Wis', 7.14, 8.43, ['phase robe']],
        ['Agi', 6.03, 7.17, ['phase robe']],
        ['Evd', 5.6, 6.28, ['phase robe']],
        ['Pmit', 3.57, 4.01, ['phase robe']],
        ['CS', 3.48, 4.06, ['phase robe', 'charged']],

        ['EDB', 13.66, 15.36, ['phase gloves']],
        ['MDB', 3.42, 3.90, ['radiant phase gloves'] , ,0.215],
        ['Int', 5.43, 6.42, ['phase gloves']],
        ['Wis', 5.43, 6.42, ['phase gloves']],
        ['Agi', 4.59, 5.46, ['phase gloves']],
        ['Evd', 4.25, 4.78, ['phase gloves']],
        ['Pmit', 2.73, 3.07, ['phase gloves']],
        ['CS', 2.75, 3.18, ['phase gloves', 'charged']],

        ['EDB', 16.58, 18.58, ['phase pants']],
        ['MDB', 3.92, 4.56, ['radiant phase pants'] , ,0.222],
        ['Int', 6.57, 7.77, ['phase pants']],
        ['Wis', 6.57, 7.77, ['phase pants']],
        ['Agi', 5.55, 6.6, ['phase pants']],
        ['Evd', 5.15, 5.78, ['phase pants']],
        ['Pmit', 3.28, 3.7, ['phase pants']],
        ['CS', 3.23, 3.77, ['phase pants', 'charged']],

        ['EDB', 12.23, 13.75, ['phase shoes']],
        ['MDB', 3.24, 3.57, ['radiant phase shoes'] , ,0.206],
        ['Int', 4.86, 5.73, ['phase shoes']],
        ['Wis', 4.86, 5.73, ['phase shoes']],
        ['Agi', 4.11, 4.89, ['phase shoes']],
        ['Evd', 3.8, 4.28, ['phase shoes']],
        ['Pmit', 2.44, 2.75, ['phase shoes']],
        ['CS', 2.51, 2.89, ['phase shoes', 'charged']],

        ['DProf', 7.38, 8.29, ['cotton cap', 'heaven-sent']],
        ['DProf', 8.79, 9.89, ['cotton robe', 'heaven-sent']],
        ['DProf', 6.68, 7.5, ['cotton gloves', 'heaven-sent']],
        ['DProf', 8.08, 9.09, ['cotton pants', 'heaven-sent']],
        ['DProf', 5.97, 6.7, ['cotton shoes', 'heaven-sent']],

        ['EProf', 7.38, 8.29, ['cotton cap', 'elementalist']],
        ['EProf', 8.79, 9.89, ['cotton robe', 'elementalist']],
        ['EProf', 6.68, 7.5, ['cotton gloves', 'elementalist']],
        ['EProf', 8.08, 9.09, ['cotton pants', 'elementalist']],
        ['EProf', 5.97, 6.7, ['cotton shoes', 'elementalist']],

        ['FProf', 7.38, 8.29, ['cotton cap', 'demon-fiend']],
        ['FProf', 8.79, 9.89, ['cotton robe', 'demon-fiend']],
        ['FProf', 6.68, 7.5, ['cotton gloves', 'demon-fiend']],
        ['FProf', 8.08, 9.09, ['cotton pants', 'demon-fiend']],
        ['FProf', 5.97, 6.7, ['cotton shoes', 'demon-fiend']],

        ['Int', 5.31, 6.33, ['cotton cap']],
        ['Wis', 5.31, 6.33, ['cotton cap']],
        ['Agi', 4.08, 4.83, ['cotton cap']],
        ['Evd', 3.45, 4.03, ['cotton cap']],
        ['Pmit', 3.95, 4.43, ['cotton cap'], ['protection']],
        ['CS', 3.04, 3.47, ['cotton cap', 'charged']],

        ['Int', 6.3, 7.53, ['cotton robe']],
        ['Wis', 6.3, 7.53, ['cotton robe']],
        ['Agi', 4.83, 5.73, ['cotton robe']],
        ['Evd', 4.11, 4.78, ['cotton robe']],
        ['Pmit', 4.71, 5.27, ['cotton robe'], ['protection']],
        ['CS', 3.49, 4.06, ['cotton robe', 'charged']],

        ['Int', 4.8, 5.73, ['cotton gloves']],
        ['Wis', 4.8, 5.73, ['cotton gloves']],
        ['Agi', 3.69, 4.38, ['cotton gloves']],
        ['Evd', 3.13, 3.65, ['cotton gloves']],
        ['Pmit', 3.57, 4.01, ['cotton gloves'], ['protection']],
        ['CS', 2.75, 3.18, ['cotton gloves', 'charged']],

        ['Int', 5.82, 6.93, ['cotton pants']],
        ['Wis', 5.82, 6.93, ['cotton pants']],
        ['Agi', 4.47, 5.28, ['cotton pants']],
        ['Evd', 3.78, 4.4, ['cotton pants']],
        ['Pmit', 4.33, 4.85, ['cotton pants'], ['protection']],
        ['CS', 3.29, 3.77, ['cotton pants', 'charged']],

        ['Int', 4.32, 5.13, ['cotton shoes']],
        ['Wis', 4.32, 5.13, ['cotton shoes']],
        ['Agi', 3.33, 3.93, ['cotton shoes']],
        ['Evd', 2.8, 3.28, ['cotton shoes']],
        ['Pmit', 3.19, 3.59, ['cotton shoes'], ['protection']],
        ['CS', 2.5, 2.85, ['cotton shoes', 'charged']],

        ['ADB', 9.37, 11.25, ['shade helmet']],
        ['ADB', 11.09, 13.3, ['shade breastplate']],
        ['ADB', 8.53, 10.22, ['shade gauntlets']],
        ['ADB', 10.23, 12.28, ['shade leggings']],
        ['ADB', 7.67, 9.2, ['shade boots']],

        ['BLK', 5.2, 6.09, ['shielding plate helmet']],
        ['BLK', 6.03, 7.09, ['shielding plate cuirass']],
        ['BLK', 4.81, 5.43, ['shielding plate gauntlets']],
        ['BLK', 5.61, 6.59, ['shielding plate greaves']],
        ['BLK', 4.41, 5.09, ['shielding plate sabatons']],

        ['ADB', 21.89, 25.73, ['power helmet', 'slaughter']],
        ['ADB', 13.18, 18.04, ['power helmet'], ['slaughter']],
        ['ADB', 25.4, 30.68, ['power armor', 'slaughter']],
        ['ADB', 15.42, 21.46, ['power armor'], ['slaughter']],
        ['ADB', 20.02, 23.25, ['power gauntlets', 'slaughter']],
        ['ADB', 11.82, 16.33, ['power gauntlets'], ['slaughter']],
        ['ADB', 23.94, 28.2, ['power leggings', 'slaughter']],
        ['ADB', 14.22, 19.75, ['power leggings'], ['slaughter']],
        ['ADB', 17.3, 20.77, ['power boots', 'slaughter']],
        ['ADB', 11, 14.63, ['power boots'], ['slaughter']]
  ];
  function getName(body){
    var nameDiv;
    if (typeof body.children[1] == 'undefined')
      return 'No such item';
    var showequip = body.children[1];
    if (showequip.children.length == 3)
      nameDiv = showequip.children[0].children[0];
    else
      nameDiv = showequip.children[1].children[0];
    var name = nameDiv.children[0].textContent;
    if (nameDiv.children.length == 3)
      name += ' ' + nameDiv.children[2].textContent;
    return name;
  }


  item.name = getName(data);
  if (item.name == 'No such item'){
    item.level = 'No such item';
    return item;
  }
  var dataText = data.innerHTML;
  if (/Soulbound/.test(dataText))
    item.level = 'Soulbound';
  else
    item.level = dataText.match(/Level\s([^\s]+)/)[1];
  item.info = item.level;
  if (/(Shield\s)|(Buckler)/.test(item.name)){
    item.info += ',';
    if (/Strength/.test(dataText))
      item.info += ' Str';
    if (/Dexterity/.test(dataText))
      item.info += ' Dex';
    if (/Endurance/.test(dataText))
      item.info += ' End';
    if (/Agility/.test(dataText))
      item.info += ' Agi';
  }
  item.badinfo = '';
  
  function getPxp0(pxpN, n){
    var pxp0Est = 300;
    for (var i = 1; i < 15; i++){
      var sumPxpNextLevel = 1000*(Math.pow(1+pxp0Est/1000, n + 1) - 1);
      var sumPxpThisLevel = 1000*(Math.pow(1+pxp0Est/1000, n) - 1);
      var estimate = sumPxpNextLevel - sumPxpThisLevel;
      if (estimate > pxpN)
        pxp0Est -= 300 / Math.pow(2, i);
      else
        pxp0Est += 300 / Math.pow(2, i);
    }
    return Math.round(pxp0Est);
  }
  
  var pxp0;
  var potencyStr = dataText.match(/Potency\sTier:\s([^\)]+\))/)[1];
  if (potencyStr == '10 (MAX)'){
    item.info += ', IW 10';
    if (/Peerless/.test(item.name))
      pxp0 = 400;
    else if (/Legendary/.test(item.name))
      pxp0 = 357;
    else if (/Magnificent/.test(item.name))
      pxp0 = 326;
    else
      pxp0 = 280; //too low to matter
  } else if (potencyStr[0] != '0'){
    pxp0 = getPxp0(parseInt(potencyStr.match(/\d+(?=\))/)[0]), parseInt(potencyStr[0]));
    item.info += ', IW ' + potencyStr[0];
  } else
    pxp0 = parseInt(potencyStr.match(/(\d+)\)/)[1]);
  
  // statNames: [abbreviated name, forging name, html name, base multiplier, level scaling factor]
  var statNames = [['ADB', 'Physical Damage', 'Attack Damage', 0.0854, 50/3],
                     ['MDB', 'Magical Damage', 'Magic Damage', 0.082969, 50/3 ],
                     ['Pmit', 'Physical Defense', 'Physical Mitigation', 0.021, 2000],
                     ['Mmit', 'Magical Defense', 'Magical Mitigation', 0.0201, 2000],
                     ['BLK', 'Block Chance', 'Block Chance', 0.0998, 2000],
                     ['Parry', 'Parry Chance', 'Parry Chance', 0.0894, 2000],
                     ['EProf', 'Elemental Proficiency', 'Elemental', 0.0306, 250/7],
                     ['DProf', 'Divine Proficiency', 'Divine', 0.0306, 250/7],
                     ['FProf', 'Forbidden Proficiency', 'Forbidden', 0.0306, 250/7],
                     ['Str', 'Strength Bonus', 'Strength', 0.03, 250/7],
                     ['Dex', 'Dexterity Bonus', 'Dexterity', 0.03, 250/7],
                     ['End', 'Endurance Bonus', 'Endurance', 0.03, 250/7],
                     ['Agi', 'Agility Bonus', 'Agility', 0.03, 250/7],
                     ['Int', 'Intelligence Bonus', 'Intelligence', 0.03, 250/7],
                     ['Wis', 'Wisdom Bonus', 'Wisdom', 0.03, 250/7],
                     ['Evd', 'Evade Chance', 'Evade Chance', 0.025, 2000],
                     ['EDB', 'Holy Spell Damage', 'Holy', 0.0804, 200],
                     ['EDB', 'Dark Spell Damage', 'Dark', 0.0804, 200],
                     ['EDB', 'Wind Spell Damage', 'Wind', 0.0804, 200],
                     ['EDB', 'Elec Spell Damage', 'Elec', 0.0804, 200],
                     ['EDB', 'Cold Spell Damage', 'Cold', 0.0804, 200],
                     ['EDB', 'Fire Spell Damage', 'Fire', 0.0804, 200],
                     ['CS', 'Casting Speed', 'Casting Speed', 0, 0]];
  
  var maxUpgrade = 0;
  item.forging = {};
  [].forEach.call(data.querySelectorAll('#eu > span'), function(span){
    var re = span.textContent.match(/(.+)\sLv\.(\d+)/);
    var thisUpgrade = parseInt(re[2]);
    if (maxUpgrade < thisUpgrade)
      maxUpgrade = thisUpgrade;
    var htmlNameObj = forgeNameToHtmlName(re[1]);
    if (htmlNameObj)
      item.forging[htmlNameObj.htmlName] = {amount:thisUpgrade, baseMultiplier:htmlNameObj.baseMultiplier, scalingFactor:htmlNameObj.scalingFactor};
  });
  function reverseForgeMultiplierDamage(forgedBase, forgeLevelObj){
    var qualityBonus = 0.01 * Math.round(100 * (pxp0 - 100)/25 * forgeLevelObj.baseMultiplier); // *(1 + item.level/forgeLevelObj.scalingFactor)
    var forgeCoeff = 1 + 0.278875 * Math.log(0.1 * forgeLevelObj.amount + 1);
    var unforgedBase = (forgedBase - qualityBonus) / forgeCoeff + qualityBonus;
    //alert('forgedBase ' + forgedBase + ' @ forged ' + forgeLevelObj.amount + ' is ' + unforgedBase + ' @ 0 , qualityBonus ' + qualityBonus);
    return unforgedBase;
  }
  function reverseForgeMultiplierPlain(forgedBase, forgeLevelObj){
    var qualityBonus = 0.01 * Math.round(100 * (pxp0 - 100)/25 * forgeLevelObj.baseMultiplier); //*(1 + item.level/forgeLevelObj.scalingFactor) * 
    var forgeCoeff = 1 + 0.2 * Math.log(0.1 * forgeLevelObj.amount + 1);
    var unforgedBase = (forgedBase - qualityBonus) / forgeCoeff + qualityBonus;
    //alert('forgedBase ' + forgedBase + ' @ forged ' + forgeLevelObj.amount + ' is ' + unforgedBase + ' @ 0 , qualityBonus ' + qualityBonus);
    return unforgedBase;
  }
  
  if (maxUpgrade > 0)
    item.info += ', forged ' + maxUpgrade;
    
  function forgeNameToHtmlName(forgeName){
    var htmlNameObj;
    statNames.forEach(function(stats){
      if (forgeName == stats[1])
        htmlNameObj = {htmlName:stats[2], baseMultiplier:stats[3], scalingFactor:stats[4]};
    });
    return htmlNameObj;
  }
  var lower = item.name.toLowerCase();
  
  if (/leather/.test(lower) || /\splate/.test(lower) || (/cotton/.test(lower) && (/protection/.test(lower) || /warding/.test(lower))))
    return item;
  
  var htmlMagicTypes = ['Holy', 'Dark', 'Wind', 'Elec', 'Cold', 'Fire'];
  var htmlProfTypes = ['Divine', 'Forbidden', 'Elemental'];
  var staffPrefixes = {'Holy':'Hallowed', 'Dark':'Demonic', 'Wind':'Tempestuous', 'Elec':'Shocking', 'Cold':'Arctic', 'Fire':'Fiery'};
  
  var equipStats = {};
  function titleStrToBase(title){
    return parseFloat(title.substr(6));
  }
  [].forEach.call(data.querySelectorAll('div[title]'), function(div){
    if (div.parentElement.parentElement.id == 'equip_extended'){
      equipStats['Attack Damage'] = titleStrToBase(div.title)
      return;
    }
    var htmlName = div.childNodes[0].textContent;
    if (/\+/.test(htmlName)) // "Elec +"
      htmlName = htmlName.substr(0, htmlName.length - 2);
    if (htmlMagicTypes.indexOf(htmlName) != -1){
      if (div.parentElement.children[0].textContent == 'Damage Mitigations')
        htmlName += ' Mit';
    }
    equipStats[htmlName] = titleStrToBase(div.title)
  });
  
  function abbrevNameToHtmlName(abbrevName){
    var htmlName;
    
    if (abbrevName == 'Prof'){ //ambiguous/wrong for prof and EDB without adding these tests, so:
      Object.keys(equipStats).forEach(function(equipStatName){
        if (htmlProfTypes.indexOf(equipStatName) != -1)
          htmlName = equipStatName;
      });
    } else if (abbrevName == 'EDB'){
      Object.keys(equipStats).forEach(function(equipStatName){
        if (htmlMagicTypes.indexOf(equipStatName) != -1 && !/Staff/.test(item.name))
          htmlName = equipStatName;
        if (htmlMagicTypes.indexOf(equipStatName) != -1 && /Staff/.test(item.name)) //For staff, continue on to list EDB of prefixed element only
          if (item.name.indexOf(staffPrefixes[equipStatName]) != -1)
            htmlName = equipStatName;
      });
    } else {
      statNames.forEach(function(stats){
        if (abbrevName == stats[0]){
          htmlName = stats[2];
        }
      });
    }
    return htmlName;
  }
  
  var found = false;
  ranges.forEach(function(range){
    if (!range[3].every(function(subName){
      if (lower.indexOf(subName) != -1)
        return true;
    }))
      return;
    if (range[4] && lower.indexOf(range[4]) != -1)
      return;
    
    var abbrevName = range[0];
    var htmlName = abbrevNameToHtmlName(abbrevName);
    if (!htmlName){
      alert('no htmlname for ' + abbrevName);
      return;
    }
    
    var stat = equipStats[htmlName];
    if (!stat){
      alert('found no stat for ' + htmlName);
      return;
    }
    
    if (abbrevName == 'ADB' || abbrevName == 'MDB'){
      if (item.forging[htmlName])
        stat = reverseForgeMultiplierDamage(stat, item.forging[htmlName]);
    } else if (item.forging[htmlName])
      stat = reverseForgeMultiplierPlain(stat, item.forging[htmlName]);
    
    if (abbrevName == 'ADB'){
      var butcher = dataText.match(/Butcher\sLv.(\d)/);
      if (butcher)
        stat = stat / (1 + 0.02 * parseInt(butcher[1]))
    } else if (abbrevName == 'MDB') {
      var archmage = dataText.match(/Archmage\sLv.(\d)/);
      if (archmage)
        stat = stat / (1 + 0.02 * parseInt(archmage[1]));
    }
        
    if (!stat){
      alert('didnt find a stat for ' + abbrevName);
      return;
    }
    found = true;
    var percentile = Math.round(100 * (stat - range[1]) / (range[2] - range[1]));
        var dontShowInAuction = [/Int/, /Wis/, /Agi/, /Evd/, /Pmit/];
    if (percentile < 0)
      item.badinfo += ', ' + range[0] + ' ' + percentile + '%';
    else if (typeof showSeller == 'undefined' || !showSeller || dontShowInAuction.every(function(re){ return !re.test(range[0]); }))
      item.info += ', ' + range[0] + ' ' + percentile + '%';
  });
  
  if (found === false && !/plate/.test(lower) && !/leather/.test(lower))
    alert('No match for ' + lower);
  return item;
}