// ==UserScript==
// @name        禁用淘口令 - jsons.cn
// @namespace   Violentmonkey Scripts
// @match       *://*.jsons.cn/*
// @include     *://*.jsons.cn/*
// @grant       none
// @version     1.2
// @author      -
// @description 2021/10/20上午10:34:12
// @downloadURL https://update.greasyfork.org/scripts/434160/%E7%A6%81%E7%94%A8%E6%B7%98%E5%8F%A3%E4%BB%A4%20-%20jsonscn.user.js
// @updateURL https://update.greasyfork.org/scripts/434160/%E7%A6%81%E7%94%A8%E6%B7%98%E5%8F%A3%E4%BB%A4%20-%20jsonscn.meta.js
// ==/UserScript==

window.setTimeout(function(){
  taokouling.destroy();
},1);