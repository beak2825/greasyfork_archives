// ==UserScript==
// @name         Catalog Enrichment Assistant-IND
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  Includes: new dashboard, doubt autocomplete,spreadsheet api,other improvements
// @author       Marian Danilencu
// @include        *https://admin.wayfair.com/tracker/views*
// @include        *https://admin.wayfair.com/tracker/frames/88.php?PrtID*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400918/Catalog%20Enrichment%20Assistant-IND.user.js
// @updateURL https://update.greasyfork.org/scripts/400918/Catalog%20Enrichment%20Assistant-IND.meta.js
// ==/UserScript==
var $ = window.jQuery;
var jQuery = window.jQuery;
function execute(){

//*****************************************************************************************************
//*****************************************************************************************************

//***********Update ticket info reminder************************
var stat=document.getElementById("ticketinfo").innerText
function checkInput(input, words) {
 return words.some(word => new RegExp(word, "i").test(input));
}

var check1=document.createElement("div")
check1.style.cssText="line-height:33px;letter-spacing:1px;font-size:23px;white-space:pre-wrap;position:absolute;top:3px;left:13px;width:33px;height:35px;background:#e2780d;border-radius:3px 0px 0px 3px;color:white"
check1.innerText=" ⚠"
var check2=document.createElement("div");
check2.style.cssText="white-space:pre-wrap;display:block;position:absolute;top:0px;left:33px;height:31px;width:600px;background:white;border-style:solid;border-color:#e2780d;border-radius:0px 3px 3px 0px;border-width:2px;background:#fcf1e6;font-size:13px;color:#e2780d;line-height:13px"
check2.innerText=" Don't forget to update Category, SKU Count & List,Rank(99 if no action is necessary)\n Note that this may affect your quality score"
document.getElementById("maincontainer").appendChild(check1)
check1.appendChild(check2)





document.getElementById("js-category").style.cssText="border:red;border-style:solid;border-width:1px"
document.getElementById("js-merch-type").style.cssText="border:red;border-style:solid;border-width:1px"
document.getElementsByClassName("js-sku-count")[0].style.cssText="border:red;border-style:solid;border-width:1px"
document.getElementsByClassName("js-sku")[0].style.cssText="border:red;border-style:solid;border-width:1px"
document.getElementById("PrtRank").style.cssText="border:red;border-style:solid;border-width:1px;width:50px"

//***********Check if Collection***************

if(checkInput(stat,["Collection","collection","Collections","collection","Collection updates","Collection update","collection updates","collection update","Update collection","update collections"])){
var container2=document.getElementsByClassName("ticketbox")[0]
var collectionalert=document.createElement("div");
collectionalert.style.cssText="white-space:pre-wrap;position:absolute;height:45px;width:480px;top:44px;left:430px;background:#F0E68C;border:solid;color:red;border-color:black;border-width:1px;border-radius:3px"
collectionalert.innerText="💡 If the author is requesting collection updates for White Labeled SKUs,\n     please re-route to White Label SKU Requests and Updates - EB Maintenance"
container2.appendChild(collectionalert)}

//******************Check last updated********************
var x = document.getElementsByClassName("boldtext")[0].innerText

var y = x.split(' ').slice(0,3).join(' ');
var uday=y.split(' ').slice(0,1)
var month1=y.split(' ').slice(1,2)
var uyear=y.split(' ').slice(2,3)
var umonth;
if(month1=="January"){umonth="01"} else if(month1=="February"){umonth="02"}else if(month1=="March"){umonth="03"}else
if(month1=="April"){umonth="04"}else
if(month1=="May"){umonth="05"}else
if(month1=="June"){umonth="06"}else
if(month1=="July"){umonth="07"}else
if(month1=="August"){umonth="08"}else
if(month1=="September"){umonth="09"}else
if(month1=="October"){umonth="10"}else
if(month1=="November"){umonth="11"}else
if(month1=="December"){umonth="12"}

var date1 = uyear+"-"+umonth+"-"+uday;
var date= new Date()
var date2 = date.getFullYear()+ '-' +(date.getMonth() + 1)+ '-' + date.getDate()

date1 = date1.split('-');
date2 = date2.split('-');
date1 = new Date(date1[0], date1[1], date1[2]);
date2 = new Date(date2[0], date2[1], date2[2]);
date1.unixtime = parseInt(date1.getTime() / 1000);
date2.unixtime = parseInt(date2.getTime() / 1000);
var timeDifference = date2.unixtime - date1.unixtime;
var timeDifferenceInHours = timeDifference / 60 / 60;
var timeDifferenceInDays = timeDifferenceInHours/ 24;
//**********************************************************************************************
//Alert if last update from agent was more than 2 days ago
if(timeDifferenceInDays>2){
var ucontainer= document.getElementById("updatescontainer").innerText
var lastupdate=document.getElementsByClassName("boldtext")[0].innerText
if(checkInput(lastupdate,["Alexandru Stanescu","Mazareanu Madalina","Raluca Lazaroiu","Catalin Bota","Luciana Chivu","Alexandra Cernestean","Madalina Grosu","Sabina Mirica","Raluca Diacanu","Valentino Florea","David Tufan","Valentina Rosioru","Marian Danilencu"]))
{document.getElementsByClassName("boldtext")[0].style.color="red"
 document.getElementsByClassName("boldtext")[0].innerText=document.getElementsByClassName("boldtext")[0].innerText+"⚠️ Your last update was "+Math.round(timeDifferenceInDays)+" days ago"}
//Alert if no update for more than 2 days
else if(checkInput(ucontainer,["Stanescu","Mazareanu","Lazaroiu","Bota","Chivu","Cernestean","Grosu","Sabina Mirica","Diacanu","Florea","Tufan","Rosioru","Danilencu"])){}
else{document.getElementsByClassName("boldtext")[0].style.color="red"
 document.getElementsByClassName("boldtext")[0].innerText=document.getElementsByClassName("boldtext")[0].innerText+"⚠️ Last updated "+Math.round(timeDifferenceInDays)+" days ago"}}


//*************Check if author is supplier**********************
var trigger = document.getElementById("updatescontainer").getElementsByClassName("boldtext");
for(var i =0; i < trigger.length; i++) {
if(trigger[i].innerText.includes("(")==false){
if(trigger[i].innerText.includes("The System")){}
else{
trigger[i].style.color="red";
trigger[i].innerText=trigger[i].innerText+" <-- Supplier"}}}


//************The Fun Part***************
var min=document.getElementsByName("PttMinutes")[0];
var hr=document.getElementsByName("PttHours")[0];
var action=document.getElementById("Action");
min.style.cssText="visibility:hidden";
hr.style.cssText="visibility:hidden";
action.style.cssText="position:absolute;top:131px;left:46px;";
// Create body
var divbody=document.createElement("div");
divbody.id="bd1"
divbody.style.cssText="line-height:170%;white-space:pre-wrap;border-radius:3px;border-style:solid;border-color:#01768b;border-width:1px;position:relative;left:0px;top:-600px;width:364px;height:155px;background:white;color:black"
document.getElementById("ticketdetailscontainer").appendChild(divbody);
divbody.appendChild(hr);
divbody.appendChild(min);

var zoom = Math.round(window.devicePixelRatio * 100);
if(zoom=="100"){divbody.style.top="-680px"}
else if(zoom=="110"){divbody.style.top="-660px"}
else if(zoom=="125"){divbody.style.top="-640px"}


var tool= document.createElement("div");
tool.style.cssText="line-height:23px;border-width:1px;border-style:solid;border-color:black;position:absolute;width:310px;height:20px;left:30px;top:3px;background:#01768b;color:white;font-weight:bold;font-size:17px;font-family:Sans-Serif;white-space:pre-wrap;border-radius:3px";
tool.innerText=" Affected by a Tool Error"
divbody.appendChild(tool);
divbody.appendChild(action);
var doubt= document.createElement("div");
doubt.style.cssText="line-height: 23px;border-width:1px;border-style:solid;border-color:black;position:absolute;width:310px;height:20px;left:30px;top:30px;background:#01768b;color:white;font-weight:bold;font-size:17px;font-family:Sans-Serif;white-space:pre-wrap;border-radius:3px";
doubt.innerText=" A Doubt ticket was raised"
divbody.appendChild(doubt);
var notap= document.createElement("div");
notap.style.cssText="line-height: 23px;border-width:1px;border-style:solid;border-color:black;position:absolute;width:310px;height:20px;left:30px;top:57px;background:#01768b;color:white;font-weight:bold;font-size:17px;font-family:Sans-Serif;white-space:pre-wrap;border-radius:3px";
notap.innerText=" No issues"
divbody.appendChild(notap);

//time and status
var time=document.createElement("div");
time.style.cssText="position:absolute;top:96px;left:2px;height:20px;width:40px";
time.innerText="Time:"
divbody.appendChild(time);

var stats=document.createElement("div");
stats.style.cssText="position:absolute;top:126px;left:2px;height:20px;width:40px";
stats.innerText="Status:"
divbody.appendChild(stats);

//Update button
var button=document.createElement("button")
button.type="submit"
button.id="update_page"
button.style.cssText="opacity:0.0;background:white;color:white";
divbody.appendChild(button);


//Doubt Button
var doubtb=document.createElement("input");
doubtb.id="submit-doubt";
doubtb.value="Open Doubt";
doubtb.type="button";
doubtb.style.cssText="background:#01768b;border-radius:4px;position:absolute;top:96px;left:293px;color:white";
divbody.appendChild(doubtb);

doubtb.onclick=function(){
if(document.getElementById("framed")){}else{
var doubtframe=document.createElement("iframe");
doubtframe.id="framed";
document.getElementById("bd1").appendChild(doubtframe);
doubtframe.style.cssText="position:relative;top:-120px;left:-906px;width:860px;height:1000px"
doubtframe.src="https://admin.wayfair.com/v/tracker/ticket_entry/offshore_ticket_entry/index"
//**************************************************************************************

function autocomplete(){
parent.document.getElementById("framed").contentWindow.document.getElementsByClassName("admin-DropdownInput-iconWrapper")[0].dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));
parent.document.getElementById("framed").contentWindow.document.getElementById("downshift-0-item-0").dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));
//Select Doubt scrum
//Autocomplete


//Select fields
parent.document.getElementById("framed").contentWindow.document.getElementsByClassName("admin-DropdownInput-iconWrapper")[1].dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));
parent.document.getElementById("framed").contentWindow.document.getElementById("downshift-1-item-1").dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));

parent.document.getElementById("framed").contentWindow.document.getElementsByClassName("admin-DropdownInput-iconWrapper")[2].dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));
parent.document.getElementById("framed").contentWindow.document.getElementById("downshift-2-item-7").dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));

parent.document.getElementById("framed").contentWindow.document.getElementsByClassName("admin-DropdownInput-iconWrapper")[3].dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));
parent.document.getElementById("framed").contentWindow.document.getElementById("downshift-3-item-5").dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));

parent.document.getElementById("framed").contentWindow.document.getElementsByClassName("admin-DropdownInput-iconWrapper")[4].dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));
parent.document.getElementById("framed").contentWindow.document.getElementById("downshift-4-item-11").dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));

parent.document.getElementById("framed").contentWindow.document.getElementsByClassName("admin-DropdownInput-iconWrapper")[5].dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));
parent.document.getElementById("framed").contentWindow.document.getElementById("downshift-5-item-0").dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));

parent.document.getElementById("framed").contentWindow.document.getElementsByClassName("admin-DropdownInput-iconWrapper")[6].dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));
parent.document.getElementById("framed").contentWindow.document.getElementById("downshift-6-item-0").dispatchEvent(new MouseEvent("click",{bubbles: true, cancellable: true}));
parent.document.getElementById("framed").contentWindow.document.getElementsByClassName("admin-TextInput-input is-valid")[0].value=parent.document.getElementById("ticketid").querySelectorAll("a")[0].innerText

}

var btauto = document.createElement("button");
btauto.id="autoc";
btauto.type="button"
btauto.innerText="Autocomplete"
divbody.appendChild(btauto);
btauto.style.cssText="position:absolute;top:95px;left:164px;border-radius:3px;background:#9a5ca2;color:white"
btauto.onclick=function(){autocomplete()};


}}
//Create checkboxes
var c1=document.createElement("input");
c1.id="tooler"
c1.type="checkbox";
c1.style.cssText="width:20px;position:absolute;height:20px;left:2px;top:4px"
c1.checked=false;
divbody.appendChild(c1);
var c2=document.createElement("input");
c2.id="doubtr"
c2.type="checkbox";
c2.style.cssText="width:20px;position:absolute;height:20px;left:2px;top:32px"
c2.checked=false;
divbody.appendChild(c2);
var c3=document.createElement("input");
c3.type="checkbox";
c3.style.cssText="width:20px;position:absolute;height:20px;left:2px;top:58px"
c3.checked=false;
divbody.appendChild(c3);


var severity=document.createElement("div")
severity.style.cssText="font-weight: normal;line-height:25px;font-size:11px;white-space:pre-wrap;color:black;visibility:hidden;position:absolute;width:270px;height:72px;left:0px;top:22px"
tool.appendChild(severity)
severity.innerText="     Low Impact - Tool was fixed within the same day\n     Medium Impact - Tool Down for 1-2 days\n     High Impact - Tool down for 3+ days"
var rad1=document.createElement("input");
rad1.name="sradio"
rad1.value="ToolError-Low"
rad1.style.cssText="position:absolute;top:5px;left:0px"
rad1.type="radio"
severity.appendChild(rad1)
var rad2=document.createElement("input");
rad2.style.cssText="position:absolute;top:30px;left:0px"
rad2.type="radio"
rad2.value="ToolError-Med"
rad2.name="sradio"
severity.appendChild(rad2)
var rad3=document.createElement("input");
rad3.style.cssText="position:absolute;top:55px;left:0px"
rad3.type="radio"
rad3.name="sradio"
rad3.value="ToolError-Hi"
severity.appendChild(rad3)

rad1.onclick=function(){input2.value=rad1.value;
min.style.cssText="position:absolute;top:100px;left:93px;visibility:visible";
hr.style.cssText="position:absolute;top:100px;left:46px;visibility:visible";}
rad2.onclick=function(){input2.value=rad2.value
min.style.cssText="position:absolute;top:100px;left:93px;visibility:visible";
hr.style.cssText="position:absolute;top:100px;left:46px;visibility:visible";}
rad3.onclick=function(){input2.value=rad3.value
min.style.cssText="position:absolute;top:100px;left:93px;visibility:visible";
hr.style.cssText="position:absolute;top:100px;left:46px;visibility:visible";}
//Checkbox functions
//***************Tool Error impact********************************************
c1.onclick=function(){if (c1.checked == true){
c2.style.visibility="hidden";
c3.style.visibility="hidden";
doubt.style.visibility="hidden";
notap.style.visibility="hidden";
severity.style.visibility="visible";
rad1.checked= false;
rad2.checked= false;
rad3.checked= false;

c2.disabled=true;c3.disabled=true}
else

{input2.value="";
min.style.cssText="visibility:hidden";
min.value="";
hr.style.cssText="visibility:hidden";
hr.value="";
doubt.style.visibility="visible";
notap.style.visibility="visible";
c2.style.visibility="visible";
c3.style.visibility="visible";
severity.style.visibility="hidden";



c2.disabled=false;c3.disabled=false};};
//****************************************************************************
c2.onclick=function(){if (c2.checked == true){
input2.value="A Doubt ticket was raised";
min.style.cssText="position:absolute;top:100px;left:93px;visibility:visible";
hr.style.cssText="position:absolute;top:100px;left:46px;visibility:visible";
c1.disabled=true;c3.disabled=true}
else
{input2.value="";
min.style.cssText="visibility:hidden";
min.value="";
hr.style.cssText="visibility:hidden";
hr.value="";
c1.disabled=false;c3.disabled=false}};

c3.onclick=function(){if (c3.checked == true){
min.style.cssText="position:absolute;top:100px;left:93px;visibility:visible";
hr.style.cssText="position:absolute;top:100px;left:46px;visibility:visible";
c1.disabled=true;c2.disabled=true}
else
{min.style.cssText="visibility:hidden";
min.value="";
hr.style.cssText="visibility:hidden";
hr.value="";
c1.disabled=false;c2.disabled=false}};

//create Tooltip
var tooltip1= document.createElement("div");
tooltip1.innerText="Click one of the checkboxes to unlock Time Log and complete the ticket"
divbody.appendChild(tooltip1);
var tooltip= document.createElement("div");
tooltip1.appendChild(tooltip);
tooltip1.style.visibility="hidden";
tooltip.style.visibility="hidden";
//Tooltip action
function hidetip(){
tooltip1.style.visibility="hidden";
tooltip.style.visibility="hidden";}
function showtip(){
tooltip1.style.cssText="opacity:0.7;text-align:center;white-space:pre-wrap;position:absolute;top:-60px;left:1px;border-radius:4px;height:50px;width:300px;background:black;color:white";
tooltip.style.cssText="opacity:0.9;position:absolute;top:50px;left:35px;margin-left:-8px;width:0;height:0;border-top:8px solid black;border-right:8px solid transparent;border-left:8px solid transparent";};
c1.onmouseover=showtip;
c2.onmouseover=showtip;
c3.onmouseover=showtip;
c1.onmouseout=hidetip;
c2.onmouseout=hidetip;
c3.onmouseout=hidetip;

//Clean Page//Hide elements
var container=document.getElementById("ticketdetailscontainer");
var table=container.querySelectorAll("table")[1];
table.querySelectorAll("td")[0].style.display="none";
table.querySelectorAll("td")[1].style.display="none";
table.querySelectorAll("td")[24].style.display="none";
table.querySelectorAll("td")[25].style.display="none";
table.querySelectorAll("td")[26].style.display="none";
table.querySelectorAll("td")[27].style.display="none";
table.querySelectorAll("td")[28].style.display="none";
table.querySelectorAll("td")[29].style.display="none";
table.querySelectorAll("td")[34].style.display="none";
table.querySelectorAll("td")[35].style.display="none";
table.querySelectorAll("td")[36].style.display="none";
table.querySelectorAll("td")[37].style.display="none";
table.querySelectorAll("td")[38].style.visibility="hidden";
table.querySelectorAll("td")[39].style.visibility="hidden";
table.style.cssText="position:absolute;left:940px;top:400px";
table.style.cssText="position:relative;top:170px";
document.getElementsByClassName("button-emphasized")[0].style.display="none";
document.getElementsByClassName("button-emphasized")[1].style.display="none";


//********************************************Spreadsheet*********************************************************
//************************Form that collects data for spreadsheet****************************
var newform= document.createElement('form');
newform.style.cssText="visibility:hidden;position:absolute;top:10px;left:15px"
newform.id="test-form"
newform.name="submit-to-google-sheet";
var input1=document.createElement("input");
input1.type="input"
input1.name="TicketID"
newform.appendChild(input1);
var input2=document.createElement("input");
input2.type="input"
input2.name="IssueType"
newform.appendChild(input2);
var input3=document.createElement("input");
input3.type="input"
input3.name="Category"
newform.appendChild(input3);
var input4=document.createElement("input");
input4.type="input"
input4.name="Date"

newform.appendChild(input4);
var send=document.createElement("button");
send.type="button"
send.innerText="Update"
send.style.cssText="position:absolute;top:129px;left:302px;border-radius:4px;background: rgb(1, 118, 139);color:white";
send.id="submit-form"
divbody.appendChild(send);
document.body.appendChild(newform);


// ************************This data is sent to spreadsheet***********************************
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10) {
 dd='0'+dd
}
if(mm<10) {
 mm='0'+mm}
today = mm+'/'+dd+'/'+yyyy;
input4.value=today
input1.value=document.getElementById("ticketid").querySelectorAll("a")[0].innerText

if (category=="1851"){input3.value="Class Updates and SKU Re-classing";}//class updates
else if
(category=="1857"){input3.value="Collection Updates";}//collection updates
else if
(category=="1859"){input3.value="Create New SKU";}//create new sku
else if
(category=="1852"){input3.value="Description";}//description
else if
(category=="2210"){input3.value="Emergency Takedown";}//emergency takedown
else if
(category=="1855"){input3.value="Kits";}//kits
else if
(category=="1856"){input3.value="Manufacturer Updates";}//manufacturer updates
else if
(category=="1870"){input3.value="Media";}//media
else if
(category=="1860"){input3.value="Options/Joins and SKU Set Up Changes";}//option joins and sku setup
else if
(category=="1864"){input3.value="Other";}//other
else if
(category=="1866"){input3.value="Related Items";}//related items
else if
(category=="1854"){input3.value="Status/Fulfillment/Shipping";}//status fulfillment critical
else if
(category=="1853"){input3.value="Update Schema/Attribute Structure";}//update schema
//********************************************************************************************


//**************Serialize-converts data to json***********************************************
$.fn.serializeObject = function(){

var self = this,
json = {},
push_counters = {},
patterns = {
"validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
"key":/[a-zA-Z0-9_]+|(?=\[\])/g,
"push":/^$/,
"fixed":    /^\d+$/,
"named":    /^[a-zA-Z0-9_]+$/
};


this.build = function(base, key, value){
base[key] = value;
return base;
};

this.push_counter = function(key){
if(push_counters[key] === undefined){
push_counters[key] = 0;
}
return push_counters[key]++;
};

$.each($(this).serializeArray(), function(){

// Skip invalid keys
if(!patterns.validate.test(this.name)){
return;
}
var k,
keys = this.name.match(patterns.key),
merge = this.value,
reverse_key = this.name;
while((k = keys.pop()) !== undefined){
// Adjust reverse_key
reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), '');
// Push
if(k.match(patterns.push)){
merge = self.build([], self.push_counter(reverse_key), merge);
}
// Fixed
else if(k.match(patterns.fixed)){
merge = self.build([], k, merge);
}
// Named
else if(k.match(patterns.named)){
merge = self.build({}, k, merge);
}
}
json = $.extend(true, json, merge);
});
return json;
};

//******************Send to google spreadsheet********************************

var $form = $('form#test-form')

$('#submit-form').on('click', function() {
function Send(){

var jqxhr = $.ajax({
url: 'https://script.google.com/a/wayfair.com/macros/s/AKfycbzQDqee7hixQTwBOKMePyHUtay55GcNxqx1113SRS91L1guP34/exec',
mode: 'no-cors',
method: "GET",
dataType: "jsonp",
data: $form.serializeObject()
 }).done(
console.log("Success!")

);
$('#update_page').click()
}
if(c1.checked == true){Send()}
else if(c2.checked == true){Send()}
else {$('#update_page').click()}

})
};

var category=document.getElementById("js-category").value
if (category=="1851"){execute()}//class updates
else if
(category=="1857"){execute()}//collection updates
else if
(category=="1859"){execute()}//create new sku
else if
(category=="1852"){execute()}//description
else if
(category=="2210"){execute()}//emergency takedown
else if
(category=="1855"){execute()}//kits
else if
(category=="1856"){execute()}//manufacturer updates
else if
(category=="1870"){execute()}//media
else if
(category=="1860"){execute()}//option joins and sku setup
else if
(category=="1864"){execute()}//other
else if
(category=="1866"){execute()}//related items
else if
(category=="1854"){execute()}//status fulfillment critical
else if
(category=="1853"){execute()}//update schema



//**************************************************************************************************************************
//************************Templates & Assign*************************************

document.getElementById("ticketinfo").style.cssText="position:fixed;background:#71a3af;top:-1px;z-index:10;width:2000px;border-color:#71a3af";
document.getElementsByClassName("yui-skin-sam")[0].style.cssText="position:absolute;top:20px"
document.getElementById("ticketinfo").querySelectorAll("img")[0].style.display="none";
document.getElementById("ticketinfo").querySelectorAll("img")[1].style.display="none";
//******************************************************************************************************************
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
option2.value="Hello,\n\nThank you for your request. The [insert here] has been updated as per request.\n\nPlease allow up to 24 hours for changes to reflect on site. If changes are not displayed after this time, please post an update on this ticket.\n\nRegards,";
option2.innerHTML= "Complete/Updated";
select.appendChild(option2);

var option3 = document.createElement("option");
option3.value="Hello,\n\nThank you for the request. I am rerouting this ticket towards [insert team] for completion.\n\nRegards,";
option3.innerHTML= "Re-route";
select.appendChild(option3);


var option5 = document.createElement("option");
option5.value="Hello,\n\nThank you for your request. Our team is unable to make the requested changes on exclusively branded SKUs.\nPlease raise a new ticket towards the White-Label Team for completion.\n\nRegards,";
option5.innerHTML= "White Labeled";
select.appendChild(option5);


var option7 = document.createElement("option");
option7.value="Hello,\n\nThis ticket has exceeded its maximum processing time and will be closed before the end of the day.\nShould you still require assistance please raise a new ticket.\n\nThank you,";
option7.innerHTML= "Request expired";
select.appendChild(option7);


var option9 = document.createElement("option");
option9.value="Hello,\n\nThank you for your request. It looks like this is a task for another team.\nPlease contact your Wayfair relationship manager, [Name (email)] who will be assisting you in this matter.\n\nRegards,";
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
if (user.indexOf("calexandra") != -1) {var b ="\nAlexandra"}
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
else if (user.indexOf("lchivu") != -1) { b ="\nLuciana"}
else if (user.indexOf("odobrin") != -1) { b ="\nAndra"}
else if (user.indexOf("ashaan") != -1) {b ="\nAejaz"}
else if (user.indexOf("marora1") != -1) {b="\nMegha"}
else if (user.indexOf("nwadhawan") != -1) { b="\nNikhil"}
else if (user.indexOf("mmehraj") != -1) { b ="\nMinhaj"}
else if (user.indexOf("ksamuel1") != -1) { b ="\nKshitij"}
else if (user.indexOf("asingh4") != -1) { b ="\nAnkita"}
else if (user.indexOf("akaur1") != -1) { b ="\nAmarpreet"}
else if (user.indexOf("sgiri") != -1) { b ="\nShivangi"}
else if (user.indexOf("gmouriya") != -1) { b ="\nGaurav"}
else if (user.indexOf("akalita") != -1) { b ="\nKalita"}
else if (user.indexOf("ss1") != -1) { b ="\nSaurabh"}
else if (user.indexOf("mdanilencu") != -1) { b ="\nMarian"}
display.value=index+b;
}}

// Button for assigning ticket to self(FINISHED-check names and id's)

var header = document.getElementById("maincontainer");
var btn1 = document.createElement("button");
function createT3(){
        var $input = $('<div id="divt3" style="padding:1px 10px;z-index: 9999; position: absolute; top: 17px;left:823px;"><input id="t3" type="button" value="Assign Ticket" style="" /></div>');
        $input.appendTo($("body"));
       }
createT3();
document.getElementById('t3').style.backgroundColor="rgb(1, 118, 139)";
document.getElementById('t3').style.color="white"

document.getElementById('t3').onclick= function(){

alert("Work allocation is managed by the Queue Master.")

// Assigns agent name
var c = document.getElementById("NameList");
var d = document.getElementById("EmIDList");
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
else if (user.indexOf("marora1") != -1) { c.value ="Arora, Megha; "}
else if (user.indexOf("nwadhawan") != -1) { c.value ="Wadhawan, Nikhil; "}
else if (user.indexOf("mmehraj") != -1) { c.value ="Mehraj, Minhaj; "}
else if (user.indexOf("ksamuel1") != -1) { c.value ="Samuel, Kshitij; "}
else if (user.indexOf("asingh4") != -1) { c.value ="Singh, Ankita; "}
else if (user.indexOf("akaur1") != -1) { c.value =" Kaur, Amarpreet; "}
else if (user.indexOf("sgiri") != -1) { c.value ="Giri, Shivangi; "}
else if (user.indexOf("gmouriya") != -1) { c.value ="Mouriya, Gaurav; "}
else if (user.indexOf("akalita") != -1) { c.value ="Kalita, Ashim; "}
else if (user.indexOf("ashaan") != -1) { c.value ="Shaan, Aejaz; "}
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
else if (user.indexOf("marora1") != -1) {d.value ="1022536"}
else if (user.indexOf("nwadhawan") != -1) { d.value ="1020354"}
else if (user.indexOf("mmehraj") != -1) { d.value ="1019725"}
else if (user.indexOf("ksamuel1") != -1) { d.value ="1019718"}
else if (user.indexOf("asingh4") != -1) { d.value ="1020351"}
else if (user.indexOf("akaur1") != -1) { d.value ="1019717"}
else if (user.indexOf("sgiri") != -1) { d.value ="1019723"}
else if (user.indexOf("gmouriya") != -1) { d.value ="1022531"}
else if (user.indexOf("akalita") != -1) { d.value ="1022532"}
else if (user.indexOf("ashaan") != -1) { d.value ="1032195"}
c.scrollIntoView();}