// ==UserScript==
// @name         Wider Aviator
// @namespace    http://prantlf.me/
// @version      1.1
// @description  Set the width of the Aviator sidebar to ${width}.
// @author       prantlf@gmail.com
// @match        https://otcs.dev.ollie.opentext.ai/cs/cs/*
// @match        https://ollie.opentext.ai/cs/cs/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507688/Wider%20Aviator.user.js
// @updateURL https://update.greasyfork.org/scripts/507688/Wider%20Aviator.meta.js
// ==/UserScript==

// based on https://greasyfork.org/en/scripts/408637-tall-tiles-in-ollie/
(function () {
  'use strict'

  function addStyle (content) {
    const element = document.createElement('style')
    element.type = 'text/css'
    element.innerHTML = content
    element.setAttribute('data-csui-theme-overrides', 'true')
    document.head.appendChild(element)
  }

  const width = '680px';

  addStyle(`
.binf-widgets .csui-sidepanel.aie-chat-panel .aie-viewer {
  width: calc(100% - ${width});
  inset-inline-end: ${width};
}

.binf-widgets .aie-chat-messages::before {
  width: calc(${width} - 23px + var(--aie-scrollbar-width, 16px) - 24px + 11px);
}

@supports (-moz-appearance:none) {
  .binf-widgets .aie-chat-messages::before {
    width: calc(${width} - 23px + var(--aie-scrollbar-width, 16px) - 24px + 18px);
  }
}

.binf-widgets .aie-chat-post .aie-chat-text .aie-plain {
  max-width: calc(${width} - 24px - 48px - 16px - 16px - 7px - 16px);
}

.binf-widgets .aie-chat-prompt::after {
  width: calc(${width} - 16px - 49px + 24px + 16px + 3px);
}

.binf-widgets .aie-chat-panel .csui-sidepanel-container {
  width: ${width};
  max-width: ${width};
  min-width: ${width};
}
`)
}());
