// ==UserScript==
// @name        TypeRacer Disable Browser Shortcuts
// @namespace   https://github.com/username-goes-here/
// @version     0.2
// @description Disables browser shortcuts that might mess you up on TypeRacer (e.g. Ctrl + s, Ctrl + o, etc.).
// @match       https://play.typeracer.com/*
// @grant       none
// @author      bread_lolis
// @license     GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/438223/TypeRacer%20Disable%20Browser%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/438223/TypeRacer%20Disable%20Browser%20Shortcuts.meta.js
// ==/UserScript==

const ctrl_keys = ['s', 'o', 'p', 'h', 'r'];

document.onkeydown = key => {
  const is_ctrl_key = key.ctrlKey && ctrl_keys.includes(key.key);
  const is_space = key.code == 'Space' && key.target == document.body;

  if (is_ctrl_key || is_space)
    key.preventDefault();
};