// ==UserScript==
// @name         Pendobot V2
// @namespace    Greasyfork
// @version      1.1
// @description  Auto Quest, Auto Actions
// @author       N.+K.
// @match        https://pendoria.net/game
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/35720/Pendobot%20V2.user.js
// @updateURL https://update.greasyfork.org/scripts/35720/Pendobot%20V2.meta.js
// ==/UserScript==
//#togglechat
//antigateSolverStatus.text
//.status
//#recaptcha-verify-button
var tim;

$(document).ready(function() {
  $("body").append("<div style='position: absolute; top: 50px; left: 300px; width: 125px; padding: 5px; margin: 5px; backround-color: #222222;'><button id='startB' type='submit' style='width: 100%; text-align: center;' name='start' value='Start' >Start</button><br/><button id='stopB' type='submit' style='width: 100%; text-align: center; name='stop' value='Stop'>Stop</button><br /><button id='bStatus' style='width: 100%; text-align: center; type='text'name='status' value='Stopped'></button></div>");

  $("#startB").click(function() {
    $("#bStatus").text("Running");
    actions();
  });
  $("#stopB").click(function() {
    $("#bStatus").text("Stopped");
    clearInterval(tim);
  });
});





function actions() {
  tim = setInterval(function() {
    function getRandomNumber(min, max) {

      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }

    var actionsleft = parseInt($("#progressbar-wrapper > div.progress-status").html());
    var number = getRandomNumber(0, 68);

//    console.log(actionsleft);
//    console.log(number);

    if (actionsleft <= number) {
      socket.emit('refresh action');
    }
    if ($("#turnin").length >= 1) {
      $("#turnin").click();
    }
    if ($("#getQuest").length >= 1) {
      $("#getQuest").click();
    }

    var captcha = $(".antigate_solver.recaptcha.solved").find(".status").text();

    if (typeof captcha === "undefined") {} else {

      if (captcha.indexOf("Solve") > -1) {
        $("#captcha-submit").click();
      }
    }

  }, 6965);
}
