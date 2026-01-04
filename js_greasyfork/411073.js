// ==UserScript==
// @name                Disable Zhihu Login Modal Window
// @description         Propagate the scroll event globally to block the script from running.

// @author              Edward Sinos
// @namespace           https://47.rs/zhihu/login-modal
// @license             GPL-3.0
// @icon                https://pic1.zhimg.com/2e33f063f1bd9221df967219167b5de0_m.jpg

// @grant               none
// @run-at              document-start
// @include             *.zhihu.com/*

// @date                09/09/2020
// @modified            09/09/2020
// @version             0.1.0
// @downloadURL https://update.greasyfork.org/scripts/411073/Disable%20Zhihu%20Login%20Modal%20Window.user.js
// @updateURL https://update.greasyfork.org/scripts/411073/Disable%20Zhihu%20Login%20Modal%20Window.meta.js
// ==/UserScript==

document.addEventListener('scroll', e => e.stopPropagation())