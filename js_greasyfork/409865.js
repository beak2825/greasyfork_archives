// ==UserScript==
// @name         知乎自动显示全部回答
// @namespace    https://greasyfork.org/
// @version      0.2.1
// @description  滚动到页面底部时，自动显示全部回答
// @author       JMRY
// @match        https://*.zhihu.com/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/409865/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E5%9B%9E%E7%AD%94.user.js
// @updateURL https://update.greasyfork.org/scripts/409865/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E5%9B%9E%E7%AD%94.meta.js
// ==/UserScript==

function getFullQuestionHref(href){
    try{
        if(href.includes(`/answer/`)){
            return href.split(`/answer/`)[0];
        }else{
            return href;
        }
    }catch(e){
        return href;
    }
}

(function() {
    'use strict';
    setInterval(()=>{
        //对新出现的内容，每秒刷新一次a标签的链接
        let a=$(`a`);
        for(let i=0; i<a.length; i++){
            let cur_a=a.eq(i);
            let cur_href=cur_a.attr(`href`);
            if(cur_href){
                cur_a.attr(`href`,getFullQuestionHref(cur_href));
            }
        }
    },1000);
})();