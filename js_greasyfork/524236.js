// ==UserScript==
// @name         看雪
// @namespace    http://tampermonkey.net/
// @description  自动点赞，自动刷新token
// @version      0.1
// @author       hua
// @match        https://bbs.kanxue.com/thread*
// @connect      gcore.jsdelivr.net
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @require      https://gcore.jsdelivr.net/gh/wuhua111/monkeyApi@d1d80b0f4b066374534f6ea83cfb6162ca6befd6/quicklymodel.module.1.0.4.js
// @run-at       document-start
// @noframes
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524236/%E7%9C%8B%E9%9B%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/524236/%E7%9C%8B%E9%9B%AA.meta.js
// ==/UserScript==

const api = new QuicklyModelCore({
    dev: true,
});
const logger = new api.utils.Logger({ moduleName: '看雪' });
const $ = api.dom.query.$;
const $$ = api.dom.query.$$;
const defaultGolds = 1;
const defaultComments = '感谢你的积极参与，期待更多精彩内容！';

(function () {
    main();

    function main() {
        let autoFreshTokenInterval = null;
        api.event.domContentLoaded.subscribe(() => {
            api.dom.waitElement(unsafeWindow.document.body, () => {
                return $('.icon.icon-lock');
            }, {
                timeout: 5000,
                type: 'none'
            }).then(() => {
                autoLike();
            });
        });
        autoFreshTokenInterval = setInterval(() => {
            autoFreshToken();
        }, 1000 * 60 * 10);
    }

    function autoFreshToken() {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    const match = xmlhttp.responseText.match(/<meta name="csrf-token" content="([^"]+)"/);
                    if (match && match[1]) {
                        const new_csrftoken = match[1];
                        unsafeWindow.jQuery('meta[name="csrf-token"]').attr('content', new_csrftoken);
                        logger.info('刷新csrf-token成功', new_csrftoken);
                    } else {
                        logger.error('未找到csrf-token');
                    }
                } else {
                    logger.error('刷新csrf-token失败');
                }
            }
        };

        xmlhttp.open("GET", unsafeWindow.location.href, false);
        xmlhttp.send();
    }


    function autoLike() {
        const url = 'https://bbs.kanxue.com/thumbs_up-thumbs.htm';
        const headers = {
            'Accept': 'text/plain, */*; q=0.01',
            'Accept-Language': 'zh-CN,zh;q=0.9',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        };

        // 获取csrf-token
        const csrfToken = unsafeWindow.jQuery('meta[name="csrf-token"]').attr('content');
        if (!csrfToken) {
            logger.error('未找到csrf-token');
            return;
        }
        // https://bbs.kanxue.com/thread-285243.htm
        const threadId = unsafeWindow.location.href.split('-')[1].split('.')[0];
        if (!threadId) {
            logger.error('未找到threadId');
            return;
        }
        const data = new URLSearchParams({
            'threadid': threadId,
            'type': '1',
            'page': '1',
            'golds': defaultGolds,
            'comments': defaultComments,
            'csrf_token': csrfToken
        });

        const xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);

        // 设置请求头
        Object.entries(headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
        });

        xhr.withCredentials = true;

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                logger.info('点赞成功');
                unsafeWindow.location.reload();
            } else {
                logger.error('点赞失败:', xhr.status, xhr.statusText);
            }
        };

        xhr.onerror = function () {
            logger.error('点赞请求失败');
        };

        xhr.send(data.toString());
    }
})();



