// ==UserScript==
// @name         Scratch Custom Block Injector
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Injects a custom Scratch block, keeps it within the exact code box, and crashes the project
// @author       You
// @match        *://scratch.mit.edu/projects/editor/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525812/Scratch%20Custom%20Block%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/525812/Scratch%20Custom%20Block%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function injectBlockImage() {
        const codeBox = document.querySelector(".blocklyMainBackground");
        if (!codeBox) return;

        let blockImage = document.createElement("img");
        blockImage.src = "https://i.ibb.co/MD0wbSkd/Untitled502-20250203231330.png";
        blockImage.style.position = "absolute";
        blockImage.style.width = "120px";
        blockImage.style.height = "40px";
        blockImage.style.cursor = "grab";
        blockImage.style.zIndex = "1000";

        const codeBoxRect = codeBox.getBoundingClientRect();
        blockImage.style.left = `${codeBoxRect.left + 50}px`;
        blockImage.style.top = `${codeBoxRect.top + 50}px`;

        let offsetX, offsetY;
        function moveBlock(e) {
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            
            if (newX < codeBoxRect.left) newX = codeBoxRect.left;
            if (newX + blockImage.clientWidth > codeBoxRect.right) newX = codeBoxRect.right - blockImage.clientWidth;
            if (newY < codeBoxRect.top) newY = codeBoxRect.top;
            if (newY + blockImage.clientHeight > codeBoxRect.bottom) newY = codeBoxRect.bottom - blockImage.clientHeight;
            
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

        document.body.appendChild(blockImage);
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
