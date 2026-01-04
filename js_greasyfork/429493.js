// ==UserScript==
// @namespace          https://greasyfork.org/en/users/794317-colar
// @name               Google Direct Links for Pages and Images
// @name:fr            Google Liens Directs vers Pages et Images
// @name:zh-CN         Google 直链搜索结果网页及图片
// @name:zh-TW         Google 直鏈搜尋結果網頁及圖片
// @description        direct links to web pages and images from Google result.
// @description:fr     liens directs vers les pages web et les images des résultats Google.
// @description:zh-CN  令 Google 直接链接至搜索结果网页以及图片，跳过重定向及图片预览。
// @description:zh-TW  令 Google 直接鏈接至搜尋結果網頁以及圖片，跳過重定向及圖片預覽。
// @homepageURL        https://greasyfork.org/scripts/429493
// @license            GNU GPL-3
// @author             Colar & VA
// @version            1.1.20210716
// @grant              GM.getValue
// @grant              GM.setValue
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              unsafeWindow
// @include            /^https?://(?:www|encrypted|ipv[46])\.google\.[^/]+/(?:$|[#?]|search|webhp|imgres)/
// @match              https://news.google.com/*
// @match              https://cse.google.com/cse/*
// @run-at             document-start
// @icon               data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/429493/Google%20Direct%20Links%20for%20Pages%20and%20Images.user.js
// @updateURL https://update.greasyfork.org/scripts/429493/Google%20Direct%20Links%20for%20Pages%20and%20Images.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function () {
  var style = document.createElement('style');
  style.textContent = 'a.x_source_link {' + [
    'line-height: 1.0', // increment the number for a taller thumbnail info-bar
    'text-decoration: none !important',
    'color: inherit !important',
    'display: block !important'
  ].join(';') + '}';
  document.head.appendChild(style);
}, true);

var M = (typeof GM !== 'undefined') ? GM : {
  getValue: function (name, alt) {
    var value = GM_getValue(name, alt);
    return { then: function (callback) { callback(value); } };
  },
  setValue: function (name, value) {
    GM_setValue(name, value);
    return { then: function (callback) { callback(); } };
  }
};

function getOption() {
  var opt_noopen = false;
  // For example: open https://ipv4.google.com/#x-option:open-inplace
  switch (location.hash) {
    // Open links in the current tab.
    case '#x-option:open-inplace': opt_noopen = true; break;
    // Do not ...
    case '#x-option:no-open-inplace': opt_noopen = false; break;
    default: return M.getValue('opt_noopen', opt_noopen);
  }
  M.setValue('opt_noopen', opt_noopen);
  return { then: function (callback) { callback(opt_noopen); } };
}

function unsafeEval(func, opt) {
  let body = 'return (' + func + ').apply(this, arguments)';
  unsafeWindow.Function(body).call(unsafeWindow, opt);
}

getOption().then(function run(opt_noopen) {
unsafeEval(function (opt_noopen) {

var debug = false;
var count = 0;

var options = {noopen: opt_noopen};
debug && console.log('Options:', options);

// web pages: url?url=
// images: imgres?imgurl=
// custom search engine: url?q=
// malware: interstitial?url=
var re = /\b(url|imgres)\?.*?\b(?:url|imgurl|q)=(https?\b[^&#]+)/i;
var restore = function (link, url) {
  var oldUrl = link.getAttribute('href') || '';
  var newUrl = url || oldUrl;
  var matches = newUrl.match(re);
  if (matches) {
    debug && console.log('restoring', link._x_id, newUrl);
    link.setAttribute('href', decodeURIComponent(matches[2]));
    enhanceLink(link);
    if (matches[1] === 'imgres') {
      if (link.querySelector('img[src^="data:"]')) {
        link._x_href = newUrl;
      }
      enhanceThumbnail(link, newUrl);
    }
  } else if (url != null) {
    link.setAttribute('href', newUrl);
  }
};

var purifyLink = function (a) {
  if (/\brwt\(/.test(a.getAttribute('onmousedown'))) {
    a.removeAttribute('onmousedown');
  }
  if (a.parentElement &&
      /\bclick\b/.test(a.parentElement.getAttribute('jsaction') || '')) {
    a.addEventListener('click', function (e) {
      e.stopImmediatePropagation();
      e.stopPropagation();
    }, true);
  }
};

var enhanceLink = function (a) {
  purifyLink(a);
  a.setAttribute('rel', 'noreferrer');
  a.setAttribute('referrerpolicy', 'no-referrer');
  if (options.noopen) {
    a.setAttribute('target', '_self');
    a.addEventListener('click', function (event) {
      event.stopImmediatePropagation();
      event.stopPropagation();
    }, true);
  }
};

var enhanceThumbnail = function (link, url) {
  // make thumbnail info-bar clickable
  var infos = [].slice.call(link.querySelectorAll('img~div'));
  if (infos.length > 0) {
    var pageUrl = decodeURIComponent(url.match(/[?&]imgrefurl=([^&#]+)/)[1]);
    infos.forEach(function (info) {
      var pagelink = document.createElement('a');
      enhanceLink(pagelink);
      pagelink.href = pageUrl;
      pagelink.className = 'x_source_link';
      pagelink.textContent = info.textContent;
      info.textContent = '';
      info.appendChild(pagelink);
    });
  }
};

var fakeLink = document.createElement('a');
var normalizeUrl = function (url) {
  fakeLink.href = url;
  return fakeLink.href;
};

var setter = function (v) {
  v = String(v); // in case an object is passed by clever Google
  debug && console.log('State:', document.readyState);
  debug && console.log('set', this._x_id, this.getAttribute('href'), v);
  restore(this, v);
};
var getter = function () {
  debug && console.log('get', this._x_id, this.getAttribute('href'));
  return normalizeUrl(this._x_href || this.getAttribute('href'));
};
var blocker = function (event) {
  event.stopPropagation();
  restore(this);
  debug && console.log('block', this._x_id, this.getAttribute('href'));
};

var handler = function (a) {
  if (a._x_id) {
    restore(a);
    return;
  }
  a._x_id = ++count;
  debug && a.setAttribute('x-id', a._x_id);
  if (Object.defineProperty) {
    debug && console.log('define property', a._x_id);
    Object.defineProperty(a, 'href', {get: getter, set: setter});
  } else if (a.__defineSetter__) {
    debug && console.log('define getter', a._x_id);
    a.__defineSetter__('href', setter);
    a.__defineGetter__('href', getter);
  } else {
    debug && console.log('define listener', a._x_id);
    a.onmouseenter = a.onmousemove = a.onmouseup = a.onmousedown =
      a.ondbclick = a.onclick = a.oncontextmenu = blocker;
  }
  if (/^_(?:blank|self)$/.test(a.getAttribute('target')) ||
      /\brwt\(/.test(a.getAttribute('onmousedown')) ||
      /\bmouse/.test(a.getAttribute('jsaction')) ||
      /\bclick\b/.test(a.parentElement.getAttribute('jsaction'))) {
    enhanceLink(a);
  }
  restore(a);
};

var checkNewNodes = function (mutations) {
  debug && console.log('State:', document.readyState);
  if (mutations.target) {
    checkAttribute(mutations);
  } else {
    mutations.forEach && mutations.forEach(checkAttribute);
  }
};
var checkAttribute = function (mutation) {
  var target = mutation.target;
  if (target && target.nodeName.toUpperCase() === 'A') {
    if ((mutation.attributeName || mutation.attrName) === 'href') {
      debug && console.log('restore attribute', target._x_id, target.getAttribute('href'));
    }
    handler(target);
  } else if (target instanceof Element) {
    [].slice.call(target.querySelectorAll('a')).forEach(handler);
  }
};

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

if (MutationObserver) {
  debug && console.log('MutationObserver: true');
  new MutationObserver(checkNewNodes).observe(document.documentElement, {
    childList: true,
    attributes: true,
    attributeFilter: ['href'],
    subtree: true
  });
} else {
  debug && console.log('MutationEvent: true');
  document.addEventListener('DOMAttrModified', checkAttribute, false);
  document.addEventListener('DOMNodeInserted', checkNewNodes, false);
}

}, opt_noopen);
});
