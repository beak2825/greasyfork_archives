// ==UserScript==
// @name         notion macros
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  macros for notion
// @author       TechnoStrife
// @match        https://www.notion.so/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439633/notion%20macros.user.js
// @updateURL https://update.greasyfork.org/scripts/439633/notion%20macros.meta.js
// ==/UserScript==

'use strict';

// https://katex.org/docs/supported.html


const katex = get_katex_db()

let macros = [
    {
        // a_bc → abc
        auto: true,
        continue: true,
        //re: /([A-Za-z])_([nmijkxyz][A-Za-hlo-w])/,
        re: /([A-Za-z])_([nmijkxyzuv][A-Za-z])/,
        replace: match => `${match[1]}${match[2]}`
    },
    {
        // a_12 → a_{12}
        auto: true,
        re: /(\p{L}['"]{0,2})_([nmijkxyzuv\d]{2})/u,
        replace: match => {
            return `${match[1]}_{${match[2]}#0}#1`
        }
    },
    {
        // a^12 → a^{12}
        auto: true,
        re: /([\p{L}]['"]{0,2})\^(\d{2}|-\d)/u,
        replace: match => {
            return `${match[1]}^{${match[2]}#0}#1`
        }
    },
    {
        // alpha → α
        auto: true,
        re: (() => {
            let greek = katex.greek_codes.join('|')
            return new RegExp(`(?<![A-Za-z])(${greek})`)
        })(),
        replace: match => {
            return katex.greek_dict[match[1]]
        }
    },
    {
        auto: true,
        re: /(?<=\\vec{)nabla/,
        replace: '∇'
    },
    {
        auto: true,
        re: /nabla/,
        replace: '\\vec ∇'
    },
    {
        auto: true,
        re: /vdelta/,
        replace: '{\\scriptsizeΔ}'
    },
    {
        auto: true,
        re: /tdelta/,
        replace: '{\\tinyΔ}'
    },
    {
        auto: true,
        re: /p i/,
        replace: 'p_i'
    },
    {
        // a1 → a_1
        auto: true,
        // (?<!_{)
        re: /(?<![A-Za-ce-zα-ξπ-ωϕϵΓΔΘΛΞΠΣΦΨΩ\\])([A-Za-ce-hk-zα-ξπ-ωϕϵΓΔΘΛΞΠΣΦΨΩ]['"]{0,2})([nmijkuv\d]|(?<![xy]['"]{0,2})[xyz])/,
        replace: match => {
            return `${match[1]}_${match[2]}#0`
        }
    },
    {
        auto: true,
        re: /~~/,
        replace: '\\overset{🌊} ' // '\\tilde '
    },
    {
        auto: true,
        re: /\s?star/,
        replace: '^⭐'
    },
    {
        auto: true,
        re: /\|(\->|→)/,
        replace: '↦'
    },
    {
        auto: true,
        re: /(<=|≤|⩽|\\leq)>/,
        replace: '⟺'
    },
    {
        auto: true,
        re: /!⟺/,
        replace: '⟺\mathllap{/\ \ \ \ }'
    },
    {
        auto: true,
        re: /<->/,
        replace: '↔'
    },
    {
        auto: true,
        re: /-->/,
        replace: '⟶'
    },
    {
        auto: true,
        continue: true,
        re: /->/,
        replace: '→'
    },
    {
        auto: true,
        re: /→→/,
        replace: '⇉'
    },
    {
        auto: true,
        re: /=>/,
        replace: '⟹'
    },
    {
        auto: true,
        re: /=</,
        replace: '⟸'
    },
    {
        auto: true,
        re: /!=/,
        replace: '≠'
    },
    {
        auto: true,
        re: /<\|/,
        replace: '\\triangleleft'
    },
    {
        auto: true,
        re: /<=/,
        replace: '⩽'
    },
    {
        auto: true,
        re: />=/,
        replace: '⩾'
    },
    {
        auto: true,
        re: /~=/,
        replace: '≈'
    },
    {
        auto: true,
        re: /===/,
        replace: '≡'
    },
    {
        auto: true,
        re: /^\|-/,
        replace: '⊢'
    },
    {
        auto: true,
        re: /≈=/,
        replace: '≅'
    },
    {
        auto: true,
        re: /:=/,
        replace: '≔'
    },
    {
        auto: true,
        re: /(\.\.|•)/, // Alt+7 = •
        replace: '⋅' // middle multiplication dot
    },
    {
        auto: true,
        re: /\xx/,
        replace: '×' // multiplication cross
    },
    {
        auto: true,
        re: /((?<= )land|\/\\)/,
        replace: '∧'
    },
    {
        auto: true,
        re: /((?<= )lor|\\\/)/,
        replace: '∨'
    },
    /*{
        auto: true,
        re: /\/\//,
        replace: '∥'
    },*/
    {
        auto: true,
        re: /!!/,
        replace: '¬'
    },
    {
        auto: true,
        re: /☺/, // Alt + 1
        replace: '∞'
    },
    {
        re: /88/,
        replace: '∞'
    },
    {
        auto: true,
        re: /(?<!\w)oo/,
        replace: '\\bar{o}(#[0:1])#1'
    },
    {
        auto: true,
        re: /(?<!\w)OO/,
        replace: '\\underline{O}(#[0:1])#1'
    },
    {
        auto: true,
        re: /^AA/,
        replace: '∀'
    },
    {
        auto: true,
        re: /^EE/,
        replace: '∃'
    },
    {
        auto: true,
        re: /AA/,
        replace: '\\ ∀'
    },
    {
        auto: true,
        re: /EE/,
        replace: '\\ ∃'
    },
    {
        auto: true,
        re: /section/,
        replace: '§' // Alt + 21
    },
    {
        auto: true,
        re: /(\.\.\.|⋅\.)/,
        replace: '…'
    },
    {
        auto: true,
        re: /(\d),(\d)/,
        replace: match => `${match[1]}{,}${match[2]}`
    },
    {
        // _ → _{}
        auto: true,
        re: /__/,
        replace: '_{#0}#1',
    },
    {
        // , → ,\_
        auto: true,
        re: /(?<!\\),/,
        replace: ',\\ ',
    },
    {
        re: /(Im|I_m)/,
        replace: '\\operatorname{Im}',
    },
    {
        // _ → _{}
        re: /_/,
        replace: '_{#0}#1',
    },
    {
        // _1 → _{1}
        re: /_([nmijkxyz\d])/,
        replace: match => `_{${match[1]}#0}#1`,
    },
    {
        auto: true,
        re: /\^\^/,
        replace: '^{#0}#1',
    },
    {
        auto: true,
        re: /\s?inv/,
        replace: '^{-1}#0',
    },
    {
        re: /\^/,
        replace: '^{#0}#1',
    },
    {
        re: /deriv/,
        replace: '^{(n#0)}#1',
    },
    {
        // (x)/ → \frac{x}{}
        cond: /\)\//,
        re: text => {
            let depth = 0
            let i = text.length - 2
            while (i >= 0) {
                if (text[i] == ')')
                    depth += 1
                if (text[i] == '(')
                    depth -= 1
                if (depth == 0)
                    break
                i -= 1
            }
            if (depth > 0)
                return null
            return {
                0: text.slice(i, ),
                1: text.slice(i+1, -2),
                index: i
            }
        },
        replace: match => `\\frac{${match[1]}}{#0}#1`
    },
    {
        re: /((\d+)|(\d*)(\\)?([A-Za-zα-ξπ-ωϕϵΓΔΘΛΞΠΣΦΨΩ]+)((\^|_)(\{\d+\}|[\dxyzijknm]))*)\//,
        replace: match => `\\frac{${match[1]}}{#0}#1`
    },
    {
        re: /\//,
        replace: '\\frac{#0}{#1}#2',
    },
    {
        auto: true,
        re: /\/\//,
        replace: '\\frac{#[0:1]}{#1}#2',
    },
    {
        re: /d((\.|\\dots)+)/,
        replace: match => `\\overset{${match[1].replace('\\dots', '...')}}{#0}#1`,
    },
    {
        re: /vec/,
        replace: '\\vec{#0}#1',
    },
    {
        re: /vecc/,
        replace: '\\overrightarrow{#0}#1',
    },
    {
        re: /vec([A-Za-z]{1,2})/,
        replace: match => match[1].length === 1
            ? `\\vec{${match[1]}}#0`
            : `\\overrightarrow{${match[1]}}#0`,
    },
    {
        re: /vec0/,
        replace: '\\vec{0}',
    },
    {
        re: /vec1/,
        replace: '\\vec{1}',
    },
    {
        auto: true,
        re: /\s*vcol/,
        replace: '_↓',
    },
    {
        re: /dot/,
        replace: '(\\vec{#0} ⋅ \\vec{#1})#2',
    },
    {
        re: /cross/,
        replace: '[\\vec{#0} × \\vec{#1}]#2',
    },
    {
        re: /mixed/,
        replace: '{<}\\vec{#0}, \\vec{#1}, \\vec{#2}{>}#3',
    },
    {
        re: /vecang/,
        replace: '\\widehat{\\vec{#0} \\vec{#1}}#2',
    },
    {
        re: /vecmod/,
        replace: '|\\vec{#0}|#1',
    },
    {
        re: /nparr/,
        replace: '\\vec{#0}\\ \\cancel{∥}\\ \\vec{#1}#2',
    },
    {
        re: /parr/,
        replace: '\\vec{#0} ∥ \\vec{#1}#2',
    },
    {
        re: /bar/,
        replace: '\\bar{#0}#1',
    },
    {
        re: /barr/,
        replace: '\\overline #0',
    },
    {
        auto: true,
        re: /choose/,
        replace: '{#[0:m] \\choose #[1:n]}#2',
    },
    {
        re: /C/,
        replace: 'C_{#[0:n]}^{#[1:m]}#2',
    },
    {
        re: /A/,
        replace: 'A_{#[0:n]}^{#[1:m]}',
    },
    {
        re: /P/,
        replace: 'P(#[0:A]) = \\frac{|#[0:A]|}{|Ω|} = #1',
    },
    {
        re: /(lr|big|Big|bigg|Bigg)([\|\[\(\{])/,
        replace: match => {
            let kw = match[1] == 'lr' ? ['left','right'] : [match[1], match[1]]
            let close = {'|':'|', '[':']', '(':')', '{':'\\}'}[match[2]]
            if (match[2] == '{') match[2] = '\\{'
            return `\\${kw[0]}${match[2]} #0 \\${kw[1]}${close}`
        }
    },
    {
        re: /ceil/,
        replace: '\\left⌈ #0 \\right⌉ ',
    },
    {
        re: /floor/,
        replace: '\\left⌊ #0 \\right⌋ ',
    },
    {
        re: /def/,
        replace: '\\overset{def}#0 ',
    },
    {
        re: /intinf/,
        replace: '∫_{#[0:-∞]}^{#[1:+∞]} #[3:f(x)] d#[2:x]'
    },
    {
        re: /iiint/,
        replace: '\\iiint_{#[0:P]} #[2:f(x,y,z)] dxdydz#3'
    },
    {
        re: /oint/,
        replace: '∮_{#[0:Γ]} #[3:f(x)] d#[2:x]'
    },
    {
        re: /iint/,
        replace: '\\iint_{#[0:P]} #[2:f(x,y)] dxdy#3'
    },
    {
        re: /int/,
        replace: '∫_{#[0:a]}^{#[1:b]} #[3:f(x)] d#[2:x]'
    },
    {
        re: /intt/,
        replace: '∫_{#[0:a]}^{#[1:b]} #[3:f(t)] d#[2:t]#4'
    },
    {
        auto: true,
        re: /partt/, // partial
        replace: '\\frac{∂ #[0:f]}{∂ #[1:x]} #2'
    },
    {
        auto: true,
        re: /part2/,
        replace: '\\frac{∂^2 #[0:f]}{∂ #[1:x] ∂ #[2:y]} #2'
    },
    {
        re: /sum/,
        replace: '∑_{#[0:i=1]}^{#[1:n]}#2'
    },
    {
        re: /sum0/,
        replace: '∑_{#[0:i]=0}^{#[1:n]-1}#2'
    },
    {
        re: /sum2/,
        replace: '∑_{#[0:i=1]}^{#[1:n]} ∑_{#[2:j=1]}^{#[3:m]}#4'
    },
    {
        re: /suminf/,
        replace: '∑_{#[0:n=1]}^{∞}#2'
    },
    {
        re: /sumdu/,
        replace: '\\overline{S}_{Δ#0} (#[1:f])#2',
    },
    {
        re: /sumdl/,
        replace: '\\underline{S}_{Δ#0} (#[1:f])#2',
    },
    {
        re: /lim/,
        replace: '\\lim_{#[0:x]→#[1:∞]} #2'
    },
    {
        re: /set/,
        replace: '\\{#0\\}#1'
    },
    {
        re: /ang/,
        replace: '{<}#0{>}#1'
    },
    {
        re: /op/,
        replace: '\\operatorname{#0}#1',
    },
    {
        re: /(Re|ord|lcm|rot|grad|div)/,
        replace: match => `\\operatorname{${match[0]}} `,
    },
    {
        re: /res/,
        replace: match => `\\underset{#[0:z]}{\\operatorname{res}} #1`,
    },
    {
        re: /begin/,
        replace: '\\begin{#0}\n    #1\n\\end{#0}',
    },
    {
        auto: true,
        re: /(.*)disp/,
        replace: match => `\\displaystyle ${match[1]}`,
    },
    {
        re: /bullet/,
        replace: "\\displaystyle\\ \\,\\raisebox{0.1em}{$\\footnotesize\\bullet$}\\ \\,\\,",
    },
    {
        re: /align/,
        replace: "\\begin{align*}\n"
            + "    #0 =\\ &  =\\\\\n"
            + "    =\\ &  =\\\\\n".repeat(4)
            + "    \\scriptsize (u=)\\normalsize =\\ &  =\\\\\n"
            + "\\end{align*}",
    },
    {
        re: /vmatrix/,
        replace: "\\begin{vmatrix}\n    #0\n\\end{vmatrix}",
    },
    {
        re: /pmatrix/,
        replace: "\\begin{pmatrix}\n    #0\n\\end{pmatrix}",
    },
    {
        re: /([vp])matrix([1-9])([1-9])/,
        replace: match => {
            let res = `\\begin{${match[1]}matrix}\n`
            let x = parseInt(match[2], 10)
            let y = parseInt(match[3], 10)
            let line = "    " + " & ".repeat(x - 1) + "\\\\\n"
            res += line.repeat(y)
            res += `\\end{${match[1]}matrix}`
            return res
        },
    },
    {
        re: /array([a-zA-Z])/,
        replace: match => '\\{a_1, a_2, \\dots, a_n\\}'.replaceAll('a', match[1])
    },
    {
        re: /grey/,
        replace: '\\color{\\#9FA4A9} #0 \\color{default}'
    }
]

// TODO add macro indicator

let stack = new class {
    constructor() {
        this.stack = []
    }
    check_finished() {
        while (this.stack.length > 0 && this.stack[0].finished())
            this.stack.shift()
    }
    is_active() {
        this.check_finished()
        return this.stack.length > 0
    }
    check_caret() {
        while (this.stack.length > 0) {
            if (this.stack[0].finished()) {
                this.stack.shift()
            } else if (!this.stack[0].check_caret_in_boundaries()) {
                this.stack.shift()
            } else {
                break
            }
        }
        return this.stack.length > 0
    }
    add(macro) {
        this.stack.unshift(macro)
    }
    pop() {
        this.stack.shift()
    }
    update(event) {
        for (let macro of this.stack)
            macro.update(event)
        this.check_finished()
    }
    run_update() {
        for (let macro of this.stack)
            macro.run_update(event)
        this.check_finished()
    }
    next_substitution() {
        if (this.is_active()) {
            this.stack[0].next_substitution()
        }
    }
}()

const arrows = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End']
let tab_pressed = false;

window.addEventListener('blur', () => {tab_pressed = false});

document.addEventListener('keyup', function(event) {
    if (!is_math_input())
        return

    if (event.key === "Tab") {
        if (tab_pressed)
            tab(event);
    } else if (event.key === "Escape") {
        if (stack.is_active()) {
            stack.pop()
            event.preventDefault()
            event.stopPropagation()
        }
    }
})

document.addEventListener('keydown', function(event) {
    if (!is_math_input())
        return

    if (event.key === "Tab") {
        event.preventDefault();
        tab_pressed = true;
    } else if (event.key === "Escape") {
        if (stack.is_active()) {
            event.preventDefault()
            event.stopPropagation()
        }
    } else if (arrows.includes(event.key)) {
        // do nothing
    } else if (stack.check_caret()) {
        stack.update(event)
    }
})

document.addEventListener('keypress', function(event) {
    if (!is_math_input())
        return

    setTimeout(() => {
        //while (run_macros(true)) {}
        run_macros(true)
    }, 0)
})

function is_math_input() {
    return document?.activeElement?.nextSibling?.attributes?.role?.value == "button"
}


function tab(event) {
    if (event.shiftKey) {
        let matched = run_macros()
        if (matched)
            return
    }

    if (stack.check_caret())
        stack.next_substitution()
}

function run_macros(auto=false) {
    let stripped = accumulate_text()
    let res = false

    for (let macro of macros) {
        if (macro.auto != auto)
            continue
        if (!macro.matches(stripped))
            continue

        res = true
        let continue_run = macro.continue

        let match = macro.re.exec(stripped)
        let replace = macro.make(match)
        macro = run_replace(match, replace)
        stack.run_update()
        stack.add(macro)
        stack.next_substitution()
        stack.check_finished()

        dispatch_input_event()
        if (!continue_run)
            return true
        else
            stripped = accumulate_text()
    }
    return res
}

function run_replace(match, replace) {
    replace_text_at(match.index, match.index + match[0].length, replace.text)

    return new RunningMacro(replace.substitutions, match.index)
}

function accumulate_text() {
    let sel = window.getSelection()
    let range = sel.getRangeAt(0)
    let acc = range.endContainer.textContent.slice(0, range.endOffset)
    let node = range.endContainer
    /*if (node.nodeType === Node.TEXT_NODE) {
        if (node.parentElement.contentEditable !== "true") {
            node = node.parentElement
        }
    }
    let prev = node.previousSibling
    while (prev !== null) {
        acc = prev.textContent + acc
        prev = prev.previousSibling
    }*/
    while (true) {
        while (node.previousSibling !== null) {
            node = node.previousSibling
            acc = node.textContent + acc
        }
        if (node.parentElement.contentEditable === "true") {
            break
        } else {
            node = node.parentElement
        }
    }
    return acc
}


function locate_index(index, text_node=false) {
    let nodes = [...document.activeElement.childNodes]
    while (nodes.length > 0) {
        let node = nodes.shift()
        let len = node.textContent.length
        if (len >= index) {
            if (text_node && node.nodeType !== Node.TEXT_NODE) {
                nodes = [...node.childNodes]
                continue
            }
            return [node, index]
        }
        index -= len
    }
    throw null
}

function get_caret_position() {
    let sel = window.getSelection()
    let range = sel.getRangeAt(0)
    let index = range.endOffset
    let node = range.endContainer
    /*if (node.nodeType === Node.TEXT_NODE) {
        if (node.parentElement.contentEditable !== "true") {
            node = node.parentElement
        }
    }
    let prev = node.previousSibling
    while (prev !== null) {
        index += prev.textContent.length
        prev = prev.previousSibling
    }*/
    while (true) {
        while (node.previousSibling !== null) {
            node = node.previousSibling
            index += node.textContent.length
        }
        if (node.parentElement.contentEditable === "true") {
            break
        } else {
            node = node.parentElement
        }
    }
    return index
}

function set_caret_position(position) {
    let range = document.createRange()

    let [node, index] = locate_index(position[0], true)
    range.setStart(node, index)

    if (position[1] != position[0])
        [node, index] = locate_index(position[1], true)
    range.setEnd(node, index)

    let selection = window.getSelection()
    selection.removeAllRanges()
    selection.addRange(range)
}

function get_text() {
    return document.activeElement.textContent
}

function get_text_range(start, end) {
    let res = ""
    for (let node of document.activeElement.childNodes) {
        let len = node.textContent.length
        if (start >= 0) {
            if (len >= start) {
                if (end <= len) {
                    res += node.textContent.slice(start, end)
                    return res
                } else {
                    res += node.textContent.slice(start, )
                }
            }
        } else {
            if (end <= len) {
                res += node.textContent.slice(0, end)
                return res
            } else {
                res += node.textContent
            }
        }
        start -= len
        end -= len
    }
    throw null
}

function remove_text_range(start, end) {
    if (start === end)
        return

    for (let node of [...document.activeElement.childNodes]) {
        let len = node.textContent.length
        if (start >= 0) {
            if (len >= start) {
                if (end < len) {
                    node.textContent = node.textContent.slice(0, start) + node.textContent.slice(end, )
                    return
                } else if (start == 0) {
                    node.remove()
                } else {
                    node.textContent = node.textContent.slice(0, start)
                }
            }
        } else {
            if (end > len) {
                node.remove()
            } else {
                node.textContent = node.textContent.slice(end, )
                return
            }
        }
        start -= len
        end -= len
    }
}

function add_text_at(index, text) {
    if (text === '')
        return

    let [node, offset] = locate_index(index, true)
    let res = node.textContent.slice(0, offset)
    res += text
    res += node.textContent.slice(offset, )
    node.textContent = res
}

function replace_text_at(start, end, new_text) {
    remove_text_range(start, end)
    add_text_at(start, new_text)
}

function dispatch_input_event() {
    let event = new Event('input', {
        'bubbles': true,
        'cancelable': true
    })
    document.activeElement.dispatchEvent(event)
}

function* textNodesUnder(el){
    var n, a = [], walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false)
    while (n = walk.nextNode()) {
        yield n
    }
}

function regexp_add_end(re) {
    if (!(re instanceof RegExp)) {
        return re
    }
    let pattern = re.source
    if (pattern[pattern.length-1] != '$') {
        pattern = `(?:${pattern})$`
    }
    return new RegExp(pattern, re.flags)
}

class Macro {
    constructor(opts) {
        this.auto = !!opts.auto
        this.continue = !!opts.continue
        if (opts.cond) {
            if (typeof opts.cond === 'array') {
                this.conditions = opts.cond.map(regexp_add_end)
            } else {
                this.conditions = [regexp_add_end(opts.cond)]
            }
        } else {
            this.conditions = []
        }
        this.re = new FuncRegExp(regexp_add_end(opts.re))
        this.replace = new Replace(opts.replace)
    }

    matches(text) {
        for (let re of this.conditions) {
            if (!re.test(text)) {
                return false
            }
        }
        return this.re.test(text)
    }

    make(match) {
        return this.replace.make(match)
    }
}

class FuncRegExp {
    constructor(re) {
        this.re = re
    }

    exec(str) {
        if (typeof this.re === 'function') {
            return this.re(str)
        } else {
            return this.re.exec(str)
        }
    }

    test(str) {
        return !!this.exec(str)
    }
}

class Replace {
    constructor(replace) {
        if (typeof replace === 'function') {
            this.func = replace
        } else if (typeof replace === 'string') {
            this.compiled = new StringReplace(replace)
        } else {
            throw null
        }
    }

    make(match) {
        if (this.compiled) {
            return this.compiled
        } else {
            return new StringReplace(this.func(match))
        }
    }
}

class StringReplace {
    constructor(replace) {
        this.text = ""
        this.substitutions = []

        replace = replace.replace(/\\#/g, '\x01')

        let substitutions = {}
        let re = /#(\d+)|#\[(\d+):([^\]]*)\]/g
        let last_index = 0
        let match
        while (match = re.exec(replace)) {
            this.text += replace.slice(last_index, match.index)
            last_index = re.lastIndex

            let num
            let provided = ''
            if (match[1] === undefined) {
                num = match[2]
                provided = match[3]
            } else {
                num = match[1]
            }
            let caret = [this.text.length, this.text.length + provided.length]
            this.text += provided
            if (num in substitutions) {
                substitutions[num].push(caret)
            } else {
                substitutions[num] = [caret]
            }
        }
        this.text += replace.slice(last_index, )
        this.text = this.text.replace(/\x01/g, '#')

        Object.keys(substitutions).sort().forEach(key => {
            this.substitutions.push(substitutions[key])
        })

        if (this.substitutions.length === 0) {
            this.substitutions = [[[this.text.length, this.text.length]]]
        }
    }
}

class RunningMacro {
    constructor(substitutions, start) {
        this.substitutions = substitutions.map(
            positions => positions.map(x => [x[0] + start, x[1] + start])
        )
        this.carets = null
        this.prev_text = get_text()
    }

    finished() {
        return this.substitutions.length === 0 && this.carets === null
    }

    break() {
        this.substitutions = []
        this.carets = null
    }

    check_caret_in_boundaries() {
        let caret = get_caret_position()
        return this.carets[0][0] <= caret && caret <= this.carets[0][1]
    }

    next_substitution() {
        if (this.substitutions.length === 0) {
            this.carets = null
            return
        }

        this.carets = this.substitutions.shift()
        set_caret_position(this.carets[0])
        if (this.substitutions.length === 0 && this.carets.length <= 1) {
            this.carets = null
        }
    }

    update(event) {
        if (this.carets === null) {
            return
        }
        setTimeout(() => {this.run_update()}, 0)
    }
    run_update() {
        if (this.carets === null) {
            return
        }
        let new_caret_content = compare_carets(this.prev_text, get_text(), this.carets[0])
        if (new_caret_content === null) {
            this.break()
            return
        }
        let added = new_caret_content.length - (this.carets[0][1] - this.carets[0][0])
        this.move_carets(this.carets[0][1], added)

        for (let [i, caret] of this.carets.entries()) {
            if (i == 0)
                continue

            replace_text_at(caret[0], caret[1], new_caret_content)
            this.move_carets(caret[1], added)
        }
        dispatch_input_event()
        this.prev_text = get_text()
    }

    move_carets(start, len) {
        for (let carets of [this.carets, ...this.substitutions]) {
            for (let [i, caret] of carets.entries()) {
                if (caret[0] > start) {
                    caret[0] += len
                } else if (len < 0 && caret[0] >= start - len) {
                    caret[0] = start - len
                }
                if (caret[1] >= start) {
                    caret[1] += len
                } else if (len < 0 && caret[1] >= start - len) {
                    caret[1] = start - len
                }
            }
        }
    }
}

function compare_carets(prev, cur, boundaries) {
    if (prev.slice(0, boundaries[0]) != cur.slice(0, boundaries[0]))
        return null

    let from_end = prev.length - boundaries[1]
    if (prev.slice(-from_end, ) != cur.slice(-from_end, ))
        return null

    let range = cur.slice(boundaries[0], -from_end)
    return range
}

function get_katex_db() { // so that macro definitions are on the top
    let db = {
        greek_dict: {'Alpha': 'A', 'Beta': 'B', 'Gamma': 'Γ', 'Delta': 'Δ', 'Epsilon': 'E',
                     'Zeta': 'Z', 'Eta': 'H', 'Theta': 'Θ', 'Iota': 'I', 'Kappa': 'K',
                     'Lambda': 'Λ', 'Mu': 'M', 'Nu': 'N', 'Ksi': 'Ξ', 'Omicron': 'O',
                     'Pi': 'Π', 'Rho': 'P', 'Sigma': 'Σ', 'Tau': 'T', 'Upsilon': 'Υ',
                     'Phi': 'Φ', 'Chi': 'X', 'Psi': 'Ψ', 'Omega': 'Ω', 'varGamma': 'Γ',
                     'varDelta': 'Δ', 'varTheta': 'Θ', 'varLambda': 'Λ', 'varXi': 'Ξ',
                     'varPi': 'Π', 'varSigma': 'Σ', 'varUpsilon': 'Υ', 'varPhi': 'Φ',
                     'varPsi': 'Ψ', 'varOmega': 'Ω',
                     'alpha': 'α', 'beta': 'β', 'gamma': 'γ', 'delta': 'δ', 'eps': 'ε',
                     'zeta': 'ζ', 'eta': 'η', 'theta': 'θ', 'iota': 'ι', 'kappa': 'κ',
                     'lambda': 'λ', 'mu': 'μ', 'nu': 'ν', 'ksi': 'ξ', 'omicron': 'ο',
                     'pi': 'π', 'rho': 'ρ', 'sigma': 'σ', 'tau': 'τ', 'upsilon': 'υ',
                     'phi': 'φ', 'chi': 'χ', 'psi': 'ψ', 'omega': 'ω', 'varepsilon': 'ϵ',
                     'varkappa': 'ϰ', 'vartheta': 'ϑ', 'thetasym': 'ϑ', 'varpi': 'ϖ',
                     'varrho': 'ϱ', 'varsigma': 'ς', 'varphi': 'ϕ', 'digamma': 'ϝ'},
        letters_group: 'a-zA-Zα-ξπ-ωϕϵΓΔΘΛΞΠΣΦΨΩ',
        letters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZαβγδϵζηθικλμνξπρστυϕχψωφεΓΔΘΛΞΠΣΦΨΩ',
    }
    db.greek_codes = Object.keys(db.greek_dict)
    db.greek_letters = Object.values(db.greek_dict)
    return db
}

macros = macros.map(macro => new Macro(macro))

console.log(`${macros.length} macros enabled (auto ${macros.reduce((a, b) => a + b.auto, 0)})`)







