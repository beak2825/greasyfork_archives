// ==UserScript==
// @version     0.01
// @name        Xbox prices
// @namespace   https://www.xbox.com/fr-FR/games/all-games?cat=onsale
// @description	Filter prices Xbox Store
// @author      ced
// @include     https://www.xbox.com/fr-FR/games/all-games?cat=onsale
// @grant       none
// @license     MIT
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/505329/Xbox%20prices.user.js
// @updateURL https://update.greasyfork.org/scripts/505329/Xbox%20prices.meta.js
// ==/UserScript==
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function RangeFilterZePrices()  
{ 
var zePrice = document.getElementById("rangePrice").value;
document.getElementById("rangeSpan").innerText = zePrice;
var spans   = document.getElementsByTagName("span");
  
for (i=0;i<spans.length;i++)  
    if ( spans[i].getAttribute("itemprop") == "price" ) 
       {   
       if ( spans[i].innerText.replace(/[^0-9.-]/g, '')  > parseInt(zePrice)*100 )  
          spans[i].parentElement.parentElement.parentElement.parentElement.style.opacity=0.2;  
       else 
          spans[i].parentElement.parentElement.parentElement.parentElement.style.opacity=1;   
       }    
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var htmlCodeAddedDiv  = '<input id="rangePrice" orient="vertical" type="range" step="1" value="100" min="0" max="100" '; 
    htmlCodeAddedDiv += 'style="background:#9bf00b;color:white;" >'
    htmlCodeAddedDiv += '<br><br><span id="rangeSpan">100</span>'; 
var div = document.createElement("div");              
    div.style.top            = "50px";   
    div.style.left           = "20px"; 
    div.style.width          = "50px";             
    div.style.position       = "fixed";             
    div.style.color          = "black";             
    div.style.fontSize       = "16px";              
    div.style.zIndex         = "100";   
    div.innerHTML            =  htmlCodeAddedDiv;     
document.body.appendChild(div); 
document.getElementById("rangePrice").addEventListener("change",  setInterval( RangeFilterZePrices, 2000) );   
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////