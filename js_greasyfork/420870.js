// ==UserScript==
// @name          pixivUserMute
// @namespace     rabuhandoru
// @match         *://www.pixiv.net/tags/*
// @match         *://www.pixiv.net/
// @match         *://www.pixiv.net/users/*
// @match         *://www.pixiv.net/manga
// @exclude-match *://www.pixiv.net/tags/*/nobels*
// @version       1.1
// @author        rabuhandoru
// @run-at        document-end
// @grant         GM_getValue
// @grant         GM_setValue
// @description   ユーザーをミュートする機能を追加します 小説のページはミュートされません
// @downloadURL https://update.greasyfork.org/scripts/420870/pixivUserMute.user.js
// @updateURL https://update.greasyfork.org/scripts/420870/pixivUserMute.meta.js
// ==/UserScript==
"use strict"

print = console.log

window.addEventListener('scroll', loaded);
// window.addEventListener('DOMContentLoaded', loaded);
window.addEventListener('load', loaded);
window.addEventListener('popstate', loaded)
window.addEventListener('hashchange', loaded)
// window.addEventListener('beforeunload', loaded)
window.addEventListener('click', loaded)

let removeMode = true

let muteUserDict = {}
if (JSON.parse(GM_getValue("muteUserDict",null))){
  muteUserDict = JSON.parse(GM_getValue("muteUserDict"))
}

function loaded(e){
  print(e.type)
  let url = location.href

  const jsInitCheckTimer = setInterval(jsLoaded, 1000);
  let cnt=0
  let selector=""

  if (url.match(/users/)){
    selector = "nav"
  }else
  if (url.match(/tags/)){
    selector = "section > div:nth-of-type(2) > ul > li > div > div:nth-of-type(3) > div > div > a"
  }else{
    selector = "section > div:nth-of-type(2) div > div > ul > li > div > div:nth-of-type(3) > div > div > a"
  }

  function jsLoaded() {
    if (document.querySelector(selector) != null) {
      clearInterval(jsInitCheckTimer);
      if (url.match(/users/)){
        let elm = document.querySelector(selector)
        userPageMod(elm)
      }else{
        let links = document.querySelectorAll(selector)
        main(links)
      }
    }
    cnt++
    if (cnt>10){
      clearInterval(jsInitCheckTimer);
    }
  }
}
function userPageMod(elm){
  let navElm = elm
  let userId = location.href.replace(/.*users\//,"")
  if (!navElm.querySelector(".muteButton")){
    let buttonElm = document.createElement("a")
    buttonElm.onclick=clickMuteButtonInUserPage
    let cs = Array.from(navElm.childNodes[0].classList)
    buttonElm.classList.add(cs[0])
    buttonElm.classList.add(cs[1])
    buttonElm.classList.add("muteButton")
    if (muteUserDict[userId]){
      buttonElm.textContent="Mute 解除"
      buttonElm.classList.add("muteButton-muted")
    }else{
      buttonElm.textContent="Mute する"
    }
    navElm.appendChild(buttonElm)
  }
}
function clickMuteButtonInUserPage(e){
  let userId = location.href.replace(/.*users\//,"")
  let userName = document.querySelector("h1").textContent
  let result
  if (muteUserDict[userId]){
    result = confirm(userName + "さんのミュートを解除しますか？")
  }else{
    result = confirm(userName + "さんをミュートしますか？")
  }
  if (!result){
    return
  }
  if (this.classList.toggle("muteButton-muted")){
    muteUserDict[userId] = userName
    this.textContent="Mute 解除"
  }else{
    delete muteUserDict[userId]
    this.textContent="Mute する"
  }
  GM_setValue("muteUserDict",JSON.stringify(muteUserDict))
}

function clickMuteButton(e){
  let links = this.closest("ul").querySelectorAll("li > div > div:nth-of-type(3) > div > div > a")
  let aElem = this.closest("li").childNodes[0].childNodes[2].childNodes[0].childNodes[1]
  let userId = aElem.href.replace(/.*users\//,"")
  let result = confirm(aElem.text + "さんをミュートしますか？")
  if (!result){
    return
  }
  if (this.classList.toggle("muteButton-muted")){
    muteUserDict[userId] = aElem.text
  }else{
    delete muteUserDict[userId]
  }
  GM_setValue("muteUserDict",JSON.stringify(muteUserDict))
  main(links)
}
function muteCancel(e){
  if (this.selectedIndex===0){
    return
  }
  let links = this.parentNode.querySelector("ul").querySelectorAll("li > div > div:nth-of-type(3) > div > div > a")
  let userId = this.childNodes[this.selectedIndex].value
  let userName = this.childNodes[this.selectedIndex].text
  let result = confirm(userName + "さんのミュートを解除しますか？")
  if (!result){
    return
  }
  delete muteUserDict[userId]
  GM_setValue("muteUserDict",JSON.stringify(muteUserDict))
  main(links)
}
function muteCancelAll(e){
  let links = this.parentNode.querySelector("ul").querySelectorAll("li > div > div:nth-of-type(3) > div > div > a")
  muteUserDict = {}
  GM_setValue("muteUserDict",JSON.stringify(muteUserDict))
  main(links)
}
function main(links){
  let sectionElm = links[0].closest("section")

  if (!sectionElm.querySelector(".muteCancelAll")){
    let buttonElm = document.createElement("button")
    buttonElm.onclick = muteCancelAll
    buttonElm.classList.add("muteCancelAll")
    buttonElm.textContent = "すべてのミュートを解除"
    links[0].closest("section").prepend(buttonElm)
  }
  
  if (!sectionElm.querySelector(".muteCancel")){
    let selectElem = document.createElement("select")
    selectElem.classList.add("muteCancel")
    selectElem.onchange = muteCancel
    links[0].closest("section").prepend(selectElem)
  }
  
  let selectElm = sectionElm.querySelector(".muteCancel")
  selectElm.innerHTML = ""
  let optionElem = document.createElement('option')
  optionElem.textContent = "ミュート済みユーザ"
  selectElm.appendChild(optionElem)
  for (const key in muteUserDict){
    let optionElm = document.createElement("option")
    optionElm.textContent = muteUserDict[key]
    optionElm.value = key
    selectElm.appendChild(optionElm)
  }
  
  for (const e of links){
    let liElm = e.closest("li")
    const id = e.href.replace(/.*users\//,"")
    if (!liElm.querySelector(".muteButton")){
      let buttonElm = document.createElement("button")
      // buttonElm.classList.add("sc-1rx6dmq-2" ,"cjMwiA")
      buttonElm.classList.add("muteButton")
      buttonElm.textContent="Mute"
      buttonElm.onclick=clickMuteButton
      // buttonElm.href="#"
      // buttonElm.style.position = "relative"
      // buttonElm.style.top = "-50px"
      // liElm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].appendChild(buttonElm)
      liElm.firstChild.appendChild(buttonElm)
    }
    if (muteUserDict[id]){
      print(e.firstChild.title+"をミュートしました")
      
      let parent = liElm.parentNode
      liElm.remove() // 削除するだけだと次ページへ遷移する時にエラーを返す
      parent.appendChild(liElm)
      let buttonElm = parent.lastChild.querySelector(".muteButton")
      buttonElm.textContent="Mute 解除"
      buttonElm.classList.add("muteButton-muted")
      if (removeMode){
        // removedElems.push({"parentElem":e.closest("li").parentNode,"elem":e.closest("li")})
        liElm.firstChild.style.display = "none"
      }else{
        liElm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].style.display = "none"
      }
    }else{
      let buttonElm = liElm.parentNode.querySelector(".muteButton")
      buttonElm.textContent="Mute"
      buttonElm.classList.remove("muteButton-muted")
      if (removeMode){
        liElm.firstChild.style.display = ""
      }else{
      // e.closest("li").querySelector("img").style.display =""
        liElm.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[1].style.display = ""
      }
    }
  }
}
