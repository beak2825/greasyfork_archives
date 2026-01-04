// ==UserScript==
// @name         Bilibili成分标记
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @license      MIT
// @description  用户成分标记系统，让您省去查成分的烦恼！
// @author       Charlie
// @match        https://*.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @require      https://cdn.staticfile.org/pako/1.0.10/pako.min.js
// @grant        GM.addStyle
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM.xmlHttpRequest
// @grant        GM.registerMenuCommand
// @grant        GM.setClipboard
// @downloadURL https://update.greasyfork.org/scripts/441853/Bilibili%E6%88%90%E5%88%86%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/441853/Bilibili%E6%88%90%E5%88%86%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(async () => {
    class Tag {
        constructor() {
            this.tags = {}
        }

        async getAllTags() {
            this.tags = await GM.getValue('tagList') ?? {}
            return this.tags
        }

        async delAllTags() {
            this.tags = {}
            await GM.deleteValue('tagList')
        }

        async updateAlltags() {
            await GM.setValue('tagList', this.tags)
        }

        get(key) {
            return this.tags[key] ?? []
        }

        async add(key, value) {
            if (!value) return
            this.tags[key] = this.get(key).filter(val => val !== value)
            this.tags[key].push(value)
            await this.updateAlltags()
        }

        async del(key, index) {
            if (index === undefined) delete this.tags[key]
            else {
                this.tags[key] = this.get(key).filter((_, i) => i !== index)
                if (this.tags[key].length === 0) delete this.tags[key]
            }
            await this.updateAlltags()
        }
    }

    let tag = new Tag()
    await tag.getAllTags()

    GM.registerMenuCommand('导出', async () => {
        await tag.getAllTags()
            .then(data => JSON.stringify(data))
            .then(str => pako.deflateRaw(str, { to: 'string', level: 9 }))
            .then(buf => btoa(buf))
            .then(GM.setClipboard)
            .then(() => alert(`已导出到剪贴板喵~`))
    })
    GM.registerMenuCommand('导入', async () => {
        let data = prompt('请粘贴要导入的配置喵~')
        if (data) {
            try {
                data = JSON.parse(pako.inflateRaw(atob(data), { to: 'string' }))
            } catch (e) {
                alert('配置格式错误喵')
                console.error(e)
                return
            }

            let count = 0
            for (const key in data) {
                let oldTags = tag.get(key)
                tag.tags[key] = [...new Set([...oldTags, ...data[key]])]
                count += tag.get(key).length - oldTags.length
            }
            await tag.updateAlltags()
            alert(count ? `导入成功喵，新增了${count}条标签喵` : `导入成功喵，但是你导入了个寂寞喵`)
            refresh()
        }
    })
    GM.registerMenuCommand('清空', async () => {
        if (
            confirm('确定要清空所有数据喵？') &&
            confirm('你真的确定要清空所有数据喵？？')
        ) {
            await tag.delAllTags()
            alert('清除成功喵')
            refresh()
        } else alert('不清你还点，真是闲的喵')
    })

    GM.addStyle(`
    .bili-video-card__info--author, .bili-live-card__info--uname, .username, .name, .line-1, a.title {
      overflow: initial !important;
      word-break: keep-all !important;
    }
    .user-tag {
      background-color: #f69;
      color: white !important;
      margin-left: 5px;
      padding: 1.5px 6px;
      border-radius: 4px;
      box-shadow: 1px 1px 8px rgba(255, 102, 139, .4);
    }`)

    function refresh() {
        document.querySelectorAll(
            '.fans-name, .bili-video-card__info--author, .bili-live-card__info--uname>span, span.name, .nickname, #h-name, a.name, .name-field, .user-name, .nickname-item'
        ).forEach(e => {
            const key = (e?.childNodes[0]?.textContent ?? e.textContent).trim()
            e.innerHTML = key
            // e.children.forEach((e) => e.remove())
            tag.get(key).forEach((tag, index) => {
                const el = document.createElement('span')
                el.className = 'user-tag'
                el.index = index
                el.textContent = tag
                e.appendChild(el)
            })
        })
    }

    function throttle(fn, delay) {
        let p = 0
        return (...args) => {
            var n = Date.now()
            if (n - p > delay) {
                fn.apply(this, args)
                p = n
            }
        }
    }

    function debounce(fn, delay) {
        let p = 0
        return (...args) => {
            clearTimeout(p)
            p = setTimeout(() => fn.apply(this, args), delay)
        }
    }

    window.oncontextmenu = event => {
        const { target } = event
        if (target.className === 'user-tag') {
            event.preventDefault()
            const name =
                  target.parentNode.childNodes[0].textContent ??
                  target.parentNode.textContent
            if (confirm('你确定要删了这个标签嘛？？')) {
                tag.del(name, target.index).then(refresh)
            }
        } else if (
            /name|author/.test(target.className) ||
            target.id === 'h-name' ||
            target.parentNode.className === 'bili-live-card__info--uname'
        ) {
            event.preventDefault()
            const key = target.childNodes[0].textContent.trim()
            const value = (prompt('请输入要新增的标签') ?? '').trim()
            tag.add(key, value).then(refresh)
            console.log('新增标签', key, value)
        }
    }

    if(MutationObserver) {
        const func = throttle(debounce(refresh, 100), 500)
        const observer = new MutationObserver(func)
        observer.observe(document.body, { subtree: true, childList: true })
    } else {
        setInterval(() => {
            tag.getAllTags()
            refresh()
        }, 1000)
        refresh()
        document.addEventListener('click', refresh, { passive: true })
        document.addEventListener('wheel', refresh, { passive: true })
    }
})()