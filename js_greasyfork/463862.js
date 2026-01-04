// ==UserScript==
// @name         youtube油管收藏列表搜索过滤
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  收藏视频时,添加一个输入框,允许根据关键词搜索出相关的收藏列表,过滤掉无关的
// @author       iamqiz
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      AGPLv3
// @run-at  document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463862/youtube%E6%B2%B9%E7%AE%A1%E6%94%B6%E8%97%8F%E5%88%97%E8%A1%A8%E6%90%9C%E7%B4%A2%E8%BF%87%E6%BB%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/463862/youtube%E6%B2%B9%E7%AE%A1%E6%94%B6%E8%97%8F%E5%88%97%E8%A1%A8%E6%90%9C%E7%B4%A2%E8%BF%87%E6%BB%A4.meta.js
// ==/UserScript==
/*
  给油管收藏弹窗添加搜索框,
  原理是给document设置一个click事件,点击鼠标后,检测是否有收藏窗口出现, 如果出现,则插入搜索框,然后删除该click事件

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

console.log(`开始油管收藏搜索V2`)
    let xpath=get_xpath_result_list
    let starttimer

let searchTimer
let savelistTimer
let clickFn=()=>{
    clearInterval(savelistTimer)
    let cnt=0
    savelistTimer=setInterval(()=>{
        cnt++
        let savelist= xpath(`/html/body/ytd-app/ytd-popup-container/tp-yt-paper-dialog/ytd-add-to-playlist-renderer`)[0]
        if(savelist){
            clearInterval(savelistTimer)
            console.log('找到了')
            console.log(savelist)
            console.log(savelist.style)
            //销毁
            document.removeEventListener('click',clickFn)
            // 加上搜索框
            if(1){
                let b=document.createElement("div")
                b.innerHTML=`<input type="text" id="qz-search-box" value="" placeholder="输入进行搜索" autocomplete="off"></input>`
                let c=b.firstElementChild
                savelist.insertAdjacentElement('afterbegin',b)
                let list=b.nextElementSibling.nextElementSibling
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
                        },1000)
                        log(`创建timer:${searchTimer}`)
                    }
                })
                let closediv=document.createElement('div')
                closediv.innerHTML=`<input type="button" value="重置"/>`
                closediv.firstElementChild.addEventListener('click',(e)=>{
                    console.log(`重置按钮:${Math.random()}`)
                    console.log(e.target)
                    // e.target.parentElement.style.display='none'
                    console.log(`qzid:youtube-save-list 重置`);
                    c.value=""
                    list.childNodes.forEach((ele,index)=>{
                       ele.style.display=''
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


document.addEventListener("click",clickFn)


})();