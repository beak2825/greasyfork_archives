// ==UserScript==
// @name         Haxball Terror
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Terror every room in Haxball
// @author       Style (Haxball) - MrTarnegol (FxP)
// @match        https://*.haxball.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383651/Haxball%20Terror.user.js
// @updateURL https://update.greasyfork.org/scripts/383651/Haxball%20Terror.meta.js
// ==/UserScript==

window.gameDocument = document.getElementsByClassName('gameframe')[0].contentWindow.document
window.style = {};

style.write = function(text) {
    gameDocument.getElementsByTagName("input")[0].value = text;
}

style.send = function() {
    gameDocument.getElementsByClassName("input")[0].getElementsByTagName("button")[0].click();
}

style.getMessage = function() {
    return gameDocument.getElementsByTagName("input")[0].value;
}

function getAll() {
    var players = gameDocument.querySelectorAll('[data-hook=name]');
    var string = ""
    for (var i = 0; i < players.length; i++) {
        var player = players[i].innerHTML.replace(/ /g, "_");
        string += "@" + player + " ";
    }
    return string;
}

function spamMessage() {
    var message = style.getMessage();
    style.write(message);
    style.send();
    style.write(message);
}

function tagAll() {
    var tag = getAll();
    if (tag) {
        var message = style.getMessage();
        var string = tag + message;
        style.write(string);
        style.send();
        style.write(message);
    }
}

function addInGameButtons() {
    var input = gameDocument.getElementsByClassName("input")[0];
    if (input !== undefined) {
        var tag = input.children[1].cloneNode(false);
        tag.style.marginLeft = "5px";
        tag.innerText = "TagAll";
        tag.onclick = tagAll;
        input.appendChild(tag);
        var spam = input.children[1].cloneNode(false);
        spam.style.marginLeft = "5px";
        spam.innerText = "Spam";
        spam.onclick = spamMessage;
        input.appendChild(spam);
    }
}

function addButtons() {
    addInGameButtons();
}

setTimeout(function() {
    var observer = new MutationObserver(addButtons);
    var holder = gameDocument.body.getElementsByTagName("div")[0];
    observer.observe(holder, {childList: true});
    addButtons();
}, 3000);