// ==UserScript==
// @license MIT
// @name           Amazon Smile Redirect
// @namespace      petersamazonredict
// @description    Always redirects links the smile.amazon.com domain
// @match        https://amazon.com/*
// @match        http://amazon.com/*
// @match       https://www.amazon.com/*
// @match        http://www.amazon.com/*
// @match        https://amazon.de/*
// @match        http://amazon.de/*
// @match       https://www.amazon.de/*
// @match        http://www.amazon.de/*
// @match        https://amazon.co.jp/*
// @match        http://amazon.co.jp/*
// @match       https://www.amazon.co.jp/*
// @match        http://www.amazon.co.jp/*
// @match        https://amazon.co.uk/*
// @match        http://amazon.co.uk/*
// @match       https://www.amazon.co.uk/*
// @match        http://www.amazon.co.uk/*
// @version 0.0.1.20220917203158
// @downloadURL https://update.greasyfork.org/scripts/451545/Amazon%20Smile%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/451545/Amazon%20Smile%20Redirect.meta.js
// ==/UserScript==

window.location.host = "smile.amazon.co.uk";