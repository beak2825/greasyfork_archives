// ==UserScript==
// @name         哔哩哔哩用户成分鉴定
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  新版B站评论自动标注用户成分。
// @author       Awen
// @match        https://www.bilibili.com/video/*
// @icon         https://img1.imgtp.com/2022/08/30/1LkMlj7a.png
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/451166/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%94%A8%E6%88%B7%E6%88%90%E5%88%86%E9%89%B4%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/451166/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%94%A8%E6%88%B7%E6%88%90%E5%88%86%E9%89%B4%E5%AE%9A.meta.js
// ==/UserScript==

(function(){"use strict";console.log("哔哩哔哩用户成分鉴定启动"),console.log("源码仓库：https://github.com/YlAwen/Bilibili-UserIdentification");let e=[{tag:"原神",keywords:["原神","巴巴托斯","迭卡拉庇安","安德留斯","玻瑞亚斯","温妮莎","西风骑士团","特瓦林","法尔伽","凯亚","阿贝多","优菈","凯亚","安柏","可莉","温妮莎","莱艮芬德","艾伦德林","鲁斯坦","芭芭拉","迪卢克","摩拉克斯","赫乌莉亚","魈","北斗","凝光","香菱","行秋","重云","刻晴","七七","钟离","辛焱","甘雨","胡桃","烟绯","云堇","申鹤","夜兰","纳西妲","提纳里","柯莱","多莉"]},{tag:"影之诗",keywords:["影之诗","暗影诗章","zsb","傻纸比","傻之逼","shadowverse","星野饼美"]},{tag:"喜灰",keywords:["喜羊羊与灰太狼"]},{tag:"马迷",keywords:["小马宝莉","暮光闪闪","紫悦","苹果嘉儿","云宝黛茜","云宝","瑞瑞","珍奇","小蝶","柔柔","萍琪派","苹果杰克","碧琪","斯派克","穗龙","塞拉斯蒂亚","宇宙公主","小苹花","苹果丽丽","甜贝儿","飞板璐","醒目露露","露娜公主","韵律公主","银甲闪闪","凝心雪儿","蓝血王子","邪茧女王","黑晶王","提雷克","星光熠熠","冥影","和煦光流","格罗迦","白胡子星璇","余晖烁烁"]},{tag:"IKUN",keywords:["蔡徐坤","ikun","只因你太美"]}];const t="https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?&host_mid=",s=0!==document.getElementsByClassName("item goback").length,a={tag:"span",style:{display:"inline-block","font-size":"14px",background:"linear-gradient(to bottom right,#8A2BE2,#DC143C)",padding:" 0px 4px","border-radius":"4px",color:"#fff","margin-left":"6px"}},n=(e,t)=>{GM_xmlhttpRequest({method:"get",url:e,data:"",headers:{"user-agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 Safari/537.36 Edg/104.0.1293.70"},onload:e=>{200===e.status&&t(JSON.parse(e.response))}})},r=e=>s?e.dataset.userId:e.children[0].href.replace(/[^\d]/g,""),o=e=>document.getElementsByClassName(e),i=e=>0!==e.length,l=e=>{let t="";for(const s in e)t=t+s+":"+e[s]+";";return"style='"+t+"'"},d=(t,s)=>{let n=[];if(e.forEach(e=>{e.keywords.forEach(t=>{if(s.includes(t))return n.push(`<${a.tag} class="Awen-tag" ${l(a.style)}>${e.tag}</${a.tag}>`)})}),0===n.length)return t.innerHTML+="<span class='Awen-tag'></span>";new Set(n).forEach(e=>t.innerHTML+=e)};setInterval(()=>{if(s){const e=[...o("user-name"),...o("sub-user-name")];i(e)&&e.forEach(e=>{let s=!1;if(e.childNodes.forEach(e=>{if("Awen-tag"===e.className)return s=!0}),!s){const s=t+r(e);n(s,t=>{d(e,JSON.stringify(t))})}})}},2e3)})();