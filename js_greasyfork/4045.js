// ==UserScript==
// @name        Kasi-time
// @namespace   https://twitter.com/akameco
// @description 不可能を可能にする
// @include     http://www.kasi-time.com/*
// @version     1.01
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4045/Kasi-time.user.js
// @updateURL https://update.greasyfork.org/scripts/4045/Kasi-time.meta.js
// ==/UserScript==

setTimeout(function() { 
  function selectText() {
    let el  = document.getElementById("lyrics");
    let rng = document.createRange();
    rng.selectNodeContents(el);
    window.getSelection().addRange(rng);
  }

  $('body').css('-moz-user-select','text');
  $('body').off('copy contextmenu selectstart');

  let button = $('<button>');
  button.text('選択').css({
    'margin': '10px 10px 0 0',
    'borderTop': '1px solid #ccc',
    'borderRight': '1px solid #999',
    'borderBottom': '1px solid #999',
    'borderLeft': '1px solid #ccc',
    'padding': '3px 12px',
    'cursor': 'pointer',
    'color': '#666'
  }).click(function () {
    selectText();
  });

  $('.lyrics_menu').append(button);
}, 10);
