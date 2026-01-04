// ==UserScript==
// @name        YouTube.com - channel name and upload date in tab title, no notification count
// @namespace   Violentmonkey Scripts
// @match       https://www.youtube.com/watch
// @grant       none
// @version     1.0
// @author      -
// @description The interaction reminder (notification count) is annoying and serves no purpose. I know there are notifications. There are always notifications. Also, to be useful, add the channel name at the start of the tab title and upload date at the end. 9/4/2022, 10:40:56 AM
// @downloadURL https://update.greasyfork.org/scripts/450734/YouTubecom%20-%20channel%20name%20and%20upload%20date%20in%20tab%20title%2C%20no%20notification%20count.user.js
// @updateURL https://update.greasyfork.org/scripts/450734/YouTubecom%20-%20channel%20name%20and%20upload%20date%20in%20tab%20title%2C%20no%20notification%20count.meta.js
// ==/UserScript==


const prepareTitle = function (originalTitle, channelPrefix, dateSuffix) {
  return channelPrefix + originalTitle + dateSuffix;
}

const getDateSuffix = function () {
  var dateSuffix = "";
  const dateElement = document.querySelector("div#info-strings yt-formatted-string.ytd-video-primary-info-renderer");
  if(dateElement !== null) {
    const date = dateElement.innerText.trim();
    var htmlElement = document.querySelector("html");
    if((htmlElement !== null) && (htmlElement.attributes.hasOwnProperty("lang"))) {
      if(htmlElement.attributes["lang"].value == "en-GB") {
        const dateParts = date.split(" ");
        if(dateParts.length == 3) {
          const day = dateParts[0];
          const monthText = dateParts[1];
          const year = dateParts[2];
          var month = null;
          switch (monthText) {
            case "Jan":
              month = 1; break;
            case "Feb":
              month = 2; break;
            case "Mar":
              month = 3; break;
            case "Apr":
              month = 4; break;
            case "May":
              month = 5; break;
            case "Jun":
              month = 6; break;
            case "Jul":
              month = 7; break;
            case "Aug":
              month = 8; break;
            case "Sept":
              month = 9; break; // seriously, fuck YouTube for doing "Sept" and not "Sep"
            case "Oct":
              month = 10; break;
            case "Nov":
              month = 11; break;
            case "Dec":
              month = 12; break;
            default:
              month = null;
          }
          if (month !== null) {
            dateSuffix = " - " + year + "-" + month.toString().padStart(2, "0") + "-" + day.padStart(2, "0");
          }
        }
      }
    }
  } // end if(dateElement !== null)
  return dateSuffix;
}

setInterval(function() {
  const originalTitle = window.title.toString().trim();
  const channelNameElement = document.querySelector("ytd-channel-name#channel-name.style-scope.ytd-video-owner-renderer div#container.style-scope.ytd-channel-name div#text-container.style-scope.ytd-channel-name yt-formatted-string#text.style-scope.ytd-channel-name a.yt-simple-endpoint.style-scope.yt-formatted-string");
  var channelPrefix = ""; // if there's no channel name currently available, don't prefix with anything
  if((channelNameElement !== null) && (channelNameElement.innerText.trim() != "")) {
    var channelPrefix = channelNameElement.innerText.trim() + ": ";
  }
  var titleElement = document.querySelector("title");
  const objectDebugString =  "[object"; // sometimes, window.title will be [object HTMLElementDiv] for some idiotic reason, and that will be the stringified version of it! Fucking hell!
  if((titleElement !== null) && (! originalTitle.startsWith(objectDebugString))) {
    var currentTitle = titleElement.innerText;
    const dateSuffix = getDateSuffix();
    
    var newTitle = prepareTitle(originalTitle, channelPrefix, dateSuffix);
    if (currentTitle != newTitle) {
      titleElement.innerText = newTitle;
    }    
  }
}, 500)
