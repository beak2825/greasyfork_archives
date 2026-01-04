// ==UserScript==
// @name         PC大讲堂辅助
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  批量添加课程自动播放
// @author       Azhjie
// @match        http://djt.ztzs.cn/kng/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389672/PC%E5%A4%A7%E8%AE%B2%E5%A0%82%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/389672/PC%E5%A4%A7%E8%AE%B2%E5%A0%82%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getList(){
        return JSON.parse(localStorage.getItem('queueList')||'[]') // 取本地队列
    }

    function setList(arr){
        localStorage.setItem('queueList',JSON.stringify(arr)) // 存本地队列
    }

    function addList(){
        const queueList = getList()
        let list = document.querySelectorAll('.normalrow.clearfix') // 取当前页面视频列表
        list.forEach((item,index)=>{
            const status = item.children[1] && item.children[1].className // 视频状态
            const href = item.children[2] && item.children[2].children[1] && item.children[2].children[1].href // 视频地址
            const time = item.children[4] && item.children[4].innerText // 视频时长
            const url = href.split('(\'')[1].split('\',\'')[0] // 实际有用的地址

            // 排除已开始的
            if(!status.includes('picnostart')){
                return
            }
            // 排除考试
            if(href.includes('exam')){
                return
            }
            // 排除重复
            if(queueList.some(i=>i.el ===url)){
                return
            }
            queueList.push({time:time,el:url})

        })
        setList(queueList)
    }

    function start(){
        if(window.timer){ // 清空计时器
            clearTimeout(window.timer)
        }
        var queueList = getList()
        if(queueList.length<1)return //没有队列了就停止吧
        var item = queueList[0]

        window.open(item.el)

        const time = (Number.parseInt(item.time)+1)*1000 * 60
        console.log(time)
        window.timer = setTimeout(()=>{// 开启计时器
            queueList.shift()//删掉已打开的
            setList(queueList)//保存本地化
            start()
        },time)
    }
    var queueNode = document.createElement('div')
    queueNode.id = 'queue'
    queueNode.style = 'position:fixed;top:5px;right:5px'
    document.body.appendChild(queueNode)

    var checkBtn = document.createElement('button')
    checkBtn.innerText = '查看队列'
    checkBtn.onclick = ()=>{
        var list = getList()
        var time = 0
        list.forEach((item)=>{
           time += Number.parseInt(item.time)
        })
        alert('视频'+list.length+'个， 时长'+Number.parseInt(time/60)+'小时'+time%60+'分钟'+JSON.stringify(list))
    }

    var clearBtn = document.createElement('button')
    clearBtn.innerText = '清空队列'
    clearBtn.onclick = ()=>{
        setList([])
    }

    var startBtn = document.createElement('button')
    startBtn.innerText = '开始'
    startBtn.onclick = ()=>{
        start()
    }

    var addBtn = document.createElement('button')
    addBtn.innerText = '添加队列'
    addBtn.onclick = ()=>{
        addList()
    }
    queueNode.appendChild(checkBtn)
    queueNode.appendChild(clearBtn)
    queueNode.appendChild(startBtn)
    queueNode.appendChild(addBtn)


    // Your code here...
})();