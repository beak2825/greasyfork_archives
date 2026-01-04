// ==UserScript==
// @name           Neopets - Training ATK/DEF Boost Indicator
// @version        2024-09-30
// @namespace      https://www.neopets.com/
// @match          *://*.neopets.com/island/training.phtml?type=status
// @match          *://*.neopets.com/island/fight_training.phtml?type=status
// @match          *://*.neopets.com/pirates/academy.phtml?type=status
// @description    Provides more info about stats in training schools.
// @copyright      Lendri Mujina
// @icon           https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @license        MIT
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/462896/Neopets%20-%20Training%20ATKDEF%20Boost%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/462896/Neopets%20-%20Training%20ATKDEF%20Boost%20Indicator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var petCells = document.querySelectorAll('.content tr td[bgcolor="white"');

var petCount = petCells.length;

const boostA = 8;
const boostB = 13;
const boostC = 20;
const boostD = 35;
const boostE = 55;
const boostF = 85;
const boostG = 125;
const boostH = 200;
const boostI = 250;
const boostJ = 300;
const boostK = 350;
const boostL = 400;
const boostM = 450;
const boostN = 500;
const boostO = 550;
const boostP = 600;
const boostQ = 650;
const boostR = 700;
const boostZ = 750;
const l54 = "<img src='https://i.imgur.com/qozqrtb.png' title='League 54'>";
const l97 = "<img src='https://i.imgur.com/TU1sWM7.png' title='League 97'>";
const lFy = "<img src='https://images.neopets.com/neoboards/smilies/fyora.gif' style='width:10px;height:10px;' title='Fyora League'>";
const lCz = "<img src='https://images.neopets.com/neoboards/smilies/coltzan.gif' style='width:10px;height:10px;' title='King Coltzan Society League'>";
const DDL = "<img src='https://images.neopets.com/neoboards/smilies/darigan.gif' style='width:10px;height:10px;' title='Darigan Dedication League'>";

function hp(inputNum){
var output = "";
var regex = /(?<=\/\s)\d*/g;
var searchResult = inputNum.search(regex);
var compare = inputNum.slice(searchResult);
console.log(inputNum + " --- " + compare);
  if (compare == 54){
   output = l54;
  }
  else if (compare == 97){
   output = l97;
  }
  else if (compare == 108){
   output = DDL;
  }
  else if (compare == 300){
   output = lFy;
  }
  else if (compare == 1000){
   output = lCz;
  }
return output;
}

function getBoost(inputNum,type){
var lev;
var amt;
var next;
var legalLeague = "";
    if(inputNum < boostA){
        lev = 1;
        amt = 0.5;
        next = boostA;
    }
    else if(inputNum < boostB){
        lev = 2;
        amt = 0.75;
        next = boostB;
    }
    else if(inputNum < boostC){
        lev = 3;
        amt = 1;
        next = boostC;
        if (type == 0){
         legalLeague= l54 + DDL;
        }
        if (type == 1){
         legalLeague= DDL;
        }
    }
    else if(inputNum < boostD){
        lev = 4;
        amt = 1.25;
        next = boostD;
        if (type == 0){
         legalLeague = l97 + lFy;
        }
    }
    else if(inputNum < boostE){
        lev = 5;
        amt = 1.5;
        next = boostE;
        if (type == 1){
         legalLeague = l54 + l97 + lFy;
        }
    }
    else if(inputNum < boostF){
        lev = 6;
        amt = 2;
        next = boostF;
    }
    else if(inputNum < boostG){
        lev = 7;
        amt = 2.5;
        next = boostG;
    }
    else if(inputNum < boostH){
        lev = 8;
        amt = 3;
        next = boostH;
    }
    else if(inputNum < boostI){
        lev = 9;
        amt = 4.5;
        next = boostI;
    }
    else if(inputNum < boostJ){
        lev = 10;
        amt = 5.5;
        next = boostJ;
    }
    else if(inputNum < boostK){
        lev = 11;
        amt = 6.5;
        next = boostK;
    }
    else if(inputNum < boostL){
        lev = 12;
        amt = 7.5;
        next = boostL;
    }
    else if(inputNum < boostM){
        lev = 13;
        amt = 8.5;
        next = boostM;
    }
    else if(inputNum < boostN){
        lev = 14;
        amt = 9.75;
        next = boostN;
    }
    else if(inputNum < boostO){
        lev = 15;
        amt = 11;
        next = boostO;
    }
    else if(inputNum < boostP){
        lev = 16;
        amt = 12;
        next = boostP;
    }
    else if(inputNum < boostQ){
        lev = 17;
        amt = 13;
        next = boostQ;
    }
    else if(inputNum < boostR){
        lev = 18;
        amt = 14;
        next = boostR;
    }
    else if(inputNum < boostZ){
        lev = 19;
        amt = 15;
        next = boostZ;
    }
    else {
        lev = 20;
        amt = 16;
        next = inputNum;
        legalLeague = lCz;
    }

var message = "<span style='color:#00F;'>×"+ amt + " <span style='font-size:0.5em;'>(Boost " + lev + "/20 - next "+ (next - inputNum) + ")</span></span>" + legalLeague;
return message;
}

for (let i = 0; i < petCount; i++) {
    petCells[i].style.textAlign = "left";
    var workingNums = petCells[i].querySelectorAll('b');
    workingNums[1].innerHTML = workingNums[1].textContent + " <img src='https://battlepedia.jellyneo.net/images/newicons/physical.png' title='Attack Icon Multiplier'>" + getBoost(workingNums[1].textContent,0);
    workingNums[2].innerHTML = workingNums[2].textContent + " <img src='https://thedailyneopets.com/uploads/bp/physical-b.png' title='Defense Icon Multiplier'>" + getBoost(workingNums[2].textContent,1);
    workingNums[4].innerHTML = workingNums[4].textContent + hp(workingNums[4].textContent);
}
    // Your code here...
})();