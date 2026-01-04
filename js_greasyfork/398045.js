// ==UserScript==
// @name         Heya
// @namespace    https://219design.com/
// @version      0.8
// @description  Connect with coworkers through Heya
// @author       219 Design
// @match        https://meet.google.com/*
// @match        https://app.gotomeeting.com/*
// @grant        none
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/398045/Heya.user.js
// @updateURL https://update.greasyfork.org/scripts/398045/Heya.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var urls = [
    'https://heya.219design.com',
  ];

  // As of Chrome 87 if a tab is not active for 5 minutes a timer can as infrequently as once every minute.
  // https://bitbucket.org/219design/ton_ip_heya/issues/17/debug-problem-where-users-appear-to-be#comment-60578358
  var interval = 20000; // ms // More than twice as short as the worst-case heartbeat period. Self-kicking will handle quicker updates.
  var keyUser = 'heyaUser';
  var heartbeating = true;
  var user;

  function getQuery() {
    var map = {};
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var q = vars[i];
      var key = q.split('=')[0];
      var value = q.substring(key.length + 1);
      map[key] = value;
    }
    return map;
  }

  function getRoomName() {
    switch (window.location.host) {
      case "app.gotomeeting.com":
        var query = getQuery();
        return query.meetingId;
      case "meet.google.com":
        return window.location.pathname.substring(1)
      default:
        return;
    }
  }

  function heartbeat() {
    if (!heartbeating) {
      return
    }

    for (var index in urls) {
      var xhr = new XMLHttpRequest();
      var url = new URL(urls[index]);
      url.pathname = url.pathname + 'heartbeat'
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
        'host': window.location.host,
        'room': getRoomName(),
        'user': user
      }));
    }
  }

  // Get user name.
  while (true) {
    user = window.localStorage.getItem(keyUser);
    if (user) {
      break;
    }
    user = prompt('Enter your Slack ID.', '');
    if (user) {
      window.localStorage.setItem(keyUser, user);
      break;
    }
  }

  heartbeat();
  window.setInterval(heartbeat, interval);
  window.onbeforeunload = function (event) {
    heartbeating = false

    for (var index in urls) {
      var xhr = new XMLHttpRequest();
      var url = new URL(urls[index]);
      url.pathname = url.pathname + 'kick'
      xhr.open('POST', url, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify({
        'host': window.location.host,
        'room': getRoomName(),
        'user': user
      }));
    }
  };
})();