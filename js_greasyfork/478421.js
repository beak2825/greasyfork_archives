// ==UserScript==
// @name         Google meet spammer
// @description  Spams in google meet
// @match        *://meet.google.com/*
// @version 1.2.3.3
// @namespace Google meet spammer
// @downloadURL https://update.greasyfork.org/scripts/478421/Google%20meet%20spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/478421/Google%20meet%20spammer.meta.js
// ==/UserScript==

const emojis = ['💖', '👍', '🎉', '👏', '😂', '😮', '😢', '🤔', '👎'];
const container = document.createElement('div');
container.style.position = 'fixed';
container.style.zIndex = '9999';
document.body.appendChild(container);
let checkbox0 = false;
let checkbox1 = false;
let checkbox2 = false;
let checkbox3 = false;
let checkbox4 = false;
let checkbox5 = false;
let checkbox6 = false;
let checkbox7 = false;
let checkbox8 = false;
let spam = false;
let time = 500;
var buttons = 0;
var button0 = 0;
var button1 = 0;
var button2 = 0;
var button3 = 0;
var button4 = 0;
var button5 = 0;
var button6 = 0;
var button7 = 0;
var button8 = 0;

const containerHand = document.createElement('div');
container.appendChild(containerHand);
const containerJoins = document.createElement('div');
container.appendChild(containerJoins);
let spamHand = false;
let timeHand = 500;
let joinCount = 2;
let buttonsHand = null;
let buttonHand = null;

function delayHand(delayInms) {
return new Promise(resolve => {
   setTimeout(() => {
    resolve(2);
  }, delayInms);
 });
}
async function startHand() {
while(1){
    await delayHand(timeHand);
    if(spamHand){
		buttonHand.click();
    }
  }
}

function delay(delayInms) {
return new Promise(resolve => {
   setTimeout(() => {
    resolve(2);
  }, delayInms);
 });
}
if (window.location.search.includes('?autoConnect')) {
                let element = document.getElementsByClassName('AeBiU-RLmnJb');
                setInterval(() => {
                    element = document.getElementsByClassName('AeBiU-RLmnJb');
                    if (element.length > 0) {
                        element[0].click();
                    }
                }, 100);
                let element2 = document.getElementsByClassName('mUIrbf-LgbsSe mUIrbf-LgbsSe-OWXEXe-Bz112c-M1Soyc mUIrbf-LgbsSe-OWXEXe-dgl2Hf mUIrbf-GqqPG-wdeprb-FoKg4d-dgl2Hf-ppHlrf TcfcKf');
                setInterval(() => {
                    element2 = document.getElementsByClassName('mUIrbf-LgbsSe mUIrbf-LgbsSe-OWXEXe-Bz112c-M1Soyc mUIrbf-LgbsSe-OWXEXe-dgl2Hf mUIrbf-GqqPG-wdeprb-FoKg4d-dgl2Hf-ppHlrf TcfcKf');
                    if (element2.length > 0) {
                        element2[0].click();
                    }
                }, 100);
            }
async function start() {
while(1){
    await delay(time);
    if(spam){
        if(checkbox0){
            button0.click();
        }
	if(checkbox1){
	    button1.click();
    	}
    	if(checkbox2){
            button2.click();
    	}
    	if(checkbox3){
            button3.click();
    	}
    	if(checkbox4){
            button4.click();
    	}
    	if(checkbox5){
            button5.click();
    	}
    	if(checkbox6){
            button6.click();
    	}
    	if(checkbox7){
            button7.click();
    	}
    	if(checkbox8){
            button8.click();
    	}
      }
    }
}

for (let i = 0; i < emojis.length; i++) {
  const checkbox = document.createElement('input');
  const label = document.createElement('label');
  const emoji = document.createTextNode(emojis[i]);
  checkbox.type = 'checkbox';
  label.appendChild(checkbox);
  label.appendChild(emoji);
  container.appendChild(label);
  if (i==0) {
     checkbox.addEventListener('change', function() {
        checkbox0 = checkbox.checked;
     })
  }
  if (i==1) {
     checkbox.addEventListener('change', function() {
        checkbox1 = checkbox.checked;
     })
  }
  if (i==2) {
     checkbox.addEventListener('change', function() {
        checkbox2 = checkbox.checked;
     })
  }
  if (i==3) {
     checkbox.addEventListener('change', function() {
        checkbox3 = checkbox.checked;
     })
  }
  if (i==4) {
     checkbox.addEventListener('change', function() {
        checkbox4 = checkbox.checked;
     })
  }
  if (i==5) {
     checkbox.addEventListener('change', function() {
        checkbox5 = checkbox.checked;
     })
  }
  if (i==6) {
     checkbox.addEventListener('change', function() {
        checkbox6 = checkbox.checked;
     })
  }
  if (i==7) {
     checkbox.addEventListener('change', function() {
        checkbox7 = checkbox.checked;
     })
  }
  if (i==8) {
     checkbox.addEventListener('change', function() {
        checkbox8 = checkbox.checked;
     })
  }
}
const checkbox = document.createElement('input');
const label = document.createElement('label');
const text = document.createTextNode('GO!!!');
checkbox.type = 'checkbox';
label.appendChild(checkbox);
label.appendChild(text);
container.appendChild(label);
checkbox.addEventListener('change', function() {
    buttons = document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ sg22sf");
    if(buttons.length > 0){
	button0 = buttons[0];
	button1 = buttons[1];
	button2 = buttons[2];
	button3 = buttons[3];
	button4 = buttons[4];
	button5 = buttons[5];
	button6 = buttons[6];
	button7 = buttons[7];
	button8 = buttons[8];
    	spam = checkbox.checked;
    }else{
	checkbox.checked=false;
    }
})

const input = document.createElement('input');
input.type = 'number';
input.value = 500;
input.min = 1;
input.addEventListener('blur', function() {
  time = input.value;
});
container.appendChild(input);

const checkboxHand = document.createElement('input');
const labelHand = document.createElement('label');
const textHand = document.createTextNode('GO!!!');
checkboxHand.type = 'checkbox';
labelHand.appendChild(checkboxHand);
labelHand.appendChild(textHand);
containerHand.appendChild(labelHand);
checkboxHand.addEventListener('change', function() {
        buttonsHand = document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe fzRBVc tmJved xHd4Cb rmHNDe");
    if(buttonsHand.length > 0){
		buttonHand = buttonsHand[1];
    	spamHand = checkboxHand.checked;
    }else{
		checkboxHand.checked=false;
    }
})

const inputHand = document.createElement('input');
inputHand.type = 'number';
inputHand.value = 500;
inputHand.min = 1;
inputHand.addEventListener('blur', function() {
    timeHand = inputHand.value;
});
containerHand.appendChild(inputHand);

const btnJoins = document.createElement('button');
containerJoins.appendChild(btnJoins);
btnJoins.appendChild(document.createTextNode('SPAM joins!'));
btnJoins.addEventListener("click", joinNow);

let url = 'hi'

function joinNow(){
    url = window.location.href + "?autoConnect";
    for (let i = 0; i < joinCount; i++) {
        window.open(url, '_blank');
    }
}

const inputJoins = document.createElement('input');
inputJoins.type = 'number';
inputJoins.value = 2;
inputJoins.min = 1;
inputJoins.addEventListener('blur', function() {
    joinCount = inputJoins.value;
});
containerJoins.appendChild(inputJoins);

startHand();
start();