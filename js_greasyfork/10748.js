// ==UserScript==
// @name        IRCSort
// @namespace   KWIERSO
// @description Sort IRCCloud channel lists
// @include     https://irccloud.mozilla.com/*
// @version     1
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/10748/IRCSort.user.js
// @updateURL https://update.greasyfork.org/scripts/10748/IRCSort.meta.js
// ==/UserScript==


var channelPriorities = {
  "#developers": 0,
  "#jetpack": 1,
  "#ateam": 2,
  "#releng": 3,
  "#buildduty": 4,
  "#taskcluster": 5,
  "#treeherder": 6,
  "#vcs": 7,
  "#b2g": 8,
  "#gaia": 9,
  "#devtools": 10,
  "#jsapi": 11,
  "#fx-team": 12,
  "#media": 13,
  "#mobile": 14,
  "#it": 15,
  "#moc": 16
};

var getChannelPriority = function(channelName) {
  var thispriority = channelPriorities[channelName];
  if(thispriority === undefined) {
    thispriority = 5555;
  }
  return thispriority;
};

var sortChannelFunction = function(a,b) {
  return a[1] - b[1];
};

var sortChannels = function() {
  var bufferList = document.querySelector("#bufferList").firstElementChild.querySelector(".buffers");
  var bufferListChildren = bufferList.querySelectorAll("li.buffer");
  var channelList = [];
  var newChannelList = [];

  for(var i=0; i < bufferListChildren.length; i++) {
    var thisEl = bufferList.firstElementChild;
    channelList.push([bufferList.removeChild(thisEl), getChannelPriority(thisEl.textContent.replace("☂",""))]);
  }


  channelList = channelList.sort(function(a,b) {
    return a[1] - b[1];
  });

  for(var j=0; j < channelList.length; j++) {
    bufferList.appendChild(channelList[j][0]);
  }
};



GM_registerMenuCommand("Sort channel list", sortChannels);