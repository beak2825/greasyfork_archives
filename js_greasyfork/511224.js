// ==UserScript==
// @name         YouTube Playlist Search (YAYTools)
// @namespace    YAYLISTS
// @version      0.0.1
// @description  You can search in a youtube playlist
// @author       Chris
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @include      https://www.youtube.com/*
// @require      https://greasyfork.org/scripts/5679-wait-for-elements/code/Wait%20For%20Elements.js?version=122976
// @grant        none
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/511224/YouTube%20Playlist%20Search%20%28YAYTools%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511224/YouTube%20Playlist%20Search%20%28YAYTools%29.meta.js
// ==/UserScript==


var SCRIPT_NAME = 'YouTube Playlist Search (YAYTools)';
var ITEM_SELECTOR = '#contents > ytd-playlist-video-renderer';
var TEXT_SELECTOR = '#meta';
var OFFSET_AREA_SELECTOR = '#masthead-container';

var util = {
  log: function() {
    var args = [].slice.call(arguments);
    args.unshift('%c' + SCRIPT_NAME + ':', 'font-weight: bold;color: hotpink;');
    console.log.apply(console, args);
  },
  q: function(query, context) {
    return (context || document).querySelector(query);
  },
  qq: function(query, context) {
    return [].slice.call((context || document).querySelectorAll(query));
  },
  throttle: function(callback, limit) {
    var wait = false;
    return function() {
      if (!wait) {
        callback.apply(this, arguments);
        wait = true;
        setTimeout(function() {
          wait = false;
        }, limit);
      }
    };
  }
};

var yps = {
  _items: [],
  makeSearchBox: function() {
    var txtSearch = document.createElement('input');
    txtSearch.type = 'text';
    txtSearch.setAttribute('style', [
      'position: fixed',
      'right: 0',
      'top:' + (util.q(OFFSET_AREA_SELECTOR).clientHeight) + 'px',
      'width: 250px',
      'z-index: 1000'
    ].join(';'));
    txtSearch.onkeyup = yps.search;
    document.body.appendChild(txtSearch);
    return txtSearch;
  },
  search: function(e) {
    yps.filterVideos(e.target.value);
  },
  filterVideos: function(query) {
    query = query.toLowerCase().split(' ').map(function(q) {
      return q.trim();
    });
    yps._items.forEach(function(item) {
      if (query.every(function(q) {
          return item.name.indexOf(q) > -1;
        })) {
        item.elem.style.display = '';
      }
      else {
        item.elem.style.display = 'none';
      }
    });
  },
  start: function() {
    util.log('Starting... waiting for playlist');
    waitForUrl(/^https:\/\/www\.youtube\.com\/playlist\?list=.+/, function() {
      var playlistUrl = location.href;
      var urlWaitId, itemWait;
      var txtSearch = yps.makeSearchBox();
      util.log('Reached playlist, adding search box');
      itemWait = waitForElems(ITEM_SELECTOR, function(item) {
        yps._items.push({
          elem: item,
          name: util.q(TEXT_SELECTOR, item).textContent.toLowerCase()
        });
      });
      urlWaitId = waitForUrl(function(url) {
        return url !== playlistUrl;
      }, function() {
        util.log('leaving playlist, cleaning up');
        itemWait.stop();
        txtSearch.remove();
        yps._items = [];
      }, true);
    });
  }
};

yps.start();
