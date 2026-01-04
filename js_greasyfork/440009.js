// ==UserScript==
// @name         掘金签到和自动抽奖
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.2.2
// @description  每日掘金签到和自动抽奖
// @author       Wyz
// @crontab      * 1-23 once * *
// @grant GM_xmlhttpRequest
// @grant GM_notification
// @grant GM_getValue
// @connect api.juejin.cn
// @grant GM_xmlhttpRequest
// @require https://cdn.jsdelivr.net/npm/scriptcat-lib@1.1.3/dist/gm.js
// @definition https://cdn.jsdelivr.net/npm/scriptcat-lib@1.1.3/src/types/gm.d.ts
// @cloudCat
// @exportCookie domain=.juejin.cn
// @exportValue  掘金.aid,掘金.uuid,掘金._signature
// @match undefined
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/440009/%E6%8E%98%E9%87%91%E7%AD%BE%E5%88%B0%E5%92%8C%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/440009/%E6%8E%98%E9%87%91%E7%AD%BE%E5%88%B0%E5%92%8C%E8%87%AA%E5%8A%A8%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==

/* ==UserConfig==
掘金:
  aid:
    title: aid
    description: 请在签到页面上使用开发者工具抓取aid,可以搜索check_in_rules请求查看
  uuid:
    title: uuid
    description: 请在签到页面上使用开发者工具抓取aid,可以搜索check_in_rules请求查看
  _signature:
    title: _signature
    description: 请在签到页面上使用开发者工具抓取_signature,可以搜索check_in_rules请求查看
 ==/UserConfig== */

return new Promise(async (resolve) => {
    let aid = GM_getValue('aid');
    let uuid = GM_getValue('uuid');
    let _signature = GM_getValue('_signature');
    let client = gm.ajax.create({
        validateStatus(status) {
            return status < 500;
        }
    });
    try {
        let resp = await client.post(`https://api.juejin.cn/growth_api/v1/check_in?aid=${aid}&uuid=${uuid}&_signature=${_signature}`, { responseType: 'json' });
        let msg = '';
        if (resp.data.err_no === 0) {
            msg = '签到成功\n';
        } else {
            msg = '签到失败: ' + resp.data.err_msg + "\n";
        }
        resp = await client(`https://api.juejin.cn/growth_api/v1/lottery_config/get?aid=${aid}&uuid=${uuid}`, { responseType: 'json' });
        if (resp.data.err_no === 0) {
            if (resp.data.data.free_count === 1) {
                resp = await client.post(`https://api.juejin.cn/growth_api/v1/lottery/draw?aid=${aid}&uuid=${uuid}&_signature=${_signature}`, { responseType: 'json' });
                if (resp.data.err_no === 0) {
                    msg += "抽奖成功: " + resp.data.data.lottery_name;
                } else {
                    msg += "抽奖失败: " + resp.data.err_msg;
                }
            } else {
                msg += '无抽免费奖次数'
            }
        } else {
            msg += '获取失败: ' + resp.data.err_msg;
        }
        GM_notification(msg, '掘金签到和自动抽奖');
        resolve(msg);
    } catch (e) {
        console.log(e);
        GM_notification('网络错误,签到失败,请手动重试', '掘金签到和自动抽奖');
        resolve('签到失败');
    }
});
