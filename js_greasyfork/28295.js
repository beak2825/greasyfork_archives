// ==UserScript==
// @name         Udemy - show section time
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  For Udemy, displays the time a section has ( remaining time / total time).
// @copyright    2017, Pedro Mass (https://github.com/pedro-mass)
// @author       pedro-mass
// @match        *.udemy.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-3.2.0.min.js
// @require      https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/28295/Udemy%20-%20show%20section%20time.user.js
// @updateURL https://update.greasyfork.org/scripts/28295/Udemy%20-%20show%20section%20time.meta.js
// ==/UserScript==

(function () {
  var $ = window.$;

  var classes = {
    sectionTime: "section-time",
  };

  var selectors = {
    sectionCard: "[class^=section--section--] > .panel-body",
    sectionHeader: "[class^=section--section-heading--]",
    sectionTitle: "[class^=section--section-heading--] > h3",
    sectionProgress: "[class^=section--section-heading--] > .text-secondary",

    // class needed by this user script
    sectionTime: "." + classes.sectionTime,

    lectureItem: "[class^=curriculum-item--curriculum-item--]",
    lectureTime: "[class^=curriculum-item--duration--]",
    // lectureStatus: '.cur-status',
    lectureStatus: "[class^=curriculum-item--progress]",
    lectureProgress: "#top-detail > div.detail__progress > div > div.fx",
    lectureCompleted: "[class^=curriculum-item--is-completed]",
  };

  // run();

  // waits for the cards to be loaded
  waitForKeyElements(selectors.sectionCard, run, true);

  /**
  Gets total and remaining time for each section.
  Displays these per section.
  Display the total of all sections
  */
  function run() {
    var sections = $(selectors.sectionCard);

    var totalLectureTime = 0;
    var remainingLectureTime = 0;

    $.each(sections, function (index, section) {
      // remove previous time display
      $(section).find(selectors.sectionTime).remove();

      // get the section title
      var title = $(section).find(selectors.sectionTitle).text();

      // get the total times
      var totalTimeTexts = getTimeTexts(section, false);
      var totalTimeSeconds = textTimesToSeconds(totalTimeTexts);
      var totalTime = secondsToTextTime(totalTimeSeconds);

      // update the lecture time
      totalLectureTime += totalTimeSeconds;

      // initialize the text to display with the total time
      var textToDisplay = totalTime;

      // check if we need to display partial time
      if (checkPartialTime(section)) {
        // sum the partial times
        var partialTimeTexts = getTimeTexts(section, true);
        var partialTimeSeconds = textTimesToSeconds(partialTimeTexts);
        var partialTime = secondsToTextTime(partialTimeSeconds);

        // update the lecture time
        remainingLectureTime += partialTimeSeconds;

        // prepend partial time
        textToDisplay = partialTime + " / " + textToDisplay;
      }

      // check if we need to add up the total time to remaining time
      if (getRemainingParts(section) === 0) {
        remainingLectureTime += totalTimeSeconds;
      }

      // display the section text
      displaySectionTime(section, textToDisplay);
    });

    // display lecture totals
    displayLectureTimeProgress(totalLectureTime, remainingLectureTime);

    // stops the script from running continuously
    return false;
  }

  function displayLectureTimeProgress(totalLectureTime, remainingLectureTime) {
    // start with total
    var displayText = secondsToTextTime(totalLectureTime);

    // conditional add remaining
    if (remainingLectureTime) {
      displayText =
        secondsToTextTime(remainingLectureTime) + " / " + displayText;
    }

    // surround in parens
    displayText = "(" + displayText + ")";

    // add to DOM
    var lectureProgressClass = "lecture-progress-time";

    var lectureProgressSpans = $(selectors.lectureProgress).find(
      "." + lectureProgressClass
    );
    if (lectureProgressSpans.length > 0) {
      $(lectureProgressSpans[0]).text(displayText);
    } else {
      $(selectors.lectureProgress + " > div").before(
        "<span" +
          ' class="' +
          lectureProgressClass +
          '"' +
          ' style="margin-left: 1em;"' +
          '">' +
          displayText +
          "</span>"
      );
    }

    return displayText;
  }

  /*
    Gets the section parts and checks if it's not 0 or the total parts
  */
  function checkPartialTime(section) {
    // get the section parts
    var sectionParts = getSectionParts(section);

    // determine what times to get
    var totalSections = sectionParts[1];
    var sectionsToGo = sectionParts[0];

    return sectionsToGo !== 0 && sectionsToGo != totalSections;
  }

  function getRemainingParts(section) {
    // get the section parts
    var sectionParts = getSectionParts(section);

    // determine what times to get
    return sectionParts[0];
  }

  /**
    Get the section's time. Whether partial or total is determined by the passed in
    parameter.
  */
  function getTimeTexts(section, isPartialTime) {
    // get the times
    var $lectures = $(section).find(selectors.lectureItem);

    // Check for partial time
    if (isPartialTime) {
      // filter down to just the non-completed ones
      $lectures = $lectures.filter((index, element) => {
        return $(element).has(selectors.lectureCompleted).length === 0;
      });
    }

    // get the time spans
    var timeSpans = $lectures.find(selectors.lectureTime);

    // convert to timeTexts and return
    return convertTimeSpansToTexts(timeSpans);
  }

  function displaySectionTime(section, displayText) {
    var sectionTimeClass = classes.sectionTime;

    // prepend to lecture status
    var location = $(section).find(selectors.sectionHeader);
    var totalTimeSpan = location.find(sectionTimeClass);

    // check to see if we've already added the time to the DOM
    if (totalTimeSpan.length > 0) {
      $(totalTimeSpan[0]).text(displayText);
    } else {
      // we haven't, so create the element and add it
      location.prepend(
        '<span class="' +
          sectionTimeClass +
          '" style="position:absolute;right:10%">' +
          displayText +
          "</span>"
      );
    }
  }

  function getSectionParts(section) {
    return (
      $(section)
        .find(selectors.sectionProgress)
        .text()
        // split up the parts by "/"
        .split("/")
        // trim up the space
        .map(function (text) {
          return text.trim();
        })
    );
  }

  function convertTimeSpansToTexts(timeSpans) {
    var timeTexts = [];

    for (var i = 0; i < timeSpans.length; i++) {
      timeTexts.push($(timeSpans[i]).text());
    }

    return timeTexts;
  }

  function convertTextToSeconds(textTime) {
    if (!textTime || textTime.trim().length === 0) return 0;

    var timeParts = textTime.split(":");

    var seconds = parseInt(timeParts[1]);

    seconds += parseInt(timeParts[0]) * 60;

    return seconds;
  }

  // get the summation of the times
  function textTimesToSeconds(textTimes) {
    var totalSeconds = 0;

    // get total minutes
    $.each(textTimes, function (index, textTime) {
      totalSeconds += convertTextToSeconds(textTime);
    });

    return totalSeconds;
  }

  function secondsToTextTime(totalSeconds) {
    // convert back to hh:mm
    var hours = Math.floor(totalSeconds / 60 / 60);
    var remainingTime = totalSeconds - hours * 60 * 60;
    var minutes = Math.floor(remainingTime / 60);
    remainingTime = remainingTime - minutes * 60;
    var seconds = remainingTime;

    return getTime(hours, minutes, seconds);
  }

  // get the time in the following format -> hh:mm:ss
  function getTime(hours, minutes, seconds) {
    var result = "";

    // get the hours part
    if (hours > 0) {
      result += hours + ":";

      result += timePad(minutes);
    } else {
      // we didn't have any hours
      result += minutes;
    }

    // check for minutes
    if (minutes > 0) {
      result += ":" + timePad(seconds);
    } else {
      // we didn't have any minutes, but we should say 0
      result += "0:" + timePad(seconds);
    }

    return result;
  }

  // time should be a length of 2, so prepend with 0
  function timePad(timeSegment) {
    var result = timeSegment + "";

    while (result.length < 2) {
      result = "0" + result;
    }

    return result;
  }
})();
