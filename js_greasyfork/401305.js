// ==UserScript==
// @name         牛客网 竞赛题目 显示通过百分比
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://ac.nowcoder.com/acm/contest/**
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/401305/%E7%89%9B%E5%AE%A2%E7%BD%91%20%E7%AB%9E%E8%B5%9B%E9%A2%98%E7%9B%AE%20%E6%98%BE%E7%A4%BA%E9%80%9A%E8%BF%87%E7%99%BE%E5%88%86%E6%AF%94.user.js
// @updateURL https://update.greasyfork.org/scripts/401305/%E7%89%9B%E5%AE%A2%E7%BD%91%20%E7%AB%9E%E8%B5%9B%E9%A2%98%E7%9B%AE%20%E6%98%BE%E7%A4%BA%E9%80%9A%E8%BF%87%E7%99%BE%E5%88%86%E6%AF%94.meta.js
// ==/UserScript==

(function(window) {

    const change = ()=>{
         if(location.hash==='#question')
             setTimeout(()=>{
                 var ps =  $('.link-green').parent()
                 console.log(111)
                 var i,c,p;
                 for(i =0;i<ps.length;i++){
                     c  = $(ps[i]).next()[0]
                     if(c){
                         let [pp,t] = c.innerText.split('/')
                         if(t && pp){
                             p = pp/t*100;
                             c.innerHTML += ' <span style="color:#f00">'+p.toFixed(2)+'%</span>';
                         }
                     }
                 }},500)

    }
    window.addEventListener('hashchange',change)
    change()
    // Your code here...
})(window);