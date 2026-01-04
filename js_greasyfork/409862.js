// ==UserScript==
// @name         知乎链接直接跳转
// @namespace    https://greasyfork.org/
// @version      0.2
// @description  去除知乎链接跳转提示，点击链接直接跳转网页
// @author       JMRY
// @match        https://*.zhihu.com/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/409862/%E7%9F%A5%E4%B9%8E%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/409862/%E7%9F%A5%E4%B9%8E%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

function getRealHref(href){
    try{
        if(href.startsWith(`https://link.zhihu.com/?target=`)){
            //仅针对link.zhihu.com做跳转，其他不变
            let href_real=href.split(`?target=`)[1];
            return decodeURIComponent(href_real);
        }else{
            return href;
        }
    }catch(e){
        return href;
    }
}

(function() {
    setInterval(()=>{
        //对新出现的内容，每秒刷新一次a标签的链接
        let a=$(`a`);
        for(let i=0; i<a.length; i++){
            let cur_a=a.eq(i);
            let cur_href=cur_a.attr(`href`);
            if(cur_href){
                cur_a.attr(`href`,getRealHref(cur_href));
            }
        }
    },1000);
})();