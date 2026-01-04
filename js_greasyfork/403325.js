// ==UserScript==
// @name         拒绝新开窗口打开
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  小白自用拒绝新开窗口打开
// @author       You
// @match        http://tampermonkey.net/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403325/%E6%8B%92%E7%BB%9D%E6%96%B0%E5%BC%80%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/403325/%E6%8B%92%E7%BB%9D%E6%96%B0%E5%BC%80%E7%AA%97%E5%8F%A3%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function () {
  timer = setTimeout(onSub, 1);
}) ();
function onSub() {
	$("*").find("a").each(function(){
	$(this).attr('target','_self');})
}