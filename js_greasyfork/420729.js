// ==UserScript==
// @name         起点小说解锁手机版
// @version      1.0
// @author       JiGuang
// @namespace    www.xyde.net.cn
// @homepageURL  http://www.xyde.net.cn
// @description  可解锁起点小说VIP付费章节
// @author       JiGuang
// @match        https://m.qidian.com/book/*
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/420729/%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E8%A7%A3%E9%94%81%E6%89%8B%E6%9C%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/420729/%E8%B5%B7%E7%82%B9%E5%B0%8F%E8%AF%B4%E8%A7%A3%E9%94%81%E6%89%8B%E6%9C%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let name = ''
    let chapter = ''
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
      const r = await parseDocFromAjax('GET','http://www.mibaoge.com/search.php?q=' + name)
      const bookList = r.querySelectorAll("body > div.result-list > div > div.result-game-item-detail > h3 > a")
      const authorList = r.querySelectorAll("body > div.result-list > div > div.result-game-item-detail > div > p:nth-child(1) > span:nth-child(2)")
      let resList = []
      for(let i in bookList){
        if(bookList[i].title){
          resList.push({bookName:bookList[i].title,author:authorList[i].innerText,url:'http://www.mibaoge.com' + bookList[i].pathname})
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
        url = url.replace('https://m.qidian.com/','http://www.mibaoge.com/')
        resList.push({title:cateList[i].innerText,url:url})
      }
      return resList
    }

    //获取章节内容
    async function getContent(pageUrl){
      const res = await parseDocFromAjax('GET',pageUrl)
      return res.querySelector("#content").innerHTML
    }
    function checkUI(){
        if(window.href != window.location.href){
            updateUI()
            window.href = window.location.href
        }
    }
    async function updateUI(){
        name = document.querySelector("#readCover > div.read-cover-v > div.read-cover-info > h2").innerText
        chapter = '' + document.querySelectorAll("section")[document.querySelectorAll("section").length -1 ].getElementsByTagName('h3')[0].innerText
        chapter = chapter.replace(' ','')
        console.log(name)
        console.log(chapter)
        console.log('ui update')
        //无需加载
        if( document.querySelectorAll("section")[document.querySelectorAll("section").length -1 ].innerHTML.indexOf('登录阅读') <= 0 ){
            return
        }
        //搜索小说名字
      const r = await searchBook()
      let ii = 0
      //优先匹配名字相同的
      for(let suoyin in r){
        if(r[suoyin].bookName == name){
          ii = suoyin
          console.log(r[suoyin])
        }
      }
      //获取第一项结果章节目录
      if(r[ii] == undefined){
        alert('该小说暂无资源')
        return
      }else{
        console.log(r[ii].url)
      }
      const clist = await getChapterList(r[ii].url)
      console.log(clist)
      if(chapter == undefined){
        console.log('抓取目录失败')
        return
      }
      //获取章节名
      for(let i in clist){
        let tit = '' + clist[i].title
        tit = tit.replace(' ','')
        //console.log('匹配',tit,QDgetBookChapter())
        if(tit == chapter){
          console.log('检查到结果')
          console.log(clist[i])
          const content = await getContent(clist[i].url)
          document.querySelectorAll("section")[document.querySelectorAll("section").length -1 ].innerHTML = `<h3>${chapter}</h3>` + content
          console.log('写入成功')
        }
      }
    }
    setInterval(checkUI,1000)
    // Your code here...
})();