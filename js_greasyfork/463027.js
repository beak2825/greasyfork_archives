// ==UserScript==
// @name         洛谷名字颜色随机，管理员和作弊者交换
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  洛谷名字颜色随机！
// @author       LincW
// @match        https://www.luogu.com.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/463027/%E6%B4%9B%E8%B0%B7%E5%90%8D%E5%AD%97%E9%A2%9C%E8%89%B2%E9%9A%8F%E6%9C%BA%EF%BC%8C%E7%AE%A1%E7%90%86%E5%91%98%E5%92%8C%E4%BD%9C%E5%BC%8A%E8%80%85%E4%BA%A4%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/463027/%E6%B4%9B%E8%B0%B7%E5%90%8D%E5%AD%97%E9%A2%9C%E8%89%B2%E9%9A%8F%E6%9C%BA%EF%BC%8C%E7%AE%A1%E7%90%86%E5%91%98%E5%92%8C%E4%BD%9C%E5%BC%8A%E8%80%85%E4%BA%A4%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    let purple="lg-fg-purple lg-bold";
    let red="lg-fg-red lg-bold";
    let orange="lg-fg-orange lg-bold";
    let green="lg-fg-green";
    let blue="lg-fg-bluelight";
    let gray="lg-fg-gray";
    let brown="lg-fg-brown lg-bold";
    let colors=[purple,red,orange,green,blue,gray,red,orange,green,blue,gray,brown];
    let purplebadge="am-badge am-radius lg-bg-purple";
    let brownbadge="am-badge am-radius lg-bg-brown";
    let stpb=[...document.getElementsByClassName(purplebadge)]
    let stbb=[...document.getElementsByClassName(brownbadge)]
    let stp=[...document.getElementsByClassName(purple)]
    let stb=[...document.getElementsByClassName(brown)]
    for(let pbadge of stpb)
    {
        pbadge.className=brownbadge;
        pbadge.innerHTML="作弊者";
    }
    for(let bbadge of stbb)
    {
        //console.log(bbadge)
        bbadge.className=purplebadge;
        bbadge.innerHTML="管理员";
    }
    for(let pname of stp)
    {
        pname.className=brown;
    }
    for(let bname of stb)
    {
        bname.className=purple;
    }
    let reds=document.getElementsByClassName(red);
    let oranges=document.getElementsByClassName(orange);
    let greens=document.getElementsByClassName(green);
    let blues=document.getElementsByClassName(blue);
    let grays=document.getElementsByClassName(gray);
    let nmap=new Map();
    let arr=[...reds,...oranges,...greens,...blues,...grays];
    for(let name of arr)
    {
        if(!nmap.has(name.innerHTML))
        {
            if(name.innerHTML=="LincW") nmap.set(name.innerHTML,0)
            else nmap.set(name.innerHTML,Math.floor(Math.random()*colors.length))
        }
    }
    for(let name of arr)
    {
        if(name.children.length>=1) continue;
        if(name.innerHTML=="未开始") continue;
        if(name.innerHTML=="进行中") continue;
        name.className=colors[nmap.get(name.innerHTML)];
        if(nmap.get(name.innerHTML)==colors.length-1)
        {
            let appr=name.parentNode.innerHTML.indexOf("</a>")+4;
            let gz=name.parentNode.innerHTML.match("</svg>");
            if(gz)
            {
                appr=name.parentNode.innerHTML.indexOf("</a>",appr)+4;
            }
            name.parentNode.innerHTML=name.parentNode.innerHTML.slice(0,appr)+"&nbsp;<span class=\"am-badge am-radius lg-bg-brown\">作弊者</span>"+name.parentNode.innerHTML.slice(appr);
        }
        if(nmap.get(name.innerHTML)==0)
        {
            let appr=name.parentNode.innerHTML.indexOf("</a>")+4;
            let gz=name.parentNode.innerHTML.match("</svg>");
            if(gz)
            {
                appr=name.parentNode.innerHTML.indexOf("</a>",appr)+4;
            }
            if(name.innerHTML=="LincW") name.parentNode.innerHTML=name.parentNode.innerHTML.slice(0,appr)+"&nbsp;<span class=\"am-badge am-radius lg-bg-purple\">脚本作者</span>"+name.parentNode.innerHTML.slice(appr);
            else name.parentNode.innerHTML=name.parentNode.innerHTML.slice(0,appr)+"&nbsp;<span class=\"am-badge am-radius lg-bg-purple\">管理员</span>"+name.parentNode.innerHTML.slice(appr);
        }
    }
    console.log(nmap)
})();