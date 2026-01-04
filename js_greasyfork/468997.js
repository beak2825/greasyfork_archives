// ==UserScript==
// @name         Codeforces User Notes
// @namespace    https://therehello.top
// @author       therehello
// @version      1.0
// @license MIT
// @description  Adds a notes section to Codeforces user profiles for adding custom notes.
// @match        *://codeforces.com/profile/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/468997/Codeforces%20User%20Notes.user.js
// @updateURL https://update.greasyfork.org/scripts/468997/Codeforces%20User%20Notes.meta.js
// ==/UserScript==

(function () {
    "use strict";

    var addNotesSection = function () {
        var ok = false;
        var handle = window.location.pathname.split("/")[2];
        var notes = GM_getValue(handle, "");

        var notesContainer = document.createElement("li");
        notesContainer.classList.add("notes-container");


        var notesIcon = document.createElement("img");
        notesIcon.id = "notes-icon";
        notesIcon.src = "data:img/jpg;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAAbwAAAG8B8aLcQwAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAAFSSURBVDiNjdMxaxVBFAXg7/pexEJNUCtbg2JhMJAqRbCLna2VFiLYWlikMY2NhaB/ISkskyqky0sjNglRJBAEEWwEFWIhQYncFDsbNut7rAeG3Zl75u45O2fgKX5gf8T4jW1MZab2UDaPDysWwkss4wtm2vU+epn5MyImcdZJ7JbnR7zFSkRcycw/NaEPEdHHc1xsNVjABh6X+Tlcx7smaX+U/CF2BrjZtqCouI0Jw3GI1QZ3DPN407Rwq6PBoLyfwSYOsBjFwqiNJxARA9WPvorXmK4V9PCkQ8ELjOE7HhVFc33IzL8R8bmjwR2M4y7WcC8zt/mPU8AsvmIS61ioa6GK6yUs4ULry4vYwp4q0gf4kJn3a0Jt4TAinuF8q8EOZvBLlcSHeNAkHOcgM3cNQUTcwGV8U12qf9B1mU7hNHp4j2vtJL7Cp3KUXVjPzL3mwhFolunxT0yfJgAAAABJRU5ErkJggg==";
        notesIcon.style.display = "inline-block";
        notesIcon.style.width = "22px";
        notesIcon.style.height = "22px";
        notesIcon.style.marginRight = "0.5em";
        notesIcon.style.marginLeft = "2px";
        notesIcon.onclick = function toggleTextBox() {
            if (ok == true) {
                ok = false;
                return;
            }
            var textBox = document.getElementById("notes-box");
            if (textBox.style.display === "none") {
                var displayText = document.getElementById("notes-text");
                notesIcon.style.opacity = '0.5';
                textBox.style.display = "inline-block";
                textBox.value = displayText.innerHTML.trim();
                displayText.style.display = "none";
                textBox.focus();
            }
        };

        var blank = document.createElement("div");
        blank.style.display = "inline-block";
        blank.innerHTML = "&nbsp;";
        var notesText = document.createElement("div");
        notesText.style.display = "inline-block";
        notesText.id = "notes-text";
        notesText.innerHTML = notes;
        var notesBox = document.createElement("textarea");
        notesBox.id = "notes-box";
        notesBox.rows = "1";
        notesBox.style.display = "inline-block";
        notesBox.style.width = "100px";
        notesBox.style.resize = "none";
        notesBox.style.display = "none";
        notesBox.addEventListener("blur", function () {
            ok = true;
            var textBox = document.getElementById("notes-box");
            var displayText = document.getElementById("notes-text");
            var text = textBox.value;
            GM_setValue(handle, text);
            notesIcon.style.opacity = '1';
            textBox.style.display = "none";
            displayText.innerHTML = text;
            displayText.style.display = "inline-block";
        });

        notesContainer.appendChild(notesIcon);
        notesContainer.appendChild(blank);
        notesContainer.appendChild(notesText);
        notesContainer.appendChild(notesBox);

        var infoUlElement = document.querySelector(".info").querySelector("ul");
        infoUlElement.insertBefore(notesContainer, infoUlElement.childNodes[0]);

    };

    var fontAwesomeStyle = document.createElement("link");
    fontAwesomeStyle.rel = "stylesheet";
    fontAwesomeStyle.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css";
    document.head.appendChild(fontAwesomeStyle);

    var customStyle = document.createElement("style");
    customStyle.innerHTML = `
        .notes-container {
            display: flex;
            align-items: center;
        }
    `;
    document.head.appendChild(customStyle);

    addNotesSection();
})();