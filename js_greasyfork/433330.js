// ==UserScript==
// @name         Random.org
// @version      0.2
// @match        https://www.random.org/*
// @description  Predictable number generation for True Random Number Generator (https://www.random.org/)
// @author       ClayB20
// @homepage     
// @namespace    https://greasyfork.org/users/228137
// @downloadURL https://update.greasyfork.org/scripts/433330/Randomorg.user.js
// @updateURL https://update.greasyfork.org/scripts/433330/Randomorg.meta.js
// ==/UserScript==

// Number which will be generated on target click
var desired_number = 10;
var desired_click_number = 2;

var click_ctr = 0;
var html_template =  "<center><span style='font-size:100%;font-weight:bold;'>%value%<br/></span><span style='font-size:70%;'>Min:&nbsp;%min%, Max:&nbsp;%max%<br/>%date%</span></center>";

function template(template_data, params)
{
    return template_data.replace
    (
        /%(\w*)%/g,
        function(m, key)
        {
            return params.hasOwnProperty(key) ? params[key] : "";
        }
    );
}

if (typeof printNumber != "undefined")
{
    var origPrintNumber = printNumber;
    printNumber = function()
    {
        click_ctr++;

        if (click_ctr == desired_click_number)
        {
            var date = new Date();
            var date_str = [date.getUTCFullYear(), ("0" + (date.getUTCMonth() + 1)).slice(-2), date.getDate()].join("-") + " " + [date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()].join(":") + " " + "UTC";

            document.getElementById("true-random-integer-generator-result").innerHTML = template
            (
                html_template,
                {
                    value: desired_number,
                    min: document.getElementById("true-random-integer-generator-min").value,
                    max: document.getElementById("true-random-integer-generator-max").value,
                    date: date_str
                }
            );
        }
        else
            origPrintNumber();
    }
};
