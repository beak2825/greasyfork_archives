// ==UserScript==
// @name         Google Dev Disable EU
// @namespace    https://theanykey.se/
// @version      1.1
// @description  Google disable/enable EU conutries
// @author       Andreas
// @match        https://play.google.com/apps/publish/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/368528/Google%20Dev%20Disable%20EU.user.js
// @updateURL https://update.greasyfork.org/scripts/368528/Google%20Dev%20Disable%20EU.meta.js
// ==/UserScript==

var input=document.createElement("input");
input.type="button";
input.value="Disable EU";
input.onclick = ClickDisable;
input.setAttribute("style", "font-size:18px;position:absolute;top:820px;right:140px;z-index:9999;");
document.body.appendChild(input);

var input2=document.createElement("input");
input2.type="button";
input2.value="Enable EU";
input2.onclick = ClickEnable;
input2.setAttribute("style", "font-size:18px;position:absolute;top:850px;right:140px;z-index:9999;");
document.body.appendChild(input2);

function ClickDisable()
{
    ToggleEU(true);
}

function ClickEnable()
{
    ToggleEU(false);
}

function ToggleEU(disable)
{
    // Click all
    setTimeout(ClickDisableCountry, 100, "Belgien", disable);
    setTimeout(ClickDisableCountry, 300, "Bulgarien", disable);
    setTimeout(ClickDisableCountry, 500, "Cypern", disable);
    setTimeout(ClickDisableCountry, 700, "Danmark", disable);
    setTimeout(ClickDisableCountry, 800, "Estland", disable);
    setTimeout(ClickDisableCountry, 1100, "Finland", disable);
    setTimeout(ClickDisableCountry, 1300, "Frankrike", disable);
    setTimeout(ClickDisableCountry, 1500, "Grekland", disable);
    setTimeout(ClickDisableCountry, 1600, "Irland", disable);
    setTimeout(ClickDisableCountry, 1900, "Italien", disable);
    setTimeout(ClickDisableCountry, 2100, "Kroatien", disable);
    setTimeout(ClickDisableCountry, 2300, "Litauen", disable);
    setTimeout(ClickDisableCountry, 2500, "Luxemburg", disable);
    setTimeout(ClickDisableCountry, 2700, "Malta", disable);
    setTimeout(ClickDisableCountry, 2900, "Nederländerna", disable);
    setTimeout(ClickDisableCountry, 3100, "Polen", disable);
    setTimeout(ClickDisableCountry, 3300, "Portugal", disable);
    setTimeout(ClickDisableCountry, 3500, "Rumänien", disable);
    setTimeout(ClickDisableCountry, 3700, "Slovakien", disable);
    setTimeout(ClickDisableCountry, 3900, "Slovenien", disable);
    setTimeout(ClickDisableCountry, 4100, "Spanien", disable);
    setTimeout(ClickDisableCountry, 4300, "Storbritannien", disable);
    setTimeout(ClickDisableCountry, 4500, "Sverige", disable);
    setTimeout(ClickDisableCountry, 4700, "Tjeckien", disable);
    setTimeout(ClickDisableCountry, 4900, "Tyskland", disable);
    setTimeout(ClickDisableCountry, 5100, "Ungern", disable);
    setTimeout(ClickDisableCountry, 5300, "Österrike", disable);
    setTimeout(ClickDisableCountry, 5500, "Lettland", disable);
    setTimeout(ClickDisableCountry, 5700, "Norge", disable);
    setTimeout(ClickDisableCountry, 5900, "Island", disable);
    setTimeout(ClickDisableCountry, 6100, "Liechtenstein", disable);
    // Show message
    if (disable)
    {
        setTimeout(alert, 6300, "EU disabled");
    }
    else
    {
        setTimeout(alert, 6300, "EU enabled");
    }
}

function ClickDisableCountry(country, disable)
{
    var p=document.getElementsByTagName('input');
    var cstr = country;
    var first_check=disable;
    for (var i=p.length; --i>=0;)
    {
        var n = p[i];
        if (n.name==cstr)
        {
            if (first_check===false)
            {
                n.click();
                // Stop with the first one
                break;
            }
            first_check=false;
        }
    }
}