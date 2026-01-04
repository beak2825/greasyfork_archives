// ==UserScript==
// @name        微博搜索屏蔽
// @namespace   Violentmonkey Scripts
// @match       *://s.weibo.com/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.0.1
// @author      木木(mumu)
// @description 2023/12/29 13:23:53 微博搜索页面关键词屏蔽，隐藏包含关键词的微博
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483078/%E5%BE%AE%E5%8D%9A%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/483078/%E5%BE%AE%E5%8D%9A%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==
var nameSpace = 'mumu-'

// 在左侧显示当前搜索参数
function setSearchParams() {
  var pages = document.querySelectorAll('.m-page ul li').length || 1
  var page = document.querySelector('.m-page .pagenum') ? document.querySelector('.m-page .pagenum').text.replace(/^.+(\d+).+$/,'$1') : 1
  var time = getQueryString('timescope')
  var startTime = ''
  var endTime = ''
  if (time) {
    startTime = time.split(':')[1]
    endTime = time.split(':')[2]
  }

  var container = document.querySelector('.m-main-nav ul')
  var appendEl = document.createElement('li')
  var str = `${startTime}时~${endTime}时`
  appendEl.innerHTML = `
  <p style="padding:5px 10px">当前：${page}/${pages}</p>
  ${time
      ? '<p style="padding:5px 10px"><span style="background: #e6f2f8;padding:5px">' +
      str +
      '<a href="/weibo?q=freen&amp;Refer=g" style="display:inline-block;padding:0 10px;vertical-align:middle;color:red"><span>X</span></a></span></p>'
      : ''
    }
  `
  container.appendChild(appendEl)
}

function getQueryString(name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
  let r = window.location.search.substr(1).match(reg)
  if (r != null) {
    return decodeURIComponent(r[2])
  }
  return null
}

// 添加设置按钮到页面
function createSetBtn() {
  var container = document.querySelector('.m-main-nav ul')
  var appendEl = document.createElement('li')
  appendEl.innerHTML = `
  <li id="${nameSpace}set-btn">
    <a href="javascript:;" title="搜索屏蔽设置" node-type="advsearch">
      <div style="margin-right: 18px;"><svg class="Configs_icon_15HSz" yawf-component-tag="icons" style="width:24px;height:24px"><use xlink:href="#woo_svg_nav_configFlat"></use></svg></div>
      搜索屏蔽设置
    </a>
  </li>
  `
  container.appendChild(appendEl)
  appendEl.onclick = function () {
    createSetPanel()
  }
}

// 添加设置面板到页面
function createSetPanel() {
  if(!document.querySelector('#'+nameSpace+'dialog')) {
    var appendEl = document.createElement('div')
    appendEl.id = nameSpace + 'dialog'

    var data = GM_getValue('keyword', [])

    appendEl.innerHTML = `
      <div class="${nameSpace}dialog-mask"></div>
      <div class="${nameSpace}dialog-body">
        <div class="${nameSpace}dialog-title">
          <span>设置</span><span class="${nameSpace}dialog-close">×</span>
        </div>
        <div class="${nameSpace}dialog-main">
          <p>隐藏包含以下关键词的微博，可填写用户名、关键词、超话（xxx超话）、话题（#xxx#）</p>
          <p><input id="${nameSpace}add-input" type="text" /><button id="${nameSpace}add-btn">添加</button><span style="color: #999;">点击添加按钮或者enter键添加关键词</span></p>
          <ul id="${nameSpace}keyword-wrap">
            ${data.map(i=>`<li class="${nameSpace}keyword"><span>${i}</span><span class="${nameSpace}keyword-del">×</span></li>`).join('')}
          </ul>
        </div>
      </div>
    `

    document.body.appendChild(appendEl)
    setHandle()
  } else {
    document.querySelector('#'+nameSpace+'dialog').style.display = 'block'
  }
}

// 隐藏微博
function setHideByKeyWord() {
  var keywords = GM_getValue('keyword', [])
  if(keywords.length > 0) {
    var reg = new RegExp(keywords.join('|'))

    var list = document.querySelectorAll('#pl_feedlist_index .card-wrap')
    for(let i=0;i<list.length;i++) {
      var el = list[i]
      if(reg.test(el.outerText.toLocaleLowerCase())) {
        el.style.display = "none"
      } else {
        var parent = el.querySelector('ul')
        var hrefEl = el.querySelector('.from > a')
        if(parent && hrefEl) {
          var ael = document.createElement('li')
          ael.innerHTML = `<a href="${hrefEl.href}" target="_blank">打开微博</a>`
          parent.appendChild(ael)
        }
      }
    }
  }
}

// 设置插件样式
function setStyle() {
  var style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = `#${nameSpace}dialog{position:fixed;bottom: 0;left: 0;position: fixed;right: 0;top: 0;z-index:999;font-size: 14px;}.${nameSpace}dialog-mask{bottom: 0;left: 0;position: fixed;right: 0;top: 0;background:rgba(0,0,0,0.5);}
  .${nameSpace}dialog-body{width:620px;background:#fff;margin:100px auto;position: fixed;left: calc(50% - 300px);border-radius: 8px;}.${nameSpace}dialog-title{display: flex;justify-content: space-between;padding: 16px;
  border-bottom: 1px solid #f1f1f1;}.${nameSpace}dialog-main{padding: 16px;}.${nameSpace}dialog-main p{padding:8px 0}.${nameSpace}dialog-main p input{padding:5px;border: 1px solid #aaa;}.${nameSpace}dialog-main p button{padding:4px 8px;
  margin: 0 10px;border-radius: 2px;background: #1b1b1b;color: #fff;}.${nameSpace}keyword-wrap{margin-top: 20px;overflow-y: auto;height: 300px;}.${nameSpace}dialog-close{font-size: 18px;cursor: pointer;}.${nameSpace}keyword{display: inline-block;
  padding: 5px 8px;border: 1px solid orange;margin: 0 10px 10px 0;}.${nameSpace}keyword-del{margin-left: 5px;cursor: pointer;width: 20px; display: inline-block;text-align: center;}.menu.s-fr>a{display:none !important;}.card-feed .info .menu ul{
  display:flex !important;width:unset;top:0}.card-feed .info .menu ul li a{overflow: hidden;width: 1em;height: 1em;letter-spacing: 1em;padding: 5px;}.${nameSpace}iframe{width:540px;height:305px}
  `

  document.getElementsByTagName('head').item(0).appendChild(style)
}

function addKeyword (val) {
  if(val) {
    var ul = document.querySelector('#'+nameSpace+'keyword-wrap')
    var el = document.createElement('li')
    el.className = nameSpace + 'keyword'
    el.innerHTML = `<span>${val}</span>`

    var del = document.createElement('span')
    del.className = nameSpace + 'keyword-del'
    del.innerHTML = `×`

    ul.appendChild(el)
    el.appendChild(del)

    del.addEventListener('click',function(e){delKeyword(e)})


    var data = GM_getValue('keyword', [])
    data.push(val)
    GM_setValue('keyword', data)
  }
}

// 设置事件
function setHandle () {
  document.querySelector('.'+nameSpace+'dialog-close').addEventListener('click',function() {
    document.querySelector('#'+nameSpace+'dialog').style.display = 'none'
  })

  document.querySelector('#'+nameSpace+'add-input').onkeydown=function(ev){
    if(ev.keyCode==13){
      var val = ev.target.value
      addKeyword(val)
      ev.target.value = ''
    }
  }

  document.querySelector('#'+nameSpace+'add-btn').addEventListener('click',function() {
    var textel = document.querySelector('#'+nameSpace+'add-input')
    var val = textel.value
    textel.value = ''
    addKeyword(val)
  })

  var list = document.querySelectorAll('.'+nameSpace+'keyword-del')
  for(let i=0;i<list.length;i++) {
    var el = list[i]
    el.addEventListener('click',function(e) {
      delKeyword(e)
    })
  }
}

// 删除关键词
function delKeyword (e) {
  var text = e.currentTarget.previousSibling.outerText
  e.currentTarget.parentElement.remove()

  var data = GM_getValue('keyword', [])
  var index = data.indexOf(text)
  if(index > -1) {
    data.splice(index,1)
    GM_setValue('keyword', data)
  }
}

window.addEventListener('load', () => {
  setHideByKeyWord()
  setStyle()
  createSetBtn()
  setSearchParams()
})
