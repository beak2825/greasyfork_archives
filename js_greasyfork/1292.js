// ==UserScript==
// @name        OrangePeeler for OrangeHRM by Mandy
// @description	  Custom Time Punch IN and Punch OUT script for OrangeHRM users. Set your time in custom time field and this will punch that time for you.Change the include url from localhost/orangehrm to your company's url.  Happy Punching...
// @namespace   mandymagic
// @author      Manjeet Dixit
// @include     http://localhost/orangehrm/symfony/web/index.php/attendance/punch*
// @include     http://localhost/orangehrm/symfony/web/index.php/auth/*
// @icon        http://www.aceperipherals.com/images/stories/principals/asustor/img/002013420_orange.png
// @version     0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/1292/OrangePeeler%20for%20OrangeHRM%20by%20Mandy.user.js
// @updateURL https://update.greasyfork.org/scripts/1292/OrangePeeler%20for%20OrangeHRM%20by%20Mandy.meta.js
// ==/UserScript==


//When this value is set to true, it will automatically punch in and 
//then automatically punch out with the default Punch in time and punch out time
var ENABLE_1_CLICK_AUTO_PUNCH_IN_PUNCH_OUT = false;

//If this value is set to true , then for the first time you try to login,
// it will do the auto login task for the given username,
//by default it is set to false
var AUTO_LOGIN = false;
var USERNAME = "your username here";
var PASSWORD = "your password here";

var DEFAULT_TIME_CUSTOM_PUNCH_IN = "10:00";
var DEFAULT_TIME_CUSTOM_PUNCH_OUT = "20:15";

var ERROR_MESSAGE = "";


$(window) .load(function () 
{

	validateAutoLoginFunction();

	if (window.location.href.indexOf('attendance/punchIn') > - 1)
    {   
		addCustomTimeBox();
        addCustomPunchInButton();
     	if(ENABLE_1_CLICK_AUTO_PUNCH_IN_PUNCH_OUT == true)
    	{
    		$("#customPunchInButton").click();
   		}
    }
    else if (window.location.href.indexOf('attendance/punchOut') > - 1)
	{
		addCustomTimeBox();
		addCustomPunchOutButton();
		if(ENABLE_1_CLICK_AUTO_PUNCH_IN_PUNCH_OUT == true)
    	{
    		$("#customPunchOutButton").click();
   		}   
	}
})


//Used to get Random Minutes
function getRandomMinutes(min,max)
{
    var minute = Math.floor(Math.random()*(max-min+1)+min);
    if(minute < 10)
        {
            minute = "0" + minute;
        }
    return minute;
}


function addCustomPunchInButton()
{
	var retryCount = 0;
	$('.inner #punchTimeForm p:first')
	.append('<input type="button" value="Custom PunchIN" id="customPunchInButton">')
	.click(function(){ 
		//alert('I was clicked!');
		if( retryCount <= 2)
		{
			if(validateTimeFormat($("#customTimeInputBox").val()))
				{
					retryCount++;
					//$('.time') .val("10:15");
					$('.time') .val($("#customTimeInputBox").val());	
					if(retryCount < 2)
						$('.punchInbutton') .click();
				}
				else
				{
					alert ("Not Valid Time Format. Please Check the time before continuing.");
				}
		}
		else
		{
			alert("It seems like you have already punched IN/OUT for the time Slot.\nVerify that your current punch IN/OUT time is not overlapping already registered slot.")
		}
		//alert($("#customTimeInputBox").val());
	});
}


function addCustomPunchOutButton()
{
	var retryCount = 0;
	$('.inner #punchTimeForm p:first')
	.append('<input type="button" value="Custom PunchOUT" id="customPunchOutButton">')
	.click(function(){ 
		//alert('I was clicked!');
		if( retryCount <= 2)
		{
			if(validateTimeFormat($("#customTimeInputBox").val()))
			{
				retryCount++;
				$('.time') .val($("#customTimeInputBox").val());	
				if(retryCount < 2)
					$('.punchOutbutton') .click();	
			}
			else
			{
				alert ("Not Valid Time Format. Please Check the time before continuing.");
			}
		}
		else
		{
			alert("It seems like you have already punched IN/OUT for the time Slot.\nVerify that your current punch IN/OUT time is not overlapping already registered slot.")
		}
		//alert($("#customTimeInputBox").val());
	});
}


//Adds a custom input box to enter custom Time
function addCustomTimeBox()
{

	if (window.location.href.indexOf('attendance/punchIn') > - 1)
	{
		var defaultTimeForInputBox = DEFAULT_TIME_CUSTOM_PUNCH_IN;
		var liLocation = 1;
	}
	else if(window.location.href.indexOf('attendance/punchOut') > - 1)
	{
		var defaultTimeForInputBox = DEFAULT_TIME_CUSTOM_PUNCH_OUT;
		var liLocation = 2;
	}

	var customLI = '<li> <label>Custom Time</label> '
			+'<span> <input type="text" name="customtime" id="customTimeInputBox" maxlength="5" value="'
			+ defaultTimeForInputBox 
			+'" style="width: 40px; height:12px; padding: 2px; border: 2px solid RED" /></span>'
			+' <span>&nbsp;HH:MM</span></li';

	var timeLI = $(".inner #punchTimeForm ol:first li").eq(liLocation);
	$(customLI).insertAfter(timeLI);
	$("customTimeInputBox").css("size",20);
}

//vALIDATES IF THE TIME IS IN CORRECT FORMAT.
//CORRECT FORMAT : HH:MM (24 HRS CLOCK)
function validateTimeFormat(inputTime)
{
	try
	{
		if(inputTime.length == 5 && inputTime.charAt(2) == ":")
		{
			var hours = inputTime.split(":")[0];
			var minutes = inputTime.split(":")[1];
			if(!isNaN(hours) && !isNaN(minutes))
			{
				if(hours < 24 && minutes < 60)
				{
					return true;
				}
			}
			else
			{
				ERROR_MESSAGE = "Not Valid Time Format. Please Check the time before continuing.";
				return false;	
			}
		}
	}
	catch(err)
	{
		ERROR_MESSAGE = "Not Valid Time Format. Please Check the time before continuing.";
		return false;	
	}
	
	
}


function validateAutoLoginFunction()
{
	if(AUTO_LOGIN == true
      && (window.location.href.indexOf('/auth/login') > - 1)
      && sessionStorage.getItem("firstTimeLogin") != "true")
	{
		sessionStorage.setItem("firstTimeLogin", "true");
		$("#txtUsername").val(USERNAME);
		$("#txtPassword").val(PASSWORD); 
        $("#btnLogin") .click();  
	}
}