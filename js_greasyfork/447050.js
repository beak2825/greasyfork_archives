// ==UserScript==
// @name     小説家になろうを縦書きで表示
// @license MIT
// @namespace  https://greasyfork.org/zh-TW/scripts/447050-let-s-become-a-novelist-read-with-a-vertical-writing-mode
// @version    2.1
// @description  Let's Become a Novelist read with a vertical writing mode
// @author     avan
// @match    ncode.syosetu.com/*
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/447050/%E5%B0%8F%E8%AA%AC%E5%AE%B6%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%E3%82%92%E7%B8%A6%E6%9B%B8%E3%81%8D%E3%81%A7%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/447050/%E5%B0%8F%E8%AA%AC%E5%AE%B6%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%E3%82%92%E7%B8%A6%E6%9B%B8%E3%81%8D%E3%81%A7%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

const reHeadNav = () => {
  const headNav = document.querySelector(".c-menu__body") //#head_nav
  const novlBns = document.querySelectorAll(".c-pager") //.novel_bn
  const links = novlBns[0].querySelectorAll("a")
  links.forEach(element => {
    element.className="c-menu__item c-menu__item--headnav"
    headNav.appendChild(element)
  });
  headNav.style.width="60rem"
}

const replaceContents = () => {
  const contents = document.querySelector("div.p-novel__body") //div#novel_color
  contents.innerHTML = contents.innerHTML.replace(/\…/g,"..").replace(/\※/g,"＊").replace(/\―/g,"。")
  document.querySelectorAll("div.p-novel__body p").forEach(item => {
    if (item.innerHTML.length == 0) return
    if (item.querySelectorAll("a[href],img[src]").length > 0) return
    item.innerHTML = item.innerHTML.replace(/0/g,"０").replace(/1/g,"１").replace(/2/g,"２").replace(/3/g,"３").replace(/4/g,"４").replace(/5/g,"５").replace(/6/g,"６").replace(/7/g,"７").replace(/8/g,"８").replace(/9/g,"９")
    item.innerHTML = item.innerHTML.replace(/,/g,"，")
  })
}

const vertical = () => {
  const windowWidth = window.innerWidth*0.9
  const windowHeight = window.innerHeight*0.8
  const container = document.querySelector(".l-main")
  container.style.width = "100%"
  const novelHonbun = document.querySelector(".p-novel__body")

  const styles = {
    'width': windowWidth+"px",
    'height': windowHeight+"px",
    '-ms-writing-mode': 'tb-rl',
    'writing-mode': 'vertical-rl',
    'overflow-x': 'scroll',
    'padding': '10px',
    'margin':'0 auto',
    'left':'0',
    'right':'0',
  };
  Object.assign(novelHonbun.style,styles)

  window.addEventListener('keydown', function(e){
    if(e.keyCode === 33 || e.keyCode === 38){ //page up、up
      e.preventDefault()
      scrollLeft(novelHonbun, "up")
    } else if(e.keyCode === 32 || e.keyCode === 34 || e.keyCode === 40){ //space、page down、down
      e.preventDefault()
      scrollLeft(novelHonbun, "down")
    } else if(e.keyCode === 37){ //left
      e.preventDefault();
      scrollLeft(novelHonbun, "down", 100)
    } else if(e.keyCode === 39){ //right
      e.preventDefault()
      scrollLeft(novelHonbun, "up", 100)
    }
  });

  novelHonbun.addEventListener('mousewheel', function(e){
    e.preventDefault()
    if(e.wheelDelta > 0) scrollLeft(novelHonbun, "up")
    else scrollLeft(novelHonbun, "down")
  });

  novelHonbun.addEventListener('click', function(e) {
    var xPosition = e.layerX
    var yPosition = e.layerY
    if (xPosition > windowWidth) {
      scrollLeft(novelHonbun, "up")
    } else if (xPosition < windowWidth*0.1) {
      scrollLeft(novelHonbun, "down")
    }
    console.log("x:" + xPosition + ", y:" + yPosition)
  });
}

const scrollLeft = (element, type, value) => {
  if (!value || value <= 0) value = element.clientWidth*0.9
  if (!type) type = "down"
  if (type === "up") element.scrollLeft += value //up
  else if (type === "down") element.scrollLeft -= value //down
}

(function() {
  reHeadNav()
  replaceContents()
  vertical()
})()
