// ==UserScript==
// @name           Virtonomica: Обновление главного окна после закрытия дочернего
// @namespace      virtonomica
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @include        http*://*virtonomic*.*/*/window/unit/supply/create/*/step2
// @include        http*://*virtonomic*.*/*/window/unit/equipment/*
// @description    Обновление главного окна после закрытия дочернего
// @version        1.7
// @downloadURL https://update.greasyfork.org/scripts/24492/Virtonomica%3A%20%D0%9E%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BE%D0%BA%D0%BD%D0%B0%20%D0%BF%D0%BE%D1%81%D0%BB%D0%B5%20%D0%B7%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D1%8F%20%D0%B4%D0%BE%D1%87%D0%B5%D1%80%D0%BD%D0%B5%D0%B3%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/24492/Virtonomica%3A%20%D0%9E%D0%B1%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%B3%D0%BB%D0%B0%D0%B2%D0%BD%D0%BE%D0%B3%D0%BE%20%D0%BE%D0%BA%D0%BD%D0%B0%20%D0%BF%D0%BE%D1%81%D0%BB%D0%B5%20%D0%B7%D0%B0%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D1%8F%20%D0%B4%D0%BE%D1%87%D0%B5%D1%80%D0%BD%D0%B5%D0%B3%D0%BE.meta.js
// ==/UserScript==

var run = function() {

  var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
  $ = win.$;

  function getVal(spName){
    return JSON.parse(window.localStorage.getItem(spName));
  }
  function setVal(spName, pValue){
    window.localStorage.setItem(spName, JSON.stringify(pValue));
  }
  var _popup = null;
  var popup_changed = 0;
  function waitfor(msec, count) {
    // Check if condition met. If not, re-check later (msec).
    console.log("popup_opened = " + (_popup !== null && !_popup.closed));
    while (_popup !== null && !_popup.closed)  {
      count++;
      if(popup_changed != 1){
        popup_changed = getVal('popup_changed');
      }
      setTimeout(function() {
        waitfor(msec, count);
      }, msec);
      return;
    }
    _popup = null;
    // Condition finally met. callback() can be executed.
    console.log("count = " + count);
    if(popup_changed == 1){
      window.location.reload();
    }
  }

  if (/\/\w+\/window\/unit\/supply\/create\/\d+\/step2/.test(window.location) || /\/\w+\/window\/unit\/equipment\/\d+/.test(window.location)) {
    $('#submitLink').click(function(){
      setVal('popup_changed', 1);
    });
    $('#buy_button').click(function(){
      setVal('popup_changed', 1);
    });
    $('#repair_button').click(function(){
      setVal('popup_changed', 1);
    });
    $('#terminateLink').click(function(){
      setVal('popup_changed', 1);
    });
  } else {
    $('a[onclick*="doWindow(this"]').unbind().click(function(){
      var matches = $(this).attr('onclick').match(/doWindow\(this[^\d]+['"]?(\d+)['"]?,\s*['"]?(\d+)['"]?\)/);
      var url = $(this).attr('href');
      setVal('popup_changed', 0);
      popup_changed = 0;
      _popup = popup(url, matches[1], matches[2]);
      if (/\/\w+\/window\/unit\/supply\/create\/\d+\/step1\/\d+/.test(url) || /\/\w+\/window\/unit\/equipment\/\d+/.test(url)) {
        waitfor(100, 0, 0);
      } else {
        _popup = null;
      }
    });
  }

};

if(window.top == window) {
    var script = document.createElement("script");
    script.textContent = '(' + run.toString() + ')();';
    document.documentElement.appendChild(script);
}