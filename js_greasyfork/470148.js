// ==UserScript==
// @name         Kemono 下载工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  仅支持Files内图片下载
// @author       ljw2487
// @match        *://*.kemono.su/*
// @match        *://*.kemono.party/*
// @match        *://kemono.su/*
// @match        *://kemono.party/*
// @license      GNU General Public License v3.0 or later
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/470148/Kemono%20%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/470148/Kemono%20%E4%B8%8B%E8%BD%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

GM_addStyle(".ad-container {display: none;}");
GM_addStyle(".root--ujvuu {display: none;}");

// 下载文件命名规则：
// 包含：作者 | 主标题 | 副标题(来源) | 页码 | 共多少页 (副标题一般是(Pixiv Fanbox) (Patreon))
// 标题示例：Yelan 1 Part 3 (Loop) (Patreon) 其中(Patreon)为副标题
// 1 -> 页码.格式                                        示例：1.jpg
// 2 -> 页码_共多少页.格式                               示例：1_20.jpg
// 3 -> 主标题 页码_共多少页.格式                        示例：Yelan 1 Part 3 (Loop) 1_20.jpg
// 4 -> 主标题 副标题(来源) 页码_共多少页.格式           示例：Yelan 1 Part 3 (Loop) (Patreon) 1_20.jpg
// 5 -> [作者] 主标题 副标题(来源) [页码_共多少页].格式  示例：[Abcde] Yelan 1 Part 3 (Loop) (Patreon) [1_20].jpg
const nameRule = 5

function script() {
  const host = location.host
  const path = location.pathname
  const regular = {
    "/": homePage, // 首页
    "/artists": artistsPage, // 画师列表
    "/(\\w+)/user/(\\d+)": userPage, // 画师详情
    "/(\\w+)/user/(\\d+)/post/(\\d+)": postPage, // 作品页
  };
  Object.keys(regular).some((pattern) => {
    if (new RegExp(`^${pattern}$`).test(path)) {
      regular[pattern]();
      return true;
    }
  })
}
script()

function homePage () {
  // console.log('homepage');
}
function artistsPage () {
  // console.log('artistsPage');
}
function userPage () {
  // console.log('userPage');
}
function postPage () {
  GM_addStyle(".download-button {color: white; font-size: 16px; background-color: #3e3e44; padding: 3px 15px; border-radius: 5px; appearance: none; border: none; outline: none; transition: color 0.2s ease-in-out;}");
  GM_addStyle(".download-button:hover {color: #f8b696; transition: color 0.2s ease-in-out;}");
  GM_addStyle(".modify-h2 {display:flex; align-items: center; justify-content: space-between;}");

  // GET ARTIST {String} "name"
  let artist = ""
  artist = document.getElementsByClassName('post__user-name')[0].innerText
  // GET TITLES {Array} [mainTitle, subTitle]
  let titles = []
  let titleNode = document.getElementsByClassName('post__title')[0]
  titleNode = titleNode.getElementsByTagName('span')
  Array.from(titleNode).forEach(item => { titles.push(item.innerText) })
  // GET FILE URL LIST {Array} [Url, Url, ...]
  let fileList = []
  let filesNode = document.getElementsByClassName('post__thumbnail')
  Array.from(filesNode).forEach(file => {
    let href = file.querySelector('a').getAttribute('href')
    fileList.push(href)
  })
  // Modify-DOM
  let h2Node = document.getElementsByTagName("h2")
  Array.from(h2Node).forEach(element => {
    // Files
    if(element.innerHTML == "Files") {
      let fileTitle = createElement("h2", "Files")
      let fileBtn = createElement("button", "下载全部", {
        id: "fileButton",
        class: "download-button",
        type: "button"
      })
      element.innerHTML = ""
      element.classList.add("modify-h2")
      element.appendChild(fileTitle)
      element.appendChild(fileBtn)

      fileBtn.addEventListener("click", function() {
        fileBtn.disabled = true
        fileBtn.innerHTML = "下载中"
        downloadingFiles(fileBtn, artist, titles, fileList)
      })
    }
  })
}
function createElement(tag, text, attributes = undefined) {
  let element = document.createElement(tag);
  element.innerHTML = text
  if (attributes) {
    for (let k in attributes) {
      element.setAttribute(k, attributes[k])
    }
  }
  return element
}
function createFileName(artist, titles, index, pages) {
  // console.log(artist, titles, index, pages);
  if (nameRule === 1) {
    return `${index}` // 1.jpg
  } else if (nameRule === 2) {
    return `${index}_${pages}` // 1_20.jpg
  } else if (nameRule === 3) {
    return `${titles[0]} ${index}_${pages}` // title 1_20.jpg
  } else if (nameRule === 4) {
    return `${titles[0]} ${titles[1]} ${index}_${pages}` // title (fanbox) 1_20.jpg
  } else if (nameRule === 5) {
    return `[${artist}] ${titles[0]} ${titles[1]} [${index}_${pages}]` // [artist] title (fanbox) [1_20].jpg
  }
}
function downloadingFiles(btn, artist, titles, fileList) {
  let totalQuest = fileList.length, success = 0, faild = 0
  fileList.forEach((url, index) => {
    let fileName = createFileName(artist, titles, index + 1, fileList.length)
    GM_download({
      url: url,
      name: fileName,
      onload: function() {
        console.log(`下载 ${index + 1}/${fileList.length} 完成`)
        totalQuest -= 1
        success += 1
        downloadingFilesFinished(btn, totalQuest, fileList.length, success, faild)
      },
      onerror: function(err) {
        console.error(`下载 ${index + 1}/${fileList.length} 失败 准备二次尝试`, err)
        GM_download({
          url: url,
          name: fileName,
          onload: function() {
            console.log(`下载 ${index + 1}/${fileList.length} 完成 (二次尝试)`)
            totalQuest -= 1
            success += 1
            downloadingFilesFinished(btn, totalQuest, fileList.length, success, faild)
          },
          onerror: function(err) {
            console.log(`下载 ${index + 1}/${fileList.length} 失败 (二次尝试) 请尝试手动下载`, err, {
              name: fileName,
              url: url
            })
            totalQuest -= 1
            faild += 1
            downloadingFilesFinished(btn, totalQuest, fileList.length, success, faild)
          }
        })
      }
    })
  })
}
function downloadingFilesFinished(btn, totalQuest, total, success, faild) {
  if (totalQuest === 0) {
    btn.disabled = false
    btn.innerHTML = "已下载"
    alert(`下载完成, 共${total}张, 成功${success}张, 失败${faild}张`)
  }
}