// ==UserScript==
// @name     skribblio ignore
// @version  1.0.1
// @match    https://skribbl.io/*
// @namespace https://greasyfork.org/users/169540
// @description Used to block users in skribbl.io
// @downloadURL https://update.greasyfork.org/scripts/38192/skribblio%20ignore.user.js
// @updateURL https://update.greasyfork.org/scripts/38192/skribblio%20ignore.meta.js
// ==/UserScript==

var playersCount = 1;
var blackList = [];
const players = document.getElementById('containerGamePlayers');
const chatBox = document.getElementById('boxMessages');
var object = {};

players.addEventListener('click',function(ele){
	if (ele.target.id == 'button') {
    const playerId = ele.target.parentNode.id
  	if (ele.target.innerHTML == 'Block') {
    	blackList.push(playerId);
      object[playerId] = setInterval(function(){
    		if(ele.target.parentNode.getElementsByClassName('message')[0].style.display !== 'none') {
        	ele.target.parentNode.getElementsByClassName('message')[0].style.display = 'none';
        	chatBox.childNodes[chatBox.childNodes.length - 1].style.display = 'none';
        }
        if (document.getElementById(playerId) == null) {
        	clearInterval(object[playerId]);
    			blackList.splice(blackList.indexOf(playerId),1);
        }
        console.log('blocking' + playerId);
      },200);
      ele.target.innerHTML = 'Unblock';
      ele.target.parentNode.getElementsByClassName('name')[0].style.color = 'rgb(255,0,0)';
      ele.target.parentNode.getElementsByClassName('name')[0].style.textDecoration = 'line-through';
    } else {
      clearInterval(object[playerId]);
    	blackList.splice(blackList.indexOf(playerId),1);
      ele.target.parentNode.getElementsByClassName('name')[0].removeAttribute('style');
      ele.target.innerHTML = 'Block';
    }
  }
});

const check = setInterval(function () {
	if (players.childNodes.length !== playersCount) {
		playersCount = players.childNodes.length;
    const everyone = players.childNodes;
    for (key in everyone) {
      everyone[key].removeAttribute('style');
      if ((!everyone[key].innerHTML.includes('<button') && !everyone[key].innerHTML.includes('Block</button>'))) {
        if (everyone[key].getElementsByClassName('name')[0].style.color !== "rgb(0, 0, 255)") {
        	var button = document.createElement('button');
					button.innerHTML = 'Block';
          button.setAttribute('id', 'button');
  		  	everyone[key].append(button);
  	  	  if (everyone[key].getElementsByClassName('name')[0].innerHTML.length > 7) {
  	    		everyone[key].getElementsByClassName('name')[0].innerHTML = everyone[key].getElementsByClassName('name')[0].innerHTML.substring(0,7);
  	    	}
  	    	button.style.display = 'fit';
        }
      }
    }
	}
},1000);