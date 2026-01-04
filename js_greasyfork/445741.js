// ==UserScript==
// @name            Bitlaunch: Unlocks interface
// @name:ru         Bitlaunch: Разблокирует интерфейс
// @description     No valid email required for easy checks
// @description:ru  Для простой проверки не требуется действительный адрес электронной почты
// @namespace       bitlaunch-unlock-iface.user.js
// @license         WTFPL
// @author          askornot
// @match           https://app.bitlaunch.io/*
// @version         1.0.1
// @compatible      chrome     Violentmonkey 2.13.0
// @compatible      firefox    Greasemonkey  4.10.0
// @compatible      firefox    Tampermonkey  4.11.6120
// @homepageURL     https://greasyfork.org/en/scripts/445741-bitlaunch-unlocks-interface/
// @supportURL      https://greasyfork.org/en/scripts/445741-bitlaunch-unlocks-interface/feedback
// @run-at          document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/445741/Bitlaunch%3A%20Unlocks%20interface.user.js
// @updateURL https://update.greasyfork.org/scripts/445741/Bitlaunch%3A%20Unlocks%20interface.meta.js
// ==/UserScript==

(function (D) {
  'use strict';

  function remove(el) {
    if (el.parentNode) el.parentNode.removeChild(el);
  }

  const [ body ] = D.getElementsByClassName('modal-open');
  const [ backdrop ] = D.getElementsByTagName('bs-modal-backdrop');
  const [ container ] = D.getElementsByTagName('modal-container');

  if (body) body.removeAttribute('class');
  if (backdrop) remove(backdrop);
  if (container) remove(container);
})(document);
