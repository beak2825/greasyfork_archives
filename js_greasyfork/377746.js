// ==UserScript==
// @name         sehuatang
// @version      0.0.12
// @author       bilabila
// @namespace    https://greasyfork.org/users/164996a
// @match        https://www.sehuatang.org/404
// @match        https://sehuatang.org/404
// @description  self mode
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      www.sehuatang.org
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/377746/sehuatang.user.js
// @updateURL https://update.greasyfork.org/scripts/377746/sehuatang.meta.js
// ==/UserScript==
const tags = {
  fellatiojapan: ['亚洲无码原创', 'fellatiojapan'],
  handjobjapan: ['亚洲无码原创', 'handjobjapan'],
  uralesbian: ['亚洲无码原创', 'uralesbian'],
  spermmania: ['亚洲无码原创', 'spermmania'],
  legsjapan: ['亚洲无码原创', 'legsjapan'],
  无: ['亚洲无码原创', '全部'],
  有: ['亚洲有码原创', '全部'],
  素: ['素人有码系列', '全部'],
}
const head = `<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta http-equiv="X-UA-Compatible" content="ie=edge" />
<title>sehuatang</title>
<style>
  :root {
    --color1: #444;
    --color2: #bbb;
  }
  body {
    color: var(--color1);
    text-align: center;
    margin: 0;
    box-sizing: border-box;
  }
  img {
    width: 100%;
  }
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
  li {
    color: var(--color1);
    margin: 0 6% 3em;
    padding: 0;
  }
  a {
    text-decoration: none;
  }
  .title {
    display: flex;
    justify-content: space-between;
    background-color: white;
  }
  #tag {
    margin: 1em 0;
  }
  #tag > span {
    display: inline-block;
    padding: 0.2em 0.8em;
    color: var(--color1);
    cursor: pointer;
    user-select: none;
  }
  #tag > span.disable {
    color: var(--color2);
  }
  #clear {
    position: absolute;
    top: 1em;
    right: 1em;
    padding: 0.2em;
    cursor: pointer;
    user-select: none;
    color: var(--color2);
  }
  #clear:hover {
    color: var(--color1)
  }
</style>`
const body = `<div id=app>
  <span id=clear>☢</span>
  <div id="tag"></div>
  <ul></ul>
</div>`
document.head.innerHTML = head
document.body.innerHTML = body
const ul = document.querySelector('ul')
Array.prototype.last = function (i = 1) {
  return this[this.length - i]
}
const gmFetch = (url, method = 'GET') =>
  new Promise((onload, onerror) => {
    GM_xmlhttpRequest({ url, method, onload, onerror, cookie: '_safe=' })
  })
const parseHTML = (str) => {
  const tmp = document.implementation.createHTMLDocument()
  tmp.body.innerHTML = str
  return tmp
}
const cache = async (k, f, ...args) => {
  if (k === undefined) return
  let a = GM_getValue(k)
  if (a) return JSON.parse(a)
  a = await f(...args)
  GM_setValue(k, JSON.stringify(a))
  return a
}
// get one post
const fetchOnePost = async (tid) => {
  const url = `https://www.sehuatang.org/forum.php?mod=viewthread&tid=${tid}`
  let a = await gmFetch(url)
  a = parseHTML(a.responseText)
  let title = a.querySelector('h1'),
    img = a.querySelectorAll('.pcb img'),
    magnet = a.querySelector('.blockcode li'),
    torrent = a.querySelector('.attnm > a')

  title = title ? title.textContent : ''
  const img_bl = [
    'https://cdn.jsdelivr.net/gh/hishis/forum-master/public/images/patch.gif',
  ]
  img = img
    ? [...img]
        .map((i) => i.getAttribute('file'))
        .filter((i) => i && !img_bl.includes(i))
    : []
  magnet = magnet ? magnet.textContent : ''
  torrent = torrent ? torrent.href : ''
  a = { img, magnet, torrent, title }
  return a
}
// get one page
const fetchOnePage = async (fid, typeid, page) => {
  let a = await gmFetch(
    `https://www.sehuatang.org/forum.php?mod=forumdisplay&fid=${fid}` +
      (typeid != '0' ? `&filter=typeid&typeid=${typeid}` : '') +
      `&page=${page}`
  )
  a = parseHTML(a.responseText)
  // check page
  // if (a.querySelector('#fd_page_top strong').textContent != page) return
  a = [
    ...a.querySelectorAll(
      '#threadlisttableid tbody[id^=normalthread_] th a[id^=content_]'
    ),
  ]
  return a.map((i) => parseInt(/content_(\d+)/.exec(i.id)[1]))
}
// get type and id of one fid
const fetchTypeId = async (fid) => {
  let a = await gmFetch(
    `https://www.sehuatang.org/forum.php?mod=forumdisplay&fid=${fid}`
  )
  a = parseHTML(a.responseText)
  a = a.querySelectorAll('#thread_types > li:not([id]) > a')
  a = [...a].filter((i) => i.firstChild)
  const b = { 全部: '0' }
  ;[...a].forEach(
    (i) => (b[i.firstChild.textContent] = /typeid=(\d+)/.exec(i.href)[1])
  )
  return b
}
// get all fid and name
const fetchFidName = async () => {
  const url = `https://www.sehuatang.org/forum.php`
  let a = await gmFetch(url)
  a = parseHTML(a.responseText)
  let ans = {}
  for (let b of a.querySelectorAll('a')) {
    if (b.childElementCount != 0) continue
    let fid = /(fid=|forum-)(\d+)/.exec(b.href)
    if (!fid) continue
    fid = fid[2]
    let name = b.textContent
    ans[name] = fid
  }
  return ans
}
class Bot {
  constructor(fid, typeid) {
    this.num_one_page = Number.MAX_SAFE_INTEGER
    this.key = fid + '_' + typeid
    this.data = JSON.parse(GM_getValue(this.key, '[]'))
    this.fid = fid
    this.typeid = typeid
    this.i1 = 0
  }
  async get(page) {
    return await fetchOnePage(this.fid, this.typeid, page)
  }
  async more(a) {
    if (a.page === -1) return
    const aa = a.arr,
      aal = aa.last(),
      b = await this.get(++a.page)
    if (!b) return (a.page = -1)
    let i = 0
    for (; i < b.length && b[i] >= aal; ++i) {}
    // end support for long time scroll interval
    //if (i === b.length) await this.more(a)
    if (i === b.length) return (a.page = -1)
    for (; i < b.length; ++i) aa.push(b[i])
  }
  merge() {
    const data = this.data
    if (data.length < 2) return
    const p = data.last(2),
      c = data.last(),
      pa = p.arr,
      ca = c.arr,
      cal = ca.last(),
      calen = ca.length
    if (cal > pa[0]) return
    let i = 1
    for (; i < pa.length && pa[i] >= cal; ++i) {}
    for (; i < pa.length; ++i) ca.push(pa[i])
    p.arr = ca
    if (p.page !== -1)
      p.page = (c.page + (ca.length - calen) / this.num_one_page) >> 0
    data.pop()
  }
  async refresh() {
    const data = this.data
    const p = data.last() && data.last().arr[0]
    data.push({
      arr: undefined,
      page: 0,
    })
    const a = data.last()
    a.arr = await this.get(++a.page)
    this.num_one_page = a.arr.length
    this.merge()
    if (p != data.last().arr[0]) {
      this.save()
      return true
    }
  }
  async next() {
    const data = this.data
    if (data.length === 0) return await this.refresh()
    await this.more(data.last())
    this.merge()
    this.save()
  }
  save() {
    GM_setValue(this.key, JSON.stringify(this.data))
  }
  async nextOne() {
    if (this.data.length === 0) await this.refresh()
    const a = this.data.last().arr
    if (this.i1 < a.length) return a[this.i1++]
    await this.next()
    return a[this.i1++]
  }
}
const li = (a) => {
  const { title, img, magnet, torrent } = a
  return `
    <li>
      ${img.map((i) => `<img src="${i}"/>`).join('')}
      <div class="title">
        <span>${title}</span>
        <span>
          <a href="${magnet}">magnet</a>
          <a href="${torrent}" target="_blank">torrent</a>
        </span>
      </div>
    </li>
  `
}
const addTag = () => {
  let ts = tags
  let t = GM_getValue('tag')
  t = t ? JSON.parse(t) : [Object.keys(ts)[0]]
  const n = document.querySelector('#tag')
  const a = Object.keys(ts)
    .map((i) => `<span ${t.includes(i) ? '' : 'class=disable'}>${i}</span>`)
    .join('')
  requestAnimationFrame(() => (n.innerHTML = a))
  n.addEventListener('click', (e) => {
    e = e.target
    if (e.nodeName != 'SPAN' || !e.classList.contains('disable')) return
    e.classList.add('disable')
    t = [e.textContent]
    GM_setValue('tag', JSON.stringify(t))
    window.location.reload()
  })
  return [t, ts]
}
const main = async () => {
  const [t, ts] = addTag()
  const v = []
  for (let x of t) {
    x = ts[t]
    let fid = await cache('fid', fetchFidName)
    fid = fid[x[0]]
    let typeid = await cache('typeid' + fid, fetchTypeId, fid)
    typeid = typeid[x[1]]
    v.push(new Bot(fid, typeid))
  }
  const q = await Promise.all(v.map(async (i) => await i.nextOne()))
  const next = async () => {
    let m = 0
    for (let i = 1; i < q.length; ++i)
      if (q[i] !== undefined && q[i] > q[m]) m = i
    if (q[m] === undefined) return
    const r = q[m]
    while (r === q[m]) {
      q[m] = await v[m].nextOne()
    }
    return r
  }
  let isEnd = false
  const add = async (a) => {
    if (a === undefined) {
      if (isEnd) return
      isEnd = true
      window.onscroll = null
      ul.insertAdjacentHTML(
        'afterend',
        `<span>total : ${ul.childElementCount}</span>`
      )
      const total = document.querySelector('ul+span')
      new MutationObserver(
        () => (total.innerHTML = `total : ${ul.childElementCount}`)
      ).observe(ul, { childList: true })
      return
    }
    a = await cache(a, fetchOnePost, a)
    if (!a) return
    requestAnimationFrame(() => ul.insertAdjacentHTML('beforeend', li(a)))
  }
  for (let i = 0; i < 3; ++i) await add(await next())
  const a = await Promise.all(v.map(async (i) => await i.refresh()))
  if (a.some((i) => i)) window.location.reload()
  let isFetching = false
  window.onscroll = async () => {
    if (
      !isFetching &&
      10 * window.innerHeight + window.scrollY >= document.body.offsetHeight
    ) {
      isFetching = true
      await add(await next())
      isFetching = false
    }
  }
}
const init = () => {
  for (let i of GM_listValues()) GM_deleteValue(i)
  GM_setValue('version', GM_info.script.version)
  window.location.reload()
}
window.onbeforeunload = () => window.scrollTo(0, 0)
if (GM_getValue('version') != GM_info.script.version) init()
document.querySelector('#clear').onclick = init
main()
