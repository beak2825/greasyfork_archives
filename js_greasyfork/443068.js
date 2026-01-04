// ==UserScript==
// @name         PnW messages preview
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a button to preview unread messages.
// @author       RandomNoobster
// @match        https://politicsandwar.com/inbox/
// @icon         https://politicsandwar.com/favicon.ico
// @license      MIT
// @grant        none
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/443068/PnW%20messages%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/443068/PnW%20messages%20preview.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let links = document.querySelectorAll('.nationtable tbody a');
    links.forEach(link => {
        link.target = "_blank";
    })

    let form = document.querySelector("form");
    let buttonAll = document.createElement("input");
    buttonAll.type = "button";
    buttonAll.value = "Show Preview of All";
    buttonAll.dataset.toggle = "show";
    form.children[2].appendChild(buttonAll);

    let rows = document.querySelectorAll('.nationtable tbody tr');
    let i = 0;
    rows.forEach(row => {
        if (i == 0) {
            let cell = document.createElement("th");
            cell.innerHTML = "Preview";
            cell.style.width = "130px";
            row.children[2].after(cell);
        }
        else {
            let cell = document.createElement("td");
            let button = document.createElement("input");
            button.value = "Show Preview";
            button.display = "inline-block";
            button.type = "button";
            button.id = `convoBtn_${i}`;
            button.style.width = "130px";
            cell.style.width = "130px";
            cell.appendChild(button);
            row.children[2].after(cell);
        }
        i++;
    })

    function convo_preview(target) {
        let a = target.parentNode.parentNode.children[2].children[0];
        let match = document.querySelector(`#${target.id}_row`);
        if (match == null) {
            $.ajax({
                url: a.href,
                success: function(data) {
                    let page = $.parseHTML(data);
                    for(var value of page.values()) {
                        if (value.className == "container") {
                            console.log(value);
                            let newRow = document.createElement("tr");
                            let newCell = document.createElement("td");
                            newCell.colSpan = "7";
                            let messageLogs = value.children[0].children[1].children[7].children;
                            [...messageLogs].forEach(message => {
                                newCell.appendChild(message)
                            });
                            newRow.appendChild(newCell);
                            newRow.id = target.id + "_row"
                            a.parentNode.parentNode.after(newRow);
                            target.value = "Hide Preview";
                            break;
                        }
                    }
                }
            });
        }
        else {
            match.remove()
            target.value = "Show Preview";
        }
    }

    let buttons = document.querySelectorAll("table input[type=button]");
    buttons.forEach(button => {
        button.addEventListener("click", function(event) {
            convo_preview(event.target);
        })
    });

    buttonAll.addEventListener("click", function(event){
        if (event.target.dataset.toggle == "show") {
            let n = 0;
            rows.forEach(row => {
                if (n < 10) {
                    let matchingRow = document.querySelector(`#${buttons[n].id}_row`);
                    if (matchingRow == null) {
                        convo_preview(buttons[n])
                    }
                }
                n++;
            })
            event.target.value = "Hide Preview of All";
            event.target.dataset.toggle = "hide";
        }
        else {
            let m = 0;
            rows.forEach(row => {
                if (m < 10) {
                    let matchingRow = document.querySelector(`#${buttons[m].id}_row`);
                    if (matchingRow != null) {
                        convo_preview(buttons[m])
                    }
                }
                m++;
            })
            event.target.value = "Show Preview of All";
            event.target.dataset.toggle = "show";
        }
    })
})();