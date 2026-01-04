// ==UserScript==
// @name         Auto Guess
// @version      0.1
// @description  script perso
// @author       matthlefevre
// @match        https://skribbl.io/*
// @grant        none
// @namespace https://greasyfork.org/users/938392
// @downloadURL https://update.greasyfork.org/scripts/448315/Auto%20Guess.user.js
// @updateURL https://update.greasyfork.org/scripts/448315/Auto%20Guess.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.getElementById("containerLogoSmall").innerHTML += "<div id=\"divQueue\" style=\"font-size: 35px;\"><input type=\"text\" id=\"inputQueue\" autocomplete=\"off\"></div><div id=\"divBot\" style=\"font-size: 40px;\"><button id=\"buttonBot\" style=\"background-color: red;\">BOT</button></div>"
    let input = document.getElementById("inputQueue");
    input.addEventListener("keypress",function(e){if (e.key == "Enter") {pushQueue(input.value); input.value = "";}});
    var buttonBot = document.getElementById("buttonBot");
    buttonBot.addEventListener("click", function() {
        if (boolON)
            buttonBot.style.backgroundColor="red";
        else
            buttonBot.style.backgroundColor="green";
        boolON = !boolON;
    });

    var words = [];
    var wordsSend = [];
    var queue = [];

    var boolGuessed = false;
    var boolON = false;

    var name;

    function getWords() {
        let wordstemp = [];
        let html = document.getElementById("wordlist");
        if (html)
        {
            html.childNodes.forEach((mot) => {wordstemp.push(mot.innerHTML);});
            if (wordstemp.length > words.length)
                wordsSend = [];
            if (wordstemp.length != words.length) {
                words = wordstemp;
                for (let i = 0; i < words.length; i++) {
                    if (wordsSend.includes(words[i]))
                        html.childNodes[i].style.backgroundColor = "#ff5d64";
                }
            }
        }
    }

    function testAllSend() {
        let b = true;
        words.forEach((mot) => {if (!wordsSend.includes(mot)) b = false;});
        return b;
    }

    function sendWords() {
        if (queue.length != 0) {
            let randomElement = queue[0];
            wordsSend.push(randomElement);
            let value = document.getElementById("inputChat").value;
            $('#inputChat').val(randomElement);
            $('#formChat').trigger($.Event('submit'));
            $('#inputChat').val(value);
            queue.shift();
        } else {
            clearInterval(start);
            let randomElement;
            let random;
            do {
                random = Math.floor(Math.random() * words.length);
                randomElement = words[random];
            } while (wordsSend.includes(randomElement));
            document.getElementById("wordlist").childNodes[random].style.backgroundColor = "#ff5d64";
            wordsSend.push(randomElement);
            let value = document.getElementById("inputChat").value;
            $('#inputChat').val(randomElement);
            $('#formChat').trigger($.Event('submit'));
            $('#inputChat').val(value);
        }
    }

    function getSuccess() {
        let div = document.getElementById("boxMessages").childNodes;
        if (div.length > 0) {
            let last = div[div.length-1];
            if (last.childNodes.length == 1) {
                let text = last.firstChild.innerHTML;
                if ((text.includes("The word was")) || (text.includes(name + " guessed the word!")))
                    boolGuessed = true;
                if (text.includes("is drawing now!"))
                    boolGuessed = false;
            }
        }
    }

    function getName() {
        name = document.getElementById("inputName").value;
    }

    function pushQueue(s) {
        console.log(s);
        if ((!wordsSend.includes(s)) && (words.length != 0))
            queue.push(s);
    }

    setInterval(function() {getWords();}, 500);
    setInterval(function() {if ((words.length > 0) && (!testAllSend()) && (!boolGuessed) && (boolON)) sendWords();}, 1500);

    setInterval(function() {getSuccess();}, 100);

    var start = setInterval(function() {getName();}, 100);

})();