// ==UserScript==
// @name         IndieGala Create Giveaway Helper
// @namespace    https://github.com/MrMarble/IndieGalaCreateGiveawayHelper
// @version      0.6
// @description  Creating a giveaway is now  a lot easier!!
// @author       MrMarble
// @license MIT
// @match        https://www.indiegala.com/profile?user_id=*
// @match        https://www.indiegala.com/gift?gift_id=*
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371868/IndieGala%20Create%20Giveaway%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/371868/IndieGala%20Create%20Giveaway%20Helper.meta.js
// ==/UserScript==

(function() {
  'use strict';
  run();

  function run() {
    if (!'URLSearchParams' in window) {
      throw "Web Browser not supported!";
    }

    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('user_id')) {
      fillGiveaway();
    } else if (searchParams.has('gift_id')) {
      waitForKeyElements("#steam-key-games", addButton, true);
    }
  }

  function addButton() {
    add_style();
    jQuery('div[id^="serial_"]').each((i, element) => {
      jQuery(element).append('<div class="entry-elem align-c create-giveaway-helper"><i aria-hidden="true" class="fa fa-gift"></i></div>');
    });
    jQuery('.create-giveaway-helper').on('click', function() {
      let game_url = jQuery(this).parents('.game-key-string').find('a.game-steam-url').attr('href');
      let game_serial = jQuery(this).prevAll('input[id^=serial_n_]').val();

      let w = window.open('https://www.indiegala.com/profile', '_blank', 'top=10,height=500,menubar=0,status=0,toolbar=0');
      w.opener = null; //Bypass IndieGala autoclose  of new windows
      w.game_url = game_url;
      w.game_serial = game_serial;
    });
  }

  function fillGiveaway() {
    jQuery(document).ready(function() {
      if (window.game_url !== undefined && window.game_serial !== undefined) {
        jQuery('.giveaways-new-cont').slideToggle();
        jQuery('#collapseGiveaways').toggleClass('in').css('height', 'auto');

        jQuery('textarea.giveaway-description').val('IndieGala Giveaway');
        jQuery('.form-not-guaranteed input').val(window.game_url);
        jQuery('.form-not-guaranteed button.form-button-1').trigger('click');
        waitForKeyElements('ul.form-not-guaranteed input[rel="steamSerialKey"]', function() {
          jQuery('ul.form-not-guaranteed input[rel="steamSerialKey"]').val(window.game_serial);
          jQuery('button.btn-add-rel-game').trigger('click');
          waitForKeyElements('span.points-result', function() {
            jQuery('button.btn-calculate-giv-value').trigger('click');
          }, true);
        }, true);
      }
    });
  }

  function add_style() {
    let css = `div.create-giveaway-helper {
      position: absolute;
      height: 24px;
      top: 1px;
      line-height: 10px;
      padding: 4px 10px;
      margin-left: 1px;
      color: #8c2222;
    }
    div.create-giveaway-helper:hover{
      cursor: pointer;
    }
    `;
    if (jQuery('.donate_indiegala_helper').length == 0) {
      css += ' .span-key {position: relative;}div.create-giveaway-helper {right:1px}'
    }
    jQuery('head').append('<style>' + css + '</style>');
  }

  function waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
    var targetNodes,
      btargetsFound;

    if (typeof iframeSelector == "undefined")
      targetNodes = jQuery(selectorTxt);
    else
      targetNodes = jQuery(iframeSelector).contents().find(selectorTxt);

    if (targetNodes && targetNodes.length > 0) {
      btargetsFound = true;
      /*--- Found target node(s).  Go through each and act if they
              are new.
          */
      targetNodes.each(function() {
        var jThis = jQuery(this);
        var alreadyFound = jThis.data('alreadyFound') || false;

        if (!alreadyFound) {
          //--- Call the payload function.
          var cancelFound = actionFunction(jThis);
          if (cancelFound)
            btargetsFound = false;
          else
            jThis.data('alreadyFound', true);
          }
        });
    } else {
      btargetsFound = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj = waitForKeyElements.controlObj || {};
    var controlKey = selectorTxt.replace(/[^\w]/g, "_");
    var timeControl = controlObj[controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound && bWaitOnce && timeControl) {
      //--- The only condition where we need to clear the timer.
      clearInterval(timeControl);
      delete controlObj[controlKey]
    } else {
      //--- Set a timer, if needed.
      if (!timeControl) {
        timeControl = setInterval(function() {
          waitForKeyElements(selectorTxt, actionFunction, bWaitOnce, iframeSelector);
        }, 300);
        controlObj[controlKey] = timeControl;
      }
    }
    waitForKeyElements.controlObj = controlObj;
  }
})();
