// ==UserScript==
// @name RBC
// @description Random Background Color From lZiMUl
// @author lZiMUl
// @version 1.1.2
// @license MIT
// @include *
// @namespace https://greasyfork.org/users/843195
// @downloadURL https://update.greasyfork.org/scripts/435951/RBC.user.js
// @updateURL https://update.greasyfork.org/scripts/435951/RBC.meta.js
// ==/UserScript==

(function () {
    function getRandom(Min, Max, isFloor) {
        let value = Math.random() * (Max - Min + 1) + Min;
        return isFloor? Math.floor(value): value;
    };
    window.setInterval(function () {
        document.body.setAttribute('style', function () {
            let value = [];
            value.push(getRandom(0, 255, true))
            value.push(getRandom(0, 255, true))
            value.push(getRandom(0, 255, true))
            value.push(getRandom(0, 1, false))
            return `background-color: rgba(${value.join(', ')});`;
        } ());
    }, 500);
} ())