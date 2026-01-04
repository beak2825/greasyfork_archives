// ==UserScript==
// @name         GBA buttons for Gikopoi
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  up down left right buttons
// @author       Anonymous
// @match        https://gikopoipoi.net/
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482109/GBA%20buttons%20for%20Gikopoi.user.js
// @updateURL https://update.greasyfork.org/scripts/482109/GBA%20buttons%20for%20Gikopoi.meta.js
// ==/UserScript==

(function() {
    'use strict';


    const loginButton = document.getElementById('login-button');
    loginButton.addEventListener('click', () => {
        // allow some time for vue to render the children
        setTimeout(() => {

            const upButton = document.createElement('button');
            upButton.setAttribute('type', 'button');
            upButton.textContent = "Up"

            const downButton = document.createElement('button');
            downButton.setAttribute('type', 'button');
            downButton.textContent = "Down"

            const leftButton = document.createElement('button');
            leftButton.setAttribute('type', 'button');
            leftButton.textContent = "Left"

            const rightButton = document.createElement('button');
            rightButton.setAttribute('type', 'button');
            rightButton.textContent = "Right"

            const aButton = document.createElement('button');
            aButton.setAttribute('type', 'button');
            aButton.textContent = "A"

            const bButton = document.createElement('button');
            bButton.setAttribute('type', 'button');
            bButton.textContent = "B"

            const startButton = document.createElement('button');
            startButton.setAttribute('type', 'button');
            startButton.textContent = "Start"

            const label = document.createElement("label");
            const long_checkbox = document.createElement("input");
            long_checkbox.type="checkbox";
            long_checkbox.id="long_press";
            long_checkbox.name="long_press_button";
            const textContent = document.createTextNode("Long Press");

            label.appendChild(long_checkbox);
            label.appendChild(textContent);



            function send_key(key){
                if (long_checkbox.checked && !["start", "select", "a", "b"].includes(key)){
                    key = "long " + key;
                }
                window.vueApp._container._vnode.component.provides.socket.value.emit("user-msg", key);
            }


            upButton.addEventListener('click', () => {
                send_key("up");
            });

            downButton.addEventListener('click', () => {
                send_key("down");
            });

            leftButton.addEventListener('click', () => {
                send_key("left");
            });

            rightButton.addEventListener('click', () => {
                send_key("right");
            });

            aButton.addEventListener('click', () => {
                send_key("a");
            });

            bButton.addEventListener('click', () => {
                send_key("b");
            });

            startButton.addEventListener('click', () => {
                send_key("start");
            });

            const toolbar = document.getElementById("toolbar");
            const div = document.createElement("div")

            div.appendChild(leftButton);
            div.appendChild(rightButton);
            div.appendChild(downButton);
            div.appendChild(upButton);
            div.appendChild(label);
            div.appendChild(aButton);
            div.appendChild(bButton);
            div.appendChild(startButton);
            toolbar.appendChild(div);

        }, 100)});

})();