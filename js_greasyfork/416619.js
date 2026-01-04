// ==UserScript==
// @name         Subeta: Saheric Slide Score Sender
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @version      0.1
// @description  Automatically sends scores for Saheric Slide
// @author       AyBeCee
// @match        https://subeta.net/games/sliding_puzzle.php
// @require      https://code.jquery.com/jquery-1.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/416619/Subeta%3A%20Saheric%20Slide%20Score%20Sender.user.js
// @updateURL https://update.greasyfork.org/scripts/416619/Subeta%3A%20Saheric%20Slide%20Score%20Sender.meta.js
// ==/UserScript==

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

var minTime;
var maxTime;
var sendHowManyTimes;

$(`div[style="text-align:center;padding-bottom:25px;"]`).prepend(`
<div id="slideScript">
<div style="font-size: 20px; text-transform: uppercase; font-weight: bold; margin-bottom: 10px;color:red;">Saheric Slide Score Sender</div>
Enter the minimum and maximimum time you want to wait before sending the game score.
<br>
  <label for="minTime">Minimum time (in minutes):</label>
  <input type="number" id="minTime" name="minTime" value="${minTime}">
<br>
  <label for="maxTime">Maximum time (in minutes):</label>
  <input type="number" id="maxTime" name="maxTime" value="${maxTime}">
<br>
<label for="difficulty">Difficulty:</label>
<select name="difficulty" id="difficulty">
  <option value="3">3x3</option>
  <option value="4">4x4</option>
  <option value="5">5x5</option>
  <option value="6">6x6</option>
</select>
<br>
<label for="sendHowManyTimes">Send how many times?</label>
  <input type="number" id="sendHowManyTimes" name="sendHowManyTimes" value="${sendHowManyTimes}" min="1" max="10">
<br>
<div id="sendScoreButton" class="ui button">Start sending scores</div>
</div>
<style>
#slideScript {
padding: 15px; border-radius: 15px; box-shadow: 2px 2px 2px #d3d3d3; display: inline-block; margin-left: 25px; background: #e3e3e3;
}
</style>
`)

$(`#sendScoreButton`).click( function() {
    var iteration = 1;

    sendHowManyTimes = parseInt( $("#sendHowManyTimes").val() );

    minTime = $("#minTime").val() * 60000;
    maxTime = $("#maxTime").val() * 60000;

    function loopthis() {
        console.log(iteration);
        if ( iteration <= sendHowManyTimes ) {
            iteration ++;

            var countdown = randomIntFromInterval(minTime, maxTime) ;

            $(`#slideScript`).append(`<br><b>${$(`#menu-time`).text()}:</b> Starting new game! Sending score in ${countdown}milliseconds`)

            var difficulty = $("#difficulty option:selected").val();

            unsafeWindow.SlidingPuzzle.startGame(difficulty);

            setTimeout( function() {
                unsafeWindow.SlidingPuzzle.sendScore = exportFunction(
                    function () {

                        this.request = true;

                        var parameters1 = { act: 'score', id: this.gameid, grid_size: this.grid_size };
                        console.log(parameters1);
                        //                         var onComplete1 = this.sendCallback.bind(this);
                        console.log(this);

                        new Ajax.Request('/games/sliding_puzzle.ajax.php', {
                            method: 'post',
                            parameters: { act: 'score', id: this.gameid, grid_size: this.grid_size },
                            onComplete: this.sendCallback.bind(this)
                        });
                    }
                );


                unsafeWindow.SlidingPuzzle.sendCallback = exportFunction(
                    function(response) {
                        this.request = false;
                        console.log(response)
                        var result = response.responseText.evalJSON();
                        console.log(result);
                        console.log(result.message);
                        $(`#slideScript`).append(`<br><b>${$(`#menu-time`).text()}:</b> Score sent! ${result.message}`)
                    }
                );


                unsafeWindow.SlidingPuzzle.sendScore();
            }, countdown)

            setTimeout( function() {
                loopthis()
            }, countdown + 1000)

        } else {
            $(`#slideScript`).append(`<br><b>${$(`#menu-time`).text()}:</b> Score sending stopped`);
        }
    }

    loopthis()
});