// ==UserScript==
// @name         [北京理工大学 BIT] 乐学增强脚本整合包
// @namespace    http://tampermonkey.net/
// @version      0.2.4
// @description  乐学脚本儿大礼包
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/windlandneko/
// @author       Charlie, Y.D.X.
// @match        https://lexue.bit.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510922/%5B%E5%8C%97%E4%BA%AC%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%20BIT%5D%20%E4%B9%90%E5%AD%A6%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%E6%95%B4%E5%90%88%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/510922/%5B%E5%8C%97%E4%BA%AC%E7%90%86%E5%B7%A5%E5%A4%A7%E5%AD%A6%20BIT%5D%20%E4%B9%90%E5%AD%A6%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%E6%95%B4%E5%90%88%E5%8C%85.meta.js
// ==/UserScript==

// document.querySelector('.header-main > .container').remove()

if (location.href.includes('submit.php'))
    // submit.php 自动点击 查看结果 按钮
    onload = () => document.querySelector('a[href^=result]').click()
;(() => {
    // * 删除姓名中的空格
    const selectors = [
        "a[href*='/user/view.php'], #page-navbar a[href*='/user/profile.php']", // 通用
        '.usertext', // 通用：header 中头像的左边
        '.fullname', // 首页 - 已登录用户
        'author-info > .text-truncate', // forum/view.php
        '#page-header h1, head title', // user/profile.php
        '#page-content .userprofile .page-header-headings > h2', // user/view.php
    ]

    function format(str) {
        return str.match(/[a-zA-Z]/) ? str : str.replaceAll(' ', '')
    }

    // assign/view.php
    // 整理评分人名字这一格的格式。
    if (document.querySelector('.feedback table.generaltable')) {
        const cell_gradedBy = document.querySelector(
            '.feedback table.generaltable > tbody > tr:last-child > td:last-child'
        )
        const user_url = cell_gradedBy.querySelector('a').href
        const user_name = cell_gradedBy.textContent
        cell_gradedBy.innerHTML = `<a href="${user_url}">${user_name}</a >`
    }

    // grade/report/(overview|user)/index.php
    if (
        location.pathname.match(/^\/grade\/report\/(overview|user)\/index\.php$/)
    ) {
        const headline = document.querySelector('#maincontent + h2')
        if (headline) {
            headline.textContent = headline.textContent.replace(
                /^(..报表) - (.+)$/,
                (_, prefix, name) => prefix + ' - ' + format(name)
            )
        }
    }

    document.querySelectorAll(selectors.join(', ')).forEach(el => {
        el.textContent = format(el.textContent)
    })
})()
;(() => {
    if (!location.href.includes('result.php')) return
    // result.php 结果页自动刷新

    addEventListener('load', () => {
        const titles = document.querySelectorAll('#region-main h3')
        if (
            titles.length <= 1 ||
            !titles[titles.length - 1].textContent.includes('测试结果')
        )
            setTimeout(() => location.reload(), 1000)
    })
})()
;(() => {
    if (!location.href.includes('result.php')) return
    // result.php 设置测试点颜色

    for (const row of document.querySelectorAll(
        '#test-result-detail > table > tbody > tr'
    )) {
        const result = row.querySelector('.cell.c12').textContent
        let color

        if (result.includes('RE:')) color = 'LightBlue'
        if (result.includes('FPE:')) color = 'BlanchedAlmond'
        if (result.includes('TLE:')) color = 'Tomato'
        if (result.includes('KS:')) color = 'Violet'

        if (color)
            for (const column of row.querySelectorAll('.cell'))
                column.style.backgroundColor = color
    }
})()
;(() => {
    if (!location.href.includes('view.php')) return
    // view.php 自动折叠公告

    function add_style_sheet() {
        const style = document.createElement('style')
        style.textContent = `\
      [role=main] > .course-content > .collapse-content {
          height: 15em;
          overflow: auto;
      }

      .hider {
          margin-top: -4em;
          background: linear-gradient(#0000, lightgray);
          height: 4em;

          display: grid;
          place-content: center;
      }
      #show-all {
          z-index: 2;
      }
      `
        document.head.appendChild(style)
    }

    const course_content = document.querySelector('[role=main] > .course-content')
    if (!course_content) return
    const front_content = course_content.querySelector(
        '.course-content > ul:first-child'
    )
    const single_section = course_content.querySelector('.single-section')
    const collapse = 'collapse-content' // moodle 已经占用了 .collapse:not(.show)

    if (front_content.clientHeight > (1 / 3) * window.innerHeight) {
        add_style_sheet()

        front_content.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
            h.textContent = h.textContent.trim()
        })
        front_content.classList.add(collapse)
        const div = document.createElement('div')
        div.classList.add('hider')
        div.innerHTML = '<button id="show-all">▼展开</button>'
        course_content.insertBefore(div, single_section)

        div.querySelector('#show-all').addEventListener('click', () => {
            front_content.classList.remove(collapse)
            div.hidden = true
        })
    }
})()
;(() => {
    if (!location.href.includes('view.php')) return
    // view.php 题目状态颜色显示

    function add_style_sheet() {
        const sheet = document.createElement('style')
        sheet.innerHTML = `\
      .problem-state-true,
      .quiz-state-true
      {
          color: #52C41A;
      }

      .problem-state-null,
      .quiz-state-false
      .problem-state-false
      {
          font-weight: bold;
          color: #E74C3C;
      }

      .problem-state-undefined
      {
          color: purple;
      }

      .state-pending {
          animation: pending 2s infinite ease;
      }
      .state-fetcherror {
          border: 3px solid red;
      }

      @keyframes pending {
          0% { background-color: #eee; }
          50% { background-color: #ddd; }
          100% { background-color: #eee; }
      }
      `
        document.head.appendChild(sheet)
    }

    async function check_all_problems() {
        for await (const e of document.querySelectorAll(
            "#region-main a[href*='lexue.bit.edu.cn/mod/programming/view']"
        )) {
            e.classList.add('state-pending')
            const result = await get_problem_state(
                new URL(e.href).searchParams.get('id')
            ).catch(err => e.classList.add('state-fetcherror'))
            e.classList.remove('state-pending')
            e.classList.add('quiz-state-' + String(result))
        }
    }
    async function check_all_quizzes() {
        for await (const e of document.querySelectorAll(
            "#region-main a[href*='lexue.bit.edu.cn/mod/quiz/view']"
        )) {
            e.classList.add('state-pending')
            const result = await get_quiz_state(e.href).catch(err =>
                                                              e.classList.add('state-fetcherror')
                                                             )
            e.classList.remove('state-pending')
            e.classList.add('problem-state-' + String(result))
        }
    }

    const parser = new DOMParser()

    /**
   * 获取编程题的情况
   * @param {String} problem_id 编程题的 id
   * @returns null 尚未提交
   * @returns undefined 正在排队或正在编译
   * @returns true 全部通过
   * @returns false 已提交但尚未全部通过
   */
    async function get_problem_state(problem_id) {
        const response = await fetch(
            document.location.origin + `/mod/programming/result.php?id=${problem_id}`
        ).then(e => e.text())
        const html = parser.parseFromString(response, 'text/html')

        const headings = html.querySelectorAll('#region-main h3')
        if (headings.length <= 1) return null
        if (headings[headings.length - 1].textContent !== '测试结果')
            return undefined

        const result = html.querySelector(
            '#test-result-detail > p:first-child'
        ).textContent
        const data = result.match(
            /测试结果：共 (?<total>\d+) 个测试用例，您的程序通过了其中的 (?<accepted>\d+) 个，未能通过的有 (?<rejected>\d+) 个。/
        )
        return data.groups.rejected == 0
    }

    /**
   * 获取测验的情况
   * @param {String} href 测验的 URL
   * @returns true 已完成
   * @returns false 未完成
   */
    async function get_quiz_state(href) {
        const response = await fetch(href).then(e => e.text())
        const heading = parser
        .parseFromString(response, 'text/html')
        .querySelector('[role=main] > h3')
        return heading && heading.textContent == '您上次尝试的概要'
    }

    add_style_sheet()
    check_all_problems()
    check_all_quizzes()
})()
;(async () => {
    if (!location.href.includes('mod/programming')) return
    // mod/programming 代码展示增强

    const style = document.createElement('style')
    style.textContent = `\
.path-mod-programming td.programming-io li::marker { content: ''; }
.path-mod-programming td.programming-io li {
  font-family: 'Fira Code', 'Courier New', Courier, monospace;
  line-height: normal;
}

pre.custom-pre {
margin: 0.5em 0;
padding: 0.3em 0.5em;
border: #ddd solid 1px;
background: rgb(250,250,250);
border-radius: 4px;
overflow: auto;
font-size: 0.875em;
font-family: monospace;
}
pre.custom-pre > div {
  overflow: hidden !important;
  height: unset !important;
  width: unset !important;
}
pre.custom-pre .ret {
  background: none !important;
  user-select: none !important;
  opacity: 0.4;
}

textarea#id_code {
  width: inherit;
  font-family: monospace;
}

.dp-highlighter ol {
  counter-reset: count;
}
.dp-highlighter ol li {
  line-height: unset;
  counter-increment: count;
  background-color: #f8f8f8 !important;
}
.dp-highlighter ol li::marker {
  content: counter(count, decimal-leading-zero) " ";
}
.path-mod-programming #codeview {
  overflow: auto;
}

button.copy-button {
  background-color: rgba(0, 87, 255, 0.06);
  color: rgba(0, 87, 255, 0.9);
  border-radius: 4px;
  border: 1px solid rgba(0, 102, 255, 0.15);
  margin: 0.2em 0.8em;
  padding: 0.2em 0.6em;
  font-size: 0.8em;
  font-family: initial;
  min-height: auto;
  line-height: normal;

  transition: all 150ms ease;
}
button.copy-button:hover {
  background-color: rgba(0, 87, 255, 0.1);
}
button.copy-button:focus {
  background-color: rgba(0, 87, 255, 0.1);
}
button.copy-button:active {
  background-color: rgba(0, 87, 255, 0.15);
}

.testcase-table tbody tr {
  display: flex;
}
.testcase-table tbody tr > td {
  flex: 1;
  background-color: #ffffff !important;
}
`
    document.head.appendChild(style)

    // IndexedDB Cache
    const dbName = 'lexueCache'
    const storeName = 'sampleCodeCache'

    async function dropDB() {
        return new Promise((res, rej) => {
            const request = indexedDB.deleteDatabase(dbName)
            request.onsuccess = res
            request.onerror = rej
        })
    }

    const version = localStorage.getItem('lexue-patch-version')
    if (parseInt(version) < 1) await dropDB()
    localStorage.setItem('lexue-patch-version', 1)

    async function openDB() {
        // drop the database first

        return new Promise((res, rej) => {
            const request = indexedDB.open(dbName)

            request.onsuccess = event => res(event.target.result)
            request.onerror = event => rej(event.target.error)

            request.onupgradeneeded = event => {
                const db = event.target.result
                if (!db.objectStoreNames.contains(storeName))
                    db.createObjectStore(storeName, { keyPath: 'key' })
            }
        })
    }

    async function getCache(key) {
        return new Promise(async (res, rej) => {
            const db = await openDB()
            const store = db.transaction(storeName, 'readonly').objectStore(storeName)
            const request = store.get(key)

            request.onsuccess = event => res(event.target.result ? event.target.result.code : null)
            request.onerror = event => rej(event.target.error)
        })
    }

    async function setCache(key, code) {
        return new Promise(async (res, rej) => {
            const db = await openDB()
            const store = db
            .transaction(storeName, 'readwrite')
            .objectStore(storeName)
            const request = store.put({ key, code })

            request.onsuccess = () => res()
            request.onerror = event => rej(event.target.error)
        })
    }

    if (document.querySelector('.testcase-table')) {
        document.querySelectorAll('.testcase-table .c0').forEach(e => e.remove())
        document.querySelector('.testcase-table thead').style.display = 'none'
    }
    const is3column = document.querySelector('#test-result-detail')
    document
        .querySelectorAll("td.programming-io > a[href*='download=0']")
        .forEach(async (a, id) => {
        // Description
        const description = document.createElement('span')
        description.textContent = is3column
            ? `${['输入', '答案', '输出'][id % 3]} #${~~(id / 3) + 1}`
            : `${['输入',        '输出'][id % 2]} #${~~(id / 2) + 1}`
        description.style.fontWeight = 'bold'
        description.style.backgroundColor = 'unset'

        // Copy button
        const copy_button = document.createElement('button')
        copy_button.textContent = '复制'
        copy_button.classList.add('copy-button')

        // Code block
        const pre = document.createElement('pre')
        pre.classList.add('custom-pre')
        pre.style.color = '#bbbbbb'
        pre.textContent = '(获取中)'

        a.parentNode.prepend(description, copy_button)
        a.parentNode.replaceChild(pre, a.parentNode.lastChild)
        a.remove()

        const key = new URL(a.href).search
        let str = await getCache(key)
        if (!str) {
            const data = await fetch(a.href).then(res => res.text())
            await setCache(key, data)
            str = data
        }

        if (str.length == 0) pre.textContent = '(输入为空)'
        else pre.textContent = '', pre.style.color = 'inherit'

        str = str.replace(/\r/g, '')
        let hasTrailingLineBreak = str[str.length - 1] == '\n'
        console.log(str)

        str.split('\n').forEach((line, lineNo, lineArray) => {
            // 末尾有换行，且在最后一行，那么省略渲染最后一个空行
            if(hasTrailingLineBreak && lineNo == lineArray.length - 1) return

            const div = document.createElement('div')
            pre.appendChild(div)

            const code = document.createElement('code')
            code.textContent = line
            div.append(code)

            // 末尾无换行，且在最后一行，那么不渲染换行符
            if(!hasTrailingLineBreak && lineNo == lineArray.length - 1) return

            const linebreak = document.createElement('span')
            linebreak.textContent = '↵'
            linebreak.classList.add('ret')
            div.append(linebreak)
        })

        copy_button.addEventListener('click', () =>
                                     navigator.clipboard.writeText(str).then(
            () => {
                if (copy_button.textContent == '复制')
                    setTimeout(() => (copy_button.textContent = '复制'), 1000)
                copy_button.textContent = '复制成功'
            },
            err => {
                if (copy_button.textContent == '复制')
                    setTimeout(() => (copy_button.textContent = '复制'), 2000)
                copy_button.textContent = '复制失败'
            }
        )
                                    )
    })
})()
;(() => {
    if (!location.href.includes('result.php')) return
    // result.php 显示优化
    if (!document.querySelector('#test-result-detail')) return
    if(document.querySelector('.compilemessage'))
        document.querySelector('.compilemessage').style.backgroundColor = '#ffe4e4'
    const el = document.querySelector('#test-result-detail').previousSibling
    el.style.fontWeight = 'bold'
    el.style.backgroundColor = '#ddd'
    el.style.margin = '0.5em 0'
    el.style.padding = '0.2em 0.3em'
    el.style.borderRadius = '4px'
    const text = document.querySelector(
        '#test-result-detail > p:first-child'
    ).textContent
    const data = text.match(
        /测试结果：共 (?<total>\d+) 个测试用例，您的程序通过了其中的 (?<accepted>\d+) 个，未能通过的有 (?<rejected>\d+) 个。/
    )
    if (data) {
        const { total, accepted } = data.groups
        el.textContent += ` (${accepted} / ${total})`
        if (accepted == total) {
            el.textContent += ' Accepted!'
            el.style.color = '#fff'
            el.style.backgroundColor = '#42ab0e'
        } else {
            el.textContent += ' Wrong Answer.'
            el.style.backgroundColor = '#ffe4e4'
            el.style.color = '#ff0424'
        }
    }
    document.querySelectorAll('#test-result-detail > p').forEach(e => e.remove())
})()
;(() => {
    if (!location.href.includes('history.php')) return
    // history.php 显示优化

    const update = () => {
        const parser = new DOMParser()
        const el = document.querySelector('.dp-highlighter')
        const code = parser.parseFromString(
            `<div>${el.highlighter.originalCode}</div>`,
            'text/html'
        ).body.textContent

        const copy_button = document.createElement('button')
        copy_button.textContent = '复制'
        copy_button.classList.add('copy-button')
        document.querySelector('.dp-highlighter .tools').replaceWith(copy_button)
        copy_button.addEventListener('click', () =>
                                     navigator.clipboard.writeText(code).then(
            () => {
                if (copy_button.textContent == '复制')
                    setTimeout(() => (copy_button.textContent = '复制'), 1000)
                copy_button.textContent = '复制成功'
            },
            err => {
                if (copy_button.textContent == '复制')
                    setTimeout(() => (copy_button.textContent = '复制'), 2000)
                copy_button.textContent = '复制失败'
            }
        )
                                    )
    }

    document
        .querySelectorAll('#submitlist')
        .forEach(el => el.addEventListener('click', () => setTimeout(update, 100)))
    addEventListener('load', update)
})()
