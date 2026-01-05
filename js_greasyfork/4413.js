// ==UserScript==
// @name       Oneoh's SpoonFeeder
// @version    0.1
// @description  spoon feeder for oneoh
// @match      https://mi-div.crowdcomputingsystems.com/mturk-web*
// @copyright  2014+, Tjololo
// @namespace https://greasyfork.org/users/710
// @downloadURL https://update.greasyfork.org/scripts/4413/Oneoh%27s%20SpoonFeeder.user.js
// @updateURL https://update.greasyfork.org/scripts/4413/Oneoh%27s%20SpoonFeeder.meta.js
// ==/UserScript==

var field = document.getElementsByClassName("place")[0];
var pieces = field.innerHTML.split(":");
var finalHTML = "";
count = 0;
die = false;
for (var i = 0; i < pieces.length; i++){
    if (die)
        break;
    piece = pieces[i].trim().replace('&nbsp;', '').split("<br>");
    item = piece[0];
    thing = "";
    count++;
    if (!/ETF Name/.test(item) && item != "ETF Ticker" && item != "Issuer" && item != "URL" && item.indexOf("href") == -1){
        thing = "<a href=\"https://www.google.com/search?q="+encodeURI(item)+"\">"+item+"</a>";
        if (count != 5)
        	finalHTML += thing+"<br>"+piece[1]+" : ";
    }
    else{
        if (piece == "URL" || count == 5){
            die=true;
            break;
    	}
        else
        	finalHTML += "<br>" + item + " : ";
    }
}
field.innerHTML += "<br><br>"+finalHTML;