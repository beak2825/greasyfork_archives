// ==UserScript==
// @name         图书分享
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  尝试分享自己购买的掘金小册，大家一起学习~
// @author       gkshi
// @match        https://juejin.cn/book/*/section/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/450389/%E5%9B%BE%E4%B9%A6%E5%88%86%E4%BA%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/450389/%E5%9B%BE%E4%B9%A6%E5%88%86%E4%BA%AB.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const my = injectInterceptor()
  window.XMLHttpRequest = my.myXHR
  window.fetch = my.myFetch

  const juejinOnloadHandler = juejin(my, postServer)

  window.onload = function () {
    juejinOnloadHandler()
  }
})()



function juejin (interceptor, uploadFunc) {
  // 最后上传小册的结构
  let book = {
    title: '',
    booklet_id: '',
    cover_img: '',
    summary: '',
    sections: []
  }
  // 接口处获取的章节顺序队列
  let sectionQueue = []

  // TODO step1: 先拦截小册的基本信息，包括：标题、封面、各章节顺序等
  const bookInterceptor = (promise) => {
    promise.then(data => {
      const baseInfo = data.data.booklet.base_info
      sectionQueue = data.data.sections
      const { booklet_id, cover_img, summary, title } = baseInfo
      book = { ...book, ...{ booklet_id, cover_img, summary, title } }
    })
  }
  const bookletRule = {
    url: 'api.juejin.cn/booklet_api/v1/booklet/get',
    interceptor: bookInterceptor
  }
  interceptor.pushRule(bookletRule)

  // TODO step2: 往页面中插入自定义元素：开始复制按钮等
  const addCopyBtn = () => {
    let timeout
    timeout = setTimeout(() => {
      const title = document.querySelector('.book-content__header .title')
      if (!title) return
      createCopyBtn(title)
      clearTimeout(timeout)
    }, 1000)
  }

  const createCopyBtn = (title) => {
    if (!title) return
    const btn = document.createElement('button')
    btn.textContent = '开始复制'
    btn.onclick = startCopy
    if (title) title.appendChild(btn)
  }

  // TODO step3: 处理点击 开始复制 后的操作
  let dirOfSection = [] // 左边生成的目录章节
  const startCopy = () => {
    const dir = document.querySelectorAll('.section-list .section')
    dir.forEach(el => dirOfSection.push(el))
    crawlSection(dirOfSection, 0)
  }

  // TODO step4: 开始模拟点击左侧章节，生成状态
  // 如果是在第一章激活的情况下开始复制，默认从第二章开始，最后回过头来模拟点击第一章
  let activedFirst = null
  let activedIdx = -1
  let currentIdx = -1
  const crawlSection = (dirArr, idx) => {
    let newIdx = idx
    let cur = dirArr[newIdx]
    if (!cur) {
      // 最后回头拿最开始激活的章节
      if (activedFirst) {
        currentIdx = activedIdx
        createLoading(activedFirst)
        activedFirst.click()
        activedFirst = null
      }
      return
    }
    if (cur.className.includes('active')) {
      activedFirst = cur
      activedIdx = newIdx
      newIdx++
      cur = dirArr[newIdx]
    }
    if (cur) {
      currentIdx = newIdx
      createLoading(cur)
      cur.click()
    }
  }

  const createLoading = (cur) => {
    const loading = document.createElement('span')
    loading.textContent = '抓取中...'
    loading.className = 'loading-span'
    loading.style = 'color: rgba(64, 158, 255, .6);'
    cur.appendChild(loading)
  }

  const changeLoadingStatus = (idx, flag) => {
    const el = dirOfSection[idx]
    const spans = el.querySelectorAll('.loading-span')
    const span = spans[spans.length - 1]
    if (!span) return
    if (flag === 'success') {
      span.textContent = '完成'
      span.style = 'color:rgb(103, 194, 58);'
    } else {
      span.textContent = '失败'
      span.style = 'color:rgb(245, 108, 108);'
    }
  }

  //TODO step5: 拦截每一章节并获取内容、评论
  let successCount = 0
  let articleAndCommentOvered = 0 // 用来判断文章和评论都抓取完
  const next = (from) => {
  if (articleAndCommentOvered === 0) {
    articleAndCommentOvered = 1
    return
  }
  successCount++
  if (successCount === dirOfSection.length) {
    sortSectionsAndUpload()
    return
  }
  articleAndCommentOvered = 0
  setTimeout(() => {
    crawlSection(dirOfSection, currentIdx + 1)
  }, getRandomTime())
}
  const sectionInterceptor = (promise) => {
    if (currentIdx === -1) {
      // 如果不是点击复制按钮后的拦截，不予以保存
      return
    }
    promise.then(data => {
      const { section_id, id, content, title, booklet_id, user_id } = data.data.section
      book.sections.push({ id, booklet_id, section_id, title, content, user_id })
      changeLoadingStatus(currentIdx, 'success')
      next()
    }).catch((error) => {
      console.log('error: ', error)
      changeLoadingStatus(currentIdx, 'failed')
    })
  }

  function getRandomTime () {
    // 防止规律化时间，被墙, 2s ~ 3.5s
    return 2000 + (Math.random() * 1500)
  }

  const sectionRule = {
    url: 'api.juejin.cn/booklet_api/v1/section/get',
    interceptor: sectionInterceptor
  }
  interceptor.pushRule(sectionRule, 'response')

  // TODO step6: 评论相关
  /*
    评论请求拦截，直接拉取 500 条，一次性拉完
  */
  const commentRequestInterceptor = (args) => {
    const body = JSON.parse(args[1].body)
    args[1].body = JSON.stringify({ ...body, limit: 500 })
  }
  const commentRequestRule = {
    url: 'api.juejin.cn/interact_api/v1/comment/list',
    interceptor: commentRequestInterceptor
  }
  interceptor.pushRule(commentRequestRule, 'request')

  let sectionId2Comments = {}
  const commentResponseInterceptor = (promise, args) => {
    if (currentIdx === -1) return
    promise.then(data => {
      const sectionId = JSON.parse(args[1].body).item_id
      const comments = data.data.map(d => {
        const { comment_info, reply_infos, user_info } = d
        const { comment_content, comment_pics } = comment_info || {}
        const { user_name, user_id, avatar_large } = user_info || {}
        const comment = { user_name, user_id, avatar_large, comment_content, comment_pics, replys: [] }
        ;(reply_infos || []).forEach(reply => {
          const { reply_info, user_info: rUser } = reply
          const { reply_content, reply_pics } = reply_info || {}
          const { user_name: rUserName, user_id: rUserId, avatar_large: rAvatar } = rUser || {}
          const r = { user_name: rUserName, user_id: rUserId, avatar_large: rAvatar, reply_content, reply_pics }
          comment.replys.push(r)
        })
        return comment
      })
      sectionId2Comments[sectionId] = comments
      next()
    })
  }
  const commentResponseRule = {
    url: 'api.juejin.cn/interact_api/v1/comment/list',
    interceptor: commentResponseInterceptor
  }
  interceptor.pushRule(commentResponseRule, 'response')


  const reset = () => {
    book.sections = []
    book.comments = []
    activedFirst = null
    activedIdx = -1
    currentIdx = -1
    successCount = 0
  }
  // TODO step7: 章节排序(整合对应评论)并调用上传服务器接口
  function sortSectionsAndUpload () {
    const { sections, booklet_id } = book
    const obj2Section = {}
    sections.forEach(s => {
      obj2Section[s.id] = s
    })

    const sortedSection = []
    const comments = []
    sectionQueue.forEach((so, idx) => {
      const section = obj2Section[so.id]
      sortedSection.push({ ...section, no_id: idx + 1 })
      const comment = sectionId2Comments[so.section_id]
      comments.push({ booklet_id, author_id: section.user_id, section_id: so.section_id, comment })
    })
    book.sections = sortedSection
    book.comments = comments
    uploadFunc && uploadFunc(JSON.parse(JSON.stringify(book)))
    reset()
  }


  return () => {
    addCopyBtn()
  }
}






// ----------------------- 以下为内部工具类 ----------------------------


/**
 * @description: 拦截器相关配置
 * @return {Object}
 */
function injectInterceptor () {
  let config = {
    requestRules: [],
    responseRules: [],
    pushRule: function (rule, stage = 'response') {
      const { url, interceptor } = rule || {}
      if (!url || !interceptor || !(interceptor instanceof Function)) {
        throw new Error(`配置规则有误：${rule}，请参照：{ url: 字符串或正则, interceptor: 函数 }格式。`)
      }
      if (stage === 'response') {
        config.responseRules.push(rule)
      } else if (stage === 'request') {
        config.requestRules.push(rule)
      }
    },
    originalXHR: window.XMLHttpRequest,
    myXHR: function () {
      const xhr = new config.originalXHR
      for (let attr in xhr) {
        if (attr === 'onload') {
          xhr.onload = (...args) => {
            // 请求成功
            responseIntercept(config.responseRules, this.responseURL, this)
            this.onload && this.onload.apply(this, args)
          }
          continue
        }
        if (attr === 'open' || attr === 'send') {
          const handler = xhr[attr]
          xhr[attr] = (...args) => {
            requestIntercept(config.requestRules, xhr.responseURL, args, attr)
            handler.apply(xhr, args)
          }
        }
        if (typeof xhr[attr] === 'function') {
          this[attr] = xhr[attr].bind(xhr)
        } else {
          Object.defineProperty(this, attr, {
            get: () => xhr[attr],
            set: (val) => xhr[attr] = val,
            enumerable: true
          })
        }
      }
    },

    originalFetch: window.fetch.bind(window),
    myFetch: function (...args) {
      requestIntercept(config.requestRules, args[0], args)
      return config.originalFetch(...args).then((response) => {
        const json = response.json
        response.json = function () {
          const jsonRes = json.call(this)
          responseIntercept(config.responseRules, response.url, jsonRes, args)
          return jsonRes
        }
        return response
      })
    }
  }

  function requestIntercept(rules, target, args, xhrType) {
    rules.some(({ url, interceptor }) => {
      let urlReg = url
      if (!(url instanceof RegExp)) {
        urlReg = new RegExp(url, 'ig')
      }
      if (urlReg.test(target)) {
        interceptor && interceptor(args, xhrType)
        return true
      }
    })
  }
  function responseIntercept (rules, target, data, fetchArgs) {
    rules.some(({ url, interceptor }) => {
      let urlReg = url
      if (!(url instanceof RegExp)) {
        urlReg = new RegExp(url, 'ig')
      }
      if (urlReg.test(target)) {
        interceptor && interceptor(data, fetchArgs)
        return true
      }
    })
  }

  return config
}





/*
book 的结构如下：

Book: {
  booklet_id: string  // 书籍 id
  cover_img?: string
  summary: string  // 描述
  title: string
  sections: Section[]
}

Section: {
  no_id: number  // 每章的顺序 id，建议从 1 开始自增
  id: string  // 由于掘金有这个字段，但似乎暂时没用，建议加上这个单独标记
  booklet_id: string  // 书籍 id
  section_id: string  // 章节 id
  title: string
  content: string  // 内容为已经由 markdown 转为 html 后的字符串
}

*/
/**
 * @description: 上传服务器接口
 * @param {*} book
 * @return {*}
 */
function postServer (book) {
  createRequestIcon()
  // fetch('http://127.0.0.1:3666/book', {
  fetch('https://blogapi.gkshi.com/book', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(book)
  }).then(res => {
    successTip(res.json())
  }).catch((error) => {
    changeRequestIconText(`上传发生了错误！！！！！${error}`)
    setTimeout(delRequestIcon, 2500)
  })

  function successTip (promise) {
    promise.then(data => {
      if (data && data.errno === 0) {
        changeRequestIconText('上传成功！√')
      } else {
        changeRequestIconText(`上传失败！× error:${data.errmsg}`)
      }
      setTimeout(delRequestIcon, 2500)
    })
  }

  function createRequestIcon () {
    const div = document.createElement('div')
    div.className = 'request-icon'
    const styles = `
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 9999;
    width: 200px;
    height: 200px;
    transform: translate(-50%, -50%);
    line-height: 200px;
    text-align: center;
    background-color: lightblue;
    box-shadow: 0 0 20px 5px rgb(150 150 150 / 30%);
    `
    div.style = styles
    div.textContent = '正在接口上传中...'
    const body = document.querySelector('body')
    body.appendChild(div)
  }

  function changeRequestIconText (text) {
    const icon = document.querySelector('.request-icon')
    if (icon) icon.textContent = text
  }

  function delRequestIcon () {
    const icon = document.querySelector('.request-icon')
    if (icon) icon.remove()
  }
}
