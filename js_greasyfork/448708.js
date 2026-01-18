// ==UserScript==
// @name         動畫瘋資訊+
// @description  在動畫瘋中自動擷取動畫常見相關資訊，如CAST以及主題曲。
// @namespace    nathan60107
// @author       nathan60107(貝果)
// @version      1.2
// @homepage     https://home.gamer.com.tw/creationCategory.php?owner=nathan60107&c=425332
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @icon         https://ani.gamer.com.tw/apple-touch-icon-144.jpg
// @require      https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @connect      google.com
// @connect      www.allcinema.net
// @connect      cal.syoboi.jp
// @connect      acg.gamer.com.tw
// @connect      ja.wikipedia.org
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/448708/%E5%8B%95%E7%95%AB%E7%98%8B%E8%B3%87%E8%A8%8A%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/448708/%E5%8B%95%E7%95%AB%E7%98%8B%E8%B3%87%E8%A8%8A%2B.meta.js
// ==/UserScript==

//---------------------External libarary---------------------//
/**
 *
 * detectIncognito v1.1.0 - (c) 2022 Joe Rutkowski <Joe@dreggle.com> (https://github.com/Joe12387/detectIncognito)
 *
 **/
var detectIncognito = function () { return new Promise(function (t, o) { var e, n = "Unknown"; function r(e) { t({ isPrivate: e, browserName: n }) } function i(e) { return e === eval.toString().length } function a() { (void 0 !== navigator.maxTouchPoints ? function () { try { window.indexedDB.open("test", 1).onupgradeneeded = function (e) { var t = e.target.result; try { t.createObjectStore("test", { autoIncrement: !0 }).put(new Blob), r(!1) } catch (e) { /BlobURLs are not yet supported/.test(e.message) ? r(!0) : r(!1) } } } catch (e) { r(!1) } } : function () { var e = window.openDatabase, t = window.localStorage; try { e(null, null, null, null) } catch (e) { return r(!0), 0 } try { t.setItem("test", "1"), t.removeItem("test") } catch (e) { return r(!0), 0 } r(!1) })() } function c() { navigator.webkitTemporaryStorage.queryUsageAndQuota(function (e, t) { r(t < (void 0 !== (t = window).performance && void 0 !== t.performance.memory && void 0 !== t.performance.memory.jsHeapSizeLimit ? performance.memory.jsHeapSizeLimit : 1073741824)) }, function (e) { o(new Error("detectIncognito somehow failed to query storage quota: " + e.message)) }) } function d() { void 0 !== Promise && void 0 !== Promise.allSettled ? c() : (0, window.webkitRequestFileSystem)(0, 1, function () { r(!1) }, function () { r(!0) }) } void 0 !== (e = navigator.vendor) && 0 === e.indexOf("Apple") && i(37) ? (n = "Safari", a()) : void 0 !== (e = navigator.vendor) && 0 === e.indexOf("Google") && i(33) ? (e = navigator.userAgent, n = e.match(/Chrome/) ? void 0 !== navigator.brave ? "Brave" : e.match(/Edg/) ? "Edge" : e.match(/OPR/) ? "Opera" : "Chrome" : "Chromium", d()) : void 0 !== document.documentElement && void 0 !== document.documentElement.style.MozAppearance && i(37) ? (n = "Firefox", r(void 0 === navigator.serviceWorker)) : void 0 !== navigator.msSaveBlob && i(39) ? (n = "Internet Explorer", r(void 0 === window.indexedDB)) : o(new Error("detectIncognito cannot determine the browser")) }) };
//---------------------External libarary---------------------//

let $ = jQuery
let dd = (...d) => {
  d.forEach((it) => { console.log(it) })
}

/**
 * @param { string } pattern 
 */
function regexEscape(pattern) {
  return pattern.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
}

/**
 * @returns { Promise<boolean> }
 */
async function isPrivateFF() {
  return new Promise((resolve) => {
    detectIncognito().then((result) => {
      if (result.browserName === 'Firefox' && result.isPrivate) return resolve(true)
      return resolve(false)
    });
  })
}

/**
 * @param { string } title 
 */
function titleProcess(title) {
  if (!title) return '';
  return title.replaceAll('-', '\\-').replaceAll('#', '')
}

/**
 * @param { string } time 
 */
function timeProcess(time) {
  if (!time || time === '不明') return null
  let match = time.match(/([0-9]{4})-([0-9]{2})-([0-9]{2})/)
  if (!match) return null;
  let [, year, month] = match
  return [
    `${year}-${parseInt(month) - 1}～`,
    `${year}-${parseInt(month)}～`,
    `${year}-${parseInt(month) + 1}～`,
  ]
}

function extractYearMonth(time) {
  if (!time || time === '不明') return null;
  let match = time.match(/([0-9]{4})-([0-9]{2})/);
  if (!match) return null;
  let [, year, month] = match;
  return `${year}-${month}`;
}

async function getBahaData() {
  let bahaDbUrl = $('a:contains(作品資料)')[0].href
  let bahaHtml = $((await GET(bahaDbUrl)).responseText)
  let nameJp = bahaHtml.find('.ACG-info-container > h2')[0].innerText
  let nameEn = bahaHtml.find('.ACG-info-container > h2')[1].innerText
  let broadcast = bahaHtml.find('.ACG-box1listA > li:contains("播映方式")')[0]?.innerText
  let urlObj = new URL(bahaHtml.find('.ACG-box1listB > li:contains("官方網站") > a')[0]?.href ?? 'https://empty')
  let fullUrl = urlObj.searchParams.get('url')
  let time = bahaHtml.find('.ACG-box1listA > li:contains("當地")')[0]?.innerText?.split('：')[1]

  return {
    nameJp: titleProcess(nameJp),
    nameEn: titleProcess(nameEn),
    site: fullUrl ? new URL(fullUrl).hostname.replace('www.', '') : '',
    fullUrl: fullUrl,
    time: timeProcess(time),
    onAirMonth: extractYearMonth(time),
    broadcast: broadcast,
  }
}

/**
 * @param { string } url 
 * @returns { Tampermonkey.Response<string> }
 */
async function GET(url) {
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      /** @param { Tampermonkey.Response<string> } response */
      onload: (response) => {
        resolve(response)
      },
      onerror: (response) => { reject(response) },
    })
  })
}

/**
 * @param { string } url 
 * @param { Record<string, unknown> } payload 
 * @param { Tampermonkey.RequestHeaders } headers 
 * @returns { Tampermonkey.Response<string> }
 */
async function POST(url, payload, headers = {}) {
  let data = new URLSearchParams(payload).toString()
  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      method: "POST",
      url: url,
      data: data,
      headers: headers,
      /** @param { Tampermonkey.Response<string> } response */
      onload: (response) => {
        resolve(response)
      },
      onerror: (response) => {
        reject(response)
      },
    })
  })
}

function getJson(str) {
  try {
    return JSON.parse(str)
  } catch {
    return {}
  }
}

/**
 * @param { 'syoboi' | 'allcinema' } type 
 * @param { string } keyword 
 * @returns { Promise<string> }
 */
async function google(type, keyword) {
  if (keyword === '') return ''

  let site = ''
  let match = ''
  let fullQuery = '';
  switch (type) {
    case 'syoboi':
      site = 'https://cal.syoboi.jp/tid'
      match = 'https://cal.syoboi.jp/tid'
      fullQuery = `intitle:${keyword} intext:${bahaData.onAirMonth}`;
      break
    case 'allcinema':
      site = 'https://www.allcinema.net/cinema/'
      match = /https:\/\/www\.allcinema\.net\/cinema\/([0-9]{1,7})/
      fullQuery = `intitle:${keyword}`;
      break
  }
  
  let googleUrlObj = new URL('https://www.google.com/search?as_qdr=all&as_occt=any')
  googleUrlObj.searchParams.append('as_q', fullQuery)
  googleUrlObj.searchParams.append('as_sitesearch', site)
  let googleUrl = googleUrlObj.toString()

  let googleHtml = (await GET(googleUrl)).responseText
  if (googleHtml.includes('為何顯示此頁')) throw { type: 'google', url: googleUrl }
  let googleResult = $($.parseHTML(googleHtml)).find('#res span a')
  for (let goo of googleResult) {
    let link = goo.href.replace('http://', 'https://')
    if (link.match(match)) return link
  }
  return ''
}

/**
 * @returns { Promise<string> }
 */
async function searchSyoboi() {
  let { site, time, fullUrl } = bahaData
  if (!site || !time) return ''

  let exceptionSite = [
    'tv-tokyo.co.jp',
    'tbs.co.jp',
    'sunrise-inc.co.jp'
  ]
  if (exceptionSite.includes(site)) {
    // https://stackoverflow.com/a/33305263
    let exSiteList = exceptionSite.reduce((acc, cur) => {
      return acc.concat([regexEscape(`${cur}/anime/`), regexEscape(`${cur}/`)])
    }, [])

    for (const ex of exSiteList) {
      let regexResult = fullUrl.match(new RegExp(`(${ex}[^\/]+)`))?.[1]
      if (regexResult) {
        site = regexResult
        break
      }
    }
  }

  let searchUrlObj = new URL('https://cal.syoboi.jp/find?sd=0&ch=&st=&cm=&r=0&rd=&v=0')
  searchUrlObj.searchParams.append('kw', site)
  let searchUrl = searchUrlObj.toString()

  let syoboiHtml = (await GET(searchUrl)).responseText
  let syoboiResults = $($.parseHTML(syoboiHtml)).find('.tframe td')
  for (let result of syoboiResults) {
    let resultTimeEl = $(result).find('.findComment')[0]
    if (!resultTimeEl) continue
    let resultTime = resultTimeEl.innerText

    if (time.some(t => resultTime.includes(t))) {
      let resultUrl = $(result).find('a').attr('href')
      return `https://cal.syoboi.jp${resultUrl}`
    }
  }
  return ''
}

/**
 * @param { string } type 
 */
function songType(type) {
  type = type.toLowerCase().replace('section ', '')
  switch (type) {
    case 'op':
      return 'OP'
    case 'ed':
      return 'ED'
    case 'st':
    case '挿入歌':
      return '插入曲'
    default:
      return '主題曲'
  }
}

/**
 * @typedef AniResponse
 * @property { string } source
 * @property { string } title
 * @property { Record<'char' | 'cv', string> } cast
 * @property { Record<'type' | 'title' | 'singer', string> } song
*/
/**
 * @param { string } allcinemaUrl
 * @returns { Promise<AniResponse | null> }
 */
async function getAllcinema(allcinemaUrl) {
  if (!allcinemaUrl) return null

  let allcinemaIdMatch = allcinemaUrl.match(/https:\/\/www\.allcinema\.net\/cinema\/([0-9]{1,7})/)
  if (!allcinemaIdMatch) return null;
  let allcinemaId = allcinemaIdMatch[1]

  let allcinemaHtml = (await GET(allcinemaUrl))
  let titleMatch = allcinemaHtml.responseText.match(/<title>([^<]*<\/title>)/)
  let title = titleMatch ? titleMatch[1] : 'allcinema.net';

  let allcinemaXsrfToken = allcinemaHtml.responseHeaders.match(/XSRF-TOKEN=([^=]*); expires/)?.[1]
  let allcinemaSession = allcinemaHtml.responseHeaders.match(/allcinema_session=([^=]*); expires/)?.[1]
  let allcinemaCsrfToken = allcinemaHtml.responseText.match(/var csrf_token = '([^']+)';/)?.[1]

  if (!allcinemaXsrfToken || !allcinemaSession || !allcinemaCsrfToken) {
    console.warn('getAllcinema: 無法抓取 CSRF token。');
  }

  let allcinemaHeader = {
    ...(await isPrivateFF()
      ? { 'Cookie': `XSRF-TOKEN=${allcinemaXsrfToken}; allcinema_session=${allcinemaSession}` }
      : {}
    ),
    'X-CSRF-TOKEN': allcinemaCsrfToken,
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
  }

  let cast = []
  let castDataMatch = allcinemaHtml.responseText.match(/"cast":(.*)};/)
  if (castDataMatch && castDataMatch[1]) {
    let castJson = getJson(castDataMatch[1])
    if (castJson.jobs && castJson.jobs[0] && castJson.jobs[0].persons) {
      cast = castJson.jobs[0].persons.map(it => ({
        char: it.castname,
        cv: it.person.personnamemain.personname
      }))
    }
  }

  let song = []
  if (allcinemaHeader['X-CSRF-TOKEN']) {
    try {
      let songData = await POST('https://www.allcinema.net/ajax/cinema', {
        ajax_data: 'moviesounds',
        key: allcinemaId,
        page_limit: 10
      }, allcinemaHeader)
      let songJson = getJson(songData.responseText)
      if (songJson.moviesounds && songJson.moviesounds.sounds) {
        song = songJson.moviesounds.sounds.map(it => {
          return {
            type: songType(it.sound.usetype),
            title: `「${it.sound.soundtitle}」`,
            singer: it.sound.credit.staff.jobs.
              filter(job => job.job.jobname.includes('歌'))
            [0]?.persons[0].person.personnamemain.personname
          }
        })
      }
    } catch (songError) {
      console.warn('getAllcinema: 抓取主題曲失敗', songError);
    }
  }

  return {
    source: allcinemaUrl,
    title, cast, song
  }
}

/**
 * @param { string } syoboiUrl 
 * @returns { Promise<AniResponse & { relatedParts: { title: string, url: string }[] }> }
 */
async function getSyoboi(syoboiUrl) {
  if (!syoboiUrl) return null
  let dom = $($.parseHTML((await GET(syoboiUrl)).responseText));
  let title = dom.find('h1').clone().children().remove().end().text().trim();

  // Process cast
  let cast = []
  let castData = dom.find('.cast table tr')
  for (let role of castData) {
    cast.push({
      char: $(role).find('th').text(),
      cv: $(role).find('td').text()
    })
  }

  // Process song
  let song = []
  let songData = dom.find('.op, .ed, .st, .section:contains("主題歌")') // https://stackoverflow.com/a/42575222
  for (let sd of songData) {
    let titleNode = $(sd).find('.title')[0]?.childNodes[2];
    let songTitle = titleNode ? titleNode.data : $(sd).find('.title').text().trim();
    song.push({
      type: songType(sd.className),
      title: songTitle || 'N/A',
      singer: $(sd).find('th:contains("歌")').parent().children()[1]?.innerText,
    })
  }

  // Process related parts
  const relatedParts = []
  dom.find('div.tidGroup ul.tidList li').each(function () {
    let a = $(this).find('a')
    if (!a.length) return
    let linkTitle = a.text().trim()
    if (!linkTitle.startsWith(title)) return // Find part name start with original title.
    let url = new URL(a.attr('href'), 'https://cal.syoboi.jp/').href
    if (relatedParts.find(p => p.url === url)) return // Prevent duplicate page

    relatedParts.push({ title: linkTitle, url: url })
  })

  return {
    source: syoboiUrl,
    title, cast, song,
    relatedParts: relatedParts.reverse(),
  }
}

/**
 * @param { AniResponse['cast'] } json
 * @returns {{
 *  query: {
 *    pages: Record<number, { pageid: number, title: string, langlinks?: { lang: string, '*': string }[], pageprops?: { disambiguation: string }  }>
 *    normalized: Record<number, { from: string, to: string }>
 *    redirects: Record<number, { from: string, to: string }>
 *  }
 * }}
 */
async function searchWiki(json) {
  let searchWikiUrl = (nameList) => {
    let wikiUrlObj = new URL('https://ja.wikipedia.org/w/api.php')
    const params = {
      action: 'query',
      format: 'json',
      prop: 'langlinks|pageprops',
      titles: nameList,
      redirects: 1,
      lllang: 'zh',
      lllimit: 100,
      ppprop: 'disambiguation'
    }
    for (let [k, v] of Object.entries(params)) {
      wikiUrlObj.searchParams.append(k, v)
    }
    return wikiUrlObj.toString()
  }

  let castList = _.chunk(_.uniq(json.map(j => j.cvName2 ?? j.cv)), 50)
  let result = {
    query: {
      pages: {},
      normalized: [],
      redirects: [],
    }
  }

  for (let cast50 of castList) {
    let nameList = cast50.join('|')
    let wikiApi = searchWikiUrl(nameList)
    let wikiJson = JSON.parse((await GET(wikiApi)).responseText)

    Object.assign(result.query.pages, wikiJson.query.pages)
    result.query.normalized.push(...wikiJson.query.normalized || [])
    result.query.redirects.push(...wikiJson.query.redirects || [])
  }

  return result
}

/**
 * @param { AniResponse['cast'] } json 
 * @returns { string }
 */
async function getCastHtml(json) {
  function replaceEach(array, getFrom = (it) => it.from, getTo = (it) => it.to) {
    array?.forEach((it) => {
      json.forEach((j, index) => {
        if (j.cv === getFrom(it) || j.cvName2 === getFrom(it)) {
          json[index].cvName2 = getTo(it)
        }
      })
    })
  }

  if (!json || json.length === 0) return '';
  let castJson = _.cloneDeep(json)
  
  let wikiJson = await searchWiki(castJson)
  let disamb = _.filter(wikiJson.query.pages, ['pageprops', { disambiguation: '' }])
  let normalized = wikiJson.query.normalized
  let redirects = wikiJson.query.redirects

  // Deal with wiki page normalized, redirects and disambiguation.
  replaceEach(normalized)
  replaceEach(redirects)
  if (disamb.length) {
    replaceEach(disamb, (it) => it.title, (it) => `${it.title} (声優)`)

    wikiJson = await searchWiki(castJson)
    redirects = wikiJson.query.redirects
    replaceEach(redirects)
  }

  return castJson.map(j => {
    let wikiPage = _.filter(wikiJson.query.pages, page =>
      page.title === j.cv || page.title === j.cvName2
    )[0]
    let zhName = wikiPage?.langlinks?.[0]['*']
    let wikiUrl = zhName ? `https://zh.wikipedia.org/zh-tw/${zhName}` : `https://ja.wikipedia.org/wiki/${j.cvName2 ?? j.cv}`
    let wikiText = zhName ? 'Wiki' : 'WikiJP'

    return `
      <div>${j.char ?? ''}</div>
      <div>${j.cv}</div>
      ${(wikiPage?.missing === '' || !wikiPage)
        ? '<div></div>'
        : `<a href="${wikiUrl}" target="_blank">🔗${wikiText}</a>`}
  `}).join('')
}

/**
 * @param { AniResponse['song'] } json 
 * @returns { string }
 */
function getSongHtml(json) {
  if (!json || json.length === 0) return '';
  return json.map(j => `
    <div>${j.type}${j.title}</div>
    <div>${j.singer ?? '-'}</div>
    <a href="https://www.youtube.com/results?search_query=${j.title.slice(1, j.title.length - 1)} ${j.singer ?? ''}" target="_blank">
      🔎Youtube
    </a>
  `).join('')
}

/**
 * @returns { string }
 */
function getCss() {
  return `
    /* Old baha CSS */
    .data_type {
      width: 100%;
      margin-left: 12px;
      padding: 12px 0;
    }
    .data_type li {
      float: left;
      margin-right: 24px;
      margin-bottom: 8px;
      font-size: 1.4em;
      color: var(--text-default-color);
    }
    .data_type span {
      display: inline-block;
      font-size: 0.8em;
      padding: 6px;
      margin-right: 10px;
      color: var(--text-default-color);
      background: var(--btn-more);
      border-radius: 4px;
      text-align: center;
    }

    /* CSS for anigamerinfo+ content */
    #ani-info .ani-tab-pane {
      display: none; /* Default hidden */
      animation: fadeIn 0.3s;
    }
    #ani-info .ani-tab-pane.active {
      display: flex; /* Show active */
      flex-direction: column;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    #ani-info .grid {
      display: grid;
      gap: 10px;
      margin-top: 10px
    }
    #ani-info a {
      color: rgb(51, 145, 255)
    }
    #ani-info .bluebtn {
      font-size: 13px;
    }
    #ani-info .grid.cast {
      grid-template-columns: repeat(3, auto);
    }
    #ani-info .grid.song {
      grid-template-columns: repeat(3, auto);
    }
    
    /* CSS for anigamerinfo+ tabs */
    #ani-info .ani-info-tabs {
      display: flex;
      flex-wrap: wrap;
      border-bottom: 2px solid var(--btn-more);
      margin-bottom: 10px;
    }
    #ani-info .ani-info-tabs:not(:has(:nth-child(2))) {
      display: none; /* Hide the parent container if there is only one tab  */
    }
    #ani-info .ani-tab-btn {
      padding: 8px 12px;
      cursor: pointer;
      background: none;
      border: none;
      color: var(--text-secondary-color);
      font-size: 1.1em;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
    }
    #ani-info .ani-tab-btn:hover {
      background: var(--btn-more);
      color: var(--text-default-color);
    }
    #ani-info .ani-tab-btn.active {
      color: var(--text-default-color);
      border-bottom: 3px solid rgb(51, 145, 255);
    }
    
    /* CSS for anigamer */
    .is-hint {
      display: none;
    }
    .ani-tabs {
      overflow: scroll;
      /* IE and Edge */
      -ms-overflow-style: none !important;
      /* Firefox */
      scrollbar-width: none !important;
    }
    .ani-tabs::-webkit-scrollbar {
      /* Chrome and Safari */
      display: none !important;
    }
    .ani-tabs__item {
      flex-shrink: 0;
    }
    .tool-bar-mask {
      background-image: none !important;
    }
  `
}

/**
 * 渲染分頁內容
 * @param {jQuery} paneElement - 要填入內容的 pane div
 * @param {AniResponse} data - 該分頁的 result data
 */
async function renderPaneContent(paneElement, data) {
  if (paneElement.data('loaded')) return; // 防止重複載入

  let castHtml = (data.cast && data.cast.length > 0) ? await getCastHtml(data.cast) : ''
  let songHtml = (data.song && data.song.length > 0) ? getSongHtml(data.song) : ''

  let finalHtml = ''

  if (castHtml) finalHtml += `
    <ul class="data_type">
      <li>
        <span>CAST</span>
        <div class="grid cast">${castHtml}</div>
      </li>
    </ul>
  `
  else finalHtml += '<ul class="data_type"><li><span>CAST</span>(無資料)</li></ul>'

  if (songHtml) finalHtml += `
    <ul class="data_type">
      <li>
        <span>主題曲</span>
        <div class="grid song">${songHtml}</div>
      </li>
    </ul>
  `
  else finalHtml += '<ul class="data_type"><li><span>主題曲</span>(無資料)</li></ul>'

  finalHtml += `
    <ul class="data_type">
      <li>
        <span>aniInfo+</span>
        資料來源：<a href="${data.source}" target="_blank">${data.title}</a>
      </li>
    </ul>
  `

  paneElement.html(finalHtml)
  paneElement.data('loaded', true)
}


/**
 * @overload
 * @param { 'init' | 'btn' | 'syoboi' | 'allcinema' | 'debug' } state
 * @return { Promise<void> }
 * @overload
 * @param { 'google' } state
 * @param { { url: string } } params
 * @return { Promise<void> }
 * @overload
 * @param { 'fail' } state
 * @param { { error: Error | string } } params
 * @return { Promise<void> }
 * @overload
 * @param { 'result' } state
 * @param { AniResponse[] } params
 * @return { Promise<void> }
 */
async function changeState(state, params) {
  switch (state) {
    case 'init':
      $('.anime-option').append(`
        <style type='text/css'>${getCss()}</style>
        <div id="ani-info">
          <ul class="data_type">
            <li>
              <span>aniInfo+</span>
              <i id="ani-info-msg">歡迎使用動畫瘋資訊+</i>
            </li>
          </ul>
        </div>
      `)
      break
    case 'btn':
      $('#ani-info-msg').html(`
        <div id="ani-info-main" class="bluebtn" onclick="aniInfoMain()">
          讀取動畫資訊
        </div>
      `)
      $('#ani-info-main')[0].addEventListener("click", main, {
        once: true
      });
      break
    case 'google':
      $('#ani-info-msg').html(`Google搜尋失敗，請點擊<a href="${params.url}" target="_blank">連結</a>解除reCAPTCHA後重整此網頁。`)
      break
    case 'syoboi':
      $('#ani-info-msg').html(`嘗試取得 syoboi 資料中...`)
      break
    case 'allcinema':
      $('#ani-info-msg').html(`(Syoboi 失敗) 嘗試取得 allcinema 資料中...`)
      break
    case 'fail':
      $('#ani-info-msg').html(`無法取得資料 ${params.error}`)
      break
    case 'result': {
      $('#ani-info').html('<div class="ani-info-tabs"></div><div class="ani-info-content"></div>');
      let tabContainer = $('#ani-info .ani-info-tabs');
      let contentContainer = $('#ani-info .ani-info-content');

      for (let i = 0; i < params.length; i++) {
        let result = params[i];

        // 抓取 tab 標題
        let tabTitle = result.title || `Part ${i + 1}`
        tabContainer.append(`<button class="ani-tab-btn" data-tab-id="ani-part-${i}" data-title-key="${tabTitle}">${tabTitle}</button>`);

        // 建立分頁內容
        contentContainer.append(`<div class="ani-tab-pane" id="ani-part-${i}"></div>`);
        let pane = $(contentContainer.find(`#ani-part-${i}`));

        if (result) {
          // 資料有效
          pane.html('<i>點擊分頁標籤以載入資料...</i>');
        } else {
          // 該 Part 抓取失敗
          pane.html(`<ul class="data_type"><li><span>錯誤</span>抓取「${tabTitle}」的資料失敗。 ${result.error || ''}</li></ul>`);
          pane.data('loaded', true);
        }
      }

      // 綁定點擊事件
      tabContainer.find('.ani-tab-btn').on('click', function () {
        let tabId = $(this).data('tab-id');

        tabContainer.find('.ani-tab-btn').removeClass('active');
        $(this).addClass('active');

        contentContainer.find('.ani-tab-pane').removeClass('active');
        let targetPane = contentContainer.find(`#${tabId}`);
        targetPane.addClass('active');

        // 尋找對應的資料
        let titleKey = $(this).data('title-key');
        let resultData = params.find(r => r.title === titleKey);

        if (resultData && !targetPane.data('loaded')) {
          targetPane.html('<i><span class="loading"></span> 載入資料中...</i>');
          renderPaneContent(targetPane, resultData);
        }
      });

      // 自動點擊第一個分頁
      tabContainer.find('.ani-tab-btn').first().click();

      break;
    }
    case 'debug': {
      const aaa = await getSyoboi(await searchSyoboi())
      const bbb = await getSyoboi(await google('syoboi', bahaData.nameJp))
      const ccc = await getAllcinema(await google('allcinema', bahaData.nameJp))
      const ddd = await getAllcinema(await google('allcinema', bahaData.nameEn))
      $('#ani-info').html('')
      $('#ani-info').append(`
        <ul class="data_type">
          <li>
            <span>aniInfo+</span>
            <br>
            syoboi：<a href="${aaa?.source}" target="_blank">${aaa?.title}</a>
            <br>
            allcinema(jp)：<a href="${ccc?.source}" target="_blank">${ccc?.title}</a>
            <br>
            allcinema(en)：<a href="${ddd?.source}" target="_blank">${ddd?.title}</a>
            <br>
            syoboi(google)：<a href="${bbb?.source}" target="_blank">${bbb?.title}</a>
            <br>
          </li>
        </ul>
      `)
      break
    }
  }
}

async function main() {
  let debug = false
  try {
    if (debug) {
      changeState('debug')
      return
    }

    // 嘗試抓取 Syoboi
    changeState('syoboi')
    let initialResult
    if (bahaData.broadcast && !bahaData.broadcast.includes('OVA')){
      initialResult = await getSyoboi(await searchSyoboi());
      const animeName = bahaData.nameJp ? bahaData.nameJp : bahaData.nameEn
      if (!initialResult && animeName) {
        initialResult = await getSyoboi(await google('syoboi', animeName));
      }
    }

    if (initialResult) {
      // --- Syoboi 成功路徑 ---
      const allResults = [];
      allResults.push(initialResult);
      for (const part of initialResult.relatedParts) {
        let partData = await getSyoboi(part.url);
        allResults.push(partData);
      }
      changeState('result', allResults);
    } else {
      // --- Fallback 路徑 (allCinema) ---
      changeState('allcinema')
      
      let result = await getAllcinema(await google('allcinema', bahaData.nameJp));
      if (!result) {
        result = await getAllcinema(await google('allcinema', bahaData.nameEn));
      }

      if (result) {
        changeState('result', [result])
      } else {
        changeState('fail', { error: 'Syoboi 和 allcinema 均查無資料' });
      }
    }

  } catch (e) {
    if (e.type === 'google') {
      changeState('google', { url: e.url })
    } else {
      console.error('Main error:', e);
      changeState('fail', { error: e.message || e })
    }
  }
}

(async function () {
  globalThis.bahaData = await getBahaData()
  changeState('init')

  // Set user option default value.
  if (GM_getValue('auto') == undefined) { GM_setValue('auto', true); }

  // Set user option menu in Tampermonkey.
  let isAuto = GM_getValue('auto');
  GM_registerMenuCommand(`設定為${isAuto ? '手動' : '自動'}執行`, () => {
    GM_setValue('auto', !GM_getValue('auto'));
    location.reload();
  });

  // Do task or set button to wait for click and do task.
  if (isAuto) main()
  else changeState('btn')
})();

/**
 * Reference:
 * [Write userscript in VSC](https://stackoverflow.com/a/55568568)
 * [Same above but video](https://www.youtube.com/watch?v=7bWwkTWJy40)
 * [Detect browser private mode](https://stackoverflow.com/a/69678895/13069889)
 * [and its cdn](https://cdn.jsdelivr.net/gh/Joe12387/detectIncognito@main/detectIncognito.min.js)
 * [FF observe GM request](https://firefox-source-docs.mozilla.org/devtools-user/browser_toolbox/index.html)
 * [Wiki API](https://ja.wikipedia.org/wiki/%E7%89%B9%E5%88%A5:ApiSandbox#action=query&format=json&prop=langlinks%7Cpageprops&titles=%E6%A2%B6%E5%8E%9F%E5%B2%B3%E4%BA%BA%7C%E5%B0%8F%E6%9E%97%E8%A3%95%E4%BB%8B%7C%E4%B8%AD%E4%BA%95%E5%92%8C%E5%93%89%7CM%E3%83%BBA%E3%83%BBO%7C%E9%88%B4%E6%9D%91%E5%81%A5%E4%B8%80%7C%E4%B8%8A%E6%A2%9D%E6%B2%99%E6%81%B5%E5%AD%90%7C%E6%A5%A0%E5%A4%A7%E5%85%B8%7C%E8%88%88%E6%B4%A5%E5%92%8C%E5%B9%B8%7C%E6%97%A5%E9%87%8E%E8%81%A1%7C%E9%96%A2%E6%99%BA%E4%B8%80%7C%E6%82%A0%E6%9C%A8%E7%A2%A7%7C%E5%89%8D%E9%87%8E%E6%99%BA%E6%98%AD&redirects=1&lllang=zh&lllimit=100&ppprop=disambiguation)
 * [Always use en/decodeURIComponent](https://stackoverflow.com/a/747845)
 */