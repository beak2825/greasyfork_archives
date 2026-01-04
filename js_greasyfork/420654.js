// ==UserScript==
// @name         知乎热搜信息过滤器
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  知乎热搜信息过滤器 | 去除明星相关信息
// @require https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @author       夏2同学
// @match        https://www.zhihu.com*
// @match        https://www.zhihu.com/*
// @match        http://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420654/%E7%9F%A5%E4%B9%8E%E7%83%AD%E6%90%9C%E4%BF%A1%E6%81%AF%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/420654/%E7%9F%A5%E4%B9%8E%E7%83%AD%E6%90%9C%E4%BF%A1%E6%81%AF%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

'use strict'
let beforeUrl = window.location.href
let blackList = ['于谦', '郑爽', '王鸥', '宋丹丹', '杨幂', '魏大勋', '汪峰'] // 黑名单
let whiteList = [] // 白名单

window.setInterval(__init__, 1000)

if (window.location.href.indexOf('hot') !== -1) {
  // 在hot页面
  storeInit()
  filterHot()
  noAds()
  addBtns()
  $(document).on('click', '.blockHot', function (e) {
    BlockItem(e)
  })
}

function __init__() {
  // 每隔1s检测url是否改变,初始化函数
  if (window.location.href !== beforeUrl) {
    console.log('---------------分割线start------------------')
    // url 发生改变了
    beforeUrl = window.location.href
    console.log('url发生了改变')
    if (window.location.href.indexOf('hot') !== -1) {
      // 过滤热门页面的信息
      storeInit()
      filterHot()
      noAds()
      addBtns()
    }
    console.log('---------------分割线end-----------------')
  }
}

function isHavingKeyWord(str, keywords = blackList) {
  let index
  if (
    localStorage.getItem('blackList') !== undefined ||
    localStorage.getItem('blackList') !== null
  ) {
    // 初始化读取 本地存储
    keywords = JSON.parse(localStorage.getItem('blackList'))
  }

  for (index in keywords) {
    // console.log('index=', keywords[index])
    if (str.indexOf(keywords[index]) != -1) {
      // 说明包含关键词
      return {
        res: true,
        keyword: keywords[index],
      }
    }
  }
  return false
}

function noAds() {
  // 去除首页广告
  let adList = $('*[alt="广告"]')
  // console.log(adList)
  adList = Array.from(adList)
  if (adList.length !== 0) {
    let item
    adList.forEach((item) => {
      item.style.display = 'none'
      console.log('有一条广告被隐藏了！', item)
    })
  }
}

function filterHot() {
  let list = $('#TopstoryContent > div > div > div.HotList-list > section')

  // console.log(list)
  let key
  for (key in list) {
    //  执行返回操作
    if (key === 'length') {
      return
    }

    // 依次遍历
    let detail = list[key].innerHTML
    console.log('key=', key - 0 + 1)
    // console.log(detail)

    let msg = isHavingKeyWord(detail)

    if (msg.res) {
      // console.log(list[key])
      // 隐藏该元素
      list[key].style.display = 'none'
      console.log(
        `移除了一条热搜信息，其key =  ${key - 0 + 1},keyword = ${
          msg['keyword']
        }`,
      )
    }
  }
}

function addBtns() {
  let dom =
    '<span class="HotItem-action blockHot"><div class="Popover ShareMenu"> <div class="ShareMenu-toggler" id="Popover3-toggle" aria-haspopup="true" aria-expanded="false" aria-owns="Popover3-content" > <img class="ShareMenu-fakeQRCode" src="https://www.zhihu.com/qrcode?url=https%3A%2F%2Fwww.zhihu.com%2Fquestion%2F440614545%23showWechatShareTip" alt="微信二维码" /><button type="button" class="Button Button--plain Button--withIcon Button--withLabel" > <span style="display: inline-flex; align-items: center;" >​ <svg class="Zi Zi--Report" fill="currentColor" viewBox="0 0 24 24" width="14" height="14" style="margin-right: 4px;" > <path d="M19.947 3.129c-.633.136-3.927.639-5.697.385-3.133-.45-4.776-2.54-9.949-.888-.997.413-1.277 1.038-1.277 2.019L3 20.808c0 .3.101.54.304.718a.97.97 0 0 0 .73.304c.275 0 .519-.102.73-.304.202-.179.304-.418.304-.718v-6.58c4.533-1.235 8.047.668 8.562.864 2.343.893 5.542.008 6.774-.657.397-.178.596-.474.596-.887V3.964c0-.599-.42-.972-1.053-.835z" fill-rule="evenodd" ></path> </svg> </span >屏蔽 </button> </div> </div></span > '

  list = $(
    '#TopstoryContent > div > div > div.HotList-list > section > div.HotItem-content > div',
  )

  list = Array.from(list)
  let item
  list.forEach((item) => {
    item.append($(dom)[0])
  })
}

//string字符串转为dom
function parseToDOM(str) {
  var div = document.createElement('div')
  if (typeof str == 'string') div.innerHTML = str
  return div.childNodes
}

function addKeyWord(keyword) {
  let blackList = localStorage.getItem('blackList')
  let keywords
  if (blackList !== undefined || blackList !== null) {
    // 初始化读取 本地存储
    keywords = JSON.parse(localStorage.getItem('blackList'))
    keywords.push(keyword)
  }
  localStorage.setItem('blackList', JSON.stringify(keywords))

  location.reload()
}

function storeInit() {
  let item = localStorage.getItem('blackList')
  if (item === undefined || item === null) {
    localStorage.setItem('blackList', JSON.stringify(blackList))
  }
}

function BlockItem(e) {
  let element = e.currentTarget || e.srcElement || e.toElement
  console.log(
    element.parentElement.parentElement.children[0].getAttribute('title'),
  )
  let defaultValue = element.parentElement.parentElement.children[0].getAttribute(
    'title'
  )
  let keyword = prompt('请确认屏蔽关键词！', defaultValue)
  console.log(keyword)

  if (keyword !== null) {
    // 说明用户点击了确认
    addKeyWord(keyword)
  }
}
