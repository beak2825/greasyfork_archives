// ==UserScript==
// @name         Neopets: Faerie Festival Donation Points
// @namespace    Nyu@Clraik
// @version      1.1.2
// @description  Displays the amount of points you get for donating an item in the Faerie Festival
// @author       Nyu
// @match        *://*.neopets.com/faeriefestival/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neopets.com
// @downloadURL https://update.greasyfork.org/scripts/511131/Neopets%3A%20Faerie%20Festival%20Donation%20Points.user.js
// @updateURL https://update.greasyfork.org/scripts/511131/Neopets%3A%20Faerie%20Festival%20Donation%20Points.meta.js
// ==/UserScript==

(async () => {
    const FFpoints = {
        3: { min: 1, max: 79, color: 'grey' },
        5: { min: 80, max: 89, color: '#dda713' },
        8: { min: 90, max: 97, color: 'green' },
        6: { min: 98, max: 100, color: '#7ba515' },
        10: { min: 102, max: 179, color: 'gold' },
    }

    let totalPoints = 0

    const divAutoSelect = document.createElement('div')
    divAutoSelect.className = 'faeriefestival-recycle-team-text'
    divAutoSelect.style.marginBottom = '20px'
    divAutoSelect.style.display = 'flex'
    divAutoSelect.style.alignSelf = 'end'

    const checkAutoSelect = document.createElement('input')
    checkAutoSelect.type = 'checkbox'
    checkAutoSelect.id = 'faeriefestival_auto_select'
    checkAutoSelect.checked = localStorage.getItem('faeriefestival_auto_select') === 'true'
    checkAutoSelect.onchange = () => {
        localStorage.setItem('faeriefestival_auto_select', checkAutoSelect.checked)
    }

    const labelAutoSelect = document.createElement('label')
    labelAutoSelect.htmlFor = 'faeriefestival_auto_select'
    labelAutoSelect.textContent = 'Auto-select items'

    divAutoSelect.append(checkAutoSelect, labelAutoSelect)

    document.querySelector('div.faeriefestival-team-donate button').before(divAutoSelect)

    document.querySelector('div.faeriefestival-team-donate button').addEventListener('click', async () => {
        cleanTitle()
        await appendPointsAndColor()
        document.querySelectorAll('.ff-inv-icon').forEach(icon => {
            icon.addEventListener('click', async () => {
                await wait()
                await appendPointsAndColor()
            })
        })
        document.getElementById('invStack').addEventListener('click', async () => {
            await wait()
            await appendPointsAndColor()
        })
        document.querySelector('.ff-button-recycle-items').addEventListener('click', async () => {
            await wait()
            cleanTitle()
            totalPoints = 0
            totalPoints = Array.from(document.querySelectorAll('.grid-item.ff-item-selected .rarity')).reduce((acc, curr) => acc + parseInt(curr.innerText), 0)
            document.getElementById('ffPickItemsTitle').innerHTML += '<br><div class="faeriefestival-donate-title" style="margin-bottom:10px;background: rgba(0,0,0,.5);">Total points: ' + totalPoints + '</div>'
            document.querySelector('.ff-button-back-to-ff').addEventListener('click', async () => {
                await wait()
                await appendPointsAndColor()
            })
        })

        checkAutoSelect.checked && selectTopPoints()
    })

    async function appendPointsAndColor() {
        await waitForLoadingToComplete()
        const items = Array.from(document.querySelectorAll('.grid-item'))
        for (const item of items) {
            if (item.querySelector('.rarity')) return
            let rarity = parseInt(item.querySelector('.ff-item-img').dataset.rarity)
            if (rarity > 179) continue
            if (item.innerText.includes('Sticky Snowball') || rarity === 101) {
                rarity = 1
            }
            const { points, color } = getPointsAndColor(rarity)
            const div = document.createElement('div')
            div.classList = 'rarity'
            div.style.position = 'absolute'
            div.style.top = '5px'
            div.style.left = '5px'
            div.style.width = '16px'
            div.style.height = '16px'
            div.style.color = 'white'
            div.style.borderRadius = '15px'
            div.style.padding = '5px'
            div.style.fontFamily = 'MuseoSansRounded500'
            div.style.backgroundColor = color
            div.style.filter = 'drop-shadow(2px 4px 6px black)'
            div.innerText = points
            item.append(div)
        }
    }

    function selectTopPoints() {
        const items = Array.from(document.querySelectorAll('.grid-item .rarity'))
        items.filter(r => r.innerText === '10').forEach(item => item.parentElement.querySelector('.ff-item-img').click())
        items.filter(r => r.innerText === '8').forEach(item => item.parentElement.querySelector('.ff-item-img').click())
        items.filter(r => r.innerText === '6').forEach(item => item.parentElement.querySelector('.ff-item-img').click())
        items.filter(r => r.innerText === '5').forEach(item => item.parentElement.querySelector('.ff-item-img').click())
        items.filter(r => r.innerText === '3').forEach(item => item.parentElement.querySelector('.ff-item-img').click())
    }

    function getPointsAndColor(rarity) {
        for (const [key, value] of Object.entries(FFpoints)) {
            if (rarity >= value.min && rarity <= value.max) {
                return { points: key, color: value.color }
            }
        }
    }

    function cleanTitle() {
        if (document.getElementById('ffPickItemsTitle').innerHTML.includes('<br>')) {
            document.getElementById('ffPickItemsTitle').innerHTML = document.getElementById('ffPickItemsTitle').innerHTML.split('<br>')[0]
        }
    }

    async function waitForLoadingToComplete() {
        while (document.querySelector('.ff-inv-loading-static')) {
            await wait()
        }
    }

    function wait() {
        const minToWait = 100
        const maxToWait = 1000
        const waitTime = Math.floor(Math.random() * (maxToWait - minToWait + 1)) + minToWait
        return new Promise(resolve => setTimeout(resolve, waitTime))
    }
})();