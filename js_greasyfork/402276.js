// ==UserScript==
// @name         LeetCode Helper for JavaScript
// @namespace    http://tampermonkey.net/
// @version      0.10
// @description  try to take over the world!
// @author       You
// @match        https://leetcode-cn.com/problems/*
// @match        https://leetcode-cn.com/contest/*/problems/*
// @match        https://leetcode.cn/problems/*
// @match        https://leetcode.cn/contest/*/problems/*
// @match        https://leetcode.com/problems/*
// @match        https://leetcode.com/contest/*/problems/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/402276/LeetCode%20Helper%20for%20JavaScript.user.js
// @updateURL https://update.greasyfork.org/scripts/402276/LeetCode%20Helper%20for%20JavaScript.meta.js
// ==/UserScript==

(function() {
    console.log('loading leetcode helper');
    const STYLE = `
    .leetcode-helper {
        position: fixed;
        background: rgba(255,255,255,1);
        z-index: 1024;
        width: 400px;
        min-height: 50px;
        top: 0;
        left: 0;
        border: .5px solid rgb(255, 109, 0);
        max-height: 500px;
        overflow-y: auto;
    }
    .leetcode-helper-header {
        font-weight: bold;
        color: white;
        background: rgb(255, 164, 97);
        padding: 2px 7px;
        position: sticky;
        top: 0;
    }
    .leetcode-helper-body {
        padding: 5px 10px;
    }
    .leetcode-helper-body .case {
        display: flex;
        justify-content: space-between;
    }
    .leetcode-helper-body .case>div {
        flex: 0 1 30%;
        overflow: auto;
    }
    .leetcode-helper-body section>div:last-child {
        flex: 0 1 60%;
    }
    .leetcode-helper-body section p {
        margin-bottom: 0px;
    }
    .leetcode-helper-body label {
        color: rgb(255, 109, 0); margin-right: 5px;'
    }
    .leetcode-helper-status {
        margin-left: 5px;
    }
    .leetcode-helper .case .title button {
        line-height: 12px;
        font-size: 12px;
    }
    .leetcode-helper .case textarea {
        width: 100%;
        overflow: auto;
        white-space: nowrap;
        border: 1px solid black;
        border-left: none;
        font-family: monospace;
    }
    .leetcode-helper .case div:first-child textarea {
        border-left: 1px solid black;
    }
    .leetcode-helper .success {
        background-color: lightgreen;
    }
    .leetcode-helper .error {
        background-color: #ff9090;
    }
    .leetcode-helper .message {
        white-space: pre;
        font-family: monospace;
        line-height: 1.2;
        padding: 2px 5px;
        max-height: 20em;
        overflow: auto;
    }
    .leetcode-helper .operations {
        margin-top: 5px;
    }
`

    main();

    async function main() {
        insertStyleSheets();
        const panel = createPanel()
        console.log('panel created:', panel);
        setDraggable(panel.querySelector('.leetcode-helper-header'), panel);
        document.body.appendChild(panel);
    }

    function getEditorText() {
        if (typeof monaco !== 'undefined') { // window is not the window, so window.monaco wont't work
            return monaco.editor.getModels()[0].getValue()
        }
        const el1 = document.querySelector('.editor-scrollable')
        if (el1) return el1.innerText

        const el2 = document.querySelector('.CodeMirror')
        if (el2) return el2.CodeMirror.getValue()

        return 'editor not found'
    }
    function getResolver(log) {
        const body = getEditorText()
        const match = /var\s+([a-zA-Z_$][\w$]*)\s*=/.exec(body)
        if (!match) throw new Error('resolver var xxx = function(){} not found')
        const fn = new Function(`console`, `${body}\n    return ${match[1]}`)
        return fn({
            log: function(...args) {
                log(args.map(serialize).join(' '))
            },
            error: function(...args) {
                log(args.map(serialize).join(' '))
            }
        })
    }
    function lineOffset() {
        try {
            const fn = new Function('console', 'throw new Error(314)')
            fn()
        } catch(e){
            const match = /(\d+):\d+\)($|\n)/.exec(e.stack)
            return match ? +match[1] - 1 : 2
        }
    }

    function insertStyleSheets() {
        const style = document.createElement('style')
        style.innerHTML = STYLE
        document.body.appendChild(style)
    }

    function getDescription() {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                const el1 = document.querySelector('[data-key=description-content]')
                const el2 = document.querySelector('.question-content')
                const content = el1 && el1.innerText || el2 && el2.innerText
                if (!content) return
                clearInterval(interval)
                resolve(content)
            }, 300);
        })
    }

    function setDraggable(handle, panel) {
        let dragging = false
        let initX
        let initY
        let initMarginX
        let initMarginY
        handle.addEventListener('mousedown', e => {
            dragging = true
            initX = e.clientX - (panel.style.left.slice(0, -2) || 0)
            initY = e.clientY - (panel.style.top.slice(0, -2) || 0)
            // console.log(mousedown, recording (${initX}, ${initY}))
        })
        window.addEventListener('mousemove', e => {
            if (!dragging) return
            const l = Math.min(window.innerWidth - 15, Math.max(0, e.clientX - initX))
            const t = Math.min(window.innerHeight - 15, Math.max(0, e.clientY - initY))
            // console.log(moving to (${l}, ${r}));
            panel.style.left = l + 'px'
            panel.style.top = t + 'px'
        })
        window.addEventListener('mouseup', e => {
            dragging = false
            GM_setValue('pos', [+panel.style.left.slice(0, -2), +panel.style.top.slice(0, -2)])
        })
    }
    function renderCases (ios, caseList) {
        for(const io of ios) {
            caseList.append(createCase(io.input, io.expected))
        }
    }
    function loadCases () {
        let ios
        try {
            ios = JSON.parse(GM_getValue('leetcode.io:' + location.href))
        } catch (err) {
            return false
        }
        if (!ios) return false
        return ios
    }
    async function saveCases () {
        const sections = document.querySelectorAll('.leetcode-helper .case-list .case')
        const ios = [...sections].map(section => ({
            input: section.querySelector('.input').value,
            expected: section.querySelector('.expected').value
        }))
        GM_setValue('leetcode.io:' + location.href, JSON.stringify(ios))
        console.log('cases saved', ios)
    }
    async function parseIO(caseList) {
        console.log('parsing IO from HTML...')
        const desc = await getDescription();
        const ios = parse(desc);
        console.log('parsed sample input/expected', ios);
        renderCases(ios, caseList);
        if (ios.length === 0) info('sample input/output not found')
        else saveCases(ios)
    }
    function createPanel() {
        const panel = document.createElement('div');
        panel.setAttribute('class', 'leetcode-helper');
        const pos = GM_getValue('pos')
        if (pos) {
            panel.style.left = Math.min(pos[0], window.innerWidth - 50) + 'px'
            panel.style.top = Math.min(pos[1], window.innerHeight - 50) + 'px'
        }

        const header = document.createElement('div');
        header.innerText = 'LeetCode Helper';
        header.setAttribute('class', 'leetcode-helper-header');
        panel.appendChild(header);

        const body = document.createElement('div');
        body.setAttribute('class', 'leetcode-helper-body');
        panel.appendChild(body);

        const caseList = document.createElement('div')
        caseList.classList.add('case-list')
        body.appendChild(caseList)

        window.messageEl = document.createElement('div')
        window.messageEl.classList.add('message')
        body.appendChild(window.messageEl);

        const operations = document.createElement('div')
        operations.classList.add('operations')
        operations.appendChild(createButton('RunAll', x => runAll(caseList.querySelectorAll('.case'))))
        operations.appendChild(createButton('AddCase', () => caseList.append(createCase())))
        operations.appendChild(createButton('Refresh', () => {
            caseList.innerHTML = ''
            parseIO(caseList)
        }))
        body.appendChild(operations)

        const ios = loadCases()
        if (ios) renderCases(ios, caseList);
        else parseIO(caseList);
        return panel;
    }
    function createCase(input = '', expected = '') {
        const section = document.createElement('section')
        section.classList.add('case')
        section.appendChild(createData('Input', input))
        section.appendChild(createData('Expected', expected))

        const output = createData('Output', '')
        output.querySelector('.title').appendChild(createButton('Run', () => run(section)))
        output.querySelector('.title').appendChild(createButton('Delete', () => section.remove()))
        section.appendChild(output)
        return section
    }
    function run(section) {
        const input = section.querySelector('.input').value
        const expected = section.querySelector('.expected').value
        const outputEl = section.querySelector('.output')
        info('Running...', section)

        requestAnimationFrame(() => requestAnimationFrame(() => {
            let args
            try {
                args = input.split('\n').map(parseArg)
            } catch (err) {
                outputEl.value = err.stack.split('\n').map(x => x.replace(/\([^:]*:[^:]*:/, '(')).join('\n')
                console.error(err)
                return error(outputEl.value, section)
            }
            console.log('calling resolver with', ...args)

            clear(section)
            let result = null
            let resolver
            try {
                fn = getResolver(x => info(x, section))
            } catch (err) {
                outputEl.value = err.stack.split('\n').slice(0, -3).join('\n')
                console.error(err)
                return error(outputEl.value, section)
            }
            try {
                result = fn(...args)
                console.log('result:', result)
            } catch(err) {
                const offset = lineOffset();
                const fixLineNumber = line => line.replace(/(\d+):(\d+)\)$/, (match, line, col) => `${line - offset}:${col})`)
                outputEl.value = err.stack.split('\n').slice(0, -2).map(x => x.replace(/eval at [^)]*\), <[^>]*>:/, '')).map(fixLineNumber).join('\n')
                console.error(err)
                return error(outputEl.value, section)
            }
            const output = serialize(result)
            outputEl.value = output
            if (output === expected) {
                success('Accepted', section)
            } else {
                error('Wrong Answer', section)
                console.error(`Failed:\nExpected: ${expected}\nOutput: ${output}`)
            }
        }))
    }
    function runAll(sections) {
        for(const section of sections) run(section)
    }
    function clear(section) {
        const outputEl = section.querySelector('.output')
        outputEl.classList.remove('error')
        outputEl.classList.remove('success')

        const messageEl = window.messageEl
        messageEl.innerText = ''
        messageEl.classList.remove('info')
        messageEl.classList.remove('error')
        messageEl.classList.remove('success')
    }
    function success(msg, section) {
        const outputEl = section.querySelector('.output')
        outputEl.classList.add('success')

        const messageEl = window.messageEl
        messageEl.innerText += msg + '\n'
        messageEl.classList.add('success')
    }
    function info(msg, section) {
        console.log(msg)
        const messageEl = window.messageEl
        messageEl.innerText += msg + '\n'
        messageEl.classList.add('info')
    }
    function error(msg, section) {
        const outputEl = section.querySelector('.output')
        outputEl.classList.add('error')

        const messageEl = window.messageEl
        messageEl.innerText += msg + '\n'
        messageEl.classList.add('error')
    }
    function serialize(result) {
        return JSON.stringify(result, (k, v) => {
            if (Number.isNaN(v) || v === Infinity || v === -Infinity || v === undefined || typeof v === 'bigint') return '' + v
            return v
        })
    }
    function parseArg(arg) {
        return JSON.parse(arg.trim())
    }
    function createButton(text, onClick) {
        const btn = document.createElement('button')
        btn.innerText = text
        btn.addEventListener('click', onClick)
        return btn
    }
    function createData(labelText, str = '') {
        const div = document.createElement('div');

        const p = document.createElement('p')
        p.classList.add('title')
        const label = document.createElement('label')
        label.innerText = labelText
        p.appendChild(label);
        div.appendChild(p);

        const textarea = document.createElement('textarea')
        textarea.setAttribute('class', labelText.toLowerCase())
        textarea.value = str;
        textarea.addEventListener('blur', () => saveCases())
        div.appendChild(textarea)
        return div
    }
    function parse(text) {
        const r = /(?:输入|Input)[:：]([\s\S]*?)(?:输出|Output)[:：][\s\n]*(?:.*：)?(.*)(\n|$)/ig
        const ans = []
        let match
        while(match = r.exec(text)) {
            const [, input, expected] = match
            ans.push({
                input: parseInput(input.trim()),
                expected: parseExpected(expected)
            })
        }
        return ans
    }
    function parseExpected(expected) {
        try {
            return JSON.stringify(JSON.parse(expected))
        } catch (err) {
            return expected
        }
    }
    function parseInput(input) {
        const args = []
        const pair = {
            "'": "'",
            '"': '"',
            '[': ']',
            '{': '}',
            '(': ')'
        }
        let state = 'input'
        let stack
        let arg
        for(let i = 0; i < input.length; i++) {
            const char = input.charAt(i)
            if (state === 'input') {
                if (char === '=') {
                    state = 'expr'
                    arg = ''
                    stack = []
                }
            } else if (state === 'expr') {
                if ('"\'[]{}()'.includes(char) && input[i - 1] !== '\\') {
                    if (pair[stack[stack.length - 1]] === char) stack.pop()
                    else stack.push(char)
                    arg += char
                } else if (stack.length) {
                    arg += char
                } else if ((char === ',' || char === '\n') && stack.length === 0) {
                    state = 'input'
                    args.push(arg)
                    arg = ''
                } else {
                    arg += char
                }
            }
        }
        if (arg === undefined) args.push(input)
        else if (arg) args.push(arg)
        return args.map(x => x.split('\n').map(l => l.trim()).join(' ').trim()).join('\n')
    }
})();