// ==UserScript==
// @name         DegradachWiki QoL
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Небольшой QoL скрипт для ДеградачВики
// @author       Inoix
// @match        https://www.youtube.com/watch*
// @match        https://vk.com/video*
// @icon         https://static.miraheze.org/degrabebswiki/a/a4/Faviconchik.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463543/DegradachWiki%20QoL.user.js
// @updateURL https://update.greasyfork.org/scripts/463543/DegradachWiki%20QoL.meta.js
// ==/UserScript==
function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    var successful = document.execCommand('copy');
    var msg = successful ? 'successful' : 'unsuccessful';
    console.log('Fallback: Copying text command was ' + msg);
  } catch (err) {
    console.error('Fallback: Oops, unable to copy', err);
  }

  document.body.removeChild(textArea);
}

function getTime(timeclass) {
    var timeElement = document.getElementsByClassName(timeclass);
    var text = timeElement[0].textContent;
    var timeraw = text.split(":");
    timeraw.reverse();

    var timereal = 0;
    var cur = 1;
    for (var time of timeraw) {
        timereal = timereal + Number(time)*cur;
        cur = cur * 60;
    };
    return [timereal, timeraw]
}

function processVK() {
    var timeclass = "_time_current";
    const timereal = getTime(timeclass)[1];

    console.log(timereal);
    //console.log(timereal.length);
    var current_url = window.location.href;

    var slice_id = current_url.indexOf("?t=");

    if (slice_id !== -1) {
        current_url = current_url.slice(0,slice_id);
    };

    const timeDict = ["s","m","h"];

    let i,texttime;
    for (i = timereal.length-1, texttime = ""; i > -1; i--) {
        var T = timereal[i];
        texttime = texttime +T+timeDict[i];
        //console.log(texttime+" "+T+" "+timeDict[i]);
    }
    var new_url = current_url + "?t=" + texttime
    return new_url
}

function processYT() {
    var timeclass = "ytp-time-current";
    var timereal = getTime(timeclass)[0];

    console.log(timereal);
    var current_url = window.location.href;

    var slice_id = current_url.indexOf("&t=");
    if (slice_id !== -1) {
        current_url = current_url.slice(0,slice_id);
    };
    var new_url = current_url + "&t=" + timereal + "s"
    return new_url
}

function copyTextToClipboard(text) {
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
  navigator.clipboard.writeText(text).then(function() {
    console.log('Async: Copying to clipboard was successful!');
  }, function(err) {
    console.error('Async: Could not copy text: ', err);
  });
}
(function() {
    'use strict';
    document.onkeypress = function (e) {
        var exceptKey = "Backquote";
        e = e || window.event;

        if (e.code != exceptKey) {return};

        var current_url = window.location.href;

        var new_url;
        if (current_url.includes("youtube.com")) {
            new_url = processYT();
        }
        else {
            new_url = processVK();
        }

        copyTextToClipboard(new_url);
    };
    // Your code here...
})();