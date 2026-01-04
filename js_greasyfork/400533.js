// ==UserScript==
// @name           Deutsche Bank Vermögensübersicht
// @name:de        Deutsche Bank Vermögensübersicht
// @namespace      https://windowsfreak.de
// @version        4.0
// @description    Collects historical Vermögensübersicht data for Vermögensentwicklung.
// @description:de Sammelt historische Daten aus der Vermögensübersicht für die Vermögensentwicklung.
// @author         Björn Eberhardt
// @license        MIT; https://opensource.org/licenses/MIT
// @icon           https://www.deutsche-bank.de/dam/deutschebank/de/shared/logo/deutsche_bank_logo_retina.gif
// @match          https://meine.deutsche-bank.de/trxm/db/invoke/*show.assets.overview.do
// @match          https://meine.deutsche-bank.de/trxm/db/invoke/*show.assets.overview.do?tab=purchase
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/400533/Deutsche%20Bank%20Verm%C3%B6gens%C3%BCbersicht.user.js
// @updateURL https://update.greasyfork.org/scripts/400533/Deutsche%20Bank%20Verm%C3%B6gens%C3%BCbersicht.meta.js
// ==/UserScript==
// MIT license used to import to OpenUserJS


(function () {
    'use strict';

    const $ = id => document.getElementById(id)
    const $tt = name => document.getElementsByTagName(name)
    const $cc = name => document.getElementsByClassName(name)
    const $qsa = name => document.querySelectorAll(name)

    // Navigated to Vermögensaufstellung?
    if ($tt('h1')[0].innerText !== 'Vermögensaufstellung') {
        // Highlight menu item to find it faster
        const link = [...$tt('a')].filter(item => item.text === 'Vermögensaufstellung')[0]
        link.style.fontWeight = 'bold'
        link.style.textDecoration = 'underline'
    } else {
        const navigate = true // set to false to stop scraping through history
        const user = $('customerNumber').childNodes[1].data.replace(/^\s+|\s+$/g, '').replace(/\s/g, '_')
        const reportDateFields = ['reportDateYear', 'reportDateMonth', 'reportDateDay']
        const parseLocaleNumber = stringNumber => {
            const thousandSeparator = (1111).toLocaleString().replace(/1/g, '')
            const decimalSeparator = (1.1).toLocaleString().replace(/1/g, '')

            return parseFloat(
                stringNumber
                    .replace(new RegExp('\\' + thousandSeparator, 'g'), '')
                    .replace(new RegExp('\\' + decimalSeparator), '.')
            )
        }
        const navigateTo = target => {
            const url = new URL(window.location.href)
            for (let param of url.searchParams.keys()) {
                if (param.indexOf('show') >= 0) {
                    url.searchParams.delete(param)
                }
            }
            url.searchParams.append(target, '1')
            window.location.href = url.href
        }
        const done = () => {
            console.log('done')
            const d = document.createElement('div')
            d.innerHTML = 'Der Abruf der Daten wurde erfolgreich beendet.<br /> <input type="button" value="Tabelle zeigen" class="button nextStep"> <input type="button" value="Diagramm zeigen" class="button nextStep">'
            d.getElementsByTagName('input')[0].onclick = () => navigateTo('showTable')
            d.getElementsByTagName('input')[1].onclick = () => navigateTo('showChart')
            $('assetsOverviewForm').prepend(d)
        }
        const to8Char = parts => `${parts[0]}${parts[1]}${parts[2]}`
        const parseDate = (date, str = date.toISOString()) => [str.substring(0, 4), str.substring(5, 7), str.substring(8, 10)]
        const formatDate = d => d.toLocaleDateString('de-DE', {
            timeZone: 'UTC',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
        const getDate = () => reportDateFields.map(key => $(key).value)
        const setDate = date => reportDateFields.forEach((key, index) => $(key).value = date[index]) || $cc('button refresh')[0].click()
        const getCat = elem => {
            while (elem) {
                const cat = elem.querySelector('#subTotal01')
                if (cat) {
                    return cat.innerText
                }
                elem = elem.previousElementSibling
            }
        }
        const parseNum = node => parseLocaleNumber(node.innerText)

        // Do we see data?
        if ($cc('errorMsg').length < 1) {
            // Gather it.
            const d = getDate()
            const today = new Date(Date.UTC(d[0], d[1] - 1, d[2], 0, 0, 0, 0))
            const todayStr = to8Char(d)

            // Do we have data from yesterday?
            const yesterday = new Date(today)
            yesterday.setDate(yesterday.getDate() - 1)
            const yesterdayStr = to8Char(parseDate(yesterday))

            const promisify = request =>
                new Promise((resolve, reject) => {
                    request.onsuccess = event => resolve(event.target.result)
                    request.onerror = event => reject(event.target.error)
                })

            const getDb = () => {
                return new Promise((resolve, reject) => {
                    const db = indexedDB.open('wf', 1)
                    db.onupgradeneeded = function(event) {
                        const db = event.target.result
                        // Create object stores and indexes
                        const daily = db.createObjectStore('daily', { keyPath: ['user', 'd_str'] })
                        db.createObjectStore('lists')
                        daily.createIndex('user_dstr', ['user', 'd_str'])
                    }
                    db.onsuccess = event => resolve(event.target.result)
                    db.onerror = event => {
                        console.error(event)
                        reject(new Error('Error opening database'))
                    }
                })
            }
            const getData = db => {
                return new Promise((resolve, reject) => {
                    const transaction = db.transaction(['daily', 'lists'], 'readonly')
                    const lists = transaction.objectStore('lists')
                    const daily = transaction.objectStore('daily')

                    const resultObj = {
                        db
                    }
                    promisify(lists.get(`${user}_wkn`)).then(wkn => {
                        if (!wkn) wkn = {}
                        resultObj.wkn = wkn
                        return promisify(lists.get(`${user}_cat`))
                    }).then(cat => {
                        if (!cat) cat = []
                        resultObj.cat = cat
                        return promisify(daily.get([user, yesterdayStr]))
                    }).then(yesterday => {
                        resultObj.yesterday = yesterday
                        resolve(resultObj)
                    }).catch(error => {
                        console.error(error)
                        reject(new Error('Error retrieving database entries'))
                    })
                })
            }
            const setData = data => {
                return new Promise((resolve, reject) => {
                    const transaction = data.db.transaction(['daily', 'lists'], 'readwrite')
                    const lists = transaction.objectStore('lists')
                    const daily = transaction.objectStore('daily')
                    promisify(lists.put(data.wkn, `${user}_wkn`)).then(() => {
                        return promisify(lists.put(data.cat, `${user}_cat`))
                    }).then(() => {
                        return promisify(daily.put(data.day))
                    }).then(() => {
                        resolve()
                    }).catch(error => {
                        console.error(error)
                        reject(new Error('Error storing database entries'))
                    })
                })
            }

            getDb().then(getData).then(data => {
                const wkns = {}
                const cats = {}

                let bbal = 0, bchg = 0
                $qsa('#lkn_detail').forEach(e => {
                    const wkn = e.title.split(' ')[1]
                    data.wkn[wkn] = e.innerText
                    const cat = getCat(e.closest('tr'))
                    const bal = parseNum(e.closest('tr').querySelector('td[headers=\'col08a\']'))
                    const chg = parseNum(e.closest('tr').querySelector('td[headers=\'col07a\']'))
                    wkns[wkn] = {cat, wkn, bal, chg}
                })
                $qsa('#subTotal01').forEach(e => {
                    const cat = e.innerText
                    data.cat.includes(cat) || data.cat.push(cat)
                    const bal = parseNum(e.closest('tr').querySelector('th[headers=\'subTotal01 col08a\']'))
                    const chg = parseNum(e.closest('tr').querySelector('th[headers=\'subTotal01 col07a\']'))
                    if (cat === 'Liquidität') {
                        bbal = bal
                        bchg = chg
                    }
                    cats[cat] = {cat, bal, chg}
                })
                const tbal = parseNum(document.querySelector('td[headers=\'textTotal col08a\']'))
                const tchg = parseNum(document.querySelector('td[headers=\'textTotal col07a\']'))
                data.day = {user, d_str: todayStr, d: formatDate(today), tbal, tchg, bbal, bchg, wkns, cats}

                setData(data).then(() => {
                    if (navigate && !data.yesterday) {
                        setDate(parseDate(yesterday))
                    } else {
                        done()
                    }
                })
            })
        } else {
            done()
        }
    }
})()
