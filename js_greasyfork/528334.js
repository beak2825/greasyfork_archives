// ==UserScript==
// @name         时光机查询小组之外自己的最近发言
// @namespace    https://bgm.tv/group/topic/417621
// @version      0.1
// @description  自己的
// @author       ooo
// @match        https://bgm.tv/user/*/groups
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/528334/%E6%97%B6%E5%85%89%E6%9C%BA%E6%9F%A5%E8%AF%A2%E5%B0%8F%E7%BB%84%E4%B9%8B%E5%A4%96%E8%87%AA%E5%B7%B1%E7%9A%84%E6%9C%80%E8%BF%91%E5%8F%91%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/528334/%E6%97%B6%E5%85%89%E6%9C%BA%E6%9F%A5%E8%AF%A2%E5%B0%8F%E7%BB%84%E4%B9%8B%E5%A4%96%E8%87%AA%E5%B7%B1%E7%9A%84%E6%9C%80%E8%BF%91%E5%8F%91%E8%A8%80.meta.js
// ==/UserScript==

(async function () {
    'use strict'

    const INDEXED_DB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    const BA_FEH_API_URL = 'https://bgm.nyamori.moe/forum-enhance/query'
    const FACE_KEY_GIF_MAPPING = {
        "0": "44",
        "140": "101",
        "80": "41",
        "54": "15",
        "85": "46",
        "104": "65",
        "88": "49",
        "62": "23",
        "79": "40",
        "53": "14",
        "122": "83",
        "92": "53",
        "118": "79",
        "141": "102",
        "90": "51",
        "76": "37",
        "60": "21",
        "128": "89",
        "47": "08",
        "68": "29",
        "137": "98",
        "132": "93"
    }
    const SPACE_ACTION_BUTTON_WORDING = {
        "group": "小组讨论统计",
        "subject": "条目讨论统计",
        "ep": "章节讨论统计",
        "character": "角色讨论统计",
        "person": "人物讨论统计",
        "blog": "日志发言统计"
    }
    const SPACE_TOPIC_URL = {
        "group": "group/topic",
        "subject": "subject/topic",
        "ep": "ep",
        "character": "character",
        "person": "person",
        "blog": "blog"
    }

    const userId = window.location.pathname.split('/')[2]
    if (userId !== $('#dock .first a').attr('href').split('/').pop()) return;
    const types = ['group', 'subject', 'ep', 'character', 'person', 'blog']

    const columnUserSingle = document.querySelector('#columnUserSingle')
    const frag = document.createDocumentFragment()

    async function getUserStatObj(username, type) {
        const BA_FEH_CACHE_PREFIX = `ba_feh_${type}_`
        if (await areYouCached(username, BA_FEH_CACHE_PREFIX)) {
            return await getCacheByUsername(username, BA_FEH_CACHE_PREFIX)
        }
        const allUsernameSet = getAllUsernameSet()
        for (const un in allUsernameSet) {
            if (await areYouCached(un, BA_FEH_CACHE_PREFIX)) {
                delete allUsernameSet[un]
            }
        }
        const usernameListToFetch = Object.keys(allUsernameSet)
        console.debug(`[BA_FEH] Fetching: ${JSON.stringify(usernameListToFetch)}`)
        let fetched = await fetch(BA_FEH_API_URL, {
            body: JSON.stringify({ users: usernameListToFetch, type }),
            method: 'POST'
        })
          .then(d => d.json())
          .catch(e => console.error('[BA_FEH] Exception when fetching data: ', e, e))
        for (const u in fetched) {
            await storeInCache(u, fetched[u], BA_FEH_CACHE_PREFIX)
        }
        return await getCacheByUsername(username, BA_FEH_CACHE_PREFIX)
    }

    async function storeInCache(username, userStatObj, BA_FEH_CACHE_PREFIX) {
        const ck = `${BA_FEH_CACHE_PREFIX}${username}`
        if (INDEXED_DB) {
            await getIndexedDBManager().setItem(ck, userStatObj)
        } else {
            sessionStorage[ck] = JSON.stringify(userStatObj)
        }
    }

    async function areYouCached(username, BA_FEH_CACHE_PREFIX) {
        const ck = `${BA_FEH_CACHE_PREFIX}${username}`
        if (INDEXED_DB) {
            const statObj = await getIndexedDBManager().getItem(ck)
            if (!statObj) return false
            return !isUserStatCacheExpired(statObj)
        } else if (sessionStorage[ck]) {
            const statObj = JSON.parse(sessionStorage[ck])
            return !isUserStatCacheExpired(statObj)
        }
        return false
    }

    function isUserStatCacheExpired(userStatObj) {
        return new Date().valueOf() > (userStatObj?._meta?.expiredAt ?? new Date().valueOf())
    }

    async function getCacheByUsername(username, BA_FEH_CACHE_PREFIX) {
        const ck = `${BA_FEH_CACHE_PREFIX}${username}`
        if (INDEXED_DB) {
            return await getIndexedDBManager().getItem(ck)
        }
        return JSON.parse(sessionStorage[ck])
    }

    function getIndexedDBManager() {
        const DATA_BASE_NAME = 'BA_FEH'
        const TABLE_NAME = 'CACHE'
        const UNIQ_KEY = 'BA_FEH_CACHE_KEY'

        let dataBase = null
        function getDataBase() {
            if (dataBase) {
                return dataBase
            }
            return new Promise(resolve => {
                const request = indexedDB.open(DATA_BASE_NAME)
                request.onupgradeneeded = e => {
                    const db = e.target.result
                    if (!db.objectStoreNames.contains(TABLE_NAME)) {
                        db.createObjectStore(TABLE_NAME, { keyPath: UNIQ_KEY })
                    }
                }
                request.onsuccess = e => {
                    const db = e.target.result
                    dataBase = db
                    resolve(db)
                }
            })
        }
        return {
            async setItem(key, value) {
                const dataBase = await getDataBase()
                return new Promise(resolve => {
                    const request = dataBase.transaction(TABLE_NAME, 'readwrite')
                      .objectStore(TABLE_NAME)
                      .put({ data: value, [UNIQ_KEY]: key })
                    request.onsuccess = () => resolve('success')
                })
            },
            async getItem(key) {
                const dataBase = await getDataBase()
                return new Promise(resolve => {
                    const request = dataBase.transaction(TABLE_NAME)
                      .objectStore(TABLE_NAME)
                      .get(key)
                    request.onsuccess = () => {
                        resolve(request.result?.data)
                    }
                })
            },
            async deleteItem(key) {
                const dataBase = await getDataBase()
                return new Promise(resolve => {
                    const request = dataBase.transaction(TABLE_NAME, 'readwrite')
                      .objectStore(TABLE_NAME)
                      .delete(key)
                    request.onsuccess = () => {
                        resolve(request.result === undefined)
                    }
                })
            },
            async keys() {
                const keys = {}
                const dataBase = await getDataBase()
                return new Promise(resolve => {
                    const request = dataBase.transaction(TABLE_NAME)
                      .objectStore(TABLE_NAME)
                      .openCursor()
                    request.onsuccess = () => {
                        const cursor = request.result
                        if (cursor) {
                            cursor.continue()
                            keys[cursor.value[UNIQ_KEY]] = true
                        } else {
                            resolve(keys)
                        }
                    }
                })
            }
        }
    }

    async function purgeCache() {
        if (!INDEXED_DB) return
        let timing = new Date().valueOf()
        const dbMgr = getIndexedDBManager()
        const keys = await dbMgr.keys()
        let ctr = 0
        const deleted = []

        console.debug(`[BA_FEH] Keys before purging cache: ${JSON.stringify(Object.keys(keys))}`)

        for (const k in keys) {
            const statObj = await dbMgr.getItem(k)
            if (!statObj) continue
            if (isUserStatCacheExpired(statObj)) {
                await dbMgr.deleteItem(k)
                ctr++
                deleted.push(k)
            }
        }
        timing = new Date().valueOf() - timing
        console.debug(`[BA_FEH] The following expired cache keys has been removed in db: ${JSON.stringify(deleted)}`)
        console.log(`[BA_FEH] Timing for purging cache: ${timing}ms. ${ctr} rows deleted`)
    }

    function getAllUsernameSet() {
        return { [userId]: null }
    }

    types.forEach(type => {
        const details = document.createElement('details')
        details.innerHTML = `<summary style="font-size:14px;line-height:2;font-weight:bold">${SPACE_ACTION_BUTTON_WORDING[type]}</summary><p class="loading-ind">加载中……</p>`
        details.dataset.type = type
        frag.appendChild(details)
        details.insertAdjacentHTML('afterend', '<div class="clear section_line"></div>')

        details.addEventListener('toggle', async function () {
            if (this.open) {
                const loading = this.querySelector('.loading-ind')
                if (!loading) return

                let result
                try {
                    result = await getUserStatObj(userId, type)
                } catch (error) {
                    console.error(`Fetch error for ${type}:`, error)
                    this.insertAdjacentHTML('beforeend', `<p>加载失败: ${error.message}</p>`)
                    return
                }

                loading.remove()
                const userStatObj = { ...result, type }
                const content = drawWrapper(userStatObj)
                this.insertAdjacentHTML('beforeend', content)
            }
        })
    })

    columnUserSingle.prepend(frag)

    function drawWrapper(userStatObj) {
        const spaceType = userStatObj.type
        const shouldDrawTopicStat = spaceType === 'blog' || SPACE_TOPIC_URL[spaceType].endsWith('topic')
        const shouldDrawLikesStat = spaceType !== 'blog' && spaceType.length % 3 !== 0

        return `
            <div class="subject_tag_section" style="margin: 1em;">
                <div>
                    <div>
                        <span class="tip">帖子统计:</span>
                        ${drawPostStatData(userStatObj.postStat)}
                    </div>
                    ${shouldDrawTopicStat ? `
                        <div>
                            <span class="tip">主题统计:</span>
                            ${drawTopicStatData(userStatObj.topicStat)}
                        </div>
                    ` : ''}
                    ${shouldDrawLikesStat ? `
                        <div>
                            <span class="tip">收到贴贴:</span>
                            ${drawFaceGrid(userStatObj.likeStat)}
                        </div>
                        <div>
                            <span class="tip">送出贴贴:</span>
                            ${drawFaceGrid(userStatObj.likeRevStat)}
                        </div>
                    ` : ''}
                    <div>
                        <span class="tip">空间统计:</span>
                        ${drawSpaceStatSection(userStatObj.spaceStat, spaceType)}
                    </div>
                    <div>
                        ${shouldDrawTopicStat ? `
                            <span class="tip">最近发表:</span>
                            ${drawRecentTopicSection(userStatObj.recentActivities.topic, spaceType)}
                            <br/>
                        ` : ''}
                        <span class="tip">最近回复:</span>
                        ${drawRecentPostSection(userStatObj.recentActivities.post, spaceType)}
                        ${shouldDrawLikesStat ? `
                            <br/>
                            <span class="tip">最近送出贴贴:</span>
                            ${drawRecentLikeRevSection(userStatObj.recentActivities.likeRev, spaceType)}
                        ` : ''}
                    </div>
                </div>
            </div>
        `
    }

    function extractSortedListOfFace(faceMap) {
        const res = []
        for (const key in faceMap) {
            res.push([key, faceMap[key]])
        }
        return res.sort((a, b) => b[1] - a[1])
    }

    function drawFaceGrid(faceMap) {
        const extracted = extractSortedListOfFace(faceMap)
        if (extracted.length === 0) return '<span>N/A</span>'
        let inner = ''
        for (const p of extracted) {
            const faceKey = p[0]
            const faceCount = p[1]
            const facePicValue = FACE_KEY_GIF_MAPPING[faceKey]
            inner += `
                <a class="item" data-like-value="${faceKey}">
                    <span class="emoji" style="background-image: url('/img/smiles/tv/${facePicValue}.gif');"></span>
                    <span class="num">${faceCount}</span>
                </a>
            `
        }
        return `
            <div class="likes_grid" style="float: none;">
                ${inner}
            </div>
        `
    }

    function drawPostStatData(postStatObj) {
        return `
            <small class="grey">
                ${postStatObj.total}(T)
                ${postStatObj.r7d > 0 ? `/<span>${postStatObj.r7d}(7d)</span>` : ''}
                ${postStatObj.r30d > 0 ? `/<span>${postStatObj.r30d}(30d)</span>` : ''}
                ${postStatObj.deleted > 0 ? `/<span style="color: red;">${postStatObj.deleted}(D)</span>` : ''}
                ${postStatObj.adminDeleted > 0 ? `/<span style="color: yellowgreen;">${postStatObj.adminDeleted}(AD)</span>` : ''}
                ${postStatObj.violative > 0 ? `/<span style="color: rgb(50, 255, 245);">${postStatObj.violative}(V)</span>` : ''}
                ${postStatObj.collapsed > 0 ? `/<span style="color: rgb(89, 116, 252);">${postStatObj.collapsed}(F)</span>` : ''}
            </small>
        `
    }

    function drawLikeStatData(likeStatForSpaceObj) {
        return `
            <small class="grey">
                ${likeStatForSpaceObj.total}(T)
            </small>
        `
    }

    function drawSpaceStatData(spaceStatObj, spaceType) {
        let { name, displayName, topic, post, like, likeRev } = spaceStatObj
        let isNameTooLong = displayName.length > 10
        displayName = displayName.substring(0, Math.min(10, displayName.length))
        if (isNameTooLong) displayName += '...'
        const topicDrawing = drawTopicStatData(topic)
        const postDrawing = drawPostStatData(post)
        const likeRevDrawing = drawLikeStatData(likeRev)
        const likeDrawing = drawLikeStatData(like)
        let spacePath = ''
        switch (spaceType) {
            case 'blog':
                spacePath = 'user'
                break
            case 'ep':
                spacePath = 'subject'
                break
            default:
                spacePath = spaceType
        }

        const shouldDrawTopicStat = spaceType === 'blog' || SPACE_TOPIC_URL[spaceType].endsWith('topic')
        const shouldDrawLikesStat = spaceType !== 'blog' && spaceType.length % 3 !== 0

        return `
            <div>
                <a href="/${spacePath}/${name}" class="l" target="_blank" rel="nofollow external noopener noreferrer">${displayName}</a>
                <span class="tip">帖子:</span>
                ${postDrawing}
                ${shouldDrawTopicStat ? `
                    <span class="tip">主题:</span>
                    ${topicDrawing}
                ` : ''}
                ${shouldDrawLikesStat ? `
                    <span class="tip">送出贴贴:</span>
                    ${likeRevDrawing}
                    <span class="tip">收到贴贴:</span>
                    ${likeDrawing}
                ` : ''}
            </div>
        `
    }

    function drawSpaceStatSection(spaceStatObjList, spaceType) {
        if (spaceStatObjList.length === 0) return '<span>N/A</span>'
        let inner = ''
        for (const s of spaceStatObjList) {
            inner += drawSpaceStatData(s, spaceType)
        }
        return `
            <div class="subject_tag_section">
                ${inner}
            </div>
        `
    }

    function drawRecentTopic(topicBriefObj, spaceType) {
        return `<a class="l inner" target="_blank"
                 rel="nofollow external noopener noreferrer"
                 href="/${SPACE_TOPIC_URL[spaceType]}/${topicBriefObj.id}"
                 title="${topicBriefObj.spaceDisplayName || ''}"
        >
        ${topicBriefObj.title} <small class="grey">${formatDateline(topicBriefObj.dateline)}</small></a>`
    }

    function drawRecentTopicSection(recentTopicObjList, spaceType) {
      if (recentTopicObjList.length === 0) return `<span>N/A</span>`
      let inner = ''
      for (const t of recentTopicObjList) {
        inner += drawRecentTopic(t, spaceType)
      }
      return `
        <div class="subject_tag_section">
          ${inner}
        </div>
      `
    }

    function formatDateline(dateline) {
      let msWithOffset = 1000 * (dateline - new Date().getTimezoneOffset() * 60)
      let d = new Date(msWithOffset)
      let [year, month, day] = d.toISOString().split('T')[0].split('-')
      return `${year.substring(2)}${month}${day}`
    }

    function drawRecentLikeRev(likeRevBrief, spaceType) {
      let likeRevObjListHtml = ''
      for (const l of likeRevBrief.likeRevList) {
        likeRevObjListHtml += `
          <a target="_blank" rel="nofollow external noopener noreferrer"
             href="/${SPACE_TOPIC_URL[spaceType]}/${likeRevBrief.mid}#post_${l.pid}">
            <img style="width: 18px;height: 18px;" src="/img/smiles/tv/${FACE_KEY_GIF_MAPPING[l.faceKey]}.gif"></img>
          </a>
        `
      }
      return `<p><a class="l inner" target="_blank" rel="nofollow external noopener noreferrer"
                      href="/${SPACE_TOPIC_URL[spaceType]}/${likeRevBrief.mid}"
                      title="${likeRevBrief.spaceDisplayName || ''}"
                      >
                      ${likeRevBrief.title}
                      <small class="grey">
                      ${formatDateline(likeRevBrief.dateline)}
                      </small>
              </a><small class="grey">:</small>${likeRevObjListHtml}</p>`
    }

    function drawRecentLikeRevSection(recentLikeRevObjList, spaceType) {
      if (recentLikeRevObjList.length === 0) return `<span>N/A</span>`
      let inner = ''
      for (const t of recentLikeRevObjList) {
        inner += drawRecentLikeRev(t, spaceType)
      }
      return `
        <div class="subject_tag_section">
          ${inner}
        </div>
      `
    }

    function drawRecentPost(postBriefObj, spaceType) {
      return `<a class="l inner" target="_blank"
               rel="nofollow external noopener noreferrer"
               href="/${SPACE_TOPIC_URL[spaceType]}/${postBriefObj.mid}#post_${postBriefObj.pid}"
               title="${postBriefObj.spaceDisplayName || ''}"
      >
      ${postBriefObj.title} <small class="grey">${formatDateline(postBriefObj.dateline)}</small></a>`
    }

    function drawRecentPostSection(recentPostObjList, spaceType) {
      if (recentPostObjList.length === 0) return `<span>N/A</span>`
      let inner = ''
      for (const p of recentPostObjList) {
        inner += drawRecentPost(p, spaceType)
      }
      return `
        <div class="subject_tag_section">
          ${inner}
        </div>
      `
    }

    function drawTopicStatData(topicStatObj) {
      return `
        <small class="grey">
          ${topicStatObj.total}(T)
          ${topicStatObj.r7d > 0 ? `/<span>${topicStatObj.r7d}(7d)</span>` : ''}
          ${topicStatObj.r30d > 0 ? `/<span>${topicStatObj.r30d}(30d)</span>` : ''}
          ${topicStatObj.deleted > 0 ? `/<span style="color: red;">${topicStatObj.deleted}(D)</span>` : ''}
          ${topicStatObj.silent > 0 ? `/<span style="color: rgb(255, 145, 0);">${topicStatObj.silent}(S)</span>` : ''}
          ${topicStatObj.closed > 0 ? `/<span style="color: rgb(164, 75, 253);">${topicStatObj.closed}(C)</span>` : ''}
          ${topicStatObj.reopen > 0 ? `/<span style="color: rgb(53, 188, 134);">${topicStatObj.reopen}(R)</span>` : ''}
        </small>
      `
    }

})()
