// jshint esversion:6
// ==UserScript==
// @name Add-floor-number
// @namespace sam-script
// @description Add-floor-number1
// @version 0.0.10
// @match https://www.ptt.cc/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/425605/Add-floor-number.user.js
// @updateURL https://update.greasyfork.org/scripts/425605/Add-floor-number.meta.js
// ==/UserScript==

let isDisplayImg
let picSwitch
let imgs     

(function main(){
  initialize()
  imgControl()
  addFloorNumber()
  stickyTitle()
})();

function initialize(){
  picIsShow = true
  picSwitch = null
  imgs = null
}

function imgControl(){
  document.getElementById('topbar').innerHTML +=`<button id='pic-control'>切換關圖</button>`
  picSwitch = document.getElementById('pic-control')
  imgs = document.getElementsByTagName('img')    
}

function addFloorNumber(){
  let author = document.getElementsByClassName('article-meta-value')[0].innerText.split(' ')[0]
  let board = document.getElementsByClassName('article-meta-value')[1]
  let comments = document.getElementsByClassName('push-tag')
  let commentUsers = document.getElementsByClassName('push-userid')
  let push = 0, unpush = 0
  for(let i = 1; i <= comments.length; i++){
    // add floor number
    let str = i.toString().padStart(comments.length.toString().length, ' ')
    comments[i - 1].innerText = str + comments[i - 1].innerText
    
    if(comments[i - 1].innerText.includes('噓')){
        unpush++
    }else if(comments[i - 1].innerText.includes('推')){
        push++
    }

    // hight light author
    if(commentUsers[i - 1].innerText.trim() === author){
      commentUsers[i - 1].style.color = 'white'
    }
  }
  board.innerHTML += `——${push}推  <span style="color:red">${unpush}噓</span>`
}

function stickyTitle(){
  const parent = document.getElementById('main-content')
  const target = []
  const div = document.createElement('div')

  parent.style = 'position: relative'
  div.style = 'position: sticky; top: 40px; z-index: 10'

  for(let i = 0; i < 4; i++){
    div.appendChild(parent.childNodes[0])
  }
  parent.insertBefore(div,parent.childNodes[0])
}

picSwitch.addEventListener('click', () =>{
  picSwitch.textContent = picIsShow? '切換開圖' : '切換關圖'
  picIsShow = !picIsShow
  for(let i in imgs){
      if(picIsShow){
          imgs[i].src = imgs[i].src.substring(1)
      }else{
          imgs[i].src = '_' + imgs[i].src
      }
  }
})

