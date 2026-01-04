// ==UserScript==
// @name         屏蔽百度贴吧笔记本吧关于游戏本的帖子
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  屏蔽贴吧笔记本吧关于游戏本的帖子
// @author       zjsxwc
// @match        http://tieba.baidu.com/f?*kw=%E7%AC%94%E8%AE%B0%E6%9C%AC*
// @match        https://tieba.baidu.com/f?*kw=%E7%AC%94%E8%AE%B0%E6%9C%AC*
// @grant        none
// @locale       zh-CN
// @downloadURL https://update.greasyfork.org/scripts/31900/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%AC%94%E8%AE%B0%E6%9C%AC%E5%90%A7%E5%85%B3%E4%BA%8E%E6%B8%B8%E6%88%8F%E6%9C%AC%E7%9A%84%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/31900/%E5%B1%8F%E8%94%BD%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E7%AC%94%E8%AE%B0%E6%9C%AC%E5%90%A7%E5%85%B3%E4%BA%8E%E6%B8%B8%E6%88%8F%E6%9C%AC%E7%9A%84%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==

(function() {
    
    var blackList = [
       "拯救者","lol","dota","暗影","战神","暗夜","堡垒","机械革命","gtx","跑分","守望","R720","r720","DNF","dnf","使命","革命","外星人"
    ];
    var isStrHasBlackList = function (str){
        for (var i=0;i<blackList.length;i++){
            var black = blackList[i];
            if (str.lastIndexOf(black) !== -1){
                return true;
            }
        }
        return false;
    };
    
    var tryTimes = 0;
    var h = setInterval(function(){
        
        if (tryTimes > 10) {
            console.log("stop");
            clearInterval(h);
            return;
        }
        var allThreadTitle = $(".threadlist_title a").toArray();
        if (allThreadTitle.length == 0) {
            return;
        }
        allThreadTitle.forEach(function(threadTitle){
            var title = threadTitle.textContent;
            var thread = threadTitle.parentElement.parentElement.parentElement.parentElement.parentElement;
            var abs = "";
            if (thread.getElementsByClassName("threadlist_text")[0]) {
                var threadAbs = thread.getElementsByClassName("threadlist_text")[0];
                abs = threadAbs.textContent;
            }
            
            if (isStrHasBlackList(title)||isStrHasBlackList(abs)) {
                //console.log("remove",title,abs);
                thread.remove();
            }
            
        });
        tryTimes++;
    },666);
    
})();