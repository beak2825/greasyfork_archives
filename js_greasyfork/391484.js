// ==UserScript==
// @name Bandcamp Supporters You Follow
// @version 1.0.3
// @description Show supporters of an album/track that you follow
// @namespace 289690-squeek502
// @license 0BSD
// @match http*://*.bandcamp.com/*
// @include http*://*.bandcamp.com/*
// @grant GM_xmlhttpRequest
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/391484/Bandcamp%20Supporters%20You%20Follow.user.js
// @updateURL https://update.greasyfork.org/scripts/391484/Bandcamp%20Supporters%20You%20Follow.meta.js
// ==/UserScript==

// messy code ahead

var OPTION_AUTOLOAD = 'autoload';
var SMALL_SIZE = '28px';
var LARGE_SIZE = 'auto';
var DEFAULT_SIZE = SMALL_SIZE;
var OPTION_SIZE = 'size';
var DEFAULT_AUTOLOAD = false;

var collectedByContainer = document.querySelector('.collected-by.tralbum.collectors');
if (!collectedByContainer)
  return;

var get; var post;
var loadedimgs = [];

var existingMessage = collectedByContainer.querySelector('.message');

var optionsMenu = document.createElement('div');
optionsMenu.style.display = 'none';
optionsMenu.style.marginTop = '10px';
optionsMenu.style.marginBottom = '10px';
optionsMenu.style.position = 'relative';

var toggleAutoload = document.createElement('input');
toggleAutoload.setAttribute('type', 'checkbox');
toggleAutoload.checked = GM_getValue("autoload", false);
toggleAutoload.id = 'supporters-you-follow-autoload';
var toggleAutoloadLabel = document.createElement('label');
toggleAutoloadLabel.setAttribute('for', 'supporters-you-follow-autoload');
toggleAutoloadLabel.textContent = 'autoload';
toggleAutoloadLabel.style.fontWeight = 'bold';
var toggleAutoloadContainer = document.createElement('div');
toggleAutoloadContainer.style.display = 'inline-block';
toggleAutoloadContainer.style.marginRight = '30px';
toggleAutoloadContainer.appendChild(toggleAutoload);
toggleAutoloadContainer.appendChild(toggleAutoloadLabel);

toggleAutoload.addEventListener('change', function() {
  GM_setValue(OPTION_AUTOLOAD, this.checked);
});

var onSizeChanged = function() {
  if (this.checked) {
    GM_setValue(OPTION_SIZE, this.value);
    loadedimgs.forEach(function(img) {
      img.style.width = this.value;
      img.style.height = this.value;
    }.bind(this));
  }
};

var curSizeSetting = GM_getValue(OPTION_SIZE, DEFAULT_SIZE);
var sizeSmall = document.createElement('input');
sizeSmall.setAttribute('type', 'radio');
sizeSmall.name = 'supporters-you-follow-size';
sizeSmall.value = SMALL_SIZE;
sizeSmall.id = 'supporters-you-follow-size-small';
sizeSmall.style.marginLeft = '10px';
sizeSmall.checked = curSizeSetting == SMALL_SIZE;
sizeSmall.addEventListener('change', onSizeChanged);
var sizeSmallLabel = document.createElement('label');
sizeSmallLabel.setAttribute('for', 'supporters-you-follow-size-small');
sizeSmallLabel.textContent = 'small';
sizeSmallLabel.style.marginRight = '10px';
sizeSmallLabel.style.fontWeight = 'bold';
var sizeLarge = document.createElement('input');
sizeLarge.setAttribute('type', 'radio');
sizeLarge.name = 'supporters-you-follow-size';
sizeLarge.value = LARGE_SIZE;
sizeLarge.id = 'supporters-you-follow-size-large';
sizeLarge.checked = curSizeSetting == LARGE_SIZE;
sizeLarge.addEventListener('change', onSizeChanged);
var sizeLargeLabel = document.createElement('label');
sizeLargeLabel.setAttribute('for', 'supporters-you-follow-size-large');
sizeLargeLabel.textContent = 'large';
sizeLargeLabel.style.fontWeight = 'bold';
var sizeContainer = document.createElement('div');
sizeContainer.style.display = 'inline-block';
sizeContainer.appendChild(sizeSmall);
sizeContainer.appendChild(sizeSmallLabel);
sizeContainer.appendChild(sizeLarge);
sizeContainer.appendChild(sizeLargeLabel);

optionsMenu.appendChild(toggleAutoloadContainer);
optionsMenu.appendChild(document.createTextNode("thumb size: "));
optionsMenu.appendChild(sizeContainer);
optionsMenu.appendChild(document.createElement('hr'));

var optionsLink = document.createElement('a');
optionsLink.textContent = 'options';
optionsLink.style.float = 'right';
collectedByContainer.insertBefore(optionsLink, existingMessage);
optionsLink.addEventListener('click', function() {
  var wasHidden = optionsMenu.style.display == 'none';
  optionsMenu.style.display = wasHidden ? 'block' : 'none';
  optionsLink.style.fontWeight = wasHidden ? 'bold' : 'normal';
});

var message = existingMessage.cloneNode(true);
message.textContent = 'supporters you follow';
collectedByContainer.insertBefore(message, existingMessage);
collectedByContainer.insertBefore(optionsMenu, existingMessage);

var existingDeets = collectedByContainer.querySelector('.deets');
var deets = document.createElement('div');
deets.style.marginBottom = '16px';
deets.style.marginTop = '10px';
deets.style.lineHeight = '0';
var statusElement = document.createElement('div');
statusElement.style.lineHeight = '100%';
statusElement.style.opacity = '0.5';
statusElement.textContent = 'loading';
statusElement.style.display = 'none';
deets.appendChild(statusElement);
collectedByContainer.insertBefore(deets, existingMessage);

var makeThumb = function(fan) {
  var a = document.createElement('a');
  a.href = fan.url;
  a.title = fan.name;
  a.style.margin = '0 7px 7px 0px';
  a.style.display = 'inline-block';
  var img = document.createElement('img');
  img.src = "https://f4.bcbits.com/img/" + fan.image_id.toString().padStart(10, '0') + "_42.jpg";
  img.setAttribute('alt', fan.name + " thumbnail");
  img.style.display = 'block';
  var size = GM_getValue("size", DEFAULT_SIZE);
  img.style.width = size;
  img.style.height = size;
  a.appendChild(img);
  loadedimgs.push(img);
  return a;
};

var handleSupporter = function(supporter) {
  if (this[supporter.fan_id]) {
    if (statusElement.parentNode) {
      deets.removeChild(statusElement);
    }
    deets.appendChild(makeThumb(supporter));
  }
};

var onEnd = function() {
  if (loadedimgs.length === 0) {
    statusElement.textContent = 'none found';
  } else if (statusElement.parentNode) {
    deets.removeChild(statusElement);
  }
};

var onError = function(err) {
  statusElement.textContent = err;
};

var getNext = function(tralbum_type, tralbum_id, token, lookup) {
  var data;
  if (token !== undefined) {
    data = '{"tralbum_type":"'+tralbum_type+'","tralbum_id":'+tralbum_id+',"token":"'+token+'","count":80}';
  } else {
    data = '{"tralbum_type":"'+tralbum_type+'","tralbum_id":'+tralbum_id+',"count":80}';
  }
  var url = (new URL("/api/tralbumcollectors/2/thumbs", document.location)).href;
  post(url, data, function(status, res, url) {
    if (status != 200) {
      console.warn("failed to get more supporters", status, res, url);
      onError("unexpected http status: " + status);
      return;
    }
    var parsed = JSON.parse(res);
    if (parsed.error) {
      console.warn("error when getting more supporters", parsed.error_message, parsed);
      onError(parsed.error_message);
      return;
    }
    parsed.results.forEach(handleSupporter.bind(lookup));
    if (parsed.more_available) {
      var lastToken = parsed.results[parsed.results.length - 1].token;
      getNext(tralbum_type, tralbum_id, lastToken, lookup);
    } else {
      onEnd();
    }
  });
};

var onSummary = function(err, summary) {
  if (err) {
    onError(err);
    return;
  }
  var collectorsData = JSON.parse(document.querySelector('#collectors-data').getAttribute('data-blob'));
  var supporters = collectorsData.thumbs;
  var lookup = summary.follows.following;

  var pageData = JSON.parse(document.querySelector('#pagedata').getAttribute('data-blob'));
  var tralbum = pageData.fan_tralbum_data;
  // collectorsData.thumbs has only minimal data now, so we have to re-get the first page using no token
  getNext(tralbum.tralbum_type, tralbum.tralbum_id, undefined, lookup);
};

var go = function() {
  statusElement.style.display = 'block';
  var url = (new URL("/api/fan/2/collection_summary", document.location)).href;
  get(url, function(status, res, url) {
    if (status != 200) {
      onSummary("unexpected http status code: " + status);
      return;
    }
    var parsedRes = JSON.parse(res);
    onSummary(parsedRes.error_message, parsedRes.collection_summary);
  });
};

get = function(url, cb) {
  var opts = {
    method: 'GET',
    url: url,
    onload: function (res) {
      cb(res.status, res.responseText, res.finalUrl || url);
    }
  };
  GM_xmlhttpRequest(opts);
};

post = function(url, data, cb) {
  var opts = {
    method: 'POST',
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
    },
    onload: function (res) {
      cb(res.status, res.responseText, res.finalUrl || url);
    }
  };
  GM_xmlhttpRequest(opts);
};

if (GM_getValue("autoload", false)) {
  go();
} else {
  var loadLink = document.createElement('a');
  loadLink.textContent = 'load...';
  loadLink.style.lineHeight = '100%';
  var handleAutoloadChecked;
  var load = function() {
    go();
    deets.removeChild(loadLink);
    toggleAutoload.removeEventListener('change', handleAutoloadChecked);
  };
  loadLink.addEventListener('click', function(e) {
    load();
    e.preventDefault();
    e.stopImmediatePropagation();
  }, true);
  deets.appendChild(loadLink);

  handleAutoloadChecked = function() {
    if(this.checked && loadLink.parentNode) {
      load();
    }
  };
  toggleAutoload.addEventListener('change', handleAutoloadChecked);
}
