// ==UserScript==
// @name         再见爱人，再见爱人4，麦琳->麦狗，把哔哩哔哩上关于麦林/麦麦的名字全部替换成麦狗，好让大家解气
// @namespace    http://mailin.quhou.top/
// @version      1.0.2
// @description  把哔哩哔哩上包含麦林/麦麦的评论全部替换成麦狗
// @author       xygod
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @require      https://update.greasyfork.org/scripts/517325/1483922/QuHouLibary.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519148/%E5%86%8D%E8%A7%81%E7%88%B1%E4%BA%BA%EF%BC%8C%E5%86%8D%E8%A7%81%E7%88%B1%E4%BA%BA4%EF%BC%8C%E9%BA%A6%E7%90%B3-%3E%E9%BA%A6%E7%8B%97%EF%BC%8C%E6%8A%8A%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%8A%E5%85%B3%E4%BA%8E%E9%BA%A6%E6%9E%97%E9%BA%A6%E9%BA%A6%E7%9A%84%E5%90%8D%E5%AD%97%E5%85%A8%E9%83%A8%E6%9B%BF%E6%8D%A2%E6%88%90%E9%BA%A6%E7%8B%97%EF%BC%8C%E5%A5%BD%E8%AE%A9%E5%A4%A7%E5%AE%B6%E8%A7%A3%E6%B0%94.user.js
// @updateURL https://update.greasyfork.org/scripts/519148/%E5%86%8D%E8%A7%81%E7%88%B1%E4%BA%BA%EF%BC%8C%E5%86%8D%E8%A7%81%E7%88%B1%E4%BA%BA4%EF%BC%8C%E9%BA%A6%E7%90%B3-%3E%E9%BA%A6%E7%8B%97%EF%BC%8C%E6%8A%8A%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%8A%E5%85%B3%E4%BA%8E%E9%BA%A6%E6%9E%97%E9%BA%A6%E9%BA%A6%E7%9A%84%E5%90%8D%E5%AD%97%E5%85%A8%E9%83%A8%E6%9B%BF%E6%8D%A2%E6%88%90%E9%BA%A6%E7%8B%97%EF%BC%8C%E5%A5%BD%E8%AE%A9%E5%A4%A7%E5%AE%B6%E8%A7%A3%E6%B0%94.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let isInMaiLinVideo = false

    async function checkIsMaiLinVideo() {
        const tags = await qq.findAllDom(".tag-link")
        return tags.some(function (tag) {
            return /麦琳|麦麦|麦林|李行亮|再见爱人4|再见爱人/.test(tag.textContent)
        })
    }


    function handleComment(data) {
        return data.map(r => {
            apply(r)
            r.replies.map(r => {
                apply(r)
                return r
            })
            return r
        })
    }

    function handleTopComment(data) {
        apply(data)
        data.replies.map(r => {
            apply(r)
            return r
        })
        return data
    }

    function handleTopRepliesComment(data) {
        return data.map(r => {
            apply(r)
            r.replies.map(r => {
                apply(r)
                return r
            })
            return r
        })
    }

    function apply(data) {
        data.content.message = `${replace(data)}`
    }

    function replace(data) {
        return data.content.message.replaceAll(/麦琳|麦麦|麦林/g, "麦狗")
    }

    const _fetch = window.fetch
    window.fetch = async function (...params) {
        if (params[0].includes("//api.bilibili.com/x/v2/reply/wbi/main")) {
            isInMaiLinVideo = await checkIsMaiLinVideo()
            if (!isInMaiLinVideo) {
                return _fetch(...params)
            }
            return new Promise(async (reslove, reject) => {
                _fetch(...params).then(async response => {
                    try {
                        const originalData = await response.json();
                        const processedData = {
                            ...originalData, processed: true, timestamp: new Date().toISOString()
                        };
                        if (processedData.data.top && processedData.data.top.upper) {
                            processedData.data.top.upper = handleTopComment(processedData.data.top.upper)
                            processedData.data.top_replies = handleTopRepliesComment(processedData.data.top_replies)
                        }
                        processedData.data.replies = handleComment(processedData.data.replies)

                        const newResponse = new Response(JSON.stringify(processedData), {
                            status: response.status, statusText: response.statusText, headers: {
                                'Content-Type': 'application/json',
                            }
                        });
                        return reslove(newResponse)
                    } catch (err) {
                        return reject(err)
                    }
                })
            })
        } else if (params[0].includes("//api.bilibili.com/x/v2/reply/reply")) {
            isInMaiLinVideo = await checkIsMaiLinVideo()
            if (!isInMaiLinVideo) {
                return _fetch(...params)
            }
            return new Promise(async (reslove, reject) => {
                _fetch(...params).then(async response => {
                    try {
                        const originalData = await response.json();
                        const processedData = {
                            ...originalData, processed: true, timestamp: new Date().toISOString()
                        };
                        processedData.data.replies = handleComment(processedData.data.replies)
                        const newResponse = new Response(JSON.stringify(processedData), {
                            status: response.status, statusText: response.statusText, headers: {
                                'Content-Type': 'application/json',
                            }
                        });
                        return reslove(newResponse)
                    } catch (err) {
                        return reject(err)
                    }
                })
            })
        } else {
            return _fetch(...params)
        }
    }
})();