// ==UserScript==
// @name      Microsoft Teams web client highlight
// @name:ja   Microsoft Teams Webクライアントのハイライト表示
// @namespace proyuki02
// @version   4
// @license   MIT
// @grant     none
// @match     https://teams.microsoft.com/*
// @require   http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @require   https://cdnjs.cloudflare.com/ajax/libs/favico.js/0.3.10/favico.min.js
// @description This highlights unread messages in the Microsoft Teams Web client.
// @description:ja This highlights unread messages in the Microsoft Teams Web client.
// @downloadURL https://update.greasyfork.org/scripts/378604/Microsoft%20Teams%20web%20client%20highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/378604/Microsoft%20Teams%20web%20client%20highlight.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) { return; }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = css;
  head.appendChild(style);
}

// unread team
addGlobalStyle('.channel-list-team-header a.unread { background-color: rgba(255,182,193,0.5); }');

// unread channel
addGlobalStyle('.ts-channel-list a.ts-unread-channel { background-color: rgba(255,182,193,0.5); }');

// unread message
addGlobalStyle('.mod-unread-message-list-item > div, .mod-unread-message-list-item~.item-wrap.ts-message-list-item > div { background-color: rgba(255,182,193,0.5) !important; }');

(function(){
  var favicon = new Favico({ animation: 'slide' });
  var preCount;
  setInterval(function(){
    // notification badge
    var count = Number($(".activity-badge-container .activity-badge").text());
    if (preCount !== count) {
      preCount = count;
      favicon.badge(count);
    }

    // unread message
    $(".item-wrap.ts-message-list-item:has(.message-list-divider[data-tid='lastReadLine']:not(.ng-hide))").addClass("mod-unread-message-list-item");
  }, 1000);
})();
