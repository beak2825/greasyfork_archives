// ==UserScript==
// @name        BvS crane hotkeys
// @namespace   yichizhng@gmail.com
// @description Hotkeys for BvS Crane
// @include     http://*animecubed.com/billy/bvs/partyhouse.html
// @version     1.2
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/22275/BvS%20crane%20hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/22275/BvS%20crane%20hotkeys.meta.js
// ==/UserScript==

var setDiff = function(diff) {
  var diffElem = document.querySelector('input[name="cranepick"][value="' + diff + '"]');
  if (diffElem) {
    diffElem.checked = true;
  }
};

var submitted = false;

var play = function() {
  var selectedDiff = document.querySelector('[name="cranepick"]:checked');
  if (!selectedDiff) {
    return;
  }
  GM_setValue('diff', selectedDiff.value);
  if (submitted) return;
  submitted = true;
  document.cgame.submit();
};

var warned = false;

var kick = function() {
  if (/: Crane/.test(document.cgame.textContent)) {
    alert('Crane potion detected; are you sure you want to kick?');
    warned = true;
    return;
  }
  if (submitted) return;
  submitted = true;
  document.cgamek.submit();
};

var main = function() {
  if (!document.cgame) return;

  var lastDiff = GM_getValue('diff');
  if (lastDiff) {
    setDiff(lastDiff);
  }

  document.addEventListener('keyup', function(e) {
    switch (e.code) {
      case 'KeyD':
        play();
        break;
      case 'KeyK':
        kick();
        break;
      case 'KeyE':
        setDiff(1);
        break;
      case 'KeyM':
        setDiff(2);
        break;
      case 'KeyH':
        setDiff(3);
        break;
      case 'KeyS':
        setDiff(4);
        break;
    }
  });
};

main();