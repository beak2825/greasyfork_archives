// ==UserScript==
// @name         CatWar Notepad+
// @version      1.0
// @description  Блокнот, копирование сообщений
// @author       1570184 2025
// @match        https://*.catwar.net/cw3/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @namespace https://greasyfork.org/users/1429171
// @downloadURL https://update.greasyfork.org/scripts/525354/CatWar%20Notepad%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/525354/CatWar%20Notepad%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function (){
        console.log("DOM fully loaded and parsed");

// Для блокнота

        const chat = document.querySelector("#tr_chat > td");
        var myNotes = document.createElement("div");
        const notesContent = document.createTextNode("");
        myNotes.innerHTML = '<div id="noteProper" style = "margin:5px"><textarea id="myNotesSave" style = "width:100%;height:8em;border:none;color:lightgreen;background:black;resize:none;" placeholder = "Важные заметки для игровой"></textarea></div>';
        myNotes.children.style = "margin:5px;padding:5px;width:100%";
        chat.prepend(myNotes);

        var chatForm = document.querySelector("#text");

        var field = document.getElementById("myNotesSave");

        if (localStorage.getItem("autosave")) {
            field.value = localStorage.getItem("autosave");
        }

        field.addEventListener("change", () => {
            localStorage.setItem("autosave", field.value);
        });


        // Для плюсика в чате


        const el = document.getElementById("chat_msg");
        const elements = el.getElementsByTagName("table");
        var fullMessage = "";

        function modifyChat () { // Fires each time a mutation is reported

            var messages = []; // Message array is clear to assing them anew

            if (elements.length) {
                for (let i=0; i <= elements.length; i++) {
                    addButtons(i);
                }
            }

            function addButtons (messageNum) { // Fires each time a mutation is reported + elements.length is not null

                var buttons = elements[messageNum].childNodes[0].childNodes[0].childNodes[2];

                if (buttons.childNodes[0].innerHTML != "+") {

                    // Создаём кнопку
                    const plus = document.createElement("a");
                    plus.innerHTML = "&#x2b";
                    plus.href = "#";
                    buttons.prepend (" | ");
                    buttons.prepend (plus);
                    buttons.style = "width: max-content; float: right; padding: 0 5px";
                    elements[messageNum].childNodes[0].childNodes[0].childNodes[0].childNodes[0].style = "width: auto; float: left; padding: 0 5px";
                }

                var text = elements[messageNum].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].innerHTML;
                var name = elements[messageNum].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[2].innerHTML;
                var id = buttons.childNodes[2].href.split("net/cat")[1]; //https://catwar.net/cat1412095
                console.log(id);

                let message = {
                    text: text,
                    name: name,
                    id: id,
                };

                message.writeOut = function() {
                    //console.log(messageNum);
                    //console.log(messages);
                    var fullMessage = this.name + " [cat" + this.id + "] " + this.text;
                    field.value = field.value.replace (/^/, fullMessage + "\n");
                    localStorage.setItem("autosave", field.value);
                };

                // Записываем значения сообщения
                messages.push (message);

                buttons.childNodes[0].onclick = function () {messages[messageNum].writeOut();};

            }

        }

//setTimeout(() => { modifyChat();}, "1000");

const observer = new MutationObserver(entries => { modifyChat() })

// Start observing the target node for configured mutations
observer.observe(el, { childList: true });

};



})();