// ==UserScript==
// @name         Artstation Fullscreen
// @namespace    https://greasyfork.org/zh-CN/users/709496-wlm3201
// @version      0.3
// @description  全屏时移除顶部元素
// @author       wlm3201
// @match        https://www.artstation.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=artstation.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446213/Artstation%20Fullscreen.user.js
// @updateURL https://update.greasyfork.org/scripts/446213/Artstation%20Fullscreen.meta.js
// ==/UserScript==

 $(document).keydown(function(event){event.which==122? $(".sticky-block").toggle()&$("#main-nav").toggle() :0});