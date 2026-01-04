// ==UserScript==
// @name         洛谷娱乐插件·猫和老鼠
// @namespace    http://tampermonkey.net/
// @version      1.3.2
// @description  在洛谷题库右下角（也就是广告处）添加猫和老鼠，供大家娱乐使用
// @author       jyb666（制作插件）&维尼（制作gif）
// @match        *://www.luogu.com.cn/problem/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/414985/%E6%B4%9B%E8%B0%B7%E5%A8%B1%E4%B9%90%E6%8F%92%E4%BB%B6%C2%B7%E7%8C%AB%E5%92%8C%E8%80%81%E9%BC%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/414985/%E6%B4%9B%E8%B0%B7%E5%A8%B1%E4%B9%90%E6%8F%92%E4%BB%B6%C2%B7%E7%8C%AB%E5%92%8C%E8%80%81%E9%BC%A0.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var url = Array(
      "https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/f4369bd2-c43d-44e2-bab1-d850f2189e76.gif",

"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/6165fa83-e924-4198-92f8-c35c470aee83.gif",

"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/ef0738e3-a534-4359-91aa-b9dd3587bfae.gif",

"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/3cc2686d-d8c0-4fc9-bffd-cc4013dc4835.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/ee3ddae5-1444-417c-948a-044880d61f80.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/1adeac1f-6957-4e15-93bc-128c0bc04c7c.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/43c79759-e451-4dc9-bb67-a2200b390fc4.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/07fe2ad0-9235-4bbd-a668-ed2f434a05c9.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/62f142de-e8c6-4b45-848e-872abc4c514d.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/06903b92-73ce-4cf9-a3a6-e83b58f61ada.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/03923453-4251-4d9b-8d6b-4fcfac922969.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/ca41e9ad-071f-4176-9f4f-20efdc3e21ff.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/821b58e6-46ba-4df6-8810-2913c03c3199.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/81d1e499-e7f8-4b56-bb50-50bb45367bf4.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/dc8d3bd2-b8a3-4eb2-89e9-63222e4b32db.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/ebcc4832-f136-4914-8206-cf73f11d95e9.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/a1ce7359-cc46-4be8-a7e2-09d6e57eb695.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/6a48ccc9-364b-4960-a413-636f8281cdb9.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/bb0654cd-e1ad-4713-bec2-4a80d96e5adb.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/03d782b7-47dd-4812-8c34-b1fc58583916.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/d5c62154-0e83-4a67-a4e5-547056ca901f.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/f13f6f07-0778-41b8-9460-cd8ad8271448.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/27a0ff71-2588-4d64-bf3d-1de0ceb4ba5c.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/6638a994-c68c-443f-9087-7e0c5f150204.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/4a030e06-b8a3-4528-b8df-7fe5b1d14b21.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/fc34f0ac-70a6-4b55-a28e-b07023a0dc41.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/0a25760a-9cad-4b49-a1bf-1f6d63b07bd5.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/994a1b76-575c-4a8e-8079-f31bc148c8c7.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/27cca17a-bf9a-469c-88aa-f7118fc96415.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/fc2633c4-83a0-436a-8641-242d9cc51b51.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/a1b16b7b-0060-467b-9484-c3827f9a432c.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/11c062fa-7081-4918-9a06-6e403dd2ccf7.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/4e1785e6-07f4-41ae-9c1b-9fd18b4cd94c.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/f63a0bb4-d532-4d95-b913-1cfda3b9782a.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/4e6ea240-2f39-4367-879a-37f205bbcc11.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/813a0b8f-ed98-4c1c-8967-bfbde6fa6f73.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/1b37e33e-3501-4ac7-bcee-3f609bfd0e20.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/acaf5030-e6e0-4a45-a530-a42f7dcf3c97.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/09806c62-f164-46a0-985d-72cdfcfc4192.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/0135a558-48ca-4fc5-81db-e2807999d3f1.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/41713bba-6089-4f73-a4e9-b7a1aa52d841.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/021b45a5-1163-4882-84c4-1acd7d771855.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/66ec5a45-6894-49da-b30f-2b578cce6204.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/606a3f1f-edda-44b7-b812-53092f8e54ac.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/8b50a994-a6d0-44b6-850f-aa3f41873595.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/a385f2a4-fc61-4203-a031-915ac1ae31de.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/c3a47fd7-cb14-481c-b2a1-5c0a358d7fb2.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/2f15b86b-7433-43a1-bf1d-21758e657992.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/ced51efe-31b3-45b7-9273-ceda1c680f78.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/5ba0f020-a0c1-49cf-be07-236cd15f25f3.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/754e2d60-6af0-4488-8a3d-5420ce298319.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/7ec57929-dcf5-4553-9901-e71b6e203b43.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/becce95d-cd46-4188-a388-150d54d4f7f8.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/5c46d0cd-786c-4d68-b6f4-0ae4820e460c.gif",
"https://vkceyugu.cdn.bspapp.com/VKCEYUGU-imgbed/3fe04a8b-7e2c-4bf5-aeab-567573fe9793.gif"
  );
  function randomNum(minNum,maxNum){ 
    switch(arguments.length){ 
      case 1: 
        return parseInt(Math.random()*minNum+1,10); 
      break; 
      case 2:
        return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10);
      break; 
      default: 
        return 0; 
      break; 
    } 
  } 
  var status_html = "<div data-v-0a593618=\"\" data-v-7b37eb95=\"\" id=\"mhls\"><img style=\"width:100%;\" src=\""+url[randomNum(0,url.length-1)]+"\"> <span data-v-0a593618=\"\">洛谷娱乐</span><button data-v-86f36770=\"\" data-v-0a593618=\"\" type=\"button\" onclick=\"document.querySelector(\'section.side > div:nth-child(5)\').innerHTML=\'\';\" style=\"border-color: rgba(255, 255, 255, 0.5); color: rgb(255, 255, 255); background-color: rgba(0, 0, 0, 0.5);\">关闭</button></div>";
  function init() {
    var node = document.createElement('div');
    node.innerHTML = status_html;
    document.querySelector('section.side > div:nth-child(4)').insertAdjacentElement('afterend', node);
  }
  setTimeout(init, 3000);
})();