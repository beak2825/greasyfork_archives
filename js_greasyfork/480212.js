// ==UserScript==
// @name         bilibili------分p视频时长统计
// @namespace    http://cssf.com/
// @version      0.2.1
// @description  在学习分p视频时,可以查看总时长分批时长
// @license      GPL-3.0
// @author       eniac
// @match        https://www.bilibili.com/video/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480212/bilibili------%E5%88%86p%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/480212/bilibili------%E5%88%86p%E8%A7%86%E9%A2%91%E6%97%B6%E9%95%BF%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(function(){
        //计算总时长
        function calTotalTime(){
            const videoList=document.querySelectorAll('.cur-list .list-box .duration')
		    let hour=0
		    let min=0
		    let second=0
		    videoList.forEach(item=>{
		        let text=item.innerText
		        let arr=text.split(":")
		        if (arr.length===3){
		            hour+=+arr[0]
		            min+=+arr[1]
		            second+=+arr[2]
		        }else {
		            min+=+arr[0]
		            second+=+arr[1]
		        }
		    })
		    min=min+Math.floor(second/60)
		    second%=60
		    hour=hour+Math.floor(min/60)
		    min%=60
		    return `${hour}:${min}:${second}`
	    }
        //计算剩余时长
        function calRestTime(){
            const liList=document.querySelectorAll('.cur-list .list-box li')
            let flag=false
            const newList=[]
            //从正在观看的条目往下计算
            liList.forEach(item=>{
                if(item.className&&'watched on'.includes(item.className)) flag=true
                if(flag){
                    newList.push(item)
                }
            })
             let hour=0
		    let min=0
		    let second=0
            newList.forEach(item=>{
                let text=item.innerText
                let arr=text.split('\n')[2].split(':')
                if (arr.length===3){
		            hour+=+arr[0]
		            min+=+arr[1]
		            second+=+arr[2]
		        }else {
		            min+=+arr[0]
		            second+=+arr[1]
		        }
            })
            min=min+Math.floor(second/60)
		    second%=60
		    hour=hour+Math.floor(min/60)
		    min%=60
            return `${hour}:${min}:${second}`
        }
        //渲染数据
        function addItem(totalTime='',restTime=''){
	        const multiPage=document.querySelector('#multi_page')
            let showSpan=document.querySelector('#multi_page .createSpan')
            if(!showSpan){
                showSpan=document.createElement('span')
                showSpan.innerHTML='视频总时长:'+totalTime+'&nbsp;&nbsp;&nbsp;剩余时长:'+restTime
                showSpan.className='createSpan'
                showSpan.style.left='0'
                showSpan.style.top='0'
                showSpan.style.color='red'
                showSpan.style.position='absolute'
                showSpan.style.transform='translateY(-20px)'
                multiPage.appendChild(showSpan)
            }else{
                showSpan.innerHTML='视频总时长:'+totalTime+'&nbsp;&nbsp;&nbsp;剩余时长:'+restTime
            }
	    }
	    //获取了总的视频时长
	    let totalTime=calTotalTime()
        let restTime=calRestTime()
	    addItem(totalTime,restTime)
        const listBox=document.querySelector('.cur-list')
        listBox.addEventListener('click',function(){
            let totalTime=calTotalTime()
            let restTime=calRestTime()
            addItem(totalTime,restTime)
        })
        //播放视频就刷新时长统计
        const video=document.querySelector('#playerWrap video')
        video.addEventListener('play',function (){
            let totalTime=calTotalTime()
            let restTime=calRestTime()
            addItem(totalTime,restTime)
        })
    },2000)
})();