    // ==UserScript==
    // @name         GC SDB Withdrawal Keyboard Controls
    // @namespace    http://tampermonkey.net/
    // @version      0.1
    // @description  Adds keyboard controls for SDB removal on GC.
    // @author       Z
    // @match        https://www.grundos.cafe/halloween/esophagor/*
    // @match        https://www.grundos.cafe/island/kitchen/*
    // @match        https://www.grundos.cafe/winter/snowfaerie/*
    // @match        https://www.grundos.cafe/halloween/witchtower/*
    // @match        https://www.grundos.cafe/safetydeposit/*
    // @license      MIT
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @downloadURL https://update.greasyfork.org/scripts/486711/GC%20SDB%20Withdrawal%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/486711/GC%20SDB%20Withdrawal%20Keyboard%20Controls.meta.js
    // ==/UserScript==

    var start = document.querySelector("input[value='Sure I will find you food']", "input[value='Sure I will help!']", "input[value='I will help you!']", "input[value='Erm... OK then']");
    var itemOne = document.querySelector("div.itemList:nth-child(1) > img.search-helper-sdb-exists");
    var itemTwo = document.querySelector("div.itemList:nth-child(2) > img.search-helper-sdb-exists");
    var itemThree = document.querySelector("div.itemList:nth-child(3) > img.search-helper-sdb-exists");
    var itemFour = document.querySelector("div.itemList:nth-child(4) > img.search-helper-sdb-exists");
    var rmOne = document.querySelector("a.sdb-remove-one-text");
    var done = document.querySelector("input[value='I have your food!']", "input[value='I have the ingredients!']");
    var restart = document.querySelector("input[value='Approach the Esophagor again...']", "input[value='Approach the Chef Again']", "input[value='Approach Taelia again...']", "input[value='Approach the witch again...']");


    document.addEventListener("keydown", (event) => {
          if (event.keyCode == 32) {
            if (start != null) {
                start.click();
            } else if (rmOne != null) {
                rmOne.click();
            } else if (done != null) {
                done.click();
            } else if (restart != null) {
                restart.click();
            }
          }
        });

 document.addEventListener("keydown", (event) => {
          if (event.keyCode == 67) {
            if (itemOne != null) {
                itemOne.click();
            }
          }
        });
document.addEventListener("keydown", (event) => {
          if (event.keyCode == 86) {
            if (itemTwo != null) {
                itemTwo.click();
            }
          }
        });
document.addEventListener("keydown", (event) => {
          if (event.keyCode == 66) {
            if (itemThree != null) {
                itemThree.click();
            }
          }
        });
document.addEventListener("keydown", (event) => {
          if (event.keyCode == 78) {
            if (itemFour != null) {
                itemFour.click();
            }
          }
        });