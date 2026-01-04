// ==UserScript==
// @name         EWTF
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A script to interact with cloud variables in Scratch
// @author       justDarian
// @license      MIT License
// @match        *://scratch.mit.edu/projects/*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/501869/EWTF.user.js
// @updateURL https://update.greasyfork.org/scripts/501869/EWTF.meta.js
// ==/UserScript==

// dont skid
(function() {
    'use strict';

    // Drag element function
    function dragElement(e) {
        var n = 0, t = 0, o = 0, u = 0;
        function l(e) {
            (e = e || window.event).preventDefault();
            o = e.clientX;
            u = e.clientY;
            document.onmouseup = m;
            document.onmousemove = d;
        }
        function d(l) {
            (l = l || window.event).preventDefault();
            n = o - l.clientX;
            t = u - l.clientY;
            o = l.clientX;
            u = l.clientY;
            e.style.top = e.offsetTop - t + "px";
            e.style.left = e.offsetLeft - n + "px";
        }
        function m() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
        if (document.getElementById(e.id + "header")) {
            document.getElementById(e.id + "header").onmousedown = l;
        } else {
            e.onmousedown = l;
        }
    }

    // Check if the script has already been executed
    if (document.getElementById("EWTF")) {
        alert("EWTF is already executed, reloading...");
        window.onbeforeunload = undefined;
        window.location.reload();
        return;
    }

    // UI creation
    let menu = document.createElement("div");
    menu.innerHTML = `
        <style>
            .ewtf {
                width: 300px;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                background-color: #282828;
                color: #fff;
                outline: #fff solid 1px;
                position: absolute;
                z-index: 99999;
                border-radius: 10px;
                padding: 20px;
                text-align: center;
            }
            .ewtf h1 {
                font-size: 32px;
                font-weight: bold;
                color: #ff69b4;
                text-shadow: 2px 2px 4px #800080;
                -webkit-text-stroke-width: 0.5px;
                -webkit-text-stroke-color: #800080;
                margin: 10px 0;
            }
            .ewtf i {
                font-weight: bold;
                color: #fff;
            }
            .ewtf h2 {
                font-size: 25px;
                font-weight: bold;
                color: #fff;
            }
            .ewtf button {
                background-color: #333;
                color: #fff;
                border: none;
                padding: 10px 20px;
                border-radius: 5px;
            }
            .ewtf a {
                color: #fff;
                font-weight: bold;
            }
        </style>

        <div id="EWTF" class="ewtf">
            <h1>EWTF</h1>
            <i>Press E to hide or show this panel at any time</i>
            <h2>Cloud Variables</h2>
            <button onclick="mcv()">Modify</button>
            <button onclick="spam()" id="spam">Spam</button>
            <br><br>
            <hr>
            <footer>created by <a href="https://github.com/justDarian">darian</a> (<a href="https://discord.gg/haxx">discord</a>)</footer>
        </div>
    `;
    dragElement(menu.lastElementChild); // allow it to drag
    document.body.appendChild(menu); // append the UI, aka make it visible

    // Manage hiding/showing
    document.addEventListener("keydown", e => {
        if (e.key === "e" || e.key === "E") {
            menu.style.display = menu.style.display === "none" ? "block" : "none";
        }
    });

    const userName = document.getElementsByClassName("profile-name")[0].textContent;
    const projectId = window.location.href.split("/")[4];
    let ws;
    let connected = false;

    // Functions
    function connect() {
        if (!window.location.href.includes("projects")) {
            return alert("EWTF: Not in a project");
        }
        // Create a WebSocket connection and define it to "ws"
        ws = new WebSocket("wss://clouddata.scratch.mit.edu/");
        // Send the handshake when connected
        ws.onopen = function () {
            connected = true;
            console.log("EWTF: Connected");
            alert('EWTF: Connected');

            sendData({
                method: "handshake",
                user: userName,
                project_id: projectId
            });
        };
        ws.onclose = function () {
            connected = false;
            console.log("EWTF: Disconnected");
            // Auto reconnect
            connect();
        };
    }
    // Auto connect
    connect();

    function sendData(thing) {
        if (connected) {
            ws.send(JSON.stringify(thing) + "\n"); // Sends the data to the WS with a newline at the end
            return true;
        } else {
            return false;
        }
    }

    // Modify a single variable
    window.mcv = function() {
        if (!connected) {
            return alert("EWTF: You are currently disconnected. Please wait and try again later");
        }
        const variableName = prompt("EWTF: Name of the variable to change?\nNOTE: You can find this by checking cloud monitor or code", "ex: score");
        const newValue = prompt("EWTF: What do you want to change " + variableName + " to?\nNOTE: It HAS to be a number", "ex: 999");
        sendData({
            method: "set",
            user: userName,
            project_id: projectId,
            name: `☁ ${variableName}`,
            value: newValue
        });
    }

    // Spam variables
    let spamming = false;
    window.spam = () => {
        let btn = document.getElementById("spam");

        if (spamming) {
            btn.textContent = "Spam";
            window.clearInterval(window.EWTFint);
            spamming = false;
            return;
        }

        let inputs = prompt("EWTF: What variables would you like to spam? (separated by commas)\nNOTE: leave blank for random variables (can only be seen in cloud logs)\n\nEX:", "score,highscore");
        let values = prompt("EWTF: What are the integer values you would like to change the variables to? (separated by commas)\nNOTE: leave blank for random\n\nEX:", "1,2,3,4");

        // Check if input is empty else make it one
        if (inputs === "" || inputs === null) {
            inputs = ["EWTF ONTOP", "Scratch, fix yo shit"];
        } else {
            inputs = inputs.split(',');
        }
        if (values === "" || values === null) {
            values = [69, 420, 6969];
        } else {
            values = values.split(',');
        }

        window.EWTFint = setInterval(() => {
            sendData({
                method: "set",
                user: userName,
                project_id: projectId,
                name: `☁ ${inputs[Math.floor(Math.random() * inputs.length)]}`,
                value: values[Math.floor(Math.random() * values.length)]
            });
        }, 100);

        btn.textContent = "Stop Spamming";
        spamming = true;
    }
})();