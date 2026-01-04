// ==UserScript==
// @name         Quicker链接在新标签页打开
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Quicker动作库链接强制在新标签页打开
// @author       EC10010
// @license      MIT
// @match        *getquicker.net/Share/Actions*
// @match        *getquicker.net/Share/SubPrograms*
// @match        *getquicker.net/QA*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452793/Quicker%E9%93%BE%E6%8E%A5%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/452793/Quicker%E9%93%BE%E6%8E%A5%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==
document.body.addEventListener('mousedown', function (e) {
	e.target.target = '_blank';
    e.target.parentNode.target='_blank';
	e.target.parentNode.parentNode.target='_blank';
	e.target.parentNode.parentNode.parentNode.target='_blank';
	e.target.parentNode.parentNode.parentNode.parentNode.target='_blank';
})