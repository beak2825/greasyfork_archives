// ==UserScript==
// @name Bandcamp Collection Filters
// @version 1.0.5
// @description List items in a collection or wishlist that match certain filters (free, in common, etc)
// @namespace 289690-squeek502
// @license 0BSD
// @match http*://bandcamp.com/*
// @include http*://bandcamp.com/*
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/391461/Bandcamp%20Collection%20Filters.user.js
// @updateURL https://update.greasyfork.org/scripts/391461/Bandcamp%20Collection%20Filters.meta.js
// ==/UserScript==

if (!document.querySelector('#collection-grid') || !document.querySelector('#wishlist-grid'))
  return;

var collectionSummary;
var pageData;
var isOwner = document.querySelector('#fan-banner').classList.contains('owner');
var LOAD_URL_FORMAT = "https://bandcamp.com/api/fancollection/1/{}_items";

var pageTypes = ['collection', 'wishlist'];
var buttonTypes = ['free', 'purchased', 'wishlisted'];

var inCommonSeparator = document.createElement('span');
inCommonSeparator.style.color = '#828282';
inCommonSeparator.style.marginRight = '16px';
inCommonSeparator.textContent = 'in common:';
var separatorsAfter = {'free': inCommonSeparator};

var buttons = {};
var results = {};
var started = {};

pageTypes.forEach(function(type) {
  buttons[type] = {};
  results[type] = {};

  var buttonContainer = document.createElement('div');
  buttonContainer.style.marginTop = '0px';
  buttonContainer.classList.add('wishlist-controls');
  buttonContainer.classList.add('owner-controls');

  var grid = document.querySelector('#'+type+'-grid');
  var itemsContainer = grid.querySelector('#'+type+'-items-container') || grid.querySelector(':scope > .inner');
  // not all collection pages always have both a collection and a wishlist, so bail if this fails
  if (!itemsContainer) {
    return;
  }
  var items = itemsContainer.querySelector('#'+type+'-items');

  var resultContainer = document.createElement('div');

  buttonTypes.forEach(function(button) {
    var buttonElement = document.createElement('a');
    buttonElement.style.marginRight = '16px';
    buttonElement.innerHTML = button;
    buttonContainer.appendChild(buttonElement);

    var list = document.createElement('ul');
    list.style.display = 'none';
    resultContainer.appendChild(list);

    buttons[type][button] = buttonElement;
    results[type][button] = list;

    if (separatorsAfter[button]) {
      buttonContainer.appendChild(separatorsAfter[button].cloneNode(true));
    }
  });

  itemsContainer.insertBefore(buttonContainer, items);
  itemsContainer.insertBefore(resultContainer, items);
});

var onSummaryError = function(errmsg) {
  pageTypes.forEach(function(type) {
    buttonTypes.forEach(function(button) {
      // free doesn't depend on summary
      if (button == 'free') return;
      results[type][button].innerHTML = errmsg;
    });
  });
};

var handleItems = function(items, type) {
  items.forEach(function(item) {
    var isFree = item.price === 0;
    var lookupKey = item.tralbum_type + "" + item.tralbum_id;
    var tralbum = collectionSummary && collectionSummary.tralbum_lookup[lookupKey];
    var isPurchased = tralbum !== undefined && tralbum.purchased !== undefined && tralbum.purchased;
    var isWishlisted = tralbum !== undefined && !tralbum.purchased;
    if (!(isFree || isPurchased || isWishlisted))
      return;

    var li = document.createElement('li');
    var a = document.createElement('a');
    a.href = item.item_url;
    a.textContent = item.band_name + ' - ' + item.item_title;
    li.appendChild(a);

    if (isFree) {
      results[type].free.appendChild(li.cloneNode(true));
    }
    if (isPurchased) {
      results[type].purchased.appendChild(li.cloneNode(true));
    }
    if (isWishlisted) {
      results[type].wishlisted.appendChild(li.cloneNode(true));
    }
  });
  buttonTypes.forEach(function(button) {
     buttons[type][button].textContent = button + " (" + results[type][button].childElementCount + ")";
  });
};

var get = function(url, cb) {
  var opts = {
    method: 'GET',
    url: url,
    onload: function (res) {
      cb(res.status, res.responseText, res.finalUrl || url);
    }
  };
  GM_xmlhttpRequest(opts);
};

var post = function(url, data, cb) {
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

var getNext = function(fan_id, older_than_token, type) {
  var url = LOAD_URL_FORMAT.replace('{}', type);
  post(url, '{"fan_id":'+fan_id+',"older_than_token":"'+older_than_token+'","count":40}', function(status, res, url) {
    if (status != 200) {
      console.error("failed to get next " + type, status, res, url);
      return;
    }
    var parsed = JSON.parse(res);
    if (parsed.error) {
      console.error("error when getting next " + type, parsed.error_message, parsed);
      return;
    }
    handleItems(parsed.items, type);
    if (parsed.more_available) {
      // we should be able to use parsed.last_token here, but there is currently a bug
      // in the collection_items endpoint in that it always gives the 20th item's token
      // in last_token even if count is different than 20, so we need to get the actual
      // last item's token
      var last_token = parsed.items[parsed.items.length - 1].token;
      getNext(fan_id, last_token, type);
    }
  });
};

var setState = function(type, button, state) {
  if (state) {
    // hide all of the same type
    buttonTypes.forEach(function(other) {
      if (other == button) return;
      setState(type, other, false);
    });
    results[type][button].style.display = 'block';
    buttons[type][button].style.fontWeight = 'bold';
    buttons[type][button].style.textDecoration = 'underline';
  } else {
    results[type][button].style.display = 'none';
    buttons[type][button].style.fontWeight = 'normal';
    buttons[type][button].style.textDecoration = 'none';
  }
};

var getState = function(type, button) {
  return results[type][button].style.display != 'none';
};

var onclick = function(type, button, e) {
  if (!started[type]) {
    if (!pageData) {
      pageData = JSON.parse(document.querySelector('#pagedata').getAttribute('data-blob'));
    }
    var start = function() {
      var now = Math.floor(Date.now()/1000);
      var nowToken = pageData[type+'_data'].last_token.replace(/^\d+/, now);
      getNext(pageData.fan_data.fan_id, nowToken, type);
    };
    if (!collectionSummary) {
      get('https://bandcamp.com/api/fan/2/collection_summary', function(status, res, url) {
        if (status != 200) {
          console.warn("unexpected response from " + url, status, res);
          onSummaryError("unexpected http status code: " + status);
        }
        var parsedRes = JSON.parse(res);
        if (parsedRes.error) {
          onSummaryError(parsedRes.error_message);
        } else {
          collectionSummary = parsedRes.collection_summary;
        }
        start();
      });
    } else {
      start();
    }
    setState(type, button, true);
    started[type] = true;
  } else {
    setState(type, button, !getState(type, button));
  }
};
pageTypes.forEach(function(type) {
  buttonTypes.forEach(function(button) {
    buttons[type][button].addEventListener("click", onclick.bind(null, type, button));
  });
});
