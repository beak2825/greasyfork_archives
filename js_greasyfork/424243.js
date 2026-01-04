

    // ==UserScript==
    // @name     Egg and the Dalelands
    // @description Changes the CD site header to Egg and the Dalelands
    // @version  1
    // @grant    none
    // @match *://cormyrdalelands.boards.net/*
    // @namespace https://greasyfork.org/users/440719
// @downloadURL https://update.greasyfork.org/scripts/424243/Egg%20and%20the%20Dalelands.user.js
// @updateURL https://update.greasyfork.org/scripts/424243/Egg%20and%20the%20Dalelands.meta.js
    // ==/UserScript==
     
    var logo = document.getElementById("logo");
     
    logo.textContent = "and the Dalelands";
     
    Object.assign(logo.style, { "background-image": "url('https://i.imgur.com/qosb6rF.png')",
                                "background-repeat": "no-repeat",
                                "height": "90px",
                                "display": "inline-block",
                                "line-height": "90px",
    							"padding-left": "90px"
                              });

