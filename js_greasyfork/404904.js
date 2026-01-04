// ==UserScript==
// @name         Sliderquest: No Adblock Penalty
// @namespace    https://ksir.pw/
// @version      0.1
// @description  Disables the unavoidable thief event that forces you to pay money or disable your adblock.
// @author       Kain (ksir.pw)
// @match        https://www.sliderquest.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404904/Sliderquest%3A%20No%20Adblock%20Penalty.user.js
// @updateURL https://update.greasyfork.org/scripts/404904/Sliderquest%3A%20No%20Adblock%20Penalty.meta.js
// ==/UserScript==

Game.UI.checkForAdBlock = () => false;
$("#moneyMaker").hide();