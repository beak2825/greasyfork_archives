// ==UserScript==
// @name         VikACG 自动签到
// @description  打开 VikACG 主站时自动签到
// @namespace    http://tampermonkey.net/
// @version      0.2.6
// @author       Howard Wu
// @license      GPLv3
// @match        https://www.vikacg.com/
// @icon         http://vikacg.com/favicon.ico
// @grant GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/450966/VikACG%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/450966/VikACG%20%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

function getCookies(name) {
    function read(value) {
        if (value[0] === '"') {
            value = value.slice(1, -1)
        }
        return value.replace(/(%[\dA-F]{2})+/gi, decodeURIComponent)
    }
    if (typeof document === 'undefined' || (arguments.length && !name)) {
        return
    }

    // To prevent the for loop in the first place assign an empty array
    // in case there are no cookies at all.
    var cookies = document.cookie ? document.cookie.split('; ') : []
    var jar = {}
    for (var i = 0; i < cookies.length; i++) {
        var parts = cookies[i].split('=')
        var value = parts.slice(1).join('=')

        try {
            var found = decodeURIComponent(parts[0])
            jar[found] = read(value, found)

            if (name === found) {
                break
            }
        } catch (e) { }
    }

    return name ? jar[name] : jar
}

(function () {
    'use strict';
    var b2_token = getCookies('b2_token')
    GM_xmlhttpRequest({
        "url": "https://www.vikacg.com/wp-json/b2/v1/getUserMission",
        "headers": {
            "accept": "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9",
            "authorization": "Bearer " + b2_token,
            "cache-control": "no-cache",
            "content-type": "application/x-www-form-urlencoded",
            "pragma": "no-cache",
            "sec-ch-ua": "\"Microsoft Edge\";v=\"105\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"105\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin"
        },
        "referrer": "https://www.vikacg.com/mission/today",
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "count=0&paged=1",
        "method": "POST",
        "mode": "cors",
        "credentials": "include",
        "onload": function (result) {
            if (result.status == 200) {
                const json = JSON.parse(result.response)
                var data = json.mission
                var checkinDate = data.date
                var checkGetMission = data.credit
                var my_credit = data.my_credit
                var always = data.always
                if (checkGetMission == 0) {
                    console.log("目前积分：" + my_credit)
                    GM_xmlhttpRequest({
                        "url": "https://www.vikacg.com/wp-json/b2/v1/userMission",
                        "headers": {
                            "accept": "application/json, text/plain, */*",
                            "accept-language": "zh-CN,zh;q=0.9",
                            "authorization": 'Bearer ' + b2_token,
                            "cache-control": "no-cache",
                            "pragma": "no-cache",
                            "sec-ch-ua": "\"Microsoft Edge\";v=\"105\", \" Not;A Brand\";v=\"99\", \"Chromium\";v=\"105\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-origin"
                        },
                        "referrer": "https://www.vikacg.com/mission/today",
                        "referrerPolicy": "strict-origin-when-cross-origin",
                        "body": null,
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include",
                        "onload": function (result) {
                            if (result.status == 200) {
                                const json = JSON.parse(result.response)
                                var date = json.date
                                var credit = json.credit
                                var my_credit = json.mission.my_credit
                                console.log(date + " 签到成功，获得积分：" + credit + " 目前积分：" + my_credit + " 请查看积分是否有变动");
                            } else {
                                console.log("签到失败");
                            }
                        },
                    });
                } else {
                    console.log("签到时间：" + checkinDate + "，签到获得积分：" + checkGetMission + "，目前积分：" + my_credit)
                    console.log("今天已经签到，如有问题请尝试手动签到");
                }
            } else {
                console.log("请求失败，是否未登录？");
            }
        },
    });
})();
