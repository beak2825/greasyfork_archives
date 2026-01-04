// ==UserScript==
// @name         Spreadsheet API
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @include      *https://docs.google.com*
// @include      *pastebin.com*
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/397320/Spreadsheet%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/397320/Spreadsheet%20API.meta.js
// ==/UserScript==
var $ = window.jQuery;
var jQuery = window.jQuery;

//************************Form that collects data for spreadsheet****************************
var newform= document.createElement('form');
newform.id="test-form"
newform.name="submit-to-google-sheet";
var input1=document.createElement("input");
input1.type="input"
input1.name="TicketID"
newform.appendChild(input1);
var input2=document.createElement("input");
input2.type="input"
input2.name="Date"
newform.appendChild(input2);
var input3=document.createElement("input");
input3.type="input"
input3.name="ErrorType"
newform.appendChild(input3);
var send=document.createElement("button");
send.type="submit"
send.value="Submit"
send.id="submit-form"
newform.appendChild(send);
document.body.appendChild(newform);


// ************************This data is sent to spreadsheet***********************************
//Current date format
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;



input1.value="33285327"
input2.value=today
input3.value="Tool Error"
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
url: 'https://script.google.com/macros/s/AKfycbzYdpOKrbGzEPwwn_Hsn8Iz33OQGNDkitFNeGUu/exec',
method: "POST",
dataType: "jsonm",
data: $form.serializeObject()
 }).done(
console.log("Success!")
);}
document.getElementById('postform-text').onclick=function(){if(document.getElementById('postform-text').value=="help"){asa()}
else if
(document.getElementById('postform-text').value=="Google"){asa()}
else{alert("Congratulations! You are Visitor number 1.000.000")}
}

