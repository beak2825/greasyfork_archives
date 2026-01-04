// ==UserScript==
// @name        WME Enhanced House Numbers
// @namespace   https://greasyfork.org/en/users/287765-mdymek
// @version     1.0.0
// @description Allows to add house numbers in an efficient way.
// @author      mdymek
// @include     https://beta.waze.com/*
// @include     https://www.waze.com/editor*
// @include     https://www.waze.com/*/editor*
// @exclude     https://www.waze.com/user/editor*
// @connect     status.waze.com
// @require     https://greasyfork.org/scripts/24851-wazewrap/code/WazeWrap.js?version=229392
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/381175/WME%20Enhanced%20House%20Numbers.user.js
// @updateURL https://update.greasyfork.org/scripts/381175/WME%20Enhanced%20House%20Numbers.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var settings = {};
  var counter = 0;
  var interval = 1;
  var isLetterAdded;
  var alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
  var alphabetCounter = 0;
  var numLetter = 0;
  var counterIncrement = 0;

  function bootstrap(tries = 1) {
    //Check if everything is loaded
    if (W && W.map && W.model && W.loginManager.user && $) {
      initEHN();
      injectStyle();
    } else if (tries < 1000)
      setTimeout(function () {
        bootstrap(tries++);
      }, 200);
  }

  function initEHN() {

    var editPanelChange = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        for (var i = 0; i < mutation.addedNodes.length; i++) {
          if (mutation.addedNodes[i].nodeType === Node.ELEMENT_NODE && mutation.addedNodes[i].querySelector('div.selection')) {
            addTab();
            if (document.getElementById("WME-EHN")) initializeSettings();
          }
        }
      });
    });
    editPanelChange.observe(document.getElementById('edit-panel'), {
      childList: true,
      subtree: true
    });
    var hnWindowShow = new MutationObserver(function(mutations)
    {
        mutations.forEach(function(mutation)
        {
            if (mutation.type == 'childList') {
                $('.sidebar-layout > .overlay').remove();
            }
        });
    });
    hnWindowShow.observe(document.getElementById('map-lightbox'), { childList: true, subtree: true } );

    I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members.WME_EHN_new = "New House Number";
    W.accelerators.addAction("WME_EHN_new", {
      group: 'default'
    });
    W.accelerators.events.register("WME_EHN_new", null, addHN);
    W.accelerators._registerShortcuts({
      't': "WME_EHN_new"
    });

    I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members.WME_EHN_new2 = "New House Number with letter";
    W.accelerators.addAction("WME_EHN_new2", {
      group: 'default'
    });
    W.accelerators.events.register("WME_EHN_new2", null, addHNLetter);
    W.accelerators._registerShortcuts({
      'r': "WME_EHN_new2"
    });

    I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members.WME_EHN_new = "Next House Number";
    W.accelerators.addAction("WME_EHN_nextNum", {
      group: 'default'
    });
    W.accelerators.events.register("WME_EHN_nextNum", null, nextNumber);
    W.accelerators._registerShortcuts({
      'S+t': "WME_EHN_nextNum"
    });

    I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members.WME_EHN_new = "Next House Number Letter";
    W.accelerators.addAction("WME_EHN_nextLet", {
      group: 'default'
    });
    W.accelerators.events.register("WME_EHN_nextLet", null, nextLetter);
    W.accelerators._registerShortcuts({
      'S+r': "WME_EHN_nextLet"
    });

    I18n.translations[I18n.locale].keyboard_shortcuts.groups['default'].members.WME_EHN_new = "Reset EHN";
    W.accelerators.addAction("WME_EHN_reset", {
      group: 'default'
    });
    W.accelerators.events.register("WME_EHN_reset", null, resetEHN);
    W.accelerators._registerShortcuts({
      'CS+r': "WME_EHN_reset"
    });
  }

  function addTab() {
    if (!document.getElementById("WME-EHN") && W.selectionManager.getSelectedFeatures().length > 0 && W.selectionManager.getSelectedFeatures()[0].model.type === 'segment') {
      var btnSection = document.createElement('div');
      btnSection.id = 'WME-EHN';
      var userTabs = document.getElementById('edit-panel');
      if (!(userTabs && getElementsByClassName('nav-tabs', userTabs)))
        return;

      var navTabs = getElementsByClassName('nav-tabs', userTabs)[0];
      if (typeof navTabs !== "undefined") {
        if (!getElementsByClassName('tab-content', userTabs))
          return;

        var tabContent = getElementsByClassName('tab-content', userTabs)[0];

        if (typeof tabContent !== "undefined") {
          var newTab = document.createElement('li');
          newTab.innerHTML = '<a href="#WME-EHN" id="wmeehn" data-toggle="tab">Enhanced HN</a>';
          navTabs.appendChild(newTab);
          btnSection.innerHTML = [
            '<div class="ehn-settings">',
            '<label class="ehn-settings-header">SETTINGS</label>',
            '<div id="current_hn"><label for="current_hn_input">Current house number:</label><input class="ehn-input" id="current_hn_input" type="number" name="current_hn_input"></div>',
            '<div id="increment_hn"><label for="increment_hn_input">Increment next house number by:</label><input class="ehn-input" id="increment_hn_input" type="number" name="increment_hn_input"></div>',
            '<div id="hn_withLetter"><label for="hn_withLetter_input">Current HN with letter:</label><input class="ehn-input" id="hn_withLetter_input" type="text" name="hn_withLetter_input" disabled></div>',
            '<div>Press <b>T</b> to add new house number</div>',
            '<div>Press <b>R</b> to add previous house number with a letter <i>1a, 1b, 1c etc.</i> </div>',
            '<div>Press <b>Shift + T</b> to increment house number without adding point</div>',
            '<div>Press <b>Shift + R</b> to increment letter without adding point</div>',
            '<div>Press <b>Ctrl+ Shift + R</b> to reset EHN</div>',
            '</div>'
          ].join(' ');

          btnSection.className = "tab-pane";
          tabContent.appendChild(btnSection);
        } else {
          btnSection.id = '';
        }
      } else {
        btnSection.id = '';
      }

      document.getElementById('current_hn_input').value = counter + 1;
      document.getElementById('current_hn_input').onchange = function () {
        var counter = document.getElementById('current_hn_input').value - 1;
      };

    }
  }

  function getElementsByClassName(classname, node) {
    if (!node)
      node = document.getElementsByTagName("body")[0];
    var a = [];
    var re = new RegExp('\\b' + classname + '\\b');
    var els = node.getElementsByTagName("*");
    for (var i = 0, j = els.length; i < j; i++)
      if (re.test(els[i].className)) a.push(els[i]);
    return a;
  }

  function initializeSettings() {
    loadSettings();
    saveSettings();
    var incrementInput = document.getElementById('increment_hn_input');
    incrementInput.value = settings.counterIncrement;
    document.getElementById('current_hn_input').value = 1;
    counter = document.getElementById('current_hn_input').value;
    document.getElementById('hn_withLetter_input').value = '1a';
    
    $("#current_hn_input").on('change keyup', function () {
    counter = document.getElementById('current_hn_input').value;
    document.getElementById('hn_withLetter_input').value = counter + alphabet[alphabetCounter];
    });
    $("#increment_hn_input").on('change keyup', function () {
      settings['counterIncrement'] = this.value;
      saveSettings();           
  });
  }

  function saveSettings() {
    if (localStorage) {
      var localsettings = {
        counterIncrement: settings.counterIncrement
      };

      localStorage.setItem("ehn_Settings", JSON.stringify(localsettings));
    }
  }

  function loadSettings() {
    var loadedSettings = $.parseJSON(localStorage.getItem("ehn_Settings"));
    var defaultSettings = {
      counterIncrement: 1,
    };
    settings = loadedSettings ? loadedSettings : defaultSettings;
    for (var prop in defaultSettings) {
      if (!settings.hasOwnProperty(prop))
        settings[prop] = defaultSettings[prop];
    }

  }

  function injectStyle() {
    const css = [
      '.ehn-settings-header {font-size: 13px; width: 100%; font-family: Poppins, sans-serif;' +
      ' text-transform: uppercase; font-weight: 700; color: #354148; margin-bottom: 6px;}',
      '.ehn-settings {font-size: 13px; width: 100%; font-family: Poppins, sans-serif; color: #354148;}',
      '.ehn-input {width : 50px; height: 21px!important; margin-left: 10px; padding-left: 5px; -webkit-box-sizing: border-box; -moz-box-sizing: border-box; box-sizing: border-box;',
    ].join(' ');
    $(`<style type="text/css">${css}</style>`).appendTo('head');
  }

  function addHN() {
    isLetterAdded = false;
    interval = document.getElementById('increment_hn_input').value;
    setFocus();
  }

  function addHNLetter() {
    isLetterAdded = true;
    setFocus(isLetterAdded);
  }

  function setFocus(isLetterAdded) {
    $('#toolbar .add-house-number').click();
    $('#toolbar .add-house-number').click();
    var hn = getElementsByClassName("number");
    for (i = 0; i < hn.length; i++) {
      hn[i].onfocus = function () {
        sethn(isLetterAdded);
      };
    }
  }

  function sethn() {
    var hn = $('div.olLayerDiv.house-numbers-layer div.house-number div.content.active:not(".new") input.number');
    if (hn[0].placeholder == I18n.translations[I18n.locale].edit.segment.house_numbers.no_number && hn.val() === "" && isLetterAdded === false) {
      alphabetCounter = 0;
      hn.val(counter).change();
      $("div#WazeMap").focus();
      document.getElementById('hn_withLetter_input').value = counter + alphabet[alphabetCounter];
      counter = +counter + +interval;
      if (document.getElementById('current_hn_input') !== null)
        document.getElementById('current_hn_input').value = counter;
        
    } else if (hn[0].placeholder == I18n.translations[I18n.locale].edit.segment.house_numbers.no_number && hn.val() === "" && isLetterAdded === true) {
      numLetter = (counter - interval) + alphabet[alphabetCounter];
      alphabetCounter++;
      hn.val(numLetter).change();
      $("div#WazeMap").focus();
      document.getElementById('hn_withLetter_input').value = (counter-interval) + alphabet[alphabetCounter];
    }
  }

  function nextNumber() {
    counter = +counter + +interval;
    if (document.getElementById('current_hn_input') !== null)
        document.getElementById('current_hn_input').value = counter;
    document.getElementById('hn_withLetter_input').value = counter + alphabet[alphabetCounter];
  }

  function nextLetter() {
    alphabetCounter++;
    document.getElementById('hn_withLetter_input').value = counter + alphabet[alphabetCounter];
  }

  function resetEHN() {
    document.getElementById('current_hn_input').value = 1;
    counter = document.getElementById('current_hn_input').value;
    document.getElementById('hn_withLetter_input').value = '1a';
    document.getElementById('increment_hn_input').value = 1;
    interval = document.getElementById('increment_hn_input').value;
    settings['counterIncrement'] = this.value;
      saveSettings();
  }


  bootstrap();
})();
