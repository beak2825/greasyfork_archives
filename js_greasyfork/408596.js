// ==UserScript==
// @name         HaxBall Injection
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @author       Amman
// @match        https://www.haxball.com/play*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @grant        none
// @description  Find out which teams will be most balanced to fight play against!
// @downloadURL https://update.greasyfork.org/scripts/408596/HaxBall%20Injection.user.js
// @updateURL https://update.greasyfork.org/scripts/408596/HaxBall%20Injection.meta.js
// ==/UserScript==

(function () {
  'use strict';

  let sendToChat = function (text) {
    $('iframe').eq(0).contents().find('.input').children().eq(0).val(text)
    $('iframe').eq(0).contents().find('.input').children().eq(1).click()
  }

  let sendHealthCheck = function () {
      let url = "https://hax.opac.pl/findTeams?players[]=Amman&players[]=Amman";
      $.get(url, function (data) {
        console.log(data);
      });
      return true;
  }

  let sendRequest = function () {
      let url = "https://hax.opac.pl/findTeams?"
      console.log(url);
      let playerNames = []
      let counter = 0
      $('iframe').eq(0).contents().find('.player-list-view').each(function () {
        $(this).children('.list').eq(0).children().each(function () {
          name = $(this).children().eq(1).text();
          url += "players[]=" + name + "&"
          counter++
        });
      });

      if (counter % 2 != 0) {
        console.log("You have to have even amount of players!")
        return
      }

      $.get(url, function (data) {
        console.log(data);
        let firstRow = "Hi there! As Official Haxball's Scripted Referee I suggest these teams for tonight's skirmish:";
        let secondRow = "🔴🔴🔴 On left side, in red uniforms:";
        let thirdRow = "🔵🔵🔵 On right side, wearing blue:"
        for (var i = 0; i < data.red.length; i++) {
          secondRow += " @" + data.red[i];
          thirdRow += " @" + data.blue[i];
        }
        secondRow += " 🔴🔴🔴 (" + Math.round(data.redRating) + ")";
        thirdRow += " 🔵🔵🔵 (" + Math.round(data.blueRating) + ")";

        sendToChat(firstRow)
        sendToChat(secondRow)
        sendToChat(thirdRow)

      });
  }

  let injectButtons = function (buttons) {
    buttons.children().eq(1).clone().appendTo(buttons);
    let customButton = buttons.children().eq(2);
    let status = sendHealthCheck();

    customButton.text('⚽ OHSR!')
    customButton.click(sendRequest);
  }

  let setDefaults = function () {
    //10 minutes and 10 goals limit
    //$('iframe').eq(0).contents().find('.settings').eq(0).children().eq(0).children().eq(1).children().eq(10).attr('selected','selected')
    //$('iframe').eq(0).contents().find('.settings').eq(0).children().eq(1).children().eq(1).children().eq(10).attr('selected','selected')

    //big rounded
    $('iframe').eq(0).contents().find('button.admin-only').eq(2).click()
    $('iframe').eq(0).contents().find('.list.ps').children().eq(8).click()
    $('iframe').eq(0).contents().find('.list.ps').next().children().eq(0).click()

    //record
    $('iframe').eq(0).contents().find('.header-btns').children().eq(0).click()

    //copy link to clipboard
    //$('iframe').eq(0).contents().find('.header-btns').children().eq(1).click()
    //await new Promise(r => setTimeout(r, 500));
    //$('iframe').eq(0).contents().find('.room-link-view').children().eq(3).children().eq(1).click()
    //await new Promise(r => setTimeout(r, 500));
    //$('iframe').eq(0).contents().find('.room-link-view').children().eq(3).children().eq(0).click()

  }

  let injectAdminSettings = function (settingsDiv) {
    settingsDiv.children().eq(2).clone().appendTo(settingsDiv);
    let customDiv = settingsDiv.children().eq(3);
    customDiv.children().eq(0).remove();
    customDiv.children().eq(0).remove();
    customDiv.children().eq(0).text("Set Big rounded & Rec on");
    customDiv.children().eq(0).prop("disabled", false);
    customDiv.children().eq(0).click(setDefaults)
  }

  let search = setInterval(function () {
    let buttons = $('iframe').eq(0).contents().find('.bottom-section .buttons')
    let adminButtons = $('iframe').eq(0).contents().find('.admin-only')
    let adminSettings = $('iframe').eq(0).contents().find('div.settings')

    if (buttons.length > 0) {
      console.log("Found buttons, injecting script");
      injectButtons(buttons.eq(0));
      injectAdminSettings(adminSettings.eq(0));

      if (adminButtons.length > 0) {
        console.log("Injecting admin button (WIP)");
        //injectAdminButton(adminButtons);
      }


      clearInterval(search);
    } else {
      console.log("Buttons not found");
    }

  }, 1000)




})();