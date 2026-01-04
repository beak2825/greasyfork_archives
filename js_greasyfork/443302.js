// ==UserScript==
// @name 努努影院_蛋蛋赞_快进秒数
// @namespace DanDanZan
// @version 1.14
// @description 快进秒数_设置改为10秒_左右快进、空格暂停、上下音量_如果浏览器自带热键控制造成冲突可以在脚本菜单里关闭..
// @author noahyann
// @match https://www.ronghouhuanbao.com/*
// @match https://www.dandanzan.net
// @match https://www.dandanzan10.top
// @icon  https://www.google.com/s2/favicons?sz=64&domain=www.dandanzan.net
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_registerMenuCommand
// @grant GM_unregisterMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443302/%E5%8A%AA%E5%8A%AA%E5%BD%B1%E9%99%A2_%E8%9B%8B%E8%9B%8B%E8%B5%9E_%E5%BF%AB%E8%BF%9B%E7%A7%92%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/443302/%E5%8A%AA%E5%8A%AA%E5%BD%B1%E9%99%A2_%E8%9B%8B%E8%9B%8B%E8%B5%9E_%E5%BF%AB%E8%BF%9B%E7%A7%92%E6%95%B0.meta.js
// ==/UserScript==

let menuId = 0;
function updateMenu(){
    if(menuId == 0){
        if(GM_getValue("noPause")==1){
            menuId = GM_registerMenuCommand("空格暂停上下音量【关】",updateMenu);
        }else{
            menuId = GM_registerMenuCommand("空格暂停上下音量【开】",updateMenu);
        }
    }else{
        GM_unregisterMenuCommand(menuId);
        menuId = 0
        GM_setValue("noPause",GM_getValue("noPause")==1?0:1);
        updateMenu();
    }
}
updateMenu();

function new_timeupdate() {
	this.lastTime = this.currentTime;
}
function new_keydown(event) {
	var e = event || window.event;
	if (e) {
		//alert(e.keyCode);
        e.returnValue = false;

        if (e.keyCode == 37) {
			this.currentTime = this.lastTime-=10; // LEFT
		}
        else if (e.keyCode == 39) {
			this.currentTime = this.lastTime+=10; // RIGHT
		}
        if (GM_getValue("noPause") == 1){
            return;
        }
        if (e.keyCode == 32) {
            this.paused == true ? this.play():this.pause();// SAPCE
        }
        else if (e.keyCode == 38) {
            this.volume += 0.1; // UP
        }
        else if (e.keyCode == 40) {
            this.volume -= 0.1; // DOWN
        }
	}
}
(function(){
var g_VideoElement = document.getElementsByTagName("VIDEO");
for (var i=0,j=g_VideoElement.length;i<j;i++){
    g_VideoElement[i].ontimeupdate = new_timeupdate;
    g_VideoElement[i].onkeydown = new_keydown;
    g_VideoElement[i].lastTime = 0;
}
//HTMLVideoElement.prototype.onkeydown = new_keydown;
})();


