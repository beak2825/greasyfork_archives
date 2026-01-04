// ==UserScript==
// @name         Ally member finder
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://www.origins-return.fr/univers-origins/galaxie.php
// @require      http://code.jquery.com/jquery-3.5.1.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_deleteValue

// @downloadURL https://update.greasyfork.org/scripts/422233/Ally%20member%20finder.user.js
// @updateURL https://update.greasyfork.org/scripts/422233/Ally%20member%20finder.meta.js
// ==/UserScript==

const T_MIN = 100
const T_MAX = 200

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function randomTime() {
    return getRandomArbitrary(T_MIN, T_MAX)
}

function getCoo(p) {
    return {
        g: parseInt($('#galaxi2').val()),
        s: parseInt($('#system2').val()),
        p
    }
}

async function addTagSearchMenu() {
    let allyTag = await GM_getValue('name_ally_tag_to_find', "")
    let tagInput = `
    <label for="ally-tag-to-find">TAG</label>
    <input type="text" placeholder="SG1" id="ally-tag-to-find" value="${allyTag}"/>
    `
    let stopButton = `<input type="button" id="stop-finding-tag" value="Stop Finding" />`
    let startButton = `<input type="button" id="start-finding-tag" value="Start Finding" />`
    let button = JSON.parse(await GM_getValue('finding_ally_tag', "false")) === true ? stopButton : startButton
    let container = `<div align="center" id="tag-ally-finder">${tagInput}${button}</div>`
    $('form#galaxiform').after(container)
}

function stopFindingTag(e) {
    e.preventDefault()
    GM_deleteValue('finding_ally_tag')
}

async function findTagOnPage() {
    let coords = document.querySelectorAll('span[onclick^="PageAlly"]')
    let ally = `[${await GM_getValue('name_ally_tag_to_find', "")}]`
    coords.forEach(async(e, i) => {
        if ($(e).html() === ally)
            await GM_setValue('list_pos_ally_found', JSON.stringify([...JSON.parse(await GM_getValue('list_pos_ally_found', "[]")), getCoo($('form#galaxiform table:last-child tbody tr').index($(e).parents('tr')) + 1)]))
    })
    if (getCoo().g <= 71)
        setTimeout(() => galaxi_envoi(getCoo().g, getCoo().s + 1), randomTime())
}

async function displayListFound() {
    let list = JSON.parse(await GM_getValue('list_pos_ally_found', "[]")).map((e) => `<li>${e.g}:${e.s}:${e.p}</li>`)
    let resetButton = `<input type="button" id="reset-finding-tag" value="Reset Finding List" />`
    let container = `<div id="list-tag-ally"><ul>${list.join('')}</ul>${resetButton}</div>`
    $('form#galaxiform').after(container)
}

function resetFoundedTags() {
    GM_deleteValue('list_pos_ally_found')
    galaxi_envoi(getCoo(0).g, getCoo(0).s)
}

async function startFindingTag(e) {
    e.preventDefault()
    let ally = $('#ally-tag-to-find').val()
    if (!ally.length)
        return;
    await GM_setValue('name_ally_tag_to_find', ally)
    await GM_setValue('finding_ally_tag', 'true')
    findTagOnPage()
}

(async function() {
    'use strict';

    $(document).on('click', '#stop-finding-tag', stopFindingTag)
    $(document).on('click', '#start-finding-tag', startFindingTag)
    $(document).on('click', '#reset-finding-tag', resetFoundedTags)
    await displayListFound()
    await addTagSearchMenu()
    if (JSON.parse(await GM_getValue('finding_ally_tag', 'false')) === true)
        findTagOnPage()
})();