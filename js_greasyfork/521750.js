// ==UserScript==
// @name         xieying3D（Dev）
// @namespace    http://tampermonkey.net/
// @version      2025.4.13.1
// @description  try it
// @author       You
// @match        https://data-encoder.ruqimobility.com/tool/pc?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ruqimobility.com
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/521750/xieying3D%EF%BC%88Dev%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/521750/xieying3D%EF%BC%88Dev%EF%BC%89.meta.js
// ==/UserScript==

const resourceURL = 'https://www.coderming.top/resource2'
const link = document.createElement('link');
link.rel = 'preload';
link.href = resourceURL;
link.as = 'script';

const script = document.createElement('script');
script.src = resourceURL;
document.body.append(link, script);