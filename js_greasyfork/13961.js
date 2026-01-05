// ==UserScript==
// @name         Twimages
// @namespace    https://github.com/SammyIAm
// @version      0.4.5
// @description  Inline images (and other extras) for Twitch Chat
// @author       Sammy1Am
// @match        http://www.twitch.tv/*
// @match        https://www.twitch.tv/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/13961/Twimages.user.js
// @updateURL https://update.greasyfork.org/scripts/13961/Twimages.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//debugger;

var lastMessage = null; // Last message processed.
var imageRegex = /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp))/i; // Which image links to embed as an img tag
var twitchUsername = getTwitchUsername(); // Get username from GM value storage
var chatLines; // The chat-lines ul element (containing all the chatlines)

// Meta tag for iframes to prevent sending referrer (and fix imgur redirects)
var referrerBlock = document.createElement("meta");
referrerBlock.name = "referrer";
referrerBlock.content = "never";


// Attempt to get a stored username, or prompt for a new one.
function getTwitchUsername() {
    if (GM_getValue("twimage_username",null) === null || GM_getValue("twimage_username", null) === ""){
        GM_setValue("twimage_username", prompt("Twimages: Please enter your Twitch username for chat highlighting.", ""));
    }
    return GM_getValue("twimage_username",null);
}

// Gets all the new messages after the last one we've processed (or all the messages if we haven't processed any)
function getNewMessages(){
    if (lastMessage === null){
        lastMessage = chatLines.children[chatLines.children.length-1];
        return Array.prototype.slice.call(chatLines.children);
    } else {
        var nextMessages = [];
        while (lastMessage.nextElementSibling !== null){
            nextMessages.push(lastMessage.nextElementSibling);
            lastMessage = lastMessage.nextElementSibling;
        }
        return nextMessages;
    }
}

// Searches for image links in the message and inserts the image below the message
function embedImages(messageDiv){
    var message = messageDiv.getElementsByClassName("message")[0];
    var imageUrlMatches = message.textContent.match(imageRegex);

    if (imageUrlMatches !== null){
        var imageUrl = imageUrlMatches[0];

        // Create link so you can link to the URL
        var imageInsert = document.createElement("a");
        imageInsert.href = imageUrl;
        imageInsert.target = "_blank";
        imageInsert.style.display = "block";

        // Create image that's reasonably sized
        var newImage = document.createElement("img");
        newImage.src = imageUrl;
        newImage.style.border = "1px solid black";
        newImage.style.maxHeight = "120px";
        newImage.style.maxWidth = "100%";

        imageInsert.appendChild(newImage);

        message.appendChild(imageInsert);
    }
}

// Searches for the configured username and highlights the message if it contains the name
function highlightUsername(messageDiv){
    var message = messageDiv.getElementsByClassName("message")[0];
    if (message.textContent.toLowerCase().indexOf(twitchUsername.toLowerCase()) > -1){
        message.style.backgroundColor = "#C4B3DB";
    }
}

// Adds a clickable '@' link next to each username
function addReplyLink(messageDiv){
    var fromSpan = messageDiv.getElementsByClassName("from")[0];
    var replyLink = document.createElement("a");
    replyLink.innerHTML = "@";
    replyLink.style.cursor = "pointer";
    replyLink.addEventListener('click', function(){
        onReplyLinkClick(fromSpan.textContent);
    });
    messageDiv.getElementsByTagName("span")[0].insertBefore(replyLink, fromSpan);
}
// Triggered when '@' link clicked on
function onReplyLinkClick(replyUsername){
    var chatTextArea = document.getElementsByClassName("ember-text-area")[0];
    chatTextArea.value = '@' + replyUsername + ': ';
    chatTextArea.focus();
}

// Function to find and process new messages (triggered by update)
function processNewMessages(){
    getNewMessages().forEach(function(newMessage){
        embedImages(newMessage);
        highlightUsername(newMessage);
        //addReplyLink(newMessage); // Not working yet, something changed
    });
}

// Find the chat-lines and set up observer or refresh timer
function initialize(){
    chatLines = document.getElementsByClassName("chat-lines")[0];

    // Firefox doesn't seem to like the observer, so we'll fallback to a safe polling-style for non-Chrome
    if(navigator.userAgent.toLowerCase().indexOf('chrome') > -1){
        // Set up observer to trigger processing each time a new message is added
        var observer = new MutationObserver(processNewMessages);
        var config = { attributes: false, childList: true, characterData: false };
        observer.observe(document.getElementsByClassName("chat-lines")[0], config);
    } else {
        var refreshInterval = setInterval(function(){
            chatLines = document.getElementsByClassName("chat-lines")[0];
            processNewMessages();
        }, 500);
    }
}

// Wait for the chat-lines to show up, then initialize.
var waitForChatLines = setInterval(function(){
    if (document.getElementsByClassName("chat-lines").length > 0){
        initialize();
		clearInterval(waitForChatLines);
    }
}, 5000); // This has to be longer than 1 second for Firefox (for some reason?)
