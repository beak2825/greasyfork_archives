// ==UserScript==
// @name         Correct your bad habits
// @namespace    https://www.madcaphacker.com/
// @version      1.9
// @author       Gl4zy
// @match        https://play.typeracer.com/
// @description Makes it possible to rewrite your mistakes after a game
// @downloadURL https://update.greasyfork.org/scripts/425569/Correct%20your%20bad%20habits.user.js
// @updateURL https://update.greasyfork.org/scripts/425569/Correct%20your%20bad%20habits.meta.js
// ==/UserScript==

var focus = false; //set "true" to "false" and the scirpt will no longer focus the input feld
var gameended = false;
var reset;

function scanner() {
    if (document.getElementsByClassName("gameStatusLabel")[0] == undefined)
        return;
    if (document.getElementsByClassName("gameStatusLabel")[0].innerText == "The race has ended." && !gameended) {
        gameended = true;
        var mistakes = document.getElementsByClassName("content")[0].innerText.split("\n");
        reset = document.getElementsByClassName("content")[0].innerHTML;

        var textarea = document.createElement("input");
        textarea.style.width = "500px";
        document.getElementsByClassName("content")[0].appendChild(textarea);
        if(focus){
          textarea.focus(); 
        }
        var button = document.createElement("a");
        button.innerHTML = "replay"
        button.style.backgroundColor = "#3cc1a3";
        button.style.color = "#fff";
        button.style.fontWeight = "700";
        button.style.height = "50px";
        button.style.padding = "6px";
        button.style.borderRadius = "10px";
        button.style.cursor = "pointer";
        button.titel = "Keyboard shortcut: Ctrl+Alt+N";
        button.onclick = () => {
            document.getElementsByClassName("content")[0].innerHTML = reset;
            scanner();
            gameended = false;
        };
        document.getElementsByClassName("content")[0].appendChild(document.createElement("br"));
        document.getElementsByClassName("content")[0].appendChild(document.createElement("br"));
        document.getElementsByClassName("content")[0].appendChild(button);

        var i = 0;
        textarea.addEventListener("keydown", function(event){
          if (event.keyCode === 32) {
                if (textarea.value.trim() == mistakes[i]) {
                    document.getElementsByClassName("content")[0].children[i].style.color = "#99cc00";
                    textarea.value = "";
                    i++;
                    if (i == mistakes.length) {
                        textarea.value = "GZ your on your way to become a better typists. Ctrl+Alt+N to replay"
                    }
                }
            }
        })
        textarea.addEventListener("keyup", function(event) {
            if (event.keyCode === 32) {
              if(textarea.value[0] == " " && textarea.value.length == 1){
                textarea.value = "";
              };
            }
            if (event.keyCode == 78 && event.ctrlKey && event.altKey) {button.click();}
            if (mistakes[i] != undefined) {
                for (var x = mistakes[i].length; x > 0; x--) {
                    if (textarea.value.trim().slice(0, x) == mistakes[i].slice(0, x)) {
                        document.getElementsByClassName("content")[0].children[i].innerHTML = "";

                        var span = document.createElement("span");
                        span.style.color = "#99cc00";
                        var text = document.createTextNode(mistakes[i].slice(0, x));
                        span.appendChild(text);

                        if (textarea.value.length > x) {
                            var span2 = document.createElement("span");
                            span2.style.color = "#803333";
                            span2.style.backgroundColor = "#f0a3a3";
                            var text2 = document.createTextNode(mistakes[i].slice(x, textarea.value.length));
                            span2.appendChild(text2)
                        }

                        var text3 = document.createTextNode(mistakes[i].slice(textarea.value.length, mistakes[i].length));
                        var span3 = document.createElement("span");
                        span3.appendChild(text3);

                        document.getElementsByClassName("content")[0].children[i].appendChild(span);
                        if (span2 != undefined) {
                            document.getElementsByClassName("content")[0].children[i].appendChild(span2);
                        }
                        document.getElementsByClassName("content")[0].children[i].appendChild(span3);
                        break;
                    }
                }
            }
            
        })


    } else if (document.getElementsByClassName("gameStatusLabel")[0].innerText != "The race has ended.") {
        gameended = false;
    }
}

var sc = setInterval(scanner, 1000);