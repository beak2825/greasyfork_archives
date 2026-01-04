// ==UserScript==
// @name         Faction Medic
// @namespace    http://tampermonkey.net/
// @version      1.6.3
// @description  Shows only faction members that are in the hospital and hides the rest.
// @author       H1k3
// @match        https://www.torn.com/factions.php?step=profile&ID=*
// @match        https://www.torn.com/profiles.php?XID=*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/402012/Faction%20Medic.user.js
// @updateURL https://update.greasyfork.org/scripts/402012/Faction%20Medic.meta.js
// ==/UserScript==
//*********************************************
//Check for revives on/off                    *
//Last modified 4/26/20 by H1K3               *
//*********************************************
if(location.href.includes('https://www.torn.com/profiles.php?XID'))
{
window.addEventListener("load", function(event) {
    var load_revive = null;clearInterval(load_revive);
    load_revive = setInterval(function()
    {
    if(document.getElementsByClassName("profile-button profile-button-revive  cross disabled")){
    clearInterval(load_revive);
     if(document.getElementsByClassName("profile-button profile-button-revive  cross disabled").length >=1)
     {console.log("yes");sessionStorage.setItem(getParameterByName('XID'), Math.floor(Date.now() / 1000));
     }else{console.log("no");}
    }

    }, 1000);
});


}
else if(location.href.includes('https://www.torn.com/factions.php?step=profile&ID'))
{

//*********************************************
//Set ShowFac                                 *
//Last modified 4/27/20 by H1K3               *
//*********************************************
var factionName = document.getElementsByClassName("faction-info-wrap another-faction")[0];console.log(factionName);
var facD = factionName;
var facD1 = facD;
if(document.getElementsByClassName("cont-gray10 bottom-round cont-toggle faction-description text-a-center")[0])
{
facD = document.getElementsByClassName("cont-gray10 bottom-round cont-toggle faction-description text-a-center")[0];
}
if(document.getElementsByClassName("title-black m-top10 title-toggle tablet top-round faction-title active")[0])
{
facD1 = document.getElementsByClassName("title-black m-top10 title-toggle tablet top-round faction-title active")[0];
}
    if(localStorage.factName == "true")
       {factionName.style.display = "block";facD1.style.display = "block";facD.style.display = "block";}else {factionName.style.display = "none";facD1.style.display = "none";facD.style.display = "none";}
var inputfac = document.createElement("input");
inputfac.type = "checkbox";
//input1.textContent = 'Hosp. Length';
inputfac.id = "hidefac";
inputfac.name = "hidefac1";
inputfac.size = 4;
inputfac.style.color = "black";
inputfac.style.backgroundColor = "#d9f2e6";
if (localStorage.factName &&localStorage.factName == "true") {inputfac.checked = localStorage.factName;}
else {localStorage.factName = "false";}
var body = document.getElementById("skip-to-content");
body.appendChild(inputfac);
inputfac.addEventListener ("click", function()
{
//var facname = document.getElementById("hidefac");
localStorage.factName=document.getElementById("hidefac").checked;console.log(document.getElementById("hidefac").checked);console.log(localStorage.factName);


if(document.getElementById("hidefac").checked)
       {factionName.style.display = "block";facD1.style.display = "block";facD.style.display = "block";}else {factionName.style.display = "none";facD1.style.display = "none";facD.style.display = "none";}


});

var newlabelfac = document.createElement("Label");
newlabelfac.setAttribute("for","hidefac1");
newlabelfac.style.color = "black";
//newlabel.style.backgroundColor = "#d9f2e6";
newlabelfac.innerHTML = " SHOW FACTION:";
body.appendChild(newlabelfac);
body.appendChild(inputfac);
//*********************************************
//Set ShowWar                                 *
//Last modified 4/27/20 by H1K3               *
//*********************************************
var warName = document.getElementById("war-react-root");
var inputwar = document.createElement("input");
if(localStorage.war == "false")
{warName.style.display = "none";}else{warName.style.display = "block";}
inputwar.type = "checkbox";
//input1.textContent = 'Hosp. Length';
inputwar.id = "warme";
inputwar.name = "warme1";
inputwar.size = 4;
inputwar.style.color = "black";
inputwar.style.backgroundColor = "#d9f2e6";
if (localStorage.war && localStorage.war == "true") {inputwar.checked = localStorage.war;}
else {localStorage.war = "false";}
body = document.getElementById("skip-to-content");
body.appendChild(inputwar);
inputwar.addEventListener ("click", function()
{
var facwar = document.getElementById("warme");
if(!document.getElementById("warme").checked)
{warName.style.display = "none";}else{warName.style.display = "block";}

    localStorage.war=document.getElementById("warme").checked;
});
var newlabelwar = document.createElement("Label");
newlabelwar.setAttribute("for","warme1");
newlabelwar.style.color = "black";
//newlabel.style.backgroundColor = "#d9f2e6";
newlabelwar.innerHTML = " SHOW WARS:";
body.appendChild(newlabelwar);
body.appendChild(inputwar);
//*********************************************
//Set TRAVEL                                  *
//Last modified 4/27/20 by H1K3               *
//*********************************************

var input22 = document.createElement("input");
input22.type = "checkbox";
//input1.textContent = 'Hosp. Length';
input22.id = "travelme";
input22.name = "travelme1";
input22.size = 4;
input22.style.color = "black";
input22.style.backgroundColor = "#d9f2e6";
if (localStorage.travelme && localStorage.travelme == "true") {input22.checked = localStorage.travelme;}
else {localStorage.travelme = "false";}
body = document.getElementById("skip-to-content");
body.appendChild(input22);
input22.addEventListener ("click", function()
{
localStorage.travelme=document.getElementById("travelme").checked;location.reload();
});
var newlabel33 = document.createElement("Label");
newlabel33.setAttribute("for","travelme1");
newlabel33.style.color = "black";
//newlabel.style.backgroundColor = "#d9f2e6";
newlabel33.innerHTML = " TRAVELLING:";
body.appendChild(newlabel33);
body.appendChild(input22);
//*********************************************
//Set OFFLINE                                 *
//Last modified 4/27/20 by H1K3               *
//*********************************************

var input2 = document.createElement("input");
input2.type = "checkbox";
//input1.textContent = 'Hosp. Length';
input2.id = "offlineme";
input2.name = "offlineme1";
input2.size = 4;
input2.style.color = "black";
input2.style.backgroundColor = "#d9f2e6";
if (localStorage.offlineme && localStorage.offlineme == "true") {input2.checked = localStorage.offlineme;}
else {localStorage.offlinememe = "false";}
body = document.getElementById("skip-to-content");
body.appendChild(input2);
input2.addEventListener ("click", function()
{
localStorage.offlineme=document.getElementById("offlineme").checked;location.reload();
});
var newlabel3 = document.createElement("Label");
newlabel3.setAttribute("for","offlineme1");
newlabel3.style.color = "black";
//newlabel.style.backgroundColor = "#d9f2e6";
newlabel3.innerHTML = " OFFLINE:";
body.appendChild(newlabel3);
body.appendChild(input2);
//*********************************************
//Set IDLE                                    *
//Last modified 4/27/20 by H1K3               *
//*********************************************

var input3 = document.createElement("input");
input3.type = "checkbox";
//input1.textContent = 'Hosp. Length';
input3.id = "idleme";
input3.name = "idleme1";
input3.size = 4;
input3.style.color = "black";
input3.style.backgroundColor = "#d9f2e6";
if (localStorage.idleme && localStorage.idleme == "true") {input3.checked = localStorage.idleme;}
else {localStorage.idleme = "false";}
body = document.getElementById("skip-to-content");
body.appendChild(input3);
input3.addEventListener ("click", function()
{
localStorage.idleme=document.getElementById("idleme").checked;location.reload();
});
var newlabel4 = document.createElement("Label");
newlabel4.setAttribute("for","idleme1");
newlabel4.style.color = "black";
//newlabel.style.backgroundColor = "#d9f2e6";
newlabel4.innerHTML = " IDLE:";
body.appendChild(newlabel4);
body.appendChild(input3);
//*********************************************
//Set Hospital time                           *
//Last modified 4/25/20 by H1K3               *
//*********************************************

var input1 = document.createElement("input");
input1.type = "text";
//input1.textContent = 'Hosp. Length';
input1.id = "hosptime";
input1.name = "hosptime1";
input1.size = 4;
input1.style.color = "black";
input1.style.backgroundColor = "#d9f2e6";
if (localStorage.hospTime) {input1.value = localStorage.hospTime;}
else {localStorage.hospTime = 0;input1.value = localStorage.hospTime;}
body = document.getElementById("skip-to-content");
body.appendChild(input1);
input1.addEventListener ("change", function()
{
localStorage.hospTime=document.getElementById("hosptime").value;location.reload();
});
var newlabel = document.createElement("Label");
newlabel.setAttribute("for","hosptime1");
newlabel.style.color = "black";
//newlabel.style.backgroundColor = "#d9f2e6";
newlabel.innerHTML = " Hospital_Time(Min):";
body.appendChild(newlabel);
body.appendChild(input1);
//*********************************************
//Set revive   time                           *
//Last modified 4/25/20 by H1K3               *
//*********************************************

var input11 = document.createElement("input");
input11.type = "text";
//input11.textContent = 'Hosp. Length';
input11.id = "revivetime";
input11.name = "revtime1";
input11.size = 4;
input11.style.color = "black";
input11.style.backgroundColor = "#d9f2e6";
if (localStorage.revTime) {input11.value = localStorage.revTime;}
else {localStorage.revTime = 10;input11.value = localStorage.revTime;}
body = document.getElementById("skip-to-content");
body.appendChild(input11);
input11.addEventListener ("change", function()
{
localStorage.revTime=document.getElementById("revivetime").value;location.reload();
});
var newlabel1 = document.createElement("Label");
newlabel1.setAttribute("for","hosptime1");
newlabel1.style.color = "black";
//newlabel.style.backgroundColor = "#d9f2e6";
newlabel1.innerHTML = " Revive_Time(Sec):";
body.appendChild(newlabel1);
body.appendChild(input11);

//*********************************************
//Hide offline, idle, and not in the hospital *
//Last modified 4/25/20 by H1K3               *
//*********************************************
var ul = document.getElementsByClassName("member-list")[0];
var items = ul.getElementsByTagName("li");
for (var i = 0; i < items.length; ++i)
{
 if(items[i].id =="" && items[i].outerHTML.includes('title=\"<b>Offline</b>\"') && document.getElementById("offlineme").checked == false){items[i].style.display = "none";}
 else if(items[i].id =="" && items[i].outerHTML.includes('title=\"<b>Idle</b>\"') && document.getElementById("idleme").checked == false){items[i].style.display = "none";}
 else if(items[i].id =="" && items[i].outerHTML.includes('title="<b>Traveling</b>"') && document.getElementById("travelme").checked == false){items[i].style.display = "none";}
 else if(items[i].id =="" && !items[i].outerHTML.includes('title="<b>Hospital</b>')){items[i].style.display = "none";}

else
{
 if (typeof items[i].getElementsByClassName("member-icons icons")[0] !== 'undefined')
 {items[i].id ='hereiam';
  var me = items[i].getElementsByClassName("member-icons icons")[0];//console.log(me.childNodes[1].lastChild.outerHTML);
  var res = me.childNodes[1].lastChild.outerHTML.split("data-time=")[1].split(">")[1].split("<")[0].split(':');
  //console.log(res);
  var seconds = (+res[0]) * 60 * 60 + (+res[1]) * 60 + (+res[2]);
 //if((localStorage.hospTime*60) <= seconds){items[i].style.display = "none";}document.getElementById("signin").name=1;
if(seconds-(localStorage.hospTime*60) >= 0)
{items[i].getElementsByClassName("days")[0].innerText = res[0]+":"+res[1]+":"+res[2];
    console.log(document.getElementsByClassName("-profile-mini-_wrapper___3agqq -profile-mini-_top___344_X mini-profile-wrapper")[0]);
    items[i].getElementsByClassName("user name")[0].addEventListener("mousedown", function()
    {console.log("DOWN");
    var load_revive = null;clearInterval(load_revive);
    load_revive = setInterval(function()
    {
    if(document.getElementsByClassName("profile-button profile-button-revive  cross disabled")){
    clearInterval(load_revive);
     if(document.getElementsByClassName("profile-button profile-button-revive  cross disabled").length >=1)
     {console.log(document.getElementsByClassName("main-desc")[0]);sessionStorage.setItem(getParameterByName("ID", document.getElementsByClassName("profile-button profile-button-revive  cross disabled").href), Math.floor(Date.now() / 1000));
      var test = document.getElementById('hereiam');document.getElementById('hereiam').id = '';document.getElementsByClassName("-profile-mini-_wrapper___3agqq -profile-mini-_top___344_X mini-profile-wrapper")[0].style.display = "none";
      test.style.display = "none";
     }else if(document.getElementsByClassName("main-desc").length >=1 && !document.getElementsByClassName("main-desc")[0].outerHTML.includes('In hospital'))
     {
     var test1 = document.getElementById('hereiam');document.getElementById('hereiam').id = '';document.getElementsByClassName("-profile-mini-_wrapper___3agqq -profile-mini-_top___344_X mini-profile-wrapper")[0].style.display = "none";
      test1.style.display = "none";
         console.log("MADE IT");
     }
        else {console.log("no");}
    }
    else
    {
     //var test1 = document.getElementById('hereiam');document.getElementById('hereiam').id = '';document.getElementsByClassName("-profile-mini-_wrapper___3agqq -profile-mini-_top___344_X mini-profile-wrapper")[0].style.display = "none";
      //test1.style.display = "none";
    }
    }, 1000);
    });


    if(sessionStorage.getItem(items[i].innerHTML.split("userID=")[1].split('">')[0]))
    {
     if((Math.floor(Date.now() / 1000)-localStorage.revTime)>=(sessionStorage.getItem(items[i].innerHTML.split("userID=")[1].split('">')[0])))
     {
     console.log("available"); sessionStorage.removeItem(items[i].innerHTML.split("userID=")[1].split('">')[0]);
     }
     else{items[i].style.display = "none";}
    }
}
else{items[i].style.display = "none";}
//console.log(seconds);
 //console.log(me.children[0]);
 }else{document.getElementsByClassName("days")[0].innerText = " H. Time";}
}
}
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}
