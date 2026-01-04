// ==UserScript==
// @name         NudeVista Middle Click Search v.2
// @namespace    https://greasyfork.org/fr/users/7434-janvier56
// @version      2.0.0
// @description  Middle clicking the search on Nudevista serach icon opens the results in a new tab. (fork of "Youtube Middle Click Search" by Adrien Pyke ) and copy of its orginal "waitForElems" library
// @author       janvier57
// @author       Adrien Pyke / janvier57
// @include      https://www.nudevista.com/*
// @license      unlicense
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/439323/NudeVista%20Middle%20Click%20Search%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/439323/NudeVista%20Middle%20Click%20Search%20v2.meta.js
// ==/UserScript==

/**
The old require is INVALID (server error 500)    https://gitcdn.link/repo/fuzetsu/userscripts/b38eabf72c20fa3cf7da84ecd2cefe0d4a2116be/wait-for-elements/wait-for-elements.js
 * @param obj - {
 *  sel: 'a',                    // the selector you want to wait for (optional)
 *  context: document.body,      // scope of search for selector or mutations (optional, default document.body)
 *  stop: true,                  // stop waiting after first result (optional, default false)
 *  mode: 'M',                   // M to use mutation observer, S to use setInterval (optional, default M)
 *  onchange: func,              // if using mode 'M' this function will be called whenever mutation handler triggers
 *  onmatch: func,               // if selector is specified function will be called for each match with element as parameter
 *  config: { attributes: true } // if using mode 'M' this object will override settings passed to mutation observer
 * }
 */
function waitForElems(obj) {
  var tick;
  var id = 'fke' + Math.floor(Math.random() * 12345);
  var type = window.MutationObserver ? (obj.mode || 'M') : 'S';
  var lastMutation = Date.now();
  var lastCall = Date.now();
  var context = obj.context;
  var sel = obj.sel;
  var config = obj.config || {
    subtree: true,
    childList: true
  };
  var onChange = obj.onchange;
  var queuedCall;
  var domLoaded = document && document.readyState !== 'loading';

  function throttle(func) {
    var now = Date.now();
    clearTimeout(queuedCall);
    // less than 100ms since last mutation
    if (now - lastMutation < 100) {
      // 500ms or more since last query
      if (now - lastCall >= 500) {
        func();
      } else {
        queuedCall = setTimeout(func, 100);
      }
    } else {
      func();
    }
    lastMutation = now;
  }

  function findElem(sel) {
    lastCall = Date.now();
    var found = [].filter.call(context.querySelectorAll(sel), function(elem) {
      return elem.dataset[id] !== 'y';
    });
    if (found.length > 0) {
      if (obj.stop) {
        type === 'M' ? tick.disconnect() : clearInterval(tick);
      }
      found.forEach(function(elem) {
        elem.dataset[id] = 'y';
        obj.onmatch(elem);
      });
    }
  }

  function connect() {
    context = context || document.body;
    if (type === 'M') {
      tick = new MutationObserver(function() {
        if (sel) throttle.call(null, findElem.bind(null, sel));
        if (onChange) onChange.apply(this, arguments);
      });
      tick.observe(context, config);
    } else {
      tick = setInterval(findElem.bind(null, sel), 300);
    }
    if (sel) findElem(sel);
  }

  if(domLoaded) {
    connect();
  } else {
    window.addEventListener('DOMContentLoaded', connect);
  }

  return {
    type: type,
    stop: function() {
      if (type === 'M') {
        tick.disconnect();
      } else {
        clearInterval(tick);
      }
    },
    resume: connect
  };
}
/**
 * @param regex - should match the site you're waiting for
 * @param action - the callback that will be executed when a matching url is visited
 * @param stopLooking - if true the function will stop waiting for another url match after the first match
 */
function waitForUrl(regex, action, stopLooking) {
  function checkUrl(urlTest) {
    var url = window.location.href;
    if (url !== lastUrl && urlTest(url)) {
      if (stopLooking) {
        clearInterval(tick);
      }
      lastUrl = url;
      action();
    }
    lastUrl = url;
  }
  var urlTest = (typeof regex === 'function' ? regex : regex.test.bind(regex)),
    tick = setInterval(checkUrl.bind(null, urlTest), 300),
    lastUrl;
  checkUrl(urlTest);
  return tick;
}


// YOUR OWN CODE
(function () {
  'use strict';

  const SCRIPT_NAME = 'YMCS';

  const Util = {
    log(...args) {
      args.unshift(`%c${SCRIPT_NAME}:`, 'font-weight: bold;color: #233c7b;');
      console.log(...args);
    },
    q(query, context = document) {
      return context.querySelector(query);
    },
    qq(query, context = document) {
      return Array.from(context.querySelectorAll(query));
    },
    getQueryParameter(name, url = window.location.href) {
      name = name.replace(/[[\]]/gu, '\\$&');
      const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`, 'u'),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/gu, ' '));
    },
    encodeURIWithPlus(string) {
      return encodeURIComponent(string).replace(/%20/gu, '+');
    }
  };

  waitForElems({
// XHAM SEARCH BUTTON   sel: '#search-icon-legacy',
//Nudevita
    sel: 'input#s.header__search-button',
    stop: true,
    onmatch(btn) {
      btn.onmousedown = function (e) {
        if (e.button === 1) {
          e.preventDefault();
        }
      };
      btn.onclick = function (e) {
        e.preventDefault();
        e.stopImmediatePropagation();

//  XHAM INPUT SEARCH      const input = Util.q('input#search').value.trim();
//Nudevita
        const input = Util.q('#q.header__search-input').value.trim();
        if (!input) return false;

//       const url = `${location.origin}/results?search_query=${Util.encodeURIWithPlus(input)}`;
// XHAM - const url = `${location.origin}/search/${Util.encodeURIWithPlus(input)}`;
//NUDEVISTA
        const url = `${location.origin}/?q=${Util.encodeURIWithPlus(input)}`;
        if (e.button === 1) {
          GM_openInTab(url, true);
        } else if (e.button === 0) {
          window.location.href = url;
        }

        return false;
      };
      btn.onauxclick = btn.onclick;
    }
  });

  waitForElems({
    sel: '.sbsb_c',
    onmatch(result) {
      result.onclick = function (e) {
        if (!e.target.classList.contains('sbsb_i')) {
          const search = Util.q('.sbpqs_a, .sbqs_c', result).textContent;

          const url = `${location.origin}/search/${Util.encodeURIWithPlus(search)}`;
          if (e.button === 1) {
            GM_openInTab(url, true);
          } else if (e.button === 0) {
            window.location.href = url;
          }
        } else if (e.button === 1) {
          // prevent opening in new tab if they middle click the remove button
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      };
      result.onauxclick = result.onclick;
    }
  });
})();
