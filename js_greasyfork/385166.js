// ==UserScript==
// @name         GEOFS VHHH TAXIWAY CHART
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Taxiway Maps Added
// @author       ATC HKIA
// @match        https://*/geofs.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385166/GEOFS%20VHHH%20TAXIWAY%20CHART.user.js
// @updateURL https://update.greasyfork.org/scripts/385166/GEOFS%20VHHH%20TAXIWAY%20CHART.meta.js
// ==/UserScript==

/*var input=document.createElement("input");
input.type="button";
input.value="TAXIWAY VHHH ";
input.onclick = showAlert;
input.setAttribute("style", "font-size:18px;position:absolute;top:120px;right:60px;");
document.body.appendChild(input);*/

var input=document.createElement("input");
input.type="button";
input.value="TAXIWAY VHHH ";
input.onclick = myFunction;
input.setAttribute("style", "font-size:18px;position:absolute;bottom:30px;right:0px;");
document.body.appendChild(input);
function myFunction() {
  var x = document.createElement("IMG");
  x.setAttribute("src", "https://ops.group/blog/wp-content/uploads/2016/10/HK-APT-CHART-1024x677.png");
  x.setAttribute("width", "450");
  x.setAttribute("height", "600");
  x.setAttribute("alt", "VHHH Chart");
  document.body.appendChild(x);
}
function close() {
window.location.reload()
}

var input=document.createElement("input");
input.type="button";
input.value="Close All Tabs";
input.onclick = close;
input.setAttribute("style", "font-size:18px;position:absolute;bottom:70px;right:0px;");
document.body.appendChild(input);

$("body").append (
    '<img class="umgg" src="https://ops.group/blog/wp-content/uploads/2016/10/HK-APT-CHART-1024x677.png" alt="VHHH TAXXIWAY" width="170" height="36">'
);


var logos = document.getElementsByClassName("umgg");

for( var i = 0; i < logos.length; i++ )
{
    // true for all img tags with the fb_logo class name
    if( logos[ i ].tagName == "IMG" )
    {
        logos[ i ].src = "https://ops.group/blog/wp-content/uploads/2016/10/HK-APT-CHART-1024x677.png"
    }
}

