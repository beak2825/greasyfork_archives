// ==UserScript==
// @name        TUM Live Servus
// @namespace   TUM-Live-Addons
// @match       https://live.rbg.tum.de/*
// @grant       none
// @require     https://cdn.jsdelivr.net/gh/sizzlemctwizzle/GM_config@2207c5c1322ebb56e401f03c2e581719f909762a/gm_config.js
// @version     0.1.2
// @author      Max Lang
// @license     0BSD
// @description Uses Bavarian greeting on TUM Live.
// @downloadURL https://update.greasyfork.org/scripts/444361/TUM%20Live%20Servus.user.js
// @updateURL https://update.greasyfork.org/scripts/444361/TUM%20Live%20Servus.meta.js
// ==/UserScript==

/*
License (BSD Zero Clause License):
Copyright (C) 2022 by Max Lang
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR
CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

(function() {

  const style = document.createElement('style');
  style.textContent =
    '.tum-live-servus-error { color: #b22734; }\n' +
    'html.dark .tum-live-servus-error { color: #efa7c4; }';
  document.head.appendChild(style);

  function updateGreetings() {
    const funcStr = `"use strict"; return (${GM_config.get('GreetingFormat')});`;
    const greetingSupplier = new Function(funcStr)();

    document.querySelectorAll('.tum-live-servus-greeting').forEach(node => {
      try { node.replaceChildren(greetingSupplier(node.dataset.tumLiveServusName, node)); }
      catch (e) {
        console.error('Exception raised while evaluating format function:', funcStr, e);
        const p = document.createElement('p');
        const code = document.createElement('code');
        code.classList.add('tum-live-servus-error');
        code.textContent = e;
        p.append('Exception: ', code);
        node.replaceChildren(p);
      }
    });
  }

  const greetingFormatLabel = document.createElement('label')
  greetingFormatLabel.for = 'TUMLiveServusConfig_field_GreetingFormat';
  greetingFormatLabel.innerHTML =
    '<h3><b>Greeting Format:</b></h3>\n' +
    '<p>Any function-expression taking (up to) two arguments:\n' +
    '<ul><li>your <code>name</code></li><li>the DOM Node that contains the message (of dubious utility, probably don\'t modify this)</li></ul>\n' +
    'The function must return a string or a DOM Node that will become the message.</p>\n' +
    '<p><i>Evaluated in the global scope using <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval#never_use_eval!"><code>Function</code></a>.</i></p>';
  greetingFormatLabel.style.fontWeight = 'normal';
  
  GM_config.init({
    'id': 'TUMLiveServusConfig',
    'title': 'TUM Live Servus Config',
    'fields': {
      'GreetingFormat': {
        'label': greetingFormatLabel,
        'title': 'greeting format function-expression',
        'type': 'textarea',
        'default': 'function(name, node) { return `Servus ${name}, nice to see you!`; }'
      }
    },
    'events': {
      'save': () => updateGreetings(),
      'close': () => updateGreetings()
    },
    'css':
      '* { font-family: system-ui !important; }\n' +
      '.config_var > .block { font-family: monospace !important; max-width: 100%; width: 100%; height: 18em; }'
  });

  document.querySelectorAll('p').forEach(node => {
    const match = node.innerText.match(/(?:Moin|Servus) (.*), nice to see you!/);
    if (match) {
      node.classList.add('tum-live-servus-greeting');
      node.dataset.tumLiveServusName = match[1];
      node.addEventListener('click', () => GM_config.open());
    }
  });

  updateGreetings();

})();
