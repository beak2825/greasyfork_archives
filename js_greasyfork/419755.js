// ==UserScript==
// @name         Gmail 激活码提取
// @namespace    pandora1m2
// @version      0.14
// @description  用于提取Gmail邮箱中特定的激活码
// @author       pandora1m2
// @match        https://mail.google.com/*
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_addStyle
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @require https://cdn.jsdelivr.net/bluebird/latest/bluebird.js
// @downloadURL https://update.greasyfork.org/scripts/419755/Gmail%20%E6%BF%80%E6%B4%BB%E7%A0%81%E6%8F%90%E5%8F%96.user.js
// @updateURL https://update.greasyfork.org/scripts/419755/Gmail%20%E6%BF%80%E6%B4%BB%E7%A0%81%E6%8F%90%E5%8F%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){
        let e1 = document.querySelector("div[class='gb_Ae gb_ze']")
        let i1 = document.createElement('button')
        i1.onclick=start
        i1.innerHTML='搜集激活码'
        i1.style.backgroundColor='#008CBA'
        i1.style.color='white'
        e1.appendChild(i1)
    }
    async function start(){
        let mails
        let data = new Array()
        if(!document.getElementsByClassName('UI')[0]){
            //console.log(1)
            document.querySelector("span[class='nU n1']").click()
            await Promise.delay(1000)
        }
        try{
            mails = document.getElementsByClassName('UI')[0].querySelectorAll('tr')
        }catch(err){
            console.log(err)
            return
        }
        //console.log(mails)
        for (let j = 0,len=mails.length; j < len; j++){
            let res = await ana2(mails[j])
            if(res){
                // console.log(res)
                data.push(res)
            }
        }
        try{
            document.querySelector("span[class='nU n1']").click()
        }catch(err){
            console.log(err)
        }
        if(data.length){
            download_as_excel(data)
        }else{
            console.log('未找到有效激活码')
        }
    }
    async function ana2(item){
        //console.log(item)
        let email = 'noreply@blizzardgames.cn'
        let sender_yP
        let sender_zF
        try{
            sender_yP = item.querySelector("span[class='yP']")
            sender_zF = item.querySelector("span[class='zF']")
        }catch(err){
            console.log(err)
            return
        }
        if((sender_yP && sender_yP.getAttribute('email') == email) ||(sender_zF && sender_zF.getAttribute('email') == email)){
            //console.log(sender_yP.innerHTML)
            item.click()
            await Promise.delay(1000)
            return getcode()
        }
        await Promise.delay(20)
    }
    function getcode(){
        try{
            let code = document.getElementsByClassName('gmail_quote')[1].querySelector("div[bgcolor]").getElementsByTagName('span')[1].innerText
            let product = document.getElementsByClassName('gmail_quote')[1].querySelector("div[bgcolor]").getElementsByTagName('span')[0].innerText
            let date = document.querySelector("span[class='g3']").getAttribute('title')
            //console.log(product)
            //console.log(code)
            return [product, code, date]
        }catch(err){
            console.log(err)
        }
    }
    function download_as_excel(data){
        // console.log(data)
        let CSV = '产品名,激活码,日期\r\n'
        for(let i = 0,len = data.length; i < len; i++){
            let row = ''
            for(let index in data[i]){
                if(index.toString().indexOf("-")>=0){
                    break
                }
                row += '"'+data[i][index]+'",'
            }
            row.slice(0, row.length-1)
            CSV += row + '\r\n'
        }
        // console.log(CSV)
        let filename= "激活码表.csv"
        //let uri = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURI(CSV)
        let blob = new Blob(['\uFEFF'+ CSV],{type: 'text/csv,charset=UTF-8'})
        let download_link = document.createElement("a")
        // download_link.innerHTML='如果下载没有开始，请点击'
        download_link.download = filename
        //download_link.href = uri
        download_link.href = URL.createObjectURL(blob)
        download_link.style = 'visibility:hidden'
        // document.body.appendChild(download_link)
        document.querySelector("div[class='gb_Ae gb_ze']").appendChild(download_link)
        download_link.click()
        document.querySelector("div[class='gb_Ae gb_ze']").removeChild(download_link)
    }
})();