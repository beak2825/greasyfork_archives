// ==UserScript==
// @name         清水河畔自动领奖
// @namespace    http://tampermonkey.net/
// @version      1.1.3
// @description  自动领奖
// @author       DARK-FLAME-MASTER FROM RIVERSIDE
// @match        *://*.uestc.edu.cn/forum.php?mod=viewthread*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uestc.edu.cn
// @require      https://cdn.bootcdn.net/ajax/libs/dom-to-image/2.6.0/dom-to-image.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454676/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E8%87%AA%E5%8A%A8%E9%A2%86%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/454676/%E6%B8%85%E6%B0%B4%E6%B2%B3%E7%95%94%E8%87%AA%E5%8A%A8%E9%A2%86%E5%A5%96.meta.js
// ==/UserScript==

(function () {

    'use strict';
    const rewardPost = "https://bbs.uestc.edu.cn/forum.php?mod=post&action=reply&fid=42&tid=463952&extra=&replysubmit=yes"



    function getReward(postLink, type, post_params) {

        let ele = document.querySelector("table.plhin > tbody > tr > td > div")
        let temp = ele.innerHTML
        return fetch(postLink)
            .then(data => data.text())
            .then(data => {
                let doc = new DOMParser().parseFromString(data, 'text/html')
                let info = doc.querySelector("table.plhin > tbody > tr > td > div")
                ele.innerHTML = info.innerHTML
                return domtoimage.toBlob(ele)
            })
            .then(blob => {
                ele.innerHTML = temp
                let img = new File([blob], "reward.png", { type: "image/png" })
                let fd = new FormData();
                fd.append('uid', post_params.uid)
                fd.append('hash', post_params.hash)
                fd.append("type", "image");
                fd.append("filetype", "png");
                fd.append("Filename", "reward.png")
                fd.append("Filedata", img)
                fetch("https://bbs.uestc.edu.cn/misc.php?mod=swfupload&action=swfupload&operation=upload&fid=42&html5=image", {
                    "headers": {
                    },
                    "body": fd,
                    "method": "POST",
                }).then(data => data.text())
                    .then(aid => {
                        let formhash = document.querySelector("#scbar_form > input[name=formhash]").value
                        let message = `吾名乃${document.querySelector("#toptb > div.y > strong > a").text}，特来此帖取${type.data + (type.name == 'time' ? '小时' : '帖')}奖励`
                        //let message = "测试"
                        return fetch(rewardPost, {
                            "headers": {
                                "content-type": "application/x-www-form-urlencoded",
                            },
                            "body": `formhash=${formhash}&message=${message}&attachnew[${aid}][description]=`,
                            "method": "POST",
                        });
                    })
            })
    }

    function notice(message) {
        Notification.requestPermission().then((result) => { if (result === 'granted') { let n = new Notification(message) } })
    }

    async function init() {
        let version = GM_getValue('version', 0)
        if (version == 0) {
            GM_setValue('version', 1)
            let postLink = GM_getValue('postLink', null)
            let lastRewardReply = GM_getValue("lastRewardReply", 0)
            let lastRewardTime = GM_getValue("lastRewardTime", 0)
            fetch(postLink)
                .then(data => data.text())
                .then(data => {
                    let doc = new DOMParser().parseFromString(data, 'text/html')
                    let uid = doc.querySelector(".authi > .xw1").href.match(/uid=(.*)/)[1]
                    let userData = {}
                    userData[uid] = {
                        lastRewardReply: lastRewardReply,
                        lastRewardTime: lastRewardTime,
                        postLink: postLink
                    }
                    GM_setValue('userData', userData)
                })

        } else {
            let userData = GM_getValue('userData', {})
            let uid = document.querySelector(".vwmy > a").href.match(/uid=(.*)/)[1]
            if (!userData[uid]) {
                let postLink = await fetch('https://bbs.uestc.edu.cn/home.php?mod=space&do=thread&view=me')
                    .then(data => data.text())
                    .then(data => {
                        let doc = new DOMParser().parseFromString(data, 'text/html')
                        return doc.querySelector("#delform > table > tbody > tr:nth-child(2) > th > a").href
                    })
                userData[uid] = {
                    lastRewardReply: 0,
                    lastRewardTime: 0,
                    postLink: postLink
                }
                GM_setValue('userData', userData)
            }
        }

    }

    function checkAndGetReward() {
        let link = document.querySelector('#toptb > div.y > strong > a')
        let post_params = unsafeWindow.upload.settings.post_params;
        let uid = link.href.match(/uid=(\d+)/)[1]
        let postNoticedTime = GM_getValue('postNoticedTime', false)
        let timeNoticedTime = GM_getValue('timeNoticedTime', false)
        if (link) {
            fetch(link.href + '&do=profile')
                .then(data => data.text())
                .then(text => {
                    let reply = parseInt(text.match(/回帖数 (\d+)/)[1]) + parseInt(text.match(/主题数 (\d+)/)[1])
                    let online = parseInt(text.match(/在线时间<\/em>(\d+)/)[1])

                    let rewardReply = Math.max(Math.round(reply / 5000) * 5000, 5000)
                    let rewardTime = Math.max(Math.round(online / 500) * 500, 500)

                    let requiredReply = rewardReply - reply
                    let requiredTime = rewardTime - online

                    let userData = GM_getValue('userData', {})

                    let lastRewardTime = userData[uid].lastRewardTime
                    let lastRewardReply = userData[uid].lastRewardReply
                    let postLink = userData[uid].postLink

                    //a function that check if the minus of a given timestamp and now is less than 1 hour
                    let isNoticed = (time) => new Date().getTime() - time < 1000 * 60 * 60





                    if (requiredReply >= -200 && requiredReply <= 10 && rewardReply != lastRewardReply && !isNoticed(postNoticedTime)) {
                        notice(`距离领水仅差${requiredReply}帖`)
                        GM_setValue('postNoticedTime', new Date().getTime())
                    }
                    if (requiredTime >= -20 && requiredTime <= 1 && rewardTime != lastRewardTime && !isNoticed(timeNoticedTime)) {
                        notice(`距离领水仅差${requiredTime}小时`)
                        GM_setValue('timeNoticedTime', new Date().getTime())
                    }

                    if (requiredReply >= -200 && requiredReply <= 0 && rewardReply != lastRewardReply) {
                        getReward(postLink, { name: 'reply', data: rewardReply }, post_params)
                            .then((a) => {
                                notice(`已自动领取${rewardReply}帖奖励`)
                                userData[uid].lastRewardReply = rewardReply
                                GM_setValue("userData", userData)
                            })

                    }
                    if (requiredTime >= -20 && requiredTime <= 0 && rewardTime != lastRewardTime) {
                        getReward(postLink, { name: 'time', data: rewardTime }, post_params)
                            .then((a) => {
                                notice(`已自动领取${rewardTime}小时奖励`)
                                userData[uid].lastRewardTime = rewardTime
                                GM_setValue("userData", userData)
                            })
                    }

                })
        }
    }

    init()
    checkAndGetReward()
    setInterval(checkAndGetReward, 1000 * 60 * 10)

    // Your code here...
})();