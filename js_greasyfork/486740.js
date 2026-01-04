// ==UserScript==
// @name         替换 acg.tv 为有效蓝链并激活更多网址
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  将 B 站简介的 acg.tv 替换为有效蓝链，并可以将简介中的非官方链接转化为蓝链。
// @author       坏枪
// @match        https://www.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486740/%E6%9B%BF%E6%8D%A2%20acgtv%20%E4%B8%BA%E6%9C%89%E6%95%88%E8%93%9D%E9%93%BE%E5%B9%B6%E6%BF%80%E6%B4%BB%E6%9B%B4%E5%A4%9A%E7%BD%91%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/486740/%E6%9B%BF%E6%8D%A2%20acgtv%20%E4%B8%BA%E6%9C%89%E6%95%88%E8%93%9D%E9%93%BE%E5%B9%B6%E6%BF%80%E6%B4%BB%E6%9B%B4%E5%A4%9A%E7%BD%91%E5%9D%80.meta.js
// ==/UserScript==

// 2024.5.27 批注: 为节省资源，已经不再使用 s.otm.ink 链接。

(function() {
    'use strict';
    const web_re = /(?<!(\>|'|"|\/))(http:\/\/|https:\/\/|www\.)[^(\s,;())]+/g;

    let obs = new MutationObserver(push);
    let config = { attributes: true, childList: true, subtree: true };
    function rep(text,target,obj){
        if(text.includes(target)){
            text = text.replaceAll(target,obj)
        }
        console.log(`一项 ${target} 已替换为 ${obj}`);
        return text;
    }
    function push(){
        // 替换原本的 acg.tv
        let item = document.getElementsByTagName("a"); // 跳转链接通常都在 <a> 标签中，因此获取全部 <a> 标签进行替换。
        for(let i = 0;i < item.length;i++){
            let one = item[i];
            if(one.href.includes("acg.tv")){
                if(one.href.includes("sm")){
                    one.href = one.href.replace("acg.tv","nicovideo.jp/watch");
                }
                console.log("一项 acg.tv 已替换。");
            }
        }
        // 激活网址为 <a> 标签
        let sitem = document.getElementsByClassName("desc-info-text")[0]
        for( let sm of sitem.innerHTML.matchAll(web_re)){
            // 补救措施，中止判断。
            if(sm[0].slice(-2) == "<a"){
                continue
            }
            let link = sm[0].includes("http") ? sm[0] : `http://${sm[0]}`;
            sitem.innerHTML = sitem.innerHTML.replace(sm[0],`<a href='${link}' target='_blank'>${sm[0]}</a>`)
        }
    }
    obs.observe(document.getElementsByTagName('title')[0], config); // 监听 B 站视频的标题变化以实现执行。
})();