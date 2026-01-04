// ==UserScript==
// @name         缩小产品
// @namespace    https://poshmark.com
// @version      0.1
// @description  try to take over the world!
// @author       shenchaohuang
// @match        https://poshmark.com/closet/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/407561/%E7%BC%A9%E5%B0%8F%E4%BA%A7%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/407561/%E7%BC%A9%E5%B0%8F%E4%BA%A7%E5%93%81.meta.js
// ==/UserScript==

GM_addStyle ( `

.card--small{padding:0 !important}.tile__covershot,.item__details,.tile__creator,.social-action-bar__like,.social-action-bar__comment{display:none !important}.tile__social-actions{border:none !important;padding:0 !important;margin:0 !important}.tile{width:2%  !important;padding:0  !important}

` );