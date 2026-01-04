// ==UserScript==
// @name         Anti-DT Pushbots
// @namespace    your mom
// @version      69.69
// @description  anti bot script, read the alert pop up for instructions
// @author       Astral
// @match        ://diep.io/*
// @downloadURL https://update.greasyfork.org/scripts/411716/Anti-DT%20Pushbots.user.js
// @updateURL https://update.greasyfork.org/scripts/411716/Anti-DT%20Pushbots.meta.js
// ==/UserScript==

///BLUE BASE
const button = document.createElement('button');

        button.style = 'background: #00B1DE';
        button.style.position = "relative";

    const textNode = document.createTextNode('Top Left');

      button.appendChild(textNode);

       button.addEventListener("click", () => {
          enabled = !enabled
          if (enabled === true){

            input.keyDown(87)
            input.keyDown(65)

         } else {

            input.keyUp(87)
            input.keyUp(65)
         }
       })
      var enabled = false

document.body.appendChild(button);

///PURPLE BASE
var enabled = true
const button2 = document.createElement('button');

        button2.style = 'background: #BF7FF5';
        button2.style.position = "relative";

    const textNode2 = document.createTextNode('Top Right');

      button2.appendChild(textNode2);

       button2.addEventListener("click", () => {
          enabled = !enabled
          if (enabled === true){

            input.keyDown(87)
            input.keyDown(68)

         } else {

            input.keyUp(87)
            input.keyUp(68)
         }
       })
      var enabled = false

document.body.appendChild(button2);

///GREEN BASE
var enabled = true
const button3 = document.createElement('button');

        button3.style = 'background: #00E16E';
        button3.style.position = "relative";

    const textNode3 = document.createTextNode('Bottom Left');

      button3.appendChild(textNode3);

       button3.addEventListener("click", () => {
          enabled = !enabled
          if (enabled === true){

            input.keyDown(83)
            input.keyDown(65)

         } else {

            input.keyUp(83)
            input.keyUp(65)
         }
       })
      var enabled = false

document.body.appendChild(button3);

///RED BASE
var enabled = true
const button4 = document.createElement('button');

        button4.style = 'background: #F14E54';
        button4.style.position = "relative";

    const textNode4 = document.createTextNode('Bottom Right');

      button4.appendChild(textNode4);

       button4.addEventListener("click", () => {
          enabled = !enabled
          if (enabled === true){

            input.keyDown(83)
            input.keyDown(68)

         } else {

            input.keyUp(83)
            input.keyUp(68)
         }
       })
      var enabled = false

document.body.appendChild(button4);
alert("Thank you for using the anti-bot script. Get as close to your base's corner as possible and press the corresponding buttons and it will make you virtually impossible to push. -Astral")