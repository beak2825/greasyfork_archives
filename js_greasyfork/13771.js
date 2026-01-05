// ==UserScript==
// @name        Reddit NP
// @namespace   pudds.reddit
// @version     0.1
// @description Change the language back to avoid NP styling
// @author      pudds
// @match       http://np.reddit.com/*
// @match       https://np.reddit.com/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13771/Reddit%20NP.user.js
// @updateURL https://update.greasyfork.org/scripts/13771/Reddit%20NP.meta.js
// ==/UserScript==
'use strict';

var preferred_lang = 'en-us'; // Change this if you want a different language.  
                              // View source from your reddit front page to find it if you're not sure what it should be.

document.getElementsByTagName("html")[0].setAttribute("lang", preferred_lang);