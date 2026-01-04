// ==UserScript==
// @name         Modify Greenies' Name
// @namespace    http://tampermonkey.net/
// @version      0.1
// @author       CzPeet
// @match        https://www.munzee.com/m/*/*/admin/?prefix=*
// @match        https://www.munzee.com/m/*/deploys/1/type/0
// @icon         https://www.google.com/s2/favicons?domain=munzee.com
// @description  You can add prefix to the name of your green munzees
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431994/Modify%20Greenies%27%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/431994/Modify%20Greenies%27%20Name.meta.js
// ==/UserScript==
 
if (document.location.href.indexOf("deploys")>0)
{
    //Get string container
    var container = document.getElementById("search-text").parentElement;
    var greenPreFix = localStorage.getItem("munzeeGreeniesPrefix");
    var myLabel = document.createElement("Label");
    myLabel.innerText = "Prefix: ";
    myLabel.id = "prefLabel";
    myLabel.setAttribute("style","margin-left: 30px; margin-right: 5px");
    container.appendChild(myLabel);
    var myText = document.createElement("Input");
    myText.value = (greenPreFix != null) ? greenPreFix : "";
    myText.id = "prefText";
    myText.addEventListener('keyup', changePrefixText);
    container.appendChild(myText);
 
    changePrefixText();
}
else if (document.location.href.indexOf("?prefix")>0)
{
    var prefix = new URLSearchParams(window.location.search).get("prefix");
    var oldTitle = $("#friendly_name").val();
 
    if (oldTitle.indexOf(prefix) != 0)
    {
        $("#friendly_name").val(prefix+" "+oldTitle);
 
        var buttons = document.getElementsByTagName('button');
        for (var b = 0;b<buttons.length; b++)
        {
            if ($(buttons[b]).text() == "Update")
            {
                $(buttons[b]).click();
            }
        }
    }
}
 
function changePrefixText()
{
    var prefValue = $("#prefText").val();
    if (prefValue != null && prefValue != "")
    {
        localStorage.setItem("munzeeGreeniesPrefix", prefValue);
        //Modify Links in sections
        modifyLinks(prefValue);
    }
    else
    {
        localStorage.removeItem("munzeeGreeniesPrefix");
    }
}
 
function modifyLinks(prefix)
{
    var sections = document.getElementsByTagName('section');
    for (var s=0; s<sections.length; s++)
    {
        var links = sections[s].getElementsByTagName('a');
        for (var a=0; a<links.length; a++)
        {
            links[a].setAttribute("href", links[a].getAttribute("href")+"admin/?prefix="+prefix);
        }
    }
}