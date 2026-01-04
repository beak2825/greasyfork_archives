// ==UserScript==
// @name     惡魔旅館警告器
// @version  0.2
// @grant    none
// @include https://www.ptt.cc/bbs/Gossiping/*
// @license MIT
// @description 惡魔旅館警告器! No more 惡魔旅館
// @namespace https://greasyfork.org/users/916025
// @downloadURL https://update.greasyfork.org/scripts/445217/%E6%83%A1%E9%AD%94%E6%97%85%E9%A4%A8%E8%AD%A6%E5%91%8A%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/445217/%E6%83%A1%E9%AD%94%E6%97%85%E9%A4%A8%E8%AD%A6%E5%91%8A%E5%99%A8.meta.js
// ==/UserScript==
console.log("惡魔旅館警告器")


// 黑名單列表
const alertList = [
  "DevilHotel",
]



const pathname = window.location.pathname.replace("/bbs/Gossiping/", "")

if (pathname.startsWith("M")){
	const pushUseridArray = Array.from(document.querySelectorAll(".push-userid"))
  const blockPushUserid = pushUseridArray.filter((e)=> alertList.indexOf(e.innerText) != -1)
  const author = document.querySelector(".article-metaline>.article-meta-value").innerText.replace(/\(.+\)/, "")
  const warring = (alertList.indexOf(author) != -1) || (blockPushUserid.length > 0)
  
  let blockedRichcontent = []
  
  if (warring) {
  	// set warring
  }
  blockPushUserid.map((e) => {
    const nextSibling = e.offsetParent.nextSibling
    if (nextSibling.classList.contains("richcontent")) {
    	blockedRichcontent.push(nextSibling)
      e.style.color = "red"
    }
  })
  console.log(blockedRichcontent)
  
  blockedRichcontent.map((e) => e.style.display = "none")
  
} else {
	const authorDivs = document.querySelectorAll(".author")

  for (const e of authorDivs){
    if ( alertList.indexOf(e.innerText) != -1) {
      e.style.color = "red"
      e.offsetParent.style.border = "1px solid red"
    }
  }
}