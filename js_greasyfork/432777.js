// ==UserScript==
// @name         米游社-后台原神签到
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.2.1
// @description  后台签到原神，需要先登录https://bbs.mihoyo.com/ys/，不用再打开浏览器啦，代码已经原作者允许
// @author       王一之
// @crontab      * 1-23 once * *
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_cookie
// @match        undefind
// @connect      api-takumi.mihoyo.com
// @connect      mihoyo.com
// @require      https://cdn.jsdelivr.net/npm/js-md5@0.7.3/build/md5.min.js
// @license MIT
// @original-script https://greasyfork.org/zh-CN/scripts/432059
// @original-author 苏芣苡
// @original-license MIT
// @original-script https://greasyfork.org/zh-CN/scripts/448880
// @original-author asadahimeka
// @original-license MIT
// @downloadURL https://update.greasyfork.org/scripts/432777/%E7%B1%B3%E6%B8%B8%E7%A4%BE-%E5%90%8E%E5%8F%B0%E5%8E%9F%E7%A5%9E%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/432777/%E7%B1%B3%E6%B8%B8%E7%A4%BE-%E5%90%8E%E5%8F%B0%E5%8E%9F%E7%A5%9E%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

function Rn(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}
/*!
 * Forked from https://greasyfork.org/zh-CN/scripts/448880
 * Copyright © asadahimeka
 * License MIT
 */
const APP_VERSION = "2.33.1";
const CLIENT_TYPE = "4";
const USER_AGENT = `Mozilla/5.0 (iPhone; CPU iPhone OS 14_0_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) miHoYoBBS/${APP_VERSION}`;
const REFERER = "https://webstatic.mihoyo.com/bbs/event/signin-ys/index.html?bbs_auth_required=true&act_id=e202009291139501&utm_source=bbs&utm_medium=mys&utm_campaign=icon";
const HOST = "api-takumi.mihoyo.com";
const GET_ROLE_URL = "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn";
const SIGN_URL = "https://api-takumi.mihoyo.com/event/bbs_sign_reward/sign";
const DEVICE_ID = "7ab3bc70b846186b9da1e816e6c6f08d";
function getDS() {
    const s = "1OUn34iIy84ypu9cpXyun2VaQ2zuFeLm";
    const t = Math.floor(Date.now() / 1e3);
    const r = Math.random().toString(36).slice(-6);
    const c = `salt=${s}&t=${t}&r=${r}`;
    const ds = `${t},${r},${md5(c)}`;
    return ds;
}
function getHeaders() {
    return {
        "User-Agent": USER_AGENT,
        "Referer": REFERER,
        "Host": HOST,
        "DS": getDS(),
        "x-rpc-app_version": APP_VERSION,
        "x-rpc-client_type": CLIENT_TYPE,
        "x-rpc-device_id": DEVICE_ID,
    };
}

var mpid = [9873884]
for (var i = 0; i < 30; i++) {
    mpid.push(Rn(6000000, 9870000))
}

return new Promise((resolve, reject) => {
    GM_cookie("list", {
        domain: ".mihoyo.com",
        name: "cookie_token",
    }, (cookie) => {
        if (cookie.length == 0) {
            GM_notification({
                title: "[米游社 原神签到]\未找到cookie_token，请尝试重新登录",
                text: "点击前往登录！",
                ondone: () => { window.open(ysurl) },
            })
            reject('未找到cookie_token，请尝试重新登录');
            return
        }
        GM_xmlhttpRequest({
            url: "https://api-takumi.mihoyo.com/binding/api/getUserGameRolesByCookie?game_biz=hk4e_cn",
            method: "GET",
            onload: function (xhr) {
                var json = JSON.parse(xhr.responseText)
                if (json.retcode !== 0) {
                    if (ysweb < 0) {
                        GM_notification({
                            title: "[米游社 原神签到]\n帐号未登录！",
                            text: "点击前往登录！",
                            ondone: () => { window.open(ysurl) },
                        })
                    } else {
                        GM_notification({
                            title: "[米游社 原神签到]\n帐号未登录！",
                            text: "请登录帐号！",
                        })
                    }
                    reject('请登录帐号！');
                    return;
                }
                var list = json.data.list
                let n = 0;
                for (var i in list) {
                    uid = json.data.list[i].game_uid
                    region = json.data.list[i].region
                    region_name = json.data.list[i].region_name
                    nickname = json.data.list[i].nickname
                    level = json.data.list[i].level
                    data = '{"act_id":"e202009291139501","region":"' + region + '","uid":"' + uid + '"}'

                    GM_xmlhttpRequest({
                        url: 'https://api-takumi.mihoyo.com/event/bbs_sign_reward/sign',
                        method: 'POST',
                        data: data,
                        headers: getHeaders(),
                        onload: function (xhr) {
                            var json = JSON.parse(xhr.responseText)
                            message = json.message
                            if (message == "OK") {
                                message = "今日打卡完成！"
                            }
                            var tips = '【' + region_name + '】[ Lv : ' + level + ']<br>[UID : ' + uid + ']【' + nickname + '】<br>' + message
                            GM_notification({
                                title: "[米游社 原神签到]\n签到成功！！",
                                text: tips,
                            });
                            n++;
                            if (n == list.length) {
                                resolve(tips);
                            }
                        }, onerror() {
                            GM_notification({
                                title: "原神签到失败",
                                text: "网络错误,签到失败"
                            });
                            reject("网络错误");
                        }
                    })
                }
            }, onerror() {
                GM_notification({
                    title: "原神签到失败",
                    text: "网络错误,签到失败"
                });
                reject("网络错误");
            }
        });
    });
});
