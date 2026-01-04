// ==UserScript==
// @name Circle Calculater
// @description This script make the nice environment of calculate circles for console of the developer tools.
// @version 1.0.1
// @author Mike Michael
// @match http://*
// @match https://*
// @grant none
// @namespace https://github.com/Mike-Michael/
// @namespace https://greasyfork.org/en/users/311628/mike-michael/
// @downloadURL https://update.greasyfork.org/scripts/387607/Circle%20Calculater.user.js
// @updateURL https://update.greasyfork.org/scripts/387607/Circle%20Calculater.meta.js
// ==/UserScript==
'use strict'

var π = Math.PI;

let circleAreaCalculater = (rad) => {
    console.log(rad * rad * π);
};

// ↑ That function calculates area of the circle. ↑

let circumferentialLengthCalculater = (dia) => {
    console.log(dia * π);
};

// ↑ That function calculates circumferential length of the circle. ↑

circleAreaCalculater(3);

// ↑ That code calls the function and sent "3" to the argument of the function, so the circle radius is 3. please change the value of the argument for you want to calculate circle's radius. ↑

circumferentialLengthCalculater(6);

// ↑ That code calls the function and sent "6" to the argument of the function, so the circle diameter is 6. please change the value of the argument for you want to calculate circle's diameter. ↑