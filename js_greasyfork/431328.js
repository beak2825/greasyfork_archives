// ==UserScript==
// @name         Change classes shortcut
// @namespace    http://tampermonkey.net/
// @description  1 to 9 shortcut to switch classes in google classroom
// @version      0.1
// @author       You
// @match        https://classroom.google.com/*
// @downloadURL https://update.greasyfork.org/scripts/431328/Change%20classes%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/431328/Change%20classes%20shortcut.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function on1key() {
document.querySelector("#yDmH0d > div.vhK44c.dgqqXe > div.ETRkCe > div > div:nth-child(4) > a:nth-child(3)").click()
    }
    function on2key() {
document.querySelector("#yDmH0d > div.vhK44c.dgqqXe > div.ETRkCe > div > div:nth-child(4) > a:nth-child(4)").click()
    }
    function on3key() {
document.querySelector("#yDmH0d > div.vhK44c.dgqqXe > div.ETRkCe > div > div:nth-child(4) > a:nth-child(5)").click()
    }
    function on4key() {
document.querySelector("#yDmH0d > div.vhK44c.dgqqXe > div.ETRkCe > div > div:nth-child(4) > a:nth-child(6)").click()
    }
    function on5key() {
document.querySelector("#yDmH0d > div.vhK44c.dgqqXe > div.ETRkCe > div > div:nth-child(4) > a:nth-child(7)").click()
    }
    function on6key() {
document.querySelector("#yDmH0d > div.vhK44c.dgqqXe > div.ETRkCe > div > div:nth-child(4) > a:nth-child(8)").click()
    }
    function on7key() {
document.querySelector("#yDmH0d > div.vhK44c.dgqqXe > div.ETRkCe > div > div:nth-child(4) > a:nth-child(9)").click()
    }
    function on8key() {
document.querySelector("#yDmH0d > div.vhK44c.dgqqXe > div.ETRkCe > div > div:nth-child(4) > a:nth-child(10)").click()
    }
    function on9key() {
document.querySelector("#yDmH0d > div.vhK44c.dgqqXe > div.ETRkCe > div > div:nth-child(4) > a:nth-child(11)").click()
    }
    function on0key() {
document.querySelector("#yDmH0d > div.vhK44c.dgqqXe > div.ETRkCe > div > div:nth-child(4) > a:nth-child(12)").click()
    }
    function onKeydown(evt) {
        // Use https://keycode.info/ to get keys
        if (evt.keyCode == 49) {
            on1key();
        } else {
            if (evt.keyCode == 50) {
                on2key();
            } else {
                if (evt.keyCode == 51) {
                    on3key();
                } else {
                    if (evt.keyCode == 52) {
                        on4key();
                    } else {
                        if (evt.keyCode == 53) {
                            on5key();
                        } else {
                            if (evt.keyCode == 54) {
                                on6key();
                            } else {
                                if (evt.keyCode == 55) {
                                    on7key();
                                } else {
                                    if (evt.keyCode == 56) {
                                        on8key();
                                    } else {
                                        if (evt.keyCode == 57) {
                                            on9key();
                                        } else {
                                            if (evt.keyCode == 48) {
                                                on0key();
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    document.addEventListener('keydown', onKeydown, true);
})();