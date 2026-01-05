// ==UserScript==
// @name         CNKI Search Page Fix
// @namespace    http://ext.ccloli.com
// @version      0.1
// @description  修复知网搜索页面不显示标题的问题
// @include      http://epub.cnki.net/kns/brief/brief.aspx*
// @match        http://epub.cnki.net/kns/brief/brief.aspx*
// @author       864907600cc
// @icon         http://1.gravatar.com/avatar/147834caf9ccb0a66b2505c753747867
// @run-at       document-end
// @grant        none
// @namespace    http://ext.ccloli.com
// @downloadURL https://update.greasyfork.org/scripts/10901/CNKI%20Search%20Page%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/10901/CNKI%20Search%20Page%20Fix.meta.js
// ==/UserScript==

jQuery('.fz14').each(function(){$(this).find('script').length > 0&&$(this).html($(this).find('script').text().match(/ReplaceJiankuohao\(\'([\s\S]+?)\'\)\)/)[1])})