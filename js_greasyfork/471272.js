// ==UserScript==
// @name         Github 网页图标主题
// @name:en      Github web icon theme
// @namespace    https://github.com/fwqaaq/scripts
// @version      1.3.1
// @description  美化 Github 网页仓库图标
// @description:en Beautify Github repo icons
// @author       fwqaaq
// @match        https://github.com/*/*
// @exclude      https://github.com/*/*/settings*
// @exclude      https://github.com/*/*/issues*
// @exclude      https://github.com/*/*/pulls*
// @exclude      https://github.com/*/*/discussions*
// @exclude      https://github.com/*/*/wiki*
// @exclude      https://github.com/*/*/actions*
// @exclude      https://github.com/*/*/projects*
// @exclude      https://github.com/*/*/packages*
// @exclude      https://github.com/*/*/security*
// @exclude      https://github.com/*/*/pulse
// @exclude      https://github.com/*/*/graphs*commit-activity
// @exclude      https://github.com/*/*/commit-activity
// @exclude      https://github.com/*/*/network+
// @exclude      https://github.com/*/*/forks*
// @exclude      https://github.com/settings*
// @icon         https://github.githubassets.com/favicons/favicon-dark.png
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.xmlHttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471272/Github%20%E7%BD%91%E9%A1%B5%E5%9B%BE%E6%A0%87%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/471272/Github%20%E7%BD%91%E9%A1%B5%E5%9B%BE%E6%A0%87%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

const getData = (() => {
    const cacheData = GM.getValue('icons')
    const oldUrl = GM.getValue('url')
    return async () => {
        const url = 'https://gist.githubusercontent.com/fwqaaq/92e8f52194d705f76580ee396ea2791b/raw/5a035fd8c4158ad07817c30117df57db0128e414/icons.json'
        GM.setValue('url', url)
        if (cacheData && url === oldUrl) return cacheData
        const data = await new Promise(resolve => {
            GM.xmlHttpRequest({
                method: 'GET',
                url,
                onload: (res) => {
                    resolve(res.responseText)
                }
            })
        })
        GM.setValue('icons', JSON.parse(data))
        return JSON.parse(data)
    }
})()

function memoize(fn) {
    let result = null
    return (icons) => {
        if (result !== null) return result
        return fn(icons)
    }
}

const getFileDict = memoize((fileIcons) => {
    const fileDict = new Map()
    fileIcons.icons.forEach((icon) => {
        (icon.fileExtensions || []).forEach((ext) => {
            fileDict.set(ext, icon.name)
        });
        (icon.fileNames || []).forEach((name) => {
            fileDict.set(name, icon.name)
        })
    })
    return fileDict
})

const getDirDict = memoize((folderIcons) => {
    const dirDict = new Map()

    folderIcons[0].icons.forEach((icon) => {
        (icon.folderNames || []).forEach((name) => {
            dirDict.set(name, icon.name)
        });
    });
    return dirDict;
})

function splitFileAndDir() {
    const repoPage = document.querySelector('div[data-hpc]') || document.querySelector('tbody')
    // Directly return if None
    if (!repoPage) return [false, false]
    const dir = new Map()
    const file = new Map()

    const row = repoPage.querySelectorAll('div[role="row"][class^="Box-row"], tr[id*="folder"] td[colspan] div.react-directory-filename-column')

    // There is not tbody element in the home page
    if (document.querySelector('div[data-hpc]') && !repoPage.querySelector("tbody")) {
        row.forEach(item => {
            if (item.querySelector('[aria-label="Directory"]')) setMap(item, dir)
            if (item.querySelector('[aria-label="File"]')) setMap(item, file)
        })
    }

    if (document.querySelector('tbody')) {
        row.forEach(item => {
            if (!item.querySelector("svg.icon-directory")) setMap(item, file)
            if (item.querySelector("svg.icon-directory")) setMap(item, dir)
        })
    }

    // 侧边栏
    const sider = document.getElementById('repos-file-tree')
    if (sider) {
        const row = sider.querySelectorAll('div.PRIVATE_TreeView-item-content')
        row.forEach(item => {
            if (item.querySelector(".PRIVATE_TreeView-item-visual > svg")) {
                setMap(item, file)
            }

            if (item.getElementsByClassName("PRIVATE_TreeView-directory-icon").length !== 0) {
                setMap(item, dir)
            }
        })

    }

    // diff commit sidder
    const diffSider = document.querySelector("div[data-target='diff-layout.sidebarContainer']")
    if (diffSider) {
        diffSider.querySelectorAll("svg").forEach(item => {
            const label = item.getAttribute("aria-label")
            if (label === "Directory" ){
                setMap(item.parentNode.parentNode, dir)
                return
            }
            if (label === "File"){
                setMap(item.parentNode.parentNode, file)
                return
            }
        })
    }

    return [dir, file]
}

function matchFile(file, fileDict) {
    const names = file.split('.')
    let name = '', betterName = ''
    for (let i = names.length - 1; i >= 0; i--) {
        if (i === names.length - 1) name += names[i]
        if (i < names.length - 1) name = names[i] + '.' + name
        if (fileDict.has(name)) {
            betterName = name
            continue
        }
    }
    return betterName
}

async function replaceIcons(name, item) {
    const url = `https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/${name}.svg`

    // directly return
    if (item.querySelector('img')) return

    const newNode = document.createElement('img')
    newNode.src = url
    newNode.height = '16'

    // replace sider icons
    if (item.querySelector('span.PRIVATE_TreeView-item-content-text')) {
        const disappearance = item.querySelector('div.PRIVATE_TreeView-directory-icon') || item.querySelector('svg')
        disappearance.style = "display: none"

        if (!item.querySelector('img')) {
            const visual = item.querySelector('div.PRIVATE_TreeView-item-visual')
            visual.prepend(newNode)
        }
        return
    }

    // replace home page || replace diff sider dir icon || replace tree page (and replace diff sider file icon)
    const svg = item.querySelector('div[role="gridcell"] > svg') || item.querySelector("svg[aria-label='Directory']") || item.querySelector('svg')
    svg.replaceWith(newNode)
}

function handleFileIcons(file, item, fileDict) {
    if (file.endsWith('-sider')) file = file.slice(0, file.length - 6)

    const key = matchFile(file, fileDict)

    // match suffix name
    if (key !== '') {
        return replaceIcons(fileDict.get(key), item)
    }
    // match file name
    if (fileDict.has(file)) {
        return replaceIcons(fileDict.get(file), item)
    }
}

function setMap(item, map) {
    /**
     * @type {string}
     */
    // home page
    let title = item.querySelector('a[title]')?.title
        // tree page
        ?? item.querySelector('h3 > div[title]')?.innerText
        // sider
        ?? item.querySelector('span.PRIVATE_TreeView-item-content-text')?.firstChild.innerText
        // diff sider
        ?? item.querySelector('span.ActionList-item-label')?.innerText
    // Main dir, jump empty dir
    if (title === "This path skips through empty directories") {
        title = item.querySelector('a[title] > span').innerText
        title = title.slice(0, -1)
    }

    const isSider = item.querySelector('span.PRIVATE_TreeView-item-content-text') ?? item.querySelector('span.ActionList-item-label')

    if (!isSider) map.set(title.toLowerCase(), item)

    // sider
    if (isSider) {
        if (title.includes('/')) title = title.split('/')[0]
        title += '-sider'
        title = title.toLowerCase()
        map.has(title) ? map.get(title).push(item) : map.set(title, [item])
    }
}

function iter(files, tasks, dict) {
    for (const [name, items] of files) {
        if (Array.isArray(items)) {
            const siderTasks = items.map(item => handleFileIcons(name, item, dict))
            tasks.push(siderTasks)
            continue
        }
        tasks.push(handleFileIcons(name, items, dict))
    }
}

async function collectTasks() {
    const [dir, file] = splitFileAndDir()
    if (dir === false || file === false) return []

    const { fileIcons, folderIcons } = await getData()
    const fileDict = getFileDict(fileIcons)
    const dirDict = getDirDict(folderIcons)
    const tasks = []

    iter(file, tasks, fileDict)
    iter(dir, tasks, dirDict)

    return tasks
}

function debounce(func, wait, immediate){
    let timeout
    return () => {
        const hasImmediate = !timeout && immediate
        if(timeout) clearTimeout(timeout)
        timeout = setTimeout(() => func.apply(this), wait)
        if(hasImmediate) func.apply(this)
    }
}

async function main() {
    const tasks = await collectTasks()
    if (tasks.length !== 0) Promise.allSettled(tasks)
}

const observer = new MutationObserver(debounce(main, 50, true))
const options = {
    attributes: true,
    childList: true,
    subtree: true,
}
observer.observe(document.body, options)