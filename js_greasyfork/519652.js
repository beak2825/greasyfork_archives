// ==UserScript==
// @name         vr12斗
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  用于
// @author       Stormer
// @license MIT
// @match           *://*.bilibili.com/*
// @exclude         *://api.bilibili.com/*
// @exclude         *://api.*.bilibili.com/*
// @exclude         *://*.bilibili.com/api/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/519652/vr12%E6%96%97.user.js
// @updateURL https://update.greasyfork.org/scripts/519652/vr12%E6%96%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let container
    let innercontainer
    let startbtn
    let rankData
    let userInfo
    let finalData
    let previousRanking = []
    let previousChanges = {}
    let timer

     const finalrun=async()=>{
        previousRanking = rankData;
        await getrankData()
        getuserInfo()
    }
     //打开按钮
     startbtn=document.createElement('div')
     startbtn.innerText='开始斗虫'
     startbtn.style.position='fixed'
     startbtn.style.bottom='45%'
     startbtn.style.right='0'
     startbtn.style.zIndex=99999
     startbtn.style.textAlign='center'
     startbtn.style.cursor='pointer'
     startbtn.style.width='42px'
     startbtn.style.height='42px'
     startbtn.style.border='1px solid'
     startbtn.style.borderRadius='7px'
     document.body.append(startbtn)
     startbtn.onclick=()=>{
       container.style.display='block'
       startbtn.style.display='none'
       finalrun()
       timer=setInterval(()=>finalrun(),10000)
     }
     //创建列表
    const createlistDom=()=>{
       //dom
       container=document.createElement('div')
       container.style.width='400px'
       container.style.height='500px'
       container.style.backgroundColor='#fff'
       container.style.position='fixed'
       container.style.top='80px'
       container.style.right='0'
       container.style.zIndex='2000'
       container.style.boxShadow='-2px 2px 4px #00000014'
       container.style.borderRadius='3px'
       container.style.overflowY='auto'
       container.style.display='none'
       document.body.appendChild(container)
       let closebtn=document.createElement('div')
       closebtn.innerText='×'
       closebtn.style.position='absolute'
       closebtn.style.top='5px'
       closebtn.style.right='5px'
       closebtn.style.cursor='pointer'
       closebtn.setAttribute('id','blacklistclosebtn')
       container.appendChild(closebtn)
       let title=document.createElement('div')
       title.innerText='斗虫榜单'
       title.style.position='absolute'
       title.style.top='5px'
       title.style.left='5px'
       container.appendChild(title)
       innercontainer=document.createElement('div')
       container.appendChild(innercontainer)
       //关闭窗口
       closebtn.onclick=()=>{
         container.style.display='none'
         startbtn.style.display='block'
         clearInterval(timer)
       }
    }
    //填充列表
    const filllistDom=()=>{
      innercontainer.innerHTML=''
      innercontainer.style.marginTop='25px'
      rankData.forEach((rank,index)=>{
          const listItem = document.createElement('div')
          listItem.style.display='flex'
          listItem.style.justifyContent='flex-start'
          listItem.style.textAlign='left'

          const formattedScore = parseInt(rank.score).toLocaleString()

          //增量
          if (previousRanking&&previousRanking.length>0) {
              previousRanking.forEach(item=>{
               if(rank.uid==item.uid){
                const previousScore = parseInt(item.score);
                const currentScore = parseInt(rank.score);
                const diff = currentScore - previousScore;
                if (diff !== 0) {
                     rank['diff']=diff
                }else{
                     rank['diff']=''
                }
               }
              })
              
           }

          const rankingInfo = document.createElement('div');
          rankingInfo.style.display='flex'
          rankingInfo.innerHTML = `
               <div>
                 <img src="https:${rank.avatar}" alt="${rank.name}'s avatar" style="width:25px;height:25px">
                </div>
                <div style="width:220px">
                   <strong>Rank ${rank.number}</strong> - ${rank.name}
                </div>
                <div>
                   ${formattedScore}  ${rank.diff?'(+'+rank.diff+')':''}
                </div>
          `;

          listItem.appendChild(rankingInfo)
          innercontainer.appendChild(listItem)
      })
    }
     //url
     let ranking_url = "https://api.live.bilibili.com/xlive/fuxi-interface/RankingController/getRanking?_ts_rpc_args_=[%7B%22id%22:15540,%22type%22:1,%22cursor%22:0,%22length%22:100,%22teamDimensionValue%22:1%7D]"
     let user_info_url = "https://api.live.bilibili.com/xlive/fuxi-interface/UserService/getUserInfo?_ts_rpc_args_=[[56748733,7706705,690608698,1932862336,2039332008,434334701,1954091502,2124647716,1048135385,690608704,666726799,1609526545,6853766,14387072,529249,1323355750,690608691,477317922,434401868,392505232,1609795310,1711724633,1789460279,61639371,690608693,1116072703,2040984069,690608709,421267475,1570525137,472877684,558070433,1978590132,1296515170,2080519347,1297910179,12485637,2057377595,690608688,1694351351,1567394869,690608710,1405589619,176836079,480675481,1827139579,1542516095],false,%22%22]"
     let alluser_info_url="https://api.bilibili.com/x/space/acc/info?mid="
    //getData
    function getrankData(){
      GM_xmlhttpRequest({
        methods:'get',
        url:ranking_url,
        headers:{
           'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0',
           'Connection':'keep-alive',
        },
        onload:function(res){
          rankData=JSON.parse(res.response)._ts_rpc_return_.data.list
        },
        onerror:function(res){
          console.log('获取失败')
        }
      })
    }
    function getuserInfo(){
      GM_xmlhttpRequest({
        methods:'get',
        url:user_info_url,
        headers:{
           'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0',
           'Connection':'keep-alive',
        },
        onload:function(res){
          userInfo=JSON.parse(res.response)._ts_rpc_return_.data
            rankData.forEach((item)=>{
               item['avatar']=userInfo[item.uid]?userInfo[item.uid].face:''
               item['name']=userInfo[item.uid]?userInfo[item.uid].uname:''
             })
            filllistDom()
        },
        onerror:function(res){
          console.log('获取失败')
        }
      })
    }


    createlistDom()

})();