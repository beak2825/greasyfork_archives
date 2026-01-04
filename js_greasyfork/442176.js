// ==UserScript==
// @name        Hide IP and ISP - speedtest.net
// @namespace   Violentmonkey Scripts
// @match       *://www.speedtest.net/*
// @grant       none
// @license     GNU GPLv3
// @version     1.03
// @author      doge2018
// @description This script hides all elements which indicate to people what your IP or ISP is, as well as the location/sponsor.
// @downloadURL https://update.greasyfork.org/scripts/442176/Hide%20IP%20and%20ISP%20-%20speedtestnet.user.js
// @updateURL https://update.greasyfork.org/scripts/442176/Hide%20IP%20and%20ISP%20-%20speedtestnet.meta.js
// ==/UserScript==


// Create effect class
class Effect {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
  
  get css() {
    return `${this.name}: ${this.value};`;
  }
}

// Variables
var classes = ["js-sponsor-name", "js-data-sponsor", "js-data-isp", "js-data-ip", "ispComponent", "server-current"];
var effects = [new Effect("filter", "blur(8px)")];
var css = "<style>";

// Generate CSS classnames
var classNameIndex = 0;
classes.forEach(className => {
  if (classNameIndex < classes.length - 1)
    css += `.${className}, `;
  else
    css += `.${className} {`;
  
  classNameIndex++;
});

// Generate CSS content/filter
effects.forEach(effect => {
  effect = effect.css;
  css += `\n${effect}`;
});

// Finish CSS
css += "\n}</style>";

// Apply CSS override
document.body.insertAdjacentHTML("afterbegin", css);
