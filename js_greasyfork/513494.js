// ==UserScript==
// @name         Jellyfin备份/还原最爱演员和影片
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  备份/还原最爱演员和影片
// @author       Squirtle
// @license      MIT
// @match        *://*/web/index.html*
// @match        *://*/*/web/index.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=soundiiz.com
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue

// @downloadURL https://update.greasyfork.org/scripts/513494/Jellyfin%E5%A4%87%E4%BB%BD%E8%BF%98%E5%8E%9F%E6%9C%80%E7%88%B1%E6%BC%94%E5%91%98%E5%92%8C%E5%BD%B1%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/513494/Jellyfin%E5%A4%87%E4%BB%BD%E8%BF%98%E5%8E%9F%E6%9C%80%E7%88%B1%E6%BC%94%E5%91%98%E5%92%8C%E5%BD%B1%E7%89%87.meta.js
// ==/UserScript==

;(function () {
    'use strict'
    let settings, ITEMS_URL, POST_FAV_ITEMS_URL, FAV_PERSONS_URL
    initSettings()
    const modal = createModal()
    const uploadPersonBtn = modal.querySelector('#jv-uploadPersonBtn')
    const uploadVideoBtn = modal.querySelector('#jv-uploadVideoBtn')
    const fileInput = modal.querySelector('#jv-fileInput')
    const submitBtn = modal.querySelector('#jv-submit')
    const resetBtn = modal.querySelector('#jv-reset')
    const downloadPersonBtn = modal.querySelector('#jv-downloadPersonBtn')
    const downloadVideoBtn = modal.querySelector('#jv-downloadVideoBtn')
    const form = modal.querySelector('#jv-form')
    const closeIcon = modal.querySelector('.jv-close-icon')
    const logText = modal.querySelector('#jv-logText')
    const logBtn = modal.querySelector('#jv-logBtn')
    const logListElement = modal.querySelector('#jv-logList')
    const logList = []
    let showLog = false

    function initSettings() {
        settings = GM_getValue('settings', {})
        ITEMS_URL = `${settings.serverUrl}/Users/${settings.userId}/Items`
        POST_FAV_ITEMS_URL = `${settings.serverUrl}/Users/${settings.userId}/FavoriteItems`
        FAV_PERSONS_URL = `${settings.serverUrl}/Persons`
    }

    function addQuery(base, obj) {
        if (!obj) {
            return base
        }
        const query = Object.entries(obj)
            .filter(([_, value]) => value != null)
            .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
            .join('&')
        if (!query) {
            return base
        }
        return base.endsWith('?') ? base + query : `${base}?${query}`
    }

    async function request(url, method = 'GET') {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method,
                url,
                headers: { 'X-Emby-Token': settings.apiKey },
                onload(response) {
                    if (response.status === 200) {
                        try {
                            resolve(JSON.parse(response.responseText))
                        } catch (error) {
                            reject(error)
                        }
                    } else {
                        reject(response)
                    }
                },
                onerror(error) {
                    reject(error)
                }
            })
        }).catch(error => log(`${error.statusText}: 检查参数是否设置正确`))
    }

    async function commonFetch(url, params) {
        const finalParams = {
            startIndex: 0,
            fields: 'PrimaryImageAspectRatio,SortName,PrimaryImageAspectRatio',
            imageTypeLimit: 1,
            includeItemTypes: 'Movie,Person',
            recursive: true,
            sortBy: 'SortName',
            sortOrder: 'Ascending',
            api_key: settings.apiKey,
            ...params
        }
        const result = await request(addQuery(url, finalParams))
        return result.Items
    }

    async function fetchItems(params) {
        return commonFetch(ITEMS_URL, params)
    }

    async function fetchPersons(params) {
        return commonFetch(FAV_PERSONS_URL, params)
    }

    function getFileName(type) {
        const date = new Date()
        const names = ['backup', type, date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()]
        return `${names.join('-')}.json`
    }

    function downloadFile(content, fileName) {
        const blob = new Blob([content], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
    }

    function getListNames(list) {
        return list.map(item => item.Name)
    }

    async function downloadPersons() {
        const persons = await fetchPersons({ userId: settings.userId, isFavorite: true })
        const content = JSON.stringify(getListNames(persons), null, 2)
        const fileName = getFileName('persons')
        downloadFile(content, fileName)
    }
    async function downloadVideos() {
        const videos = await fetchItems({ isFavorite: true })
        const content = JSON.stringify(getListNames(videos), null, 2)
        const fileName = getFileName('videos')
        downloadFile(content, fileName)
    }

    function buildFormItems() {
        const formKeys = ['apiKey', 'userId', 'serverUrl']
        return formKeys
            .map(key => {
                return `
                <div class='jv-form-item'>
                    <label for='${key}'>${key}: </lable>
                    <input type='text' name='${key}' value='${settings[key] || ''}' />
                </div>
            `
            })
            .join('\n')
    }

    function createModal() {
        const modal = document.createElement('div')
        modal.id = 'jv-modal'
        modal.innerHTML = `
            <div class='jv-close-icon'>X</div>
            <div class='jv-section'>
                <h2>设置参数</h2>
                <form id='jv-form'>
                    ${buildFormItems()}
                </form>
                <div class='jv-btn-group'>
                    <button id='jv-submit'>确定</button>
                    <button id='jv-reset'>重置</button>
                </div>
            </div>

            <div class='jv-section'>
                <h2>下载文件</h2>
                <div class='jv-btn-group'>
                    <button id='jv-downloadPersonBtn'>下载演员</button>
                    <button id='jv-downloadVideoBtn'>下载影片</button>
                </div>
            </div>

            <div class='jv-section'>
                <h2>上传文件</h2>
                <input type='file' id='jv-fileInput' />
                <div class='jv-btn-group'>
                    <button id='jv-uploadPersonBtn'>上传演员</button>
                    <button id='jv-uploadVideoBtn'>上传影片</button>
                </div>
            </div>
            <div>
                <div id='jv-logText'></div>
                <button id='jv-logBtn'>查看完整日志</button>
                <div id='jv-logList'><div>
            </div>

       `
        document.body.appendChild(modal)
        return modal
    }

    function showModal() {
        modal.style.display = 'block'
    }
    function hideModal() {
        modal.style.display = 'none'
    }

    async function getUploadContent() {
        return new Promise((resolve, reject) => {
            const file = fileInput.files[0]
            if (!file) {
                return reject('请先上传一个文件')
            }
            const reader = new FileReader()
            reader.onload = async function (e) {
                let data
                try {
                    const fileContent = e.target.result
                    data = JSON.parse(fileContent)
                } catch (error) {
                    console.error(error)
                    reject('请上传合法的json文件')
                }
                if (data?.length > 0) {
                    resolve(data)
                } else {
                    reject('上传的文件为空，请重新上传')
                }
            }
            reader.readAsText(file)
        }).catch(alert)
    }

    async function uploadPersons() {
        const persons = await getUploadContent()
        for (const person of persons) {
            const items = await fetchPersons({ limit: 5, searchTerm: person, includeItemTypes: 'Person', IncludePeople: true, userId: settings.userId })
            const targetItem = items.find(item => item.Name === person)
            if (items.length === 0 || !targetItem) {
                log(`未搜索到: ${person}`)
            } else {
                const favoriteURL = `${POST_FAV_ITEMS_URL}/${items[0].Id}`
                try {
                    await request(favoriteURL, 'POST')
                    log(`成功：${person}`)
                } catch (error) {
                    log(`失败： ${person}`)
                }
            }
        }
    }

    async function uploadVideos() {
        const videos = await getUploadContent()
        for (const video of videos) {
            const items = await fetchItems({ limit: 5, searchTerm: video.slice(0, 35), includeItemTypes: 'Movie' })
            if (items.length === 1) {
                const favoriteURL = `${POST_FAV_ITEMS_URL}/${items[0].Id}`
                try {
                    await request(favoriteURL, 'POST')
                    log(`成功： ${video}`)
                } catch (error) {
                    log(`失败： ${video}`)
                }
            } else {
                log(`搜索出${items.length}个结果: ${video}\n \t${getListNames(items).join('\n\t')} `)
            }
        }
    }

    function handleSubmit() {
        const formData = new FormData(form)
        const data = Object.fromEntries(formData)
        GM_setValue('settings', data)
        initSettings()
        log('设置成功')
    }

    function handleReset() {
        initSettings()
        form.innerHTML = buildFormItems()
    }

    function log(text) {
        logText.textContent = text
        logList.push(text)
        console.log(text)
    }

    function toggleLog() {
        if (showLog) {
            showLog = false
            logListElement.style.display = 'none'
        } else {
            showLog = true
            logListElement.innerHTML = logList.join('<br />')
            logListElement.style.display = 'block'
        }
    }

    function registerEventListeners() {
        uploadPersonBtn.addEventListener('click', uploadPersons)
        uploadVideoBtn.addEventListener('click', uploadVideos)
        submitBtn.addEventListener('click', handleSubmit)
        resetBtn.addEventListener('click', handleReset)
        downloadPersonBtn.addEventListener('click', downloadPersons)
        downloadVideoBtn.addEventListener('click', downloadVideos)
        closeIcon.addEventListener('click', hideModal)
        logBtn.addEventListener('click', toggleLog)
    }

    function registerMenuListeners() {
        GM_registerMenuCommand('打开设置', showModal)
    }

    function start() {
        registerEventListeners()
        registerMenuListeners()
    }

    start()

    const css = `
        #jv-modal {
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            z-index: 1100;
            overflow: auto;
            display: none;
            padding: 0 50px 50px;
        }

        .jv-section {
            width: 500px;
            margin-bottom: 50px;
        }

        .jv-form-item {
            margin-bottom: 5px;
        }

        .jv-btn-group {
            margin-top: 20px;
        }

        .jv-btn-group button {
            margin-right: 5px;
            cursor: pointer;
        }

        .jv-close-icon {
            position: absolute;
            right: 10px;
            top: 10px;
            cursor: pointer;
            font-size: 20px;
            font-weight: bold;
        }

        #jv-logText {
            color: red;
            margin-bottom: 10px;
        }

        #jv-logList {
            margin-top: 10px;
            max-height: 400px;
            overflow: auto;
        }

    `

    GM_addStyle(css)
})()
