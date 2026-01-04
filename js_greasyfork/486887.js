// ==UserScript==
// @name         翻译机
// @namespace    http://tampermonkey.net/
// @version      0.99
// @description  该脚本用于翻译各类常用社交网站为中文，不会经过中间服务器。
// @author       HolynnChen
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @match        *://*.youtube.com/*
// @match        *://*.facebook.com/*
// @match        *://*.reddit.com/*
// @match        *://*.5ch.net/*
// @match        *://*.discord.com/*
// @match        *://*.telegram.org/*
// @match        *://*.quora.com/*
// @match        *://*.tiktok.com/*
// @match        *://*.instagram.com/*
// @match        *://*.threads.net/*
// @match        *://*.github.com/*
// @match        *://*.bsky.app/*
// @connect      fanyi.baidu.com
// @connect      translate.google.com
// @connect      ifanyi.iciba.com
// @connect      www.bing.com
// @connect      fanyi.youdao.com
// @connect      dict.youdao.com
// @connect      m.youdao.com
// @connect      api.interpreter.caiyunai.com
// @connect      papago.naver.com
// @connect      fanyi.qq.com
// @connect      translate.alibaba.com
// @connect      www2.deepl.com
// @connect      transmart.qq.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @require      https://cdn.jsdelivr.net/npm/js-base64@3.7.4/base64.min.js
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @require      https://cdn.jsdelivr.net/gh/Tampermonkey/utils@3b32b826e84ccc99a0a3e3d8d6e5ce0fa9834f23/requires/gh_2215_make_GM_xhr_more_parallel_again.js
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/378277/%E7%BF%BB%E8%AF%91%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/378277/%E7%BF%BB%E8%AF%91%E6%9C%BA.meta.js
// ==/UserScript==


GM_registerMenuCommand('重置控制面板位置(刷新应用)', () => {
    GM_setValue('position_top', '9px');
    GM_setValue('position_right', '9px');
})

GM_registerMenuCommand('全局隐藏/展示悬浮球(刷新应用)', () => {
    GM_setValue('show_translate_ball', !GM_getValue('show_translate_ball',true));
})


const transdict = {
    '谷歌翻译': translate_gg,
    '谷歌翻译mobile': translate_ggm,
    '腾讯翻译': translate_tencent,
    '腾讯AI翻译': translate_tencentai,
    //'有道翻译':translate_youdao,
    '有道翻译mobile': translate_youdao_mobile,
    '百度翻译': translate_baidu,
    '彩云小译': translate_caiyun,
    '必应翻译': translate_biying,
    'Papago翻译': translate_papago,
    '阿里翻译': translate_alibaba,
    '爱词霸翻译': translate_icib,
    'Deepl翻译': translate_deepl,
    '关闭翻译': () => { }
};
const startup = {
    //'有道翻译':translate_youdao_startup,
    '腾讯翻译': translate_tencent_startup,
    '彩云小译': translate_caiyun_startup,
    'Papago翻译': translate_papago_startup
};
const baseoptions = {
    'enable_pass_lang': {
        declare: '不翻译中文(简体)',
        default_value: true,
        change_func: self => {
            if (self.checked) sessionStorage.clear()
        }
    },
    'enable_pass_lang_cht': {
        declare: '不翻译中文(繁体)',
        default_value: true,
        change_func: self => {
            if (self.checked) sessionStorage.clear()
        }
    },
    'remove_url': {
        declare: '自动过滤url',
        default_value: true,
    },
    'show_info': {
        declare: '显示翻译源',
        default_value: true,
        option_enable: true
    },
    'fullscrenn_hidden': {
        declare: '全屏时不显示',
        default_value: true,
    },
    'replace_translate': {
        declare: '替换式翻译',
        default_value: false,
        option_enable: true
    },
    'compress_storage':{
        declare: '压缩缓存',
        default_value: false,
    }
};

const [enable_pass_lang, enable_pass_lang_cht, remove_url, show_info, fullscrenn_hidden, replace_translate, compress_storage] = Object.keys(baseoptions).map(key => GM_getValue(key, baseoptions[key].default_value));

const globalProcessingSave = [];

const sessionStorage = compress_storage?CompressMergeSession(window.sessionStorage):window.sessionStorage;

const p = window.trustedTypes !== undefined ? window.trustedTypes.createPolicy('translator', { createHTML: (string, sink) => string }) : { createHTML: (string, sink) => string };

function initPanel() {
    let choice = GM_getValue('translate_choice', '谷歌翻译');
    let select = document.createElement("select");
    select.className = 'js_translate';
    select.style = 'height:35px;width:100px;background-color:#fff;border-radius:17.5px;text-align-last:center;color:#000000;margin:5px 0';
    select.onchange = () => {
        GM_setValue('translate_choice', select.value);
        title.innerText = "控制面板（请刷新以应用）"
    };
    for (let i in transdict) select.innerHTML = p.createHTML(select.innerHTML+'<option value="' + i + '">' + i + '</option>');
    //
    let enable_details = document.createElement('details');
    enable_details.innerHTML = p.createHTML(enable_details.innerHTML+"<summary>启用规则</summary>");
    for (let i of rules) {
        let temp = document.createElement('input');
        temp.type = 'checkbox';
        temp.name = i.name;
        if (GM_getValue("enable_rule:" + temp.name, true)) temp.setAttribute('checked', true)
        enable_details.appendChild(temp);
        enable_details.innerHTML = p.createHTML(enable_details.innerHTML+"<span>" + i.name + "</span><br>");
    }
    let current_details = document.createElement('details');
    let mask = document.createElement('div'), dialog = document.createElement("div"), js_dialog = document.createElement("div"), title = document.createElement('p');
    //
    let shadowRoot = document.createElement('div');
    shadowRoot.style = "position: absolute;visibility: hidden;";
    window.top.document.body.appendChild(shadowRoot);
    let shadow = shadowRoot.attachShadow({ mode: "closed" })
    shadow.appendChild(mask);
    //window.top.document.body.appendChild(shadow);
    dialog.appendChild(js_dialog);
    mask.appendChild(dialog);
    js_dialog.appendChild(title)
    js_dialog.appendChild(document.createElement('p').appendChild(select));
    js_dialog.appendChild(document.createElement('p').appendChild(enable_details));
    js_dialog.appendChild(document.createElement('p').appendChild(current_details));
    //
    mask.style = "display: none;position: fixed;height: 100vh;width: 100vw;z-index: 99999;top: 0;left: 0;overflow: hidden;background-color: rgba(0,0,0,0.4);justify-content: center;align-items: center;visibility: visible;"
    mask.addEventListener('click', event => { if (event.target === mask) mask.style.display = 'none' });
    dialog.style = 'padding:0;border-radius:10px;background-color: #fff;box-shadow: 0 0 5px 4px rgba(0,0,0,0.3);';
    js_dialog.style = "min-height:10vh;min-width:10vw;display:flex;flex-direction:column;align-items:center;padding:10px;border-radius:4px;color:#000";
    title.style = 'margin:5px 0;font-size:20px;';
    title.innerText = "控制面板";
    for (let i in baseoptions) {
        let temp = document.createElement('input'), temp_p = document.createElement('p');
        js_dialog.appendChild(temp_p);
        temp_p.appendChild(temp);
        temp.type = 'checkbox';
        temp.name = i;
        temp_p.style = "display:flex;align-items: center;margin:5px 0"
        temp_p.innerHTML = p.createHTML(temp_p.innerHTML+baseoptions[i].declare);
    }
    for (let i of js_dialog.querySelectorAll('input')) {
        if (i.name && baseoptions[i.name]) {
            i.onclick = _ => { title.innerText = "控制面板（请刷新以应用）"; GM_setValue(i.name, i.checked); if (baseoptions[i.name].change_func) baseoptions[i.name].change_func(i) }
            i.checked = GM_getValue(i.name, baseoptions[i.name].default_value)
        }
    };
    for (let i of enable_details.querySelectorAll('input')) i.onclick = _ => { title.innerText = "控制面板（请刷新以应用）"; GM_setValue('enable_rule:' + i.name, i.checked) }
    let open = document.createElement('div');
    open.style = `z-index:9999;height:35px;width:35px;background-color:#fff;position:fixed;border:1px solid rgba(0,0,0,0.2);border-radius:17.5px;right:${GM_getValue('position_right', '9px')};top:${GM_getValue('position_top', '9px')};text-align-last:center;color:#000000;display:flex;align-items:center;justify-content:center;cursor: pointer;font-size:15px;user-select:none;visibility: visible;`;
    open.innerHTML = p.createHTML("译");
    const renderCurrentRule = () => {
        // 触发启用规则重建
        current_details.style.display = "none";
        current_details.innerHTML = p.createHTML('');
        const currentRule = GetActiveRule();
        if (currentRule) {
            current_details.style.display = "flex";
            current_details.innerHTML = p.createHTML(`<summary>当前启用-${currentRule.name}</summary>`)
            for (const option of currentRule.options) {
                const fieldset = document.createElement("fieldset")
                fieldset.innerHTML = p.createHTML(fieldset.innerHTML+`<legend>${option.name}</legend>`)
                current_details.appendChild(fieldset);
                fieldset.innerHTML = p.createHTML(fieldset.innerHTML+`<div style="display:flex;align-items:center"><span>启用翻译</span><input type="checkbox"></input></div>`)
                for (const key in baseoptions) {
                    if (!baseoptions[key].option_enable) {
                        continue;
                    }
                    fieldset.innerHTML = p.createHTML(fieldset.innerHTML+`<span>${baseoptions[key].declare}</span><br>`)
                    const baseValueList = [["", "默认"], ["true", "启用"], ["false", "禁用"]]
                    fieldset.innerHTML = p.createHTML(fieldset.innerHTML+"<div>" + baseValueList.map(value => `<input type="radio" value="${value[0]}" name="${key}:${currentRule.name}-${option.name}">${value[1]}</input>`).join('') + "</div>")
                }
                // 补充值与事件
                const enableInput = fieldset.querySelector('input[type=checkbox]')
                const enableKey = `enable_option:${currentRule.name}-${option.name}`
                enableInput.checked = GM_getValue(enableKey, true);
                enableInput.onchange = () => {
                    title.innerText = "控制面板（请刷新以应用）";
                    GM_setValue(enableKey, enableInput.checked);
                }
                const optionInputs = fieldset.querySelectorAll("input[type=radio]")
                for (const input of optionInputs) {
                    const key = `option_setting:${input.name}`
                    if (GM_getValue(key, '').toString() === input.value) {
                        input.checked = true;
                    }
                    input.onchange = () => {
                        title.innerText = "控制面板（请刷新以应用）";
                        switch (input.value) {
                            case 'true':
                                GM_setValue(key, true);
                                break;
                            case 'false':
                                GM_setValue(key, false);
                                break;
                            case '':
                                GM_deleteValue(key);
                                break
                        }
                    }
                }
            }
        }
    }
    open.onclick = () => {
        renderCurrentRule();
        mask.style.display = 'flex';
    };
    open.draggable = true;
    open.addEventListener("dragstart", function (ev) { ev.stopImmediatePropagation(); this.tempNode = document.createElement('div'); this.tempNode.style = "width:1px;height:1px;opacity:0"; document.body.appendChild(this.tempNode); ev.dataTransfer.setDragImage(this.tempNode, 0, 0); this.oldX = ev.offsetX - Number(this.style.width.replace('px', '')); this.oldY = ev.offsetY });
    open.addEventListener("drag", function (ev) { ev.stopImmediatePropagation(); if (!ev.x && !ev.y) return; this.style.right = Math.max(window.innerWidth - ev.x + this.oldX, 0) + "px"; this.style.top = Math.max(ev.y - this.oldY, 0) + "px" });
    open.addEventListener("dragend", function (ev) { ev.stopImmediatePropagation(); GM_setValue("position_right", this.style.right); GM_setValue("position_top", this.style.top); document.body.removeChild(this.tempNode) });
    open.addEventListener("touchstart", ev => { ev.stopImmediatePropagation(); ev.preventDefault(); ev = ev.touches[0]; open._tempTouch = {}; const base = open.getClientRects()[0]; open._tempTouch.oldX = base.x + base.width - ev.clientX; open._tempTouch.oldY = base.y - ev.clientY });
    open.addEventListener("touchmove", ev => { ev.stopImmediatePropagation(); ev = ev.touches[0]; open.style.right = Math.max(window.innerWidth - open._tempTouch.oldX - ev.clientX, 0) + 'px'; open.style.top = Math.max(ev.clientY + open._tempTouch.oldY, 0) + 'px'; open._tempIsMove = true });
    open.addEventListener("touchend", ev => { ev.stopImmediatePropagation(); GM_setValue("position_right", open.style.right); GM_setValue("position_top", open.style.top); if (!open._tempIsMove) { renderCurrentRule(); mask.style.display = 'flex' }; open._tempIsMove = false })
    shadow.appendChild(open);
    shadow.querySelector('.js_translate option[value=' + choice + ']').selected = true;
    if (fullscrenn_hidden) window.top.document.addEventListener('fullscreenchange', () => { open.style.display = window.top.document.fullscreenElement ? "none" : "flex" });
}

const rules = [
    {
        name: '推特通用',
        matcher: /https:\/\/([a-zA-Z.]*?\.|)twitter\.com/,
        options: [
            {
                name: "推文",
                selector: baseSelector('div[dir="auto"][lang]'),
                textGetter: baseTextGetter,
                textSetter: options => {
                    options.element.style = options.element.style.cssText.replace(/-webkit-line-clamp.*?;/, '')
                    baseTextSetter(options).style.display = 'flex';
                }
            },
            {
                name: "背景信息",
                selector: baseSelector('div[data-testid=birdwatch-pivot]>div[dir=ltr]'),
                textGetter: baseTextGetter,
                textSetter: options => {
                    options.element.style = options.element.style.cssText.replace(/-webkit-line-clamp.*?;/, '')
                    baseTextSetter(options).style.display = 'flex';
                }
            }
        ]
    },
    {
        name: 'x通用',
        matcher: /https:\/\/([a-zA-Z.]*?.|)x\.com/,
        options: [
            {
                name: "推文",
                selector: baseSelector('div[dir="auto"][lang]'),
                textGetter: baseTextGetter,
                textSetter: options => {
                    options.element.style = options.element.style.cssText.replace(/-webkit-line-clamp.*?;/, '')
                    baseTextSetter(options).style.display = 'flex';
                }
            },
            {
                name: "背景信息",
                selector: baseSelector('div[data-testid=birdwatch-pivot]>div[dir=ltr]'),
                textGetter: baseTextGetter,
                textSetter: options => {
                    options.element.style = options.element.style.cssText.replace(/-webkit-line-clamp.*?;/, '')
                    baseTextSetter(options).style.display = 'flex';
                }
            }
        ]
    },
    {
        name: 'youtube pc通用',
        matcher: /https:\/\/www.youtube.com\/(watch|shorts|results\?)/,
        options: [
            {
                name: "评论区",
                selector: baseSelector("#content>#content-text"),
                textGetter: baseTextGetter,
                textSetter: options => {
                    baseTextSetter(options);
                    options.element.parentNode.parentNode.removeAttribute('collapsed');
                }
            },
            {
                name: "视频简介",
                selector: baseSelector("#content>#description>.content,.ytd-text-inline-expander>.yt-core-attributed-string"),
                textGetter: baseTextGetter,
                textSetter: options => {
                    baseTextSetter(options);
                    options.element.parentNode.parentNode.removeAttribute('collapsed');
                }
            },
            {
                name: "CC字幕",
                selector: baseSelector(".ytp-caption-segment"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter
            }
        ]
    },
    {
        name: 'youtube mobile通用',
        matcher: /https:\/\/m.youtube.com\/watch/,
        options: [
            {
                name: "评论区",
                selector: baseSelector(".comment-text.user-text"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: "视频简介",
                selector: baseSelector(".slim-video-metadata-description"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'youtube 短视频',
        matcher: /https:\/\/(www|m).youtube.com\/shorts/,
        options: [
            {
                name: "评论区",
                selector: baseSelector("#comment-content #content-text,.comment-content .comment-text"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'youtube 社区',
        matcher: /https:\/\/(www|m).youtube.com\/(.*?\/community|post)/,
        options: [
            {
                name: "评论区",
                selector: baseSelector("#post #content #content-text,#comment #content #content-text,#replies #content #content-text"),
                textGetter: baseTextGetter,
                textSetter: options => {
                    baseTextSetter(options);
                    options.element.parentNode.parentNode.removeAttribute('collapsed');
                }
            }
        ]
    },
    {
        name: 'facebook通用',
        matcher: /https:\/\/www.facebook.com\/.+/,
        options: [
            {
                name: "帖子内容",
                selector: baseSelector("div[data-ad-comet-preview=message],div[role=article] div[id]"),
                textGetter: baseTextGetter,
                textSetter: options => setTimeout(baseTextSetter, 0, options),
            },
            {
                name: "评论区",
                selector: baseSelector("div[role=article] div>span[dir=auto][lang]"),
                textGetter: baseTextGetter,
                textSetter: options => setTimeout(baseTextSetter, 0, options),
            }
        ]
    },
    {
        name: 'reddit通用',
        matcher: /https:\/\/www.reddit.com\/.*/,
        options: [
            {
                name: '帖子标题',
                selector: baseSelector("*[slot=title][id|=post-title]"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: '帖子内容',
                selector: baseSelector("div[slot=text-body]>div>div[id*=-post-rtjson-content]"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: '评论区',
                selector: baseSelector("div[slot=comment]>div[id$=-post-rtjson-content]"),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
            // a[data-click-id=body]:not([class=undefined]),.RichTextJSON-root
        ]
    },
    {
        name: '5ch评论',
        matcher: /http(|s):\/\/(.*?\.|)5ch.net\/.*/,
        options: [
            {
                name: "标题",
                selector: baseSelector('.post>.post-content,#threadtitle,.thread_title'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: "内容",
                selector: baseSelector('.threadview_response_body'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'discord聊天',
        matcher: /https:\/\/discord.com\/.+/,
        options: [
            {
                name: "聊天内容",
                selector: baseSelector('div[class*=messageContent]'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'telegram聊天新',
        matcher: /https:\/\/.*?.telegram.org\/(a|z)\//,
        options: [
            {
                name: "聊天内容",
                selector: baseSelector('p.text-content[dir=auto],div.text-content'),
                textGetter: e => Array.from(e.childNodes).filter(item => !item.className).map(item => item.nodeName === "BR" ? "\n" : item.textContent).join(''),
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'telegram聊天',
        matcher: /https:\/\/.*?.telegram.org\/.+/,
        options: [
            {
                name: "聊天内容",
                selector: baseSelector('div.message[dir=auto],div.im_message_text'),
                textGetter: e => Array.from(e.childNodes).filter(item => !item.className || item.className === 'translatable-message').map(item => item.nodeValue || item.innerText).join(" "),
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'quora通用',
        matcher: /https:\/\/www.quora.com/,
        options: [
            {
                name: "标题",
                selector: baseSelector(".puppeteer_test_question_title>span>span"),
                textGetter: baseTextGetter,
                textSetter: options => {
                    options.element.parentNode.parentNode.style = options.element.parentNode.parentNode.style.cssText.replace(/-webkit-line-clamp.*?;/, '')
                    baseTextSetter(options).style.display = 'flex';
                },
            },
            {
                name: "帖子内容",
                selector: baseSelector('div.q-text>span>span.q-box:has(p.q-text),div.q-box>div.q-box>div.q-text>span.q-box:has(p.q-text)'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'tiktok评论',
        matcher: /https:\/\/www.tiktok.com/,
        options: [
            {
                name: "评论区",
                selector: baseSelector('p[data-e2e|=comment-level]'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'instagram评论',
        matcher: /https:\/\/www.instagram.com/,
        options: [
            {
                name: "评论区",
                selector: baseSelector('li>div>div>div>div>span[dir=auto]'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'threads',
        matcher: /https:\/\/www.threads.net/,
        options: [
            {
                name: "帖子",
                selector: baseSelector('div[data-pressable-container=true][data-interactive-id]>div>div:last-child>div>div:has(span[dir=auto]):not(:has(div[role=button]))'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
    {
        name: 'github',
        matcher: /https:\/\/github.com\/.+\/.+\/\w+\/\d+/,
        options: [
            {
                name: "issues",
                selector: baseSelector(".edit-comment-hide > task-lists > table > tbody > tr > td > p",items=>items.filter(i=>{
                    const nodeNameList = [...new Set([...i.childNodes].map(i=>i.nodeName))];
                    return nodeNameList.length>1 || (nodeNameList.length == 1 && nodeNameList[0] == "#text")
                })),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: "discussions",
                selector: baseSelector(".edit-comment-hide > task-lists > table > tbody > tr > td > p",items=>items.filter(i=>{
                    const nodeNameList=[...new Set([...i.childNodes].map(i=>i.nodeName))];
                    return nodeNameList.length>1 || (nodeNameList.length == 1 && nodeNameList[0] == "#text")
                })),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
        ]
    },
    {
        name: 'bsky',
        matcher: /https:\/\/bsky.app/,
        options: [
            {
                name: "主页帖子",
                selector: baseSelector('div[dir=auto][data-testid=postText]'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            },
            {
                name: "内容帖子与回复",
                selector: baseSelector('div[data-testid^="postThreadItem-by"] div[dir=auto][data-word-wrap]'),
                textGetter: baseTextGetter,
                textSetter: baseTextSetter,
            }
        ]
    },
];

const GetActiveRule = () => rules.find(item => item.matcher.test(document.location.href) && GM_getValue('enable_rule:' + item.name, true));


(function () {
    'use strict';
    let url = document.location.href;
    let rule = GetActiveRule();
    setInterval(() => {
        if (document.location.href != url) {
            url = document.location.href;
            const ruleNew = GetActiveRule();
            if (ruleNew != rule) {
                if (ruleNew != null) {
                    console.log(`【翻译机】检测到URl变更，改为使用【${ruleNew.name}】规则`)
                } else {
                    console.log("【翻译机】检测到URl变更，当前无匹配规则")
                }
                rule = ruleNew;
            }
        }
    }, 200)
    console.log(rule ? `【翻译机】使用【${rule.name}】规则` : "【翻译机】当前无匹配规则");
    console.log(document.location.href)
    let main = _ => {
        if (!rule) return;
        const choice = GM_getValue('translate_choice', '谷歌翻译');
        for (const option of rule.options) {
            if (!GM_getValue("enable_option:" + rule.name + "-" + option.name, true)) {
                continue
            }
            const temp = [...new Set(option.selector())];
            for (let i = 0; i < temp.length; i++) {
                const now = temp[i];
                if (globalProcessingSave.includes(now)) continue;
                globalProcessingSave.push(now);
                const rawText = option.textGetter(now);
                const text = remove_url ? url_filter(rawText) : rawText;
                if (text.length == 0) continue;
                const setterParams = {
                    element: now,
                    translatorName: choice,
                    rawText: rawText,
                    rule: rule,
                    option: option
                }
                if (sessionStorage.getItem(choice + '-' + text)) {
                    setterParams.text = sessionStorage.getItem(choice + '-' + text)
                    option.textSetter(setterParams);
                    removeItem(globalProcessingSave, now)
                } else {
                    pass_lang(text).then(lang => transdict[choice](text, lang)).then(s => {
                        setterParams.text = s
                        option.textSetter(setterParams);
                        removeItem(globalProcessingSave, now);
                    })
                }
            }
        }
    };
    PromiseRetryWrap(startup[GM_getValue('translate_choice', '谷歌翻译')]).then(() => { document.js_translater = setInterval(main, 20) });
    if(!GM_getValue('show_translate_ball',true))return;
    initPanel();
})();

//--综合工具区--start

function removeItem(arr, item) {
    const index = arr.indexOf(item);
    if (index > -1) arr.splice(index, 1);
}

function baseSelector(selector,customFilter) {
    return () => {
        const items = document.querySelectorAll(selector);
        let filterResult = Array.from(items).filter(item => {
            const nodes = item.querySelectorAll('[data-translate]');
            return !item.dataset.translate && !(nodes && Array.from(nodes).some(node => node.parentNode === item));
        })
        if(customFilter){
            filterResult = customFilter(filterResult);
        }
        filterResult.map(item => item.dataset.translate = "processed");
        return filterResult;
    }
}

function baseTextGetter(e) {
    return e.innerText;
}

function baseTextSetter({ element, translatorName, text, rawText, rule, option }) {//change element text
    if ((text || "").length == 0) text = '翻译异常';
    const currentReplaceTranslate = GM_getValue("option_setting:replace_translate:" + rule.name + "-" + option.name, replace_translate)
    const currentShowInfo = GM_getValue("option_setting:show_info:" + rule.name + "-" + option.name, show_info)
    if (currentReplaceTranslate) {
        const spanNode = document.createElement('span');
        spanNode.style.whiteSpace = "pre-wrap";
        spanNode.innerText = `${currentShowInfo ? "-----------" + translatorName + "-----------\n\n" : ""}` + text;
        spanNode.dataset.translate = "processed";
        spanNode.title = rawText;
        spanNode.class = "translate-processed-node"
        element.innerHTML = p.createHTML('');
        element.appendChild(spanNode);
        element.style.cssText += "-webkit-line-clamp: unset;max-height: unset";
        return spanNode;
    } else {
        const spanNode = document.createElement('span');
        spanNode.style.whiteSpace = "pre-wrap";
        spanNode.innerText = `\n\n${currentShowInfo ? "-----------" + translatorName + "-----------\n\n" : ""}` + text;
        spanNode.dataset.translate = "processed";
        spanNode.class = "translate-processed-node"
        element.appendChild(spanNode);
        element.style.cssText += "-webkit-line-clamp: unset;max-height: unset";
        return spanNode;
    }

}

function url_filter(text) {
    return text.replace(/(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g, '');
}

async function pass_lang(raw) {//确认是否为中文，是则中断promise
    if (!enable_pass_lang && !enable_pass_lang_cht) return;
    try {
        const result = await check_lang(raw)
        if (enable_pass_lang && result == 'zh') return new Promise(() => { });
        if (enable_pass_lang_cht && (result == 'cht'|| result == 'zh-tw')) return new Promise(() => { });
        return result
    } catch (err) {
        console.log(err);
        return
    }
    return
}

async function check_lang(raw) {
    let t = Date.now();
    const options = {
        method: "POST",
        url: 'https://fanyi.baidu.com/langdetect',
        data: 'query=' + encodeURIComponent(raw.replace(/[\uD800-\uDBFF]$/, "").slice(0, 50)),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }
    const res = await Request(options);
    //console.log(`语言加载完毕，耗时${Date.now()-t}ms`)
    try {
        return JSON.parse(res.responseText).lan
    } catch (err) {
        console.log(err);
        return
    }
    // let t = Date.now();
    //const options = {
    //    method: "GET",
    //    url: 'https://translate.alibaba.com/trans/GetDetectLanguage.do?srcData='+encodeURIComponent(raw.replace(/[\uD800-\uDBFF]$/, "").slice(0, 50)),
    //}
    //const res = await Request(options);
    //console.log(options,res.responseText);
    //// console.log(`语言加载完毕，耗时${Date.now()-t}ms`)
    //try {
    //    return JSON.parse(res.responseText).renognize
    //} catch (err) {
    //    console.log(err);
    //    return
    //}
}


function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

//--综合工具区--end

//--谷歌翻译--start
async function translate_gg(raw) {
    const options = {
        method: "GET",
        url: `https://translate.google.com/translate_a/t?client=gtx&sl=auto&tl=zh-CN&q=` + encodeURIComponent(raw),
        anonymous: true,
        nocache: true,
    }
    return await BaseTranslate('谷歌翻译', raw, options, res => JSON.parse(res)[0][0])
}

//--谷歌翻译--end

//--谷歌翻译mobile--start
async function translate_ggm(raw) {
    const options = {
        method: "GET",
        url: "https://translate.google.com/m?tl=zh-CN&q=" + encodeURIComponent(raw),
        headers: {
            "Host": "translate.google.com",
        },
        anonymous: true,
        nocache: true,
    }
    return await BaseTranslate('谷歌翻译mobile', raw, options, res => /class="result-container">((?:.|\n)*?)<\/div/.exec(res)[1])
}
//--谷歌翻译mobile--end

//--百度翻译--start
async function translate_baidu(raw, lang) {
    if (!lang) {
        lang = await check_lang(raw)
    }
    const options = {
        method: "POST",
        url: 'https://fanyi.baidu.com/ait/text/translate',
        data: JSON.stringify({ query: raw, from: lang, to: "zh" }),
        headers: {
            "referer": 'https://fanyi.baidu.com',
            'Content-Type': 'application/json',
            'Origin': 'https://fanyi.baidu.com',
            'accept': 'text/event-stream',
        },
    }
    return await BaseTranslate('百度翻译', raw, options, res => res.split('\n').filter(item => item.startsWith('data: ')).map(item => JSON.parse(item.slice(6))).find(item => item.data.list).data.list.map(item => item.dst).join('\n'))
}

//--百度翻译--end

//--爱词霸翻译--start

async function translate_icib(raw) {
    const sign = CryptoJS.MD5("6key_web_fanyi" + "ifanyiweb8hc9s98e" + raw.replace(/(^\s*)|(\s*$)/g, "")).toString().substring(0, 16)
    const options = {
        method: "POST",
        url: `https://ifanyi.iciba.com/index.php?c=trans&m=fy&client=6&auth_user=key_web_fanyi&sign=${sign}`,
        data: 'from=auto&t=zh&q=' + encodeURIComponent(raw),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }
    return await BaseTranslate('爱词霸翻译', raw, options, res => JSON.parse(res).content.out)
}

//--爱词霸翻译--end


//--必应翻译--start

async function translate_biying(raw) {
    const options = {
        method: "POST",
        url: 'https://www.bing.com/ttranslatev3',
        data: 'fromLang=auto-detect&to=zh-Hans&text=' + encodeURIComponent(raw),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    }
    return await BaseTranslate('必应翻译', raw, options, res => JSON.parse(res)[0].translations[0].text)
}

//--必应翻译--end

//--有道翻译--start
async function translate_youdao_startup() {
    if (sessionStorage.getItem('youdao_key')) return;
    const ts = "" + (new Date).getTime();
    const params = {
        keyid: "webfanyi-key-getter",
        client: "fanyideskweb",
        product: "webfanyi",
        appVersion: "1.0.0",
        vendor: "web",
        pointParam: "client,mysticTime,product",
        mysticTime: ts,
        keyfrom: "fanyi.web",
        sign: CryptoJS.MD5(`client=fanyideskweb&mysticTime=${ts}&product=webfanyi&key=asdjnjfenknafdfsdfsd`)
    }
    const options = {
        method: "GET",
        url: `https://dict.youdao.com/webtranslate/key?${Object.entries(params).map(item => item.join('=')).join('&')}`,
        headers: {
            "Origin": "https://fanyi.youdao.com"
        }
    }
    const res = await Request(options);
    sessionStorage.setItem('youdao_key', JSON.parse(res.responseText).data.secretKey)
}

async function translate_youdao(raw) {
    const ts = "" + (new Date).getTime();
    const params = {
        i: encodeURIComponent(raw),
        from: 'auto',
        to: '',
        dictResult: 'true',
        keyid: "webfanyi",
        client: "fanyideskweb",
        product: "webfanyi",
        appVersion: "1.0.0",
        vendor: "web",
        pointParam: "client,mysticTime,product",
        mysticTime: ts,
        keyfrom: "fanyi.web",
        sign: CryptoJS.MD5(`client=fanyideskweb&mysticTime=${ts}&product=webfanyi&key=${sessionStorage.getItem('youdao_key')}`) + ''
    }
    const options = {
        method: "POST",
        url: 'https://dict.youdao.com/webtranslate',
        data: Object.entries(params).map(item => item.join('=')).join('&'),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "https://fanyi.youdao.com/",
            "Origin": "https://fanyi.youdao.com",
            "Host": "dict.youdao.com",
            "Cookie": "OUTFOX_SEARCH_USER_ID=0@0.0.0.0"
        },
        anonymous: true,
    }
    const res = await Request(options);
    const decrypted = A(res);
    return await BaseTranslate('有道翻译', raw, options, res => JSON.parse(A(res)).translateResult.map(e => e.map(t => t.tgt).join('')).join('\n'))
}

function m(e) {
    return CryptoJS.MD5(e).toString(CryptoJS.enc.Hex);
}

function A(t, o, n) {
    o = "ydsecret://query/key/BRGygVywfNBwpmBaZgWT7SIOUP2T0C9WHMZN39j^DAdaZhAnxvGcCY6VYFwnHl"
    n = "ydsecret://query/iv/C@lZe2YzHtZ2CYgaXKSVfsb7Y4QWHjITPPZ0nQp87fBeJ!Iv6v^6fvi2WN@bYpJ4"
    if (!t)
        return null;
    const a = CryptoJS.enc.Hex.parse(m(o)),
          r = CryptoJS.enc.Hex.parse(m(n)),
          i = CryptoJS.AES.decrypt(t, a, {
              iv: r
          });
    return i.toString(CryptoJS.enc.Utf8);
}

//--有道翻译--end

//--有道翻译m--start
async function translate_youdao_mobile(raw) {
    const options = {
        method: "POST",
        url: 'http://m.youdao.com/translate',
        data: "inputtext=" + encodeURIComponent(raw) + "&type=AUTO",
        anonymous: true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }
    return await BaseTranslate('有道翻译mobile', raw, options, res => /id="translateResult">\s*?<li>([\s\S]*?)<\/li>\s*?<\/ul/.exec(res)[1])
}
//--有道翻译m--end

//--腾讯翻译--start

async function translate_tencent_startup() {
    setTimeout(translate_tencent_startup, 10000)//token刷新
    const base_options = {
        method: 'GET',
        url: 'http://fanyi.qq.com',
        anonymous: true,
        headers: {
            "User-Agent": "test",
        }
    }
    const base_res = await Request(base_options)
    const uri = /reauthuri = "(.*?)"/.exec(base_res.responseText)[1]
    const options = {
        method: 'POST',
        url: 'https://fanyi.qq.com/api/' + uri
    }
    const res = await Request(options);
    const data = JSON.parse(res.responseText);
    sessionStorage.setItem('tencent_qtv', data.qtv)
    sessionStorage.setItem('tencent_qtk', data.qtk)
}


async function translate_tencent(raw) {
    const qtk = sessionStorage.getItem('tencent_qtk'), qtv = sessionStorage.getItem('tencent_qtv');
    const options = {
        method: 'POST',
        url: 'https://fanyi.qq.com/api/translate',
        data: `source=auto&target=zh&sourceText=${encodeURIComponent(raw)}&qtv=${encodeURIComponent(qtv)}&qtk=${encodeURIComponent(qtk)}&sessionUuid=translate_uuid${Date.now()}`,
        headers: {
            "Host": "fanyi.qq.com",
            "Origin": "https://fanyi.qq.com",
            "Content-Type": "application/x-www-form-urlencoded",
            "Referer": "https://fanyi.qq.com/",
            "X-Requested-With": "XMLHttpRequest",
        }
    }
    return await BaseTranslate('腾讯翻译', raw, options, res => JSON.parse(res).translate.records.map(e => e.targetText).join(''))
}

//--腾讯翻译--end

//--彩云翻译--start

async function translate_caiyun_startup() {
    if (sessionStorage.getItem('caiyun_id') && sessionStorage.getItem('caiyun_jwt')) return;
    const browser_id = CryptoJS.MD5(Math.random().toString()).toString();
    sessionStorage.setItem('caiyun_id', browser_id);
    const options = {
        method: "POST",
        url: 'https://api.interpreter.caiyunai.com/v1/user/jwt/generate',
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": "token:qgemv4jr1y38jyq6vhvi",
            "Origin": "https://fanyi.caiyunapp.com",
        },
        data: JSON.stringify({ browser_id }),
    }
    const res = await Request(options);
    sessionStorage.setItem('caiyun_jwt', JSON.parse(res.responseText).jwt);
}

async function translate_caiyun(raw) {
    const source = "NOPQRSTUVWXYZABCDEFGHIJKLMnopqrstuvwxyzabcdefghijklm";
    const dic = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"].reduce((dic, current, index) => { dic[current] = source[index]; return dic }, {});
    const decoder = line => Base64.decode([...line].map(i => dic[i] || i).join(""))
    const options = {
        method: "POST",
        url: 'https://api.interpreter.caiyunai.com/v1/translator',
        data: JSON.stringify({
            "source": raw.split('\n'),
            "trans_type": "auto2zh",
            "detect": true,
            "browser_id": sessionStorage.getItem('caiyun_id')
        }),
        headers: {
            "Content-Type": "application/json",
            "X-Authorization": "token:qgemv4jr1y38jyq6vhvi",
            "T-Authorization": sessionStorage.getItem('caiyun_jwt')
        }
    }
    return await BaseTranslate('彩云小译', raw, options, res => JSON.parse(res).target.map(decoder).join('\n'))
}

//--彩云翻译--end

//--papago翻译--start

async function translate_papago_startup() {
    if (sessionStorage.getItem('papago_key')) return;
    const base_options = {
        method: 'GET',
        url: 'https://papago.naver.com/',
        anonymous: true,
    }
    const base_res = await Request(base_options)
    const uri = /"\/(vendors~home\..*?.chunk.js)"/.exec(base_res.responseText)[1]
    const options = {
        method: 'GET',
        url: 'https://papago.naver.com/' + uri
    }
    const res = await Request(options);
    const key = /AUTH_KEY:"(.*?)"/.exec(res.responseText)[1];
    sessionStorage.setItem('papago_key', key);
}

async function translate_papago(raw) {
    const time = Date.now();
    const options = {
        method: 'POST',
        url: 'https://papago.naver.com/apis/n2mt/translate',
        data: `deviceId=${time}&source=auto&target=zh-CN&text=${encodeURIComponent(raw)}`,
        headers: {
            "authorization": 'PPG ' + time + ':' + CryptoJS.HmacMD5(time + '\nhttps://papago.naver.com/apis/n2mt/translate\n' + time, sessionStorage.getItem('papago_key')).toString(CryptoJS.enc.Base64),
            "x-apigw-partnerid": "papago",
            "device-type": 'pc',
            "timestamp": time,
            "Content-Type": "application/x-www-form-urlencoded",
        }
    }
    return await BaseTranslate('Papago', raw, options, res => JSON.parse(res).translatedText)
}

//--papago翻译--end

//--阿里翻译--start
async function translate_alibaba(raw) {
    const options = {
        method: 'POST',
        url: 'https://translate.alibaba.com/translationopenseviceapp/trans/TranslateTextAddAlignment.do',
        data: `srcLanguage=auto&tgtLanguage=zh&bizType=message&srcText=${encodeURIComponent(raw)}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "origin": "https://translate.alibaba.com",
            "referer": "https://translate.alibaba.com/",
            "sec-fetch-site": "same-origin",
        }
    }
    return await BaseTranslate('阿里翻译', raw, options, res => JSON.parse(res).listTargetText[0])
}
//--阿里翻译--end

//--Deepl翻译--start

function getTimeStamp(iCount) {
    const ts = Date.now();
    if (iCount !== 0) {
        iCount = iCount + 1;
        return ts - (ts % iCount) + iCount;
    } else {
        return ts;
    }
}

async function translate_deepl(raw) {
    const id = (Math.floor(Math.random() * 99999) + 100000) * 1000;
    const data = {
        jsonrpc: '2.0',
        method: 'LMT_handle_texts',
        id,
        params: {
            splitting: 'newlines',
            lang: {
                source_lang_user_selected: 'auto',
                target_lang: 'ZH',
            },
            texts: [{
                text: raw,
                requestAlternatives: 3
            }],
            timestamp: getTimeStamp(raw.split('i').length - 1)
        }
    }
    let postData = JSON.stringify(data);
    if ((id + 5) % 29 === 0 || (id + 3) % 13 === 0) {
        postData = postData.replace('"method":"', '"method" : "');
    } else {
        postData = postData.replace('"method":"', '"method": "');
    }
    const options = {
        method: 'POST',
        url: 'https://www2.deepl.com/jsonrpc',
        data: postData,
        headers: {
            'Content-Type': 'application/json',
            'Host': 'www.deepl.com',
            'Origin': 'https://www.deepl.com',
            'Referer': 'https://www.deepl.com/'
        },
        anonymous: true,
        nocache: true,
    }
    return await BaseTranslate('Deepl翻译', raw, options, res => JSON.parse(res).result.texts[0].text)
}

//--Deepl翻译--end

//--腾讯AI翻译--start
async function translate_tencentai(raw) {
    const data = {
        "header": {
            "fn": "auto_translation",
            "client_key": `browser-chrome-121.0.0-Windows_10-${guid()}-${Date.now()}`,
            "session": "",
            "user": ""
        },
        "type": "plain",
        "model_category": "normal",
        "text_domain": "",
        "source": {
            "lang": "auto",
            "text_list": [raw]
        },
        "target": {
            "lang": "zh"
        }
    }
    const options = {
        method: 'POST',
        url: 'https://transmart.qq.com/api/imt',
        data: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'Host': 'transmart.qq.com',
            'Origin': 'https://transmart.qq.com',
            'Referer': 'https://transmart.qq.com/'
        },
        anonymous: true,
        nocache: true,
    }
    return await BaseTranslate('腾讯AI翻译', raw, options, res => JSON.parse(res).auto_translation[0])
}
//--腾讯Ai翻译--end

//--异步请求包装工具--start

async function PromiseRetryWrap(task, options, ...values) {
    const { RetryTimes, ErrProcesser } = options || {};
    let retryTimes = RetryTimes || 5;
    const usedErrProcesser = ErrProcesser || (err => { throw err });
    if (!task) return;
    while (true) {
        try {
            return await task(...values);
        } catch (err) {
            if (!--retryTimes) {
                console.log(err);
                return usedErrProcesser(err);
            }
        }
    }
}

async function BaseTranslate(name, raw, options, processer) {
    const toDo = async () => {
        var tmp;
        try {
            const data = await Request(options);
            tmp = data.responseText;
            const result = await processer(tmp);
            if (result){
                setTimeout(()=>sessionStorage.setItem(name + '-' + raw, result),0);
            }
            return result
        } catch (err) {
            throw {
                responseText: tmp,
                err: err
            }
        }
    }
    return await PromiseRetryWrap(toDo, { RetryTimes: 3, ErrProcesser: () => "翻译出错" })
}

function Request(options) {
    return new Promise((reslove, reject) => GM_xmlhttpRequest({ ...options, onload: reslove, onerror: reject }))
}

//--异步请求包装工具--end

//--压缩存储--start

function CompressMergeSession(rawSession,compress) {
    const rawCache = rawSession.getItem('translate-merge-cache')
    const cache = JSON.parse(rawCache?(LZString.decompress(rawCache)||'{}'):'{}');
    window.addEventListener('storage',e=>{
        if(e && e.key && e.key.startsWith('translate-merge-cache-sync')){
            const key = e.newValue.slice(0,32);
            const value = e.newValue.slice(32);
            cache[key]=value;
        }
    })
    return {
        getItem: (key) => {
            return cache[CryptoJS.MD5(key).toString()] || "";
        },
        setItem: (key, value) => {
            const hashKey = CryptoJS.MD5(key).toString();
            cache[hashKey]=value;
            localStorage.setItem('translate-merge-cache-sync',hashKey+value);
            const rawSaveValue = JSON.stringify(cache);
            const saveValue = LZString.compress(rawSaveValue);
            // console.log(`压缩前:${rawSaveValue.length},压缩后:${saveValue.length},压缩率:${saveValue.length/rawSaveValue.length}`)
            rawSession.setItem('translate-merge-cache',saveValue)
        }
    }
}

//--压缩存储--end
