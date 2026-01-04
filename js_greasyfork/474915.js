// ==UserScript==
// @name         javdb自动点击看过
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  在网页加载后自动点击指定按钮并保存
// @author       xiaoxiao
// @match        *://javdb*.com/v/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474915/javdb%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%9C%8B%E8%BF%87.user.js
// @updateURL https://update.greasyfork.org/scripts/474915/javdb%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E7%9C%8B%E8%BF%87.meta.js
// ==/UserScript==

(function() {
  'use strict';
  setInterval(function() {
    if (document.body.innerHTML.includes("Please take a rest.")) {
      location.reload();
    }
  }, 1000);
  var successTag = document.querySelector('.tag.is-success.is-light');
  if (successTag) {
    window.close();
  } else {
    setTimeout(function() {
      simulateClick(document.getElementById('review-watched'));
      setTimeout(function() {
        waitForElement('.review-submit-btn input[type="submit"][value="保存"]', function(saveButton) {
          simulateClick(saveButton);
          setTimeout(function() {
            var successTag = document.querySelector('.tag.is-success.is-light');
            if (successTag) {
              window.close();
            } else {
              runScript();
            }
          }, 500);
        }, function() {
          runScript();
        });
      }, 500);
    }, 0);
  }
  function simulateClick(element) {
    var event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    element.dispatchEvent(event);
  }
  function waitForElement(selector, successCallback, failureCallback) {
    var element = document.querySelector(selector);
    if (element) {
      successCallback(element);
    } else {
      setTimeout(function() {
        waitForElement(selector, successCallback, failureCallback);
      }, 100);
    }
  }
  function runScript() {
    setTimeout(function() {
      window.location.reload();
    }, 1000);
  }
})();