// ==UserScript==
// @name         YouTube Playlist Page - Show Date Posted and View Count
// @namespace    http://james0x57.com/
// @version      0.1
// @description  Show date posted and view count on youtube playlist page
// @author       James0x57
// @match        https://www.youtube.com/playlist*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/370217/YouTube%20Playlist%20Page%20-%20Show%20Date%20Posted%20and%20View%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/370217/YouTube%20Playlist%20Page%20-%20Show%20Date%20Posted%20and%20View%20Count.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function addCSS(css) {
    var el = document.createElement('div');
    el.innerHTML = '<b>CSS</b><style type="text/css">' + css + '</style>';
    el = el.childNodes[1];
    if (el) document.getElementsByTagName('head')[0].appendChild(el);
    return el;
  }

  // https://gist.github.com/James0x57/da84cc2bb6087db5f041387b0a586e6c
  //## Begin Selector Observation Code
    var selectors = [];
    (new MutationObserver(
      function (mutationsList) {
        var s, selector, nodeMatches
        var slen = selectors.length
        for (s = 0; s < slen; s++) {
          selector = selectors[s]
          nodeMatches = node => node.nodeType === 1 && node.matches(selector.childSelector)

          mutationsList.forEach(mu => {
            if (mu.type === "childList" && mu.target.matches(selector.parentSelector)) {
              var addedMatches = Array.prototype.filter.call(mu.addedNodes, nodeMatches)
              var removedMatches = Array.prototype.filter.call(mu.removedNodes, nodeMatches)
              addedMatches.length && selector.inserted.call(null, addedMatches)
              removedMatches.length && selector.removed.call(null, removedMatches)
            }
          })
        }
      }
    )).observe(document.documentElement, {
      childList: true,
      subtree: true
    })

    var onParentChildSelectors = function (opts) {
      var nullFn = () => {}
      selectors.push(Object.assign({
        parentSelector: "",
        childSelector: "",
        inserted: nullFn,
        removed: nullFn
      }, opts))
    }
  //## End Selector Observation Code

  addCSS(`
    #video-title.ytd-playlist-video-renderer[aria-label]:after {
      content: attr(data-jca-meta-info);
      font-weight: normal;
      font-size: 12px;
      display: block;
    }
  `)

  var handleVideoInList = function (videoListItemEl) {
    var titleEl = videoListItemEl.querySelector("#video-title.ytd-playlist-video-renderer[aria-label]")
    if (!titleEl) {
      return
    }
    var hiddenData = titleEl.getAttribute("aria-label")
    var time, unit, views
    hiddenData.replace(
      /.*?([0-9,]+) ([a-z]+?)s? ago.*? ([0-9,]+) views/,
      (x, ...captures) => { [time, unit, views] = captures }
    )
    var metaInfo = "Posted "
    var date = new Date()
    if (unit === "day") {
      date.setDate(date.getDate() - time)
      metaInfo += "on " + date.toString().replace(/(20\d\d) .*/, "$1")
    } else if (unit === "week") {
      date.setDate(date.getDate() - (time * 7))
      metaInfo += "week of " + date.toString().replace(/(20\d\d) .*/, "$1")
    } else if (unit === "month") {
      date.setMonth(date.getMonth() - time)
      metaInfo += "in " + date.toString().replace(/^[^ ]* ([^ ]+) .*? (20\d\d) .*/, "$1 $2")
    } else if (unit === "year") {
      date.setYear(date.getYear() - time + 1900)
      metaInfo += "in " + date.toString().replace(/^.*? (20\d\d) .*/, "$1")
    } else { // hours, min
      metaInfo += date.toString().replace(/(20\d\d) .*/, "$1")
    }
    metaInfo += " | Views: "
    metaInfo += views
    titleEl.setAttribute("data-jca-meta-info", metaInfo)
  }

  onParentChildSelectors({
    parentSelector: "ytd-playlist-video-list-renderer #contents",
    childSelector: "ytd-playlist-video-renderer",
    inserted: videoListItemEls => videoListItemEls.forEach(handleVideoInList)
  })
})()
