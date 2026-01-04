// ==UserScript==
// @name         Alpargatas PR
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Help creating new PR
// @author       maxjf1
// @match        https://bitbucket.org/iteliosbrasil/itelios.havaianas.sfcc/pull-requests/new
// @match        https://bitbucket.org/iteliosbrasil/itelios.havaianas.sfcc/pull-requests/update/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411345/Alpargatas%20PR.user.js
// @updateURL https://update.greasyfork.org/scripts/411345/Alpargatas%20PR.meta.js
// ==/UserScript==

(() => {
    'use strict';
    const $ = window.$ || window.jQuery
    const now = new Date()
    const releaseTag = `${now.getFullYear() % 100}.${now.getMonth() + 1}.X`
    const code =
        `<div id="id_help_group" class="field-group">
        <label class="">PR labels</label>

        <div class="helper-labels">
            <button class="aui-button aui-button-compact aui-button-primary" style="margin:0" type="button" data-tag="[Sprint X]">
                Sprint X
            </button>
            <button class="aui-button aui-button-compact aui-button-primary" style="margin:0" type="button" data-tag="[CORE]">
                CORE
            </button>
            <button class="aui-button aui-button-compact aui-button-primary" style="margin:0" type="button" data-tag="[APAC]">
                APAC
            </button>
            <button class="aui-button aui-button-compact aui-button-primary" style="margin:0" type="button" data-tag="[ID]">
                ID
            </button>
            <button class="aui-button aui-button-compact aui-button-primary" style="margin:0" type="button" data-tag="[BR]">
                BR
            </button>
            <button class="aui-button aui-button-compact aui-button-primary" style="margin:0" type="button" data-tag="[BACK]">
                BACK
            </button>
            <button class="aui-button aui-button-compact aui-button-primary" style="margin:0" type="button" data-tag="[FRONT]">
                FRONT
            </button>
            <button class="aui-button aui-button-compact aui-button-primary" style="margin:0" type="button" data-tag="[CODE]">
                CODE
            </button>
            <button class="aui-button aui-button-compact aui-button-primary" style="margin:0" type="button" data-tag="[DATA]">
                DATA
            </button>
        </div>
    </div>`

    $('#id_title_group').before(code)

    $('#id_help_group .helper-labels').prepend(
        `<button class="aui-button aui-button-compact aui-button-primary" style="margin:0" type="button" data-tag="[${releaseTag}]">
            ${releaseTag}
        </button>`)

    const branchWords = $('#s2id_autogen2 .select2-chosen').text().split(/_|-|\//)
    let i;
    if ((i = branchWords.findIndex(id => Number(id))) >= 0 && branchWords[i - 1]) {
        const taskId = `${branchWords[i - 1]}-${branchWords[i]}`
        $('#id_help_group .helper-labels').prepend(
            `<button class="aui-button aui-button-compact aui-button-primary" style="margin:0" type="button" data-tag="[${taskId}]">
                ${taskId}
            </button>`)
    }

    $('[data-tag]').click(function (e) {
        e.preventDefault();
        const tag = $(this).data('tag')
        const $title = $('#id_title')

        console.log(tag, $title.val())

        if ($title.val().search(tag.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) >= 0)
            $title.val($title.val().replace(`${tag} `, ''))
        else
            $title.val(`${tag} ${$title.val()}`)
    })

    console.log('PR helper loaded')
})()