// ==UserScript==
// @name         Auto gym switch
// @namespace    https://gitgud.com/stephenlynx
// @version      1.2.4
// @description  Automatically switches your gym before training
// @author       Stephen Lynx
// @license      MIT
// @match        https://www.torn.com/gym.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480060/Auto%20gym%20switch.user.js
// @updateURL https://update.greasyfork.org/scripts/480060/Auto%20gym%20switch.meta.js
// ==/UserScript==
var lynx = {};

lynx.mainRatioOptions = ['No main gym', 'Str', 'Def', 'Spe', 'Dex'];
lynx.secondaryRatioOptions = ['No secondary gym', 'Def/Dex', 'Str/Spe'];

lynx.red = '#d83500';
lynx.green = '#00a500';

lynx.gymInfo = {
  1 : {
    'str': 2,
    'spe': 2,
    'def': 2,
    'dex': 2
  },
  2 : {
    'str': 2.4,
    'spe': 2.4,
    'def': 2.7,
    'dex': 2.4
  },
  3 : {
    'str': 2.7,
    'spe': 3.2,
    'def': 3.0,
    'dex': 2.7
  },
  4 : {
    'str': 3.2,
    'spe': 3.2,
    'def': 3.2,
    'dex': 0
  },
  5 : {
    'str': 3.4,
    'spe': 3.6,
    'def': 3.4,
    'dex': 3.2
  },
  6 : {
    'str': 3.4,
    'spe': 3.6,
    'def': 3.6,
    'dex': 3.8
  },
  7 : {
    'str': 3.7,
    'spe': 0,
    'def': 3.7,
    'dex': 3.7
  },
  8 : {
    'str': 4,
    'spe': 4,
    'def': 4,
    'dex': 4
  },
  9 : {
    'str': 4.8,
    'spe': 4.4,
    'def': 4,
    'dex': 4.2
  },
  10 : {
    'str': 4.4,
    'spe': 4.6,
    'def': 4.8,
    'dex': 4.4
  },
  11 : {
    'str': 5,
    'spe': 4.6,
    'def': 5.2,
    'dex': 4.6
  },
  12 : {
    'str': 5,
    'spe': 5.2,
    'def': 5,
    'dex': 5
  },
  13 : {
    'str': 5,
    'spe': 5.4,
    'def': 4.8,
    'dex': 5.2
  },
  14 : {
    'str': 5.5,
    'spe': 5.7,
    'def': 5.5,
    'dex': 5.2
  },
  15 : {
    'str': 0,
    'spe': 5.5,
    'def': 5.5,
    'dex': 5.7
  },
  16 : {
    'str': 6,
    'spe': 6,
    'def': 6,
    'dex': 6
  },
  17 : {
    'str': 6,
    'spe': 6.2,
    'def': 6.4,
    'dex': 6.2
  },
  18 : {
    'str': 6.5,
    'spe': 6.4,
    'def': 6.2,
    'dex': 6.2
  },
  19 : {
    'str': 6.4,
    'spe': 6.5,
    'def': 6.4,
    'dex': 6.8
  },
  20 : {
    'str': 6.4,
    'spe': 6.4,
    'def': 6.8,
    'dex': 7
  },
  21 : {
    'str': 7,
    'spe': 6.4,
    'def': 6.4,
    'dex': 6.5
  },
  22 : {
    'str': 6.8,
    'spe': 6.5,
    'def': 7,
    'dex': 6.5
  },
  23 : {
    'str': 6.8,
    'spe': 7,
    'def': 7,
    'dex': 6.8
  },
  24 : {
    'str': 7.3,
    'spe': 7.3,
    'def': 7.3,
    'dex': 7.3
  },
  25 : {
    'str': 0,
    'spe': 0,
    'def': 7.5,
    'dex': 7.5
  },
  26 : {
    'str': 7.5,
    'spe': 7.5,
    'def': 0,
    'dex': 0
  },
  27 : {
    'str': 8,
    'spe': 0,
    'def': 0,
    'dex': 0
  },
  28 : {
    'str': 0,
    'spe': 0,
    'def': 8,
    'dex': 0
  },
  29 : {
    'str': 0,
    'spe': 8,
    'def': 0,
    'dex': 0
  },
  30 : {
    'str': 0,
    'spe': 0,
    'def': 0,
    'dex': 8
  },
  31 : {
    'str': 9,
    'spe': 9,
    'def': 9,
    'dex': 9
  },
  32 : {
    'str': 10,
    'spe': 10,
    'def': 10,
    'dex': 10
  },
  33 : {
    'str': 3.4,
    'spe': 3.4,
    'def': 4.6,
    'dex': 0
  }
};

// lynx.currentGym is used to store the current gym being used
lynx.classList = ['specialist', 'heavyweight', 'middleweight', 'lightweight', 'jail'];

lynx.currentStats = {};

lynx.abbreviations = ['k', 'm', 'b', 't'];

lynx.picks = {
  'str': [],
  'def': [],
  'spe': [],
  'dex': []
};

lynx.ratioLabels = {};

lynx.stats = ['str', 'def', 'spe', 'dex'];

lynx.checkGym = function(gymId) {

  lynx.gymInfo[gymId].checked = true;
  var gymStats = lynx.gymInfo[gymId];

  for (var stat of lynx.stats) {

    if (gymStats[stat]) {
      lynx.picks[stat].push({
        id: gymId,
        gain: gymStats[stat]
      });
    }

  }

};

lynx.sortGyms = function(a, b) {

  if (a.gain === b.gain) {
    return b.id - a.id;
  } else {
    return b.gain - a.gain;
  }

};

lynx.pickGyms = function(gymStatus) {

  for (var gymClass of lynx.classList) {

    for (var gym of gymStatus[gymClass]) {

      lynx.gymInfo[gym.id].name = gym.name;
      lynx.gymInfo[gym.id].cost = gym.energyCost;

      if (! (gym.status === 'available' || gym.status === 'active')) {
        continue;
      }

      if (gym.status === 'active') {
        lynx.currentGym = gym.id;
      }

      lynx.checkGym(gym.id);

    }
  }

  for (var stat in lynx.picks) {
    lynx.picks[stat].sort(lynx.sortGyms);
  }

};

lynx.formatNumber = function(number) {

  var abbreviationIndex = -1;

  while (number > 1000 && abbreviationIndex < lynx.abbreviations.length) {
    number /= 1000;
    abbreviationIndex++;
  }

  return Math.trunc(number) + (abbreviationIndex >= 0 ? lynx.abbreviations[abbreviationIndex] : '');

};

lynx.calculateRatios = function() {

  for (var labelStat in lynx.ratioLabels) {
    lynx.ratioLabels[labelStat].innerHTML = '';
  }

  var mainGym = lynx.mainGymSelect.selectedIndex;
  localStorage.setItem('lynxMainGym', mainGym);
  var secondaryGym = lynx.secondaryGymSelect.selectedIndex;
  localStorage.setItem('lynxSecondaryGym', secondaryGym);

  if (mainGym) {
    var mainStatName = lynx.stats[mainGym - 1];
    var secondHighestStatName;
    var secondHighestStatValue = 0;

    for (var stat of lynx.stats) {

      if (stat !== mainStatName && lynx.currentStats[stat] > secondHighestStatValue) {
        secondHighestStatName = stat;
        secondHighestStatValue = lynx.currentStats[stat];
      }

    }

    var mainTarget = secondHighestStatValue * 1.25;

    if (mainTarget > lynx.currentStats[mainStatName]) {

      lynx.ratioLabels[mainStatName].innerHTML = 'Must gain ' + lynx.formatNumber(mainTarget - lynx.currentStats[mainStatName]);
      lynx.ratioLabels[mainStatName].style.color = lynx.red;

    } else {

      var lead = lynx.currentStats[mainStatName] / 1.25;
      lead -= secondHighestStatValue;

      lynx.ratioLabels[secondHighestStatName].innerHTML = 'Can gain ' + lynx.formatNumber(lead);
      lynx.ratioLabels[secondHighestStatName].style.color = lynx.green;
    }

  }

  if (secondaryGym) {

    var defStats = ['dex', 'def'];
    var offStats = ['str', 'spe'];

    var defSum = lynx.currentStats.def + lynx.currentStats.dex;

    var offSum = lynx.currentStats.str + lynx.currentStats.spe;

    var secondaryTarget = (secondaryGym === 1 ? offSum: defSum) * 1.25;

    var secondaryCurrent = secondaryGym === 1 ? defSum: offSum;

    if (secondaryTarget > secondaryCurrent) {

      for (let stat of secondaryGym === 1 ? defStats: offStats) {
        lynx.ratioLabels[stat].innerHTML = 'Must gain ' + lynx.formatNumber(secondaryTarget - secondaryCurrent);
        lynx.ratioLabels[stat].style.color = lynx.red;
      }

    } else {
      var secondaryLead = secondaryCurrent / 1.25;
      secondaryLead -= secondaryGym === 1 ? offSum: defSum;

      for (let stat of secondaryGym === 1 ? offStats: defStats) {
        lynx.ratioLabels[stat].innerHTML = 'Can gain ' + lynx.formatNumber(secondaryLead);
        lynx.ratioLabels[stat].style.color = lynx.green;
      }

    }

  }
};

lynx.setupRatios = function(stats) {

  lynx.ratioSetup = true;

  for (var stat in stats) {
    lynx.currentStats[stat.substring(0, 3)] = +stats[stat].value.replace(/,/g, '');
  }

  var parent = document.getElementsByClassName('content-wrapper')[0];

  var ratioDiv = document.createElement('div');
  ratioDiv.className = 'lynx';

  lynx.mainGymSelect = document.createElement('select');
  lynx.mainGymSelect.id = 'lynx_mainRatio';

  lynx.secondaryGymSelect = document.createElement('select');
  lynx.secondaryGymSelect.id = 'lynx_secondaryRatio';

  ratioDiv.appendChild(lynx.mainGymSelect);

  for (var mainOption of lynx.mainRatioOptions) {

    var option = document.createElement('option');
    option.innerHTML = mainOption;
    lynx.mainGymSelect.appendChild(option);
  }

  lynx.mainGymSelect.selectedIndex = +localStorage.getItem('lynxMainGym') || 0;
  lynx.mainGymSelect.onchange = lynx.calculateRatios;

  ratioDiv.appendChild(lynx.secondaryGymSelect);

  for (var secondaryOptionText of lynx.secondaryRatioOptions) {
    var secondaryOption = document.createElement('option');
    secondaryOption.innerHTML = secondaryOptionText;
    lynx.secondaryGymSelect.appendChild(secondaryOption);
  }

  lynx.secondaryGymSelect.selectedIndex = +localStorage.getItem('lynxSecondaryGym') || 0;
  lynx.secondaryGymSelect.onchange = lynx.calculateRatios;

  parent.appendChild(ratioDiv);

};

lynx.setupRatioLabels = function() {

  var statDivs = document.querySelectorAll('[class^=\'propertyContent\']');

  for (var i = 0; i < lynx.stats.length; i++) {

    var statName = lynx.stats[i];

    var statDiv = statDivs[i];

    var ratioLabel = document.createElement('div');
    ratioLabel.className = 'lynx';

    statDiv.appendChild(ratioLabel);

    lynx.ratioLabels[statName] = ratioLabel;

  }

};

lynx.swapGyms = async function(gymToUse) {

  var changeResult = await getAction({
    type: 'post',
    action: 'gym.php',
    data: {
      step: 'changeGym',
      gymID: gymToUse
    }
  });

  if (changeResult.success) {

    lynx.currentGym = gymToUse;

    try {

      var labelName = document.querySelector('[class^=\'notificationText\'] b');
      labelName.innerHTML = lynx.gymInfo[gymToUse].name;

      var listLabelEnergy = document.querySelectorAll('[class^=\'description\']');

      for (var label of listLabelEnergy) {
        label.getElementsByTagName('p')[1].innerHTML = lynx.gymInfo[gymToUse].cost + ' energy per train';
      }

      var activeButton = document.querySelector('[class*=\'active\'][class^=\'gymButton\']');

      var activeClass = '';

      for (var classEntry of activeButton.classList) {
        if (!classEntry.indexOf('active')) {
          activeClass = classEntry;
          break;
        }

      }

      activeButton.classList.remove(activeClass);
      document.querySelector('[class*=\'gym-' + gymToUse + '\']').parentElement.classList.add(activeClass);
      
      var logos = document.querySelectorAll('[class^=\'logo\']');
      
      var logo;

      for(var i = 0; i < logos.length; i++) {
        
        if(logos[i].tagName === 'IMG'){
          logo = logos[i];
          break;
        }
        
      }

      var newSrc = logo.src.split('/');
      newSrc[newSrc.length - 1] = gymToUse + '.png';
      logo.src = newSrc.join('/');
      
    } catch(error) {
      console.log(error);
      return new Response(JSON.stringify({
        message: 'Gym changed but failed to update visual elements. Wait for patch.'
      }));
    }

  }

  return new Response(JSON.stringify({
    message: changeResult.message
  }));
};

lynx.runRatioCheck = function() {

  if (!lynx.initialRatioSetup) {
    lynx.setupRatios(lynx.downloadedStats);
    lynx.initialRatioSetup = true;
  }

  lynx.setupRatioLabels();
  lynx.calculateRatios();
};

lynx.setDisable = function() {

  lynx.disableCheckbox = document.createElement('input');
  lynx.disableCheckbox.type = 'checkbox';
  lynx.disableCheckbox.onchange = function() {
    localStorage.setItem('lynxDisableSwap', lynx.disableCheckbox.checked ? 1 : 0);
  }

  lynx.disableCheckbox.checked = !!+localStorage.getItem('lynxDisableSwap');

  var div = document.createElement('div');
  div.className = 'lynx';
  div.appendChild(lynx.disableCheckbox);

  var label = document.createElement('span');
  label.innerHTML = 'Disable auto gym switch';

  div.appendChild(label);

  document.getElementById('gymroot').appendChild(div);

};

(function() {

  'use strict';

  var lynxElements = document.getElementsByClassName('lynx');

  while (lynxElements.length) {
    lynxElements[0].remove();
  }

  var focusCallback = function(event) {

    if (lynx.domReady && !document.getElementById('specialistGyms')) {
      lynx.runRatioCheck();
      lynx.removedFocusCallback = true;
      removeEventListener('focus', focusCallback);
    }

  };

  addEventListener('focus', focusCallback);

  var originalFetch = window.fetch;

  window.fetch = async function(...args) {

    if (!args[0].indexOf('/gym.php?step=train') && !lynx.disableCheckbox.checked) {

      var stat = JSON.parse(args[1].body).stat.substring(0, 3);

      var gymToUse;
      var gymList = lynx.picks[stat];
      for (var gym of gymList) {

        if (gym.id > 24 && gym.id < 32) {

          var isLocked = false;
          for (var classEntry of document.querySelector('[class*=\'gym-' + gym.id + '\']').parentElement.classList) {
            if (!classEntry.indexOf('locked')) {
              isLocked = true;
              break;
            }

          }

          if (!isLocked) {
            gymToUse = gym.id;
            break;
          }
        } else {
          gymToUse = gym.id;
          break;
        }

      }

      if (gymToUse && gymToUse !== lynx.currentGym) {
        return await lynx.swapGyms(gymToUse);
      }

    }

    var result = await originalFetch(...args);

    var jsonData;

    if (!lynx.booted && !args[0].indexOf('/gym.php?step=getInitialGymInfo')) {

      lynx.booted = true;
      jsonData = await result.clone().json();

      lynx.downloadedStats = jsonData.stats;

      var observer = new MutationObserver(function(mutationList, observer) {

        for (var event of mutationList) {

          // This does not suffice for when the player doesn't confirm the gym
          // change
          if (event.target.tagName === 'DIV' && !event.target.className.indexOf('message') && event.addedNodes.length && !event.addedNodes[0].className.indexOf('messageWrapper')) {

            if (!lynx.disableCheckbox) {
              lynx.setDisable();
            }

            if (document.getElementById('specialistGyms')) {
              return observer.disconnect();
            }

            if (!document.hidden) {
              lynx.runRatioCheck();

              if (!lynx.removedFocusCallback) {
                lynx.removedFocusCallback = true;
                removeEventListener('focus', focusCallback);
              }
            } else {
              lynx.domReady = true;
            }
            break;
          }
        }

      });

      observer.observe(document.getElementsByTagName('body')[0], {
        childList: true,
        subtree: true
      });

      lynx.pickGyms(jsonData.gyms);

    } else if (!args[0].indexOf('/gym.php?step=changeGym') || !args[0].indexOf('/gym.php?step=purchaseMembership')) {

      jsonData = await result.clone().json();

      if (jsonData.success) {

        lynx.currentGym = JSON.parse(args[1].body).gymID;

        if (!lynx.gymInfo[lynx.currentGym].checked) {
          lynx.checkGym(lynx.currentGym);

          for (var sortStat in lynx.picks) {
            lynx.picks[sortStat].sort(lynx.sortGyms);
          }
        }
      }
    } else if (lynx.ratioSetup && !args[0].indexOf('/gym.php?step=train')) {

      jsonData = await result.clone().json();

      if (jsonData.success) {
        // The data will contain gymsStatuses array, objects with id and status
        // when locking status will be lockedPurchased, when unlocking again
        // status will be available
        // Is this better than checking the button each time?
        lynx.currentStats[jsonData.stat.name.substring(0, 3)] = +jsonData.stat.newValue.replace(/,/g, '');
        lynx.calculateRatios();
      }
    }

    return result;

  };

})();
