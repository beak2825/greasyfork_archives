// ==UserScript==
// @name         javlibrary_self
// @version      0.0.25
// @match        https://*/*
// @match        http://*/*
// @description  perview video and links
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/users/164996a
// @downloadURL https://update.greasyfork.org/scripts/395050/javlibrary_self.user.js
// @updateURL https://update.greasyfork.org/scripts/395050/javlibrary_self.meta.js
// ==/UserScript==
// insert position, no need to wait
const $position = document.querySelector('#video_favorite_edit')
if (!$position) return

// change to avoid robot test .jp .sg
const google_domain = 'https://www.google.com'
// GM_xmlhttpRequest promise wrapper
const gmFetch = url =>
  new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      url: url,
      method: 'GET',
      onload: resolve,
      onerror: reject
    })
  })
const parseHTML = str => {
  const tmp = document.implementation.createHTMLDocument()
  tmp.body.innerHTML = str
  return tmp
}
const avid = document.title.replace(/([^-]+)-([^ ]+) .*/, '$1-$2')
const preview = async () => {
  const srcs = src =>
    ['dmb', 'dm', 'sm']
      .map(i => src.replace(/_(dmb|dm|sm)_/, `_${i}_`))
      .map(i => `<source src=${i}></source>`)
      .join('')

  const r18 = async () => {
    const res = await gmFetch(
      `https://www.r18.com/common/search/order=match/searchword=${avid}`
    )
    const video_tag = parseHTML(res.responseText).querySelector('.js-view-sample')
    const src = ['high', 'med', 'low']
      .map(i => video_tag.getAttribute('data-video-' + i))
      .find(i => i)
    console.log('r18', src)
    return src
  }
  // google + erovi, most accuracy, not contain latest
  const google = async () => {
    // lucky search fail https://www.google.com/search?btnI=1&q=DAZD-086 site:https://erovi.jp
    const res = await gmFetch(
      `${google_domain}/search?num=1&q=allintitle:${avid} site:https://erovi.jp&safe=images&pws=0&lr=lang_ja`
    )
    const dom = parseHTML(res.responseText)
    if (dom.querySelector('#topstuff > div')) return
    const url = dom.querySelector('.g .r a').href
    const res2 = await gmFetch(url)
    const src = parseHTML(res2.responseText).querySelector('video').src
    console.log('google', src)
    return src
  }
  // erovi, contain latest, not support relevance order
  const erovi = async () => {
    const res = await gmFetch(`https://erovi.jp/list/dv_search-${avid}.html`)
    const dom = parseHTML(res.responseText)
    if (dom.querySelectorAll('a.listlnk').length !== 1) return
    const url = dom.querySelector('a.listlnk').getAttribute('href')
    const res2 = await gmFetch('https://erovi.jp' + url)
    const src = parseHTML(res2.responseText).querySelector('video').src
    console.log('erovi', src)
    return src
  }
  let src
  try {
    // src = srcs((await erovi()) || (await google()))
    src = srcs(await r18())
  } catch (_) {}
  const html = src
    ? `<video id=jav_preview style='postiton:absolute;z-order:1' controls autoplay>${src}</video>`
    : '<div id=jav_preview class=header style="text-align:center;padding-top:1rem;">preview not found</div>'
  $position.insertAdjacentHTML('afterend', html)
}
preview()
// google
const num = 6
const baseUrl = `${google_domain}/search?tbm=vid&num=${num}&safe=images&pws=0&lr=lang_en\
&as_eq=youtube.com+javlibrary.com+pron.tv&q=`
const fetchList = async () => {
  const res = await gmFetch(baseUrl + avid)
  const doc = parseHTML(res.responseText)
  const url = [...doc.querySelectorAll('.g .r a')].map(i => i.href)
  url.forEach(src => {
    requestAnimationFrame(() => {
      ;(document.getElementById('jav_preview') || $position).insertAdjacentHTML(
        'afterend',
        `<div style='display:flex'>
			<a href='${src}' target='_blank' style='display:block;width:41em;text-overflow:ellipsis;overflow: hidden;white-space: nowrap'>${src}</a>
		</div>`
      )
    })
  })
}
// extra search button
$position.insertAdjacentHTML(
  'afterend',
  `<button id=jav_perview_extra class=smallbutton style=\
'padding:0.5em;display:block;margin-top:0.5em'>extra search from google</button>`
)
const b = document.querySelector('#jav_perview_extra')
b.addEventListener('click', () => {
  b.style.display = 'none'
  fetchList()
})
//fetchList()