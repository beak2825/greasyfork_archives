// ==UserScript==
// @name            Better.Caoliu
// @version         3.0.1
// @namespace       me.opengg
// @description     This script removes redirection and ads of Caoliu.
// @license         GPL-3.0-or-later
// @supportURL      https://github.com/OpenGG/Better.Caoliu/issues
// @grant           none
// @run-at          document-start
// t66y:
// @match           http://t66y.com/htm_data/*
// @match           http://www.t66y.com/htm_data/*
// @downloadURL https://update.greasyfork.org/scripts/42382/BetterCaoliu.user.js
// @updateURL https://update.greasyfork.org/scripts/42382/BetterCaoliu.meta.js
// ==/UserScript==

(function () {
'use strict';

var toArray = function toArray(input) {
  return Array.prototype.slice.call(input);
};

var querySelectorAll = function querySelectorAll(selector) {
  return toArray(document.querySelectorAll(selector));
};



var parseQuery = function parseQuery(query) {
  var ret = Object.create(null);
  query.split('&').forEach(function (part) {
    var pair = part.split('=');
    var decodedKey = decodeURIComponent(pair[0]);
    ret[decodedKey] = pair.length > 1 ? decodeURIComponent(pair[1]) : '';
  });
  return ret;
};

var tmp = null;

var parseUrl = function parseUrl(url) {
  if (!tmp) {
    tmp = document.createElement('a');
  }

  tmp.href = url;

  return tmp;
};

var hasOwnPropertyInternal = Object.prototype.hasOwnProperty;

var hasOwnProperty = function hasOwnProperty(obj, key) {
  return hasOwnPropertyInternal.call(obj, key);
};

var isReady = function isReady() {
  var _document = document,
      readyState = _document.readyState;


  return readyState === 'interactive' || readyState === 'complete';
};

var ready = function ready(fn) {
  if (isReady()) {
    fn();
  } else {
    var called = false;
    var listener = function listener() {
      if (called) {
        return;
      }
      if (isReady()) {
        called = true;
        document.removeEventListener('readystatechange', listener, false);
        fn();
      }
    };
    document.addEventListener('readystatechange', listener, false);
  }
};

var removeUnderscores = function removeUnderscores(url) {
  return url.replace(/______/g, '.');
};

var parseJump = function parseJump(url) {
  var _parseUrl = parseUrl(url),
      hostname = _parseUrl.hostname,
      search = _parseUrl.search;

  if (hostname !== 'www.viidii.info') {
    return null;
  }

  var simple = /^\?https?:\/\//.test(search);

  if (simple) {
    return removeUnderscores(search.slice(1));
  }

  var query = parseQuery(search.slice(1));

  return query.url;
};

var isAllowLink = function isAllowLink(url, allowLinks) {
  var jump = parseJump(url);
  if (!jump) {
    return true;
  }
  for (var i = 0; i < allowLinks.length; ++i) {
    var allowLink = allowLinks[i];
    if (jump.indexOf(allowLink) !== -1) {
      return true;
    }
  }

  return false;
};

var hide = function hide(el) {
  // eslint-disable-next-line no-param-reassign
  el.style.display = 'none';
};

var findContainer = function findContainer(el) {
  var curr = el;
  while (curr.parentNode.childNodes.length === 1) {
    curr = curr.parentNode;
  }
  return curr;
};

var shouldHideBr = function shouldHideBr(br) {
  var nextSibling = br.nextSibling;


  if (nextSibling && nextSibling.tagName) {
    if (nextSibling.tagName.toLowerCase() === 'br') {
      return true;
    }

    if (nextSibling.style.display === 'none') {
      return true;
    }
  }

  return false;
};

var wrapImage = function wrapImage(img, link) {
  var el = document.createElement('a');
  el.href = link;
  el.referrerPolicy = 'no-referrer';
  el.target = '_blank';

  var parentNode = img.parentNode,
      nextSibling = img.nextSibling;


  el.appendChild(img);

  parentNode.insertBefore(el, nextSibling);
};

var parseOnClick = function parseOnClick(img, onClick) {
  if (!/^window\.open\(/.test(onClick)) {
    return null;
  }

  var matches = onClick.match(/https?:\/\/[^'"]+/);

  if (!matches) {
    return null;
  }

  return matches[0];
};

var allowLinks = ['rmdown.com', '88files.net', 'pan.com'];

var imgRules = {
  'imagetwist.com': ['/th/', '/i/'],
  'img599.net': ['.th.', '.'],
  'img588.net': ['.th.', '.']
};

var getImageRect = function getImageRect(url) {
  return new Promise(function (resolve) {
    var img = new Image();
    img.onerror = function () {
      return resolve([0, 0]);
    };

    img.onload = function () {
      return resolve([img.naturalWidth, img.naturalHeight]);
    };

    img.src = url;
  });
};

var detectImgUrl = function detectImgUrl(url) {
  var _parseUrl = parseUrl(url),
      hostname = _parseUrl.hostname;

  var matches = hostname.match(/[^.]+\.[^.]+$/);

  if (!matches) {
    return null;
  }

  var top = matches[0];

  if (!hasOwnProperty(imgRules, top)) {
    return null;
  }

  var _imgRules$top = imgRules[top],
      find = _imgRules$top[0],
      replacement = _imgRules$top[1];

  var transformed = url.replace(find, replacement);
  var jpeg = transformed.replace('.jpg', '.jpeg');

  var promises = [getImageRect(transformed)];

  promises.push(jpeg !== transformed ? getImageRect(jpeg) : [0, 0]);

  var limit = 200 * 200;

  return Promise.all(promises).then(function (_ref) {
    var _ref$ = _ref[0],
        w = _ref$[0],
        h = _ref$[1],
        _ref$2 = _ref[1],
        wJ = _ref$2[0],
        hJ = _ref$2[1];

    var size = w * h;
    var sizeJ = wJ * hJ;
    if (sizeJ > size && sizeJ > limit) {
      return jpeg;
    } else if (size > limit) {
      return transformed;
    }
    return null;
  });
};

var init = function init() {
  // hide non-allow links
  querySelectorAll('.tpc_content a').forEach(function (a) {
    var attr = a.getAttribute('onclick');
    if (attr && attr.indexOf('iframe')) {
      hide(a);
      return;
    }

    var allow = a.querySelector('img') || isAllowLink(a.href, allowLinks);

    if (!allow) {
      var container = findContainer(a);
      hide(container);
    } else {
      // do nothing
    }
  });

  // hide gif images
  querySelectorAll('.tpc_content iframe').forEach(hide);

  // hide gif images
  querySelectorAll('.tpc_content img').forEach(function (image) {
    var isGif = image.src.indexOf('.gif') !== -1;
    if (isGif) {
      hide(image);
    }
  });

  // hide unnecessary <br>
  querySelectorAll('.tpc_content br').forEach(function (br) {
    if (shouldHideBr(br)) {
      hide(br);
    }
  });

  // rewrite img
  querySelectorAll('.tpc_content img').forEach(function (img) {
    var url = parseOnClick(img, img.getAttribute('onclick'));

    if (img.style.display === 'none') {
      return;
    }

    if (!url) {
      return;
    }

    img.removeAttribute('onclick');

    // eslint-disable-next-line no-param-reassign
    img.onclick = null;

    wrapImage(img, url);
  });

  // rewrite links
  querySelectorAll('.tpc_content a').forEach(function (a) {
    // eslint-disable-next-line no-param-reassign
    a.referrerPolicy = 'no-referrer';

    var url = parseJump(a.href);

    if (url) {
      // eslint-disable-next-line no-param-reassign
      a.href = url;
    }
  });

  querySelectorAll('.tpc_content a>img').forEach(function (img) {
    return Promise.resolve(detectImgUrl(img.src)).then(function (url) {
      if (url) {
        // eslint-disable-next-line no-param-reassign
        img.parentNode.href = url;
      }
    });
  });
};

ready(init);

}());
