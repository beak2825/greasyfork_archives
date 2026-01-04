// ==UserScript==
// @name        Launch Zoom from Google Calendar Meeting Rooms
// @namespace   Violentmonkey Scripts
// @match       https://calendar.google.com/calendar/*
// @version     1.1
// @author      Matthew Eagar <meagar@hey.com>
// @description If your meeting rooms contain a Zoom number (ie "TO FooBar 555-444-555 (2)"), open them in Zoom instead of Google Maps
// @downloadURL https://update.greasyfork.org/scripts/420074/Launch%20Zoom%20from%20Google%20Calendar%20Meeting%20Rooms.user.js
// @updateURL https://update.greasyfork.org/scripts/420074/Launch%20Zoom%20from%20Google%20Calendar%20Meeting%20Rooms.meta.js
// ==/UserScript==

// http://youmightnotneedjquery.com/
function on(el, eventName, elementSelector, handler) {
  el.addEventListener(eventName, function (e) {
    // loop parent nodes from the target to the delegation node
    for (var target = e.target; target && target != this; target = target.parentNode) {
      if (target.matches(elementSelector)) {
        handler.call(target, e);
        break;
      }
    }
  }, false);
}

// Logs a bunch of output so we can tell exactly when a condition failed and returned
on(document, "click", "a", (e) => {
  console.log("Handling a click", e);

  // Try to find the <a> tag from the clicked element (typically a <div>)
  let element = e.target;
  while (element && element.tagName != "A") {
    element = element.parentElement;
  }

  if (!element || element.tagName != "A") {
    console.log("couldn't find an <a> tag around the clicked element")
    return;
  }

  const url = new URL(element.href);

  if (url.host != "maps.google.com") {
    console.log("link's host didn't match maps.google.com")
    return;
  }

  // Parse query string into a map
  const params = url.search.split("&").reduce((map, e) => {
    const pair = e.split("=").map(e => decodeURIComponent(e));
    map.set(pair[0], pair[1])
    return map;
  }, new Map());

  if (!params.get("q")) {
    console.log("Found no q in query string")
    return;
  }

  // Extract a meeting ID in the form 333-333-333 or 333-333-4444
  const meetingId = params.get("q").match(/\b\d\d\d-\d\d\d-\d\d\d\d?\b/)[0]

  if (!meetingId) {
    console.log("Found no meeting id")
    return;
  }

  console.log("Found meeting ID", meetingId);
  window.open("https://prodigygame.zoom.us/j/" + meetingId)

  e.preventDefault();
});