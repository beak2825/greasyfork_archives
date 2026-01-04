// ==UserScript==
// @name     Don't tweet without alt text
// @description Adds a conformation box before tweeting with media lacking alt text
// @author   stick
// @version  1
// @homepageURL https://github.com/sticks-stuff/Dont-tweet-without-alt-text
// @include  https://twitter.*/*
// @grant    none
// @require  https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require  https://greasyfork.org/scripts/31940-waitforkeyelements/code/waitForKeyElements.js
// @namespace https://greasyfork.org/users/710818
// @downloadURL https://update.greasyfork.org/scripts/422082/Don%27t%20tweet%20without%20alt%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/422082/Don%27t%20tweet%20without%20alt%20text.meta.js
// ==/UserScript==

console.log("Don't tweet without alt text loaded!");

waitForKeyElements ('[data-testid="tweetButton"][data-focusable="true"]', tweetButtonLoaded);
waitForKeyElements ('[aria-label="Media"][role="group"]', imagesAdded);

function tweetButtonLoaded (tweetButton)
{
  console.log("hijacked tweet button");
  var tweetButtonReal = tweetButton[0];
  tweetButtonReal.dataset.testid = "hijacked";
  var clonedButton = $(tweetButtonReal).clone(true);
  var parentOfButton = $(tweetButtonReal).parent();
  console.log($(tweetButtonReal).data('events'));
  $(tweetButtonReal).hide();
  $(clonedButton).appendTo($(parentOfButton));
  $(clonedButton).click(function () {
    var attachmentsWithoutAlt = document.querySelectorAll('[aria-label="Media"][role="group"]').length;
    if(attachmentsWithoutAlt > 0) {
      var answer = window.confirm("You have " + attachmentsWithoutAlt + " attachments without alt text in this tweet. Are you sure you want to send?");
      if (answer) {
          $(clonedButton).remove();
          $(tweetButtonReal).click();
          $(tweetButtonReal).show();
      }
      else {
          console.log("cancelled");
      }
    } else {
      $(clonedButton).remove();
      $(tweetButtonReal).click();
      $(tweetButtonReal).show();
    }
  });
}