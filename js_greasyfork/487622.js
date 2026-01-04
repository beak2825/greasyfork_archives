// ==UserScript==
// @name         Coze Panel Control
// @namespace    https://greasyfork.org/
// @version      v2024.7.0.3
// @license MIT
// @description  Coze Bot 预览面板UI修改器!
// @author       Youber
// @match        https://www.coze.com/space/*/bot/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=coze.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487622/Coze%20Panel%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/487622/Coze%20Panel%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Create div container
    var flexContainer = document.createElement("div");

    // Set styles directly
    flexContainer.style.display = 'flex';
    flexContainer.style.position = 'fixed';
    flexContainer.style.top = '8px';
    flexContainer.style.left = '500px';
    flexContainer.style.width = 'fit-content';
    flexContainer.style.height = '40px';
    flexContainer.style.backgroundColor = '#4299e1'; // Example color value
    flexContainer.style.alignItems = 'end';
    flexContainer.style.zIndex = '2000';
    flexContainer.style.cursor = 'move'; // Cursor indicates element is movable

    // Variables to hold the drag status and position
    var isDragging = false;
    var dragOffsetX = 0;
    var dragOffsetY = 0;

    // Add the event listeners for the container
    flexContainer.addEventListener('mousedown', function (e) {
        // When user presses mouse button, we start dragging
        isDragging = true;
        // Calculate initial offset of the mouse from the element's top-left corner
        dragOffsetX = e.clientX - flexContainer.getBoundingClientRect().left;
        dragOffsetY = e.clientY - flexContainer.getBoundingClientRect().top;
        flexContainer.style.cursor = 'grabbing';

        // Prevent default drag behavior
        e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
        // If dragging, then update the position of the element
        if (isDragging) {
            // Calculate the new position of the container
            var newX = e.clientX - dragOffsetX;
            var newY = e.clientY - dragOffsetY;

            // Get the boundaries of the viewport
            var screenWidth = window.innerWidth;
            var screenHeight = window.innerHeight;

            // Get the dimensions of the container
            var containerWidth = flexContainer.offsetWidth;
            var containerHeight = flexContainer.offsetHeight;

            // Set boundaries
            var minX = 0;
            var minY = 0;
            var maxX = screenWidth - containerWidth;
            var maxY = screenHeight - containerHeight;

            // Apply boundaries
            newX = Math.min(Math.max(newX, minX), maxX);
            newY = Math.min(Math.max(newY, minY), maxY);

            // Set the new position of the container
            flexContainer.style.left = newX + 'px';
            flexContainer.style.top = newY + 'px';
        }
    });

    document.addEventListener('mouseup', function () {
        // When user releases mouse button, we stop dragging
        isDragging = false;
        flexContainer.style.cursor = 'move';
    });

    // Create buttons
    var leftBtn = document.createElement("button");
    leftBtn.setAttribute("id", "left_btn");
    leftBtn.textContent = "Left";

    var centerBtn = document.createElement("button");
    centerBtn.setAttribute("id", "center_btn");
    centerBtn.textContent = "Center";

    var allBtn = document.createElement("button");
    allBtn.setAttribute("id", "all_btn");
    allBtn.textContent = "All";

    // Append buttons to the container
    flexContainer.appendChild(leftBtn);
    flexContainer.appendChild(centerBtn);
    flexContainer.appendChild(allBtn);

    // Append the container to body
    document.body.appendChild(flexContainer);

  leftBtn.addEventListener("click", function () {
    const controlPanel = document.querySelector(".arQAab07X2IRwAe6dqHV");
    controlPanel.style.gridTemplateColumns = "10fr 0fr"
    const chatPanel = document.querySelector(".UMf9npeM8cVkDi0CDqZ0");
    chatPanel.style.gridTemplateColumns = "6fr 14fr"
  });

  centerBtn.addEventListener("click", function () {
    const controlPanel = document.querySelector(".arQAab07X2IRwAe6dqHV");
    controlPanel.style.gridTemplateColumns = "0fr 10fr"
    const chatPanel = document.querySelector(".UMf9npeM8cVkDi0CDqZ0");
    chatPanel.style.gridTemplateColumns = "6fr 14fr"
  });

  allBtn.addEventListener("click", function () {
    const controlPanel = document.querySelector(".arQAab07X2IRwAe6dqHV");
    controlPanel.style.gridTemplateColumns = "13fr 13fr"

    const chatPanel = document.querySelector(".qrPNrOyVEBA326VHThBn");
    chatPanel.style.gridTemplateColumns = "26fr 14fr"
  });

    // Task 1
    function tryTask1() {
        let header;
        const checkLoop = setInterval(function () {
            header = document.querySelector(".arQAab07X2IRwAe6dqHV");
            if (header) {
                console.log("get header success");
                header.style.display = 'none';
                clearInterval(checkLoop);
            } else {
                console.log("try get header ...");
            }
        }, 500);
    }
     // Task 2
    function tryTask2() {
        let bottomLigher;
        const checkLoop = setInterval(function () {
            bottomLigher = document.querySelector(".qtV_UKcJKqgw6X0fPvI4");
            if (bottomLigher) {
                console.log("get bottomLigher success");
                 bottomLigher.remove()
                while(document.querySelector(".qtV_UKcJKqgw6X0fPvI4")) {
                    bottomLigher = document.querySelector(".qtV_UKcJKqgw6X0fPvI4");
                     bottomLigher.remove()
                    console.log("try remove bottom chat lighter");
                }
                console.log("remove success bottom chat lighter");
                clearInterval(checkLoop);
            } else {
                console.log("try get bottomLigher ...");
            }
        }, 500);
    }

    tryTask2();
    // Task 3
function tryTask3() {
    let logo;
    const checkLoop = setInterval(function () {
        logo = document.querySelector(".L2gqnVvONsWgOrkn3iNP");
        if (logo) {
            console.log("get logo success");
            logo.remove()
            while(document.querySelector(".L2gqnVvONsWgOrkn3iNP")) {
                logo = document.querySelector(".L2gqnVvONsWgOrkn3iNP");
                logo.remove()
                console.log("try remove logo");
            }
            console.log("remove success logo");
            clearInterval(checkLoop);
        } else {
            console.log("try get logo ...");
        }
    }, 500);
}
tryTask3();
    // tryTask1();
    // Your code here...
})();