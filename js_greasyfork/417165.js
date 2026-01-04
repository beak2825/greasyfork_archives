// ==UserScript==
// @name        知乎免登陆12月1号
// @match       *://*zhihu*/*
// @include       *://*zhihu*/*
// @grant       none
// @version     2.0
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.3.1/jquery.js
// @author      https://github.com/doglex
// @run-at document-end
// @description 2020/11/30 下午11:37:13
// @namespace https://greasyfork.org/users/710655
// @downloadURL https://update.greasyfork.org/scripts/417165/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E9%99%8612%E6%9C%881%E5%8F%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/417165/%E7%9F%A5%E4%B9%8E%E5%85%8D%E7%99%BB%E9%99%8612%E6%9C%881%E5%8F%B7.meta.js
// ==/UserScript==
console.log("免登陆功能已安装")
setInterval( () =>{
        $(".Modal-wrapper").remove()
        $(".Modal-enter-done").remove()
        document.documentElement.style.overflow='auto'
    }, 1000
)

