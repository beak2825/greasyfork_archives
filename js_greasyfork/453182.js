// ==UserScript==
// @name         起点小说解锁|VIP章节免费阅读|极速章节识别
// @version      1.3.4
// @description  可解锁起点小说VIP付费章节。基本还原付费效果，无需设置即可阅读。
// @author       JiGuang
// @namespace    www.xyde.net.cn
// @homepageURL  http://www.xyde.net.cn
// @match        https://vipreader.qidian.com/chapter/*
// @require https://cdn.jsdelivr.net/npm/sweetalert2@11
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @grant GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/453182/%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E8%A7%A3%E9%94%81%7CVIP%E7%AB%A0%E8%8A%82%E5%85%8D%E8%B4%B9%E9%98%85%E8%AF%BB%7C%E6%9E%81%E9%80%9F%E7%AB%A0%E8%8A%82%E8%AF%86%E5%88%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/453182/%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E8%A7%A3%E9%94%81%7CVIP%E7%AB%A0%E8%8A%82%E5%85%8D%E8%B4%B9%E9%98%85%E8%AF%BB%7C%E6%9E%81%E9%80%9F%E7%AB%A0%E8%8A%82%E8%AF%86%E5%88%AB.meta.js
// ==/UserScript==
//对脚本的更新
(function() {
  'use strict';
    //全局配置
    var config = {
        //配置版本号
        version:1,
        //支持的书源地址
        webSites : ["https://www.aishangba.org/","https://www.biqugee.com/","https://www.mibaoge.com/"],//
        //书源描述
        webDesc:["第一个","第二个","第三个"],//
        //正在使用的书源
        webSiteIndex : 0
    }
    //注册的菜单和对应执行的函数
    var menus = [
    {
        name:'打开设置',
        event:openSetting
    },
    ]

    //增加菜单
    function addMenu(){
        for(var menu of menus){
        GM_registerMenuCommand(menu.name, menu.event)
    }
    }

    //添加新书源
    function openSetting(){
        try{
            document.querySelector("#j_navSettingBtn > a").click()
        }catch(e){
            notify('打开设置失败','warning')
        }
    }


    //把更换书源增加到设置菜单
    function hookSetting(){
        let bookhtml = ``
        for(var di in config.webDesc){
          bookhtml += `<option value="${di}">${config.webDesc[di]}</option>`
        }
        if(!document.querySelector(".setting-list-wrap")){
            setTimeout(hookSetting,1000)
            return
        }
        let e = document.createElement('div')
        e.innerHTML = `<li class="remind" style="margin-top:10px;">
<i>书源切换</i>
<select id="select" style="position:relative;top:5px">
<option value="#">请选择要切换的书源</option>
${bookhtml}
</select>
</li>`
        document.querySelector(".setting-list-wrap").firstElementChild.appendChild(e)
        document.querySelector("#select").onchange = function(){mergeOne(document.querySelector("#select").value)}
    }
    //提示用户
    function notify(title = '操作成功',type = 'success',show = true){
        console.log(title)
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 4000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        })
        if(show)
        Toast.fire({
            icon: type,
            title: title
        })
        return Toast
    }

    //获取章节名
    function QDgetBookChapter(){
      if(document.querySelector("div > div.text-head > h3 > span.content-wrap")){
        let res = '' + document.querySelector("div > div.text-head > h3 > span.content-wrap").innerText
        res = res.replace(' ','')
        return res
      }
      return undefined
    }

    //获取书本名
    function QDgetBookName(){

      return document.querySelector("#bookImg").innerText
       
    }

    //设置页面阅读内容
    function QDsetContent(content){
      document.querySelector("div > div.read-content.j_readContent").innerHTML = content
      document.querySelector("div > div.vip-limit-wrap > h3").innerText = '已订阅本章付费VIP章节'
      //document.getElementsByClassName('read-content')[0].setAttribute('style','line-height: 1.5;letter-spacing: 1px')
    }

    //将请求的url的html内容转化成document对象
    async function parseDocFromAjax(method,url){
      return new Promise((resolve,reject) => {
          GM_xmlhttpRequest({
              method,
              url,
              onload:(res) => {
                console.log(res)

                  let htmldoc = document.createElement('html')
                  htmldoc.innerHTML = res.response
                  resolve(htmldoc)
              },
              onerror:(err) => {
                  reject(err)
              }
          })
      })
    }

    //搜索小说并返回结果
    async function searchBook(){
      const r = await parseDocFromAjax('GET',config.webSites[config.webSiteIndex] + '/search.php?keyword=' + QDgetBookName())
     const bookList = r.querySelectorAll("body div.result-list div div.result-game-item-detail h3 a")
const authorList = r.querySelectorAll("body div.result-list div div.result-game-item-detail div p:nth-child(1) span:nth-child(2)")
      let resList = []
      for(let i in bookList){
        if(bookList[i].title){
          resList.push({bookName:bookList[i].title,author:authorList[i].innerText,url:config.webSites[config.webSiteIndex] + bookList[i].pathname})
        }
      }
      return resList
    }

    //获取小说目录
    async function getChapterList(bookUrl){
      let resList = []
      const r = await parseDocFromAjax('GET',bookUrl)
      const cateList = r.querySelectorAll("#list > dl > dd > a")
      for(let i in cateList){
        let url = '' + cateList[i].href
        url = url.replace('https://vipreader.qidian.com/',config.webSites[config.webSiteIndex])
        resList.push({title:cateList[i].innerText,url:url})
      }
      return resList
    }

    //获取章节内容
    async function getContent(pageUrl){
      const res = await parseDocFromAjax('GET',pageUrl)
      return res.querySelector("#content").innerHTML
    }


    //解析书源函数
    async function parseMain(){
      //搜索小说名字
      const r = await searchBook()
      let ii = 0
      //优先匹配名字相同的
      for(let suoyin in r){
        if(r[suoyin].bookName == QDgetBookName()){
          ii = suoyin
          console.log(r[suoyin]+'111')
        }
          
      }
      //获取第一项结果章节目录
      if(r[ii] == undefined){
        console.log('该小说暂无资源')
      }
      const clist = await getChapterList(r[ii].url)
      console.log(clist)
      if(QDgetBookChapter() == undefined){
        console.log('抓取目录失败')
      }
      //获取章节名
      for(let i in clist){
        let tit = '' + clist[i].title
        tit = tit.replace(' ','')
        //console.log('匹配',tit,QDgetBookChapter())
        if(tit == QDgetBookChapter()){
          console.log('检查到结果')
          console.log(clist[i])

          const content = await getContent(clist[i].url)

          QDsetContent(content)
          console.log('写入成功')
          notify('小说读取成功')
          window.stop()
          return
        }
      }
      notify('暂未查询到该小说内容','warning')
      throw new Error('该书源解析失败')
    }

    //递归更换书源
     async function mergeOne(index){
            try{
                if(index){
                    config.webSiteIndex = index
                }
                //config.webSiteIndex = (config.webSiteIndex + 1) % 4
                notify(`正在切换到书源${config.webDesc[config.webSiteIndex]}...`,'info')
                await parseMain()
            }catch(e){
                config.webSiteIndex = (config.webSiteIndex + 1) % 4
                setTimeout(mergeOne,1000)
            }
        }
    //MAIN-BEFORE 主程序预备函数
    addMenu()
    //MAIN 主程序
    notify(`您正在阅读${QDgetBookName()}的${QDgetBookChapter()}`)
    mergeOne()
    hookSetting()

  //   GM_xmlhttpRequest({
  //       method:'GET',
  //       url:'http://www.mibaoge.com/search.php?q='+getBookName(),
  //       onload:function(res){
  //         console.log(res.responseXML)
  //       }
  //   })
        // Your code here...
})();