// ==UserScript==
// @name         bilibili每月自动充电
// @namespace    BILIBILI-HELPER
// @description bilibili年度大会员每月自动领券然后自动给指定up充电
// @version      1.0.2
// @author       wyz
// @crontab * * * once *
// @grant GM_getValue
// @grant GM_xmlhttpRequest
// @grant GM_notification
// @grant GM_cookie
// @grant GM_log
// @require https://cdn.jsdelivr.net/npm/scriptcat-lib@1.0.4/dist/msg-push.js
// @definition https://cdn.jsdelivr.net/npm/scriptcat-lib@1.0.4/src/types/msg-push.d.ts
// @connect api.bilibili.com
// @connect pay.bilibili.com
// @match none
// @supportURL   https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=615
// @homepage     https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=615
// @downloadURL https://update.greasyfork.org/scripts/429234/bilibili%E6%AF%8F%E6%9C%88%E8%87%AA%E5%8A%A8%E5%85%85%E7%94%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/429234/bilibili%E6%AF%8F%E6%9C%88%E8%87%AA%E5%8A%A8%E5%85%85%E7%94%B5.meta.js
// ==/UserScript==

/* ==UserConfig==
基础配置:
  uid:
    title: 用户id
    description: 充电的用户id
    default: 
----
钉钉推送:
  token:
    title: token
    description: 钉钉推送token,webhook后面那一截
  secret:
    title: secret
    description: 钉钉推送密钥,不输入默认使用其他方式进行推送
 ==/UserConfig== */

const HELPER = "bilibili-helper";

let dingtoken = GM_getValue("钉钉推送.token");
let platform = [];
console.log(dingtoken);
if (dingtoken) {
    platform.push(new DingTalk(dingtoken, GM_getValue("钉钉推送.secret")));
}
let push = new MsgCenter(platform);

return new Promise((resolve, reject) => {
    let notice = async function (content) {
        GM_notification({
            title: HELPER,
            text: content
        });
        await push.pushMsg({
            type: "text",
            content: "bilibili-helper:" + content,
        });
        GM_log(content, "error");
        reject(content);
    }

    GM_cookie("list", {
        url: "https://api.bilibili.com/x/vip/privilege/receive",
        name: "bili_jct",
    }, (cookie) => {
        let csrf = "";
        let recharge = async function () {
            let uid = GM_getValue("基础配置.uid", "17047572");
            if(!uid){
                return notice("充电失败,请填写充电up主");
            }
            GM_xmlhttpRequest({
                url: "https://api.bilibili.com/x/ugcpay/web/v2/trade/elec/pay/quick",
                method: "POST",
                data: "bp_num=5&is_bp_remains_prior=true&up_mid=" + uid + "&otype=up&oid=" + uid + "&csrf=" + csrf,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Referer": "https://space.bilibili.com/" + uid,
                    "Origin": "https://www.bilibili.com"
                },
                async onload(xhr) {
                    let code = xhr.response.code || 'unknow';
                    let msg = xhr.response.message || 'unknow';
                    switch (xhr.response.code) {
                        case 0:
                            let content = "充电成功!"
                            GM_notification({
                                title: HELPER,
                                text: content
                            });
                            await push.pushMsg({
                                type: "text",
                                content: "bilibili-helper:" + content,
                            });
                            GM_log(content);
                            resolve();
                        default: {
                            notice("充电失败:" + xhr.status + " " + code + " " + msg);
                        }
                    }
                },
                onerror() {
                    notice("给up充电时网络错误");
                }
            });
        }

        if (cookie.length) {
            csrf = cookie[0].value;
            GM_xmlhttpRequest({
                url: "https://api.bilibili.com/x/vip/privilege/receive",
                method: "POST",
                data: "type=1&csrf=" + csrf,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Referer": "https://account.bilibili.com/account/big/myPackage",
                    "Origin": "https://www.bilibili.com"
                },
                onload(xhr) {
                    let code = xhr.response.code || 'unknow';
                    let msg = xhr.response.message || 'unknow';
                    switch (xhr.response.code) {
                        case 0:
                            GM_log("领券成功");
                            recharge();
                            break;
                        case -101:
                            notice("自动充电失败,账号未登录,请先登录");
                            break;
                        default:
                            if (xhr.status == 200) {
                                GM_log("领券未成功,查询是否有免费余额");
                                let time = new Date().getTime();
                                GM_xmlhttpRequest({
                                    url: "https://pay.bilibili.com/paywallet/wallet/getUserWallet",
                                    method: "POST",
                                    data: `{"platformType":3,"panelType":3,"traceId":` + time + `,"timestamp":` + time + `,"version":"1.0"}`,
                                    headers: {
                                        'Content-Type': 'application/json',
                                        "Referer": "https://pay.bilibili.com/pay-v2-web/bcoin_index",
                                        "Origin": "https://pay.bilibili.com"
                                    },
                                    onload(xhr) {
                                        let data = xhr.response.data;
                                        if (data) {
                                            if (data.couponBalance >= 5) {
                                                GM_log("余额查询成功,默认拿5B币去充电");
                                                recharge();
                                            } else {
                                                notice("余额(" + data.couponBalance + "B币)不足5B币,充电失败");
                                            }
                                        } else {
                                            notice("查询免费余额出错:" + xhr.status + " " + xhr.responseText);
                                        }
                                    },
                                    onerror() {
                                        notice("查询免费余额时网络出错");
                                    }
                                });
                            } else {
                                notice("领券失败:" + xhr.status + " " + code + " " + msg);
                            }
                    }
                },
                onerror() {
                    notice("领取每月赠送b券时网络错误");
                }
            });
        } else {
            notice("获取b站cookie失败,请确认是否在浏览器上登录");
        }
    });
});




