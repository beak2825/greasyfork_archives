// ==UserScript==
// @name         PM Block Notifier
// @namespace    PMsBlocked
// @version      9
// @description  Shows when a user won't accept your Private Message so that you don't waste time writing a Private Message just to see the text "Could not send your message. The user may only accept messages from friends, or is not accepting from anyone at all."
// @author       hacker09
// @match        https://myanimelist.net/mymessages.php?go=send&toname=*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://myanimelist.net&size=64
// @run-at       document-end
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/442654/PM%20Block%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/442654/PM%20Block%20Notifier.meta.js
// ==/UserScript==

(async function() {
  'use strict';
  var seconds = 30; //Set the variable to 30
  const token = document.head.querySelector("[name='csrf_token']").content; //Creates a variable to hold the actual csrf_token

  if (GM_getValue('Your Choice is to use message number') === undefined) { //If the variable doesn't exist yet define the variables
    GM_setValue('Your Choice is to use message number', '1'); //Set the user choice as 1 by default
  } //Finishes the if condition

  if (GM_getValue('Your Choice is to use message number') === '1') //If the user option is 1
  { //Starts the if condition
    var ChosenMessage = 'This PM was automatically sent by the script "PM Block Notifier" of hacker09, to check if you accept PMs.\n\nPlease ignore this PM.\n\n*MAL mods do not allow me to share it with anyone else!'; //Use the hacker09 message
    var ChosenSubject = 'Please ignore this PM, it was automatically sent by the script "PM Block Notifier"'; //Use the hacker09 subject
  } //Finishes the if condition
  else //If the user option is 2
  { //Starts the else condition
    ChosenMessage = 'ㅤ'; //Use the blank message
    ChosenSubject = 'ㅤ'; //Use the blank message subject
  } //Finishes the else condition

  const response1 = await fetch('https://myanimelist.net/profile/' + location.href.split('toname=')[1]); //Fetch
  const html1 = await response1.text(); //Gets the fetch response1
  const newDocument1 = new DOMParser().parseFromString(html1, 'text/html'); //Parses the fetch response1

  const response = await fetch(location.href, { //Fetch
    "headers": {
      "content-type": "application/x-www-form-urlencoded"
    },
    "body": `subject=${ChosenSubject}&message=${ChosenMessage}&action_type=sendmessage&csrf_token=${token}`,
    "method": "POST"
  }); //Finishes the fetch

  const html = await response.text(); //Gets the fetch response
  const newDocument = new DOMParser().parseFromString(html, 'text/html'); //Parses the fetch response

  const interval = setInterval(function() { //Creates an interval function
    seconds -= 1; //Decrease every second by 1
    document.querySelector("input.inputButton.btn-middle.flat.btn-recaptcha-submit").value = 'Wait ' + seconds + ' seconds to Send Message'; //Increase the seconds
  }, 1000); //Finishes the interval variable
  setTimeout(function() { //Starts the settimeout function
    document.querySelector("input.inputButton.btn-middle.flat.btn-recaptcha-submit").value = 'Send Message'; //Change the BTN text to Send Message
    clearInterval(interval); //Stop the interval counter
  }, 30000); //Stop the interval counter after 30 seconds

  if (newDocument.querySelector("div.badresult") !== null && newDocument.querySelector("div.badresult").innerText !== 'You may only send one PM every 30 seconds.') //If the bad result message exists
  { //Starts the if condition
    alert('This user only accept messages from friends, or is not accepting from anyone at all.'); //Show an alert message to the script user
  } //Finishes the if condition
})();