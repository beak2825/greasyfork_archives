// ==UserScript==
// @name        TypeRacer Disable Browser Shortcuts
// @namespace   https://github.com/username-goes-here/
// @version     2.2.1
// @description Disables browser shortcuts that might mess you up on TypeRacer (e.g. Ctrl + s, Ctrl + o, etc.).
// @match       https://play.typeracer.com/*
// @grant       none
// @author      bread_lolis
// @license     GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/427812/TypeRacer%20Disable%20Browser%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/427812/TypeRacer%20Disable%20Browser%20Shortcuts.meta.js
// ==/UserScript==

/***** SETTINGS *****/
const DISABLE_NON_CTRL_KEYS = false;
/********************/

const ctrl_keys = ['s', 'o', 'p'];
const keys = DISABLE_NON_CTRL_KEYS
  ? ['Tab']
  : [];

document.onkeydown = key => {
  const is_ctrl_key = key.ctrlKey && ctrl_keys.includes(key.key);
  const is_key = keys.includes(key.code);
  const is_space = DISABLE_NON_CTRL_KEYS && key.code == 'Space' && key.target == document.body;

  if (is_ctrl_key || is_key || is_space)
    key.preventDefault();
};