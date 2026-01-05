//// ==UserScript==
// @name        some little script
// @namespace   lilsc
// @description Hack cursors
// @homepage	https://eu4.salesforce.com
// @match		https://eu4.salesforce.com
// @include		/^https://eu4.salesforce.com*
// @version 0.0.1.20170323132122
// @downloadURL https://update.greasyfork.org/scripts/28286/some%20little%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/28286/some%20little%20script.meta.js
// ==/UserScript==

document.body.innerHTML = document.body.innerHTML.replace(/-/g, 'Kaputt');
document.body.innerHTML = document.body.innerHTML.replace(/Cold Caller/g, '');
Element.prototype.remove = function() {
	this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
	for(var i = this.length - 1; i >= 0; i--) {
		if(this[i] && this[i].parentElement) {
			this[i].parentElement.removeChild(this[i]);
		}
	}
}


function loadScript(src, callback)
{
	var s,
	r,
	t;
	r = false;
	s = document.createElement('script');
	s.type = 'text/javascript';
	s.src = src;
	s.onload = s.onreadystatechange = function() {
    //console.log( this.readyState ); //uncomment this line to see which ready states are called.
    if ( !r && (!this.readyState || this.readyState == 'complete') )
    {
    	r = true;
    	callback();
    }
};
t = document.getElementsByTagName('script')[0];
t.parentNode.insertBefore(s, t);
}
loadScript('https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js', function () {
	WebFont.load({
		google: {
			families: ['Press Start 2P']
		}
	})
});

table = document.querySelector('.reportTable');
everything = document.body.childNodes;
document.body.style.background="white";
document.body.style.setProperty('display', 'flex', 'important');
document.body.style.setProperty('flex-direction', 'column', 'important');
document.body.style.setProperty('height', '100vh', 'important');
document.body.style.setProperty('align-items', 'center', 'important');
document.body.style.setProperty('justify-content', 'center', 'important');
while(everything.length)
	document.body.removeChild(everything[0]);
document.body.append(table);

// function loadfonts() {
// 	var script = document.createElement("script");
// 	script.src = "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js";
// 	script.type = "text/javascript";
// 	document.getElementsByTagName("head")[0].appendChild(script);
// }
// loadfonts();


newtable = document.querySelectorAll('tbody *');
for (var i = 0; i < newtable.length; i++) {
	newtable[i].style.setProperty('background-color', 'white', 'important');
	newtable[i].style.setProperty('font-size', 'large', 'important');
	newtable[i].style.setProperty('font-family', '"Press Start 2P"', 'important');
	newtable[i].style.setProperty('color', 'black', 'important');
	newtable[i].style.setProperty('padding', '15px', 'important');
}
z = document.querySelectorAll('tr.headerRow:nth-child(1)');
for (var i = 0; i < z.length; i++) {
	z[i].remove();
}
// z = document.querySelectorAll('tr.grandTotalRow');
// for (var i = 0; i < z.length; i++) {
// 	z[i].remove();
// }
z = document.querySelectorAll('td.drilldown');
for (var i = 0; i < z.length; i++) {
	z[i].remove();
}
z = document.querySelectorAll('tr td:nth-child(2)');
for (var i = 0; i < z.length; i++) {
	z[i].remove();
}
z = document.querySelectorAll('br');
for (var i = 0; i < z.length; i++) {
	z[i].remove();
}
q = document.createElement('th');
t = document.createTextNode('Dials')
q.appendChild(t)
q.style.setProperty('background-color', 'white', 'important');
q.style.setProperty('font-size', 'large', 'important');
q.style.setProperty('font-family', '"Press Start 2P"', 'important');
q.style.setProperty('color', 'black', 'important');
q.style.setProperty('padding', '15px', 'important');
x = document.querySelector('tr:nth-child(1)')
x.appendChild(q)

imagescontainer = document.createElement('div')
document.body.insertBefore(imagescontainer, table);

gifcontainer = document.createElement('img')
gifcontainer.src = 'http://www.adspert.net/downloads/8bit-carlosrun.gif'
gifcontainer.style.height = '100px'
gifcontainer.style.width = 'auto'

logocontainer = document.createElement('div')
logocontainer.style.display = 'inline-block'


logotext = document.createElement('p')
logotext.style.setProperty('font-size', '24px', 'important');
logotext.style.setProperty('font-family', '"Press Start 2P"', 'important');
logotext.style.setProperty('text-align', 'center', 'important');
logotext.style.setProperty('margin', '0', 'important');
logotext.innerHTML = 'GLOBAL SDR TEAM'


logo = document.createElement('img')
logo.src = 'http://www.adspert.net/downloads/8bit-adspertlogo.png'
logo.style.height = '100px'
logo.style.width = 'auto'
imagescontainer.appendChild(logocontainer)
logocontainer.appendChild(logo)
logocontainer.appendChild(logotext)
imagescontainer.appendChild(gifcontainer)



values = ['Name','Kaputt', 'Appointment', 'Brutto', 'Netto', 'Grand Total']
players = document.querySelectorAll('tr').length;
playersdata = [];
kaputt = [];
appointments = [];
netto = [];
brutto = []
for (var i = 1; i < players; i++) {
	playersdata.push([]);
	appointments.push([]);
	netto.push([]);
	brutto.push([]);
	kaputt.push([]);

	if (i == players-1) {
		for (var j = 0; j < 6; j++){
			if (j==0){
				playersdata[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('th')[j].querySelector('strong').innerHTML);
				kaputt[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('td')[j].innerHTML);
			}
			if (j==1){
				playersdata[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('td')[j-1].innerHTML);
				appointments[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('td')[j].innerHTML);
			}
			if (j==2){
				playersdata[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('td')[j-1].innerHTML);
			}
			if (j==3){
				playersdata[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('td')[j-1].innerHTML);
				brutto[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('td')[j-1].innerHTML);
			}
			if (j==4){
				playersdata[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('td')[j-1].innerHTML);
				netto[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('td')[j-1].innerHTML);
			}
			if (j==5){
				playersdata[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('td')[j-1].querySelector('b').innerHTML);
			}
		}
	}
	else{
		for (var j = 0; j < 6; j++){
			if (j==5){
				playersdata[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('td')[j].querySelector('b').innerHTML);
			}
			else{
				playersdata[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('td')[j].innerHTML);
			}
			if (j==1){
				kaputt[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('td')[j].innerHTML);
			}
			if (j==2){
				appointments[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('td')[j].innerHTML);
			}
			if (j==3){
				brutto[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('td')[j].innerHTML);
			}
			if (j==4){
				netto[i-1].push(document.querySelectorAll('tr')[i].querySelectorAll('td')[j].innerHTML);
			}
		}
	}
	
}
apptr = [];
for (i = 0; i<document.querySelectorAll('tr').length; i++){
	if (i==0) {
		apptr[i] = document.querySelectorAll('tr')[0];
	}
	if (i == document.querySelectorAll('tr').length-1) {
		apptr[i] = document.querySelectorAll('tr')[document.querySelectorAll('tr').length-1]
	}
	apptr[i] = document.querySelectorAll('tr')[i]
}


apptd = [];
for (i = 0; i<document.querySelectorAll('tr').length; i++){
	if (i==0) {
		apptd[i] = document.querySelectorAll('tr')[0].querySelectorAll('th')[2];
	}
	else if (i == document.querySelectorAll('tr').length-1) {
		apptd[i] = document.querySelectorAll('tr')[document.querySelectorAll('tr').length-1].querySelectorAll('td')[1]
	}
	else{
		apptd[i] = document.querySelectorAll('tr')[i].querySelectorAll('td')[2]
	}
}
for (i = 0; i<apptr.length; i++){
	apptr[i].appendChild(apptd[i]);
}

lastrowcells = apptr[apptr.length-1].querySelectorAll('td')
lastrowfirstcell = apptr[apptr.length-1].querySelector('th')
lastrowfirstcell.style.setProperty('border-top', '3px solid black')
for (i = 0; i < lastrowcells.length; i++){
	lastrowcells[i].style.setProperty('border-top', '3px solid black')
}



localStorage.kaputt = kaputt;
if (typeof localStorage.kaputtold == 'undefined') {
	localStorage.kaputtold = localStorage.kaputt;
}
if(localStorage.kaputt != localStorage.kaputtold){
	var audio = new Audio('http://themushroomkingdom.net/sounds/wav/smb/smb_kick.wav');
	audio.play();
	localStorage.kaputtold = localStorage.kaputt;
}
localStorage.appointments = appointments;
if (typeof localStorage.appointmentsold == 'undefined') {
	localStorage.appointmentsold = localStorage.appointments;
}
if(localStorage.appointments != localStorage.appointmentsold){
	var audio = new Audio('http://themushroomkingdom.net/sounds/wav/smb/smb_stage_clear.wav');
	audio.play();
	localStorage.appointmentsold = localStorage.appointments;
}
localStorage.netto = netto;
if (typeof localStorage.nettoold == 'undefined') {
	localStorage.nettoold = localStorage.netto;
}
if(localStorage.netto != localStorage.nettoold){
	var audio = new Audio('http://themushroomkingdom.net/sounds/wav/smb/smb_1-up.wav');
	audio.play();
	localStorage.nettoold = localStorage.netto;
}
localStorage.brutto = brutto;
if (typeof localStorage.bruttoold == 'undefined') {
	localStorage.bruttoold = localStorage.brutto;
}
if(localStorage.brutto != localStorage.bruttoold){
	var audio = new Audio('http://themushroomkingdom.net/sounds/wav/smb/smb_coin.wav');
	audio.play();
	localStorage.bruttoold = localStorage.brutto;
}
