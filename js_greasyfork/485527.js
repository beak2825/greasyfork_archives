// ==UserScript==
// @name         GC - Pick Your Own - Keyboard Controls
// @namespace    https://greasyfork.org/en/users/1175371
// @version      0.4
// @description  Add keyboard navigation to GC's Pick Your Own.
// @author       sanjix
// @match        https://www.grundos.cafe/medieval/pickyourown/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485527/GC%20-%20Pick%20Your%20Own%20-%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/485527/GC%20-%20Pick%20Your%20Own%20-%20Keyboard%20Controls.meta.js
// ==/UserScript==

var start = document.querySelector('input[value="Click to Play!"]');
var left = document.querySelector('input#pyo-left-arrow');
var right = document.querySelector('input#pyo-right-arrow');
var up = document.querySelector('input#pyo-up-arrow');
var down = document.querySelector('input#pyo-down-arrow');
var map = document.querySelector('form[action="/medieval/process_pickyourown/?pick=1"] input[type="image"]');
var collect = document.querySelector('input[value="Collect Berries and Leave Farm"]');

document.addEventListener("keydown", ((event) => {
    switch (event.keyCode) {
        case 38: //up-arrow
        case 87: //w
            {
                if (up != null) {
                    event.preventDefault();
                    up.click();
                }
            }
            break;
        case 37: //left-arrow
        case 65: //a
            {
                if (left != null) {
                    event.preventDefault();
                    left.click();
                }
            }
            break;
        case 40: //down-arrow
        case 83: //s
            {
                if (down != null) {
                    event.preventDefault();
                    down.click();
                }
            }
            break;
        case 39: //right-arrow
        case 68: //d
            {
                if (right != null) {
                    event.preventDefault();
                    right.click();
                }
            }
            break;
        case 13: //enter
            {
                if (start != null) {
                    start.click();
                } else if (map != null) {
                    map.click();
                } else if (collect != null) {
                    collect.click();
                }
            }
            break;
	}
}));