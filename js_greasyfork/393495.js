// ==UserScript==
// @name         Templates Dropdown & Assign
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  Adds quick response templates to PT ticket view and a quick assign button.
// @author       Marian Danilencu
// @shoutout     Sebastian Blajevici
// @update       https://greasyfork.org/scripts/393495-dropdown-final/code/Dropdown%20Final.user.js
// @download     https://greasyfork.org/scripts/393495-dropdown-final/code/Dropdown%20Final.user.js
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @include        *admin.wayfair.com/tracker*
// @grant        none
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/393495/Templates%20Dropdown%20%20Assign.user.js
// @updateURL https://update.greasyfork.org/scripts/393495/Templates%20Dropdown%20%20Assign.meta.js
// ==/UserScript==

var $ = window.jQuery;
var jQuery = window.jQuery;
var display = document.getElementById("PtuDetail");
var panel = document.getElementById("UpdatePanel_h");
var select = document.getElementById("au_1_sel");
var user = document.getElementById('serverip').innerHTML


//Create empty dropdown menu element and append to element on page

display.onclick=
function()
{
var select = document.createElement("select");
select.id = "au_1_sel";
select.name="au_1_sel";
select.class="search";
select.style.position="absolute";
select.style.backgroundColor="tomato";
select.style.color="white";
select.style.left="100px"
document.getElementById("UpdatePanel_h").appendChild(select);

// Insert options in dropdown menu
var option1 = document.createElement("option");
option1.value="Hello,\n\nDo you have any updates?\n\nThank you,";
option1.innerHTML= "Request Update";
select.appendChild(option1);


var option2 = document.createElement("option");
option2.value="Hello,\n\nThank you for your request. The [task name] has been updated as per request.\n\nPlease allow up to 24 hours for changes to reflect on site. If changes are not displayed after this time, please post an update on this ticket.\n\nRegards,";
option2.innerHTML= "Complete/Updated";
select.appendChild(option2);

var option3 = document.createElement("option");
option3.value="Hello,\n\nThank you for the request. I am rerouting this ticket towards [team] for completion.\n\nRegards,";
option3.innerHTML= "Re-route";
select.appendChild(option3);

var option4 = document.createElement("option");
option4.value="Hello,\n\nThank you for your request. The Part Numbers have been updated as per request. Should you not notice any changes please post an update on this ticket.\n\nRegards,";
option4.innerHTML= "PtNumber Updated";
select.appendChild(option4);

var option5 = document.createElement("option");
option5.value="Hello,\n\nThank you for your request. Our team is unable to make the requested changes on exclusively branded SKUs.\nPlease raise a new ticket towards the White-Labeling Team for completion.\n\nRegards,";
option5.innerHTML= "White Labeled";
select.appendChild(option5);

var option6 = document.createElement("option");
option6.value="Hallo,\n\nVielen Dank für Ihre Anfrage. Bitte bedenken Sie, das es bis zu 24h dauern kann bis die Veränderungen auf der Seite angezeigt werden. Wenn nach Ablauf der 24h keine Veränderungen stattfinden, posten Sie bitte ein Update auf diesem Ticket.\n\nVielen Dank,";
option6.id= "o1";
option6.selected="";
option6.innerHTML= "German";
select.appendChild(option6);

var option7 = document.createElement("option");
option7.value="Hello,\n\nThis ticket has exceeded its maximum processing time and will be closed before the end of the day.\nShould you still require assistance please raise a new ticket.\n\nThank you,";
option7.innerHTML= "5Days";
select.appendChild(option7);

var option8 = document.createElement("option");
option8.value="Hello,\n\nThank you for your patience. Please note that we are unable to fulfill requests if they do not comply with the latest Wayfair standards.\nCreating non-standard kits will have to start with requesting a manufacturer exception to be introduced in the kitting rules for the category and class in which the potential kit components are set.\nThere are no existing exceptions that would allow us to proceed with creating the non-standard kits you have requested. If you have further questions please reach out to your merch counterpart.\n\nRegards,";
option8.innerHTML= "Non-Standard Kit";
select.appendChild(option8);
option8.style.backgroundColor="lavender";
option8.style.color="black";

var option9 = document.createElement("option");
option9.value="Hello,\n\nThank you for your request. It looks like this is a task for another team.\nPlease contact your Wayfair relationship manager, [Name (email)] who will be assisting you in completing this task.\n\nRegards,";
option9.innerHTML= "SRM(supplier)";
select.appendChild(option9);





//This is the template insert button (it makes the selected template appear in text area)

var button = document.createElement("button");
button.innerHTML = "Insert";
document.getElementById("UpdatePanel_h").appendChild(button)
button.style.position="absolute";
button.style.left="230px";
button.style.color="white";
button.style.backgroundColor="blueviolet"
button.style.height="7%";
button.onclick=function(){
var index = select.options[select.selectedIndex].value;
if (user.indexOf("mdanilencu") != -1) {var b ="\nMarian"}
else if (user.indexOf("calexandra") != -1) { b ="\nAlexandra"}
else if (user.indexOf("vstejaru") != -1) { b ="\nVictor"}
else if (user.indexOf("cvasile") != -1) { b ="\nCristina"}
else if (user.indexOf("gmadalina") != -1) { b ="\nMadalina"}
else if (user.indexOf("smirica") != -1) { b ="\nSabina"}
else if (user.indexOf("rdiacanu") != -1) { b ="\nRaluca"}
else if (user.indexOf("fvalentino") != -1) { b ="\nValentino"}
else if (user.indexOf("vrosioru") != -1) { b ="\nValentina"}
else if (user.indexOf("tdavid") != -1) { b ="\nDavid"}
else if (user.indexOf("mmadalina") != -1) { b ="\nMadi"}
else if (user.indexOf("bcatalin") != -1) { b ="\nCatalin"}
else if (user.indexOf("lsimona") != -1) { b ="\nSimona"}
else if (user.indexOf("rlazaroiu") != -1) { b ="\nRaluca"}
else if (user.indexOf("salexandru") != -1) { b ="\nAlex"}
else if (user.indexOf("sblajevici") != -1) { b ="\nSebastian"}
else if (user.indexOf("mdorobantu1") != -1) { b ="\nLucian"}
else if (user.indexOf("odobrin") != -1) { b ="\nAndra"}
display.value=index+b;
}}

// Button for assigning ticket to self(FINISHED-check names and id's)

var header = document.getElementById("maincontainer");
var btn1 = document.createElement("button");
function createT3(){
        var $input = $('<div id="divt3" style="padding:1px 10px;z-index: 9999; position: absolute; top: 23px;left:800px;"><input id="t3" type="button" value="AssignTicket" style="" /></div>');
        $input.appendTo($("body"));
       }
createT3();
document.getElementById('t3').style.backgroundColor="lightpink";
document.getElementById('t3').style.color="white"

document.getElementById('t3').onclick= function(){

alert("Work allocation is managed by the Queue Master.");}

// Assigns agent name
//var c = document.getElementById("NameList");
//var d = document.getElementById("EmIDList");
c.click();
if (user.indexOf("mdanilencu") != -1) { c.value ="Danilencu, Marian; "}
else if (user.indexOf("calexandra") != -1) { c.value ="Alexandra, Cernestean; "}
else if (user.indexOf("vstejaru") != -1) { c.value ="Stejaru, Victor; "}
else if (user.indexOf("cvasile") != -1) { c.value ="Vasile, Cristina; "}
else if (user.indexOf("gmadalina") != -1) { c.value ="Madalina, Grosu; "}
else if (user.indexOf("smirica") != -1) { c.value ="Mirica, Sabina; "}
else if (user.indexOf("rdiacanu") != -1) { c.value ="Diacanu, Raluca; "}
else if (user.indexOf("fvalentino") != -1) { c.value ="Valentino, Florea; "}
else if (user.indexOf("vrosioru") != -1) { c.value ="Rosioru, Valentina; "}
else if (user.indexOf("tdavid") != -1) { c.value ="David, Tufan; "}
else if (user.indexOf("mmadalina") != -1) { c.value ="Madalina, Mazareanu; "}
else if (user.indexOf("bcatalin") != -1) { c.value ="Catalin, Bota; "}
else if (user.indexOf("sloghin") != -1) { c.value ="Loghin, Simona; "}
else if (user.indexOf("rlazaroiu") != -1) { c.value ="Lazaroiu, Raluca; "}
else if (user.indexOf("salexandru") != -1) { c.value ="Alexandru, Stanescu; "}
else if (user.indexOf("sblajevici") != -1) { c.value ="Blajevici, Sebastian; "}
else if (user.indexOf("mdorobantu1") != -1) { c.value ="Dorobantu, Marian Lucian; "}
//Searches for agent ID
if (user.indexOf("mdanilencu") != -1) {d.value ="1020435"}
else if (user.indexOf("calexandra") != -1) { d.value ="1019737"}
else if (user.indexOf("vstejaru") != -1) { d.value ="1025714"}
else if (user.indexOf("cvasile") != -1) { d.value ="1011183"}
else if (user.indexOf("gmadalina") != -1) { d.value ="1019739"}
else if (user.indexOf("smirica") != -1) { d.value ="1025720"}
else if (user.indexOf("rdiacanu") != -1) { d.value ="1025712"}
else if (user.indexOf("fvalentino") != -1) { d.value ="1020688"}
else if (user.indexOf("vrosioru") != -1) { d.value ="1020440"}
else if (user.indexOf("tdavid") != -1) { d.value ="1019738"}
else if (user.indexOf("mmadalina") != -1) { d.value ="1019275"}
else if (user.indexOf("bcatalin") != -1) { d.value ="1019278"}
else if (user.indexOf("sloghin") != -1) { d.value ="1020689"}
else if (user.indexOf("rlazaroiu") != -1) { d.value ="1020437"}
else if (user.indexOf("sblajevici") != -1) { d.value ="1011537"}
else if (user.indexOf("mdorobantu1") != -1) { d.value ="1028092"}
c.scrollIntoView();