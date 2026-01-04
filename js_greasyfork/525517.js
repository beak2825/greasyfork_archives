// ==UserScript==
// @name         Edytuj Strone Librus
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Pozwala edytować każdą stronę na żywo i zapisywać zmiany!
// @author       Ty
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525517/Edytuj%20Strone%20Librus.user.js
// @updateURL https://update.greasyfork.org/scripts/525517/Edytuj%20Strone%20Librus.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tworzy przyciski: aktywacja edycji, zapis zmian
    let buttonEdit = document.createElement("button");
    buttonEdit.innerHTML = "Włącz edycję";
    buttonEdit.style.position = "fixed";
    buttonEdit.style.top = "10px";
    buttonEdit.style.right = "10px";
    buttonEdit.style.zIndex = "9999";
    buttonEdit.style.padding = "10px";
    buttonEdit.style.background = "#ff0000";
    buttonEdit.style.color = "#fff";
    buttonEdit.style.border = "none";
    buttonEdit.style.cursor = "pointer";
    buttonEdit.style.fontSize = "16px";
    document.body.appendChild(buttonEdit);

    let buttonSave = document.createElement("button");
    buttonSave.innerHTML = "Zapisz zmiany";
    buttonSave.style.position = "fixed";
    buttonSave.style.top = "10px";
    buttonSave.style.right = "120px";
    buttonSave.style.zIndex = "9999";
    buttonSave.style.padding = "10px";
    buttonSave.style.background = "#00cc00";
    buttonSave.style.color = "#fff";
    buttonSave.style.border = "none";
    buttonSave.style.cursor = "pointer";
    buttonSave.style.fontSize = "16px";
    document.body.appendChild(buttonSave);

    // Funkcja włączająca tryb edycji
    buttonEdit.addEventListener("click", function() {
        document.body.contentEditable = (document.body.contentEditable === "true") ? "false" : "true";
        buttonEdit.innerHTML = (document.body.contentEditable === "true") ? "Wyłącz edycję" : "Włącz edycję";
        buttonEdit.style.background = (document.body.contentEditable === "true") ? "#00cc00" : "#ff0000";
    });

    // Funkcja zapisująca zmiany
    buttonSave.addEventListener("click", function() {
        if (document.body.contentEditable === "true") {
            // Zapisz zmieniony HTML do localStorage
            localStorage.setItem("savedContent", document.body.innerHTML);
            alert("Zmiany zostały zapisane!");
        } else {
            alert("Musisz włączyć tryb edycji, aby zapisać zmiany.");
        }
    });

    // Sprawdź, czy są zapisane zmiany w localStorage
    if (localStorage.getItem("savedContent")) {
        // Przywróć zapisane zmiany po załadowaniu strony
        document.body.innerHTML = localStorage.getItem("savedContent");
    }
})();
