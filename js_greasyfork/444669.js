// ==UserScript==
// @name         More Links in Scratch
// @namespace    Hans5958
// @version      1
// @description  Adds links of third-party websites (that is not linked) on Scratch. (Deprecated: Use Scratch Addons instead.)
// @copyright    Hans5958
// @license      MIT
// @match        http*://scratch.mit.edu/users/*
// @match        http*://scratch.mit.edu/projects/*
// @match        http*://scratch.mit.edu/studios/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jQuery-linkify/2.1.8/linkify.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jQuery-linkify/2.1.8/linkify-jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// @homepageURL  https://github.com/Hans5958/userscripts
// @supportURL   https://github.com/Hans5958/userscripts/issues
// @downloadURL https://update.greasyfork.org/scripts/444669/More%20Links%20in%20Scratch.user.js
// @updateURL https://update.greasyfork.org/scripts/444669/More%20Links%20in%20Scratch.meta.js
// ==/UserScript==

$('p').linkify()
$('div').linkify()