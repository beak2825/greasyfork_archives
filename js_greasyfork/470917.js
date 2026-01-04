// ==UserScript==
// @name         海角社区下车
// @namespace    http://tampermonkey.net/
// @version      0.41
// @description  海角社区视频/图片/封禁用户主页解析
// @author       hjhjhj
// @license      MIT
// @match        *://*.haijiao.com/*
// @include        *://hj*.com/*
// @include        *://hj*.top/*
// @match        *://*/post/details*
// @match        *://*/homepage*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @run-at      document-start
// @grant       unsafeWindow
// @grant        GM_xmlhttpRequest
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/470917/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E4%B8%8B%E8%BD%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/470917/%E6%B5%B7%E8%A7%92%E7%A4%BE%E5%8C%BA%E4%B8%8B%E8%BD%A6.meta.js
// ==/UserScript==
(function () {
    'use strict';
 
    function decode(s) {
        return atob(atob(atob(s)));
    }
 
    function encode(s) {
        return btoa(btoa(btoa(s)));
    }
 
    function jencode(s) {
        return encode(JSON.stringify(s, `utf-8`));
    }
 
    function get_real_m3u8_path(url) {
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        if (request.status !== 200) {
            console.log(`解析失败!`);
            return url;
        }
        let ts_path = request.responseText.split('\n')[6];
        let id = ts_path.match(/([\w_]+_?)[\d]+.ts/)[1];
        let rurl = url.replace(/([\w_]+).m3u8/, `${id}.m3u8`);
        return rurl;
    }
 
    function get_user_dict(host, id) {
        var url = `https://${host}/api/topic/node/topics?page=1&userId=${id}&type=0`;
        var request = new XMLHttpRequest();
        request.open('GET', url, false);
        request.send(null);
        if (request.status !== 200) {
            console.log(`用户信息解析失败!`);
            return {};
        }
        let p = JSON.parse(request.responseText, `utf-8`).data;
        p = JSON.parse(decode(p), `utf-8`);
        let total = p.page.total;
        let uid = `[banned]`;
        if (`results` in p) {
            uid = p.results[0].user.nickname + ` ` + uid;
        }
        return {
            'isFavorite': false,
            'likeCount': 12,
            'user': {
                'id': parseInt(id),
                'nickname': uid,
                'avatar': '29',
                'description': `hj community`,
                'topicCount': total,
                'videoCount': 0,
                'commentCount': 303,
                'fansCount': 57,
                'favoriteCount': 39,
                'status': 0,
                'sex': 1,
                'vip': 0,
                'vipExpiresTime': '0001-01-01 00:00:00',
                'certified': false,
                'certVideo': false,
                'certProfessor': false,
                'famous': false,
                'forbidden': false,
                'tags': null,
                'role': 0,
                'popularity': 10,
                'diamondConsume': 0,
                'title': { 'id': 0, 'name': '', 'consume': 0, 'consumeEnd': 0, 'icon': '' },
                'friendStatus': false,
                'voiceStatus': false,
                'videoStatus': false,
                'voiceMoneyType': 0,
                'voiceAmount': 0,
                'videoMoneyType': 0,
                'videoAmount': 0,
                'depositMoney': 0
            }
        }
    }
 
    function remove_vip(body) {
        body.node.vipLimit = 0;
        let attachments = body.attachments;
        let image_urls = [];
        let video_urls = ``;
        let has_video = -1;
        for (var i = 0; i < attachments.length; i++) {
            var atta = attachments[i];
            if (atta.category === 'images') {
                image_urls.push(`<img src="${atta.remoteUrl}" data-id="${atta.id}"/>`)
            }
            if (atta.category === 'video') {
                has_video = i;
            }
        }
        let images = image_urls.join();
        if (has_video >= 0) {
            let [nbody, v] = replace_m3u8(body, has_video);
            body = nbody;
            video_urls = `<video src="${v.remoteUrl}" data-id="${v.id}"/></video>`
        }
        let content = body.content.replace(/\[[图片视频]+\]?/, ``);
        content = body.content.replace(/此处内容售价.*?您还没有购买，请购买后查看！/, ``);
        content = '<html><head></head><body>' + content + '<br/>' + images + '<br/>' + video_urls + '<br/></body></html>';
        body.content = content;
        return body;
    }
 
    function replace_m3u8(body, has_video) {
        let attachments = body.attachments;
        let vidx = has_video;
        if (vidx < 0) {
            return [body, undefined];
        }
        if (body.sale === null || body.sale.money_type == 0) {
            return [body, attachments[vidx]];
        }
        let url = attachments[vidx].remoteUrl;
        let m3u8_path = get_real_m3u8_path(url);
        if (m3u8_path === undefined) {
            console.log('视频链接获取失败!');
            return [body, body.attachments[vidx]];
        }
        body.attachments[vidx].remoteUrl = m3u8_path;
        return [body, body.attachments[vidx]];
    }
 
    function replace_exist_img(body) {
        let content = body.content;
        let attachments = body.attachments;
        let all_img = {};
        let has_video = -1;
        for (var i = 0; i < attachments.length; i++) {
            var atta = attachments[i];
            if (atta.category === 'images') {
                all_img[atta.id] = atta.remoteUrl;
            }
            if (atta.category === 'video') {
                has_video = i;
                return [body, undefined, has_video];
            }
        }
        let re_img = /<img src=\"https:\/\/[\w\.\/]+?\/images\/.*?\" data-id=\"(\d+)\".*?\/>/g;
        for (let e of content.matchAll(re_img)) {
            let id = parseInt(e[1]);
            if (id in all_img) {
                // let nsrc = all_img[id];
                // let src = new RegExp(`(<img src=\")https:\/\/[\\w\.\/]+?\/images\/.*?\(" data-id=\"${id}\".*?\/>)`, 'g');
                // content = content.replace(src, `$1${nsrc}$2`);
                delete all_img[id];
            }
        }
        body.content = content;
        return [body, all_img, has_video];
    }
 
    function modify_data(data) {
        let body = JSON.parse(decode(data));
        if (body.node.vipLimit != 0) {
            body = remove_vip(body);
            return jencode(body);
        }
        let [nbody, rest_img, has_video] = replace_exist_img(body);
        body = nbody;
        // 已购买的帖子
        if (body.content.includes(`[/sell]`)) {
            return jencode(body);
        }
        if ('sale' in body && body.sale !== null) {
            body.sale.is_buy = true;
            body.sale.buy_index = parseInt(Math.random() * (5000 - 1000 + 1) + 1000, 10);
        }
        if (has_video >= 0) {
            let [nbody, v] = replace_m3u8(body, has_video);
            return jencode(nbody);
        }
        let img_elements = []
        for (const [id, src] of Object.entries(rest_img)) {
            img_elements.push(`<img src="${src}" data-id="${id}"/>`);
        }
        let selled_img = `[sell]` + img_elements.join() + `[/sell]`;
        let ncontent = body.content.replace(/<span class=\"sell-btn\".*<\/span>/, selled_img);
        body.content = ncontent;
        return jencode(body);
    }
 
    function modify_user(data, host, id) {
        if (data.errorCode === 0) {
            return data;
        }
        data.isEncrypted = true;
        data.errorCode = 0;
        data.success = true;
        data.message = "";
        let udict = get_user_dict(host, id);
        data.data = jencode(udict)
        return data
    }
 
    const originOpen = XMLHttpRequest.prototype.open;
    const re_topic = /\/api\/topic\/\d+/;
    const re_user = /\/api\/user\/info\/\d+/;
 
    XMLHttpRequest.prototype.open = function (_, url) {
        // 拦截topic
        if (re_topic.test(url)) {
            const xhr = this;
            const getter = Object.getOwnPropertyDescriptor(
                XMLHttpRequest.prototype,
                "response"
            ).get;
            Object.defineProperty(xhr, "responseText", {
                get: () => {
                    let result = getter.call(xhr);
                    try {
                        let res = JSON.parse(result, `utf-8`);
                        // 这里修改data
                        res.data = modify_data(res.data)
                        return JSON.stringify(res, `utf-8`);
                    } catch (e) {
                        console.log('发生异常! 解析失败!');
                        console.log(e);
                        return result;
                    }
                },
            });
        } else if (re_user.test(url)) {
            const xhr = this;
            const getter = Object.getOwnPropertyDescriptor(
                XMLHttpRequest.prototype,
                "response"
            ).get;
            Object.defineProperty(xhr, "responseText", {
                get: () => {
                    let result = getter.call(xhr);
                    try {
                        let res = JSON.parse(result, `utf-8`);
                        let furl = xhr.responseURL;
                        let r = furl.match(/\W*(\w+\.\w+)\/api\/user\/info\/(\d+)/);
                        // 这里修改data
                        let data = modify_user(res, r[1], r[2]);
                        return JSON.stringify(data, `utf-8`);
                    } catch (e) {
                        console.log('发生异常! 解析失败!');
                        console.log(e);
                        return result;
                    }
                },
            });
        }
        originOpen.apply(this, arguments);
    };
 
    let clicked_flag = false;
    
    document.addEventListener("DOMNodeInserted", function (event) {
        if (!clicked_flag) {
            for (const element of document.getElementsByClassName('el-message-box')) {
                if (element.innerText.indexOf('令牌已过期') > -1) {
                    clicked_flag = true;
                    let e = element.querySelector("div.el-message-box__header > button");
                    setTimeout((e) => { e.click(); }, 100, e);
                    break;
                }
            }
        }
        if (event.relatedNode.getAttribute('id') === 'tidio-chat') {
            var eles = document.getElementsByTagName('*');
            for (var i = 0; i < eles.length; i++) {
                eles[i].style.userSelect = 'text';
            }
        }
    }, false);
 
})();