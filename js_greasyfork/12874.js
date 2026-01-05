// ==UserScript==
// @name           HVSTAT slim mod
// @version        1.8
// @namespace      HVMMA
// @description    Effect durations, gem icon, round counter, biribiri alert, and more
// @match          http://hentaiverse.org/*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/12874/HVSTAT%20slim%20mod.user.js
// @updateURL https://update.greasyfork.org/scripts/12874/HVSTAT%20slim%20mod.meta.js
// ==/UserScript==

var settings = {
	effectDurations : true,
	gemIcon : true,
	skillHotkey : false,
	roundCounter : true,
	noPopup : true,
	popupTime : 200,
	sparkAlert : false,
	HPalert : false,
	HPpercentage : 35,
	channeling : false,
	turnEndborder : true,
	equippedSet : true
};

// * * * * * * * * * *

var d = document, storage = sessionStorage,
    $ = function(a){return d.querySelector(a);},
    $a = function(b){return d.querySelectorAll(b);},
    create = function(c){return d.createElement(c);};

if(d.getElementById('togpane_log')){
	d.head.appendChild(create('style')).innerHTML =
		'.duration{width:30px;display:inline-block;text-align:center;position:relative;margin-left:-30px;top:-4px;}.duration>div{background:white;border:1px solid black;padding:0 2px;display:inline-block;min-width:15px;font-weight:bold;}#gem{border:1px solid black;position:absolute;float:right;right:6px;top:8px;cursor:pointer;}#round{position:relative;font-size:20px;font-weight:bold;top:-635px;left:195px;}.turnEnd{border-bottom:1px solid #5c0d11;padding-bottom:3px;}';

	// effect durations

	if (settings.effectDurations) {	
		var targets = $a('img[onmouseover^="battle.set_infopane_effect"]'), i = targets.length;
		while (i --) {
			var duration = targets[i].getAttribute('onmouseover').match(/, ([-\d]+)\)/);
			if (!duration || duration < 0) duration = '-';
			else duration = duration[1];
			var div = targets[i].parentNode.insertBefore(create('div'),targets[i].nextSibling);
			div.appendChild(create('div')).innerHTML = duration;
			div.className = 'duration';
		}
	}

	// hotkey
	
	if (settings.skillHotkey) {
		d.addEventListener('keyup',function(e) {
			if (e.keyCode != 107 || $('.btcp')) return;
			var target = $a('#togpane_magico tr:nth-child(4) ~ tr > td > div:not([style])'),
				pane = d.getElementById('togpane_magico'),toggle = d.getElementById('ckey_magic');
			if (!target.length) return;
			else target = target[target.length-1];
			while (pane.style.cssText.length) toggle.onclick();
			target.onclick();
		},false);
	}

	// gems

	if (settings.gemIcon && (gem = d.getElementById('ikey_p'))) {
		var icon;
		switch (gem.getAttribute('onmouseover').match(/'([^\s]+) Gem/)[1]) {
			case 'Mystic': icon = 'e/channeling.png'; break;
			case 'Health': icon = 'a/hp.png'; break;
			case 'Mana': icon = 'a/mp.png'; break;
			case 'Spirit': icon = 'a/sp.png'; break;
		}
		var img = d.getElementsByClassName('btp')[0].appendChild(create('img'));
		img.src = 'http://ehgt.org/v/' + icon; img.id = 'gem';
		img.setAttribute('onclick', gem.getAttribute('onclick'));
	}

	// round counter

	if(settings.roundCounter){
		var logs = $('#togpane_log tr:nth-last-child(2)').textContent;
		if(/Round/.test(logs) && !storage.rounds){
			var round = logs.match(/Round ([\d\s\/]+)/)[1];
			storage.setItem('rounds', round);
		}else{
			var round = storage.getItem('rounds') || undefined;
		}
		if(round !== undefined){
			var source = document.getElementsByClassName('clb');
      var x = source[0];
      var copy = x.lastElementChild.cloneNode(true)
      y = copy.getElementsByClassName('fd4');
      y[0].lastChild.innerHTML = 'round';
      y[1].lastChild.innerHTML = round;
      x.appendChild(copy);
			var final = round.split('/');
			switch(final[1] - final[0]){
				case 0 : x.style.color = '#ff0000'; break;
				case 1 : x.style.color = '#ffcc99'; break;
			}
		}
		if(d.getElementsByClassName('btcp')[0]) storage.removeItem('rounds');
	}

	// no popup

	if(settings.noPopup && (pop=d.getElementById('ckey_continue'))){
		var pass = pop.getAttribute('onclick');
		if(pass == 'battle.battle_continue()'){
			setTimeout(function(){pop.click();}, settings.popupTime);
		}
	}

	// spark alert

	if(settings.sparkAlert){
		if($('.bte > img[src$="fallenshield.png"]') && !storage.sparkON){
			if(!$('.bte > img[src$="sparklife.png"]')){
				alert('biribiri alert!');
				storage.setItem('sparkON', 'true');
			}
		}else if($('.bte > img[src$="sparklife.png"]') && storage.sparkON){
			storage.removeItem('sparkON');
		}
	}

	// HP alert

	if(settings.HPalert){
		var gauge = d.getElementsByClassName('cwb2')[0].width;
		if(gauge <= settings.HPpercentage * 1.2 && !storage.HPlimit){
			alert('Health is low!');
			storage.setItem('HPlimit', 'true');
		}else if(gauge > settings.HPpercentage * 1.2 && storage.HPlimit){
			storage.removeItem('HPlimit');
		}
	}

	// channeling alert

	if(settings.channeling){
		if((m = $('.bte > img[src$="channeling.png"]'))){
			if(m.nextSibling.textContent > 5) storage.setItem('channeling', 'true');
			if(!storage.channeling){
				alert('You gain channeling effect!');
				storage.setItem('channeling', 'true');
			}
		}else if(!m && storage.channeling){
			storage.removeItem('channeling');
		}
	}

	// turnend border

	if(settings.turnEndborder){
		var logRows = $a('#togpane_log tr'),
			i = logRows.length,
			prevTurn = null,
			currTurn = null;
		while(i--){
			currTurn = logRows[i].firstChild.textContent;
			if(prevTurn  && prevTurn !== currTurn) logRows[i].lastChild.className += ' turnEnd';
			prevTurn = currTurn;
		}
	}

}else{

	if(d.getElementById('riddlemaster')) return;

	// show equippedset

	if(settings.equippedSet){
		var elements = $a('#setform img');
		for(i = 0; i < elements.length; i++){
			if(/_on/.test(elements[i].src)){
				localStorage.setItem('equipped', i + 1);
				break;
			}
		}
		var set = create('div'),
		    left = d.getElementsByClassName('clb')[0],
		    hvcss = left.querySelector('.cit .fd4 > div').style.cssText;
		set.innerHTML = 'Equipped Set: ' + localStorage.getItem('equipped');
		set.style.cssText = hvcss + 'margin-right: 8px;';
		left.appendChild(set);
	}

	storage.removeItem('rounds');
	storage.removeItem('sparkON');
	storage.removeItem('channeling');
	storage.removeItem('HPlimit');
}
