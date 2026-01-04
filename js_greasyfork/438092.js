// ==UserScript==
// @name              个人视频解析
// @version           2.15-2024.7.27
// @description       支持B站、腾讯视频、爱奇艺、优酷、土豆、芒果TV，支持多个解析接口切换，界面简洁，脚本仅限学习，请大家支持正版。
// @author            skyseek
// @author       skyseek
// @require           https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js 
// @match             *://v.qq.com/x/cover/*
// @match             *://v.qq.com/x/page/*
// @match             *://m.qq.com/*
// @match             *://www.iqiyi.com/v*
// @match             *://m.iqiyi.com/*
// @match             *://v.youku.com/v_show/*
// @match             *://m.youku.com/*
// @match             *://www.mgtv.com/b/*

// @icon         data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAACDtub/2vb+/9v2///b9v//2vX+/9r2/v/a9f//2/b//9v2///b9v//2vb+/9v2///b9v//2/b//9jy+f9AcKz/ksDs/9r2/v/b9v//2/b//9j0/f+y2Oz/2fX+/9v2///a9v//w+X3/6XP7P/b9v7/2/b//9v2///Y8vn/U4fA/3er5f/a9v7/2/b//9v2///b9v//ps/r/77i9f/Q8Pr/0vD6/47A5//T8Pv/2/b//9v2///b9v//1vH5/zd0uv9AgtH/veHz/9bz/P/a9f7/2/b//8Dj9P+Jveb/tNrv/67W7v+Btd7/2fb+/9v2///b9v//v+H0/5DA6f8ZZrv/OXOy/1+d2v+w2fL/2vb+/9v2//+r1fD/o8/v/8jp+P+eyuz/hrrl/9r2/v/a9v7/2vb+/4G24f9foNv/GDtr/y1hnv/L7Pn/a6ff/9b0+//V8vv/jL3i/9b0/f+Qu+r/dZXn/6zV7/+cyez/2fb9/7zh9P93rt7/zvD7/z9snf9votj/2vX+/7Xb8v98s+D/mcXl/8nq9f/r+v3/p8Tq/32Z5v/3/P3/pc3r/3iv3/94sOL/z+36/9r2/v99sNb/f7Pj/9r1///b9v//2vb+/9f0/f/S8vz/+v3+//b6/P+ryOj//v7+/+H2/P/T8vz/2vb+/9r2/v/a9f7/gcLq/2mi3f/a9v7/2/b//9v2///X9P7/z+74/2xudf/X1eX/1dD0/4eHjP+twsr/0/H9/9v2///b9v//2fX+/3e95P9FdrX/0vH6/9r1/v/a9v7/2/b//9n1/f96ipL/5ers//z+/v+RnaP/u9La/9r2/v/b9v//2vb+/87z/P9Qn9v/OWae/2+o3f/J6/v/2fX+/9v2///b9v//2/b//9v2/v/c9v7/2vX+/9v2///b9v7/2vX+/8Hl+P9optz/Oo3D/zRXhf9Ge7f/ueP7/8To/P/Y9P7/2/b+/9v2///b9v//2/b//9v2///b9v//1/T+/8Hn+/+24fr/Q4rL/0GNuf8tNlL/N2Sh/3y15/98s+X/msno/9n1/f/a9v7/2vb+/9r1/v/a9v7/2vX+/6XR7f9wrOL/ZqTf/zZ+v/9Tlrf/Pktw/ztKav87R2D/SEtb/zFZj/9Og7//ZZzU/3+05P+AteX/fq/d/1WRyP82fbz/SYOu/0qGr/9JjLT/Ro+u/y1Kdf9ANjn/PC4w/0c3OP9gUFD/clxW/2dUUv9wanD/UExU/1lIRv9ganD/NXed/0uRt/9HjbH/Q462/0qNp/9WQkD/TTo4/0IwMf9TQEP/U0BB/1M/QP9iTEn/WUM//2lTTf9bSEP/b1lS/0Nbav8/g67/QpS6/0KKr/9fkKD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @license           GPL License
// @grant             unsafeWindow
// @grant             GM.openInTab
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_xmlhttpRequest
// @grant             GM_registerMenuCommand
// @connect           iqiyi.com
// @connect           mgtv.com
// @namespace https://greasyfork.org/zh-CN/scripts/424086
// @downloadURL https://update.greasyfork.org/scripts/438092/%E4%B8%AA%E4%BA%BA%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/438092/%E4%B8%AA%E4%BA%BA%E8%A7%86%E9%A2%91%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

;(function () {
  ;('use strict')
  var $ = $ || window.$
  var host = location.host
  var parseInterfaceList = []
  var originalInterfaceList = [
    { name: '线路一', type: '1', url: 'https://jx.playerjy.com/?url=' },
    {
      name: '线路二',
      type: '1',
      url: 'https://jx.yparse.com/index.php?url='
    },
    {
      name: '线路三',
      type: '1',
      url: 'https://svip.bljiex.cc/?v='
    },
    {
      name: '线路四',
      type: '1',
      url: 'https://jx.xmflv.com/?url='
    },
      {
          name: '虾米2',
          type: '1',
          url: 'https://jx.xmflv.cc/?url='
    },
     {
      name: '线路五',
      type: '1',
      url: 'https://www.yemu.xyz/?url='
    }
  ]
  function innerParse(url) {
    $('#iframe-player').attr('src', url)
  }
  function GMopenInTab(url, open_in_background) {
    if (typeof GM_openInTab === 'function') {
      GM_openInTab(url, open_in_background)
    } else {
      GM.openInTab(url, open_in_background)
    }
  }
  function GMgetValue(name, value) {
    if (typeof GM_getValue === 'function') {
      return GM_getValue(name, value)
    } else {
      return GM.getValue(name, value)
    }
  }
  function GMsetValue(name, value) {
    if (typeof GM_setValue === 'function') {
      GM_setValue(name, value)
    } else {
      GM.setValue(name, value)
    }
  }
  function GMxmlhttpRequest(obj) {
    if (typeof GM_xmlhttpRequest === 'function') {
      GM_xmlhttpRequest(obj)
    } else {
      GM.xmlhttpRequest(obj)
    }
  }
  function css(css) {
    var myStyle = document.createElement('style')
    myStyle.textContent = css
    var doc = document.head || document.documentElement
    doc.appendChild(myStyle)
  }

  var node = ''
  var player_nodes = [
    { url: 'v.qq.com', node: '#player-container' },
    { url: 'www.iqiyi.com', node: '.Video_container__jfBSy' },
    { url: 'v.youku.com', node: '#ykPlayer' },
    { url: 'www.mgtv.com', node: '#mgtv-player-wrap container' }
  ]
  for (var i in player_nodes) {
    if (player_nodes[i].url == host) {
      node = player_nodes[i].node
    }
  }
  var videoPlayer = `<div id='iframe-div' style='width:100%;height:100%;z-index:1000;'><iframe id='iframe-player' frameborder='0' allowfullscreen='true' width='100%' height='100%'></iframe></div>`
  var innerList = []
  var innerlis = ''
  originalInterfaceList.forEach((item, index) => {
    if (item.type == '1') {
      innerList.push(item)
      innerlis += '<li>' + item.name + '</li>'
    }
  })
  parseInterfaceList = innerList

  var left = 0
  var top = 100
  var Position = GMgetValue('Position_' + host)
  if (!!Position) {
    left = Position.left
    top = Position.top
  }
  // add css to the html
  css(`
  .mainc {
      cursor: pointer;
      position: fixed;
      top: ${top}px;
      left: ${left}px;
      z-index: 2147483647;
      font-size: 12px;
      text-align: left;
    }
    .mainc .logo {
       position: absolute;
       right: 0;
       width: 1.5em;
       padding: 5px 2px;
       text-align: center;
       color: #fff;
       cursor: auto;
       user-select: none;
       border-radius: 0 4px 4px 0;
       transform: translate3d(100%, 5%, 0);
       background: rgba(255, 255, 255, .15);
     }
     .mainc:hover{
       .box{
       display:block;
       }
     }
     .box {
      display:none;
       background-color: rgba(0, 0, 0, 0.4);
       position: absolute;
       top: 0;
       left: 17px;
       width: 70px;
     }
     .box .container {
       display: flex;
       flex-direction: column;
     }
     .box .container ul {
       list-style: none;
     }
     .container li {
       font-size: 12px;
       color: #fff;
       text-align: center;
       line-height: 21px;
       width: 60px;
       border-radius: 6px 6px 6px 6px;
       padding: 0 4px;
       margin: 12px 2px;
     }
     .container li:hover {
       /* 背景突出，鼠标变为点击状态 */
       background: rgba(255, 255, 255, 0.2);
       user-select: none;
       cursor: pointer;
     }`)
  $(function () {
    $('ul').on('click', 'li', function () {
      $('ul li').removeClass('add')
      $(this).addClass('add')
    })
  })
  //crearte a new element
  var html = `     <div class="mainc">
      <div class="logo"><a id="m">解析</a></div>
      <div class="box">
        <div class="container">
          <ul>
            ${innerlis}
          </ul>
        </div>
      </div>
    </div>`
  //append the new element to the body
  //add event listener
  $('body').append(html)
  $('.container li').each((index, item) => {
    item.addEventListener('click', () => {
      if ((parseInterfaceList[index].type == '1', '2')) {
        if (document.getElementById('iframe-player') == null) {
          var player = $(node)
          player.empty()
          player.append(videoPlayer)
        }
        innerParse(parseInterfaceList[index].url + location.href)
      } else {
        GMopenInTab(parseInterfaceList[index].url + location.href, false)
      }
    })
  })
})()
