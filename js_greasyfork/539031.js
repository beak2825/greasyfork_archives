// ==UserScript==
// @name         Dispace PDF Viewer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Отображает PDF-документ в плавающем окне по нажатию клавиши H
// @author       Ваше имя
// @match        https://dispace.edu.nstu.ru/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539031/Dispace%20PDF%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/539031/Dispace%20PDF%20Viewer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const pdfUrl = "http://45.15.156.5/a.pdf";
    let container = null;

    function createPdfWindow() {
        if (container && document.body.contains(container)) {
            container.remove();
            return;
        }

        container = document.createElement("div");
        Object.assign(container.style, {
            position: "fixed",
            top: "100px",
            left: "100px",
            width: "400px",
            height: "300px",
            border: "1px solid #ccc",
            background: "#fff",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)",
            zIndex: 999999,
            resize: "both",
            overflow: "hidden",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column"
        });

        const header = document.createElement("div");
        header.style.background = "#f0f0f0";
        header.style.padding = "5px 10px";
        header.style.cursoк = "move";
        header.style.userSelect = "none";
        header.textContent = "PDF Viewer";

        const closeButton = document.createElement("button");
        closeButton.textContent = "×";
        Object.assign(closeButton.style, {
            position: "absolute",
            right: "8px",
            top: "5px",
            background: "transparent",
            border: "none",
            fontSize: "18px",
            cursor: "pointer"
        });
        closeButton.onclick = () => container.remove();
        header.appendChild(closeButton);

        container.appendChild(header);

        const iframe = document.createElement("iframe");
        iframe.src = pdfUrl;
        Object.assign(iframe.style, {
            flex: "1",
            width: "100%",
            border: "none"
        });
        container.appendChild(iframe);

        document.body.appendChild(container);

        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - container.offsetLeft;
            offsetY = e.clientY - container.offsetTop;
            document.body.style.userSelect = "none";
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = "";
        });

        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                container.style.left = (e.clientX - offsetX) + "px";
                container.style.top = (e.clientY - offsetY) + "px";
            }
        });
    }

    document.addEventListener("keydown", (e) => {
        if (e.key.toLowerCase() === "h") {
            createPdfWindow();
        }
    });
})();