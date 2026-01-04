// ==UserScript==
// @name         bilibili【哔哩哔哩】评论关键词屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  拒绝评论开车刷烂梗!
// @description  对B站所有具有评论区的版块进行了匹配覆盖，优化了屏蔽逻辑。
// @description  修复了UI的一些显示BUG
// @description  下个版本可能会增加用户屏蔽
// @description  感谢各位提出的意见！
// @author       cfx
// @match        *://www.bilibili.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386768/bilibili%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%E8%AF%84%E8%AE%BA%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/386768/bilibili%E3%80%90%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E3%80%91%E8%AF%84%E8%AE%BA%E5%85%B3%E9%94%AE%E8%AF%8D%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let shieldingWords = [];
    let loadShieldWords=()=>{
        let localWords = localStorage.getItem("bilibili-shielding-words");
        if(localWords){
            shieldingWords = localWords.split(",");
        }else{
            shieldingWords=[];
        }
    }
    let setShieldWords = ()=>{
        localStorage.setItem("bilibili-shielding-words",shieldingWords);
    }
    let parseDom = (arg)=> {
        let objE = document.createElement("div");
        objE.innerHTML = arg;
        return objE.childNodes[0];
    }
    let ifShielded = (word)=>{
        for(let i of shieldingWords){
            if(word.toString().indexOf(i.toString())!==-1 && i.toString()!==""){
                return true;
            }
        }
        return false;
    }
    let filterComments = ()=>{
        let allReplyComments = document.querySelectorAll(".comment-list .list-item .reply-item");
        for (let i of allReplyComments){
            let con = i.querySelector(".text-con");
            if(ifShielded(i.innerText)){
                con.innerHTML = "<span style='color:red'>已屏蔽内容</span>";
            }
        }
        let allComments = document.querySelectorAll(".comment-list .list-item");
        for (let i of allComments){
            let con = i.querySelector('.text');
            if(ifShielded(con.innerText)){
                con.innerHTML = "<span style='color:red'>已屏蔽内容</span>";
            }
        }
    }
    let bindEvents = () =>{
        let moreReplyBtns = document.querySelectorAll(".btn-more");
        let pageNumberChangeBtns = document.querySelectorAll(".tcd-number");
        let prePageBtns = document.querySelectorAll(".pre");
        let nextPageBtns = document.querySelectorAll(".next");
        for(let i of moreReplyBtns){
            i.addEventListener('click',()=>{
                setTimeout(()=>{
                    filterComments();
                    bindEvents();
                },1000);
            })
        }
        for(let i of pageNumberChangeBtns){
            i.addEventListener('click',()=>{
                setTimeout(()=>{
                    filterComments();
                    bindEvents();
                },1000);
            })
        }
        for(let i of prePageBtns){
            i.addEventListener('click',()=>{
                setTimeout(()=>{
                    filterComments();
                    bindEvents();
                },1000);
            })
        }
        for(let i of nextPageBtns){
            i.addEventListener('click',()=>{
                setTimeout(()=>{
                    filterComments();
                    bindEvents();
                },1000);
            })
        }
    }
    let updateShieldWords = ()=>{
        let container = document.querySelector("#bilibili-shielder");
        if(!shieldingWords.length){
            container.innerHTML = "待添加屏蔽词条";
        }else{
            container.innerHTML = "";
        }
        for(let i of shieldingWords){
            let line = parseDom(`<div class='shielder-line'></div>`);
            let word = parseDom(`<span class='shielder-word'>${i}</span>`);
            let btn = parseDom(`<span class='shielder-btn'>❌</span></div>`);
            btn.onclick=()=>{
                for(let index in shieldingWords){
                    if(shieldingWords[index]===i){
                        shieldingWords.splice(index,1);
                    }
                }
                setShieldWords();
                window.location.reload();
            }
            line.appendChild(word);
            line.appendChild(btn);
            container.appendChild(line);
        }
    }
    let bilibiliShielderAddWord = ()=>{
        let word = prompt("请输入你的屏蔽词");
        if(shieldingWords.indexOf(word)==-1&&word!==null&&word!==""){
            shieldingWords.push(word);
            setShieldWords();
            updateShieldWords();
            filterComments();
        }
    }

    let createUI = () =>{
        let HTML = `<div id='bilibili-shielder-container'>BiliBili评论屏蔽v1.1<div id='bilibili-shielder'></div></div>`;
        let UI = parseDom(HTML);
        let Btn = parseDom(`<div id='bilibili-shielder-btn'>添加词条➕</div>`);
        Btn.addEventListener('click',bilibiliShielderAddWord);
        UI.appendChild(Btn);
        let cssStyle = `<style>
#bilibili-shielder-container{
width:110px;
height:220px;
z-index;999;
position:fixed;
font-size:12px;
right:0;
top:200px;
border:1px solid black;
user-select:none;
}
#bilibili-shielder{
overflow-x:hidden;
overflow-y:auto;
width:90px;
margin:10px auto;
height:150px;
border:1px solid black;
}
.shielder-word{
float:left;
}
.shielder-btn{
float:right;
margin-right:
10px;cursor:pointer;
}
.shielder-line{
height:20px;
width:100%;
line-height:20px;
font-size:12px
}
#bilibili-shielder-btn{
min-width:90px;
margin:10px auto;
text-align:center;
cursor:pointer;
}
</style>`
        let Style = parseDom(cssStyle);
        document.body.appendChild(UI);
        document.body.appendChild(Style);
    }

    window.onload = function(){
        createUI();
        loadShieldWords();
        updateShieldWords();
    }
    document.body.onscroll= function(){
        let commentList = document.querySelector('.comment-list')||null;
        if(commentList&&commentList.innerText){
            bindEvents();
            filterComments();
        }
    }
})();