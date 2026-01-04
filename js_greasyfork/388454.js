// ==UserScript==
// @name         Dr. Meth Bot
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Adds some autoclickers and Enable holding down on Dealers & Workers
// @author       Ace! _SL/S
// @match        http://drmeth.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388454/Dr%20Meth%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/388454/Dr%20Meth%20Bot.meta.js
// ==/UserScript==

var getAchievements = function()
{
	for(var x in window)
	{
		var ref = new reference(x);
		if(!Array.isArray(ref.get()) || !Array.isArray(ref.get()[0]))	//Achievements is a 2 dimensional array
			continue;													//if array has less dimensions continue

		if(ref.get()[0][0] == "Liked")	//First achievement name is Liked
			return ref;
	}
}

var getCashRef = function()
{
	var alltimeCash = searchVar("alltime");	//cash variable is randomized, so search for alltimecash

	return new reference(alltimeCash.name.replace("alltime", "")); //and remove alltime then
}

var searchVar = function(name, index)	//Loops through all vars until right one is found
{										//returns it as reference then
    var count = 0;
    for(var x in window)
    {
		if(!x.toString().startsWith(name))
			continue;

		if(count < index)
			count++;
		else
			return new reference(x);
    }
}

var reference = function(name) //Useful for wrapping variables
{
    this.name = name;
    this.get = function()
    {
        return window[this.name];	//Get Value
    };
    this.set = function(value)
    {
        window[this.name] = value;	//Set Value
    }
	this.run = function(...args)
	{
		this.get()(...args);		//Execute function
	}
}

var newButton = function(name)
{
	var btn = document.createElement("button");
	btn.innerText = name;
	document.body.appendChild(btn);

	return btn;
};
var createToggle = function(name, get, set)
{
	var btn = newButton(name + " off");
	btn.onclick = function()
	{
		set(!get());
		btn.innerText = name + (get() ? " on" : " off");
	};
}

var autoclickerEnabled = false;
var autoclickerSpeed = 1;
var autoclickOtherSpeed = 1;
var autoclickDealers = false;
var autoclickMasterDealers = false;
var autoclickStars = false;
var autoPurityClick = false;

createToggle("Autoclicker", function() { return autoclickerEnabled; }, function(value) { autoclickerEnabled = value; });
newButton("Autoclicker speed").onclick = function() //Make autoclicker "overclockable"
{
	var res = prompt("How fast shall it be sucker? (Current: " + autoclickerSpeed  + ")");
	if(res != null); //Is null when pressing cancel
		autoclickerSpeed = res;
};
createToggle("Dealers", function() { return autoclickDealers; }, function(value) { autoclickDealers = value; });
createToggle("Master Dealers", function() { return autoclickMasterDealers; }, function(value) { autoclickMasterDealers = value; });
newButton("Buying speed").onclick = function() //Make autoclicker "overclockable"
{
	var res = prompt("How fast shall it be sucker? (Current: " + autoclickOtherSpeed + ")");
	if(res != null) //Is null when pressing cancel
		autoclickOtherSpeed = res
};
createToggle("Autobuy Stars", function() { return autoclickStars; }, function(value) { autoclickStars = value; });
createToggle("Auto Chemist", function() { return autoPurityClick; }, function(value) { autoPurityClick = value; });

var achievements = getAchievements();
var cash = getCashRef();
var click = searchVar("clicked"); //Cash, Meth, Alchemist
var buy = searchVar("buy"); //Dealers, Workers
var buypeople = searchVar("buyp"); //Master Dealer, Chef etc...
var people = searchVar("people"); //Owned people
var combo = searchVar("combo", 1); //Chemist dot position
var bankeroffer = searchVar("boffer"); //Percent value banker offering
var upgrades = searchVar("upgrades"); //All Meth-Buyable upgrades

var buyArray = []; //Will be used for Autobuying on holding down

var oldBuy = buy.get(); //Backup old
buy.set(function(index, down) //Hook current
{
	if(houseorder[index - 1] == 12 && down) //Don't spam blackhole, thanks
		oldBuy(index);
	else
		buyArray[index] = down;
});

var mainLoop = setInterval(function()
{
	if(autoclickerEnabled)
	{
		for(var i = 0; i < autoclickerSpeed; i++)
		{
			click.run(1); //1 is Meth
			click.run(2); //2 is Cash
		}
	}

	for(var i = 0; i < autoclickOtherSpeed; i++)
	{
		if(autoclickDealers)
			oldBuy(1); //1 is dealer

		if(autoclickMasterDealers)
			buypeople.run(0); //0 is master dealer

		for(var idx in buyArray)
		{
			if(buyArray[idx])
				oldBuy(idx); //Use old buy, bypass new one
		}
	}

	if(autoPurityClick && combo.get() == 1) //No need to make this shit faster
		click.run(3); //3 is Purity click

	if(autoclickStars)
	{
		var canAfford = Math.floor(cash.get() / 99E12); //99E12 = 99 trillion / price of 1 star
		if(canAfford > 10000) //Safety cap to not lag game out
			canAfford = 10000;

		for(var i = 0; i < canAfford; i++)
		{
			buyh(11); //Buy house index 11 (Actual Star)

			for(var idx in houseorder)
			{
				if(houseorder[idx] == 11) //11 is actual star
				{
					oldBuy(++idx); //++idx because houseorder starts at 0 whereas oldBuy starts at 1
					break;
				}
			}
		}
	}

	//if(bankeroffer.get() != 0)
		//baccept();
}, 0);

for(let i = 1; i < 6; i++) //Loop from OPT1 to OPT5 (Worker buy buttons)
{
	var name = "OPT" + i;
	var elem = document.getElementById(name);
	var button = elem.childNodes[elem.childNodes.length < 2 ? 0 : 1];
	button.onmousedown = function() //Replace with autobuy functions
	{
		buy.run(i, true);
		buttonc(i, 3); //Button down image
	};
	button.onmouseup = function() //Replace with autobuy functions
	{
		buy.run(i, false);
		buttonc(i, 2); //Button up image
	};
}

document.getElementById("PURE").onclick = function() { } //Prevent accidentally reseting the combo

var oldloadgamec = loadgamec; //Hook Savegame loading by cookie
loadgamec = function()
{
	oldloadgamec();

	var temp = people.get();
	temp[3][3] = 1; //Unlock super Chemist
	people.set(temp);

	temp = achievements.get();
	temp[0][2] = 1; //Unlock Liked
	temp[1][2] = 1; //Unlock Refer
	temp[2][2] = 1; //Unlock donor
	temp[5][2] = 1; //Unlock 1337 (annoying af)
	achievements.set(temp);

	temp = upgrades.get();
	temp[14][3] = 1; //Buy Dark Matter
	upgrades.set(temp);

	searchVar("joelock").set(1); //Unlock second upgrade page
};

var firstLoad = true;

var oldloadgame = loadgame;
loadgame = function(s, imp)
{
	firstLoad = false; //Loaded once, allowing Save & Load now
	oldloadgame(s, 0); //Hook to remove anti import/export spam
};

var saveState = null; //Using this instead of cookie because autosave on upgrade buy

document.body.onkeydown = function(info) //Keyboard hook
{
	if(firstLoad)
		return;

	if(info.key == "s")
	{
		savegame(9); //Save game
		saveState = readCookie("save2");
	}

	if(info.key == "r" && saveState != null)
		loadgame(saveState); //Reload game
};

//alert("SLSHook loaded!");