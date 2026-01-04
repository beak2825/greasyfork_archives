// ==UserScript==
// @name           Deutsche Bank Vermögensentwicklung Charts
// @name:de        Deutsche Bank Vermögensentwicklung Diagramme
// @namespace      https://windowsfreak.de
// @version        4.0
// @description    Draw Vermögensentwicklung in charts. Requires the Vermögensübersicht script.
// @description:de Stellt die Vermögensentwicklung in Diagrammen dar. Benötigt das Vermögensübersicht-Skript.
// @author         Björn Eberhardt
// @license        MIT; https://opensource.org/licenses/MIT
// @icon           https://www.deutsche-bank.de/dam/deutschebank/de/shared/logo/deutsche_bank_logo_retina.gif
// @match          https://meine.deutsche-bank.de/trxm/db/invoke/*show.assets.overview.do?showChart=1
// @match          https://meine.deutsche-bank.de/trxm/db/invoke/*show.assets.overview.do?tab=purchase&showChart=1
// @grant          none
// @require        https://code.highcharts.com/stock/highstock.js
// @require        https://code.highcharts.com/modules/boost.js
// @require        https://code.highcharts.com/modules/exporting.js
// @require        https://code.highcharts.com/modules/export-data.js
// @require        https://code.highcharts.com/modules/offline-exporting.js
// @downloadURL https://update.greasyfork.org/scripts/400660/Deutsche%20Bank%20Verm%C3%B6gensentwicklung%20Charts.user.js
// @updateURL https://update.greasyfork.org/scripts/400660/Deutsche%20Bank%20Verm%C3%B6gensentwicklung%20Charts.meta.js
// ==/UserScript==
// MIT license used to import to OpenUserJS

(function () {
    'use strict';

    // Navigated to Vermögensaufstellung?
    if (document.getElementsByTagName('h1')[0].innerText === 'Vermögensaufstellung' && window.location.href.indexOf('showChart=1') > -1) {
        let globalDb
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
                    console.error(event.target.error)
                    reject(new Error('Error opening database'))
                }
            })
        }

        const iterateKeysWithFilter = (objectStore, filterFn) => {
            return new Promise((resolve, reject) => {
                const keys = []
                const request = objectStore.openCursor()

                request.onsuccess = event => {
                    const cursor = event.target.result
                    if (cursor) {
                        const needle = filterFn(cursor.key)
                        if (needle) keys.push(needle)
                        cursor.continue()
                    } else resolve(keys)
                }
                request.onerror = event => reject(new Error('Error iterating over object store keys'));
            })
        }

        const getData = (db, acct) => {
            globalDb = db
            const transaction = db.transaction(['daily', 'lists'], 'readonly')
            const daily = transaction.objectStore('daily')
            const lists = transaction.objectStore('lists')
            const idx = daily.index('user_dstr')
            const statsKeyRange = IDBKeyRange.bound([acct, ''], [acct, '\uffff'], false, false)

            const data = {
                wkn: {},
                cat: [],
                daily: {}
            };

            const promiseWkn = promisify(lists.get(`${acct}_wkn`))
                .then(wkn => data.wkn = wkn || {})

            const promiseCat = promisify(lists.get(`${acct}_cat`))
                .then(cat => data.cat = cat || [])

            const promiseDaily = new Promise((resolve, reject) => {
                const request = idx.openCursor(statsKeyRange)
                request.onsuccess = event => {
                    const cursor = event.target.result
                    if (cursor) {
                        data.daily[cursor.primaryKey] = cursor.value;
                        cursor.continue();
                    } else resolve(); // Resolve the promise when there are no more records
                }
                request.onerror = function(event) {
                    console.error(event.target.error)
                    reject(new Error('Error retrieving user statistics'));
                }
            })

            return Promise.all([promiseWkn, promiseCat, promiseDaily]).then(() => data)
        }

        let chart, series
        const user = document.getElementById('customerNumber').childNodes[1].data.replace(/^\s+|\s+$/g, '').replace(/\s/g, '_')
        const users = () => {
            const transaction = globalDb.transaction('lists', 'readonly')
            const lists = transaction.objectStore('lists')

            const filterFn = key => {
                const match = key.match(/^(.*)_cat$/)
                if (match) return match[1]
                return null
            };
            return iterateKeysWithFilter(lists, filterFn)
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
        const defaultSettings = {
            marker: {
                radius: 3
            },
            tooltip: {
                valueSuffix: '€'
            }
        }
        const getNum = (bal, chg, dep = bal - chg, per = 100 * chg / dep) => ({
            bal: +bal.toFixed(2),
            chg: +chg.toFixed(2),
            dep: +dep.toFixed(2),
            per: +per.toFixed(2)
        })
        const ds = (name, overwrite, data = []) => ({...defaultSettings, name, data, ...overwrite})
        const prefixed_ds = name => {
            return {
                dep: ds(name + ' Eingezahlt'),
                bal: ds(name + ' Kontostand'),
                chg: ds(name + ' Gewinn'),
                per: ds(name + ' Rentabilität', {tooltip: {valueSuffix: '%'}})
            }
        }
        const addUp = (data, date, num) => data.reduce((acc, val) => val[0] === date && ((val[1] += num) || true) || acc, 0) || data.push([date, num])
        const push = (obj, date, num) => ['dep', 'bal', 'chg', 'per'].forEach(key => addUp(obj[key].data, date, num[key]))

        const load = (accts) => {
            const acctsPromises = getDb().then(db => Promise.all(accts.map(acct => getData(db, acct))))

            return acctsPromises.then(acctsData => {
                const wknref = acctsData.reduce((result, acctData) => ({...result, ...acctData.wkn}), {})
                const cats = acctsData.reduce((result, acctData) => [...result, ...acctData.cat], [])
                const days = acctsData.reduce((result, acctData) => ({...result, ...acctData.daily}), {})

                const rows = Object.keys(days).sort().map(key => days[key]);

                series = {
                    t: prefixed_ds('Gesamt'),
                    b: prefixed_ds('Liquidität'),
                    a: prefixed_ds('Depot'),
                    cat: {},
                    wkn: {}
                }

                for (const k in cats) {
                    if (k != 'Liquidität') {
                        series.cat[cats[k]] = prefixed_ds(cats[k])
                    }
                }
                for (const k in wknref) {
                    const v = wknref[k]
                    series.wkn[k] = prefixed_ds(k + ' - ' + v)
                }

                rows.forEach(row => {
                    const segments = /(\d{4})(\d{2})(\d{2})/.exec(row.d_str)
                    const date = Date.parse(segments[1] + '-' + segments[2] + '-' + segments[3])
                    const t = getNum(row.tbal, row.tchg)
                    const b = getNum(row.bbal, row.bchg)
                    const a = getNum(row.tbal - row.bbal, row.tchg - row.bchg)
                    push(series.t, date, t)
                    push(series.b, date, b)
                    push(series.a, date, a)
                    for (let key in row.wkns) {
                        push(series.wkn[key], date, getNum(row.wkns[key].bal, row.wkns[key].chg))
                    }
                    for (let key in row.cats) {
                        if (key != 'Liquidität') {
                            push(series.cat[key], date, getNum(row.cats[key].bal, row.cats[key].chg))
                        }
                    }
                })
            })
        }

        const init = () => {
            Highcharts.setOptions({
                lang: {
                    decimalPoint: ',',
                    thousandsSep: '.',
                    loading: 'Daten werden geladen...',
                    months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
                    weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
                    shortMonths: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
                    exportButtonTitle: "Exportieren",
                    printButtonTitle: "Drucken",
                    rangeSelectorFrom: "Von",
                    rangeSelectorTo: "Bis",
                    rangeSelectorZoom: "Zeitraum",
                    downloadPNG: 'Download als PNG-Bild',
                    downloadJPEG: 'Download als JPEG-Bild',
                    downloadPDF: 'Download als PDF-Dokument',
                    downloadSVG: 'Download als SVG-Bild',
                    resetZoom: "Zoom zurücksetzen",
                    resetZoomTitle: "Zoom zurücksetzen"
                }
            })

            const div = document.createElement('div')
            div.innerHTML = `
                Der Abruf der Daten wurde erfolgreich beendet.<br />
                <input type="button" value="Tabelle zeigen" class="button nextStep">
                <input type="button" value="Diagramm zeigen" class="button nextStep">
                <input type="button" value="Konten wählen" class="button nextStep"><br /><br />
                Zeige
                <input type="button" value="Einzahlung">
                <input type="button" value="Kontostand">
                <input type="button" value="Beides">
                <input type="button" value="Gewinn">
                <input type="button" value="Rentabilität">
                von
                <input type="button" value="Gesamt">
                <input type="button" value="Liquidität">
                <input type="button" value="Depot">
                <input type="button" value="Beides">
                <input type="button" value="Kategorien">
                <input type="button" value="Fonds">
                <div id="container" style="height: 800px"></div>`
            const inputElements = Array.from(div.getElementsByTagName('input'));
            [
                () => attrs(['dep']),
                () => attrs(['bal']),
                () => attrs(['dep', 'bal']),
                () => attrs(['chg']),
                () => attrs(['per']),
                () => types(['t']),
                () => types(['b']),
                () => types(['a']),
                () => types(['t', 'b', 'a']),
                () => types(['cat']),
                () => types(['wkn'])
            ].forEach((v, k) => inputElements[k + 3].onclick = v)
            div.getElementsByTagName('input')[0].onclick = () => navigateTo('showTable')
            div.getElementsByTagName('input')[1].onclick = () => navigateTo('showChart')
            div.getElementsByTagName('input')[2].onclick = () => users().then(accts => load(prompt('Konten mit Komma getrennt angeben, zur Auswahl stehen: ' + accts.join(','), user).split(',')))
            document.getElementById('assetsOverviewForm').prepend(div)
            chart = Highcharts.stockChart('container', {
                boost: {
                    useGPUTranslations: true
                },
                exporting: {
                    fallbackToExportServer: false
                },
                plotOptions: {
                    series: {
                        animation: false
                    }
                },
                title: {
                    text: 'Vermögensübersicht'
                },
                series: [],
                legend: {
                    enabled: true
                }
            })
        }

        let chosen_attributes = ['dep', 'bal']
        let chosen_types = ['a']
        const redraw = _ => {
            while (chart.series.length > 0) {
                chart.series[0].remove(false)
            }
            const chosen = []
            chosen.push(...['t', 'b', 'a'].filter(e => chosen_types.includes(e)).map(e => series[e])
                .flatMap(
                    x => chosen_attributes.map(e => x[e])))
            chosen.push(...['cat', 'wkn'].filter(e => chosen_types.includes(e)).map(e => series[e])
                .flatMap(y => Object.values(y).flatMap(
                    x => chosen_attributes.map(e => x[e]))))
            chosen.forEach(
                x => chart.addSeries(x, false)
            );
            if (chosen.length > 0) {
                if (chosen_attributes.includes('per')) {
                    chart.yAxis[0].update({
                        labels: {
                            format: '{value}%'
                        }
                    }, false)
                } else {
                    chart.yAxis[0].update({
                        labels: {
                            format: null
                        }
                    }, false)
                }
                chart.redraw()
            }
        }
        const attrs = choice => redraw(chosen_attributes = choice) && false
        const types = choice => redraw(chosen_types = choice) && false

        init()
        load([user]).then(() => redraw())
    }
})()
