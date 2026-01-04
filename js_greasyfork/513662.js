// ==UserScript==
// @name        chuni-net - Map Details
// @namespace   esterTion
// @license     MIT
// @match       https://chunithm-net-eng.com/mobile/record/
// @match       https://new.chunithm-net.com/mobile/record/
// @match       https://chunithm.wahlap.com/mobile/record/
// @grant       GM.xmlHttpRequest
// @version     1.3.8
// @author      esterTion
// @description Display map details on chunithm-net
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/513662/chuni-net%20-%20Map%20Details.user.js
// @updateURL https://update.greasyfork.org/scripts/513662/chuni-net%20-%20Map%20Details.meta.js
// ==/UserScript==


const host = location.hostname
const server = host === 'new.chunithm-net.com' ? 'jp' : host === 'chunithm-net-eng.com' ? 'ex' : host === 'chunithm.wahlap.com' ? 'cn' : ''
if (!server) throw new Error('unknown server')
const imageBase = server === 'jp' ? '/chuni-mobile/html/mobile/images' : '/mobile/images'

const PAGE_DATA_IS_SHRINKED = server !== 'cn'

// createElement
function _(e,t,i){var a=null;if("text"===e)return document.createTextNode(t);a=document.createElement(e);for(var n in t)if("style"===n)for(var o in t.style)a.style[o]=t.style[o];else if("className"===n)a.className=t[n];else if("event"===n)for(var o in t.event)a.addEventListener(o,t.event[o]);else a.setAttribute(n,t[n]);if(i)if("string"==typeof i)a.innerHTML=i;else if(Array.isArray(i))for(var l=0;l<i.length;l++)null!=i[l]&&a.appendChild(i[l]);return a}
function sleep(t){return new Promise(function(e){setTimeout(e,t)})}

const MAP_AREA_TASK = 'data:image/webp;base64,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'
const MAP_AREA_BOOST = 'data:image/webp;base64,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'
const MAP_AREA_HIDDEN_LOCK = 'data:image/webp;base64,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'

const localStorageTimeKey = 'CNMD_maps_info_time'
const localStorageDataKey = 'CNMD_maps_info'
let mapInfo = []
function loadLocalInfo() {
  if (!localStorage[localStorageDataKey]) return
  mapInfo = JSON.parse(localStorage[localStorageDataKey])
}
function checkUpdateForLocalInfo() {
  const today = getDateStringForUpdate()
  if (!localStorage[localStorageTimeKey] || localStorage[localStorageTimeKey] !== today) {
    downloadInfo(today)
  }
}
async function downloadInfo(today) {
  console.log('downloading map info')
  switch (server) {
    case 'jp': {
      throw new Error('not implemented')
      break;
    }
    case 'ex': {
      await fetchJson('https://estertion.win/__private__/chuni-intl-maps.json').then(r => mapInfo = r)
      break;
    }
    case 'cn': {
      await fetchJson('https://estertion.win/__private__/chuni-chn-maps.json').then(r => mapInfo = r)
      break;
    }
  }
  localStorage[localStorageDataKey] = JSON.stringify(mapInfo)
  localStorage[localStorageTimeKey] = today
  console.log('stored map info: ', Object.keys(mapInfo).length, 'entries')
  addRemainingMaps()
}
function getDateStringForUpdate() {
  const d = new Date
  d.setTime(d.getTime() + d.getTimezoneOffset() * 60e3 + {jp:11,ex:11,cn:10}[server]*3600e3)
  return [d.getUTCFullYear(), d.getUTCMonth()+1, d.getUTCDate()].join('/')
}
function fetchJson(url) {
  return new Promise((res, rej) => {
    GM.xmlHttpRequest({
      url: url + '?_=' + Date.now(),
      responseType: 'json',
      method: 'GET',

      onload: r => res(r.response),
      onerror: e => rej(e),
    })
  })
}

function getHiddenType(type, text = '地图', tag = 'div') {
  if (type === 1) {
    return _(tag, { className: 'hidden_type_desc' }, [_('text', `（达成特定条件才会解锁的${text}）`)])
  }
  if (type === 2) {
    return _(tag, { className: 'hidden_type_desc' }, [_('text', `（达成特定条件才会显示的${text}）`)])
  }
  return new Comment('hidden type')
}

const mapBlockMap = {}
function generatePage(map, page) {
  const mapTitle = map.name
  const isInfinite = mapTitle.indexOf('ep. ∞') !== -1
  const currentPage = page
  const totalPage = isInfinite ? Infinity : map.areas.slice(-1)[0].page + 1
  let allClearedCheckbox
  const mapPage = _('div', { className: 'map_block w400' }, [
    _('div', { className: ['map-paginator', page>1?'has-prev':'', page<totalPage?'has-next':''].join(' ') }, [
      _('span', { className: 'prev', event: { click: _ => { mapPage.parentNode.replaceChild(getPage(mapTitle, page - 1), mapPage); executeMarquee() } } }, [_('text', '＜')]),
      _('span', { className: 'next', event: { click: _ => { mapPage.parentNode.replaceChild(getPage(mapTitle, page + 1), mapPage); executeMarquee() } } }, [_('text', '＞')]),
    ]),
    _('div', { className: 'map_title w388' }, [
      _('div', { className: 'map_title_text text_l text_b' }, [
        _('text', mapTitle),
      ]),
      _('div', { className: 'map_titale_page' }, [
        _('div', { className: 'map_title_page_num font_90' }, [
          _('text', currentPage),
        ]),
        isInfinite
          ? _('div', { className: 'map_title_page_infinit' }, [_('img', { src: `${imageBase}/progress_RewardIconRemainBlock_Infinity.png`})])
          : _('div', { className: 'map_title_page_den font_90' }, [_('text', totalPage),]),
      ]),
    ]),
    _('div', { className: 'maparea_period w388' }, [
      _('label', {}, [
        allClearedCheckbox = _('input', { type: 'checkbox', event: { change: e => {
          storeMapPageProgress(mapTitle, currentPage)
          storeMapPageProgress(mapTitle, currentPage + (e.target.checked?1:-1))
          mapPage.parentNode.replaceChild(getPage(mapTitle, page), mapPage); executeMarquee()
        }}}),
        _('text', '区域全部完成'),
      ]),
      getHiddenType(map.hidden)
    ]),
  ])
  const pageAreas = new Array(9)
  map.areas.forEach(area => {
    if (area.page !== page - 1) return
    pageAreas[area.position] = area
  })
  if (isInfinite && page > 3) {
    const area = map.areas.slice(-1)[0]
    pageAreas[area.position] = area
  }
  let areaCount = 0, areaCleared = 0
  for (let i = 0; i < 9; i++) {
    if (!pageAreas[i]) {
      mapPage.appendChild(_('div', { className: 'maparea_block'}, [
        _('div', {className: 'maparea_blank'})
      ]))
    } else {
      const index = i
      const areaLength = pageAreas[i].rewards.slice(-1)[0].position
      const progress = getMapTileProgress(mapTitle, currentPage, index)
      const isCleared = progress.finished
      const areaLengthText = isCleared ? 0 : (areaLength - progress.position)
      const pageAreasCount = pageAreas.filter(a => a).length
      const tile = mapPage.appendChild(_('div', { className: 'maparea_block user_data_friend_tap', event: { click: () => showMapAreaDetail(mapTitle, currentPage, index, isCleared ? pageAreasCount : 0, areaLengthText) } }, [
        getAreaTile(pageAreas[i], isCleared, areaLengthText, isCleared ? pageAreasCount : 0)
      ]))
      areaCount++
      if (isCleared) areaCleared++
      if (pageAreas[i].task !== '') {
        tile.classList.add('has-task')
      }
      if (pageAreas[i].boost > 1) {
        tile.classList.add('has-boost')
      }
    }
    mapPage.appendChild(_('text', ' '))
  }
  if (areaCleared === areaCount) allClearedCheckbox.checked = true
  return mapPage
}
function getAreaTile(area, isCleared, areaLengthText, clearedCount) {
  let areaText = area.skill
  let showSkillIcon = area.skill !== '-'
  if (areaText === '-' && area.required > clearedCount) {
    areaText = `${clearedCount}/${area.required}`
    showSkillIcon = false
  }
  const tile = _('div', { className: 'maparea' }, [
    isCleared ? _('div', { className: 'map_clear' }, [_('img', { src: `${imageBase}/progress_RewardIconClear.png` })]) : _('text', ''),
    _('div', { className: 'map_icon' }, [
      getRewardIcon(area.rewards.slice(-1)[0])
    ]),
    _('div', { className: 'map_remain' }, [_('div', { className: 'map_remain_text' }, [_('text', areaLengthText)])]),
    _('div', { className: 'map_skillseed_block font_0' }, [
      !showSkillIcon ? new Comment('skill icon') : _('div', { className: 'map_skillseed_img' }, [
        _('img', { src: `${imageBase}/SkillSeed_${area.skillIcon}.png` }),
        _('img', { src: `${imageBase}/SkillSeed_VersionPop_v${area.skillVer}.png` }),
      ]),
      _('div', { className: 'map_skillseed_text' }, [_('span', {}, [_('text', areaText)])])
    ]),
  ])
  if (area.required > clearedCount) {
    tile.appendChild(_('img', { className: 'map_lock_float', src: `${imageBase}/progress_LockCover.png` }))
  } else if (area.hidden !== 0 && !isCleared) {
    tile.appendChild(_('img', { className: 'map_lock_float', src: MAP_AREA_HIDDEN_LOCK }))
  }
  return tile
}
function getRewardIcon(reward) {
  switch (reward.type) {
    case 0: // gamePoint
    case 4: // skillSeed
      return _('div', { className: 'map_icon_limitbreak' }, [_('text', reward.reward)])
    case 2: // trophy
      {
        const [bgImg, trophyName] = getTrophyInfo(reward.reward)
        return _('div', { className: 'map_icon_trophy', style: { backgroundImage: `url(${bgImg})` } }, [
          _('div', { className: 'map_text_trophy text_b' }, [_('div', { className: 'map_honor_text' }, [_('span', {}, [_('text', trophyName)])])])
        ])
      }
    case 1: // ticket
      {
        if (reward.id >= 20008000) {
          return _('div', { className: 'map_icon_limitbreak' }, [getRewardIconImg(reward.id, reward.reward)])
        }
      }
    case 5: // namePlate
    case 8: // systemVoice
      {
        return _('div', { className: 'map_icon_nameplate' }, [getRewardIconImg(reward.id, reward.reward)])
      }
    case 3: // chara
      {
        return _('div', { className: 'map_icon_chara' }, [getRewardIconImg(reward.id, reward.reward)])
      }
    case 6: // music
    case 12: // ultima
      {
        return _('div', { className: 'map_icon_music' }, [getRewardIconImg(reward.id, reward.reward)])
      }
    case 7: // mapIcon
    case 9: // avatarAccessory
      {
        return _('div', { className: 'map_icon_avatar' }, [getRewardIconImg(reward.id, reward.reward)])
      }
    case 13: // stage
      {
        return _('div', { className: 'map_icon_stage' }, [getRewardIconImg(reward.id, reward.reward)])
      }
  }
  return _('div', { className: 'map_icon_limitbreak' }, [_('text', reward.reward)])
}
function getRewardIconImg(id, text) {
  return _('img', { src: `https://estertion.win/__private__/chuni-rewards-${server}/${id}.webp`, event: { error: e => {
    e.target.parentNode.replaceChild(_('text', text), e.target)
  } }})
}
function getTrophyInfo(text) {
  const sepIdx = text.indexOf('|')
  if (sepIdx === -1) return [`${imageBase}/Title_normal.png`, text]
  const trophyType = text.slice(0, sepIdx)
  let trophyName = text.slice(sepIdx + 1)
  let trophyTypeStr = 'normal';
  switch (trophyType) {
    case '0': trophyTypeStr = 'normal'; break
    case '1': trophyTypeStr = 'copper'; break
    case '2': trophyTypeStr = 'silver'; break
    case '3': trophyTypeStr = 'gold'; break
    case '4': trophyTypeStr = 'gold'; break
    case '5': trophyTypeStr = 'platina'; break
    case '6': trophyTypeStr = 'platina'; break
    case '7': trophyTypeStr = 'rainbow'; break
    // case '8': trophyTypeStr = 'rainbow'; break
    case '9': trophyTypeStr = 'staff'; break
    case '10': trophyTypeStr = 'ongeki'; break
    case '11': trophyTypeStr = 'maimai'; break
    default: trophyName = text;
  }
  return [`${imageBase}/Title_${trophyTypeStr}.png`, trophyName]
}

const initialPages = {}
function getPage(mapTitle, page) {
  if (initialPages[mapTitle] && initialPages[mapTitle][page]) {
    return mapBlockMap[mapTitle] = initialPages[mapTitle][page]
  }
  const map = mapInfo.find(m => m.name === mapTitle)
  if (!map) {
    alert(`未找到地图\n${mapTitle}\n第 ${page} 页`)
    throw new Error(`未找到地图\n${mapTitle}\n第 ${page} 页`)
  }
  return mapBlockMap[mapTitle] = generatePage(map, page)
}

function addClickHandler() {
  const mapBlocks = [...document.querySelectorAll('.map_block')]
  mapBlocks.forEach(block => {
    const mapTitle = block.querySelector('.map_title_text').textContent.trim()
    const isInfinite = mapTitle.indexOf('ep. ∞') !== -1
    mapBlockMap[mapTitle] = block
    const map = mapInfo.find(m => m.name === mapTitle)
    const currentPage = block.querySelector('.map_title_page_num').textContent *1
    initialPages[mapTitle] = initialPages[mapTitle] || { [currentPage]: block, currentPage }
    const totalPage = isInfinite ? Infinity : map ? map.areas.slice(-1)[0].page+1 : block.querySelector('.map_title_page_den').textContent *1
    block.insertBefore(_('div', { className: ['map-paginator', currentPage>1?'has-prev':'', currentPage<totalPage?'has-next':''].join(' ') }, [
      _('span', { className: 'prev', event: { click: _ => { block.parentNode.replaceChild(getPage(mapTitle, currentPage - 1), block); executeMarquee() } } }, [_('text', '＜')]),
      _('span', { className: 'next', event: { click: _ => { block.parentNode.replaceChild(getPage(mapTitle, currentPage + 1), block); executeMarquee() } } }, [_('text', '＞')]),
    ]), block.firstChild)
    const tiles = [...block.querySelectorAll('.maparea_block')]
    const cleared = block.getElementsByClassName('map_clear')
    storeMapPageProgress(mapTitle, currentPage, true)
    tiles.forEach((tile, i) => {
      const area = map?.areas.find(a => a.page === currentPage-1 && a.position === i)
      if (!tile.querySelector('.maparea')) {
        if (!area) return
        while (tile.firstChild) tile.removeChild(tile.firstChild)
        tile.appendChild(getAreaTile(area, false, area.rewards.slice(-1)[0].position, cleared.length))
      }
      if (area) {
        if (area.task !== '') {
          tile.classList.add('has-task')
        }
        if (area.boost > 1) {
          tile.classList.add('has-boost')
        }
      }
      const remainingTiles = tile.querySelector('.map_remain_text').textContent *1
      tile.classList.add('user_data_friend_tap')
      tile.addEventListener('click', () => showMapAreaDetail(mapTitle, currentPage, i, cleared.length, remainingTiles))
      storeMapTileProgress(mapTitle, currentPage, i, remainingTiles, tile.querySelector('.map_clear') !== null)
    })
  })
}

const containerProgressing = document.querySelector('.box01').parentNode.appendChild(_('div', { className: 'box01 w420' }, [
  _('div', { className: 'box01_title text_b' }, [_('text', '其他地图 - 进行中')])
]))
const containerNotStarted = document.querySelector('.box01').parentNode.appendChild(_('div', { className: 'box01 w420' }, [
  _('div', { className: 'box01_title text_b' }, [_('text', '其他地图 - 未开始')])
]))
const containerFinished = document.querySelector('.box01').parentNode.appendChild(_('div', { className: 'box01 w420' }, [
  _('div', { className: 'box01_title text_b' }, [_('text', '其他地图 - 已完成')])
]))
function addRemainingMaps() {
  [containerProgressing, containerNotStarted, containerFinished].forEach(c => {
    while (c.children.length > 1) {
      const child = c.children[1]
      const mapTitle = child.querySelector('.map_title_text').textContent
      delete initialPages[mapTitle]
      child.remove()
    }
  });
  mapInfo.forEach(map => {
    const mapTitle = map.name
    if (initialPages[mapTitle]) return
    let showingPage = map.areas.slice(-1)[0].page + 1
    let finishedAreaCount = 0
    let notStartedCount = 0
    map.areas.forEach(area => {
      const progress = getMapTileProgress(mapTitle, area.page + 1, area.position)
      if (progress.position === 0 && !progress.finished) notStartedCount++
      if (!progress.finished) showingPage = Math.min(showingPage, area.page + 1)
      else finishedAreaCount++
    })
    initialPages[mapTitle] = { currentPage: showingPage }
    if (finishedAreaCount === map.areas.length) {
      mapBlockMap[mapTitle] = containerFinished.appendChild(generatePage(map, showingPage))
    } else if (notStartedCount === map.areas.length) {
      mapBlockMap[mapTitle] = containerNotStarted.appendChild(generatePage(map, showingPage))
    } else {
      mapBlockMap[mapTitle] = containerProgressing.appendChild(generatePage(map, showingPage))
    }
  })
  containerProgressing.style.display = containerProgressing.children.length < 2 ? 'none' : ''
  containerNotStarted.style.display = containerNotStarted.children.length < 2 ? 'none' : ''
  containerFinished.style.display = containerFinished.children.length < 2 ? 'none' : ''
}

function addGlobalStyle() {
  document.head.appendChild(_('style', {}, [_('text', [
    'html.showing-detail{overflow:hidden}',
    '.map-detail-background{',
    '	position:fixed;',
    '	top:0;',
    '	left:0;',
    '	width:100%;',
    '	height:100%;',
    '	background-color:rgba(0,0,0,0.5);',
    '}',
    '@supports (backdrop-filter: none) {',
    '	.map-detail-background{',
    '		background: none;',
    '		backdrop-filter: brightness(0.5);',
    '	}',
    '}',
    '.map-detail{',
    '	margin: 0 auto;',
    '	background-color: white;',
    '	padding: 30px 20px 40px;',
    '	cursor: default;',
    '}',
    '.map-detail .map-reward.reward-got{',
    '	color: #AAA;',
    '}',
    '.bonus-target-cell{',
    ' padding: 0 0.5em;',
    '	max-width: 320px;',
    '	word-break: break-all;',
    '}',
    '.reward-name-cell{',
    '	max-width: 250px;',
    '	word-break: break-all;',
    '}',
    '.map-paginator{ position:relative; user-select:none; -webkit-user-select:none; }',
    '.map-paginator span{',
    ' font-weight: bold;',
    ' position: absolute;',
    ' color: white;',
    ' margin-top: 4px;',
    ' text-shadow: 1px 0px 2px black,-1px 0px 2px black,0px 1px 2px black,0px -1px 2px black;',
    '}',
    '.map-paginator span.prev{ right: 3.5em; }',
    '.map-paginator span.next{ right: -0.2em; }',
    '.map-paginator:not(.has-prev) span.prev{ display:none; }',
    '.map-paginator:not(.has-next) span.next{ display:none; }',
    '.maparea_block.has-task .maparea::after{',
    ' content:"";position:absolute;top:4px;left:0px;width:78px;height:26px;',
    ' background-image:url('+MAP_AREA_TASK+');',
    '}',
    '.maparea_block.has-boost .map_icon::after{',
    ' content:"";position:absolute;top:-2px;right:0;width:60px;height:56px;background-size:100%;',
    ' background-image:url('+MAP_AREA_BOOST+');',
    '}',
    '.map_lock_float {',
    ' position:absolute;top:2px;left:3px;pointer-events:none;opacity:0.5;z-index:1;',
    '}',
    '.map_title_page_infinit img { vertical-align: middle }',
    '.hidden_type_desc { color:#555;font-size:0.7em; }',
  ].join('\n'))]))
}
function executeMarquee() {
  document.head.appendChild(_('script', {}, [_('text', `
$(function() {
  // 許容する最大のWidth
  var widthMax = 104;
  $('.map_skillseed_text,.map_honor_text').each(function() {
    var span = $(this).children('span');
    // 称号文字列を表示しているSpanのWidth取得
    var textWidth = span.innerWidth();
    // Widthが許容値を超えていればマーキーさせる
    if (textWidth > widthMax) {
      $(this).marquee({speed : 60});
    }
  });
});
  `)])).remove()
}

function showMapAreaDetail(mapTitle, currentPage, index, clearedCount, remainingTiles) {
  const map = mapInfo.find(m => m.name === mapTitle)
  if (!map) return alert('未找到地图')
  const isInfinite = mapTitle.indexOf('ep. ∞') !== -1
  const areasInPage = map.areas.filter(a => a.page === currentPage-1)
  const area = map.areas.find(a => a.page === ((isInfinite && currentPage > 3) ? 3 : currentPage)-1 && a.position === index)
  if (!area) return alert('未找到区域')

  const areaIndexInPage = areasInPage.indexOf(area)
  const hasNextArea = areaIndexInPage < areasInPage.length - 1
  const hasPrevArea = areaIndexInPage > 0

  const progress = getMapTileProgress(mapTitle, currentPage, index)

  const totalPage = map.areas.slice(-1)[0].page + 1
  const shrinkLength = area.shrink.slice(0, clearedCount).reduce((a,b)=>a+b, 0)
  const length = area.rewards.slice(-1)[0].position - shrinkLength
  const position = progress.finished ? length : Math.max(length + (PAGE_DATA_IS_SHRINKED ? 0 : shrinkLength) - remainingTiles, 0)
  document.body.parentNode.classList.add('showing-detail')
  let finishedCheckbox
  const detailContainer = document.body.appendChild(_('div', { className: 'map-detail-background', event: { click: _ => { detailContainer.remove(); document.body.parentNode.classList.remove('showing-detail') } } }, [
    _('div', { className: 'map-detail w460 text_l' }, [
      _('div', { className: 'text_b' }, [_('text', map.name)]),
      _('div', {}, [_('text', `第 ${currentPage}/${totalPage} 页，第 ${index+1} 格`)]),
      _('div', {}, [_('label', { event: { click: e => e.stopPropagation() } }, [
        finishedCheckbox = _('input', { type: 'checkbox', event: { change: __ => {
          storeMapTileProgress(mapTitle, currentPage, index, null, finishedCheckbox.checked)
          storeMapPageProgress(mapTitle, currentPage)
          const tile = mapBlockMap[mapTitle].querySelectorAll('.maparea_block')[index]
          if (finishedCheckbox.checked) {
            tile.querySelector('.maparea').appendChild(_('div', { className: 'map_clear' }, [_('img', { src: '/mobile/images/progress_RewardIconClear.png' })]))
          } else {
            const clear = tile.querySelector('.map_clear')
            if (clear) clear.remove()
          }
          detailContainer.remove()
          tile.click()
        } } }),
        _('text', '区域已完成'),
        getHiddenType(area.hidden, '区域'),
      ])]),
      _('br'),
      (hasPrevArea || hasNextArea) ? _('div', {}, [
        _('div', { style: { display: 'flex', flexDirection: 'row', textDecoration: 'underline', color: '#32AAB4' }}, [
          hasPrevArea ? _('span', { event: { click: async __ => { await sleep(); mapBlockMap[mapTitle].querySelectorAll('.maparea_block')[areasInPage[areaIndexInPage -1].position].click() } }, style: { flex: 1, padding: '5px 1em', cursor: 'pointer' }}, [_('text', '前一个区域')]) : new Comment('prev page'),
          hasNextArea ? _('span', { event: { click: async __ => { await sleep(); mapBlockMap[mapTitle].querySelectorAll('.maparea_block')[areasInPage[areaIndexInPage +1].position].click() } }, style: { flex: 1, padding: '5px 1em', cursor: 'pointer', textAlign: 'right' }}, [_('text', '后一个区域')]) : new Comment('next page'),
        ]),
        _('br'),
      ]) : new Comment('sibling page nodes'),
      _('div', {}, [_('text', area.required > 0 ? `区域解锁：${clearedCount} / ${area.required}` : '')]),
      _('div', {}, [_('text', area.boost > 1 ? `跑图加成x${area.boost}` : '')]),
      _('div', {}, area.shrink.map((v,i)=>[i,v]).filter(v => v[1]>0).map(([count, shrink]) => _('div', {}, [_('text', `完成${count+1}个区域后缩短${shrink}格`)]))),
      _('table', {}, area.bonus.map(showBonus)),
      _('br'),
      _('div', {}, [_('text', `当前位置：${position} / ${length}`)]),
      _('table', {}, [_('tbody', {}, area.rewards.map(reward => {
        const posNodes = []
        const remainNodes = []
        let rewardGot = false
        if (reward.position >= length && shrinkLength > 0) {
          if (reward.position - shrinkLength === length) {
            // 最终奖励
            posNodes.push(_('del', {}, [_('text', reward.position + '格')]))
            posNodes.push(_('br'))
            posNodes.push(_('text', length + '格'))
            remainNodes.push(_('del', {}, [_('text', '还剩'+(reward.position - position)+'格')]))
            remainNodes.push(_('br'))
            remainNodes.push(_('text', progress.finished ? '已取得' : ('还剩'+(length - position)+'格')))
            rewardGot = progress.finished
          } else {
            // 其他奖励倍缩短后删除
            posNodes.push(_('del', {}, [_('text', reward.position + '格')]))
            remainNodes.push(_('del', {}, [_('text', '还剩'+(reward.position - position)+'格')]))
            rewardGot = true
          }
        } else {
          rewardGot = reward.position <= position
          posNodes.push(_('text', reward.position + '格'))
          remainNodes.push(_('text', rewardGot ? '已取得' : ('还剩'+(reward.position - position)+'格')))
        }
        return _('tr', { className: 'map-reward '+(rewardGot ? 'reward-got' : 'reward-not-got') }, [
          _('td', { className: 'text_r' }, posNodes),
          _('td', { className: 'text_r', style:{padding:'0 0.5em'} }, remainNodes),
          _('td', { className: 'text_l reward-name-cell' }, [_('text', reward.reward)]),
        ])
      }))]),
      _('div', {}, [_('text', area.task ? `课题曲：${area.task}` : '')]),
    ])
  ]))
  finishedCheckbox.checked = progress.finished
}

function showBonus(bonus) {
  switch (bonus.type) {
    case 'chara':
      return _('tr', {}, [
        _('td', { className: 'text_r'}, [_('text', '使用角色')]),
        _('td', { className: 'bonus-target-cell' }, [_('text', bonus.target)]),
        _('td', {}, [_('text', `+${bonus.point}`)]),
      ])
    case 'charaWorks':
      return _('tr', {}, [
        _('td', { className: 'text_r'}, [_('text', '使用分类角色')]),
        _('td', { className: 'bonus-target-cell' }, [_('text', bonus.target)]),
        _('td', {}, [_('text', `+${bonus.point}`)]),
      ])
    case 'skill':
      return _('tr', {}, [
        _('td', { className: 'text_r'}, [_('text', '使用技能')]),
        _('td', { className: 'bonus-target-cell' }, [_('text', bonus.target)]),
        _('td', {}, [_('text', `+${bonus.point}`)]),
      ])
    case 'skillCategory':
      return _('tr', {}, [
        _('td', { className: 'text_r'}, [_('text', '使用技能类型')]),
        _('td', { className: 'bonus-target-cell' }, [_('text', bonus.target)]),
        _('td', {}, [_('text', `+${bonus.point}`)]),
      ])
    case 'music':
      return _('tr', {}, [
        _('td', { className: 'text_r'}, [_('text', '游玩歌曲')]),
        _('td', { className: 'bonus-target-cell' }, [_('text', bonus.target)]),
        _('td', {}, [_('text', `+${bonus.point}`)]),
      ])
    case 'musicGenre':
      return _('tr', {}, [
        _('td', { className: 'text_r'}, [_('text', '游玩分类歌曲')]),
        _('td', { className: 'bonus-target-cell' }, [_('text', bonus.target)]),
        _('td', {}, [_('text', `+${bonus.point}`)]),
      ])
    case 'musicWorks':
      return _('tr', {}, [
        _('td', { className: 'text_r'}, [_('text', '游玩来源歌曲')]),
        _('td', { className: 'bonus-target-cell' }, [_('text', bonus.target)]),
        _('td', {}, [_('text', `+${bonus.point}`)]),
      ])
    case 'musicDif':
      return _('tr', {}, [
        _('td', { className: 'text_r'}, [_('text', '游玩难度')]),
        _('td', { className: 'bonus-target-cell' }, [_('text', bonus.target)]),
        _('td', {}, [_('text', `+${bonus.point}`)]),
      ])
    case 'musicLv':
      return _('tr', {}, [
        _('td', { className: 'text_r'}, [_('text', '游玩歌曲等级')]),
        _('td', { className: 'bonus-target-cell' }, [_('text', bonus.target)]),
        _('td', {}, [_('text', `+${bonus.point}`)]),
      ])
    case 'charaRank':
      return _('tr', {}, [
        _('td', { className: 'text_r'}, [_('text', '角色等级大于')]),
        _('td', { className: 'bonus-target-cell' }, [_('text', bonus.target)]),
        _('td', {}, [_('text', `+${bonus.point}`)]),
      ])
  }
  return _('div', {}, [_('text', `${bonus.type} ${bonus.target} +${bonus.point}`)])
}

function storeMapPageProgress(title, page, isInitialData = false) {
  const map = mapInfo.find(m => m.name === title)
  if (!map) return
  page--
  map.areas.forEach(area => {
    if (area.page < page) {
      storeMapTileProgress(title, area.page + 1, area.position, isInitialData ? area.rewards.slice(-1)[0].position : null, true)
    } else if (area.page > page) {
      storeMapTileProgress(title, area.page + 1, area.position, isInitialData ? 0 : null, false)
    }
  })
  if (title.indexOf('ep. ∞') !== -1 && page > 3) {
    const infiniteTile = map.areas.slice(-1)[0]
    for (let i=infiniteTile.page; i<page; i++) {
      storeMapTileProgress(title, i + 1, infiniteTile.position, isInitialData ? infiniteTile.rewards.slice(-1)[0].position : null, true)
    }
  }
}
function storeMapTileProgress(title, page, index, position, finished) {
  const data = getStoredMapData()
  data[title] = data[title] || {}
  if (position === null) {
    position = data[title][`${page}-${index}`] && data[title][`${page}-${index}`][0] || 0
  }
  data[title][`${page}-${index}`] = [position, finished]
  storeMapData(data)
}
function getMapTileProgress(title, page, index) {
  const data = getStoredMapData()
  const [position, finished] = data[title] && data[title][`${page}-${index}`] || [0, false]
  return { position, finished }
}
const localStorageProgressDataKey = 'CNMD_maps_progress'
function getStoredMapData() {
  const data = localStorage[localStorageProgressDataKey]
  return data ? JSON.parse(data) : {}
}
function storeMapData(data) {
  localStorage[localStorageProgressDataKey] = JSON.stringify(data)
}

loadLocalInfo()
checkUpdateForLocalInfo()
addClickHandler()
addRemainingMaps()
addGlobalStyle()

