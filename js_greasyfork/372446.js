// ==UserScript==
// @name         PixelCanvas Captcha patcha
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  FOR THE RED BLOB
// @author       Haqua
// @match        http://pixelcanvas.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372446/PixelCanvas%20Captcha%20patcha.user.js
// @updateURL https://update.greasyfork.org/scripts/372446/PixelCanvas%20Captcha%20patcha.meta.js
// ==/UserScript==


//**** Version History ****//
//Version: 0.3:
//- Script no longer starts by default
//- added a start/end script button to the menu
//- bulk of the script runs after the page has loaded
//- changed onChange to eventListener
//- time between captchas is rounded to nearest minute
//- moved where the reset count is added to the status element to allow status that dont automatically contain the reset count
//- replaced grecapture.getResponse() with "" as it works just the same
//- fixed the timeout being set to EarlyCheck (which was 6 seconds) instead of minTimeBetweenCheck which is 30 seconds


//Version: 0.2:
//- Displays time between last 2 captchas
//- fingerprint can now be changed from the web page rather than editing this file
//- added the beginnings of a toggle menu

//Version: 0.1:
//- Basic captcha skipping

//**************************//


//fingerprint. CHANGE ON THE PAGE
	var MyFingerpring ;


//*********** HAQUAS CAPCHA SKIPPA ***********//

//load
Main();

//used to track the number of time we reset the captcha
var resetCount = 0;

//used to track if we reset the captcha last check
var LastCheckReset = false;

//how many seconds before pixel cooldown is over to check for captcha
var EarlyCheck = 6000;

//min time allowed between checks
var minTimeBetweenCheck = 30000;

//Time of last captcha
var LastCapcha;

//Time between last capture and the one before
var TimeBetweenPreviousCaptcha;

//This is the script timeout, needed for stopping the script
var ScriptTimeout;



//entry point
function Main()
{

	//Get all the stored data
	//GetStored();

	//Add the status bar
	//AddStatusDiv();

	//Starts the whole process
	//CheckAndReset();
	window.addEventListener("load", function() { GetStored(); AddStatusDiv(); });

}




//checks if we need to complete a captcha and the time left until we can place a pixel
async function CheckAndReset ()  {


	//Check for fingerpring, if there isnt one, inform the user and rerun after 30 seconds
    if(MyFingerpring =="" || MyFingerpring === undefined)
	{
		SetStatus("No Fingerprint");
		window.setTimeout(function() {CheckAndReset(); }, minTimeBetweenCheck);
		return;
	}

	//creates the message we are going to use to get what we want from the api
	const body = JSON.stringify({
		x: 2600,
		y: 250,
		color: 5,
		fingerprint: MyFingerpring,
		//gets our current captcha token
		token: "",
		a: 2600 + 250 + 8,
	});

	//sends the request to the pixel api
	const response = await fetch('/api/pixel', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: body,
		credentials: 'include',
	});

	//gets the response from the api
	try
	{
		const { success, waitSeconds, errors } = await response.json();

		//used to combine a string together that we will later pass to a function which changes the status element
		var s = "";

		//used later for displaying the time between the last 2 captchas
		var LastCapString = "";

        //if last captcha time is not undefined
		if (LastCapcha !== undefined)
		{
			//set string
			LastCapString = " " + Math.round(TimeBetweenPreviousCaptcha) + " mins between captchas. ";
		}

		//if the status = 422 (needs a captcha)
		if (response.status === 422) {
			if(LastCheckReset == true)
			{
				//If we already tried to reset the captcha last check and we still have a status of 422 then we failed :(
				s = "We Failed!!!! :( ";
			}
			else
			{
				//this should run only when we first encounter the captcha as it requires the last check to return false on LastCheckReset
				//this will run again if we encounter a new captcha
				//Get the date time of now
				var thisCapchaTime = new Date();

				if (LastCapcha === undefined)
				{
					LastCapcha = new Date();
				}

				//get the difference between the new time and the old time, originally in milliseconds / 1000 into seconds / 60 into minutes
				TimeBetweenPreviousCaptcha = ((thisCapchaTime.getTime() - LastCapcha.getTime()) / 1000) / 60

				//set now date time to the last LastCapcha date var
				LastCapcha = thisCapchaTime;

				LastCapString = " " + Math.round(TimeBetweenPreviousCaptcha) + " mins between captchas. ";

			}
			//Reset the captcha (removed)
			grecaptcha.reset();
			//Wait 3 seconds and try the next stage as grecaptcha.reset() semi refreshes the page
			window.setTimeout(function() {recaptchaexecute(2600, 250, 5);  }, 1000);

			//Set status
			s += "Captcha Reset ";
			//set that we reset the captcha this round
			LastCheckReset = true;
		}else if(response.status === 429)
		{
			s = "Rate Limit Reached";
		}
		else
		{
			if(LastCheckReset == true)
			{
				//if we make it here then by lord, we've done it!
				LastCheckReset = false;
				s = "SUCCESS we reset the captcha!!!! :)";
				//add 1 to the reset counter
				resetCount++;

			}
		}

		//If the seconds until we can place a pixel again is under EarlyCheck seconds
		if(waitSeconds * 1000 < EarlyCheck)
		{
			//wait minTimeBetweenCheck seconds (the bot should have placed a pixel by then)
			ScriptTimeout = window.setTimeout(function() {CheckAndReset(); }, minTimeBetweenCheck);
			SetStatus("Reset Count = " + resetCount + ". " + LastCapString + s + "Next Check At: ");
			AppendTime(minTimeBetweenCheck);
		}
		else
		{
			//if the time to wait
		    if(waitSeconds * 1000 < minTimeBetweenCheck)
		    {
		        //wait for minTimeBetweenCheck milliseconds to expire before rerunning
			    ScriptTimeout = window.setTimeout(function() {CheckAndReset(); }, minTimeBetweenCheck);
			    SetStatus("Reset Count = " + resetCount + ". " + LastCapString + s + "Next Check At: ");
			    AppendTime(minTimeBetweenCheck);
		    }
		    else
		    {
    			//set the timeout to EarlyCheck milliseconds before we are able to place a pixel so we can check for captchas before the bot places a pixel
    			ScriptTimeout = window.setTimeout(function() { CheckAndReset(); }, (waitSeconds * 1000) - EarlyCheck);
    			SetStatus("Reset Count = " + resetCount + ". " + LastCapString + s + "Next Check At: ");
    			AppendTime((waitSeconds * 1000) - EarlyCheck);
		    }
		}

	}
	catch(err)
	{
		SetStatus("ERROR");
		window.setTimeout(function() {CheckAndReset(); }, minTimeBetweenCheck);
		return;
	}

}


function recaptchaexecute(x, y, color){
	// removed, does not work.
	//grecaptcha.execute();

	//set the coordinates and colour of where we will test place a pixel
	window.pixel = {coordinates:[x,y],color:color};

	//pretend that we have completed a capture and send a blank token
	//window.onCapture.apply("");
	grecaptcha.execute();
}


//adds the status div to the page
function AddStatusDiv()
{
	//get the body
	var body = document.getElementsByTagName("BODY")[0];
	//create a new div
	var div = document.createElement("div");
	//give the new div an id
	div.setAttribute("id", "FJmain");
	//set the style of the div
	div.setAttribute("style", "position: absolute; left: 1em; bottom: 10em; background-color: rgba(0, 0, 0, 0.75); color: rgb(250, 250, 250); text-align: center; vertical-align: middle; line-height: 42px; width: auto; height: auto; border-radius: 21px; padding: 0px 1.5em; white-space: nowrap;");

	//create 2nd div
	var div2 = document.createElement("div");
	div2.setAttribute("id", "FJreset");
	//add some text to the div
	div2.appendChild(document.createTextNode("Reset Status:"));
	// add div to div
	div.appendChild(div2);
	//Create 2rd fiv
	var div3 = document.createElement("div");
	//Set ID
	div3.setAttribute("id", "FJcontainer");
	//Set Class
	div3.setAttribute("class", "FJHidden");
	//Set Hidden
	div3.setAttribute("Style","Display:None;");


	div.appendChild(div3);
	//add new div to body
	body.appendChild(div);

	//set menu toggle on click
	div2.addEventListener("click", ToggleFJMenu);

	//add fingerprint input box
	AddFingerprintInput();

	//add start/end script buttons
	AddStartButton();
}

function AddFingerprintInput()
{
	//get the container div
	var div = document.getElementById("FJcontainer");

	var div2 = document.createElement("div");
	div2.appendChild(document.createTextNode("Fingerprint:"));

	//create new input element
	var inpt = 	document.createElement("input");

	//Set Name
	inpt.setAttribute("ID", "FingerIn");

	//set Value
	inpt.setAttribute("Value", MyFingerpring);

	if(MyFingerpring === undefined || MyFingerpring === "")
	{
		ToggleFJMenu();
	}

	//set the input type to text
	inpt.setAttribute("type","text");

	//set the change event
	inpt.addEventListener('change', FingerprintTextChanged);

	//add the input and div elements to the container
	div.appendChild(div2);
	div.appendChild(inpt);

}

function AddStartButton()
{
	//get container
	var div = document.getElementById("FJcontainer");

	//create new div, this will be our button
	var div2 = document.createElement("div");
	div2.setAttribute("class", "FJStart");
	div2.setAttribute("style", "background-color: rgba(0, 0, 0, 0.75); margin-bottom: 10px; color: rgb(250, 250, 250); text-align: center; vertical-align: middle; line-height: 42px; width: auto; height: auto; border-radius: 21px; padding: 0px 1.5em; white-space: nowrap;");

	//set the buttons text
	div2.innerHTML = "Start Script";

	//add the event listener so we can run a script when it is clicked
	div2.addEventListener("click", ToggleScript);

	div.appendChild(div2);

	//set the text on the status bar
	SetStatus("Click here to open/close the menu. Click Start Script to start the script");
}

function FingerprintTextChanged()
{
	//set the textbox to the fingerprint
	MyFingerpring = this.value;
	//Store the fingerprint in local storage
	localStorage.setItem("fingerprint",this.value);
}

//this runs when the status menu is clicked
function ToggleFJMenu()
{
	var container =document.getElementById("FJcontainer")

	if(container.getAttribute("class") == "FJHidden")
	{
		container.setAttribute("class", "FJVisible");
		container.setAttribute("Style", "");
	}
	else
	{
		container.setAttribute("class", "FJHidden");
		container.setAttribute("Style", "Display:None;");
	}

}

//this runs when the start/end button is pressed
function ToggleScript()
{
	if(this.getAttribute("class") == "FJStart")
	{
		this.setAttribute("class", "FJEnd");
		this.innerHTML= "End Script";
		//Start the script
		CheckAndReset();
		SetStatus("Script Started");
	}
	else
	{
		this.setAttribute("class", "FJStart");
		this.innerHTML= "Start Script";
		//clear the timeout so the script doesnt execute again.
		clearTimeout(ScriptTimeout);
		SetStatus("Script Ended");
	}
}


function SetStatus(status)
{
	//find out status div
	fjDiv = document.getElementById("FJreset");
	//set its inner text
	fjDiv.innerHTML = status;
}

function AppendTime(mill)
{
	//create a new date
	var d = new Date();
	// add some milliseconds
	d.setMilliseconds(d.getMilliseconds() + mill);
	//format so we only have the time
	var s = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

	//add time to our div
	fjDiv = document.getElementById("FJreset");
	fjDiv.innerHTML += s;
}


function GetStored()
{
	//get fingerprint from local storage
	MyFingerpring = localStorage.getItem("fingerprint");
}
