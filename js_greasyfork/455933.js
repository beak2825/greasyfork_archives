// ==UserScript==
// @name         评论推土机
// @namespace    tuituji
// @version      2.3
// @description  用于b站评论区屏蔽at信息的脚本
// @author       leostou
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/read/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @icon         https://static.hdslb.com/images/favicon.ico
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455933/%E8%AF%84%E8%AE%BA%E6%8E%A8%E5%9C%9F%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/455933/%E8%AF%84%E8%AE%BA%E6%8E%A8%E5%9C%9F%E6%9C%BA.meta.js
// ==/UserScript==

(function () {
  'use strict';
  let commentDom = null
  let commentOb = null
  let officialUrl = 'https://api.bilibili.com/x/space/acc/info?mid='
  let fansUrl = 'https://api.bilibili.com/x/relation/stat?vmid='
  let t = 0
  let maxT = 20
  let ready = false
  let timer = null

  /*可配置项*/
  let showTips = true //进入页面是否提示开启脚本，false为直接启动脚本
  let officialCheck = true // 是否开启认证校验，关闭则除白名单外的全部删除
  let bigUserFans = 200000 //认证校验开启时，非认证号粉丝量在200000以上的标记标记=>☆粉丝认证
  let smallUserFans = 2000//认证校验开启时，非认证号粉丝量在2000以上的标记标记=>☆未来可期
  let rightTagList = ['business', 'personal'] //头像右下角认证信息

  /*白名单，不过滤
  id: 白名单的id
  prev: 前缀
  reName: 重命名
  suffix: 后缀
  color: 匹配后的颜色
*/
  let whiteList = [{
    id: '',
    prev: '',
    reName: '',
    suffix: '',
    color: ''
  }, {
    id: '',
    prev: '',
    reName: '',
    suffix: '',
    color: ''
  }]

  /* 认证信息,认证校验开启时，非认证号粉丝量在200000以上的标记标记=>☆机构认证/☆知名认证
  type: 0 知名个人认证，1机构认证，10粉丝数大于2000，99粉丝数大于200000
  prev: 前缀
  suffix: 后缀
  color: 匹配后的颜色
*/
  let officialList = [{
    type: 0,
    prev: '',
    suffix: '[☆知名认证]\n',
    color: '#ffc62e',

  }, {
    type: 1,
    prev: '',
    suffix: '[☆机构认证]\n',
    color: '#3ec6f3',
  }, {
    type: 10,
    prev: '',
    suffix: '[☆未来可期]\n',
    color: '#95ddb2'
  }, {
    type: 99,
    prev: '',
    suffix: '[☆粉丝认证]\n',
    color: '#ff0000'
  }]

  const initOb = (dom) => {
    commentOb = new MutationObserver((mutations, ob) => {
      handlerComment(mutations[0].addedNodes)
    })
    commentOb.observe(dom, {
      childList: true
    })
  }

  const initTimer = () => {
    timer = setInterval(() => {
      // 10秒内没绑定成功关闭脚本
      if (ready || t >= maxT) {
        clearInterval(timer)
        timer = null
      } else {
        t++
        commentDom = document.querySelector('.comment-list')
        let list = commentDom ? commentDom.querySelectorAll('.list-item') : null
        handlerComment(list)
        if (list) {
          ready = true
          initOb(commentDom)
        }
      }
    }, 500)
  }

  // 评论列表绑定dom监听
  const handlerComment = (list) => {
    if (!list || list.length === 0) return
    Array.from(list).forEach(async item => {
      // 判断是否发言人是否有认证信息
      if (rightTagMatch(item)) return

      // 是否存在白名单
      if (whiteListMatch(item, 'dom')) return

      // 处理at逻辑
      atFn(item)
    })
  }

  const rightTagMatch = (dom) => {
    const rightTagClassName = dom.querySelector('span.bili-avatar-icon').className
    return rightTagList.some(item => {
      return rightTagClassName.includes(item)

    })
  }

  const whiteListMatch = (dom, type) => {
    let mid = type === 'dom' ? dom.querySelector('.user-face>a').dataset.usercardMid : dom.pathname.substr(1)
    if (whiteList.some(item => item.id === mid)) {
      type === 'dom' ? reWrite(dom.querySelector('.con .user>a'), '', mid) : reWrite(dom, '', mid)
      return true
    }
    return false
  }

  const atFn = async (dom) => {
    // 判断发言是否存在at
    let atReg = /@.*?\s/g
    let target = dom.querySelector('.con .text')
    if (atReg.test(target.innerText)) {
      // 是否校验认证用户

      const data = await textMatch(target)
      if (!data.some(item => item === true)) {
        dom.style.display = 'none'
      }
    }
  }

  const reWrite = (dom, type, id) => {
    let data
    if (type === 'official') {
      data = officialList.find(item => item.type === id)
    } else {
      data = whiteList.find(item => item.id === id)
    }
    let name = data.reName ? data.reName : dom.innerText
    dom.innerText = data.prev + name + data.suffix
    dom.style.color = data.color ? data.color : dom.style.color
  }

  const getInfo = (id, type) => {
    return new Promise((resolve, reject) => {
      let fullUrl = (type === 'official' ? officialUrl : fansUrl) + id
      GM_xmlhttpRequest({
        url: fullUrl,
        method: "GET",
        headers: {
          'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.0.0 Safari/537.36'
        },
        onload: function (xhr) {
          resolve(xhr.responseText)
        }
      });
    })
  }

  const officialTest = (data) => {
    let res = JSON.parse(data)
    if (res && res.data) {
      return res.data.official.type
    }
    return -1
  }

  const fansTest = (data) => {
    let res = JSON.parse(data)
    if (res && res.data) {
      if (res.data.follower < smallUserFans) {
        return -1
      } else if (res.data.follower >= bigUserFans) {
        return 99
      } else {
        return 10
      }
    }
  }

  const textMatch = async (commentDom) => {
    let aTagArr = Array.from(commentDom.querySelectorAll('a'))
    return await Promise.all(aTagArr.map(aItem => new Promise(async (res, rej) => {
      if (whiteListMatch(aItem, 'atUser')) {
        res(true)
      }
      if (!officialCheck) {
        res(false)
      }
      let mid = aItem.pathname.substr(1)
      // 发送请求获取认证状态
      let type = -1
      const data = await getInfo(mid, 'official')
      type = officialTest(data)
      if (type === -1) {
        const data = await getInfo(mid, 'fans')
        type = fansTest(data)
      }
      if (textReplace(type, aItem)) {
        res(true)
      }
      res(false)
    })))
  }

  const textReplace = (type, aItem) => {
    // 认证条件判断成功
    if (type !== -1) {
      reWrite(aItem, 'official', type)
      return true
    }
    return false
  }

  const initTips = () => {
    if (!showTips) {
      initTimer()
      return
    }
    const box = document.createElement('div')
    box.style = 'position:fixed;width:200px;height:100px;left:-200px;top:500px;border-radius:10px;border:1px solid #37c8f7;background-color:#fff; text-align: center;transition :all linear 0.25s;opacity:.5;z-index:9999'
    const boxShow = () => {
      box.style.left = '0px'
      box.style.opacity = 1
    }
    const boxHide = () => {
      box.style.left = '-200px'
      box.style.opacity = '0'
    }

    const p = document.createElement('p')
    p.style = 'padding:10px'
    p.innerText = '是否开启坟头推土机脚本'

    const btnBox = document.createElement('div')
    btnBox.style.marginTop = '30px'

    let btnStyle = 'padding:5px 10px;border:1px solid #ccc;border-radius:5px;margin:5px;user-select:none;cursor:pointer'
    const btnCancel = document.createElement('span')
    btnCancel.innerText = '取消'
    btnCancel.style = btnStyle
    btnCancel.addEventListener('click', () => {
      boxHide()
      setTimeout(textBoxShow, 250)
    })

    const btnConfirm = document.createElement('span')
    btnConfirm.innerText = '确定'
    btnConfirm.style = btnStyle
    btnConfirm.style.backgroundColor = '#00a1d6'
    btnConfirm.style.color = '#fff'
    btnConfirm.addEventListener('click', () => {
      initTimer()
      boxHide()
    })

    const textBox = document.createElement('div')
    textBox.style = 'position:fixed;left:-60px;top:500px;background-color:#00a1d6;width:30px;padding:10px 10px 10px 0px;font-size:16px;color:#fff;font-weight:700;writing-mode: vertical-rl;transition :all linear 0.25s;opacity:0;cursor: pointer;border-radius: 0 10px 10px 0;'
    textBox.innerText = '评论推土机'
    textBox.addEventListener('click', () => {
      textBoxHide()
      setTimeout(boxShow, 250)
    })
    const textBoxHide = () => {
      textBox.style.left = '-50px'
      textBox.style.opacity = '0'
    }
    const textBoxShow = () => {
      textBox.style.left = '-10px'
      textBox.style.opacity = 1
    }
    const textBoxMouseOver = () => {
      textBox.style.transition = 'all .25s linear'
      textBox.style.left = '0px'
    }
    const textBoxMouseLeave = () => {
      textBox.style.transition = 'all .25s linear'
      textBox.style.left = '-10px'
    }
    textBox.addEventListener('mouseover', textBoxMouseOver)
    textBox.addEventListener('mouseleave', textBoxMouseLeave)

    document.body.appendChild(textBox)
    document.body.appendChild(box)
    box.appendChild(p)
    box.appendChild(btnBox)
    btnBox.appendChild(btnCancel)
    btnBox.appendChild(btnConfirm)

    document.querySelector('#app').addEventListener('click', (e) => {
      if (commentOb) return
      boxHide()
      setTimeout(textBoxShow, 250)
    }, false)

    setTimeout(() => {
      textBoxShow()
    })
  }

  initTips()
})()