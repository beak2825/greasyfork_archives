// ==UserScript==
// @name         dr_loungeIgroneRoom
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  デュラチャ　ラウンジ荒らし対策
// @author       You
// @match        http://drrrkari.com/*
// @downloadURL https://update.greasyfork.org/scripts/434448/dr_loungeIgroneRoom.user.js
// @updateURL https://update.greasyfork.org/scripts/434448/dr_loungeIgroneRoom.meta.js
// ==/UserScript==

document.querySelectorAll('.rooms').forEach((e)=>{
	var btnEntry = e.querySelector('button');
	if(!btnEntry){ return 0; }
	
	btnEntry.style.width = '50px';
	
	var btnHide = document.createElement('button');
	btnHide.appendChild(document.createTextNode('x'));
	btnHide.style.background = '#F47C3C';
	btnHide.style.borderRadius = '3px';
	btnHide.style.borderWidth = 0;
	btnHide.style.color = 'white';
	e.querySelector('.login form').appendChild(btnHide);
	
	btnHide.addEventListener('click', function(e){
		e.preventDefault();

		var roomid = e.target.previousElementSibling.value;
		console.log(roomid);

		var strageHideRoomValues = localStorage.getItem('hideRoomValues');
		var arrHideRoomValues = [];
		if(strageHideRoomValues){
			arrHideRoomValues = JSON.parse(strageHideRoomValues);
			arrHideRoomValues.push(roomid);
		}
		else{
			arrHideRoomValues.push(roomid);
		}
		localStorage.setItem('hideRoomValues', JSON.stringify(arrHideRoomValues));
		
		var roomsUl = e.target.parentElement.parentElement.parentElement;
		roomsUl.style.display = 'none';
	});
	
	var strageHideRoomValues = localStorage.getItem('hideRoomValues');
	if(strageHideRoomValues){
		var arrHideRoomValues = JSON.parse(strageHideRoomValues);
		var roomid = e.querySelector('.login input').value;
		
		if(arrHideRoomValues.indexOf(roomid) !== -1){
			console.log('hide', roomid);
			e.style.display = 'none';
		}
	}
});
