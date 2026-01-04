// ==UserScript==
// @name           AtCoder Formatter
// @name:en        AtCoder Formatter
// @namespace
// @version        1.5.0
// @description    AtCoder の解説コードなどをフォーマットできるようにします．
// @description:en Add formatting buttons to source codes on AtCoder.
// @author         kichi2004
// @match          https://atcoder.jp/contests/*
// @grant          none
// @namespace      kichi2004.jp
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/454753/AtCoder%20Formatter.user.js
// @updateURL https://update.greasyfork.org/scripts/454753/AtCoder%20Formatter.meta.js
// ==/UserScript==

'use strict';

async function request(code, lang) {
    const res = await fetch(`https://formatter.api.kichi2004.jp/format?lang=${lang}`, {
        body: code,
        method: 'POST'
    })
    if (!res.ok) {
        alert('Formatting Request Failed!')
        return
    }
    const json = await res.json()
    if (json['status'] === 'error') {
        alert('Formatting Error!\n' + json['error'])
        return
    }
    return json['result']
}

function createButtons(className, id) {
    return `
<div class="btn-group" role="group">
    <button type="button" class="btn ${className} btn-sm" title="C/C++ のソースコードをフォーマット" id="${id}-fmt-cpp">
        C/C++
    </button>
    <button type="button" class="btn ${className} btn-sm" title="Python のソースコードをフォーマット" id="${id}-fmt-py">
        Python
    </button>
    <button type="button" class="btn ${className} btn-sm" title="C# のソースコードをフォーマット" id="${id}-fmt-cs">
        C#
    </button>
</div>`;
}
const SOURCE_ID = 'source'

;(async function () {
    const showModal = (id, formatInner) => {
        if (!document.getElementById(`modal-${id}-format-warning`)) {
            document.body.insertAdjacentHTML('afterbegin', `
<div id="modal-${id}-format-warning" class="modal fade" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">フォーマットの注意</h4>
            </div>
            <div class="modal-body">
                <p>このコンテストはまだ終了していません。</p>
                <p>フォーマットを行うとソースコードが外部に送信され、スクリプトの作成者が閲覧可能な状態になります。</p>
                <p>まだ公開されていないコンテストではフォーマットを行わないでください。</p>
            </div>
            <div class="modal-footer">
                <button class="btn btn-warning" id="${id}-force-format">フォーマットする</button>
                <button class="btn btn-success" id="${id}-cancel">キャンセル</button>
            </div>
        </div>
    </div>
</div>
        `)

            document.getElementById(`${id}-force-format`).addEventListener('click', async () => await formatInner(true))
            document.getElementById(`${id}-cancel`).addEventListener('click', () => removeModal(id))
        }

        $(`#modal-${id}-format-warning`).modal('show')
    }
    const removeModal = (id) => {
        const modal = $(`#modal-${id}-format-warning`)
        modal.modal('hide')
    }
    const formatCode = async (event, pre, id, lang) => {
        const formatInner = async (modal = false) => {
            if (modal) removeModal(id)

            event.target.disabled = true
            const data = document.getElementById(id)
            const result = await request(data.innerText, lang, event)
            event.target.disabled = false
            if (!result) return

            if (pre.classList.contains('ace_editor')) {
                /** @type {AceAjax.Editor} */
                const editor = pre.env.editor
                editor.setValue(result)
                editor.clearSelection()
                return
            }

            const nextPre = document.createElement('pre')
            nextPre.textContent = result
            nextPre.classList.add('prettyprint', `lang-${lang}`, 'linenums')
            pre.before(nextPre)
            const preId = pre.id
            pre.remove()
            if (preId) {
                nextPre.id = preId
            }

            data.textContent = result
            PR.prettyPrint()
        }

        const finished = endTime.toDate() < new Date()
        if (finished) {
            await formatInner()
            return
        }

        showModal(id, formatInner)
    }

    const formatTextArea = async (event, lang) => {
        const formatInner = async (modal = false) => {
            if (modal) removeModal(SOURCE_ID)

            event.target.disabled = true
            const sw = $(".editor-buttons > button:nth-child(3)")
            const active = sw.attr('aria-pressed') === 'true'

            const textarea = sourceCodeDiv.children('textarea#plain-textarea')


            if (!active) sw.trigger('click')
            const code = textarea.val()
            if (!active) sw.trigger('click')

            const result = await request(code, lang, event)
            event.target.disabled = false
            if (!result) return

            if (!active) sw.trigger('click')
            textarea.val(result)
            if (!active) sw.trigger('click')
        }

        const finished = endTime.toDate() < new Date()
        if (finished) {
            await formatInner()
            return
        }

        showModal(SOURCE_ID, formatInner)
    }

    const buttonClass = endTime.toDate() < new Date() ? 'btn-info' : 'btn-danger'

    const prePrettyPrint = Array.from(
        document.getElementsByClassName('prettyprint')
    )
    const preAceEditor = Array.from(
        document.getElementsByClassName('ace_editor')
    )
    for (const pre of prePrettyPrint.concat(preAceEditor)) {
        const next = pre.nextElementSibling
        if (next.className !== 'source-code-for-copy') continue
        const id = next.id

        let adding = pre.previousElementSibling
        while (adding.className === 'div-btn-copy')
            adding = adding.previousElementSibling

        adding.insertAdjacentHTML('afterend', createButtons(buttonClass, id))
        for (const lang of ['cpp', 'py', 'cs']) {
            document.getElementById(`${id}-fmt-${lang}`)
                .addEventListener('click', async (e) => await formatCode(e, pre, id, lang))
        }
    }

    const sourceCodeDiv = $('#sourceCode')
    if (!sourceCodeDiv) return

    $('.editor-buttons')[0].insertAdjacentHTML('beforeend', createButtons(buttonClass, SOURCE_ID))
    for (const lang of ['cpp', 'py', 'cs']) {
        document.getElementById(`source-fmt-${lang}`)
            .addEventListener('click', async (e) => await formatTextArea(e, lang))
    }
})()
