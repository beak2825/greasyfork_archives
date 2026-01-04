// ==UserScript==
// @name         Browse Instagram Without Logging In (Removes login/register Pop-up and opens up links)
// @namespace    https://github.com/dankdave69
// @version      1.0
// @description  Removes annoying login/register popup when scrolling down a profile by adding an [ X ] button on the popup and allows you to see posts without logging on.
// @author       dankdave69
// @match        https://www.instagram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414656/Browse%20Instagram%20Without%20Logging%20In%20%28Removes%20loginregister%20Pop-up%20and%20opens%20up%20links%29.user.js
// @updateURL https://update.greasyfork.org/scripts/414656/Browse%20Instagram%20Without%20Logging%20In%20%28Removes%20loginregister%20Pop-up%20and%20opens%20up%20links%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var body = document.getElementsByTagName("body")[0];
    var popUp = document.getElementsByClassName("RnEpo  _Yhr4");
    var button = document.createElement('button');

    setInterval(function openLinks() {
        var list = document.querySelectorAll("a");
        for (var i = 0; i < list.length; i++) {
            list.item(i).onclick = function() {
                if (this.href.includes("/p/")){
                    location.href = this.href;
                }
            };
        };
    }, 0);

    function remove() {
        body.style.overflow = "visible";
        popUp[0].remove();
    };

    function appendButton() {
        var winX = document.documentElement.clientWidth;
        var winY = document.documentElement.clientHeight;
        var buttonX = (winX / 2) + 200 - 45;
        var buttonY = (winY / 2) - 235.5 + 18.5;

        button.style = "position:fixed; top:" + buttonY + "px; left:" + buttonX + "px; background-color: white; border: none; color: #8e8e8e; padding: 0px 0px; text-align: center; text-decoration: none; font-family: ; display: inline-block; font-size: 20px; margin: 0px 0px; cursor: pointer; width: 30px; height: 30px";
        button.innerHTML = "&#10006;"
        button.onclick = function() {
            remove();
        }

        popUp[0].appendChild(button);
    }

    function checkExist() {
        if (popUp.length > 0) {
            appendButton();
            window.addEventListener('resize', appendButton);
        };
    };

    setInterval(checkExist, 500);

})();