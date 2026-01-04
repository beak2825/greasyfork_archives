// ==UserScript==
// @name            Pinterest help
// @description     Display the pin number outside the homepage, requires a business account.
// @description:vi  Hiển thị số pin ra ngoài trang chủ, yêu cầu tài khoản doanh nghiệp.
// @namespace       https://hhoangg.github.io
// @match           https://*.pinterest.*/*
// @match           https://www.pinterest.co.uk/*
// @icon            https://i.imgur.com/7jSswHh.png
// @grant           none
// @version         1.3
// @author          hhoangg
// @supportURL      https://github.com/hhoangg/Usercript/issues
// @run-at          document-idle
// @grant           GM.xmlHttpRequest
// @grant           GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/392988/Pinterest%20help.user.js
// @updateURL https://update.greasyfork.org/scripts/392988/Pinterest%20help.meta.js
// ==/UserScript==

(function() {
  'use strict';

  HTMLCollection.prototype.forEach = Array.prototype.forEach;
  NodeList.prototype.forEach = Array.prototype.forEach;

  document.head.insertAdjacentHTML(
    'beforeend',
    `<style>
      ._myPin {
        background: rgb(228, 73, 33);
        position: absolute;
        padding: 10px;
        color: white;
        z-index: 9999;
        border-radius: 22px;
        margin-top: 10px;
        margin-left: 20px;
        box-shadow: rgb(68, 68, 68) 0px 0px 8px 0px;
        font-size: 1.5em;
      }
      .color-white{
        color: white;
        margin-right: 5px;
      }
    </style>`
  );

  let $html, pin, DOMPin;
  let parser = new DOMParser();
  const seconList = document.body;
  const listPin = [];

  const createElementFromHTML = htmlString => {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
  };

  const reRenderPin = (element, pin) => {
    if (!pin) return;
    DOMPin = document.createElement('SPAN');
    DOMPin.appendChild(
      createElementFromHTML(
        `<svg class="gUZ color-white" height="16" width="16" viewBox="0 0 24 24" aria-label="Ghim" role="img"><path d="M18 13.5c0-2.22-1.21-4.15-3-5.19V2.45A2.5 2.5 0 0 0 17 0H7a2.5 2.5 0 0 0 2 2.45v5.86c-1.79 1.04-3 2.97-3 5.19h5v8.46L12 24l1-2.04V13.5h5z"></path></svg>`
      )
    );
    DOMPin.appendChild(document.createTextNode(pin));
    DOMPin.className = '_myPin';
    element.insertBefore(DOMPin, element.firstChild);
  };

  const renderPin = artChild => {
    let parent = artChild.parentElement.parentElement;
    let search = listPin.find(pin => pin.id === artChild.dataset.testPinId);
    if (search) {
      if (!parent.getElementsByClassName('_myPin').length) reRenderPin(parent, search.pinNumbers);
      return;
    }
    listPin.push({
      id: artChild.dataset.testPinId,
    });
    GM.xmlHttpRequest({
      url: `/pin/${artChild.dataset.testPinId}/`,
      method: 'GET',

      onload: response => {
        $html = parser.parseFromString(response.response, 'text/html');
        pin = $html.getElementsByClassName('Eqh l7T zI7 iyn Hsu')[0].textContent;
        reRenderPin(parent, pin);
        listPin.find(pin => pin.id === artChild.dataset.testPinId).pinNumbers = pin;
      },
    });
  };

  const addPinOnPost = () => {
    let AllPost = document.querySelectorAll('[data-test-pin-id]');
    if (!AllPost.length) return;
    AllPost.forEach(artChild => renderPin(artChild));
  };

  addPinOnPost();

  const observerConfig = {
    // attributes: true,
    childList: true,
    subtree: true,
  };

  const callback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
      if (mutation.type === 'childList') {
        if (mutation.target.className === 'vbI XiG') {
          mutation.target.querySelectorAll('[data-test-pin-id]').forEach(e => {
            renderPin(e);
          });
        }
      }
    }
  };

  const observer = new MutationObserver(callback);

  observer.observe(seconList, observerConfig);
})();
