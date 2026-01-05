// ==UserScript==
// @name         Ghost Trappers - Loot Alerter
// @author       Rani Kheir
// @version      2.4
// @description  To be used with the Ghost Trappers Facebook game. This script will alert you when you receive specified loot you are looking for.
// @include      *ghost-trappers.com/fb/hunt.php*
// @include      *ghost-trappers.com/fb/camp.php*
// @icon         http://i44.photobucket.com/albums/f36/Rani-Kheir/ghosticon_zpsc395e1ce.png
// @copyright    2015+, Rani Kheir
// @namespace https://greasyfork.org/users/4271
// @downloadURL https://update.greasyfork.org/scripts/13158/Ghost%20Trappers%20-%20Loot%20Alerter.user.js
// @updateURL https://update.greasyfork.org/scripts/13158/Ghost%20Trappers%20-%20Loot%20Alerter.meta.js
// ==/UserScript==

if(typeof(Storage) !== "undefined") {
    if (!localStorage.gTLootNotifier) {localStorage.gTLootNotifier = "ThisShallNotExistByDefault.Ever.";}
    if (!localStorage.gTLootNotifierBool) {localStorage.gTLootNotifierBool = false;}
} else {
    var node = document.createElement("P");
    var textnode = document.createTextNode("Browser doesn't support Local Storage - Sorry!");
    node.appendChild(textnode);
    document.getElementsByClassName("rightBanners")[0].appendChild(node);
}

var node0= document.createElement("P");
var textnode0 = document.createTextNode("GT Loot Watcher");
node0.appendChild(textnode0);

var node1 = document.createElement("P");
var textnode1 = document.createTextNode("Watch for:");
node1.appendChild(textnode1);

var node2 = document.createElement("INPUT");
node2.setAttribute("id", "id_you_like");


var node3 = document.createElement("BUTTON");
var textnode2 = document.createTextNode("Save");
node3.appendChild(textnode2);


document.getElementsByClassName("rightBanners")[0].appendChild(node0);
document.getElementsByClassName("rightBanners")[0].appendChild(node1);
document.getElementsByClassName("rightBanners")[0].appendChild(node2);
document.getElementsByClassName("rightBanners")[0].appendChild(document.createElement("BR"));
document.getElementsByClassName("rightBanners")[0].appendChild(document.createElement("BR"));
document.getElementsByClassName("rightBanners")[0].appendChild(node3);

node3.onclick=function(){
    var test = document.getElementById("id_you_like").value;    
    localStorage.gTLootNotifier = test;
    //alert(test); - worked
    //alert(localStorage.gTLootNotifier); - worked!
    
    localStorage.gTLootNotifierBool = true;
    
    //document.getElementsByClassName("rightBanners")[0].appendChild(document.createElement("P").appendChild(document.createTextNode("Search added")));
    
    if (document.getElementById("currently_watching")) {
        document.getElementById("currently_watching").remove();
        document.getElementById("currently_watching_item").innerHTML = "";
    }
    
    var node100 = document.createElement("P");
    var textnode100 = document.createTextNode("Searching for: [" + localStorage.gTLootNotifier + "]");
    node100.appendChild(textnode100);
    node100.setAttribute("id", "currently_watching");
    document.getElementsByClassName("rightBanners")[0].appendChild(node100);
    
    node100.style.color = "white";
    node100.style.fontSize = "9px";
    node100.style.fontFamily = "Calibri";
    node100.style.margin = "0px";
    node100.style.paddingTop = "15px";
    node100.style.textAlign = "center";
    
};


var node4 = document.createElement("BUTTON");
var textnode3 = document.createTextNode("Cancel");
node4.appendChild(textnode3);

document.getElementsByClassName("rightBanners")[0].appendChild(node4);

node4.onclick=function(){
    localStorage.gTLootNotifierBool = false;
    if (document.getElementById("currently_watching")) {
        document.getElementById("currently_watching").innerHTML = "Search Cleared";
        document.getElementById("currently_watching_item").innerHTML = "";
    }
};

if (localStorage.gTLootNotifierBool === "true") {
    var obtainFirstLog = document.getElementsByClassName('logText')[0].innerHTML;
    var searchForThis = localStorage.gTLootNotifier;
    var myLovelyRegex = new RegExp(searchForThis, 'gi');
    if (obtainFirstLog.match(myLovelyRegex))
        { alert("Congratulations!\n\nYou have obtained: " + searchForThis); }
    
    var node8 = document.createElement("P");
    var textnode8 = document.createTextNode("- Currently watching for -");
    node8.appendChild(textnode8);
    node8.setAttribute("id", "currently_watching");
    document.getElementsByClassName("rightBanners")[0].appendChild(node8);
    
    node8.style.color = "white";
    node8.style.fontSize = "10px";
    node8.style.fontFamily = "Calibri";
    node8.style.margin = "0px";
    node8.style.paddingTop = "20px";
    node8.style.textAlign = "center";
    
    var node9 = document.createElement("P");
    var textnode9 = document.createTextNode("[" + searchForThis + "]");
    node9.appendChild(textnode9);
    node9.setAttribute("id", "currently_watching_item");
    document.getElementsByClassName("rightBanners")[0].appendChild(node9);
    
    node9.style.color = "white";
    node9.style.fontSize = "12px";
    node9.style.fontFamily = "Calibri";
    node9.style.margin = "0px";
    node9.style.padding = "0px";
    node9.style.textAlign = "center";
}



// Styling
node0.style.color = "white";
node0.style.fontSize = "14px";
node0.style.fontFamily = "Calibri";
node0.style.paddingTop = "3px";
node0.style.paddingBottom = "8px";
node0.style.margin = "0px";

node1.style.color = "white";
node1.style.fontSize = "11px";
node1.style.fontFamily = "Calibri";
node1.style.padding = "0px";
node1.style.margin = "0px";

node2.placeholder = "Type Loot Name Here";
node2.style.fontFamily = "Consolas";

node3.style.fontSize = "11px";
node3.style.fontFamily = "Calibri";
node3.style.width = "48%";

node4.style.fontSize = "11px";
node4.style.fontFamily = "Calibri";
node4.style.width = "48%";
node4.style.marginLeft = "3px";