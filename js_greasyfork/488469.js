// ==UserScript==
// @name         Travian marketplace calculator
// @namespace    https://*.travian.com/*
// @version      1.006
// @description  This script is used for calculating incoming grain in Travian Legends game
// @author       Marko Miljkovic
// @match        https://*.travian.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488469/Travian%20marketplace%20calculator.user.js
// @updateURL https://update.greasyfork.org/scripts/488469/Travian%20marketplace%20calculator.meta.js
// ==/UserScript==

var parentDiv = document.createElement("div")
parentDiv.style.position = "fixed"
parentDiv.style.top = "50px"
parentDiv.style.left = "50px"
parentDiv.style.zIndex = "9999"
document.body.append(parentDiv)
 
 
var button1 = document.createElement("button");
button1.textContent = "Calculate incoming crops";
 
// Set button styles
button1.style.position = "fixed";
button1.style.top = "50px";
button1.style.left = "50px";
button1.style.padding = "10px";
button1.style.backgroundColor = "blue";
button1.style.color = "white";
button1.style.border = "none";
button1.style.cursor = "pointer";
 
button1.addEventListener("click", function() {
    calculateIncomingCrops(); // Don't forget to call the function
});

var button2 = document.createElement("button");
button2.textContent = "Calculate incoming crops sum";
 
// Set button styles
button2.style.position = "fixed";
button2.style.top = "100px";
button2.style.left = "50px";
button2.style.padding = "10px";
button2.style.backgroundColor = "blue";
button2.style.color = "white";
button2.style.border = "none";
button2.style.cursor = "pointer";
 
button2.addEventListener("click", function() {
    calculateIncomingCropsSum(); // Don't forget to call the function
});
 
// Append the button to the body element
// parentDiv.appendChild(button2);
 
var button3 = document.createElement("button");
button3.textContent = "Calculate troops consumption";
 
// Set button styles
button3.style.position = "fixed";
button3.style.top = "150px";
button3.style.left = "50px";
button3.style.padding = "10px";
button3.style.backgroundColor = "blue";
button3.style.color = "white";
button3.style.border = "none";
button3.style.cursor = "pointer";
 
button3.addEventListener("click", function() {
    calculateTroopsConsumption(); // Don't forget to call the function
});
 
// Append the button to the body element
parentDiv.appendChild(button1);
parentDiv.appendChild(button2);
parentDiv.appendChild(button3);
 
 
function calculateIncomingCrops() {
    var routeDivs = document.querySelectorAll('div.routes div.route');
    var hashMap = {};
    
    routeDivs.forEach(function(routeDiv) {
        var keyElement = routeDiv.querySelector('div.routeHeader div.otherVillage a[href^="/profile/"]');
        var key = keyElement ? keyElement.textContent.trim() : null;
        
        var sumValue = 0;
        var valueElements = routeDiv.querySelectorAll('div.delivery.current.transport');
        
        valueElements.forEach(function(valueElement) {
            var values = valueElement.querySelectorAll('span.value');
            if (values.length >= 4) { // Make sure there are enough values
                var valueString = values[3].textContent.trim().replace('.', '').replace(/\D/g,'');
                var value = parseInt(valueString);
                if (!isNaN(value)) { // Check if value is a valid number
                    sumValue += value;
                }
            }
            
            var hourElements = valueElement.querySelectorAll('div.arriveInAt span.time');
            if (hourElements.length > 0) { // Make sure there are enough elements
                var hour = hourElements[0].textContent.trim().split(":")[0];
                var newKey = key + " : " + hour;
                if (key !== null) {
                    if (!hashMap[newKey]) {
                        hashMap[newKey] = 0;
                    }
                    hashMap[newKey] += sumValue;
                }
            }
        });
    });
    
    // Sort the keys alphabetically
    var sortedKeys = Object.keys(hashMap).sort();
 
    var output = "";
    sortedKeys.forEach(function(key) {
        output += key + " : " + hashMap[key] + "\n";
    });
 
    // Open a popup window to display the output
    var popup = window.open("", "Popup", "width=400,height=300");
    popup.document.write("<pre>" + output + "</pre>");
}

 
function calculateIncomingCropsSum() {
    var routeDivs = document.querySelectorAll('div.routes div.route');
    var hashMap = {};
    
    routeDivs.forEach(function(routeDiv) {
        var keyElement = routeDiv.querySelector('div.routeHeader div.otherVillage a[href^="/profile/"]');
        var key = keyElement ? keyElement.textContent.trim() : null;
        
        var sumValue = 0;
        var valueElements = routeDiv.querySelectorAll('div.delivery.current.transport');
        
        valueElements.forEach(function(valueElement) {
            var values = valueElement.querySelectorAll('span.value');
            if (values.length >= 4) { // Make sure there are enough values
                var valueString = values[3].textContent.trim().replace('.', '').replace(/\D/g,'');
                var value = parseInt(valueString);
                if (!isNaN(value)) { // Check if value is a valid number
                    sumValue += value;
                }
            }
            
            var hourElements = valueElement.querySelectorAll('div.arriveInAt span.time');
            if (hourElements.length > 0) { // Make sure there are enough elements
                var hour = hourElements[0].textContent.trim().split(":")[0];
                if (key !== null) {
                    if (!hashMap[hour]) {
                        hashMap[hour] = 0;
                    }
                    hashMap[hour] += sumValue;
                }
            }
        });
    });
    
    // Sort the keys alphabetically
    var sortedKeys = Object.keys(hashMap).sort();
 
    var output = "";
    sortedKeys.forEach(function(key) {
        output += key + " : " + hashMap[key] + "\n";
    });
 
    // Open a popup window to display the output
    var popup = window.open("", "Popup", "width=400,height=300");
    popup.document.write("<pre>" + output + "</pre>");
}
 
function calculateTroopsConsumption(){
    var elements = document.querySelectorAll('table.troop_details');
 
     var hashMap = {};
 
    elements.forEach(function(container){
        var player_name = container.getAttribute('data-player-name');
        var valueElements = container.querySelectorAll('.value');
        if(hashMap[player_name] == null){
            var element = valueElements[0];
            if(element != null){
                var value = parseInt(element.textContent.trim().replace('.', '').replace(/\D/g,''));
            hashMap[player_name] = value
            }
        } else {
            var element = valueElements[0];
            if(element != null){
                var value = parseInt(element.textContent.trim().replace('.', '').replace(/\D/g,''));
            hashMap[player_name] += value
            }
        } 
    });
       // Sort the keys alphabetically
    var sortedKeys = Object.keys(hashMap).sort();
 
    var output = "";
    sortedKeys.forEach(function(key) {
        output += key + " : " + hashMap[key] + "\n";
    });
 
    // Open a popup window to display the output
    var popup = window.open("", "Popup", "width=400,height=300");
    popup.document.write("<pre>" + output + "</pre>");
}