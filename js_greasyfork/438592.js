// ==UserScript==
// @name         cainiaofanli增强
// @namespace    https://greasyfork.org/zh-CN/users/177458-bd777
// @version      1.4.1
// @description  增强
// @author       windeng
// @match        http://fd.cainiaofanli.cn/*
// @icon         https://yun-resource.nianchu.net/brand-oem/yun_cainiaofanli_com.png
// @require      https://greasyfork.org/scripts/433877-%E4%B8%AA%E4%BA%BA%E5%B8%B8%E7%94%A8%E7%9A%84%E4%B8%80%E4%BA%9B%E7%AE%80%E5%8D%95%E5%87%BD%E6%95%B0-%E5%8B%BF%E5%AE%89%E8%A3%85/code/%E4%B8%AA%E4%BA%BA%E5%B8%B8%E7%94%A8%E7%9A%84%E4%B8%80%E4%BA%9B%E7%AE%80%E5%8D%95%E5%87%BD%E6%95%B0%EF%BC%8C%E5%8B%BF%E5%AE%89%E8%A3%85.js?version=978987
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      tencentcs.com
// @connect      wukongapi.recit.cn
// @connect      wukongapi.recit.cn:30000
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438592/cainiaofanli%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/438592/cainiaofanli%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

const ServerHost = 'wukongapi.recit.cn'

async function retryDo (p, retry) {
  retry = retry || 3
  for (let i=0; i<retry; i++) {
    try {
      return await p
    } catch(err) {
      if (i+1 == retry) {
        throw err
      }
      await Sleep(1)
    }
  }
}

async function updateAccounts(data) {
  const url = `http://${ServerHost}/api/CaiNiaoFanLi/UpdateAccounts`
  return Post(url, {
    headers: {
      'Cookie': 'token=12oioi2n!24d'
    },
    data: JSON.stringify(data)
  })
}

async function getAccountsStatus() {
  const url = `http://${ServerHost}/api/CaiNiaoFanLi/AccountStatus`
  return Get(url, {
    headers: {
      'Cookie': 'token=12oioi2n!24d'
    }
  }).then(res => {
    console.log('getAccountsStatus', res)
    let data = {}
    res.data.forEach(d => {
      data[d.wxid] = d
    })
    return data
  })
}

async function checkStatus(user, wxid) {
  const status = await getAccountsStatus()
  if (status[wxid] && status[wxid].user && status[wxid].user !== user) {
    alert(`该账号正在被 ${status[wxid].user} 使用中，${user}不能更改`)
    return false
  }
  return true
}

async function lockAccount(wxid, user) {
  const url = `http://${ServerHost}/api/CaiNiaoFanLi/AccountStatus`
  return Post(url, {
    headers: {
      'Cookie': 'token=12oioi2n!24d',
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      action: 'lock',
      wxid: wxid,
      user: user
    })
  }).then(res => {
    console.log('lockAccount', res)
    return res
  })
}

async function releaseAccount(wxid, user) {
  const url = `http://${ServerHost}/api/CaiNiaoFanLi/AccountStatus`
  return Post(url, {
    headers: {
      'Cookie': 'token=12oioi2n!24d',
      'Content-Type': 'application/json'
    },
    data: JSON.stringify({
      action: 'release',
      wxid: wxid,
      user: user
    })
  }).then(res => {
    console.log('releaseAccount', res)
    return res
  })
}

function getUserToken() {
  const res = localStorage.getItem('pro__Access-Token')
  if (res) {
    return JSON.parse(res).value
  }
}

async function authGet(url, opt = {}) {
  const token = getUserToken()
  if (!opt.headers) opt.headers = {}
  opt.headers['user-token'] = token
  return Get(url, opt)
}

async function authPost(url, opt = {}) {
  const token = getUserToken()
  if (!opt.headers) opt.headers = {}
  opt.headers['user-token'] = token
  return Post(url, opt)
}

async function getAccounts() {
  const url = 'https://service-fppf6nhp-1301483065.bj.apigw.tencentcs.com/api/5f0e67c76583b?pageNo=0&pageSize=2000&page=1&size=2000&graduate_time='
  return authGet(url).then(res => {
    console.log('getAccounts', res)
    updateAccounts(res.data.list)
    return res.data.list.filter(acc => Boolean(acc.relation_to_robot[0]))
  })
}

async function getGroups(robotId, page, pageSize) {
  const url = `https://service-fppf6nhp-1301483065.bj.apigw.tencentcs.com/api/5f37c1d9ce3b1?page=${page}&size=${pageSize}&robot_id=${robotId}`
  return authGet(url).then(res => {
    // console.log('getGroups', robotId, res)
    return res.data
  })
}

async function getAllGroups(robotId) {
  let resp = []
  for (let i = 0; i < 1000; ++i) {
    const data = await retryDo(getGroups(robotId, i + 1, 500))
    resp = resp.concat(data.list)
    if (resp.length >= data.count) break
  }
  return resp
}

async function updateGroups(groupIdList, robotWxid, data) {
  const realData = Object.assign({
    ids: JSON.stringify(groupIdList),
    robot_wx_id: robotWxid
  }, data)
  // data.ids = JSON.stringify(groupIdList)
  // data.robot_wx_id = robotWxid
  const url = 'https://service-fppf6nhp-1301483065.bj.apigw.tencentcs.com/api/5f37c4bb890b0'
  return authPost(url, {
    data: JSON.stringify(realData),
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  }).then(res => {
    console.log('updateGroups', groupIdList, robotWxid, realData, res)
    return res
  })
}

async function getGrouping(page) {
  // 分组数据
  startLoading(`获取分组数据 第${page}页`)
  const url = `https://service-fppf6nhp-1301483065.bj.apigw.tencentcs.com/api/5fa65580000d6?pageNo=${page}&pageSize=10&page=${page}&size=10`
  return authGet(url).then(res => {
    console.log('getGrouping', res)
    stopLoading()
    return res.data
  })
}

async function getAllGrouping() {
    let resp = []
    for (let page=1; page<100; ++page) {
        let data = await getGrouping(page)
        resp = resp.concat(data.list)
        if (resp.length >= data.count) break
    }
    console.log('getAllGrouping', resp)
    return resp
}

async function startLoading(wording) {
  let elem = document.createElement('div')
  elem.innerHTML = `<div style="text-align: center;">
  <div><span class="ant-spin-dot ant-spin-dot-spin"><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i><i class="ant-spin-dot-item"></i></span></div>
  <div><span>${wording}</span></div>
</div>`
  elem.setAttribute('style', 'position: fixed; top: 100px; left: 100px; z-index: 3000; background-color: rgba(255, 255, 255, 0.9); padding: 30px;')
  elem.setAttribute('_c', 'loading')
  document.body.appendChild(elem)
}

async function stopLoading() {
  let elem = document.querySelector('div[_c="loading"]')
  elem.remove()
}

async function getAllAccountsAndGroups () {
  startLoading('正在获取账号和微信群数据')
  let accounts = await retryDo(getAccounts())
  let groups = {}

  let p = []
  for (let i = 0; i < accounts.length; ++i) {
    const acc = accounts[i]
    if (!acc.relation_to_robot[0]) continue
    const robotId = acc.relation_to_robot[0].id
    groups[robotId] = []
    p.push(getAllGroups(robotId))
    await Sleep(0.1)
  }

  async function prepareAllData() {
    return Promise.all(p).then(res => {
      // console.log('all', res)
      for (let d of res) {
        if (d.length > 0) {
          const robotId = d[0].robot_id
          groups[robotId] = d
        }
      }
    })
  }
  await prepareAllData()

  console.log('账号和群组数据', accounts, groups)
  stopLoading()

  return {
    accounts: accounts,
    groups: groups
  }
}

async function setChatroomGrouping (groupId, chatroomIds) {
  // 设置微信群所属分组
  const realData = {
    ids: chatroomIds,
    group_id: groupId
  }
  const url = 'https://service-fppf6nhp-1301483065.bj.apigw.tencentcs.com/api/5fa66801b8621'
  return authPost(url, {
    data: JSON.stringify(realData),
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  }).then(res => {
    console.log('setChatroomGrouping', groupId, chatroomIds, realData, res)
    return res
  })
}

async function syncChatrooms (robotWxid) {
  const url = 'https://service-fppf6nhp-1301483065.bj.apigw.tencentcs.com/api/5f37c177475c2'
  const realData = {
    robot_wx_id: robotWxid
  }
  return authPost(url, {
    data: JSON.stringify(realData),
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  }).then(res => {
    console.log('syncChatrooms', realData, res)
    return res
  })
}

function getTag(groups) {
  // 如果某一组群都是发单群，则返回这个组的信息，否则返回null
  let resp = null
  let count = 0
  for (let i = 0; i < groups.length; ++i) {
    const d = groups[i]
    if (d.is_billing === 1) {
      // 发单群
      if (!d.relation_to_group) return null
      if (!resp) {
        resp = d.relation_to_group
        ++count
      } else {
        if (resp.id !== d.relation_to_group.id) return null
        ++count
      }
    } else {
      // 非发单群
      if (d.relation_to_group && resp && d.relation_to_group.id === resp.id) return null
    }
  }
  // console.log('getTags', count, resp)
  return resp
}

function getTags(groups, stat) {
  // 按发单群分组聚合
  // console.log('getTags', groups, stat)
  let resp = {}
  for (let d of groups) {
    if (d.is_billing === 1) {
      if (!d.relation_to_group) continue
      if (!resp[d.relation_to_group.id]) {
        resp[d.relation_to_group.id] = {
          list: [],
          stat: stat.groups[d.relation_to_group.id]
        }
      }
      resp[d.relation_to_group.id].list.push(d.relation_to_group)
    }
  }
  return Object.values(resp)
}

function statGroups(groups) {
  let stat = {
    groups: {},
    total: groups.length,
    is_billing: 0,
    is_collection: 0
  }
  groups.forEach(d => {
    if (d.is_billing === 1) ++stat.is_billing
    if (d.is_collection === 1) ++stat.is_collection
    if (d.relation_to_group) {
      if (!stat.groups[d.relation_to_group.id]) {
        stat.groups[d.relation_to_group.id] = d.relation_to_group
        stat.groups[d.relation_to_group.id].total = 0
        stat.groups[d.relation_to_group.id].is_billing = 0
        stat.groups[d.relation_to_group.id].is_collection = 0
      }
      ++stat.groups[d.relation_to_group.id].total
      if (d.is_billing === 1) ++stat.groups[d.relation_to_group.id].is_billing
      if (d.is_collection === 1) ++stat.groups[d.relation_to_group.id].is_collection
    } else {
      if (!stat.groups.empty) {
        stat.groups.empty = {
          groups_name: '未分组',
          total: 0,
          is_billing: 0,
          is_collection: 0
        }
      }
      ++stat.groups.empty.total
      if (d.is_billing === 1) ++stat.groups.empty.is_billing
      if (d.is_collection === 1) ++stat.groups.empty.is_collection
    }
  })
  return stat
}

function getUsername() {
  const userElem = document.querySelector('input[name="username"]')
  if (!userElem) {
    alert('请刷新页面后填入用户名称再试')
    return
  }
  const user = userElem.value.trim()
  if (!user) {
    alert('请填入使用者名称')
    return
  }
  // 存一发localStorage
  GM_setValue('_username', user)
  return user
}

async function addAccountsElem(accounts, groups) {
  // 展示账号列表
  await WaitUntil(() => {
    return !!document.querySelector('div.content')
  })

  // 删掉之前存在的
  let oldElem = document.querySelector('div[_cid="account-list"]')
  if (oldElem) oldElem.remove()

  let contentElem = document.querySelector('div.content')

  let stats = {}
  let tags = {}
  let tagsList = {}
  for (let robotId in groups) {
    stats[robotId] = statGroups(groups[robotId])
    tags[robotId] = getTag(groups[robotId])
    tagsList[robotId] = getTags(groups[robotId], stats[robotId])
  }

  let status = await getAccountsStatus()
  console.log('getAccountsStatus', status)

  const trHtmls = accounts.map((acc, index) => {
    const robotId = acc.relation_to_robot[0].id
    const wxid = acc.relation_to_robot[0].wx_id
    const stat = stats[robotId]
    // const tag = tags[robotId]
    const tagList = tagsList[robotId]
    // console.log('tagList', tagList)
    // console.log(robotId, stats[robotId])
    let groupStatDiv = []
    for (let key in stat.groups) {
      const d = stat.groups[key]
      groupStatDiv.push(`<div style="margin: 7px 10px 7px 0;">
  <b>${d.groups_name}</b>
  <span>总数: ${d.total}; 发单: ${d.is_billing}; 采集: ${d.is_collection}</span>
</div>`)
    }
    let collectionListHtml = []
    for (let g of groups[robotId]) {
      if (g.is_collection === 1) collectionListHtml.push(`<div class="ant-tag ant-tag-green">${g.group_nickname}</div>`)
    }
    collectionListHtml = collectionListHtml.join('\n') // 采集群

    let actionHtmls = []
    let grouping = {}
    groups[robotId].forEach(d => {
      if (!d.relation_to_group) return
      grouping[d.relation_to_group.id] = d.relation_to_group
    })
    for (let key in grouping) {
      const g = grouping[key]
//       actionHtmls.push(`<button style="margin-bottom: 5px;" class="ant-btn ant-btn-primary ant-btn-block" type="button" robot-id="${robotId}" group-id="${key}" group-name="${g.groups_name}" wxid="${acc.relation_to_robot[0].wx_id}">
//   <span>设为发单群：${g.groups_name}</span>
// </button>`)
//       actionHtmls.push(`<input type="checkbox" class="ant-checkbox-input" value="${robotId}|${key}|${acc.relation_to_robot[0].wx_id}">
//   <span>${g.groups_name}</span>
// </input>`)
      const id = `${robotId}|${key}|${acc.relation_to_robot[0].wx_id}`
      actionHtmls.push(`<p>
  <input type="checkbox" id="${id}" value robot-id="${robotId}" group-id="${key}" group-name="${g.groups_name}" wxid="${acc.relation_to_robot[0].wx_id}">
  <label for="${id}">${g.groups_name}</label>
</p>`)
    }
    const tagListHtml = tagList.map(tag => {
      if (tag.list.length === tag.stat.total) return `<div class="ant-tag ant-tag-blue">${tag.stat.groups_name}（${tag.list.length}/${tag.stat.total}）</div>`
      else return `<div class="ant-tag ant-tag-red">${tag.stat.groups_name}（${tag.list.length}/${tag.stat.total}）</div>`
    }).join('\n')
    actionHtmls.push(`<div>
  <!-- <button class="ant-btn" type="button" name="lock-account" wxid="${acc.relation_to_robot[0].wx_id}" robot-id="${robotId}">我要使用</button> -->
  <button style="margin-bottom: 5px;" class="ant-btn ant-btn-block ant-btn-danger" type="button" name="set-as-send" wxid="${acc.relation_to_robot[0].wx_id}" robot-id="${robotId}">设为发单群</button>
  <button class="ant-btn ant-btn-block" type="button" name="release-account" wxid="${acc.relation_to_robot[0].wx_id}" robot-id="${robotId}">暂不使用 & 取消所有发单群</button>
</div>`)
    return `<tr class="ant-table-row ant-table-row-level-0" data-row-key="${index}">
  <td class="">
    <div>${acc.relation_to_robot[0].nickname}（${acc.remark}）</div>
    <div>${acc.username}</div>
    <div>${acc.relation_to_robot[0].wx_id}</div>
  </td>
  <td class="">
    <div>${tagListHtml}</div>
    <div>${collectionListHtml}</div>
    <div>${status[wxid] && status[wxid].user ? `<div class="ant-tag ant-tag-red">${status[wxid].user} 正在使用</div>` : ''}</div>
  </td>
  <td class="">总数: ${stat.total}; 发单: ${stat.is_billing}; 采集: ${stat.is_collection}</td>
  <td class="">${groupStatDiv.join('')}</td>
  <td class="">${actionHtmls.join('')}</td>
</tr>`
  })
  let div = document.createElement('div')
  const user = GM_getValue('_username') || ''
  div.innerHTML = `<div _cid="account-list" class="ant-card"><div class="ant-card-body">
<input type="text" class="ant-input" style="margin-bottom: 5px;" placeholder="使用者名称" name="username" value="${user}" />
<div class="ant-table ant-table-scroll-position-left ant-table-default">
  <div class="ant-table-content">
    <!---->
    <div class="ant-table-body">
      <table class="">
        <thead class="ant-table-thead">
          <tr>
            <th key="nickname" class=""><span class="ant-table-header-column">
                <div><span class="ant-table-column-title">账号</span><span class="ant-table-column-sorter"></span></div>
              </span></th>
            <th key="tag" class=""><span class="ant-table-header-column">
                <div><span class="ant-table-column-title">标签</span><span class="ant-table-column-sorter"></span>
                </div>
              </span></th>
            <th key="stat" class=""><span class="ant-table-header-column">
                <div><span class="ant-table-column-title">群统计</span><span class="ant-table-column-sorter"></span>
                </div>
              </span></th>
            <th key="stat" class=""><span class="ant-table-header-column">
                <div><span class="ant-table-column-title">分组统计</span><span class="ant-table-column-sorter"></span>
                </div>
              </span></th>
            <th key="stat" class=""><span class="ant-table-header-column">
                <div><span class="ant-table-column-title">操作</span><span class="ant-table-column-sorter"></span>
                </div>
              </span></th>
          </tr>
        </thead>
        <tbody class="ant-table-tbody">
          ${trHtmls.join('\n')}
        </tbody>
      </table>
    </div>
  </div>
</div></div></div>`
  contentElem.parentNode.insertBefore(div, contentElem)

  // add listener
  // let btnList = div.querySelectorAll('button[robot-id]')
  // btnList.forEach(btn => {
  //   const robotId = btn.getAttribute('robot-id')
  //   const groupId = parseInt(btn.getAttribute('group-id'))
  //   const wxid = btn.getAttribute('wxid')
  //   const groupName = btn.getAttribute('group-name')
  //   // console.log(btn, robotId, groupId)
  //   btn.onclick = async () => {
  //     console.log('click button', wxid, robotId, groupId)
  //     const user = getUsername()
  //     if (!user) return
  //     const statusOk = await checkStatus(user, wxid)
  //     if (!statusOk) return

  //     const lockRes = await lockAccount(wxid, user)
  //     // 上面checkStatus保证就行
  //     /*
  //     if (lockRes.errcode !== 0) {
  //         alert(lockRes.errmsg)
  //         return
  //     }
  //     */

  //     let groups = await getAllGroups(robotId)
  //     const targets = groups.filter(d => d.group_id === groupId)
  //     const nontargets = groups.filter(d => d.group_id !== groupId)
  //     await updateGroups(nontargets.map(d => d.id), wxid, { is_billing: '-1' }).then(res => {
  //       alert(`将非${groupName}取消发单群：${res.msg}`)
  //     })
  //     await updateGroups(targets.map(d => d.id), wxid, { is_billing: '1' }).then(res => {
  //       alert(`将${groupName}设为发单群：${res.msg}`)
  //     })
  //     await Sleep(0.5)

  //     var _data = await getAllAccountsAndGroups()
  //     addAccountsElem(_data.accounts, _data.groups)
  //   }
  // })

  // 批量选择分组的结果初始化到选项中
  let batchInputs = document.querySelectorAll('input[t="batch-check-grouping"]')
  for (let i=0; i<batchInputs.length; ++i) {
    let input = batchInputs[i]
    const groupId = input.getAttribute('id')
    Array.from(document.querySelectorAll(`input[group-id="${groupId}"]`)).forEach(elem => {
      elem.checked = input.checked
    })
  }

  let btnList = div.querySelectorAll('button[name="set-as-send"]')
  btnList.forEach(btn => {
    const robotId = btn.getAttribute('robot-id')
    const groupId = parseInt(btn.getAttribute('group-id'))
    const wxid = btn.getAttribute('wxid')
    const groupName = btn.getAttribute('group-name')
    // console.log(btn, robotId, groupId)
    btn.onclick = async () => {
      console.log('click button', wxid, robotId)
      // 看选了啥
      const checkboxList = div.querySelectorAll(`input[robot-id="${robotId}"]`)
      let checkedGroupIds = {}
      for (let checkbox of checkboxList) {
        if (checkbox.checked) {
          const groupId = parseInt(checkbox.getAttribute('group-id'))
          const groupName = checkbox.getAttribute('group-name')
          checkedGroupIds[groupId] = groupName
          console.log(`机器人 ${robotId} 已选择 ${groupId} ${groupName}`)
        }
      }
      if (Object.keys(checkedGroupIds).length === 0) {
        alert(`至少选择一个分组才能设为发单群`)
        return
      }

      const user = getUsername()
      if (!user) return
      const statusOk = await checkStatus(user, wxid)
      if (!statusOk) return

      const lockRes = await lockAccount(wxid, user)

      let groups = await getAllGroups(robotId)
      const targets = groups.filter(d => d.group_id in checkedGroupIds)
      const nontargets = groups.filter(d => !(d.group_id in checkedGroupIds))
      await updateGroups(nontargets.map(d => d.id), wxid, { is_billing: '-1' }).then(res => {
        alert(`取消发单群个数 ${nontargets.length}：${res.msg}`)
      })
      await updateGroups(targets.map(d => d.id), wxid, { is_billing: '1' }).then(res => {
        alert(`设为发单群个数 ${targets.length}：${res.msg}`)
      })
      await Sleep(0.5)

      var _data = await getAllAccountsAndGroups()
      addAccountsElem(_data.accounts, _data.groups)
    }
  })

  let lockBtnList = div.querySelectorAll('button[name="lock-account"]')
  lockBtnList.forEach(btn => {
    const wxid = btn.getAttribute('wxid')
    btn.onclick = async () => {
      const user = getUsername()
      if (!user) return
      const res = await lockAccount(wxid, user)
      if (res.errcode === 0) {
        var _data = await getAllAccountsAndGroups()
        addAccountsElem(_data.accounts, _data.groups)
      }
      alert(res.errmsg)
    }
  })

  let releaseBtnList = div.querySelectorAll('button[name="release-account"]')
  releaseBtnList.forEach(btn => {
    const wxid = btn.getAttribute('wxid')
    const robotId = btn.getAttribute('robot-id')
    btn.onclick = async () => {
      const user = getUsername()
      if (!user) return
      const res = await releaseAccount(wxid, user)
      if (res.errcode === 0) {
        let groups = await getAllGroups(robotId)
        const nontargets = groups
        await updateGroups(nontargets.map(d => d.id), wxid, { is_billing: '-1' }).then(res => {
          alert(`取消所有发单群：${res.msg}`)
        })
        var _data = await getAllAccountsAndGroups()
        addAccountsElem(_data.accounts, _data.groups)
      }
      alert(res.errmsg)
    }
  })
}

function onAccountChange(wxid) {
  console.log('onAccountChange', wxid)
}

function getSelectedWxid() {
  let e = document.querySelector('div.content div.ant-card div.ant-card-meta-description')
  const matches = e.innerText.match(/微信ID：(\w+)/)
  if (matches && matches[1]) {
    return matches[1]
  }
}

async function observeAccountChange() {
  await WaitUntil(() => {
    return !!document.querySelector('div.content div.ant-card > div.ant-card-body > div.ant-card-meta')
  })

  function run() {
    let e = document.querySelector('div.content div.ant-card div.ant-card-meta-description')
    const matches = e.innerText.match(/微信ID：(\w+)/)
    if (matches && matches[1]) {
      onAccountChange(matches[1])
    }
    // let wxid = e.innerText.match(/微信ID：(\w+)/)[1] // 微信ID：wxid_4dkeuwkn33i122
    // onAccountChange(wxid)
  }

  run()

  let observer = new MutationObserver(function (mutations) {
    // TODO do sth.
    // console.log('mutations', mutations)
    // console.log('?????')
    run()
  })

  let elem = document.querySelector('div.content div.ant-card > div.ant-card-body > div.ant-card-meta')
  // console.log('elem exists', elem)
  observer.observe(elem, {
    childList: true,
    subtree: true,
    attributes: true
  })
}

async function addBatchSetChatroomGroupButton (accounts, groups, groupings) {
  // 在选定的账号微信群列表的分组一列里加按钮：将所有账号的这个微信群设为这个组
  // TODO
  await WaitUntil(() => {
    return !!document.querySelector('.content .table-wrapper table > tbody')
  })

  function _run() {
    let rows = document.querySelectorAll('.content .table-wrapper table > tbody > tr')
    // console.log('rows', rows)
    rows.forEach(row => {
      const chatroomId = parseInt(row.getAttribute('data-row-key'))
      let tds = row.querySelectorAll('td')
      // console.log(tds)
      if (tds.length < 10) return
      let groupTd = tds[3]
      let chatroomTd = tds[9]
      if (!groupTd.querySelector('span.ant-tag')) return

      // insert button
      if (!groupTd.querySelector('button[_c="sync-button"]')) {
        let btn = document.createElement('button')
        btn.setAttribute('class', 'ant-btn ant-btn-primary ant-btn-sm')
        btn.setAttribute('type', 'button')
        btn.setAttribute('_c', 'sync-button')
        btn.innerHTML = '同步所有账号'
        btn.onclick = async () => {
          let row = document.querySelector(`.content .table-wrapper table > tbody > tr[data-row-key="${chatroomId}"]`)
          let tds = row.querySelectorAll('td')
          if (tds.length < 10) {
            alert('同步失败: 获取群id失败')
            return
          }
          if (!groupTd.querySelector('span.ant-tag')) {
            alert('请确定分组之后再同步')
            return
          }
          let groupName = groupTd.querySelector('span.ant-tag').innerText.trim()
          let chatroom = chatroomTd.innerText
          let groupId
          if (groupName === '未分组') {
            groupId = 0
          } else {
            const grouping = groupings.filter(g => g.groups_name === groupName)[0]
            if (!grouping) {
              alert('找不到分组信息')
              return
            }
            groupId = grouping.id
          }
          let chatroomIds = []
          accounts.forEach(acc => {
            const robotId = acc.relation_to_robot[0].id
            if (groups[robotId]) {
              const chatroomObj = groups[robotId].filter(g => g.group_wx_id === chatroom)[0]
              if (chatroomObj) {
                chatroomIds.push(chatroomObj.id)
              }
            }
          })
          console.log('同步所有账号', chatroomId, groupName, groupId, chatroom, chatroomIds)
          setChatroomGrouping(groupId, chatroomIds).then(res => {
            alert(`更新${chatroomIds.length}个微信群所属分组: ${res.msg}`)
          })
        }
        groupTd.appendChild(btn)
      }
    })
  }

  function run() {
    try {
      _run()
    } catch(err) {
      console.error('addBatchSetChatroomGroupButton', err)
    }
  }

  run()

  let observer = new MutationObserver(function (mutations) {
    run()
  })

  let elem = document.querySelector('.content .table-wrapper table > tbody')
  observer.observe(elem, {
    childList: true,
    subtree: true
  })

}

async function addBatchSyncChatroomsButton (accounts) {
  await WaitUntil(() => {
    return !!document.querySelector('.table-operator')
  })

  let firstButton = document.querySelector('.table-operator > button')
  let btn = document.createElement('button')
  btn.setAttribute('type', 'button')
  btn.setAttribute('class', 'ant-btn ant-btn-primary')
  btn.setAttribute('_c', 'batch-sync-chatrooms')
  btn.innerHTML = '同步全部账号微信群'
  btn.onclick = async () => {
    let ps = []
    for (let acc of accounts) {
      for (let robot of acc.relation_to_robot) {
        if (robot.wx_id) {
          let p = syncChatrooms(robot.wx_id)
          ps.push(p)
          await Sleep(0.1)
        }
      }
    }
    Promise.all(ps).then(res => {
      let msg = `已同步${res.length}个账号的微信群：`
      for (let d of res) {
        msg += d.msg + '|'
      }
      alert(msg)
    })
  }
  firstButton.parentElement.insertBefore(btn, firstButton)
}

async function syncWechatChatroomGroups (accounts, groups) {
  console.log('syncWechatChatroomGroups', accounts, groups)
  await WaitUntil(() => {
    return !!document.querySelector('div.content div.ant-card > div.ant-card-body > div.ant-card-meta > div.ant-card-meta-detail')
  })

  let elem = document.querySelector('div.content div.ant-card > div.ant-card-body > div.ant-card-meta > div.ant-card-meta-detail')
  if (elem.querySelector('div[_c="sync-wechat-chatroom-groups"]')) return

  let div = document.createElement('div')
  div.setAttribute('_c', 'sync-wechat-chatroom-groups')
  div.innerHTML = `<input type="text" id="sync-wechat-chatroom-groups-wxid" class="ant-input" style="width: 250px;" placeholder="要同步的账号的wxid" />`
  let btn = document.createElement('button')
  btn.setAttribute('type', 'button')
  btn.setAttribute('class', 'ant-btn ant-btn-primary')
  btn.innerHTML = '同步微信群分组'
  div.appendChild(btn)
  elem.appendChild(div)

  btn.onclick = async () => {
    const targetWxid = document.getElementById('sync-wechat-chatroom-groups-wxid').value
    const currentWxid = document.querySelector('div.content div.ant-card > div.ant-card-body > div.ant-card-meta > div.ant-card-meta-detail > div.ant-card-meta-description').innerText.split('：')[1].trim()
    console.log('同步微信群分组-wxid', currentWxid, targetWxid)

    const targetAcc = accounts.filter(acc => acc.relation_to_robot[0].wx_id === targetWxid)[0]
    if (!targetAcc) {R
      alert(`找不到账号 ${targetWxid}`)
      return
    }
    const currentAcc = accounts.filter(acc => acc.relation_to_robot[0].wx_id === currentWxid)[0]
    console.log('同步微信群分组-账号', currentAcc, targetAcc)

    const currentRobotId = currentAcc.relation_to_robot[0].id
    const targetRobotId = targetAcc.relation_to_robot[0].id

    const currentGroups = groups[currentRobotId]
    const targetGroups = groups[targetRobotId]
    console.log('同步微信群分组-群组', currentGroups, targetGroups)

    let targetChatroom2Info = {}
    for (let group of targetGroups) {
      if (group.relation_to_group && group.relation_to_group.id !== undefined) targetChatroom2Info[group.group_wx_id] = group
    }

    let groupId2Chatrooms = {}
    for (let group of currentGroups) {
      if (group.group_wx_id in targetChatroom2Info) {
        const g = targetChatroom2Info[group.group_wx_id]
        if (!groupId2Chatrooms[g.relation_to_group.id]) {
          groupId2Chatrooms[g.relation_to_group.id] = {
            list: [],
            groupsName: g.relation_to_group.groups_name
          }
        }
        groupId2Chatrooms[g.relation_to_group.id].list.push(group)
      }
    }

    console.log('同步微信群分组-groupId2Chatrooms', groupId2Chatrooms)
    for (let groupId in groupId2Chatrooms) {
      groupId = parseInt(groupId)
      const groupsName = groupId2Chatrooms[groupId].groupsName
      const chatroomIds = groupId2Chatrooms[groupId].list.map(d => d.id)
      console.log('同步微信群分组-设置', groupId, groupsName, chatroomIds)
      await setChatroomGrouping(groupId, chatroomIds).then(res => {
        alert(`更新${chatroomIds.length}个微信群所属分组 ${groupsName}: ${res.msg}`)
      })
    }
    var _data = await getAllAccountsAndGroups()
    addAccountsElem(_data.accounts, _data.groups)
  }
}

async function addChatroomSectionConfig (accounts, groups, groupings) {
  // 将某个区间的群设为某个分组
  await WaitUntil(() => {
    return !!document.querySelector('div.content')
  })

  if (document.querySelector('div[_c="chatroom-section-config"]')) return

  let contentElem = document.querySelector('div.content')
  let cardElem = document.createElement('div')
  cardElem.setAttribute('class', 'ant-card')
  cardElem.setAttribute('style', 'margin: 20px 0;')
  cardElem.setAttribute('_c', 'chatroom-section-config')
  const optionsHtml = groupings.map(d => `<option value="${d.id}">${d.groups_name}</option>`).join('\n')
  cardElem.innerHTML = `<div class="ant-card-body">
  <div class="ant-card-head">
    <div class="ant-card-head-wrapper">
      <div class="ant-card-head-title">
        批量设置微信群分组
      </div>
    </div>
  </div>
  <div class="ant-card-body">
    <div id="chatroom-section-form">
      <input type="text" name="chatroom-section-prefix" placeholder="群昵称前缀" />
      <input type="number" name="chatroom-section-left" step="1" min="0" placeholder="起始编号" />
      <input type="number" name="chatroom-section-right" step="1" min="0" placeholder="截止编号" />
      <select name="chatroom-section-grouping" id="chatroom-section-grouping">
        ${optionsHtml}
      </select>
      <button type="button" class="ant-btn ant-btn-primary" id="chatroom-section-submit">批量设置分组</button>
    </div>
    <div id="chatroom-section-preview">
    </div>
  </div>
</div>`
  contentElem.parentNode.insertBefore(cardElem, contentElem)

  let btn = contentElem.parentNode.querySelector('#chatroom-section-submit')
  btn.onclick = () => {
    let prefix = contentElem.parentNode.querySelector('input[name="chatroom-section-prefix"]').value
    let left = contentElem.parentNode.querySelector('input[name="chatroom-section-left"]').value
    let right = contentElem.parentNode.querySelector('input[name="chatroom-section-right"]').value
    let grouping = contentElem.parentNode.querySelector('select[name="chatroom-section-grouping"]').value
    grouping = parseInt(grouping)
    let groupingName = groupings.filter(d => d.id === grouping)[0].groups_name
    console.log('批量设置分组', prefix, left, right, grouping)

    if (!prefix) {
      alert(`须填入昵称前缀`)
      return
    }
    if (left !== 0 && !left) {
      alert(`须填入起始编号`)
      return
    }
    if (right !== 0 && !right) {
      alert(`须填入截止编号`)
      return
    }

    left = parseInt(left)
    right = parseInt(right)
    if (left > right) {
      alert(`起始编号不得大于截止编号`)
      return
    }

    let chatroomIds = []
    let chatroomNicknames = {}
    for (let i = left; i <= right; ++i) {
      let reg = new RegExp(`${prefix}${i}([^\\d]+|$)`)
      for (let robotId in groups) {
        for (let chatroom of groups[robotId]) {
          if (!chatroom.group_nickname) { // ?
            // console.warn('这个群不存在群昵称？', robotId, chatroom)
          }
          if (chatroom.group_nickname && chatroom.group_nickname.match(reg)) {
            // console.log(chatroom.id, chatroom.group_nickname)
            chatroomIds.push(chatroom.id)
            if (!chatroomNicknames[chatroom.group_nickname]) chatroomNicknames[chatroom.group_nickname] = 0
            chatroomNicknames[chatroom.group_nickname] ++
          }
        }
      }
    }

    console.log('chatroomIds', chatroomIds)
    let previewElem = contentElem.parentNode.querySelector('#chatroom-section-preview')
    let previewHtmls = []
    for (let nickname in chatroomNicknames) {
      previewHtmls.push(`<span style="margin: 3px 16px 3px 0; display: inline-block;">${nickname}: <b>${chatroomNicknames[nickname]}</b></span>`)
    }
    previewElem.innerHTML = `<div style="margin: 10px 0;">将以下群设为分组：<b>${groupingName}</b></div>
<div style="margin-bottom: 10px;>${previewHtmls.join('')}</div>
<button type="button" class="ant-btn ant-btn-primary" id="chatroom-section-real-submit">确定</button>`

    let realBtn = previewElem.querySelector('#chatroom-section-real-submit')
    realBtn.onclick = () => {
      console.log('真·批量设置群分组', grouping, chatroomIds)
      setChatroomGrouping(grouping, chatroomIds).then(res => {
        alert(`更新${chatroomIds.length}个微信群所属分组为${groupingName}: ${res.msg}`)
      })
    }
  }
}

async function addUserTokenButton () {
  await WaitUntil(() => {
    return !!document.querySelector('main')
  })

  const mainElem = document.querySelector('main')
  let div = document.createElement('div')
  div.setAttribute('style', 'margin: 20px; line-break: anywhere;')
  div.innerHTML = getUserToken()
  mainElem.parentNode.insertBefore(div, mainElem)
}

async function addBatchCheckGroupingPanel (groupings) {
  // 批量选择微信号的分组
  await WaitUntil(() => {
    return !!document.querySelector('div.content')
  })

  if (document.querySelector('div[_c="batch-check-grouping"]')) return

  let contentElem = document.querySelector('div.content')

  let cardElem = document.createElement('div')
  cardElem.setAttribute('class', 'ant-card')
  cardElem.setAttribute('style', 'margin: 20px 0;')
  cardElem.setAttribute('_c', 'batch-check-grouping')
  let inputsHtml = groupings.map(g => `<span style="padding: 10px;">
<input type="checkbox" t="batch-check-grouping" id="${g.id}">
<label for="${g.id}">${g.groups_name}</label>
</span>`).join('')
  cardElem.innerHTML = `<div class="ant-card-body">
  <div class="ant-card-head">
    <div class="ant-card-head-wrapper">
      <div class="ant-card-head-title">
        批量选择分组
      </div>
    </div>
  </div>
  <div class="ant-card-body">
    ${inputsHtml}
  </div>
</div>`

  contentElem.parentNode.insertBefore(cardElem, contentElem)

  Array.from(document.querySelectorAll('input[t="batch-check-grouping"]')).forEach(input => {
    input.onchange = (e) => {
      console.log('批量修改群组选择onchange', e)
      let groupId = e.target.getAttribute('id')
      let elems = document.querySelectorAll(`input[group-id="${groupId}"]`)
      for (let i=0; i<elems.length; ++i) {
        elems[i].checked = e.target.checked
      }
    }
  })
}

(function () {
  'use strict';

  // Your code here...
  /*
  getAccounts().then(async accounts => {
      // getGroups(accounts[1].relation_to_robot[0].id, 1, 40)
      const groups = await getAllGroups(accounts[0].relation_to_robot[0].id)
      console.log('groups', groups, groups.length, groups[0])
  })
  */
  function isGroupListUrl() {
    if (window.location.href.search('/group/list') !== -1) return true
    else return false
  }
  async function main() {
    if (isGroupListUrl()) {
      addUserTokenButton()
      // 获取需要的数据
      let groupings = await retryDo(getAllGrouping())
      let { accounts, groups } = await getAllAccountsAndGroups()
      addBatchCheckGroupingPanel(groupings)
      addAccountsElem(accounts, groups).then(() => {
      })
      addBatchSetChatroomGroupButton(accounts, groups, groupings)
      addBatchSyncChatroomsButton(accounts)
      // observeAccountChange()
      // 将其他账号的微信群分组同步到本账号
      syncWechatChatroomGroups(accounts, groups)
      //
      addChatroomSectionConfig(accounts, groups, groupings)
      //
    }
  }
  main().catch(err => {
    console.error('main', err)
  })
})();