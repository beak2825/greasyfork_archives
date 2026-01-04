// ==UserScript==
// @name         Bilibili 自定义表情包
// @namespace    https://github.com/AS042971/bilibili-bobo
// @supportURL   https://github.com/AS042971/bilibili-bobo/issues
// @license      BSD-3
// @version      0.3.7
// @description  在 Bilibili 表情包中增加自定义表情
// @author       as042971
// @author       milkiq
// @match        https://*.bilibili.com/*
// @exclude      https://live.bilibili.com/*
// @icon         https://experiments.sparanoid.net/favicons/v2/www.bilibili.com.ico
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @connect      git.asf.ink
// @connect      gitee.com
// @connect      api.bilibili.com
// @connect      i0.hdslb.com
// @downloadURL https://update.greasyfork.org/scripts/448521/Bilibili%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%A8%E6%83%85%E5%8C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/448521/Bilibili%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%A1%A8%E6%83%85%E5%8C%85.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    // 使用沙盒模式只能自己穿透注入xhook，否则xhook无法初始化
    let xhookLoad = new Promise(resolve => {
        if (!unsafeWindow.xhook) {
            const xhookScriptEl = unsafeWindow.document.createElement('script');
            xhookScriptEl.type = 'text/javascript';
            xhookScriptEl.src = 'https://unpkg.com/xhook@1.4.9/dist/xhook.min.js';

            // script 标签加载完成后添加钩子
            xhookScriptEl.onload = () => {
                resolve();
            }
            unsafeWindow.document.head.appendChild(xhookScriptEl);
        } else {
            // 如果其他插件注入了脚本就不用自己插入了
            resolve();
        }
    });

    const animateArr = GM_getValue('like_icons', []);
    if (animateArr.length > 0) {
      let times = 0;
      let timer = setInterval(() => {
        let data = unsafeWindow.__INITIAL_STATE__;
        if (data || times > 50) {
            if (data && !data.videoData.user_garb.url_image_ani_cut) data.videoData.user_garb.url_image_ani_cut = animateArr[0];
            clearInterval(timer);
        }
        times++;
      }, 100);
    }

    // 下载url中的表情包并解析
    let resolveEmoteURL = function(url){
        return new Promise(resolve => {
            GM_xmlhttpRequest({
                url: url,
                method : "GET",
                onload : function(data){
                    try {
                        let json = JSON.parse(data.responseText);
                        if (json.data?.packages) {
                            resolve(json.data.packages)
                        } else if ('emote' in json.data) {
                            resolve([json.data])
                        } else {
                            resolve([]);
                        }
                    } catch (error) {
                        resolve([]);
                    }
                },
                onerror : function(err) {
                    resolve([]);
                }
            });
        });
    };
    let getReplyItem = function(resolved_emote) {
        return {
            "id": resolved_emote.id,
            "package_id": resolved_emote.package_id,
            "state": 0,
            "type": 3,
            "attr": 0,
            "text": resolved_emote.text,
            "url": resolved_emote.url,
            "meta": {
                "size": 2
            },
            "mtime": resolved_emote.mtime,
            "jump_title": resolved_emote.meta.alias
        }
    }
    let refreshEmote = async function(urls) {
        let resolved_emote_packs = [];
        for (let i in urls) {
            if (urls[i].trim()) {
                let packs = await resolveEmoteURL(urls[i]);
                resolved_emote_packs = resolved_emote_packs.concat(packs);
            }
        }
        let emote_dict = {}
        let chn_emote_dict = {}
        resolved_emote_packs.forEach(function (pack) {
            pack.emote.forEach(function(emote) {
                let key = emote.text;
                let chn_key = key.replace('[','【').replace(']','】');
                let reply_item = getReplyItem(emote);
                emote_dict[key] = reply_item;
                chn_emote_dict[chn_key] = reply_item;
            })
        });
        GM_setValue('resolved_emote_packs', resolved_emote_packs);
        GM_setValue('emote_dict', emote_dict);
        GM_setValue('chn_emote_dict', chn_emote_dict);
    }

    // 表情配置面板
    let createEmotePanel = function() {
        let boboListUpdating = false;
        const wrapperEl = document.createElement('div');
        wrapperEl.setAttribute('id', 'bobo-emotes-settings-dialog-wrapper');
        wrapperEl.setAttribute('style', 'width: 100%;height: 100%;position:fixed;top: 0;left: 0;background: rgba(0,0,0,0.5);z-index: 10000;justify-content: center;align-items: center;display: flex;');
        wrapperEl.innerHTML = `
            <div id="bobo-emotes-settings-dialog-body" style="width: 400px;height: 500px;background: #fff;border-radius:10px;padding: 30px;overflow: auto;">
              <div>点赞动画（<a href="https://gitee.com/milkiq/bilibili-like-icons" target="_blank" style="color: blue;">获取…</a>）：</div>
              <textarea name="input" id="bobo-like-icon-url-input" rows="10" style="width:100%;height: 100px;" wrap="off" placeholder="请在此输入svga动画文件地址，每行一个"></textarea>
              <div id="bobo-like-icon-text">随机使用订阅的动画</div>
              <button id="bobo-like-icon-update">更新订阅</button>
              <hr/>
              <div>附加表情（<a href="https://gitee.com/milkiq/bili-emotes" target="_blank" style="color: blue;">获取…</a>）：</div>
              <textarea name="input" id="bobo-emotes-url-input" rows="10" style="width:100%;" wrap="off" placeholder="请在此输入附加表情的订阅地址，每行一个"></textarea>
              <div id="bobo-emotes-update-text"></div>
              <button id="bobo-emotes-update-likes">更新订阅</button>
              <button id="bobo-emotes-setting-cancel" style="float: right;">退出设置</button>
            </div>
        `;
        unsafeWindow.document.body.appendChild(wrapperEl);
        let updateBtn = unsafeWindow.document.getElementById('bobo-emotes-update-likes');
        let updateIconBtn = unsafeWindow.document.getElementById('bobo-like-icon-update');
        let cancelBtn = unsafeWindow.document.getElementById('bobo-emotes-setting-cancel');
        let urlBox = unsafeWindow.document.getElementById('bobo-emotes-url-input');
        let iconUrlBox = unsafeWindow.document.getElementById('bobo-like-icon-url-input');
        let emoteURLs = GM_getValue('emote_urls', [])
        let likeIconList = GM_getValue('like_icons', []);
        let lastUpdate = GM_getValue('last_update', 0)
        let el = unsafeWindow.document.getElementById('bobo-emotes-update-text');
        let likeIconText = unsafeWindow.document.getElementById('bobo-like-icon-text');
        urlBox.value = emoteURLs.join('\n');
        iconUrlBox.value = likeIconList.join('\n');
        el.innerText = '上次更新时间：' + ((lastUpdate)? lastUpdate : '从未更新');
        updateBtn.addEventListener('click', async () => {
            boboListUpdating = true;
            el.innerText = '正在更新订阅，请稍等…';
            let urls = urlBox.value.split(/\n+/);
            GM_setValue('emote_urls', urls);
            await refreshEmote(urls);
            el.innerText = '更新订阅成功，请刷新网页后使用！';
            GM_setValue('last_update', Date());
            boboListUpdating = false;
        });
        updateIconBtn.addEventListener('click', async () => {
            let urls = iconUrlBox.value.split(/\n+/);
            urls = urls.map(url => url.trim()).filter(url => !!url);
            GM_setValue('like_icons', urls);
            likeIconText.innerText = `已更新订阅，使用${urls.length}个动画`;
        });
        unsafeWindow.document.getElementById('bobo-emotes-setting-cancel').addEventListener('click', () => {
            if (boboListUpdating) {
                alert('正在更新中，请勿退出，关闭页面会导致更新失败');
                return;
            }
            wrapperEl.remove();
        });
    }
    let createEmoteBtn = function() {
        // 将配置按钮添加到头像弹出面板
        let linkItem = unsafeWindow.document.querySelector('.links-item');
        if (linkItem && !linkItem.classList.contains('contains-setting')){
            const settingBtnEl = unsafeWindow.document.createElement("div");

            settingBtnEl.innerHTML = `
<div class="single-link-item">
  <div class="link-title"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"
      class="link-icon">
      <rect opacity="0.01" width="18" height="18" fill="#C4C4C4"></rect>
      <path fill-rule="evenodd" clip-rule="evenodd"
        d="M12.3995 0.75H4.04147C2.91872 0.75 1.99997 1.6695 1.99997 2.79225V15.2078C1.99997 16.3305 2.91872 17.25 4.04147 17.25H12.5067C14.5655 17.25 16.25 15.5655 16.25 13.5068V4.6005C16.25 2.48325 14.5167 0.75 12.3995 0.75ZM12.3995 2.25469C13.6962 2.25469 14.75 3.30844 14.75 4.60519V13.5114C14.75 14.7482 13.7435 15.7547 12.5067 15.7547H4.04146C3.74821 15.7547 3.49996 15.5064 3.49996 15.2124V2.79694C3.49996 2.50294 3.74821 2.25469 4.04146 2.25469H12.3995Z"
        fill="var(--text2)"></path>
      <path fill-rule="evenodd" clip-rule="evenodd"
        d="M9.02925 0.75H5.4705C5.21025 0.75 4.9995 0.98475 4.9995 1.27425V7.5435C4.9995 7.842 5.21925 8.0685 5.46975 8.0685C5.5185 8.0685 5.5695 8.0595 5.61975 8.04075L7.101 7.49025C7.149 7.47225 7.2 7.46325 7.2495 7.46325C7.29975 7.46325 7.35075 7.47225 7.39875 7.49025L8.88 8.04075C8.93025 8.0595 8.98125 8.0685 9.03 8.0685C9.27975 8.0685 9.4995 7.842 9.4995 7.5435V1.27425C9.4995 0.98475 9.2895 0.75 9.02925 0.75ZM7.99946 2.25469V6.11794L7.92071 6.08869C7.70471 6.00919 7.47971 5.96794 7.24946 5.96794C7.01996 5.96794 6.79496 6.00919 6.57896 6.08869L6.49946 6.11794V2.25469H7.99946Z"
        fill="var(--text2)"></path>
    </svg><span>附加表情</span></div><svg width="10" height="10" viewBox="0 0 9 9" fill="none"
    xmlns="http://www.w3.org/2000/svg" class="link-icon--right">
    <path fill-rule="evenodd" clip-rule="evenodd"
      d="M7.50588 3.40623C7.40825 3.3086 7.24996 3.3086 7.15232 3.40623L4.41244 6.14612L1.67255 3.40623C1.57491 3.3086 1.41662 3.3086 1.31899 3.40623C1.22136 3.50386 1.22136 3.66215 1.31899 3.75978L4.11781 6.5586C4.28053 6.72132 4.54434 6.72132 4.70706 6.5586L7.50588 3.75978C7.60351 3.66215 7.60351 3.50386 7.50588 3.40623Z"
      fill="currentColor"></path>
    <path
      d="M7.15232 3.40623L7.50588 3.75978L7.50588 3.75978L7.15232 3.40623ZM7.50588 3.40623L7.15232 3.75978L7.15233 3.75978L7.50588 3.40623ZM4.41244 6.14612L4.05888 6.49967C4.15265 6.59344 4.27983 6.64612 4.41244 6.64612C4.54504 6.64612 4.67222 6.59344 4.76599 6.49967L4.41244 6.14612ZM1.67255 3.40623L2.0261 3.05268L2.0261 3.05268L1.67255 3.40623ZM1.31899 3.40623L0.965439 3.05268L0.965439 3.05268L1.31899 3.40623ZM1.31899 3.75978L1.67255 3.40623V3.40623L1.31899 3.75978ZM4.11781 6.5586L3.76425 6.91215L4.11781 6.5586ZM4.70706 6.5586L4.35351 6.20505L4.70706 6.5586ZM7.50588 3.75978L7.15233 3.40623L7.15232 3.40623L7.50588 3.75978ZM7.50588 3.75978C7.40825 3.85742 7.24996 3.85742 7.15232 3.75978L7.85943 3.05268C7.56654 2.75978 7.09166 2.75978 6.79877 3.05268L7.50588 3.75978ZM4.76599 6.49967L7.50588 3.75978L6.79877 3.05268L4.05888 5.79257L4.76599 6.49967ZM1.31899 3.75978L4.05888 6.49967L4.76599 5.79257L2.0261 3.05268L1.31899 3.75978ZM1.67254 3.75979C1.57491 3.85742 1.41662 3.85742 1.31899 3.75979L2.0261 3.05268C1.73321 2.75978 1.25833 2.75978 0.965439 3.05268L1.67254 3.75979ZM1.67255 3.40623C1.77018 3.50386 1.77018 3.66215 1.67255 3.75978L0.965439 3.05268C0.672546 3.34557 0.672546 3.82044 0.965439 4.11334L1.67255 3.40623ZM4.47136 6.20505L1.67255 3.40623L0.965439 4.11334L3.76425 6.91215L4.47136 6.20505ZM4.35351 6.20505C4.38605 6.1725 4.43882 6.1725 4.47136 6.20505L3.76425 6.91215C4.12223 7.27013 4.70264 7.27013 5.06062 6.91215L4.35351 6.20505ZM7.15232 3.40623L4.35351 6.20505L5.06062 6.91215L7.85943 4.11334L7.15232 3.40623ZM7.15233 3.75978C7.05469 3.66215 7.05469 3.50386 7.15233 3.40623L7.85943 4.11334C8.15233 3.82045 8.15233 3.34557 7.85943 3.05268L7.15233 3.75978Z"
      fill="currentColor"></path>
  </svg>
</div>
      `;
            settingBtnEl.addEventListener('click', () => {
                createEmotePanel();
            });
            linkItem.appendChild(settingBtnEl);
            linkItem.classList.add('contains-setting');
        }
    }

    // 注入动态和评论
    let injectDynamicItem = function(item, emote_dict, chn_emote_dict) {
        const animateArr = GM_getValue('like_icons', []);
        if (animateArr.length > 0 && item?.basic?.like_icon && !item.basic.like_icon.action_url) {
            item.basic.like_icon.action_url = animateArr[0];
        }
        let nodes = item?.modules?.module_dynamic?.desc?.rich_text_nodes;
        if (nodes) {
            for (let i = 0; i < nodes.length; i++) {
                // 处理【】的问题
                if (nodes[i]?.text && nodes[i].text.includes('【')) {
                    let splitResult = nodes[i].text.split(/(【.+?】)/g).filter(str=>{return str != ""});
                    nodes.splice(i,1)
                    for (let idx in splitResult) {
                        if (splitResult[idx] in chn_emote_dict) {
                            let replace = chn_emote_dict[splitResult[idx]];
                            let node = {
                                "orig_text": replace.text,
                                "text": replace.text,
                                "type": "RICH_TEXT_NODE_TYPE_EMOJI",
                                "emoji": {
                                    "icon_url": replace.url,
                                    "size": 2,
                                    "text": replace.text,
                                    "type": 3
                                }
                            }
                            nodes.splice(i,0,node);
                            i++;
                        } else {
                            let node = {
                                "orig_text": splitResult[idx],
                                "text": splitResult[idx],
                                "type": "RICH_TEXT_NODE_TYPE_TEXT"
                            }
                            nodes.splice(i,0,node);
                            i++;
                        }
                    }
                } else if (nodes[i].text in emote_dict) {
                    nodes[i].type = 'RICH_TEXT_NODE_TYPE_EMOJI'
                    nodes[i].emoji = {
                        "icon_url": emote_dict[nodes[i].text].url,
                        "size": 2,
                        "text": nodes[i].text,
                        "type": 3
                    }
                }
            }
        }
        if (item?.orig) {
            injectDynamicItem(item.orig, emote_dict, chn_emote_dict);
        }
    }
    let injectReplyItem = function(item, chn_emote_dict) {
        if (!item) return;

        if (item?.content?.message?.includes('【')) {
            if (!('emote' in item.content)) {
                item.content.emote = {};
            }
            for (let emote_name in chn_emote_dict) {
                if (item.content.message.includes(emote_name)) {
                    let replace = chn_emote_dict[emote_name];
                    item.content.message = item.content.message.replace(new RegExp(emote_name,"gm"), " " + replace.text);
                    item.content.emote[replace.text] = replace;
                }
            }
        }
        if ('replies' in item && item.replies) {
            for (let idx in item.replies) {
                injectReplyItem(item.replies[idx], chn_emote_dict);
            }
        }
    }

    // 页面加载完成后添加表情配置面板按钮
    unsafeWindow.addEventListener('DOMContentLoaded', () => {
        let vPoperMutation = new MutationObserver(async (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) continue;
                for (const node of mutation.addedNodes) {
                    if(node.classList?.contains('v-popover') && node.classList?.contains('is-bottom')) {
                        createEmoteBtn();
                        vPoperMutation.disconnect();
                    }
                }
            }
        });
        let emoteMutation = new MutationObserver(async (mutationList, observer) => {
            for (const mutation of mutationList) {
                if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) continue;
                for (const node of mutation.addedNodes) {
                    if(node.classList?.contains('right-entry')) {
                        vPoperMutation.observe(node.childNodes[0], { childList: true, subtree: true });
                        emoteMutation.disconnect();
                    }
                }
            }
        });

        let entryNode = unsafeWindow.document.querySelector('.right-entry');
        if (entryNode) {
            vPoperMutation.observe(entryNode.childNodes[0], { childList: true, subtree: true });
        } else {
            emoteMutation.observe(unsafeWindow.document.body, { childList: true, subtree: true });
        }
    });

    // 添加XHR钩子，用于增加表情包和注入动态
    xhookLoad.then(async () => {
        // 动态直接通过 Hook XHR 响应完成
        const resolved_emote_packs = GM_getValue('resolved_emote_packs', [])
        const emote_dict = GM_getValue('emote_dict', {})
        const chn_emote_dict = GM_getValue('chn_emote_dict', {})

        const likeIcons = GM_getValue('like_icons', []);

        unsafeWindow.xhook.before(function(request, callback) {
            if(request.url.includes('//i0.hdslb.com/bfs/garb/item') && likeIcons.length > 0) {
                let animateNum = Math.floor(Math.random() * likeIcons.length);
                let url = likeIcons[animateNum];
                    GM_xmlhttpRequest({
                        url,
                        method : "GET",
                        responseType: "blob",
                        onload : function(data){
                          data.response.arrayBuffer()
                            .then(arr => {
                                callback({
                                  status: 200,
                                  statusText: '',
                                  data: arr,
                                  finalUrl: request.url
                                });
                            })
                        },
                        onerror : function(err) {
                          callback();
                        }
                    });
            } else {
              callback();
            }
        });

        unsafeWindow.xhook.after(function(request, response) {
            if (request.url.includes('//api.bilibili.com/x/emote/user/panel/web?business=reply')) {
                // 表情包面板
                let response_json = JSON.parse(response.text);
                response_json.data.packages = response_json.data.packages.concat(resolved_emote_packs);
                response.text = JSON.stringify(response_json);
            } else if (request.url.includes('//api.bilibili.com/x/polymer/web-dynamic/v1/detail')){
                // 动态详情页
                let response_json = JSON.parse(response.text);
                injectDynamicItem(response_json?.data?.item, emote_dict, chn_emote_dict);
                response.text = JSON.stringify(response_json);
            } else if (request.url.includes('//api.bilibili.com/x/polymer/web-dynamic/v1/feed/space') || request.url.includes('//api.bilibili.com/x/polymer/web-dynamic/v1/feed/all')) {
                // 主时间线和个人主页
                let response_json = JSON.parse(response.text);
                for (let i in response_json.data.items) {
                    injectDynamicItem(response_json.data.items[i], emote_dict, chn_emote_dict);
                }
                response.text = JSON.stringify(response_json);
            } else if (request.url.includes('//app.bilibili.com/x/topic/web/details/cards')) {
                // 话题页
                let response_json = JSON.parse(response.text);
                for (let i in response_json.data.topic_card_list.items) {
                    let item = response_json.data.topic_card_list.items[i]
                    if (item.topic_type == 'DYNAMIC') {
                        injectDynamicItem(item.dynamic_card_item, emote_dict, chn_emote_dict);
                    }
                }
                response.text = JSON.stringify(response_json);
            } else if (request.url.includes('//api.bilibili.com/x/v2/reply/main')) {
                // 手机网页用的是XHR...
                let response_json = JSON.parse(response.text);
                if (response_json.data.top_replies) {
                    for (let i in response_json.data.top_replies) {
                        injectReplyItem(response_json.data.top_replies[i], chn_emote_dict);
                    }
                }
                for (let i in response_json.data.replies) {
                    injectReplyItem(response_json.data.replies[i], chn_emote_dict);
                }
                response.text = JSON.stringify(response_json);
            } else if (request.url.includes('//api.bilibili.com/x/v2/reply/add')) {
                // 新增评论的 POST 接口，返回值中是处理过的评论内容
                // 拦截这个就可以新增后立刻显示表情包
                let response_json = JSON.parse(response.text);
                injectReplyItem(response_json.data.reply, chn_emote_dict);
                response.text = JSON.stringify(response_json);
            }
        });
    })

    // 添加jsonp钩子，评论数据使用jsonp方式获取，修改jquery的函数进行代理
    // jquery jsonp 原理见 https://www.cnblogs.com/aaronjs/p/3785646.html
    const jsonpMutation = new MutationObserver(async (mutationList, observer) => {
        const resolved_emote_packs = GM_getValue('resolved_emote_packs', [])
        const emote_dict = GM_getValue('emote_dict', {})
        const chn_emote_dict = GM_getValue('chn_emote_dict', {})

        for (const mutation of mutationList) {
            if (mutation.type !== 'childList' || mutation.addedNodes.length === 0) continue;

            for (const node of mutation.addedNodes) {
                if (node.localName !== 'script') continue;

                const src = node.src;
                if (src.includes('//api.bilibili.com')) {
                    const matchResult = src.match(/callback=(.*?)&/);
                    if (!matchResult) return;
                    const callbackName = matchResult[1];
                    const originFunc = unsafeWindow[callbackName];

                    unsafeWindow[callbackName] = (value) => {
                        if (src.includes('//api.bilibili.com/x/v2/reply')) {
                            for (let i in value.data.replies) {
                                injectReplyItem(value.data.replies[i], chn_emote_dict);
                            }
                            if (value.data.top_replies) {
                                for (let i in value.data.top_replies) {
                                    injectReplyItem(value.data.top_replies[i], chn_emote_dict);
                                }
                            }
                            if (value.data.top) {
                                injectReplyItem(value.data.top.upper, chn_emote_dict);
                            }
                            if (value.data.upper) {
                                injectReplyItem(value.data.upper.top, chn_emote_dict);
                            }
                        }

                        originFunc(value);
                    }
                }
            }
        }
    });
    jsonpMutation.observe(unsafeWindow.document.head, { childList: true, subtree: true });
 })();
