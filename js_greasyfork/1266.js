// ==UserScript==
// @name Alibaba Neiwai Helper
// @namespace Ali-NW-Helper
// @description A helper utility for Ali-Neiwai
// @include https://ehr.alibaba-inc.com/employee/empInfo.htm*
// @match https://ehr.alibaba-inc.com/employee/empInfo.htm*
// @version 1.1
// @downloadURL https://update.greasyfork.org/scripts/1266/Alibaba%20Neiwai%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/1266/Alibaba%20Neiwai%20Helper.meta.js
// ==/UserScript==

//noinspection ThisExpressionReferencesGlobalObjectJS
(function(window) {
  'use strict';
  var document = window.document;

  var apiBaseUrl='https://work.alibaba-inc.com/work/xservice/suggestionSearch.jsonp?itemNumbers=5&condition=';

  var emitEvent = function (evtName, data) {
    document.dispatchEvent(new CustomEvent(evtName, {'detail': data}));
  };

  var jsonpInitEvt = 'jsonpInit' + String(Math.random()).slice(2);
  var getJSONP = function (url, callback) {
    var uniqName = 'jQuery' + String(Math.random()).slice(2) + '_' + Date.now();
    emitEvent(jsonpInitEvt, {
      'url': url,
      'callbackName': uniqName,
    });
    document.addEventListener(uniqName, function cb (evt) {
      document.removeEventListener(uniqName, cb);
      callback(evt.detail);
    }, false);
  };

  var init = function (callback) {
    var scriptEl = document.createElement('script');
    var scriptContent = '(' + (function (evtName) {
      document.addEventListener(evtName, function (evt) {
        if (!evt.detail) return;
        var detail = evt.detail;
        var url = detail.url;
        var callbackName = detail.callbackName;
        if (!url || !callbackName) return;
        var tmpEl = document.createElement('script');
        tmpEl.src = url + (url.lastIndexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
        document.body.appendChild(tmpEl);
        window[callbackName] = function (data) {
          tmpEl.parentNode.removeChild(tmpEl);
          tmpEl = null;
          delete window[callbackName];
          document.dispatchEvent(new CustomEvent(callbackName, {'detail': data}));
        };
        setTimeout(function () {
          tmpEl && tmpEl.parentNode.removeChild(tmpEl);
        }, 5000);
      }, false);
      document.dispatchEvent(new CustomEvent(evtName, {'detail': window['InfoConfig']}));
    }).toString() + ')(\'' + jsonpInitEvt + '\');';
    document.addEventListener(jsonpInitEvt, function cb (evt) {
      document.removeEventListener(jsonpInitEvt, cb);
      callback(evt.detail);
    });
    document.body.appendChild(scriptEl);
    scriptEl.appendChild(document.createTextNode(scriptContent));
  };
  var onReady = function() {
    init(function (infoConfig) {
      if (!infoConfig || infoConfig['workNo'] === infoConfig['myWorkNo']) return;
      var workNo = infoConfig['workNo'].replace(/^0+/g, '');
      var url = apiBaseUrl + workNo + '&_=' + Date.now();
      getJSONP(url, function (data) {
        var results = data['content']['items']['all_results']['person']['results'];
        var thisPerson = results.filter(function (person) {
          return person['emplId'] == workNo;
        })[0];
        if (!thisPerson) return;
        var jobLevel = thisPerson['jobLevel'];
        Array.prototype.forEach.call(document.querySelectorAll('#main .info-list li'), function (liEl) {
          var lblEl = liEl.querySelector('label');
          if (!lblEl) return;
          var label = lblEl.textContent.replace(/[ 　：]+/g, '');
          switch (label) {
            case '职位':
              liEl.querySelector('div.area-box').innerHTML += '(' + jobLevel + ')';
              break;
            case '分机':
            case '手机':
              var phoneA = liEl.querySelector('div.area-box a');
              phoneA.setAttribute('data-number', phoneA.getAttribute('data-number').replace(/[^0-9]+/g, ''));
              break;
          }
        });
      });
    });
  };
  if (document.readyState !== "loading") {
    onReady();
  }
  else {
    document.addEventListener('DOMContentLoaded', onReady, false);
  }
})(this);