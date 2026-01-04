// ==UserScript==
// @name         CodeForces-显示AC数
// @namespace    http://tampermonkey.net/
// @version      2024-05-10
// @description display AC count
// @author       Qianfan
// @match        https://codeforces.com/profile/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @run-at      document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/494589/CodeForces-%E6%98%BE%E7%A4%BAAC%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/494589/CodeForces-%E6%98%BE%E7%A4%BAAC%E6%95%B0.meta.js
// ==/UserScript==

(async function() {
    'use strict';
            //注入css
            GM_addStyle(`
        .dropbtn {
            background-color: #4CAF50;
            color: white;
            padding: 10px;
            min-width: 100px;
            font-size: 14px;
            border: none;
            cursor: pointer;
            border-radius: 5px;
        }

        .dropbtn.loading {
            background-color: #c7a233;
        }

        .dropdown {
            position: relative;
            display: inline-block;
        }

        .dropdown-content {
            border-radius: 5px;
            transform-origin: center top;
            transform: scaleY(0);
            transition: transform 0.4s ease;
            position: absolute;
            background-color: #f9f9f9;
            min-width: 150px;
            box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        }

        .dropdown-content a {
            color: black;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
            cursor: pointer;
        }

        .dropdown-content a:last-child {
            color: red;
        }

        .dropdown-content a:hover {
            background-color: #f1f1f1
        }

        .dropdown:hover .dropdown-content {
            transform: scaleY(1);
        }

            `)
            //重要变量
            const earliest = document.querySelector('rect').dataset.date
            let endDate = earliest, topMap
            const activeGraph = document.querySelector('div#userActivityGraph')
            const months = {
                'Jan': '01',
                'Feb': '02',
                'Mar': '03',
                'Apr': '04',
                'May': '05',
                'Jun': '06',
                'Jul': '07',
                'Aug': '08',
                'Sep': '09',
                'Oct': '10',
                'Nov': '11',
                'Dec': '12'
            }, dateRegex = /([A-Z][a-z][a-z])/
            const domParser = new DOMParser()
            let stroageKey = '__CHONGTIAN_codeforces_daily_ac_v2_'
            const filePaths = window.location.pathname.split('/'),
                username = filePaths[filePaths.length - 1]
                , URL = `https://codeforces.com/submissions/${username}/page`
            stroageKey += username
            let topMapStr = localStorage.getItem(stroageKey)
            const dropDown = document.createElement('div'),
                box = document.querySelector('div.roundbox.userActivityRoundBox.borderTopRound.borderBottomRound')
            //
            dropDown.innerHTML = `<div class="dropdown">
                                        <button class="dropbtn">完成!</button>
                                        <div class="dropdown-content">
                                            <a class="render">渲染</a>
                                            <a class="refresh">刷新最近数据</a>
                                            <a class="refresh-all">刷新全部数据</a>
                                        </div>
                                    </div>`
            box.insertBefore(dropDown, box.firstChild)
            const realDropDown = dropDown.querySelector('div.dropdown'),
                dropbtn = dropDown.querySelector('button.dropbtn')
            dropDown.querySelector('.dropdown-content a.render').addEventListener('click', f => render())
            dropDown.querySelector('.dropdown-content a.refresh').addEventListener('click', async f => await fetchData()
            )
            dropDown.querySelector('.dropdown-content a.refresh-all').addEventListener('click', async f => {
                if (confirm('确定要刷新全部数据吗?'))
                    await fetchData(earliest)
            }
            )
            //
            const convertDate = date => date.replace(dateRegex, (match, p1) => months[p1])
            const aLaterOrEquals = (a, b) => {
                const aArr = a.split('/'), bArr = b.split('/');
                if (aArr[2] !== bArr[2]) return aArr[2] > bArr[2]
                if (aArr[0] !== bArr[0]) return aArr[0] > bArr[0]
                return aArr[1] >= bArr[1]
            }
            const solveDoc = (html, map, endDate2, getTot = false) => {
                const doc = domParser.parseFromString(html, 'text/html'),
                    submissions = doc.querySelectorAll('tr[data-submission-id]')
                let tot = void 0, flag = false, latest = void 0
                if (getTot) {
                    const lis = doc.querySelectorAll('div.pagination ul li')
                    tot = parseInt(lis[lis.length - 2].innerText)
                }
                for (const elem of submissions) {
                    if (!elem.querySelector('span.verdict-accepted')) continue
                    const date = convertDate(elem.querySelector('span.format-time').innerText.split(' ')[0])
                    if (!latest) latest = date
                    if (!aLaterOrEquals(date, endDate2)) {
                        flag = true
                        break
                    }
                    if (!map[date]) map[date] = new Set()
                    map[date].add(parseInt(elem.querySelector('td[data-problemid]').dataset.problemid))
                }
                return { tot, flag, latest }
            }
            const render = f => {
                if (!activeGraph) return
                for (const key in topMap) {
                    const rect = activeGraph.querySelector(`rect[data-date="${key}"]:not([fill="#EBEDF0"])`)
                    if (!rect) continue
                    rect.dataset.date = `${rect.dataset.date},Accept ${topMap[key]}`
                }
            }
            const fetchData = async endDate1 => {
                dropbtn.classList.toggle('loading')
                dropbtn.innerHTML = '获取数据...'
                const dataMap = {}
                if (topMapStr) {
                    topMap = JSON.parse(topMapStr)
                    endDate = topMap.latest
                }
                endDate1 = endDate1 ?? endDate
                const res = await fetch(`${URL}/1`)
                const html = await res.text()
                let { flag, tot, latest } = solveDoc(html, dataMap, endDate1, true)
                for (let page = 2; page <= tot && !flag; ++page) {
                    const res = await fetch(`${URL}/${page}`)
                    const html = await res.text()
                    flag = solveDoc(html, dataMap, endDate1).flag
                }
                for (const k in dataMap)
                    dataMap[k] = dataMap[k].size
                topMap = {
                    ...topMap,
                    ...dataMap,
                    latest,
                }
                dropbtn.innerHTML = '完成!'
                dropbtn.classList.toggle('loading')
            }
            //main
            await fetchData()
            topMapStr = JSON.stringify(topMap)
            localStorage.setItem(stroageKey, topMapStr)
            render()
})();