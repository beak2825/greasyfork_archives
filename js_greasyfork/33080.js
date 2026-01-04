// ==UserScript==
// @name       Analiza wpisów
// @namespace  http://www.wykop.pl/*
// @version    1.0
// @description wpisy godziny
// @include     *://www.wykop.pl/*
// @exclude      *://www.wykop.pl/cdn/*
// @copyright  Arkatch
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/33080/Analiza%20wpis%C3%B3w.user.js
// @updateURL https://update.greasyfork.org/scripts/33080/Analiza%20wpis%C3%B3w.meta.js
// ==/UserScript==
Array.prototype.clean = function(deleteValue) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == deleteValue) {         
      this.splice(i, 1);
      i--;
    }
  }
  return this;
};

(function(){
	var STREAM = document.getElementById('itemsStream');
	var SMALL = STREAM.getElementsByClassName('affect');
	var TITLE = [];
	var DATA = [];
	var CON = [];
	var T_3_7 = 0;
	var T_8_12 = 0;
	var T_13_17 = 0;
	var T_18_23 = 0;
	var T_0_2 = 0;
	
	for(var i = 0, j = SMALL.length;i<j;i++){
		try{
			TITLE[i] = SMALL[i].querySelector('time[title]');
		}catch(e){
			continue;
		}
	}
	TITLE.clean(null);
	for(var i = 0, j = TITLE.length;i<j;i++){
		DATA[i] = TITLE[i].title;
	}
	for(var i = 0, j = DATA.length;i<j;i++){
		let temp = DATA[i];
		CON[i] = {
			rok:		parseInt(temp[0]+temp[1]+temp[2]+temp[3]),
			miesiac:	parseInt(temp[5]+temp[6]),
			dzien:		parseInt(temp[8]+temp[9]),
			godzina:	parseInt(temp[11]+temp[12]),
			minuta:		parseInt(temp[14]+temp[15]),
			sekunda:	parseInt(temp[17]+temp[18])
		};
	}
	for(var i = 0, j = CON.length;i<j;i++){
		let temp = CON[i].godzina;
		if(temp>=3 && temp<=7){
			T_8_12++;
		}else if(temp>=8 && temp<=12){
			T_8_12++;
		}else if(temp>=13 && temp<=17){
			T_13_17++;
		}else if(temp>=18 && temp<=23){
			T_18_23++;
		}else if(temp>=0 && temp<=2){
			T_0_2++;
		}
	}
	console.log("Wpisy pomiędzy 0, a 2: ", T_0_2);
	console.log("Wpisy pomiędzy 3, a 7: ", T_3_7);
	console.log("Wpisy pomiędzy 8, a 12: ", T_8_12);
	console.log("Wpisy pomiędzy 13, a 17: ", T_13_17);
	console.log("Wpisy pomiędzy 18, a 23: ", T_18_23);
})();