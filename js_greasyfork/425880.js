// ==UserScript==
// @name         PuzzleTeam Update Checkpoint
// @namespace    https://xandaros.dyndns.org/
// @version      0.1
// @description  Adds an "Update Checkpoint" button
// @author       Xandaros
// @match        https://www.puzzle-tents.com/
// @match        https://www.puzzle-battleships.com/
// @match        https://www.puzzle-pipes.com/
// @match        https://www.puzzle-hitori.com/
// @match        https://www.puzzle-heyawake.com/
// @match        https://www.puzzle-shingoki.com/
// @match        https://www.puzzle-masyu.com/
// @match        https://www.puzzle-stitches.com/
// @match        https://www.puzzle-aquarium.com/
// @match        https://www.puzzle-tapa.com/
// @match        https://www.puzzle-star-battle.com/
// @match        https://www.puzzle-kakurasu.com/
// @match        https://www.puzzle-skyscrapers.com/
// @match        https://www.puzzle-futoshiki.com/
// @match        https://www.puzzle-words.com/
// @match        https://www.puzzle-shakashaka.com/
// @match        https://www.puzzle-kakuro.com/
// @match        https://www.puzzle-jigsaw-sudoku.com/
// @match        https://www.puzzle-killer-sudoku.com/
// @match        https://www.puzzle-binairo.com/
// @match        https://www.puzzle-nonograms.com/
// @match        https://www.puzzle-loop.com/
// @match        https://www.puzzle-sudoku.com/
// @match        https://www.puzzle-light-up.com/
// @match        https://www.puzzle-bridges.com/
// @match        https://www.puzzle-shikaku.com/
// @match        https://www.puzzle-nurikabe.com/
// @match        https://www.puzzle-dominosa.com/
// @icon         https://www.google.com/s2/favicons?domain=puzzle-tents.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425880/PuzzleTeam%20Update%20Checkpoint.user.js
// @updateURL https://update.greasyfork.org/scripts/425880/PuzzleTeam%20Update%20Checkpoint.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(function() {
        Game.updateCheckpoint = function() {
            Game.checkpoints.pop();
            Game.saveCheckpoint();
        };

        $("#btnSave").after("<button title=\"Update checkpoint\" id=\"btnUpdateCheckpoint\" type=\"button\" class=\"button\" onclick=\"Game.updateCheckpoint();updateCheckpoints();\"><i class=\"icon-arrows-cw\"></i></button>");
    });
})();