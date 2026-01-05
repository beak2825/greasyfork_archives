// ==UserScript==
// @name        snap
// @namespace   k3v1
// @include     http://www.banggood.com/*?utmid=*
// @version     6
// @grant       none
// @description:en Script to help snapping at Banggood
// @description Script to help snapping at Banggood
// @downloadURL https://update.greasyfork.org/scripts/23081/snap.user.js
// @updateURL https://update.greasyfork.org/scripts/23081/snap.meta.js
// ==/UserScript==
Date.prototype.addHours = function(h) {    
   this.setTime(this.getTime() + (h*3600000)); 
   return this;   
};

Date.prototype.floorToHour = function() {
   var time = this.getTime();
   this.setTime(time-(time%3600000));
   return this;   
};

function snap() {
  document.getElementsByClassName('buynow') [0].click();
}

//The place where we will insert the field and button
var elem = document.getElementsByClassName('good_main');

//Adding input
var newdiv = document.createElement('div');
var namediv = document.createElement('div');
var condiv = document.createElement('div');
newdiv.className =  'item_box';
namediv.className = 'item_name';
namediv.innerHTML = 'Delay in ms:';
condiv.className = 'item_con';
condiv.innerHTML = '<input type=\'text\' id=\'myinput\' name=\'myInputs[]\'>';
newdiv.appendChild(namediv);
newdiv.appendChild(condiv);
elem[0].insertBefore(newdiv, elem[0].children[6]);

//Adding the button
var zNode = document.createElement('div');
var namediv2 = document.createElement('div');
var condiv2 = document.createElement('div');
zNode.className =  'item_box';
namediv2.className = 'item_name';
namediv2.innerHTML = 'Start button:';
condiv2.className = 'item_con';
condiv2.innerHTML = '<button id="myButton" type="button">Start Snapup!</button>';
zNode.appendChild(namediv2);
zNode.appendChild(condiv2);
zNode.className =  'item_box';
zNode.setAttribute('id', 'myContainer');
elem[0].insertBefore(zNode, elem[0].children[7]);

//--- Activate the newly added button.
document.getElementById('myButton').addEventListener('click', ButtonClickAction, false
);

function ButtonClickAction(zEvent) {
  var delay = document.getElementById('myinput').value;
  var hours = document.getElementsByClassName('hour');
  hours = parseInt(hours[0].innerHTML.substring(1,2));
  var startdate = new Date().addHours(hours+1).floorToHour();
  var msecs = startdate.valueOf()-Date.now();
  setTimeout(snap, msecs-delay);
  var zNode       = document.createElement ('p');
  zNode.innerHTML = 'The button was clicked. <br> Snapup time: ' + startdate.toString() + '<br> Delay: ' + delay + ' ms';
  document.getElementById ("myContainer").appendChild (zNode);
  //alert((msecs - delay)/1000 + "seconds");
}
