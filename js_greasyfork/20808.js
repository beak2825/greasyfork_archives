// ==UserScript==
// @name        BC - Recent Activity Links - Open in new tab
// @author      Brad Mitchell
// @homepage    https://github.com/bairdley
// @version     0.1
// @namespace   https://forum.bigcommerce.com
// @description Allows users to open Recent Activity links in a new tab
// @match       https://forum.bigcommerce.com/*
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/20808/BC%20-%20Recent%20Activity%20Links%20-%20Open%20in%20new%20tab.user.js
// @updateURL https://update.greasyfork.org/scripts/20808/BC%20-%20Recent%20Activity%20Links%20-%20Open%20in%20new%20tab.meta.js
// ==/UserScript==
(function () {
  var OS,
  urlExt = '/s/question/',
  dataID,
  newTabCount = 0,
  keyCodes,
  keyed = false,
  currentKey;
  (function () {
    if (navigator.appVersion.indexOf('Win') != - 1) {
      OS = 'win';
      keyCodes = {
        ctrl: 238
      };
    } else {
      OS = 'mac';
      keyCodes = {
        ctrl: 17,
        cmdL: 91,
        cmdR: 93,
        cmdFF: 224
      };
    }
  }());
  $(document).keydown(function (e) {
    for (var i in keyCodes) {
      if (e.which === keyCodes[i]) {
        currentKey = keyCodes[i];
        keyed = true;
      }
    }
  });
  $(document).keyup(function (e) {
    if (e.which === currentKey) {
      keyed = false;
    }
  });
  $('.compactFeedElement').live('mouseover', function () {
    $(this).mousedown(function (e) {
      var el = $(this).find('a').andSelf();
      if ($(this).attr('data-id')) {
        dataID = $(this).attr('data-id');
        if (e.which !== 1 && keyed === false) {
          clicks.right(el);
        } else if (OS === 'win') {
          if (keyed === true && currentKey === keyCodes.ctrl) {
            clicks.win.ctrlClick(el);
          }
        } else if (OS === 'mac') {
          if (keyed === true && currentKey === (keyCodes.cmdFF || keyCodes.cmdR || keyCodes.cmdL)) {
            clicks.mac.cmdClick(el);
          } else if (keyed === true && currentKey === keyCodes.ctrl) {
            setHref.url(el);
          }
        }
      }
    }).mouseleave(function () {
      setHref.void ($(this).find('a').andSelf());
    });
  });
  function newTab() {
    window.open(urlExt + dataID);
    var int = setInterval(function () {
      if (newTabCount > 0) {
        newTabCount = 0;
        window.clearInterval(int);
      }
    }, 500);
  }
  var setHref = {
    url: function (el) {
      $(el).attr('href', urlExt + dataID);
    },
    void : function (el) {
      $(el).attr('href', 'javascript:void(0)');
      keyed = false;
    }
  };
  var clicks = {
    mac: {
      cmdClick: function (el) {
        while (newTabCount < 1) {
          newTab();
          newTabCount += 1;
        }
      },
      ctrlClick: function (el) {
      }
    },
    win: {
      ctrlClick: function (el) {
      }
    },
    right: function (el) {
      setHref.url(el);
    }
  };
}) ();
