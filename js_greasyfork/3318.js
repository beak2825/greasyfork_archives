// ==UserScript==
// @name       Categorization Map Asha Final ASDFG keys avaf
// @version    0.5
// @description  enter something useful
// @updateurl  http://userscripts.org/scripts/source/453289.user.js
// @match      https://s3.amazonaws.com/*
// @copyright  2014+, Tjololo
// @namespace https://greasyfork.org/users/2698
// @downloadURL https://update.greasyfork.org/scripts/3318/Categorization%20Map%20Asha%20Final%20ASDFG%20keys%20avaf.user.js
// @updateURL https://update.greasyfork.org/scripts/3318/Categorization%20Map%20Asha%20Final%20ASDFG%20keys%20avaf.meta.js
// ==/UserScript==
 
var elem = document.getElementsByClassName('span7 ng-scope')[0];
var addy = elem.innerText.split(':')[1];
var api = "AIzaSyDPDz7ozlLWuxMLqk4OHDnK5j8LKSjqK58";
var zoomlevel = 20;
var googlePrefix = "https://maps.googleapis.com/maps/api/staticmap?markers=size:mid%7Ccolor:red%7C";
var url = googlePrefix + encodeURIComponent(addy.replace(",","")) + "&size=512x512&zoom="+zoomlevel+"&maptype=hybrid&sensor=false";
if (api != "")
    url += "&key="+api;
console.log(url);
var ifrm = document.createElement("img");
ifrm.setAttribute("src", url);
ifrm.setAttribute("id", "map");
ifrm.style.width = 512+"px";
ifrm.style.height = 512+"px";

var zoomlvl = document.createElement("div");
zoomlvl.setAttribute("id","zoom_level");
zoomlvl.innerHTML="Zoom: "+zoomlevel;
elem.appendChild(ifrm);
elem.appendChild(zoomlvl);
//elem.innerHTML+="<br />Zoom: "+zoomlevel;
 
var content = document.getElementById("wrapper");
content.tabIndex = "0";
content.focus();
 
document.onkeydown = showkeycode;
function showkeycode(evt){
    var keycode = evt.keyCode;
        switch (keycode) {
            case 65: //a
                document.getElementById("A - Great for solar").click();
                document.getElementById("mturk_form").submit();
                break;
            case 83: //s
                document.getElementById("B - OK for solar").click();
                document.getElementById("mturk_form").submit();
                break;
            case 68: //d
                document.getElementById("C - Not so good for solar").click();
                document.getElementById("mturk_form").submit();
                break;
            case 70: //f
                document.getElementById("D - Bad for solar").click();
                document.getElementById("mturk_form").submit();
                break;
            case 71: //g
                document.getElementById("E - Cannot find the roof").click();
                document.getElementById("mturk_form").submit();
                break;
            case 13: //enter
                document.getElementById("mturk_form").submit();
                break;
    }
}