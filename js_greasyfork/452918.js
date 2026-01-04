// ==UserScript==
// @name         Kiwi bullshit
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Kiwi upgrade
// @author       csaba.leitner
// @match        https://kiwi.webvalto.hu/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webvalto.hu
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/452918/Kiwi%20bullshit.user.js
// @updateURL https://update.greasyfork.org/scripts/452918/Kiwi%20bullshit.meta.js
// ==/UserScript==

const CORSViaGM = document.body.appendChild(Object.assign(document.createElement('div'), { id: 'CORSViaGM' }));

addEventListener('fetchViaGM', e => GM_fetch(e.detail.forwardingFetch));

CORSViaGM.init = function (window) {
  if (!window) throw 'The `window` parameter must be passed in!'
  window.fetch = window.fetchViaGM = fetchViaGM.bind(window)

  // Support for service worker
  window.forwardingFetch = new BroadcastChannel('forwardingFetch')
  window.forwardingFetch.onmessage = async e => {
    const req = e.data
    const { url } = req
    const res = await fetchViaGM(url, req)
    const response = await res.blob()
    window.forwardingFetch.postMessage({ type: 'fetchResponse', url, response })
  }

  window._CORSViaGM && window._CORSViaGM.inited.done()

  const info = '🙉 CORS-via-GM initiated!'
  console.info(info)
  return info
}


function GM_fetch(p) {
  GM_xmlhttpRequest({
    ...p.init,
    url: p.url, method: p.init.method || 'GET',
    onload: responseDetails => p.res(new Response(responseDetails.response, responseDetails))
  })
}

function fetchViaGM(url, init) {
  let _r
  const p = new Promise(r => _r = r)
  p.res = _r
  p.url = url
  p.init = init || {}
  dispatchEvent(new CustomEvent('fetchViaGM', { detail: { forwardingFetch: p } }))
  return p
}

let isEnabled = false;

function createBullshit(textArea) {
    fetch('https://itbullshit.fps.hu/api.php')
        .then((response) => {
        return response.json();
    })
        .then((content) => {
        textArea.value = content.bullshit;
        textArea.disabled = true;
    });
}

function runScript(textArea) {
    if (textArea.value == '') {
        createBullshit(textArea);
    }
}

function setButtonEnabled(state) {
    document.querySelector('#more-bullshit').style.display = state ? 'inline-block' : 'none';
}

function init(textArea) {
    let toggleBox = document.createElement('input');
    toggleBox.setAttribute("type", "checkbox");
    toggleBox.id = 'do-bullshiet';
    toggleBox.style.marginTop = '60px';
    toggleBox.addEventListener('change', function() {
        isEnabled = this.checked;
        setButtonEnabled(isEnabled);
        if (!isEnabled) {
            textArea.disabled = false;
            textArea.value = '';
        }
    });
    toggleBox.checked = isEnabled;

    let label = document.createElement('label');
    label.setAttribute("for", "do-bullshiet");
    label.innerHTML = 'Bullshit';

    let button = document.createElement('button');
    button.id = 'more-bullshit';
    button.textContent = 'Még';
    button.style.marginLeft = '10px';
    button.style.marginTop = '50px';
    button.addEventListener('click', function() {
        if (isEnabled) {
            createBullshit(textArea);
        }
    });

    textArea.parentElement.insertBefore(button, textArea.nextSibling);
    textArea.parentElement.insertBefore(label, textArea.nextSibling);
    textArea.parentElement.insertBefore(toggleBox, textArea.nextSibling);

    setButtonEnabled(isEnabled);
}

function iterativeCall() {
    let textArea = document.querySelector('textarea');
    if (textArea) {
        if (!textArea.classList.contains('marked')) {
            textArea.classList.add('marked');

            init(textArea);
        }
        if (isEnabled) {
            runScript(textArea);
        }
    }
    window.setTimeout(iterativeCall, 500);
}

(function() {
    'use strict';

    CORSViaGM.init(window);
    iterativeCall();

    // Your code here...
})();