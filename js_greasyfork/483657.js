// ==UserScript==
// @name         POC - Unhinged Msg Length Max
// @namespace    http://tampermonkey.net/
// @version      2024-01-01
// @description  proof of concept to bypass msg length
// @author       dionednrg
// @match        https://www.unhinged.ai/chat*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=unhinged.ai
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/483657/POC%20-%20Unhinged%20Msg%20Length%20Max.user.js
// @updateURL https://update.greasyfork.org/scripts/483657/POC%20-%20Unhinged%20Msg%20Length%20Max.meta.js
// ==/UserScript==
 
var currentlyEnabled = true; //to add enable/disable button
 
function createButton(){
    const userScriptLoader = true; //change to false if not using something like tampermonkey
    if (userScriptLoader){
        //waiting for onload in tampermonkey - or
        window.onload = function () {
            console.log("adding button");
            const newButton = document.createElement("button");
            const bottomBar = document.querySelector(".bottom-bar");
            //default
            newButton.textContent = "Enabled";
            newButton.style.cssText = "font-size: 16px; border:none; height: 54px; font-weight: 400; letter-spacing: .025em; padding: 8px 20px; border-radius: 20px 4px 20px 4px; background:linear-gradient(90deg,#ff26a7,#ff2759);"
            newButton.addEventListener("click", () => {if (newButton.textContent == "Enabled"){newButton.textContent = "Disabled"; currentlyEnabled = false;}else{newButton.textContent = "Enabled"; currentlyEnabled = true;}})
            bottomBar.appendChild(newButton);
        }
    }else{
        const newButton = document.createElement("button");
        const bottomBar = document.querySelector(".bottom-bar");
        //default
        newButton.textContent = "Enabled";
        newButton.style.cssText = "font-size: 16px; border:none; height: 54px; font-weight: 400; letter-spacing: .025em; padding: 8px 20px; border-radius: 20px 4px 20px 4px; background:linear-gradient(90deg,#ff26a7,#ff2759);"
        newButton.addEventListener("click", () => {if (newButton.textContent == "Enabled"){newButton.textContent = "Disabled"; currentlyEnabled = false;}else{newButton.textContent = "Enabled"; currentlyEnabled = true;}})
        bottomBar.insertBefore(newButton, bottomBar.firstChild);
    }
}
if (currentlyEnabled){createButton();}
 
 
const originalSend = WebSocket.prototype.send;
 
WebSocket.prototype.send = function(data) {
    const modifiedData = modifyDataBeforeSend(data);
    console.log("Sent:", data);
    if (modifiedData && currentlyEnabled){
        console.log("modify", modifiedData);
        if (modifiedData.includes("unsubscribe")){
            originalSend.call(this, modifiedData);
            const mainText = getLastElementInMessages().firstChild.textContent;
            setTimeout(() => {getLastElementInMessages().firstChild.textContent = mainText;}, 100);
        }else{
            originalSend.call(this, modifiedData);
        }
    }else{
        originalSend.call(this, data);
    }
};
 
 
const regex = /^\d+/;
 
function extractNumberFromString(inputString) {
    const match = inputString.match(regex);
    if (match) {
        return parseInt(match[0]);
    }
    return null;
}
 
function getLastElementInMessages(){
    const lastestContainer = document.querySelectorAll(".message-bubble-content-container.sender.clickable");
    const lastContainer = lastestContainer[lastestContainer.length - 1]
    return lastContainer;
}
function changeTextContent(messageContent){
    try{
        //OPTIONAL(change your last message bubble to the correct textcontent)
        getLastElementInMessages().firstChild.textContent = messageContent;
    }catch(err){
        console.error("An error occurred:", err);
    }
}
 
//main function
function bypassLengthLimit(array){
    console.log("MESSAGES", array);
    //message goes here.. make it as long as you want
    array[array.length - 1].content = "eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee The FitnessGram™ Pacer Test is a multistage aerobic capacity test that progressively gets more difficult as it continues. The 20 meter pacer test will begin in 30 seconds. Line up at the start. The running speed starts slowly, but gets faster each minute after you hear this signal. [beep] A single lap should be completed each time you hear this sound. [ding] Remember to run in a straight line, and run as long as possible. The second time you fail to complete a lap before the sound, your test is over. The test will begin on the word start. On your mark, get ready, start."
    //console.log("LENGTH OF MODIFIED STRING", array[array.length - 1].content.length); //can be over 420 and the ai will still understand prompt(it will not show up on reload)
    //console.log("MAX LENGTH", 420); // or {example max string here}.length - is the same 420 char.
    changeTextContent(array[array.length - 1].content)
}
 
 
 
function modifyDataBeforeSend(data) {
    if (data.includes("get_completion") && currentlyEnabled) {
      let parsedData;
        try {
            const savedString = extractNumberFromString(data);
            data = data.replace(extractNumberFromString(data), "");
            console.log(data);
            parsedData = JSON.parse(data);
 
            const messagesArray = parsedData[1].messages;
            //console.log("MESSAGES", messagesArray);
            bypassLengthLimit(messagesArray);
            console.log(parsedData);
            // convert back to JSON
            data = JSON.stringify(parsedData);
            data = savedString + data;
            console.log("Modifiying:", data);
            return data;
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    }
  return data;
}
 
 
//i.e - when loading a new conversation
// catch xhr requests
var originalXHR = window.XMLHttpRequest;
window.XMLHttpRequest.prototype.realSend = window.XMLHttpRequest.prototype.send;
// Override the open and send methods to intercept
window.XMLHttpRequest = function() {
  var xhr = new originalXHR();
 
  xhr.open = function(method, url) {
    console.log('XHR request intercepted:', method, url);
    return originalXHR.prototype.open.apply(this, arguments);
  };
 
  xhr.send = function(data) {
    if (data){
        console.log('XHR data intercepted:', data);
        const firstString = extractNumberFromString(data);
        console.log(firstString);
        if (data.includes("get") && currentlyEnabled){
            let mainsString = data;
            mainsString = mainsString.replace(firstString, "");
            mainsString = mainsString.replace('["subscribe","normal_queue"]', "")
            const secondString = mainsString.substring(0,4); //get the number(420)
            mainsString = mainsString.substring(4);
            mainsString = JSON.parse(mainsString);
            const messagesArray = mainsString[1].messages;
            bypassLengthLimit(messagesArray);
            mainsString = JSON.stringify(mainsString);
            //420["subscribe", "normal_queue"]{object with data}
            mainsString = firstString + '["subscribe","normal_queue"]' + secondString + mainsString;
            console.log("modifying XHR:", mainsString);
            data = mainsString;
 
        }
 
    }
    return originalXHR.prototype.send.apply(this, arguments);
  };
 
  return xhr;
};