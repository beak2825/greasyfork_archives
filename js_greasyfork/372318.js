// ==UserScript==
// @name 知乎 - 拒绝新版首页（推荐/关注/热榜）
// @description 如题
// @namespace   ModifyNewHomepage@Zhihu
// @version 0.5
// @author einheria
// @match *://www.zhihu.com
// @match *://www.zhihu.com/follow
// @downloadURL https://update.greasyfork.org/scripts/372318/%E7%9F%A5%E4%B9%8E%20-%20%E6%8B%92%E7%BB%9D%E6%96%B0%E7%89%88%E9%A6%96%E9%A1%B5%EF%BC%88%E6%8E%A8%E8%8D%90%E5%85%B3%E6%B3%A8%E7%83%AD%E6%A6%9C%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/372318/%E7%9F%A5%E4%B9%8E%20-%20%E6%8B%92%E7%BB%9D%E6%96%B0%E7%89%88%E9%A6%96%E9%A1%B5%EF%BC%88%E6%8E%A8%E8%8D%90%E5%85%B3%E6%B3%A8%E7%83%AD%E6%A6%9C%EF%BC%89.meta.js
// ==/UserScript==

//参考了aviraxp的做法：https://www.zhihu.com/question/295161863/answer/493960443

(function() {
    var src = location.href.split("/");
    if(src[2] =="www.zhihu.com" && !src[3]){
        var toSrc = "https://www.zhihu.com/follow";
        location.href = toSrc;
    }
	document.getElementsByTagName('ul')[1].style.display = 'none';
	document.getElementsByClassName('PageHeader')[0].remove();
    setInterval(function(){
        document.getElementsByClassName('Sticky AppHeader is-fixed is-hidden')[0].className = "Sticky AppHeader is-fixed"
    },100);
})(window);