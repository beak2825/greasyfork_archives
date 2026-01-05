// ==UserScript==
// @name         Neoboard Bumper
// @namespace    http://tampermonkey.net/
// @version      1.1
// @author       Nyu (clraik)
// @description  Bump your neoboards automatically
// @match        http://www.neopets.com/neoboards/topic.phtml?topic=*
// @downloadURL https://update.greasyfork.org/scripts/28666/Neoboard%20Bumper.user.js
// @updateURL https://update.greasyfork.org/scripts/28666/Neoboard%20Bumper.meta.js
// ==/UserScript==


//Edit these
var topicNumber=100000000;//The topic to bump number, you can find it on the URL
var minMinutes=5;//min to wait before posting
var maxMinutes=10;//max to wait before posting
//It will generate a random number between minMinutes and maxMinutes
var bumpMessage="bump";//Writes bump on the message box
//If you want to bump with a smiley just replace bump with how you would normally make a smile
//ex:
//var bumpMessage=":D"; // Happy blue face
//var bumpMessage="*star*"; // Star




////////////////////////////////////////////////////////
//Dont edit below if you're not sure what you're doing//
////////////////////////////////////////////////////////




if(document.URL.indexOf("neoboards/topic.phtml?topic="+topicNumber+"") != -1) {

	document.getElementByName('message').value=bumpMessage;//Writes bump on the message box
	var min=minMinutes*60000;
	var max=maxMinutes*60000;
	var seconds=Math.floor(Math.random() * (max - min + 1)) + min; // Generates a random number between max and min (1000 = 1 second)
	//Math.floor(Math.random() * (max_to_wait - min_to_wait + 1)) + min_to_wait; I think 28 seconds is the minimum to wait before posting again.
    setTimeout(function(){ submit();},seconds);// Wait x seconds before posting
}
function submit(){
	document.forms.message_form.submit();//Click on submit
}