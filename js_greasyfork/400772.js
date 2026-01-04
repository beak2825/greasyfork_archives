// ==UserScript==
// @name            V2EX帖子新标签页打开
// @namespace       heiye9.com
// @description     V2EX帖子从新标签页打开
// @match           https://www.v2ex.com/**
// @version         1.0
// @downloadURL https://update.greasyfork.org/scripts/400772/V2EX%E5%B8%96%E5%AD%90%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/400772/V2EX%E5%B8%96%E5%AD%90%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

;(function(){
  $('.cell a').attr('target', '_blank')
})()