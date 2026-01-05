// ==UserScript==
// @name        Change Facebook Notification Sound
// @namespace   cfs
// @author      Dexmaster
// @date        2015-11-09
// @description Small script for a request https://greasyfork.org/uk/forum/discussion/6631/change-facebook-notification-sound-convert-chrome-extension-to-userscript
// @include     https://facebook.com/*
// @include     https://www.facebook.com/*
// @version     0.2.4
// @require     https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_log
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/13346/Change%20Facebook%20Notification%20Sound.user.js
// @updateURL https://update.greasyfork.org/scripts/13346/Change%20Facebook%20Notification%20Sound.meta.js
// ==/UserScript==
(function () {
  'use strict';
  var soundUri,
  interval,
  status,
  audio,
  windowStatus = false,
  intv;
  var openClose = function () {
    if (!!windowStatus) {
      GM_config.close();
    } else {
      GM_config.open();
    }
  };
  var countUnread = function () {
    var els = document.querySelectorAll('._51jx'),
    sum = Array.prototype.map.call(els, function (el) {
      return parseInt(el.innerHTML) || 0;
    }).reduce(function (a, b) {
      return a + b;
    }, 0);
    return sum;
  };
  var playerStart = function (num) {
    var c = new Date(),
    cv = new Date(GM_getValue('lastPlay'));
    //console.info((c - cv) > intv * 2);
    if ((c - cv) > intv * 2) {
      //console.info(num);
      var cnt = GM_getValue('counter');
      GM_setValue('counter', num);
      if (cnt < num) {
        GM_setValue('lastPlay', c);
        audio.play();
      }
    }
  };
  var numberChange = function () {
    var num = countUnread();
    if ((GM_getValue('counter') !== num) && (num > 0)) {
      playerStart(num);
    }
  };
  var init = function () {
    soundUri = GM_config.get('soundUri');
    interval = GM_config.get('interval');
    status = GM_config.get('status');
    if (!status) {
      return;
    }
    if (!audio) {
      audio = document.createElement('audio');
    }
    if (audio.getAttribute('src') !== soundUri) {
      audio.setAttribute('src', soundUri);
    }
    if (!!intv) {
      clearInterval(intv);
    }
    intv = setInterval(numberChange, interval * 1000);
  };
  GM_config.init({
    'id': 'CFNS',
    'title': 'Notification Sound Settings',
    'fields': {
      'status': {
        'label': 'Enable',
        'type': 'checkbox',
        'default': true
      },
      'soundUri': {
        'label': 'Sound File Url',
        'type': 'text',
        'default': 'https://instaud.io/_/djS.mp3'
      },
      'interval': {
        'label': 'Notification check interval (in sec)',
        'type': 'unsigned float',
        'default': 5
      },
    },
    'events': // Callback functions object
    {
      'init': function () {
        GM_addStyle('#CFNS {border:medium none!important;border-radius:3px;box-shadow:0 0 5px 0 #888,0 0 5px 0 #06f;height:260px!important;width:380px!important}');
        if (!GM_getValue('lastPlay')) {
          GM_setValue('lastPlay', new Date());
        }
        if (!GM_getValue('counter')) {
          GM_setValue('counter', 0);
        }
        init();
        GM_registerMenuCommand('Notification Sound Settings', openClose, 'F');
      },
      'save': function () {
        init();
      },
      'close': function () {
        windowStatus = false;
      },
      'open': function () {
        windowStatus = true;
      }
    },
    css: '#CFNS_wrapper{max-width:400px;margin:0 auto;background:#fff;border-radius:2px;padding:0;font-family:Georgia,"Times New Roman",Times,serif}.config_header{display:block;text-align:center;padding:0;margin:0 0 20px;color:#5C5C5C;font-size:x-large}#CFNS_wrapper .config_var{display:block;padding:9px;border:1px solid #DDD;margin-bottom:10px;border-radius:3px}#CFNS_wrapper .config_var:last-child{border:none;margin-bottom:0;text-align:center}#CFNS_wrapper .config_var > label{display:block;float:left;margin-top:-19px;background:#FFF;height:14px;padding:2px 5px;color:#B9B9B9;font-size:14px;overflow:hidden;font-family:Arial,Helvetica,sans-serif}#CFNS_wrapper .config_var input[type="text"],#CFNS_wrapper .config_var input[type="date"],#CFNS_wrapper .config_var input[type="datetime"],#CFNS_wrapper .config_var input[type="email"],#CFNS_wrapper .config_var input[type="number"],#CFNS_wrapper .config_var input[type="search"],#CFNS_wrapper .config_var input[type="time"],#CFNS_wrapper .config_var input[type="url"],#CFNS_wrapper .config_var input[type="password"],#CFNS_wrapper .config_var textarea,#CFNS_wrapper .config_var select{box-sizing:border-box;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;width:100%;display:block;outline:none;border:none;height:25px;line-height:25px;font-size:16px;padding:0;font-family:Georgia,"Times New Roman",Times,serif}#CFNS_wrapper textarea{resize:none}#CFNS_wrapper .saveclose_buttons{background:#2471FF;border:none;border-bottom:3px solid #5994FF;border-radius:3px;color:#D2E2FF;font-size:18px;margin:0 0 0 20px;padding:5px 20px;cursor: pointer;}#CFNS_wrapper .saveclose_buttons:hover{background:#6B9FFF;color:#fff}'
  });
}());