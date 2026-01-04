// ==UserScript==
// @name         Codeforces与洛谷题目链接跳转
// @version      0.0.1
// @description  Codeforces与洛谷题目链接跳转脚本
// @author       Cro-Marmot
// @match        https://codeforces.com/*/problem/*
// @match        https://www.luogu.com.cn/problem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @license      MIT
// @namespace https://github.com/yunfeidog/CodeforcesToLuogu
// @downloadURL https://update.greasyfork.org/scripts/467830/Codeforces%E4%B8%8E%E6%B4%9B%E8%B0%B7%E9%A2%98%E7%9B%AE%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/467830/Codeforces%E4%B8%8E%E6%B4%9B%E8%B0%B7%E9%A2%98%E7%9B%AE%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(()=>{
    const createBtn = (text,url) => {
        let a=document.createElement('a');
        a.href=url;
        let btn=document.createElement('button');
        btn.textContent=text;
        a.appendChild(btn);
        return a;
    };
    window.addEventListener('load', ()=>{ // 在这里编写需要在页面全部加载完毕后执行的操作
        if(window.location.host==="codeforces.com"){
            let str=window.location.href
            let bigBox=document.querySelector("#sidebar");
            let x = /https:\/\/codeforces.com\/contest\/(\d*)\/problem\/([^\/]*)/.exec(window.location.href)
            if(!x) return;
            let problemId=x[1];
            let problemChar=x[2];
            bigBox.appendChild(createBtn("洛谷","https://www.luogu.com.cn/problem/CF"+problemId+problemChar));
            bigBox.appendChild(createBtn("洛谷中文题解","https://www.luogu.com.cn/problem/solution/CF"+problemId+problemChar));
        }else{
            // 找到最后一个 / 的位置
            let x = /https:\/\/www.luogu.com.cn\/problem\/(solution\/)?CF(\d*)([^\d][^\/]*)/.exec(window.location.href)
            if(!x) return;
            let idNum = x[2]
            let lastChar = x[3]
            let bigBox=document.querySelector(".operation");
            bigBox.appendChild(createBtn("去打CF","https://codeforces.com/contest/"+idNum+"/problem/"+lastChar));
        }
    });
})();