// ==UserScript==
// @name         Main Queue
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Sends queue numbers to google spreadsheet
// @author       Marian Danilencu
// @match        https://admin.wayfair.com/v/workflow_management/queues
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398744/Main%20Queue.user.js
// @updateURL https://update.greasyfork.org/scripts/398744/Main%20Queue.meta.js
// ==/UserScript==
function start(){
var $ = window.jQuery;
var jQuery = window.jQuery;


//***********************************
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

//*********************************************

var newform= document.createElement('form');
newform.style.cssText="position:absolute;top:10px;left:15px"
newform.id="test-form"
newform.name="submit-to-google-sheet";
var input1=document.createElement("input");
input1.type="input"
input1.name="FulfillmentCritical"
document.getElementsByClassName("wf-EngBar-stats")[0].appendChild(newform)
newform.appendChild(input1);
var input2=document.createElement("input");
input2.type="input"
input2.name="FulfillmentCriticalEmergencyTakedown"
newform.appendChild(input2);
var input3=document.createElement("input");
input3.type="input"
input3.name="SelectionDriving"
newform.appendChild(input3);
var input4=document.createElement("input");
input4.type="input"
input4.name="AUTOReactivation"
newform.appendChild(input4);
var input5=document.createElement("input");
input5.type="input"
input5.name="MANUALReactivation"
newform.appendChild(input5);
var input6=document.createElement("input");
input6.type="input"
input6.name="SupplierFacing"
newform.appendChild(input6);
var input7=document.createElement("input");
input7.type="input"
input7.name="Other"
newform.appendChild(input7);
var input8=document.createElement("input");
input8.type="input"
input8.name="NewSKU"
newform.appendChild(input8);
var input9=document.createElement("input");
input9.type="input"
input9.name="Assigned"
newform.appendChild(input9);
var input10=document.createElement("input");
input10.type="input"
input10.name="Media"
newform.appendChild(input10);
var input11=document.createElement("input");
input11.type="input"
input11.name="Date"
newform.appendChild(input11);
newform.style.visibility="hidden"
var input12=document.createElement("input");
input12.type="input"
input12.name="Time"
newform.appendChild(input12);


var date = new Date();
var time=date.getHours()+":"+date.getMinutes()

input1.value=document.querySelectorAll("h3")[6].innerText.slice(27,31).replace(/[^0-9]/g, '');
input2.value=document.querySelectorAll("h3")[7].innerText.replace(/[^0-9]/g, '');
input3.value=document.querySelectorAll("h3")[8].innerText.slice(5,31).replace(/[^0-9]/g, '');
input4.value=document.querySelectorAll("h3")[9].innerText.slice(5,36).replace(/[^0-9]/g, '');
input5.value=document.querySelectorAll("h3")[10].innerText.slice(5,34).replace(/[^0-9]/g, '');
input6.value=document.querySelectorAll("h3")[11].innerText.slice(5,34).replace(/[^0-9]/g, '');
input7.value=document.querySelectorAll("h3")[12].innerText.slice(5,34).replace(/[^0-9]/g, '');
input8.value=document.querySelectorAll("h3")[13].innerText.slice(5,34).replace(/[^0-9]/g, '');
input9.value=document.querySelectorAll("h3")[14].innerText.slice(5,31).replace(/[^0-9]/g, '');
input10.value=document.querySelectorAll("h3")[15].innerText.slice(5,26).replace(/[^0-9]/g, '');
//input11.value=date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
input11.value=(date.getMonth() + 1) + '/' + date.getDate()+ '/' + date.getFullYear()
input12.value=time
var $form = $('form#test-form')

var jqxhr = $.ajax({
url: 'https://script.google.com/a/wayfair.com/macros/s/AKfycbwIhSS-DYpV17r7qc2Vmk_XCWt2K6kRIgt9TMuflNfyRx7zQWm-/exec',
mode: 'no-cors',
method: "GET",
dataType: "jsonp",
data: $form.serializeObject()
 }).done(
console.log("Success!")

);
}

var counter = 10;
var checkExist = setInterval(function() {
  console.log(counter);
  counter--
  if (document.getElementsByClassName("admin-BaseCard-title")[1].length || counter === 0) {
setTimeout(function(){start()},3000)
    clearInterval(checkExist);
  }
}, 200);
