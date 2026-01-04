// ==UserScript==
// @name            Reddit replace new favicon with old
// @namespace       https://greasyfork.org/users/821661
// @match           https://www.reddit.com/*
// @match           https://sh.reddit.com/*
// @match           https://new.reddit.com/*
// @match           https://old.reddit.com/*
// @grant           GM_addStyle
// @version         1.0
// @author          hdyzen
// @description     reddit replace new favicon with new
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/486274/Reddit%20replace%20new%20favicon%20with%20old.user.js
// @updateURL https://update.greasyfork.org/scripts/486274/Reddit%20replace%20new%20favicon%20with%20old.meta.js
// ==/UserScript==
'use strict';

const favicons = document.querySelectorAll('[rel*="icon"]');
favicons.forEach(favicon => favicon.setAttribute('href', `//web.archive.org/web/20230312000109im_/${favicon.href}`));

GM_addStyle(`._30BbATRhFv3V83DHNDjJAO { background-image: url('https://raw.githubusercontent.com/zenstorage/others/main/reddit.webp') !important; background-position: left !important; background-size: 80% !important; background-repeat: no-repeat !important; & svg { opacity: 0 !important; } } ._30BbATRhFv3V83DHNDjJAO > svg { visibility: hidden !important; }`);
