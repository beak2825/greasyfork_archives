// ==UserScript==
// @name        HVpr1135
// @namespace   E-Hentai
// @description   111111111
// @author      Superlatanium
// @version     1.1.4.1
// @include     http://hentaiverse.org/pages/showequip.php*
// @downloadURL https://update.greasyfork.org/scripts/28529/HVpr1135.user.js
// @updateURL https://update.greasyfork.org/scripts/28529/HVpr1135.meta.js
// ==/UserScript==
 
//Updated Jan 11 2017
 
document.body.appendChild(document.createElement('br'));
var button = document.body.appendChild(document.createElement('div'));
button.textContent = 'Checking...';
var item = parseEquip(document.body, {});
button.textContent = item.info + (item.badinfo ? ' ' + item.badinfo : '');
 
function parseEquip(data, item){
    var ranges = [
        ['ADB', 67.83, 75.92, ['axe', 'slaughter']],
        ['ADB', 54.16, 59.87, ['axe'], ['slaughter']],
        ['ADB', 59.21, 67.72, ['club', 'slaughter']], //http://hentaiverse.org/pages/showequip.php?eid=115176184&key=487667fdfa
        ['ADB', 45.36, 53.04, ['club'], ['slaughter']],
        ['ADB', 42.8, 51.33, ['rapier', 'slaughter']],
        ['ADB', 31.95, 39.38, ['rapier'], ['slaughter']],
        ['Parry', 23.81, 26.94, ['rapier', 'nimble']],
        ['Parry', 16.3, 18.89, ['rapier'], ['nimble']],
        ['ADB', 53.41, 61.58, ['shortsword', 'slaughter']],
        ['ADB', 41.26, 47.92, ['shortsword'], ['slaughter']],
        ['ADB', 39.84, 46.21, ['wakizashi', 'slaughter']],
        ['ADB', 30.51, 35.11, ['wakizashi'], ['slaughter']],
        ['Parry', 27.67, 30.53, ['wakizashi', 'nimble']],
        ['Parry', 19.97, 22.48, ['wakizashi'], ['nimble']],
 
        ['ADB', 73.29, 82.07, ['estoc', 'slaughter']],
        ['ADB', 58.13, 64.99, ['estoc'], ['slaughter']],
        ['ADB', 86.45, 98.47, ['longsword', 'slaughter']],
        ['ADB', 68.94, 78.66, ['longsword'], ['slaughter']],
        ['ADB', 73.38, 82.07, ['mace', 'slaughter']],
        ['ADB', 58.1, 64.99, ['mace'], ['slaughter']],
        ['ADB', 72.61, 82.07, ['katana', 'slaughter']],
        ['ADB', 57.39, 64.99, ['katana'], ['slaughter']],
 
        ['MDB', 46.08, 52.2, ['katalox', 'destruction'] , ,0.2747], //http://hentaiverse.org/pages/showequip.php?eid=101694028&key=3b90406ee0
        ['MDB', 28.1, 32.4, ['katalox'], ['destruction'] ,0.27167],
        ['MDB', 45.95, 51.71, ['redwood', 'destruction'] , ,0.2747],
        ['MDB', 27.76, 31.99, ['redwood'], ['destruction'] ,0.27167],
        ['MDB', 45.02, 51.71, ['willow', 'destruction'] , ,0.2747],
        ['MDB', 27.76, 31.99, ['willow'], ['destruction'] ,0.27167],
        ['MDB', 27.94, 31.99, ['oak'] , ,0.27167],
 
        ['BLK', 33.43, 37.52, ['buckler', 'barrier']], //http://hentaiverse.org/pages/showequip.php?eid=115077551&key=44ca1fa116, http://hentaiverse.org/pages/showequip.php?eid=115253588&key=3a324ad469
        ['BLK', 27.67, 31.03, ['buckler'], ['barrier']],
        ['BLK', 32.63, 36.02, ['kite']],
        ['BLK', 35.65, 38.52, [' force']], //reinforced
 
        ['EDB', 15.12, 16.97, ['phase cap']],
        ['MDB', 3.74, 4.23, ['radiant phase cap'] , ,0.2185],
        ['CS', 2.99, 3.47, ['charged phase cap']],
        ['Int', 6, 7.08, ['phase cap']],
        ['Wis', 6, 7.08, ['phase cap']],
        ['Agi', 5.07, 6.03, ['phase cap']],
        ['Evd', 4.7, 5.28, ['phase cap']],
        ['Pmit', 3.01, 3.38, ['phase cap']],
 
 
        ['EDB', 18.02, 20.18, ['phase robe']],
        ['MDB', 4.34, 4.90, ['radiant phase robe'] , ,0.227],
        ['CS', 3.49, 4.06, ['charged phase robe']],
        ['Int', 7.14, 8.43, ['phase robe']],
        ['Wis', 7.14, 8.43, ['phase robe']],
        ['Agi', 6.03, 7.17, ['phase robe']],
        ['Evd', 5.6, 6.28, ['phase robe']],
        ['Pmit', 3.57, 4.01, ['phase robe']],
 
 
        ['EDB', 13.66, 15.36, ['phase gloves']],
        ['MDB', 3.42, 3.90, ['radiant phase gloves'] , ,0.215],
        ['CS', 2.75, 3.18, ['charged phase gloves']],
        ['Int', 5.43, 6.42, ['phase gloves']],
        ['Wis', 5.43, 6.42, ['phase gloves']],
        ['Agi', 4.59, 5.46, ['phase gloves']],
        ['Evd', 4.25, 4.78, ['phase gloves']],
        ['Pmit', 2.73, 3.07, ['phase gloves']],
 
        ['EDB', 16.58, 18.58, ['phase pants']],
        ['MDB', 3.92, 4.56, ['radiant phase pants'] , ,0.222],
        ['CS', 3.28, 3.77, ['charged phase pants']],
        ['Int', 6.57, 7.77, ['phase pants']],
        ['Wis', 6.57, 7.77, ['phase pants']],
        ['Agi', 5.56, 6.6, ['phase pants']],
        ['Evd', 5.15, 5.78, ['phase pants']],
        ['Pmit', 3.28, 3.7, ['phase pants']],
 
 
        ['EDB', 12.23, 13.75, ['phase shoes']],
        ['MDB', 3.24, 3.57, ['radiant phase shoes'] , ,0.206],
        ['CS', 2.5, 2.89, ['charged phase shoes']],
        ['Int', 4.86, 5.73, ['phase shoes']],
        ['Wis', 4.86, 5.73, ['phase shoes']],
        ['Agi', 4.11, 4.89, ['phase shoes']],
        ['Evd', 3.8, 4.28, ['phase shoes']],
        ['Pmit', 2.44, 2.75, ['phase shoes']],
 
        ['EDB', 33.92, 37.84, ['hallowed katalox', 'heimdall']], //http://hentaiverse.org/pages/showequip.php?eid=111469209&key=b52d68be5a
        ['EDB', 19.05, 21.76, ['hallowed katalox'], ['heimdall']], //http://hentaiverse.org/pages/showequip.php?eid=114286837&key=d3291bd712
        ['EDB', 33.92, 37.84, ['demonic katalox', 'fenrir']],
        ['EDB', 19.05, 21.76, ['demonic katalox'], ['fenrir']],
 
        ['EDB', 38.11, 42.68, ['hallowed oak', 'heimdall']],
        ['EDB', 23.01, 26.6, ['hallowed oak'], ['heimdall']],
 
        ['EDB', 34.5, 37.4, ['tempestuous redwood', 'freyr']], //http://hentaiverse.org/pages/showequip.php?eid=109200953&key=69ac74ccb4
        ['EDB', 19.15, 21.78, ['tempestuous redwood'], ['freyr']],
        ['EDB', 34.5, 37.4, ['shocking redwood', 'mjolnir']], //and http://hentaiverse.org/pages/showequip.php?eid=103269858&key=cf3a28277a
        ['EDB', 19.15, 21.78, ['shocking redwood'], ['mjolnir']],
        ['EDB', 34.5, 37.4, ['arctic redwood', 'niflheim']], //and http://hentaiverse.org/pages/showequip.php?eid=113172450&key=5a980f3474
        ['EDB', 19.15, 21.78, ['arctic redwood'], ['niflheim']],
        ['EDB', 34.5, 37.4, ['fiery redwood', 'surtr']],
        ['EDB', 19.06, 21.78, ['fiery redwood'], ['surtr']], //http://hentaiverse.org/pages/showequip.php?eid=110720139&key=f07739b522
 
        ['EDB', 16.41, 18.56, ['tempestuous willow']],
        ['EDB', 16.41, 18.56, ['shocking willow']],
        ['EDB', 22.92, 26.6, ['demonic willow']],
        ['EDB', 10.28, 11.33, ['fiery willow']],
        ['EDB', 10.28, 11.33, ['arctic willow']],
        ['EDB', 10.28, 11.33, ['hallowed willow']],
 
        ['Prof', 14.29, 16.24, ['hallowed katalox', 'heaven-sent']],
        ['Prof', 7.1, 8.29, ['hallowed katalox'], ['heaven-sent']],
        ['Prof', 14.29, 16.24, ['demonic katalox', 'demon-fiend']],
        ['Prof', 7.1, 8.29, ['demonic katalox'], ['demon-fiend']],
        ['Prof', 14.29, 16.24, ['redwood', 'elementalist']],
        ['Prof', 7.1, 8.29, ['redwood'], ['elementalist']],
        ['Prof', 5.58, 6.45, ['oak']],
        ['Prof', 5.26, 6.15, ['willow']],
 
 
        ['Prof', 7.38, 8.29, ['cotton cap']],
        ['CS', 2.99, 3.47, ['charged cotton cap']],
        ['Int', 5.31, 6.33, ['cotton cap']],
        ['Wis', 5.31, 6.33, ['cotton cap']],
        ['Agi', 4.08, 4.83, ['cotton cap']],
        ['Evd', 3.45, 4.03, ['cotton cap']],
        ['Pmit', 3.95, 4.43, ['cotton cap']],
 
        ['Prof', 8.79, 9.89, ['cotton robe']],
        ['CS', 3.49, 4.06, ['charged cotton robe']],
        ['Int', 6.3, 7.53, ['cotton robe']],
        ['Wis', 6.3, 7.53, ['cotton robe']],
        ['Agi', 4.83, 5.73, ['cotton robe']],
        ['Evd', 4.11, 4.78, ['cotton robe']],
        ['Pmit', 4.71, 5.27, ['cotton robe']],
 
        ['Prof', 6.68, 7.5, ['cotton gloves']],
        ['CS', 2.75, 3.18, ['charged cotton gloves']],
        ['Int', 4.8, 5.73, ['cotton gloves']],
        ['Wis', 4.8, 5.73, ['cotton gloves']],
        ['Agi', 3.69, 4.38, ['cotton gloves']],
        ['Evd', 3.13, 3.65, ['cotton gloves']],
        ['Pmit', 3.57, 4.01, ['cotton gloves']],
 
        ['Prof', 8.08, 9.09, ['cotton pants']],
        ['CS', 3.28, 3.77, ['charged cotton pants']],
        ['Int', 5.82, 6.93, ['cotton pants']],
        ['Wis', 5.82, 6.93, ['cotton pants']],
        ['Agi', 4.47, 5.28, ['cotton pants']],
        ['Evd', 3.78, 4.4, ['cotton pants']],
        ['Pmit', 4.33, 4.85, ['cotton pants']],
 
        ['Prof', 5.97, 6.7, ['cotton shoes']],
        ['CS', 2.5, 2.89, ['charged cotton shoes']],
        ['Int', 4.32, 5.13, ['cotton shoes']],
        ['Wis', 4.32, 5.13, ['cotton shoes']],
        ['Agi', 3.33, 3.93, ['cotton shoes']],
        ['Evd', 2.8, 3.28, ['cotton shoes']],
        ['Pmit', 3.19, 3.59, ['cotton shoes']],
 
 
        ['ADB', 9.37, 11.25, ['shade helmet']], //http://hentaiverse.org/pages/showequip.php?eid=106210856&key=4fbb85f2ae
        ['ADB', 11.09, 13.3, ['shade breastplate']],
        ['ADB', 8.53, 10.23, ['shade gauntlets']],
        ['ADB', 10.24, 12.28, ['shade leggings']], //http://hentaiverse.org/pages/showequip.php?eid=107182535&key=1051411ae1
        ['ADB', 7.67, 9.2, ['shade boots']], //http://hentaiverse.org/pages/showequip.php?eid=95898375&key=bc1d23301c
 
        ['ADB', 22, 25.73, ['power helmet', 'slaughter']], // also see https://forums.e-hentai.org/index.php?s=&showtopic=22234&view=findpost&p=4486045
        ['ADB', 13.18, 18.04, ['power helmet'], ['slaughter']],
        ['ADB', 25.4, 30.68, ['power armor', 'slaughter']],
        ['ADB', 15.42, 21.46, ['power armor'], ['slaughter']],
        ['ADB', 20.11, 23.25, ['power gauntlets', 'slaughter']],
        ['ADB', 11.82, 16.33, ['power gauntlets'], ['slaughter']],
        ['ADB', 23.94, 28.2, ['power leggings', 'slaughter']],
        ['ADB', 14.22, 19.75, ['power leggings'], ['slaughter']],
        ['ADB', 17.3, 20.77, ['power boots', 'slaughter']],
        ['ADB', 10.63, 14.62, ['power boots'], ['slaughter']]
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
    var potency = dataText.match(/Potency\sTier:\s(\d+)/)[1];
    if (potency !== '0')
        item.info += ', IW ' + potency;
 
    var maxUpgrade = 0;
    item.forging = {};
    [].forEach.call(data.getElementsByClassName('eu'), function(e){
        var re = e.textContent.match(/(.+)\sLv\.(\d+)/);
        var thisUpgrade = parseInt(re[2]);
        if (maxUpgrade < thisUpgrade)
            maxUpgrade = thisUpgrade;
        var statName = forgeNameToStatName(re[1]);
        if (statName)
            item.forging[statName] = thisUpgrade;
    });
    if (maxUpgrade > 0)
        item.info += ', forged ' + maxUpgrade;
 
    function forgeNameToStatName(forgeName){
        var statName;
        [['Physical Damage', 'Attack Damage'],
         ['Magical Damage', 'Magic Damage'],
         ['Physical Defense', 'Physical Mitigation'],
         ['Magical Defense', 'Magical Mitigation'],
         ['Block Chance', 'Block Chance'],
         ['Parry Chance', 'Parry Chance'],
         ['Elemental Proficiency', 'Elemental'],
         ['Forbidden Proficiency', 'Forbidden'],
         ['Divine Proficiency', 'Divine'],
         ['Strength Bonus', 'Strength'],
         ['Dexterity Bonus', 'Dexterity'],
         ['Endurance Bonus', 'Endurance'],
         ['Agility Bonus', 'Agility'],
         ['Intelligence Bonus', 'Intelligence'],
         ['Wisdom Bonus', 'Wisdom'],
         ['Evade Chance', 'Evade Chance'],
         ['Holy Spell Damage', 'Holy'],
         ['Dark Spell Damage', 'Dark'],
         ['Wind Spell Damage', 'Wind'],
         ['Elec Spell Damage', 'Elec'],
         ['Cold Spell Damage', 'Cold'],
         ['Fire Spell Damage', 'Fire']].forEach(function(pairs){
            if (forgeName == pairs[0])
                statName = pairs[1];
        });
        return statName;
    }
    var lower = item.name.toLowerCase();
 
    if (/leather/.test(lower) || /\splate/.test(lower) || (/cotton/.test(lower) && (/protection/.test(lower) || /warding/.test(lower))))
        return item;
 
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