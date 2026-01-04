// ==UserScript==
// @name         csdn killer
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  try to kill csdn!
// @author       lgx
// @match        https://blog.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453641/csdn%20killer.user.js
// @updateURL https://update.greasyfork.org/scripts/453641/csdn%20killer.meta.js
// ==/UserScript==

(function() {
    'use strict'
    const elem = document.querySelector('#article_content')
    elem && (elem.style.height = '')
    const func = () => document.querySelectorAll(`#csdn-toolbar,.toolbar-advert,.passport-login-container,
    #csdn-toolbar-profile-nologin,.csdn-side-toolbar,#toolBarBox,.hide-article-box,.hljs-button,.adgoogle,
    #rightAside,.blog_container_aside,.recommend-box,#recommendNps,.passport-login-tip-container`)
    .forEach(e => e.remove())
    if ('function' === typeof window.$) {
        const __$ = window.$
        window.$ = Object.assign(s => {
            return s === '#toolBarBox' ? { offset() {return 0}, width() {}, removeClass() {} } : __$(s)
        }, __$)
    }
    func()
    window.addEventListener('wheel', func)

    const __log = console.log
    console.log = (...msg) => {
        if (!msg[0]?.toString().startsWith('LTSSDK')) {
            __log.call(console, ...msg)
        }
    }

    const style = document.createElement('style')
    style.textContent = `
        #mainBox > main {
            width: auto;
            float: none;
        }

        pre.coping {
            animation: pre-copy .3s backwards;
        }

        @keyframes pre-copy {
            0% {
                transform: none;
            }
            15% {
                transform: translate(-10px,-20px) rotate(-1deg);
            }
            30% {
                transform: none;
            }
            45% {
                transform: translate(10px,-20px) rotate(1deg);
            }
            60% {
                transform: none;
            }
            70% {
                transform: translate(-5px,10px) rotate(-1deg);
            }
            80% {
                transform: none;
            }
            90% {
                transform: translate(5px,10px) rotate(1deg);
            }
            100% {
                transform: none;
            }
        }

        code.coping .selected, code.coping .select-start, code.coping .select-end {
            animation: span-copy .3s backwards;
        }
        code.coping .select-before > ::before, code.coping .select-after > ::before {
            animation: span-copy-outer .3s backwards;
        }

        @keyframes span-copy {
            0% {
                background-color: #5f58;
            }
            100% {
                background-color: #5f52;
            }
        }

        @keyframes span-copy-outer {
            0% {
                outline-color: #5f5f;
            }
            100% {
                outline-color: #5f54;
            }
        }

        .prism-atom-one-light .prism span,.prism-atom-one-dark .prism span {
            font: inherit !important;
        }
        .csdn-killer-code-char {
            position: relative;
            display: inline-block;
            transition: opacity .2s;
        }
        .markdown_views pre.prettyprint > code.prism {
            background-color: transparent !important;
            overflow: hidden;
            border-radius: none !important;
        }

        pre.prettyprint {
            border-radius: 10px;
            padding: 8px 0 0 48px !important;
        }
        .prism-atom-one-dark pre.prettyprint {
            background: linear-gradient(170deg, #202c3e, #03112b);
        }
        .prism-atom-one-light pre.prettyprint {
            background: linear-gradient(170deg, #f0f4fb, #d2dbea)
        }

        pre.set-code-hide {
            border-radius: 10px 10px 0 0;
            padding-left: 56px !important;
        }

        .markdown_views pre.prettyprint > ul.pre-numbering {
            box-shadow: 0 0 8px #00c5;
        }
        .prism-atom-one-dark .prettyprint > .pre-numbering {
            background: linear-gradient(160deg, #3c5279, #233c68);
        }
        .prism-atom-one-light .prettyprint > .pre-numbering {
            background: linear-gradient(160deg, #cbd9f2, #92b5f0)
        }
        .prettyprint > .pre-numbering > li {
            transition: background-color .2s;
            border-right: none !important;
        }

        .markdown_views pre.prettyprint > ul.pre-numbering,
        .markdown_views pre.prettyprint ul.lines {
            padding-bottom: 36px;
        }
        .markdown_views pre.prettyprint ul.lines {
            margin: 0;
            width: 100%;
        }
        .markdown_views pre.prettyprint ul.lines > li {
            margin: 0;
            width: 100%;
            height: 22px;
            list-style: none;
            padding: 0 24px 0 8px;
            line-height: 22px !important;
            transition: background-color .2s;
        }
        .csdn-killer-code-char.selected-candidate,
        .csdn-killer-code-char.selected:not(.deselected-candidate) {
            background-color: #5f52;
            font-weight: bolder !important;
        }
        .fade .pre-numbering :not(.selected),
        .fade code .csdn-killer-code-char.deselected-candidate,
        .fade code .csdn-killer-code-char:not(.selected-candidate):not(.selected) {
            opacity: .5;
        }
        .csdn-killer-code-char > span {
            display: none;
        }

        code .select-after:not(.marked) > span,
        code .select-before:not(.marked) > span,
        code .select-after-candidate:not(.marked) > span,
        code .select-before-candidate:not(.marked) > span {
            top: 0;
            overflow: clip;
            position: absolute;
            display: inline-block;
            box-sizing: border-box;
            width: calc(100% - 2px);
        }
        code .select-before.select-after:not(.marked) > span,
        code .select-before-candidate.select-after:not(.marked) > span,
        code .select-before.select-after-candidate:not(.marked) > span,
        code .select-before-candidate.select-after-candidate:not(.marked) > span {
            width: calc(100% - 4px);
        }
        code .select-before:not(.marked) > span,
        code .select-before-candidate:not(.marked) > span {
            left: 0;
        }
        code .select-after:not(.marked) > span,
        code .select-after-candidate:not(.marked) > span {
            left: 2px;
        }
        code .select-after:not(.marked) > span::before,
        code .select-before:not(.marked) > span::before,
        code .select-after-candidate:not(.marked) > span::before,
        code .select-before-candidate:not(.marked) > span::before {
            content: ' ';
            outline: 5px solid #5f54;
            transition: opacity .2s;
            display: block;
            opacity: .5;
        }
        .fade code .select-after:not(.marked):not(.selected):not(.selected-candidate) > span::before,
        .fade code .select-before:not(.marked):not(.selected):not(.selected-candidate) > span::before,
        .fade code .select-after-candidate:not(.marked):not(.selected):not(.selected-candidate) > span::before,
        .fade code .select-before-candidate:not(.marked):not(.selected):not(.selected-candidate) > span::before {
            opacity: 1;
        }
        code .select-before.top:not(.marked):not(.selected):not(.selected-candidate):not(.top-prevent) > span::before,
        code .select-before.top-candidate:not(.marked):not(.selected):not(.selected-candidate):not(.top-prevent) > span::before,
        code .select-before-candidate.top:not(.marked):not(.selected):not(.selected-candidate):not(.top-prevent) > span::before,
        code .select-before-candidate.top-candidate:not(.marked):not(.selected):not(.selected-candidate):not(.top-prevent) > span::before {
            border-top-right-radius: 5px;
        }
        code .select-before.bottom:not(.marked):not(.selected):not(.selected-candidate):not(.bottom-prevent) > span::before,
        code .select-before.bottom-candidate:not(.marked):not(.selected):not(.selected-candidate):not(.bottom-prevent) > span::before,
        code .select-before-candidate.bottom:not(.marked):not(.selected):not(.selected-candidate):not(.bottom-prevent) > span::before,
        code .select-before-candidate.bottom-candidate:not(.marked):not(.selected):not(.selected-candidate):not(.bottom-prevent) > span::before {
            border-bottom-right-radius: 5px;
        }
        code .select-after.top:not(.marked):not(.selected):not(.selected-candidate):not(.top-prevent) > span::before,
        code .select-after.top-candidate:not(.marked):not(.selected):not(.selected-candidate):not(.top-prevent) > span::before,
        code .select-after-candidate.top:not(.marked):not(.selected):not(.selected-candidate):not(.top-prevent) > span::before,
        code .select-after-candidate.top-candidate:not(.marked):not(.selected):not(.selected-candidate):not(.top-prevent) > span::before {
            border-top-left-radius: 5px;
        }
        code .select-after.bottom:not(.marked):not(.selected):not(.selected-candidate):not(.bottom-prevent) > span::before,
        code .select-after.bottom-candidate:not(.marked):not(.selected):not(.selected-candidate):not(.bottom-prevent) > span::before,
        code .select-after-candidate.bottom:not(.marked):not(.selected):not(.selected-candidate):not(.bottom-prevent) > span::before,
        code .select-after-candidate.bottom-candidate:not(.marked):not(.selected):not(.selected-candidate):not(.bottom-prevent) > span::before {
            border-bottom-left-radius: 5px;
        }
        .csdn-killer-code-char.select-start-candidate:not(.select-start-prevent),
        .csdn-killer-code-char.select-start:not(.marked):not(.select-start-prevent) {
            padding-left: 2px;
            margin-left: -2px;
        }
        .csdn-killer-code-char.select-end-candidate:not(.select-end-prevent),
        .csdn-killer-code-char.select-end:not(.marked):not(.select-end-prevent) {
            padding-right: 2px;
            margin-right: -2px;
        }
        .csdn-killer-code-char.select-start-candidate.tl:not(.select-start-prevent):not(.top-prevent):not(.tl-prevent),
        .csdn-killer-code-char.select-start-candidate.top:not(.select-start-prevent):not(.top-prevent):not(.tl-prevent),
        .csdn-killer-code-char.select-start.tl:not(.marked):not(.select-start-prevent):not(.top-prevent):not(.tl-prevent),
        .csdn-killer-code-char.select-start.top:not(.marked):not(.select-start-prevent):not(.top-prevent):not(.tl-prevent),
        .csdn-killer-code-char.select-start-candidate.top-candidate:not(.select-start-prevent):not(.top-prevent):not(.tl-prevent),
        .csdn-killer-code-char.select-start.top-candidate:not(.marked):not(.select-start-prevent):not(.top-prevent):not(.tl-prevent) {
            border-top-left-radius: 5px;
        }
        .csdn-killer-code-char.select-start-candidate.bl:not(.select-start-prevent):not(.bottom-prevent):not(.bl-prevent),
        .csdn-killer-code-char.select-start.bl:not(.marked):not(.select-start-prevent):not(.bottom-prevent):not(.bl-prevent),
        .csdn-killer-code-char.select-start-candidate.bottom:not(.select-start-prevent):not(.bottom-prevent):not(.bl-prevent),
        .csdn-killer-code-char.select-start.bottom:not(.marked):not(.select-start-prevent):not(.bottom-prevent):not(.bl-prevent),
        .csdn-killer-code-char.select-start-candidate.bottom-candidate:not(.select-start-prevent):not(.bottom-prevent):not(.bl-prevent),
        .csdn-killer-code-char.select-start.bottom-candidate:not(.marked):not(.select-start-prevent):not(.bottom-prevent):not(.bl-prevent) {
            border-bottom-left-radius: 5px;
        }
        .csdn-killer-code-char.select-end-candidate.tr:not(.select-end-prevent):not(.top-prevent):not(.tr-prevent),
        .csdn-killer-code-char.select-end-candidate.top:not(.select-end-prevent):not(.top-prevent):not(.tr-prevent),
        .csdn-killer-code-char.select-end.tr:not(.marked):not(.select-end-prevent):not(.top-prevent):not(.tr-prevent),
        .csdn-killer-code-char.select-end.top:not(.marked):not(.select-end-prevent):not(.top-prevent):not(.tr-prevent),
        .csdn-killer-code-char.select-end-candidate.top-candidate:not(.select-end-prevent):not(.top-prevent):not(.tr-prevent),
        .csdn-killer-code-char.select-end.top-candidate:not(.marked):not(.select-end-prevent):not(.top-prevent):not(.tr-prevent) {
            border-top-right-radius: 5px;
        }
        .csdn-killer-code-char.select-end-candidate.br:not(.select-end-prevent):not(.bottom-prevent):not(.br-prevent),
        .csdn-killer-code-char.select-end.br:not(.marked):not(.select-end-prevent):not(.bottom-prevent):not(.br-prevent),
        .csdn-killer-code-char.select-end-candidate.bottom:not(.select-end-prevent):not(.bottom-prevent):not(.br-prevent),
        .csdn-killer-code-char.select-end.bottom:not(.marked):not(.select-end-prevent):not(.bottom-prevent):not(.br-prevent),
        .csdn-killer-code-char.select-end-candidate.bottom-candidate:not(.select-end-prevent):not(.bottom-prevent):not(.br-prevent),
        .csdn-killer-code-char.select-end.bottom-candidate:not(.marked):not(.select-end-prevent):not(.bottom-prevent):not(.br-prevent) {
            border-bottom-right-radius: 5px;
        }
        .csdn-killer-code-line-end {
            overflow: clip;
            margin-left: 2px;
            display: inline-block;
        }
        .csdn-killer-code-line-end.top:not(.top-prevent)::before,
        .csdn-killer-code-line-end.bottom:not(.bottom-prevent)::before,
        .csdn-killer-code-line-end.top-candidate:not(.top-prevent)::before,
        .csdn-killer-code-line-end.bottom-candidate:not(.bottom-prevent)::before {
            outline: 5px solid #5f52;
            display: block;
            content: ' ';
        }
        .csdn-killer-code-line-end.top:not(.top-prevent)::before,
        .csdn-killer-code-line-end.top-candidate:not(.top-prevent)::before {
            border-top-left-radius: 5px;
        }
        .csdn-killer-code-line-end.bottom:not(.bottom-prevent)::before,
        .csdn-killer-code-line-end.bottom-candidate:not(.bottom-prevent)::before {
            border-bottom-left-radius: 5px;
        }

        .markdown_views pre.prettyprint ul.lines > li.line-selected,
        .markdown_views pre.prettyprint ul.pre-numbering > li.line-selected {
            background-color: #57f1;
        }
        .markdown_views pre.prettyprint ul.lines > li.line-deselected,
        .markdown_views pre.prettyprint ul.pre-numbering > li.line-deselected {
            background-color: #f751;
        }
        .markdown_views pre.prettyprint ul.lines > li.active,
        .markdown_views pre.prettyprint ul.pre-numbering > li.active {
            background-color: #57f2;
        }
        .markdown_views pre.prettyprint ul.lines > li.line-deselected.active,
        .markdown_views pre.prettyprint ul.pre-numbering > li.line-deselected.active {
            background-color: #f752;
        }
        .prism-atom-one-light.markdown_views pre.prettyprint ul.lines > li.line-selected,
        .prism-atom-one-light.markdown_views pre.prettyprint ul.pre-numbering > li.line-selected,
        .prism-atelier-sulphurpool-light.markdown_views pre.prettyprint ul.lines > li.line-selected,
        .prism-atelier-sulphurpool-light.markdown_views pre.prettyprint ul.pre-numbering > li.line-selected {
            background-color: #abf1;
        }
        .prism-atom-one-light.markdown_views pre.prettyprint ul.lines > li.line-deselected,
        .prism-atom-one-light.markdown_views pre.prettyprint ul.pre-numbering > li.line-deselected,
        .prism-atelier-sulphurpool-light.markdown_views pre.prettyprint ul.lines > li.line-deselected,
        .prism-atelier-sulphurpool-light.markdown_views pre.prettyprint ul.pre-numbering > li.line-deselected {
            background-color: #fba1;
        }
        .prism-atom-one-light.markdown_views pre.prettyprint ul.lines > li.active,
        .prism-atom-one-light.markdown_views pre.prettyprint ul.pre-numbering > li.active,
        .prism-atelier-sulphurpool-light.markdown_views pre.prettyprint ul.lines > li.active,
        .prism-atelier-sulphurpool-light.markdown_views pre.prettyprint ul.pre-numbering > li.active {
            background-color: #abf2;
        }
        .prism-atom-one-light.markdown_views pre.prettyprint ul.lines > li.line-deselected.active,
        .prism-atom-one-light.markdown_views pre.prettyprint ul.pre-numbering > li.line-deselected.active,
        .prism-atelier-sulphurpool-light.markdown_views pre.prettyprint ul.lines > li.line-deselected.active,
        .prism-atelier-sulphurpool-light.markdown_views pre.prettyprint ul.pre-numbering > li.line-deselected.active {
            background-color: #fba2;
        }

        code > .select-rect {
            border: 1px solid #58f5;
            background-color: #57f2;
            position: absolute;
            opacity: 1;
        }
        code > .deselect.select-rect {
            border: 1px solid #f855;
            background-color: #f752;
        }

        code > .select-rect.select-rect-fake {
            border: 1px solid #58fa;
            background-color: #57f5;
            transition: opacity .15s;
            opacity: 0;
        }
        code > .deselect.select-rect.select-rect-fake {
            border: 1px solid #f85a;
            background-color: #f755;
        }

        .len {
            position: fixed;
            font-size: 24px;
            font-weight: bolder;
            animation: fly 2s forwards;
            text-shadow: 0 2px 5px #fff;
        }

        @keyframes fly {
            0% {
                transform: translateY(0);
                opacity: 1;
            }
            100% {
                transform: translateY(-20px);
                opacity: 0;
            }
        }

        @media screen and (min-width:1550px) {
            .nodata .container {
                margin-right: 0;
            }
        }
    `
    document.head.appendChild(style)

    /*
        <parent>
        <node#text>te \n xt</node#text>
        <next></next>
        ...
        </parent>

         ||
         ||
        \\//
         \/

        <parent>
        <node#text>t</node#text>
        <node#text>e</node#text>
        <node#text> </node#text>
        <node#text>\n</node#text>
        <node#text> </node#text>
        <node#text>x</node#text>
        <node#text>t</node#text>
        <next></next>
        ...
        </parent>
        */
    function parseNode(node) {
        if (node.nodeName === '#text') {

            const parent = node.parentElement, next = node.nextSibling
            node.data.split(new RegExp('', 'u')).forEach(ch => {
                if (ch === '\n') {
                    const nl = document.createTextNode(ch)
                    parent.insertBefore(nl, next)
                    return
                }
                const charSpan = document.createElement('span')
                charSpan.textContent = ch
                charSpan.classList.add('csdn-killer-code-char')
                charSpan.appendChild(document.createElement('span'))
                parent.insertBefore(charSpan, next)
            })
            node.remove()
        } else {
            [...node.childNodes].forEach(parseNode)
        }
    }

    /**  split an element by new line like the following demo
                                                             <element>
                                                                 <child>
                                                                     <child>
                                                                         text
                                                                     </child>
                                                                 </child>
                                                             </element>
                <element>                                    \n
                    <child>                                  <element>
                        <child>                                  <child>
                            text \n text          \\                 <child>
                        </child>              =====\\                    text
                    </child>                  =====//                </child>
                    <child>                       //             </child>
                        text \n text                             <child>
                    </child>                                         text
                </element>                                       </child>
                                                             </element>
                                                             \n
                                                             <element>
                                                                 <child>
                                                                     text
                                                                 </child>
                                                             </element>
         */
    function parseLines(codeBlock) {

        function splitByNewLine(element) {
            if (!element.textContent.includes('\n')) return
            ;[...element.children].forEach(splitByNewLine)
            const elList = [...element.childNodes].reduce((ls, node) => {
                if (node.nodeName === '#text') {
                    if (node.data === '\n') {
                        ls.push(document.createTextNode('\n'))
                        ls.push([])
                    }
                } else {
                    ls.at(-1).push(node)
                }
                return ls
            }, [[]])

            const parent = element.parentElement
            elList.forEach(el => {
                if (el.nodeName === '#text') {
                    parent.insertBefore(el, element)
                    return
                }
                const newNode = element.cloneNode()
                newNode.append(...el)
                parent.insertBefore(newNode, element)
            })
            element.remove()
        }

        ;[...codeBlock.children].forEach(splitByNewLine)
        const list = [...codeBlock.childNodes]
        .reduce((a, b) => (void (b.data ? b.remove() || a.push([]) : a.at(-1).push(b))) || a, [[]])
        const lineNumbers = codeBlock.parentElement.querySelector('.pre-numbering').children
        const lines = document.createElement('ul')
        lines.classList.add('lines')
        list.pop()
        lines.append(...list.map((line, ind) => {
            const li = document.createElement('li')
            const end = document.createElement('span')
            end.classList.add('csdn-killer-code-line-end')
            li.append(...line, end)
            li.lineNumber = lineNumbers[ind]
            li.lineNumber.line = li
            li.index = ind
            addMouseEvent(li)
            return li
        }))
        codeBlock.lines = [...lines.children]
        codeBlock.append(lines)

        return lines.childElementCount
    }

    function addMouseEvent(domLine) {
        function enter() {
            domLine.classList.add('active')
            domLine.lineNumber.classList.add('active')
        }
        function leave() {
            domLine.classList.remove('active')
            domLine.lineNumber.classList.remove('active')
        }
        domLine.addEventListener('mouseenter', enter)
        domLine.addEventListener('mouseleave', leave)
        domLine.lineNumber.addEventListener('mouseenter', enter)
        domLine.lineNumber.addEventListener('mouseleave', leave)
    }

    function makeSelectable(domCodeBlock) {
        let active = 1, timeout = void 0, cand
        const rect = document.createElement('div')
        rect.classList.add('select-rect')
        domCodeBlock.appendChild(rect)
        domCodeBlock.addEventListener('contextmenu', e => e.preventDefault())
        domCodeBlock.addEventListener('mousedown', e => {
            if (![0, 2].includes(e.button) || active !== 1) return
            active = e.button

            const cls = ['line-selected', '', 'line-deselected'][active]
            const beginLine = domCodeBlock.lines[0]
            const endLine = domCodeBlock.lines[domCodeBlock.lines.length - 1]
            const curLine = (() => {
                let line = e.target
                if (line.nodeName === 'UL') {
                    line = e.clientY < beginLine.getBoundingClientRect().top ?
                        beginLine : endLine
                }
                if (line === rect) {
                    line = domCodeBlock.lines.find(line => {
                        const { top, height } = line.getBoundingClientRect()
                        return e.clientY <= top + height
                    })
                }
                while (line && line.nodeName !== 'LI') {
                    line = line.parentElement
                }
                return line
            })()
            curLine.classList.add(cls)
            curLine.lineNumber.classList.add(cls)

            const { top, left } = domCodeBlock.getBoundingClientRect()
            rect.classList[['remove', void 0, 'add'][e.button]]('deselect')
            rect.style.top = (e.clientY - top) + 'px'
            rect.style.left = (e.clientX - left) + 'px'
            rect.style.width = '0'
            rect.style.height = '0'

            let y = e.clientY, x = e.clientX
            function move(ev) {
                const { top: t, left: l, height: h } = domCodeBlock.getBoundingClientRect()
                x = ev.clientX ?? x; y = ev.clientY ?? y
                const newTop = (Math.min(e.clientY - top, y - t + 1))
                const newLeft = (Math.min(e.clientX - left, x - l + 1))
                const newWidth = Math.abs(e.clientX - left - x + l) - 2
                const newHeight = Math.abs(e.clientY - top - y + t) - 2
                rect.style.display = newWidth > 0 && newHeight > 0 ? '' : 'none'
                rect.style.top = newTop + 'px'
                rect.style.left = newLeft + 'px'
                rect.style.width = newWidth + 'px'
                rect.style.height = newHeight + 'px'

                const [start, end] = domCodeBlock.updatedLine = (() => {
                    if (curLine !== beginLine && newTop < 0) {
                        return [beginLine, curLine]
                    }
                    if (curLine !== endLine && newTop + newHeight > h - 38) {
                        return [curLine, endLine]
                    }
                    let line = domCodeBlock.lines.find(line => {
                        const { top, height } = line.getBoundingClientRect()
                        return y <= top + height
                    }) || endLine
                    return curLine.index > line.index ? [line, curLine] : [curLine, line]
                })()
                for (let i = start.index - 1; i >= 0; i--) {
                    if (!domCodeBlock.lines[i].classList.contains(cls)) break
                    domCodeBlock.lines[i].classList.remove(cls)
                    domCodeBlock.lines[i].lineNumber.classList.remove(cls)
                }
                for (let i = start.index; i <= end.index; i++) {
                    domCodeBlock.lines[i].classList.add(cls)
                    domCodeBlock.lines[i].lineNumber.classList.add(cls)
                }
                for (let i = end.index + 1; i < domCodeBlock.lines.length ; i++) {
                    if (!domCodeBlock.lines[i].classList.contains(cls)) break
                    domCodeBlock.lines[i].classList.remove(cls)
                    domCodeBlock.lines[i].lineNumber.classList.remove(cls)
                }

                cand?.forEach(x => x.classList.remove('deselected-candidate', 'selected-candidate'))
                revertRadius()
                if (!buttons[2 - active]) {
                    cand = candidate(
                        start, end,
                        { type: active, shift: ev.shiftKey || ev.metaKey,
                         left: Math.min(e.clientX, x + 1),
                         right: Math.min(e.clientX, x + 1) + newWidth }
                    )
                    makeRadius()
                } else {
                    cand = []
                }

            }
            const buttons = {}
            function mousedown(ev) {
                buttons[ev.button] = true
                move(ev)
            }
            function prevent(ev) {
                ev.preventDefault()
            }
            function shift(ev) {
                ev.key === 'Escape' && ev.preventDefault()
                if (ev.key === 'Shift' || ev.key === 'Meta') move(ev)
            }
            function escape(ev) {
                if (ev.key === 'Escape') {
                    buttons[2 - active] = true
                    up({ ...ev, button: active })
                }
            }
            function up(ev) {
                buttons[ev.button] = false
                move(ev)
                if (ev.button !== e.button) return
                timeout = setTimeout(() => (rect.style.display = 'none'), 150)
                rect.classList.add('select-rect-fake')
                domCodeBlock.lines.forEach(line => {
                    line.classList.remove('line-selected', 'line-deselected')
                    line.lineNumber.classList.remove('line-selected', 'line-deselected')
                })

                buttons[2 - active] && (rect.style.display = 'none') &&
                cand?.forEach(x => x.classList.remove('deselected-candidate', 'selected-candidate'))
                updateSelection(domCodeBlock)
                cand = void 0
                active = 1

                window.removeEventListener('contextmenu', prevent)

                window.removeEventListener('scroll', move)
                window.removeEventListener('mousemove', move)
                window.removeEventListener('mousedown', mousedown)
                window.removeEventListener('mouseup', up)

                window.removeEventListener('keydown', shift)
                window.removeEventListener('keyup', escape)
                window.removeEventListener('keyup', shift)
            }
            window.addEventListener('contextmenu', prevent)

            window.addEventListener('scroll', move)
            window.addEventListener('mousemove', move)
            window.addEventListener('mousedown', mousedown)
            window.addEventListener('mouseup', up)

            window.addEventListener('keydown', shift)
            window.addEventListener('keyup', escape)
            window.addEventListener('keyup', shift)
            move(e)

            clearTimeout(timeout)
            rect.classList.remove('select-rect-fake')
        })
        domCodeBlock.style.position = 'relative'
    }

    function rowsSelection(domUlLineNumbers) {
        if (!domUlLineNumbers) return
        let active = 1, cand
        const domCodeBlock = domUlLineNumbers.parentElement.querySelector('code')
        const lineNumbers = [...domUlLineNumbers.children]
        domUlLineNumbers.addEventListener('contextmenu', e => e.preventDefault())
        domUlLineNumbers.addEventListener('mousedown', e => {
            if (![0, 2].includes(e.button) || active !== 1) return
            active = e.button

            const cls = ['line-selected', '', 'line-deselected'][e.button]
            const beginLineNumber = lineNumbers[0]
            const endLineNumber = lineNumbers[lineNumbers.length - 1]
            const curLineNumber = (() => {
                let lineNumber = e.target
                if (lineNumber?.nodeName === 'UL') {
                    lineNumber = e.clientY < beginLineNumber.getBoundingClientRect().top ?
                        beginLineNumber : endLineNumber
                }
                while (lineNumber && lineNumber.nodeName !== 'LI') {
                    lineNumber = lineNumber.parentElement
                }
                return lineNumber
            })()
            curLineNumber.classList.add(cls)
            curLineNumber.line.classList.add(cls)

            const { top } = domUlLineNumbers.getBoundingClientRect()

            let y = e.clientY
            function move(ev) {
                const { top: t, height: h } = domUlLineNumbers.getBoundingClientRect()
                y = ev.clientY ?? y
                const newTop = (Math.min(e.clientY - top, y - t + 1))
                const newHeight = Math.abs(e.clientY - top - y + t) - 2

                const [start, end] = domCodeBlock.updatedLine = (() => {
                    if (curLineNumber !== beginLineNumber && newTop < 0) {
                        return [beginLineNumber.line, curLineNumber.line]
                    }
                    if (curLineNumber !== endLineNumber && newTop + newHeight > h - 38) {
                        return [curLineNumber.line, endLineNumber.line]
                    }
                    const lineNumber = lineNumbers.find(line => {
                        const { top, height } = line.getBoundingClientRect()
                        return y <= top + height
                    }) || endLineNumber
                    return curLineNumber.line.index > lineNumber.line.index
                            ? [lineNumber.line, curLineNumber.line]
                            : [curLineNumber.line, lineNumber.line]
                })()
                for (let i = start.index - 1; i >= 0; i--) {
                    if (!lineNumbers[i].classList.contains(cls)) break
                    lineNumbers[i].classList.remove(cls)
                    lineNumbers[i].line.classList.remove(cls)
                }
                for (let i = start.index; i < end.index; i++) {
                    if (lineNumbers[i].classList.contains(cls)) break
                    lineNumbers[i].classList.add(cls)
                    lineNumbers[i].line.classList.add(cls)
                }
                for (let i = end.index; i > start.index; i--) {
                    if (lineNumbers[i].classList.contains(cls)) break
                    lineNumbers[i].classList.add(cls)
                    lineNumbers[i].line.classList.add(cls)
                }
                for (let i = end.index + 1; i < lineNumbers.length; i++) {
                    if (!lineNumbers[i].classList.contains(cls)) break
                    lineNumbers[i].classList.remove(cls)
                    lineNumbers[i].line.classList.remove(cls)
                }

                cand?.forEach(x => x.classList.remove('deselected-candidate', 'selected-candidate'))
                revertRadius()
                if (!buttons[2 - active]) {
                    cand = candidate(start, end, { type: active, shift: ev.shiftKey || ev.metaKey })
                    makeRadius()
                } else {
                    cand = []
                }

            }
            const buttons = {}
            function mousedown(ev) {
                buttons[ev.button] = true
                move(ev)
            }
            function prevent(ev) {
                ev.preventDefault()
            }
            function escape(ev) {
                if (ev.key === 'Escape') {
                    buttons[2 - active] = true
                    up({ ...ev, button: active })
                }
            }
            function up(ev) {
                buttons[ev.button] = false
                move(ev)
                if (ev.button !== active) return
                lineNumbers.forEach(line => {
                    line.classList.remove('line-selected', 'line-deselected')
                    line.line.classList.remove('line-selected', 'line-deselected')
                })

                buttons[2 - active] &&
                cand?.forEach(x => x.classList.remove('deselected-candidate', 'selected-candidate'))
                updateSelection(lineNumbers[0].line.parentElement.parentElement)
                cand = void 0
                active = 1

                window.removeEventListener('contextmenu', prevent)
                window.removeEventListener('keydown', prevent)
                window.removeEventListener('keyup', escape)

                window.removeEventListener('scroll', move)
                window.removeEventListener('mousemove', move)
                window.removeEventListener('mousedown', mousedown)
                window.removeEventListener('mouseup', up)
            }
            window.addEventListener('contextmenu', prevent)
            window.addEventListener('keydown', prevent)
            window.addEventListener('keyup', escape)

            window.addEventListener('scroll', move)
            window.addEventListener('mousemove', move)
            window.addEventListener('mousedown', mousedown)
            window.addEventListener('mouseup', up)
            move(e)
        })
    }

    let radiusList = [], markedSet = new Set
    function candidate(firstLine, lastLine, { type, left, right, shift }) {
        const ret = []

        let line = firstLine
        const end = lastLine.nextElementSibling,
              cls = ['selected-candidate', '', 'deselected-candidate'][type]

        function mark(elem) {
            const flag = elem?.classList.contains('selected')
            if (elem && (type === 2 && flag || type === 0 && !flag)) {
                elem.classList.add(cls)
                ret.push(elem)
            }
            elem?.classList.add('marked')
            markedSet.add(elem)
            return elem
        }

        do {
            const elements = line.char ||= [...line.querySelectorAll('.csdn-killer-code-char')]
            let selectStart, selectEnd
            if (left) {
                let flag = true
                for (let elem of elements) {
                    if (flag) {
                        const { x, width: w } = elem.getBoundingClientRect()
                        if (x + w < left) continue
                        if (!shift) {
                            let el = elem, len1 = elem.textContent.trim().length, len2 = len1
                            while (el?.classList.contains('csdn-killer-code-char') && len1 === len2) {
                                el = (selectStart = mark(el)).previousElementSibling
                                len2 = len1; len1 = el?.textContent.trim().length
                            }
                        } else {
                            selectStart = mark(elem)
                        }
                        flag = false
                    }
                    const { x } = elem.getBoundingClientRect()
                    if (x > right) {
                        if (!shift) {
                            let el = elem.previousElementSibling, len1 = el?.textContent.trim().length, len2 = len1
                            while (el?.classList.contains('csdn-killer-code-char') && len1 === len2) {
                                el = (selectEnd = mark(el)).nextElementSibling
                                len2 = len1; len1 = el?.textContent.trim().length
                            }
                        }
                        break
                    }
                    selectEnd = mark(elem)
                }
            } else {
                selectStart = elements[0]
                selectEnd = elements.at(-1)
                for (let elem of elements) {
                    mark(elem)
                }
            }

            if (selectStart && !selectEnd) {
                console.log(selectStart, 123)
            }
            const before = line.char[line.char.findIndex(ch => ch === selectStart) - 1]
            const after = line.char[line.char.findIndex(ch => ch === selectEnd) + 1] || line.lastElementChild
            selectStart && radiusList.push({ line, start: selectStart, end: selectEnd, before, after })
            line = line.nextElementSibling
        } while (line !== end);

        return ret
    }

    function revertRadius() {
        radiusList.forEach(({ before, start, end, after }) => {
                before?.classList.remove('select-end-prevent', 'select-end-candidate',
                                         'select-before-candidate', 'top-candidate', 'bottom-candidate')
                start?.classList.remove('select-start-candidate', 'top-candidate', 'bottom-candidate')
                end?.classList.remove('select-end-candidate', 'top-candidate', 'bottom-candidate')
                after?.classList.remove('select-start-prevent', 'select-start-candidate',
                                        'select-after-candidate', 'top-candidate', 'bottom-candidate')
        })
        radiusList.other?.forEach(char => char.classList.remove(
            'select-end-prevent', 'select-end-candidate', 'select-before-candidate',
            'select-start-prevent', 'select-start-candidate', 'select-after-candidate',
            'select-start-candidate', 'select-end-candidate',
            'top-candidate', 'bottom-candidate', 'top-prevent', 'bottom-prevent',
            'tr-prevent', 'tl-prevent', 'br-prevent', 'bl-prevent'
        ))
        radiusList = []
        markedSet.forEach(marked => marked.classList.remove('marked'))
        markedSet.clear()
    }
    function makeRadius() {
        const cls = radiusList[0]?.start.classList
        const type = cls?.contains('selected-candidate') ||
              cls?.contains('selected') && !cls?.contains('deselected-candidate')
        radiusList.forEach(({ line, before, start, end, after }) => {
            if (!end) {
                console.log(start, line)
                return
            }
            if (type) {
                before?.classList.contains('selected') || before?.classList.contains('selected-candidate')
                    ? before?.classList.add('select-end-prevent')
                    : start.classList.add('select-start-candidate')
                after.classList.contains('selected') || after.classList.contains('selected-candidate')
                    ? after.classList.add('select-start-prevent')
                    : end.classList.add('select-end-candidate')
                return
            }
            before?.classList.contains('selected') && before.classList.add('select-end-candidate')
            after.classList.contains('selected') && after.classList.add('select-start-candidate')
        })

        const getSelectedRange = line => {
            if (!line) return void 0
            const ret = []
            for (const ch of line.char ?? []) {
                 const cls = ch.classList
                if ((cls.contains('select-start') ||
                     cls.contains('select-start-candidate')) &&
                    !cls.contains('select-start-prevent')) {
                    ret.push({ domStart: ch, start: ch.getBoundingClientRect().left })
                }
                if ((cls.contains('select-end') ||
                     cls.contains('select-end-candidate')) &&
                    !cls.contains('select-end-prevent')) {
                    ret.at(-1).end = ch.getBoundingClientRect().right
                    ret.at(-1).domEnd = ch
                }
            }
            return ret
        }
        const makeRadius0 = ( otherLine, { before, start, end, after }, type) => {
            const selectedRange = getSelectedRange(otherLine)
            if (!selectedRange?.length) {
                start.classList.add(type)
                end.classList.add(type)
                return
            }
            const { left } = start.getBoundingClientRect(),
                  { right } = end.getBoundingClientRect()
            let flagBefore = false, flagAfter = false
            for (const range of selectedRange) {
                if (range.start < left && range.end > left) {
                    start.classList.remove(type)
                    !before?.classList.contains('selected') &&
                        before?.classList.add('select-before-candidate', type)
                    flagBefore = true
                }
                if (range.start < right && range.end > right) {
                    end.classList.remove(type)
                    !after.classList.contains('selected') &&
                        after.classList.add('select-after-candidate', type)
                    flagAfter = true
                }
                flagBefore ||= Math.abs(range.start - left) < 3
                flagAfter ||= Math.abs(range.end - right) < 3
            }
            if (!flagBefore) {
                start.classList.add(type)
            }
            if (!flagAfter) {
                end.classList.add(type)
            }
        }
        radiusList.forEach(wrapper => {
            makeRadius0(wrapper.line.previousElementSibling, wrapper, 'top-candidate')
            makeRadius0(wrapper.line.nextElementSibling, wrapper, 'bottom-candidate')
        })
        const makeOuterLineRadius = (line, startLeft, endRight, bt) => {
            if (!line?.selected) return
            const { top, height } = line.getBoundingClientRect()
            const [ domLeft, domRight ] = [
                document.elementFromPoint(startLeft - .1, top + height / 2),
                document.elementFromPoint(endRight + .1, top + height / 2)
            ]
            if (domLeft === domRight) return
            let startInd = 0, endInd = line.char.length
            line.char.forEach((char, ind) => {
                if (char === domLeft) startInd = ind
                if (char === domRight) endInd = ind
            })
            if (startInd > endInd) return
            line.char.slice(startInd, endInd + 2).forEach((char, i) => {
                if (char.classList.contains('select-start')) {
                    const offsetLeft = char.getBoundingClientRect().left - startLeft
                    if (offsetLeft > -1) {
                        if (offsetLeft > 3) {
                            line.char[i + startInd - 1]?.classList.add('select-before-candidate', bt + '-candidate')
                            char.classList.add(bt[0] + 'l-prevent')
                            ;(radiusList.other ||= []).push(line.char[i + startInd - 1])
                        } else {
                            char.classList.add(bt + '-prevent')
                        }
                        ;(radiusList.other ||= []).push(char)
                    }
                }
                if (char.classList.contains('select-end')) {
                    const offsetRight = endRight - char.getBoundingClientRect().right
                    if (offsetRight > -1) {
                        if (offsetRight > 3) {
                            line.all[i + startInd + 1].classList.add('select-after-candidate', bt + '-candidate')
                            char.classList.add(bt[0] + 'r-prevent')
                            ;(radiusList.other ||= []).push(line.all[i + startInd + 1])
                        } else {
                            char.classList.add(bt + '-prevent')
                        }
                        ;(radiusList.other ||= []).push(char)
                    }
                }
            })
        }
        if (radiusList.length) {
            makeOuterLineRadius(radiusList[0].line.previousElementSibling,
                                radiusList[0].start.getBoundingClientRect().left,
                                radiusList[0].end.getBoundingClientRect().right,
                                'bottom')
            makeOuterLineRadius(radiusList.at(-1).line.nextElementSibling,
                                radiusList.at(-1).start.getBoundingClientRect().left,
                                radiusList.at(-1).end.getBoundingClientRect().right,
                                'top')
        }
    }

    function updateSelection(domCodeBlock) {
        radiusList = []
        markedSet.forEach(marked => marked.classList.remove(
            'select-start', 'select-end', 'top', 'bottom',
            'select-before', 'select-after', 'marked'
        ))
        markedSet.clear()
        const startLineInd = Math.max(0, domCodeBlock.updatedLine[0].index - 1),
              endLineInd = Math.min(domCodeBlock.lines.length, domCodeBlock.updatedLine[1].index + 1)
        domCodeBlock.lines.slice(startLineInd, endLineInd + 1).filter(line => line.char).forEach(line => {
            line.selected = false
            line.all ||= [ ...line.char, line.lastElementChild ]
            line.all.forEach(({ classList: cls }, i, arr) => {
                if (cls.contains('deselected-candidate')) {
                    cls.remove('selected', 'deselected-candidate', 'select-start', 'select-end')
                }
                if (cls.contains('selected-candidate')) {
                    cls.remove('selected-candidate', 'select-before', 'select-after')
                    cls.add('selected')
                }
                if (cls.contains('select-before') &&
                    (!arr[i + 1].classList.contains('selected') ||
                     arr[i + 1].classList.contains('deselected-candidate')) ||
                    cls.contains('select-after') &&
                    (!arr[i - 1].classList.contains('selected') ||
                     arr[i - 1].classList.contains('deselected-candidate'))) {
                    cls.remove('select-before', 'select-after', 'top', 'bottom')
                }
                if (cls.contains('select-before-candidate')) {
                    cls.remove('select-before-candidate')
                    cls.add('select-before')
                }
                if (cls.contains('select-after-candidate')) {
                    cls.remove('select-after-candidate')
                    cls.add('select-after')
                }
                if (cls.contains('select-start-candidate')) {
                    cls.remove('select-start-candidate')
                    if (!arr[i - 1]?.classList.contains('selected') ||
                        arr[i - 1]?.classList.contains('deselected-candidate')) cls.add('select-start')
                }
                if (cls.contains('select-end-candidate')) {
                    cls.remove('select-end-candidate')
                    if (!arr[i + 1]?.classList.contains('selected') ||
                        arr[i - 1]?.classList.contains('deselected-candidate')) cls.add('select-end')
                }
                if (cls.contains('top-candidate')) {
                    cls.remove('top-candidate')
                    cls.add('top')
                }
                if (cls.contains('bottom-candidate')) {
                    cls.remove('bottom-candidate')
                    cls.add('bottom')
                }
                if (cls.contains('top-prevent')) {
                    cls.remove('top-prevent', 'top', 'tl', 'tr')
                } else {
                    if (cls.contains('tl-prevent')) {
                        cls.remove('top', 'tl')
                        !cls.contains('tr-prevent') && cls.add('tr')
                    }
                    if (cls.contains('tr-prevent')) {
                        cls.remove('top', 'tr')
                        !cls.contains('tl-prevent') && cls.add('tl')
                    }
                }
                if (cls.contains('bottom-prevent')) {
                    cls.remove('bottom-prevent', 'bottom', 'bl', 'br')
                } else {
                    if (cls.contains('bl-prevent')) {
                        cls.remove('bottom', 'bl')
                        !cls.contains('br-prevent') && cls.add('br')
                    }
                    if (cls.contains('br-prevent')) {
                        cls.remove('bottom', 'br')
                        !cls.contains('bl-prevent') && cls.add('bl')
                    }
                }
                cls.remove('tl-prevent', 'tr-prevent', 'bl-prevent', 'br-prevent')
                if (cls.contains('select-end-prevent')) {
                    cls.remove('select-end-prevent', 'select-end')
                }
                if (cls.contains('select-start-prevent')) {
                    cls.remove('select-start-prevent', 'select-start')
                }
                line.selected ||= cls.contains('selected')
            })
            line.lineNumber.classList[line.selected ? 'add' : 'remove']('selected')
        })
        domCodeBlock.parentElement.classList[
            domCodeBlock.lines.some(line => line.selected) ? 'add' : 'remove'
        ]('fade')
    }

    const ipt = document.createElement('textarea')
    document.body.append(ipt)
    ipt.style = 'position:fixed;left:-999px;top:-999px;width:0;height:0'
    function cp(data, e) {
        const len = document.createElement('div')
        len.innerText = (ipt.value = data).length
        len.classList.add('len')
        setTimeout(() => {
            len.style.left = e.clientX - len.clientWidth / 2 + 'px'
            len.style.top = e.clientY - len.clientHeight - 5 + 'px'
        }, 0)
        document.body.appendChild(len)
        setTimeout(() => len.remove(), 2000)
        ipt.setSelectionRange(0, ipt.value.length)
        ipt.select()
        document.execCommand('copy')
    }
    document.querySelectorAll('code').forEach(domCodeBlock => {
        domCodeBlock.addEventListener('dblclick', e => {
            if (domCodeBlock.querySelector('.selected')) {
                const text = domCodeBlock.lines.filter(line => line.char)
                    .map(line => line.char.filter(char => char.classList.contains('selected')))
                    .filter(selectedChars => selectedChars.length)
                    .map(selectedChars => selectedChars.map(char => char.textContent).join(''))
                    .join('\n').replaceAll(' ', ' ')
                clearTimeout(domCodeBlock.copyTimeout)
                domCodeBlock.classList.remove('coping')
                setTimeout(() => {
                    domCodeBlock.classList.add('coping')
                    domCodeBlock.copyTimeout = setTimeout(() => domCodeBlock.classList.remove('coping'), 300)
                    cp(text, e)
                }, 0)
            } else {
                clearTimeout(domCodeBlock.parentElement.copyTimeout)
                domCodeBlock.parentElement.classList.remove('coping')
                setTimeout(() => {
                    domCodeBlock.parentElement.classList.add('coping')
                    domCodeBlock.parentElement.copyTimeout =
                        setTimeout(() => domCodeBlock.parentElement.classList.remove('coping'), 300)
                    cp(domCodeBlock.lines.map(line => line.textContent).join('\n').replaceAll(' ', ' '), e)
                }, 0)
            }

        })
    })
    document.querySelectorAll('pre.prettyprint').forEach(pre => {
        const bt = pre.querySelector('.hide-preCode-bt')
        function fn(e) {
            parseNode(pre.firstChild)
            if (5 > parseLines(pre.firstChild)) {
                pre.querySelectorAll('ul').forEach(ul => (ul.style.paddingBottom = '8px'))
            }
            makeSelectable(pre.firstChild)
            rowsSelection(pre.querySelector('ul.pre-numbering'))
            bt?.click()
            e && pre.removeEventListener('mousedown', fn)
        }
        if (bt) {
            bt.style.display = 'none'
            pre.addEventListener('mousedown', fn)
        } else {
            fn()
        }
    })
    setTimeout(() => console.clear(func()), 1000)
})();