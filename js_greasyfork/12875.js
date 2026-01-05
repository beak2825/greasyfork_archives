// ==UserScript==
// @name        HoverPlay
// @description:en hoverplay
// @version     1.8
// @namespace   hoverplay
// @match       http://*.hentaiverse.org/?s=Battle*
// @match       http://*.hentaiverse.org/?encounter*
// @grant       unsafeWindow
// @run-at      document-start
// @description hoverplay
// @downloadURL https://update.greasyfork.org/scripts/12875/HoverPlay.user.js
// @updateURL https://update.greasyfork.org/scripts/12875/HoverPlay.meta.js
// ==/UserScript==

//// settings:
var Spell_list = ['Storms of Njord', 'Downburst', 'Gale'];
//var Spell_list = ['Attack'];
var Spell_list_on_new_round = ['Imperil'];
var Click_cast_spell = true
var Spell_list_left_click = ['Imperil'];
var Spell_list_middle_click = ['MagNet'];
var Spell_list_right_click = ['Weaken'];
// thresholds for stop
var HP_T = 0.44;
var MP_T = 0.1;
var SP_T = 0.3;
var stop_on_rebuffs = true;
//

var observer = new MutationObserver(function(mutations) 
{
	if(typeof unsafeWindow.battle !== "undefined" && typeof unsafeWindow.battle.hover_target !== "undefined")
	{
		if(!DeadSoon() && (!Rebuffs() || !stop_on_rebuffs) && !Disabled())
		{
			var spell;
			if(Spell_list_on_new_round.length)
			{
				if(document.getElementsByClassName("btcp").length)
				{
					sessionStorage.removeItem("nr");
				}
				else if(!sessionStorage.nr)
				{
					spell = get_first_available_spell(Spell_list_on_new_round, document.getElementById("leftpane"));
					sessionStorage.nr = 1;
				}
			}
			if(!spell)
			{
				spell = get_first_available_spell(Spell_list, document.getElementById("togpane_magict"));
			}
			
			function hover_targetMY(a)
			{
				a = a.id.slice(5,6);
				if(a==0){a=10;}
				if(spell && (!document.getElementById("infopane") || document.getElementById("infopane").lastChild.lastChild.lastChild == null))
				{
					unsafeWindow.battle.lock_action(spell, 1, 'magic', spell.id);
					unsafeWindow.battle.set_hostile_subattack(spell.id);
				}
				unsafeWindow.battle.commit_target(a);
				if (typeof exportFunction === "undefined")
				{
					unsafeWindow.battle.hover_target = function(){};
				}
				else
				{
					exportFunction(function(){}, unsafeWindow.battle, {defineAs: "hover_target"});
				}
			}
			if (typeof exportFunction === "undefined")
			{
				unsafeWindow.battle.hover_target = hover_targetMY;
			}
			else
			{
				exportFunction(hover_targetMY, unsafeWindow.battle, {defineAs: "hover_target"});
			}
		}
		observer.disconnect();
	}
});
observer.observe(document, {subtree: true, childList: true});

function get_first_available_spell(from_list, in_el)
{
	var return_spell;
	for(var n=0; n < from_list.length && !return_spell; n++)
	{
		 return_spell = in_el.querySelector('div.btsd[onclick][onmouseover*="' + from_list[n] + '"]');
	}
	return return_spell;
}

function Disabled() 
{
	if(!sessionStorage.disabled)
	{
		return false;
	}
	document.title = document.title + " [MM OFF]"
	return true;
}

function DeadSoon()
{
	var bars = document.getElementsByClassName("cwb2");
	var ret = false;
	if(bars)
	{
		var HP = bars[0].offsetWidth / 120;
		var MP = bars[1].offsetWidth / 120;
		var SP = bars[2].offsetWidth / 120;
		var oc = bars[3].offsetWidth / 120;
		if(HP < HP_T)
		{
			var gem = document.getElementById('ikey_p');
			if(!gem || gem.getAttribute('onmouseover').indexOf("Health") == -1)
			{
				var bordr = 1;
				var cure = document.body.querySelector('div#\\33 11[onclick]');
				if(!cure)
				{
					cure = document.body.querySelector('div#\\33 13[onclick]');
					bordr = 3;
				}
				if(cure)
				{
					var img = document.querySelector('.btp').appendChild(document.createElement('img'));
					img.id = "h";
					img.src = "http://ehgt.org/v/a/0530.png";
					img.style.cssText = 'border: '+bordr+'px solid green;margin-right:2px;margin-left:2px;position: relative;left: -620px;top:-40px';
					img.onmouseover = cure.onclick;
				}
			}
			ret = true;
		}
		if(MP < MP_T)
		{
			var gem = document.getElementById('ikey_p');
			if((!gem || gem.getAttribute('onmouseover').indexOf("Mana") == -1) && !document.getElementsByClassName("bte")[0].querySelector('img[src="http://ehgt.org/v/e/manapot.png"]'))
			{
				var pot = document.body.querySelector('div[id*="ikey_"][onmouseover*="Mana"]'); 
				if(pot)
				{
					var img = document.querySelector('.btp').appendChild(document.createElement('img'));
					img.id = "h";
					img.src = "http://img1.wikia.nocookie.net/__cb20110327005807/maplestory/images/d/d2/Item_MP_Recovery_Potion_1500.png";
					img.style.cssText = 'border: 1px solid blue;margin-right:2px;margin-left:2px; width:30px;position: relative;left: -620px;top:-40px';
					img.onmouseover = pot.onclick;
				}
			}
			ret = true;
		}
		if(SP < SP_T)
		{
			var gem = document.getElementById('ikey_p');
			if((!gem || gem.getAttribute('onmouseover').indexOf("Spirit") == -1) && !document.getElementsByClassName("bte")[0].querySelector('img[src="http://ehgt.org/v/e/spiritpot.png"]'))
			{
				var pot = document.body.querySelector('div[id*="ikey_"][onmouseover*="Spirit"]'); 
				if(pot)
				{
					var img = document.querySelector('.btp').appendChild(document.createElement('img'));
					img.id = "h";
					img.src = "http://img3.wikia.nocookie.net/__cb20110326143020/maplestory/images/5/57/Item_Orange_Potion.png";
					img.style.cssText = 'border: 1px solid gold;margin-right:2px;margin-left:2px; width:30px;position: relative;left: -620px;top:-40px';
					img.onmouseover = pot.onclick;
				}
			}
			ret = true;
		}
		if(ret)
		{
			document.getElementById('monsterpane').setAttribute('style', 'border:2px solid #'+(111111 +8800*(SP<SP_T ? 1 : 0)+88*(MP<MP_T ? 1 : 0)+ 880000*(HP<HP_T ? 1 : 0))+ ';');
			Rebuffs();
		}
		if(oc == 1)
		{
			var s = document.body.querySelector('img[src="http://ehgt.org/v/battle/spirit_n.png"]');
			if(s)
			{
				var img = document.querySelector('.btp').appendChild(document.createElement('img'));
				img.id = "h";
				img.src = "http://ehgt.org/v/e/protection_scroll.png";
				img.style.cssText = 'border: 1px solid white;margin-right:2px;margin-left:2px; width:30px;position: relative;left: -620px;top:-40px';
				img.onmouseover = s.onclick;
			}
		}
	}
	//else{alert("some shizzle happened! can't see HP");}
	return ret;
}

function Rebuffs()
{
	var ret = false;
	var gem = document.getElementById('ikey_p');
	if (gem) 
	{
		var icon;
		switch (gem.getAttribute('onmouseover').match(/'([^\s]+) Gem/)[1]) 
		{
			case 'Mystic': icon = 'channeling.png'; break;
			case 'Health': icon = 'healthpot.png'; break;
			case 'Mana': icon = 'manapot.png'; break;
			case 'Spirit': icon = 'spiritpot.png'; break;
		};
		var img = document.querySelector('.btp').appendChild(document.createElement('img'));
		img.id = "h";
		img.src = 'http://ehgt.org/v/e/' + icon;
		img.style.cssText = 'border: 1px solid black;position: relative;left: -620px;top:-40px'; // position: absolute; float: right; right: 6px; top: 8px;
		img.onmouseover = gem.onclick;
	}
	var buff = document.getElementsByClassName("bte")[0].querySelectorAll('img[id*="effect_expire_"]');
	if(buff.length > 0)
	{
		for(var n = 0; n < buff.length; n++)
		{
			var spell_name = buff[n].getAttribute('onmouseover').match(/'([^']+)/)[1];
			if(spell_name == "Cloak of the Fallen" && !document.getElementsByClassName("bte")[0].querySelector('img[src="http://ehgt.org/v/e/sparklife.png"]'))
			{
				spell_name = "Spark of Life";
			}
			else if(spell_name == "Hastened")
			{
				spell_name = "Haste";
			}
			var spell = document.getElementById("quickbar").querySelector('div[onmouseover*="' + spell_name + '"]');
			if(spell)
			{
				ret = true;
				var img = document.querySelector('.btp').appendChild(document.createElement('img'));
				img.id = "h";
				img.src = buff[n].src;
				img.style.cssText = 'border: 1px solid black;margin-right:2px;margin-left:2px;position: relative;left: -620px;top:-40px';
				if(spell.onclick)
				{
					img.onmouseover = spell.onclick;
				}
			}
		}
	}
	if(ret && stop_on_rebuffs)
	{
		document.getElementById('monsterpane').setAttribute('style', 'border:2px solid silver;');
	}
	return ret;
}

function ConsumeItem()
{
	if(!document.getElementById("togpane_log")){return;}
	var h;
	if(h = document.getElementById("h"))
	{
		h.onmouseover();
	}
}

window.addEventListener('keydown',function(e){
if(e.keyCode==16) // SHIFT
{
	if(!document.getElementById("togpane_log")){return;}
	if(!sessionStorage.disabled)
	{
		sessionStorage.disabled = 1;
	}
	else
	{
		sessionStorage.removeItem("disabled");
	}
	e.returnValue = false;
	window.location.replace(window.location.href); // live edits are for the weak
}
else if(e.keyCode==32) // SPACE
{
	ConsumeItem();
}
else if(Spell_list.length && e.keyCode==82) // R
{
	if (typeof exportFunction === "undefined")
	{
		unsafeWindow.battle.hover_target = function(){};
	}
	else
	{
		exportFunction(function(){}, unsafeWindow.battle, {defineAs: "hover_target"});
	}
	setTimeout(function() {window.location.replace(window.location.href);},2000);
}
return;},true);

window.addEventListener("contextmenu",function(e){
	ConsumeItem();
	e.preventDefault();
return;},false);

if(Click_cast_spell)
{
	window.addEventListener("mousedown", function(e){
		if(!document.getElementById("togpane_log")){return;}
		if(e.button == 0 && Spell_list_left_click.length)
		{
			var spell = get_first_available_spell(Spell_list_left_click, document.getElementById("leftpane"));
			if(spell)
			{
				spell.onmouseover();
				spell.onclick();
			}
			e.preventDefault();
		}else if(e.button == 1 && Spell_list_middle_click.length)
		{
			var spell = get_first_available_spell(Spell_list_middle_click, document.getElementById("leftpane"));
			if(spell)
			{
				spell.onmouseover();
				spell.onclick();
			}
			e.preventDefault();
		}else if(e.button == 2 && Spell_list_right_click.length)
		{
			var spell = get_first_available_spell(Spell_list_right_click, document.getElementById("leftpane"));
			if(spell)
			{
				spell.onmouseover();
				spell.onclick();
			}
			e.preventDefault();
		}else if(e.button == 0)
	return;}, false);
}
