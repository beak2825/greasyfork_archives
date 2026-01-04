// ==UserScript==
// @name         知乎移动页变网页
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       cmmdwl
// @match        *://*.zhihu.com/tardis/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420437/%E7%9F%A5%E4%B9%8E%E7%A7%BB%E5%8A%A8%E9%A1%B5%E5%8F%98%E7%BD%91%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/420437/%E7%9F%A5%E4%B9%8E%E7%A7%BB%E5%8A%A8%E9%A1%B5%E5%8F%98%E7%BD%91%E9%A1%B5.meta.js
// ==/UserScript==

(function() {



    var url = location.href; //声明变量url
    if (url.indexOf("/tardis/sogou/qus/") > 0) {//如果url里面搜索到了/tardis就继续执行
        var url1 = url.replace("/tardis/sogou/qus/", "/question/"); //替换掉tardis
        var url2 = url1.slice(url.indexOf("/tardis/sogou/qus/") + 1).split('/')
        // console.log(location.protocol+"//www.v2ex.com/t/"+url2[1])
        console.log("url 1 ok "+url1);
        console.log("url 2 ok "+url2);
        location.replace(url1); //直接输出 url1 结束了
        console.log(location.protocol+"/www.zhihu.com/"+url2[2]);
    }

    // Your code here...
})();