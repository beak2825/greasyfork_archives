// ==UserScript==
// @name         300战绩查询
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  300战绩查询优化
// @author       apades
// @match        https://300report.jumpw.com/*
// @icon         https://www.google.com/s2/favicons?domain=jumpw.com
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/432789/300%E6%88%98%E7%BB%A9%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/432789/300%E6%88%98%E7%BB%A9%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==

;(async () => {
  const baseAvatarUrl = 'https://300report.jumpw.com/list.html?name='
  const baseMatchUrl = 'https://300report.jumpw.com/match.html'
  const baseImgUrl = `https://300report.jumpw.com/static/images/`
  const api_matchUrl = 'https://300report.jumpw.com/api/getmatch?id='
  const GenMatchTemplate = (data) => {
    let {
      avatarUrl,
      avatarName,
      side,
      destory,
      kd,
      kill,
      money,
      score,
      skill,
      equips,
      isWin,
      scoreStatus,
    } = data
    return `
  <td>
      <img src="${avatarUrl}" alt="" height="48" width="48">
  </td>
  <td>
      ${avatarName}<br>
      上把<span style="color: ${side ? '#fff' : '#db000e'};">${
      side ? '队友' : '对面'
    }</span>
  </td>
  <td>
      ${kd}
  </td>
  <td>
      ${isWin ? '胜利' : '失败'}
  </td>
  <td>
      ${destory}
  </td>
  <td>
      ${kill}
  </td>
  <td>
      ${money}
  </td>
  <td>
      ${score}
  </td>
  <td>
      ${skill.reduce(
        (all, sk) => all + `<img src="${sk}" alt="" height="32" width="32">`,
        ''
      )}
  </td>
  <td>
      ${equips.reduce(
        (all, eq) => all + `<img src="${eq}" alt="" height="32" width="32">`,
        ''
      )}
  </td>
  <td style="color: ${
    (scoreStatus === '牛逼' && '#29c124') ||
    (scoreStatus === '拉跨' && '#db000e') ||
    '#fff'
  };">
      ${scoreStatus}
  </td>
  `
  }

  let $$ = (query) => [...document.querySelectorAll(query)]
  let isUrl = (baseUrl) => location.href.indexOf(baseUrl) === 0
  const req = (...args) =>
    new Promise((resolve) =>
      fetch(...args)
        .then((res) => res.json())
        .then((res) => {
          resolve(res)
        })
    )

  // let $ = document.querySelectorAll
  /**@type {{ mid:string,isWin:boolean}[]} */
  let midList = GM_getValue('midList') || []
  if (midList) {
    midList = JSON.parse(midList)
  }

  if (isUrl(baseMatchUrl)) {
    let mid = new URLSearchParams(location.search).get('id')
    let aElList = $$('td a')
    // - 覆盖css
    let cssEl = document.createElement('style')
    cssEl.textContent = `#com .divbd_c .list_bx{
        width:auto;
    }`
    document.head.appendChild(cssEl)

    // - header加上团分项
    let headerElList = $$('tbody > tr:nth-child(1)')
    headerElList.forEach((el) => {
      let toAddEl = document.createElement('th')
      toAddEl.textContent = '团分'
      el.appendChild(toAddEl)
    })

    let nowMatchIndex = midList.findIndex((m) => m.mid === mid)
    let nowMatch = midList[nowMatchIndex],
      nowMatchData = await req(api_matchUrl + nowMatch.mid),
      nowMatchDataMap = {}
    // - 生成这一把数据map
    if (nowMatchData) {
      let wmax = 0,
        wmin = 0,
        wmaxData,
        wminData
      nowMatchData.Match.WinSide.forEach((roleData) => {
        roleData.isWin = true
        nowMatchDataMap[roleData.RoleName] = roleData

        let score = roleData.KDA
        if (score > wmax) {
          wmax = score
          wmaxData = roleData
        }
        if (score < wmin) {
          wmin = score
          wminData = roleData
        }
      })
      wmaxData && (wmaxData.scoreStatus = '牛逼')
      wminData && (wminData.scoreStatus = '拉跨')

      let lmax = 0,
        lmin = 0,
        lmaxData,
        lminData
      nowMatchData.Match.LoseSide.forEach((roleData) => {
        roleData.isWin = false
        nowMatchDataMap[roleData.RoleName] = roleData

        let score = roleData.KDA
        if (score > lmax) {
          lmax = score
          lmaxData = roleData
        }
        if (score < lmin) {
          lmin = score
          lminData = roleData
        }
      })
    }

    let preMatch = midList[nowMatchIndex + 1]
    let preMatchData,
      preMatchDataMap = {}
    // - 生成上一把数据map
    if (preMatch) {
      preMatchData = await req(api_matchUrl + preMatch.mid)
      let wmax = 0,
        wmin = 0,
        wmaxData,
        wminData
      preMatchData.Match.WinSide.forEach((roleData) => {
        roleData.isWin = true
        preMatchDataMap[roleData.RoleName] = roleData

        let score = roleData.KDA
        if (score > wmax) {
          wmax = score
          wmaxData = roleData
        }
        if (score < wmin) {
          wmin = score
          wminData = roleData
        }
      })
      wmaxData && (wmaxData.scoreStatus = '牛逼')
      wminData && (wminData.scoreStatus = '拉跨')

      let lmax = 0,
        lmin = 0,
        lmaxData,
        lminData
      preMatchData.Match.LoseSide.forEach((roleData) => {
        roleData.isWin = false
        preMatchDataMap[roleData.RoleName] = roleData

        let score = roleData.KDA
        if (score > lmax) {
          lmax = score
          lmaxData = roleData
        }
        if (score < lmin) {
          lmin = score
          lminData = roleData
        }
      })
      lmaxData && (lmaxData.scoreStatus = '牛逼')
      lminData && (lminData.scoreStatus = '拉跨')
    }

    let avatarList = aElList.map((el) => {
      let containerEl = el.parentElement.parentElement
      let url = decodeURI(el.href)
      let name = url.replace(baseAvatarUrl, '')
      let match = new RegExp(`${name[0]}.*${name[name.length - 1]}`)

      el.innerHTML = el.innerHTML.replace(match, name)

      let tScore = nowMatchDataMap[name].ELO
      let tScoreEl = document.createElement('td')
      tScoreEl.textContent = tScore
      containerEl.appendChild(tScoreEl)

      // 上一把数据
      if (preMatchData && preMatchDataMap[name]) {
        let roleData = preMatchDataMap[name]
        let toAddEl = document.createElement('tr')
        toAddEl.style = 'border:1px solid #0072ff;'
        let innerHTML = GenMatchTemplate({
          avatarName: roleData.Hero.Name,
          avatarUrl: baseImgUrl + roleData.Hero.IconFile,
          destory: roleData.TowerDestroy,
          kill: roleData.KillUnitCount,
          equips: roleData.Equip.map((eq) => baseImgUrl + eq.IconFile),
          kd: `${roleData.KillCount}/${roleData.DeathCount}/${roleData.AssistCount}`,
          money: roleData.TotalMoney,
          score: roleData.KDA,
          side: preMatch.isWin === roleData.isWin,
          skill: roleData.Skill.map((eq) => baseImgUrl + eq.IconFile),
          isWin: roleData.isWin,
          scoreStatus: roleData.scoreStatus || '普通',
        })
        toAddEl.innerHTML = innerHTML
        containerEl.insertAdjacentElement('afterend', toAddEl)
      }
      return {
        name,
      }
    })
  }

  if (isUrl(baseAvatarUrl)) {
    let list = $$('table:last-of-type tr[onclick]')

    let midList = list.map((el) => {
      let onclickScript = el.getAttribute('onclick')
      let reg = /match\.html\?id=(.*?)'/
      let mid = onclickScript.match(reg)[1],
        isWin = el.children[2].textContent === '胜利'
      return {
        mid,
        isWin,
      }
    })

    GM_setValue('midList', JSON.stringify(midList))
  }
})()
