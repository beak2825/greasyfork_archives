// ==UserScript==
// @name         InstaSynchP Auto Playlist
// @namespace    InstaSynchP
// @description  Creates an Instasynch playlist from Youtube playlists
// @version      1.0.1
// @author       Zod-
// @source       https://github.com/Zod-/InstaSynchP-Auto-Playlist
// @license      MIT
// @require      https://greasyfork.org/scripts/5647-instasynchp-library/code/code.js?version=41059
// @include      *://instasync.com/r/*
// @include      *://*.instasync.com/r/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/37648/InstaSynchP%20Auto%20Playlist.user.js
// @updateURL https://update.greasyfork.org/scripts/37648/InstaSynchP%20Auto%20Playlist.meta.js
// ==/UserScript==

function AutoPlaylist() {
  'use strict';
  this.version = '1.0.0';
  this.name = 'InstaSynchP Auto Playlist';
  this.enabled = true;
  this.data = {
    primary: [],
    secondary: []
  };
  this.apiKey = 'AIzaSyAqTVA4kUytyFogCy0WaaPy8XYcapukTFM';
  this.requests = 0;

  this.settings = [{
    label: 'Primary YouTube Playlist',
    id: 'auto-playlist-primary',
    size: 45,
    type: 'text',
    'default': '',
    section: ['Auto Playlist']
  }, {
    label: 'Primary # of videos',
    id: 'auto-playlist-primary-count',
    type: 'int',
    'default': 9,
    section: ['Auto Playlist']
  }, {
    label: 'Secondary YouTube Playlist',
    id: 'auto-playlist-secondary',
    size: 45,
    type: 'text',
    'default': '',
    section: ['Auto Playlist']
  }, {
    label: 'Secondary # of videos',
    id: 'auto-playlist-secondary-count',
    type: 'int',
    'default': 1,
    section: ['Auto Playlist']
  }, {
    id: 'auto-playlist-json-data',
    type: 'text',
    'default': '{"primary":[],"secondary":[]}',
    section: ['Auto Playlist'],
    hidden: true
  }, {
    label: 'Rotate',
    id: 'auto-playlist-rotate',
    type: 'checkbox',
    'default': false,
    section: ['Auto Playlist'],
    destination: 'playlist'
  }];
  this.commands = {
    '\'create': {
      hasArguments: false,
      type: 'mod',
      reference: this,
      description: 'Creates a playlist from the 2 YouTube playlists',
      callback: this.createPlaylist
    },
    '\'rotate': {
      hasArguments: false,
      type: 'mod',
      reference: this,
      description: 'Toggles rotate on or off',
      callback: this.toggleRotate
    }
  };
  this.j = 0;
  this.addedVideos = 0;
  this.timer = undefined;
}

AutoPlaylist.prototype.executeOnce = function () {
  'use strict';
  var _this = this;
  events.on(_this, 'AddVideo', _this.videoAdded);
  events.on(_this, 'AddMessage', _this.messageAdded);
  events.on(_this, 'PlayVideo', _this.videoPlayed);
  gmc.set('auto-playlist-rotate', false);
  events.on(_this, 'SettingChange[auto-playlist-rotate]', _this.videoPlayed);
  events.on(_this, 'SettingChange[auto-playlist-primary]',
    _this.checkForUpdatesAll);
  events.on(_this, 'SettingChange[auto-playlist-secondary]',
    _this.checkForUpdatesAll);
  _this.data = JSON.parse(gmc.get('auto-playlist-json-data'));
  _this.checkForUpdatesAll();
};

AutoPlaylist.prototype.clearTimer = function () {
  'use strict';
  var _this = this;
  if (_this.timer) {
    clearTimeout(_this.timer);
    _this.timer = undefined;
  }
};

AutoPlaylist.prototype.decrementAddedVideos = function () {
  'use strict';
  var _this = this;
  _this.clearTimer();
  if (_this.addedVideos > 0) {
    _this.addedVideos--;
    _this.timer = setTimeout(function () {
      _this.resetAddedVideos();
    }, 1500);
  }
};

AutoPlaylist.prototype.resetAddedVideos = function () {
  'use strict';
  this.addedVideos = 0;
};

AutoPlaylist.prototype.messageAdded = function (user, message) {
  'use strict';
  var _this = this;
  if (user.username !== '' ||
    (message !== 'Video not found.' &&
      message !== 'Video is already in playlist.')) {
    return;
  }
  _this.decrementAddedVideos();
};

AutoPlaylist.prototype.videoAdded = function (video) {
  'use strict';
  var _this = this;
  if (!video || video.addedby !== thisUser().username) {
    return;
  }
  _this.decrementAddedVideos();
};

AutoPlaylist.prototype.videoPlayed = function () {
  'use strict';
  var _this = this;
  if (!gmc.get('auto-playlist-rotate')) {
    return;
  }
  var max = activeVideoIndex();
  if (max > 4) {
    return;
  }
  var playlistVideos = window.room.playlist.videos;
  var videosToRemove = [];
  for (var i = 0; i < max && i < playlistVideos.length; i++) {
    videosToRemove.push(playlistVideos[i].info);
  }
  for (var j = 0; j < videosToRemove.length; j++) {
    sendcmd('remove', {
      info: videosToRemove[j]
    });
  }
  setTimeout(function () {
    _this.createPlaylist();
  }, 1500);
};

AutoPlaylist.prototype.checkForUpdatesAll = function () {
  'use strict';
  var _this = this;
  var videoInfo = urlParser.parse(gmc.get('auto-playlist-primary'));
  if (videoInfo && videoInfo.playlistId) {
    _this.checkForUpdates(videoInfo, 'primary');
  } else {
    _this.data.primary = [];
    gmc.set('auto-playlist-primary', '');
    _this.savePlaylist();
  }

  videoInfo = urlParser.parse(gmc.get('auto-playlist-secondary'));
  if (videoInfo && videoInfo.playlistId) {
    _this.checkForUpdates(videoInfo, 'secondary');
  } else {
    _this.data.primary = [];
    gmc.set('auto-playlist-secondary', '');
    _this.savePlaylist();
  }
};

AutoPlaylist.prototype.request = function (url, param, done) {
  'use strict';
  var _this = this;
  _this.requests++;
  $.get(url, param)
    .done(function () {
      done.apply(undefined, arguments);
      _this.requests--;
    })
    .error(function () {
      _this.requests--;
    });
};

AutoPlaylist.prototype.checkForUpdates = function (videoInfo, dataKey) {
  'use strict';
  var _this = this;
  var url = 'https://www.googleapis.com/youtube/v3/playlists';
  var param = {
    'key': _this.apiKey,
    'part': 'contentDetails',
    'id': videoInfo.playlistId
  };
  var done = function (data) {
    if (data.items[0].contentDetails.itemCount !== _this.data[dataKey].length) {
      _this.updatePlaylist(videoInfo, dataKey);
    }
  };

  _this.request(url, param, done);
};

AutoPlaylist.prototype.updatePlaylist = function (videoInfo, dataKey) {
  'use strict';
  var _this = this;
  var url = 'https://www.googleapis.com/youtube/v3/playlistItems';
  var param = {
    'key': _this.apiKey,
    'part': 'contentDetails',
    'playlistId': videoInfo.playlistId,
    'maxResults': 50,
    'pageToken': undefined
  };
  var newArr = [];
  var done = function (data) {
    for (var i = 0; i < data.items.length; i++) {
      newArr.push('https://youtu.be/' + data.items[i].contentDetails.videoId);
    }

    if (newArr.length < data.pageInfo.totalResults) {
      param.pageToken = data.nextPageToken;
      _this.request(url, param, done);
    } else {
      newArr.sort();
      _this.data[dataKey] = newArr;
      _this.savePlaylist();
    }
  };

  _this.request(url, param, done);
};

AutoPlaylist.prototype.savePlaylist = function () {
  'use strict';
  gmc.set('auto-playlist-json-data', JSON.stringify(this.data));
};

function leftOuterJoin(a, b) {
  'use strict';
  var result = [];
  var aa = a.slice();
  var bb = b.slice();
  while (aa.length > 0 && bb.length > 0) {
    if (aa[0] < bb[0]) {
      result.push(aa.shift());
    } else if (aa[0] > bb[0]) {
      bb.shift();
    } else {
      aa.shift();
      bb.shift();
    }
  }
  return result.concat(aa);
}

AutoPlaylist.prototype.removeDuplicates = function (arr) {
  'use strict';
  var playlistUrls = [];
  var playlistVideos = window.room.playlist.videos;
  for (var i = 0; i < playlistVideos.length; i++) {
    playlistUrls.push(urlParser.create({
      videoInfo: playlistVideos[i].info
    }));
  }
  playlistUrls.sort();
  return leftOuterJoin(arr, playlistUrls);
};

AutoPlaylist.prototype.toggleRotate = function () {
  'use strict';
  var rotate = !gmc.get('auto-playlist-rotate');
  gmc.set('auto-playlist-rotate', rotate);
  addSystemMessage('Rotate is now turned ' + (rotate ? 'on.' : 'off.'));
};

AutoPlaylist.prototype.createPlaylist = function () {
  'use strict';
  var _this = this;
  if (_this.requests) {
    addSystemMessage('Still updating playlists, please wait a moment.');
    return;
  }
  if (_this.addedVideos > 0) {
    return;
  }
  var max = 250 - window.room.playlist.videos.length;
  var primaryCount = gmc.get('auto-playlist-primary-count');
  var primary = _this.removeDuplicates(_this.data.primary.slice());
  var secondaryCount = gmc.get('auto-playlist-secondary-count');
  var secondary = _this.removeDuplicates(_this.data.secondary.slice());

  for (var i = 0; i < max && secondary.length + primary.length > 0; i++,
    _this.j++) {
    var arr;
    var index;
    var isPrimary = (_this.j % (primaryCount + secondaryCount)) <
      primaryCount;
    if ((isPrimary && primary.length === 0) ||
      (!isPrimary && secondary.length === 0)) {
      isPrimary = !isPrimary;
    }
    arr = isPrimary ? primary : secondary;
    index = Math.floor(Math.random() * arr.length);
    _this.addedVideos++;
    sendcmd('add', {
      URL: arr[index]
    });
    arr.splice(index, 1);
  }
};

window.plugins = window.plugins || {};
window.plugins.autoPlaylist = new AutoPlaylist();
