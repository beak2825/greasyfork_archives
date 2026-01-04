// ==UserScript==
// @name        Merge events for Google Calendar
// @namespace   https://greasyfork.org/en/users/6254-doublemms
// @license MIT
// @description Merge same events on from calendars in Google Calendar. Fork of imightbeamy/gcal-multical-event-merge cross-browser compatible.
// @include     https://www.google.com/calendar/*
// @include     http://www.google.com/calendar/*
// @include     https://calendar.google.com/*
// @include     http://calendar.google.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/444889/Merge%20events%20for%20Google%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/444889/Merge%20events%20for%20Google%20Calendar.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /**
   * Return gradient style from multiple color inputs
   * @param {string[]} colors List of colors (eg. ['#fff', '#000'])
   * @param {number} width Grandient bars width in pixels
   * @param {number} angle Orientation angle for bars
   * @return {string} CSS style
   */
  const generateGradient = (colors, width, angle) => {
    let gradient = `repeating-linear-gradient( ${angle}deg,`;
    let pos = 0;

    colors.forEach((color) => {
      gradient += color + " " + pos + "px,";
      pos += width;
      gradient += color + " " + pos + "px,";
    });

    gradient = gradient.slice(0, -1);
    gradient += ")";

    return gradient;
  };

  /**
   * Calculate event position
   * @param {HTMLElement} event
   * @param {DOMRect} parentPosition
   * @return {DOMRect}
   */
  const calculateEventPosition = (event, parentPosition) => {
    const eventPosition = event.getBoundingClientRect();
    return {
      left: Math.max(eventPosition.left - parentPosition.left, 0),
      right: parentPosition.right - eventPosition.right,
    };
  };

  /**
   * Merge multiple events elements
   * @param {HTMLElement[]} events
   * @returns {void}
   */
  const mergeEventElements = (events) => {
    /**
     * Parse event drag source type
     * @param {HTMLElement} e 
     * @returns {number}
     */
    const dragType = (e) => parseInt(e.dataset.dragsourceType);

    events.sort((e1, e2) => dragType(e1) - dragType(e2));
    const colors = events.map(
      (event) =>
        event.style.backgroundColor || // Week day and full day events marked 'attending'
        event.style.borderColor || // Not attending or not responded week view events
        event.parentElement.style.borderColor // Timed month view events
    );

    const parentPosition = events[0].parentElement.getBoundingClientRect();
    const positions = events.map((event) => {
      event.originalPosition =
        event.originalPosition || calculateEventPosition(event, parentPosition);
      return event.originalPosition;
    });

    const eventToKeep = events.shift();
    events.forEach((event) => {
      event.style.visibility = "hidden";
    });

    if (eventToKeep.style.backgroundColor || eventToKeep.style.borderColor) {
      eventToKeep.originalStyle = eventToKeep.originalStyle || {
        backgroundImage: eventToKeep.style.backgroundImage,
        backgroundSize: eventToKeep.style.backgroundSize,
        left: eventToKeep.style.left,
        right: eventToKeep.style.right,
        visibility: eventToKeep.style.visibility,
        width: eventToKeep.style.width,
        border: eventToKeep.style.border,
        borderColor: eventToKeep.style.borderColor,
        textShadow: eventToKeep.style.textShadow,
      };
      eventToKeep.style.backgroundImage = generateGradient(colors, 10, 45);
      eventToKeep.style.backgroundSize = "initial";
      eventToKeep.style.left =
        Math.min.apply(
          Math,
          positions.map((s) => s.left)
        ) + "px";
      eventToKeep.style.right =
        Math.min.apply(
          Math,
          positions.map((s) => s.right)
        ) + "px";
      eventToKeep.style.visibility = "visible";
      eventToKeep.style.width = null;
      eventToKeep.style.border = "solid 1px #FFF";

      // Clear setting color for declined events
      eventToKeep.querySelector('[aria-hidden="true"]').style.color = null;

      const computedSpanStyle = window.getComputedStyle(
        eventToKeep.querySelector("span")
      );
      if (computedSpanStyle.color == "rgb(255, 255, 255)") {
        eventToKeep.style.textShadow = "0px 0px 2px black";
      } else {
        eventToKeep.style.textShadow = "0px 0px 2px white";
      }

      events.forEach((event) => {
        event.style.visibility = "hidden";
      });
    } else {
      const dots = eventToKeep.querySelector('[role="button"] div:first-child');
      const dot = dots.querySelector("div");
      dot.style.backgroundImage = generateGradient(colors, 4, 90);
      dot.style.width = colors.length * 4 + "px";
      dot.style.borderWidth = 0;
      dot.style.height = "8px";

      events.forEach((event) => {
        event.style.visibility = "hidden";
      });
    }
  }

  /**
   * Reset merged events
   * @param {HTMLElement[]} events
   * @returns {void}
   */
  const resetMergedEvents = (events) => {
    events.forEach((event) => {
      for (var k in event.originalStyle) {
        event.style[k] = event.originalStyle[k];
      }
      event.style.visibility = "visible";
    });
  }

  /**
   * Merge events within a given element
   * @param {HTMLElement} calendarElement
   */
  const merge = (calendarElement) => {
    const eventSets = {};
    const days = calendarElement.querySelectorAll('[role="gridcell"]');
    days.forEach((day, index) => {
      const events = Array.from(
        day.querySelectorAll(
          '[data-eventid][role="button"], [data-eventid] [role="button"]'
        )
      );
      events.forEach((event) => {
        const eventTitleEls = event.querySelectorAll('[aria-hidden="true"]');
        if (!eventTitleEls.length) {
          return;
        }
        let eventKey = Array.from(eventTitleEls)
          .map((el) => el.textContent)
          .join("")
          .replace(/\\s+/g, "");
        eventKey = index + eventKey + event.style.height;
        eventSets[eventKey] = eventSets[eventKey] || [];
        eventSets[eventKey].push(event);
      });
    });

    Object.values(eventSets).forEach((events) => {
      if (events.length > 1) {
        mergeEventElements(events);
      } else {
        resetMergedEvents(events);
      }
    });
  }

  /**
   * Observer callback which merges events on specific mutations
   * @param {MutationRecord[]} mutations List of observed mutation records
   * @return {void}
   */
  const init = (mutations) => {
    mutations &&
      mutations
        .map((mutation) => mutation.addedNodes[0] || mutation.target)
        .filter(
          (node) =>
            node.matches &&
            node.matches('[role="main"], [role="dialog"], [role="grid"]')
        )
        .map(merge);
  }

  const observer = new MutationObserver(init);
  observer.observe(document.querySelector("body"), {
    childList: true,
    subtree: true,
    attributes: true,
  });
})();
