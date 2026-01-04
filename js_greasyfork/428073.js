// ==UserScript==
// @name         Auto complete Body temperature self-registration
// @namespace    http://supermicro.com/
// @license      MIT
// @version      0.9
// @description  My temperature is always good
// @author       ME
// @match        http://mpweb01-tw.supermicro.com/GAMgmt/Temperature
// @match        http://mpweb01-tw/GAMgmt/Temperature
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/428073/Auto%20complete%20Body%20temperature%20self-registration.user.js
// @updateURL https://update.greasyfork.org/scripts/428073/Auto%20complete%20Body%20temperature%20self-registration.meta.js
// ==/UserScript==
'use strict';
GM_config.init(
{
  'id': 'SupermicroConfig', // The id used for this instance of GM_config
  'title': 'Script Settings',
  'fields': // Fields object
  {
    'debug': // This is the id of the field
    {
      'label': 'debug', // Appears next to field
      'type': 'checkbox', // Makes this setting a text field
      'default': false // Default value if user doesn't change it
    },
    'random': // This is the id of the field
    {
      'label': 'use random temperature', // Appears next to field
      'type': 'checkbox', // Makes this setting a text field
      'default': false // Default value if user doesn't change it
    },
    'randomMin': // This is the id of the field
    {
      'label': 'set minimum temperature if using randome temperature', // Appears next to field
      'type': 'text', // Makes this setting a text field
      'default': '34' // Default value if user doesn't change it
    },
    'randomMax': // This is the id of the field
    {
      'label': 'set maxium temperature if using randome temperature', // Appears next to field
      'type': 'text', // Makes this setting a text field
      'default': '36.9' // Default value if user doesn't change it
    }
  }
});
GM_registerMenuCommand ("Config", openConfigPanel, "C");
function openConfigPanel () {
    GM_config.open();
}
var debug = GM_config.get('debug');
console.log(debug);
function GetRandomNum(Min, Max) {
    var Range = Max - Min;
    var Rand = Math.random();
    return(Min + Math.round(Rand * Range));
}
var random = GM_config.get('random');
var minTemp = GM_config.get('randomMin') * 1;
var maxTemp = GM_config.get('randomMax') * 1;
function doOnce() {
	var v = getCookie("ApplyDegree");
	if (!v) {
        var tim_sec = 24 * 60 * 60 - (new Date().getHours() * 60 * 60 + new Date().getMinutes() * 60 + new Date().getSeconds());
        setCookie("ApplyDegree", "1", tim_sec);
		applyDegree();
        return true;
	}
    return false;
}
function setCookie(name, value, second) {
	if (!second) {
		second = 7 * 24 * 60 * 60;
	}
	var exp = new Date();
	exp.setTime(exp.getTime() + second * 1000);
	document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString() + ";path=/";
}
function getCookie(name) {
	if (document.cookie.length > 0) {
		c_start = document.cookie.indexOf(name + "=");
		if (c_start != -1) {
			c_start = c_start + name.length + 1;
			c_end = document.cookie.indexOf(";", c_start);
			if (c_end == -1) c_end = document.cookie.length;
			return decodeURI(document.cookie.substring(c_start, c_end));
		}
	}
	return "";
}
function applyDegree() {
    if (debug) {
        console.log("Apply Degree");
    }
    var degree = random ? GetRandomNum(minTemp*10,maxTemp*10)/10 : "36.6";
    $.ajax({
        type: "POST",
        dataType: "text",
        url: "Temperature/SaveTemp",
        data: "browser=Chrome+91&Degree=" + degree + "&DegreeType=Head01&SymptomYesOrNo=No&SymptomCough=&SymptomMuscleAche=&SymptomSoreThroat=&SymptomFever=&SymptomLossOfTasteOrSmell=&FootprintYesOrNo=No&FootprintPeople=&FootprintDeparture=&FootprintDepartureStart=",
        success: function (result) {
            location.reload();
        },
        error : function() {
            location.reload();
        }
    });
}
function openDeclarationForm() {
    var alertText = document.querySelector("#content > div > div.container > div > div.card-body > div.d-flex.justify-content-between.mb-3 > div > span");
    if (alertText != null) {
        if (!alertText.classList.contains('hide')){
            window.open($("#Healthy").attr('href'),"target","");
        }
    }
}
(function() {
    var maxNumber = document.getElementsByClassName("question row").length;
    var delay = 2000;
    var id = setInterval(function(){
        if(debug){
            console.log("script runing...");
        }
        if(document.querySelector("#Healthy > span.text.heathydesc") != null){
            if(debug){
                console.log("page loaded");
            }
            clearInterval(id);
            if (!doOnce()) {
                openDeclarationForm();
            }
        }
    },delay);
})();