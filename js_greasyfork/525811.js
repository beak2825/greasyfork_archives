// ==UserScript==
// @name         Scratch Custom Block Injector
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Injects a custom Scratch block, keeps it within the code box, and crashes the project
// @author       You
// @match        *://scratch.mit.edu/projects/editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525811/Scratch%20Custom%20Block%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/525811/Scratch%20Custom%20Block%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectBlockImage() {
        const workspace = document.querySelector(".blocklyWorkspace");
        if (!workspace) return;

        let blockImage = document.createElement("img");
        blockImage.src = "https://i.ibb.co/MD0wbSkd/Untitled502-20250203231330.png";
        blockImage.style.position = "absolute";
        blockImage.style.left = "200px";
        blockImage.style.top = "150px";
        blockImage.style.width = "120px";
        blockImage.style.height = "40px";
        blockImage.style.cursor = "grab";
        blockImage.draggable = true;
        blockImage.style.zIndex = "1000";

        let offsetX, offsetY;
        function moveBlock(e) {
            const codeBox = workspace.getBoundingClientRect();
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            
            // Keep within code box boundaries
            if (newX < codeBox.left) newX = codeBox.left;
            if (newX + blockImage.clientWidth > codeBox.right) newX = codeBox.right - blockImage.clientWidth;
            if (newY < codeBox.top) newY = codeBox.top;
            if (newY + blockImage.clientHeight > codeBox.bottom) newY = codeBox.bottom - blockImage.clientHeight;
            
            blockImage.style.left = `${newX}px`;
            blockImage.style.top = `${newY}px`;
        }

        blockImage.addEventListener("mousedown", (e) => {
            offsetX = e.clientX - blockImage.getBoundingClientRect().left;
            offsetY = e.clientY - blockImage.getBoundingClientRect().top;
            document.addEventListener("mousemove", moveBlock);
            document.addEventListener("mouseup", () => {
                document.removeEventListener("mousemove", moveBlock);
            });
        });

        workspace.appendChild(blockImage);
    }

    function crashAndClose() {
        const runButton = document.querySelector(".green-flag");
        if (runButton) {
            runButton.addEventListener("click", () => {
                setTimeout(() => {
                    while(true) {}
                }, 500);
                setTimeout(() => {
                    window.close();
                }, 1000);
            });
        }
    }

    setTimeout(() => {
        injectBlockImage();
        crashAndClose();
    }, 3000);
})();
