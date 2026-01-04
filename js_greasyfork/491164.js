// ==UserScript==
// @name         b站自用屏蔽脚本
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  bilibili自用屏蔽脚本
// @author       stromer
// @license MIT
// @match           *://*.bilibili.com/*
// @exclude         *://api.bilibili.com/*
// @exclude         *://api.*.bilibili.com/*
// @exclude         *://*.bilibili.com/api/*
// @exclude         *://member.bilibili.com/studio/bs-editor/*
// @exclude         *://t.bilibili.com/h5/dynamic/specification
// @exclude         *://bbq.bilibili.com/*
// @exclude         *://message.bilibili.com/pages/nav/header_sync
// @exclude         *://s1.hdslb.com/bfs/seed/jinkela/short/cols/iframe.html
// @exclude         *://open-live.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_log
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/491164/b%E7%AB%99%E8%87%AA%E7%94%A8%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/491164/b%E7%AB%99%E8%87%AA%E7%94%A8%E5%B1%8F%E8%94%BD%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var uplist
    var titlelist
    var timerflag=true
    var videocardlength
    var videocardlength2

    //body加载后就执行
    const contentLoaded=(callback)=>{
        if(document.readyState!='loading'){
            callback()
        }else{
            document.addEventListener('DOMContentLoaded',()=>callback())
        }
    }
    //load事件以后
    const fullyLoaded=(callback)=>{
        if(document.readyState=='complete'){
            callback()
        }else{
            unsafeWindow.addEventListener('load',()=>callback())
        }
    }


    //1、
    //屏蔽搜索框中的提示,仅屏蔽显示，直接搜索或直接按回车原本隐藏的内容仍然会生效
    const hidesearchElement=async()=>{
        //let blockup=await GM.getValue('block_up')
        //let blocktitle=await GM.getValue('block_title')
        let searchobserver=new MutationObserver(mutations=>{
            mutations.forEach(item=>{
                if(item.target instanceof HTMLInputElement){
                    //主页&&视频播放页
                    if(item.target.classList.contains('nav-search-input')&&item.target.placeholder != '搜索'){
                        item.target.placeholder ='搜索'
                        item.target.title =''
                    }
                    //直播页
                    if(item.target.classList.contains('nav-search-content')&&item.target.placeholder != '搜索'){
                        item.target.placeholder ='搜索'
                        item.target.title =''
                    }
                }
            })
        })
        searchobserver.observe(document.body,
                         {childList: true,
                          subtree: true,
                          attributes: true,
                          characterData: true,})
    }
    //首页和搜索页屏蔽
     const hidemainvideoElement=async()=>{
        let blockup=await GM.getValue('block_up')
        let blocktitle=await GM.getValue('block_title')
        let mainvideoobserver=new MutationObserver(mutations=>{
            mutations.forEach(item=>{
                videocardlength=document.querySelectorAll('.bili-video-card').length
                let videocard=document.querySelectorAll('.bili-video-card')
                videocard.forEach(videoitem=>{
                  let authoritem=videoitem.querySelector('.bili-video-card__info--author')
                  let titleitem=videoitem.querySelector('.bili-video-card__info--tit > a')
                  let imagelink=videoitem.querySelector('.bili-video-card__image--link')
                  //如果是搜索页面重新获取元素
                  if(!titleitem){
                    titleitem=videoitem.querySelector('.bili-video-card__info--right > a')
                    imagelink=videoitem.querySelector('.bili-video-card__wrap>a')
                  }
                  if(authoritem&&titleitem){
                    let authorname=authoritem.innerText
                    let titlename=titleitem.innerText
                    let url=titleitem.href
                    //满足屏蔽条件
                    if(blockup.some(up=>up==authorname)||blocktitle.some(title=>titlename.includes(title))){
                      let coveritem=videoitem.querySelector('.v-img.bili-video-card__cover')
                      let miniplayer=videoitem.querySelector('.v-inline-player')
                      coveritem.innerHTML=url
                      //authoritem.innerHTML='已屏蔽up'
                      titleitem.innerHTML='已屏蔽标题'
                      imagelink.href='javascript:void(0);'
                      imagelink.style.pointerEvents='none'
                      if(miniplayer){
                        miniplayer.innerHTML=''
                        miniplayer.remove()
                      }
                      titleitem.href='javascript:void(0);'
                      //防止死循环，每次修改后重新启动
                      mainvideoobserver.disconnect()
                      let temptimer=setTimeout(()=>{
                        mainvideostart()
                      },1)
                    }
                  }
               })
            })
        })

        //封装用于再启动
        function mainvideostart(){
          let feeds=document.querySelector('.feed2')
          let searchresult=document.querySelector('.search-layout')
          if(feeds){
           mainvideoobserver.observe(feeds,
                         {childList: true,
                          subtree: true,
                          attributes: true,
                         characterData: true,})
         }else if(searchresult){
          mainvideoobserver.observe(searchresult,
                         {childList: true,
                          subtree: true,
                          attributes: true,
                         characterData: true,})
         }
        }
        mainvideostart()
        

    }
     //接下来看屏蔽
     const hidenextvidoElement=async()=>{
        let blockup=await GM.getValue('block_up')
        let blocktitle=await GM.getValue('block_title')
        let nextvideoobserver=new MutationObserver(mutations=>{
            mutations.forEach(item=>{
                videocardlength2=document.querySelectorAll('.video-page-card-small').length
                let videocard=document.querySelectorAll('.video-page-card-small')
                videocard.forEach(videoitem=>{
                  let authoritem=videoitem.querySelector('.upname')
                  console.log(authoritem)
                  let titleitem=videoitem.querySelector('.info > a')
                  if(authoritem&&titleitem){
                    let authorname=authoritem.innerText
                    let titlename=titleitem.innerText
                    let url=titleitem.href
                    //满足屏蔽条件
                    if(blockup.some(up=>up==authorname)||blocktitle.some(title=>titlename.includes(title))){
                      let coveritem=videoitem.querySelector('.pic')
                      let miniplayer=videoitem.querySelector('.v-recommend-inline-player')
                      coveritem.innerHTML=url
                      //authoritem.innerHTML='已屏蔽up'
                      titleitem.innerHTML='已屏蔽标题'
                      titleitem.style.pointerEvents='none'
                      if(miniplayer){
                        miniplayer.innerHTML=''
                        miniplayer.remove()
                      }
                       //防止死循环，每次修改后重新启动
                      nextvideoobserver.disconnect()
                      let temptimer=setTimeout(()=>{
                        nextvideostart()
                      },1)
                    }
                  }
               })
            })
        })

         //封装用于再启动
        function nextvideostart(){
          let recommendlist=document.querySelector('.recommend-list-v1')
          nextvideoobserver.observe(recommendlist,
                         {childList: true,
                          subtree: true,
                          attributes: true,
                         characterData: true,})
        }
        nextvideostart()
     }
     //自动播放屏蔽
     const hideautovidoElement=async()=>{
        let blockup=await GM.getValue('block_up')
        let blocktitle=await GM.getValue('block_title')
        let autovideoobserver=new MutationObserver(mutations=>{
            mutations.forEach(item=>{
                let videocard=document.querySelectorAll('.bpx-player-ending-related-item')
                console.log(videocard)
                videocard.forEach(videoitem=>{
                  let titleitem=videoitem.querySelector('.bpx-player-ending-related-item-title')
                  if(titleitem){
                    let titlename=titleitem.innerText
                   //满足屏蔽条件
                  if(blocktitle.some(title=>titlename.includes(title))){
                    let coveritem=videoitem.querySelector('.bpx-player-ending-related-item-img')
                    coveritem.style=''
                    titleitem.innerHTML='已屏蔽标题'
                    item.href='javascript:void(0);'
                    item.style.pointerEvents='none'
                    titleitem.href='javascript:void(0);'
                     //防止死循环，每次修改后重新启动
                      autovideoobserver.disconnect()
                      let temptimer=setTimeout(()=>{
                        autovideostart()
                      },1)
                 }
               }
              })

            })
        })

          //封装用于再启动
        function autovideostart(){
          let autoplaylist=document.querySelector('.bpx-player-ending-wrap')
        autovideoobserver.observe(autoplaylist,
                         {childList: true,
                          subtree: true,
                          attributes: true,
                         characterData: true,})
        }
        autovideostart()
     }

    //2、创建黑名单dom，默认隐藏，以及添加删除，上传
    const createBlacklist=()=>{
       //dom
       let container=document.createElement('div')
       container.style.width='220px'
       container.style.height='500px'
       container.style.backgroundColor='#fff'
       container.style.position='fixed'
       container.style.top='80px'
       container.style.left='0'
       container.style.zIndex='2000'
       container.style.boxShadow='-2px 2px 4px #00000014'
       container.style.borderRadius='3px'
       container.style.overflowY='auto'
       container.setAttribute('id','blacklist')
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
       title.innerText='黑名单'
       title.style.position='absolute'
       title.style.top='5px'
       title.style.left='5px'
       container.appendChild(title)
       let input=document.createElement('input')
       input.style.width='90%'
       input.style.margin='30px 3% 3px'
       input.setAttribute('id','blacklistinput')
       container.appendChild(input)
       let secondline=document.createElement('div')
       secondline.style.display='flex'
       let select=document.createElement('select')
       select.innerHTML=`
        <option value="up">up</option>
        <option value="title">标题</option>
       `
       select.style.width='44%'
       select.style.margin='3px 3%'
       select.setAttribute('id','blacklistselect')
       secondline.appendChild(select)
       let confirmbtn=document.createElement('div')
       confirmbtn.innerText='确认'
       confirmbtn.style.width='22%'
       confirmbtn.style.margin='3px 3%'
       confirmbtn.style.fontSize='14px'
       confirmbtn.style.border='1px solid'
       confirmbtn.style.borderRadius='3px'
       confirmbtn.style.textAlign='center'
       confirmbtn.style.cursor='pointer'
       confirmbtn.setAttribute('id','blacklistconfirm')
       secondline.appendChild(confirmbtn)
       let uploadbtn=document.createElement('div')
       uploadbtn.innerText='批量上传'
       uploadbtn.style.width='30%'
       uploadbtn.style.margin='3px 3%'
       uploadbtn.style.fontSize='12px'
       uploadbtn.style.border='1px solid'
       uploadbtn.style.borderRadius='3px'
       uploadbtn.style.textAlign='center'
       uploadbtn.style.cursor='pointer'
       uploadbtn.setAttribute('id','blacklistupload')
       let uploadinput=document.createElement('input')
       uploadinput.setAttribute('type','file')
       uploadinput.setAttribute('accept','.json')
       secondline.appendChild(uploadbtn)
       container.appendChild(secondline)
       let titletitle=document.createElement('div')
       titletitle.style.marginTop='10px'
       titletitle.innerText='标题'
       let line2=document.createElement('div')
       line2.style.width='95%'
       line2.style.height='1px'
       line2.style.backgroundColor='#ccc'
       let titlecontainer=document.createElement('div')
       titlecontainer.style.display='flex'
       titlecontainer.style.flexWrap='wrap'
       container.appendChild(titletitle)
       container.appendChild(line2)
       container.appendChild(titlecontainer)
       let uptitle=document.createElement('div')
       uptitle.style.marginTop='10px'
       uptitle.innerText='Up'
       let line=document.createElement('div')
       line.style.width='95%'
       line.style.height='1px'
       line.style.backgroundColor='#ccc'
       let upcontainer=document.createElement('div')
       upcontainer.style.display='flex'
       upcontainer.style.flexWrap='wrap'
       container.appendChild(uptitle)
       container.appendChild(line)
       container.appendChild(upcontainer)


       //数据加载
       const getupData=async()=>{
           uplist=await GM.getValue('block_up')
           upcontainer.innerHTML=''
           uplist.forEach((item,index)=>{
               let span=document.createElement('span')
               span.innerText=item
               span.style.border='1px solid'
               span.style.borderRadius='3px'
               span.style.margin='2px'
               let inspan=document.createElement('span')
               inspan.innerText='×'
               inspan.style.cursor='pointer'
               inspan.style.color='#f00'
               span.appendChild(inspan)
               upcontainer.appendChild(span)
               inspan.onclick=()=>{
                 uplist=uplist.filter(i=>i!=item)
                 GM.setValue('block_up',uplist)
                 span.style.display='none'
               }
           })
       }
       const gettitleData=async()=>{
           titlelist=await GM.getValue('block_title')
           titlecontainer.innerHTML=''
           titlelist.forEach((item,index)=>{
               let span=document.createElement('span')
               span.innerText=item
               span.style.border='1px solid'
               span.style.borderRadius='3px'
               span.style.margin='2px'
               let inspan=document.createElement('span')
               inspan.innerText='×'
               inspan.style.cursor='pointer'
               inspan.style.color='#f00'
               span.appendChild(inspan)
               titlecontainer.appendChild(span)
               inspan.onclick=()=>{
                 titlelist=titlelist.filter(i=>i!=item)
                 GM.setValue('block_title',titlelist)
                 span.style.display='none'
               }
           })
       }
       getupData()
       gettitleData()
       //确认操作
       confirmbtn.onclick=async()=>{
         if(select.value=='up'){
            if(!uplist){
              GM.setValue('block_up',[input.value])
            }else{
              let arr=[...uplist,input.value]
              GM.setValue('block_up',arr)
            }
            getupData()
         }else{
           if(!titlelist){
              GM.setValue('block_title',[input.value])
            }else{
              let arr=[...titlelist,input.value]
              GM.setValue('block_title',arr)
            }
            gettitleData()
         }
       }
       //批量上传
       uploadbtn.onclick=()=>{
        uploadinput.click()
       }
       uploadinput.onchange=()=>{
         let file=uploadinput.files[0]
         let reader=new FileReader()
         reader.readAsText(file)
         reader.onload=(e)=>{
           let jsondata=JSON.parse(e.target.result)
           let temp1=jsondata.up.filter(i=>uplist.every(item=>item!=i))
           let temp2=jsondata.title.filter(i=>titlelist.every(item=>item!=i))
           let arr1=[...uplist,...temp1]
           let arr2=[...titlelist,...temp2]
           GM.setValue('block_up',arr1)
           GM.setValue('block_title',arr2)
           getupData()
           gettitleData()
           uploadinput.value=''
         }
       }
       //关闭窗口
       closebtn.onclick=()=>{
         container.style.display='none'
       }
    }
    //3、打开黑名单
    const openBlacklist=()=>{
      window.addEventListener('mousemove',(e)=>{
       if(e.clientX<=2){
         let blacklist=document.querySelector('#blacklist')
         if(blacklist.style.display!='block'){
           blacklist.style.display='block'
         }
       }
      })
    }
    //包裹所有函数的函数
    const allfun=()=>{
        //1
        hidesearchElement()
        hidemainvideoElement()
        hidenextvidoElement()
        hideautovidoElement()
        //2
        createBlacklist()
        //3
        openBlacklist()
    }
    //执行
    contentLoaded(allfun)
})();