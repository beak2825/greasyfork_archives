// ==UserScript==
// @name         bilibili自动签到
// @description  bilibili自动签到 本脚本只支持ScriptCat使用,还在测试中,内测群:887697472
// @namespace    CodFrm
// @version      1.1.2
// @author       wyz
// @crontab * * once * *
// @grant GM_xmlhttpRequest
// @grant GM_notification
// @match http://localtion/undefind
// @connect api.bilibili.com
// @connect api.live.bilibili.com
// @supportURL   https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=370
// @homepage     https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=370
// @downloadURL https://update.greasyfork.org/scripts/427157/bilibili%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/427157/bilibili%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://api.bilibili.com/x/web-interface/nav',
        onload: function (xhr) {

            switch (xhr.response.code) {
                case 0:
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: 'https://api.live.bilibili.com/sign/doSign',
                        onload: function (xhr) {

                            switch (xhr.response.code) {
                                case 0:
                                    GM_notification('哔哩哔哩直播自动签到成功');
                                    break;
                                case 1011040:
                                    GM_notification({
                                        title: 'bilibili自动签到 - ScriptCat',
                                        text: '重复签到',
                                    });
                                    break;
                                default:
                            }
                            resolve('B站签到完成');

                        }
                    });
                    break;
                case -101:
                    GM_notification({
                        title: 'bilibili自动签到 - ScriptCat',
                        text: '哔哩哔哩签到失败,账号未登录,请先登录',
                    });
                    break;
                default:

            }

        },
        onerror: function () {
            GM_notification({
                title: 'bilibili自动签到 - ScriptCat',
                text: '网络错误,bilibili签到失败',
            });
            reject('网络错误,bilibili签到失败');
        }
    });

});


