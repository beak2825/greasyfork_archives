// ==UserScript==
// @name         Random.org
// @version      0.5
// @match        https://www.random.org/*
// @description  Generatiom
// @author       llll
// @homepage     llll
// @namespace    https://greasyfork.org/users/865693
// @downloadURL https://update.greasyfork.org/scripts/458760/Randomorg.user.js
// @updateURL https://update.greasyfork.org/scripts/458760/Randomorg.meta.js
// ==/UserScript==
 
// Number which will be generated on target click
 
var numbers = [2, 7, 16]
var clicks = 0
 
var html_template =  "<center><span style='font-size:100%;font-weight:bold;'>%value%<br/></span><span style='font-size:70%;'>Min:&nbsp;%min%, Max:&nbsp;%max%<br/>%date%</span></center>";
 
function template(template_data, params) {
    return template_data.replace(
        /%(\w*)%/g,
        function(m, key) {
            return params.hasOwnProperty(key) ? params[key] : "";
        }
    );
}
 
if (typeof printNumber != "undefined") {
    var origPrintNumber = printNumber;
 
    printNumber = function() {
        if ((numbers.length-1) >= clicks) {
            var date = new Date();
            var date_str = [date.getUTCFullYear(), ("0" + (date.getUTCMonth() + 1)).slice(-2), date.getDate()].join("-") + " " + [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()].join(":") + " " + "UTC";
 
            document.querySelector('[id$="result"]').innerHTML = template(
                html_template,
                {
                    value: numbers[clicks],
                    min: document.querySelector('[id$="min"]').value,
                    max: document.querySelector('[id$="max"]').value,
                    date: date_str
                }
            );
 
            document.querySelector('[id$="button"]').disabled = false;
        }
        else {
            origPrintNumber();
        }
 
        clicks += 1
    }
};