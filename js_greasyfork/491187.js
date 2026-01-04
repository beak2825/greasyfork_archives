// ==UserScript==
// @name         TTRockstars Devil
// @namespace    https://github.com/usercromix/TTrockstars-Devil
// @version      1.0
// @description  Automatic answer bot for https://play.ttrockstars.com/
// @author       usercromix
// @license      TTrockstars Devil © 2024 by usercromix, © All Rights Reserved
// @match        https://play.ttrockstars.com/*
// @icon         https://play.ttrockstars.com/ttrs-favicon.png
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/491187/TTRockstars%20Devil.user.js
// @updateURL https://update.greasyfork.org/scripts/491187/TTRockstars%20Devil.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_log("Your script is running.");

    // Key code for enabling/disabling the bot (default is 'B' key)
    var toggleKey = 66; // 'B' key code
    var speed = 0.225; // Default speed (equivalent to 225 milliseconds)

    // Variable to track whether the bot is running or not
    var running = false;

    // Function to toggle the bot state
    function toggleBot() {
        running = !running;
        GM_log("Bot " + (running ? "enabled" : "disabled"));
    }

    // Function to change the toggle key
    function changeToggleKey(newKeyCode) {
        toggleKey = newKeyCode;
        GM_log("Toggle key changed to: " + String.fromCharCode(newKeyCode));
    }

    // Function to set the speed
    function setSpeed(newSpeed) {
        speed = newSpeed;
        GM_log("Speed set to: " + newSpeed);
    }

    // Event listener to toggle the bot when the toggle key is pressed
    document.addEventListener("keydown", function(event) {
        if (event.keyCode === toggleKey) {
            toggleBot();
        } else if (event.shiftKey && event.keyCode !== 16) { // Only Shift key, excluding Shift itself
            toggleMenu();
        }
    });

    // Toggle the menu visibility
    function toggleMenu() {
        var menu = document.getElementById("menu");
        if (menu.style.display === "block") {
            menu.style.display = "none";
        } else {
            menu.style.display = "block";
        }
    }

    // Set up an interval function that runs every 100 milliseconds
    setInterval(() => {
        var equation = document.getElementsByClassName("notranslate height-100 noselect current")[0];
        var input = document.getElementsByClassName("input-holder width-100")[0];
        if (input == undefined || input == null) {
            input = document.getElementsByClassName("input-holder width-100 hint")[0];
        }
        var enter = document.getElementsByClassName("key-ent ng-star-inserted")[0];
        var top = document.getElementsByClassName("next-game-question padding-5")[0];
        var keypad = document.getElementsByClassName("keyboard mat-white-color bg-2")[0];
        var play;

        if (equation != undefined) {
            if (!running) {
                return;
            }

            let el = document.createElement("div");
            el.setAttribute("href", "https://github.com/usercromix/TTrockstars-Devil");
            el.setAttribute("target", "_blank");
            for (var i = 0; i < top.children.length; i++) {
                top.children[i].remove();
            }
            el.style = "background-color: peachpuff; color: black; width: auto; align-items: center; margin-top: 10px; margin-bottom: 10px; padding: 5px; border-radius: 10px; text-align: center; font-family: 'Fredoka One', sans-serif;";
            el.innerHTML = "Exploit Enabled";
            top.appendChild(el);

            var id = setInterval(() => {
                if (running) {
                    let raw = equation.innerHTML.replace("×", "*").replace("÷", "/");
                    console.log(raw);
                    while (raw.includes("<!---->")) {
                        raw = raw.replace("<!---->", "");
                    }
                    raw = raw.replace(/<\s*span[^>]*>.*?<\s*\/\s*span\s*>/g, '');
                    raw = raw.trim();
                    console.log(raw);
                    let answer = String(eval(raw));
                    GM_log("answer: " + answer);

                    [...answer].forEach(char => {
                        for (var row = 0; row < keypad.children.length; row++) {
                            for (var key = 0; key < keypad.children[row].children.length; key++) {
                                let elem = keypad.children[row].children[key];
                                if (elem.innerHTML.trim() == char) {
                                    elem.click();
                                    elem.style.transform = "scale(0.9)";
                                    setTimeout(() => {
                                        elem.style.transform = "scale(1)";
                                    }, 100);
                                    return;
                                }
                            }
                        }
                    });
                    enter.click();
                } else {
                    clearInterval(id);
                }
            }, speed * 1000); // Convert speed to milliseconds
        } else {
            running = false;
            var gameOver = document.getElementsByClassName("stamp center mat-white-color")[0];
            if (gameOver != undefined) {
                gameOver.innerHTML = "You like the hacks?😊";
            }
        }
    }, 100);

    // Create the menu
    var menu = document.createElement("div");
    menu.id = "menu";
    menu.style = "display: none; position: fixed; top: 10px; left: 10px; z-index: 9999; background-color: rgba(255, 255, 255, 0.8); border: 1px solid #ccc; padding: 20px; border-radius: 10px; width: 300px; font-family: Arial, sans-serif; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: transform 0.3s;";

    // Menu content
    var menuContent = "<div style='margin-bottom: 20px; text-align: center; font-size: 20px; font-weight: bold; color: #333;'>TTRockstars Devil Menu</div>" +
                      "<div style='margin-bottom: 20px;'>Recommended to change toggle key before going into a round! Also, speed might be a little buggy so change it if you know how to use! To open and close menu Shift + M on keyboard</div>" +
                      "<label style='margin-bottom: 15px; display: block;'>Toggle Key: <input type='text' id='toggleKey' value='" + String.fromCharCode(toggleKey) + "' style='width: 30px; text-align: center;'></label>" +
                      "<label style='margin-bottom: 15px; display: block;'>Speed: <input type='text' id='speed' value='" + speed + "' style='width: 50px; text-align: center;'></label>" +
                      "<button id='apply' style='padding: 8px 15px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; margin-right: 10px; transition: transform 0.3s;'>Apply Changes</button>" +
                      "<button id='closeMenu' style='padding: 8px 15px; background-color: #f44336; color: white; border: none; border-radius: 5px; cursor: pointer; transition: transform 0.3s;'>Close</button>";
    menu.innerHTML = menuContent;

    document.body.appendChild(menu);

    // Add event listener for applying changes
    document.getElementById("apply").addEventListener("click", function() {
        var newToggleKey = document.getElementById("toggleKey").value.toUpperCase().charCodeAt(0);
        changeToggleKey(newToggleKey);
        var newSpeed = parseFloat(document.getElementById("speed").value);
        setSpeed(newSpeed);
        this.style.transform = "scale(0.9)";
        setTimeout(() => {
            this.style.transform = "scale(1)";
        }, 100);
    });

    // Add event listener to close the menu
    document.getElementById("closeMenu").addEventListener("click", function() {
        toggleMenu();
        this.style.transform = "scale(0.9)";
        setTimeout(() => {
            this.style.transform = "scale(1)";
        }, 100);
    });

    // Add hover animation for buttons
    var buttons = document.querySelectorAll("#menu button");
    buttons.forEach(button => {
        button.addEventListener("mouseenter", function() {
            this.style.transform = "scale(0.95)";
        });
        button.addEventListener("mouseleave", function() {
            this.style.transform = "scale(1)";
        });
    });

})();