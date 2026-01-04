// ==UserScript==
// @name         WeServe-Sobot-AutoRefresh
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  AutoRefresh in 30 min
// @author       You
// @match        https://www.soboten.com/online/agent*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460647/WeServe-Sobot-AutoRefresh.user.js
// @updateURL https://update.greasyfork.org/scripts/460647/WeServe-Sobot-AutoRefresh.meta.js
// ==/UserScript==
        var time = 10*60*1000;
    var status = 0;
    var mousex, mousey;
    function refresh(){
        if(status==0){
        window.location.reload()
        }
        else{
        status = 0;
        }
    }
(function() {
    window.onbeforeunload = function(e) {
            return null; }
        document.onkeydown = function(e){
	    status = 1;}
    document.onmousemove = function(e){
	var e = e || window.event;
        if(e.pageX || e.pageY){
		var ex = e.pageX;
		var ey = e.pageY;
	}else{
		var ex = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
		var ey = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
	}
	if(ex != mousex || ey != mousey){
		status = 1;
	}
	mousex = ex;
	mousey = ey;
}
document.onscroll = function(){
	status = 1;
}
        setInterval(refresh,time);//指定秒刷新一次
    // Your code here...
})();