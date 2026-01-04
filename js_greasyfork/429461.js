// ==UserScript==
// @name         Google Meet Student camera checker - @foonyew.edu.my
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Find nasty students without camera
// @author       FYHSJB
// @match        https://meet.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=google.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429461/Google%20Meet%20Student%20camera%20checker%20-%20%40foonyewedumy.user.js
// @updateURL https://update.greasyfork.org/scripts/429461/Google%20Meet%20Student%20camera%20checker%20-%20%40foonyewedumy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let __stuArr__camEnabled__userId = []
    let __stuArr__camEnabled__userId__keepUpdated = []
    let __stuObj__NoCam_nameList = {}
    let __stuObj__all_nameList = {}
    let __totalRefreshCount = 0
    let __stuObj__calcCamOnlinePercentage__counter = {}
    let __isShowUserListClicked = false
    const sortObject = o => Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {})

    setInterval(() => main(), 1000);

    document.body.onclick= function(e){
        e=window.event? event.srcElement: e.target;
        if(e.className && e.className.indexOf('zy3vwb IpYpqc')!=-1) {
            main()
            //let ____windowABC = window.open("", "___MsgWindow", "width=500,height=350");
            let __stuArr__NoCam__SeatNo = Object.keys(__stuObj__NoCam_nameList).map(x => parseInt(x.substr(-2)))
            //____windowABC.document.write(`${__stuArr__NoCam__SeatNo.join(", ")}号请打开镜头。<br><br>${__stuArr__NoCam__SeatNo.length} 位同学没开镜头： ${Object.values(__stuObj__NoCam_nameList).join(", ")}。。<br>座号：${__stuArr__NoCam__SeatNo.join(", ")}`);
            //____windowABC.document.write('<br>--------------<br>')
            //____windowABC.document.write('总刷新次数：' + __totalRefreshCount + '<br>')
            //for (const [key, value] of Object.entries(sortObject(__stuObj__calcCamOnlinePercentage__counter))) {
            //    ____windowABC.document.write(`${Math.round((value / __totalRefreshCount) * 100)}% - ${key.substr(-2)} - ${__stuObj__all_nameList[key]}<br>`)
            //}
            //____windowABC.document.close();
            let strText = ''
            strText += `${__stuArr__NoCam__SeatNo.join(", ")}号请打开镜头。\n\n${__stuArr__NoCam__SeatNo.length} 位同学没开镜头： ${Object.values(__stuObj__NoCam_nameList).join(", ")}。。\n座号：${__stuArr__NoCam__SeatNo.join(", ")}`
            strText += '\n--------------\n'
            for (const [key, value] of Object.entries(sortObject(__stuObj__calcCamOnlinePercentage__counter))) {
                strText += `${Math.round((value / __totalRefreshCount) * 100)}% - ${key.substr(-2)} - ${__stuObj__all_nameList[key]}\n`
            }
            document.getElementsByClassName('VA2JSc')[0].innerText = strText
        };
        if(e.className && e.className.indexOf('isOLae')!=-1) {
            __stuArr__camEnabled__userId = []
            __stuObj__NoCam_nameList = {}
            main()
            document.querySelectorAll('.isOLae')[0].innerText = 'Updated!'
        };
        if(e.className && e.className.indexOf('ZjFb7c')!=-1) { // check specific stu again
            const participantName = e.innerText
            if (['S1', 'S2', 'S3', 'J1', 'J2', 'J3'].includes(participantName.substr(0, 2))) {
                const userId = participantName.split(' ')[0]
                __stuArr__camEnabled__userId = __stuArr__camEnabled__userId.filter(e => e !== userId) // remove them from camera emabled list
                main()
            }
        };
    }

    const main = () => {
        // If you've joined the meeting, then click "participant list" button
        if (!__isShowUserListClicked && document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ JsuyRc boDUxc").length > 0) {
            document.getElementsByClassName("VfPpkd-Bz112c-LgbsSe yHy1rc eT1oJ JsuyRc boDUxc")[1].click()
            __isShowUserListClicked = true
            __totalRefreshCount = 0
        }

        __totalRefreshCount++
        __stuObj__NoCam_nameList = {}
        __stuArr__camEnabled__userId__keepUpdated = []
        let __stuUserId_getLastStuChecked_preventDuplicate = 0

        // --Finding users have video enabled--
        // Every single div will have .AwnI1b
        // Users without cam will have .vLRPrf
        // Thus: .AwnI1b deduct .vLRPrf = Users have video enabled

        document.querySelectorAll('div:not(.vLRPrf).AwnI1b .H5Sn2e').forEach(function(e) {
            let participantName = e.innerText
            if (participantName.includes('This video is paused'))
              participantName = participantName.split('This video is paused')[0]
            if (participantName.includes('\n'))
              participantName = participantName.split('\n')[0]

            if (['S1', 'S2', 'S3', 'J1', 'J2', 'J3'].includes(participantName.substr(0, 2))) {
                let userId = participantName.split(' ')[0]
                __stuArr__camEnabled__userId__keepUpdated.push(userId)
                __stuArr__camEnabled__userId.push(userId)
            }
        });

        __stuArr__camEnabled__userId__keepUpdated = [...new Set(__stuArr__camEnabled__userId__keepUpdated)]
        __stuArr__camEnabled__userId = [...new Set(__stuArr__camEnabled__userId)]




        // Finding all students from name list

        document.querySelectorAll('.KV1GEc .ZjFb7c').forEach(function(e) {
            let participantNameFromList = e.innerText
            if (['S1', 'S2', 'S3', 'J1', 'J2', 'J3'].includes(participantNameFromList.substr(0, 2))) {
                let [id, ...name] = participantNameFromList.split(' ')
                name = name.join('').replace(/[\d\w\s-]/g, '')
                __stuObj__all_nameList[id] = name

                // Always up-to-date (suitable for percentage calculation)
                if (__stuArr__camEnabled__userId__keepUpdated.includes(id)) {
                    if (!__stuObj__calcCamOnlinePercentage__counter[id]) __stuObj__calcCamOnlinePercentage__counter[id] = 0
                    if (__stuUserId_getLastStuChecked_preventDuplicate !== id) __stuObj__calcCamOnlinePercentage__counter[id]++
                }

                // System assumed that user has cam enabled when they open at least once (until admin clicked update/clear btn)
                if (__stuArr__camEnabled__userId.includes(id)) {
                    // e.innerText = `(${Math.round((__stuObj__calcCamOnlinePercentage__counter[userId] / __totalRefreshCount) * 100)}) ` + e.innerText
                    e.style.backgroundColor = 'yellow'
                } else {
                    e.style.backgroundColor = ''
                    __stuObj__NoCam_nameList[id] = name
                }

                __stuUserId_getLastStuChecked_preventDuplicate = id
            }
        })

        if (document.getElementsByClassName('isOLae').length > 0)
            document.getElementsByClassName('isOLae')[0].innerText = 'Checked ' + __totalRefreshCount + ' times.'
    }


})();