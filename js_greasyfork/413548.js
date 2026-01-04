// ==UserScript==
// @name         Alt1
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413548/Alt1.user.js
// @updateURL https://update.greasyfork.org/scripts/413548/Alt1.meta.js
// ==/UserScript==

javascript:((function(){if(typeof(jQuery)=="undefined")
{window.jQuery="loading";var a=document.createElement("script");
a.type="text/javascript";a.src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js";
a.onload=function(){console.log("jQuery "+jQuery.fn.jquery+" loaded successfully.")};
a.onerror=function(){delete jQuery;console.log("Error while loading jQuery!")};
document.getElementsByTagName("head")[0].appendChild(a)}
else{if(typeof(jQuery)=="function"){console.log("jQuery ("+jQuery.fn.jquery+") is already loaded!")}
else{console.log("jQuery is already loading...")}}})());

//************************Form that collects data for spreadsheet****************************
var newform= document.createElement('form');
newform.id="test-form"
newform.name="submit-to-google-sheet";

var input1=document.createElement("input");
input1.type="input"
input1.name="Job"
input1.id="input"
newform.appendChild(input1);
var input2=document.createElement("input");
input2.type="input"
input2.name="XP"
input1.id="date"
newform.appendChild(input2);
var input3=document.createElement("input");
input3.type="textarea"
input3.name="Resources"
newform.appendChild(input3);
var send=document.createElement("button");
send.type="submit"
send.value="Submit"
send.id="submit-form"
newform.appendChild(send);
document.body.appendChild(newform);
document.getElementById('test-form').style.visibility="hidden"
setInterval(function(){

// ************************This data is sent to spreadsheet***********************************
//Current date format
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;



input1.value="Archaeology"
input2.value=document.getElementById("xpoutput").innerText
input3.value=document.getElementsByClassName("breakdownamount")[1].innerText
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

function asa() {
var jqxhr = $.ajax({
url: 'https://script.google.com/macros/s/AKfycbzOfLPOw0jihVIBwbVw43pX9v7b0XYc1pxC7z0U8EDvaBBrlW8/exec?rw=5',
method: "GET",
dataType: "post",
data: $form.serializeObject()

 }).done(
console.log("Success!")
);}

asa();
}, 3000);