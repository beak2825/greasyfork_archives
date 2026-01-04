// ==UserScript==
// @name         全网取消变灰
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  取消某些重大日期全网变灰的情况
// @author       wcx19911123
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pornhub.com
// @grant        none
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455690/%E5%85%A8%E7%BD%91%E5%8F%96%E6%B6%88%E5%8F%98%E7%81%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/455690/%E5%85%A8%E7%BD%91%E5%8F%96%E6%B6%88%E5%8F%98%E7%81%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const setting = {
        "tieba.baidu.com": [()=>document.querySelector("html.tb-allpage-filter"), o=>o?.classList?.remove("tb-allpage-filter")],
        "www.zhihu.com": [()=>{let o=document.querySelector("html head style");return o?.innerHTML.includes('grayscale')?o:null}, o=>o?.remove()],
        "www.bilibili.com": [()=>document.querySelector("html.gray"), o=>o?.classList?.remove("gray")],
        "weibo.com": [()=>document.querySelectorAll("div.grayTheme"), o=>o.forEach(p=>p?.classList?.remove("grayTheme"))],
        "www.miyoushe.com": [()=>document.querySelector('html').innerHTML.includes('grayscale(100%)'), ()=>{window.onload=()=>{let o = document.querySelector('html'); o.innerHTML = o.innerHTML.replaceAll('grayscale(100%)', 'grayscale(0%)')}}],
        "music.163.com": [()=>[...document.querySelectorAll('html head style')]?.filter(o=>o.innerHTML.match(/gray/g)?.length>3)?.shift(), o=>o.remove()]
    };
    const fix = function (){
        console.log(window.location.host);
        let func = setting[Object.keys(setting).filter(o=>window.location.host.endsWith(o))];
        console.log(func);
        if(typeof func == 'object' && func.length === 2){
            console.log('fix start');
            let now = new Date().getTime();
            let eventId = setInterval(function(){
                console.log('fixing');
                let obj = func[0]();
                if(obj){
                    clearInterval(eventId);
                    func[1](obj);
                    console.log('fix end');
                }
                if(new Date().getTime() - now >= 1000 * 60 * 1){
                    clearInterval(eventId);
                }
            },300);
        }
    };
    fix();
    // Your code here...
})();