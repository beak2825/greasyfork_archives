// ==UserScript==
// @name        chuni-net - display overpower
// @namespace   esterTion
// @license     MIT
// @match       https://chunithm-net-eng.com/mobile/record/music*
// @match       https://chunithm.wahlap.com/mobile/record/music*
// @match       https://new.chunithm-net.com/chuni-mobile/html/mobile/record/music*
// @match       https://chunithm-net-eng.com/mobile/home/playerData/rating*
// @match       https://chunithm.wahlap.com/mobile/home/playerData/rating*
// @match       https://new.chunithm-net.com/chuni-mobile/html/mobile/home/playerData/rating*
// @version     1.1.6
// @author      esterTion
// @description Display song overpower and rating on chunithm-net
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/489810/chuni-net%20-%20display%20overpower.user.js
// @updateURL https://update.greasyfork.org/scripts/489810/chuni-net%20-%20display%20overpower.meta.js
// ==/UserScript==

(async function () {

const host = location.hostname
const server = host === 'new.chunithm-net.com' ? 'jp' : host === 'chunithm-net-eng.com' ? 'ex' : host === 'chunithm.wahlap.com' ? 'cn' : ''
if (!server) throw new Error('unknown server')
const imageBase = server === 'jp' ? '/chuni-mobile/html/mobile/images' : '/mobile/images'

const disabledSongs = {
  ex: [],
  cn: [],
  jp: []
}
const PAGE_TEXT = {
  ONLY_HIGHEST: {
    ex: 'Count highest difficulty only',
    cn: '仅统计最高难度',
    jp: '最高難易度のみ集計する',
  },
  SORT_INITIAL: {
    ex: 'Initial',
    cn: '初始顺序',
    jp: '初期順',
  },
  SORT_DIFFICULTY: {
    ex: 'Difficulty',
    cn: '难度',
    jp: '難易度',
  },
  SORT_SCORE: {
    ex: 'Score',
    cn: '分数',
    jp: 'スコア',
  },
  SORT_OP_REMAIN: {
    ex: 'op remaining',
    cn: 'op 剩余',
    jp: 'op 残り',
  },
  TOTAL_SONG_COUNT: {
    ex: 'Total {} songs',
    cn: '共计 {} 曲目',
    jp: '全 {} 曲',
  },
  AVERAGE_PLAYED: {
    ex: 'Average of played songs: ',
    cn: '已游玩平均：',
    jp: 'プレイ済み平均：',
  },
  RATING_AVERAGE: {
    ex: 'Average: ',
    cn: '平均：',
    jp: '平均：',
  },
  RATING_TOTAL: {
    ex: 'Total: ',
    cn: '总计：',
    jp: '合計：',
  },
}

// createElement
function _(e,t,i){var a=null;if("text"===e)return document.createTextNode(t);a=document.createElement(e);for(var n in t)if("style"===n)for(var o in t.style)a.style[o]=t.style[o];else if("className"===n)a.className=t[n];else if("event"===n)for(var o in t.event)a.addEventListener(o,t.event[o]);else a.setAttribute(n,t[n]);if(i)if("string"==typeof i)a.innerHTML=i;else if(Array.isArray(i))for(var l=0;l<i.length;l++)null!=i[l]&&a.appendChild(i[l]);return a}

const localStorageTimeKey = 'CNDL_music_level_info_time'
const localStorageDataKey = 'CNDL_music_level_info'
const localStoragePrefHighestOnlyKey = 'CNDL_music_level_info_highest_only'
let musicLevelInfo = {}
function loadLocalInfo() {
  if (!localStorage[localStorageDataKey]) return
  musicLevelInfo = JSON.parse(localStorage[localStorageDataKey])
}
let resultCount = {
  sssp: 0,
  sss: 0,
  ssp: 0,
  ss: 0,
  sp: 0,
  s: 0,
  other: 0,

  max: 0,
  aj: 0,
  fc: 0,
  nonfc: 0,
}
const diffToggles = {
  bas: true,
  adv: true,
  exp: true,
  mas: true,
  ult: true,
  other: true,
}
const diffTogglesDisplay = {
  bas: false,
  adv: false,
  exp: false,
  mas: false,
  ult: false,
  other: false,
}
let musicOnPage
let sortForm
let countHightestOnly = localStorage[localStoragePrefHighestOnlyKey] === '1'
function initPageOverPower() {
  musicOnPage = [...document.querySelectorAll('.musiclist_box .music_title')].map(addOverPowerToList)
  musicOnPage.forEach(i => {
    if (diffTogglesDisplay[i.dif] !== undefined) {
      diffTogglesDisplay[i.dif] = true
    } else {
      diffTogglesDisplay.other = true
    }
  })
  const scoreList = document.querySelector('#scoreList_result')
  if (!scoreList) return
  scoreList.appendChild(_('div', {className: 'box01 w420 CNDO-sort-box'}, [
    _('div', {}, [ sortForm = _('form', { event: { change: applySort }}, [
      _('select', { style: { width: '160px', margin: '10px' }, name: 'key' }, [
        _('option', {value: 'initial'}, [_('text', PAGE_TEXT.SORT_INITIAL[server])]),
        _('option', {value: 'level'}, [_('text', PAGE_TEXT.SORT_DIFFICULTY[server])]),
        _('option', {value: 'score'}, [_('text', PAGE_TEXT.SORT_SCORE[server])]),
        _('option', {value: 'aj'}, [_('text', 'FC/AJ')]),
        _('option', {value: 'op_percent'}, [_('text', 'op %')]),
        _('option', {value: 'op_remain'}, [_('text', PAGE_TEXT.SORT_OP_REMAIN[server])]),
      ]),
      _('select', { style: { width: '96px', margin: '10px' }, name: 'desc' }, [
        _('option', {value: 0}, [_('text', '↑')]),
        _('option', {value: 1}, [_('text', '↓')]),
      ]),
    ])]),
  ]))
  addOverPowerToPage()
}
function addOverPowerToPage() {
  const musics = musicOnPage.filter(i => {
    if (i.disabled) return false
    let on = diffToggles[i.dif]
    on ??= diffToggles.other
    return on
  })
  const countedSize = musics.length
  const filteredSize = musics.filter(i => !countHightestOnly || !i.notHighestLevel).length
  document.querySelector('.CNDO-info-box')?.remove()
  let resultCount = {
    sssp: 0,
    sss: 0,
    ssp: 0,
    ss: 0,
    sp: 0,
    s: 0,
    other: countedSize,

    max: 0,
    aj: 0,
    fc: 0,
    nonfc: countedSize,
  }
  const total = musics.reduce((a, i) => {
    const obj = i.parsed
    if (obj.scoreRank >=8) { resultCount.other--; }
    if (obj.scoreRank >=8) { resultCount.s++; }
    if (obj.scoreRank >=9) { resultCount.sp++; }
    if (obj.scoreRank >=10) { resultCount.ss++; }
    if (obj.scoreRank >=11) { resultCount.ssp++; }
    if (obj.scoreRank >=12) { resultCount.sss++; }
    if (obj.scoreRank >=13) { resultCount.sssp++; }
    if (obj.theoryCount) { resultCount.max++; }

    if (obj.isAllJustice) { resultCount.aj++; }
    if (obj.isFullCombo) { resultCount.fc++; resultCount.nonfc--; }

    if (countHightestOnly && i.notHighestLevel) {
      return a;
    }
    return {rate: a.rate+(i.rate), max: a.max+i.max, playedmax: a.playedmax+(i.rate>0?i.max:0)}
  }, {rate: 0, max: 0, playedmax: 0})
  total.rate /= 100
  total.max /= 100
  total.playedmax /= 100
  // console.log(total, total.rate/total.max*100)

  const scoreList = document.querySelector('#scoreList_result')
  if (!scoreList) return
  let diffToggleForm
  scoreList.appendChild(_('div', {className: 'box01 w420 CNDO-info-box'}, [
    _('style', {}, `

.overpower-graph-base {
  position:relative;
  width:100%;
  height:22px;
  background:#6e6e6e;
  outline:#dddddd 1px solid
}
.overpower-graph-base .bg-gold,
.overpower-graph-base .bg-platinum,
.overpower-graph-base .bg-silver,
.overpower-graph-base .bg-white {
  position:absolute;
  left:0;
  top:0;
  bottom:0
}
.overpower-graph-base .bg-white {
  z-index:12;
  background:linear-gradient(180deg,#fff,#fff 50%,#d0d6da 50%,#e4edf3 75%,#fff)!important
}
.overpower-graph-base .bg-platinum {
  z-index:10;
  background:linear-gradient(180deg,#fff1ba,#ffeb9c 50%,#fc0 50%,#ffeca4 75%,#fff)!important
}
.overpower-graph-base .bg-gold {
  z-index:8;
  background:linear-gradient(180deg,#ffe4a3,#efae10 50%,#ff8300 50%,#ffc947 75%,#fff)!important
}
.overpower-graph-base .bg-silver {
  z-index:6;
  background:linear-gradient(180deg,#c8e7ff,#8fceff 50%,#6eb5ff 50%,#b7ddff 75%,#fff)!important
}
.CNDO-version-box.hide :not(.CNDO-version-title) {
  display:none;
}
.CNDO-version-box.hide .CNDO-version-title::before {
  content: '▶';
}
.CNDO-version-box .CNDO-version-title::before {
  content: '▼';
}

    `),
    _('div', {className: 'narrow_block clearfix', style: {whiteSpace:'pre-wrap'}}, [
      diffToggleForm = _('form', { event: { change: e => {
        diffToggles[e.target.name] = e.target.checked
        musicOnPage.forEach(i => {
          if (i.dif !== e.target.name) return
          i.box.style.display = e.target.checked ? '' : 'none'
        })
        addOverPowerToPage()
      } } }, [
        !diffTogglesDisplay.bas ? new Comment('bas toggle') : _('label', {}, [
          _('input', {type: 'checkbox', name: 'bas', [diffToggles.bas ? 'checked' : 'checked_']: '1' }),
          _('text', 'BAS'),
        ]),
        !diffTogglesDisplay.adv ? new Comment('adv toggle') : _('label', {}, [
          _('input', {type: 'checkbox', name: 'adv', [diffToggles.adv ? 'checked' : 'checked_']: '1' }),
          _('text', 'ADV'),
        ]),
        !diffTogglesDisplay.exp ? new Comment('exp toggle') : _('label', {}, [
          _('input', {type: 'checkbox', name: 'exp', [diffToggles.exp ? 'checked' : 'checked_']: '1' }),
          _('text', 'EXP'),
        ]),
        !diffTogglesDisplay.mas ? new Comment('mas toggle') : _('label', {}, [
          _('input', {type: 'checkbox', name: 'mas', [diffToggles.mas ? 'checked' : 'checked_']: '1' }),
          _('text', 'MAS'),
        ]),
        !diffTogglesDisplay.ult ? new Comment('ult toggle') : _('label', {}, [
          _('input', {type: 'checkbox', name: 'ult', [diffToggles.ult ? 'checked' : 'checked_']: '1' }),
          _('text', 'ULT'),
        ]),
        !diffTogglesDisplay.other ? new Comment('other toggle') : _('label', {}, [
          _('input', {type: 'checkbox', name: 'other', [diffToggles.other ? 'checked' : 'checked_']: '1' }),
          _('text', 'OTHER'),
        ]),
      ]),
      _('label', {}, [
        _('input', {type: 'checkbox', [countHightestOnly ? 'checked' : 'checked_']: '1', event: { change: e => {
          countHightestOnly = e.target.checked
          localStorage[localStoragePrefHighestOnlyKey] = countHightestOnly ? '1' : '0'
          addOverPowerToPage()
        } } }),
        _('text', PAGE_TEXT.ONLY_HIGHEST[server]),
      ]), _('br'),
      _('text', [
        PAGE_TEXT.TOTAL_SONG_COUNT[server].replace('{}', filteredSize),
        `${total.rate} / ${total.max}`,
        (total.rate/Math.max(total.max, 1)*100).toFixed(4)+'%',
        '',
        PAGE_TEXT.AVERAGE_PLAYED[server],
        //`${total.rate} / ${total.playedmax}`,
        (total.rate/Math.max(total.playedmax, 1)*100).toFixed(4)+'%',
        '','',
      ].join('\n')),
      _('table', { style: {width: '100%', fontSize: '16px'} }, [
        _('tr', {}, [
          _('td', {}, [_('text', 'SSS+')]),
          _('td', {}, [_('text', 'SSS')]),
          _('td', {}, [_('text', 'SS+')]),
          _('td', {}, [_('text', 'SS')]),
          _('td', {}, [_('text', 'S+')]),
          _('td', {}, [_('text', 'S')]),
          _('td', {}, [_('text', 'OTHER')]),
        ]),
        _('tr', {}, [
          _('td', {}, [_('text', resultCount.sssp)]),
          _('td', {}, [_('text', resultCount.sss - resultCount.sssp)]),
          _('td', {}, [_('text', resultCount.ssp - resultCount.sss)]),
          _('td', {}, [_('text', resultCount.ss - resultCount.ssp)]),
          _('td', {}, [_('text', resultCount.sp - resultCount.ss)]),
          _('td', {}, [_('text', resultCount.s - resultCount.sp)]),
          _('td', {}, [_('text', resultCount.other)]),
        ]),
      ]),
      _('div', {className: 'overpower-graph-base'}, [
        _('div', {className: 'bg-platinum', style: {width: `${resultCount.sss/countedSize*100}%`}}),
        _('div', {className: 'bg-gold', style: {width: `${resultCount.ss/countedSize*100}%`}}),
        _('div', {className: 'bg-silver', style: {width: `${resultCount.s/countedSize*100}%`}}),
      ]),
      _('table', { style: {width: '100%', fontSize: '16px'} }, [
        _('tr', {}, [
          _('td', {}, [_('text', 'MAX')]),
          _('td', {}, [_('text', 'AJ')]),
          _('td', {}, [_('text', 'FC')]),
          _('td', {}, [_('text', 'OTHER')]),
        ]),
        _('tr', {}, [
          _('td', {}, [_('text', resultCount.max)]),
          _('td', {}, [_('text', resultCount.aj - resultCount.max)]),
          _('td', {}, [_('text', resultCount.fc - resultCount.aj)]),
          _('td', {}, [_('text', resultCount.nonfc)]),
        ]),
      ]),
      _('div', {className: 'overpower-graph-base'}, [
        _('div', {className: 'bg-white', style: {width: `${resultCount.max/countedSize*100}%`}}),
        _('div', {className: 'bg-platinum', style: {width: `${resultCount.aj/countedSize*100}%`}}),
        _('div', {className: 'bg-gold', style: {width: `${resultCount.fc/countedSize*100}%`}}),
      ]),
    ]),
  ]))

  if (diffToggleForm.children.length === 1) {
    diffToggleForm.remove()
  }
  applySort.call(sortForm)
}
function addOverPowerToList(titleDiv, idx) {
  const dif = getDifFromClass(titleDiv.parentNode)
  if (!dif) return null
  const box = titleDiv.parentNode
  const titleText = titleDiv.lastChild.textContent.trim()
  const level = getLevelByTitleAndDif(titleText, dif) * 1
  const returnData = {
    box,
    idx,
    dif,
    level,
    rate: 0,
    disabled: disabledSongs[server].includes(titleText),
    notHighestLevel: true,
    parsed: {},
    max: (level+3) * 500
  }
  const scoreBox = box.querySelector('.play_musicdata_highscore .text_b')
  if (!scoreBox) return returnData
  if (returnData.disabled) {
    return returnData
  }
  const obj = {
    scoreMax:      scoreBox.textContent.replace(/,/g, '')*1,
    maxComboCount: 0,
    isFullCombo:   false,
    isAllJustice:  false,
    isSuccess:     0,
    fullChain:     0,
    maxChain:      0,
    scoreRank:     0,
    isLock:        false,
    theoryCount:   0,
  }
  if (obj.scoreMax === 1010000) { obj.theoryCount = 1; }
  [...box.querySelectorAll('.play_musicdata_icon img')].forEach(i => {
    const icon = i.src.replace(/.+\//, '').replace(/icon_(.+)\.png/, '$1')
    switch (icon) {
      case 'clear': { obj.isSuccess = 1; break }
      case 'hard': { obj.isSuccess = 2; break }
      case 'absolute': { obj.isSuccess = 3; break }
      case 'brave': { obj.isSuccess = 3; break }
      case 'absolutep': { obj.isSuccess = 4; break }
      case 'absolutepp': { obj.isSuccess = 5; break }
      case 'catastrophy': { obj.isSuccess = 6; break }
      
      case 'rank_1': { obj.scoreRank = 1; break }
      case 'rank_2': { obj.scoreRank = 2; break }
      case 'rank_3': { obj.scoreRank = 3; break }
      case 'rank_4': { obj.scoreRank = 4; break }
      case 'rank_5': { obj.scoreRank = 5; break }
      case 'rank_6': { obj.scoreRank = 6; break }
      case 'rank_7': { obj.scoreRank = 7; break }
      case 'rank_8': { obj.scoreRank = 8; break }
      case 'rank_9': { obj.scoreRank = 9; break }
      case 'rank_10': { obj.scoreRank = 10; break }
      case 'rank_11': { obj.scoreRank = 11; break }
      case 'rank_12': { obj.scoreRank = 12; break }
      case 'rank_13': { obj.scoreRank = 13; break }
      
      case 'alljusticecritical':
      case 'alljustice': { obj.isAllJustice = true }
      case 'fullcombo': { obj.isFullCombo = true; obj.missCount = 0; break }
      
      case 'fullchain2': { obj.fullChain = 1; break }
      case 'fullchain': { obj.fullChain = 2; break }
    }
  })
  returnData.parsed = obj

  // lmn+逻辑
  // 存在更高等级的ult，mas不计op
  if (dif === 'mas') {
    const ultLevel = getLevelByTitleAndDif(titleText, 'ult') * 1
    if (level >= ultLevel) {
      returnData.notHighestLevel = false
    }
  } else if (dif === 'ult') {
    const masLevel = getLevelByTitleAndDif(titleText, 'mas') * 1
    if (level > masLevel) {
      returnData.notHighestLevel = false
    }
  }

  returnData.rating = getRatingFromConstantAndScore(level, obj.scoreMax)
  const comboRate = obj.theoryCount ? 125 :
                    obj.isAllJustice ? 100 :
                    obj.isFullCombo ? 50 : 0
  if (obj.scoreMax <= 1007500) {
    // 低于sss
    returnData.rate = Math.floor(returnData.rating*500 * 2) / 2 + comboRate
    addOverPowerAfterScore(scoreBox, returnData)
    return returnData
  }
  const sssRate = Math.floor((obj.scoreMax - 1007500) * 0.15 * 2) / 2
  returnData.rate = (level + 2) * 500 + comboRate + sssRate
  addOverPowerAfterScore(scoreBox, returnData)
  return returnData
}
function addOverPowerAfterScore(scoreBox, returnData) {
  scoreBox.parentNode.appendChild(_('span', {style: {marginLeft: '2em', fontFamily: 'Arial'}}, [
    _('text', (Math.floor(returnData.rate)/100).toFixed(2) + ' / ' + (returnData.max/100).toFixed(2) + ' ' + (returnData.rate/returnData.max*100).toFixed(2)+'%'),
  ]))
}
function getDifFromClass(div) {
	const divClass = [...div.classList].filter(i => i.startsWith('bg_') || i.startsWith('title_'))
	if (!divClass.length) return '?'
	switch (divClass[0]) {
		case 'bg_basic': { return 'bas' }
		case 'bg_advanced': { return 'adv' }
		case 'bg_expert': { return 'exp' }
		case 'bg_master': { return 'mas' }
		case 'bg_ultima': { return 'ult' }

		case 'title_basic': { return 'bas' }
		case 'title_advanced': { return 'adv' }
		case 'title_expert': { return 'exp' }
		case 'title_master': { return 'mas' }
		case 'title_ultima': { return 'ult' }
	}
	return '?'
}
function getLevelByTitleAndDif(title, dif) {
  if (!musicLevelInfo[title]) return 0
  if (!musicLevelInfo[title][dif]) return 0
  return musicLevelInfo[title][dif].replace('+', '.5')
}
var ratingBorder = [
  [1009000, +2.15, 1],
  [1007500, +2.0, 1],
  [1005000, +1.5, 1],
  [1000000, +1.0, 1],
  [975000, +0.0, 1],
  [925000, -3.0, 1],
  [900000, -5.0, 1],
  [800000, -5.0, 2],
  [500000, 0, 1]
];
function getRatingFromConstantAndScore(constant, score) {
  if (constant == 0) return 0;
  if (score >= ratingBorder[0][0]) return constant + ratingBorder[0][1];
  for (var i = 0; i < ratingBorder.length - 1; i++) {
    if (score >= ratingBorder[i + 1][0]) {
      return (constant + ratingBorder[i + 1][1]) / ratingBorder[i + 1][2]
      + (score - ratingBorder[i + 1][0]) / (ratingBorder[i][0] - ratingBorder[i + 1][0])
      * (
      (constant + ratingBorder[i][1]) / ratingBorder[i][2] -
      (constant + ratingBorder[i + 1][1]) / ratingBorder[i + 1][2]
      )
    }
  }
  return 0;
}
function applySort() {
  const form = this
  const key = form.key.value
  const desc = form.desc.value === '1'
  musicOnPage.sort((a, b) => (desc ? -1 : 1) * (a.idx - b.idx))
  if (key !== 'initial') {
    musicOnPage.sort((a, b) => {
      let result = 0
      switch (key) {
        case 'level': { result = a.level - b.level; break }
        case 'score': { result = (a.parsed.scoreMax || 0) - (b.parsed.scoreMax || 0); break }
        case 'aj': { result = toAjScore(a) - toAjScore(b); break }
        case 'op_percent': { result = a.rate/a.max - b.rate/b.max; break }
        case 'op_remain': { result = (a.max - a.rate) - (b.max - b.rate); break }
      }
      return desc ? -result : result
    })
  }
  musicOnPage.forEach((i, idx) => {
    i.box.parentNode.parentNode.appendChild(i.box.parentNode)
  })
}
function toAjScore(i) {
  return i.parsed.theoryCount ? 3 : (
    i.parsed.isAllJustice ? 2 : (
      i.parsed.isFullCombo ? 1 : 0
    )
  )
}

const statisticJudge = [
  ["clear"              , i => i.parsed.isSuccess >= 1 ],
  ["hard"               , i => i.parsed.isSuccess >= 2 ],
  ["absolute"           , i => i.parsed.isSuccess >= 3 ],
  ["absolutep"          , i => i.parsed.isSuccess >= 4 ],
  ["catastrophy"        , i => i.parsed.isSuccess >= 6 ],
  ["rank_8"             , i => i.parsed.scoreRank >= 8 ],
  ["rank_9"             , i => i.parsed.scoreRank >= 9 ],
  ["rank_10"            , i => i.parsed.scoreRank >= 10 ],
  ["rank_11"            , i => i.parsed.scoreRank >= 11 ],
  ["rank_12"            , i => i.parsed.scoreRank >= 12 ],
  ["rank_13"            , i => i.parsed.scoreRank >= 13 ],
  ["fullcombo"          , i => i.parsed.isFullCombo ],
  ["alljustice"         , i => i.parsed.isAllJustice ],
  ["alljusticecritical" , i => i.parsed.theoryCount > 0 ],
  ["fullchain2"         , i => i.parsed.fullChain >= 1 ],
  ["fullchain"          , i => i.parsed.fullChain >= 2 ],
]
const VERSION_MUSIC_LIST = [["CHUNITHM",[3,6,18,21,23,27,33,38,41,45,46,47,48,49,50,51,53,59,63,64,65,67,68,69,70,71,74,75,76,79,80,81,82,83,88,89,91,92,94,95,96,97,98,99,100,101,103,104,105,107,108,113,114,115,117,118,120,128,132,133,134,135,136,138,140,141,142,143,144,145,146,147,148,149,150,151,152,157,158,159,160,161,163,165,166,167,168,169,170,178,179,180,181,203,204]],["CHUNITHM PLUS",[19,35,52,61,62,72,73,90,93,106,121,122,123,131,171,173,177,196,197,199,200,201,202,205,208,210,211,212,213,216,217,220,222,223,224,225,226,227,228,232,233,240,244,245,246,251,252]],["CHUNITHM AIR",[7,37,66,77,102,119,137,186,187,189,190,218,219,229,230,248,250,254,257,259,260,261,262,263,264,267,270,271,272,273,275,276,278,279,280,281,282,283,284,286,287,288,289,290,291,292,293,294,297,298,300,301,302,303,304,305,306,307,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,336]],["CHUNITHM AIR PLUS",[20,191,192,193,194,195,234,249,253,256,258,265,266,268,274,277,295,310,334,335,337,338,339,340,341,342,354,362,363,365,367,368,369,370,371,372,373,374,375,376,377,379,380,381,382,383,384,385,386,388,389,390,393,394,395,396,397,398,399,402,403,404,405,407,409,411,414,416]],["CHUNITHM STAR",[406,421,426,427,430,431,432,433,434,435,436,437,438,439,440,441,442,444,445,446,447,448,449,455,456,457,458,459,463,464,466,467,468,469,470,471,472,475,476,477,478,479,481,482,483,485,486,487,488,489,490,492,493,494,496,497,498,499,500,502,503,504,505,506,512,513,514,516,524,525,528,532,533,535,538,540]],["CHUNITHM STAR PLUS",[24,198,391,413,460,462,465,491,515,534,547,548,549,550,551,552,553,554,555,556,557,558,559,560,561,562,564,565,566,567,568,569,570,572,574,575,577,578,583,585,586,587,588,589,590,592,593,594,595,597,599,600,601,605,606,607,614,615,616,617,618,625,626,627,628,629,631,632,633,635,636,637,638]],["CHUNITHM AMAZON",[517,573,619,653,654,655,656,657,659,662,663,664,665,666,667,668,669,670,671,676,677,678,679,681,683,684,685,686,688,689,690,691,692,693,694,695,696,697,698,699,700,701,702,703,704,705,706,707,708,710,711,712,713,715,716,717,720,721,722]],["CHUNITHM AMAZON PLUS",[285,598,604,729,730,731,732,733,734,735,736,737,738,739,740,741,742,743,744,745,746,747,749,750,751,752,753,754,755,756,757,760,761,762,763,764,765,766,768,771,772,773,774,775,776,777,780,781,782,783,784,785,786,787,788,791,792,793,795,796,797,798,799,802,803,804,806,807]],["CHUNITHM CRYSTAL",[429,810,815,816,817,818,819,821,822,823,824,825,826,827,828,829,830,831,832,833,834,835,836,837,838,839,840,841,842,843,844,845,846,848,849,850,851,852,853,854,856,858,859,860,863,865,867,868,869,870,871,872,873,874,875,876,877,878,879,880,881,882,885,886,887,888,889,891,893,894,895,896,897,900,901]],["CHUNITHM CRYSTAL PLUS",[333,899,909,910,911,912,913,914,915,916,917,918,921,922,923,926,927,928,929,930,931,932,933,934,935,936,937,938,939,940,941,942,943,944,945,946,947,948,949,950,953,954,955,958,959,960,961,962,966,967,969,970,971,972,973,974,975,976,978,979,980,981,982,983,984,987]],["CHUNITHM PARADISE",[968,988,989,990,991,992,993,994,997,998,999,1002,1004,1006,1007,1008,1009,1010,1011,1012,1013,1014,1015,1016,1017,1019,1020,1021,1022,1023,1025,1026,1027,1028,1029,1030,1031,1032,1033,1035,1037,1040,1041,1042,1043,1044,1091,1092,1098,1099]],["CHUNITHM PARADISE LOST",[1005,1048,1055,1056,1057,1059,1060,1061,1062,1063,1064,1066,1067,1068,1069,1070,1071,1072,1073,1074,1075,1076,1077,1078,1079,1080,1081,1082,1083,1084,1085,1086,1087,1088,1089,1090,1096,1100,1101,1102,1103,1104,1105,1106,2001,2002,2048,2070,2071,2072,2073,2074,2077,2079,2080,2081,2082,2083,2084,2085,2086,2087,2089,2101,2102,2103,2106]],["CHUNITHM NEW",[511,1038,1058,1065,1094,2010,2017,2018,2019,2022,2023,2024,2025,2026,2028,2029,2030,2031,2032,2033,2034,2035,2036,2037,2038,2040,2042,2043,2044,2045,2046,2047,2049,2050,2052,2053,2054,2055,2056,2058,2059,2060,2061,2062,2063,2064,2065,2066,2067,2068,2069,2090,2091,2092,2093,2094,2096,2097,2098,2099,2105,2108,2109,2110,2111,2114,2115,2116,2117,2118,2119,2120,2121,2122,2124,2125,2126,2127,2134,2135,2137,2138,2140,2144,2145,2146,2147,2148,2149,2150,2151,2152,2153,2154,2155,2156,2157,2158,2160,2161,2162,2163,2164,2166,2167,2168,2169,2170]],["CHUNITHM NEW PLUS",[1039,1107,2041,2057,2128,2129,2130,2131,2132,2133,2165,2171,2172,2173,2174,2175,2176,2177,2178,2179,2180,2181,2182,2183,2184,2185,2186,2187,2188,2189,2190,2191,2192,2193,2194,2195,2196,2197,2198,2199,2200,2201,2202,2203,2204,2205,2206,2207,2208,2209,2210,2211,2212,2213,2214,2215,2216,2217,2218,2219,2220,2221,2222,2223,2224,2225,2226,2227,2228,2229,2230,2231,2232,2233,2234,2235,2236,2237,2238,2239,2240,2241,2242,2243,2244,2245,2246,2247,2248,2249,2250,2251,2252]],["CHUNITHM SUN",[428,2253,2254,2255,2257,2258,2259,2260,2261,2262,2263,2264,2265,2266,2267,2268,2269,2270,2271,2272,2273,2274,2275,2276,2277,2278,2279,2280,2281,2282,2283,2285,2286,2287,2288,2289,2290,2291,2292,2293,2294,2295,2296,2302,2303,2304,2305,2306,2307,2308,2310,2311,2312,2313,2314,2315,2316,2317,2318,2319,2320,2321,2322,2323,2324,2326,2327,2328,2329,2330,2331,2332,2333,2334,2336,2337,2338,2339,2340,2341,2342,2343,2344,2345,2346,2347,2348,2349,2350,2351,2353,2354,2355,2356,2358,2359,2360,2361,2362,2363,2364,2365,2366,2367,2368,2369,2370,2371,2372,2373,2381,2382,2383,2384,2385]],["CHUNITHM SUN PLUS",[2297,2298,2299,2300,2301,2309,2352,2386,2387,2388,2389,2390,2391,2392,2393,2394,2395,2397,2398,2399,2400,2401,2403,2404,2405,2406,2407,2408,2409,2410,2411,2412,2413,2414,2415,2416,2417,2418,2420,2421,2422,2425,2426,2427,2428,2429,2430,2431,2432,2433,2434,2435,2436,2437,2438,2439,2440,2441,2442,2443,2444,2445,2446,2447,2448,2449,2450,2451,2452,2453,2454,2455,2456,2457,2458,2459,2460,2461,2463,2464,2465,2466,2467,2468,2469,2475,2476,2477,2478,2479,2480,2481,2482,2483,2485,2486,2487,2488,2489]],["CHUNITHM LUMINOUS",[2490,2491,2492,2493,2494,2495,2496,2497,2498,2499,2500,2501,2502,2503,2504,2505,2506,2507,2508,2509,2510,2511,2512,2513,2514,2515,2517,2518,2519,2520,2521,2522,2523,2524,2525,2526,2528,2529,2530,2531,2532,2533,2534,2535,2536,2537,2538,2539,2540,2542,2543,2544,2545,2546,2547,2548,2549,2550,2552,2553,2554,2555,2556,2557,2559,2560,2561,2562,2563,2564,2565,2566,2567,2568,2569,2570,2571,2572,2573,2574,2575,2576,2577,2578,2579,2580,2581,2582,2583]],["CHUNITHM LUMINOUS PLUS",[2584,2585,2586,2587,2589,2591,2592,2593,2594,2596,2597,2598,2599,2600,2601,2602,2603,2604,2605,2606,2610,2611,2612,2613,2614,2615,2616,2618,2619,2620,2621,2622,2623,2624,2625,2629,2630,2631,2632,2633,2634,2635,2636,2637,2638,2639,2641,2642,2643,2644,2645,2646,2647,2648,2650,2651,2652,2653,2654,2657,2658,2659,2660,2661,2663,2665,2670,2671,2673,2674,2675,2676,2677,2679,2680,2681]],["CHUNITHM VERSE",[]]]
function reorderPageIntoVersion() {
  const tempKeyedMusicList = {}
  musicOnPage.forEach(i => tempKeyedMusicList[i.box.querySelector('[name=idx]').value]=i)
  const currentBoxes = [...document.querySelectorAll('.box05')]
  if (currentBoxes.length === 0) return
  const container = currentBoxes[0].parentNode
  VERSION_MUSIC_LIST.forEach(([version, list]) => {
    const statisticCount = statisticJudge.reduce((acc, [key]) => { acc[key] = 0; return acc }, {})
    const statisticBox = _('div', {className: 'box01 w420 font_0 text_black', style: {transform:'scale(0.93)',transformOrigin:'left center'}})
    const versionBox = _('div', {className: 'box05 w400 CNDO-version-box'}, [
      _('div', {className: 'genre scroll_point text_white CNDO-version-title', event: {click: e => versionBox.classList.toggle('hide')}}, [_('text', version)]),
      statisticBox,
    ])
    let versionMusicCount = 0
    list.forEach(id => {
      if (!tempKeyedMusicList[id]) return
      versionBox.appendChild(tempKeyedMusicList[id].box.parentNode)
      versionMusicCount++
      statisticJudge.forEach(([key, judge]) => {
        if (judge(tempKeyedMusicList[id])) {
          statisticCount[key]++
        }
      })
    })
    if (versionBox.children.length === 2) return
    const statisticList = statisticJudge.map(([key]) => _('div', { className: 'score_list'}, [
      _('div', {className: 'score_list_top'}, [
        _('img', {src: `${imageBase}/icon_${key}.png`})
      ]),
      _('div', {className: 'score_list_bottom'}, [
        _('div', {className: 'score_num_text'}, [_('text', statisticCount[key])]),
        _('div', {className: 'score_all_text font_small'}, [_('text', `/${versionMusicCount}`)]),
      ]),
    ]))
    statisticList.splice(11, 0, _('br'))
    statisticList.splice(5, 0, _('br'))
    statisticBox.appendChild(_('div', {className: 'score_list_block'}, statisticList))
    container.appendChild(versionBox)
  })
  currentBoxes.forEach(i => i.remove())
  setTimeout(() => applySort.call(sortForm), 50)
}

let totalRating = 0
function addRatingToPage() {
  const musics = [...document.querySelectorAll('.musiclist_box .music_title')].map(addRatingToList)
  if (!musics.length) return

  const boxInfoText = document.querySelector('.box01 .font_x-small')
  if (!boxInfoText) return
	boxInfoText.appendChild(_('br'))
  boxInfoText.appendChild(_('span', {}, [_('text', `${PAGE_TEXT.RATING_AVERAGE[server]}${(totalRating / musics.length).toFixed(3)} (${musics.length}) ${PAGE_TEXT.RATING_TOTAL[server]}${totalRating.toFixed(2)}`)]))
}
function addRatingToList(titleDiv) {
  const dif = getDifFromClass(titleDiv.parentNode)
  if (!dif) return null
  const box = titleDiv.parentNode
  const titleText = titleDiv.lastChild.textContent.trim()
  const level = getLevelByTitleAndDif(titleText, dif) * 1
  const returnData = {
    rating: 0,
    disabled: disabledSongs[server].includes(titleText),
    ratingMax: level + 2.15,
  }
  const scoreBox = box.querySelector('.play_musicdata_highscore .text_b')
  if (!scoreBox) return returnData
  const scoreMax = scoreBox.textContent.replace(/,/g, '')*1

  returnData.rating = getRatingFromConstantAndScore(level, scoreMax)
  addRatingAfterScore(scoreBox, returnData)
	totalRating += Math.floor(returnData.rating *100) /100
  return returnData
}
function addRatingAfterScore(scoreBox, returnData) {
  scoreBox.parentNode.appendChild(_('span', {style: {marginRight: '.5em', fontFamily: 'Arial', float: 'right'}}, [
    _('text', (returnData.rating === returnData.ratingMax ? returnData.rating.toFixed(2) : returnData.rating.toFixed(3)) + ' / ' + returnData.ratingMax.toFixed(2)),
  ]))
}

loadLocalInfo()
if (location.href.indexOf('home/playerData/rating') !== -1) {
  addRatingToPage()
} else {
  initPageOverPower()
  if (document.querySelector('.btn_version') === null && document.querySelector('select[name=genre] *[value="99"][selected]') !== null) {
    reorderPageIntoVersion()
  }
}

})()
