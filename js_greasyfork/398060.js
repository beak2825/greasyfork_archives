// ==UserScript==
// @name         Critter Auto Script
// @namespace    http://tampermonkey.net/
// @version      0.9.6
// @description  Basic Script to Automate Critter Mound
// @author       You
// @match        https://crittermound.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398060/Critter%20Auto%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/398060/Critter%20Auto%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var first, mother, father;

    var main = function() {
        if (game.femaleMound().length > 0) {
            first = game.femaleMound()[0];
            mother = game.mother();
            console.log("Queen:");
            console.log("Trait 1: " + first.traits[0].trueValue + " > " + mother.traits[0].trueValue + " = " + (first.traits[0].trueValue > mother.traits[0].trueValue).toString());
            console.log("Trait 2: " + first.traits[1].trueValue + " > " + mother.traits[1].trueValue + " = " + (first.traits[1].trueValue > mother.traits[1].trueValue).toString());
            console.log("Trait 3: " + first.traits[2].trueValue + " > " + mother.traits[2].trueValue + " = " + (first.traits[2].trueValue > mother.traits[2].trueValue).toString());
            console.log("Trait 4: " + first.traits[3].trueValue + " > " + mother.traits[3].trueValue + " = " + (first.traits[3].trueValue > mother.traits[3].trueValue).toString());
            console.log("Trait 5: " + first.traits[4].trueValue + " > " + mother.traits[4].trueValue + " = " + (first.traits[4].trueValue > mother.traits[4].trueValue).toString());
            if (first.traits[0].trueValue > mother.traits[0].trueValue && first.traits[1].trueValue > mother.traits[1].trueValue && first.traits[2].trueValue > mother.traits[2].trueValue && first.traits[3].trueValue > mother.traits[3].trueValue && first.traits[4].trueValue > mother.traits[4].trueValue) {
                game.Move("Mate", "Female", game, game)
                console.log("New Queen");
            } else {
                if (Math.random() >= 0.5) {
                    if (game.maxArmyMoundSize() > game.armyMound().length) {
                        game.Move("Army", "Female", game, game)
                        console.log("New Female Army");
                    } else {
                        console.log("To many Army")
                    }
                } else {
                    game.Move("Worker", "Female", game, game)
                    console.log("New Female Worker");
                }
            }
        }

        if (game.maleMound().length > 0) {
            first = game.maleMound()[0];
            mother = game.father();
            console.log("King:");
            console.log("Trait 1: " + first.traits[0].trueValue + " > " + mother.traits[0].trueValue + " = " + (first.traits[0].trueValue > mother.traits[0].trueValue).toString());
            console.log("Trait 2: " + first.traits[1].trueValue + " > " + mother.traits[1].trueValue + " = " + (first.traits[1].trueValue > mother.traits[1].trueValue).toString());
            console.log("Trait 3: " + first.traits[2].trueValue + " > " + mother.traits[2].trueValue + " = " + (first.traits[2].trueValue > mother.traits[2].trueValue).toString());
            console.log("Trait 4: " + first.traits[3].trueValue + " > " + mother.traits[3].trueValue + " = " + (first.traits[3].trueValue > mother.traits[3].trueValue).toString());
            console.log("Trait 5: " + first.traits[4].trueValue + " > " + mother.traits[4].trueValue + " = " + (first.traits[4].trueValue > mother.traits[4].trueValue).toString());
            if (first.traits[0].trueValue > mother.traits[0].trueValue && first.traits[1].trueValue > mother.traits[1].trueValue && first.traits[2].trueValue > mother.traits[2].trueValue && first.traits[3].trueValue > mother.traits[3].trueValue && first.traits[4].trueValue > mother.traits[4].trueValue) {
                game.Move("Mate", "Male", game, game);
                console.log("New King");
            } else {
                if (Math.random() >= 0.5) {
                    if (game.maxArmyMoundSize() > game.armyMound().length) {
                        game.Move("Army", "Male", game, game)
                        console.log("New Male Army");
                    } else {
                        console.log("To many Army")
                    }
                } else {
                    game.Move("Worker", "Male", game, game)
                    console.log("New Male Worker");
                }
            }
        }

        if (game.princeMound().length > 0) {
            first = game.princeMound()[0];
            mother = game.prince();
            console.log("Prince:");
            console.log("Trait 1: " + first.traits[0].trueValue + " > " + mother.traits[0].trueValue + " = " + (first.traits[0].trueValue > mother.traits[0].trueValue).toString());
            console.log("Trait 2: " + first.traits[1].trueValue + " > " + mother.traits[1].trueValue + " = " + (first.traits[1].trueValue > mother.traits[1].trueValue).toString());
            console.log("Trait 3: " + first.traits[2].trueValue + " > " + mother.traits[2].trueValue + " = " + (first.traits[2].trueValue > mother.traits[2].trueValue).toString());
            console.log("Trait 4: " + first.traits[3].trueValue + " > " + mother.traits[3].trueValue + " = " + (first.traits[3].trueValue > mother.traits[3].trueValue).toString());
            console.log("Trait 5: " + first.traits[4].trueValue + " > " + mother.traits[4].trueValue + " = " + (first.traits[4].trueValue > mother.traits[4].trueValue).toString());
            if (first.traits[0].trueValue > mother.traits[0].trueValue && first.traits[1].trueValue > mother.traits[1].trueValue && first.traits[2].trueValue > mother.traits[2].trueValue && first.traits[3].trueValue > mother.traits[3].trueValue && first.traits[4].trueValue > mother.traits[4].trueValue) {
                game.Move('MateYoung','Prince', game, game);
                console.log("New Prince");
            }
            else {
                game.Move('Recycle','Prince', game, game);
                //                 if (Math.random() >= 0.5) {
                //                     if (game.maxArmyMoundSize() > game.armyMound().length) {
                //                         game.Move("Army", "Male", game, game)
                //                         console.log("New Male Army");
                //                     } else {
                //                         console.log("To many Army")
                //                     }
                //                 } else {
                //                     game.Move("Worker", "Male", game, game)
                //                     console.log("New Male Worker");
                //                 }
            }
        }

        if (game.princessMound().length > 0) {
            first = game.princessMound()[0];
            mother = game.princess();
            console.log("Princess:");
            console.log("Trait 1: " + first.traits[0].trueValue + " > " + mother.traits[0].trueValue + " = " + (first.traits[0].trueValue > mother.traits[0].trueValue).toString());
            console.log("Trait 2: " + first.traits[1].trueValue + " > " + mother.traits[1].trueValue + " = " + (first.traits[1].trueValue > mother.traits[1].trueValue).toString());
            console.log("Trait 3: " + first.traits[2].trueValue + " > " + mother.traits[2].trueValue + " = " + (first.traits[2].trueValue > mother.traits[2].trueValue).toString());
            console.log("Trait 4: " + first.traits[3].trueValue + " > " + mother.traits[3].trueValue + " = " + (first.traits[3].trueValue > mother.traits[3].trueValue).toString());
            console.log("Trait 5: " + first.traits[4].trueValue + " > " + mother.traits[4].trueValue + " = " + (first.traits[4].trueValue > mother.traits[4].trueValue).toString());
            if (first.traits[0].trueValue > mother.traits[0].trueValue && first.traits[1].trueValue > mother.traits[1].trueValue && first.traits[2].trueValue > mother.traits[2].trueValue && first.traits[3].trueValue > mother.traits[3].trueValue && first.traits[4].trueValue > mother.traits[4].trueValue) {
                game.Move('MateYoung','Princess', game, game);
                console.log("New Princess");
            }
            else {
                game.Move('Recycle','Princess', game, game);
                //                 if (Math.random() >= 0.5) {
                //                     if (game.maxArmyMoundSize() > game.armyMound().length) {
                //                         game.Move("Army", "Male", game, game)
                //                         console.log("New Male Army");
                //                     } else {
                //                         console.log("To many Army")
                //                     }
                //                 } else {
                //                     game.Move("Worker", "Male", game, game)
                //                     console.log("New Male Worker");
                //                 }
            }
        }
    };

    function workerCode() {
        this.onmessage = function (event) {
        }

        var time = 500;
        setTimeout(function () { Tick() }, time);

        function Tick() {
            postMessage("Tick");
            setTimeout(function () { Tick() }, time);
        }
    }

    var blob = new Blob([
        "(" + workerCode.toString() + ")()"
    ], {type: "text/javascript"});

    // Note: window.webkitURL.createObjectURL() in Chrome 10+.
    var worker = new Worker(window.URL.createObjectURL(blob));
    worker.onmessage = function (e) {
        main();
    };
    worker.postMessage("hello"); // Start the worker.

})();