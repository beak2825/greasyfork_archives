// ==UserScript==
// @name         OGame Fast expeditions Upgrade
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Lets you choose what exactly system you'll send your expeditions to (also include random mode with choosing range). Notice - OGame Fast expeditions MUST BE INSTALLED
// @author       Alexander Bulgakov
// @match        *.ogame.gameforge.com/game/index.php?page=ingame&component=fleetdispatch*
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450492/OGame%20Fast%20expeditions%20Upgrade.user.js
// @updateURL https://update.greasyfork.org/scripts/450492/OGame%20Fast%20expeditions%20Upgrade.meta.js
// ==/UserScript==

const pageCoords = document.querySelector('meta[name*="coordinates"]')

let galCord = pageCoords.content.match(/(\d):\d{1,3}:\d{1,2}/)[1], //localStorage.getItem('galCord')
    sysCord = pageCoords.content.match(/\d:(\d{1,3}):\d{1,2}/)[1], //localStorage.getItem('sysCord')
    cbState = localStorage.getItem('cbState'),
    randVal = localStorage.getItem('randVal') || 1

const gsWrap = document.createElement('div')
gsWrap.style.cssText = `
    display: flex;
    flex-wrap: wrap;
    position: relative;
    float: right;
    width: 106px;
`
const galaxyInput = document.createElement('input')
galaxyInput.setAttribute('id', 'galaxyInput')
galaxyInput.setAttribute('type', 'text')
galaxyInput.setAttribute('maxLength', '1')
galaxyInput.value = galCord
galaxyInput.setAttribute('tabindex', '1')
galaxyInput.style.cssText = `
    width: 15px;
    text-align: center;
    margin: -3px 3px 0px;
    font-family: Verdana, Arial, SunSans-Regular, sans-serif;
    font-size: 1.1rem;
    font-weight: bold;
`

galaxyInput.onkeydown = () => {
    if (event.key == 'ArrowUp') galaxyInput.value = parseInt(++galCord)
    else if (event.key == 'ArrowDown') galaxyInput.value = parseInt(--galCord)
    fixGalVal()
}
galaxyInput.onwheel = (event) => {
    event.preventDefault()
    if (event.deltaY < 0) ++galCord
    else --galCord
    galaxyInput.value = galCord
    fixGalVal()
}
galaxyInput.oninput = () => fixGalVal()
function fixGalVal() {
    if (galaxyInput.value == null) {
        galaxyInput.value == '1'
        galaxyInput.select()
    }
    else if (+galaxyInput.value > 5) {
        galaxyInput.value = '5'
    }
    else if (+galaxyInput.value < 1) {
        galaxyInput.value = '1'
    }
    galCord = galaxyInput.value
    localStorage.setItem('galCord', galCord)
}

const systemInput = document.createElement('input')
systemInput.setAttribute('id', 'systemInput')
systemInput.setAttribute('type', 'text')
systemInput.setAttribute('maxLength', '3')
systemInput.value = sysCord
systemInput.setAttribute('tabindex', '2')
systemInput.style.cssText = `
    width: 40px;
    text-align: center;
    margin: -3px 15px 0px 3px;
    font-family: Verdana, Arial, SunSans-Regular, sans-serif;
    font-size: 1.1rem;
    font-weight: bold;
`

systemInput.onkeydown = () => {
    if (event.key == 'ArrowUp') systemInput.value = parseInt(++sysCord)
    else if (event.key == 'ArrowDown') systemInput.value = parseInt(--sysCord)
    fixSysVal()
    fixRandVal()
}
systemInput.onwheel = (event) => {
    event.preventDefault()
    if (event.deltaY < 0) ++sysCord
    else --sysCord
    systemInput.value = sysCord
    fixSysVal()
    fixRandVal()
}
systemInput.oninput = () => {
    fixSysVal()
    fixRandVal()
}
function fixSysVal() {
    if (systemInput.value == null) {
        systemInput.value = '1'
        systemInput.select()
    }
    else if (+systemInput.value > 499) {
        systemInput.value = '499'
    }
    else if (+systemInput.value < 1) {
        systemInput.value = '1'
    }
    sysCord = systemInput.value
    localStorage.setItem('sysCord', sysCord)
}

const lblsWrap = document.createElement('div')
lblsWrap.style.cssText = `
    display: flex;
    width: 130px;
    flex-direction: column;
    margin: -7px 15px 0px 0px;
    text-align: right;
    float: right;
    color: #7c8e9a;
    font-size: 0.6rem;
`

const lblRand = document.createElement('label')
lblRand.setAttribute('id', 'lblRand')
lblRand.setAttribute('for', 'cbRand')
lblRand.innerText = 'Random'
lblRand.style.cssText = `
    position: relative;
    top: 6px;
    left: 16px;
`

const cbRand = document.createElement('input')
cbRand.setAttribute('id', 'cbRand')
cbRand.setAttribute('type', 'checkbox')
if (cbState == 'true') cbRand.setAttribute('checked', '')
cbRand.style.cssText = `
    position: relative;
    left: 1px;
    top: 6px;
`
cbRand.onchange = () => {
    cbRand.toggleAttribute('checked')
    localStorage.setItem('cbState', cbRand.checked)
    if (cbRand.checked) {
        averSign.style.visibility = 'visible'
        randomInput.style.visibility = 'visible'
    } else {
        averSign.style.visibility = 'hidden'
        randomInput.style.visibility = 'hidden'
    }
}

const averSign = document.createElement('h1')
averSign.setAttribute('id', 'averSign')
averSign.innerText = '±'
averSign.style.cssText = `
    ${cbState == 'true' ? 'visibility: visible;' : 'visibility: hidden;'}
    margin: 13px 2px 0px;
    font-family: sans-serif;
    font-size: 17px;
    font-weight: bold;
`

const randomInput = document.createElement('input')
randomInput.setAttribute('id', 'randomInput')
randomInput.setAttribute('type', 'text')
randomInput.setAttribute('maxLength', '3')
randomInput.value = randVal
randomInput.setAttribute('tabindex', '3')
randomInput.style.cssText = `
    ${cbState == 'true' ? 'visibility: visible;' : 'visibility: hidden;'}
    width: 40px;
    text-align: center;
    margin: 9px 0px 0px 3px;
    font-family: Verdana, Arial, SunSans-Regular, sans-serif;
    font-size: 1.1rem;
    font-weight: bold;
`

randomInput.onkeydown = () => {
    if (event.key == 'ArrowUp') randomInput.value = parseInt(++randVal)
    else if (event.key == 'ArrowDown') randomInput.value = parseInt(--randVal)
    fixRandVal()
}
randomInput.onwheel = (event) => {
    event.preventDefault()
    if (event.deltaY < 0) ++randVal
    else --randVal
    randomInput.value = randVal
    fixRandVal()
}
randomInput.oninput = () => fixRandVal()
function fixRandVal() {
    if (randomInput.value == null) {
        randomInput.value = '1'
        randomInput.select()
    }
    else if (+sysCord == 250 && +randomInput.value > 499 - +sysCord) randomInput.value = '249'
    else if (+sysCord > 250 && +randomInput.value > +sysCord) randomInput.value = sysCord
    else if (+sysCord < 250 && +randomInput.value > 499 - +sysCord) randomInput.value = 499 - +sysCord
    else if (+randomInput.value < 1) {
        randomInput.value = '1'
    }
    randVal = randomInput.value
    localStorage.setItem('randVal', randVal)
}

const copyRight = document.createElement('h4')
let developerName, developerId, devGal, devSys
let universeId = +location.href.match(/s(\d{3})/)[1]
switch (universeId) {
    case 181: developerId = '100295'
        devGal = 1
        devSys = 59
    break
    case 182: developerId = '100397'
        devGal = 1
        devSys = 80
    break
    case 169: developerId = '103181'
        devGal = 2
        devSys = 128
    break
    default: developerId = null
        developerName = 'player from another OGame universe'
        devGal = 2
        devSys = 128
    break
}

async function getData(url) {
    const resp = await fetch(url)
    let text = await resp.text()
    let parsed = new window.DOMParser().parseFromString(text, 'text/xml')
    return parsed
}

getData(`https://s${universeId}-ru.ogame.gameforge.com/api/players.xml`)
            .then(data => {
                if (!developerId) copyRight.innerHTML = `<p style="margin-bottom: 5px;">Advanced upgrade of OGame Fast expeditions</p>Made by <a href="https://s169-ru.ogame.gameforge.com/game/index.php?page=ingame&component=galaxy&galaxy=${devGal}&system=${devSys}">${developerName}</a>`
                else {
                    let playerName = data.querySelector(`player[id="${developerId}"]`).getAttribute('name')
                    copyRight.innerHTML = `<p style="margin-bottom: 5px;">Advanced upgrade of OGame Fast expeditions</p>Made by <a href="https://s${universeId}-ru.ogame.gameforge.com/game/index.php?page=ingame&component=galaxy&galaxy=${devGal}&system=${devSys}">${playerName}</a>`
                }
            })

const insertTargetBlock = document.querySelectorAll('.allornonewrap')
const insertTargetButton = document.querySelector('#sendExpFleet')
insertTargetButton.style.cssText = `
    text-decoration: none;
    position: relative;
    top: 10px;
    filter: hue-rotate(95deg);
`
const overlayBlock = document.createElement('span')
overlayBlock.setAttribute('id', 'goSpan')
overlayBlock.innerText = 'FAST SEND'

overlayBlock.onclick = event => {
    event.stopPropagation()
    let finalCord
    let randSysCord = (min, max) => {
        const r = Math.random() * (max - min) + min
        finalCord = Math.floor(r)
        return finalCord < 0 ? Math.abs(finalCord) : finalCord == 0 ? ++finalCord : finalCord
    }
    pageCoords.content = `${galCord}:${cbRand.checked ? randSysCord(+sysCord - +randVal, +sysCord + +randVal) : sysCord}:16`
    insertTargetButton.click()
}

lblsWrap.append(copyRight)
lblsWrap.append(lblRand)
insertTargetButton.insertAdjacentElement('afterend', lblsWrap)
gsWrap.append(galaxyInput)
gsWrap.append(systemInput)
gsWrap.append(cbRand)
gsWrap.append(averSign)
gsWrap.append(randomInput)
insertTargetButton.after(gsWrap)
insertTargetButton.children[0].replaceWith(overlayBlock)