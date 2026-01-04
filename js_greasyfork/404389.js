// ==UserScript==
// @name         在灵梦御所显示下载链接
// @name:en      Show Download info on Reimu.net
// @namespace    http://reimu.net/
// @version      0.9
// @description 在灵梦御所显示使用pre标签包裹的下载链接
// @description:en  Show download info what wrap by pre element on "reimu.net".
// @author       AIUSoft
// @license      MIT
// @github       https://gist.github.com/LiuQixuan/7a8683ede4b885a6df834ceeb933d1c5
// @match        https://blog.reimu.net/*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/404389/%E5%9C%A8%E7%81%B5%E6%A2%A6%E5%BE%A1%E6%89%80%E6%98%BE%E7%A4%BA%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/404389/%E5%9C%A8%E7%81%B5%E6%A2%A6%E5%BE%A1%E6%89%80%E6%98%BE%E7%A4%BA%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
function processHTML (preHTML,className) {
  let innerHTML = preHTML.replace(/(magnet.*?(?=\n))|(\w*#\w*#\w*#\w*.*?(?=\n))|(?<=(提取码.{1}))(?:\s*)\w{4}/ig, `<textarea readonly data-text="$&" class="${className}" rows=2 onfocus="((e)=>{e.target.select();document.execCommand('copy');e.target.innerText='复制成功!' })(event)" onblur="((e)=>{e.target.innerText=e.target.dataset.text})(event)">$&</textarea>`)
  let rapidUploadCodeList = preHTML.match(/\w*#\w*#\w*#\w*.*?(?=\n)/g)
  let magnetList = preHTML.match(/magnet.*?(?=\n)/g)
  let baidupanLinks = preHTML.match(/(?<=(提取码.{1}))(?:\s*)\w{4}/g)
  return {innerHTML:innerHTML,rapidUploadCodeList:rapidUploadCodeList,magnetList:magnetList,baidupanLinks:baidupanLinks}
}

function analyPanDownloadLink(baidupanLinkList,jsPath,className){
  let panShareLinkElement = Array.from(document.querySelectorAll(jsPath))
  panShareLinkElement.forEach(item=>item.classList.add(className))
  if (baidupanLinkList&&baidupanLinkList.length !== 0) {
    panShareLinkElement.filter(item=>/pan\.baidu\.com/.test(item.href)).forEach((item,i) => {
      item.innerText += '(点链接时已为您复制提取码,需要密码直接ctrl+v)'
      item.href = `${item.href}&pwd=${baidupanLinkList[i]}`
      baidupanLinkList[i] = item.href
      item.addEventListener('mousedown', (e) => {
        e.target.nextElementSibling.select()
        document.execCommand('copy')
      })
    })
  }
}

function callbackOfCopytext(textArr){
  navigator.clipboard.writeText(textArr.join('\n')).then().catch(e=>console.log(e))
}


(function init () {
  'use strict'
  const autoCopyRapidUploadCode = true


  const cssNS = {
    elWrapper: 'download_info_wrapper',
    elButtonWrapper:'download_info_button_wrapper',
    elDownloadInfo:'download_info',
    downloadLink:'download_info_link',
    textarea:'download_info_textarea',
    button:'download_info_button'
  }

  let styleEl = document.createElement('style')
  styleEl.type = "text/css"
  styleEl.rel = "stylesheet"
  styleEl.className = "arcret"
  document.head.appendChild(styleEl)
  let styleSheet = styleEl.sheet
  styleSheet.insertRule(`.${cssNS.elButtonWrapper} {display:flex;padding-bottom:1em;gap: 1em;}`)
  styleSheet.insertRule(`.${cssNS.downloadLink} {display:block;text-align:center;border: 5px skyblue dashed!important;border-radius: 5em;box-sizing: border-box;padding: 10px 20px;margin-top:20px;margin-bottom:20px;}`)
  styleSheet.insertRule(`.${cssNS.downloadLink}:hover {border: 5px dodgerblue dashed!important;}`)
  styleSheet.insertRule(`.${cssNS.downloadLink}:active {border: 5px lightblue dashed!important;}`)
  styleSheet.insertRule(`.${cssNS.textarea} {border: 5px skyblue dashed;border-radius: 20px;box-sizing: border-box;padding: 10px 20px;margin-top:20px;margin-bottom:20px;}`)
  styleSheet.insertRule(`.${cssNS.textarea}:focus {border: 5px dodgerblue dashed;}`)
  styleSheet.insertRule(`.${cssNS.button} {user-select: none;font-weight:bold;color:skyblue;padding:0 1em;border: 1px skyblue solid;border-radius: 5em;text-align: center;line-height: 3em;}`)
  styleSheet.insertRule(`.${cssNS.button}:hover {color:white;border: 1px transparent solid; background-color:dodgerblue;}`)
  styleSheet.insertRule(`.${cssNS.button}:active {color:white;border: 1px transparent solid;background-color:lightblue;}`)
  
  function update(){
    let preBlock = document.querySelector('pre')
    if (preBlock !== null) {
      let preHTML = preBlock.innerHTML
      let processResult = processHTML(preHTML,cssNS.textarea)
      let divOfDownloadInfoWrapper = document.createElement('div')
      divOfDownloadInfoWrapper.className = cssNS.elWrapper

      let divOfDownloadInfoButtonWrapper = document.createElement('div')
      divOfDownloadInfoButtonWrapper.className = cssNS.elButtonWrapper

      let divOfDownloadInfo = document.createElement('div')
      divOfDownloadInfo.className = cssNS.elDownloadInfo
      divOfDownloadInfo.innerHTML = processResult.innerHTML


      new Array({list:processResult.rapidUploadCodeList,innerText:"一键复制所有标准码",className:cssNS.button},
      {list:processResult.magnetList,innerText:"一键复制所有磁力链接",className:cssNS.button},
      {list:processResult.baidupanLinks,innerText:"一键复制百度云盘链接",className:cssNS.button}).forEach(item=>{
        if(item.list&&item.list.length!==0){
          let button = document.createElement('div')
          button.className = item.className
          button.innerText = item.innerText
          button.onclick = callbackOfCopytext.bind(null,item.list)
          divOfDownloadInfoButtonWrapper.append(button)
        }
      })

      divOfDownloadInfoWrapper.append(divOfDownloadInfoButtonWrapper,divOfDownloadInfo)
      document.querySelector('.entry-content').appendChild(divOfDownloadInfoWrapper)
      analyPanDownloadLink(processResult.baidupanLinks,`.${cssNS.elDownloadInfo}>a`,cssNS.downloadLink)
      if(autoCopyRapidUploadCode&&processResult.rapidUploadCodeList){
        callbackOfCopytext(processResult.rapidUploadCodeList)
      }
    }
  }

  update()
  const io = new MutationObserver(update)
  let mainEl = document.getElementById('main')
  if(mainEl)io.observe(mainEl, { childList: true })
  if(/password\-protected/.test(location.href)){
    document.getElementById('password_protected_pass').value = '⑨'
    document.getElementById('wp-submit').click()
  }
})()