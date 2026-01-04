// ==UserScript==
// @name         Symbolab Unlocker
// @version      1.0
// @description  Unlocks locked steps, hides upgrade tooltips, and enables answer verification
// @author       TheAmazingness
// @match        https://www.symbolab.com/solver/*
// @include      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @namespace https://greasyfork.org/users/1213666
// @downloadURL https://update.greasyfork.org/scripts/479337/Symbolab%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/479337/Symbolab%20Unlocker.meta.js
// ==/UserScript==

(function() {
  'use strict';
  $('#solution_page').removeClass('signedout');
  $('.locked-step').removeClass('locked-step').addClass('showStepsButton');
  setTimeout(() => $('.tooltipster-base.tooltipster-sidetip.tooltipster-light.tooltipster-top.tooltipster-fade.tooltipster-show').hide(), 100);
  $('#click-capture').remove();
  $('#verify-input').attr('id', '').attr('rel', '').removeClass('placeholder');
  SOLUTIONS.verify = function(b) {
    var a = this;
    symbolab_log("Verify", "Click", null, a.query);
    if (a.verifying) {
      return
    }
    a.verifying = true;
    $.ajax({
      type: "GET",
      url: "/api/verifySolution",
      beforeSend: authorizeAjaxWithSyPubToken,
      data: {
        problem: a.query,
        solution: b.parent().find("#verify-input").mathquill("latex"),
        or: "solution"
      },
      success: function(e) {
        b.parent().find(".nl-answerCaption").hide();
        if (e.correct) {
          b.parent().find(".nl-answerCaption.nl-greenText").show()
        } else {
          if (e.partiallyCorrect) {
            b.parent().find(".nl-answerCaption.nl-goldText span").eq(0).text(e.userMessage);
            b.parent().find(".nl-answerCaption.nl-goldText").show()
          } else {
            b.parent().find(".nl-answerCaption.nl-redText").show()
          }
        }
      },
      complete: function() {
        a.verifying = false
      }
    })
  }
})();