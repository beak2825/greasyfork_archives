// ==UserScript==
// @name         代码岛控制台开关监听
// @namespace    https://box3.codemao.cn/u/xvjiaming
// @version      0.1
// @description  检测控制台是否被打开
// @author       许嘉茗
// @match        https://box3.codemao.cn/*
// @match        https://box3.fun/*
// @icon         http://hbg.htkj365.com/static/media/mytj@2x.131cecdd.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453580/%E4%BB%A3%E7%A0%81%E5%B2%9B%E6%8E%A7%E5%88%B6%E5%8F%B0%E5%BC%80%E5%85%B3%E7%9B%91%E5%90%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/453580/%E4%BB%A3%E7%A0%81%E5%B2%9B%E6%8E%A7%E5%88%B6%E5%8F%B0%E5%BC%80%E5%85%B3%E7%9B%91%E5%90%AC.meta.js
// ==/UserScript==

(function() {
    var ConsoleManager={
    onOpen(){
        alert("有人打开了控制台！！！")
    },
    onClose(){
        alert("有人打开了控制台！！！")
    },
    init(){
        var self = this;
        var x = document.createElement('div');
        var isOpening = false,isOpened=false;
        Object.defineProperty(x, 'id', {
            get(){
                if(!isOpening){
                    self.onOpen();
                    isOpening=true;
                }
                isOpened=true;
            }
        });
        setInterval(function(){
            isOpened=false;
            console.info(x);
            console.clear();
            if(!isOpened && isOpening){
                self.onClose();
                isOpening=false;
            }
        },200)
    }
}

ConsoleManager.onOpen = function(){
    alert("有人打开了控制台！！！")
}
ConsoleManager.onClose = function(){
    alert("有人打开了控制台！！！")
}
ConsoleManager.init();

})();