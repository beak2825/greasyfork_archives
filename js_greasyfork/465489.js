// ==UserScript==
// @name         Codeforces与洛谷题目链接跳转
// @namespace    https://github.com/yunfeidog/CodeforcesToLuogu
// @version      1.1
// @description  Codeforces与洛谷题目链接跳转脚本
// @author       dogyunfei
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465489/Codeforces%E4%B8%8E%E6%B4%9B%E8%B0%B7%E9%A2%98%E7%9B%AE%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/465489/Codeforces%E4%B8%8E%E6%B4%9B%E8%B0%B7%E9%A2%98%E7%9B%AE%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(()=>{
    if(window.location.host==="codeforces.com"){
        let str=window.location.href
        let bigBox=document.querySelector("#sidebar");
        let myButton=document.createElement('button');
        myButton.textContent="点击我去洛谷";
        bigBox.appendChild(myButton);

        let problemId=getProblemId(str);
        let problemChar=getProblemChar(str);
        console.log(problemId);
        console.log(problemChar);
        //给按钮添加点击事件
        myButton.addEventListener('click',()=>{
            location.assign("https://www.luogu.com.cn/problem/CF"+problemId+problemChar);
        })
        let tijie=document.createElement('button');
        tijie.textContent="点击我去查看中文题解";
        bigBox.appendChild(tijie);
        tijie.addEventListener('click',()=>{
            location.assign("https://www.luogu.com.cn/problem/solution/CF"+problemId+problemChar);
        })
    }else{
        let str=window.location.href
        // 找到最后一个 / 的位置
        var lastSlashIndex = str.lastIndexOf("/");
        // 从 URL 中截取出 ID 和最后的字符
        var idStr = str.slice(lastSlashIndex + 1, -1); // "CF1714D"
        let idNum =''+ parseInt(idStr.slice(2, 6)); // 1714
        let lastChar ='' +idStr.charAt(idStr.length - 1); // "D"
        var url='https://codeforces.com/contest/'+idNum+"/problem/"+lastChar;
        console.log(url);
        window.addEventListener('load', ()=>{
            let mybutton=document.createElement('button');
            mybutton.textContent="去打CF";
            mybutton.addEventListener('click',()=>{location.assign(url)});
            // 在这里编写需要在页面全部加载完毕后执行的操作
            let cf=document.querySelector("#app > div.main-container > main > div > section.side > div:nth-child(1) > div > div:nth-child(1) > span:nth-child(2)");
            let bigBox=document.querySelector("#app > div.main-container > div.wrapper.wrapped.lfe-body.header-layout.normal > div.header > div.functional > div.operation");
            console.log(cf);
            cf.addEventListener('click',()=>{location.assign(url)});
            bigBox.appendChild(mybutton)
        });
    }
})();


function getProblemId(str){
    let pos = str.indexOf("contest/") + "contest/".length;
    let contestNum = "";
    while (str[pos] >= '0' && str[pos] <= '9') {
        contestNum += str[pos];
        pos++;
    }
    return contestNum;
}

function getProblemChar(str){
    let pos = str.indexOf("problem/") + "problem/".length;
    let problemLetter = str.substr(pos);
    return problemLetter;
}
