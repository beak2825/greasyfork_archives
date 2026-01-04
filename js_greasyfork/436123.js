/**
  The MIT License (MIT)

  Copyright (c) 2021 Jan-Felix Wittmann

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/
// ==UserScript==
// @id               YoutubeSavetoPlaylistFilter
// @name             Youtube Save to Playlist Filter
// @description      When you want to add a video to a certain playlist, it is sometimes difficult to find the right playlist again. That's why I add a filter input to the Save to Playlist popup at the top so you can filter the playlists.
// @version          0.3
// @author           Jan-Felix Wittmann <jfwittmann7@gmail.com>
// @copyright        2021, leobm (https://openuserjs.org/users/leobm)
// @license          MIT
// @match            http://www.youtube.com/*
// @match            https://www.youtube.com/*
// @include          http://www.youtube.com/*
// @include          https://www.youtube.com/*
// @run-at           document-start
// @grant            none
// @namespace        https://greasyfork.org/users/844851
// @downloadURL https://update.greasyfork.org/scripts/436123/Youtube%20Save%20to%20Playlist%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/436123/Youtube%20Save%20to%20Playlist%20Filter.meta.js
// ==/UserScript==
(function (d) {

  const sortPlaylist = function (playlist) {
    let options = query(playlist, 'ytd-playlist-add-to-option-renderer');
    let optionsMap = new Map();
    options.forEach(op => {
      let formattedString = query(op, 'yt-formatted-string')[0];
      let title = formattedString.getAttribute('title');
      if (optionsMap.has(title)) {
        optionsMap.get(title).push(op);
      }
      else {
        optionsMap.set(title, [op]);
      }
    });
    let optionsMapSorted = new Map([...optionsMap.entries()].sort(function (a, b) {
      var checkedA = a[1].some(op => {
        return query(op, 'tp-yt-paper-checkbox[aria-checked="true"]')[0] !== undefined;
      });
      var checkedB = b[1].some(op => {
        return query(op, 'tp-yt-paper-checkbox[aria-checked="true"]')[0] !== undefined;
      });
      if (checkedA && !checkedB) {
        return -1;
      }
      else if (checkedB && !checkedA) {
        return 1;
      }
      var titleA = a[0].toUpperCase();
      var titleB = b[0].toUpperCase();
      if (titleA < titleB) {
        return -1;
      }
      else if (titleA > titleB) {
        return 1;
      }
      // names must be equal
      return 0;
    }).reverse());
    let firstPlaylistOption = options[0];
    for (let key of optionsMapSorted.keys()) {
      let nodes = optionsMapSorted.get(key);
      for (let opNode of nodes) {
        playlist.insertBefore(opNode, firstPlaylistOption);
        firstPlaylistOption = opNode;
      }
    }
  };

  const filterPlaylist = function (playlist, filterTitle) {
    let options = query(playlist, 'ytd-playlist-add-to-option-renderer');
    options.forEach(op => {
      let formattedString = query(op, 'yt-formatted-string')[0];
      let title = formattedString.getAttribute('title');
      let re = new RegExp('^' + filterTitle, 'i');
      if (filterTitle && !re.test(title)) {
        op.style.display = "none";
      }
      else {
        op.style.display = "block";
      }
    });

  };

  const observePaperDialogClose = function (paperDialog, onCloseDialog) {
    let ob = new MutationObserver(function (mutations, me) {
      mutations.forEach(function (mutation) {
        if (mutation.type == 'attributes' && mutation.attributeName == "aria-hidden") {
          me.disconnect();
          onCloseDialog();
        }
      });
    });
    ob.observe(paperDialog, {
      attributes: true
    });
  };

  const renderFilterContainer = function () {
    let filterContainer = d.createElement("div");
    filterContainer.setAttribute('id', 'playlists-filter');
    filterContainer.setAttribute('style', `
            position: sticky;
            position: -webkit-sticky;
            top: -20px;
            padding: 0; margin: -10px 0 2px 0;
            z-index:1000;
            background-color: #fff;
            width: 300px;
            display: flex;
            align-items: stretch;
            border-bottom:1px solid #ddd;
    `);
    return filterContainer;
  };

  const renderFilterInput = function () {
    let filterInput = d.createElement("input");
    filterInput.setAttribute('type', 'text');
    filterInput.setAttribute('placeholder', 'Playlist Filter');
    filterInput.setAttribute('style', `
            font-family: Roboto, Arial, sans-serif;
            padding: 0.4em 0.6em;
            margin: 0.8em 0;
            outline: 0;
            width: 100%;
            border: 1px solid #ccc;
            box-shadow: none;
            border-radius: 4px;
    `);
    return filterInput;
  };

  var handlePopupContainer = function (popupContainer) {
    var curFilterTitle = '';
    var popupObserverConfig = {
      subtree: true,
      childList: true
    };
    const popupContainerObserver = new MutationObserver(function (mut, me) {
      console.log("PopUp Container Changed!");

      var paperDialog = query(popupContainer, 'tp-yt-paper-dialog')[0];
      if (paperDialog) {
        me.disconnect();

        observePaperDialogClose(paperDialog, function () {
          popupContainerObserver.observe(popupContainer, popupObserverConfig);
        });

        var playlist = query(popupContainer, 'ytd-add-to-playlist-renderer #playlists')[0];
        if (playlist) {
          let filterContainer = query(playlist, '#playlists-filter')[0];
          if (!filterContainer) {
            curFilterTitle = '';
            filterContainer = renderFilterContainer();

            let filterInput = renderFilterInput();
            filterInput.addEventListener('input', (evt) => {
              var options = query(playlist, 'ytd-playlist-add-to-option-renderer');
              curFilterTitle = evt.target.value;
              filterPlaylist(playlist, curFilterTitle);
            }, true);

            filterContainer.appendChild(filterInput);
            playlist.insertBefore(filterContainer, playlist.firstChild);
          }
          sortPlaylist(playlist);
          filterPlaylist(playlist, curFilterTitle);
        }
      }
    });
    popupContainerObserver.observe(popupContainer, popupObserverConfig);
  };

  var documentObserver = new MutationObserver(function (mutations, me) {
    var popupContainer = query(d, 'ytd-popup-container')[0];
    if (popupContainer) {
      console.log("Found ytd-popup-container");
      handlePopupContainer(popupContainer);
      me.disconnect(); // stop observing
    }
  });

  documentObserver.observe(d, {
    childList: true,
    subtree: true
  });

  function query(startNode, selector) {
    try {
      var nodes = Array.prototype.slice.call(
        startNode.querySelectorAll(selector));
      return nodes;
    }
    catch (e) {}
    return [];
  }

})(document);
