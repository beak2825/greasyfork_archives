// ==UserScript==
// @name         云邮教学空间助手
// @namespace    http://tampermonkey.net/
// @version      0.20
// @description  作业显示相关课程，office文档预览切换到 view.officeapps.live.com，重命名下载文件名
// @author       YouXam
// @match        https://ucloud.bupt.edu.cn/*
// @match        https://ucloud.bupt.edu.cn/uclass/course.html*
// @match        https://ucloud.bupt.edu.cn/uclass/*
// @match        https://ucloud.bupt.edu.cn/office/*
// @icon         https://ucloud.bupt.edu.cn/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478125/%E4%BA%91%E9%82%AE%E6%95%99%E5%AD%A6%E7%A9%BA%E9%97%B4%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/478125/%E4%BA%91%E9%82%AE%E6%95%99%E5%AD%A6%E7%A9%BA%E9%97%B4%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
/* eslint-disable no-undef */
window.loadJs = function loadJs(src) {
  return new Promise((ret, rej) => {
    fetch(src)
      .then((res) => res.text())
      .then((res) => {
        const s = document.createElement('script')
        s.language = 'javascript'
        s.type = 'text/javascript'
        s.text = res
        document.getElementsByTagName('HEAD')[0].appendChild(s)
        ret(0)
      })
      .catch((e) => rej(e))
  })
}
function loadCss() {
  function addGlobalStyle(css) {
    const head = document.getElementsByTagName('head')[0]
    if (!head) {
      return
    }
    const style = document.createElement('style')
    style.type = 'text/css'
    style.innerHTML = css
    head.appendChild(style)
  }
  addGlobalStyle(
    '#nprogress{pointer-events:none}#nprogress .bar{background:#ffbe00;position:fixed;z-index:1031;top:0;left:0;width:100%;height:5px}#nprogress .peg,.nprogress-custom-parent #nprogress .bar,.nprogress-custom-parent #nprogress .spinner{position:absolute}#nprogress .peg{display:block;right:0;width:100px;height:100%;box-shadow:0 0 10px #ffbe00,0 0 5px #ffbe00;opacity:1;-webkit-transform:rotate(3deg) translate(0,-4px);-ms-transform:rotate(3deg) translate(0,-4px);transform:rotate(3deg) translate(0,-4px)}#nprogress .spinner{display:block;position:fixed;z-index:1031;top:15px;right:15px}#nprogress .spinner-icon{width:18px;height:18px;box-sizing:border-box;border:2px solid transparent;border-top-color:#ffbe00;border-left-color:#ffbe00;border-radius:50%;-webkit-animation:.4s linear infinite nprogress-spinner;animation:.4s linear infinite nprogress-spinner}.nprogress-custom-parent{overflow:hidden;position:relative}@-webkit-keyframes nprogress-spinner{0%{-webkit-transform:rotate(0)}100%{-webkit-transform:rotate(360deg)}}@keyframes nprogress-spinner{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}'
  )
}
function getToken() {
  const cookieMap = new Map()
  document.cookie.split('; ').forEach((cookie) => {
    const [key, value] = cookie.split('=')
    cookieMap.set(key, value)
  })
  const token = cookieMap.get('iClass-token')
  const userid = cookieMap.get('iClass-uuid')
  return [userid, token]
}
let sumBytes = 0,
  loadedBytes = 0,
  downloading = false
async function downloadFile(url, filename) {
  downloading = true
  await jsp
  NProgress.configure({ trickle: false, speed: 0 })
  try {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const contentLength = response.headers.get('content-length')
    if (!contentLength) {
      window.open(url)
      return
      throw new Error('Content-Length response header unavailable')
    }

    const total = parseInt(contentLength, 10)
    sumBytes += total
    const reader = response.body.getReader()
    const chunks = []
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (!downloading) {
        NProgress.done()
        return
      }
      chunks.push(value)
      loadedBytes += value.length
      NProgress.set(loadedBytes / sumBytes)
    }
    NProgress.done()
    sumBytes -= total
    loadedBytes -= total
    const blob = new Blob(chunks)
    const downloadUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = downloadUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Download failed:', error)
  }
}

async function searchTask(siteId, keyword, token) {
  const res = await fetch(
    'https://apiucloud.bupt.edu.cn/ykt-site/work/student/list',
    {
      headers: {
        authorization: 'Basic cG9ydGFsOnBvcnRhbF9zZWNyZXQ=',
        'blade-auth': token,
        'content-type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        siteId,
        keyword,
        current: 1,
        size: 5
      }),
      method: 'POST'
    }
  )
  const json = await res.json()
  return json
}

async function searchCourse(userId, id, keyword, token) {
  const res = await fetch(
    'https://apiucloud.bupt.edu.cn/ykt-site/site/list/student/current?size=999999&current=1&userId=' +
      userId +
      '&siteRoleCode=2',
    {
      headers: {
        authorization: 'Basic cG9ydGFsOnBvcnRhbF9zZWNyZXQ=',
        'blade-auth': token
      },
      body: null,
      method: 'GET'
    }
  )
  const json = await res.json()
  const list = json.data.records.map((x) => ({
    id: x.id,
    name: x.siteName,
    teachers: x.teachers.map((y) => y.name).join(', ')
  }))
  async function searchWithLimit(list, id, keyword, token, limit = 5) {
    for (let i = 0; i < list.length; i += limit) {
      const batch = list.slice(i, i + limit)
      const jobs = batch.map((x) => searchTask(x.id, keyword, token))
      const ress = await Promise.all(jobs)
      for (let j = 0; j < ress.length; j++) {
        const res = ress[j]
        if (res.data.records.length > 0) {
          for (const item of res.data.records) {
            if (item.id == id) {
              return batch[j]
            }
          }
        }
      }
    }
    return null
  }
  return await searchWithLimit(list, id, keyword, token)
}
async function getTasks(siteId, token) {
  const res = await fetch(
    'https://apiucloud.bupt.edu.cn/ykt-site/work/student/list',
    {
      headers: {
        authorization: 'Basic cG9ydGFsOnBvcnRhbF9zZWNyZXQ=',
        'blade-auth': token,
        'content-type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify({
        siteId,
        current: 1,
        size: 9999
      }),
      method: 'POST'
    }
  )
  const json = await res.json()
  return json
}
async function searchCourses(nids) {
  const result = {}
  const ids = []
  for (const id of nids) {
    const r = get(id)
    if (r) result[id] = r
    else ids.push(id)
  }

  if (ids.length == 0) return result
  const [userid, token] = getToken()
  const res = await fetch(
    'https://apiucloud.bupt.edu.cn/ykt-site/site/list/student/current?size=999999&current=1&userId=' +
      userid +
      '&siteRoleCode=2',
    {
      headers: {
        authorization: 'Basic cG9ydGFsOnBvcnRhbF9zZWNyZXQ=',
        'blade-auth': token
      },
      body: null,
      method: 'GET'
    }
  )
  const json = await res.json()
  const list = json.data.records.map((x) => ({
    id: x.id,
    name: x.siteName,
    teachers: x.teachers.map((y) => y.name).join(', ')
  }))
  const hashMap = new Map()
  let count = ids.length
  for (let i = 0; i < ids.length; i++) {
    hashMap.set(ids[i], i)
  }
  async function searchWithLimit(list, limit = 5) {
    for (let i = 0; i < list.length; i += limit) {
      const batch = list.slice(i, i + limit)
      const jobs = batch.map((x) => getTasks(x.id, token))
      const ress = await Promise.all(jobs)
      for (let j = 0; j < ress.length; j++) {
        const res = ress[j]
        if (res.data.records.length > 0) {
          for (const item of res.data.records) {
            if (hashMap.has(item.id)) {
              result[item.id] = batch[j]
              set(item.id, batch[j])
              if (--count == 0) {
                return result
              }
            }
          }
        }
      }
    }
    return result
  }
  return await searchWithLimit(list)
}
async function getUndoneList() {
  const [userid, token] = getToken()
  const res = await fetch(
    'https://apiucloud.bupt.edu.cn/ykt-site/site/student/undone?userId=' +
      userid,
    {
      headers: {
        authorization: 'Basic cG9ydGFsOnBvcnRhbF9zZWNyZXQ=',
        'blade-auth': token
      },
      method: 'GET'
    }
  )
  const json = await res.json()
  return json
}
async function getDetail(id) {
  const [, token] = getToken()
  const res = await fetch(
    'https://apiucloud.bupt.edu.cn/ykt-site/work/detail?assignmentId=' + id,
    {
      headers: {
        authorization: 'Basic cG9ydGFsOnBvcnRhbF9zZWNyZXQ=',
        'blade-auth': token
      },
      body: null,
      method: 'GET'
    }
  )
  const json = await res.json()
  return json
}
async function getSiteResource(id) {
  const [userid, token] = getToken()
  const res = await fetch(
    'https://apiucloud.bupt.edu.cn/ykt-site/site-resource/tree/student?siteId=' +
      id +
      '&userId=' +
      userid,
    {
      headers: {
        authorization: 'Basic cG9ydGFsOnBvcnRhbF9zZWNyZXQ=',
        'blade-auth': token
      },
      body: null,
      method: 'POST'
    }
  )
  const json = await res.json()
  const result = []
  function foreach(data) {
    console.log(data)
    data.forEach((x) => {
      x.attachmentVOs.forEach((y) => {
        if (y.type !== 2) result.push(y.resource)
      })
      foreach(x.children)
    })
  }
  foreach(json.data)
  return result
}
function $x(xpath, context = document) {
  const iterator = document.evaluate(
    xpath,
    context,
    null,
    XPathResult.ANY_TYPE,
    null
  )
  const results = []
  let item
  while ((item = iterator.iterateNext())) {
    results.push(item)
  }
  return results
}
function set(k, v) {
  const h = JSON.parse(localStorage.getItem('zzxw') || '{}')
  h[k] = v
  localStorage.setItem('zzxw', JSON.stringify(h))
}
function get(k) {
  const h = JSON.parse(localStorage.getItem('zzxw') || '{}')
  return h[k]
}

function insert(x) {
  if (
    $x(
      '/html/body/div[1]/div/div[2]/div[2]/div/div/div[2]/div/div[2]/div[1]/div/div/div[1]/div/p'
    ).length > 2
  )
    return
  const d = $x(
    '/html/body/div[1]/div/div[2]/div[2]/div/div/div[2]/div/div[2]/div[1]/div/div/div[1]/div/p[1]'
  )
  if (!d.length) {
    setTimeout(() => insert(x), 50)
    return
  }
  const p = document.createElement('p')
  const t = document.createTextNode(x.name + '(' + x.teachers + ')')
  p.appendChild(t)
  d[0].after(p)
}
function sleep(n) {
  return new Promise((res) => setTimeout(res, n))
}
async function wait(func) {
  let r = func()
  if (r instanceof Promise) r = await r
  if (r) return r
  await sleep(50)
  return await wait(func)
}
async function waitChange(func, value) {
  const r = value
  // eslint-disable-next-line no-constant-condition
  while (1) {
    const t = await func()
    if (t != r) return t
    await sleep(50)
  }
}
let onlinePreview = null
async function getPreviewURL(storageId) {
  const res = await fetch(
    'https://apiucloud.bupt.edu.cn/blade-source/resource/preview-url?resourceId=' +
      storageId
  )
  const json = await res.json()
  onlinePreview = json.data.onlinePreview
  return json.data.previewUrl
}
let setClicked = false
let gpage = -1
let glist = null
let jsp
async function main() {
  'use strict'
  if (new URLSearchParams(location.search).get('ticket')?.length) {
    setTimeout(() => {
      location.href = 'https://ucloud.bupt.edu.cn/uclass/#/student/homePage'
    }, 500)
  }
  if (
    location.href.startsWith(
      'https://ucloud.bupt.edu.cn/uclass/course.html#/student/assignmentDetails_fullpage'
    )
  ) {
    const q = new URLSearchParams(location.href)
    const id = q.get('assignmentId')
    const r = get(id)
    const [userid, token] = getToken()
    if (r) {
      insert(r)
    } else {
      const title = q.get('assignmentTitle')
      if (!id || !title) return
      searchCourse(userid, id, title, token).then((x) => {
        insert(x)
        set(id, x)
      })
    }
    const detail = (await getDetail(id)).data
    const filenames = detail.assignmentResource.map((x) => x.resourceName)
    const urls = await Promise.all(
      detail.assignmentResource.map((x) => {
        return getPreviewURL(x.resourceId)
      })
    )
    await wait(
      () => $x('//*[@id="assignment-info"]/div[2]/div[2]/div[2]/div').length > 0
    )
    $x('//*[@id="assignment-info"]/div[2]/div[2]/div[2]/div').forEach(
      (x, index) => {
        const i = document.createElement('i')
        i.title = '预览'
        i.classList.add('by-icon-eye-grey')
        i.addEventListener('click', () => {
          const url = urls[index]
          if (
            url.endsWith('.doc') ||
            url.endsWith('.docx') ||
            url.endsWith('.ppt') ||
            url.endsWith('.pptx')
          )
            window.open(
              'https://view.officeapps.live.com/op/view.aspx?src=' +
                encodeURIComponent(url)
            )
          else if (url.endsWith('.pdf')) window.open(url)
          else if (onlinePreview !== null)
            window.open(onlinePreview + encodeURIComponent(url))
        })
        x.children[3].remove()
        x.children[2].insertAdjacentElement('afterend', i)
        const i2 = document.createElement('i')
        i2.title = '下载'
        i2.classList.add('by-icon-yundown-grey')
        i2.addEventListener('click', () => {
          downloadFile(urls[index], filenames[index])
        })
        x.children[2].remove()
        x.children[1].insertAdjacentElement('afterend', i2)
      }
    )
  } else if (
    location.href.startsWith(
      'https://ucloud.bupt.edu.cn/uclass/#/student/homePage'
    ) ||
    location.href.startsWith(
      'https://ucloud.bupt.edu.cn/uclass/index.html#/student/homePage'
    )
  ) {
    async function getPage() {
      const pageText = await wait(() =>
        document.querySelector(
          '#layout-container > div.main-content > div.router-container > div > div.teacher-home-page > div.home-left-container.home-inline-block > div.in-progress-section.home-card > div.in-progress-header > div > div:nth-child(2) > div > div.banner-indicator.home-inline-block'
        )
      )
      return parseInt(pageText.innerHTML.trim().split('/')[0])
    }
    const list = glist || (await getUndoneList()).data.undoneList
    let page = 1
    glist = list
    if (list.length > 6) {
      page = await getPage()
      gpage = page
      if (!setClicked) {
        setClicked = true
        async function cmain() {
          await waitChange(getPage, gpage)
          main()
        }
        (
          await wait(() =>
            document.querySelector(
              '#layout-container > div.main-content > div.router-container > div > div.teacher-home-page > div.home-left-container.home-inline-block > div.in-progress-section.home-card > div.in-progress-header > div > div:nth-child(2) > div > div:nth-child(2)'
            )
          )
        ).addEventListener('click', cmain);
        (
          await wait(() =>
            document.querySelector(
              '#layout-container > div.main-content > div.router-container > div > div.teacher-home-page > div.home-left-container.home-inline-block > div.in-progress-section.home-card > div.in-progress-header > div > div:nth-child(2) > div > div:nth-child(3)'
            )
          )
        ).addEventListener('click', cmain)
      }
    }
    const tlist = list.slice((page - 1) * 6, page * 6)
    const ids = tlist.map((x) => x.activityId)
    const infos = await searchCourses(ids)
    const texts = tlist.map(
      (x) => infos[x.activityId].name + '(' + infos[x.activityId].teachers + ')'
    )
    const titles = tlist.map((x) => x.activityName)
    await wait(() => {
      const texts = $x(
        '//*[@id="layout-container"]/div[2]/div[2]/div/div[2]/div[1]/div[3]/div[2]/div/div'
      ).map((x) => x.children[0].innerText)
      return texts.length == titles.length && texts.every((e, i) => e == titles[i])
    })
    const nodes = $x(
      '//*[@id="layout-container"]/div[2]/div[2]/div/div[2]/div[1]/div[3]/div[2]/div/div'
    )
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i].children[1].children.length == 0) {
        const p = document.createElement('div')
        const t = document.createTextNode(texts[i])
        p.appendChild(t)
        nodes[i].children[1].insertAdjacentElement('afterbegin', p)
      } else {
        nodes[i].children[1].children[0].innerHTML = texts[i]
      }
    }
  } else if (
    location.href.startsWith(
      'https://ucloud.bupt.edu.cn/uclass/course.html#/student/courseHomePage'
    )
  ) {
    const site = JSON.parse(localStorage.getItem('site'))
    const id = site.id
    const resources = await getSiteResource(id)
    $x('//div[@class="resource-item"]/div[@class="right"]').forEach(
      (x, index) => {
        const i = document.createElement('i')
        i.title = '下载'
        i.classList.add('by-icon-download')
        i.classList.add('btn-icon')
        i.classList.add('visible')
        i.setAttribute(
          Array.from(x.attributes).filter((x) =>
            x.localName.startsWith('data-v')
          )[0].localName,
          ''
        )
        i.addEventListener(
          'click',
          async (e) => {
            e.stopPropagation()
            downloadFile(
              await getPreviewURL(resources[index].id),
              resources[index].name
            )
          },
          false
        )
        if (x.children.length) x.children[0].remove()
        x.insertAdjacentElement('afterbegin', i)
      }
    )
    const downloadAllButton = `<div style="display: flex;flex-direction: row;justify-content: end;margin-right: 24px;margin-top: 20px;">
<button type="button" class="el-button submit-btn el-button--primary" id="downloadAllButton">
下载全部
</button>
</div>`
    const resourceList = $x('/html/body/div/div/div[2]/div[2]/div/div/div')
    const containerElement = document.createElement('div')
    containerElement.innerHTML = downloadAllButton
    resourceList[0].before(containerElement)
    document.getElementById('downloadAllButton').onclick = async () => {
      downloading = !downloading
      if (downloading) {
        document.getElementById('downloadAllButton').innerHTML = '取消下载'
        for (const file of resources) {
          if (!downloading) return
          await downloadFile(await getPreviewURL(file.id), file.name)
        }
      } else {
        document.getElementById('downloadAllButton').innerHTML = '下载全部'
      }
    }
  }
}
(function () {
  loadCss()
  jsp = loadJs('https://unpkg.com/nprogress@0.2.0/nprogress.js')
  if (location.href.startsWith('https://ucloud.bupt.edu.cn/office/')) {
    const url = new URLSearchParams(location.search).get('furl')
    const filename =
      new URLSearchParams(location.search).get('fullfilename') || url
    const viewURL = new URL(url)
    if (new URLSearchParams(location.search).get('oauthKey')) {
      const viewURLsearch = new URLSearchParams(viewURL.search)
      viewURLsearch.set(
        'oauthKey',
        new URLSearchParams(location.search).get('oauthKey')
      )
      viewURL.search = viewURLsearch.toString()
    }
    if (
      filename.endsWith('.doc') ||
      filename.endsWith('.docx') ||
      filename.endsWith('.ppt') ||
      filename.endsWith('.pptx')
    )
      location.href =
        'https://view.officeapps.live.com/op/view.aspx?src=' +
        encodeURIComponent(viewURL.toString())
    else if (filename.endsWith('.pdf')) location.href = viewURL.toString()
    return
  }
  main()
  let hash = location.hash
  setInterval(() => {
    if (location.hash != hash) {
      hash = location.hash
      main()
    }
  }, 50)
})()
