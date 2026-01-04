// ==UserScript==
// @name Bandcamp Album Tags On Collection Pages
// @version 1.0.4
// @description Shows album tags when hovering over an album on a collection page
// @namespace 289690-squeek502
// @license 0BSD
// @match http*://bandcamp.com/*
// @include http*://bandcamp.com/*
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/391460/Bandcamp%20Album%20Tags%20On%20Collection%20Pages.user.js
// @updateURL https://update.greasyfork.org/scripts/391460/Bandcamp%20Album%20Tags%20On%20Collection%20Pages.meta.js
// ==/UserScript==

var tags = {};
var loadings = {};
var albumSelector = '.collection-items .collection-item-container[data-tralbumid]';
var svgData = '<svg width="38" height="38" xmlns="http://www.w3.org/2000/svg" stroke="#fff"><g transform="translate(1 1)" stroke-width="2" fill="none" fill-rule="evenodd"><circle stroke-opacity=".5" cx="18" cy="18" r="18"/><path d="M36 18c0-9.94-8.06-18-18-18"><animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"/></path></g></svg>';

var makeTags = function(container, id, href) {
  var tags = document.createElement('div');
  tags.style.pointerEvents = 'none';
  tags.style.padding = '2px';
  tags.style.position = 'absolute';
  tags.style.top = '0px'; tags.style.left = '0px';

  if (!loadings[id]) {
    var loading = document.createElement('div');
    loading.style.pointerEvents = 'none';
    loading.style.padding = '4px';
    loading.style.position = 'absolute';
    loading.style.top = '0px'; loading.style.left = '0px';
    loading.innerHTML = svgData;
    container.appendChild(loading);
    loadings[id] = loading;
  }

  var bandid = container.getAttribute('data-bandid');
  var tralbumtype = container.getAttribute('data-tralbumtype');
  var apiUrl = "https://bandcamp.com/api/mobile/22/tralbum_details?band_id="+bandid+"&tralbum_id="+id+"&tralbum_type="+tralbumtype;

  // get tags
  GM_xmlhttpRequest({
    method: 'GET',
    url: apiUrl,
    onload: function (res) {
      var status = res.status;
      var body = res.responseText;
      if (status != 200) {
        console.warn("Failed to get tags for: "+href, status, res);
        return;
      }
      var json = JSON.parse(body);
      if (json.error) {
        console.warn("Failed to get tags, JSON error:"+json.error_message, res);
        return;
      }

      container.removeChild(loadings[id]);

      json.tags.forEach(tag => {
        var span = document.createElement('span');
        span.style.display = 'inline-block';
        span.style.margin = '2px';
        span.style.padding = '2px';
        span.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
        span.innerHTML = tag.geoname ? tag.name : tag.name.toLowerCase();
        tags.appendChild(span);
      });
    }
  });
  return tags;
};

var setupContainer = function(container) {
  var a = container.querySelector('a.item-link');
  var href = a.href;
  var id = container.getAttribute('data-tralbumid');
  var parent = container.querySelector('.collection-item-art-container');

  container.addEventListener("mouseover", function(event) {
    if (!tags[id]) {
      tags[id] = makeTags(container, id, href);
    }
    if (tags[id].parentNode != parent) {
      parent.appendChild(tags[id]);
    }
    parent.style.position = 'relative';
    tags[id].style.display = 'block';
  });

  container.addEventListener("mouseout", function(event) {
    if (tags[id]) {
      tags[id].style.display = 'none';
    }
  });
};

document.querySelectorAll(albumSelector).forEach(setupContainer);

// Select the node that will be observed for mutations
var targetNode = document.getElementById('grids');

if (!targetNode) {
  return;
}

// Options for the observer (which mutations to observe)
var config = { subtree: true, childList: true };

// Callback function to execute when mutations are observed
var callback = function(mutationsList, observer) {
  for(var mutation of mutationsList) {
    for (var added of mutation.addedNodes) {
      if (added instanceof HTMLElement && added.matches(albumSelector)) {
        setupContainer(added);
      }
    }
  }
};

// Create an observer instance linked to the callback function
var observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);
