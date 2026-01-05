// ==UserScript==
// @name		BvS Retail Hotkeys
// @namespace		taltamir
// @description		Village hotkeys for BvS
// @version		6
// @history		6 Added facepalm support. Added numpad support, using numbers 1-5 on numpad has same result as 1-5 on top row keys
// @history		5 Added phone key. also pressing d, f, and c when their options don't exist won't refresh the page
// @history		4 Added empty store actions. Fixed the "moving on" button click when finished with shift/titan.
// @history		3 Store sales supported. Mouse + Keyboard play.
// @history		2 pressing any key after beating a titan will return you to scheduling (currently untested)
// @history		1 Initial version, only titans supported at the moment.
// @include		http://www.animecubed.com/billy/bvs/shop-retail.html
// @include		http://animecubed.com/billy/bvs/shop-retail.html
// @downloadURL https://update.greasyfork.org/scripts/16601/BvS%20Retail%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/16601/BvS%20Retail%20Hotkeys.meta.js
// ==/UserScript==

// DOCUMENTATION
/*
Titan keys (wasd movement):
a = move left
d = move right
s = strafe (s is down movement)
w = attack (w is up movement)
e = turn LEAP on (extra high jump).
q = turn Five Minutes to Go on (quaff potion)

Store Sales (select a customer by clicking them with the mouse and then press the action button of choice)
Store Sales keys:
d = Deodorant Bomb
c = Cleansing Fire 
f = Freebie Giveaways
p = THE PHONE
1 through 5 = performs the action in slot 1 through 5 respectively.

Note: if there is only one customer it is automatically selected, some actions (BOGO, Think Fast, Deodorant Bomb, Cleansing Fire, Freebie Giveaway, and several others) do not need a customer selected and can be executed instantly without mouse use.

When on the shift finished/titan defeated window showing a summary of gains, any button press will move on to the next page (fighting the titan or back to retail main)

DEV NOTES BELOW:
Store Sales dev notes:
I can't think of a way to quick select the main actions, the actions come from a basket and each individual action has a unique key.
That is, every refresh the values of the 1st button will be different.

However, the special actions are constant and can be automated. I am thinking of using D for deodorant bomb, F for freebie giveaways, and C for cleansing fire

Beofre any of that I need to find a way to determine that I am in the store sale section reliably. The "take action" button uses identical naming as the same button from titans. I could potentially look for a text string but that is iffy, or I could run it after the titan check with an else if. But I would prefer to be able to detect the drop down menu for choosing a target that only exists in the store.

Some collected data for the purpose of detemining if there is a pattern in the main actions

Parent form: <form name="makeaction" action="shop-retail.html" method="post" style="margin:0">

Entice in spot 1: <input type="radio" name="curact" value="12" id="x121">
Waifu call in spot 2: <input type="radio" name="curact" value="13" id="x132">
Savings Punch in spot 3: <input type="radio" name="curact" value="1" id="x13">
Barge in spot 4: <input type="radio" name="curact" value="5" id="x54">

Hey in spot 1: <input type="radio" name="curact" value="14" id="x141">
Waifu call in spot 2: <input type="radio" name="curact" value="13" id="x132">
HEY in spot 3: <input type="radio" name="curact" value="14" id="x143">
Spot clean in spot 4: <input type="radio" name="curact" value="7" id="x74">

Think Fast in spot 1: <input type="radio" name="curact" value="6" id="x61">
Spoot Clean in spot 2: <input type="radio" name="curact" value="7" id="x72">
Barge in spot 3: <input type="radio" name="curact" value="5" id="x53">
New Release in spot 4: <input type="radio" name="curact" value="10" id="x104">

Coupon Kick in spot 5: <input type="radio" name="curact" value="2" id="x25">

Deep Breath in spot 2: <input type="radio" name="curact" value="8" id="x82">
Upsell in spot 3: <input type="radio" name="curact" value="4" id="x43">

One Peaceful Moment!: <input type="radio" name="curact" value="F" id="xF">
If you have time to lean..: <input type="radio" name="curact" value="C" id="xC">
Grumble: <input type="radio" name="curact" value="S" id="xS">

Based on the above the pattern is xVP where V is the value assigned to the action in question (eg HEY is value 14) and P is postion (1 through 4)
It remains to be seen if a proper method can be made to figure out what the id is of each button.
Or perhaps when pressing the button 1, all possible options can be checked sequentially? namely x11 x21 x31 ... x141? Also need to map out the values of each actions to ensure i go high enough.

Values:
1 Savings Punch
2 Coupon Kick
3 Be Helpful
4 Upsell
5 Barge
6 Think Fast
7 Spot Clean
8 Deep Breath / Death Stare
9 Boot
10 New Releases
11 BOGO
12 Entice
13 Waifu Call
14 HEY
15 Trapdoor
16 The voice
17 Facepalm

Upgrades take up the same number as the base ability.

Deodorant Bomb: <input type="radio" name="curact" value="L" id="xL">
Cleansing Fire: <input type="radio" name="curact" value="V6" id="xV6">
Freebie Giveaways: <input type="radio" name="curact" value="Q" id="xQ">
The Phone: <input type="radio" name="curact" value="PHONE" id="xPHONE">

Data from Titans:

Parent form: <form name="makeaction" action="shop-retail.html" method="post" style="margin:0">
Move Left: <input type="radio" name="bossaction1" value="1" id="x1">
Move Right: <input type="radio" name="bossaction1" value="2" id="x2">
Attack: <input type="radio" name="bossaction1" value="3" id="x3">
Strafe: <input type="radio" name="bossaction1" value="4" id="x4">
Five Minutes to Go: <input type="checkbox" name="fiveminpotion" value="1" id="f1">
LEAP: <input type="checkbox" name="bossaction2" value="1" id="ba1">
Take action: <a href="javascript:document.makeaction.submit();" onfocus="this.blur();" style="color:000066"><b>Take Action &gt;</b></a>
*/

function submit_form(form_name)
{
	if (document.forms.namedItem(form_name))
	{
		remove_listener();											//Remove keypress listener before page refresh
		location.assign('javascript:' + form_name + '.submit()');
	}
}

function check_radio_number(num) 									//this function takes a number, finds out which action value is currently in that spot, and checks the radio button for it
{
	if(document.getElementById("x1"+num))							//check if the id exists
		document.getElementById("x1"+num).checked = true;				//if id exists, check it
	else if(document.getElementById("x2"+num))
		document.getElementById("x2"+num).checked = true;
	else if(document.getElementById("x3"+num))
		document.getElementById("x3"+num).checked = true;
	else if(document.getElementById("x4"+num))
		document.getElementById("x4"+num).checked = true;
	else if(document.getElementById("x5"+num))
		document.getElementById("x5"+num).checked = true;
	else if(document.getElementById("x6"+num))
		document.getElementById("x6"+num).checked = true;
	else if(document.getElementById("x7"+num))
		document.getElementById("x7"+num).checked = true;
	else if(document.getElementById("x8"+num))
		document.getElementById("x8"+num).checked = true;
	else if(document.getElementById("x9"+num))
		document.getElementById("x9"+num).checked = true;
	else if(document.getElementById("x10"+num))
		document.getElementById("x10"+num).checked = true;
	else if(document.getElementById("x11"+num))
		document.getElementById("x11"+num).checked = true;
	else if(document.getElementById("x12"+num))
		document.getElementById("x12"+num).checked = true;
	else if(document.getElementById("x13"+num))
		document.getElementById("x13"+num).checked = true;
	else if(document.getElementById("x14"+num))
		document.getElementById("x14"+num).checked = true;
	else if(document.getElementById("x15"+num))
		document.getElementById("x15"+num).checked = true;
	else if(document.getElementById("x16"+num))
		document.getElementById("x16"+num).checked = true;
	else if(document.getElementById("x17"+num))
		document.getElementById("x17"+num).checked = true;
}

function key_press(event)
{
	if (document.getElementById("x3"))							//checks for the existance of the attack boss radio button to determine if in boss or salesfloor.
	{
		if (event.keyCode==68)									//keypress d. for right (move right)
		{
			document.makeaction.bossaction1.value="2";			//checks the right radio button
            submit_form("makeaction");
		}
		else if (event.keyCode==65)								//keypress a. for left (move left)
		{
			document.makeaction.bossaction1.value="1";			//checks the left radio button
            submit_form("makeaction");
		}
		else if (event.keyCode==83)								//keypress s. for strafe/down (strafe)
		{
			document.makeaction.bossaction1.value="4";			//checks the strafe radio button
            submit_form("makeaction");
		}
		else if (event.keyCode==87)								//keypress w. for up (attack)
		{
			document.makeaction.bossaction1.value="3";			//checks the attack radio button
            submit_form("makeaction");
		}
		else if (event.keyCode==81)								//keypress q. for quaff (potion, aka heal)
		{
			document.getElementById("f1").checked = true;		//Sets the Five inutes to Go checkbox to true
		}
		else if (event.keyCode==69)								//keypress e. for extra (leap)
		{
			document.getElementById("ba1").checked = true;		//Sets the LEAP checkbox to true
		}
	}
	else if ((document.documentElement.textContent || document.documentElement.innerText).indexOf("Actions are pulled from a basket - pick one from the limited choices and fight! The basket is two of everything you know, when it runs out, it refreshes!") > -1)		//Check to see if you are in the store sales segment of retail by looking for unique text that only appears in that page.
	{
		if (event.keyCode==68)									//keypress d.
		{
			if(document.getElementById("xL"))					//check if "Deoderant Bomb" radio exists
			{
				document.makeaction.curact.value="L";			//checks the "Deoderant Bomb" radio
				submit_form("makeaction");						//press "Take Action"
			}
		}
		else if (event.keyCode==67)								//keypress c.
		{
			if(document.getElementById("xV6"))					//check if "Cleansing Fire" radio exists
			{
			document.makeaction.curact.value="V6";				//checks the "Cleansing Fire" radio
			submit_form("makeaction");							//press "Take Action"
			}
		}
		else if (event.keyCode==70)								//keypress f.
		{
			if(document.getElementById("xQ"))					//check if "Freebie Giveaways" radio exists
			{
			document.makeaction.curact.value="Q";				//checks the "Freebie Giveaways" radio
			submit_form("makeaction");							//press "Take Action"
			}
		}
		else if (event.keyCode==80)								//keypress p.
		{
			if(document.getElementById("xPHONE"))				//check if "THE PHONE" radio exists
			{
			document.makeaction.curact.value="PHONE";			//checks the "THE PHONE" radio
			submit_form("makeaction");							//press "Take Action"
			}
		}
		else if (event.keyCode==49 || event.keyCode==97)		//keypress 1 on either numpad or top row
		{
			if(document.getElementById("xF"))					//check "One peaceful moment" radio exists
			{
				document.getElementById("xF").checked = true;	//if it exists it is the first option, meaning 1 triggers it
				submit_form("makeaction");
			}
			else if (document.getElementById("xC"))				//check "If you have time to lean"
			{
				document.getElementById("xC").checked = true;	//if it exists but above doesn't it is first option. checks it
				submit_form("makeaction");
			}
			else if(document.getElementById("xS"))				//check "Grumble" radio exists
			{
				document.getElementById("xS").checked = true;	//if it exists but neither above then it is first option, check it.
				submit_form("makeaction");
			}
			check_radio_number("1");
			submit_form("makeaction");							//press "Take Action"
		}
		else if (event.keyCode==50 || event.keyCode==98)		//keypress 2 on either numpad or top row
		{
			if(document.getElementById("xF"))					//check "One peaceful moment" radio exists
			{
				if (document.getElementById("xC"))				//check "If you have time to lean" exists
				{
					document.getElementById("xC").checked = true;	//if both above exists, it is second option. check it
					submit_form("makeaction");
				}
				else if(document.getElementById("xS"))			//check "Grumble" radio exists
				{
				document.getElementById("xS").checked = true;	//if peaceful and grumble exists but not time to lean, then grumble is second option. check it.
				submit_form("makeaction");
				}
			}
			else if (document.getElementById("xC"))				//check "If you have time to lean" exists and one peaceful moment doesn't.
			{
				if(document.getElementById("xS"))				//check "Grumble" radio exists
				{
					document.getElementById("xS").checked = true;	//if peaceful doesn't exist, and both time to lean and grumble do, then grumble is option 2.
					submit_form("makeaction");
				}
			}
			check_radio_number("2");
			submit_form("makeaction");						//press "Take Action"
		}
		else if (event.keyCode==51 || event.keyCode==99)		//keypress 3 on either numpad or top row
		{
			if(document.getElementById("xF"))					//check "One peaceful moment" radio exists
				if (document.getElementById("xC"))				//check "If you have time to lean"
					if(document.getElementById("xS"))			//check "Grumble" radio exists
					{
						document.getElementById("xS").checked = true;	//if all 3 exists when pressing 3, then perform 3rd action.
						submit_form("makeaction");
					}
			check_radio_number("3");
			submit_form("makeaction");							//press "Take Action"
		}
		else if (event.keyCode==52 || event.keyCode==100)		//keypress 4 on either numpad or top row
		{
			check_radio_number("4");
			submit_form("makeaction");							//press "Take Action"
		}
		else if (event.keyCode==53 || event.keyCode==101)		//keypress 5 on either numpad or top row
		{
			check_radio_number("5");
			submit_form("makeaction");							//press "Take Action"
		}
	}
	else if (document.forms.namedItem("movingon"))				//Check for "Return to Scheduling" or "Face the Titan" buttons after finishing a shift or defeating a titan
	//currently bugged, it complains there is no "bossaction1" value.
	{
		submit_form("movingon");								//Click the "Return to Scheduling" button.
	}
	else remove_listener();
}

function remove_listener()
{
	window.removeEventListener("keyup", key_press, false); 			// Removes the event listener, this is critically important to prevent "playing too fast" errors when spamming the button.
}

window.addEventListener("keyup", key_press, false);					//When a key is released, run function key_press and provide it with keyID.