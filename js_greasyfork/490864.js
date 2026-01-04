// ==UserScript==
// @name         Капибара 3524 супер мега бро бравл старс
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Можно кинуть камень в волка, но не волка в камень
// @author       Владик
// @match        https://forum.blackrussia.online/*
// @license 	 none
// @icon         none
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490864/%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D0%B0%203524%20%D1%81%D1%83%D0%BF%D0%B5%D1%80%20%D0%BC%D0%B5%D0%B3%D0%B0%20%D0%B1%D1%80%D0%BE%20%D0%B1%D1%80%D0%B0%D0%B2%D0%BB%20%D1%81%D1%82%D0%B0%D1%80%D1%81.user.js
// @updateURL https://update.greasyfork.org/scripts/490864/%D0%9A%D0%B0%D0%BF%D0%B8%D0%B1%D0%B0%D1%80%D0%B0%203524%20%D1%81%D1%83%D0%BF%D0%B5%D1%80%20%D0%BC%D0%B5%D0%B3%D0%B0%20%D0%B1%D1%80%D0%BE%20%D0%B1%D1%80%D0%B0%D0%B2%D0%BB%20%D1%81%D1%82%D0%B0%D1%80%D1%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const bgButtons = document.querySelector(".pageContent");
    const Button51 = document.createElement("button");
    const Button52 = document.createElement("button");
    const Button53 = document.createElement("button");
    const Button54 = document.createElement("button");
    const Button55 = document.createElement("button");
    const ButtonTech51 = document.createElement("button");
    const ButtonTech52 = document.createElement("button");
    const ButtonTech53 = document.createElement("button");
    const ButtonTech54 = document.createElement("button");
    const ButtonTech55 = document.createElement("button");
    const ButtonComp51 = document.createElement("button");
    const ButtonComp52 = document.createElement("button");
    const ButtonComp53 = document.createElement("button");
    const ButtonComp54 = document.createElement("button");
    const ButtonComp55 = document.createElement("button");
    Button51.textContent = "Игроки 51";
    Button52.textContent = "Игроки 52";
    Button53.textContent = "Игроки 53";
    Button54.textContent = "Игроки 54";
    Button55.textContent = "Игроки 55";
    ButtonTech51.textContent = "Тех 51";
    ButtonTech52.textContent = "Тех 52";
    ButtonTech53.textContent = "Тех 53";
    ButtonTech54.textContent = "Тех 54";
    ButtonTech55.textContent = "Тех 55";
    ButtonComp51.textContent = "Жб 51";
    ButtonComp52.textContent = "Жб 52";
    ButtonComp53.textContent = "Жб 53";
    ButtonComp54.textContent = "Жб 54";
    ButtonComp55.textContent = "Жб 55";

    bgButtons.append(Button51);
    bgButtons.append(Button52);
    bgButtons.append(Button53);
    bgButtons.append(Button54);
    bgButtons.append(Button55);
    bgButtons.append(ButtonTech51);
    bgButtons.append(ButtonTech52);
    bgButtons.append(ButtonTech53);
    bgButtons.append(ButtonTech54);
    bgButtons.append(ButtonTech55);
    bgButtons.append(ButtonComp51);
    bgButtons.append(ButtonComp52);
    bgButtons.append(ButtonComp53);
    bgButtons.append(ButtonComp54);
    bgButtons.append(ButtonComp55);

    Button51.style.margin = "0% 5px";
    Button51.style.background = "linear-gradient(to bottom, #000000 0%, #191970 80%)";
    Button51.style.borderRadius = "5px";
    Button51.style.border = "none";
    Button51.style.color = "rgba(255,255,255,0.8)";

    Button52.style.margin = "1% 5px";
    Button52.style.background = "linear-gradient(to bottom, #000000 0%, #191970 80%)";
    Button52.style.borderRadius = "5px";
    Button52.style.border = "none";
    Button52.style.color = "rgba(255,255,255,0.8)";

    Button53.style.margin = "1% 5px";
    Button53.style.background = "linear-gradient(to bottom, #000000 0%, #191970 80%)";
    Button53.style.borderRadius = "5px";
    Button53.style.border = "none";
    Button53.style.color = "rgba(255,255,255,0.8)";

    Button54.style.margin = "1% 5px";
    Button54.style.background = "linear-gradient(to bottom, #000000 0%, #191970 80%)";
    Button54.style.borderRadius = "5px";
    Button54.style.border = "none";
    Button54.style.color = "rgba(255,255,255,0.8)";

    Button55.style.margin = "1% 5px";
    Button55.style.background = "linear-gradient(to bottom, #000000 0%, #191970 80%)";
    Button55.style.borderRadius = "5px";
    Button55.style.border = "none";
    Button55.style.color = "rgba(255,255,255,0.8)";

    ButtonTech51.style.margin = "1% 5px";
    ButtonTech51.style.background = "linear-gradient(to bottom, #000000 0%, #191970 80%)";
    ButtonTech51.style.borderRadius = "5px";
    ButtonTech51.style.border = "none";
    ButtonTech51.style.color = "rgba(255,255,255,0.8)";

    ButtonTech52.style.margin = "1% 5px";
    ButtonTech52.style.background = "linear-gradient(to bottom, #000000 0%, #191970 80%)";
    ButtonTech52.style.borderRadius = "5px";
    ButtonTech52.style.border = "none";
    ButtonTech52.style.color = "rgba(255,255,255,0.8)";

    ButtonTech53.style.margin = "1% 5px";
    ButtonTech53.style.background = "linear-gradient(to bottom, #000000 0%, #191970 80%)";
    ButtonTech53.style.borderRadius = "5px";
    ButtonTech53.style.border = "none";
    ButtonTech53.style.color = "rgba(255,255,255,0.8)";

    ButtonTech54.style.margin = "1% 5px";
    ButtonTech54.style.background = "linear-gradient(to bottom, #000000 0%, #191970 80%)";
    ButtonTech54.style.borderRadius = "5px";
    ButtonTech54.style.border = "none";
    ButtonTech54.style.color = "rgba(255,255,255,0.8)";

    ButtonTech55.style.margin = "1% 5px";
    ButtonTech55.style.background = "linear-gradient(to bottom, #000000 0%, #191970 80%)";
    ButtonTech55.style.borderRadius = "5px";
    ButtonTech55.style.border = "none";
    ButtonTech55.style.color = "rgba(255,255,255,0.8)";

    ButtonComp51.style.margin = "1% 5px";
    ButtonComp51.style.background = "linear-gradient(to bottom, #000000 0%, #191970 80%)";
    ButtonComp51.style.borderRadius = "5px";
    ButtonComp51.style.border = "none";
    ButtonComp51.style.color = "rgba(255,255,255,0.8)";

    ButtonComp52.style.margin = "1% 5px";
    ButtonComp52.style.background = "linear-gradient(to bottom, #000000 0%, #191970 80%)";
    ButtonComp52.style.borderRadius = "5px";
    ButtonComp52.style.border = "none";
    ButtonComp52.style.color = "rgba(255,255,255,0.8)";

    ButtonComp53.style.margin = "1% 5px";
    ButtonComp53.style.background = "linear-gradient(to bottom, #000000 0%, #191970 80%)";
    ButtonComp53.style.borderRadius = "5px";
    ButtonComp53.style.border = "none";
    ButtonComp53.style.color = "rgba(255,255,255,0.8)";

    ButtonComp54.style.margin = "1% 5px";
    ButtonComp54.style.background = "linear-gradient(to bottom, #000000 0%, #191970 80%)";
    ButtonComp54.style.borderRadius = "5px";
    ButtonComp54.style.border = "none";
    ButtonComp54.style.color = "rgba(255,255,255,0.8)";

    ButtonComp55.style.margin = "1% 5px";
    ButtonComp55.style.background = "linear-gradient(to bottom, #000000 0%, #191970 80%)";
    ButtonComp55.style.borderRadius = "5px";
    ButtonComp55.style.border = "none";
    ButtonComp55.style.color = "rgba(255,255,255,0.8)";


    function B51() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2290/";
    }

    function B52() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2332/";
    }

    function B53() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2374/";
    }

    function B54() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2416/";
    }

    function B55() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%96%D0%B0%D0%BB%D0%BE%D0%B1%D1%8B-%D0%BD%D0%B0-%D0%B8%D0%B3%D1%80%D0%BE%D0%BA%D0%BE%D0%B2.2458/";
    }

    function BTech51() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-tula.2262/";
    }

    function BTech52() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-ryazan.2304/";
    }

    function BTech53() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-murmansk.2346/";
    }

    function BTech54() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-penza.2388/";
    }

    function BTech55() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A2%D0%B5%D1%85%D0%BD%D0%B8%D1%87%D0%B5%D1%81%D0%BA%D0%B8%D0%B9-%D1%80%D0%B0%D0%B7%D0%B4%D0%B5%D0%BB-kursk.2430/";
    }

    function BComp51() {
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9651-tula.2261/";
    }

    function BComp52(){
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9652-ryazan.2303/";
    }

    function BComp53(){
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9653-murmansk.2345/";
    }

    function BComp54(){
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9654-penza.2387/";
    }

    function BComp55(){
        window.location.href = "https://forum.blackrussia.online/forums/%D0%A1%D0%B5%D1%80%D0%B2%D0%B5%D1%80-%E2%84%9655-kursk.2429/";
    }

    Button51.addEventListener("click", () => {
        B51();
        Button51.style.background = "#fff";
    });

    Button52.addEventListener("click", () => {
        B52();
        Button52.style.background = "#fff";
    });

    Button53.addEventListener("click", () => {
        B53 ();
        Button53.style.background = "#fff";
    });

    Button54.addEventListener("click", () => {
        B54();
        Button54.style.background = "#fff";
    });

    Button55.addEventListener("click", () => {
        B55();
        Button55.style.background = "#fff";
    });
    ButtonTech51.addEventListener("click", () => {
        BTech51();
        ButtonTech51.style.background = "#fff";
    });
    ButtonTech52.addEventListener("click", () => {
        BTech52();
        ButtonTech51.style.background = "#fff";
    });
    ButtonTech53.addEventListener("click", () => {
        BTech53();
        ButtonTech53.style.background = "#fff";
    });
    ButtonTech54.addEventListener("click", () => {
        BTech54();
        ButtonTech54.style.background = "#fff";
    });
    ButtonTech55.addEventListener("click", () => {
        BTech55();
        ButtonTech55.style.background = "#fff";
    });
    ButtonComp51.addEventListener("click", () => {
        BComp51();
        ButtonComp51.style.background = "#fff";
    });
    ButtonComp52.addEventListener("click", () => {
        BComp52();
        ButtonComp52.style.background = "#fff";
    });
    ButtonComp53.addEventListener("click", () => {
        BComp53();
        ButtonComp53.style.background = "#fff";
    });
    ButtonComp54.addEventListener("click", () => {
        BComp54();
        ButtonComp54.style.background = "#fff";
    });
    ButtonComp55.addEventListener("click", () => {
        BComp55();
        ButtonComp55.style.background = "#fff";
    });
})();
