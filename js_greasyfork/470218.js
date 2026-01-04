// ==UserScript==
// @name         [BETA] Lozerix Fired
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  hello
// @author       Unito
// @match        https://lozerix.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lozerix.com
// @grant GM_setValue
// @grant GM_getValue
// @grant GM.getValue
// @grant GM.setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470218/%5BBETA%5D%20Lozerix%20Fired.user.js
// @updateURL https://update.greasyfork.org/scripts/470218/%5BBETA%5D%20Lozerix%20Fired.meta.js
// ==/UserScript==

const account_username = document.querySelector('.p-navgroup-linkText')

async function updIds() {
    const pairs = document.querySelector(".memberPairs")

    if (pairs != null) {
        const a = await GM.getValue('id_users')
        if (a) {
            const id = document.querySelector(".memberHeader-nameWrapper").querySelector(".username ").getAttribute("data-user-id")
            const dl = document.createElement('dl')

            $(dl).attr('style', "cursor: pointer;")


            dl.className = "pairs pairs--justified pairs--customField"
            dl.innerHTML = "<dt>ID</dt><dd><a id='idp'>" + id + "</a></dd>";
            pairs.appendChild(dl);

            dl.querySelector("a").addEventListener('click', function(ev){
                copyContent(this.innerText)
            });
        } else {

        }
    }
}

const myURL = new URL(window.location.href)

if (myURL.pathname == '/account/preferences') {
    (async () => {
        const page = document.querySelector('.p-body-pageContent')
        const block = page.querySelector('.block-container')
        const block_body = page.querySelectorAll('.block-body')

        const h2_ = document.createElement("h2")

        h2_.className = "block-formSectionHeader"
        h2_.innerHTML = "<span class='block-formSectionHeader-aligner'>Настройки расширения Lozerix Fired</span>"
        block_body[block_body.length - 1].after(h2_)
        const prefer = document.createElement("div")

        prefer.className = "block-body"
        const option_fairies = createOpt("Бесплатные Феичики", "Вкл / Выкл", "fairies_o", prefer)
        const option_id = createOpt("ID пользователей", "Вкл / Выкл", "id_o", prefer)
        const input_unique = createInp("Стиль Уника", "unique_o", "Ваш уникальный стиль уника", prefer)

        h2_.after(prefer)

        const checkbox_fairies = option_fairies.querySelector('input[type=checkbox]')
        const checkbox_id = option_id.querySelector('input[type=checkbox]')

        setup('fairies', checkbox_fairies)
        setup('id_users', checkbox_id)

        const a = await GM.getValue('id_users')

        input_unique.addEventListener('change', (event) => {
            setStorage('unique_style', input_unique.querySelector('input[type=text]').value)
        })
        option_fairies.addEventListener('change', (event) => {
            toggleCheckbox(checkbox_fairies, 'fairies')
        })
        option_id.addEventListener('change', (event) => {
            toggleCheckbox(checkbox_id, 'id_users')
        })
    })();
}

function createOpt(dt, dd, name, parent) {
    const option = document.createElement('dl')
    parent.appendChild(option)
    option.innerHTML = newOption(dt, dd, name)
    option.className = "formRow"
    return option
}

function createInp(dt, name, desc, parent) {
    const input = document.createElement('dl')
    parent.appendChild(input)
    input.innerHTML = newInput(dt, name, desc)
    input.className = "formRow formRow--input"
    return input
}

async function setup(val, checkbox) {
    var value = await GM.getValue(val)
    const toNumber = value ? 1 : 0
    toNumber == 1 ? checkbox.setAttribute('checked', 1) : checkbox.removeAttribute('checked')
}

function copyContent(text) {
    navigator.clipboard.writeText(text)
}

function newOption(dt, dd, name) {
    return `<dt><div class='formRow-labelWrapper'><label class='formRow-label'>${dt}</label></div></dt><dd><ul class='notificationChoices'><li class='notificationChoices-choice notificationChoices-choice--alert'><label class='iconic'><input type='checkbox' name='${name}' value='1' checked='1'><i aria-hidden='true'></i><span class='iconic-label'>${dd}</span></label></li></ul></dd>`
}

function newInput(dt, name, desc) {
    return `<dt><div class="formRow-labelWrapper"><label class="formRow-label">${dt}</label></div></dt><dd><input type="text" class="input" name="user[${name}]" value="" maxlength="5000" id=""><a class="formRow-explain" style="cursor: pointer;" href='https://lozerix.com/threads/7522/#post-48241'>${desc}</a></dd>`
}

async function toggleCheckbox(element, val) {
    if(element.hasAttribute("checked")) {
        element.removeAttribute('checked')
        await setStorage(val, false)
        location.reload();
    } else {
        element.setAttribute('checked', 1)
        await setStorage(val, true)
        location.reload();
    }
}

async function setStorage(key, value) {
    await GM.setValue(key, value);
}

async function updNicks () {
    let a = await GM.getValue('fairies')

    const b = await GM.getValue('unique_style')
    Array.from(document.querySelectorAll(".username ")).forEach((item)=>{
        var txt = item.innerText
        if(txt == account_username.innerText){
            var p = item.querySelector('span')
            if (p != null){
                p.setAttribute('style', b)
            }
            if (a) {
                item.classList.add("fairies_label");
            }
        }
    })
    account_username.setAttribute('style', b)
    a ? account_username.classList.add("fairies_label") : null
}


$(document).ready(async ()=>{
    await updNicks()
    await updIds()
})