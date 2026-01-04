// ==UserScript==
// @name         Auto complete Body temperature self-registration
// @namespace    http://supermicro.com/
// @version      0.5
// @description  My temperature is always good
// @author       ME
// @match        http://mpweb01-tw.supermicro.com/GAMgmt/Temperature
// @match        http://mpweb01-tw/GAMgmt/Temperature
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/416652/Auto%20complete%20Body%20temperature%20self-registration.user.js
// @updateURL https://update.greasyfork.org/scripts/416652/Auto%20complete%20Body%20temperature%20self-registration.meta.js
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
      'default': true // Default value if user doesn't change it
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
(function() {
    'use strict';
    var maxNumber = document.getElementsByClassName("question row").length;
    var delay = 2000;
    var id = setInterval(function(){
        if(debug){
            console.log("script runing...");
        }
        if(document.querySelector("#content > div > div.container > div.input-group.mb-3.border.border-primary > button")!=null){
            if(debug){
                console.log("page loaded");
            }
            clearInterval(id);
            if(document.querySelector("#Degree").value ==null || document.querySelector("#Degree").value == ""){
                document.querySelector("#Degree").value = random?GetRandomNum(minTemp*10,maxTemp*10)/10:"36.6";
                if(document.querySelector("#Q01No") != null) {
                    document.querySelector("#Q01No").checked=true;
                }
                if(document.querySelector("#Q02No") != null) {
                    document.querySelector("#Q02No").checked=true;
                }
                document.querySelector("#content > div > div.container > div.input-group.mb-3.border.border-primary > button").click();
                if(debug){
                    console.log("done fillout body temperature");
                }
            }
            else{
                if(debug){
                    console.log("no need to fillout form again");
                }
            }
        }
    },delay);
})();