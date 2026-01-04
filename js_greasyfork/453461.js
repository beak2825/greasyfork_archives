// ==UserScript==
// @name         小鹅通圈子图片批量下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  获取小鹅通圈子的所有资源图片（默认pageSize999）F12打开控制台，最终的所有资源会输出到控制台，直接复制以后利用第三方工具下载，比如IDM
// @author       Dulk
// @license      MIT
// @match        *://quanzi.xiaoe-tech.com/*/feed_list?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xiaoe-tech.com
// @grant        none
// @require      https://unpkg.com/axios/dist/axios.min.js
// @downloadURL https://update.greasyfork.org/scripts/453461/%E5%B0%8F%E9%B9%85%E9%80%9A%E5%9C%88%E5%AD%90%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/453461/%E5%B0%8F%E9%B9%85%E9%80%9A%E5%9C%88%E5%AD%90%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/*
小鹅通的圈子图片批量下载
油猴脚本
F12打开控制台，最终的所有资源会输出到控制台
直接复制以后利用第三方工具下载，比如IDM
 */
(function () {
    const btn = document.createElement('input');
    btn.type = 'button';
    btn.value = '点击显示资源';
    btn.style.position = 'fixed';
    btn.style.left = '20px';
    btn.style.top = '100px';
    btn.style.zIndex = 999;
    btn.addEventListener('click', function () {
        const app_id = getAppId();
        const community_id = getCommunityId();

        axios.defaults.headers.common['agent-type'] = 'pc';
        axios.defaults.headers.common['app_id'] = app_id;

        const api = `https://quanzi.xiaoe-tech.com/xe.community.community_service/small_community/xe.community/get_feeds_list/1.1.0`
        const params = {
            app_id: app_id,
            community_id: community_id,
            feeds_list_type: -1,
            order_filed: 'created_at',
            hide_exercise: '1',
            page: 1,
            page_size: 999
        }
        axios.defaults.withCredentials = true;
        axios.get(api, {
            params: params
        }).then(response => {
            const data = response.data.data.list;
            const arr = [];
            data.forEach(i => {
                if (i.content && i.content.mix_records) {
                    i.content.mix_records.forEach(r => {
                        if (r.type = 'IMAGE') {
                            arr.push(r.url);
                        }
                    });
                }
            });
            let str = '';
            arr.forEach(i => {
                str += i + '\n';
            })
            console.log(str);
        })
    });
    document.body.appendChild(btn);
})();


function getAppId() {
    const name = 'app_id';
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg); //获取url中"?"符后的字符串并正则匹配
    let context = "";
    if (r != null)
        context = r[2];
    reg = null;
    r = null;
    return context == null || context == "" || context == "undefined" ? "" : context;
}

function getCommunityId() {
    return window.location.pathname.split('/')[1];
}