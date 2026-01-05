// ==UserScript==
// @name         autonomnom - Efficiency for IWS - Answer questions about a photo
// @namespace    mkrobert
// @version      1.04
// @description  This script autofocuses the HIT and gives keyboard inputs for all functions with just four clustered keys - 1, 2, w and e.
// @author       mkrobert, clickhappier
// @include      https://www.masseurfinder.com/s/aws_turk/*
// @icon 	 http://mturkgrind.com/data/avatars/l/8/8874.jpg?1445404860
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13262/autonomnom%20-%20Efficiency%20for%20IWS%20-%20Answer%20questions%20about%20a%20photo.user.js
// @updateURL https://update.greasyfork.org/scripts/13262/autonomnom%20-%20Efficiency%20for%20IWS%20-%20Answer%20questions%20about%20a%20photo.meta.js
// ==/UserScript==
// https://github.com/mkrobert
runScript();
function runScript()
{
  $('#b0').focus(); //saves you from needing to click on the background at the start
  window.onkeydown = function (e)
  {
    if (e.keyCode === 87) //press w  for "0 people"
    $('#b0').click();
    if (e.keyCode === 49) { //press 1 for YES or "1 person"
      $('#yesButton').click();
      $('#b1').click();
    }
    if (e.keyCode === 50) { //press 2 for NO or "2 or more people"
      $('#noButton').click();
      $('#b2').click();
    }
    if (e.keyCode === 69) //press e for "Yes - Submit"
    $('#submitButton').click();
  }
}