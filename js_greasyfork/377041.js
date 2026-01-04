// ==UserScript==
// @name         Onze Olva
// @namespace    Jonathan Dhoop
// @version      0.1
// @description  Maak olva communistisch
// @author       Jonathan Dhoop
// @match        https://mijn.olva.be/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377041/Onze%20Olva.user.js
// @updateURL https://update.greasyfork.org/scripts/377041/Onze%20Olva.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("header").firstElementChild.firstElementChild.firstElementChild.src = "https://i.ibb.co/9N13gqf/olva.png";
    document.getElementsByTagName("body")[0].style.backgroundColor= "#FA5858";
    document.getElementById("navigatie").style.backgroundColor = 'red';
    document.getElementById("navigatie").style.border = "black solid 1px";
    document.getElementsByClassName("middendeel")[0].style.backgroundColor = "#FD7C7C";
    document.getElementsByClassName("middendeel")[1].style.backgroundColor = "#FD7C7C";
    document.getElementsByClassName("middendeel")[2].style.backgroundColor = "#FD7C7C";
    document.getElementsByClassName("middendeel")[3].style.backgroundColor = "#FD7C7C";
    let sound = new Audio("https://www.marxists.org/history/ussr/sounds/mp3/soviet-anthem1944.mp3");
    sound.play();
})();