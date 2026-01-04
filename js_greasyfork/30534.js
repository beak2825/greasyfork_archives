// ==UserScript==
// @name        MomentumScrolling
// @namespace   http://pussy/MomentumScrolling
// @include     *
// @version     1.13
// @grant       none
// @description Add drag scrolling and momentum.
// @downloadURL https://update.greasyfork.org/scripts/30534/MomentumScrolling.user.js
// @updateURL https://update.greasyfork.org/scripts/30534/MomentumScrolling.meta.js
// ==/UserScript==
(function () {
  'use strict';
  // Settings -------------------------------------------------------
  // Scroll-speed
  var INERTIA = 0.98;
  var ACCEL_ON_MOUSEUP = 1.8;
  var MIN_SPEED = 1;
  // Interface
  var DRAG_BUTTON = 0; // 0:LeftButton, 1:MiddleButton, 2:RightButton
  var DRAG_TIMEOUT = 500; // [ms] (cancel on Long tap)
  var DISABLE_WHEN_TEXT_SELECTED = false;
  var DISABLE_TAGNAMES = [
    'A',
    'INPUT',
    'TEXTAREA',
    'SELECT ',
    'VIDEO',
    'OBJECT',
    'EMBED'
  ];
  // ----------------------------------------------------------------
  var enabled = false;
  var dragging = false;
  var target = null;
  var mouseX = 0;
  var mouseY = 0;
  var momentX = 0;
  var momentY = 0;
  var timeoutIds = {
  };
  var timeout = function (id, f, ms) {
    if (timeoutIds[id]) clearTimeout(timeoutIds[id]);
    if (f && ms) {
      timeoutIds[id] = setTimeout(f, ms);
    } else {
      timeoutIds[id] = null;
    }
  };
  var scrollTarget = function () {
    if (target.scrollBy) {
      target.scrollBy(momentX, momentY);
    } else {
      target.scrollLeft += momentX;
      target.scrollTop += momentY;
    }
  };
  var momentScroll = function (e) {
    if (Math.abs(momentX) < MIN_SPEED && Math.abs(momentY) < MIN_SPEED) return;
    scrollTarget();
    momentX *= INERTIA;
    momentY *= INERTIA;
    setTimeout(momentScroll, 16); // 60fps
  };
  var dragEnd = function () {
    if (!dragging) return;
    dragging = false;
    document.body.classList.remove('momentum-scrolling--dragging', 'momentum-scrolling--scrolled');
    timeout('resetMoment', null);
    momentX *= ACCEL_ON_MOUSEUP;
    momentY *= ACCEL_ON_MOUSEUP;
    setTimeout(momentScroll, 20);
  };
  var setEnabled = function () {
    enabled = true;
    document.body.classList.add('momentum-scrolling--enabled');
  };
  var setDisabled = function () {
    enabled = false;
    document.body.classList.remove('momentum-scrolling--enabled');
    dragEnd();
  };
  var findTarget = function (elm) {
    while (elm) {
      if (elm.tagName === 'BODY') return window;
      try {
        var s = document.defaultView.getComputedStyle(elm, '');
        if (!s) continue;
        if (s.overflow == 'auto') return elm;
        if (s.overflow == 'scroll') return elm;
        if (s.overflowY == 'scroll') return elm;
        if (s.overflowX == 'scroll') return elm;
      } catch (e) {
        // document root etc...
      }
      elm = elm.parentNode;
    }
    return window;
  };
  var resetMoment = function () {
    momentX = 0;
    momentY = 0;
  };
  window.addEventListener('mousedown', function (e) {
    if (!enabled) return;
    if (e.button != DRAG_BUTTON) return;
    if (DISABLE_TAGNAMES.includes(e.target.tagName)) return;
    target = findTarget(e.target);
    mouseX = e.clientX;
    mouseY = e.clientY;
    resetMoment();
    timeout('cancel', setDisabled, DRAG_TIMEOUT);
    document.body.classList.add('momentum-scrolling--dragging');
    dragging = true;
  });
  window.addEventListener('mousemove', function (e) {
    if (!enabled) return;
    if (!dragging) return;
    if (DISABLE_WHEN_TEXT_SELECTED && window.getSelection().toString()) {
      setDisabled();
      return;
    }
    momentX = mouseX - e.clientX;
    momentY = mouseY - e.clientY;
    mouseX = e.clientX;
    mouseY = e.clientY;
    scrollTarget();
    timeout('resetMoment', resetMoment, 100);
    if (timeoutIds.cancel && (momentX >= 1 || momentY >= 1)) {
      timeout('cancel', null);
      document.body.classList.add('momentum-scrolling--scrolled');
    }
  });
  window.addEventListener('mouseup', function (e) {
    dragEnd();
    timeout('cancel', null);
    setEnabled();
  });
  var ss = document.documentElement.appendChild(document.createElement('style')).sheet;
  ss.insertRule('.momentum-scrolling--enabled { cursor: default; }', 0);
  ss.insertRule('.momentum-scrolling--dragging { cursor: grabbing !important;}', 0);
  //var img = document.querySelector('body>img:only-child'); // not working on chrome
  var imgs = document.querySelectorAll('body>img');
  var img = imgs[0];
  if (img && !imgs[1]) {
    ss.insertRule('.momentum-scrolling--scrolled img { pointer-events: none; }', 0);
    var preventDefaultEvent = function (e) {
      if (enabled) {
        e.preventDefault();
      }
    };
    img.addEventListener('dragstart', preventDefaultEvent); // firefox
    img.addEventListener('mousemove', preventDefaultEvent); // chrome
  }
  setEnabled();
}) ();
