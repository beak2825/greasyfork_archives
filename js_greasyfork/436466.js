// ==UserScript==
// @name         zut自动评教
// @namespace    http://zut.xx/
// @version      1.0
// @description  在zut评教系统中按照一定比率自动评教
// @author       JiGuang-2018
// @match        http://app.zut.edu.cn/jwapp/sys/jwwspj/*default/*
// @icon         https://www.google.com/s2/favicons?domain=zut.edu.cn
// @grant        GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/436466/zut%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/436466/zut%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let config = {
        step:0,
        size:0,
        goodRate:0.8
    }
    //注册的菜单和对应执行的函数
    let menus = [
    {
        name:'*0.设置好评比例',
        event:setGoodRate
    },
    {
        name:'1.读取题目数量',
        event:lookItems
    },
    {
        name:'2.开始评教',
        event:Main
    },
    ]

    //增加菜单
function addMenu(){
   for(let menu of menus){
   GM_registerMenuCommand(menu.name, menu.event)
   }
}

function setGoodRate(){
    config.goodRate = prompt('请输入好评比例',0.8) * 1
}

function lookItems(){
    try{
        config.size = document.querySelectorAll('.bh-radio-group-h').length
        if(config.size == 0) throw new Error('读取题目数量错误')
        config.step = 1
        alert('读取题目成功，共' + config.size + '道')
    }catch(err){
        alert('读取题目数量失败！')
    }
}

//const size = document.querySelectorAll('.bh-radio-group-h').length
//const goodRate = 0.8

function calcArray(size,goodRate){
    let res = []
    let goodTimes = size * goodRate
    let badTimes = size - goodTimes
    for(let i = 0; i < goodTimes; i++)
        res.push(1)
    for(let i = 0; i < badTimes - 1; i++)
        res.push(3)
    res.sort((p,n)=>{
        return (0.5 - Math.random())
    })
    return res
}

function selectOne(id,item){
    try{
        document.querySelectorAll('.bh-radio-group-h')[id].childNodes[item].click()
    }catch(err){
        console.error(`在选择题目${id}的${item}项失败`)
    }

}

function Main(){
    if(config.step != 1){
        alert('请先再设置菜单中读取题目再评教')
        return
    }
    let array = calcArray(config.size,config.goodRate)
    for(let index in array)
        selectOne(index,array[index])
    console.log('选择结束')
    alert('选择结束')
}

addMenu()
    // Your code here...
})();