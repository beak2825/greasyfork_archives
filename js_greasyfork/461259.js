// ==UserScript==
// @name         Hide ChatGPT Sidebar
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Hide the sidebar of the ChatGPT website
// @author       You
// @match        https://chat.openai.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=openai.com
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/461259/Hide%20ChatGPT%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/461259/Hide%20ChatGPT%20Sidebar.meta.js
// ==/UserScript==



(function() {
  'use strict';

  const leftPadElement = '#__next > div.overflow-hidden.w-full.h-full.relative > div.flex.h-full';
  const leftMenu = '#__next > div.overflow-hidden.w-full.h-full.relative > div.dark';

  let paddingLeft = $().css('padding-left');

  function show(){
    $(leftMenu).show();
    $(leftPadElement).css('padding-left', paddingLeft);
  }

  function hide(){
    $(leftMenu).hide();
    $(leftPadElement).css('padding-left', '0px');
  }

  hide();

  var $button = $("<button>").text("Toggle Sidebar").click(function(){
    if($(leftMenu).is(":visible")){
      hide();
    } else {
      show();
    }
  });

  $button.css({
    position: "absolute",
    top: "6px",
    right: "20px",
    'background-color': '#eeeee4',
    'border': 'none',
    'padding': '6px 12px',
    'text-align': 'center',
    'text-decoration': 'none',
    'font-size': '16px',
    'cursor': 'pointer',
    'border-radius': '5px',
    'box-shadow': '0 2px 5px rgba(0, 0, 0, 0.3)'
  });

  // Append the button to the UI element
  $("body").append($button);

})();
