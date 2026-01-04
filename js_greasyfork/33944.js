// ==UserScript==
// @name         EH page swapper
// @namespace    https://github.com/andylinpersonal/
// @version      0.1.3
// @description  Current: Use arrow key to flip pages in e-hentai.
// @require      http://code.jquery.com/jquery-latest.js
// @author       Andy Lin
// @run-at       document-start
// @match        https://exhentai.org/*
// @match        https://e-hentai.org/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/33944/EH%20page%20swapper.user.js
// @updateURL https://update.greasyfork.org/scripts/33944/EH%20page%20swapper.meta.js
// ==/UserScript==

(function() {
  'use strict';
  /**
   * Logging messages to console.
   * @param {String} modeStr - log mode: can be 'error', 'warning', 'log', and other
   * @param {String} inStr - What to display.
   * @returns {void}
   */
  function logger(modeStr, inStr) {
    if (modeStr === 'error') {
      console.error('EHFlipper: Error: ' + inStr);
    } else if (modeStr === 'warning') {
      console.warn('EHFlipper: Warning: ' + inStr);
    } else if (modeStr === 'log') {
      console.log('EHFlipper: Message: ' + inStr);
    } else {
      console.log('EHFlipper: ' + modeStr + ': ' + inStr);
    }
  }

  /**
   * Check operation mode from url format
   * @param {String} url - URL of current page.
   * @returns {Object} Mode object.
   */
  function modeChecker(url) {
    /**
     * Get current page
     * @param {String} url - URL of current page.
     * @param {RegExp} patternOfPage - Pattern of page string
     * @param {int} startOfNum - Start offset of page number
     * @returns {int} Current page.
     */
    function pageChecker(url, patternOfPage) {
      var found = url.match(patternOfPage);
      if (found) {
        found = found[1];
      } else {
        return 0;
      }
      var out = Number(found);
      if (isNaN(out)) return 0;
      return out;
    }

    if (url.match(/\/g\//)) {
      return {
        'type': 'gallery',
        'page': (pageChecker(url, /(?:p=)([0-9]*)/, 2) + 1)
      };
    } else if (url.match(/\/s\//)) {
      return {
        'type': 'show',
        'page': (pageChecker(url, /[0-9a-zA-Z]{1,1}-(?:([0-9]{1,}))/, 2))
      };
    } else {
      return {
        'type': 'main',
        'page': (pageChecker(url, /(?:(?:page=)|(?:\/))([0-9]{1,})/) + 1)
      };
    }
  }

  /**
   * Event handler of keydown event
   * @param {KeyboardEvent} e - KeyboardEvent
   * @returns {void}
   */
  function go(e) {
    /**
     * Go~~
     * @param {Object} mode - Where are you?
     * @param {String} action - Previous or next page?
     * @returns {void}
     */
    function switchPage(mode, action) {
      switch (mode.type) {
        case 'main':
          var tmpMain = $('.ptt tr')[0].children;
          if (action === 'next') {
            tmpMain[tmpMain.length - 1].click();
            return;
          } else if (action === 'previous') {
            tmpMain[0].click();
            return;
          }
          break;
        case 'show':
          if (action === 'next') {
            $('#i2 #next')[0].click();
            return;
          } else if (action === 'previous') {
            $('#i2 #prev')[0].click();
            return;
          }
          break;
        case 'gallery':
          var tmpGal = $('.ptt tr')[0].children;
          if (action === 'next') {
            tmpGal[tmpGal.length - 1].click();
            return;
          } else if (action === 'previous') {
            tmpGal[0].click();
            return;
          }
          break;
        default:
          logger('error', 'Unknown mode: ' + mode.type);
          break;
      }
      logger('error', 'Unknown action: ' + action);
    }
    var url = unsafeWindow.document.location.href;
    var mode = modeChecker(url);
    switch (e.key) {
      case 'ArrowLeft':
        logger('log', e.key + ' is pressed.');
        switchPage(mode, 'previous');
        break;
      case 'ArrowRight':
        logger('log', e.key + ' is pressed.');
        switchPage(mode, 'next');
        break;
      default:
        logger(
          'log', 'Unknown key "' +
          e.key +
          '" with keyCode "' +
          e.keyCode +
          '"is pressed.');
        break;
    }
  }

  var url = unsafeWindow.document.location.href;
  var mode = modeChecker(url);
  logger('Current location', url);
  logger('Current page', mode.page);
  // Register event handler to <body>
  // Because keypress event will ignore arrow key, I use keydown instead.
  $('body').keydown(go);
})();
