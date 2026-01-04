// ==UserScript==
// @name         Diep.io Banner Overwrite
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Replace with my banner on diep.io after the page loads. Press ALT+B to hide/ toggle UI.
// @author       Discord: anuryx. (Github: XyrenTheCoder)
// @match        *://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543180/Diepio%20Banner%20Overwrite.user.js
// @updateURL https://update.greasyfork.org/scripts/543180/Diepio%20Banner%20Overwrite.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const allthemes = {
        Default: "https://diep.io/35cb845c87f7f2a6a9fc.jpg",
        Dark3D: "https://ik.imagekit.io/hxvezoqrx/IMG_6394.png?updatedAt=1744534591325",
        Light3D: "https://ik.imagekit.io/hxvezoqrx/IMG_6395.png?updatedAt=1744534591186",
        Dark2D: "https://ik.imagekit.io/as7ksk9qe/IMG_6550.png?updatedAt=1744808721680",
        Light2D: "https://ik.imagekit.io/as7ksk9qe/IMG_6549.png?updatedAt=1744808721612",
        OGLight: "https://ik.imagekit.io/as7ksk9qe/IMG_6728.png?updatedAt=1745061276240",
        OGDark: "https://ik.imagekit.io/as7ksk9qe/IMG_6727.jpg?updatedAt=1745061276192",
        Submission1: "https://ik.imagekit.io/as7ksk9qe/submission1.png",
        Submission2: "https://ik.imagekit.io/as7ksk9qe/submission2.jpg",
        Submission3: "https://ik.imagekit.io/as7ksk9qe/submission3.png",
        Submission4: "https://ik.imagekit.io/as7ksk9qe/submission4.png",
        Submission5: "https://ik.imagekit.io/as7ksk9qe/submission5.jpg",
        Submission6: "https://ik.imagekit.io/as7ksk9qe/submission6.png",
        Submission7: "https://ik.imagekit.io/as7ksk9qe/submission7.png"
    };

    const colors = {
        DarkGrey: "#1C1C1C",
        Grey: "#303030",
        LightGrey: "#606060",
        DimmedWhite: "#C6C6C6",
        White: "#DDDDDD"
    };

    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "5px";
    container.style.right = "150px";
    container.style.zIndex = 999;
    container.style.width = "300px";
    container.style.borderRadius = "0.5rem";
    container.style.backgroundColor = colors.DarkGrey;
    container.style.padding = "0px 20px";

    const label = document.createElement("div");
    label.style.margin = "15px 0px 15px 0px";
    label.style.color = colors.White;
    label.innerText = "Banner Themes";
    label.style.font = "500 16px Inter";

    const hr = document.createElement("hr");
    hr.style.border = `1px solid ${colors.LightGrey}`;
    hr.style.margin = "10px -20px 10px -20px";

    const menu = document.createElement("select");
    menu.style.backgroundColor = colors.Grey;
    menu.style.width = "300px";
    menu.style.border = `1px solid ${colors.LightGrey}`;
    menu.style.borderRadius = "0.5rem";
    menu.style.padding = "10px";
    menu.style.margin = "5px 0px";
    menu.style.color = colors.White;
    menu.style.font = "500 16px Ubuntu";
    menu.style.cursor = "pointer";

    const imagePreview = document.createElement("img");
    imagePreview.style.width = "100%";
    imagePreview.style.margin = "10px 0px 20px 0px";
    imagePreview.style.border = "0px solid white";
    imagePreview.alt = "Banner Preview";

    for (const [key] of Object.entries(allthemes)) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key;
        menu.appendChild(option);
    }

    const selected = localStorage.getItem("selected");
    if (selected && allthemes[selected]) {
        menu.value = selected;
    }

    function updateDisplay() {
        const selected = menu.value;
        const theme = allthemes[selected];
        localStorage.setItem("selected", selected);
        replaceBackgroundImage(theme);
        imagePreview.src = theme;
    }

    function replaceBackgroundImage(img) {
        const nodeList = document.querySelectorAll("img");
        if (nodeList[2]) {
            nodeList[2].src = img;
        }
        const backdrop = document.getElementById("backdrop-asset");
        if (backdrop) {
            backdrop.src = img;
        }
    }

    function toggleUI() {
        if (container.style.display === 'none' || container.style.display === '') {
            container.style.display = 'block';
        } else {
            container.style.display = 'none';
        }
    }

    menu.addEventListener("change", updateDisplay);

    container.appendChild(label);
    container.appendChild(hr);
    container.appendChild(menu);
    container.appendChild(imagePreview);

    document.body.appendChild(container);

    window.addEventListener('keydown', (event) => {
        if (event.altKey && event.key === 'b') {
            event.preventDefault();
            toggleUI();
        }
    });

    window.addEventListener("load", updateDisplay);
})();