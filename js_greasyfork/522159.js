// ==UserScript==
// @name              Kusonime & OtakuDesu Limit Remover (Optimized)
// @namespace         https://www.youtube.com/channel/UC26YHf9ASpeu68az2xRKn1w
// @version           2.0
// @description       Menghapus batasan seperti larangan copy, paste, klik kanan, atau seleksi teks di kusonime.com dan otakudesu.best dengan performa lebih baik.
// @author            Kinnena
// @match             https://kusonime.com/*
// @match             https://otakudesu.best/*
// @icon              https://cdn-icons-png.flaticon.com/256/8537/8537202.png
// @grant             none
// @license MIT
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/522159/Kusonime%20%20OtakuDesu%20Limit%20Remover%20%28Optimized%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522159/Kusonime%20%20OtakuDesu%20Limit%20Remover%20%28Optimized%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // Domain name rule list
  var rules = {
    black_rule: {
      name: "black",
      hook_eventNames: "",
      unhook_eventNames: ""
    },
    default_rule: {
      name: "default",
      hook_eventNames: "contextmenu|select|selectstart|copy|cut|dragstart",
      unhook_eventNames: "mousedown|mouseup|keydown|keyup",
      dom0: true,
      hook_addEventListener: true,
      hook_preventDefault: true,
      hook_set_returnValue: true,
      add_css: true
    }
  };
  // Domain name list
  var lists = {
    // blacklist
    black_list: [
      /.*\.youtube\.com.*/,
      /.*\.wikipedia\.org.*/,
      /mail\.qq\.com.*/,
      /translate\.google\..*/
    ]
  };

  // List of events to handle
  var hook_eventNames, unhook_eventNames, eventNames;
  // 储存名称
  var storageName = getRandStr('qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM', parseInt(Math.random() * 12 + 8));
  // Store hooked functions
  var EventTarget_addEventListener = EventTarget.prototype.addEventListener;
  var document_addEventListener = document.addEventListener;
  var Event_preventDefault = Event.prototype.preventDefault;

  // Hook addEventListener proc
  function addEventListener(type, func, useCapture) {
    var _addEventListener = this === document ? document_addEventListener : EventTarget_addEventListener;
    if(hook_eventNames.indexOf(type) >= 0) {
      _addEventListener.apply(this, [type, returnTrue, useCapture]);
    } else if(this && unhook_eventNames.indexOf(type) >= 0) {
      var funcsName = storageName + type + (useCapture ? 't' : 'f');

      if(this[funcsName] === undefined) {
        this[funcsName] = [];
        _addEventListener.apply(this, [type, useCapture ? unhook_t : unhook_f, useCapture]);
      }

      this[funcsName].push(func);
    } else {
      _addEventListener.apply(this, arguments);
    }
  }

  // cleanup loop
  function clearLoop() {
    var elements = getElements();

    for(var i in elements) {
      for(var j in eventNames) {
        var name = 'on' + eventNames[j];
        if(elements[i][name] !== null && elements[i][name] !== onxxx) {
          if(unhook_eventNames.indexOf(eventNames[j]) >= 0) {
            elements[i][storageName + name] = elements[i][name];
            elements[i][name] = onxxx;
          } else {
            elements[i][name] = null;
          }
        }
      }
    }
  }

  // function that returns true
  function returnTrue(e) {
    return true;
  }
  function unhook_t(e) {
    return unhook(e, this, storageName + e.type + 't');
  }
  function unhook_f(e) {
    return unhook(e, this, storageName + e.type + 'f');
  }
  function unhook(e, self, funcsName) {
    var list = self[funcsName];
    for(var i in list) {
      list[i](e);
    }

    e.returnValue = true;
    return true;
  }
  function onxxx(e) {
    var name = storageName + 'on' + e.type;
    this[name](e);

    e.returnValue = true;
    return true;
  }

  // Get random string
  function getRandStr(chs, len) {
    var str = '';

    while(len--) {
      str += chs[parseInt(Math.random() * chs.length)];
    }

    return str;
  }

  // Get all elements including document
  function getElements() {
    var elements = Array.prototype.slice.call(document.getElementsByTagName('*'));
    elements.push(document);

    return elements;
  }

  // Add css
  function addStyle(css) {
    var style = document.createElement('style');
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  // Get the rules that should be used for the target domain name
  function getRule(url) {
    function testUrl(list, url) {
      for(var i in list) {
        if(list[i].test(url)) {
          return true;
        }
      }

      return false;
    }

    if(testUrl(lists.black_list, url)) {
      return rules.black_rule;
    }

    return rules.default_rule;
  }

  // initialization
  function init() {
    // Get the rules for the current domain name
    var url = window.location.host + window.location.pathname;
    var rule = getRule(url);

    // Set event list
    hook_eventNames = rule.hook_eventNames.split("|");
    // TODO Allowed to return value
    unhook_eventNames = rule.unhook_eventNames.split("|");
    eventNames = hook_eventNames.concat(unhook_eventNames);

    // A loop that calls the cleanup DOM0 event method
    if(rule.dom0) {
      setInterval(clearLoop, 30 * 1000);
      setTimeout(clearLoop, 2500);
      window.addEventListener('load', clearLoop, true);
      clearLoop();
    }

    // hook addEventListener
    if(rule.hook_addEventListener) {
      EventTarget.prototype.addEventListener = addEventListener;
      document.addEventListener = addEventListener;
    }

    // hook preventDefault
    if(rule.hook_preventDefault) {
      Event.prototype.preventDefault = function() {
        if(eventNames.indexOf(this.type) < 0) {
          Event_preventDefault.apply(this, arguments);
        }
      };
    }

    // Hook set returnValue
    if(rule.hook_set_returnValue) {
      Event.prototype.__defineSetter__('returnValue', function() {
        if(this.returnValue !== true && eventNames.indexOf(this.type) >= 0) {
          this.returnValue = true;
        }
      });
    }

    console.debug('url: ' + url, 'storageName：' + storageName, 'rule: ' + rule.name);

    // CSS
    if(rule.add_css) {
      addStyle('html, * {-webkit-user-select:text!important; -moz-user-select:text!important; user-select:text!important; -ms-user-select:text!important; -khtml-user-select:text!important;}');
    }
  }

  init();
})();