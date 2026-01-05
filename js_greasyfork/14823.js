// ==UserScript==
// @name        New HIT Monitor v2
// @description Browser and SMS alerts for mturk HITs
// @version     5.8
// @namespace   www.redpandanetwork.org
// @include     https://www.mturk.com/mturk/HM&doNotRedirect=true
// @include     https://mail.google.com*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_xmlhttpRequest
// @grant       GM_openInTab
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/14823/New%20HIT%20Monitor%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/14823/New%20HIT%20Monitor%20v2.meta.js
// ==/UserScript==
if (window.location.toString() === "https://www.mturk.com/mturk/HM&doNotRedirect=true"){

document.title = "New HIT Monitor";
document.getElementsByTagName('table')[4].innerHTML = "";

headline = document.createElement("h1");
headline.innerHTML = "HIT Monitor";
headline.style.color = '#324F17';
headline.style.fontSize = '48';
headline.style.textAlign = 'center';
headline.style.textDecoration = "underline";
headline.style.marginBottom = "0px";
document.getElementsByTagName('table')[0].innerHTML = "";
document.getElementsByTagName('table')[0].appendChild(headline);
document.getElementById('subtabs_and_searchbar').style.visibility = "hidden";
document.getElementsByTagName('table')[0].style.border = "thick solid #324F17";
document.getElementsByTagName('table')[0].style.height = "100%";

var whites = document.createElement('div');
document.getElementsByTagName('table')[0].appendChild(whites);
whites.style.textAlign = 'center';
whites.style.marginBottom = "0px";

var ScanDelayMenu = document.createElement("select");
ScanDelayMenu.style.height ="30px";
ScanDelayMenu.style.width ="120px";
ScanDelayMenu.style.margin = "5px";
ScanDelayMenu.style.background = "#FFFFFF";
ScanDelayMenu.style.color = 'rgb(50, 79, 23)';
ScanDelayMenu.style.fontWeight = 'bold';
ScanDelayMenu.style.border = "thick solid #324F17";
whites.appendChild(ScanDelayMenu);
var optionDisplay1 = document.createElement("option");
var savedScanDelay = GM_getValue('scanDelay') ? GM_getValue('scanDelay') : "Scan Delay";
if (savedScanDelay !== "Scan Delay"){
    optionDisplay1.text = savedScanDelay + " Seconds";
} else{
    optionDisplay1.text = "Scan Delay";
    GM_setValue('scanDelay',10);
};
ScanDelayMenu.add(optionDisplay1);
var option3 = document.createElement("option");
option3.value = 3;
option3.text = "3 Seconds";
ScanDelayMenu.add(option3);
var option5 = document.createElement("option");
option5.value = 5;
option5.text = "5 Seconds";
ScanDelayMenu.add(option5);
var option7 = document.createElement("option");
option7.value = 7;
option7.text = "7 Seconds";
ScanDelayMenu.add(option7);
var option10 = document.createElement("option");
option10.value = 10;
option10.text = "10 Seconds";
ScanDelayMenu.add(option10);
var option15 = document.createElement("option");
option15.value = 15;
option15.text = "15 Seconds";
ScanDelayMenu.add(option15);
var option20 = document.createElement("option");
option20.value = 20;
option20.text = "20 Seconds";
ScanDelayMenu.add(option20);
var option30 = document.createElement("option");
option30.value = 30;
option30.text = "30 Seconds";
ScanDelayMenu.add(option30);
var option45 = document.createElement("option");
option45.value = 45;
option45.text = "45 Seconds";
ScanDelayMenu.add(option45);
var option60 = document.createElement("option");
option60.value = 60;
option60.text = "60 Seconds";
ScanDelayMenu.add(option60);
ScanDelayMenu.addEventListener(
     'change',
     function() {
         var scanDelay = document.getElementsByTagName('select')[0].value;
         GM_setValue('scanDelay',scanDelay);},
     false
  );

var SleepDelayMenu = document.createElement("select");
SleepDelayMenu.style.height ="30px";
SleepDelayMenu.style.width ="120px";
SleepDelayMenu.style.margin = "5px";
SleepDelayMenu.style.background = "#FFFFFF";
SleepDelayMenu.style.color = 'rgb(50, 79, 23)';
SleepDelayMenu.style.fontWeight = 'bold';
SleepDelayMenu.style.border = "thick solid #324F17";
whites.appendChild(SleepDelayMenu);
var optionDisplay2 = document.createElement("option");
var savedSleepDelay = GM_getValue('sleepDelay') ? GM_getValue('sleepDelay') : "Sleep Delay";
if (savedSleepDelay !== "Sleep Delay"){
    optionDisplay2.text = savedSleepDelay + " Minutes";
} else {
    optionDisplay2.text = "Sleep Delay";
};
optionDisplay2.value = savedSleepDelay;
SleepDelayMenu.add(optionDisplay2);
var choice0 = document.createElement("option");
choice0.value = 0;
choice0.text = "0 Minutes";
SleepDelayMenu.add(choice0);
var choiceHalf = document.createElement("option");
choiceHalf.value = 0.5;
choiceHalf.text = "0.5 Minutes";
SleepDelayMenu.add(choiceHalf);
var choice1 = document.createElement("option");
choice1.value = 1;
choice1.text = "1 Minute";
SleepDelayMenu.add(choice1);
var choice2 = document.createElement("option");
choice2.value = 2;
choice2.text = "2 Minutes";
SleepDelayMenu.add(choice2);
var choice3 = document.createElement("option");
choice3.value = 3;
choice3.text = "3 Minutes";
SleepDelayMenu.add(choice3);
var choice5 = document.createElement("option");
choice5.value = 5;
choice5.text = "5 Minutes";
SleepDelayMenu.add(choice5);
var choice7 = document.createElement("option");
choice7.value = 7;
choice7.text = "7 Minutes";
SleepDelayMenu.add(choice7);
var choice10 = document.createElement("option");
choice10.value = 10;
choice10.text = "10 Minutes";
SleepDelayMenu.add(choice10);
var choice15 = document.createElement("option");
choice15.value = 15;
choice15.text = "15 Minutes";
SleepDelayMenu.add(choice15);
var choice20 = document.createElement("option");
choice20.value = 20;
choice20.text = "20 Minutes";
SleepDelayMenu.add(choice20);
var choice30 = document.createElement("option");
choice30.value = 30;
choice30.text = "30 Minutes";
SleepDelayMenu.add(choice30);
var choice45 = document.createElement("option");
choice45.value = 45;
choice45.text = "45 Minutes";
SleepDelayMenu.add(choice45);
var choice60 = document.createElement("option");
choice60.value = 60;
choice60.text = "60 Minutes";
SleepDelayMenu.add(choice60);
SleepDelayMenu.addEventListener(
     'change',
     function() {
         var sleepDelay = document.getElementsByTagName('select')[1].value;
         GM_setValue('sleepDelay',sleepDelay);},
     false
  );

var autoLaunchMenu = document.createElement("select");
autoLaunchMenu.style.height ="30px";
autoLaunchMenu.style.width ="120px";
autoLaunchMenu.style.margin = "5px";
autoLaunchMenu.style.background = "#FFFFFF";
autoLaunchMenu.style.color = 'rgb(50, 79, 23)';
autoLaunchMenu.style.fontWeight = 'bold';
autoLaunchMenu.style.border = "thick solid #324F17";
whites.appendChild(autoLaunchMenu);
var optionDisplay = document.createElement("option");
var savedAutoLaunch = GM_getValue('autoLaunch') ? GM_getValue('autoLaunch') : "Auto Launch";
optionDisplay.value = savedAutoLaunch;
optionDisplay.text = savedAutoLaunch;
autoLaunchMenu.add(optionDisplay);
var value1 = document.createElement("option");
value1.value = "Auto ON";
value1.text = "Auto ON";
autoLaunchMenu.add(value1);
var value2 = document.createElement("option");
value2.value = "Auto OFF";
value2.text = "Auto OFF";
autoLaunchMenu.add(value2);
autoLaunchMenu.addEventListener(
     'change',
     function() {
         var autoLaunch = document.getElementsByTagName('select')[2].value;
         GM_setValue('autoLaunch',autoLaunch);},
     false
  );
    
var smsMenu = document.createElement("select");
smsMenu.style.height ="30px";
smsMenu.style.width ="120px";
smsMenu.style.margin = "5px";
smsMenu.style.background = "#FFFFFF";
smsMenu.style.color = 'rgb(50, 79, 23)';
smsMenu.style.fontWeight = 'bold';
smsMenu.style.border = "thick solid #324F17";
whites.appendChild(smsMenu);
var smsOption = document.createElement("option");
var savedSms = GM_getValue('sms') ? GM_getValue('sms') : "SMS Alert";
smsOption.value = savedSms;
smsOption.text = savedSms;
smsMenu.add(smsOption);
var value1 = document.createElement("option");
value1.value = "SMS ON";
value1.text = "SMS ON";
smsMenu.add(value1);
var value2 = document.createElement("option");
value2.value = "SMS OFF";
value2.text = "SMS OFF";
smsMenu.add(value2);
smsMenu.addEventListener(
     'change',
     function() {
         var smsValue = document.getElementsByTagName('select')[3].value;
         GM_setValue('sms',smsValue);},
     false
  );
    
var dataClip = document.createElement('div');
document.getElementsByTagName('table')[0].appendChild(dataClip);
dataClip.style.textAlign = 'center';
dataClip.style.marginBottom = '35px';

function importerer(){
    var importList = prompt('Import search list.\n\n**Warning** This will delete your current search list.');
    if (importList.length > 0){
        (GM_setValue("combined", importList));
        alert('Search list imported. Reload page.');
    }
}

var importer = document.createElement("input");
importer.type = "button";
importer.value = "Import";
importer.style.height ="30px";
importer.style.width ="120px";
importer.style.margin = "5px";
importer.style.marginTop = "0px";
dataClip.appendChild(importer);
importer.style.background = "#FFFFFF";
importer.style.color = 'rgb(50, 79, 23)';
importer.style.fontWeight = 'bold';
importer.style.border = "thick solid #324F17";
importer.addEventListener("click", importerer, false);

function exporterer(){
    GM_setClipboard(GM_getValue('combined'));
    alert('Search list copied to clipboard');
};

var exporter = document.createElement("input");
exporter.type = "button";
exporter.value = "Export";
exporter.style.height ="30px";
exporter.style.width ="120px";
exporter.style.margin = "5px";
exporter.style.marginTop = "0px";
dataClip.appendChild(exporter);
exporter.style.background = "#FFFFFF";
exporter.style.color = 'rgb(50, 79, 23)';
exporter.style.fontWeight = 'bold';
exporter.style.border = "thick solid #324F17";
exporter.addEventListener("click", exporterer, false);

function deleteAll(){
    var nuke = confirm('**WARNING** \n\nThis will delete all of your settings and your search list.\n\nAre you sure you want to do this?');
    if (nuke === true){
        GM_deleteValue("combined");
        GM_deleteValue("scanDelay");
        GM_deleteValue("sleepDelay");
        GM_deleteValue("autoLaunch");
        GM_deleteValue("run");
        GM_deleteValue("sms");
        alert('Storage Deleted');
    }
};

var deleter = document.createElement("input");
deleter.type = "button";
deleter.value = "Delete All";
deleter.style.height ="30px";
deleter.style.width ="120px";
deleter.style.margin = "5px";
deleter.style.marginTop = "0px";
dataClip.appendChild(deleter);
deleter.style.background = "#FFFFFF";
deleter.style.color = 'rgb(50, 79, 23)';
deleter.style.fontWeight = 'bold';
deleter.style.border = "thick solid #324F17";
deleter.addEventListener("click", deleteAll, false);

function addSms(){
    var phone = prompt('Add your phone\'s email address.\n\n\If you do not know your phone\'s email address, you can find out by sending a text from your phone to your email account.\n\n\
In order for this function to work, you need to have a gmail account and be logged into Google in the same browser that HIT Monitor is running in.');
    GM_setValue('phoneNumber',phone);
};
    
var smsAdd = document.createElement("input");
smsAdd.type = "button";
smsAdd.value = "Add SMS";
smsAdd.style.height ="30px";
smsAdd.style.width ="120px";
smsAdd.style.margin = "5px";
smsAdd.style.marginTop = "0px";
dataClip.appendChild(smsAdd);
smsAdd.style.background = "#FFFFFF";
smsAdd.style.color = 'rgb(50, 79, 23)';
smsAdd.style.fontWeight = 'bold';
smsAdd.style.border = "thick solid #324F17";
smsAdd.addEventListener("click", addSms, false);

var beforeGreens = document.createElement('div');
document.getElementsByTagName('table')[0].appendChild(beforeGreens);

function toggle(){
    if (this.style.background ==='rgb(50, 79, 23) none repeat scroll 0% 0%' || this.style.background ==='rgb(50, 79, 23)'){
        this.style.background = 'rgb(255,0,0)';
        this.style.border = "thick solid rgb(255,0,0)";
        var buttonName = this.value;
        for (f = 0; f < combined.length; f++){
            if (combined[f].split('|*|')[0].trim() === buttonName.trim()){
                dump.push(combined[f]);
                combined.splice(f,1);
            }
        }
    }
    else {
        this.style.background = 'rgb(50, 79, 23)';
        this.style.border = 'thick solid rgb(50, 79, 23)';
        var buttonName = this.value;
        for (f = 0; f < dump.length; f++){
            if (dump[f].split('|*|')[0].trim() === buttonName.trim()){
                combined.push(dump[f]);
                dump.splice(f,1);
            };
        };            
    };
};
function scrap(){
	var nameButtons = document.getElementsByClassName('nameButton');
	for (f = 0; f < nameButtons.length; f++){
		if (nameButtons[f].style.background ==='rgb(255, 0, 0) none repeat scroll 0% 0%' || nameButtons[f].style.background ==='rgb(255, 0, 0)'){
			nameButtons[f].style.background = 'rgb(50, 79, 23)';
			nameButtons[f].style.border = 'thick solid rgb(50, 79, 23)';
			var buttonName = nameButtons[f].value;
			for (f = 0; f < dump.length; f++){
				if (dump[f].split('|*|')[0].trim() === buttonName.trim()){
					combined.push(dump[f]);
					dump.splice(f,1);
				}
			}  
		}
	}
var permarray = GM_getValue("combined");
    for (f = 0; f < combined.length; f++){
        if (combined[f].split('|*|')[0].trim() === this.value.trim()){
            combined.splice(f,1);
            GM_setValue("combined", JSON.stringify(combined));
            this.remove();
        }
    }
}

function addNew(){
    var searchIn = prompt('Enter search term.\n\nYour search term can be anything that can be\
 found from the search page, including inside of links. This means that you can use requester IDs and\
 group IDs in addition to requester names, HIT titles, key words and description text.\n\n Search terms\
 are not case sensitive.');
    if (searchIn !== null){
        var nameIn = prompt('Enter name.\n\nThe name is what will appear on your buttons and in alerts, but\
 is not used in searches.');
    };
    if ((searchIn !== null) && (nameIn !== null)){
		var nameButtons = document.getElementsByClassName('nameButton');
        for (f = 0; f < nameButtons.length; f++){
		    if (nameButtons[f].style.background ==='rgb(255, 0, 0) none repeat scroll 0% 0%' || nameButtons[f].style.background ==='rgb(255, 0, 0)'){
				nameButtons[f].style.background = 'rgb(50, 79, 23)';
				nameButtons[f].style.border = 'thick solid rgb(50, 79, 23)';
				var buttonName = nameButtons[f].value;
				for (f = 0; f < dump.length; f++){
					if (dump[f].split('|*|')[0].trim() === buttonName.trim()){
						combined.push(dump[f]);
						dump.splice(f,1);
					}
				}  
			}
		}
        combined.push(nameIn + "|*|" + searchIn);
        GM_setValue("combined", JSON.stringify(combined));
        var add = document.createElement("input");
        add.type = "button";
        add.setAttribute("class","nameButton");
        add.setAttribute("title", searchIn);
        add.value = nameIn;
        add.style.marginRight = "0";
        add.style.height ="25px";
        add.style.width ="auto";
        add.style.margin = "5px";
        greens.appendChild(add);
        add.style.background = 'rgb(50, 79, 23)';
        add.style.color = "#FFFFFF";
        add.style.fontWeight = 'bold';
        add.style.border = "thick solid #324F17";
        add.addEventListener("click", toggle, false);
        add.addEventListener("dblclick", scrap, false);
    };
};

var search = document.createElement("input");
search.type = "button";
search.value = "Add Search";
search.style.height ="30px";
search.style.width ="120px";
search.style.margin = "5px";
beforeGreens.appendChild(search);
search.style.background = "#FFFFFF";
search.style.color = 'rgb(50, 79, 23)';
search.style.fontWeight = 'bold';
search.style.border = "thick solid #324F17";
search.addEventListener("click", addNew, false);

function parse(){
    var d = new Date();
    var date = (d.getMonth() + 1) + "/" + d.getDate() + "/" +  d.getFullYear();
    var seconds = ('0'  + d.getSeconds()).slice(-2);
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var ampm = hours >= 12 ? ' PM' : ' AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var shortTime = hours + ":" + minutes + ampm;
    var mediumTime = hours + ":" + minutes + ":" + seconds + ampm;
    var fullTime = date + " " + hours + ":" + minutes + ":" + seconds + ampm;
    scanTime.innerHTML = "Last scan: " + mediumTime;
    if (GM_getValue("run") === "running"){ 
        GM_xmlhttpRequest({
        method: "GET", 
        url: "https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&sortType=LastUpdatedTime%3A1&doNotRedirect=true",
        onload: function(response) {
            for (f = 0; f < combined.length; f++){
                if (response.responseText.toLowerCase().indexOf(combined[f].split('|*|')[1].toLowerCase()) !== -1){
                    if (response.responseText.toLowerCase().indexOf('groupid=' + combined[f].split('|*|')[1].toLowerCase()) !== -1){
                        var linko = "https://www.mturk.com/mturk/preview?groupId=" + combined[f].split('|*|')[1] + "&doNotRedirect=true";
                    }
                    else if (response.responseText.toLowerCase().indexOf('requesterid=' + combined[f].split('|*|')[1].toLowerCase()) !== -1){
                        var linko = "https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&requesterId=" + combined[f].split('|*|')[1] + "&doNotRedirect=true";
                    }
                    else {
                        var linko = "https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords=" + combined[f].split('|*|')[1] + "&minReward=0.00&x=0&y=0&doNotRedirect=true";
                    }
                    autoLaunch = document.getElementsByTagName('select')[2].value;
                    GM_setValue('autoLaunch',autoLaunch);
                    if (GM_getValue('autoLaunch') === 'Auto ON'){
                        GM_openInTab(linko); 
                    } 
                    BellSound = new Audio("http://static1.grsites.com/archive/sounds/musical/musical002.wav");
                    BellSound.play();
                    var smsCheck = GM_getValue('sms') ? GM_getValue('sms') : 'false';
                    if (smsCheck === 'SMS ON'){
                        var alertText = combined[f].split('|*|')[0] + " " + shortTime;    
                        var gmailCompose = window.open("https://mail.google.com/mail/u/0/h/?&cs=b&pv=tl&v=b");    
                        function getMessage(event){
                            var msg = event.data;
                            if (msg.toString() === "gmailLoaded"){
                                gmailCompose.postMessage("alertData" + alertText, '*');
                            }
                        }  
                        window.addEventListener("message", getMessage, false);
                    }
                    var alertLink = document.createElement('a');
                    alertLink.href = linko;
                    alertLink.innerHTML = combined[f].split('|*|')[0];
                    temp.unshift(" " + combined[f].split('|*|')[0] + " " + shortTime);
                    recent.innerHTML = "Most recent: " + temp;
                    logs.innerHTML = fullTime + " ";
                    logs.appendChild(alertLink);
                    var alerted = combined[f].split('|*|')[0];
                    var buttonz = document.getElementsByClassName('nameButton'); 
                    for (b = 0; b < buttonz.length; b++){
                        if (buttonz[b].value.trim() === alerted.trim()){
                            buttonz[b].style.background = 'rgb(255,0,0)';
                            buttonz[b].style.border = "thick solid rgb(255,0,0)";
                            var buttonName = buttonz[b].value;
                            for (f = 0; f < combined.length; f++){
                                if (combined[f].split('|*|')[0].trim() === buttonName.trim()){
                                    dump.push(combined[f]);
                                    combined.splice(f,1);
                                }
                            }
                            setTimeout(function(){
			                    var sleepDelayPh = GM_getValue('sleepDelay') ? GM_getValue('sleepDelay') : 300;
                                var buttonz = document.getElementsByClassName('nameButton'); 
                                for (f = 0; f < buttonz.length; f++){
                                    if (buttonz[f].value === buttonName && (buttonz[f].style.background === 'rgb(255, 0, 0) none repeat scroll 0% 0%' || buttonz[f].style.background ==='rgb(255, 0, 0)')){
                                        buttonz[f].click();
                                    }
                                }                            
                            },60000 * GM_getValue('sleepDelay'));
                        }
                    }                
                }
            }             
         }        
        });
        setTimeout(function(){
	        var scanDelayPh = GM_getValue('scanDelay') ? GM_getValue('scanDelay') : 10;
	        parse();	  
	    },1000 * GM_getValue('scanDelay'));
    };
};

GM_setValue("run", "off");

function scan(){
    if (GM_getValue("run") === "running"){        
        GM_setValue("run", "off");
        run.value = "Run";
        run.style.background = 'rgb(255, 255, 255)';
        run.style.color = 'rgb(50, 79, 23)';
    } else { 
        GM_setValue("run", "running");
        run.value = "Running";
        run.style.color = 'rgb(255, 255, 255)';
        run.style.background = 'rgb(50, 79, 23)';
        parse();
    }; 
};

var run = document.createElement("input");
run.type = "button";
run.value = "Run";
run.style.height ="30px";
run.style.width ="120px";
run.style.margin = "5px";
beforeGreens.appendChild(run);
run.style.background = "#FFFFFF";
run.style.color = 'rgb(50, 79, 23)';
run.style.fontWeight = 'bold';
run.style.border = "thick solid #324F17";
run.addEventListener("click", scan, false);

var greens = document.createElement('div');
document.getElementsByTagName('table')[0].appendChild(greens);

var scanTime = document.createElement('div');
document.getElementsByTagName('table')[0].appendChild(scanTime);
scanTime.innerHTML = "Last scan:";
scanTime.style.color = '#324F17';
scanTime.style.fontSize = '16';
scanTime.style.fontWeight = 'bold';
scanTime.style.marginLeft = '6px';
scanTime.style.marginTop = '18px';

var logs = document.createElement('div');
document.getElementsByTagName('table')[0].appendChild(logs);
logs.style.color = '#324F17';
logs.style.fontSize = '16';
logs.style.fontWeight = 'bold';
logs.style.marginLeft = '6px';
logs.style.marginTop = '18px';

var recent = document.createElement('div');
document.getElementsByTagName('table')[0].appendChild(recent);
recent.style.color = '#324F17';
recent.style.fontSize = '12';
recent.style.fontWeight = 'bold';
recent.style.marginLeft = '6px';
recent.style.marginTop = '18px';



var combined = [];
var dump = [];
var temp = [];

GM_deleteValue("dataBase");
var combinedPh = GM_getValue('combined') ? GM_getValue('combined') : "";

var nameGet = JSON.parse(combinedPh);
for (f=0; f < nameGet.length; f++){
    combined.push(nameGet[f]);
};
var alpha = combined.sort(function (a, b) {
    return a.toLowerCase().localeCompare(b.toLowerCase());
});
    
for (f=0; f < combined.length; f++){
    var add = document.createElement("input");
    add.type = "button";
    add.setAttribute("class","nameButton");
    add.setAttribute("title", alpha[f].split('|*|')[1]);
    add.value = alpha[f].split('|*|')[0];
    add.style.marginRight = "0";
    add.style.height ="25px";
    add.style.width ="auto";
    add.style.margin = "5px";
    add.style.fontWeight = 'bold';
    add.style.border = "thick solid #324F17";
    greens.appendChild(add);
    add.style.background = 'rgb(50, 79, 23)';
    add.style.color = "#FFFFFF";
};    
var nameButtons = document.getElementsByClassName('nameButton');
for (f = 0; f < nameButtons.length; f++){ 
    nameButtons[f].addEventListener("click", toggle, false);
    nameButtons[f].addEventListener("dblclick", scrap, false);
};
    
};

if (window.location.toString().indexOf("mail.google.com") !== -1){ 
    
    var closeable = GM_getValue('closeable') ? GM_getValue('closeable') : 'false';
    if (closeable === 'true' && document.body.innerHTML.match("Your message has been sent")){
        GM_setValue('closeable','false');
        window.close();
    }
    
    if (document.body.innerHTML.match("Do you really want to use HTML Gmail?")){ 
        document.getElementsByTagName('input')[1].click();
    }    
    else {
        window.opener.postMessage("gmailLoaded", '*');  

        function retrieveMessage(event){
            var msg = event.data;
            if (msg.toString().indexOf('alertData') !== -1){
                document.getElementById('to').value = GM_getValue('phoneNumber');
                document.querySelectorAll("input[name='subject']")[0].value = "New HIT Alert: " + msg.replace('alertData','');
                document.querySelectorAll("textarea[name='body']")[0].value = "New HIT Alert: " + msg.replace('alertData','');
                GM_setValue('closeable','true'); 
                document.querySelectorAll("input[name='nvp_bu_send']")[0].click();               
            } else {
                    setTimeout(function(){
                    window.opener.postMessage("gmailLoaded", '*');
                    },0300);
            }
        }
        window.addEventListener("message", retrieveMessage, false);
    }
}