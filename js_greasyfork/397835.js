// ==UserScript==
// @name         BetterAltervista
// @namespace    https://pizidavi.altervista.org/
// @version      2.1
// @description  Migliora Altervista.org
// @author       pizidavi
// @icon         https://www.google.com/s2/favicons?domain=https://altervista.org
// @require      https://cdn.jsdelivr.net/gh/soufianesakhi/node-creation-observer-js@edabdee1caaee6af701333a527a0afd95240aa3b/release/node-creation-observer-latest.min.js
// @match        https://*.altervista.org/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/397835/BetterAltervista.user.js
// @updateURL https://update.greasyfork.org/scripts/397835/BetterAltervista.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const url = location.origin;

  if (document.querySelector('li#user')) {
    const SID = getURLParam('sid');

    NodeCreationObserver.onCreation('#header > div > ul', function (element) {
      const TEMPLATE = '<li id="devmode"> <a href="/cloudflare.pl?sid='+SID+'"> <div><span class="font-icon icon-pencil"></span></div> <span id="devmode-span" class="nav-header-label">Dev-Mode</span> </a> </li><style>#devmode-span.on { font-size: 14px; font-weight: 700; }</style>'
      element.innerHTML += TEMPLATE;

      let devmode = undefined;
      let devmode_timeout = null;

      const _ = url+'/cloudflare.pl?sid='+SID;
      ajax(_, '', function(data){
        var el = document.createElement('html');
        el.innerHTML = data;

        const input = el.querySelector('#content > div > ul > li > div > div.widget-content > div > div > div > div:nth-child(2) > form > input[type=hidden]:nth-child(4)');
        devmode = (input.value == 'off' ? true : false);
        updateText(devmode);
      });

      document.querySelector('#devmode').onclick = function(e){
        e.preventDefault(); e.stopPropagation();
        if(devmode == undefined) return;

        const data = 'a=devmode&v='+(devmode ? 'off' : 'on');
        ajax(_, data, function(data){
          devmode = !devmode;
          updateText(devmode);

          clearTimeout(devmode_timeout);
          devmode_timeout = setTimeout(function(){
            devmode = !devmode;
            updateText(devmode);
          }, 10800000); // 3 ore
        });
      };
    });
  } else if (document.querySelector('#login')) {
    const _ = document.querySelector('#login > a').getAttribute('href');
    location.href = _;
  }


  // Function
  function updateText(mode) {
    const classList = document.querySelector('#devmode-span').classList;
    if(mode)
      classList.add('on');
    else
      classList.remove('on');
  }

  function ajax(url, data, success) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        success(this.responseText); }
    };
    xhttp.open('POST', url, true);
    xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhttp.send(data);
  }

  function getURLParam(param) {
    const url = new URL(window.location.href);
    return url.searchParams.get(param);
  }

})();