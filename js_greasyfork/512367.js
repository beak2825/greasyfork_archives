// ==UserScript==
// @name MonkeyType AutoTyper Bot
// @author ByfronFucker
// @description A Bot that automatically types for you in MonkeyType.
// @icon https://th.bing.com/th/id/R.c8397fb766c4397fea8a8b499c15a453?rik=aROX42RoH7HhXw&pid=ImgRaw&r=0
// @version 1.0
// @match *://monkeytype.com/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/en/users/1380005-real-aquzr
// @downloadURL https://update.greasyfork.org/scripts/512367/MonkeyType%20AutoTyper%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/512367/MonkeyType%20AutoTyper%20Bot.meta.js
// ==/UserScript==

/* jshint esversion:6 */
(function () {
    "use strict";

    const log = console.log;

    let isTyping = false;

    function canType() {
        const typingTest = document.getElementById("typingTest");
        const isHidden = typingTest.classList.contains("hidden");
        return !isHidden;
    }

    function getNextCharacter() {
        const currentWord = document.querySelector(".word.active");
        for (const letter of currentWord.children) {
            if (letter.className === "") return letter.textContent;
        }
        return " ";
    }

    function pressKey(key) {
        const wordsInput = document.getElementById("wordsInput");
        wordsInput.value += key;

        const KeyboardEvent = new KeyboardEvent("keyup", { key: key });
        const InputEvent = new InputEvent("input", { data: key });

        wordsInput.dispatchEvent(InputEvent);
        wordsInput.dispatchEvent(KeyboardEvent);
    }

    function typeCharacter() {
        if (!canType() || !isTyping) {
            return;
        }

        const nextChar = getNextCharacter();
        pressKey(nextChar);

        // Automatically type next character immediately
        setTimeout(typeCharacter, 0);
    }

    const gui = document.createElement("div");
    gui.style.position = "fixed";
    gui.style.bottom = "30%";
    gui.style.right = "0";
    gui.style.transform = "translateY(50%)";
    gui.style.padding = "5px";
    gui.style.background = "rgba(0, 0, 0, 0.6)";
    gui.style.color = "white";
    gui.style.fontFamily = "sans-serif";
    gui.style.fontSize = "12px";
    gui.style.zIndex = "9999";
    gui.innerHTML = `
        <div style="display: flex; flex-direction: column;">
            <button id="startButton" style="background: green; color: white;">Start Typing</button>
            <button id="stopButton" style="background: red; color: white; display: none;">Stop Typing</button>
        </div>
    `;
    document.body.appendChild(gui);

    const startButton = document.getElementById("startButton");
    const stopButton = document.getElementById("stopButton");

    startButton.addEventListener("click", function () {
        if (canType()) {
            isTyping = true;
            log("STARTED TYPING");
            startButton.style.display = "none";
            stopButton.style.display = "block";
            typeCharacter();
        }
    });

    stopButton.addEventListener("click", function () {
        isTyping = false;
        log("STOPPED TYPING");
        startButton.style.display = "block";
        stopButton.style.display = "none";
    });

})();
