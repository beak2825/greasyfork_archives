// ==UserScript==
// @name         GGn request presets
// @namespace    none
// @version      3
// @description  Create request presets, set defaults and easily duplicate requests in the alternate currency
// @author       ingts
// @match        https://gazellegames.net/requests.php
// @match        https://gazellegames.net/requests.php?action=new*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/474292/GGn%20request%20presets.user.js
// @updateURL https://update.greasyfork.org/scripts/474292/GGn%20request%20presets.meta.js
// ==/UserScript==

if (typeof GM_getValue('api_key') === 'undefined')
    GM_setValue('api_key', '')

const category = document.getElementById('categories')
const hasid = location.href.includes('groupid')
const ulrequest = location.href.includes('upload')
let elements = {}
let checkboxGroups = []

function getElements(type = category.value) {
    if (hasid) {
        elements = {
            title: document.querySelector('input[name=title]'),
            description: document.querySelector('textarea[name=description]'),
            bounty: document.getElementById('amount_box')
        }
        if (type === 'Games') {
            Object.assign(elements, {
                releasetypes: document.querySelectorAll('#releasetypes_tr input[type=checkbox]'),
                languages: document.querySelectorAll('#languages_tr input[type=checkbox]'),
                regions: document.querySelectorAll('#regions_tr input[type=checkbox]')
            })
            checkboxGroups = ['releasetypes', 'languages', 'regions']
        } else if (type === 'OST') {
            Object.assign(elements, {
                formats: document.querySelectorAll('#formats_tr input[type=checkbox]'),
                bitrates: document.querySelectorAll('#bitrates_tr input[type=checkbox]')
            })
            checkboxGroups = ['formats', 'bitrates']
        }
    } else {
        elements = {
            type: category,
            tags: document.querySelector('input[name=tags]'),
            title: document.querySelector('input[name=title]'),
            image: document.querySelector('input[name=image]'),
            description: document.querySelector('textarea[name=description]'),
            bounty: document.getElementById('amount_box')
        }
        if (type === 'Games') {
            Object.assign(elements, {
                platform: document.getElementById('platform'),
                year: document.querySelector('input[name=year]'),
                releasetypes: document.querySelectorAll('#releasetypes_tr input[type=checkbox]'),
                languages: document.querySelectorAll('#languages_tr input[type=checkbox]'),
                regions: document.querySelectorAll('#regions_tr input[type=checkbox]')
            })
            checkboxGroups = ['releasetypes', 'languages', 'regions']
        } else if (type === 'OST') {
            Object.assign(elements, {
                year: document.querySelector('input[name=year]'),
                formats: document.querySelectorAll('#formats_tr input[type=checkbox]'),
                bitrates: document.querySelectorAll('#bitrates_tr input[type=checkbox]')
            })
            checkboxGroups = ['formats', 'bitrates']
        }
        if (ulrequest) Object.assign(elements, {unit: document.getElementById('current_unit')})
    }
}


function save() {
    let saved = {}
    getElements()
    Object.keys(elements).forEach(key => {
        const element = elements[key]
        if (checkboxGroups.includes(key)) {
            saved[key] = Array.from(element).filter(c => c.checked).map(c => c.value)
        } else {
            saved[key] = element.value
        }
    })
    return saved
}

function load(obj) {
    getElements(obj.type)
    for (const [key, val] of Object.entries(elements)) {
        if (hasid && key === 'title') {
            val.value = val.value + obj[key]
            continue
        }
        if (checkboxGroups.includes(key)) {
            val.forEach(c => {
                c.checked = c.value !== 'on' && obj[key].includes(c.value)
            })
        } else val.value = obj[key]
    }
    category.dispatchEvent(new Event('change'))
}

const currency = location.href.includes('gold') || hasid ? 'GB' : 'Gold'

if (GM_getValue('d')) {
    const duplicate = GM_getValue('duplicate')
    const groupid = GM_getValue('groupid')
    load(duplicate)
    elements.description.value += `\n\n${currency} request: https://gazellegames.net/requests.php?action=view&id=${GM_getValue('currentID') + 1}\n${groupid ? 'Group: https://gazellegames.net/torrents.php?id=' + groupid : ''}`
    if (location.href.includes('gold')) /* converting from gb */ {
        if (duplicate.unit === 'mb') elements.bounty.value = Math.ceil(duplicate.bounty / 2.048)
        if (duplicate.unit === 'gb') elements.bounty.value = Math.ceil(duplicate.bounty * 500)
    } else {
        elements.bounty.value = Math.ceil(duplicate.bounty * 2.048)
        elements.unit.value = 'mb'
    }
    GM_deleteValue('d')
    GM_deleteValue('duplicate')
    GM_deleteValue('currentID')
    if (groupid) GM_deleteValue('groupid')
} else {
    let presets = GM_getValue('presets', {})
    let deflt = GM_getValue('default')
    if (deflt) load(deflt)
    const end = document.querySelector("#request_form > table > tbody > tr:nth-child(16) > td > p")
    document.querySelector("#request_form > table > tbody > tr:nth-child(1)").insertAdjacentHTML('afterend', `
    <tr>
  <td class="label">Presets</td>
  <td>
    <select id="presets" style="border: #44ff8d 1px dotted;">
    <option></option>
    </select>
    <button type="button" id="deletepreset" class="hidden" style="background-color: red;;">Delete preset</button>
  </td>
</tr>`)
    end.insertAdjacentHTML('afterend', `
<button type="button" id="duplicate">Make ${currency} request</button>`)
    const duplicatebtn = document.getElementById('duplicate')
    const presetselect = document.getElementById('presets')
    const deletepreset = document.getElementById('deletepreset')
    duplicatebtn.addEventListener('click', () => {
        GM_setValue('duplicate', save())
        if (GM_getValue('api_key')) {
            let currentID
            fetch('https://gazellegames.net/api.php?request=search&search_type=requests', {headers: {'X-API-Key': GM_getValue('api_key')}})
                .then(r => r.json()).then(reqs => {
                const keys = Object.keys(reqs.response)
                currentID = parseInt(keys[24])
                GM_setValue('currentID', currentID)
                elements.description.value += `\n\n${currency} request: https://gazellegames.net/requests.php?action=view&id=${currentID + 2}`
            })
        }
        GM_setValue('d', 1)
        if (hasid) GM_setValue('groupid', new URL(location.href).searchParams.get('groupid'))
        hasid ? window.open(`https://gazellegames.net/requests.php?action=new&request_currency=upload`, '_blank')
            : window.open(`https://gazellegames.net/requests.php?action=new&request_currency=${location.href.includes('gold') ? 'upload' : 'gold'}`, '_blank')
    })
    Object.keys(presets).forEach(name => {
        let option = document.createElement('option')
        option.textContent = name
        option.value = name
        presetselect.append(option)
    })
    presetselect.addEventListener('change', ev => {
        if (presetselect.value) {
            deletepreset.classList.remove('hidden')
            load(presets[presetselect.value])
        } else {
            deletepreset.classList.add('hidden')
            document.getElementById('request_form').reset()
        }
    })
    deletepreset.addEventListener('click', () => {
        delete presets[presetselect.value]
        presetselect.querySelector(`option[value="${presetselect.value}"]`).remove()
        presetselect.selectedIndex = 0
        presetselect.dispatchEvent(new Event('change'))
        GM_setValue('presets', presets)
    })
    if (!hasid) {
        duplicatebtn.insertAdjacentHTML('afterend', `
        <button type="button" id="setdefault">${deflt ? 'Remove default' : 'Set as default'}</button>
<button type="button" id="savepreset">Save preset</button>
<input type="text" id="nameinput" style="margin-left: 10px;" class="hidden" placeholder="Name (required)">
`)
        const nameinput = document.getElementById('nameinput')
        const setdefault = document.getElementById('setdefault')
        document.getElementById('savepreset').addEventListener("click", () => {
            nameinput.classList.toggle('hidden')
            nameinput.focus()
        })
        nameinput.addEventListener('keydown', ev => {
            if (ev.key === 'Enter') {
                ev.preventDefault()
                if (nameinput.value) {
                    presets[nameinput.value] = save()
                    GM_setValue('presets', presets)
                    nameinput.value = 'Saved'
                    nameinput.style.color = 'lightgreen'
                    nameinput.disabled = true
                    setTimeout(() => {
                        nameinput.classList.toggle('hidden')
                        nameinput.disabled = false
                        nameinput.value = ''
                        nameinput.style.removeProperty('color')
                    }, 1500)
                }
            }
        })
        setdefault.addEventListener("click", () => {
            if (GM_getValue('default')) {
                GM_deleteValue('default')
                setdefault.disabled = true
                setdefault.textContent = 'Default removed'
                setdefault.style.color = 'lightgreen'
                setTimeout(() => {
                    setdefault.disabled = false
                    setdefault.textContent = 'Set as default'
                    setdefault.style.removeProperty('color')
                }, 1500)
            } else {
                GM_setValue('default', save())
                setdefault.disabled = true
                setdefault.textContent = 'Default saved'
                setdefault.style.color = 'lightgreen'
                setTimeout(() => {
                    setdefault.disabled = false
                    setdefault.textContent = 'Remove default'
                    setdefault.style.removeProperty('color')
                }, 1500)
            }
        })
    }
}
