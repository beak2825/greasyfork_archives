// ==UserScript==
// @name        更好地一键开启github1s页面
// @namespace   github
// @author      cjm
// @description 更好地支持文件级用打开github1s
// @include     https://github.com/
// @match       https://github.com/*
// @version     4.1.0
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/454665/%E6%9B%B4%E5%A5%BD%E5%9C%B0%E4%B8%80%E9%94%AE%E5%BC%80%E5%90%AFgithub1s%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/454665/%E6%9B%B4%E5%A5%BD%E5%9C%B0%E4%B8%80%E9%94%AE%E5%BC%80%E5%90%AFgithub1s%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

function func() {
    setTimeout(()=>{
        const href = `https://github1s.com${location.pathname}`
        const ele1 = document.getElementById('wocao1');
        const ele2 = document.getElementById('wocao1');
        if(ele1 || ele2){
            ele1.href = href;
            ele2.href = href;
        }else{
            const btn1 = `<a id="wocao1" class="btn ml-2 d-none d-md-block" style="
    background: #f6f8fa;
    color: #2da44e;
    display: inline-block !important;
    /*width: 48%;*/
    text-align: center;
    /*margin: 5px;*/
    " target="_blank" href="${href}">` + '使用 github1s 打开(新窗口)' + '</a>'
            const btn2 = `<a id="wocao2" class="btn ml-2 d-none d-md-block" style="    background: #8c7ae6;
    background: #2da44e;
    color: #f6f8fa;
    display: inline-block !important;
    /*width: 48%;*/
    text-align: center;
    /*margin: 5px;*/
    " target="_self" href="${href}">` + '使用 github1s 打开(本页)' + '</a>'
            const parent = document.querySelector('div.AppHeader-context-full > nav');//.pagehead-actions   //#repository-container-header
            //parent?.insertAdjacentHTML('beforeBegin', btn1);
            parent?.insertAdjacentHTML('afterend', btn1);
            parent?.insertAdjacentHTML('afterend', btn2);
        }
    }
    , 1000)
}
func();

//修改native以拦截popstate事件
var pushState = history.pushState;
history.pushState = function() {
    var ret = pushState.apply(history, arguments);
    window.dispatchEvent(new Event("pushstate"));
    window.dispatchEvent(new Event("locationchangefathom"));
    return ret;
}

window.addEventListener("popstate", function() {
    window.dispatchEvent(new Event("locationchangefathom"))
});
window.addEventListener("locationchangefathom", trackPageview)
function trackPageview() {
    func();
}