// ==UserScript==
// @name         航信知道自动点赞
// @description  支持自动下一页点赞，自动当前页点赞等
// @namespace    https://greasyfork.org/zh-CN/users/850649-wuchao1992
// @version      1.0.2
// @author       wuchao
// @license      Unlicense
// @match        *://zd.aisino.as/*
// @noframes
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/436782/%E8%88%AA%E4%BF%A1%E7%9F%A5%E9%81%93%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/436782/%E8%88%AA%E4%BF%A1%E7%9F%A5%E9%81%93%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==
'use strict'

addFloatButton('当前页自动点赞','autoLike', async function (){
    localStorage.setItem("AS_AUTOLIKE_RUN",1);
    clickAllLike()
})

addFloatButton('自动下一页点赞','autoLikeNext', async function () {
    localStorage.setItem("AS_AUTOLIKE_RUN",1);
    localStorage.setItem("AS_AUTONEXT_LIKE",1);
    await clickAllLike().then(function(){
        //nextButtonEl.click()
    })

})


var newTap;

var voteInterval;
addFloatButton('自动投票','autoVote', async function () {
    localStorage.setItem("AS_AUTOLIKE_RUN",1);
    GM_setValue("AS_AUTOVOTE",true);
    GM_setValue("newVoteTapState",false);
    GM_setValue("voteIndex",0);
    initAutoVote()
})

function isTabClosed(){
   return newTap?newTap.closed:true
}
function initAutoVote(){
    var voteIndex=GM_getValue("voteIndex")
    let voteList=$(".title .fa-bar-chart").next();
    let voteLength=voteList.length
    voteInterval=self.setInterval(function(){
        let autoVoteFlag =GM_getValue("AS_AUTOVOTE")
        if(autoVoteFlag){
            let newVoteTapState=GM_getValue("newVoteTapState")
            if(!newVoteTapState&&isTabClosed()){
                let voteUrl=voteList[voteIndex].href
                newTap=GM_openInTab(voteUrl,{ active: true, setParent :true})
                GM_setValue("newVoteTapState",true);
                GM_setValue("voteIndex",voteIndex++);
            }
        }
    },1000);
}





function isQuestion(){

    //存在问题div的class
    return document.querySelectorAll(".question-content").length>0
}

function closeNewTap(){
     newTap.close();
}

function listenNewTap(){
    if(!isQuestion()){
        GM_addValueChangeListener('newVoteTapState', function(name, old_value, new_value, remote){
            if(new_value == false){
                setTimeout(function(){
                    closeNewTap();
                },3000)
            }
        })
    }
}
$(function(){
    autoLike();

    setTimeout(function(){
        autoVote()
    },2000)

   //监听新标签页的状态
   listenNewTap()

})

addFloatButton('停止','stopRun', function(){
    localStorage.setItem("AS_AUTOLIKE_RUN",0);
    localStorage.setItem("AS_AUTONEXT_LIKE",0);
    GM_setValue("AS_AUTOVOTE",false);
    window.clearInterval(int)
})



async function clickAllLike (parentNode) {
    let runTemp =localStorage.getItem("AS_AUTOLIKE_RUN")
    if("0"==runTemp){
        console.log('已停止运行 ' + getTimeStr())
        return
    }
    const likeButtons=document.querySelectorAll('.item-actions .VoteButton,.item-actions  .vote-button')
    for(let i =0;i<likeButtons.length;i++){
        let runTemp =localStorage.getItem("AS_AUTOLIKE_RUN")
        if("0"==runTemp){
            break
            console.log('已停止运行 ' + getTimeStr())

        }
        let likebt=likeButtons[i]
        let innerText=likebt.innerText
        scroll(likebt)
        if(innerText.indexOf("已赞同")<0&&innerText.indexOf("关注")<0){
            likebt.click()
            console.log('进行点赞 ' + getTimeStr())
            await sleepAsync(5000)
        }else{
            console.log('第'+i+'条已点赞，跳过 ' + getTimeStr())
            await sleepAsync(1000)
        }

    }
    console.log('当前页面已点赞完成 ' + getTimeStr())
    let autoLike =localStorage.getItem("AS_AUTONEXT_LIKE")
    if("1"==autoLike){
        const nextButtonEl = document.querySelector('.pagination .next a')
        nextButtonEl.click()
    }
}
async function autoVote () {
    let autoVoteFlag =GM_getValue("AS_AUTOVOTE")
    if(autoVoteFlag){
        const voteList = document.querySelectorAll('.question-content input[type=radio],.question-content input[type=checkbox]')
        let voteListSum=voteList.length
        let voteIndex=0
        //随机选一个答案
        if(voteListSum>0){
            voteIndex=Math.ceil(Math.random()*voteListSum)-1
            voteList[voteIndex].click()
            let voteBt = document.querySelector('.question-content .modal-footer button')
            if("投票"==voteBt.innerText){
                await sleepAsync(1000)
                voteBt.click()
                //投票后页面会刷新
                GM_setValue("newVoteTapState",false);
            }
        }else{
            if(isQuestion()){
                GM_setValue("newVoteTapState",false);
            }
            return
        }

    }
}
async function sleepAsync (time) {
    return new Promise(resolve => setTimeout(resolve, time))
}

async function waitUntilAsync (conditionCalculator, interval = 200) {
    return new Promise(resolve => {
        setInterval(() => {
            if (conditionCalculator()) {
                resolve()
            }
        }, interval)
    })
}
function scroll(ele){
    let offset=$(ele).offset().top
    $("html,body").animate({scrollTop:offset - "90" + "px"}, 500);
}
function getTimeStr () {
    const zeroPad = (num, len = 2) => ('00000' + num).substr(-len, len) // Max: 5 zeros
    const d = new Date()
    const str =
          zeroPad(d.getHours()) +
          ':' + zeroPad(d.getMinutes()) +
          ':' + zeroPad(d.getSeconds()) +
          '.' + zeroPad(d.getMilliseconds(), 3)
    return str
}

function addFloatButton (text,btid,onclick) {
    if (!document.addFloatButton) {
        const buttonContainer = document.body.appendChild(document.createElement('div')).attachShadow({ mode: 'open' })
        buttonContainer.innerHTML = '<style>:host{position:fixed;top:3px;left:3px;z-index:2147483647;height:0}#i{display:none}*{float:left;margin:4px;padding:1em;outline:0;border:0;border-radius:5px;background:#1e88e5;box-shadow:0 1px 4px rgba(0,0,0,.1);color:#fff;font-size:14px;line-height:0;transition:.3s}:active{background:#42a5f5;box-shadow:0 2px 5px rgba(0,0,0,.2)}button:active{transition:0s}:checked~button{visibility:hidden;opacity:0;transform:translateY(-3em)}label{border-radius:50%}:checked~label{opacity:.3;transform:translateY(3em)}</style><input id=i type=checkbox><label for=i></label>'
        document.addFloatButton = (text,btid,onclick) => {
            const button = document.createElement('button')
            button.textContent = text
            button.id=btid
            button.addEventListener('click', onclick)
            return buttonContainer.appendChild(button)
        }
    }
    return document.addFloatButton(text,btid, onclick)
}

async function autoLike(){
    let autoLike =localStorage.getItem("AS_AUTONEXT_LIKE")
    if("1"==autoLike){
        const nextButtonEl = document.querySelector('.pagination .next a')
        await sleepAsync(3000)
        await clickAllLike().then(function(){

        })
    }
}