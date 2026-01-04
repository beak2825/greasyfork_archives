// ==UserScript==
// @name         Jstris Toggle Clean Sprint
// @version      2.0
// @description  Toggle distracting elements on and off
// @author       Garbaz
// @match        https://jstris.jezevec10.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/683917
// @downloadURL https://update.greasyfork.org/scripts/410201/Jstris%20Toggle%20Clean%20Sprint.user.js
// @updateURL https://update.greasyfork.org/scripts/410201/Jstris%20Toggle%20Clean%20Sprint.meta.js
// ==/UserScript==
(function() {

    //--------------CONFIG--------------//

    const STATS_SHOW_ON_TAB = true; // Show the stats when pressing TAB
    const STATS_HIDE_DURING_GAME = true; // Show the stats in between rounds

    const BACKGROUND_IMAGE_URL = ''; // Change this to an URL to some image to make it the background

    //----------------------------------//



    var active = false;

    var navbar = document.querySelector(".navbar");
    var buttonsBox = document.querySelector("#buttonsBox");
    var gstats = document.querySelector("#gstats");
    var game = document.querySelector("#main");
    var players = document.querySelector(".players");
    var gameFrame = document.querySelector("#gameFrame");
    var lrem = document.querySelector("#lrem");
    var sprintText = document.querySelector("#sprintText");
    var practiceMenu = document.querySelector("#practiceMenu");
    var background = document.querySelector("#BG_only");

    var pmObserver = new MutationObserver(function(mutationsList, observer) {
        console.log(practiceMenu.style.display);
        if(practiceMenu.style.display == 'none') {
            gstats.style.visibility = 'hidden';
        } else {
            gstats.style.visibility = '';
        }
    });

    window.addEventListener('keydown', function(e) {
        if(e.code == "Backquote") {
            if(!active) {
                active = true;
                navbar.style.display = "none";
                players.style.display = "none";
                buttonsBox.style.display = "none";

                gstats.style.padding = "30px 0";

                game.style.position = 'fixed';
                game.style.left = '50%';
                game.style.top = '50%';
                game.style.transform = 'translate(-50%, -50%)';
                game.style.margin = '0';
                game.style.background = 'black';
				game.style.paddingTop = '100px'; // Fix for https://old.reddit.com/r/Tetris/comments/jpt4zn/clean_jstris_userscript/gbi3q2r/


                lrem.style["font-size"] = '50px';
                sprintText.style.visibility = 'hidden';

                gameFrame.style.width = '0px';

                if(STATS_HIDE_DURING_GAME) {
                    pmObserver.observe(practiceMenu, {attributes: true, attributeFilter: ["style"]});
                }
                if(STATS_HIDE_DURING_GAME || STATS_SHOW_ON_TAB) {
                    if(practiceMenu.style.display == 'none') {
                        gstats.style.visibility = 'hidden';
                    }
                }
                if(BACKGROUND_IMAGE_URL != '') {
                    console.log('url("' + BACKGROUND_IMAGE_URL + '") !important');
                    background.style['background-image'] = 'url("' + BACKGROUND_IMAGE_URL + '")';
					game.style['box-shadow'] = 'black 0px 0px 16px 16px';
                }

            } else {
                active = false;
                navbar.style.display = '';
                players.style.display = '';
                buttonsBox.style.display = '';

                gstats.style.padding = '';

                game.style.position = '';
                game.style.left = '';
                game.style.top = '';
                game.style.transform = '';
                game.style.background = '';
				game.style.paddingTop = '';


                lrem.style.width = '';
                lrem.style["font-size"] = '';
                sprintText.style.visibility = '';

                gameFrame.style.width = '950px';

                if(STATS_HIDE_DURING_GAME) {
                    pmObserver.disconnect();
                }
                if(STATS_HIDE_DURING_GAME || STATS_SHOW_ON_TAB) {
                    gstats.style.visibility = '';
                }

                background.style['background-image'] = '';
				game.style['box-shadow'] = '';
            }
            e.preventDefault();
        } else if (e.code == "Tab") {
            if(active && STATS_SHOW_ON_TAB) {
                gstats.style.visibility = '';
                e.preventDefault();
            }
        }
    },true);

    window.addEventListener('keyup', function(e) {
        if (e.code == "Tab") {
            if(active && STATS_SHOW_ON_TAB && practiceMenu.style.display == 'none') {
                gstats.style.visibility = 'hidden';
                e.preventDefault();
            }
        }
    }, true);
})();



