// ==UserScript==
// @name         知乎自动显示全部回答+链接直接跳转
// @namespace    https://greasyfork.org/
// @version      0.3
// @description  点击问题链接显示全部回答；去除知乎链接跳转提示，点击链接直接跳转网页
// @author       JMRY
// @match        https://*.zhihu.com/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/409866/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E5%9B%9E%E7%AD%94%2B%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/409866/%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E6%98%BE%E7%A4%BA%E5%85%A8%E9%83%A8%E5%9B%9E%E7%AD%94%2B%E9%93%BE%E6%8E%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

function getFullQuestionHref(href){
    try{
        if(href.includes(`/answer/`)){
            return href.split(`/answer/`)[0];
        }else{
            return href;
        }
    }catch(e){
        console.error(e);
        return href;
    }
}

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
        console.error(e);
        return href;
    }
}

function getHrefType(href){
    switch(true){
        case (href.includes(`/answer/`)):
            return `answer`;
        break;
        case (href.startsWith(`https://link.zhihu.com/?target=`)):
            return `link`;
        break;
        default:
            return null;
        break;
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
                switch(getHrefType(cur_href)){
                    case `answer`:
                        cur_a.attr(`href`,getFullQuestionHref(cur_href));
                    break;
                    case `link`:
                        cur_a.attr(`href`,getRealHref(cur_href));
                    break;
                }
            }
        }
    },1000);
})();