// ==UserScript==
// @name         nga楼内关键字统计
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  用于在nga论坛楼内关键字出现次数统计
// @author       Stormer
// @license MIT
// @match       *://nga.178.com/read.php?*
// @match       *://bbs.nga.cn/read.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nga.178.com
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/475264/nga%E6%A5%BC%E5%86%85%E5%85%B3%E9%94%AE%E5%AD%97%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/475264/nga%E6%A5%BC%E5%86%85%E5%85%B3%E9%94%AE%E5%AD%97%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
     //启动按钮
     let startbtn=document.createElement('div')
     startbtn.innerText='开始统计'
     startbtn.setAttribute('class','nav_link')
     startbtn.style.position='absolute'
     startbtn.style.top=0
     startbtn.style.right='385px'
     startbtn.style.cursor='pointer'
     document.body.append(startbtn)
     //关键字输入框
     let keywordinput=document.createElement('input')
     keywordinput.placeholder='关键字(多个以/划分)'
     keywordinput.style.width='200px'
     keywordinput.style.height='30px'
     keywordinput.style.position='absolute'
     keywordinput.style.top=0
     keywordinput.style.right='455px'
     document.body.append(keywordinput)
     //范围输入框
     let pageinput=document.createElement('input')
     pageinput.placeholder='到多少页'
     pageinput.type='number'
     pageinput.style.width='80px'
     pageinput.style.height='30px'
     pageinput.style.position='absolute'
     pageinput.style.top=0
     pageinput.style.right='665px'
     document.body.append(pageinput)
     //展示了处理进度框
     let progress=document.createElement('div')
     progress.style.width='125px'
     progress.style.height='30px'
     progress.style.position='absolute'
     progress.style.top='10px'
     progress.style.right='775px'
     progress.style.fontSize='14px'
     document.body.append(progress)
     //获取请求的url
     let url=''
     if(location.href.includes('page')){
       let tempindex=location.href.indexOf('page')-1
       url=location.href.slice(0,tempindex)
     }else{
       url=location.href
     }
     //获取最后一页是多少页
     let outerdiv=document.querySelector('#m_pbtntop')
     let lastadom=outerdiv.getElementsByTagName('a')
     lastadom[lastadom.length-1].click()
     document.querySelector('.colored_text_btn').click()
     let origingroup=document.querySelector('.ltxt.group')
     let pagelinklist=origingroup.getElementsByTagName('a')
     let maxpage=Number(pagelinklist[pagelinklist.length-1].innerText)
     console.log(maxpage)
     //事件启动
    startbtn.onclick=()=>{
       let keyword=keywordinput.value
       let pagevalue=pageinput.value
       if(pagevalue<=0){
           alert('页数需大于0')
           return;
       }else if(pagevalue>maxpage){
           alert('页数需小于最大页'+maxpage)
           return;
       }else if(keyword.trim()<=0){
           alert('关键字长度需大于0')
           return;
       }else{
         //cookie处理
         let cookie=document.cookie
         let cookiearr= cookie.split(';')
         let cookieobj={}
         for(let i=0;i<cookiearr.length;i++){
           let key=cookiearr[i].indexOf('=')
           let name=cookiearr[i].slice(0,key).trim()
           let value=cookiearr[i].slice(key+1).trim()
           cookieobj[name]=value
         }
         //关键字处理
         let keywordarr=keyword.split('/')
         let result={}
         analysis(1,cookieobj,keywordarr,result,pagevalue)
       }
    }
    //需要执行的事件
    function analysis(page,cookie,keywordarr,result,pagevalue){
      GM_xmlhttpRequest({
        methods:'get',
        url:url+'&page='+page,
        headers:{
           'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0',
           'Connection':'keep-alive',
        },
        onload:function(res){
          let text=''
          let tempdom=document.createElement('div')
          tempdom.innerHTML=res.responseText
          let spanlist=tempdom.getElementsByTagName('span')
          for(let i=0;i<spanlist.length;i++){
            if(spanlist[i].id.includes('postcontent')&&!spanlist[i].id.includes('subject')){
               text+=spanlist[i].innerText
            }
          }
          for(let i=0;i<keywordarr.length;i++){
              let key=keywordarr[i]
              let regex=new RegExp(key,'g')
              let regexresult=text.match(regex)
              let count=!regexresult?0:regexresult.length
              if (!(key in result)) {
                  result[key]=0
              }else{
                  result[key]+=count
              }
          }
          progress.innerText='已处理到'+page
          //console.log('已处理到'+page)
          page++
          if(page<=pagevalue){
              analysis(page,cookie,keywordarr,result,pagevalue)
          }else{
             console.log('结果是'+JSON.stringify(result))
             progress.innerText=''
             alert('结果是'+JSON.stringify(result))
          }
        },
        onerror:function(res){
          console.log(res)
        }
      })
    }
})();