// ==UserScript==
// @name        chuni-net - Character Quests
// @namespace   esterTion
// @license     MIT
// @match       https://chunithm-net-eng.com/mobile/collection/characterList/
// @match       https://new.chunithm-net.com/mobile/collection/characterList/
// @match       https://chunithm.wahlap.com/mobile/collection/characterList/
// @grant       GM.xmlHttpRequest
// @version     1.0.3
// @author      esterTion
// @description Display character quests on chunithm-net
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/514452/chuni-net%20-%20Character%20Quests.user.js
// @updateURL https://update.greasyfork.org/scripts/514452/chuni-net%20-%20Character%20Quests.meta.js
// ==/UserScript==


const host = location.hostname
const server = host === 'new.chunithm-net.com' ? 'jp' : host === 'chunithm-net-eng.com' ? 'ex' : host === 'chunithm.wahlap.com' ? 'cn' : ''
if (!server) throw new Error('unknown server')

// createElement
function _(e,t,i){var a=null;if("text"===e)return document.createTextNode(t);a=document.createElement(e);for(var n in t)if("style"===n)for(var o in t.style)a.style[o]=t.style[o];else if("className"===n)a.className=t[n];else if("event"===n)for(var o in t.event)a.addEventListener(o,t.event[o]);else a.setAttribute(n,t[n]);if(i)if("string"==typeof i)a.innerHTML=i;else if(Array.isArray(i))for(var l=0;l<i.length;l++)null!=i[l]&&a.appendChild(i[l]);return a}

const localStorageTimeKey = 'CNCQ_quests_info_time'
const localStorageDataKey = 'CNCQ_quests_info'
let questInfo = []
function loadLocalInfo() {
  if (!localStorage[localStorageDataKey]) return
  questInfo = JSON.parse(localStorage[localStorageDataKey])
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
      await fetchJson('https://estertion.win/__private__/chuni-intl-quests.json').then(r => questInfo = r)
      break;
    }
    case 'cn': {
      await fetchJson('https://estertion.win/__private__/chuni-chn-quests.json').then(r => questInfo = r)
      break;
    }
  }
  localStorage[localStorageDataKey] = JSON.stringify(questInfo)
  localStorage[localStorageTimeKey] = today
  console.log('stored quest info: ', Object.keys(questInfo).length, 'entries')
  addQuestEntries()
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

const TEXT_STRING = {
  QUEST: {ex: 'Quest: ', cn: '任务：'},
  QUEST_FINISHED: {ex: 'Quest (Finished): ', cn: '任务（已完成）：'},
  TROPHY: {ex: 'Trophy ', cn: '称号 '},
  PLATE: {ex: 'Nameplate ', cn: '名牌 '},
  CHARA: {ex: 'Chara ', cn: '角色 '},
}

function levelNumImageToNum(imgs) {
  return parseInt([...imgs].map(i => i.src.match(/(\d)\.png/)[1]).join(''))
}
function addQuestEntries() {
  const oldElements = document.getElementsByClassName('CNCQ')
  while (oldElements.length) oldElements[0].remove()

  const select = document.querySelector('select[name=idx]')
  const workMap = {}
  const workIdMap = {}
  Array.from(document.querySelectorAll('select[name=idx] option')).forEach(e => {
    const idx = e.value
    if (idx < 0 || idx == 9999) return
    workMap[e.textContent] = {
      idx,
      optionNode: e,
      chara: [],
    }
    workIdMap[idx] = workMap[e.textContent]
  })
  const charaIdMap = {}
  Array.from(document.querySelectorAll('#list .character_list_block')).forEach(e => {
    const charaId = e.querySelector('input[name=chara]').value
    const levelImgs = e.querySelectorAll('.character_list_rank_num img')
    const workId = e.parentNode.getAttribute('name')?.replace(/.*ipId(\d+).*/, '$1')
    if (!workId) return
    charaIdMap[charaId] = {
      node: e.parentNode,
      level: levelNumImageToNum(levelImgs),
    }
    workIdMap[workId].chara.push(charaId)
  })

  questInfo.forEach(quest => {
    const charas = {}
    quest.chara.forEach(c => {
      const chara = charaIdMap[c]
      if (!chara) return
      charas[c] = chara
    })
    // 含有单独角色，需要单开一个分类显示
    const addCategory = Object.keys(charas).length > 0
    quest.works.forEach(w => {
      const work = workMap[w]
      if (!work) return
      work.chara.forEach(c => {
        const chara = charaIdMap[c]
        if (!chara) return
        charas[c] = chara
      })
    })
    const totalLevel = Object.values(charas).reduce((s,i) => s+i.level, 0)
    const lastRewardLevel = quest.stage.slice(-1)[0].level
    const questKey = `QUEST_${quest.id}_`
    if (addCategory) {
      select.appendChild(_('option', { className: 'CNCQ', value: questKey }, [
        _('text', TEXT_STRING[totalLevel < lastRewardLevel ? 'QUEST' : 'QUEST_FINISHED'][server] + `(${totalLevel}/${lastRewardLevel}) ${quest.name}`)
      ]))
      let listContainer
      Object.values(charas).forEach(c => {
        listContainer = c.node.parentNode
        const cloned = listContainer.appendChild(c.node.cloneNode(true))
        cloned.setAttribute('name', `ipId${questKey}`)
        cloned.classList.add('CNCQ')
      })
      listContainer.insertBefore(_('div',{ className: 'box01 w420 mt_25 CNCQ', name: `ipId${questKey}`, style: {display: 'none'}}, [
        _('div', { className: 'character_list_block' }, [
          _('text', TEXT_STRING.QUEST[server]),
          _('br'),
          _('span', { style: { fontSize: '0.8em' } }, [_('text', `${quest.start}～${quest.end}`)]),
          _('table', {}, quest.stage.map(stage => _('tr', { style: { color: stage.level<=totalLevel?'#AAA':'' } }, [
            _('td', { className: 'text_r' }, [_('text', `${totalLevel}/${stage.level}`)]),
            _('td', {}, [_('text', TEXT_STRING[stage.type.toUpperCase()][server] + stage.reward)])
          ])))
        ])
      ]), listContainer.firstChild)
    } else {
      // 每个分类加一个header
      quest.works.forEach(w => {
        const work = workMap[w]
        if (!work) return
        const wid = work.idx
        const listContainer = document.querySelector('#list')
        listContainer.insertBefore(_('div',{ className: 'box01 w420 mt_25 CNCQ', name: `ipId${wid}`, style: {display: 'none'}}, [
          _('div', { className: 'character_list_block' }, [
            _('text', TEXT_STRING.QUEST[server]),
            _('br'),
            _('span', { style: { fontSize: '0.8em' } }, [_('text', `${quest.start}～${quest.end}`)]),
            _('table', {}, quest.stage.map(stage => _('tr', { style: { color: stage.level<=totalLevel?'#AAA':'' } }, [
              _('td', { className: 'text_r' }, [_('text', `${totalLevel}/${stage.level}`)]),
              _('td', {}, [_('text', TEXT_STRING[stage.type.toUpperCase()][server] + stage.reward)])
            ])))
          ])
        ]), listContainer.firstChild)
        // 任务未完成时在分类前添加灰色任务字
        if (totalLevel < lastRewardLevel) {
          select.insertBefore(_('option', { className: 'CNCQ', disabled: '', value: questKey }, [
            _('text', TEXT_STRING.QUEST[server] + `(${totalLevel}/${lastRewardLevel}) ${quest.name}`)
          ]), work.optionNode)
        }
      })
    }
  })
}


loadLocalInfo()
checkUpdateForLocalInfo()
addQuestEntries()
