// ==UserScript==
// @name         更合理的岛3首页
// @namespace    https://www.github.com/86135
// @version      0.0.0
// @description  更合理的岛3首页，去除“贡献图”等无用功能，放大公告栏并替换成清晰图片，仅展示非官方地图
// @author       86135
// @match        https://box3.codemao.cn/*
// @match        https://box3.fun/*
// @icon         https://static.box3.codemao.cn/block/QmURFSjE2YvBhi5XYCXbyZHfDiHTedbYUtEQY4PyZmH7ft.png
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/440298/%E6%9B%B4%E5%90%88%E7%90%86%E7%9A%84%E5%B2%9B3%E9%A6%96%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/440298/%E6%9B%B4%E5%90%88%E7%90%86%E7%9A%84%E5%B2%9B3%E9%A6%96%E9%A1%B5.meta.js
// ==/UserScript==
var a=()=>{
    document.querySelectorAll('._1yZ6NeMjfGScb4F10xmspg').forEach(e=>{
        e.style="width:180px;";
        let author=e.firstChild.children[1].firstChild.children[2].children[1].innerHTML
        if(((author==='吉吉喵'||author==="爱出海的王路飞")||(author==="搬砖喵"||author==="安静的土岩龙"))||(author==="MOYO"||author==="火山哥哥"))
            document.querySelector('._2p590X3xza5oTJJZ3ToFcx').removeChild(e);
        let type=e.firstChild.firstChild.children[1].firstChild.innerHTML;
        if(type!='地图')
            document.querySelector('._2p590X3xza5oTJJZ3ToFcx').removeChild(e);
    });
}
setInterval(a,100);
setTimeout(()=>{
    document.querySelector('._1h2uGa86pCMfu2i8Mf0a50').style='display:none!important';
        document.querySelector('._1T2JCzQNnxVBvhdk0H_GC0').style='display:none!important';
        document.querySelector('._1kPlzcaKM1Pva4Z1Js3Igc').style='display:none!important';
        document.querySelector('._3QwMTigyeGo73dNkkSb58N').style='width:1224px!important;padding:300px 0 0!important';
        document.querySelector('._2p590X3xza5oTJJZ3ToFcx').style='gap:8px';
        document.querySelector('._1fXgmyCy8qEkTugSc5XVFf').style='display:none!important';
        document.querySelectorAll('.rJQ4lE89VBa6UEc4AJKqD').forEach(e=>{
            let img=e.firstChild.children[4];
            img.src=img.src.replace('400','1200').replace('100','300');
            for(let i of [...(e.firstChild.children)])
                if(i.tagName=='SOURCE')
                    e.firstChild.removeChild(i);
        })
},500);