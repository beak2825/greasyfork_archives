// ==UserScript==
// @name         Gitlab 996 index statistic
// @namespace    http://996.icu/
// @version      0.1
// @description  work and life balance!
// @author       wanghsinche
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gitlab.com
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/452007/Gitlab%20996%20index%20statistic.user.js
// @updateURL https://update.greasyfork.org/scripts/452007/Gitlab%20996%20index%20statistic.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const meta = document.body.dataset;
    const projectId = meta?meta.projectId:null;
    const commitURL = `/api/v4/projects/${projectId}/repository/commits`
    const visualazation = 'https://hellodigua.github.io/code996/#/result'
    const mergeFlag = "Merge branch"

    const pannelId = 'my-pannel'

    let loading = false

    function print(...param) {
        const myPannel = document.getElementById(pannelId)
        myPannel.style.display = 'block'
        myPannel.innerText = param.toString()
    }



    async function getCommit(maxNum = 1000, page = 1) {
        if (maxNum < 1) {
            return []
        }

        const perPage = 100
        const param = new URLSearchParams()
        param.set('per_page', perPage)
        param.set('page', page)
        const rawData = await fetch(`${commitURL}?${param.toString()}`).then(res => res.json())

        const data = rawData.filter(el => !el.title.startsWith(mergeFlag))

        if (rawData.length < perPage) {
            return data
        }
        print('processing... page ', page)
        const rest = await getCommit(maxNum - data.length, page + 1)
        return data.concat(rest)

    }

    async function processData() {
        const totalCommit = await getCommit()
        print('got the commits, start to analyze', totalCommit.length)
        const startTime = new Date(totalCommit.reduce((am, ele) => {
            if (!am) return ele.committed_date
            return am < ele.committed_date ? am : ele.committed_date
        }, null))
        const endTime = new Date(totalCommit.reduce((am, ele) => {
            if (!am) return ele.committed_date
            return am > ele.committed_date ? am : ele.committed_date
        }, null))

        // const timezone = Object.entries(totalCommit.reduce((am, ele)=>{
        //     const tz = ele.committed_date.split('+').pop()
        //     am[tz] = (am[tz]||0)+1
        //     return am
        // }, {})).reduce((am, ele)=>{
        //     if (ele[1] > am[1]){
        //         return ele
        //     }
        // }, ['00:00', 0])[0]

        const byDayResult = totalCommit.reduce((am, ele) => {
            const day = new Date(ele.committed_date).getDay()
            am[day] = (am[day] || 0) + 1
            return am
        }, {})

        const byHourResult = totalCommit.reduce((am, ele) => {
            const hour = new Date(ele.committed_date).getHours()
            am[hour] = (am[hour] || 0) + 1
            return am
        }, {})
        // month start from 0
        const formattedStartTime = `${startTime.getFullYear()}-${startTime.getMonth()+1}-${startTime.getDate()}`
        const formattedEndTime = `${endTime.getFullYear()}-${endTime.getMonth()+1}-${endTime.getDate()}`

        const formattedDayResult = Object.entries(byDayResult).map(([day, freq]) => `${freq}_${day}`).join(',')
        const formattedHourResult = Object.entries(byHourResult).map(([hour, freq]) => `${freq}_${hour}`).join(',')

        const param = new URLSearchParams()
        param.set('time', `${formattedStartTime}_${formattedEndTime}`)
        param.set('week', formattedDayResult)
        param.set('hour', formattedHourResult)
        const finalLink = `${visualazation}?${param.toString()}`

        return finalLink
    }


    function buildGUI() {
        const myButton = document.createElement('button')
        myButton.id = 'my-button'
        myButton.className = 'gl-button btn btn-default'
        myButton.textContent = 'Get 996 Index'

        myButton.addEventListener('click', () => {
            if (loading) return

            loading = true
            processData().then(link => {

                const myPannel = document.getElementById(pannelId)
                const a = document.createElement('a')
                a.href = link
                a.textContent = ' the statistic result'
                a.target = 'blank'
                myPannel.innerHTML = 'got it! click the link to see '
                myPannel.append(a)

            }, err => {
                print(err)
            }).finally(() => {
                loading = false
            })
        })


        const container = document.getElementsByClassName('shortcuts-find-file')[0].parentElement
        container.append(myButton)

        const myPannel = document.createElement('div')
        myPannel.id = 'my-pannel'
        myPannel.style.padding = '20px'
        myPannel.className = 'info-well'
        myPannel.style.display = 'none'

        const infoWell = document.getElementsByClassName('info-well')[0]

        infoWell.parentElement.insertBefore(myPannel, infoWell)

    }


    function main() {
        if (!projectId){
            console.log('it isn\'t a gitlab project page, abort')
            return
        }
        
        const targetNode = document.getElementsByClassName('nav-block')[0];

        // Options for the observer (which mutations to observe)
        const config = { attributes: false, childList: true, subtree: true };

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            let isChild = false
            for (const mutation of mutationList) {
                if (mutation.type === 'childList') {
                    console.log('A child node has been added or removed.');
                    isChild = true
                }
            }
            if (isChild) {
                observer.disconnect();
                buildGUI()
            }
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);

    }
    
    // launch the program
    main()




})();
