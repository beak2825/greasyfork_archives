// ==UserScript==
// @name         优酷VIP站外解析
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  替换页内播放器并可以点击vip转跳外部网站播放
// @author       You
// @include      *://m.youku.com/v*
// @include      *://m.youku.com/a*
// @include      *://v.youku.com/v_*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419511/%E4%BC%98%E9%85%B7VIP%E7%AB%99%E5%A4%96%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/419511/%E4%BC%98%E9%85%B7VIP%E7%AB%99%E5%A4%96%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
  let parsurl = 'https://jx.618g.com/?url='
  // let parsurl = 'http://jqaaa.com/jx.php?url='
  
  
  // 向后插入元素
  function insterAfter(newElement, targetElement){
    var parent = targetElement.parentNode;
    if(parent.lastChild == targetElement){
      parent.appendChild(newElement);
    }
    else{
      parent.insertBefore(newElement, targetElement.nextSibling);
    }              
  }
  
  
  // 替换内video 失败 不能全屏
  let time = setInterval(() => {
    if (document.querySelector(".vip_info").innerHTML.trim() != '') {
      let parent = document.querySelector("#ykPlayer")
      let child = parent.querySelector(".youku-film-player")
      let child2 = parent.querySelector(".preplay-layer")
      let child3 = parent.querySelector(".top_area")
      parent.removeChild(child)
      parent.removeChild(child2)
      
      let para = document.createElement("iframe")
      para.style.width = "100%"
      para.style.height = "100%"
      para.style.border = "0"
      para.src = parsurl + window.location.href
      
      parent.insertBefore(para, child3)
      window.clearInterval(time)
    }
  }, 1000)
  
  
  // 替换内按钮 失败 乱了
  // let parent = document.querySelector(".anthology-content-scroll .anthology-content")
  // // let child = document.querySelector(".anthology-content-scroll .anthology-content a:nth-child(" + index + 1 + ")")

  // let as = document.querySelectorAll(".anthology-content-scroll .anthology-content a")
  // let arr = []
  // as.forEach((element, index) => {
  //   arr.push(element)
  // })

  // arr.forEach((element, index) => {
  //   let el = document.createElement("a")
  //   el.target = "_blank"
  //   el.className = "box-item"
  //   el.href = parsurl + element.getAttribute("href")
  //   el.innerHTML = index + 1 + "&"

  //   parent.insertBefore(el, element)
  // })
  
  
  // 处理标题
  let title = document.querySelector(".thesis-wrap .title-link")
  title.style.width = "160px"
  // title.style.padding = "0 5px"
  // title.style.borderRadius = "3px"
  // title.style.backgroundColor = "#00b350"
  // title.style.boxShadow = "rgb(0, 179, 80) 0px 0px 20px"
  // title.href = parsurl + window.location.href
  // title.innerHTML += " 解析"
  // title.onmouseover = function(){
  //   this.style.color = "white"
  // }

  // 删除标题内元素
  // let parent = document.querySelector(".normal-title-wrap .thesis-wrap")
  // let child = parent.querySelectorAll(".ui-el")
  // child.forEach(element => {
  //   parent.removeChild(element)
  // })

  // 处理标题添加按钮
  let el = document.createElement("a")
  el.target = "_blank"
  el.className = "ui-a"
  el.href = parsurl + window.location.href
  el.innerHTML = "解析"
  el.style.padding = "3px 5px"
  el.style.borderRadius = "3px"
  el.style.backgroundColor = "#00b350"
  el.onmouseover = function(){
    this.style.color = "white"
  }
  insterAfter(el, title)

  // 添加选择器
  let select = document.createElement("select")
  // select.className = "ui-el"
  select.style.marginRight = "3px"
  let optionA = document.createElement("option")
  optionA.value = '618g'
  optionA.innerHTML = '618g'
  let optionB = document.createElement("option")
  optionB.value = 'jqaaa'
  optionB.innerHTML = 'jqaaa'
  select.onchange = function(){
    function replaceURL(value){
      let titlea = document.querySelector(".thesis-wrap .ui-a")
      if (titlea) {
        titlea.href = titlea.href.replace(parsurl, value)
      }
      
      let as = document.querySelectorAll(".anthology-content-scroll .anthology-content a")
      as.forEach((element, index) => {
        let mark = element.querySelector(".mark-text a")
        if (mark) {
          mark.href = mark.href.replace(parsurl, value)
        }
      })
      parsurl = value
    }
    
    switch (this.value) {
      case '618g':
        replaceURL('https://jx.618g.com/?url=')
        break;
      case 'jqaaa':
        replaceURL('http://jqaaa.com/jx.php?url=')
        break;
      default:
        break;
    }
    proc()
  }
  select.appendChild(optionA)
  select.appendChild(optionB)
  insterAfter(select, title)
  
  
  // 处理标题 集数按钮
  let proc = function () {
    // 处理所有集数按钮
    let as = document.querySelectorAll(".anthology-content-scroll .anthology-content a")
    let arr = []
    as.forEach((element, index) => {
      arr.push(element)
      // console.log(element)
    })
    arr.forEach((element, index) => {
      let markBox = element.querySelector(".mark-text-wrap")
      let mark = element.querySelector(".mark-text")
      
      if (mark) {
        // console.log(mark.innerHTML)
        if (mark.innerHTML == "VIP" || mark.innerHTML == "超前点播") {
          if (markBox) {
            markBox.style.padding = "0"
            markBox.style.backgroundColor = "#00b350"
            // markBox.style.boxShadow = "rgb(0, 179, 80) 0px 0px 20px"
          }
          
          let el = document.createElement("a")
          el.target = "_blank"
          el.href = parsurl + element.getAttribute("href")
          el.innerHTML = "解析"
          el.style.padding = "3px"
          el.onmouseover = function(){
            this.style.color = "white"
          }
          
          mark.innerHTML = ""
          mark.appendChild(el)
        }
      }
    })
    
  }
  proc()
  
  let btn = document.querySelectorAll(".paged-wrap a")
  btn.forEach((element, index) => {
    element.onclick = function(e){
      // console.log(e)
      setTimeout(() => {
        proc()
      }, 300)
    }
  })
})();