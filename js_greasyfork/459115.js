// ==UserScript==
// @name         花园脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于魔法花园自动收花、播种施肥等。自用！！！
// @author       p317134262
// @license      MIT
// @match        http://123.207.116.159:8098/mfhy/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=116.159
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459115/%E8%8A%B1%E5%9B%AD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/459115/%E8%8A%B1%E5%9B%AD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url = window.location.href
    if(url.includes('garden/index.asp')){
        console.log('花园首页')
        let _yijian = document.getElementsByClassName('deep')
        let caozuo = _yijian[0].getElementsByTagName('a')//
        let cbcj=caozuo[1]//一键操作按钮
        let bz=caozuo[2]//一键播种按钮
        let allA = document.getElementsByTagName('a')
        let allP=[]//所有已经播种的盆
        let tuP = []//所有已经播种的土盆
        let shuiP=[]//所有已经播种的水盆
        for(let i=0;i<allA.length;i++){//筛选出所有未成熟的花盆
            if(allA[i].href.includes("pot/prodInfo.asp")){
                if(!allA[i].nextElementSibling.innerText.includes('收获')){
                    allP.push(allA[i])
                }
            }
        }
        console.log(allP)
        //return
        if(allP.length==0){
        //if(allP.length<=14){
        //if(allP.length<=7){
            setTimeout(()=>{
                cbcj.click()
            },400)
        }else{
            tuP=allP.slice(0,allP.length-7)//刷土盆
            shuiP=allP.slice(14,allP.length)//水盆
            setTimeout(()=>{
                //tuP[0].click()
                //shuiP[0].click()
                allP[0].click()
            },400)
        }
    }else if(url.includes('pot/prodInfo.asp')){
        console.log('详情页面，进行施肥')
        let allA = document.getElementsByTagName('a')
        let allF=[]//四种肥料的集合
        for(let i=0;i<allA.length;i++){
           if(allA[i].href.includes("pot/urgeProd.asp")){
               allF.push(allA[i])
           }
        }
        setTimeout(()=>{
            allF[1].click()
        },400)
        //allF[3].click()
    }else if(url.includes('pot/urgeProdRes.asp')){
        console.log('施肥成功，返回花园')
        let btn = document.getElementsByTagName('a')
        let toIndex=null
        for(let i=0;i<btn.length;i++){
            if(btn[i].href.includes("garden/index.asp")){
                toIndex=btn[i]
            }
        }
        setTimeout(()=>{
            toIndex.click()
        },400)
    }else if(url.includes('pot/okdooperRes.asp') && url.includes('operResult=2')){//收获后立即播种
        let allA = document.getElementsByTagName('a')
        let bzBtn=''
        for(let i=0;i<allA.length;i++){
           if(allA[i].href.includes("pot/prepOkSow.asp")){
               bzBtn=allA[i]
           }
        }
        setTimeout(()=>{
            bzBtn.click()
        },400)
    }else if(url.includes('pot/okSowIndex.asp')){//确认播种
        let allA = document.getElementsByTagName('a')
        let bzBtn=''
        for(let i=0;i<allA.length;i++){
           if(allA[i].href.includes("pot/okSow.asp")){
               bzBtn=allA[i]
           }
        }
        setTimeout(()=>{
            bzBtn.click()
        },400)
    }else if(url.includes('pot/okSowRes.asp')){//播种后浇水
        let allA = document.getElementsByTagName('a')
        let bzBtn=''
        for(let i=0;i<allA.length;i++){
           if(allA[i].href.includes("pot/okdooper.asp")){
               bzBtn=allA[i]
           }
        }
        setTimeout(()=>{
            bzBtn.click()
        },400)
    }else if(url.includes('pot/okdooperRes.asp') && url.includes('operResult=0')){//浇完水返回花园
        let allA = document.getElementsByTagName('a')
        let bzBtn=''
        for(let i=0;i<allA.length;i++){
           if(allA[i].href.includes("garden/index.asp")){
               bzBtn=allA[i]
           }
        }
        setTimeout(()=>{
            bzBtn.click()
        },400)
    }else if(url.includes('roll/rollInfo.asp')){//花册领取肥料
        let allA = document.getElementsByTagName('a')
        let bzBtn=[]
        for(let i=0;i<allA.length;i++){
           if(allA[i].href.includes("roll/openRollIndex.asp")){
               bzBtn.push(allA[i])
           }
        }
        setTimeout(()=>{
            bzBtn[0].click()
        },400)
    }else if(url.includes('roll/openRollIndex.asp')){//确定领取肥料
        let allA = document.getElementsByTagName('a')
        let bzBtn=[]
        for(let i=0;i<allA.length;i++){
           if(allA[i].href.includes("roll/openRoll.asp")){
               bzBtn.push(allA[i])
           }
        }
        setTimeout(()=>{
            bzBtn[0].click()
        },400)
    }else if(url.includes('roll/openRollRes.asp')){//确定领取肥料
        let allA = document.getElementsByTagName('a')
        let bzBtn=[]
        for(let i=0;i<allA.length;i++){
           if(allA[i].href.includes("roll/rollInfo.asp")){
               bzBtn.push(allA[i])
           }
        }
        setTimeout(()=>{
            bzBtn[0].click()
        },400)
    }else if(url.includes('hoppetInfo')){//选第一个花（扔掉）
        let allA = document.getElementsByTagName('a')
        let bzBtn=[]
        let type=[]
        for(let i=0;i<allA.length;i++){
           if(allA[i].href.includes("type=")){
               type.push(allA[i])
           }
        }
        for(let i=0;i<allA.length;i++){
           if(allA[i].href.includes("prodInfo.asp")){
               bzBtn.push(allA[i])
           }
        }
        console.log(type)
        if(bzBtn.length==0){
            let arr=[]
            for(let e=0;e<type.length;e++){
                arr.push(type[e].href.slice(type[e].href.length-1))
            }
            console.log(arr)
            if(!arr.includes('0')){
                setTimeout(()=>{
                    type[0].click()
                },400)
            }else if(!arr.includes('1')){
                setTimeout(()=>{
                    type[1].click()
                },400)
            }else if(!arr.includes('2')){
                setTimeout(()=>{
                    type[2].click()
                },400)
            }
        }
        setTimeout(()=>{
            bzBtn[0].click()
        },400)
    }else if(url.includes('fhouse/prodInfo.asp')){//点击回收
        let allA = document.getElementsByTagName('a')
        let bzBtn=[]
        for(let i=0;i<allA.length;i++){
           if(allA[i].href.includes("fhouse/sellIndex.asp")){
               bzBtn.push(allA[i])
           }
        }
        setTimeout(()=>{
            bzBtn[0].click()
        },400)
    }else if(url.includes('fhouse/sellIndex')){//确定丢弃
        let allA = document.getElementsByTagName('input')
        let bzBtn=[]
        if(parseInt(allA[1].value)>999){
            allA[1].value=999
        }
        setTimeout(()=>{
            allA[2].click()
        },400)

    }else if(url.includes('fhouse/sellRes')){//返回花厅
        let allA = document.getElementsByTagName('a')
        let bzBtn=[]
        for(let i=0;i<allA.length;i++){
           if(allA[i].href.includes("fhouse/hoppetInfo.asp")){
               bzBtn.push(allA[i])
           }
        }
        setTimeout(()=>{
            bzBtn[0].click()
        },400)
    }

    //allF[0].click()
    // Your code here...
})();