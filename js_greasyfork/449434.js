// ==UserScript==
// @name 中键关闭页面
// @namespace tampermonkey.net/
// @version 0.3
// @description 中键页面任意位置即可关闭页面
// @author roseate
// @match *://*/*
// @match *
// @include *
// @run-at document-start
// @grant unsafeWindow
// @grant window.close
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449434/%E4%B8%AD%E9%94%AE%E5%85%B3%E9%97%AD%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/449434/%E4%B8%AD%E9%94%AE%E5%85%B3%E9%97%AD%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==



(



    function () {
    document.addEventListener("mousedown", function(mouseEvent) {
	if (mouseEvent.button != 1) {
		return;
	}
	mouseEvent.preventDefault();
	mouseEvent.stopPropagation();
});


document.addEventListener('auxclick', function (e) {
if (e.button == 1) {
    window.opener=null;
    window.open('','_self');
    setTimeout(function(){
        window.close();
    },1)
}
});
})();