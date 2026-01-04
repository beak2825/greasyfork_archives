// ==UserScript==
// @name         b站|bilibili收藏列表搜索过滤
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  收藏视频时,添加一个输入框,允许根据关键词搜索出相关的收藏列表,过滤掉无关的
// @author       iamqiz
// @match        http*://www.bilibili.com/video*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.bilibili.com
// @run-at  document-body
// @license      AGPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463876/b%E7%AB%99%7Cbilibili%E6%94%B6%E8%97%8F%E5%88%97%E8%A1%A8%E6%90%9C%E7%B4%A2%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/463876/b%E7%AB%99%7Cbilibili%E6%94%B6%E8%97%8F%E5%88%97%E8%A1%A8%E6%90%9C%E7%B4%A2%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==
/*
  给收藏弹窗添加搜索框,
  原理是给document设置一个click事件,不断检测是否有收藏窗口出现, 如果出现,则插入搜索框,然后删除该click事件

*/
(function() {
    'use strict';

    // Your code here...
    function get_xpath_result_list(xpath){
        if(typeof xpath=="undefined"||xpath=="-h"){
            console.log(`xpath(\`//*[text()="xxx"]\``)
            console.log(`xpath(\`//*[contains(text(),"xxx")]\`)`)
            return
        }
        let xpath_results=document.evaluate(xpath, document, null, XPathResult.ANY_TYPE, null)
        let xpath_result_list=[]
        var a_result= xpath_results.iterateNext();
        while (a_result) {
            xpath_result_list.push(a_result)
            a_result= xpath_results.iterateNext();
        }
        return xpath_result_list
    }
    function log(msg){
        console.log(msg)
    }

// console.log(`开始油管收藏搜索V2`)
    let xpath=get_xpath_result_list
    let starttimer

let searchTimer
let savelistTimer
let clickFn=()=>{
    clearInterval(savelistTimer)
    if(document.querySelector(`input#qz-search-box`)){
        console.log(`已经存在`)
        return
    }
    let cnt=0
    savelistTimer=setInterval(()=>{
        cnt++
        let savelist= document.querySelector(`body>div#app>div.video-container-v1>.bili-dialog-m>.bili-dialog-bomb>.collection-m-exp`)
        if(savelist){
            clearInterval(savelistTimer)
            console.log('找到了')
            console.log(savelist)
            console.log(savelist.style)
            //销毁
            //document.removeEventListener('click',clickFn)
            // 加上搜索框
            if(1){
                let b=document.createElement("div")
                b.innerHTML=`<input type="text" id="qz-search-box" value="" placeholder="输入进行搜索" autocomplete="off" style="color: black;font-size: large; padding-left: 6px;"></input>`
                let c=b.firstElementChild
                savelist.insertAdjacentElement('afterbegin',b)
                let list0=b.nextElementSibling.nextElementSibling
                let list=list0 && list0.querySelector(`div.group-list>ul`)
                if(!list){
                    console.log(`收藏列表不存在`)
                    return
                }
                console.log(`收藏列表`)
                // console.log(list)
                c.addEventListener("input",(e)=>{
                    console.log(`v:${e.target.value}`);
                    if(1){
                        //
                        log(`清除搜索:${searchTimer}`)
                         clearTimeout(searchTimer)
                        searchTimer= setTimeout(()=>{
                            log(`执行timer:${searchTimer}`)
                            // let words=e.target.value.split(/\s+/)
                            let words=e.target.value.trim().split(/\s+/)
                            console.log(`搜索${words.length}|${words}|`);
                            console.log(list);

                            list.childNodes.forEach((ele,index)=>{
                                let ismatch=true
                                if(ele.nodeType!==1){
                                    return
                                }
                                // let txt=ele.textContent.trim()
                                let txt=ele.innerText.trim()
                                // log(`${index}|txt:${txt}`)
                                for(let word of words){
                                   if(!txt.includes(word)){
                                       ismatch=false
                                       break
                                   }
                                }
                                if(ismatch){
                                     ele.style.display=''
                                }else{
                                    ele.style.display='none'
                                }
                            })
                        },500)
                        log(`创建timer:${searchTimer}`)
                    }
                })
                let closediv=document.createElement('div')
                closediv.innerHTML=`<input type="button" value="重置" style="color: black;font-size: large;"/>`
                closediv.firstElementChild.addEventListener('click',(e)=>{
                    console.log(`重置按钮:${Math.random()}`)
                    console.log(e.target)
                    // e.target.parentElement.style.display='none'
                    console.log(`qzid:youtube-save-list 重置`);
                    // console.log(list)
                    c.value=""
                    list.childNodes.forEach((ele,index)=>{
                        // console.log(`${index}:${ele.nodeType} ${ele.innerText}`)
                        if(ele.nodeType===1){
                            ele.style.display=''
                        }
                    })
                })
                b.appendChild(closediv.firstElementChild)
            }
        }else{
            if(cnt>=5){
                console.log(`超时还未找到`)
                clearInterval(savelistTimer)
            }else{
                //没找到
                console.log(`idx:${cnt}| 没找到`)
            }
        }
    },200)

}

setTimeout(()=>{
    console.log(`开始监听 收藏搜索框`)
    document.addEventListener("click",clickFn)
},5000)


})();