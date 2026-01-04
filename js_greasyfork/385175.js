// ==UserScript==
// @name         BiliBili每日任务
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  自动完成bilibili的每日任务
// @author       maxinimize
// @match        https://account.bilibili.com/account/home
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/385175/BiliBili%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/385175/BiliBili%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    }

    const fetchAttentions = async () => {
        try {
            let attentionList = [];
            const uid = document.cookie.split('; ').find(x => x.substr(0,11) === 'DedeUserID=').substr(11);
            const response = await fetch(`https://api.bilibili.com/x/relation/followings?vmid=${uid}&ps=50&order=desc`)
            const data = await response.json();
            if (data.code === 0) {
                let attentionList = data.data.list.map(a => a.mid)
                return attentionList
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.log('错误', error);
        }
    }

    const fetchVideos = async () => {
        try {
            let attentionList = await fetchAttentions();
            let videoList = [];
            for (let a of attentionList) {
                let response = await fetch(`https://space.bilibili.com/ajax/member/getSubmitVideos?mid=${a}&pagesize=100&tid=0`)
                let data = await response.json();
                videoList = videoList.concat(data.data.vlist.map(v => v.aid))
            }
            return videoList

        } catch (error) {
            console.log('错误', error);
        }
    }

/*
    const fetchFiveMinsVideos = async () => {
        try {
            let attentionList = await fetchAttentions();
            let videoList = [];
            for (let a of attentionList) {
                let response = await fetch(`https://space.bilibili.com/ajax/member/getSubmitVideos?mid=${a}&pagesize=100&tid=0`)
                let data = await response.json(); // parseInt(data.data.vlist[0].length.split(':'))
                let result = data.data.vlist.filter(v => v.length.split(':').length > 2 || v.length.split(':') = 2 && parseInt(v.length.split(':')[0], 10))
                videoList = videoList.concat(data.data.vlist.map(v => v.aid))
            }
            return videoList

        } catch (error) {
            console.log('错误', error);
        }
    }
*/


    const fetchWatch = async (aid) => {
        try {
            let response = await fetch('https://api.bilibili.com/x/web-interface/view?aid='+aid)
            let data = await response.json();
            if (data.code === 0) {
                const cid = data.data.cid;
                const duration = data.data.duration;
                const sid = document.cookie.split('; ').find(x => x.substr(0,4) === 'sid=').substr(4);
                const uid = document.cookie.split('; ').find(x => x.substr(0,11) === 'DedeUserID=').substr(11);
                const csrf = document.cookie.split('; ').find(x => x.substr(0,9) === 'bili_jct=').substr(9);
                response = await fetch('https://api.bilibili.com/x/report/click/h5', {
                    credentials: 'include',
                    method: 'post',
                    headers: {'Content-type': 'application/x-www-form-urlencoded'},
                    body: `aid=${aid}&cid=${cid}&part=1&did=${sid}&ftime=${new Date().getTime()}&jsonp=jsonp&lv=None&mid=${uid}&csrf=${csrf}&stime=${new Date().getTime()}`
                })
                data = await response.json();
                if (data.code === 0) {
                    response = await fetch('https://api.bilibili.com/x/report/web/heartbeat', {
                        credentials: 'include',
                        method: 'post',
                        headers: {'Content-type': 'application/x-www-form-urlencoded'},
                        body: `aid=${aid}&cid=${cid}&jsonp=jsonp&mid=${uid}&csrf=${csrf}&played_time=0&pause=false&realtime=${duration}&dt=7&play_type=1&start_ts=${new Date().getTime()}`
                    })
                    data = await response.json();
                    if (data.code === 0) {
                        const controller = new AbortController();
                        const signal = controller.signal;
                        const fetchPromise = fetch('https://api.bilibili.com/x/report/web/heartbeat', {
                            credentials: 'include',
                            method: 'post',
                            headers: {'Content-type': 'application/x-www-form-urlencoded'},
                            body: `aid=${aid}&cid=${cid}&jsonp=jsonp&mid=${uid}&csrf=${csrf}&played_time=${duration-1}&pause=false&realtime=${duration}&dt=7&play_type=0&start_ts=${new Date().getTime()}`
                        })
                        const timeoutId = setTimeout(() => controller.abort(), 5000);
                        data = await fetchPromise.then(response => response.json());
                        if (data.code === 0) {
                            console.log('观看成功');
                            return true
                        } else {
                            console.log('观看失败@4: ', data.message);
                            return false
                        }
                    } else {
                        console.log('观看失败@3: ', data.message);
                        return false
                    }

                } else {
                    console.log('观看失败@2: ', data.message);
                    return false
                }
            } else {
                console.log('获取视频信息失败: ', data.message);
                return false
            }
        } catch (error) {
            console.log('错误', error);
            return false
        }
    }

    const fetchShare = async (body) => {
        try {
            const response = await fetch('https://api.bilibili.com/x/web-interface/share/add', {
                credentials: 'include',
                method: 'post',
                headers: {'Content-type': 'application/x-www-form-urlencoded'},
                body: body
            })
            const data = await response.json();
            if (data.code === 0) {
                console.log("分享成功");
                return true
            } else {
                console.log(data.message);
                return false
            }
        } catch (error) {
            console.log('错误', error);
            return false
        }
    }

    const fetchCoin = async (body) => {
        try {
            const response = await fetch('https://api.bilibili.com/x/web-interface/coin/add', {
                credentials: 'include',
                method: 'post',
                headers: {'Content-type': 'application/x-www-form-urlencoded'},
                body: body
            })
            const data = await response.json()
            if (data.code === 0) {
                console.log("投币成功");
                return true
            } else {
                console.log(data.message);
                return false
            }
        } catch (error) {
            console.log('错误', error);
            return false
        }
    }

    const watch = async () => {
        let videoList = await fetchVideos();
        let aid = videoList[getRandomInt(0, videoList.length)];
        return fetchWatch(aid);
    }

    const share = async () => {
        let videoList = await fetchVideos();
        let aid = videoList[getRandomInt(0, videoList.length)];
        let csrf = document.cookie.split('; ').find(x => x.substr(0,9) === 'bili_jct=').substr(9);
        let payload = `aid=${aid}&csrf=${csrf}`;
        return fetchShare(payload);
    }

    const coin = async () => {
        let videoList = await fetchVideos();
        let aid = videoList[getRandomInt(0, videoList.length)];
        let csrf = document.cookie.split('; ').find(x => x.substr(0,9) === 'bili_jct=').substr(9);
        let payload = `aid=${aid}&multiply=1&csrf=${csrf}`;
        return fetchCoin(payload);
    }

     window.setTimeout(() => {
         if (document.querySelector('#app > div > div.security_content > div.security-right > div > div:nth-child(2) > div.home-daily-task-warp > div > div:nth-child(2) > div.home-dialy-exp-icon.position-rest')) {
             watch()
         }

         if (document.querySelector('#app > div > div.security_content > div.security-right > div > div:nth-child(2) > div.home-daily-task-warp > div > div:nth-child(3) > div.home-dialy-exp-icon.position-rest')) {
             if (document.querySelector('#app > div > div.security_content > div.security-right > div > div:nth-child(2) > div.home-daily-task-warp > div > div:nth-child(3) > p.re-exp-none').innerHTML === '未完成' || document.querySelector('#app > div > div.security_content > div.security-right > div > div:nth-child(2) > div.home-daily-task-warp > div > div:nth-child(3) > p.re-exp-none').innerHTML === '已获得0/50') {
                 if (parseInt(document.querySelector('#app > div > div.security_content > div.security-right > div > div:nth-child(1) > div.index-info > div.home-right > div.home-top-bp > span:nth-child(4)').innerHTML, 10) >= 5) {
                     let i = 0;
                     let timer = setInterval(() => {
                         coin();
                         i = i + 1;
                         if (i >= 5) {
                             clearInterval(timer);
                         }
                     },2000);
                 }
             }
         }

         if (document.querySelector('#app > div > div.security_content > div.security-right > div > div:nth-child(2) > div.home-daily-task-warp > div > div:nth-child(4) > div.home-dialy-exp-icon.position-rest')) {
             share()
         }
     }, 5000)
})();