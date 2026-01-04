// ==UserScript==
// @name         Bypass weixin110
// @namespace    ray@rayps.com
// @version      0.2
// @description  Bypass wechat url warning
// @author       Ray
// @license      MIT
// @match        https://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weixin.qq.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/452720/Bypass%20weixin110.user.js
// @updateURL https://update.greasyfork.org/scripts/452720/Bypass%20weixin110.meta.js
// ==/UserScript==

// eslint-disable-next-line no-eval
window.eval(document.querySelector('script').textContent)
const { type, desc, url } = window.cgiData
const encodedURL = type === 'gray' ? url : desc
const decode = new DOMParser().parseFromString(encodedURL, "text/html");
const decodedURL = decode.documentElement.textContent
window.location.replace(decodedURL)