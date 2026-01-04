// ==UserScript==
// @name     DragonMoney
// @description Money
// @version  1
// @grant    none
// @match    *://drgn.to/crash
// @namespace https://greasyfork.org/users/79323
// @downloadURL https://update.greasyfork.org/scripts/387535/DragonMoney.user.js
// @updateURL https://update.greasyfork.org/scripts/387535/DragonMoney.meta.js
// ==/UserScript==

// Текст

var toStart = 'Стартуем';
var toStop = 'Стопэ';

// Кнопка с сайта

var button = document.getElementsByClassName( 'buttonin buttonin--crash bet-button' )[0];
var bet = button.innerHTML;

// Моя кнопка


var myButton = document.createElement( 'button' );
myButton.innerHTML = toStart;

myButton.onclick = function(){

  // Меняю название кнопки
	if( myButton.innerHTML == toStart ){
    myButton.innerHTML = toStop
  }else{
    myButton.innerHTML = toStart
  }

};

button.parentNode.insertBefore( myButton, button.nextSibling );

// Клик функция

function Click(){
  
  if( myButton.innerHTML == toStop && button.innerHTML == bet ){
  
    button.click();
  
  }

}

// Кликаю по кд если работает

setInterval( Click, 1000 );