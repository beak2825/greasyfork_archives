// ==UserScript==
// @name          Auto Scroll Mouse [fork]
// @namespace     http://www.marcbelmont.com
// @description   No mousewheel?  No problem!  This script will scroll the page if you place your mouse near the top or bottom of the window and wiggle it.
// @version       2.1.10
// @license       ISC
// @include       http://*/*
// @include       https://*/*
// @grant         GM_addStyle
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/41044/Auto%20Scroll%20Mouse%20%5Bfork%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/41044/Auto%20Scroll%20Mouse%20%5Bfork%5D.meta.js
// ==/UserScript==

// Originally "Auto Scroll!" by Marc Belmont on userscripts.org
// Tweaked by joeytwiddle

// TODO: Do not scroll after/during a mousedown (so it won't interfere when dragging/selecting)
// BUG: Does not trigger when mouse is over an iframe (window does not receive the mousemove event)
//      We could solve this by listening for mousemove events on the region divs instead of on the document.
//      But that could be more disruptive, as it prevents events from reaching the window like they normally would.

//////////////////////
// Constants        //
//////////////////////

// Which key should be held to enable scrolling.  Possible values are 0 | 1
// Enable more than one to require a combination be held.
var ONLY_WHEN_HOLDING_SHIFT = 0;
var ONLY_WHEN_HOLDING_CTRL = 0;
var ONLY_WHEN_HOLDING_ALT = 0;

var NOSCROLL_PERCENT = 80; // Area in the middle of the page where there won't be scrolling
var SCROLLSTEP = 5; // Scrolling speed
var ONLYLEFTRIGHT = 1; // Scrolling will happen only when you move left or right in the top or bottom areas. Possible values are 0 | 1
var ONLYLEFTRIGHT_MOUSESPEED = 1.5; // Acceleration
var ONLYLEFTRIGHT_DONTSCROLL = 100; // if no event for too long, no scrolling
var DELAY_TIME = 5; // This tries to reduce the number of scroll operations, to reduce load on the browser
var SHOW_ACTIVE_REGION = 1;

//////////////////////
// Some Code        //
//////////////////////

var _mX = 0;
var _mXOld = 0;
var _mYOld = 0;
var _mY = 0;
var _go = 0;
var _mNow = new Date();
var _mThen = new Date();

// 2. scroll the window
function ScrollWindow() {
  // don't scroll if we're in the middle of the page
  var end = ((_mY - window.pageYOffset) - window.innerHeight/2);
  if (Math.abs(end) < window.innerHeight*NOSCROLL_PERCENT/200) {
    regionUI.hideRegions();
    return;
  }
  /* var down = (_mY - window.pageYOffset) / window.innerHeight;
  if (Math.abs(down - 0.5)*2 < NOSCROLL_PERCENT/100) {
    return;
  } */

  // if ONLYLEFTRIGHT is on, scroll only when you move left or right,
  //if (ONLYLEFTRIGHT && (Math.abs(_mY - _mYOld) > 2)) {
  //  return;
  //}
  // if you want scrolling, mouse have to go start moving slowly
  if (Math.abs(_mY - _mYOld) < 7 && Math.abs(_mX - _mXOld) < 7)
    _go = 1;


  // scroll the page
  var way = end > 0 ? 1 : -1;
  var val = SCROLLSTEP;
  if (ONLYLEFTRIGHT) {
    if (_go) {
      val = Math.pow(Math.abs(_mX - _mXOld), ONLYLEFTRIGHT_MOUSESPEED);
    } else {
      val = 0;
    }
  }
  if (val != 0) {
    window.scrollTo(window.pageXOffset, window.pageYOffset + val*way);
  }
  if (ONLYLEFTRIGHT && SHOW_ACTIVE_REGION /*&& val != 0*/) {
    if (end > 0) {
      regionUI.showBottomRegion();
    } else {
      regionUI.showTopRegion();
    }
  }
}

function maybe(scrollWindow) {
  var timer;
  return function(){
    if (!timer) {
      timer = setTimeout(function(){
        timer = null;
        scrollWindow();
        _mXOld = _mX;
        _mYOld = _mY;
        _mThen = _mNow;
      }, DELAY_TIME);
    }
  };
}

var maybeScrollWindow = maybe(ScrollWindow);

// 1. Catch mouse movement
document.addEventListener('mousemove', mousemove, true);
function mousemove(e)
{
  // get mouse pos and the date
  if (!e)
    e = window.event || window.Event;
  if('undefined'!=typeof e.pageX) {
    _mX = e.pageX;
    _mY = e.pageY;
  } else {
    _mX = e.clientX + document.body.scrollLeft;
    _mY = e.clientY + document.body.scrollTop;
  }
  _mNow = Date.now();

  // Hack to avoid unwanted scrolling when the mouse enters a window
  // if no event for too long, no scrolling
  if (_mNow - _mThen > ONLYLEFTRIGHT_DONTSCROLL)
    _go = 0;

  if (ONLY_WHEN_HOLDING_SHIFT && !e.shiftKey) return;
  if (ONLY_WHEN_HOLDING_CTRL && !e.ctrlKey) return;
  if (ONLY_WHEN_HOLDING_ALT && !e.altKey) return;

  // Scroll the window
  maybeScrollWindow();
}

var regionUI = (function() {
  var FADE_IN_DURATION = 300;

  var topRegion = null;
  var bottomRegion = null;

  function ensureRegionsExist() {
    if (!bottomRegion) {
      topRegion = document.createElement('div');
      topRegion.className = 'ASM_region';
      topRegion.style.top = 0;
      topRegion.style.width = '100%';
      topRegion.style.height = (100 - NOSCROLL_PERCENT) / 2 + '%';
      document.body.appendChild(topRegion);
      bottomRegion = document.createElement('div');
      bottomRegion.className = 'ASM_region';
      bottomRegion.style.bottom = 0;
      bottomRegion.style.width = '100%';
      bottomRegion.style.height = (100 - NOSCROLL_PERCENT) / 2 + '%';
      document.body.appendChild(bottomRegion);
      GM_addStyle(`
        .ASM_region {
          position: fixed;
          z-index: 99999999;
          background: #09c4;
          pointer-events: none;
          transition: opacity 0.3s 0s;
          opacity: 0;
        }
        .ASM_region.ASM_show {
          display: block;
          transition: opacity ${FADE_IN_DURATION}ms;
          opacity: 1;
        }
      `);
    }
  }

  function showRegion(regionElement) {
    regionElement.classList.add('ASM_show');
    //regionElement.offsetWidth;
    // We need to wait long enough for the new state to fade in before we remove the class.
    //setTimeout(() => {
    //  regionElement.classList.remove('ASM_show');
    //}, FADE_IN_DURATION);
  }

  function showTopRegion() {
    ensureRegionsExist();
    showRegion(topRegion);
  }

  function showBottomRegion() {
    ensureRegionsExist();
    showRegion(bottomRegion);
  }

  function hideRegions() {
    topRegion.classList.remove('ASM_show');
    bottomRegion.classList.remove('ASM_show');
  }

  return {
    ensureRegionsExist: ensureRegionsExist,
    showTopRegion: showTopRegion,
    showBottomRegion: showBottomRegion,
    hideRegions: hideRegions,
  };
}());

if (SHOW_ACTIVE_REGION) {
  // It's good to create them at the start, otherwise the first animation won't fade in (because the region will be given the 'ASM_show' class on the same tick that it was created).
  document.addEventListener('DOMContentLoaded', function() {
    regionUI.ensureRegionsExist();
  });
}
